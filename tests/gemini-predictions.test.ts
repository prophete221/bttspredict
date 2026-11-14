import { describe, expect, it } from 'vitest'
import { getGeminiPicks, getGeminiProbability, mergeUniqueMarketPicks } from '@/lib/gemini-predictions'

const MODEL = 'gemini-3.5-flash-lite'

function verifiedRow(market: 'BTTS' | 'OVER_25', selection: 'Oui' | 'Non', probability: number) {
  const type = market === 'BTTS' ? 'BTTS' : 'Over 2.5'
  return {
    type,
    prediction: selection,
    proba: probability,
    confidence: Math.round(probability * 100),
    ai_source: 'gemini-stats-v1',
    ai_market: market,
    ai_abstain: false,
    ai_model: MODEL,
    ai_response_status: 'pick',
    modelEngine: 'gemini-stats-v1',
    predictions: [{ type, prediction: selection, proba: probability, modelEngine: MODEL }],
  }
}

describe('Gemini-only market picks', () => {
  it('merges sibling BTTS and Over 2.5 rows for one match without duplicating either market', () => {
    const btts = getGeminiPicks(verifiedRow('BTTS', 'Oui', 0.63))
    const over = getGeminiPicks(verifiedRow('OVER_25', 'Non', 0.58))
    const merged = mergeUniqueMarketPicks(btts, over)

    expect(merged.map(pick => pick.type)).toEqual(['BTTS', 'Over 2.5'])
    expect(merged.map(pick => pick.proba)).toEqual([0.63, 0.58])
    expect(mergeUniqueMarketPicks(merged, over)).toHaveLength(2)
  })

  it('normalizes one explicit Gemini market and preserves its probability', () => {
    const btts = getGeminiPicks(verifiedRow('BTTS', 'Oui', 0.63))
    const over = getGeminiPicks(verifiedRow('OVER_25', 'Non', 0.58))

    expect(btts).toMatchObject([{ market: 'BTTS', type: 'BTTS', prediction: 'Oui', proba: 0.63 }])
    expect(over).toMatchObject([{ market: 'O2.5', type: 'Over 2.5', prediction: 'Non', proba: 0.58 }])
    expect(getGeminiProbability(btts, 'BTTS')).toBe(0.63)
    expect(getGeminiProbability(over, 'O2.5')).toBe(0.58)
  })

  it('rejects local, untagged, or out-of-band empirical fields even when they look like picks', () => {
    expect(getGeminiPicks({
      type: 'BTTS', prediction: 'Oui', proba: 0.70, bttsProb: 0.70,
      ai_source: 'local-empirical-v1', ai_abstain: false,
    })).toEqual([])
    expect(getGeminiPicks({ type: 'BTTS', prediction: 'Oui', proba: 0.64, bttsProb: 0.64 })).toEqual([])
    expect(getGeminiPicks(verifiedRow('BTTS', 'Oui', 0.82))).toEqual([])
  })

  it('rejects legacy hybrid tags, multiple markets, mismatched picks, and unsupported models', () => {
    const valid = verifiedRow('BTTS', 'Oui', 0.63)
    expect(getGeminiPicks({
      ...valid,
      ai_model: undefined,
      ai_response_status: undefined,
      predictions: [
        { type: 'BTTS', prediction: 'Oui', proba: 0.63, modelEngine: 'empirical-form+gemini' },
        { type: 'Over 2.5', prediction: 'Oui', proba: 0.70, modelEngine: 'empirical-form+gemini' },
      ],
    })).toEqual([])
    expect(getGeminiPicks({
      ...valid,
      ai_model: 'other-gemini-model',
    })).toEqual([])
    expect(getGeminiPicks({
      ...valid,
      predictions: [{ type: 'Over 2.5', prediction: 'Oui', proba: 0.63, modelEngine: MODEL }],
    })).toEqual([])
  })

  it('rejects a Gemini abstention, including any stale pick-shaped fields', () => {
    expect(getGeminiPicks({
      ...verifiedRow('BTTS', 'Oui', 0.63),
      ai_abstain: true,
      ai_response_status: 'abstain',
      ai_market: 'ABSTAIN',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.63, modelEngine: MODEL }],
    })).toEqual([])
  })

  it('rejects malformed probabilities and unsupported markets', () => {
    expect(getGeminiPicks({
      ...verifiedRow('BTTS', 'Oui', 0.63),
      ai_market: 'winner',
      predictions: [{ type: 'winner', prediction: 'Home', proba: 0.7, modelEngine: MODEL }],
    })).toEqual([])
  })
})
