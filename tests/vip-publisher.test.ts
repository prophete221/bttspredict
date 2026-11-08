import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  adminPublicationStatus,
  formatVipMessage,
  publicationConfigured,
  publicationWindowAt,
  publishCandidatesAfterSync,
  publishVipWindow,
  reconcileUnconfirmedClaims,
  verifyLiveFixture,
} from '../workers/vip-api/src/vip-publisher.js'
import { validateCandidate } from '../workers/vip-api/src/vip-candidates.js'

const POLICY = 'verified-auto-v1'
const CHANNEL = '-10012345678'
const BOT_TOKEN = '1234567890:abcdefghijklmnopqrstuvwxyzABCDEFG'
const CONFIG = { UI_ORIGIN: 'https://bttspredict.com', VIP_PUBLICATION_POLICY: POLICY,
  TELEGRAM_BOT_TOKEN: BOT_TOKEN, TELEGRAM_CHANNEL_ID: CHANNEL }

function localD1() {
  const native = new DatabaseSync(':memory:')
  native.exec('PRAGMA foreign_keys = ON')
  for (const filename of ['0005_vip_candidates.sql', '0006_vip_publications.sql']) {
    native.exec(readFileSync(resolve('workers/vip-api/migrations', filename), 'utf8'))
  }
  function prepared(sql: string, values: unknown[] = []) {
    return {
      bind(...args: unknown[]) { return prepared(sql, args) },
      async first() { return native.prepare(sql).get(...(values as never[])) ?? null },
      async all() { return { results: native.prepare(sql).all(...(values as never[])) } },
      async run() {
        const result = native.prepare(sql).run(...(values as never[]))
        return { meta: { changes: Number(result.changes) } }
      },
      sql,
      values,
    }
  }
  const DB = {
    prepare(sql: string) { return prepared(sql) },
    async batch(statements: ReturnType<typeof prepared>[]) {
      native.exec('BEGIN')
      try {
        const results = statements.map(statement => {
          const result = native.prepare(statement.sql).run(...(statement.values as never[]))
          return { meta: { changes: Number(result.changes) } }
        })
        native.exec('COMMIT')
        return results
      } catch (error) {
        native.exec('ROLLBACK')
        throw error
      }
    },
    close() { native.close() },
  }
  return DB
}

async function seedEligible(db: ReturnType<typeof localD1>, kickoffAt: string) {
  const now = Date.parse('2026-11-08T16:00:00.000Z')
  const kickoff = new Date(kickoffAt)
  const date = kickoff.toISOString().slice(0, 10)
  const time = kickoff.toISOString().slice(11, 16)
  const key = createHash('sha256').update([date, 'test-league', 'home-fc', 'away-fc', 'BTTS', 'YES'].join('|')).digest('hex')
  const candidate = {
    candidateKey: key,
    matchId: 'fixture-123', home: 'Home FC', away: 'Away FC', league: 'Test League', date, time,
    matchState: 'SCHEDULED', kickoffAt: kickoff.toISOString(),
    fixtureId: '12345', leagueSlug: 'eng.1', homeTeamId: '100', awayTeamId: '200', sourceKickoffAt: kickoff.toISOString(),
    market: 'BTTS', freeMarket: 'OVER_25', freeSelection: 'YES', selection: 'YES', probability: 0.72,
    confidence: 72, aiConfidence: 'high', dataQuality: 'HIGH', dataSource: 'ESPN_TEAM_SCHEDULE',
    matchCountHome: 8, matchCountAway: 8, formCountHome: 5, formCountAway: 5,
    sourceModel: 'gemini-3.5-flash-lite', homeSelectionRate: 0.72, awaySelectionRate: 0.72,
    empiricalSelectionRate: 0.72, reasons: ['Forme récente cohérente', 'Échantillon vérifié'],
    risks: ['La dynamique peut évoluer'], analyzedAt: '2026-11-08T15:55:00.000Z', status: 'pending_owner_approval',
  }
  const validated = await validateCandidate(candidate, now)
  const syncId = 'github:123456:1'
  const sourceUpdatedAt = '2026-11-08T15:55:00.000Z'
  const generatedAt = sourceUpdatedAt
  const audit = JSON.stringify({ payloadFresh: true, evaluationComplete: true })
  await db.prepare(`INSERT INTO vip_candidate_sync_runs
    (run_id, source_updated_at, generated_at, received_at, candidate_count, accepted_count, audit_json)
    VALUES (?, ?, ?, ?, 1, 1, ?)`)
    .bind(syncId, sourceUpdatedAt, generatedAt, generatedAt, audit).run()
  await db.prepare(`INSERT INTO vip_candidate_sync_state
    (id, last_generated_at, last_source_updated_at, last_sync_id, updated_at)
    VALUES ('vip', ?, ?, ?, ?)`)
    .bind(generatedAt, sourceUpdatedAt, syncId, generatedAt).run()
  await db.prepare(`INSERT INTO vip_candidates
    (candidate_key, material_hash, candidate_json, match_id, kickoff_at, analyzed_at, match_state, status,
     first_seen_at, last_seen_at, last_seen_sync_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_owner_approval', ?, ?, ?)`)
    .bind(key, validated.materialHash, JSON.stringify(validated.candidate), validated.candidate.matchId,
      validated.candidate.kickoffAt, validated.candidate.analyzedAt, validated.candidate.matchState,
      generatedAt, generatedAt, syncId).run()
  return validated.candidate
}

function fakeFetch({ freeRows = [], send = 'ok', fixtureKickoff = kickoffSameDay,
  fixtureStatus = 'scheduled', membership = 'allowed' }:
  { freeRows?: unknown[]; send?: 'ok' | 'timeout' | 'reject'; fixtureKickoff?: string;
    fixtureStatus?: 'scheduled' | 'started'; membership?: 'allowed' | 'denied' } = {}) {
  const calls: string[] = []
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method || 'GET'
    calls.push(`${method} ${url.replace(/bot[^/]+\//, 'bot[redacted]/')}`)
    if (url.includes('/summary?event=')) {
      return Response.json({ header: { id: '12345', competitions: [{
        date: fixtureKickoff, status: { type: { state: fixtureStatus === 'scheduled' ? 'pre' : 'in',
          name: fixtureStatus === 'scheduled' ? 'STATUS_SCHEDULED' : 'STATUS_IN_PROGRESS', completed: false } },
        competitors: [{ homeAway: 'home', team: { id: '100' } }, { homeAway: 'away', team: { id: '200' } }],
      }] } })
    }
    if (url === 'https://bttspredict.com/predictions.json') {
      return Response.json({ lastUpdated: '2026-11-08T15:55:00.000Z', free: freeRows, predictions: freeRows })
    }
    if (url.endsWith('/getMe')) return Response.json({ ok: true, result: { id: 777 } })
    if (url.endsWith('/getChat')) return Response.json({ ok: true, result: { id: CHANNEL, type: 'supergroup' } })
    if (url.endsWith('/getChatMember')) return Response.json({ ok: true, result: membership === 'allowed'
      ? { user: { id: 777 }, status: 'administrator', can_post_messages: true }
      : { user: { id: 777 }, status: 'member', can_post_messages: false } })
    if (url.endsWith('/sendMessage')) {
      if (send === 'timeout') throw new Error('simulated_timeout')
      if (send === 'reject') return Response.json({ ok: false, error_code: 403, description: 'not authorized' })
      return Response.json({ ok: true, result: { message_id: 987, chat: { id: CHANNEL } } })
    }
    throw new Error(`unexpected_external_request:${new URL(url).hostname}`)
  })
  return { fetcher, calls }
}

const runAt = Date.parse('2026-11-08T16:00:00.000Z')
const kickoffSameDay = '2026-11-08T20:00:00.000Z'
const scheduledAt = '2026-11-08T16:00:00.000Z'

const statuses: Array<ReturnType<typeof localD1>> = []
afterEach(() => {
  for (const db of statuses.splice(0)) db.close()
  vi.restoreAllMocks()
})

function freshDb() {
  const db = localD1()
  statuses.push(db)
  return db
}

describe('VIP publication policy', () => {
  it('recognizes only the three Dakar delivery windows and pins the policy configuration', () => {
    expect(publicationWindowAt('2026-11-08T00:00:00.000Z')?.key).toBe('2026-11-08T00:00@Africa/Dakar')
    expect(publicationWindowAt('2026-11-08T07:00:00.000Z')?.key).toBe('2026-11-08T07:00@Africa/Dakar')
    expect(publicationWindowAt(scheduledAt)?.key).toBe('2026-11-08T16:00@Africa/Dakar')
    expect(publicationWindowAt('2026-11-08T16:01:00.000Z')).toBeNull()
    expect(publicationConfigured(CONFIG)).toBe(true)
    expect(publicationConfigured({ ...CONFIG, UI_ORIGIN: 'https://bttspredict.online' })).toBe(false)
    expect(publicationConfigured({ ...CONFIG, VIP_PUBLICATION_POLICY: 'disabled' })).toBe(false)
  })

  it('revalidates live ESPN identity and kickoff, then reserves and publishes exactly one pick atomically', async () => {
    const db = freshDb()
    const candidate = await seedEligible(db, kickoffSameDay)
    const { fetcher, calls } = fakeFetch()
    const clock = vi.fn().mockReturnValue(runAt)
    const result = await publishVipWindow({ ...CONFIG, DB: db }, { scheduledTime: Date.parse(scheduledAt), clock, fetcher })
    expect(result).toMatchObject({ outcome: 'sent', claimed: 1, sent: 1 })
    expect(calls.some(call => call.includes('summary?event=12345'))).toBe(true)
    expect(calls.filter(call => call.includes('/sendMessage'))).toHaveLength(1)
    const publication = await db.prepare('SELECT state, policy_version, snapshot_json, message_text, telegram_message_id FROM vip_publications').first()
    expect(publication).toMatchObject({ state: 'sent', policy_version: POLICY, telegram_message_id: '987' })
    expect(JSON.parse(String(publication?.snapshot_json))).toMatchObject({ candidateKey: candidate.candidateKey, fixtureId: '12345' })
    expect(publication?.message_text).toContain('BTTSPredict — Sélection VIP')
    expect(publication?.message_text).toContain('Estimation Gemini')
    expect(publication?.message_text).toContain('Niveau de risque : MODÉRÉ')
    expect(await db.prepare("SELECT status FROM vip_candidates WHERE candidate_key = ?").bind(candidate.candidateKey).first())
      .toMatchObject({ status: 'published' })
    const duplicate = await publishVipWindow({ ...CONFIG, DB: db }, { scheduledTime: Date.parse(scheduledAt), clock, fetcher })
    expect(duplicate.outcome).toBe('duplicate_window')
    expect(calls.filter(call => call.includes('/sendMessage'))).toHaveLength(1)
  })

  it('queues scheduled syncs but sends a verified manual sync immediately and only once', async () => {
    const scheduledDb = freshDb()
    await seedEligible(scheduledDb, kickoffSameDay)
    const scheduled = fakeFetch()
    const queued = await publishCandidatesAfterSync({ ...CONFIG, DB: scheduledDb }, 'github:123456:1', {
      publishMode: 'scheduled', clock: () => Date.parse('2026-11-08T15:30:00.000Z'), fetcher: scheduled.fetcher,
    })
    expect(queued.outcome).toBe('queued_for_scheduled_window')
    expect(await scheduledDb.prepare('SELECT COUNT(*) AS count FROM vip_publications').first()).toMatchObject({ count: 0 })
    expect(scheduled.calls.filter(call => call.includes('/sendMessage'))).toHaveLength(0)

    const manualDb = freshDb()
    await seedEligible(manualDb, kickoffSameDay)
    const manual = fakeFetch()
    const manualAt = Date.parse('2026-11-08T17:30:00.000Z')
    const result = await publishCandidatesAfterSync({ ...CONFIG, DB: manualDb }, 'github:123456:1', {
      publishMode: 'immediate', clock: () => manualAt, fetcher: manual.fetcher,
    })
    expect(result).toMatchObject({ outcome: 'sent', claimed: 1, sent: 1 })
    expect(manual.calls.filter(call => call.includes('/sendMessage'))).toHaveLength(1)
    const duplicate = await publishCandidatesAfterSync({ ...CONFIG, DB: manualDb }, 'github:123456:1', {
      publishMode: 'immediate', clock: () => manualAt, fetcher: manual.fetcher,
    })
    expect(duplicate.outcome).toBe('duplicate_window')
    expect(manual.calls.filter(call => call.includes('/sendMessage'))).toHaveLength(1)
  })

  it('does not retry a Telegram send with an ambiguous result, even at a later window', async () => {
    const db = freshDb()
    await seedEligible(db, '2026-11-09T09:00:00.000Z')
    const first = fakeFetch({ send: 'timeout', fixtureKickoff: '2026-11-09T09:00:00.000Z' })
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher: first.fetcher,
    })
    expect(result.outcome).toBe('unknown')
    expect(await db.prepare('SELECT state, error_code FROM vip_publications').first()).toMatchObject({
      state: 'unknown', error_code: 'telegram_outcome_unconfirmed',
    })
    const later = fakeFetch({ fixtureKickoff: '2026-11-09T09:00:00.000Z' })
    const next = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse('2026-11-09T00:00:00.000Z'),
      clock: () => Date.parse('2026-11-09T00:00:00.000Z'), fetcher: later.fetcher,
    })
    expect(next.outcome).toBe('no_candidates')
    expect(later.calls.some(call => call.includes('/sendMessage'))).toBe(false)
    expect(await db.prepare('SELECT COUNT(*) AS count FROM vip_publications').first()).toMatchObject({ count: 1 })
  })

  it('sends nothing when the public free feed contains the same market and selection', async () => {
    const db = freshDb()
    const candidate = await seedEligible(db, kickoffSameDay)
    const { fetcher, calls } = fakeFetch({ freeRows: [{
      date: candidate.date, league: candidate.league, home: candidate.home, away: candidate.away,
      type: 'BTTS', prediction: 'Oui',
    }] })
    const result = await publishVipWindow({ ...CONFIG, DB: db }, { scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher })
    expect(result.outcome).toBe('no_candidates')
    expect(calls.some(call => call.includes('/sendMessage'))).toBe(false)
    expect(await db.prepare('SELECT COUNT(*) AS count FROM vip_publications').first()).toMatchObject({ count: 0 })
  })

  it('does not send when the live fixture has started or the bot lacks destination permission', async () => {
    const startedDb = freshDb()
    await seedEligible(startedDb, kickoffSameDay)
    const started = fakeFetch({ fixtureStatus: 'started' })
    const startedResult = await publishVipWindow({ ...CONFIG, DB: startedDb }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher: started.fetcher,
    })
    expect(startedResult.outcome).toBe('no_candidates')
    expect(started.calls.some(call => call.includes('/sendMessage'))).toBe(false)

    const deniedDb = freshDb()
    await seedEligible(deniedDb, kickoffSameDay)
    const denied = fakeFetch({ membership: 'denied' })
    const deniedResult = await publishVipWindow({ ...CONFIG, DB: deniedDb }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher: denied.fetcher,
    })
    expect(deniedResult.outcome).toBe('destination_unavailable')
    expect(denied.calls.some(call => call.includes('/sendMessage'))).toBe(false)
    expect(await deniedDb.prepare('SELECT COUNT(*) AS count FROM vip_publications').first()).toMatchObject({ count: 0 })
  })

  it('quarantines a definitive Telegram rejection and does not try the candidate again', async () => {
    const db = freshDb()
    await seedEligible(db, '2026-11-09T09:00:00.000Z')
    const first = fakeFetch({ send: 'reject', fixtureKickoff: '2026-11-09T09:00:00.000Z' })
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher: first.fetcher,
    })
    expect(result.outcome).toBe('not_sent')
    expect(first.calls.filter(call => call.includes('/sendMessage'))).toHaveLength(1)
    expect(await db.prepare('SELECT state, error_code FROM vip_publications').first()).toMatchObject({
      state: 'not_sent', error_code: 'telegram_403',
    })
    const later = fakeFetch({ fixtureKickoff: '2026-11-09T09:00:00.000Z' })
    const next = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse('2026-11-09T00:00:00.000Z'),
      clock: () => Date.parse('2026-11-09T00:00:00.000Z'), fetcher: later.fetcher,
    })
    expect(next.outcome).toBe('no_candidates')
    expect(later.calls.some(call => call.includes('/sendMessage'))).toBe(false)
  })

  it('validates authoritative fixture identity and formats only evidence-backed BTTS/Over 2.5 claims', async () => {
    const candidate = {
      candidateKey: '1'.repeat(64), matchId: 'fixture', home: 'A', away: 'B', league: 'League',
      date: '2026-11-08', time: '20:00', matchState: 'SCHEDULED', kickoffAt: kickoffSameDay,
      fixtureId: '12345', leagueSlug: 'eng.1', homeTeamId: '100', awayTeamId: '200', sourceKickoffAt: kickoffSameDay,
    }
    const { fetcher } = fakeFetch()
    expect(await verifyLiveFixture(candidate, runAt, fetcher)).toBe(true)
    expect(await verifyLiveFixture({ ...candidate, awayTeamId: '999' }, runAt, fetcher)).toBe(false)
    const message = formatVipMessage({
      ...candidate, market: 'OVER_25', selection: 'NO', confidence: 74,
      qualityTier: 'vip', probabilitySource: 'gemini-estimate', probability: 0.74,
      aiConfidence: 'high', sourceModel: 'gemini-3.5-flash-lite', dataQuality: 'HIGH',
      dataSource: 'ESPN_TEAM_SCHEDULE', analyzedAt: new Date(runAt - 5 * 60_000).toISOString(),
      riskLevel: 'MODÉRÉ', riskReasons: ['Échantillon récent de 5 matchs', 'Analyse fraîche.'], riskPolicy: 'risk-v1',
      empiricalSelectionRate: 0.74, homeSelectionRate: 0.72, awaySelectionRate: 0.76,
      matchCountHome: 8, matchCountAway: 9, formCountHome: 5, formCountAway: 5,
      reasons: ['Taux empiriques vérifiés', 'Forme récente cohérente'], risks: ['Échantillon limité'],
    } as never)
    expect(message).toContain('Under 2,5')
    expect(message).toContain('Niveau de risque : MODÉRÉ')
    expect(message).toContain('pas une garantie')
    expect(message).not.toMatch(/score exact/i)
    const fallbackMessage = formatVipMessage({
      ...candidate, market: 'BTTS', selection: 'YES', qualityTier: 'fallback',
      probabilitySource: 'recent-form-empirical', probability: 0.62, confidence: null,
      aiConfidence: 'not_applicable', empiricalSelectionRate: 0.62,
      homeSelectionRate: 0.6, awaySelectionRate: 0.64,
      matchCountHome: 8, matchCountAway: 8, formCountHome: 5, formCountAway: 5,
      riskLevel: 'ÉLEVÉ', riskReasons: ['Sélection de repli sous le seuil VIP renforcé.', 'Taux observé inférieur à 65 %.'],
      reasons: ['Taux empirique observé', 'Forme récente mesurée'], risks: ['Échantillon court'],
    } as never)
    expect(fallbackMessage).toContain('Sélection de repli')
    expect(fallbackMessage).toContain('Niveau de risque : ÉLEVÉ')
    expect(fallbackMessage).toContain('aucune confiance Gemini revendiquée')
  })

  it('reconciles abandoned claims to a quarantine state without making them retryable', async () => {
    const db = freshDb()
    await seedEligible(db, kickoffSameDay)
    await db.prepare(`INSERT INTO vip_publication_runs (window_key, policy_version, scheduled_at, started_at, state)
      VALUES ('2026-11-08T16:00@Africa/Dakar', ?, ?, ?, 'running')`)
      .bind(POLICY, scheduledAt, '2026-11-08T15:40:00.000Z').run()
    const candidate = await db.prepare('SELECT candidate_key, material_hash, candidate_json, last_seen_sync_id FROM vip_candidates').first()
    await db.prepare(`INSERT INTO vip_publications
      (candidate_key, window_key, claim_token, policy_version, material_hash, source_sync_id, snapshot_json, message_text, state, claimed_at)
      VALUES (?, '2026-11-08T16:00@Africa/Dakar', 'claim', ?, ?, ?, ?, 'test', 'claimed', ?)`)
      .bind(candidate?.candidate_key, POLICY, candidate?.material_hash, candidate?.last_seen_sync_id, candidate?.candidate_json, '2026-11-08T15:40:00.000Z').run()
    await reconcileUnconfirmedClaims({ DB: db }, Date.parse('2026-11-08T16:00:00.000Z'))
    expect(await db.prepare('SELECT state FROM vip_publications').first()).toMatchObject({ state: 'unknown' })
    expect(await db.prepare('SELECT state FROM vip_publication_runs').first()).toMatchObject({ state: 'unknown' })
  })

  it('shows only private administrative delivery state without leaking credentials', async () => {
    const db = freshDb()
    const fetcher = fakeFetch().fetcher
    const status = await adminPublicationStatus({ ...CONFIG, DB: db }, { fetcher })
    expect(status).toMatchObject({ publicationEnabled: true, policy: POLICY, timezone: 'Africa/Dakar',
      times: ['00:00', '07:00', '16:00'], maxNewPicksPerWindow: 1, automaticRetry: false })
    expect(JSON.stringify(status)).not.toContain(BOT_TOKEN)
    expect(JSON.stringify(status)).not.toContain(CHANNEL)
  })
})
