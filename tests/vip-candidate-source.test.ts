import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  MAX_ANALYSIS_AGE_MS,
  MIN_VIP_PROBABILITY,
  buildVipCandidates,
  markCandidatePublished,
  mergeCandidateStore,
  publicationWindowAt,
  selectApprovedCandidatesForWindow,
  stableCandidateKey,
  writePrivateCandidateStore,
} from '../scripts/vip-candidate-source.mjs'

const NOW = new Date('2026-11-08T12:00:00.000Z')
const TEMP_DIRS: string[] = []

afterEach(() => {
  for (const dir of TEMP_DIRS.splice(0)) rmSync(dir, { recursive: true, force: true })
})

function geminiRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'monza-vs-atalanta-2026-11-08',
    fixtureId: '401234567',
    leagueSlug: 'ita.1',
    homeTeamId: '123',
    awayTeamId: '456',
    sourceKickoffAt: '2026-11-08T23:00:00.000Z',
    sourceStatus: 'STATUS_SCHEDULED',
    matchState: 'STATUS_SCHEDULED',
    home: 'Monza',
    away: 'Atalanta',
    league: 'Serie A',
    date: '2026-11-08',
    time: '23:00',
    status: 'PENDING',
    dataQuality: 'HIGH',
    dataSource: 'ESPN_TEAM_SCHEDULE',
    matchCountHome: 8,
    matchCountAway: 8,
    formHome: { count: 5, bttsRate: 0.7, over25Rate: 0.7 },
    formAway: { count: 5, bttsRate: 0.7, over25Rate: 0.7 },
    ai_source: 'gemini-stats-v1',
    ai_model: 'gemini-3.5-flash-lite',
    ai_response_status: 'pick',
    ai_market: 'BTTS',
    ai_abstain: false,
    ai_reasons: ['Taux observé cohérent', 'Échantillon complet'],
    ai_risks: ['La forme peut varier'],
    ai_confidence: 'high',
    modelEngine: 'gemini-stats-v1',
    type: 'BTTS',
    prediction: 'Oui',
    proba: 0.7,
    confidence: 70,
    empiricalBttsRate: 0.7,
    empiricalOver25Rate: 0.7,
    predictions: [{
      type: 'BTTS',
      prediction: 'Oui',
      confidence: 70,
      proba: 0.7,
      modelEngine: 'gemini-3.5-flash-lite',
      bttsProb: 0.7,
    }],
    ...overrides,
  }
}

function payload(rows = [geminiRow()], overrides: Record<string, unknown> = {}) {
  const analysisExpectedCount = Math.max(rows.length, 1)
  return {
    date: '2026-11-08',
    lastUpdated: '2026-11-08T11:00:00.000Z',
    sourceLastUpdated: '2026-11-08T11:00:00.000Z',
    analysisComplete: true,
    analysisResponseCount: analysisExpectedCount,
    analysisExpectedCount,
    free: rows,
    predictions: rows,
    ...overrides,
  }
}

function fallbackRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'fixture-fallback-2026-11-08', fixtureId: '401234568', leagueSlug: 'ita.1',
    homeTeamId: '123', awayTeamId: '456', sourceKickoffAt: '2026-11-08T23:00:00.000Z',
    status: 'STATUS_SCHEDULED', matchState: 'STATUS_SCHEDULED', sourceStatus: 'STATUS_SCHEDULED',
    home: 'Monza', away: 'Atalanta', league: 'Serie A', date: '2026-11-08', time: '23:00',
    dataQuality: 'HIGH', dataSource: 'ESPN_TEAM_SCHEDULE', matchCountHome: 8, matchCountAway: 8,
    formHome: { count: 5, bttsRate: 0.7, over25Rate: 0.6 },
    formAway: { count: 5, bttsRate: 0.7, over25Rate: 0.6 },
    empiricalBttsRate: 0.7, empiricalOver25Rate: 0.6,
    ...overrides,
  }
}

function fallbackPayload(fixtures = [fallbackRow()], overrides: Record<string, unknown> = {}) {
  return {
    date: '2026-11-08', lastUpdated: '2026-11-08T11:00:00.000Z',
    sourceLastUpdated: '2026-11-08T11:00:00.000Z', analysisComplete: false,
    analysisResponseCount: 0, analysisExpectedCount: 1, vipCandidates: [],
    privateFixtures: fixtures, privateFixturesComplete: true,
    ...overrides,
  }
}

describe('VIP private candidate source', () => {
  it('accepts only complete, high-quality, fresh, future Gemini decisions in supported markets', () => {
    const row = geminiRow({
      ai_market: 'OVER_25',
      type: 'Over 2.5',
      prediction: 'Non',
      proba: 0.72,
      confidence: 72,
      freeMarket: 'BTTS',
      freeSelection: 'Oui',
      empiricalOver25Rate: 0.3,
      formHome: { count: 5, bttsRate: 0.7, over25Rate: 0.3 },
      formAway: { count: 5, bttsRate: 0.7, over25Rate: 0.3 },
      predictions: [{ type: 'Over 2.5', prediction: 'Non', proba: 0.72, confidence: 72, modelEngine: 'gemini-3.5-flash-lite' }],
    })
    const result = buildVipCandidates({
      analysisPayload: { ...payload([]), vipCandidates: [row] },
      freePayload: payload([]),
      now: NOW,
    })
    expect(result.candidates).toHaveLength(1)
    expect(result.candidates[0]).toMatchObject({
      market: 'OVER_25',
      selection: 'NO',
      probability: 0.72,
      confidence: 72,
      status: 'pending_owner_approval',
      matchState: 'PENDING',
      freeMarket: 'BTTS',
      freeSelection: 'YES',
      dataSource: 'ESPN_TEAM_SCHEDULE',
      fixtureId: '401234567', leagueSlug: 'ita.1', homeTeamId: '123', awayTeamId: '456',
      sourceKickoffAt: '2026-11-08T23:00:00.000Z',
    })
    expect(result.candidates[0].candidateKey).toMatch(/^[a-f0-9]{64}$/)
  })

  it('always excludes a selection already present in the free feed', () => {
    const row = geminiRow()
    const result = buildVipCandidates({
      analysisPayload: payload([row]),
      freePayload: payload([row]),
      now: NOW,
    })
    expect(result.candidates).toEqual([])
    expect(result.audit.excludedAlreadyFree).toBe(1)
    expect(result.audit.ownerOutcome).toBe('no_supported_pick')
    expect(result.audit.ownerMessage).toContain('niveau de risque fiables')
  })

  it('does not fall back to free rows when the private VIP candidate array is empty', () => {
    const result = buildVipCandidates({
      analysisPayload: { ...payload([geminiRow()]), vipCandidates: [] },
      freePayload: payload([geminiRow()]),
      now: NOW,
    })
    expect(result.candidates).toEqual([])
    expect(result.audit.inputRows).toBe(0)
  })

  it('publishes only the strongest supported empirical fallback when no strict VIP pick exists', () => {
    const result = buildVipCandidates({ analysisPayload: fallbackPayload(), freePayload: payload([]), now: NOW })
    expect(result.candidates).toHaveLength(1)
    expect(result.candidates[0]).toMatchObject({
      qualityTier: 'fallback', probabilitySource: 'recent-form-empirical',
      market: 'BTTS', selection: 'YES', probability: 0.7, confidence: null,
      aiConfidence: 'not_applicable', riskLevel: 'MODÉRÉ', matchState: 'PENDING',
    })
    expect((result.candidates[0] as any).riskReasons.join(' ')).toContain('Sélection de repli')
    expect(result.audit.ownerOutcome).toBe('fallback_ready_for_automatic_publication')
    expect(result.audit.fallbackRowsEvaluated).toBe(1)
  })

  it('excludes missing empirical rates and exact free-feed duplicates from fallback choices', () => {
    const noRates = buildVipCandidates({
      analysisPayload: fallbackPayload([fallbackRow({
        empiricalBttsRate: null, empiricalOver25Rate: null,
        formHome: { count: 5 }, formAway: { count: 5 },
      })]),
      freePayload: payload([]), now: NOW,
    })
    expect(noRates.candidates).toEqual([])

    const freeDuplicate = buildVipCandidates({
      analysisPayload: fallbackPayload(),
      freePayload: { ...payload([]), free: [{ date: '2026-11-08', league: 'Serie A', home: 'Monza', away: 'Atalanta', type: 'BTTS', prediction: 'Oui' }] } as never,
      now: NOW,
    })
    expect(freeDuplicate.candidates).toHaveLength(1)
    expect(freeDuplicate.candidates[0]).toMatchObject({ market: 'OVER_25', selection: 'YES', qualityTier: 'fallback' })
    expect(freeDuplicate.audit.excludedAlreadyFree).toBe(1)
  })

  it('never replaces a qualifying strict VIP candidate with a fallback', () => {
    const analysis = {
      ...payload([]), vipCandidates: [geminiRow()], privateFixtures: [fallbackRow()], privateFixturesComplete: true,
    }
    const result = buildVipCandidates({ analysisPayload: analysis, freePayload: payload([]), now: NOW })
    expect(result.candidates).toHaveLength(1)
    expect(result.candidates[0].qualityTier).toBe('vip')
  })

  it('rejects an exact free pick, non-high confidence, or a probability unsupported by its market rate', () => {
    const rows = [
      geminiRow({ freeMarket: 'BTTS', freeSelection: 'Oui', id: 'same-pick' }),
      geminiRow({ ai_confidence: 'medium', id: 'not-high' }),
      geminiRow({ proba: 0.7, confidence: 70, predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.7, confidence: 70, modelEngine: 'gemini-3.5-flash-lite' }], empiricalBttsRate: 0.95, formHome: { count: 5, bttsRate: 0.9, over25Rate: 0.7 }, formAway: { count: 5, bttsRate: 1, over25Rate: 0.7 }, id: 'mismatch' }),
      geminiRow({ empiricalBttsRate: 0.8, id: 'inconsistent-aggregate' }),
    ]
    const result = buildVipCandidates({ analysisPayload: payload(rows), freePayload: payload([]), now: NOW })
    expect(result.candidates).toEqual([])
    expect(result.audit.rejected.same_as_free_pick).toBe(1)
    expect(result.audit.rejected.confidence_below_vip_threshold).toBe(1)
    expect(result.audit.rejected.empirical_probability_mismatch).toBe(1)
    expect(result.audit.rejected.empirical_rate_inconsistent_with_team_forms).toBe(1)
  })

  it('evaluates both supported markets on the match, permits the opposite selection, and prefers the market distinct from free', () => {
    const oppositeBtts = geminiRow({
      ai_market: 'BTTS', type: 'BTTS', prediction: 'Non', proba: 0.72, confidence: 72,
      freeMarket: 'BTTS', freeSelection: 'Oui', empiricalBttsRate: 0.3,
      formHome: { count: 5, bttsRate: 0.3, over25Rate: 0.7 },
      formAway: { count: 5, bttsRate: 0.3, over25Rate: 0.7 },
      predictions: [{ type: 'BTTS', prediction: 'Non', proba: 0.72, confidence: 72, modelEngine: 'gemini-3.5-flash-lite' }],
    })
    const over25 = geminiRow({
      ai_market: 'OVER_25', type: 'Over 2.5', prediction: 'Oui', proba: 0.72, confidence: 72,
      freeMarket: 'BTTS', freeSelection: 'Oui', empiricalOver25Rate: 0.72,
      formHome: { count: 5, bttsRate: 0.7, over25Rate: 0.72 },
      formAway: { count: 5, bttsRate: 0.7, over25Rate: 0.72 },
      predictions: [{ type: 'Over 2.5', prediction: 'Oui', proba: 0.72, confidence: 72, modelEngine: 'gemini-3.5-flash-lite' }],
    })
    const invalid = geminiRow({ ai_confidence: 'medium', id: 'not-high' })
    const result = buildVipCandidates({
      analysisPayload: { ...payload([]), vipCandidates: [oppositeBtts, over25, invalid] },
      freePayload: payload([geminiRow()]),
      now: NOW,
    })

    expect(result.candidates).toHaveLength(2)
    expect(result.candidates.map(candidate => candidate.market)).toEqual(['OVER_25', 'BTTS'])
    expect(result.candidates[1]).toMatchObject({ market: 'BTTS', selection: 'NO', freeMarket: 'BTTS', freeSelection: 'YES' })
    expect(result.audit.rejected.confidence_below_vip_threshold).toBe(1)
    expect(result.audit.ownerOutcome).toBe('ready_for_automatic_publication')
  })

  it('requires 70% estimated and empirical support from the aggregate and each team', () => {
    expect(MIN_VIP_PROBABILITY).toBe(0.7)
    const rows = [
      geminiRow({ proba: 0.69, confidence: 69, predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.69, confidence: 69, modelEngine: 'gemini-3.5-flash-lite' }], id: 'estimate-below-70' }),
      geminiRow({ proba: 0.72, confidence: 72, empiricalBttsRate: 0.65, formHome: { count: 5, bttsRate: 0.6, over25Rate: 0.8 }, formAway: { count: 5, bttsRate: 0.7, over25Rate: 0.8 }, predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.72, confidence: 72, modelEngine: 'gemini-3.5-flash-lite' }], id: 'aggregate-below-70' }),
      geminiRow({ proba: 0.78, confidence: 78, empiricalBttsRate: 0.8, formHome: { count: 5, bttsRate: 0.6, over25Rate: 0.8 }, formAway: { count: 5, bttsRate: 1, over25Rate: 0.8 }, predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.78, confidence: 78, modelEngine: 'gemini-3.5-flash-lite' }], id: 'one-team-below-70' }),
      geminiRow({ formHome: { count: 5, over25Rate: 0.8 }, id: 'missing-team-rate' }),
    ]
    const result = buildVipCandidates({ analysisPayload: payload(rows), freePayload: payload([]), now: NOW })
    expect(result.candidates).toEqual([])
    expect(result.audit.rejected.below_high_probability_threshold).toBe(1)
    expect(result.audit.rejected.empirical_rate_below_vip_threshold).toBe(1)
    expect(result.audit.rejected.team_empirical_rate_below_vip_threshold).toBe(1)
    expect(result.audit.rejected.missing_team_empirical_rate).toBe(1)
  })

  it('propagates verified ESPN fixture identity and the exact source kickoff to clean candidates', () => {
    const result = buildVipCandidates({ analysisPayload: { ...payload([]), vipCandidates: [geminiRow()] }, freePayload: payload([]), now: NOW })
    expect(result.candidates[0]).toMatchObject({
      fixtureId: '401234567', leagueSlug: 'ita.1', homeTeamId: '123', awayTeamId: '456',
      sourceKickoffAt: '2026-11-08T23:00:00.000Z', matchState: 'PENDING',
      sourceMatchStatus: 'PENDING',
    })
  })

  it('separates private vipCandidates from public free rows when deduplicating', () => {
    const privateRow = geminiRow({ ai_market: 'OVER_25', type: 'Over 2.5', prediction: 'Oui', freeMarket: 'BTTS', freeSelection: 'Oui', predictions: [{ type: 'Over 2.5', prediction: 'Oui', confidence: 70, proba: 0.7, modelEngine: 'gemini-3.5-flash-lite' }] })
    const accidentalVipOnly = buildVipCandidates({
      analysisPayload: { ...payload([]), vipCandidates: [privateRow] },
      freePayload: { ...payload([]), vipCandidates: [privateRow] }, now: NOW,
    })
    expect(accidentalVipOnly.candidates).toHaveLength(1)
    const actualFree = buildVipCandidates({
      analysisPayload: { ...payload([]), vipCandidates: [privateRow] },
      freePayload: payload([privateRow]), now: NOW,
    })
    expect(actualFree.candidates).toEqual([])
    expect(actualFree.audit.excludedAlreadyFree).toBe(1)
  })

  it('keeps contradictory explicit match-state evidence and shifted kickoff for the same ESPN identity', () => {
    const scheduled = geminiRow()
    const startedWithoutStatus = geminiRow({ status: undefined, matchState: 'STATUS_IN_PROGRESS' })
    const contradictory = buildVipCandidates({
      analysisPayload: { ...payload([scheduled]), freeUpcoming: [startedWithoutStatus] },
      freePayload: payload([]), now: NOW,
    })
    expect(contradictory.candidates).toEqual([])
    expect(contradictory.audit.rejected.match_state_unknown_or_started).toBe(1)

    const rescheduled = geminiRow({ date: '2026-11-09', time: '20:00', sourceKickoffAt: '2026-11-09T20:00:00.000Z' })
    const moved = buildVipCandidates({
      analysisPayload: { ...payload([scheduled]), upcoming: [rescheduled] },
      freePayload: payload([]), now: NOW,
    })
    expect(moved.candidates).toEqual([])
    expect(moved.audit.rejected.kickoff_conflict).toBe(1)
  })

  it('accepts no status only for a strict future kickoff and rejects equal, past, invalid, or mismatched source time', () => {
    const noStatus = geminiRow({ status: undefined, matchState: undefined, sourceStatus: undefined })
    const withoutSourceStatus = buildVipCandidates({ analysisPayload: { ...payload([]), vipCandidates: [noStatus] }, freePayload: payload([]), now: NOW })
    expect(withoutSourceStatus.candidates).toHaveLength(1)
    expect(withoutSourceStatus.candidates[0]).toMatchObject({ matchState: 'PENDING' })
    expect(withoutSourceStatus.candidates[0]).not.toHaveProperty('sourceStatus')
    expect((withoutSourceStatus.candidates[0] as any).riskReasons.join(' ')).toContain('Statut source explicite absent')
    const approvedWithoutSourceState = { ...withoutSourceStatus.candidates[0], status: 'approved', approvedAt: '2026-11-08T15:30:00.000Z' }
    expect(selectApprovedCandidatesForWindow({ candidates: [approvedWithoutSourceState] }, new Date('2026-11-08T16:00:00.000Z'))).toHaveLength(1)
    for (const overrides of [
      { time: '12:00', sourceKickoffAt: '2026-11-08T12:00:00.000Z' },
      { time: '11:59', sourceKickoffAt: '2026-11-08T11:59:00.000Z' },
      { time: '25:99' },
      { sourceKickoffAt: 'not-an-iso-date' },
    ]) {
      const row = geminiRow({ ...noStatus, ...overrides })
      expect(buildVipCandidates({ analysisPayload: { ...payload([]), vipCandidates: [row] }, freePayload: payload([]), now: NOW }).candidates).toEqual([])
    }
  })

  it('uses the exact ESPN kickoff seconds for strict future checks', () => {
    const secondsAfter = geminiRow({ status: undefined, matchState: undefined, sourceStatus: undefined,
      time: '12:00', sourceKickoffAt: '2026-11-08T12:00:30.000Z' })
    const result = buildVipCandidates({ analysisPayload: { ...payload([]), vipCandidates: [secondsAfter] }, freePayload: payload([]), now: NOW })
    expect(result.candidates[0].kickoffAt).toBe('2026-11-08T12:00:30.000Z')
    const exactNow = geminiRow({ status: undefined, matchState: undefined, sourceStatus: undefined,
      time: '12:00', sourceKickoffAt: '2026-11-08T12:00:00.000Z' })
    expect(buildVipCandidates({ analysisPayload: { ...payload([]), vipCandidates: [exactNow] }, freePayload: payload([]), now: NOW }).candidates).toEqual([])
  })

  it('rejects missing/stale packet timestamps and a payload dated for a previous Dakar day', () => {
    const row = geminiRow()
    const missingTime = buildVipCandidates({
      analysisPayload: payload([row], { lastUpdated: undefined, sourceLastUpdated: undefined }),
      freePayload: payload([]),
      now: NOW,
    })
    expect(missingTime.candidates).toEqual([])
    expect(missingTime.audit.freshnessReason).toBe('missing_payload_timestamp')

    const stale = buildVipCandidates({
      analysisPayload: payload([row], { lastUpdated: new Date(NOW.getTime() - MAX_ANALYSIS_AGE_MS - 1).toISOString(), sourceLastUpdated: new Date(NOW.getTime() - MAX_ANALYSIS_AGE_MS - 1).toISOString() }),
      freePayload: payload([]),
      now: NOW,
    })
    expect(stale.candidates).toEqual([])
    expect(stale.audit.freshnessReason).toBe('stale_payload')

    const wrongDay = buildVipCandidates({
      analysisPayload: payload([row], { date: '2026-11-07' }),
      freePayload: payload([]),
      now: NOW,
    })
    expect(wrongDay.candidates).toEqual([])
    expect(wrongDay.audit.freshnessReason).toBe('payload_day_not_current')
  })

  it('fails closed for weak quality, insufficient samples, missing fixture state, or incomplete identity', () => {
    const rows = [
      geminiRow({ dataQuality: 'MEDIUM' }),
      geminiRow({ id: '' }),
      geminiRow({ matchCountAway: 3 }),
      geminiRow({ formHome: { count: 4, bttsRate: 0.7, over25Rate: 0.7 } }),
      geminiRow({ status: undefined, matchState: 'STATUS_IN_PROGRESS' }),
    ]
    const result = buildVipCandidates({ analysisPayload: payload(rows), freePayload: payload([]), now: NOW })
    expect(result.candidates).toEqual([])
    expect(result.audit.rejected.insufficient_data_quality).toBe(1)
    expect(result.audit.rejected.incomplete_fixture).toBe(1)
    expect(result.audit.rejected.incomplete_sample).toBe(2)
    expect(result.audit.rejected.match_state_unknown_or_started).toBe(1)
  })

  it('rejects postponed, started, malformed, or unsupported-market picks', () => {
    const rows = [
      geminiRow({ status: 'POSTPONED', id: 'postponed' }),
      geminiRow({ time: '11:59', sourceKickoffAt: '2026-11-08T11:59:00.000Z', id: 'started' }),
      geminiRow({ ai_market: 'EXACT_SCORE', type: 'Exact score', id: 'unsupported' }),
      geminiRow({ time: '25:99', id: 'bad-time' }),
    ]
    const result = buildVipCandidates({ analysisPayload: payload(rows), freePayload: payload([]), now: NOW })
    expect(result.candidates).toEqual([])
    expect(result.audit.rejected.postponed).toBe(1)
    expect(result.audit.rejected.kickoff_reached).toBe(1)
    expect(result.audit.rejected.incomplete_pick).toBe(1)
    expect(result.audit.rejected.invalid_kickoff).toBe(1)
  })

  it('deduplicates stable match-market-selection keys and preserves prior approval state on reprocessing', () => {
    const row = geminiRow()
    const duplicate = geminiRow({ home: 'MONZA', id: 'different-upstream-id' })
    const first = buildVipCandidates({ analysisPayload: payload([row, duplicate]), freePayload: payload([]), now: NOW })
    expect(first.candidates).toHaveLength(1)
    expect(first.audit.excludedDuplicateKey).toBe(1)
    expect(stableCandidateKey(row)).toBe(stableCandidateKey(duplicate))

    const approved = {
      ...first.candidates[0],
      status: 'approved',
      approvedAt: '2026-11-08T11:30:00.000Z',
    }
    const merged = mergeCandidateStore({ candidates: [approved] }, first.candidates, { now: NOW, audit: first.audit as never })
    expect(merged.added).toBe(0)
    expect(merged.candidates).toHaveLength(1)
    expect(merged.candidates[0]).toMatchObject({ status: 'approved', approvedAt: '2026-11-08T11:30:00.000Z' })
  })

  it('invalidates stale approvals when a fresh run drops or materially changes a candidate', () => {
    const candidate = buildVipCandidates({ analysisPayload: payload(), freePayload: payload([]), now: NOW }).candidates[0]
    const approved = { ...candidate, status: 'approved', approvedAt: '2026-11-08T11:30:00.000Z' }
    const dropped = mergeCandidateStore({ candidates: [approved] }, [], {
      now: NOW,
      audit: { payloadFresh: true, evaluationComplete: true } as never,
    })
    expect(dropped.candidates[0]).toMatchObject({ status: 'ineligible', ineligibleReason: 'not_in_current_eligible_source' })

    const changed = mergeCandidateStore({ candidates: [approved] }, [{ ...candidate, probability: 0.71, confidence: 71 }], {
      now: NOW,
      audit: { payloadFresh: true, evaluationComplete: true } as never,
    })
    expect(changed.candidates[0].status).toBe('pending_owner_approval')
    expect(changed.candidates[0]).not.toHaveProperty('approvedAt')

    const postponed = selectApprovedCandidatesForWindow({ candidates: [{ ...approved, matchState: 'POSTPONED' }] }, new Date('2026-11-08T16:00:00.000Z'))
    expect(postponed).toEqual([])
  })

  it('does not mutate approvals on an incomplete source and preserves an explicit rejection until material changes', () => {
    const candidate = buildVipCandidates({ analysisPayload: payload(), freePayload: payload([]), now: NOW }).candidates[0]
    const approved = { ...candidate, status: 'approved', approvedAt: '2026-11-08T11:30:00.000Z' }
    const rejected = { ...candidate, candidateKey: 'e'.repeat(64), matchId: 'other-match', status: 'rejected', rejectedAt: '2026-11-08T11:35:00.000Z' }

    const incomplete = mergeCandidateStore({ candidates: [approved, rejected] }, [], {
      now: NOW,
      audit: { payloadFresh: false, evaluationComplete: false, freshnessReason: 'analysis_incomplete' } as never,
    })
    expect(incomplete.candidates).toEqual([approved, rejected])

    const rejectedSameKey = { ...candidate, status: 'rejected', rejectedAt: '2026-11-08T11:35:00.000Z' }
    const fresh = mergeCandidateStore({ candidates: [rejectedSameKey] }, [candidate], {
      now: NOW,
      audit: { payloadFresh: true, evaluationComplete: true } as never,
    })
    expect(fresh.candidates[0]).toMatchObject({ status: 'rejected', rejectedAt: rejectedSameKey.rejectedAt })

    const changed = mergeCandidateStore({ candidates: [rejectedSameKey] }, [{ ...candidate, probability: 0.71, confidence: 71 }], {
      now: NOW,
      audit: { payloadFresh: true, evaluationComplete: true } as never,
    })
    expect(changed.candidates[0].status).toBe('pending_owner_approval')
    expect(changed.candidates[0]).not.toHaveProperty('rejectedAt')
  })

  it('defines only the three Dakar windows and returns only manually approved, fresh, unplayed candidates', () => {
    expect(publicationWindowAt(new Date('2026-11-08T00:00:00.000Z'))).toMatchObject({ time: '00:00', timezone: 'Africa/Dakar' })
    expect(publicationWindowAt(new Date('2026-11-08T07:00:00.000Z'))?.time).toBe('07:00')
    expect(publicationWindowAt(new Date('2026-11-08T16:00:00.000Z'))?.time).toBe('16:00')
    expect(publicationWindowAt(new Date('2026-11-08T16:01:00.000Z'))).toBeNull()

    const candidate = {
      ...buildVipCandidates({ analysisPayload: payload(), freePayload: payload([]), now: NOW }).candidates[0],
      status: 'approved',
      approvedAt: '2026-11-08T11:30:00.000Z',
    }
    const store = { candidates: [candidate, { ...candidate, candidateKey: 'published', publishedAt: NOW.toISOString() }] }
    const approvedAtWindow = selectApprovedCandidatesForWindow(store, new Date('2026-11-08T16:00:00.000Z'))
    expect(approvedAtWindow).toHaveLength(1)
    expect(approvedAtWindow[0].candidateKey).toBe(candidate.candidateKey)
    expect(selectApprovedCandidatesForWindow({ candidates: [{ ...candidate, status: 'pending_owner_approval' }] }, new Date('2026-11-08T16:00:00.000Z'))).toEqual([])
    const nextDay = { ...candidate, kickoffAt: '2026-11-09T01:00:00.000Z' }
    const due = selectApprovedCandidatesForWindow({ candidates: [nextDay, { ...nextDay }] }, new Date('2026-11-08T16:00:00.000Z'))
    expect(due).toHaveLength(1)
    expect(due[0].candidateKey).toBe(candidate.candidateKey)
  })

  it('records a sent key once without performing a send', () => {
    const candidate = {
      ...buildVipCandidates({ analysisPayload: payload(), freePayload: payload([]), now: NOW }).candidates[0],
      status: 'approved',
      approvedAt: '2026-11-08T11:30:00.000Z',
    }
    const store = { candidates: [candidate] }
    const published = markCandidatePublished(store, candidate.candidateKey, {
      publishedAt: new Date('2026-11-08T16:00:00.000Z'),
      telegramMessageId: 123,
    })
    expect(published.candidates[0]).toMatchObject({ status: 'published', telegramMessageId: 123 })
    expect(() => markCandidatePublished(published, candidate.candidateKey, { publishedAt: NOW })).toThrow('candidate_not_publishable')
    expect(() => markCandidatePublished(store, candidate.candidateKey, { publishedAt: NOW })).toThrow('telegram_message_id_required')
  })

  it('writes with restrictive local permissions into a private directory only', () => {
    const root = mkdtempSync(join(tmpdir(), 'vip-candidate-test-'))
    TEMP_DIRS.push(root)
    const file = join(root, '.private', 'vip-candidates.json')
    const store = mergeCandidateStore(null, [], { now: NOW, audit: { inputRows: 0 } as never })
    writePrivateCandidateStore(file, store)
    expect(JSON.parse(readFileSync(file, 'utf8'))).toMatchObject({ version: 1, timezone: 'Africa/Dakar', candidates: [] })
    expect(statSync(file).mode & 0o777).toBe(0o600)
    expect(statSync(join(root, '.private')).mode & 0o777).toBe(0o700)
  })
})
