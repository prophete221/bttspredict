import { describe, expect, it } from 'vitest'
import { buildBttsTodayDashboardData } from '@/lib/btts-today-dashboard-data'
import { getDakarDateString, parseDakarDateTime } from '@/lib/dakar-date'
import { getGeminiPicks } from '@/lib/gemini-predictions'
import { publicFixtureKey } from '@/lib/public-calendar'
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
    {
      match: 'Local Model vs Unverified', home: 'Local Model', away: 'Unverified',
      league: 'League One', date: '2026-11-11', time: '19:00', type: 'BTTS',
      prediction: 'Oui', proba: 0.76, ai_source: 'local-model',
    },
  ],
  predictions: [geminiRow('Over 2.5')],
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

  it('keeps a valid Gemini pick regardless of sample size and carries counts only as description', () => {
    const lowSample = {
      ...geminiRow('BTTS'), matchCountHome: 1, matchCountAway: 0,
      dataQuality: 'LOW', reliabilityScore: 12,
    }
    const result = buildBttsTodayDashboardData({ free: [lowSample] }, now)

    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].aiPicks).toHaveLength(1)
    expect(result.matches[0]).toMatchObject({ matchCountHome: 1, matchCountAway: 0 })
    expect(result.matches[0]).not.toHaveProperty('reliabilityScore')
    expect(result.matches[0]).not.toHaveProperty('dataQuality')
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
    const raw = [
      ...(Array.isArray(currentPublicPredictions.free) ? currentPublicPredictions.free : []),
      ...(Array.isArray(currentPublicPredictions.predictions) ? currentPublicPredictions.predictions : []),
    ]
    // Oracle miroir des règles du builder pour le jour publié : une ligne
    // stricte Gemini n'apparaît sur l'affiche du jour que si son coup d'envoi
    // Africa/Dakar est encore à venir à l'heure de référence (kickoff > buildNow)
    // et lisible — un match déjà commencé (ou à horaire illisible) est retiré,
    // exactement comme buildBttsTodayDashboardData le fait avec son `now`.
    // Sans ce filtre, tout pick programmé avant 12:00 UTC (ex. J.League 10:00)
    // rendait ce test instable selon l'heure du cron (échecs #1493 et #1507).
    const expectedKeys = [...new Set(raw
      .filter(row => {
        if (row.date !== dakarDay || getGeminiPicks(row).length === 0) return false
        const kickoff = parseDakarDateTime(row.date, row.time || '')
        return kickoff !== null && kickoff.getTime() > buildNow.getTime()
      })
      .map(row => publicFixtureKey(row))
      .filter((key): key is string => Boolean(key)))]
    const dashboard = buildBttsTodayDashboardData(currentPublicPredictions, buildNow)

    // An empty day is valid when there is no real Gemini pick to publish.
    expect(dashboard.todayMatches.map(match => match.key).sort()).toEqual(expectedKeys.sort())
    expect(new Set(dashboard.todayMatches.map(match => match.key)).size).toBe(dashboard.todayMatches.length)
    expect(new Set(dashboard.scheduleFixtures.map(fixture => fixture.key)).size).toBe(dashboard.scheduleFixtures.length)
  })

  it('withdraws conflicting markets, keeps different kick-offs separate, excludes started matches and has no J+7 cap', () => {
    const withTeams = (row: ReturnType<typeof geminiRow>, home: string, away: string) => ({ ...row, match: `${home} vs ${away}`, home, away })
    const bttsYes = withTeams(geminiRow('BTTS'), 'Alpha', 'Beta')
    const bttsNo = { ...bttsYes, prediction: 'Non', predictions: [{ ...bttsYes.predictions[0], prediction: 'Non' }] }
    const over = withTeams(geminiRow('Over 2.5'), 'Alpha', 'Beta')
    const differentKickoff = { ...withTeams(geminiRow('BTTS'), 'Alpha', 'Beta'), time: '19:00' }
    const alreadyStarted = { ...withTeams(geminiRow('BTTS'), 'Started', 'Home'), time: '09:00' }
    const farFuture = { ...withTeams(geminiRow('BTTS'), 'Far', 'Future'), date: '2026-12-01', time: '18:00' }
    const result = buildBttsTodayDashboardData({ free: [bttsYes, differentKickoff, alreadyStarted], predictions: [bttsNo, over, farFuture] }, now)

    expect(result.matches.map(match => `${match.home} vs ${match.away}`)).toContain('Alpha vs Beta')
    expect(result.matches.filter(match => match.home === 'Alpha')).toHaveLength(2)
    const firstKickoff = result.matches.find(match => match.home === 'Alpha' && match.time === '18:00')!
    expect(firstKickoff.aiPicks.map(pick => pick.market)).toEqual(['O2.5'])
    expect(result.matches.some(match => match.home === 'Started')).toBe(false)
    expect(result.matches.some(match => match.home === 'Far')).toBe(true)
  })
})
