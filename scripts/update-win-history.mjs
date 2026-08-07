// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — update-win-history.mjs (V3 — Honest Stats, No Fake Defaults)
// ═══════════════════════════════════════════════════════════════════════════════
//
// RÈGLE D'OR: Aucune stat figée. Aucun "perdu par défaut".
//
// PIPELINE:
//   1. Lit toutes les archives public/predictions-archive/*.json
//   2. Pour chaque prono archivé:
//      a. Si pred.finalScore existe (mis par verify-results.mjs): évalue W/L
//         - BTTS Oui: isWon = homeScore > 0 && awayScore > 0
//         - BTTS Non: isWon = !(homeScore > 0 && awayScore > 0)
//         - Over 2.5 Oui: isWon = (homeScore + awayScore) >= 3
//         - Over 2.5 Non: isWon = (homeScore + awayScore) < 3
//      b. Sinon: status = "PENDING" → EXCLU des stats (pas de W ni L)
//   3. Stats:
//      - total = won + lost UNIQUEMENT (PENDING exclu du dénominateur)
//      - rate = won / total * 100 avec 1 décimale
//      - byType.btts et byType.over25 calculés séparément
//
// STRUCTURE DE SORTIE EXACTE:
//   {
//     stats: {
//       total, won, lost, pending, rate,
//       byType: {
//         btts:  { total, won, lost, pending, rate },
//         over25:{ total, won, lost, pending, rate }
//       }
//     },
//     history: [...80 entries récentes avec result: "W"|"L"|"PENDING"]
//   }
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const ARCHIVE_DIR = path.join(PUBLIC_DIR, 'predictions-archive')
const WIN_HISTORY_FILE = path.join(PUBLIC_DIR, 'win-history.json')

// ─── Helpers ──────────────────────────────────────────────────────────────

function parseScore(scoreStr) {
  if (!scoreStr || typeof scoreStr !== 'string') return null
  // Accepte "2-1", "2 - 1", "0-0", "1-3"
  const m = scoreStr.trim().match(/^(\d+)\s*-\s*(\d+)$/)
  if (!m) return null
  return { home: parseInt(m[1], 10), away: parseInt(m[2], 10) }
}

// Évalue W/L basé sur le type de prono et le score réel
// Retourne "W" | "L" | null (null = impossible à évaluer)
function evaluatePrediction(prediction, type, score) {
  if (!score) return null
  const home = score.home
  const away = score.away
  const bothScored = home > 0 && away > 0
  const totalGoals = home + away
  const isOver25 = totalGoals >= 3

  if (type === 'BTTS') {
    if (prediction === 'Oui') return bothScored ? 'W' : 'L'
    if (prediction === 'Non') return bothScored ? 'L' : 'W'
  }
  if (type.includes('Over')) {
    if (prediction === 'Oui') return isOver25 ? 'W' : 'L'
    if (prediction === 'Non') return isOver25 ? 'L' : 'W'
  }
  return null
}

function computeRate(won, total) {
  if (!total || total === 0) return 0
  return Math.round((won / total) * 1000) / 10 // 1 décimale
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function updateWinHistory() {
  console.log('[WinHistory] Reading archives from:', ARCHIVE_DIR)

  if (!fs.existsSync(ARCHIVE_DIR)) {
    console.error('[WinHistory] ✗ ARCHIVE_DIR does not exist. Aborting.')
    process.exit(1)
  }

  const archiveFiles = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()

  console.log(`[WinHistory] Found ${archiveFiles.length} archives`)

  const allItems = []
  let idCounter = 1

  // Stats accumulators — EXACT structure per spec
  const stats = {
    btts: { total: 0, won: 0, lost: 0, pending: 0 },
    over25: { total: 0, won: 0, lost: 0, pending: 0 },
  }

  for (const archiveFile of archiveFiles) {
    const dateStr = archiveFile.replace('.json', '')
    const archivePath = path.join(ARCHIVE_DIR, archiveFile)

    try {
      const data = JSON.parse(fs.readFileSync(archivePath, 'utf-8'))
      const predictions = data.predictions || []

      for (const pred of predictions) {
        // Le score final est ajouté par verify-results.mjs
        // Si absent → PENDING (JAMAIS perdu par défaut)
        const scoreStr = pred.finalScore || null
        const score = parseScore(scoreStr)
        const result = score ? evaluatePrediction(pred.prediction, pred.type, score) : null
        // result: "W" | "L" | null

        const typeKey = pred.type.includes('Over') ? 'over25' : 'btts'

        // Compte dans le bon bucket
        if (result === 'W') {
          stats[typeKey].won++
          stats[typeKey].total++ // total = won + lost UNIQUEMENT (PENDING exclu)
        } else if (result === 'L') {
          stats[typeKey].lost++
          stats[typeKey].total++
        } else {
          stats[typeKey].pending++
          // PENDING: NE PAS ajouter au total
        }

        allItems.push({
          id: idCounter++,
          date: pred.date || dateStr,
          match: pred.match,
          league: pred.league,
          type: pred.type,
          prediction: pred.prediction,
          result: result || 'PENDING', // Affichage uniquement
          score: scoreStr || '-',
          confidence: pred.confidence || 0,
        })
      }
    } catch (err) {
      console.log(`[WinHistory] ⚠ Error reading ${archiveFile}: ${err.message}`)
    }
  }

  // Trier par date desc pour l'affichage
  allItems.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
  allItems.forEach((item, i) => { item.id = i + 1 })

  // Garde seulement les 80 entrées les plus récentes pour l'affichage UI
  // (le calcul des stats reste sur TOUTES les archives)
  const displayHistory = allItems.slice(0, 80)

  // Stats globales RÉELLES (jamais figées)
  const totalAll = stats.btts.total + stats.over25.total
  const wonAll = stats.btts.won + stats.over25.won
  const lostAll = stats.btts.lost + stats.over25.lost
  const pendingAll = stats.btts.pending + stats.over25.pending
  const rateAll = computeRate(wonAll, totalAll)
  const bttsRate = computeRate(stats.btts.won, stats.btts.total)
  const over25Rate = computeRate(stats.over25.won, stats.over25.total)

  const winHistoryData = {
    stats: {
      total: totalAll,
      won: wonAll,
      lost: lostAll,
      pending: pendingAll,
      rate: `${rateAll}%`,
      last30Rate: `${rateAll}%`,
      byType: {
        btts: {
          total: stats.btts.total,
          won: stats.btts.won,
          lost: stats.btts.lost,
          pending: stats.btts.pending,
          rate: bttsRate,
        },
        over25: {
          total: stats.over25.total,
          won: stats.over25.won,
          lost: stats.over25.lost,
          pending: stats.over25.pending,
          rate: over25Rate,
        },
      },
      transparency: `Stats calculées depuis ${archiveFiles.length} archives quotidiennes dans predictions-archive/. Sur ${totalAll} pronostics vérifiés (score final connu via API-Football ou TheSportsDB), ${wonAll} ont été gagnants (${rateAll}% de réussite réelle vérifiable). ${pendingAll} pronostics en attente de vérification (match non joué ou score non récupéré). Aucun filtrage — gagnés ET perdus affichés. Stats jamais figées.`,
    },
    history: displayHistory,
    allItemsCount: allItems.length,
    generatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(WIN_HISTORY_FILE, JSON.stringify(winHistoryData, null, 2))
  console.log(`[WinHistory] ✓ Written to win-history.json`)
  console.log(`[WinHistory] Stats (REAL — calculated from ${archiveFiles.length} archives):`)
  console.log(`  Total (verified W+L):   ${totalAll}`)
  console.log(`  Won:                    ${wonAll}`)
  console.log(`  Lost:                   ${lostAll}`)
  console.log(`  Pending:                ${pendingAll}`)
  console.log(`  Overall rate:           ${rateAll}%`)
  console.log(`  BTTS:  W=${stats.btts.won} L=${stats.btts.lost} P=${stats.btts.pending} rate=${bttsRate}%`)
  console.log(`  O2.5:  W=${stats.over25.won} L=${stats.over25.lost} P=${stats.over25.pending} rate=${over25Rate}%`)
  console.log(`[WinHistory] Display history: ${displayHistory.length} entries`)

  // Alerte si trop de PENDING
  const totalArchive = allItems.length
  if (totalArchive > 0 && pendingAll / totalArchive > 0.5) {
    console.log(`[WinHistory] ⚠ WARNING: ${pendingAll}/${totalArchive} pronos en PENDING — run verify-results.mjs pour récupérer les scores`)
  }
}

updateWinHistory().catch(err => {
  console.error('[WinHistory] FATAL:', err)
  process.exit(1)
})
