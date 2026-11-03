import { describe, expect, it } from 'vitest'
import { getVerifiedHistoryForMatch, verifiedMarketKey } from '../src/lib/matches'
import { localizedPath } from '../src/lib/i18n'

describe('live consistency', () => {
  it('matches verified history despite accents and spelling normalization', () => {
    const history = getVerifiedHistoryForMatch(
      '1. FC Heidenheim 1846',
      'VfL Osnabruck',
      '2026-08-08',
    )

    expect(history.length).toBeGreaterThanOrEqual(2)
    expect(history.some(entry => verifiedMarketKey(entry.market) === 'btts' && entry.status === 'WON')).toBe(true)
    expect(history.some(entry => verifiedMarketKey(entry.market) === 'over25' && entry.status === 'WON')).toBe(true)
    expect(history.every(entry => entry.finalScore === '4-3')).toBe(true)
  })

  it('keeps localized navigation paths stable', () => {
    expect(localizedPath('/resultats-verifies', 'en')).toBe('/en/resultats-verifies')
    expect(localizedPath('/methodologie', 'ar')).toBe('/ar/methodologie')
    expect(localizedPath('/en/vip', 'fr')).toBe('/vip')
  })
})
