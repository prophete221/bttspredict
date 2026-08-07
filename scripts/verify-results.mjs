// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict – Verify Results Script (V1)
// ═══════════════════════════════════════════════════════════════════════════════
//
// RÔLE: Récupère les scores finaux réels des matchs archivés et met à jour
// chaque prono avec finalScore + result (W/L). C'est ce script qui rend
// l'historique "public vérifiable" — sans lui, les archives restent en attente.
//
// PIPELINE:
//   1. Pour chaque archive predictions-archive/YYYY-MM-DD.json
//   2. Pour chaque prono dans cette archive sans finalScore
//   3. Récupère le scoreboard ESPN de la date du match
//   4. Cherche le match correspondant (homeTeam vs awayTeam)
//   5. Si STATUS_FINAL → ajoute finalScore + result + verifiedAt
//   6. Sauvegarde l'archive mise à jour
//   7. update-win-history.mjs (lancé ensuite) recalculera les stats globales
//
// SOURCE DE SCORES (priorité):
//   1. API-Football v3 (si API_FOOTBALL_KEY dans env) — précision maximale
//   2. ESPN scoreboard (public, sans clé) — fallback robuste
//
// STRATÉGIE DE MATCHING:
//   - Compare les noms d'équipes avec normalisation (lowercase, sans accents,
//     sans "FC", sans "CF")
//   - Tolérance de similarité ~70% (algorithme Jaccard sur tokens)
//
// CRON RECOMMANDÉ: 0 6 * * * (6h UTC tous les jours — après les matchs de la veille)
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

const DISPLAY_TZ = 'Europe/Paris'

function getTodayISO() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: DISPLAY_TZ })
}

function getYesterdayISO() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
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

const ESPN_LEAGUES = [
  'eng.1', 'eng.2', 'esp.1', 'esp.2', 'ger.1', 'ger.2',
  'ita.1', 'ita.2', 'fra.1', 'fra.2', 'ned.1', 'por.1',
  'tur.1', 'sco.1', 'bel.1', 'swi.1', 'aut.1', 'den.1',
  'nor.1', 'swe.1', 'fin.1', 'pol.1', 'gre.1', 'rus.1',
  'usa.1', 'mex.1', 'bra.1', 'arg.1', 'ned.2', 'eng.3',
  'uefa.champions', 'uefa.europa', 'uefa.europa.conf',
  'fifa.world', 'fifa.wq',
  'jpn.1', 'kor.1', 'chn.1', 'sau.1', 'aus.1',
  'caf.cl', 'caf.csf',
]

async function fetchEspnScoreboard(dateParam) {
  const results = [] // [{ homeTeam, awayTeam, score, status }]
  for (const slug of ESPN_LEAGUES) {
    try {
      const res = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?dates=${dateParam}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTTSPredict/1.0)' },
          signal: AbortSignal.timeout(8000),
        }
      )
      if (!res.ok) continue
      const data = await res.json()
      for (const event of data.events || []) {
        const comp = event.competitions?.[0]
        if (!comp) continue
        const statusType = comp.status?.type?.name
        if (statusType !== 'STATUS_FINAL') continue
        const homeComp = comp.competitors?.find(c => c.homeAway === 'home')
        const awayComp = comp.competitors?.find(c => c.homeAway === 'away')
        if (!homeComp || !awayComp) continue
        const homeTeam = homeComp.team?.displayName || homeComp.team?.shortDisplayName || ''
        const awayTeam = awayComp.team?.displayName || awayComp.team?.shortDisplayName || ''
        const homeScore = homeComp.score
        const awayScore = awayComp.score
        if (homeScore == null || awayScore == null) continue
        results.push({
          homeTeam,
          awayTeam,
          score: `${homeScore}-${awayScore}`,
          status: 'final',
          league: data.leagues?.[0]?.name || slug,
        })
      }
    } catch (err) {
      // Ignore — on continue avec les autres slugs
    }
  }
  return results
}

async function fetchApiFootballScores(dateParam) {
  if (!API_FOOTBALL_KEY) return []
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
    if (!res.ok) return []
    const data = await res.json()
    for (const fixture of data.response || []) {
      const status = fixture.fixture?.status?.short
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
        status: 'final',
        league: fixture.league?.name || '',
      })
    }
  } catch (err) {
    console.log(`[VerifyResults] API-Football error for ${dateParam}: ${err.message}`)
  }
  return results
}

async function fetchScoresForDate(dateParam) {
  console.log(`[VerifyResults] Fetching scores for ${dateParam}...`)
  // API-Football en priorité si clé dispo
  let scores = []
  if (API_FOOTBALL_KEY) {
    scores = await fetchApiFootballScores(dateParam)
    console.log(`[VerifyResults]   API-Football: ${scores.length} matches`)
  }
  // ESPN en complément (toujours — couvre des ligues différentes)
  const espnScores = await fetchEspnScoreboard(dateParam)
  console.log(`[VerifyResults]   ESPN: ${espnScores.length} matches`)
  // Merge (dédup par normalized home+away)
  const seen = new Set()
  const merged = []
  for (const s of [...scores, ...espnScores]) {
    const key = `${normalizeTeamName(s.homeTeam)}|${normalizeTeamName(s.awayTeam)}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(s)
  }
  return merged
}

// ─── Matching ─────────────────────────────────────────────────────────────

function findMatchScore(prediction, scores) {
  const predHomeTokens = tokenize(prediction.match.split(/\s+vs?\s+/i)[0] || '')
  const predAwayTokens = tokenize(prediction.match.split(/\s+vs?\s+/i)[1] || '')
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

// ─── Évaluation du résultat ───────────────────────────────────────────────

function evaluatePrediction(prediction, type, scoreStr) {
  const m = scoreStr.match(/^(\d+)-(\d+)$/)
  if (!m) return null
  const home = parseInt(m[1], 10)
  const away = parseInt(m[2], 10)
  if (type === 'BTTS') {
    const bothScored = home > 0 && away > 0
    if (prediction === 'Oui') return bothScored ? 'Gagné' : 'Perdu'
    if (prediction === 'Non') return bothScored ? 'Perdu' : 'Gagné'
  } else if (type.includes('Over')) {
    const total = home + away
    const isOver = total > 2.5
    if (prediction === 'Oui') return isOver ? 'Gagné' : 'Perdu'
    if (prediction === 'Non') return isOver ? 'Perdu' : 'Gagné'
  }
  return null
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function verifyResults() {
  const today = getTodayISO()
  const yesterday = getYesterdayISO()
  console.log(`[VerifyResults] Running for ${today} (will verify matches up to ${yesterday})`)

  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.error(`[VerifyResults] ✗ ARCHIVE_DIR does not exist: ${ARCHIVE_DIR}`)
    process.exit(1)
  }

  // Cache des scores par date (évite refetch pour la même date)
  const scoresByDate = new Map()

  async function getScoresForDate(dateStr) {
    if (scoresByDate.has(dateStr)) return scoresByDate.get(dateStr)
    const scores = await fetchScoresForDate(dateStr)
    scoresByDate.set(dateStr, scores)
    return scores
  }

  // Traitement: on se concentre sur les archives des 7 derniers jours
  // (les plus anciennes sont normalement déjà vérifiées)
  const datesToProcess = []
  for (let i = 1; i <= 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    datesToProcess.push(d.toLocaleDateString('sv-SE', { timeZone: DISPLAY_TZ }))
  }

  let totalVerified = 0
  let totalSkipped = 0
  let totalNotFound = 0

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

    // Date des matchs (peut être différente de la date d'archive pour les matchs décalés)
    // On regroupe par match.date
    const predictionsByMatchDate = new Map()
    for (const pred of predictions) {
      if (pred.finalScore) {
        totalSkipped++
        continue // déjà vérifié
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
        const matchScore = findMatchScore(pred, scores)
        if (matchScore) {
          pred.finalScore = matchScore.score
          pred.result = evaluatePrediction(pred.prediction, pred.type, matchScore.score)
          pred.verifiedAt = new Date().toISOString()
          pred.verifiedSource = API_FOOTBALL_KEY ? 'api-football+espn' : 'espn'
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
  console.log(`[VerifyResults]   Verified: ${totalVerified}`)
  console.log(`[VerifyResults]   Skipped (already verified): ${totalSkipped}`)
  console.log(`[VerifyResults]   Not found in ESPN/API-Football: ${totalNotFound}`)
  if (totalNotFound > totalVerified * 0.5 && totalVerified > 0) {
    console.log(`[VerifyResults] ⚠ WARNING: ${totalNotFound} pronos sans match trouvé — vérifier la qualité du matching`)
  }
  if (totalVerified === 0 && totalSkipped === 0) {
    console.log(`[VerifyResults] ⚠ Rien à vérifier — peut-être que les matchs ne sont pas encore joués`)
  }
}

verifyResults().catch(err => {
  console.error('[VerifyResults] FATAL:', err)
  process.exit(1)
})
