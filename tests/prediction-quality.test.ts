import { describe, expect, it } from 'vitest'
import { humanMatchDataAvailabilityLabel, matchDataAvailability } from '@/lib/predictionQuality'

describe('public match-context data availability', () => {
  it('ignores xG, lambdas, local probabilities and model labels', () => {
    expect(matchDataAvailability({
      proba: 0.68,
      xgHome: 1.8,
      xgAway: 1.4,
      analysisData: { homeLambda: 1.8, awayLambda: 1.4 },
      dataQuality: 'HIGH',
      source: 'poisson-v92-real-data',
    })).toBe('insufficient')
  })

  it('uses only the smaller recorded match sample for both teams', () => {
    expect(matchDataAvailability({ matchCountHome: 8, matchCountAway: 6 })).toBe('sufficient')
    expect(matchDataAvailability({ matchCountHome: 8, matchCountAway: 4 })).toBe('limited')
    expect(matchDataAvailability({ matchCountHome: 8, matchCountAway: 3 })).toBe('insufficient')
    expect(matchDataAvailability({ matchCountHome: 8 })).toBe('insufficient')
  })

  it('describes context availability, not a pick confidence or probability', () => {
    expect(humanMatchDataAvailabilityLabel('sufficient')).toBe('Données de matchs récentes disponibles')
    expect(humanMatchDataAvailabilityLabel('limited', 'en')).toBe('Limited match sample')
    expect(humanMatchDataAvailabilityLabel('insufficient', 'ar')).toBe('لا تتوفر مباريات تاريخية كافية')
  })
})
