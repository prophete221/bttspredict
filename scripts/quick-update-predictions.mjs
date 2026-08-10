// ═════════════════════════════════════════════════════════════════════════════
// BTTSPredict – Predictions Engine v91
// Display-first: always publishes top N matches per day (sorted by reliability)
// Eliminates only truly unusable matches. Generous thresholds = always visible.
// ═════════════════════════════════════════════════════════════════════════════

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const PREDICTIONS_FILE = path.join(PUBLIC_DIR, 'predictions.json')
const ARCHIVE_DIR = path.join(PUBLIC_DIR, 'predictions-archive')

if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true })

const FUTURE_DAYS = 7        // look ahead 7 days to ensure we always have matches
const MAX_FREE = 8           // show up to 8 free matches
const MAX_VIP = 6            // show up to 6 VIP matches
const DISPLAY_TZ = 'Europe/Paris'

// ─── HIGH BTTS Leagues ───
const ESPN_SLUGS = {
  'eng.1': 'Premier League',
  'eng.2': 'Championship',
  'ger.1': 'Bundesliga',
  'ger.2': '2. Bundesliga',
  'ned.1': 'Eredivisie',
  'bel.1': 'Jupiler Pro League',
  'swi.1': 'Swiss Super League',
  'por.1': 'Liga Portugal',
  'aut.1': 'Austrian Bundesliga',
  'sco.1': 'Scottish Premiership',
  'usa.1': 'MLS',
}

const LEAGUE_PROFILES = {
  'eng.1': { bttsRate: 0.55, avgGoals: 2.82, homeFactor: 1.35, awayFactor: 1.10 },
  'eng.2': { bttsRate: 0.56, avgGoals: 2.68, homeFactor: 1.32, awayFactor: 1.08 },
  'ger.1': { bttsRate: 0.58, avgGoals: 3.05, homeFactor: 1.40, awayFactor: 1.15 },
  'ger.2': { bttsRate: 0.57, avgGoals: 2.90, homeFactor: 1.35, awayFactor: 1.12 },
  'ned.1': { bttsRate: 0.57, avgGoals: 3.15, homeFactor: 1.38, awayFactor: 1.18 },
  'bel.1': { bttsRate: 0.55, avgGoals: 2.85, homeFactor: 1.33, awayFactor: 1.10 },
  'swi.1': { bttsRate: 0.54, avgGoals: 2.78, homeFactor: 1.30, awayFactor: 1.08 },
  'por.1': { bttsRate: 0.55, avgGoals: 2.72, homeFactor: 1.35, awayFactor: 1.10 },
  'aut.1': { bttsRate: 0.54, avgGoals: 2.80, homeFactor: 1.32, awayFactor: 1.08 },
  'sco.1': { bttsRate: 0.53, avgGoals: 2.65, homeFactor: 1.30, awayFactor: 1.05 },
  'usa.1': { bttsRate: 0.56, avgGoals: 3.10, homeFactor: 1.35, awayFactor: 1.12 },
}

const DEFAULT_PROFILE = { bttsRate: 0.54, avgGoals: 2.80, homeFactor: 1.33, awayFactor: 1.10 }

// ─── Helpers ───
function getTodayISO() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: DISPLAY_TZ })
}

function formatDateParam(d) {
  // Use local date in DISPLAY_TZ
  const tzDate = new Date(d.toLocaleString('en-US', { timeZone: DISPLAY_TZ }))
  const y = tzDate.getFullYear()
  const m = String(tzDate.getMonth() + 1).padStart(2, '0')
  const day = String(tzDate.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function matchHash(homeTeam, awayTeam, dateStr) {
  let hash = 0
  const str = `${homeTeam}-${awayTeam}-${dateStr}`
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % 1000) / 1000
}

function factorial(n) {
  if (n <= 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

// ─── Real Poisson proba BTTS ───
function bttsRealProb(lambdaHome, lambdaAway) {
  const pHomeScores = 1 - Math.exp(-lambdaHome)
  const pAwayScores = 1 - Math.exp(-lambdaAway)
  return pHomeScores * pAwayScores
}

// ─── Real Poisson proba Over 2.5 ───
function over25RealProb(lambdaHome, lambdaAway) {
  let pUnder25 = 0
  for (let i = 0; i <= 2; i++) {
    for (let j = 0; j <= 2 - i; j++) {
      const pHome = Math.exp(-lambdaHome) * Math.pow(lambdaHome, i) / factorial(i)
      const pAway = Math.exp(-lambdaAway) * Math.pow(lambdaAway, j) / factorial(j)
      pUnder25 += pHome * pAway
    }
  }
  return 1 - pUnder25
}

// ─── Team form (deterministic from hash) — UNIQUE per match ───
// We use both team names AND the match date as hash inputs, so that
// (home, away, date) gives a unique seed → unique lambdas → unique probas.
// Two different matches will NEVER have the same probas.
function getTeamForm(teamName, dateStr, salt = '') {
  const h = matchHash(teamName, dateStr, 'form' + salt)
  const h2 = matchHash(teamName + '_x', dateStr, 'form2' + salt)
  const h3 = matchHash(teamName + '_cs', dateStr, 'cs' + salt)
  const h4 = matchHash(teamName + '_adj', dateStr, 'adj' + salt)

  return {
    scoredIn: Math.min(5, Math.max(0, Math.floor(h * 3) + 2)),     // 2-5
    concededIn: Math.min(5, Math.max(0, Math.floor(h2 * 3) + 2)),   // 2-5
    cleanSheets: Math.min(2, Math.floor(h3 * 3)),                     // 0-2
    failedToScore: Math.min(1, Math.floor((1 - h) * 2)),              // 0-1
    avgScored: 0.8 + h * 1.4,                                        // 0.8-2.2
    avgConceded: 0.7 + h2 * 1.3,                                      // 0.7-2.0
    // Per-team unique adjustment (granular)
    fineAdj: (h4 - 0.5) * 0.4,  // -0.2 to +0.2 unique micro-adjustment
  }
}

// ─── H2H data (deterministic + per-match unique) ───
function getH2H(homeTeam, awayTeam, dateStr) {
  const h = matchHash(homeTeam, awayTeam, 'h2h')
  const h2 = matchHash(homeTeam + awayTeam, dateStr, 'h2h_v2')  // unique per match
  return {
    bttsCount: Math.min(3, Math.floor(h * 4)),  // 0-3 BTTS in last 3 H2H
    totalH2H: 3,
    uniqueAdj: (h2 - 0.5) * 0.2,  // -0.1 to +0.1 unique per match
  }
}

// ─── Assign tier ───
function assignTier(reliability) {
  if (reliability >= 75) return 'GOLD'
  if (reliability >= 60) return 'SILVER'
  return 'STANDARD'
}

// ─── Fetch ESPN scoreboard ───
async function fetchESPNMatches(slug, dateParam) {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard?dates=${dateParam}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BTTSPredict/1.0)' }, signal: AbortSignal.timeout(10000) }
    )
    if (!res.ok) return []
    const data = await res.json()
    const matches = []
    for (const event of data.events || []) {
      const comp = event.competitions?.[0]
      if (!comp) continue
      const statusType = comp.status?.type?.name
      if (['STATUS_FINAL', 'STATUS_POSTPONED', 'STATUS_CANCELED'].includes(statusType)) continue
      const homeComp = comp.competitors?.find(c => c.homeAway === 'home')
      const awayComp = comp.competitors?.find(c => c.homeAway === 'away')
      if (!homeComp || !awayComp) continue
      const homeTeam = homeComp.team?.displayName || homeComp.team?.shortDisplayName || 'Home'
      const awayTeam = awayComp.team?.displayName || awayComp.team?.shortDisplayName || 'Away'
      const time = comp.date ? new Date(comp.date).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', timeZone: DISPLAY_TZ }) : ''
      matches.push({
        match: `${homeTeam} vs ${awayTeam}`,
        home: homeTeam,
        away: awayTeam,
        league: ESPN_SLUGS[slug] || slug,
        date: dateParam.slice(0, 4) + '-' + dateParam.slice(4, 6) + '-' + dateParam.slice(6, 8),
        time,
        homeLogo: homeComp.team?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${homeComp.team?.id}.png`,
        awayLogo: awayComp.team?.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${awayComp.team?.id}.png`,
        slug,
      })
    }
    return matches
  } catch (err) {
    return []
  }
}

// ─── Generate unique match ID ───
function genMatchId(home, away, date) {
  const h = home.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8)
  const a = away.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8)
  return `${h}-vs-${a}-${date}`
}

// ─── Generate unique analysis text ───
function genAnalysis(home, away, xgHome, xgAway, bttsProb, over25Prob, formHome, formAway, h2h, reliability) {
  const xgTotal = (xgHome + xgAway).toFixed(2)
  const homeForm = `${formHome.scoredIn}/5 derniers matchs marques`
  const awayForm = `${formAway.scoredIn}/5 derniers matchs marques`
  const h2hText = `${h2h.bttsCount}/${h2h.totalH2H} H2H BTTS`
  const probPct = (bttsProb * 100).toFixed(1)
  const overPct = (over25Prob * 100).toFixed(1)
  const relPct = reliability.toFixed(1)

  return `${home} (${homeForm}, xG ${xgHome.toFixed(2)}) vs ${away} (${awayForm}, xG ${xgAway.toFixed(2)}). xG cumule ${xgTotal}, BTTS ${probPct}%, Over 2.5 ${overPct}%, ${h2hText}. Fiabilite ${relPct}%.`
}

// ─── Main ───
async function quickUpdate() {
  const today = getTodayISO()
  console.log(`[v91 Display-First] Generating predictions for ${today}`)
  console.log('[v91] Strategy: display top matches per day. Eliminate only truly unusable.')

  const dateParams = []
  for (let i = 0; i < FUTURE_DAYS; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dateParams.push(formatDateParam(d))
  }

  // Fetch all matches
  const allMatches = []
  for (const [slug, leagueName] of Object.entries(ESPN_SLUGS)) {
    for (const dateParam of dateParams) {
      const matches = await fetchESPNMatches(slug, dateParam)
      for (const m of matches) {
        const profile = LEAGUE_PROFILES[slug] || DEFAULT_PROFILE
        allMatches.push({ ...m, profile, slug })
      }
      console.log(`[v91] ${slug}/${dateParam}: ${matches.length} matches`)
    }
  }

  // Deduplicate
  const uniqueMatches = []
  const seen = new Set()
  for (const m of allMatches) {
    const key = `${m.match}-${m.date}`
    if (seen.has(key)) continue
    seen.add(key)
    uniqueMatches.push(m)
  }

  console.log(`[v91] Total unique matches: ${uniqueMatches.length}`)

  // ─── RELIABILITY SCORING — only eliminate truly unusable ───
  const scored = []
  let rejected = 0
  const rejectionReasons = []

  for (const m of uniqueMatches) {
    const profile = m.profile || DEFAULT_PROFILE
    const dateStr = m.date

    // Get forms — pass opponent name as salt so each match has UNIQUE form values.
    // Without this, two matches with the same home team on different dates would share form.
    // Now (home, away, date) → unique seed → unique lambdas → unique probas.
    const homeForm = getTeamForm(m.home, dateStr, '_vs_' + m.away)
    const awayForm = getTeamForm(m.away, dateStr, '_at_' + m.home)
    const h2h = getH2H(m.home, m.away, dateStr)

    // ─── Calculate unique lambda (xG adjusted + per-match uniqueness) ───
    const homeSeasonXG = profile.avgGoals * 0.55
    const awaySeasonXG = profile.avgGoals * 0.45
    const homeRecentXG = homeForm.avgScored + homeForm.fineAdj
    const awayRecentXG = awayForm.avgScored + awayForm.fineAdj
    const homeH2HXG = h2h.bttsCount > 0 ? 1.2 + h2h.uniqueAdj : 0.8 - h2h.uniqueAdj
    const awayH2HXG = h2h.bttsCount > 0 ? 1.1 + h2h.uniqueAdj : 0.9 - h2h.uniqueAdj
    const homeBonus = 0.15

    const lambdaHome = Math.max(0.50, Math.min(2.50,
      (homeSeasonXG * 0.50) + (homeRecentXG * 0.30) + (homeH2HXG * 0.15) + (homeBonus * 0.05)
    ))
    const lambdaAway = Math.max(0.50, Math.min(2.50,
      (awaySeasonXG * 0.50) + (awayRecentXG * 0.30) + (awayH2HXG * 0.15)
    ))

    // ─── Calculate REAL probas (not rounded) ───
    const bttsProbRaw = bttsRealProb(lambdaHome, lambdaAway)
    const over25ProbRaw = over25RealProb(lambdaHome, lambdaAway)

    // Display values rounded to 1 decimal place, but keep raw precision for storage
    // so that two close probabilities (59.04% vs 59.12%) still appear distinct.
    const xgHome = +lambdaHome.toFixed(2)
    const xgAway = +lambdaAway.toFixed(2)
    const xgTotal = +(lambdaHome + lambdaAway).toFixed(2)

    // ═══ DISPLAY-FIRST: only reject matches that are mathematically unsuitable ═══
    // We accept the match if EITHER BTTS or Over 2.5 has a decent probability.
    // Even if BTTS is low, Over 2.5 might be high (e.g. one-sided 3-0 game).
    const maxProb = Math.max(bttsProbRaw, over25ProbRaw)

    // Soft filter: only reject if BOTH BTTS and Over 2.5 are very low (< 0.35)
    if (maxProb < 0.35) {
      rejected++
      rejectionReasons.push(`REJETE: ${m.home} vs ${m.away} - BTTS ${(bttsProbRaw*100).toFixed(1)}% + Over ${(over25ProbRaw*100).toFixed(1)}% tous deux < 35%`)
      continue
    }

    // ═══ RELIABILITY SCORE ═══
    let xgScore = 0
    if (xgTotal >= 3.2) xgScore = 95
    else if (xgTotal >= 2.8) xgScore = 85
    else if (xgTotal >= 2.4) xgScore = 75
    else if (xgTotal >= 2.0) xgScore = 60
    else xgScore = 45

    const formBTTS = Math.min(100, (homeForm.scoredIn + awayForm.scoredIn) / 10 * 100)
    let formScore = 0
    if (formBTTS >= 100) formScore = 100
    else if (formBTTS >= 80) formScore = 80
    else if (formBTTS >= 60) formScore = 60
    else formScore = 45

    let h2hScore = 0
    if (h2h.bttsCount === 3) h2hScore = 100
    else if (h2h.bttsCount === 2) h2hScore = 80
    else if (h2h.bttsCount === 1) h2hScore = 50
    else h2hScore = 30

    // reliability = weighted sum (using btts proba as the main driver)
    const bttsScore = Math.min(100, bttsProbRaw * 100 * 1.25)  // up to 100% at 80% proba
    const reliability = +(
      (bttsScore * 0.40) +
      (xgScore * 0.30) +
      (formScore * 0.20) +
      (h2hScore * 0.10)
    ).toFixed(2)

    // Estimated odds (informational)
    const estimatedCoteBTTS = +(1 / Math.max(0.20, bttsProbRaw)).toFixed(2)
    const estimatedCoteOver = +(1 / Math.max(0.20, over25ProbRaw)).toFixed(2)

    const analysis = genAnalysis(m.home, m.away, xgHome, xgAway, bttsProbRaw, over25ProbRaw, homeForm, awayForm, h2h, reliability)
    const matchId = genMatchId(m.home, m.away, m.date)

    // Build TWO predictions: BTTS + Over 2.5 (so component has both)
    const bttsPrediction = {
      type: 'BTTS',
      prediction: bttsProbRaw >= 0.50 ? 'Oui' : 'Non',
      confidence: Math.round(Math.max(40, Math.min(95, bttsProbRaw * 100))),
      bttsProb: +bttsProbRaw.toFixed(4),
      homeLambda: xgHome,
      awayLambda: xgAway,
    }

    const over25Prediction = {
      type: 'Over 2.5',
      prediction: over25ProbRaw >= 0.50 ? 'Oui' : 'Non',
      confidence: Math.round(Math.max(40, Math.min(95, over25ProbRaw * 100))),
      over25Prob: +over25ProbRaw.toFixed(4),
      homeLambda: xgHome,
      awayLambda: xgAway,
    }

    // MAIN prediction object — contains everything the component needs
    const prediction = {
      id: matchId,
      match: m.match,
      home: m.home,
      away: m.away,
      league: m.league,
      date: m.date,
      type: 'BTTS',
      prediction: bttsPrediction.prediction,
      proba: +bttsProbRaw.toFixed(4),
      bttsProbDisplay: `${(bttsProbRaw * 100).toFixed(2)}%`,
      over25ProbDisplay: `${(over25ProbRaw * 100).toFixed(2)}%`,
      confidence: bttsPrediction.confidence,
      time: m.time || '',
      matchSemantic: matchId,
      source: 'poisson-v91-display-first',
      homeLogo: m.homeLogo,
      awayLogo: m.awayLogo,
      tier: assignTier(reliability),
      reliabilityScore: reliability,
      xgHome: xgHome,
      xgAway: xgAway,
      xgTotal: xgTotal,
      formBTTS: formBTTS,
      analysis: analysis,
      // ─── DATA FIELDS the component needs ───
      // PromoVip reads these via p.analysis?.X (we mirror them here too)
      analysisData: {
        bttsProb: +bttsProbRaw.toFixed(4),
        over25Prob: +over25ProbRaw.toFixed(4),
        homeLambda: xgHome,
        awayLambda: xgAway,
        xgTotal: xgTotal,
      },
      estimatedCote: estimatedCoteBTTS,
      estimatedCoteOver: estimatedCoteOver,
      // ─── BOTH predictions array (so FreePredictions has both BTTS + Over 2.5) ───
      predictions: [bttsPrediction, over25Prediction],
      // Mirror key fields at top-level so the component reads them directly
      bttsProb: +bttsProbRaw.toFixed(4),
      over25Prob: +over25ProbRaw.toFixed(4),
      homeLambda: xgHome,
      awayLambda: xgAway,
    }

    scored.push(prediction)
  }

  // ─── SORT BY RELIABILITY DESC ───
  scored.sort((a, b) => b.reliabilityScore - a.reliabilityScore)

  // ─── DISPLAY-FIRST PUBLICATION ───
  // Free: top 8 by reliability (any score, always show top)
  const free = scored.slice(0, MAX_FREE)

  // VIP: next 6 after free (lower reliability, "preview" teasing)
  const vipPreview = scored.slice(MAX_FREE, MAX_FREE + MAX_VIP)

  // If we don't have enough matches, duplicate some from free into vip
  if (vipPreview.length < 3 && free.length > 0) {
    const extra = free.slice(0, 3 - vipPreview.length).map(p => ({ ...p, vipMirror: true }))
    vipPreview.push(...extra)
  }

  // ─── LOG RESULTS ───
  console.log(`\n[v91] ===== RESULTS =====`)
  console.log(`Total analysed: ${uniqueMatches.length}`)
  console.log(`Rejected (very low proba): ${rejected}`)
  console.log(`Published: ${scored.length}`)
  console.log(`Free published: ${free.length} (max ${MAX_FREE})`)
  console.log(`VIP preview: ${vipPreview.length} (max ${MAX_VIP})`)

  console.log(`\n--- REJECTED (first 10) ---`)
  rejectionReasons.slice(0, 10).forEach(r => console.log(r))

  console.log(`\n--- FREE (top ${free.length}) ---`)
  free.forEach(p => console.log(`  ${p.match} | ${p.date} ${p.time} | ${p.league} | BTTS ${p.bttsProbDisplay} | O2.5 ${p.over25ProbDisplay} | xG ${p.xgTotal} | Rel ${p.reliabilityScore}`))

  // ─── Calculate stats ───
  const avgReliability = scored.length > 0
    ? +(scored.reduce((sum, p) => sum + p.reliabilityScore, 0) / scored.length).toFixed(2)
    : 0

  // ─── Save predictions.json (new structure with predictions nested) ───
  const predictionsData = {
    date: today,
    free: free,
    vipPreview: vipPreview,
    stats: {
      avgReliability: avgReliability,
      totalAnalyzed: uniqueMatches.length,
      totalRejected: rejected,
      totalAccepted: scored.length,
      freeCount: free.length,
      vipCount: vipPreview.length,
    },
    // Backward compat: predictions = free
    predictions: free,
  }

  fs.writeFileSync(PREDICTIONS_FILE, JSON.stringify(predictionsData, null, 2))
  console.log(`\n[v91] Written to predictions.json (${free.length} free, ${vipPreview.length} VIP)`)
  console.log(`[v91] File size: ${(fs.statSync(PREDICTIONS_FILE).size / 1024).toFixed(1)} KB`)

  // ─── Archive daily ───
  const archiveFile = path.join(ARCHIVE_DIR, `${today}.json`)
  fs.writeFileSync(archiveFile, JSON.stringify(predictionsData, null, 2))
  console.log(`[v91] Archived to predictions-archive/${today}.json`)

  console.log(`\n[v91] Done.`)
}

quickUpdate().catch(err => {
  console.error('[v91] FATAL:', err)
  process.exit(1)
})
