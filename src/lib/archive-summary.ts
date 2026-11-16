export type RecordedAggregate = {
  total: number
  won: number
  lost: number
  rate: number
}

export type ArchiveSummary = RecordedAggregate & {
  byType: { btts: RecordedAggregate; over25: RecordedAggregate }
}

function readAggregate(value: unknown): RecordedAggregate | null {
  if (!value || typeof value !== 'object') return null
  const { total, won, lost, rate } = value as Record<string, unknown>
  if (typeof total !== 'number' || !Number.isSafeInteger(total) || total <= 0 ||
      typeof won !== 'number' || !Number.isSafeInteger(won) || won < 0 ||
      typeof lost !== 'number' || !Number.isSafeInteger(lost) || lost < 0 ||
      typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0 || rate > 100) return null
  if (won + lost !== total || Math.round((won / total) * 1000) / 10 !== rate) return null
  return { total, won, lost, rate }
}

/** The saved archive rollup has its own scope; it is not a verified-pick summary. */
export function extractArchiveSummary(payload: unknown): ArchiveSummary | null {
  if (!payload || typeof payload !== 'object') return null
  const stats = (payload as { stats?: unknown }).stats
  const overall = readAggregate(stats)
  if (!overall || !stats || typeof stats !== 'object') return null
  const byType = (stats as { byType?: unknown }).byType
  if (!byType || typeof byType !== 'object') return null
  const btts = readAggregate((byType as { btts?: unknown }).btts)
  const over25 = readAggregate((byType as { over25?: unknown }).over25)
  if (!btts || !over25 || btts.total + over25.total !== overall.total ||
      btts.won + over25.won !== overall.won || btts.lost + over25.lost !== overall.lost) return null
  return { ...overall, byType: { btts, over25 } }
}
