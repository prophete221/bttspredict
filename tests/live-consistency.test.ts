import { beforeEach, describe, expect, it, vi } from 'vitest'
import { localizedPath } from '../src/lib/i18n'

const { getWinHistoryMock } = vi.hoisted(() => ({ getWinHistoryMock: vi.fn() }))
vi.mock('../src/app/historique/getWinHistory', () => ({ getWinHistory: getWinHistoryMock }))

import { getVerifiedHistoryForMatch, verifiedMarketKey } from '../src/lib/matches'

const verifiedRows = [
  { date: '2026-08-08', match: '1. FC Heidenheim 1846 vs VfL Osnabrück', market: 'over25', type: 'Over 2.5', status: 'WON', finalScore: '4-3', score: '4-3' },
  { date: '2026-08-08', match: '1. FC Heidenheim 1846 vs VfL Osnabrück', market: 'btts', type: 'BTTS', status: 'WON', finalScore: '4-3', score: '4-3' },
]

beforeEach(() => {
  getWinHistoryMock.mockReset()
  getWinHistoryMock.mockReturnValue({ geminiOnly: true, history: verifiedRows })
})

describe('live consistency', () => {
  it('matches strictly verified history despite accents and spelling normalization', () => {
    const history = getVerifiedHistoryForMatch(
      '1. FC Heidenheim 1846',
      'VfL Osnabruck',
      '2026-08-08',
    )

    expect(history).toHaveLength(2)
    expect(history.some(entry => verifiedMarketKey(entry.market) === 'btts' && entry.status === 'WON')).toBe(true)
    expect(history.some(entry => verifiedMarketKey(entry.market) === 'over25' && entry.status === 'WON')).toBe(true)
    expect(history.every(entry => entry.finalScore === '4-3')).toBe(true)
  })

  it('never reads history when the payload is not marked Gemini-only', () => {
    getWinHistoryMock.mockReturnValue({ geminiOnly: false, history: verifiedRows })
    expect(getVerifiedHistoryForMatch('1. FC Heidenheim 1846', 'VfL Osnabrück', '2026-08-08')).toEqual([])
  })

  it('keeps localized navigation paths stable', () => {
    expect(localizedPath('/resultats-verifies', 'en')).toBe('/en/resultats-verifies')
    expect(localizedPath('/methodologie', 'ar')).toBe('/ar/methodologie')
    expect(localizedPath('/en/vip', 'fr')).toBe('/vip')
  })
})
