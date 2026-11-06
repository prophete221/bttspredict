import { describe, expect, it } from 'vitest'
import { selectBttsHistory } from '../src/lib/historyDisplay'

describe('selectBttsHistory', () => {
  it('keeps canonical BTTS markets and excludes Over 2.5 and combined markets', () => {
    const rows = [
      { id: 'canonical', market: 'btts' },
      { id: 'type', type: 'BTTS', market: 'over25' },
      { id: 'long-name', market: 'Both Teams To Score' },
      { id: 'over-key', market: 'over25' },
      { id: 'over-label', type: 'Over 2.5' },
      { id: 'combined', market: 'btts + over25' },
    ]

    expect(selectBttsHistory(rows).map(row => row.id)).toEqual(['canonical', 'type', 'long-name'])
  })

  it('preserves the source order without mutating the input array', () => {
    const rows = [
      { id: 'first', market: 'BTTS' },
      { id: 'hidden', market: 'over25' },
      { id: 'second', type: 'Both Teams To Score' },
    ]
    const original = [...rows]

    expect(selectBttsHistory(rows).map(row => row.id)).toEqual(['first', 'second'])
    expect(rows).toEqual(original)
  })

  it('filters before the caller applies the 100-row display cap', () => {
    const rows = [
      ...Array.from({ length: 120 }, (_, index) => ({ id: `over-${index}`, market: 'over25' })),
      ...Array.from({ length: 105 }, (_, index) => ({ id: `btts-${index}`, market: 'btts' })),
    ]

    expect(selectBttsHistory(rows).slice(0, 100)).toHaveLength(100)
    expect(selectBttsHistory(rows).slice(0, 100)[0].id).toBe('btts-0')
  })
})
