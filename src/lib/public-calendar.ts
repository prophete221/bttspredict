import { getDakarDateString } from './dakar-date'

export interface PublicCalendarItem {
  date?: unknown
  time?: unknown
  home?: unknown
  away?: unknown
  league?: unknown
  match?: unknown
  predictions?: unknown
  prediction?: unknown
  proba?: unknown
  confidence?: unknown
  bttsProb?: unknown
  over25Prob?: unknown
}

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00.000Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function normalize(value: unknown): string {
  return String(value ?? '').trim().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ')
}

function fixtureKey(row: PublicCalendarItem): string | null {
  const date = validDate(row.date) ? row.date : ''
  const home = normalize(row.home)
  const away = normalize(row.away)
  const league = normalize(row.league)
  return date && home && away && league ? `${date}|${league}|${home}|${away}` : null
}

function hasPick(row: PublicCalendarItem): boolean {
  return (Array.isArray(row.predictions) && row.predictions.length > 0) ||
    (typeof row.prediction === 'string' && row.prediction.trim().length > 0) ||
    (typeof row.proba === 'number' && Number.isFinite(row.proba)) ||
    (typeof row.confidence === 'number' && Number.isFinite(row.confidence)) ||
    (typeof row.bttsProb === 'number' && Number.isFinite(row.bttsProb)) ||
    (typeof row.over25Prob === 'number' && Number.isFinite(row.over25Prob))
}

/** Return the ISO date at a day offset in the Africa/Dakar calendar. */
export function getDakarDateOffset(dayOffset: number, now = new Date()): string | null {
  if (!Number.isFinite(now.getTime()) || !Number.isInteger(dayOffset)) return null
  const date = new Date(`${getDakarDateString(now)}T12:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + dayOffset)
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : null
}

/** Return only rows dated for a requested Africa/Dakar calendar day. */
export function selectCalendarItemsForDakarDay<T extends PublicCalendarItem>(
  items: readonly T[],
  dayOffset = 0,
  now = new Date(),
): T[] {
  const targetDate = getDakarDateOffset(dayOffset, now)
  if (!targetDate) return []
  return items.filter(item => validDate(item.date) && item.date === targetDate)
}

export function selectTodayCalendarItems<T extends PublicCalendarItem>(
  items: readonly T[],
  now = new Date(),
): T[] {
  return selectCalendarItemsForDakarDay(items, 0, now)
}

/**
 * Return upcoming scoreboard fixtures that have no pick. These remain plain
 * schedule rows; this helper never computes or adds prediction fields.
 */
export function selectFixtureOnlyItems<T extends PublicCalendarItem>(
  fixtures: readonly T[],
  picks: readonly PublicCalendarItem[] = [],
  now = new Date(),
  startDate?: string,
): T[] {
  if (!Number.isFinite(now.getTime())) return []
  const today = getDakarDateString(now)
  const firstDate = validDate(startDate) ? startDate : today
  const pickedKeys = new Set(picks.filter(hasPick).map(fixtureKey).filter((key): key is string => Boolean(key)))
  const selected = new Map<string, T>()

  for (const fixture of fixtures) {
    if (!validDate(fixture.date) || fixture.date < firstDate || hasPick(fixture)) continue
    const key = fixtureKey(fixture)
    if (!key || pickedKeys.has(key) || selected.has(key)) continue
    selected.set(key, fixture)
  }

  return [...selected.values()].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)) ||
    String(a.time || '').localeCompare(String(b.time || '')) ||
    normalize(a.home).localeCompare(normalize(b.home)),
  )
}
