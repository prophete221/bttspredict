import { createHash, generateKeyPairSync, sign } from 'node:crypto'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { adminCandidateDecision, adminListCandidates, handleCandidateSync } from '../workers/vip-api/src/vip-candidates.js'

const OIDC_AUDIENCE = 'https://bttspredict.com/vip-candidates'
const WORKFLOW_REF = 'prophete221/bttspredict/.github/workflows/deploy.yml@refs/heads/main'
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
const publicJwk = { ...publicKey.export({ format: 'jwk' }), kid: 'vip-test-key', alg: 'RS256', use: 'sig' }

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url')
}

function token(claimOverrides: Record<string, unknown> = {}) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', kid: 'vip-test-key', typ: 'JWT' }))
  const claims = base64url(JSON.stringify({
    iss: 'https://token.actions.githubusercontent.com',
    aud: OIDC_AUDIENCE,
    sub: 'repo:prophete221/bttspredict:ref:refs/heads/main',
    repository: 'prophete221/bttspredict',
    repository_owner: 'prophete221',
    ref: 'refs/heads/main',
    workflow_ref: WORKFLOW_REF,
    event_name: 'schedule',
    run_id: '1234567890',
    run_attempt: '1',
    iat: now,
    nbf: now - 5,
    exp: now + 300,
    ...claimOverrides,
  }))
  const content = `${header}.${claims}`
  const signature = sign('RSA-SHA256', Buffer.from(content), privateKey)
  return `${content}.${base64url(signature)}`
}

function mockDb(options: {
  runRow?: Record<string, unknown> | null
  state?: Record<string, unknown> | null
  decisionRow?: Record<string, unknown> | null
  latestSync?: Record<string, unknown> | null
  runChanges?: number
} = {}) {
  const { runRow = null, state = null, decisionRow = null, latestSync = null, runChanges = 1 } = options
  const batches: Array<Array<{ sql: string; values: unknown[] }>> = []
  const runs: Array<{ sql: string; values: unknown[] }> = []
  const db = {
    prepare(sql: string) {
      const statement = { sql, values: [] as unknown[] }
      const prepared = Object.assign(statement, {
        bind(...values: unknown[]) {
          statement.values = values
          return prepared
        },
        first: async () => {
          runs.push(statement)
          if (sql.includes('SELECT run_id, accepted_count')) return runRow
          if (sql.includes('SELECT source_updated_at, generated_at, candidate_count')) return latestSync
          if (sql.includes('SELECT last_generated_at')) return state
          if (sql.includes('SELECT material_hash, candidate_json')) return decisionRow
          return null
        },
        all: async () => ({ results: [] }),
        run: async () => {
          runs.push(statement)
          return { meta: { changes: runChanges } }
        },
      })
      return prepared
    },
    async batch(statements: Array<{ sql: string; values: unknown[] }>) {
      batches.push(statements)
      return statements.map(() => ({ meta: { changes: 1 } }))
    },
  }
  return { DB: db, batches, runs }
}

function syncPayload(candidates: unknown[] = [], overrides: Record<string, unknown> = {}) {
  const now = new Date()
  const stamp = now.toISOString()
  return {
    version: 1,
    generatedAt: stamp,
    sourceUpdatedAt: stamp,
    lastAudit: {
      payloadFresh: true,
      evaluationComplete: true,
      analyzedAt: stamp,
      sourceUpdatedAt: stamp,
      inputRows: candidates.length,
      verifiedGeminiRows: candidates.length,
      eligibleBeforeFreeExclusion: candidates.length,
      excludedAlreadyFree: 0,
      excludedDuplicateKey: 0,
      rejected: {},
    },
    candidates,
    ...overrides,
  }
}

function signedRequest(data: unknown, signedToken = token()) {
  return new Request('https://vip-api.test/internal/vip-candidates/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${signedToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

function candidateFixture() {
  const kickoff = new Date(Date.now() + 3 * 60 * 60 * 1000)
  kickoff.setSeconds(0, 0)
  const date = kickoff.toISOString().slice(0, 10)
  const time = kickoff.toISOString().slice(11, 16)
  const identity = [date, 'test-league', 'home-fc', 'away-fc', 'BTTS', 'YES'].join('|')
  const candidateKey = (awaitDigest(identity))
  const stamp = new Date().toISOString()
  return {
    candidateKey,
    matchId: 'fixture-123',
    home: 'Home FC',
    away: 'Away FC',
    league: 'Test League',
    date,
    time,
    matchState: 'SCHEDULED',
    kickoffAt: new Date(`${date}T${time}:00.000Z`).toISOString(),
    market: 'BTTS',
    freeMarket: 'OVER_25',
    freeSelection: 'YES',
    selection: 'YES',
    probability: 0.72,
    confidence: 72,
    aiConfidence: 'high',
    dataQuality: 'HIGH',
    dataSource: 'ESPN_TEAM_SCHEDULE',
    matchCountHome: 8,
    matchCountAway: 8,
    formCountHome: 5,
    formCountAway: 5,
    sourceModel: 'gemini-3.5-flash-lite',
    homeSelectionRate: 0.72,
    awaySelectionRate: 0.72,
    empiricalSelectionRate: 0.72,
    reasons: ['Cohérence des taux observés', 'Échantillon récent suffisant'],
    risks: ['La forme récente peut évoluer'],
    analyzedAt: stamp,
    status: 'pending_owner_approval',
  }
}

function awaitDigest(identity: string) {
  return createHash('sha256').update(identity).digest('hex')
}

beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    if (String(input) === 'https://token.actions.githubusercontent.com/.well-known/jwks') {
      return new Response(JSON.stringify({ keys: [publicJwk] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    throw new Error('unexpected_external_request')
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('private VIP candidate Worker service', () => {
  it('accepts a fresh, complete GitHub OIDC run into a mocked D1 batch without contacting Telegram', async () => {
    const { DB, batches } = mockDb()
    const response = await handleCandidateSync(signedRequest(syncPayload([candidateFixture()])), { DB }, new Headers())
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result).toMatchObject({ ok: true, synced: true, acceptedCount: 1, duplicate: false })
    expect(batches).toHaveLength(1)
    expect(batches[0].some(statement => statement.sql.includes('INSERT INTO vip_candidates'))).toBe(true)
    expect(vi.mocked(fetch).mock.calls.every(([input]) => String(input).includes('token.actions.githubusercontent.com'))).toBe(true)
  })

  it('accepts the opposite selection in the same market but rejects an exact free-feed duplicate', async () => {
    const opposite = { ...candidateFixture(), freeMarket: 'BTTS', freeSelection: 'NO' }
    const acceptedDb = mockDb()
    const acceptedResponse = await handleCandidateSync(signedRequest(syncPayload([opposite])), { DB: acceptedDb.DB }, new Headers())
    expect(acceptedResponse.status).toBe(200)
    expect(acceptedDb.batches).toHaveLength(1)

    const duplicate = { ...candidateFixture(), freeMarket: 'BTTS', freeSelection: 'YES' }
    const duplicateDb = mockDb()
    const duplicateResponse = await handleCandidateSync(signedRequest(syncPayload([duplicate])), { DB: duplicateDb.DB }, new Headers())
    expect(duplicateResponse.status).toBe(422)
    expect(await duplicateResponse.json()).toMatchObject({ ok: false, error: 'candidate_failed_validation' })
    expect(duplicateDb.batches).toHaveLength(0)
  })

  it('rejects an OIDC token from a different repository before any database write', async () => {
    const { DB, batches } = mockDb()
    const response = await handleCandidateSync(
      signedRequest(syncPayload([]), token({ repository: 'someone-else/project' })),
      { DB },
      new Headers(),
    )
    expect(response.status).toBe(403)
    expect(await response.json()).toMatchObject({ ok: false, error: 'machine_identity_not_allowed' })
    expect(batches).toHaveLength(0)
  })

  it('rejects a push-triggered OIDC token before any database write', async () => {
    const { DB, batches } = mockDb()
    const response = await handleCandidateSync(
      signedRequest(syncPayload([]), token({ event_name: 'push' })),
      { DB },
      new Headers(),
    )
    expect(response.status).toBe(403)
    expect(await response.json()).toMatchObject({ ok: false, error: 'machine_identity_not_allowed' })
    expect(batches).toHaveLength(0)
  })

  it('does not change D1 for incomplete or stale analysis snapshots', async () => {
    const { DB, batches } = mockDb()
    const incomplete = syncPayload([], { lastAudit: { payloadFresh: false, evaluationComplete: false } })
    const incompleteResponse = await handleCandidateSync(signedRequest(incomplete), { DB }, new Headers())
    expect(incompleteResponse.status).toBe(200)
    expect(await incompleteResponse.json()).toMatchObject({ ok: true, synced: false, reason: 'source_incomplete' })

    const staleStamp = new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString()
    const stale = syncPayload([], {
      generatedAt: new Date().toISOString(),
      sourceUpdatedAt: staleStamp,
      lastAudit: { payloadFresh: true, evaluationComplete: true, sourceUpdatedAt: staleStamp },
    })
    const staleResponse = await handleCandidateSync(signedRequest(stale), { DB }, new Headers())
    expect(staleResponse.status).toBe(200)
    expect(await staleResponse.json()).toMatchObject({ ok: true, synced: false, reason: 'stale_source' })
    expect(batches).toHaveLength(0)
  })

  it('returns a no-eligible-picks notice only from the private admin candidate endpoint', async () => {
    const { DB } = mockDb({
      latestSync: {
        source_updated_at: '2026-11-08T11:00:00.000Z',
        generated_at: '2026-11-08T11:01:00.000Z',
        candidate_count: 0,
        accepted_count: 0,
        audit_json: JSON.stringify({
          ownerOutcome: 'no_eligible_picks_today',
          ownerMessage: 'Aucun pick VIP éligible aujourd’hui; aucun message n’a été envoyé.',
        }),
      },
    })
    const response = await adminListCandidates({ DB }, new Headers())
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result).toMatchObject({
      ok: true,
      candidates: [],
      publicationEnabled: false,
      latestSync: {
        acceptedCount: 0,
        ownerOutcome: 'no_eligible_picks_today',
        ownerMessage: 'Aucun pick VIP éligible aujourd’hui; aucun message n’a été envoyé.',
      },
    })
  })

  it('records an authenticated manual approval only in the private database', async () => {
    const hash = 'a'.repeat(64)
    const { DB, runs } = mockDb({
      decisionRow: {
        material_hash: hash,
        candidate_json: '{}',
        status: 'pending_owner_approval',
        kickoff_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        analyzed_at: new Date().toISOString(),
        match_state: 'SCHEDULED',
        last_seen_sync_id: 'github:123:1',
      },
    })
    const response = await adminCandidateDecision('b'.repeat(64), new Request('https://vip-api.test/admin/candidates/x/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approve', materialHash: hash }),
    }), { DB }, new Headers())
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result).toMatchObject({ ok: true, status: 'approved', published: false, telegramSent: false })
    expect(runs.some(statement => statement.sql.includes('UPDATE vip_candidates'))).toBe(true)
    expect(vi.mocked(fetch).mock.calls.every(([input]) => String(input).includes('token.actions.githubusercontent.com'))).toBe(true)
  })
})
