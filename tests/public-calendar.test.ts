import { describe, expect, it } from 'vitest'
import { selectCalendarItemsForDakarDay, selectFixtureOnlyItems, selectTodayCalendarItems } from '@/lib/public-calendar'

const NOW = new Date('2026-11-10T12:00:00.000Z')

describe('public match calendar separation', () => {
  it('shows only picks dated for today in Africa/Dakar, never future or past picks', () => {
    const rows = [
      { id: 'yesterday', date: '2026-11-09' },
      { id: 'today', date: '2026-11-10' },
      { id: 'tomorrow', date: '2026-11-11' },
      { id: 'invalid', date: '2026-11-31' },
    ]

    expect(selectTodayCalendarItems(rows, NOW).map(row => row.id)).toEqual(['today'])
  })

  it('lists unpicked scoreboard fixtures separately, excludes picks, past dates and malformed rows', () => {
    const fixtures = [
      { id: 'today-fixture', home: 'Dakar FC', away: 'Saint-Louis', league: 'Ligue 1', date: '2026-11-10', time: '16:00' },
      { id: 'tomorrow-fixture', home: 'Kolda', away: 'Thiès', league: 'Ligue 2', date: '2026-11-11', time: '18:30' },
      { id: 'yesterday-fixture', home: 'Past FC', away: 'Old FC', league: 'Ligue 1', date: '2026-11-09', time: '18:30' },
      { id: 'picked-fixture', home: 'Home A', away: 'Away A', league: 'Test League', date: '2026-11-10', time: '20:00' },
      { id: 'duplicate-fixture', home: 'Dakar FC', away: 'Saint-Louis', league: 'Ligue 1', date: '2026-11-10', time: '16:00' },
      { id: 'bad-date', home: 'Bad', away: 'Date', league: 'Ligue 1', date: '2026-11-31', time: '16:00' },
      { id: 'already-a-pick', home: 'Pick FC', away: 'Choice FC', league: 'Ligue 1', date: '2026-11-11', time: '20:00', prediction: 'Oui', proba: 0.61 },
    ]
    const picks = [{
      home: 'Home A', away: 'Away A', league: 'Test League', date: '2026-11-10',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.61 }],
    }]

    const selected = selectFixtureOnlyItems(fixtures, picks, NOW)
    expect(selected.map(row => row.id)).toEqual(['today-fixture', 'tomorrow-fixture'])
    expect(selected.every(row => !Object.hasOwn(row, 'prediction') && !Object.hasOwn(row, 'predictions'))).toBe(true)
  })

  it('uses the Dakar day across midnight and rejects invalid clocks', () => {
    const beforeMidnight = new Date('2026-11-09T23:59:59.999Z')
    expect(selectTodayCalendarItems([
      { date: '2026-11-09' },
      { date: '2026-11-10' },
    ], beforeMidnight)).toHaveLength(1)
    expect(selectTodayCalendarItems([{ date: '2026-11-10' }], new Date(Number.NaN))).toEqual([])
  })

  it('supports tomorrow as a separate target day without leaking today picks', () => {
    const rows = [
      { id: 'today', date: '2026-11-10' },
      { id: 'tomorrow', date: '2026-11-11' },
      { id: 'later', date: '2026-11-12' },
    ]
    expect(selectCalendarItemsForDakarDay(rows, 1, NOW).map(row => row.id)).toEqual(['tomorrow'])
  })
})
