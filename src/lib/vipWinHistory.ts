export type MainHistoryWin = {
  date: string
  match: string
  status: string
  finalScore?: string
  score?: string
  prediction?: string
  market?: string
  league?: string
  tier?: string
  source?: string
  verifiedAt?: string
}

function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function isWonMainHistoryEntry(value: unknown, now: Date): value is MainHistoryWin {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  const outcome = String(row.status ?? '').trim().toUpperCase()
  const isWon = outcome === 'WON' || outcome === 'GAGNÉ' || outcome === 'GAGNE'
  const today = now.toISOString().slice(0, 10)

  return isWon && isValidDateOnly(row.date) && row.date <= today &&
    typeof row.match === 'string' && row.match.trim().length > 0
}

/** Use only the principal history and retain its completed wins without tier assumptions. */
export function selectWonMainHistoryEntries(records: unknown, now = new Date()): MainHistoryWin[] {
  if (!Array.isArray(records)) return []
  return records
    .filter((record): record is MainHistoryWin => isWonMainHistoryEntry(record, now))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function groupWonMainHistoryByDate(records: MainHistoryWin[]) {
  const groups = new Map<string, MainHistoryWin[]>()
  for (const record of records) {
    const day = groups.get(record.date) ?? []
    day.push(record)
    groups.set(record.date, day)
  }
  return [...groups.entries()]
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .map(([date, dayRecords]) => ({ date, records: dayRecords }))
}
