import { describe, expect, test } from 'vitest'
import { validatePredictionPayload } from '../scripts/validate-predictions.mjs'

const validPrediction = {
  id: 'team-a-vs-team-b-2026-08-12',
  match: 'Team A vs Team B',
  home: 'Team A',
  away: 'Team B',
  league: 'Test League',
  date: '2026-08-12',
  type: 'BTTS',
  prediction: 'Oui',
  proba: 0.64,
  reliabilityScore: 72,
  dataQuality: 'MEDIUM',
  dataSource: 'ESPN_TEAM_SCHEDULE',
  time: '18:00',
}

function payload(overrides = {}) {
  return {
    date: '2026-08-12',
    lastUpdated: '2026-08-12T12:00:00.000Z',
    free: [{ ...validPrediction, ...overrides }],
    vipPreview: [],
  }
}

describe('validatePredictionPayload', () => {
  test('accepte un payload valide avec timestamp et date locale', () => {
    expect(validatePredictionPayload(payload(), {
      today: '2026-08-12',
      requireTimestamp: true,
    })).toEqual([])
  })

  test('refuse un payload dont la date métier est obsolète', () => {
    const errors = validatePredictionPayload(payload(), {
      today: '2026-08-13',
      requireTimestamp: true,
    })
    expect(errors).toContain('top-level date is not Africa/Dakar today')
  })

  test('refuse un match antérieur à la date Africa/Dakar', () => {
    const errors = validatePredictionPayload(payload({ date: '2026-08-11' }), {
      today: '2026-08-12',
      requireTimestamp: true,
    })
    expect(errors).toContain('prediction[0].date is older than Africa/Dakar today')
  })

  test('refuse un coup d’envoi déjà passé le même jour', () => {
    const errors = validatePredictionPayload(payload({ time: '09:00' }), {
      today: '2026-08-12',
      requireTimestamp: true,
      checkKickoff: true,
      now: new Date('2026-08-12T10:00:00.000Z'),
    })
    expect(errors).toContain('prediction[0].time is already started in Africa/Dakar')
  })

  test('refuse un timestamp manquant et une probabilité hors limites', () => {
    const invalid = payload({ proba: 1.2 }) as Omit<ReturnType<typeof payload>, 'lastUpdated'> & {
      lastUpdated?: string
    }
    delete invalid.lastUpdated
    const errors = validatePredictionPayload(invalid, {
      today: '2026-08-12',
      requireTimestamp: true,
    })
    expect(errors).toContain('lastUpdated must be an ISO UTC timestamp')
    expect(errors).toContain('prediction[0].proba must be between 0 and 1')
  })

  test('accepte un payload vide lorsque le moteur s’abstient faute de données suffisantes', () => {
    expect(validatePredictionPayload({
      date: '2026-08-12',
      lastUpdated: '2026-08-12T12:00:00.000Z',
      free: [],
      vipPreview: [],
    }, { today: '2026-08-12', requireTimestamp: true })).toEqual([])
  })

  test('accepte un pick publié uniquement avec une source Gemini explicite', () => {
    expect(validatePredictionPayload(payload({
      ai_source: 'gemini-stats-v1',
      ai_market: 'BTTS',
      ai_abstain: false,
      ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'pick',
      modelEngine: 'gemini-stats-v1',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.64, modelEngine: 'gemini-3.5-flash-lite' }],
    }), { today: '2026-08-12', requireGemini: true })).toEqual([])
  })

  test('exige un pick Gemini vérifié au-delà de la date locale pour la validation de déploiement', () => {
    const empty = { date: '2026-08-12', lastUpdated: '2026-08-12T12:00:00.000Z', free: [] }
    const errors = validatePredictionPayload(empty, {
      today: '2026-08-12',
      requireTimestamp: true,
      requireGemini: true,
      requireFutureGeminiPick: true,
    })
    expect(errors).toContain('at least one verified Gemini pick after Africa/Dakar today is required')
  })

  test('accepte la porte de déploiement uniquement avec un pick Gemini strict sur un match futur', () => {
    const futureGeminiPick = {
      ...validPrediction,
      date: '2026-08-13',
      ai_source: 'gemini-stats-v1',
      ai_market: 'BTTS',
      ai_abstain: false,
      ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'pick',
      modelEngine: 'gemini-stats-v1',
      predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.64, modelEngine: 'gemini-3.5-flash-lite' }],
    }
    expect(validatePredictionPayload({ ...payload(), free: [futureGeminiPick] }, {
      today: '2026-08-12',
      requireTimestamp: true,
      requireGemini: true,
      requireFutureGeminiPick: true,
    })).toEqual([])
  })

  test('permet une publication fixture-only si une rencontre future valide existe', () => {
    const fixtureOnly = {
      date: '2026-08-12',
      lastUpdated: '2026-08-12T12:00:00.000Z',
      free: [],
      fixtures: [{ home: 'Team A', away: 'Team B', league: 'Test League', match: 'Team A vs Team B', date: '2026-08-13', time: '18:00' }],
    }
    expect(validatePredictionPayload(fixtureOnly, {
      today: '2026-08-12',
      requireTimestamp: true,
      requireGemini: true,
      requireScheduledContent: true,
      now: new Date('2026-08-12T12:00:00.000Z'),
    })).toEqual([])
  })

  test('n’accepte pas une fixture comme substitut à l’ancien contrôle strict de pick Gemini', () => {
    const fixtureOnly = {
      date: '2026-08-12',
      lastUpdated: '2026-08-12T12:00:00.000Z',
      free: [],
      fixtures: [{ home: 'Team A', away: 'Team B', league: 'Test League', date: '2026-08-13', time: '18:00' }],
    }
    const errors = validatePredictionPayload(fixtureOnly, {
      today: '2026-08-12',
      requireTimestamp: true,
      requireGemini: true,
      requireFutureGeminiPick: true,
    })
    expect(errors).toContain('at least one verified Gemini pick after Africa/Dakar today is required')
  })

  test('refuse une fixture porteuse de prédiction ou dont le coup d’envoi est déjà passé', () => {
    const invalidFixtures = {
      date: '2026-08-12',
      lastUpdated: '2026-08-12T12:00:00.000Z',
      free: [],
      fixtures: [
        { home: 'Team A', away: 'Team B', league: 'Test League', date: '2026-08-13', time: '18:00', prediction: 'Oui', proba: 0.64 },
        { home: 'Team C', away: 'Team D', league: 'Test League', date: '2026-08-12', time: '09:00' },
      ],
    }
    const errors = validatePredictionPayload(invalidFixtures, {
      today: '2026-08-12',
      requireGemini: true,
      requireScheduledContent: true,
      checkKickoff: true,
      now: new Date('2026-08-12T10:00:00.000Z'),
    })
    expect(errors).toContain('fixtures[0] must not contain prediction fields')
    expect(errors).toContain('fixtures[1].time is already started in Africa/Dakar')
    expect(errors).toContain('at least one verified Gemini pick or valid scheduled fixture after the current time is required')
  })

  test('refuse un pick local même si ses probabilités et sa forme paraissent valides', () => {
    const errors = validatePredictionPayload(payload({
      ai_source: 'local-empirical-v1',
      ai_abstain: false,
      modelEngine: 'local-empirical-v1',
    }), { today: '2026-08-12', requireGemini: true })
    expect(errors).toContain('prediction[0] must contain a verified Gemini pick or explicit abstention')
  })

  test('conserve une abstention Gemini explicite sans aucune valeur de pick', () => {
    const row = {
      ...validPrediction,
      ai_source: 'gemini-stats-v1', ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'abstain', ai_abstain: true, ai_market: 'ABSTAIN',
      modelEngine: 'gemini-stats-v1',
    }
    for (const key of ['prediction', 'proba', 'confidence', 'predictions', 'bttsProb', 'over25Prob'] as const) {
      delete (row as Record<string, unknown>)[key]
    }
    const errors = validatePredictionPayload({
      date: '2026-08-12',
      lastUpdated: '2026-08-12T12:00:00.000Z',
      free: [row],
    }, { today: '2026-08-12', requireTimestamp: true, requireGemini: true })
    expect(errors).toEqual([])
  })

  test('refuse les anciennes probabilités empiriques laissées sur une abstention', () => {
    const row = {
      ...validPrediction,
      ai_source: 'gemini-stats-v1', ai_model: 'gemini-3.5-flash-lite',
      ai_response_status: 'abstain', ai_abstain: true, ai_market: 'ABSTAIN',
      modelEngine: 'gemini-stats-v1', bttsProb: 0.60,
    }
    for (const key of ['prediction', 'proba', 'confidence', 'predictions', 'over25Prob'] as const) {
      delete (row as Record<string, unknown>)[key]
    }
    const stale = { date: '2026-08-12', lastUpdated: '2026-08-12T12:00:00.000Z', free: [row] }
    const errors = validatePredictionPayload(stale, { today: '2026-08-12', requireGemini: true })
    expect(errors).toContain('prediction[0] must contain a verified Gemini pick or explicit abstention')
  })
})
