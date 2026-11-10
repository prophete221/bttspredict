import { describe, expect, it } from 'vitest'
import {
  filterGeminiCurrentPicks,
  hasCurrentGeminiDecision,
  isCurrentGeminiAbstention,
  isCurrentGeminiPick,
} from '../scripts/filter-gemini-current-picks.mjs'

const MODEL = 'gemini-3.5-flash-lite'
const FIXTURE_A = { id: 'fixture-a', date: '2026-11-07', home: 'Home A', away: 'Away A', league: 'Test League', match: 'Home A vs Away A' }
const FIXTURE_B = { id: 'fixture-b', date: '2026-11-07', home: 'Home B', away: 'Away B', league: 'Test League', match: 'Home B vs Away B' }
const FIXTURE_C = { id: 'fixture-c', date: '2026-11-07', home: 'Home C', away: 'Away C', league: 'Test League', match: 'Home C vs Away C' }

function pick(market: 'BTTS' | 'OVER_25', selection: 'Oui' | 'Non' = 'Oui', proba = 0.62, fixture = FIXTURE_A) {
  const type = market === 'BTTS' ? 'BTTS' : 'Over 2.5'
  return {
    ...fixture,
    type,
    prediction: selection,
    proba,
    confidence: Math.round(proba * 100),
    ai_source: 'gemini-stats-v1',
    ai_market: market,
    ai_abstain: false,
    ai_model: MODEL,
    ai_response_status: 'pick',
    modelEngine: 'gemini-stats-v1',
    predictions: [{ type, prediction: selection, proba, modelEngine: MODEL }],
  }
}

function noPickResponse(status: 'abstain' | 'rejected' = 'abstain', fixture = FIXTURE_B) {
  return {
    ...fixture,
    ai_source: 'gemini-stats-v1',
    ai_model: MODEL,
    ai_response_status: status,
    ai_abstain: true,
    ai_market: 'ABSTAIN',
    modelEngine: 'gemini-stats-v1',
  }
}

function missingResponse(fixture = FIXTURE_C) {
  return { ...fixture, type: 'BTTS', ai_abstain: true, ai_market: 'ABSTAIN' }
}

describe('Gemini-only current feed filter', () => {
  it('keeps only exact-model picks and explicit abstentions, omitting rejected decisions', () => {
    const trusted = pick('BTTS')
    const abstention = noPickResponse('abstain', FIXTURE_B)
    const rejection = noPickResponse('rejected', FIXTURE_C)
    expect(isCurrentGeminiPick(trusted)).toBe(true)
    expect(isCurrentGeminiAbstention(abstention)).toBe(true)
    expect(hasCurrentGeminiDecision(rejection)).toBe(false)

    const result = filterGeminiCurrentPicks({ date: '2026-11-05', free: [trusted, abstention, rejection] })
    expect(result.payload.free.map(row => row.id)).toEqual(['fixture-a', 'fixture-b'])
    expect(result.payload.predictions).toEqual(result.payload.free)
    expect(result.metrics).toMatchObject({ candidates: 3, verifiedDecisions: 2, directPicks: 1, abstentions: 1, rejectedResponses: 1, excluded: 1, published: 2 })
  })

  it('omits missing-response candidates but allows the verified rows to continue', () => {
    const trusted = pick('BTTS')
    const missing = missingResponse()
    expect(hasCurrentGeminiDecision(missing)).toBe(false)
    const result = filterGeminiCurrentPicks({ date: '2026-11-05', free: [trusted, missing] })
    expect(result.payload.free).toEqual([trusted])
    expect(result.metrics).toMatchObject({ candidates: 2, verifiedDecisions: 1, unverifiedOrMissing: 1, published: 1 })
  })

  it('excludes legacy empirical hybrids and mismatched models without failing the feed', () => {
    const legacyHybrid = {
      ...FIXTURE_A,
      type: 'BTTS', prediction: 'Oui', proba: 0.70,
      ai_source: 'gemini-stats-v1', ai_abstain: false, ai_market: 'BOTH', modelEngine: 'gemini-stats-v1',
      predictions: [
        { type: 'BTTS', prediction: 'Oui', proba: 0.70, modelEngine: 'empirical-form+gemini' },
        { type: 'Over 2.5', prediction: 'Oui', proba: 0.72, modelEngine: 'empirical-form+gemini' },
      ],
    }
    const wrongModel = { ...pick('BTTS', 'Oui', 0.62, FIXTURE_B), ai_model: 'other-model' }
    const result = filterGeminiCurrentPicks({ date: '2026-11-05', free: [legacyHybrid, wrongModel] })
    expect(isCurrentGeminiPick(legacyHybrid)).toBe(false)
    expect(result.payload.free).toEqual([])
    expect(result.metrics.unverifiedOrMissing).toBe(2)
  })

  it('rejects abstentions that still carry empirical or Gemini pick fields', () => {
    const stale = { ...noPickResponse(), prediction: 'Oui', proba: 0.62 }
    expect(isCurrentGeminiAbstention(stale)).toBe(false)
    const result = filterGeminiCurrentPicks({ date: '2026-11-05', free: [stale] })
    expect(result.payload.free).toEqual([])
    expect(result.metrics.unverifiedOrMissing).toBe(1)
  })

  it('withholds duplicate or unidentifiable fixtures without blocking other decisions', () => {
    const duplicateA = pick('BTTS', 'Oui', 0.62, FIXTURE_A)
    const duplicateB = pick('OVER_25', 'Non', 0.58, FIXTURE_A)
    const unique = noPickResponse('abstain', FIXTURE_B)
    const unidentifiable = pick('BTTS', 'Oui', 0.60, { ...FIXTURE_C, league: '' })
    const result = filterGeminiCurrentPicks({ date: '2026-11-05', free: [duplicateA, duplicateB, unique, unidentifiable] })
    expect(result.payload.free).toEqual([unique])
    expect(result.metrics).toMatchObject({ duplicateFixtures: 2, unidentifiable: 1, published: 1 })
  })

  it('allows an empty candidate set without creating a local pick', () => {
    const result = filterGeminiCurrentPicks({ date: '2026-11-05', free: [] })
    expect(result.payload.free).toEqual([])
    expect(result.metrics.published).toBe(0)
  })

  it('keeps no-pick scoreboard fixtures separate from Gemini selections', () => {
    const verifiedPick = pick('BTTS', 'Oui', 0.62, FIXTURE_A)
    const fixtureWithNoDecision = { ...FIXTURE_B }
    const malformedPredictionFixture = { ...FIXTURE_C, prediction: 'Oui', proba: 0.62 }
    const result = filterGeminiCurrentPicks({
      date: '2026-11-07',
      free: [verifiedPick],
      fixtures: [FIXTURE_A, fixtureWithNoDecision, malformedPredictionFixture],
      stats: { fixtureCount: 3 },
    })

    expect(result.payload.free).toEqual([verifiedPick])
    expect(result.payload.fixtures).toEqual([fixtureWithNoDecision])
    expect(result.payload.fixtures[0]).not.toHaveProperty('prediction')
    expect(result.payload.fixtures[0]).not.toHaveProperty('predictions')
    expect(result.metrics.fixtureOnly).toBe(1)
    expect(result.payload.stats.fixtureCount).toBe(1)
  })
})
