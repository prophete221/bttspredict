import { describe, expect, it } from 'vitest'
import { summarizeVisibleBttsPredictions } from '@/lib/btts-today-dashboard-stats'

describe('summarizeVisibleBttsPredictions', () => {
  const predictions = [
    { bttsProb: 0.75, over25Prob: 0.56 },
    { bttsProb: 0.6, over25Prob: 0.72 },
    { bttsProb: 0.4, over25Prob: 0.61 },
    { bttsProb: null, over25Prob: null },
  ]

  it('counts the total and thresholds from the same visible prediction population', () => {
    expect(summarizeVisibleBttsPredictions(predictions)).toEqual({
      total: 4,
      bttsHigh: 2,
      overHigh: 2,
    })
  })

  it('recalculates all values from a filtered visible population', () => {
    const visibleAfterFilter = predictions.filter(match => (match.bttsProb ?? 0) >= 0.6)

    expect(summarizeVisibleBttsPredictions(visibleAfterFilter)).toEqual({
      total: 2,
      bttsHigh: 2,
      overHigh: 1,
    })
  })

  it('returns zero counts for an empty visible list', () => {
    expect(summarizeVisibleBttsPredictions([])).toEqual({
      total: 0,
      bttsHigh: 0,
      overHigh: 0,
    })
  })
})
