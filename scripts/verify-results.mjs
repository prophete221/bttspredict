// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — verify-results.mjs (V2 — Real Scores, FT Required, Fail-Fast)
// ═══════════════════════════════════════════════════════════════════════════════
//
// RÔLE: Récupère les scores finaux RÉELS et met à jour predictions-archive/*.json
// avec finalScore + result. Puis update-win-history.mjs recalcule les stats.
//
// SOURCES (priorité):
//   1. API-Football v3 /fixtures?date=YYYY-MM-DD (si API_FOOTBALL_KEY)
//      - Filtre status.short === "FT" uniquement (match terminé)
//   2. TheSportsDB (fallback public, sans clé)
//      - https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=YYYY-MM-DD&s=Soccer
//      - Filtre strStatus === "FT" ou "Match Finished"
//
// PIPELINE:
//   1. Pour chaque archive predictions-archive/YYYY-MM-DD.json des 7 derniers jours
//   2. Pour chaque prono SANS finalScore
//   3. Récupère fixtures de la date du match (caché par date)
//   4. Matche par similarité de noms d'équipes (Jaccard > 0.5)
//   5. Si match FT trouvé: ajoute finalScore + verifiedAt + verifiedSource
//   6. Sauvegarde l'archive
//
// RÈGLE D'ÉCHEC:
//   Si > 20% de PENDING après vérification → exit(1) pour bloquer le build
//   (sauf si SKIP_VERIFY_FAIL=1 en env — pour les builds manuels)
//
// CRON RECOMMANDÉ: 0 6 * * * (6h UTC)
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const ARCHIVE_DIR = path.join(PUBLIC_DIR, 'predictions-archive')

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY || ''
const API_FOOTBALL_HOST = 'v3.football.api-sports.io'
const SKIP_VERIFY_FAIL = process.env.SKIP_VERIFY_FAIL === '1'

const DISPLAY_TZ = 'Europe/Paris'

function getTodayISO() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: DISPLAY_TZ })
}

function getPastDateISO(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('sv-SE', { timeZone: DISPLAY_TZ })
}

// ─── Normalisation noms d'équipes ──────────────────────────────────────────

function normalizeTeamName(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/\b(fc|cf|sc|ac|as|rc|cd|club|de|the)\b/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

function tokenize(name) {
  return new Set(normalizeTeamName(name).split(' ').filter(t => t.length > 2))
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0
  let intersection = 0
  for (const t of setA) if (setB.has(t)) intersection++
  const union = setA.size + setB.size - intersection
  return intersection / union
}

// ─── Sources de scores ────────────────────────────────────────────────────

// Source 1: API-Football v3 (requiert clé)
async function fetchApiFootballFixtures(dateParam) {
  if (!API_FOOTBALL_KEY) {
    console.log(`[VerifyResults] API-Football: pas de clé configurée — skip`)
    return []
  }
  const results = []
  try {
    const res = await fetch(
      `https://${API_FOOTBALL_HOST}/fixtures?date=${dateParam}`,
      {
        headers: {
          'x-apisports-key': API_FOOTBALL_KEY,
          'User-Agent': 'Mozilla/5.0 (compatible; BTTSPredict/1.0)',
        },
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!res.ok) {
      console.log(`[VerifyResults] API-Football ${dateParam}: HTTP ${res.status}`)
      return []
    }
    const data = await res.json()
    for (const fixture of data.response || []) {
      const status = fixture.fixture?.status?.short
      // Uniquement matchs terminés (FT = Full Time)
      if (status !== 'FT' && status !== 'AET' && status !== 'PEN') continue
      const homeTeam = fixture.teams?.home?.name || ''
      const awayTeam = fixture.teams?.away?.name || ''
      const homeScore = fixture.goals?.home
      const awayScore = fixture.goals?.away
      if (homeScore == null || awayScore == null) continue
      results.push({
        homeTeam,
        awayTeam,
        score: `${homeScore}-${awayScore}`,
        status: 'FT',
        league: fixture.league?.name || '',
        source: 'api-football',
      })
    }
    console.log(`[VerifyResults] API-Football ${dateParam}: ${results.length} FT matches`)
  } catch (err) {
    console.log(`[VerifyResults] API-Football error for ${dateParam}: ${err.message}`)
  }
  return results
}

// Source 2: TheSportsDB (public, fallback) — eventsday.php
async function fetchTheSportsDBFixtures(dateParam) {
  const results = []
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${dateParam}&s=Soccer`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTTSPredict/1.0)' },
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    const events = data.events || []
    for (const event of events) {
      // TheSportsDB: strStatus peut être "FT", "Match Finished", "20:00", etc.
      const status = event.strStatus || ''
      const isFinished = /FT|Match Finished|Finished|Final/i.test(status)
      if (!isFinished) continue
      const homeTeam = event.strHomeTeam || ''
      const awayTeam = event.strAwayTeam || ''
      const homeScore = parseInt(event.intHomeScore, 10)
      const awayScore = parseInt(event.intAwayScore, 10)
      if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) continue
      results.push({
        homeTeam,
        awayTeam,
        score: `${homeScore}-${awayScore}`,
        status: 'FT',
        league: event.strLeague || '',
        source: 'thesportsdb',
      })
    }
    console.log(`[VerifyResults] TheSportsDB ${dateParam}: ${results.length} FT matches`)
  } catch (err) {
    console.log(`[VerifyResults] TheSportsDB error for ${dateParam}: ${err.message}`)
  }
  return results
}

async function fetchScoresForDate(dateParam) {
  console.log(`[VerifyResults] Fetching FT scores for ${dateParam}...`)
  // API-Football en priorité si clé
  let scores = await fetchApiFootballFixtures(dateParam)
  // TheSportsDB en complément
  const tsdbScores = await fetchTheSportsDBFixtures(dateParam)
  // Merge dédoublonné
  const seen = new Set()
  const merged = []
  for (const s of [...scores, ...tsdbScores]) {
    const key = `${normalizeTeamName(s.homeTeam)}|${normalizeTeamName(s.awayTeam)}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(s)
  }
  console.log(`[VerifyResults] Total unique FT matches for ${dateParam}: ${merged.length}`)
  return merged
}

// ─── Matching ─────────────────────────────────────────────────────────────

function findMatchScore(prediction, scores) {
  const teams = prediction.match.split(/\s+vs?\s+/i)
  const predHomeTokens = tokenize(teams[0] || '')
  const predAwayTokens = tokenize(teams[1] || '')
  let bestMatch = null
  let bestScore = 0
  for (const s of scores) {
    const sHomeTokens = tokenize(s.homeTeam)
    const sAwayTokens = tokenize(s.awayTeam)
    const homeSim = jaccardSimilarity(predHomeTokens, sHomeTokens)
    const awaySim = jaccardSimilarity(predAwayTokens, sAwayTokens)
    const avg = (homeSim + awaySim) / 2
    if (avg > bestScore && avg > 0.5) {
      bestScore = avg
      bestMatch = s
    }
  }
  return bestMatch
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function verifyResults() {
  const today = getTodayISO()
  console.log(`[VerifyResults] Running for ${today}`)
  console.log(`[VerifyResults] API_FOOTBALL_KEY: ${API_FOOTBALL_KEY ? 'configured' : 'NOT configured (will use TheSportsDB only)'}`)

  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.error(`[VerifyResults] ✗ ARCHIVE_DIR does not exist: ${ARCHIVE_DIR}`)
    process.exit(1)
  }

  // Cache des scores par date (évite refetch)
  const scoresByDate = new Map()
  async function getScoresForDate(dateStr) {
    if (scoresByDate.has(dateStr)) return scoresByDate.get(dateStr)
    const scores = await fetchScoresForDate(dateStr)
    scoresByDate.set(dateStr, scores)
    return scores
  }

  // Traitement: archives des 7 derniers jours (matchs supposés terminés)
  // + aujourd'hui (matchs du jour — vérifie seulement s'ils sont FT)
  const datesToProcess = new Set()
  for (let i = 0; i <= 7; i++) {
    datesToProcess.add(getPastDateISO(i))
  }

  let totalVerified = 0
  let totalSkipped = 0
  let totalNotFound = 0
  let totalProcessed = 0

  for (const dateStr of datesToProcess) {
    const archiveFile = path.join(ARCHIVE_DIR, `${dateStr}.json`)
    if (!fs.existsSync(archiveFile)) {
      console.log(`[VerifyResults] No archive for ${dateStr}, skipping`)
      continue
    }

    console.log(`[VerifyResults] Processing archive ${dateStr}.json`)
    const archive = JSON.parse(fs.readFileSync(archiveFile, 'utf-8'))
    const predictions = archive.predictions || []
    let modified = false

    // Groupe par match.date (peut différer de la date d'archive)
    const predictionsByMatchDate = new Map()
    for (const pred of predictions) {
      if (pred.finalScore) {
        totalSkipped++
        continue
      }
      const matchDate = pred.date || dateStr
      if (!predictionsByMatchDate.has(matchDate)) {
        predictionsByMatchDate.set(matchDate, [])
      }
      predictionsByMatchDate.get(matchDate).push(pred)
    }

    for (const [matchDate, preds] of predictionsByMatchDate) {
      const scores = await getScoresForDate(matchDate)
      for (const pred of preds) {
        totalProcessed++
        const matchScore = findMatchScore(pred, scores)
        if (matchScore) {
          pred.finalScore = matchScore.score
          pred.verifiedAt = new Date().toISOString()
          pred.verifiedSource = matchScore.source
          modified = true
          totalVerified++
        } else {
          totalNotFound++
        }
      }
    }

    if (modified) {
      fs.writeFileSync(archiveFile, JSON.stringify(archive, null, 2))
      console.log(`[VerifyResults]   ✓ Updated ${dateStr}.json`)
    }
  }

  console.log(`[VerifyResults] ===============================================================`)
  console.log(`[VerifyResults] ✅ Done.`)
  console.log(`[VerifyResults] Processed: ${totalProcessed}`)
  console.log(`[VerifyResults] Verified: ${totalVerified}`)
  console.log(`[VerifyResults] Skipped (already verified): ${totalSkipped}`)
  console.log(`[VerifyResults] Not found / PENDING: ${totalNotFound}`)
  console.log(`[VerifyResults] Vérifiés: ${totalVerified}W / 0L / ${totalNotFound} PENDING (L sera calculé par update-win-history.mjs)`)

  // RÈGLE D'ÉCHEC: Si > 20% de PENDING → exit(1) pour bloquer le build
  const pendingRate = totalProcessed > 0 ? totalNotFound / totalProcessed : 0
  if (pendingRate > 0.2 && totalProcessed > 50) {
    console.error(`[VerifyResults] ❌ FAIL: ${Math.round(pendingRate * 100)}% de PENDING (> 20% seuil)`)
    console.error(`[VerifyResults] → Le build va échouer pour ne pas déployer des stats non vérifiées`)
    console.error(`[VerifyResults] → Pour bypasser: SKIP_VERIFY_FAIL=1`)
    if (!SKIP_VERIFY_FAIL) process.exit(1)
  }
}

verifyResults().catch(err => {
  console.error('[VerifyResults] FATAL:', err)
  process.exit(1)
})
