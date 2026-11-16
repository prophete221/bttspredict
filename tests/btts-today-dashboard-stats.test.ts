import { describe, expect, it } from 'vitest'
import { summarizeVisibleBttsPredictions } from '@/lib/btts-today-dashboard-stats'

describe('summarizeVisibleBttsPredictions', () => {
  it('counts every visible pick regardless of its Gemini probability', () => {
    const predictions = [
      { bttsProb: 0.04, over25Prob: 0.99 },
      { bttsProb: 0.6, over25Prob: 0.72 },
      { bttsProb: 0.4, over25Prob: 0.61 },
      { bttsProb: null, over25Prob: null },
    ]

    expect(summarizeVisibleBttsPredictions(predictions)).toEqual({ total: 4 })
  })

  it('returns zero for an empty visible list', () => {
    expect(summarizeVisibleBttsPredictions([])).toEqual({ total: 0 })
  })
})
