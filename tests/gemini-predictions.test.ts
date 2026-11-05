import { describe, expect, it } from 'vitest'
import { getGeminiPicks, getGeminiProbability } from '@/lib/gemini-predictions'

describe('Gemini-only market picks', () => {
  it('normalizes the explicit Gemini markets and preserves their probability', () => {
    const picks = getGeminiPicks({
      ai_source: 'gemini-stats-v1',
      ai_abstain: false,
      predictions: [
        { type: 'BTTS', prediction: 'Yes', proba: 0.63, confidence: 63 },
        { type: 'Over 2.5', prediction: 'Non', proba: 0.58, confidence: 58 },
      ],
    })

    expect(picks).toMatchObject([
      { market: 'BTTS', type: 'BTTS', prediction: 'Oui', proba: 0.63 },
      { market: 'O2.5', type: 'Over 2.5', prediction: 'Non', proba: 0.58 },
    ])
    expect(getGeminiProbability(picks, 'BTTS')).toBe(0.63)
    expect(getGeminiProbability(picks, 'O2.5')).toBe(0.58)
  })

  it('rejects local or untagged empirical fields even when they look like picks', () => {
    expect(getGeminiPicks({
      type: 'BTTS',
      prediction: 'Oui',
      proba: 0.82,
      bttsProb: 0.82,
      over25Prob: 0.76,
      ai_source: 'local-empirical-v1',
      ai_abstain: false,
    })).toEqual([])
    expect(getGeminiPicks({ type: 'BTTS', prediction: 'Oui', proba: 0.82, bttsProb: 0.82 })).toEqual([])
  })

  it('rejects a Gemini abstention, including any stale pick-shaped fields', () => {
    expect(getGeminiPicks({
      ai_source: 'gemini-stats-v1',
      ai_abstain: true,
      type: 'BTTS',
      prediction: 'Oui',
      proba: 0.90,
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.90 }],
    })).toEqual([])
  })

  it('rejects malformed probabilities and unsupported markets', () => {
    expect(getGeminiPicks({
      ai_source: 'gemini-stats-v1',
      ai_abstain: false,
      predictions: [
        { type: 'BTTS', prediction: 'Oui', proba: 1.5 },
        { type: 'winner', prediction: 'Home', proba: 0.7 },
        { type: 'Over 2.5', prediction: 'Maybe', proba: 0.7 },
      ],
    })).toEqual([])
  })
})
