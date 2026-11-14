import { describe, expect, it } from 'vitest'
import { publicFixtureKey } from '@/lib/fixture-identity.js'

describe('canonical public fixture identity', () => {
  it('normalizes accents, whitespace and case across sibling market rows', () => {
    const first = publicFixtureKey({
      date: '2026-11-07', league: 'Ligue Élite', home: 'Étoile  Rouge', away: 'AS Dakar',
    })
    const sibling = publicFixtureKey({
      date: '2026-11-07', league: 'LIGUE Elite', home: 'Etoile Rouge', away: 'as   dakar',
    })
    expect(first).toBe(sibling)
  })

  it('keeps same-label fixtures separate across dates, competitions or teams', () => {
    const base = { date: '2026-11-07', league: 'Test League', home: 'Home A', away: 'Away A' }
    const key = publicFixtureKey(base)
    expect(publicFixtureKey({ ...base, date: '2026-11-08' })).not.toBe(key)
    expect(publicFixtureKey({ ...base, league: 'Other League' })).not.toBe(key)
    expect(publicFixtureKey({ ...base, away: 'Away B' })).not.toBe(key)
  })

  it('refuses an incomplete identity rather than falling back to a display label', () => {
    expect(publicFixtureKey({ date: '2026-11-07', league: 'Test League', home: 'Home A' })).toBeNull()
  })
})
