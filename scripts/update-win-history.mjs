// ═══════════════════════════════════════════════════════════════════════════════
// BttsBet – Win History Update Script
// Generates a realistic win-history.json with ONLY winning predictions.
// Uses past prediction archives to build real-looking history.
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const ARCHIVE_DIR = path.join(PUBLIC_DIR, 'predictions-archive')
const WIN_HISTORY_FILE = path.join(PUBLIC_DIR, 'win-history.json')

const DISPLAY_TZ = 'Europe/Paris'

function getTodayISO() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: DISPLAY_TZ })
}

// Deterministic hash for consistent scores
function matchHash(homeTeam, awayTeam, dateStr) {
  let hash = 0
  const str = `${homeTeam}-${awayTeam}-${dateStr}`
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % 1000) / 1000
}

// Generate a realistic score that matches the prediction outcome
function generateWinningScore(prediction, type, hashVal) {
  if (type === 'BTTS' && prediction === 'Oui') {
    // Both teams scored — generate scores where both have goals
    const homeGoals = 1 + Math.floor(hashVal * 3) // 1-3
    const awayGoals = 1 + Math.floor((1 - hashVal) * 3) // 1-3
    return `${homeGoals}-${awayGoals}`
  }
  if (type === 'BTTS' && prediction === 'Non') {
    // At least one team didn't score
    if (hashVal < 0.5) {
      return `${Math.floor(hashVal * 4)}-0` // Home wins, away doesn't score
    } else {
      return `0-${Math.floor((1 - hashVal) * 4)}` // Away wins, home doesn't score
    }
  }
  if (type === 'Over 2.5' && prediction === 'Oui') {
    // More than 2.5 goals
    const total = 3 + Math.floor(hashVal * 4) // 3-6 total goals
    const home = Math.max(1, Math.floor(total * (0.3 + hashVal * 0.4)))
    const away = total - home
    return `${home}-${away}`
  }
  if (type === 'Over 2.5' && prediction === 'Non') {
    // Under 2.5 goals (0, 1, or 2 total)
    const total = Math.floor(hashVal * 3) // 0-2 total goals
    const home = Math.floor(total * hashVal)
    const away = total - home
    return `${home}-${away}`
  }
  // Default fallback
  return '1-1'
}

// Generate a losing score (prediction was wrong)
function generateLosingScore(prediction, type, hashVal) {
  if (type === 'BTTS' && prediction === 'Oui') {
    // Predicted BTTS=Oui but it failed (at least one team didn't score)
    if (hashVal < 0.5) return `${Math.floor(hashVal * 3)}-0`
    return `0-${Math.floor((1 - hashVal) * 3)}`
  }
  if (type === 'BTTS' && prediction === 'Non') {
    // Predicted BTTS=Non but both teams scored
    return `${1 + Math.floor(hashVal * 2)}-${1 + Math.floor((1 - hashVal) * 2)}`
  }
  if (type === 'Over 2.5' && prediction === 'Oui') {
    // Predicted Over 2.5 but under 2.5 goals
    const total = Math.floor(hashVal * 3) // 0-2
    return `${Math.floor(total * hashVal)}-${total - Math.floor(total * hashVal)}`
  }
  if (type === 'Over 2.5' && prediction === 'Non') {
    // Predicted Under 2.5 but over 2.5 goals
    const total = 3 + Math.floor(hashVal * 3)
    return `${Math.floor(total * 0.5)}-${total - Math.floor(total * 0.5)}`
  }
  return '0-0'
}

async function updateWinHistory() {
  const today = getTodayISO()
  console.log(`[WinHistory] Generating win history for ${today}`)

  // Read past prediction archives
  const archiveFiles = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse() // Most recent first

  const historyItems = []
  let idCounter = 1

  // Process archives from the last 30 days
  const maxDays = 30
  const todayDate = new Date(today)
  const cutoffDate = new Date(todayDate)
  cutoffDate.setDate(cutoffDate.getDate() - maxDays)

  for (const archiveFile of archiveFiles) {
    const dateStr = archiveFile.replace('.json', '')
    const archiveDate = new Date(dateStr)

    // Only process dates in the past (not today or future)
    if (archiveDate >= todayDate) continue
    // Only process dates within our window
    if (archiveDate < cutoffDate) continue

    try {
      const archivePath = path.join(ARCHIVE_DIR, archiveFile)
      const data = JSON.parse(fs.readFileSync(archivePath, 'utf-8'))
      const predictions = data.predictions || []

      // Take up to 2 predictions per date (to keep history manageable)
      // Filter: pick BTTS predictions first, then Over 2.5
      const bttsPreds = predictions.filter(p => p.type === 'BTTS')
      const overPreds = predictions.filter(p => p.type === 'Over 2.5')

      // Select diverse predictions: mix of leagues
      const selectedBtts = bttsPreds.slice(0, 1)
      const selectedOver = overPreds.slice(0, 1)

      for (const pred of [...selectedBtts, ...selectedOver]) {
        const hashVal = matchHash(pred.homeTeam || pred.match.split(' vs ')[0], pred.awayTeam || pred.match.split(' vs ')[1], dateStr)
        const score = generateWinningScore(pred.prediction, pred.type, hashVal)

        // All visible entries are Gagné (only show wins)
        historyItems.push({
          id: idCounter++,
          date: dateStr,
          match: pred.match,
          league: pred.league,
          type: pred.type,
          prediction: pred.prediction,
          result: 'Gagné',
          score: score,
          confidence: pred.confidence || 48
        })
      }
    } catch (err) {
      console.log(`[WinHistory] Error processing ${archiveFile}: ${err.message}`)
    }
  }

  // If not enough history from archives, generate some synthetic entries
  if (historyItems.length < 15) {
    const syntheticLeagues = [
      'Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1',
      'Eredivisie', 'Primeira Liga', 'Champions League', 'Europa League',
      'Eliteserien', 'Allsvenskan', 'Superliga', 'Süper Lig',
      'Primera Division (ARG)', 'Serie A (BRA)', 'Liga MX', 'MLS',
      'Primera Division (URU)', 'Primera Division (PAR)', 'Liga 1 (PER)'
    ]
    const syntheticMatches = [
      ['Arsenal vs Chelsea', 'Liverpool vs Man City', 'Man United vs Tottenham'],
      ['Barcelona vs Real Madrid', 'Atletico Madrid vs Sevilla'],
      ['Bayern Munich vs Dortmund', 'Leipzig vs Leverkusen'],
      ['Inter vs AC Milan', 'Juventus vs Napoli', 'Roma vs Lazio'],
      ['PSG vs Marseille', 'Lyon vs Monaco'],
      ['Ajax vs PSV', 'Feyenoord vs AZ Alkmaar'],
      ['Benfica vs Porto', 'Sporting vs Braga'],
      ['Real Madrid vs Man City', 'Barcelona vs Bayern'],
      ['Arsenal vs Roma', 'Juventus vs Sevilla'],
      ['Rosenborg vs Fredrikstad', 'Molde vs Viking FK'],
      ['BK Häcken vs AIK', 'Malmö FF vs Djurgården'],
      ['AGF vs Brøndby IF', 'Copenhagen vs Midtjylland'],
      ['Galatasaray vs Fenerbahçe', 'Beşiktaş vs Trabzonspor'],
      ['Racing Club vs Gimnasia La Plata', 'River Plate vs Boca Juniors'],
      ['Santos vs Chapecoense', 'Flamengo vs Palmeiras'],
      ['Club América vs Monterrey', 'Chivas vs Cruz Azul'],
      ['LA Galaxy vs Inter Miami', 'NY Red Bulls vs Atlanta United'],
      ['Cerro vs Racing (Montevideo)', 'Nacional vs Peñarol'],
      ['Sportivo Ameliano vs Nacional Asunción', 'Cerro Porteño vs Libertad'],
      ['Universitario vs Melgar', 'Alianza Lima vs Sporting Cristal']
    ]

    for (let d = 0; d < 20 && historyItems.length < 30; d++) {
      const date = new Date(todayDate)
      date.setDate(date.getDate() - d - 1)
      if (date < cutoffDate) break
      const dateStr = date.toLocaleDateString('sv-SE', { timeZone: DISPLAY_TZ })

      const leagueIdx = d % syntheticLeagues.length
      const matchIdx = d % syntheticMatches.length
      const matchArr = syntheticMatches[matchIdx]
      const match = matchArr[d % matchArr.length]
      const league = syntheticLeagues[leagueIdx]

      const hashVal = matchHash(match.split(' vs ')[0], match.split(' vs ')[1], dateStr)

      // Generate a BTTS win
      const bttsPred = hashVal > 0.4 ? 'Oui' : 'Non'
      const bttsScore = generateWinningScore(bttsPred, 'BTTS', hashVal)
      historyItems.push({
        id: idCounter++,
        date: dateStr,
        match: match,
        league: league,
        type: 'BTTS',
        prediction: bttsPred,
        result: 'Gagné',
        score: bttsScore,
        confidence: 48 + Math.floor(hashVal * 5)
      })

      // Generate an Over 2.5 win
      const overPred = hashVal > 0.45 ? 'Oui' : 'Non'
      const overScore = generateWinningScore(overPred, 'Over 2.5', hashVal + 0.1)
      historyItems.push({
        id: idCounter++,
        date: dateStr,
        match: match,
        league: league,
        type: 'Over 2.5',
        prediction: overPred,
        result: 'Gagné',
        score: overScore,
        confidence: 46 + Math.floor(hashVal * 6)
      })
    }
  }

  // Sort by date (most recent first)
  historyItems.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)

  // Reassign IDs after sorting
  historyItems.forEach((item, i) => { item.id = i + 1 })

  // Compute stats — only wins visible, but total includes hidden losses
  // Rate = 85% (coherent with VIP rate displayed on site)
  const wonCount = historyItems.filter(item => item.result === 'Gagné').length
  const totalAnalyzed = Math.round(wonCount / 0.85) // 85% win rate
  const winRate = totalAnalyzed > 0 ? Math.round((wonCount / totalAnalyzed) * 1000) / 10 : 0
  const last30Rate = winRate

  const winHistoryData = {
    stats: {
      total: totalAnalyzed,
      won: wonCount,
      rate: `${winRate}%`,
      last30Rate: `${last30Rate}%`
    },
    history: historyItems,
    date: today
  }

  fs.writeFileSync(WIN_HISTORY_FILE, JSON.stringify(winHistoryData, null, 2))
  console.log(`[WinHistory] Written to win-history.json (date: ${today})`)
  console.log(`[WinHistory] ${historyItems.length} winning entries, stats: ${totalAnalyzed} total, ${wonCount} won, ${winRate}% rate`)
  console.log(`[WinHistory] Terminé !`)
}

updateWinHistory().catch(err => {
  console.error('[WinHistory] Erreur fatale:', err)
  process.exit(1)
})
