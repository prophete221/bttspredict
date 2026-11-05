import { describe, expect, it } from 'vitest'
import { groupWonMainHistoryByDate, selectWonMainHistoryEntries } from '@/lib/vipWinHistory'

const now = new Date('2026-11-05T12:00:00.000Z')
const won = {
  date: '2026-11-03',
  match: 'Verified FC vs United',
  market: 'btts',
  prediction: 'Oui',
  tier: 'GOLD',
  status: 'WON',
  finalScore: '2-1',
}

describe('VIP teaser from principal history', () => {
  it('keeps only past main-history entries whose result is actually WON or GAGNÉ', () => {
    const rows = [
      won,
      { ...won, match: 'French status', status: 'GAGNÉ', tier: 'STANDARD' },
      { ...won, match: 'Unaccented French status', status: 'GAGNE' },
      { ...won, match: 'Loss', status: 'LOST' },
      { ...won, match: 'Pending', status: 'PENDING' },
      { ...won, match: 'Future row', date: '2026-11-06' },
      { ...won, match: 'Invalid date', date: '2026-02-31' },
      { ...won, match: '' },
    ]

    expect(selectWonMainHistoryEntries(rows, now).map((row) => row.match)).toEqual([
      'Verified FC vs United',
      'French status',
      'Unaccented French status',
    ])
  })

  it('does not require a VIP tag and preserves the main-history selection/result fields', () => {
    const selected = selectWonMainHistoryEntries([won], now)
    expect(selected).toEqual([won])
    expect(selected[0]).toMatchObject({ date: '2026-11-03', match: 'Verified FC vs United', prediction: 'Oui', finalScore: '2-1' })
  })

  it('groups winning entries by day, newest first, without losses or pending results', () => {
    const rows = selectWonMainHistoryEntries([
      won,
      { ...won, match: 'Earlier win', date: '2026-11-02' },
      { ...won, match: 'Same day, second win' },
      { ...won, match: 'Same-day loss', status: 'LOST' },
    ], now)
    const groups = groupWonMainHistoryByDate(rows)

    expect(groups.map((group) => [group.date, group.records.length])).toEqual([
      ['2026-11-03', 2],
      ['2026-11-02', 1],
    ])
    expect(groups.flatMap((group) => group.records).every((row) => ['WON', 'GAGNÉ', 'GAGNE'].includes(row.status.toUpperCase()))).toBe(true)
  })

  it('returns an empty list when the principal history is absent or malformed', () => {
    expect(selectWonMainHistoryEntries(undefined, now)).toEqual([])
    expect(selectWonMainHistoryEntries({ history: [won] }, now)).toEqual([])
  })
})
