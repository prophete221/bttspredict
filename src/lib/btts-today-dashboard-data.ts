import { getDakarDateString } from './dakar-date'
import { getGeminiPicks, getGeminiProbability, type GeminiPrediction } from './gemini-predictions'
import { selectFixtureOnlyItems, type PublicCalendarItem } from './public-calendar'

interface RawPrediction extends PublicCalendarItem {
  match?: string
  home?: string
  away?: string
  league?: string
  date?: string
  time?: string
  homeLogo?: string
  awayLogo?: string
  ai_source?: string
  ai_abstain?: boolean
  bttsProb?: number
  over25Prob?: number
  homeLambda?: number
  awayLambda?: number
  xgHome?: number
  xgAway?: number
  xgTotal?: number
  reliabilityScore?: number
  dataSource?: string
  dataQuality?: string
  matchCountHome?: number
  matchCountAway?: number
  ai_key_fact?: string
  ai_analysis?: string
  ai_form_summary?: string
  ai_absences?: string
  ai_odds_insight?: string
  ai_key_fact_en?: string
  ai_analysis_en?: string
  ai_form_summary_en?: string
  ai_absences_en?: string
  ai_odds_insight_en?: string
  odds?: { provider?: string; home?: number | null; draw?: number | null; away?: number | null; over25?: number | null; under25?: number | null } | null
}

export interface BttsTodayMatchData {
  key: string
  home: string
  away: string
  league: string
  date: string
  time: string
  homeLogo?: string
  awayLogo?: string
  bttsProb?: number
  over25Prob?: number
  aiPicks: GeminiPrediction[]
  aiSource?: string
  aiAbstain?: boolean
  homeLambda?: number
  awayLambda?: number
  xgHome?: number
  xgAway?: number
  xgTotal?: number
  reliabilityScore?: number
  dataSource?: string
  dataQuality?: string
  matchCountHome?: number
  matchCountAway?: number
  aiExactScore?: string
  exactScoreProb?: string
  aiBttsView?: string
  aiOver25View?: string
  aiKeyFact?: string
  aiAnalysis?: string
  aiFormSummary?: string
  aiAbsences?: string
  aiOddsInsight?: string
  aiKeyFactEn?: string
  aiAnalysisEn?: string
  aiFormSummaryEn?: string
  aiAbsencesEn?: string
  aiOddsInsightEn?: string
  odds?: { provider?: string; home?: number | null; draw?: number | null; away?: number | null; over25?: number | null; under25?: number | null } | null
}

export interface BttsTodayScheduleFixture {
  key: string
  home: string
  away: string
  league: string
  date: string
  time: string
}

export interface BttsTodayDashboardData {
  matches: BttsTodayMatchData[]
  todayMatches: BttsTodayMatchData[]
  upcomingMatches: BttsTodayMatchData[]
  scheduleFixtures: BttsTodayScheduleFixture[]
  generationDate: string | null
}

/** Build the exact read-only dashboard rows from the public predictions payload. */
export function buildBttsTodayDashboardData(payload: unknown, now = new Date()): BttsTodayDashboardData {
  const data = payload && typeof payload === 'object'
    ? payload as { free?: unknown; predictions?: unknown; fixtures?: unknown; date?: unknown }
    : {}
  const source = data.free || data.predictions || []
  const raw: RawPrediction[] = Array.isArray(source) ? source as RawPrediction[] : []
  const rawFixtures = Array.isArray(data.fixtures) ? data.fixtures as PublicCalendarItem[] : []
  const fixtureRows = selectFixtureOnlyItems(rawFixtures, raw as PublicCalendarItem[], now)
  const scheduleFixtures = fixtureRows.flatMap(fixture => {
    const home = String(fixture.home || '').trim()
    const away = String(fixture.away || '').trim()
    const league = String(fixture.league || '').trim()
    const date = String(fixture.date || '')
    if (!home || !away || !league) return []
    return [{ key: `${date}|${league}|${home}|${away}`, home, away, league, date, time: String(fixture.time || '') }]
  })

  // Today's date in Africa/Dakar (Senegal timezone = UTC+0 / GMT).
  const todayStr = getDakarDateString(now)
  const map = new Map<string, BttsTodayMatchData>()
  for (const p of raw) {
    const key = p.match || `${p.home || ''} vs ${p.away || ''} ${p.date || ''}`
    const aiPicks = getGeminiPicks(p)
    if (aiPicks.length === 0) continue
    const isGeminiResponse = p.ai_source === 'gemini-stats-v1'
    if (!map.has(key)) {
      map.set(key, {
        key,
        home: p.home || '',
        away: p.away || '',
        league: p.league || '—',
        date: p.date || '',
        time: p.time || '--:--',
        homeLogo: p.homeLogo,
        awayLogo: p.awayLogo,
        bttsProb: getGeminiProbability(aiPicks, 'BTTS'),
        over25Prob: getGeminiProbability(aiPicks, 'O2.5'),
        aiPicks,
        aiSource: isGeminiResponse ? p.ai_source : undefined,
        aiAbstain: p.ai_abstain,
        homeLambda: p.homeLambda,
        awayLambda: p.awayLambda,
        xgHome: p.xgHome,
        xgAway: p.xgAway,
        xgTotal: p.xgTotal,
        reliabilityScore: p.reliabilityScore,
        dataSource: p.dataSource,
        dataQuality: p.dataQuality,
        matchCountHome: p.matchCountHome,
        matchCountAway: p.matchCountAway,
        aiExactScore: undefined,
        exactScoreProb: undefined,
        aiBttsView: undefined,
        aiOver25View: undefined,
        aiKeyFact: isGeminiResponse ? p.ai_key_fact : undefined,
        aiAnalysis: isGeminiResponse ? p.ai_analysis : undefined,
        aiFormSummary: isGeminiResponse ? p.ai_form_summary : undefined,
        aiAbsences: isGeminiResponse ? p.ai_absences : undefined,
        aiOddsInsight: isGeminiResponse ? p.ai_odds_insight : undefined,
        aiKeyFactEn: isGeminiResponse ? p.ai_key_fact_en : undefined,
        aiAnalysisEn: isGeminiResponse ? p.ai_analysis_en : undefined,
        aiFormSummaryEn: isGeminiResponse ? p.ai_form_summary_en : undefined,
        aiAbsencesEn: isGeminiResponse ? p.ai_absences_en : undefined,
        aiOddsInsightEn: isGeminiResponse ? p.ai_odds_insight_en : undefined,
        odds: p.odds || null,
      })
    } else {
      // Merge only Gemini markets from sibling rows; empirical/local rate fields stay ignored.
      const existing = map.get(key)!
      for (const pick of aiPicks) {
        if (!existing.aiPicks.some(current => current.market === pick.market)) existing.aiPicks.push(pick)
      }
      existing.bttsProb = getGeminiProbability(existing.aiPicks, 'BTTS')
      existing.over25Prob = getGeminiProbability(existing.aiPicks, 'O2.5')
      if (!existing.aiSource && isGeminiResponse) existing.aiSource = p.ai_source
      if (existing.aiAbstain !== false) existing.aiAbstain = p.ai_abstain
      if (existing.homeLambda == null && p.homeLambda != null) existing.homeLambda = p.homeLambda
      if (existing.awayLambda == null && p.awayLambda != null) existing.awayLambda = p.awayLambda
      if (existing.reliabilityScore == null && p.reliabilityScore != null) existing.reliabilityScore = p.reliabilityScore
      if (existing.dataSource == null && p.dataSource != null) existing.dataSource = p.dataSource
      if (existing.dataQuality == null && p.dataQuality != null) existing.dataQuality = p.dataQuality
      if (existing.matchCountHome == null && p.matchCountHome != null) existing.matchCountHome = p.matchCountHome
      if (existing.matchCountAway == null && p.matchCountAway != null) existing.matchCountAway = p.matchCountAway
      if (isGeminiResponse && existing.aiKeyFact == null && p.ai_key_fact != null) existing.aiKeyFact = p.ai_key_fact
      if (isGeminiResponse && existing.aiAnalysis == null && p.ai_analysis != null) existing.aiAnalysis = p.ai_analysis
      if (isGeminiResponse && existing.aiFormSummary == null && p.ai_form_summary != null) existing.aiFormSummary = p.ai_form_summary
      if (isGeminiResponse && existing.aiAbsences == null && p.ai_absences != null) existing.aiAbsences = p.ai_absences
      if (isGeminiResponse && existing.aiOddsInsight == null && p.ai_odds_insight != null) existing.aiOddsInsight = p.ai_odds_insight
      if (isGeminiResponse && existing.aiKeyFactEn == null && p.ai_key_fact_en != null) existing.aiKeyFactEn = p.ai_key_fact_en
      if (isGeminiResponse && existing.aiAnalysisEn == null && p.ai_analysis_en != null) existing.aiAnalysisEn = p.ai_analysis_en
      if (isGeminiResponse && existing.aiFormSummaryEn == null && p.ai_form_summary_en != null) existing.aiFormSummaryEn = p.ai_form_summary_en
      if (isGeminiResponse && existing.aiAbsencesEn == null && p.ai_absences_en != null) existing.aiAbsencesEn = p.ai_absences_en
      if (isGeminiResponse && existing.aiOddsInsightEn == null && p.ai_odds_insight_en != null) existing.aiOddsInsightEn = p.ai_odds_insight_en
      if (existing.odds == null && p.odds != null) existing.odds = p.odds
    }
  }

  const matches = [...map.values()]
    .filter(match => match.date >= todayStr)
    .sort((a, b) => `${a.date}T${a.time || '23:59'}`.localeCompare(`${b.date}T${b.time || '23:59'}`))
  return {
    matches,
    todayMatches: matches.filter(match => match.date === todayStr),
    upcomingMatches: matches.filter(match => match.date > todayStr),
    scheduleFixtures,
    generationDate: typeof data.date === 'string' && data.date.length > 0 ? data.date : null,
  }
}
