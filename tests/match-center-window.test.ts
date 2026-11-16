import { describe, expect, it } from 'vitest'
import { getMatchCenterCompetitionRank, prioritizeMatchCenterItems, selectUpcomingGeminiItems } from '@/lib/match-center-window'

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

  it('merges distinct markets only for the same fixture and excludes a conflicted market', () => {
    const items = selectUpcomingGeminiItems([
      { date: today, time: '18:00', match: 'Alpha vs Beta', league: 'League', predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.64 }] },
      { date: today, time: '18:00', match: 'Alpha vs Beta', league: 'League', predictions: [{ type: 'Over 2.5', prediction: 'Oui', proba: 0.61 }] },
      { date: today, time: '18:00', match: 'Alpha vs Beta', league: 'League', predictions: [{ type: 'BTTS', prediction: 'Non', proba: 0.64 }] },
      { date: today, time: '19:00', match: 'Alpha vs Beta', league: 'League', predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.64 }] },
    ], () => 0)

    expect(items).toHaveLength(2)
    expect(items[0].predictions).toEqual([{ type: 'Over 2.5', prediction: 'Oui', proba: 0.61 }])
    expect(items[1].predictions).toEqual([{ type: 'BTTS', prediction: 'Oui', proba: 0.64 }])
  })
})
