// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createHash } from 'node:crypto'
import worker from '../workers/vip-api/src/index.js'

const UI_ORIGIN = 'https://bttspredict.com'
const CHANNEL_ID = '-1001234567890'
const REQUEST_ID = '123e4567-e89b-12d3-a456-426614174000'
const RECEIPT_TOKEN = 'a'.repeat(64)
const OTHER_TOKEN = 'b'.repeat(64)
const ADMIN_TOKEN = 'c'.repeat(64)
const INVITE_LINK = 'https://t.me/+mockSingleUseInvite_123'
const BOT_TOKEN = 'mock-bot-token-12345678901234567890'

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function approvedRow() {
  const now = Math.floor(Date.now() / 1000)
  return {
    id: REQUEST_ID,
    status: 'approved_pending_telegram',
    created_at: new Date(now * 1000).toISOString(),
    reviewed_at: new Date(now * 1000).toISOString(),
    expires_at: now + 86_400,
    telegram_invite_link: null as string | null,
    telegram_invite_expires_at: null as number | null,
  }
}

function createStatusDb(initialRow: ReturnType<typeof approvedRow>, receipt: string) {
  const row = { ...initialRow }
  const expectedHash = tokenHash(receipt)
  const updates: unknown[][] = []
  const DB = {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          return {
            async first() {
              if (!sql.includes('SELECT id, status, created_at, reviewed_at, expires_at, telegram_invite_link')) {
                throw new Error(`Unexpected mock query: ${sql}`)
              }
              const [requestId, receiptHash, now] = values
              if (requestId !== REQUEST_ID || receiptHash !== expectedHash || Number(row.expires_at) <= Number(now)) return null
              return { ...row }
            },
            async run() {
              if (!sql.includes('UPDATE vip_requests SET telegram_invite_link')) throw new Error(`Unexpected mock update: ${sql}`)
              updates.push(values)
              const [link, expiry, requestId, receiptHash, now, oldExpiry] = values
              const canUpdate = requestId === REQUEST_ID
                && receiptHash === expectedHash
                && row.status === 'approved_pending_telegram'
                && Number(row.expires_at) > Number(now)
                && (!row.telegram_invite_link || Number(row.telegram_invite_expires_at) <= Number(oldExpiry))
              if (!canUpdate) return { meta: { changes: 0 } }
              row.telegram_invite_link = String(link)
              row.telegram_invite_expires_at = Number(expiry)
              return { meta: { changes: 1 } }
            },
          }
        },
      }
    },
  }
  return { DB, row, updates }
}

function createApprovalDb() {
  const row = approvedRow()
  row.status = 'pending_review'
  const updates: unknown[][] = []
  const DB = {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          return {
            async first() {
              if (sql.includes('SELECT token_hash, expires_at FROM vip_admin_sessions')) {
                const [hash] = values
                return hash === tokenHash(ADMIN_TOKEN) ? { token_hash: hash, expires_at: Math.floor(Date.now() / 1000) + 3600 } : null
              }
              if (sql.includes('SELECT status, expires_at FROM vip_requests')) {
                const [requestId, now] = values
                return requestId === REQUEST_ID && row.expires_at > Number(now)
                  ? { status: row.status, expires_at: row.expires_at }
                  : null
              }
              throw new Error(`Unexpected mock query: ${sql}`)
            },
            async run() {
              if (!sql.includes("SET status = 'approved_pending_telegram'")) throw new Error(`Unexpected mock update: ${sql}`)
              updates.push(values)
              const [reviewedAt, link, expiry, requestId] = values
              if (requestId !== REQUEST_ID || row.status !== 'pending_review') return { meta: { changes: 0 } }
              row.status = 'approved_pending_telegram'
              row.reviewed_at = String(reviewedAt)
              row.telegram_invite_link = String(link)
              row.telegram_invite_expires_at = Number(expiry)
              return { meta: { changes: 1 } }
            },
          }
        },
      }
    },
  }
  return { DB, row, updates }
}

function statusRequest(receipt: string) {
  return new Request(`https://vip-worker.test/requests/${REQUEST_ID}/status`, {
    method: 'GET',
    headers: { Origin: UI_ORIGIN, Authorization: `Bearer ${receipt}` },
  })
}

function envFor(DB: unknown) {
  return { DB, UI_ORIGIN, TELEGRAM_BOT_TOKEN: BOT_TOKEN, TELEGRAM_CHANNEL_ID: CHANNEL_ID }
}

const ONE_PIXEL_PNG_HEADER = new Uint8Array(24)
ONE_PIXEL_PNG_HEADER.set([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82], 0)
ONE_PIXEL_PNG_HEADER[19] = 1
ONE_PIXEL_PNG_HEADER[23] = 1

function createSubmissionDb() {
  const state: { insert?: { sql: string; values: unknown[] } } = {}
  const DB = {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          return {
            async first() {
              if (sql.includes('INSERT INTO vip_rate_limits')) return { hits: 1 }
              throw new Error(`Unexpected submission query: ${sql}`)
            },
            async run() {
              if (sql.includes('INSERT INTO vip_requests')) {
                const placeholders = (sql.match(/\?/g) || []).length
                if (placeholders !== values.length) throw new Error(`Expected ${placeholders} bound values, got ${values.length}`)
                state.insert = { sql, values }
                return { meta: { changes: 1 } }
              }
              if (sql.trimStart().startsWith('DELETE FROM')) return { meta: { changes: 0 } }
              throw new Error(`Unexpected submission update: ${sql}`)
            },
          }
        },
      }
    },
  }
  return { DB, state }
}

function submissionRequest(includeConsent: boolean, includeContactConsent = true) {
  const body = new FormData()
  body.set('partner', 'linebet')
  body.set('promoCode', 'VISION221')
  body.set('registrationConfirmed', 'on')
  body.set('depositConfirmed', 'on')
  body.set('depositUsd', '10')
  body.set('accountIdentifier', 'account-test-123')
  body.set('contactChannel', 'telegram')
  body.set('telegramUsername', 'vip_test_user')
  if (includeContactConsent) body.set('contactConsent', 'yes')
  if (includeConsent) body.set('consent', 'yes')
  body.set('proof', new Blob([ONE_PIXEL_PNG_HEADER], { type: 'image/png' }), 'proof.png')
  return new Request('https://vip-worker.test/requests', {
    method: 'POST',
    headers: { Origin: UI_ORIGIN, 'CF-Connecting-IP': '203.0.113.10' },
    body,
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('VIP production Worker domain and private Telegram flow', () => {
  it('rejects an application without general consent and records both consent timestamps when accepted', async () => {
    const rejectedDb = createSubmissionDb()
    const rejected = await worker.fetch(
      submissionRequest(false),
      { DB: rejectedDb.DB, UI_ORIGIN, ADMIN_PASSWORD: 'mock-admin-password-over-16' } as never,
    )
    expect(rejected.status).toBe(422)
    expect(await rejected.json()).toEqual({ ok: false, error: 'invalid_request' })
    expect(rejectedDb.state.insert).toBeUndefined()

    const missingContactDb = createSubmissionDb()
    const missingContact = await worker.fetch(
      submissionRequest(true, false),
      { DB: missingContactDb.DB, UI_ORIGIN, ADMIN_PASSWORD: 'mock-admin-password-over-16' } as never,
    )
    expect(missingContact.status).toBe(422)
    expect(await missingContact.json()).toEqual({ ok: false, error: 'invalid_request' })
    expect(missingContactDb.state.insert).toBeUndefined()

    const acceptedDb = createSubmissionDb()
    const accepted = await worker.fetch(
      submissionRequest(true),
      { DB: acceptedDb.DB, UI_ORIGIN, ADMIN_PASSWORD: 'mock-admin-password-over-16' } as never,
    )
    const result = await accepted.json()
    expect(accepted.status).toBe(201)
    expect(result).toMatchObject({ ok: true, status: 'pending_review', telegramEnabled: false, inviteSent: false })
    expect(acceptedDb.state.insert?.sql).toContain('consent_version, consented_at, contact_consented_at')
    expect(acceptedDb.state.insert?.values[9]).toBe('vip-request-v1')
    expect(typeof acceptedDb.state.insert?.values[10]).toBe('string')
    expect(acceptedDb.state.insert?.values[11]).toBe(acceptedDb.state.insert?.values[10])
  })

  it('creates and stores one single-member invite only for an approved request with its valid receipt', async () => {
    const mockDb = createStatusDb(approvedRow(), RECEIPT_TOKEN)
    const telegramFetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe(`https://api.telegram.org/bot${BOT_TOKEN}/createChatInviteLink`)
      expect(init?.method).toBe('POST')
      const body = JSON.parse(String(init?.body))
      expect(body.chat_id).toBe(CHANNEL_ID)
      expect(body.member_limit).toBe(1)
      expect(typeof body.expire_date).toBe('number')
      return new Response(JSON.stringify({ ok: true, result: { invite_link: INVITE_LINK } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', telegramFetch)

    const response = await worker.fetch(statusRequest(RECEIPT_TOKEN), envFor(mockDb.DB) as never)
    const result = await response.json()
    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(UI_ORIGIN)
    expect(result).toMatchObject({
      ok: true,
      requestId: REQUEST_ID,
      status: 'approved_pending_telegram',
      inviteReady: true,
      inviteLink: INVITE_LINK,
      telegramInviteMode: 'manual-approval-private-status',
      telegramEnabled: false,
      inviteSent: false,
    })
    expect(mockDb.updates).toHaveLength(1)
    expect(mockDb.row.telegram_invite_link).toBe(INVITE_LINK)
    expect(telegramFetch).toHaveBeenCalledTimes(1)

    const refreshed = await worker.fetch(statusRequest(RECEIPT_TOKEN), envFor(mockDb.DB) as never)
    expect(refreshed.status).toBe(200)
    expect((await refreshed.json()).inviteLink).toBe(INVITE_LINK)
    expect(mockDb.updates).toHaveLength(1)
    expect(telegramFetch).toHaveBeenCalledTimes(1)
  })

  it('does not create or reveal an invite while a request is pending', async () => {
    const pending = { ...approvedRow(), status: 'pending_review' }
    const mockDb = createStatusDb(pending, RECEIPT_TOKEN)
    const telegramFetch = vi.fn()
    vi.stubGlobal('fetch', telegramFetch)

    const response = await worker.fetch(statusRequest(RECEIPT_TOKEN), envFor(mockDb.DB) as never)
    const result = await response.json()
    expect(response.status).toBe(200)
    expect(result.inviteReady).toBe(false)
    expect(result.inviteLink).toBeNull()
    expect(mockDb.updates).toHaveLength(0)
    expect(telegramFetch).not.toHaveBeenCalled()
  })

  it('does not disclose an approved request or create an invite for another receipt', async () => {
    const mockDb = createStatusDb(approvedRow(), RECEIPT_TOKEN)
    const telegramFetch = vi.fn()
    vi.stubGlobal('fetch', telegramFetch)

    const response = await worker.fetch(statusRequest(OTHER_TOKEN), envFor(mockDb.DB) as never)
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ ok: false, error: 'request_not_found' })
    expect(mockDb.updates).toHaveLength(0)
    expect(telegramFetch).not.toHaveBeenCalled()
  })

  it('requires an authenticated administrator before approving or creating an invite', async () => {
    const mockDb = createApprovalDb()
    const telegramFetch = vi.fn(async () => new Response(JSON.stringify({ ok: true, result: { invite_link: INVITE_LINK } }), { status: 200 }))
    vi.stubGlobal('fetch', telegramFetch)
    const request = new Request(`https://vip-worker.test/admin/requests/${REQUEST_ID}/decision`, {
      method: 'POST',
      headers: { Origin: UI_ORIGIN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approve' }),
    })

    const unauthorized = await worker.fetch(request, envFor(mockDb.DB) as never)
    expect(unauthorized.status).toBe(401)
    expect(telegramFetch).not.toHaveBeenCalled()
    expect(mockDb.row.status).toBe('pending_review')

    const authorized = new Request(request.url, {
      method: 'POST',
      headers: { Origin: UI_ORIGIN, Authorization: `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approve' }),
    })
    const response = await worker.fetch(authorized, envFor(mockDb.DB) as never)
    const result = await response.json()
    expect(response.status).toBe(200)
    expect(result).toMatchObject({ ok: true, status: 'approved_pending_telegram', inviteReady: true, inviteSent: false })
    expect(JSON.stringify(result)).not.toContain(INVITE_LINK)
    expect(mockDb.row.status).toBe('approved_pending_telegram')
    expect(mockDb.row.telegram_invite_link).toBe(INVITE_LINK)
    expect(mockDb.updates).toHaveLength(1)
    expect(telegramFetch).toHaveBeenCalledTimes(1)
  })

  it('keeps approval pending and makes no Telegram call when the production channel is not configured', async () => {
    const mockDb = createApprovalDb()
    const telegramFetch = vi.fn()
    vi.stubGlobal('fetch', telegramFetch)
    const request = new Request(`https://vip-worker.test/admin/requests/${REQUEST_ID}/decision`, {
      method: 'POST',
      headers: { Origin: UI_ORIGIN, Authorization: `Bearer ${ADMIN_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approve' }),
    })
    const response = await worker.fetch(request, { DB: mockDb.DB, UI_ORIGIN, TELEGRAM_BOT_TOKEN: BOT_TOKEN } as never)
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ ok: false, error: 'telegram_invite_unavailable' })
    expect(mockDb.row.status).toBe('pending_review')
    expect(mockDb.row.telegram_invite_link).toBeNull()
    expect(mockDb.updates).toHaveLength(0)
    expect(telegramFetch).not.toHaveBeenCalled()
  })
})
