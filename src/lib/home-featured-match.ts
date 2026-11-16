import { getGeminiPicks, type GeminiPrediction } from './gemini-predictions'
import { getDakarDayDiff, parseDakarDateTime } from './dakar-date'
import { selectUpcomingGeminiItems, type MatchCenterWindowItem } from './match-center-window'

export interface FeaturedFixture {
  home: string
  away: string
  league: string
  date: string
  time: string
  homeLogo?: string
  awayLogo?: string
  predictions: GeminiPrediction[]
}

interface FeaturedCandidate extends MatchCenterWindowItem {
  match?: string
  home: string
  away: string
  league: string
  date: string
  time: string
  homeLogo?: string
  awayLogo?: string
  predictions: GeminiPrediction[]
}

/** Return the soonest future fixture with valid, explicitly sourced Gemini public picks. */
export function getNextGeminiFixture(data: unknown, now = new Date()): FeaturedFixture | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const payload = data as { free?: unknown[]; predictions?: unknown[] }
  const rows = [
    ...(Array.isArray(payload.free) ? payload.free : []),
    ...(Array.isArray(payload.predictions) ? payload.predictions : []),
  ]
  const candidates: FeaturedCandidate[] = []

  for (const value of rows) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue
    const row = value as Record<string, unknown>
    const home = typeof row.home === 'string' ? row.home.trim() : ''
    const away = typeof row.away === 'string' ? row.away.trim() : ''
    const date = typeof row.date === 'string' ? row.date.slice(0, 10) : ''
    const time = typeof row.time === 'string' ? row.time.trim() : ''
    const kickoff = parseDakarDateTime(date, time)
    if (!home || !away || !kickoff || kickoff.getTime() <= now.getTime()) continue

    const predictions = getGeminiPicks(row)
    if (predictions.length === 0) continue
    candidates.push({
      match: typeof row.match === 'string' ? row.match : undefined,
      home,
      away,
      league: typeof row.league === 'string' ? row.league.trim() : '',
      date,
      time,
      homeLogo: typeof row.homeLogo === 'string' ? row.homeLogo : undefined,
      awayLogo: typeof row.awayLogo === 'string' ? row.awayLogo : undefined,
      predictions,
    })
  }

  const merged = selectUpcomingGeminiItems(candidates, date => getDakarDayDiff(date, now))
    .filter(item => {
      const kickoff = parseDakarDateTime(item.date, item.time)
      return kickoff !== null && kickoff.getTime() > now.getTime()
    })
    .sort((a, b) => {
      const aKickoff = parseDakarDateTime(a.date, a.time)?.getTime() ?? Number.MAX_SAFE_INTEGER
      const bKickoff = parseDakarDateTime(b.date, b.time)?.getTime() ?? Number.MAX_SAFE_INTEGER
      return aKickoff - bKickoff
    })
  const next = merged[0]
  if (!next) return null

  return {
    home: next.home,
    away: next.away,
    league: next.league,
    date: next.date,
    time: next.time,
    homeLogo: next.homeLogo,
    awayLogo: next.awayLogo,
    predictions: next.predictions as GeminiPrediction[],
  }
}
