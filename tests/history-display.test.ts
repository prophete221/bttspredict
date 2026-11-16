import { describe, expect, it } from 'vitest'
import {
  partitionRecordedPickHistory,
  selectBttsHistory,
  summarizeRecordedPickHistory,
  validateRecordedResult,
} from '../src/lib/historyDisplay'

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

describe('partitionRecordedPickHistory', () => {
  it('omits rows without a recorded pick, counts them, and preserves source status without mutation', () => {
    const rows = [
      { id: 'pick-won', prediction: 'Oui', status: 'WON' },
      { id: 'no-pick-lost', prediction: '', status: 'LOST' },
      { id: 'no-pick-won', prediction: undefined, status: 'WON' },
      { id: 'pick-lost', prediction: 'Non', status: 'LOST' },
    ]
    const original = rows.map(row => ({ ...row }))
    const result = partitionRecordedPickHistory(rows)
    expect(result.withPick.map(row => row.id)).toEqual(['pick-won', 'pick-lost'])
    expect(result.noPickCount).toBe(2)
    expect(rows).toEqual(original)
    expect(result.withPick.map(row => row.status)).toEqual(['WON', 'LOST'])
  })
})

describe('validateRecordedResult', () => {
  it('keeps BTTS and Over outcomes verified when status matches the pick and score', () => {
    expect(validateRecordedResult({ market: 'btts', prediction: 'Oui', status: 'WON', finalScore: '2-1' })).toBe('verified')
    expect(validateRecordedResult({ market: 'btts', prediction: 'Non', status: 'WON', finalScore: '0-0' })).toBe('verified')
    expect(validateRecordedResult({ market: 'over25', prediction: 'Oui', status: 'LOST', finalScore: '2-0' })).toBe('verified')
    expect(validateRecordedResult({ market: 'over25', prediction: 'Non', status: 'LOST', finalScore: '4-0' })).toBe('verified')
  })

  it('flags a generic status-score mismatch without mutating the source row', () => {
    const row = { market: 'btts', prediction: 'Oui', status: 'WON', finalScore: '0-0' }
    const original = { ...row }
    expect(validateRecordedResult(row)).toBe('needs-review')
    expect(row).toEqual(original)
  })

  it('does not claim verification when score, market, or pick evidence is missing', () => {
    expect(validateRecordedResult({ market: 'btts', prediction: 'Oui', status: 'WON' })).toBe('needs-review')
    expect(validateRecordedResult({ market: 'unknown', prediction: 'Oui', status: 'WON', finalScore: '2-1' })).toBe('needs-review')
    expect(validateRecordedResult({ market: 'btts', prediction: 'Oui', status: 'PENDING', finalScore: '2-1' })).toBe('pending')
    expect(validateRecordedResult({ market: 'btts', prediction: '', status: 'WON', finalScore: '2-1' })).toBe('no-pick')
  })
})

describe('summarizeRecordedPickHistory', () => {
  it('excludes mismatched or unrecorded picks from verified rates', () => {
    const rows = [
      { date: '2026-11-10', market: 'btts', prediction: 'Oui', status: 'WON', tier: 'GOLD', finalScore: '2-1' },
      { date: '2026-11-10', market: 'btts', prediction: 'Non', status: 'LOST', tier: 'STANDARD', finalScore: '0-0' },
      { date: '2026-11-11', market: 'over25', prediction: 'Oui', status: 'LOST', tier: 'STANDARD', finalScore: '2-0' },
      { date: '2026-11-11', market: 'btts', prediction: '', status: 'WON', tier: 'GOLD', finalScore: '2-1' },
      { date: '2026-11-11', market: 'btts', prediction: undefined, status: 'LOST', tier: 'STANDARD', finalScore: '0-1' },
      { date: '2026-11-12', market: 'btts', prediction: 'Oui', status: 'WON', tier: 'GOLD', finalScore: '0-0' },
      { date: '2026-11-12', market: 'btts', prediction: 'Non', status: 'LOST', tier: 'STANDARD', finalScore: '6-0' },
    ]
    const original = rows.map(row => ({ ...row }))
    const summary = summarizeRecordedPickHistory(rows, { asOf: Date.parse('2026-11-13T12:00:00Z') })
    expect(summary).toMatchObject({ total: 2, won: 1, lost: 1, rate: 50, noPickCount: 2, unverifiedPickCount: 3, sourceRowCount: 7 })
    expect(summary.byType.btts).toEqual({ total: 1, won: 1, lost: 0, rate: 100 })
    expect(summary.byType.over25).toEqual({ total: 1, won: 0, lost: 1, rate: 0 })
    expect(summary.gold).toEqual({ total: 1, won: 1, lost: 0, rate: 100 })
    expect(summary.standard).toEqual({ total: 1, won: 0, lost: 1, rate: 0 })
    expect(summary.daily).toEqual([
      { date: '2026-11-10', total: 1, won: 1, lost: 0, rate: 100 },
      { date: '2026-11-11', total: 1, won: 0, lost: 1, rate: 0 },
    ])
    expect(rows).toEqual(original)
  })
})
