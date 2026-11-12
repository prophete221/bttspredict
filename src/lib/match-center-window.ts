export interface MatchCenterWindowItem {
  date: string
  match?: string
  home?: string
  away?: string
  league?: string
  time?: string
  predictions?: readonly unknown[] | null
}

interface PickRecord {
  market: string
  signature: string
  value: unknown
}

interface MatchGroup<T> {
  item: T
  picks: Map<string, PickRecord>
  conflictingMarkets: Set<string>
}

function normalizeIdentity(value: unknown): string {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function normalizeMarket(value: unknown): string {
  const market = normalizeIdentity(value).replace(/[^a-z0-9]/g, '')
  if (market === 'btts') return 'btts'
  if (market === 'o25' || market === 'over25') return 'over25'
  return market
}

/** Lower values are higher-priority competitions for the homepage's current-day cards. */
export function getMatchCenterCompetitionRank(league?: string): number {
  const normalized = normalizeIdentity(league)
  if (/\b(?:champions league|world cup|world cup qualifiers?|european championship|nations league|africa cup of nations|afcon|copa america|asian cup|gold cup)\b/.test(normalized)) return 0
  if (/\b(?:europa league|conference league|europa cup|copa libertadores|copa sudamericana|afc champions league|caf champions league)\b/.test(normalized)) return 1
  if (/\b(?:international friendly|international match|national team friendly)\b/.test(normalized)) return 2
  if (/\b(?:premier league|la liga|laliga|bundesliga|serie a|ligue 1|eredivisie|primeira liga|liga portugal|pro league|premiership|major league soccer|mls|brasileirao|saudi pro league|j1 league|k league)\b/.test(normalized)) return 3
  if (/\b(?:serie b|championship|segunda|division 2|second division|league one|league two|2\. bundesliga)\b/.test(normalized)) return 5
  if (/\b(?:cup|copa|coppa|knockout)\b/.test(normalized)) return 4
  if (/\b(?:club friendly|friendly)\b/.test(normalized)) return 6
  return 4
}

/** Prioritize today's major fixtures; keep other dates and same-tier games chronological. */
export function prioritizeMatchCenterItems<T extends MatchCenterWindowItem>(
  items: readonly T[],
  today: string,
): T[] {
  const timeKey = (value: unknown) => {
    const time = normalizeIdentity(value)
    return /^\d{2}:\d{2}$/.test(time) ? time : '99:99'
  }

  return [...items].sort((a, b) => {
    const dateOrder = a.date.localeCompare(b.date)
    if (dateOrder !== 0) return dateOrder

    if (a.date === today && b.date === today) {
      const priorityOrder = getMatchCenterCompetitionRank(a.league) - getMatchCenterCompetitionRank(b.league)
      if (priorityOrder !== 0) return priorityOrder
    }

    return timeKey(a.time).localeCompare(timeKey(b.time)) ||
      normalizeIdentity(a.match).localeCompare(normalizeIdentity(b.match))
  })
}

function isValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00.000Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

/** Group already-filtered picks into the current Dakar day and later dates. */
export function groupGeminiItemsByDakarDay<T extends MatchCenterWindowItem>(
  items: readonly T[],
  today: string,
): { today: T[]; upcoming: T[] } {
  const groups: { today: T[]; upcoming: T[] } = { today: [], upcoming: [] }
  if (!isValidCalendarDate(today)) return groups

  for (const item of items) {
    if (!isValidCalendarDate(item.date)) continue
    if (item.date === today) groups.today.push(item)
    else if (item.date > today) groups.upcoming.push(item)
  }
  return groups
}

function fixtureIdentity(item: MatchCenterWindowItem): string | null {
  const match = normalizeIdentity(item.match) || [item.home, item.away].map(normalizeIdentity).filter(Boolean).join(' | ')
  if (!match) return null
  return `${item.date}|${match}|${normalizeIdentity(item.league)}`
}

function validPick(value: unknown): PickRecord | null {
  if (!value || typeof value !== 'object') return null
  const pick = value as Record<string, unknown>
  const market = normalizeMarket(pick.market ?? pick.type)
  if (!market) return null
  const signature = [
    normalizeIdentity(pick.prediction),
    typeof pick.proba === 'number' ? String(pick.proba) : '',
    typeof pick.confidence === 'number' ? String(pick.confidence) : '',
  ].join('|')
  return { market, signature, value }
}

/**
 * Keep every upcoming, already validated Gemini pick in chronological order.
 * Past/invalid dates and non-picks are excluded. Duplicate fixture/market rows
 * are merged; conflicting outputs for the same market are withheld, not guessed.
 */
export function selectUpcomingGeminiItems<T extends MatchCenterWindowItem>(
  items: readonly T[],
  dayDiff: (date: string) => number,
): T[] {
  const groups = new Map<string, MatchGroup<T>>()

  for (const item of items) {
    if (!isValidCalendarDate(item.date) || !Array.isArray(item.predictions) || item.predictions.length === 0) continue
    const diff = dayDiff(item.date)
    if (!Number.isFinite(diff) || diff < 0) continue

    const identity = fixtureIdentity(item)
    if (!identity) continue

    let group = groups.get(identity)
    if (!group) {
      group = {
        item: { ...item, predictions: [] } as T,
        picks: new Map(),
        conflictingMarkets: new Set(),
      }
      groups.set(identity, group)
    }

    for (const rawPick of item.predictions) {
      const pick = validPick(rawPick)
      if (!pick || group.conflictingMarkets.has(pick.market)) continue
      const existing = group.picks.get(pick.market)
      if (!existing) {
        group.picks.set(pick.market, pick)
      } else if (existing.signature !== pick.signature) {
        group.picks.delete(pick.market)
        group.conflictingMarkets.add(pick.market)
      }
    }
  }

  const upcoming: T[] = []
  for (const group of groups.values()) {
    const predictions = [...group.picks.entries()]
      .sort(([marketA], [marketB]) => marketA.localeCompare(marketB))
      .map(([, pick]) => pick.value)
    if (predictions.length === 0) continue
    upcoming.push({ ...group.item, predictions } as T)
  }

  return upcoming.sort((a, b) =>
    a.date.localeCompare(b.date) ||
    normalizeIdentity(a.time).localeCompare(normalizeIdentity(b.time)) ||
    normalizeIdentity(a.match).localeCompare(normalizeIdentity(b.match)),
  )
}
