import { describe, expect, it } from 'vitest'
import { assessPickRisk } from '../workers/vip-api/src/vip-risk.js'

const NOW = Date.parse('2026-11-08T16:00:00.000Z')

function vip(overrides: Record<string, unknown> = {}) {
  return {
    qualityTier: 'vip', probabilitySource: 'gemini-estimate', probability: 0.76,
    confidence: 76, aiConfidence: 'high', sourceModel: 'gemini-3.5-flash-lite',
    dataQuality: 'HIGH', dataSource: 'ESPN_TEAM_SCHEDULE',
    matchCountHome: 12, matchCountAway: 11, formCountHome: 5, formCountAway: 5,
    empiricalSelectionRate: 0.76, homeSelectionRate: 0.76, awaySelectionRate: 0.76,
    sourceStatus: 'STATUS_SCHEDULED',
    analyzedAt: new Date(NOW - 60 * 60 * 1000).toISOString(),
    ...overrides,
  }
}

describe('VIP risk policy', () => {
  it('uses low risk only for a fresh, strong VIP estimate supported by stable historical samples', () => {
    expect(assessPickRisk(vip(), NOW)?.level).toBe('FAIBLE')
  })

  it('labels a sound but not exceptional strict VIP pick as moderate risk', () => {
    const candidate = vip({
      probability: 0.72, confidence: 72, empiricalSelectionRate: 0.72,
      homeSelectionRate: 0.72, awaySelectionRate: 0.72, matchCountHome: 8, matchCountAway: 8,
    })
    expect(assessPickRisk(candidate, NOW)?.level).toBe('MODÉRÉ')
  })

  it('never labels a fallback low risk and raises high risk when its observed rate is weak', () => {
    const candidate = vip({
      qualityTier: 'fallback', probabilitySource: 'recent-form-empirical', probability: 0.58,
      confidence: null, aiConfidence: 'not_applicable', sourceModel: 'empirical-team-form',
      empiricalSelectionRate: 0.58, homeSelectionRate: 0.58, awaySelectionRate: 0.58,
    })
    expect(assessPickRisk(candidate, NOW)?.level).toBe('ÉLEVÉ')
  })

  it('allows a well-supported fallback to be moderate, never low', () => {
    const candidate = vip({
      qualityTier: 'fallback', probabilitySource: 'recent-form-empirical', probability: 0.9,
      confidence: null, aiConfidence: 'not_applicable', sourceModel: 'empirical-team-form',
      empiricalSelectionRate: 0.9, homeSelectionRate: 0.9, awaySelectionRate: 0.9,
      matchCountHome: 12, matchCountAway: 12,
    })
    expect(assessPickRisk(candidate, NOW)?.level).toBe('MODÉRÉ')
  })

  it('fails closed when required risk evidence or freshness is absent', () => {
    expect(assessPickRisk(vip({ formCountHome: 4 }), NOW)).toBeNull()
    expect(assessPickRisk(vip({ analyzedAt: 'invalid' }), NOW)).toBeNull()
    expect(assessPickRisk(vip({ dataSource: 'UNKNOWN' }), NOW)).toBeNull()
  })
})
