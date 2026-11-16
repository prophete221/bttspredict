import { describe, expect, it } from 'vitest'
import { filterPredictionsByMarket } from '@/lib/prediction-market-filter'
import { mergeGeminiMarketPicks, type GeminiPrediction } from '@/lib/gemini-predictions'

const btts: GeminiPrediction = { type: 'BTTS', market: 'BTTS', prediction: 'Oui', proba: 0.64 }
const over: GeminiPrediction = { type: 'Over 2.5', market: 'O2.5', prediction: 'Oui', proba: 0.61 }

describe('Gemini public market integrity', () => {
  it('keeps complementary markets and de-duplicates identical copies', () => {
    expect(mergeGeminiMarketPicks([btts, over], [btts])).toEqual([btts, over])
  })

  it('withdraws a market when duplicate feed copies disagree on selection or probability', () => {
    const opposite = { ...btts, prediction: 'Non' as const }
    const changedProbability = { ...btts, proba: 0.65 }
    expect(mergeGeminiMarketPicks([btts], [opposite])).toEqual([])
    expect(mergeGeminiMarketPicks([btts, over], [changedProbability])).toEqual([over])
  })

  it('filters market pages to their exact promise', () => {
    const rows = [
      { id: 'btts', predictions: [btts] },
      { id: 'over', predictions: [over] },
      { id: 'both', predictions: [btts, over] },
    ]
    expect(filterPredictionsByMarket(rows, 'btts').map(row => row.id)).toEqual(['btts', 'both'])
    expect(filterPredictionsByMarket(rows, 'over25').map(row => row.id)).toEqual(['over', 'both'])
    expect(filterPredictionsByMarket(rows, 'combined').map(row => row.id)).toEqual(['both'])
  })

  it('does not present an Over-only fixture as a BTTS pick', () => {
    const japanParaguay = { id: 'japan-paraguay', predictions: [over] }
    expect(filterPredictionsByMarket([japanParaguay], 'btts')).toEqual([])
  })
})
