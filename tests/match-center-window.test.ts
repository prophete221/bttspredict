import { describe, expect, it } from 'vitest'
import { getMatchCenterCompetitionRank, prioritizeMatchCenterItems } from '@/lib/match-center-window'

const today = '2026-11-12'

describe('Match Center competition priority', () => {
  it('ranks major competitions, international fixtures, top leagues and club friendlies in that order', () => {
    expect(getMatchCenterCompetitionRank("UEFA Women's Champions League")).toBe(0)
    expect(getMatchCenterCompetitionRank('UEFA Europa League')).toBe(1)
    expect(getMatchCenterCompetitionRank('International Friendly')).toBe(2)
    expect(getMatchCenterCompetitionRank('English Premier League')).toBe(3)
    expect(getMatchCenterCompetitionRank('Domestic Cup')).toBe(4)
    expect(getMatchCenterCompetitionRank('Club Friendly')).toBe(6)
  })

  it('shows the most important fixtures first today, keeps same-tier kickoff order, and leaves future dates after today', () => {
    const items = [
      { date: today, time: '06:00', match: 'Friendly Clubs', league: 'Club Friendly' },
      { date: today, time: '20:00', match: 'UCL Late', league: "UEFA Women's Champions League" },
      { date: today, time: '21:00', match: 'Premier League', league: 'English Premier League' },
      { date: '2026-11-13', time: '00:00', match: 'Tomorrow UCL', league: 'UEFA Champions League' },
      { date: today, time: '18:45', match: 'UCL Early', league: "UEFA Women's Champions League" },
      { date: today, time: '10:00', match: 'National Teams', league: 'International Friendly' },
    ]

    expect(prioritizeMatchCenterItems(items, today).map(item => item.match)).toEqual([
      'UCL Early',
      'UCL Late',
      'National Teams',
      'Premier League',
      'Friendly Clubs',
      'Tomorrow UCL',
    ])
  })
})
