import { describe, expect, it } from 'vitest'
import { isDakarKickoffUpcomingOrUnscheduled } from '@/lib/dakar-date'

describe('Dakar kickoff visibility', () => {
  const now = new Date('2026-11-12T19:00:00.000Z')

  it('excludes a kickoff that has already passed today or is exactly now', () => {
    expect(isDakarKickoffUpcomingOrUnscheduled('2026-11-12', '18:59', now)).toBe(false)
    expect(isDakarKickoffUpcomingOrUnscheduled('2026-11-12', '19:00', now)).toBe(false)
  })

  it('keeps a valid future kickoff and does not invent an unpublished time', () => {
    expect(isDakarKickoffUpcomingOrUnscheduled('2026-11-12', '19:01', now)).toBe(true)
    expect(isDakarKickoffUpcomingOrUnscheduled('2026-11-13', undefined, now)).toBe(true)
    expect(isDakarKickoffUpcomingOrUnscheduled('2026-11-12', '--:--', now)).toBe(true)
  })

  it('rejects malformed published times rather than treating them as kickoffs', () => {
    expect(isDakarKickoffUpcomingOrUnscheduled('2026-11-12', '25:10', now)).toBe(false)
  })
})
