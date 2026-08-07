/**
 * Tests unitaires pour la bibliothèque de prédiction (Phase 8 — single source of truth)
 */
import { describe, test, expect } from 'vitest'
import {
  predictionKey,
  normalizeMarket,
  getProba,
  getConfidence,
  getDataQuality,
  getTier,
  deduplicatePredictions,
  validatePrediction,
  filterByTrackingPeriod,
  countPredictions,
  type Prediction,
} from '@/lib/predictions'

describe('normalizeMarket', () => {
  test('normalizes BTTS variants', () => {
    expect(normalizeMarket('BTTS')).toBe('btts')
    expect(normalizeMarket('btts')).toBe('btts')
    expect(normalizeMarket('Both Teams To Score')).toBe('btts')
  })
  test('normalizes Over 2.5 variants', () => {
    expect(normalizeMarket('Over 2.5')).toBe('over25')
    expect(normalizeMarket('O2.5')).toBe('over25')
    expect(normalizeMarket('over')).toBe('over25')
  })
  test('returns unknown for empty', () => {
    expect(normalizeMarket('')).toBe('unknown')
  })
})

describe('getProba — fallback chain (never 0)', () => {
  test('uses p.proba first', () => {
    const p: Prediction = { proba: 0.85, type: 'BTTS' }
    expect(getProba(p)).toBe(0.85)
  })
  test('falls back to p.probability', () => {
    const p: Prediction = { probability: 0.78, type: 'BTTS' }
    expect(getProba(p)).toBe(0.78)
  })
  test('falls back to analysis.bttsProb if market is BTTS', () => {
    const p: Prediction = { type: 'BTTS', analysis: { bttsProb: 0.72 } }
    expect(getProba(p)).toBe(0.72)
  })
  test('falls back to analysis.over25Prob if market is Over 2.5', () => {
    const p: Prediction = { type: 'Over 2.5', analysis: { over25Prob: 0.68 } }
    expect(getProba(p)).toBe(0.68)
  })
  test('falls back to confidence/100', () => {
    const p: Prediction = { type: 'BTTS', confidence: 70 }
    expect(getProba(p)).toBe(0.70)
  })
  test('returns 0.62 (publication threshold) if nothing available — never 0', () => {
    const p: Prediction = { type: 'BTTS' }
    expect(getProba(p)).toBe(0.62)
  })
  test('clamps proba to minimum 0.62', () => {
    const p: Prediction = { proba: 0.30, type: 'BTTS' }
    expect(getProba(p)).toBe(0.62)
  })
  test('clamps proba to maximum 0.99', () => {
    const p: Prediction = { proba: 1.5, type: 'BTTS' }
    expect(getProba(p)).toBe(0.99)
  })
})

describe('getConfidence — never 0', () => {
  test('uses confidence if available', () => {
    expect(getConfidence({ confidence: 75 })).toBe(75)
  })
  test('calculates from proba if confidence missing', () => {
    expect(getConfidence({ proba: 0.80, type: 'BTTS' })).toBe(80)
  })
  test('minimum 62', () => {
    expect(getConfidence({ type: 'BTTS' })).toBe(62)
  })
})

describe('getTier', () => {
  test('GOLD if proba >= 0.75', () => {
    expect(getTier({ proba: 0.75, type: 'BTTS' })).toBe('GOLD')
    expect(getTier({ proba: 0.85, type: 'Over 2.5' })).toBe('GOLD')
  })
  test('GOLD if proba >= 0.70 + HIGH_BTTS league + BTTS Oui', () => {
    expect(getTier({ proba: 0.70, league: 'Bundesliga', type: 'BTTS', prediction: 'Oui' })).toBe('GOLD')
    expect(getTier({ proba: 0.70, league: 'Eredivisie', type: 'BTTS', prediction: 'Oui' })).toBe('GOLD')
  })
  test('STANDARD if proba >= 0.70 but NOT HIGH_BTTS league', () => {
    expect(getTier({ proba: 0.70, league: 'La Liga', type: 'BTTS', prediction: 'Oui' })).toBe('STANDARD')
  })
  test('STANDARD if proba >= 0.70 + HIGH_BTTS but BTTS Non', () => {
    expect(getTier({ proba: 0.70, league: 'Bundesliga', type: 'BTTS', prediction: 'Non' })).toBe('STANDARD')
  })
  test('STANDARD if proba < 0.70', () => {
    expect(getTier({ proba: 0.65, type: 'BTTS', league: 'Bundesliga', prediction: 'Oui' })).toBe('STANDARD')
  })
  test('respects explicit tier field', () => {
    expect(getTier({ tier: 'GOLD', proba: 0.50 })).toBe('GOLD')
    expect(getTier({ tier: 'gold' })).toBe('GOLD')
  })
})

describe('getDataQuality', () => {
  test('5 if real data + form + lambdas', () => {
    const p: Prediction = {
      analysis: {
        hasRealData: true,
        homeLambda: 1.5,
        awayLambda: 1.2,
        homeForm: { scoredIn: 4, concededIn: 3 },
        awayForm: { scoredIn: 3, concededIn: 4 },
      },
    }
    expect(getDataQuality(p)).toBe(5)
  })
  test('4 if lambdas without form', () => {
    const p: Prediction = { analysis: { homeLambda: 1.5, awayLambda: 1.2 } }
    expect(getDataQuality(p)).toBe(4)
  })
  test('3 if proba present', () => {
    expect(getDataQuality({ proba: 0.65, type: 'BTTS' })).toBe(3)
  })
  test('2 if only confidence', () => {
    expect(getDataQuality({ confidence: 65 })).toBe(2)
  })
  test('1 if nothing', () => {
    expect(getDataQuality({})).toBe(1)
  })
})

describe('predictionKey — stable dedup key', () => {
  test('produces stable key', () => {
    const p1: Prediction = { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS' }
    const p2: Prediction = { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS' }
    expect(predictionKey(p1)).toBe(predictionKey(p2))
  })
  test('different markets produce different keys', () => {
    const p1: Prediction = { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS' }
    const p2: Prediction = { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'Over 2.5' }
    expect(predictionKey(p1)).not.toBe(predictionKey(p2))
  })
  test('different dates produce different keys', () => {
    const p1: Prediction = { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS' }
    const p2: Prediction = { home: 'PSV', away: 'Ajax', date: '2026-08-09', type: 'BTTS' }
    expect(predictionKey(p1)).not.toBe(predictionKey(p2))
  })
  test('case insensitive on team names', () => {
    const p1: Prediction = { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS' }
    const p2: Prediction = { home: 'psv', away: 'AJAX', date: '2026-08-08', type: 'BTTS' }
    expect(predictionKey(p1)).toBe(predictionKey(p2))
  })
})

describe('deduplicatePredictions', () => {
  test('removes exact duplicates', () => {
    const preds: Prediction[] = [
      { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS', proba: 0.70 },
      { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS', proba: 0.75 },
    ]
    const deduped = deduplicatePredictions(preds)
    expect(deduped.length).toBe(1)
    // Keeps the one with highest proba
    expect(deduped[0].proba).toBe(0.75)
  })
  test('keeps different markets for same match', () => {
    const preds: Prediction[] = [
      { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'BTTS', proba: 0.70 },
      { home: 'PSV', away: 'Ajax', date: '2026-08-08', type: 'Over 2.5', proba: 0.65 },
    ]
    const deduped = deduplicatePredictions(preds)
    expect(deduped.length).toBe(2)
  })
  test('handles empty array', () => {
    expect(deduplicatePredictions([])).toEqual([])
  })
})

describe('validatePrediction', () => {
  test('no errors for valid prediction', () => {
    const p: Prediction = { match: 'PSV vs Ajax', date: '2026-08-08', type: 'BTTS' }
    expect(validatePrediction(p)).toEqual([])
  })
  test('error if no match and no home', () => {
    const p: Prediction = { date: '2026-08-08', type: 'BTTS' }
    const errors = validatePrediction(p)
    expect(errors.some(e => e.field === 'match')).toBe(true)
  })
  test('error if verified WON without finalScore', () => {
    const p: Prediction = {
      match: 'PSV vs Ajax', date: '2026-08-08', type: 'BTTS',
      status: 'WON', finalScore: '-',
    }
    const errors = validatePrediction(p)
    expect(errors.some(e => e.field === 'finalScore')).toBe(true)
  })
})

describe('filterByTrackingPeriod', () => {
  const preds: Prediction[] = [
    { home: 'A', date: '2026-08-07', type: 'BTTS' }, // before
    { home: 'B', date: '2026-08-08', type: 'BTTS' }, // start date
    { home: 'C', date: '2026-08-09', type: 'BTTS' }, // after
  ]
  test('filters out predictions before start date', () => {
    const filtered = filterByTrackingPeriod(preds, '2026-08-08')
    expect(filtered.length).toBe(2)
    expect(filtered[0].home).toBe('B')
    expect(filtered[1].home).toBe('C')
  })
})

describe('countPredictions — single source of truth for counters', () => {
  const preds: Prediction[] = [
    { home: 'A', date: '2026-08-08', type: 'BTTS', status: 'WON', finalScore: '2-1', tier: 'GOLD' },
    { home: 'B', date: '2026-08-08', type: 'Over 2.5', status: 'LOST', finalScore: '1-0' },
    { home: 'C', date: '2026-08-08', type: 'BTTS', status: 'PENDING' },
    { home: 'D', date: '2026-08-08', type: 'Over 2.5', status: 'WON', finalScore: '3-2', proba: 0.80, tier: 'GOLD' },
  ]
  const counts = countPredictions(preds)

  test('published = total', () => {
    expect(counts.published).toBe(4)
  })
  test('verified = won + lost (excludes PENDING)', () => {
    expect(counts.verified).toBe(3)
  })
  test('won and lost counts', () => {
    expect(counts.won).toBe(2)
    expect(counts.lost).toBe(1)
  })
  test('pending excluded from verified', () => {
    expect(counts.pending).toBe(1)
  })
  test('gold counts only GOLD verified', () => {
    expect(counts.goldVerified).toBe(2) // A and D, both verified
    expect(counts.goldWon).toBe(2)
    expect(counts.goldLost).toBe(0)
  })
  test('standard counts only STANDARD verified', () => {
    expect(counts.standardVerified).toBe(1) // B
  })
  test('by market counts', () => {
    expect(counts.bttsVerified).toBe(1) // A (B is over25, C is pending)
    expect(counts.over25Verified).toBe(2) // B and D
  })
})
