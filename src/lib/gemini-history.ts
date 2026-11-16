import { getGeminiPicks } from './gemini-predictions'

type HistoryCandidate = Record<string, unknown>

function marketKey(value: unknown): string {
  const market = String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (market === 'btts' || market === 'bothteamstoscore') return 'btts'
  if (market === 'over25' || market === 'o25') return 'over25'
  return ''
}

function selectionKey(value: unknown): string {
  const selection = String(value ?? '').trim().toLowerCase()
  if (selection === 'oui' || selection === 'yes') return 'yes'
  if (selection === 'non' || selection === 'no') return 'no'
  return ''
}

function historyKey(row: HistoryCandidate, pick?: { market?: unknown; prediction?: unknown }): string | null {
  const date = String(row.date ?? '').trim()
  const match = String(row.match ?? '').trim()
  const market = marketKey(pick?.market ?? row.market ?? row.type)
  const prediction = selectionKey(pick?.prediction ?? row.prediction)
  const status = String(row.status ?? '').trim().toUpperCase()
  const score = String(row.finalScore ?? row.score ?? '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !match || !market || !prediction || !['WON', 'LOST'].includes(status) || !score) return null
  return [date, match, market, prediction, status, score].join('|')
}

/**
 * Build keys only for archived rows accepted by the public strict Gemini validator.
 * The key includes the stored result so a different or legacy pick for the same
 * fixture/market cannot borrow Gemini provenance from another archived row.
 */
export function buildStrictGeminiHistoryKeys(archiveRows: readonly HistoryCandidate[]): Set<string> {
  const keys = new Set<string>()
  for (const row of archiveRows) {
    const picks = getGeminiPicks(row)
    if (picks.length !== 1) continue
    const key = historyKey(row, picks[0])
    if (key) keys.add(key)
  }
  return keys
}

export function isStrictGeminiHistoryRow(row: HistoryCandidate, strictKeys: ReadonlySet<string>): boolean {
  const key = historyKey(row)
  return key !== null && strictKeys.has(key)
}

export function selectStrictGeminiHistoryRows<T extends HistoryCandidate>(
  rows: readonly T[],
  strictKeys: ReadonlySet<string>,
): T[] {
  return rows.filter(row => isStrictGeminiHistoryRow(row, strictKeys))
}
