type MarketHistoryEntry = {
  market?: unknown
  type?: unknown
}

type RecordedPickHistoryEntry = {
  prediction?: unknown
}

export type HistoryResultRow = RecordedPickHistoryEntry & {
  id?: unknown
  date?: unknown
  status?: unknown
  market?: unknown
  type?: unknown
  tier?: unknown
  league?: unknown
  finalScore?: unknown
  score?: unknown
  source?: unknown
}

export type RecordedResultValidation = 'verified' | 'needs-review' | 'pending' | 'no-pick'

export interface PickBucketStats {
  total: number
  won: number
  lost: number
  rate: number
}

export interface RecordedPickStats extends PickBucketStats {
  gold: PickBucketStats
  standard: PickBucketStats
  byType: { btts: PickBucketStats; over25: PickBucketStats }
  daily: Array<{ date: string; total: number; won: number; lost: number; rate: number }>
  trend14: Array<{ date: string; total: number; won: number; lost: number; rate: number }>
  periods: { last7: PickBucketStats; last30: PickBucketStats; season: PickBucketStats; total: PickBucketStats }
  noPickCount: number
  unverifiedPickCount: number
  sourceRowCount: number
}

function normalizedMarket(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '') : ''
}

function isBttsMarket(value: unknown): boolean {
  const normalized = normalizedMarket(value)
  return normalized === 'btts' || normalized === 'bothteamstoscore'
}

function isOverMarket(value: unknown): boolean {
  const normalized = normalizedMarket(value)
  return normalized === 'over25' || normalized.startsWith('over25')
}

function isRecordedPick(entry: RecordedPickHistoryEntry): boolean {
  return typeof entry.prediction === 'string' && entry.prediction.trim().length > 0
}

function scoreParts(value: unknown): [number, number] | null {
  if (typeof value !== 'string') return null
  const match = value.match(/^\s*(\d+)\s*[-–:]\s*(\d+)\s*$/)
  return match ? [Number(match[1]), Number(match[2])] : null
}

function pickedYes(value: unknown): boolean | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  if (['yes', 'oui', 'over', 'btts yes'].includes(normalized)) return true
  if (['no', 'non', 'under', 'btts no'].includes(normalized)) return false
  return null
}

/**
 * Check whether a stored result status agrees with its recorded pick and score.
 * Missing or ambiguous evidence is never called verified; this display check
 * does not alter the source row or its stored status.
 */
export function validateRecordedResult(row: HistoryResultRow): RecordedResultValidation {
  if (!isRecordedPick(row)) return 'no-pick'

  const status = typeof row.status === 'string' ? row.status.trim().toUpperCase() : ''
  if (status === 'PENDING') return 'pending'
  if (status !== 'WON' && status !== 'LOST') return 'needs-review'

  const markets = [row.type, row.market]
  const btts = markets.some(isBttsMarket)
  const over = markets.some(isOverMarket)
  if (btts === over) return 'needs-review'

  const score = scoreParts(row.finalScore ?? row.score)
  const prediction = pickedYes(row.prediction)
  if (!score || prediction === null) return 'needs-review'

  const outcome = btts ? score[0] > 0 && score[1] > 0 : score[0] + score[1] >= 3
  const expectedStatus = prediction === outcome ? 'WON' : 'LOST'
  return status === expectedStatus ? 'verified' : 'needs-review'
}

export function selectBttsHistory<T extends MarketHistoryEntry>(history: readonly T[]): T[] {
  return history.filter(entry => isBttsMarket(entry.type) || isBttsMarket(entry.market))
}

/** Split displayable pick rows from rows with no recorded selection, without mutating source data. */
export function partitionRecordedPickHistory<T extends RecordedPickHistoryEntry>(history: readonly T[]): {
  withPick: T[]
  noPickCount: number
} {
  const withPick: T[] = []
  let noPickCount = 0
  for (const entry of history) {
    if (isRecordedPick(entry)) withPick.push(entry)
    else noPickCount++
  }
  return { withPick, noPickCount }
}

function summarizeRows(rows: readonly HistoryResultRow[]): PickBucketStats {
  const won = rows.filter(row => row.status === 'WON').length
  const lost = rows.filter(row => row.status === 'LOST').length
  const total = won + lost
  return { total, won, lost, rate: total ? +(won / total * 100).toFixed(1) : 0 }
}

/** Summarize only recorded picks whose stored status agrees with their score. */
export function summarizeRecordedPickHistory(
  history: readonly HistoryResultRow[],
  options: { asOf?: number; trackingStart?: string } = {},
): RecordedPickStats {
  const { withPick, noPickCount } = partitionRecordedPickHistory(history)
  const pickedResultRows = withPick.filter(row => row.status === 'WON' || row.status === 'LOST')
  const rows = pickedResultRows.filter(row => validateRecordedResult(row) === 'verified')
  const unverifiedPickCount = pickedResultRows.length - rows.length
  const bttsRows = rows.filter(row => isBttsMarket(row.type) || isBttsMarket(row.market))
  const overRows = rows.filter(row => [row.type, row.market].some(isOverMarket))
  const goldRows = rows.filter(row => typeof row.tier === 'string' && row.tier.toUpperCase() === 'GOLD')
  const standardRows = rows.filter(row => !row.tier || typeof row.tier !== 'string' || row.tier.toUpperCase() !== 'GOLD')

  const dailyMap = new Map<string, HistoryResultRow[]>()
  for (const row of rows) {
    if (typeof row.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) continue
    const dayRows = dailyMap.get(row.date) || []
    dayRows.push(row)
    dailyMap.set(row.date, dayRows)
  }
  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayRows]) => ({ date, ...summarizeRows(dayRows) }))
  const trend14 = daily.slice(-14)

  const asOfMs = Number.isFinite(options.asOf) ? (options.asOf as number) : Date.now()
  const asOfDate = new Date(asOfMs)
  asOfDate.setUTCHours(0, 0, 0, 0)
  const dayMs = 24 * 60 * 60 * 1000
  const periodRows = (days: number) => rows.filter(row => {
    if (typeof row.date !== 'string') return false
    const dateMs = Date.parse(`${row.date}T00:00:00Z`)
    return Number.isFinite(dateMs) && dateMs >= asOfDate.getTime() - days * dayMs
  })
  const seasonRows = options.trackingStart
    ? rows.filter(row => typeof row.date === 'string' && row.date >= options.trackingStart!)
    : rows

  return {
    ...summarizeRows(rows),
    gold: summarizeRows(goldRows),
    standard: summarizeRows(standardRows),
    byType: { btts: summarizeRows(bttsRows), over25: summarizeRows(overRows) },
    daily,
    trend14,
    periods: {
      last7: summarizeRows(periodRows(7)),
      last30: summarizeRows(periodRows(30)),
      season: summarizeRows(seasonRows),
      total: summarizeRows(rows),
    },
    noPickCount,
    unverifiedPickCount,
    sourceRowCount: history.length,
  }
}
