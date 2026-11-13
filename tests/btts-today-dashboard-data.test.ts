import { describe, expect, it } from 'vitest'
import { buildBttsTodayDashboardData } from '@/lib/btts-today-dashboard-data'
import { getDakarDateString } from '@/lib/dakar-date'
import { getGeminiPicks } from '@/lib/gemini-predictions'
import currentPublicPredictions from '../public/predictions.json'

const now = new Date('2026-11-11T10:00:00.000Z')
const model = 'gemini-3.5-flash-lite'

function geminiRow(market: 'BTTS' | 'Over 2.5', match = 'Club A vs Club B') {
  const proba = market === 'BTTS' ? 0.64 : 0.61
  return {
    match,
    home: 'Club A',
    away: 'Club B',
    league: 'League One',
    date: '2026-11-11',
    time: '18:00',
    type: market,
    prediction: 'Oui',
    proba,
    ai_source: 'gemini-stats-v1',
    ai_abstain: false,
    ai_model: model,
    ai_response_status: 'pick',
    ai_market: market === 'BTTS' ? 'BTTS' : 'O2.5',
    modelEngine: 'gemini-stats-v1',
    predictions: [{ modelEngine: model, type: market, prediction: 'Oui', proba }],
  }
}

const payload = {
  date: '2026-11-11',
  free: [
    geminiRow('BTTS'),
    geminiRow('BTTS'),
    geminiRow('Over 2.5'),
    {
      match: 'Local Model vs Unverified', home: 'Local Model', away: 'Unverified',
      league: 'League One', date: '2026-11-11', time: '19:00', type: 'BTTS',
      prediction: 'Oui', proba: 0.76, ai_source: 'local-model',
    },
  ],
  fixtures: [
    { home: 'Club A', away: 'Club B', league: 'League One', date: '2026-11-11', time: '18:00' },
    { home: 'Club C', away: 'Club D', league: 'League Two', date: '2026-11-11', time: '20:00' },
    { home: 'Club C', away: 'Club D', league: 'League Two', date: '2026-11-11', time: '20:00' },
    { home: 'Club E', away: 'Club F', league: 'League Three', date: '2026-11-12', time: '16:00' },
  ],
}

describe('today dashboard server data', () => {
  it('keeps the Gemini-only prediction rules and emits each match and fixture once', () => {
    const result = buildBttsTodayDashboardData(payload, now)
    expect(result.todayMatches).toHaveLength(1)
    expect(result.matches.map(match => `${match.home} vs ${match.away}`)).toEqual(['Club A vs Club B'])
    expect(result.todayMatches[0].aiPicks.map(pick => pick.market)).toEqual(['BTTS', 'O2.5'])
    expect(result.matches.some(match => match.home === 'Local Model')).toBe(false)
    expect(result.scheduleFixtures.map(fixture => `${fixture.home} vs ${fixture.away}`)).toEqual(['Club C vs Club D', 'Club E vs Club F'])
    expect(new Set(result.scheduleFixtures.map(fixture => fixture.key)).size).toBe(result.scheduleFixtures.length)
  })

  it('returns a replacement snapshot when the exact same JSON is fetched after hydration', () => {
    const serverSnapshot = buildBttsTodayDashboardData(payload, now)
    const refreshedSnapshot = buildBttsTodayDashboardData(payload, now)
    expect(refreshedSnapshot).toEqual(serverSnapshot)
    expect(refreshedSnapshot.matches).toHaveLength(1)
    expect(refreshedSnapshot.scheduleFixtures).toHaveLength(2)
  })
})

describe('current public calendar day', () => {
  it('prepares exactly the strict Gemini rows currently published for the Dakar date', () => {
    const day = String(currentPublicPredictions.date)
    const buildNow = new Date(`${day}T12:00:00.000Z`)
    const dakarDay = getDakarDateString(buildNow)
    const raw = Array.isArray(currentPublicPredictions.free) ? currentPublicPredictions.free : currentPublicPredictions.predictions
    const expectedKeys = [...new Set(raw
      .filter(row => row.date === dakarDay && getGeminiPicks(row).length > 0)
      .map(row => String(row.match || `${row.home || ''} vs ${row.away || ''} ${row.date || ''}`)))]
    const dashboard = buildBttsTodayDashboardData(currentPublicPredictions, buildNow)

    // An empty day is valid when there is no real Gemini pick to publish.
    expect(dashboard.todayMatches.map(match => match.key).sort()).toEqual(expectedKeys.sort())
    expect(new Set(dashboard.todayMatches.map(match => match.key)).size).toBe(dashboard.todayMatches.length)
    expect(new Set(dashboard.scheduleFixtures.map(fixture => fixture.key)).size).toBe(dashboard.scheduleFixtures.length)
  })
})
