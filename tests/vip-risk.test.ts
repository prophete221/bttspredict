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
    sourceStatus: 'STATUS_SCHEDULED', analyzedAt: new Date(NOW - 60 * 60 * 1000).toISOString(),
    ...overrides,
  }
}

describe('VIP model-specific risk policy', () => {
  it('uses low risk only for fresh high-confidence model estimates corroborated by stable samples', () => {
    expect(assessPickRisk(vip(), NOW)?.level).toBe('FAIBLE')
  })

  it.each(['low', 'medium', 'high'])('preserves genuine model confidence %s without requiring or inventing high', confidence => {
    const assessment = assessPickRisk(vip({ aiConfidence: confidence }), NOW)
    expect(assessment).not.toBeNull()
    expect(assessment?.level).toBe(confidence === 'low' ? 'ÉLEVÉ' : confidence === 'medium' ? 'MODÉRÉ' : 'FAIBLE')
  })

  it('keeps a supported estimate moderate rather than low with exactly eight historical matches', () => {
    expect(assessPickRisk(vip({ probability: 0.72, confidence: 72, empiricalSelectionRate: 0.72,
      homeSelectionRate: 0.72, awaySelectionRate: 0.72, matchCountHome: 8, matchCountAway: 8 }), NOW)?.level).toBe('MODÉRÉ')
  })

  it.each([0.31, 0.65, 0.69])('labels model probability %s elevated even if the observed rate is higher', probability => {
    const assessment = assessPickRisk(vip({ probability, confidence: Math.round(probability * 100),
      empiricalSelectionRate: 0.8, homeSelectionRate: 0.8, awaySelectionRate: 0.8 }), NOW)
    expect(assessment?.level).toBe('ÉLEVÉ')
    expect(assessment?.reasons[0]).toContain('inférieure à 70 %')
  })

  it('never aliases an empirical 80% rate as the Gemini 75% probability of BTTS No', () => {
    const assessment = assessPickRisk(vip({ probability: 0.75, confidence: 75,
      empiricalSelectionRate: 0.8, homeSelectionRate: 0.8, awaySelectionRate: 0.8,
      matchCountHome: 8, matchCountAway: 8 }), NOW)
    expect(assessment?.level).toBe('MODÉRÉ')
    const explanation = assessment?.reasons.join(' ') || ''
    expect(explanation).toContain('Probabilité modèle : 75 %')
    expect(explanation).toContain('équipe A 80 %, équipe B 80 %')
    expect(explanation).not.toContain('Probabilité modèle : 80 %')
    expect(assessment?.policy).toBe('risk-v2-model-specific')
  })

  it.each([[0.001, '0,1 %'], [0.999, '99,9 %'], [0.00001, '<0,01 %'], [0.99999, '>99,99 %']] as const)(
    'discloses model probability %s without rounding it to zero or certainty', (probability, expected) => {
      expect(assessPickRisk(vip({ probability }), NOW)?.reasons.join(' ')).toContain(`Probabilité modèle : ${expected}`)
    })

  it.each([0, 1, -0.1, 1.1])('rejects invalid model probability %s', probability => {
    expect(assessPickRisk(vip({ probability }), NOW)).toBeNull()
  })

  it('rejects empirical fallback instead of inventing a model-supported probability', () => {
    expect(assessPickRisk(vip({ qualityTier: 'fallback', probabilitySource: 'recent-form-empirical', probability: 0.58,
      confidence: null, aiConfidence: 'not_applicable', sourceModel: 'empirical-team-form' }), NOW)).toBeNull()
  })

  it('fails closed when confidence, historical/form sample, quality, source or freshness is invalid', () => {
    for (const overrides of [
      { aiConfidence: 'unknown' }, { formCountHome: 4 }, { matchCountHome: 7 },
      { analyzedAt: 'invalid' }, { dataQuality: 'MEDIUM' }, { dataSource: 'UNKNOWN' },
    ]) expect(assessPickRisk(vip(overrides), NOW)).toBeNull()
  })
})
