import { adminCandidateDecision, adminListCandidates, handleCandidateSync } from './vip-candidates.js'
import { adminPublicationStatus, publishCandidatesAfterSync, publishVipWindow, reconcileUnconfirmedClaims } from './vip-publisher.js'
import { publicationConfigured, VIP_PUBLICATION_TIMES } from './vip-publication-config.js'

const encoder = new TextEncoder()
const MAX_PROOF_BYTES = 1_400_000
const MAX_IMAGE_PIXELS = 10_000_000
const MAX_REQUEST_BODY_BYTES = 1_416_384
const MAX_ACTIVE_REQUESTS = 20
const MAX_ACTIVE_PROOF_BYTES = 5_000_000
const RATE_WINDOW_SECONDS = 900
const MAX_SUBMISSIONS_PER_WINDOW = 5
const MAX_LOGIN_FAILURES = 5
const SESSION_TTL_SECONDS = 3600
const RETENTION_SECONDS = 7 * 24 * 60 * 60
const INVITE_LINK_TTL_SECONDS = 7 * 24 * 60 * 60
const PARTNERS = new Set(['linebet', '888starz', '1xbet', 'melbet'])
const PARTNER_PROMO_CODES = { '1xbet': 'vipbtts', linebet: 'VISION221', melbet: 'Bttswin', '888starz': 'btts221' }
const CONSENT_VERSION = 'vip-request-v1'
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]

class ApiError extends Error {
  constructor(status, code) {
    super(code)
    this.status = status
    this.code = code
  }
}

function fail(status, code) {
  throw new ApiError(status, code)
}

function baseHeaders() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Vary': 'Origin',
  }
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin')
  const headers = baseHeaders()
  if (origin === env.UI_ORIGIN) {
    headers['Access-Control-Allow-Origin'] = env.UI_ORIGIN
    headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    headers['Access-Control-Max-Age'] = '600'
  }
  return headers
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}

function randomHex(length) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return [...bytes].map(value => value.toString(16).padStart(2, '0')).join('')
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', typeof value === 'string' ? encoder.encode(value) : value)
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('')
}

async function passwordMatches(candidate, expected) {
  const [candidateHash, expectedHash] = await Promise.all([sha256Hex(candidate), sha256Hex(expected)])
  let difference = candidate.length ^ expected.length
  for (let index = 0; index < candidateHash.length; index += 1) {
    difference |= candidateHash.charCodeAt(index) ^ expectedHash.charCodeAt(index)
  }
  return difference === 0
}

function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown'
}

async function rateKey(request, env) {
  return sha256Hex(`${env.ADMIN_PASSWORD}:${clientIp(request)}`)
}

async function consumeRateLimit(env, scope, ipHash, now, maxHits) {
  const result = await env.DB.prepare(`
    INSERT INTO vip_rate_limits (scope, ip_hash, window_start, hits)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(scope, ip_hash) DO UPDATE SET
      hits = CASE WHEN vip_rate_limits.window_start <= ? THEN 1 ELSE vip_rate_limits.hits + 1 END,
      window_start = CASE WHEN vip_rate_limits.window_start <= ? THEN ? ELSE vip_rate_limits.window_start END
    RETURNING hits
  `).bind(scope, ipHash, now, now - RATE_WINDOW_SECONDS, now - RATE_WINDOW_SECONDS, now).first()
  return Number(result?.hits || 0) <= maxHits
}

async function loginRateLimited(env, ipHash, now) {
  const row = await env.DB.prepare('SELECT window_start, hits FROM vip_rate_limits WHERE scope = ? AND ip_hash = ?')
    .bind('login', ipHash).first()
  return Boolean(row && Number(row.window_start) > now - RATE_WINDOW_SECONDS && Number(row.hits) >= MAX_LOGIN_FAILURES)
}

async function readJson(request, maxBytes = 16_384) {
  const declared = Number(request.headers.get('Content-Length') || 0)
  if (declared > maxBytes) fail(413, 'payload_too_large')
  const text = await request.text()
  if (encoder.encode(text).length > maxBytes) fail(413, 'payload_too_large')
  try {
    const data = JSON.parse(text)
    if (!data || typeof data !== 'object' || Array.isArray(data)) fail(422, 'invalid_json')
    return data
  } catch (error) {
    if (error instanceof ApiError) throw error
    fail(422, 'invalid_json')
  }
}

async function readMultipartFormBounded(request) {
  if (!request.body) fail(422, 'invalid_form')
  const reader = request.body.getReader()
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_REQUEST_BODY_BYTES) {
        await reader.cancel().catch(() => {})
        fail(413, 'payload_too_large')
      }
      chunks.push(value)
    }
  } catch (error) {
    if (error instanceof ApiError) throw error
    fail(422, 'invalid_form')
  } finally {
    reader.releaseLock()
  }
  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  const headers = new Headers(request.headers)
  headers.delete('Content-Length')
  try {
    return await new Request(request.url, { method: 'POST', headers, body }).formData()
  } catch {
    fail(422, 'invalid_form')
  }
}

function validateImage(bytes, mime) {
  let width = 0
  let height = 0
  if (mime === 'image/png') {
    if (bytes.length < 24 || !PNG_SIGNATURE.every((value, index) => bytes[index] === value)) return false
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    width = view.getUint32(16, false)
    height = view.getUint32(20, false)
  } else if (mime === 'image/jpeg') {
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return false
    const sof = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf])
    let offset = 2
    while (offset + 4 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue }
      while (bytes[offset] === 0xff) offset += 1
      const marker = bytes[offset++]
      if (marker === 0xd9 || marker === 0xda) break
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
      if (offset + 2 > bytes.length) return false
      const segmentLength = (bytes[offset] << 8) | bytes[offset + 1]
      if (segmentLength < 2 || offset + segmentLength > bytes.length) return false
      if (sof.has(marker)) {
        if (segmentLength < 7) return false
        height = (bytes[offset + 3] << 8) | bytes[offset + 4]
        width = (bytes[offset + 5] << 8) | bytes[offset + 6]
        break
      }
      offset += segmentLength
    }
  } else {
    return false
  }
  return width > 0 && height > 0 && width * height <= MAX_IMAGE_PIXELS
}

async function pruneExpired(env, now) {
  await env.DB.prepare('DELETE FROM vip_requests WHERE expires_at <= ?').bind(now).run()
  await env.DB.prepare('DELETE FROM vip_admin_sessions WHERE expires_at <= ? OR revoked_at IS NOT NULL').bind(now).run()
  await env.DB.prepare('DELETE FROM vip_rate_limits WHERE window_start < ?').bind(now - 24 * 60 * 60).run()
}

async function getAdminSession(request, env) {
  const authorization = request.headers.get('Authorization') || ''
  const match = authorization.match(/^Bearer ([a-f0-9]{64})$/)
  if (!match) return null
  const tokenHash = await sha256Hex(match[1])
  const session = await env.DB.prepare(`
    SELECT token_hash, expires_at FROM vip_admin_sessions
    WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?
  `).bind(tokenHash, nowSeconds()).first()
  return session ? { tokenHash } : null
}

async function requireAdmin(request, env) {
  const session = await getAdminSession(request, env)
  if (!session) fail(401, 'unauthorized')
  return session
}

async function health(env) {
  let storageReady = false
  try {
    await env.DB.prepare('SELECT 1 AS ready').first()
    storageReady = true
  } catch { /* The response deliberately reveals no database error details. */ }
  return {
    ok: true,
    runtime: 'cloudflare-workers',
    storageReady,
    adminReady: typeof env.ADMIN_PASSWORD === 'string' && env.ADMIN_PASSWORD.length >= 16,
    proofStorage: 'private-d1-blob',
    proofMaxBytes: MAX_PROOF_BYTES,
    maxRequestBodyBytes: MAX_REQUEST_BODY_BYTES,
    maxActiveRequests: MAX_ACTIVE_REQUESTS,
    maxActiveProofBytes: MAX_ACTIVE_PROOF_BYTES,
    retentionSeconds: RETENTION_SECONDS,
    retentionCleanupIntervalSeconds: 3600,
    telegramInviteMode: 'manual-approval-private-status',
    telegramEnabled: false,
    inviteSent: false,
    vipPublicationConfigured: publicationConfigured(env),
    vipPublicationTimezone: 'Africa/Dakar',
    vipPublicationTimes: VIP_PUBLICATION_TIMES,
  }
}

async function sendOwnerTelegramAlert(env, requestId) {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = String(env.TELEGRAM_OWNER_CHAT_ID || '')
  const origin = String(env.UI_ORIGIN || '').replace(/\/+$/, '')
  if (typeof token !== 'string' || token.length < 20 || !/^[1-9][0-9]{5,14}$/.test(chatId)) return false
  if (!origin || origin !== env.UI_ORIGIN) return false

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: [`Référence : ${requestId}`, `Revue admin : ${origin}/vip-admin/admin.html`].join('\n'),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    })
    if (!response.ok) return false
    const result = await response.json()
    return result?.ok === true && String(result?.result?.chat?.id) === chatId
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

async function createTelegramInviteLink(env, expiresAt) {
  const token = env.TELEGRAM_BOT_TOKEN
  const channelId = String(env.TELEGRAM_CHANNEL_ID || '')
  const now = nowSeconds()
  if (typeof token !== 'string' || token.length < 20 || !/^-100[0-9]{6,14}$/.test(channelId) || expiresAt <= now) {
    fail(503, 'telegram_invite_unavailable')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/createChatInviteLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: channelId, member_limit: 1, expire_date: expiresAt }),
      signal: controller.signal,
    })
    const result = await response.json().catch(() => ({}))
    const inviteLink = result?.result?.invite_link
    if (!response.ok || result?.ok !== true || typeof inviteLink !== 'string'
      || !/^https:\/\/t\.me\/(?:\+|joinchat\/)[A-Za-z0-9_-]+$/.test(inviteLink)) {
      fail(503, 'telegram_invite_unavailable')
    }
    return inviteLink
  } catch (error) {
    if (error instanceof ApiError) throw error
    fail(503, 'telegram_invite_unavailable')
  } finally {
    clearTimeout(timeout)
  }
}

async function revokeTelegramInvite(env, inviteLink) {
  const token = env.TELEGRAM_BOT_TOKEN
  const channelId = String(env.TELEGRAM_CHANNEL_ID || '')
  if (typeof token !== 'string' || !inviteLink || !channelId) return false
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/revokeChatInviteLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: channelId, invite_link: inviteLink }),
      signal: controller.signal,
    })
    const result = await response.json().catch(() => ({}))
    return response.ok && result?.ok === true
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

async function createRequest(request, env, headers) {
  if (request.method !== 'POST') fail(405, 'method_not_allowed')
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 16) fail(503, 'admin_not_configured')
  const declared = Number(request.headers.get('Content-Length') || 0)
  if (Number.isFinite(declared) && declared > MAX_REQUEST_BODY_BYTES) fail(413, 'payload_too_large')
  const ipHash = await rateKey(request, env)
  const attemptAt = nowSeconds()
  if (!await consumeRateLimit(env, 'submit', ipHash, attemptAt, MAX_SUBMISSIONS_PER_WINDOW)) fail(429, 'rate_limited')
  const form = await readMultipartFormBounded(request)
  const proof = form.get('proof')
  if (!proof || typeof proof.arrayBuffer !== 'function' || typeof proof.size !== 'number') fail(422, 'proof_required')
  if (proof.size < 1 || proof.size > MAX_PROOF_BYTES) fail(proof.size > MAX_PROOF_BYTES ? 413 : 422, proof.size > MAX_PROOF_BYTES ? 'proof_too_large' : 'proof_invalid')
  const proofMime = proof.type
  if (!['image/png', 'image/jpeg'].includes(proofMime)) fail(422, 'proof_unsupported')
  const proofBytes = new Uint8Array(await proof.arrayBuffer())
  if (proofBytes.length < 1 || proofBytes.length > MAX_PROOF_BYTES || !validateImage(proofBytes, proofMime)) fail(422, 'proof_unsupported')

  const partner = String(form.get('partner') || '')
  const promoCode = String(form.get('promoCode') || '').trim()
  const accountIdentifier = String(form.get('accountIdentifier') || '').trim()
  const depositRaw = String(form.get('depositUsd') || '')
  const depositUsd = Number(depositRaw)
  const contactChannel = String(form.get('contactChannel') || '')
  const telegramUsername = String(form.get('telegramUsername') || '').trim().replace(/^@/, '')
  const whatsappPhone = String(form.get('whatsappPhone') || '').trim()
  const requestConsent = String(form.get('consent') || '') === 'yes'
  const contactConsent = String(form.get('contactConsent') || '') === 'yes'
  const invalid = !PARTNERS.has(partner)
    || promoCode !== PARTNER_PROMO_CODES[partner]
    || accountIdentifier.length < 1 || accountIdentifier.length > 80 || /[\x00-\x1f\x7f]/.test(accountIdentifier)
    || !Number.isFinite(depositUsd) || depositUsd < 3 || depositUsd > 100_000
    || String(form.get('registrationConfirmed') || '') !== 'on'
    || String(form.get('depositConfirmed') || '') !== 'on'
    || !requestConsent || !contactConsent
    || !['telegram', 'whatsapp'].includes(contactChannel)
  if (invalid) fail(422, 'invalid_request')
  if (contactChannel === 'telegram' && (!/^[A-Za-z0-9_]{5,32}$/.test(telegramUsername) || whatsappPhone || form.get('whatsappConsent'))) fail(422, 'invalid_request')
  if (contactChannel === 'whatsapp' && (!/^\+[1-9][0-9]{7,14}$/.test(whatsappPhone) || String(form.get('whatsappConsent') || '') !== 'yes' || telegramUsername)) fail(422, 'invalid_request')

  const now = nowSeconds()
  await pruneExpired(env, now)

  const requestId = crypto.randomUUID()
  const receiptToken = randomHex(32)
  const receiptHash = await sha256Hex(receiptToken)
  const createdAt = new Date(now * 1000).toISOString()
  const expiresAt = now + RETENTION_SECONDS
  try {
      const result = await env.DB.prepare(`
        INSERT INTO vip_requests
        (id, receipt_hash, partner, promo_code, account_identifier, deposit_usd, contact_channel,
         telegram_username, whatsapp_phone, consent_version, consented_at, contact_consented_at,
         status, proof_blob, proof_mime, proof_size, created_at, reviewed_at, expires_at)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_review', ?, ?, ?, ?, NULL, ?
      WHERE (SELECT COUNT(*) FROM vip_requests WHERE expires_at > ?) < ?
        AND (SELECT COALESCE(SUM(proof_size), 0) FROM vip_requests WHERE expires_at > ?) + ? <= ?
    `).bind(requestId, receiptHash, partner, promoCode, accountIdentifier, depositUsd,
      contactChannel, contactChannel === 'telegram' ? telegramUsername : null, contactChannel === 'whatsapp' ? whatsappPhone : null,
      CONSENT_VERSION, createdAt, createdAt, proofBytes, proofMime, proofBytes.length, createdAt, expiresAt,
      now, MAX_ACTIVE_REQUESTS, now, proofBytes.length, MAX_ACTIVE_PROOF_BYTES).run()
    if (Number(result.meta?.changes || 0) !== 1) fail(429, 'capacity_reached')
  } catch (error) {
    if (error instanceof ApiError) throw error
    const message = String(error?.message || '')
    if (message.includes('UNIQUE constraint failed')) fail(409, 'duplicate_active_request')
    fail(503, 'storage_unavailable')
  }
  const ownerAlertSent = await sendOwnerTelegramAlert(env, requestId)
  return jsonResponse({
    ok: true,
    requestId,
    receiptToken,
    status: 'pending_review',
    createdAt,
    telegramInviteMode: 'manual-approval-private-status',
    telegramEnabled: false,
    inviteSent: false,
    ownerAlertSent,
  }, 201, headers)
}

async function applicantStatus(requestId, request, env, headers) {
  const authorization = request.headers.get('Authorization') || ''
  const match = authorization.match(/^Bearer ([a-f0-9]{64})$/)
  if (!match) fail(404, 'request_not_found')
  const receiptHash = await sha256Hex(match[1])
  const now = nowSeconds()
  let row = await env.DB.prepare(`
    SELECT id, status, created_at, reviewed_at, expires_at, telegram_invite_link, telegram_invite_expires_at FROM vip_requests
    WHERE id = ? AND receipt_hash = ? AND expires_at > ?
  `).bind(requestId, receiptHash, now).first()
  if (!row) fail(404, 'request_not_found')
  let inviteLink = row.telegram_invite_link
  let inviteExpiresAt = Number(row.telegram_invite_expires_at || 0)
  if (row.status === 'approved_pending_telegram' && (!inviteLink || inviteExpiresAt <= now)) {
    const nextExpiry = Math.min(Number(row.expires_at), now + INVITE_LINK_TTL_SECONDS)
    const candidateLink = await createTelegramInviteLink(env, nextExpiry)
    let update
    try {
      update = await env.DB.prepare(`
        UPDATE vip_requests SET telegram_invite_link = ?, telegram_invite_expires_at = ?
        WHERE id = ? AND receipt_hash = ? AND status = 'approved_pending_telegram' AND expires_at > ?
          AND (telegram_invite_link IS NULL OR telegram_invite_expires_at <= ?)
      `).bind(candidateLink, nextExpiry, requestId, receiptHash, nowSeconds(), nowSeconds()).run()
    } catch {
      await revokeTelegramInvite(env, candidateLink)
      fail(503, 'storage_unavailable')
    }
    if (Number(update.meta?.changes || 0) === 1) {
      inviteLink = candidateLink
      inviteExpiresAt = nextExpiry
    } else {
      await revokeTelegramInvite(env, candidateLink)
      row = await env.DB.prepare(`
        SELECT id, status, created_at, reviewed_at, expires_at, telegram_invite_link, telegram_invite_expires_at FROM vip_requests
        WHERE id = ? AND receipt_hash = ? AND expires_at > ?
      `).bind(requestId, receiptHash, nowSeconds()).first()
      if (!row) fail(404, 'request_not_found')
      inviteLink = row.telegram_invite_link
      inviteExpiresAt = Number(row.telegram_invite_expires_at || 0)
    }
  }
  const inviteReady = row.status === 'approved_pending_telegram'
    && typeof inviteLink === 'string'
    && inviteExpiresAt > nowSeconds()
  return jsonResponse({
    ok: true,
    requestId: row.id,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    inviteReady,
    inviteLink: inviteReady ? inviteLink : null,
    inviteExpiresAt: inviteReady ? inviteExpiresAt : null,
    telegramInviteMode: 'manual-approval-private-status',
    telegramEnabled: false,
    inviteSent: false,
  }, 200, headers)
}

async function adminLogin(request, env, headers) {
  if (request.method !== 'POST') fail(405, 'method_not_allowed')
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 16) fail(503, 'admin_not_configured')
  const now = nowSeconds()
  const ipHash = await rateKey(request, env)
  if (await loginRateLimited(env, ipHash, now)) fail(429, 'login_rate_limited')
  const data = await readJson(request)
  const password = typeof data.password === 'string' ? data.password : ''
  if (!await passwordMatches(password, env.ADMIN_PASSWORD)) {
    await consumeRateLimit(env, 'login', ipHash, now, MAX_LOGIN_FAILURES)
    fail(401, 'invalid_credentials')
  }
  const token = randomHex(32)
  const tokenHash = await sha256Hex(token)
  const expiresAt = now + SESSION_TTL_SECONDS
  await env.DB.prepare('INSERT INTO vip_admin_sessions (token_hash, created_at, expires_at, revoked_at) VALUES (?, ?, ?, NULL)')
    .bind(tokenHash, now, expiresAt).run()
  return jsonResponse({ ok: true, token, expiresAt, sessionSeconds: SESSION_TTL_SECONDS }, 200, headers)
}

async function adminList(env, headers) {
  const now = nowSeconds()
  await pruneExpired(env, now)
  const result = await env.DB.prepare(`
    SELECT id, partner, promo_code, account_identifier, deposit_usd, contact_channel,
           telegram_username, whatsapp_phone, consent_version, consented_at, contact_consented_at,
           status, proof_mime, proof_size, created_at, reviewed_at
    FROM vip_requests WHERE expires_at > ? ORDER BY created_at DESC LIMIT 100
  `).bind(now).all()
  const requests = (result.results || []).map(row => ({
    id: row.id,
    partner: row.partner,
    promoCode: row.promo_code,
    accountIdentifier: row.account_identifier,
    depositUsd: row.deposit_usd,
    contactChannel: row.contact_channel,
    telegramUsername: row.telegram_username,
    whatsappPhone: row.whatsapp_phone,
    consentVersion: row.consent_version,
    consentedAt: row.consented_at,
    contactConsentedAt: row.contact_consented_at,
    status: row.status,
    proofMime: row.proof_mime,
    proofSize: row.proof_size,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  }))
  return jsonResponse({ ok: true, requests, telegramEnabled: false }, 200, headers)
}

function toBytes(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
  if (Array.isArray(value)) return Uint8Array.from(value)
  return null
}

async function adminProof(requestId, env, headers) {
  const row = await env.DB.prepare(`
    SELECT proof_blob, proof_mime, proof_size FROM vip_requests
    WHERE id = ? AND expires_at > ?
  `).bind(requestId, nowSeconds()).first()
  if (!row) fail(404, 'proof_not_found')
  const bytes = toBytes(row.proof_blob)
  if (!bytes || bytes.length !== Number(row.proof_size) || bytes.length > MAX_PROOF_BYTES) fail(404, 'proof_not_found')
  return new Response(bytes, {
    status: 200,
    headers: {
      ...headers,
      'Content-Type': row.proof_mime,
      'Content-Length': String(bytes.length),
      'Content-Disposition': 'inline; filename="vip-proof"',
      'Cache-Control': 'private, no-store, no-cache, must-revalidate',
    },
  })
}

async function adminDecision(requestId, request, env, headers) {
  if (request.method !== 'POST') fail(405, 'method_not_allowed')
  const data = await readJson(request)
  const decision = data.decision
  if (!['approve', 'reject'].includes(decision)) fail(422, 'invalid_decision')
  const now = nowSeconds()
  const requestRow = await env.DB.prepare(`
    SELECT status, expires_at FROM vip_requests WHERE id = ? AND expires_at > ?
  `).bind(requestId, now).first()
  if (!requestRow) fail(404, 'request_not_found')
  if (requestRow.status !== 'pending_review') fail(409, 'request_not_pending')
  const reviewedAt = new Date().toISOString()
  if (decision === 'reject') {
    const result = await env.DB.prepare(`
      UPDATE vip_requests SET status = 'rejected', reviewed_at = ?
      WHERE id = ? AND status = 'pending_review' AND expires_at > ?
    `).bind(reviewedAt, requestId, nowSeconds()).run()
    if (Number(result.meta?.changes || 0) !== 1) fail(409, 'request_not_pending')
    return jsonResponse({ ok: true, requestId, status: 'rejected', reviewedAt, inviteReady: false, telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false }, 200, headers)
  }

  const inviteExpiresAt = Math.min(Number(requestRow.expires_at), now + INVITE_LINK_TTL_SECONDS)
  const inviteLink = await createTelegramInviteLink(env, inviteExpiresAt)
  let result
  try {
    result = await env.DB.prepare(`
      UPDATE vip_requests
      SET status = 'approved_pending_telegram', reviewed_at = ?, telegram_invite_link = ?, telegram_invite_expires_at = ?
      WHERE id = ? AND status = 'pending_review' AND expires_at > ? AND telegram_invite_link IS NULL
    `).bind(reviewedAt, inviteLink, inviteExpiresAt, requestId, nowSeconds()).run()
  } catch {
    await revokeTelegramInvite(env, inviteLink)
    fail(503, 'storage_unavailable')
  }
  if (Number(result.meta?.changes || 0) !== 1) {
    await revokeTelegramInvite(env, inviteLink)
    fail(409, 'request_not_pending')
  }
  return jsonResponse({ ok: true, requestId, status: 'approved_pending_telegram', reviewedAt, inviteReady: true, telegramInviteMode: 'manual-approval-private-status', telegramEnabled: false, inviteSent: false }, 200, headers)
}

async function adminDelete(requestId, env, headers) {
  const row = await env.DB.prepare('SELECT telegram_invite_link FROM vip_requests WHERE id = ?').bind(requestId).first()
  if (!row) fail(404, 'request_not_found')
  if (row.telegram_invite_link && !await revokeTelegramInvite(env, row.telegram_invite_link)) fail(503, 'telegram_invite_revoke_unavailable')
  const result = await env.DB.prepare('DELETE FROM vip_requests WHERE id = ?').bind(requestId).run()
  if (Number(result.meta?.changes || 0) !== 1) fail(404, 'request_not_found')
  return jsonResponse({ ok: true, requestId, deleted: true }, 200, headers)
}

async function adminLogout(session, env, headers) {
  const result = await env.DB.prepare('UPDATE vip_admin_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL')
    .bind(nowSeconds(), session.tokenHash).run()
  return jsonResponse({ ok: true, loggedOut: Number(result.meta?.changes || 0) === 1 }, 200, headers)
}

async function route(request, env, executionContext) {
  const headers = corsHeaders(request, env)
  const origin = request.headers.get('Origin')
  if (origin && origin !== env.UI_ORIGIN) return jsonResponse({ ok: false, error: 'origin_not_allowed' }, 403, headers)
  if (request.method === 'OPTIONS') {
    if (origin !== env.UI_ORIGIN) return jsonResponse({ ok: false, error: 'origin_not_allowed' }, 403, headers)
    return new Response(null, { status: 204, headers })
  }

  const url = new URL(request.url)
  const path = url.pathname.replace(/\/$/, '') || '/'
  if (path === '/health' && request.method === 'GET') {
    return jsonResponse(await health(env), 200, headers)
  }
  if (path === '/internal/vip-candidates/sync') {
    const response = await handleCandidateSync(request, env, headers)
    let result = null
    try { result = await response.clone().json() } catch { /* malformed sync replies never trigger publication */ }
    if (response.ok && result?.synced === true && result?.publicationMode === 'immediate' && result?.duplicate !== true
      && Number(result.acceptedCount) > 0 && typeof result.syncId === 'string') {
      const publication = publishCandidatesAfterSync(env, result.syncId, { publishMode: result.publicationMode }).catch(() => {})
      if (executionContext && typeof executionContext.waitUntil === 'function') executionContext.waitUntil(publication)
      else await publication
    }
    return response
  }
  if (origin !== env.UI_ORIGIN) return jsonResponse({ ok: false, error: 'origin_required' }, 403, headers)

  if (path === '/requests' && request.method === 'POST') return createRequest(request, env, headers)
  const statusMatch = path.match(/^\/requests\/([0-9a-f-]{36})\/status$/i)
  if (statusMatch && request.method === 'GET') return applicantStatus(statusMatch[1], request, env, headers)
  if (path === '/admin/session' && request.method === 'POST') return adminLogin(request, env, headers)

  if (path === '/admin/requests' && request.method === 'GET') {
    await requireAdmin(request, env)
    return adminList(env, headers)
  }
  if (path === '/admin/candidates' && request.method === 'GET') {
    await requireAdmin(request, env)
    return adminListCandidates(env, headers)
  }
  if (path === '/admin/publication-status' && request.method === 'GET') {
    await requireAdmin(request, env)
    return jsonResponse(await adminPublicationStatus(env), 200, headers)
  }
  const candidateDecisionMatch = path.match(/^\/admin\/candidates\/([a-f0-9]{64})\/decision$/i)
  if (candidateDecisionMatch && request.method === 'POST') {
    await requireAdmin(request, env)
    return adminCandidateDecision(candidateDecisionMatch[1], request, env, headers)
  }
  const proofMatch = path.match(/^\/admin\/requests\/([0-9a-f-]{36})\/proof$/i)
  if (proofMatch && request.method === 'GET') {
    await requireAdmin(request, env)
    return adminProof(proofMatch[1], env, headers)
  }
  const decisionMatch = path.match(/^\/admin\/requests\/([0-9a-f-]{36})\/decision$/i)
  if (decisionMatch && request.method === 'POST') {
    await requireAdmin(request, env)
    return adminDecision(decisionMatch[1], request, env, headers)
  }
  const requestMatch = path.match(/^\/admin\/requests\/([0-9a-f-]{36})$/i)
  if (requestMatch && request.method === 'DELETE') {
    await requireAdmin(request, env)
    return adminDelete(requestMatch[1], env, headers)
  }
  if (path === '/admin/logout' && request.method === 'POST') {
    const session = await requireAdmin(request, env)
    return adminLogout(session, env, headers)
  }
  return jsonResponse({ ok: false, error: 'not_found' }, 404, headers)
}

const worker = {
  async fetch(request, env, executionContext) {
    try {
      return await route(request, env, executionContext)
    } catch (error) {
      if (error instanceof ApiError) {
        return jsonResponse({ ok: false, error: error.code }, error.status, corsHeaders(request, env))
      }
      return jsonResponse({ ok: false, error: 'service_unavailable' }, 503, corsHeaders(request, env))
    }
  },
  async scheduled(controller, env) {
    const scheduledAt = Number(controller?.scheduledTime)
    const cleanupTime = Number.isFinite(scheduledAt) && scheduledAt > 0
      ? Math.floor(scheduledAt / 1000)
      : nowSeconds()
    await pruneExpired(env, cleanupTime)
    await reconcileUnconfirmedClaims(env)
    await publishVipWindow(env, { scheduledTime: scheduledAt })
  },
}

export default worker
