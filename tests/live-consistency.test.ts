import { afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getVerifiedHistoryForMatch, verifiedMarketKey } from '../src/lib/matches'
import { localizedPath } from '../src/lib/i18n'

const roots: string[] = []

afterEach(() => {
  vi.restoreAllMocks()
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true })
})

describe('live consistency', () => {
  it('matches verified history despite accents and spelling normalization', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'btts-live-consistency-'))
    roots.push(root)
    fs.mkdirSync(path.join(root, 'public'), { recursive: true })
    fs.writeFileSync(path.join(root, 'public', 'win-history.json'), JSON.stringify({ history: [
      { date: '2026-08-08', match: '1. FC Heidenheim 1846 vs VfL Osnabrück', market: 'over25', status: 'WON', finalScore: '4-3' },
      { date: '2026-08-08', match: '1. FC Heidenheim 1846 vs VfL Osnabrück', market: 'btts', status: 'WON', finalScore: '4-3' },
    ] }))
    vi.spyOn(process, 'cwd').mockReturnValue(root)

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
