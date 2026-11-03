import { describe, expect, test } from 'vitest'
import {
  formatDakarDateLabel,
  getDakarDateString,
  parseDakarDateTime,
} from '@/lib/dakar-date'
import {
  formatTime,
  getMatchStatus,
  getTimeUntilMatch,
} from '@/components/bttsbet/LiveTicker'

describe('dates métier Africa/Dakar', () => {
  test('reste sur la date Dakar malgré un fuseau navigateur différent', () => {
    const previousTimezone = process.env.TZ
    process.env.TZ = 'Pacific/Auckland'
    try {
      const now = new Date('2026-08-12T23:30:00.000Z')
      expect(getDakarDateString(now)).toBe('2026-08-12')
      expect(formatDakarDateLabel('2026-08-12', now)).toBe('Auj.')
      expect(formatDakarDateLabel('2026-08-13', now)).toBe('Dem.')
      expect(formatTime('2026-08-12', undefined, now)).toBe('Auj.')
      expect(formatTime('2026-08-13', undefined, now)).toBe('Dem.')
    } finally {
      if (previousTimezone === undefined) delete process.env.TZ
      else process.env.TZ = previousTimezone
    }
  })

  test('calcule upcoming, live et finished selon l’heure Dakar', () => {
    const previousTimezone = process.env.TZ
    process.env.TZ = 'America/Los_Angeles'
    try {
      const now = new Date('2026-08-12T23:30:00.000Z')
      expect(getMatchStatus('2026-08-13', '00:30', now)).toBe('upcoming')
      expect(getMatchStatus('2026-08-12', '23:00', now)).toBe('live')
      expect(getMatchStatus('2026-08-12', '20:00', now)).toBe('finished')
      expect(getTimeUntilMatch('2026-08-13', '00:30', now)).toBe('1h 0min')
    } finally {
      if (previousTimezone === undefined) delete process.env.TZ
      else process.env.TZ = previousTimezone
    }
  })

  test('parse une heure Dakar sans dépendre du fuseau local', () => {
    const parsed = parseDakarDateTime('2026-08-12', '23:30')
    expect(parsed?.toISOString()).toBe('2026-08-12T23:30:00.000Z')
  })
})
