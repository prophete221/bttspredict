// @vitest-environment node
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  adminPublicationStatus,
  formatVipBatchMessage,
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
  for (const filename of ['0005_vip_candidates.sql', '0006_vip_publications.sql', '0007_vip_publication_batches.sql']) {
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

async function seedEligible(db: ReturnType<typeof localD1>, kickoffAt: string, options: {
  fixtureNumber?: number; market?: 'BTTS' | 'OVER_25'; probability?: number; confidence?: 'low' | 'medium' | 'high'
} = {}) {
  const { fixtureNumber = 0, market = 'BTTS', probability = 0.72, confidence = 'medium' } = options
  const now = Date.parse('2026-11-08T16:00:00.000Z')
  const kickoff = new Date(kickoffAt)
  const date = kickoff.toISOString().slice(0, 10)
  const time = kickoff.toISOString().slice(11, 16)
  const home = `Home FC ${fixtureNumber}`
  const away = `Away FC ${fixtureNumber}`
  const selection = 'YES'
  const key = createHash('sha256').update([date, 'test-league', home.toLowerCase().replaceAll(' ', '-'), away.toLowerCase().replaceAll(' ', '-'), market, selection].join('|')).digest('hex')
  const candidate = {
    candidateKey: key,
    matchId: `fixture-${fixtureNumber}`, home, away, league: 'Test League', date, time,
    matchState: 'SCHEDULED', sourceMatchStatus: 'STATUS_SCHEDULED', sourceStatus: 'STATUS_SCHEDULED', kickoffAt: kickoff.toISOString(),
    fixtureId: String(12345 + fixtureNumber), leagueSlug: 'eng.1', homeTeamId: String(100 + fixtureNumber),
    awayTeamId: String(200 + fixtureNumber), sourceKickoffAt: kickoff.toISOString(),
    market, freeMarket: 'OVER_25', freeSelection: 'NO', selection, probability,
    confidence: Math.round(probability * 100), aiConfidence: confidence, dataQuality: 'HIGH', dataSource: 'ESPN_TEAM_SCHEDULE',
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
  const existing = await db.prepare('SELECT run_id FROM vip_candidate_sync_runs WHERE run_id = ?').bind(syncId).first()
  if (existing) {
    await db.prepare('UPDATE vip_candidate_sync_runs SET accepted_count = accepted_count + 1, candidate_count = candidate_count + 1 WHERE run_id = ?').bind(syncId).run()
  } else {
    await db.prepare(`INSERT INTO vip_candidate_sync_runs
      (run_id, source_updated_at, generated_at, received_at, candidate_count, accepted_count, audit_json)
      VALUES (?, ?, ?, ?, 1, 1, ?)`)
      .bind(syncId, sourceUpdatedAt, generatedAt, generatedAt, audit).run()
    await db.prepare(`INSERT INTO vip_candidate_sync_state
      (id, last_generated_at, last_source_updated_at, last_sync_id, updated_at)
      VALUES ('vip', ?, ?, ?, ?)`).bind(generatedAt, sourceUpdatedAt, syncId, generatedAt).run()
  }
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
  fixtureStatus = 'scheduled', membership = 'allowed', summaryDelayMs = 0, startedOnSummaryNumber = 0,
  onSummary }:
  { freeRows?: unknown[]; send?: 'ok' | 'timeout' | 'reject'; fixtureKickoff?: string;
    fixtureStatus?: 'scheduled' | 'started'; membership?: 'allowed' | 'denied';
    summaryDelayMs?: number | ((summaryNumber: number) => number); startedOnSummaryNumber?: number;
    onSummary?: (summaryNumber: number) => void } = {}) {
  const calls: string[] = []
  const sentMessages: string[] = []
  const summaryCounts = new Map<string, number>()
  let activeSummaries = 0
  let maxConcurrentSummaries = 0
  const fetcher = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method || 'GET'
    calls.push(`${method} ${url.replace(/bot[^/]+\//, 'bot[redacted]/')}`)
    if (url.includes('/summary?event=')) {
      const fixtureId = new URL(url).searchParams.get('event') || '12345'
      const fixtureNumber = Number(fixtureId) - 12345
      const summaryNumber = (summaryCounts.get(fixtureId) || 0) + 1
      summaryCounts.set(fixtureId, summaryNumber)
      onSummary?.(summaryNumber)
      activeSummaries += 1
      maxConcurrentSummaries = Math.max(maxConcurrentSummaries, activeSummaries)
      const delay = typeof summaryDelayMs === 'function' ? summaryDelayMs(summaryNumber) : summaryDelayMs
      if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay))
      activeSummaries -= 1
      const started = fixtureStatus === 'started' || summaryNumber >= startedOnSummaryNumber && startedOnSummaryNumber > 0
      return Response.json({ header: { id: fixtureId, competitions: [{
        date: fixtureKickoff, status: { type: { state: started ? 'in' : 'pre',
          name: started ? 'STATUS_IN_PROGRESS' : 'STATUS_SCHEDULED', completed: false } },
        competitors: [{ homeAway: 'home', team: { id: String(100 + fixtureNumber) } },
          { homeAway: 'away', team: { id: String(200 + fixtureNumber) } }],
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
      const body = JSON.parse(String(init?.body || '{}'))
      sentMessages.push(String(body.text || ''))
      if (send === 'timeout') throw new Error('simulated_timeout')
      if (send === 'reject') return Response.json({ ok: false, error_code: 403, description: 'not authorized' })
      return Response.json({ ok: true, result: { message_id: 987, chat: { id: CHANNEL } } })
    }
    throw new Error(`unexpected_external_request:${new URL(url).hostname}`)
  })
  return { fetcher, calls, sentMessages, get maxConcurrentSummaries() { return maxConcurrentSummaries } }
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
    expect(publication?.message_text).toContain('BTTSPredict — Sélections VIP (1/5)')
    expect(publication?.message_text).toContain('Gemini 72 %')
    expect(publication?.message_text).toContain('Risque MODÉRÉ')
    expect(await db.prepare("SELECT status FROM vip_candidates WHERE candidate_key = ?").bind(candidate.candidateKey).first())
      .toMatchObject({ status: 'published' })
    const duplicate = await publishVipWindow({ ...CONFIG, DB: db }, { scheduledTime: Date.parse(scheduledAt), clock, fetcher })
    expect(duplicate.outcome).toBe('duplicate_window')
    expect(calls.filter(call => call.includes('/sendMessage'))).toHaveLength(1)
  })

  it.each([1, 2, 5, 7])('sends one Telegram batch for %i eligible fixtures, capped at five with one durable row per pick', async requestedCount => {
    const db = freshDb()
    for (let index = 0; index < requestedCount; index += 1) {
      const probability = 0.30 + index * 0.09
      const confidence = probability >= 0.70 ? 'high' : probability >= 0.45 ? 'medium' : 'low'
      await seedEligible(db, kickoffSameDay, { fixtureNumber: index, probability, confidence })
    }
    const { fetcher, calls, sentMessages } = fakeFetch()
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher,
    })
    const expected = Math.min(requestedCount, 5)
    expect(result).toMatchObject({ outcome: 'sent', claimed: expected, sent: expected })
    expect(calls.filter(call => call.includes('/sendMessage'))).toHaveLength(1)
    expect(sentMessages).toHaveLength(1)
    expect(sentMessages[0].length).toBeLessThanOrEqual(4096)
    expect(sentMessages[0]).toContain(`(${expected}/5)`)
    expect(await db.prepare('SELECT COUNT(*) AS count FROM vip_publications').first()).toMatchObject({ count: expected })
    expect(await db.prepare("SELECT COUNT(*) AS count FROM vip_publications WHERE state = 'sent' AND telegram_message_id = '987'").first())
      .toMatchObject({ count: expected })
    expect((await db.prepare('SELECT claimed_count, sent_count FROM vip_publication_runs').first()))
      .toMatchObject({ claimed_count: expected, sent_count: expected })
    if (requestedCount >= 2) {
      const highest = Math.min(requestedCount - 1, 6)
      expect(sentMessages[0].indexOf(`Home FC ${highest}`)).toBeLessThan(sentMessages[0].indexOf(`Home FC ${highest - 1}`))
    }
  })

  it('overlaps ESPN checks while preserving probability ranking and per-pick probability and risk in one short message', async () => {
    const db = freshDb()
    for (let index = 0; index < 5; index += 1) {
      await seedEligible(db, kickoffSameDay, { fixtureNumber: index, probability: 0.60 + index * 0.04,
        confidence: index === 4 ? 'high' : 'medium' })
    }
    const fixtureFetch = fakeFetch({ summaryDelayMs: 12 })
    const { fetcher, sentMessages } = fixtureFetch
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher,
    })
    expect(result).toMatchObject({ outcome: 'sent', claimed: 5, sent: 5 })
    expect(fixtureFetch.maxConcurrentSummaries).toBeGreaterThan(1)
    expect(sentMessages).toHaveLength(1)
    expect(sentMessages[0].length).toBeLessThanOrEqual(4096)
    expect((sentMessages[0].match(/Gemini /g) || []).length).toBe(5)
    expect((sentMessages[0].match(/Risque /g) || []).length).toBe(5)
    expect(sentMessages[0].indexOf('Home FC 4')).toBeLessThan(sentMessages[0].indexOf('Home FC 3'))
  })

  it('rejects a fixture that becomes live after the durable claims and records those claims as not sent', async () => {
    const db = freshDb()
    await seedEligible(db, kickoffSameDay)
    const { fetcher, sentMessages } = fakeFetch({ startedOnSummaryNumber: 2 })
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher,
    })
    expect(result.outcome).toBe('no_candidates')
    expect(sentMessages).toHaveLength(0)
    expect(await db.prepare('SELECT state, error_code FROM vip_publications').first()).toMatchObject({
      state: 'not_sent', error_code: 'live_revalidation_failed',
    })
  })

  it('fails closed when the kickoff margin expires during the post-claim live recheck', async () => {
    const db = freshDb()
    const kickoff = '2026-11-08T16:02:00.000Z'
    await seedEligible(db, kickoff)
    let late = false
    const { fetcher, sentMessages } = fakeFetch({ fixtureKickoff: kickoff, onSummary: count => { if (count >= 2) late = true } })
    const clock = () => late ? Date.parse('2026-11-08T16:01:30.000Z') : runAt
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock, fetcher,
    })
    expect(result.outcome).toBe('no_candidates')
    expect(sentMessages).toHaveLength(0)
    expect(await db.prepare('SELECT state, error_code FROM vip_publications').first()).toMatchObject({
      state: 'not_sent', error_code: 'live_revalidation_failed',
    })
  })

  it('times out ESPN work within the shortened test budget and never sends or retries unknown work', async () => {
    const db = freshDb()
    await seedEligible(db, kickoffSameDay)
    const { fetcher, sentMessages } = fakeFetch({ summaryDelayMs: count => count === 1 ? 0 : 100 })
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher, espnBudgetMs: 25,
    })
    expect(result.outcome).toBe('no_candidates')
    expect(sentMessages).toHaveLength(0)
    expect(await db.prepare('SELECT state FROM vip_publications').first()).toMatchObject({ state: 'not_sent' })
  })

  it('keeps only one market when multiple candidate keys refer to the same ESPN fixture', async () => {
    const db = freshDb()
    await seedEligible(db, kickoffSameDay, { fixtureNumber: 0, market: 'BTTS' })
    await seedEligible(db, kickoffSameDay, { fixtureNumber: 0, market: 'OVER_25' })
    const { fetcher, sentMessages, calls } = fakeFetch()
    const result = await publishVipWindow({ ...CONFIG, DB: db }, {
      scheduledTime: Date.parse(scheduledAt), clock: () => runAt, fetcher,
    })
    expect(result).toMatchObject({ outcome: 'sent', claimed: 1, sent: 1 })
    expect(sentMessages).toHaveLength(1)
    expect(sentMessages[0].match(/Home FC 0 — Away FC 0/g)).toHaveLength(1)
    expect(await db.prepare('SELECT COUNT(*) AS count FROM vip_publications').first()).toMatchObject({ count: 1 })
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
    await seedEligible(db, '2026-11-09T09:00:00.000Z', { market: 'OVER_25' })
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
    expect(await db.prepare('SELECT COUNT(*) AS count FROM vip_candidates WHERE status = \'pending_owner_approval\'').first())
      .toMatchObject({ count: 2 })
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
      riskLevel: 'MODÉRÉ', riskReasons: ['Probabilité modèle et échantillon contrôlés.', 'Analyse fraîche.'], riskPolicy: 'risk-v2-model-specific',
      empiricalSelectionRate: 0.74, homeSelectionRate: 0.72, awaySelectionRate: 0.76,
      matchCountHome: 8, matchCountAway: 9, formCountHome: 5, formCountAway: 5,
      reasons: ['Taux empiriques vérifiés', 'Forme récente cohérente'], risks: ['Échantillon limité'],
    } as never)
    expect(message).toContain('Under 2,5')
    expect(message).toContain('Risque MODÉRÉ')
    expect(message).not.toMatch(/score exact/i)
    expect(() => formatVipMessage({
      ...candidate, market: 'BTTS', selection: 'YES', qualityTier: 'fallback',
      probabilitySource: 'recent-form-empirical', probability: 0.62, confidence: null,
      aiConfidence: 'not_applicable', empiricalSelectionRate: 0.62,
      homeSelectionRate: 0.6, awaySelectionRate: 0.64,
      matchCountHome: 8, matchCountAway: 8, formCountHome: 5, formCountAway: 5,
      riskLevel: 'ÉLEVÉ', riskReasons: ['Sélection de repli sous le seuil VIP renforcé.', 'Taux observé inférieur à 65 %.'],
      reasons: ['Taux empirique observé', 'Forme récente mesurée'], risks: ['Échantillon court'],
    } as never)).toThrow('model_estimate_contract_missing')
  })

  it('formats small and large model probabilities without rounding them to zero or one hundred', () => {
    const base = {
      home: 'A', away: 'B', league: 'League', date: '2026-11-08', time: '20:00', market: 'BTTS', selection: 'YES',
      qualityTier: 'vip', probabilitySource: 'gemini-estimate', aiConfidence: 'medium', riskLevel: 'MODÉRÉ',
      riskReasons: ['Exemple de risque modèle.', 'Échantillon vérifié.'], empiricalSelectionRate: 0.5,
      homeSelectionRate: 0.5, awaySelectionRate: 0.5, matchCountHome: 8, matchCountAway: 8,
      formCountHome: 5, formCountAway: 5, reasons: ['Forme récente cohérente'], risks: ['Variance possible'],
    }
    expect(formatVipMessage({ ...base, probability: 0.001 } as never)).toContain('Gemini 0,1 %')
    expect(formatVipMessage({ ...base, probability: 0.999 } as never)).toContain('Gemini 99,9 %')
    expect(formatVipMessage({ ...base, probability: 0.00005 } as never)).toContain('Gemini <0,01 %')
    expect(formatVipMessage({ ...base, probability: 0.99995 } as never)).toContain('Gemini >99,99 %')
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
      times: ['00:00', '07:00', '16:00'], maxNewPicksPerWindow: 5, automaticRetry: false })
    expect(JSON.stringify(status)).not.toContain(BOT_TOKEN)
    expect(JSON.stringify(status)).not.toContain(CHANNEL)
  })
})
