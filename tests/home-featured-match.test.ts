import { describe, expect, it } from 'vitest'
import { getNextGeminiFixture } from '../src/lib/home-featured-match'
import { GEMINI_MODEL_ID } from '../src/lib/gemini-predictions'

function geminiRow(match: string, home: string, away: string, date: string, time: string, market: 'BTTS' | 'Over 2.5', prediction = 'Oui') {
  const proba = market === 'BTTS' ? 0.64 : 0.61
  return {
    match, home, away, date, time, league: 'Test League',
    ai_source: 'gemini-stats-v1',
    ai_abstain: false,
    ai_model: GEMINI_MODEL_ID,
    ai_response_status: 'pick',
    ai_market: market,
    modelEngine: 'gemini-stats-v1',
    type: market,
    prediction,
    proba,
    predictions: [{ type: market, prediction, proba, modelEngine: GEMINI_MODEL_ID }],
  }
}

describe('getNextGeminiFixture', () => {
  const now = new Date('2026-11-16T12:00:00.000Z')

  it('rejects non-Gemini rows even when they contain plausible prediction fields', () => {
    const localRow = {
      ...geminiRow('Local source', 'Alpha', 'Beta', '2026-11-16', '13:00', 'BTTS'),
      ai_source: 'local-model',
    }
    expect(getNextGeminiFixture({ free: [localRow] }, now)).toBeNull()
  })

  it('chooses the soonest future Gemini fixture and merges its validated markets', () => {
    const later = geminiRow('Later', 'Gamma', 'Delta', '2026-11-16', '17:00', 'BTTS')
    const soonestBtts = geminiRow('Soonest', 'Alpha', 'Beta', '2026-11-16', '14:00', 'BTTS')
    const soonestOver = geminiRow('Soonest', 'Alpha', 'Beta', '2026-11-16', '14:00', 'Over 2.5')
    const result = getNextGeminiFixture({ predictions: [later, soonestOver], free: [soonestBtts] }, now)
    expect(result?.home).toBe('Alpha')
    expect(result?.away).toBe('Beta')
    expect(result?.predictions.map(pick => pick.market)).toEqual(['BTTS', 'O2.5'])
  })

  it('withholds a conflicting market instead of silently choosing the last row', () => {
    const bttsYes = geminiRow('Soonest', 'Alpha', 'Beta', '2026-11-16', '14:00', 'BTTS', 'Oui')
    const bttsNo = geminiRow('Soonest', 'Alpha', 'Beta', '2026-11-16', '14:00', 'BTTS', 'Non')
    const over = geminiRow('Soonest', 'Alpha', 'Beta', '2026-11-16', '14:00', 'Over 2.5')
    const result = getNextGeminiFixture({ free: [bttsYes, over], predictions: [bttsNo] }, now)

    expect(result?.predictions.map(pick => pick.market)).toEqual(['O2.5'])
  })

  it('does not fabricate a kickoff when the time is missing and excludes past matches', () => {
    const missingTime = geminiRow('No time', 'Alpha', 'Beta', '2026-11-16', '13:00', 'BTTS')
    missingTime.time = ''
    const past = geminiRow('Past', 'Gamma', 'Delta', '2026-11-16', '11:00', 'BTTS')
    expect(getNextGeminiFixture({ free: [missingTime, past] }, now)).toBeNull()
  })
})
