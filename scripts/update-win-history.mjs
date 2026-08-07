// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict – Win History Update Script (V2 — Real Stats, No Hardcoding)
// ═══════════════════════════════════════════════════════════════════════════════
//
// RÈGLE D'OR: Aucune stat figée. Tout est calculé depuis predictions-archive/.
//
// Pipeline:
//   1. Lit toutes les archives public/predictions-archive/*.json
//   2. Pour chaque prono archivé: détermine W/L basé sur:
//      a. Si score final connu dans l'archive → utilise ce score
//      b. Sinon → marqué 'En attente' (n'entre pas dans le taux)
//   3. Calcule stats globales + byType (BTTS / Over 2.5) réelles
//   4. Génère win-history.json avec:
//      - stats: { total, won, lost, pending, rate, byType }
//      - history: ~80 entrées récentes (triées par date desc)
//
// ⚠️ Si verify-results.mjs a déjà tourné, les archives contiennent `finalScore`
//    et `result`. Sinon, ce script ne fait que préparer la structure — le taux
//    réel sera calculé après passage de verify-results.
//
// Compatible avec: ESPN scoreboard (public, no key) — fallback si pas d'API-FB.
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

// Détermine si BTTS Oui/Non a gagné à partir du score réel
function evaluateBTTS(prediction, score) {
  if (!score) return null
  const bothScored = score.home > 0 && score.away > 0
  if (prediction === 'Oui') return bothScored ? 'Gagné' : 'Perdu'
  if (prediction === 'Non') return bothScored ? 'Perdu' : 'Gagné'
  return null
}

// Détermine si Over 2.5 Oui/Non a gagné à partir du score réel
function evaluateOver25(prediction, score) {
  if (!score) return null
  const total = score.home + score.away
  const isOver = total > 2.5
  if (prediction === 'Oui') return isOver ? 'Gagné' : 'Perdu'
  if (prediction === 'Non') return isOver ? 'Perdu' : 'Gagné'
  return null
}

function evaluatePrediction(prediction, type, score) {
  if (!score) return null
  if (type === 'BTTS') return evaluateBTTS(prediction, score)
  if (type.includes('Over')) return evaluateOver25(prediction, score)
  return null
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
    .sort() // Date asc — le plus ancien d'abord

  console.log(`[WinHistory] Found ${archiveFiles.length} archives`)

  const allItems = []
  let idCounter = 1

  // Stats accumulators
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
        // Champ possible: pred.finalScore (string "2-1") ou pred.score
        const scoreStr = pred.finalScore || pred.score || null
        const score = parseScore(scoreStr)

        let result = null
        if (score) {
          result = evaluatePrediction(pred.prediction, pred.type, score)
        }

        const typeKey = pred.type.includes('Over') ? 'over25' : 'btts'
        stats[typeKey].total++
        if (result === 'Gagné') stats[typeKey].won++
        else if (result === 'Perdu') stats[typeKey].lost++
        else stats[typeKey].pending++

        allItems.push({
          id: idCounter++,
          date: pred.date || dateStr,
          match: pred.match,
          league: pred.league,
          type: pred.type,
          prediction: pred.prediction,
          result: result || 'En attente',
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

  // Stats globales réelles (calculées, jamais figées)
  const totalAll = stats.btts.total + stats.over25.total
  const wonAll = stats.btts.won + stats.over25.won
  const lostAll = stats.btts.lost + stats.over25.lost
  const pendingAll = stats.btts.pending + stats.over25.pending
  const verifiedAll = wonAll + lostAll
  const rateAll = verifiedAll > 0 ? Math.round((wonAll / verifiedAll) * 1000) / 10 : 0

  const bttsVerified = stats.btts.won + stats.btts.lost
  const bttsRate = bttsVerified > 0 ? Math.round((stats.btts.won / bttsVerified) * 1000) / 10 : 0
  const over25Verified = stats.over25.won + stats.over25.lost
  const over25Rate = over25Verified > 0 ? Math.round((stats.over25.won / over25Verified) * 1000) / 10 : 0

  const winHistoryData = {
    stats: {
      total: totalAll,
      verified: verifiedAll,
      won: wonAll,
      lost: lostAll,
      pending: pendingAll,
      rate: `${rateAll}%`,
      last30Rate: `${rateAll}%`,
      byType: {
        BTTS: {
          total: stats.btts.total,
          verified: bttsVerified,
          won: stats.btts.won,
          lost: stats.btts.lost,
          pending: stats.btts.pending,
          rate: bttsRate,
        },
        'O2.5': {
          total: stats.over25.total,
          verified: over25Verified,
          won: stats.over25.won,
          lost: stats.over25.lost,
          pending: stats.over25.pending,
          rate: over25Rate,
        },
      },
      transparency: `Stats calculées depuis ${archiveFiles.length} archives quotidiennes dans predictions-archive/. Sur ${verifiedAll} pronostics vérifiés (avec score final connu), ${wonAll} ont été gagnants (${rateAll}% de réussite réelle vérifiable). ${pendingAll} pronostics en attente de vérification (match non encore joué ou score non récupéré). Aucun filtrage — gagnés ET perdus affichés.`,
    },
    history: displayHistory,
    allItemsCount: allItems.length,
    generatedAt: new Date().toISOString(),
  }

  fs.writeFileSync(WIN_HISTORY_FILE, JSON.stringify(winHistoryData, null, 2))
  console.log(`[WinHistory] ✓ Written to win-history.json`)
  console.log(`[WinHistory] Stats (REAL — calculated from ${archiveFiles.length} archives):`)
  console.log(`  Total pronos:        ${totalAll}`)
  console.log(`  Verified (W+L):      ${verifiedAll}`)
  console.log(`  Won:                 ${wonAll}`)
  console.log(`  Lost:                ${lostAll}`)
  console.log(`  Pending (no score):  ${pendingAll}`)
  console.log(`  Overall rate:        ${rateAll}%`)
  console.log(`  BTTS:  ${stats.btts.won}/${bttsVerified} verified (${bttsRate}%) — ${stats.btts.pending} pending`)
  console.log(`  O2.5:  ${stats.over25.won}/${over25Verified} verified (${over25Rate}%) — ${stats.over25.pending} pending`)
  console.log(`[WinHistory] Display history: ${displayHistory.length} entries`)
  if (pendingAll > verifiedAll * 0.5) {
    console.log(`[WinHistory] ⚠ WARNING: ${pendingAll} pronos sans score — run verify-results.mjs pour récupérer les scores`)
  }
}

updateWinHistory().catch(err => {
  console.error('[WinHistory] FATAL:', err)
  process.exit(1)
})
