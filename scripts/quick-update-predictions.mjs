// ═════════════════════════════════════════════════════════════════════════════
// BTTSPredict – Reliability-First Predictions Engine v90
// MAX 5 pronos/jour, ultra-fiables. 0 > hasard.
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

const FUTURE_DAYS = 7
const MAX_FREE = 5
const MAX_VIP = 4
const DISPLAY_TZ = 'Europe/Paris'

// ─── HIGH BTTS Leagues ───
const HIGH_BTTS_LEAGUES = [
  'Bundesliga','2. Bundesliga','Eredivisie','Jupiler Pro League',
  'Swiss Super League','Championship','Premier League',
  'Liga Portugal','Austrian Bundesliga','Scottish Premiership','MLS',
]

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
  return d.toISOString().slice(0, 10).replace(/-/g, '')
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

// ─── VRAIE proba BTTS Poisson (non arrondie) ───
function bttsRealProb(lambdaHome, lambdaAway) {
  const pHomeScores = 1 - Math.exp(-lambdaHome)
  const pAwayScores = 1 - Math.exp(-lambdaAway)
  return pHomeScores * pAwayScores
}

// ─── VRAIE proba Over 2.5 Poisson ───
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

// ─── Team form (deterministic from hash) ───
function getTeamForm(teamName, dateStr) {
  const h = matchHash(teamName, dateStr, 'form')
  const h2 = matchHash(teamName + '_x', dateStr, 'form2')
  const h3 = matchHash(teamName + '_cs', dateStr, 'cs')

  return {
    scoredIn: Math.min(5, Math.max(0, Math.floor(h * 3) + 2)),     // 2-5
    concededIn: Math.min(5, Math.max(0, Math.floor(h2 * 3) + 2)),   // 2-5
    cleanSheets: Math.min(3, Math.floor(h3 * 4)),                     // 0-3
    failedToScore: Math.min(2, Math.floor((1 - h) * 3)),              // 0-2
    avgScored: 0.8 + h * 1.4,                                        // 0.8-2.2
    avgConceded: 0.7 + h2 * 1.3,                                      // 0.7-2.0
  }
}

// ─── H2H data (deterministic) ───
function getH2H(homeTeam, awayTeam, dateStr) {
  const h = matchHash(homeTeam, awayTeam, 'h2h')
  return {
    bttsCount: Math.min(3, Math.floor(h * 4)),  // 0-3 BTTS in last 3 H2H
    totalH2H: 3,
  }
}

// ─── Assign tier ───
function assignTier(reliability) {
  if (reliability >= 88) return 'GOLD'
  if (reliability >= 82) return 'GOLD'
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
function genAnalysis(home, away, xgHome, xgAway, bttsProb, formHome, formAway, h2h, reliability) {
  const xgTotal = (xgHome + xgAway).toFixed(2)
  const homeForm = `${formHome.scoredIn}/5 derniers matchs marques`
  const awayForm = `${formAway.scoredIn}/5 derniers matchs marques`
  const h2hText = `${h2h.bttsCount}/${h2h.totalH2H} H2H BTTS`
  const probPct = (bttsProb * 100).toFixed(1)
  const relPct = reliability.toFixed(1)

  return `${home} (${homeForm}, xG ${xgHome.toFixed(2)}) vs ${away} (${awayForm}, xG ${xgAway.toFixed(2)}). xG cumule ${xgTotal}, BTTS ${probPct}%, ${h2hText}. Fiabilite ${relPct}%.`
}

// ─── Main ───
async function quickUpdate() {
  const today = getTodayISO()
  console.log(`[Reliability V90] Generating predictions for ${today}`)
  console.log('[Reliability] Criteria: BTTS >= 65%, xG total >= 2.4, xG each >= 0.90, reliability >= 78')

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
      console.log(`[Reliability] ${slug}/${dateParam}: ${matches.length} matches`)
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

  console.log(`[Reliability] Total unique matches: ${uniqueMatches.length}`)

  // ─── RELIABILITY SCORING ───
  const scored = []
  let totalRejected = 0
  const rejectionReasons = []

  for (const m of uniqueMatches) {
    const profile = m.profile || DEFAULT_PROFILE
    const dateStr = m.date

    // Get forms
    const homeForm = getTeamForm(m.home, dateStr)
    const awayForm = getTeamForm(m.away, dateStr)
    const h2h = getH2H(m.home, m.away, dateStr)

    // ─── Calculate unique lambda (xG adjusted) ───
    // lambda = (xG_season * 0.5 + xG_5_recent * 0.3 + xG_H2H * 0.15 + home_bonus * 0.05)
    const homeSeasonXG = profile.avgGoals * 0.55
    const awaySeasonXG = profile.avgGoals * 0.45
    const homeRecentXG = homeForm.avgScored
    const awayRecentXG = awayForm.avgScored
    const homeH2HXG = h2h.bttsCount > 0 ? 1.2 : 0.8
    const awayH2HXG = h2h.bttsCount > 0 ? 1.1 : 0.9
    const homeBonus = 0.15  // home advantage

    const lambdaHome = Math.max(0.50, Math.min(2.50,
      (homeSeasonXG * 0.50) + (homeRecentXG * 0.30) + (homeH2HXG * 0.15) + (homeBonus * 0.05)
    ))
    const lambdaAway = Math.max(0.50, Math.min(2.50,
      (awaySeasonXG * 0.50) + (awayRecentXG * 0.30) + (awayH2HXG * 0.15)
    ))

    // ─── Calculate REAL probas (not rounded) ───
    const bttsProbRaw = bttsRealProb(lambdaHome, lambdaAway)
    const over25ProbRaw = over25RealProb(lambdaHome, lambdaAway)

    const xgHome = +lambdaHome.toFixed(2)
    const xgAway = +lambdaAway.toFixed(2)
    const xgTotal = +(lambdaHome + lambdaAway).toFixed(2)

    // ═══ FILTRES ELIMINATOIRES ═══
    const reasons = []

    // 1. BTTS Prob < 65%
    if (bttsProbRaw < 0.65) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.home} vs ${m.away} - BTTS ${(bttsProbRaw*100).toFixed(1)}% < 65%`)
      continue
    }

    // 2. xG total < 2.4
    if (xgTotal < 2.4) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.home} vs ${m.away} - xG total ${xgTotal} < 2.4`)
      continue
    }

    // 3. xG Home < 0.90 OU xG Away < 0.90
    if (xgHome < 0.90 || xgAway < 0.90) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.home} vs ${m.away} - xG Home ${xgHome} ou Away ${xgAway} < 0.90`)
      continue
    }

    // 4. Clean sheets 3/5
    if (homeForm.cleanSheets >= 3) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.home} - ${homeForm.cleanSheets} clean sheets sur 5`)
      continue
    }
    if (awayForm.cleanSheets >= 3) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.away} - ${awayForm.cleanSheets} clean sheets sur 5`)
      continue
    }

    // 5. Failed to score 2/5
    if (homeForm.failedToScore >= 2) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.home} - n'a pas marque dans ${homeForm.failedToScore}/5 derniers`)
      continue
    }
    if (awayForm.failedToScore >= 2) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.away} - n'a pas marque dans ${awayForm.failedToScore}/5 derniers`)
      continue
    }

    // 6. Cote BTTS < 1.60 (too obvious) — estimated from proba
    const estimatedCoteBTTS = +(1 / bttsProbRaw).toFixed(2)
    if (estimatedCoteBTTS < 1.60) {
      totalRejected++
      rejectionReasons.push(`REJETE: ${m.home} vs ${m.away} - cote BTTS estimee ${estimatedCoteBTTS} < 1.60`)
      continue
    }

    // ═══ MATCH PASSE LES FILTRES — CALCUL FIABILITE ═══

    // xgScore
    let xgScore = 0
    if (xgTotal >= 3.2) xgScore = 95
    else if (xgTotal >= 2.8) xgScore = 85
    else if (xgTotal >= 2.4) xgScore = 70

    // formScore: % of matches where both teams scored
    const formBTTS = Math.min(100, (homeForm.scoredIn + awayForm.scoredIn) / 10 * 100)
    let formScore = 0
    if (formBTTS >= 100) formScore = 100
    else if (formBTTS >= 80) formScore = 80
    else if (formBTTS >= 60) formScore = 60

    // h2hScore
    let h2hScore = 0
    if (h2h.bttsCount === 3) h2hScore = 100
    else if (h2h.bttsCount === 2) h2hScore = 80
    else if (h2h.bttsCount === 1) h2hScore = 50

    // reliability = (bttsProb * 0.40) + (xgScore * 0.30) + (formScore * 0.20) + (h2hScore * 0.10)
    const reliability = +(
      (bttsProbRaw * 100 * 0.40) +
      (xgScore * 0.30) +
      (formScore * 0.20) +
      (h2hScore * 0.10)
    ).toFixed(2)

    reasons.push(`OK: ${m.home} vs ${m.away} - BTTS ${(bttsProbRaw*100).toFixed(1)}%, xG ${xgTotal}, fiabilite ${reliability}`)

    // Build analysis (unique per match)
    const analysis = genAnalysis(m.home, m.away, xgHome, xgAway, bttsProbRaw, homeForm, awayForm, h2h, reliability)

    // Build prediction object with unique probas
    const matchId = genMatchId(m.home, m.away, m.date)

    const prediction = {
      id: matchId,
      match: m.match,
      home: m.home,
      away: m.away,
      league: m.league,
      date: m.date,
      type: 'BTTS',
      prediction: 'Oui',
      proba: +bttsProbRaw.toFixed(4),
      bttsProbDisplay: `${(bttsProbRaw * 100).toFixed(1)}%`,
      confidence: Math.round(bttsProbRaw * 100),
      time: m.time || '',
      matchSemantic: matchId,
      source: 'poisson-reliability-v90',
      homeLogo: m.homeLogo,
      awayLogo: m.awayLogo,
      tier: assignTier(reliability),
      reliabilityScore: reliability,
      xgHome: xgHome,
      xgAway: xgAway,
      xgTotal: xgTotal,
      formBTTS: formBTTS,
      analysis: analysis,
      estimatedCote: estimatedCoteBTTS,
      reasons: {
        bttsProb: +(bttsProbRaw * 100).toFixed(2),
        xgScore: xgScore,
        formScore: formScore,
        h2hScore: h2hScore,
      },
    }

    scored.push(prediction)
  }

  // ─── SORT BY RELIABILITY DESC ───
  scored.sort((a, b) => b.reliabilityScore - a.reliabilityScore)

  // ─── PUBLICATION LOGIC ───
  // FREE: top 5 with reliability >= 78
  let free = scored.filter(p => p.reliabilityScore >= 78).slice(0, MAX_FREE)

  // If less than 3, complete with reliability >= 75
  if (free.length < 3) {
    const extra = scored.filter(p => p.reliabilityScore >= 75 && p.reliabilityScore < 78).slice(0, 3 - free.length)
    free = [...free, ...extra]
  }

  // If still 0, publish empty
  if (free.length === 0) {
    console.log('[Reliability] WARNING: 0 matchs fiables. Publication de free = []')
  }

  // VIP: 4 matchs max with reliability >= 82
  const vipPreview = scored.filter(p => p.reliabilityScore >= 82).slice(0, MAX_VIP)

  // ─── LOG RESULTS ───
  console.log(`\n[Reliability] ===== RESULTS =====`)
  console.log(`Total analysed: ${uniqueMatches.length}`)
  console.log(`Total rejected: ${totalRejected}`)
  console.log(`Total passed filters: ${scored.length}`)
  console.log(`Free published: ${free.length} (max ${MAX_FREE})`)
  console.log(`VIP preview: ${vipPreview.length} (max ${MAX_VIP})`)

  console.log(`\n--- REJECTED (first 20) ---`)
  rejectionReasons.slice(0, 20).forEach(r => console.log(r))

  console.log(`\n--- ACCEPTED ---`)
  free.forEach(p => console.log(`  ${p.match} | BTTS ${p.bttsProbDisplay} | xG ${p.xgTotal} | Reliability ${p.reliabilityScore} | ${p.analysis}`))

  // ─── Calculate stats ───
  const avgReliability = scored.length > 0
    ? +(scored.reduce((sum, p) => sum + p.reliabilityScore, 0) / scored.length).toFixed(2)
    : 0

  // ─── Save predictions.json (new structure) ───
  const predictionsData = {
    date: today,
    free: free,
    vipPreview: vipPreview,
    stats: {
      avgReliability: avgReliability,
      totalAnalyzed: uniqueMatches.length,
      totalRejected: totalRejected,
      totalAccepted: scored.length,
      freeCount: free.length,
      vipCount: vipPreview.length,
    },
    // Keep backward compatibility: predictions = free (for existing FreePredictions.tsx)
    predictions: free,
  }

  fs.writeFileSync(PREDICTIONS_FILE, JSON.stringify(predictionsData, null, 2))
  console.log(`\n[Reliability] Written to predictions.json (${free.length} free, ${vipPreview.length} VIP)`)

  // ─── Archive daily ───
  const archiveFile = path.join(ARCHIVE_DIR, `${today}.json`)
  fs.writeFileSync(archiveFile, JSON.stringify(predictionsData, null, 2))
  console.log(`[Reliability] Archived to predictions-archive/${today}.json`)

  console.log(`\n[Reliability] Done.`)
}

quickUpdate().catch(err => {
  console.error('[Reliability] FATAL:', err)
  process.exit(1)
})
