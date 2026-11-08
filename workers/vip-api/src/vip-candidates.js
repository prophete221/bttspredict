import { publicationConfigured, VIP_PUBLICATION_POLICY } from './vip-publication-config.js'
import { assessPickRisk } from './vip-risk.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })
const MAX_SYNC_BYTES = 512_000
const MAX_CANDIDATES_PER_SYNC = 500
const MAX_ANALYSIS_AGE_MS = 12 * 60 * 60 * 1000
const MAX_GENERATED_AGE_MS = 15 * 60 * 1000
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000
const OIDC_ISSUER = 'https://token.actions.githubusercontent.com'
const OIDC_JWKS_URL = `${OIDC_ISSUER}/.well-known/jwks`
const OIDC_AUDIENCE = 'https://bttspredict.com/vip-candidates'
const EXPECTED_REPOSITORY = 'prophete221/bttspredict'
const EXPECTED_WORKFLOW_REF = 'prophete221/bttspredict/.github/workflows/deploy.yml@refs/heads/main'
const EXPECTED_REPOSITORY_ID = '1323126362'
const EXPECTED_OWNER_ID = '88623801'
const EXPECTED_SUBJECT = 'repo:prophete221@88623801/bttspredict@1323126362:ref:refs/heads/main'
const MATCH_STATE_ALIASES = new Map([
  ['PENDING', 'PENDING'], ['SCHEDULED', 'PENDING'], ['NOT_STARTED', 'PENDING'], ['UPCOMING', 'PENDING'],
  ['STATUS_SCHEDULED', 'PENDING'], ['STATUS_PRE_GAME', 'PENDING'], ['STATUS_DELAYED', 'PENDING'],
  ['STATUS_NOT_STARTED', 'PENDING'],
])
const ACCEPTED_MARKETS = new Set(['BTTS', 'OVER_25'])
const MODEL_CONFIDENCE = new Set(['low', 'medium', 'high'])
const MATERIAL_FIELDS = Object.freeze([
  'matchId', 'home', 'away', 'league', 'date', 'time', 'matchState', 'kickoffAt',
  'sourceMatchStatus', 'sourceStatus', 'market', 'freeMarket', 'freeSelection', 'selection', 'probability', 'confidence', 'aiConfidence',
  'qualityTier', 'probabilitySource',
  'dataQuality', 'dataSource', 'matchCountHome', 'matchCountAway', 'formCountHome',
  'formCountAway', 'sourceModel', 'homeSelectionRate', 'awaySelectionRate',
  'empiricalSelectionRate', 'reasons', 'risks',
  'fixtureId', 'leagueSlug', 'homeTeamId', 'awayTeamId', 'sourceKickoffAt',
])

class CandidateApiError extends Error {
  constructor(status, code) {
    super(code)
    this.status = status
    this.code = code
  }
}

function fail(status, code) {
  throw new CandidateApiError(status, code)
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function base64UrlBytes(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  return Uint8Array.from(atob(padded), character => character.charCodeAt(0))
}

function decodeJsonSegment(value) {
  try {
    return JSON.parse(decoder.decode(base64UrlBytes(value)))
  } catch {
    fail(401, 'invalid_machine_token')
  }
}

let jwksCache = { expiresAt: 0, keys: [] }

async function githubJwks(forceRefresh = false) {
  if (!forceRefresh && jwksCache.expiresAt > Date.now() && jwksCache.keys.length) return jwksCache.keys
  let response
  try {
    response = await fetch(OIDC_JWKS_URL, { headers: { Accept: 'application/json' }, cache: 'no-store' })
  } catch {
    fail(503, 'oidc_verification_unavailable')
  }
  if (!response.ok) fail(503, 'oidc_verification_unavailable')
  let body
  try { body = await response.json() } catch { fail(503, 'oidc_verification_unavailable') }
  if (!Array.isArray(body?.keys)) fail(503, 'oidc_verification_unavailable')
  jwksCache = { expiresAt: Date.now() + 5 * 60 * 1000, keys: body.keys }
  return jwksCache.keys
}

function allowedAudience(audience) {
  return audience === OIDC_AUDIENCE || (Array.isArray(audience) && audience.includes(OIDC_AUDIENCE))
}

async function verifyGithubOidc(request) {
  const authorization = request.headers.get('Authorization') || ''
  const match = authorization.match(/^Bearer ([A-Za-z0-9._-]{40,16384})$/)
  if (!match) fail(401, 'unauthorized')
  const token = match[1]
  const parts = token.split('.')
  if (parts.length !== 3) fail(401, 'invalid_machine_token')
  const [encodedHeader, encodedClaims, encodedSignature] = parts
  const header = decodeJsonSegment(encodedHeader)
  const claims = decodeJsonSegment(encodedClaims)
  if (header?.alg !== 'RS256' || typeof header?.kid !== 'string') fail(401, 'invalid_machine_token')

  let key = (await githubJwks()).find(item => item?.kid === header.kid)
  if (!key) key = (await githubJwks(true)).find(item => item?.kid === header.kid)
  if (!key || key.kty !== 'RSA' || key.use !== 'sig') fail(401, 'invalid_machine_token')

  let verified = false
  try {
    const publicKey = await crypto.subtle.importKey(
      'jwk', key, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'],
    )
    verified = await crypto.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5' },
      publicKey,
      base64UrlBytes(encodedSignature),
      encoder.encode(`${encodedHeader}.${encodedClaims}`),
    )
  } catch {
    fail(401, 'invalid_machine_token')
  }
  if (!verified) fail(401, 'invalid_machine_token')

  const now = Math.floor(Date.now() / 1000)
  const audienceOk = allowedAudience(claims.aud)
  const timeOk = Number.isFinite(claims.exp) && claims.exp > now
    && Number.isFinite(claims.iat) && claims.iat <= now + 60 && claims.iat >= now - 10 * 60
    && Number.isFinite(claims.nbf) && claims.nbf <= now + 60
  const identityOk = claims.iss === OIDC_ISSUER && audienceOk
    && claims.sub === EXPECTED_SUBJECT
    && claims.repository === EXPECTED_REPOSITORY
    && String(claims.repository_id) === EXPECTED_REPOSITORY_ID
    && claims.repository_owner === 'prophete221'
    && String(claims.repository_owner_id) === EXPECTED_OWNER_ID
    && claims.ref === 'refs/heads/main'
    && claims.workflow_ref === EXPECTED_WORKFLOW_REF
    && ['push', 'schedule', 'workflow_dispatch'].includes(claims.event_name)
    && /^\d{1,24}$/.test(String(claims.run_id || ''))
    && /^[1-9]\d{0,3}$/.test(String(claims.run_attempt || ''))
  if (!timeOk || !identityOk) fail(403, 'machine_identity_not_allowed')
  return { syncId: `${claims.run_id}:${claims.run_attempt}`, eventName: claims.event_name }
}

async function readJsonBounded(request, maxBytes) {
  const declared = Number(request.headers.get('Content-Length') || 0)
  if (declared > maxBytes) fail(413, 'payload_too_large')
  if (!request.body) fail(422, 'invalid_json')
  const reader = request.body.getReader()
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel().catch(() => {})
        fail(413, 'payload_too_large')
      }
      chunks.push(value)
    }
  } catch (error) {
    if (error instanceof CandidateApiError) throw error
    fail(422, 'invalid_json')
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    const data = JSON.parse(decoder.decode(bytes))
    if (!data || typeof data !== 'object' || Array.isArray(data)) fail(422, 'invalid_json')
    return data
  } catch (error) {
    if (error instanceof CandidateApiError) throw error
    fail(422, 'invalid_json')
  }
}

function parseTime(value) {
  if (typeof value !== 'string') return NaN
  return Date.parse(value)
}

function boundedString(value, maxLength = 160) {
  return typeof value === 'string' && value.trim().length > 0
    && value.trim().length <= maxLength && !/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value)
}

function normalizeIdentityText(value) {
  return String(value ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function normalizedMarket(value) {
  const normalized = String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (normalized === 'btts') return 'BTTS'
  if (normalized === 'over25' || normalized === 'o25') return 'OVER_25'
  return null
}

function normalizedSelection(value) {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (normalized === 'yes' || normalized === 'oui') return 'YES'
  if (normalized === 'no' || normalized === 'non') return 'NO'
  return null
}

function normalizedMatchState(value) {
  return MATCH_STATE_ALIASES.get(String(value ?? '').trim().toUpperCase()) ?? null
}

async function expectedCandidateKey(candidate) {
  const market = normalizedMarket(candidate.market)
  const selection = normalizedSelection(candidate.selection)
  const date = String(candidate.date ?? '').slice(0, 10)
  const league = normalizeIdentityText(candidate.league)
  const home = normalizeIdentityText(candidate.home)
  const away = normalizeIdentityText(candidate.away)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !league || !home || !away || !market || !selection) return null
  const identity = [date, league, home, away, market, selection].join('|')
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(identity))
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('')
}

function cleanRationale(value, minimum, maximum) {
  if (!Array.isArray(value) || value.length < minimum || value.length > maximum
    || value.some(item => !boundedString(item, 300))) return null
  return value.map(item => item.trim())
}

export async function validateCandidate(candidate, nowMs) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) fail(422, 'invalid_candidate')
  const candidateKey = candidate.candidateKey
  const qualityTier = candidate.qualityTier ?? 'vip'
  const probabilitySource = candidate.probabilitySource ?? (qualityTier === 'vip' ? 'gemini-estimate' : null)
  const market = normalizedMarket(candidate.market)
  const selection = normalizedSelection(candidate.selection)
  const freeMarket = candidate.freeMarket == null ? null : normalizedMarket(candidate.freeMarket)
  const freeSelection = candidate.freeSelection == null ? null : normalizedSelection(candidate.freeSelection)
  const freeReferenceValid = candidate.freeMarket == null && candidate.freeSelection == null
    || candidate.freeMarket != null && candidate.freeSelection != null && freeMarket && freeSelection
      && !(freeMarket === market && freeSelection === selection)
  const kickoffMs = parseTime(candidate.kickoffAt)
  const analyzedMs = parseTime(candidate.analyzedAt)
  const probability = candidate.probability
  const expectedConfidence = Math.round(Number(probability) * 100)
  const reasons = cleanRationale(candidate.reasons, 2, 4)
  const risks = cleanRationale(candidate.risks, 1, 2)
  const matchState = normalizedMatchState(candidate.matchState)
  const sourceStates = ['sourceMatchStatus', 'sourceStatus'].map(field => candidate[field]).filter(value => value != null)
  const stateEvidenceValid = matchState === 'PENDING' && sourceStates.length > 0
    && sourceStates.every(value => normalizedMatchState(value) === 'PENDING')
  const date = String(candidate.date ?? '')
  const time = String(candidate.time ?? '')
  const empiricalSelectionRate = candidate.empiricalSelectionRate
  const homeSelectionRate = candidate.homeSelectionRate
  const awaySelectionRate = candidate.awaySelectionRate
  const expectedKickoffMs = /^\d{4}-\d{2}-\d{2}$/.test(date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
    ? Date.parse(`${date}T${time}:00.000Z`)
    : NaN
  const ratesValid = [empiricalSelectionRate, homeSelectionRate, awaySelectionRate]
    .every(rate => typeof rate === 'number' && Number.isFinite(rate) && rate >= 0 && rate <= 1)
  const averageRateConsistent = ratesValid
    && Math.abs(empiricalSelectionRate - (homeSelectionRate + awaySelectionRate) / 2) <= 0.01 + 1e-9
  const vipProbabilitySupported = qualityTier === 'vip' && probabilitySource === 'gemini-estimate'
    && typeof probability === 'number' && Number.isFinite(probability) && probability > 0 && probability < 1
    && candidate.confidence === expectedConfidence && MODEL_CONFIDENCE.has(candidate.aiConfidence)
    && candidate.sourceModel === 'gemini-3.5-flash-lite'
  const supported = typeof candidateKey === 'string' && /^[a-f0-9]{64}$/.test(candidateKey)
    && market && ACCEPTED_MARKETS.has(market) && selection
    && boundedString(candidate.matchId, 160) && boundedString(candidate.home, 120)
    && boundedString(candidate.away, 120) && boundedString(candidate.league, 160)
    && /^\d{4}-\d{2}-\d{2}$/.test(date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
    && stateEvidenceValid
    && Number.isFinite(kickoffMs) && kickoffMs === expectedKickoffMs && kickoffMs > nowMs
    && Number.isFinite(analyzedMs) && analyzedMs <= nowMs + MAX_FUTURE_SKEW_MS
    && nowMs - analyzedMs <= MAX_ANALYSIS_AGE_MS
    && vipProbabilitySupported
    && candidate.dataQuality === 'HIGH' && candidate.dataSource === 'ESPN_TEAM_SCHEDULE'
    && Number.isInteger(candidate.matchCountHome) && candidate.matchCountHome >= 8
    && Number.isInteger(candidate.matchCountAway) && candidate.matchCountAway >= 8
    && Number.isInteger(candidate.formCountHome) && candidate.formCountHome >= 5
    && Number.isInteger(candidate.formCountAway) && candidate.formCountAway >= 5
    && ratesValid && averageRateConsistent
    && reasons && risks && freeReferenceValid
  if (!supported) fail(422, 'candidate_failed_validation')
  const computedKey = await expectedCandidateKey(candidate)
  if (computedKey !== candidateKey) fail(422, 'candidate_key_mismatch')

  const fixture = {}
  if (!/^\d{1,20}$/.test(candidate.fixtureId || '')
    || !/^[a-z0-9]+(?:\.[a-z0-9]+){1,3}$/.test(candidate.leagueSlug || '')
    || !/^\d{1,20}$/.test(candidate.homeTeamId || '') || !/^\d{1,20}$/.test(candidate.awayTeamId || '')
    || candidate.homeTeamId === candidate.awayTeamId || parseTime(candidate.sourceKickoffAt) !== kickoffMs) {
    fail(422, 'invalid_fixture_provenance')
  }
  Object.assign(fixture, {
    fixtureId: String(candidate.fixtureId), leagueSlug: candidate.leagueSlug,
    homeTeamId: String(candidate.homeTeamId), awayTeamId: String(candidate.awayTeamId),
    sourceKickoffAt: new Date(kickoffMs).toISOString(),
  })
  const risk = assessPickRisk({ ...candidate, qualityTier, probabilitySource, matchState }, nowMs)
  if (!risk) fail(422, 'risk_evidence_missing_or_inconsistent')
  const clean = {
    candidateKey,
    matchId: candidate.matchId.trim(),
    home: candidate.home.trim(),
    away: candidate.away.trim(),
    league: candidate.league.trim(),
    date,
    time,
    matchState,
    ...(typeof candidate.sourceMatchStatus === 'string' ? { sourceMatchStatus: candidate.sourceMatchStatus.trim().toUpperCase() } : {}),
    ...(typeof candidate.sourceStatus === 'string' ? { sourceStatus: candidate.sourceStatus.trim().toUpperCase() } : {}),
    kickoffAt: new Date(kickoffMs).toISOString(),
    market,
    freeMarket,
    freeSelection,
    selection,
    probability,
    confidence: candidate.confidence,
    aiConfidence: candidate.aiConfidence,
    qualityTier,
    probabilitySource,
    riskLevel: risk.level,
    riskReasons: risk.reasons,
    riskPolicy: risk.policy,
    dataQuality: candidate.dataQuality,
    dataSource: candidate.dataSource,
    matchCountHome: candidate.matchCountHome,
    matchCountAway: candidate.matchCountAway,
    formCountHome: candidate.formCountHome,
    formCountAway: candidate.formCountAway,
    sourceModel: candidate.sourceModel,
    homeSelectionRate,
    awaySelectionRate,
    empiricalSelectionRate,
    reasons,
    risks,
    analyzedAt: new Date(analyzedMs).toISOString(),
    status: 'pending_owner_approval',
    ...fixture,
  }
  const materialJson = JSON.stringify(Object.fromEntries(MATERIAL_FIELDS.map(field => [field, clean[field]])))
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(materialJson))
  const materialHash = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('')
  return { candidate: clean, materialJson, materialHash }
}

function auditForStorage(audit, acceptedCount, policy, candidates = []) {
  const automatic = policy === VIP_PUBLICATION_POLICY
  const minimumTargetFixtures = 2
  const maximumSelectedFixtures = 5
  const selectedDistinctFixtures = new Set(candidates.map(item => item.candidate.fixtureId)).size
  const shortfall = Math.max(0, minimumTargetFixtures - selectedDistinctFixtures)
  const sourceSelectedDistinct = audit?.selectedDistinctFixtures
  const workerReducedSelection = Number.isInteger(sourceSelectedDistinct) && sourceSelectedDistinct !== selectedDistinctFixtures
  const shortfallReason = shortfall === 0 ? null : workerReducedSelection
    ? 'worker_validation_reduced_selected_fixtures_below_target'
    : boundedString(audit?.shortfallReason, 160) ? audit.shortfallReason
      : selectedDistinctFixtures === 0 ? 'no_valid_gemini_fixtures_after_exclusions'
        : 'insufficient_distinct_eligible_fixtures'
  return {
    payloadFresh: audit?.payloadFresh === true,
    evaluationComplete: audit?.evaluationComplete === true,
    publicationPolicy: automatic ? VIP_PUBLICATION_POLICY : null,
    inputRows: Number.isSafeInteger(audit?.inputRows) && audit.inputRows >= 0 ? audit.inputRows : null,
    verifiedGeminiRows: Number.isSafeInteger(audit?.verifiedGeminiRows) && audit.verifiedGeminiRows >= 0 ? audit.verifiedGeminiRows : null,
    eligibleBeforeFreeExclusion: Number.isSafeInteger(audit?.eligibleBeforeFreeExclusion) && audit.eligibleBeforeFreeExclusion >= 0 ? audit.eligibleBeforeFreeExclusion : null,
    excludedAlreadyFree: Number.isSafeInteger(audit?.excludedAlreadyFree) && audit.excludedAlreadyFree >= 0 ? audit.excludedAlreadyFree : null,
    excludedDuplicateKey: Number.isSafeInteger(audit?.excludedDuplicateKey) && audit.excludedDuplicateKey >= 0 ? audit.excludedDuplicateKey : null,
    minimumTargetFixtures,
    maximumSelectedFixtures,
    rankingPolicy: boundedString(audit?.rankingPolicy, 120) ? audit.rankingPolicy : 'actual-model-probability-risk-confidence-sample-fixture-v1',
    eligibleDistinctFixturesAfterExclusions: Number.isSafeInteger(audit?.eligibleDistinctFixturesAfterExclusions)
      && audit.eligibleDistinctFixturesAfterExclusions >= 0 ? audit.eligibleDistinctFixturesAfterExclusions : null,
    selectedDistinctFixtures,
    shortfall,
    shortfallReason,
    rejected: audit?.rejected && typeof audit.rejected === 'object' && !Array.isArray(audit.rejected) ? audit.rejected : {},
    ownerOutcome: selectedDistinctFixtures === 0 ? 'no_eligible_picks_today'
      : shortfall > 0 ? 'partial_target_shortfall' : 'ready_for_owner_approval',
    ownerMessage: selectedDistinctFixtures === 0
      ? 'Cette analyse ne contient aucun candidat VIP admissible après exclusions.'
      : shortfall > 0
        ? `${selectedDistinctFixtures} match(s) distinct(s) validé(s) sur un objectif de ${minimumTargetFixtures}; shortfall ${shortfall}. Aucun fallback empirique ne sera créé.`
        : automatic ? `${selectedDistinctFixtures} match(s) distinct(s) VIP admis; publication soumise à une nouvelle vérification par le sender.`
          : `${selectedDistinctFixtures} match(s) distinct(s) VIP prêt(s) pour approbation du propriétaire.`,
  }
}

async function handleCandidateSync(request, env, headers) {
  try {
    if (request.method !== 'POST') fail(405, 'method_not_allowed')
    const identity = await verifyGithubOidc(request)
    const publicationMode = identity.eventName === 'schedule' ? 'scheduled' : 'immediate'
    const data = await readJsonBounded(request, MAX_SYNC_BYTES)
    if (data.version !== 1 || !Array.isArray(data.candidates) || data.candidates.length > MAX_CANDIDATES_PER_SYNC) {
      fail(422, 'invalid_sync_payload')
    }
    const audit = data.lastAudit
    if (audit?.payloadFresh !== true || audit?.evaluationComplete !== true) {
      return jsonResponse({ ok: true, synced: false, reason: 'source_incomplete' }, 200, headers)
    }

    const nowMs = Date.now()
    const sourceUpdatedMs = parseTime(data.sourceUpdatedAt)
    const generatedMs = parseTime(data.generatedAt)
    const auditSourceUpdatedMs = parseTime(audit.sourceUpdatedAt)
    if (!Number.isFinite(sourceUpdatedMs) || !Number.isFinite(generatedMs)
      || sourceUpdatedMs !== auditSourceUpdatedMs) fail(422, 'invalid_sync_timestamps')
    if (sourceUpdatedMs > nowMs + MAX_FUTURE_SKEW_MS || generatedMs > nowMs + MAX_FUTURE_SKEW_MS) {
      fail(422, 'invalid_sync_timestamps')
    }
    if (nowMs - sourceUpdatedMs > MAX_ANALYSIS_AGE_MS || nowMs - generatedMs > MAX_GENERATED_AGE_MS) {
      return jsonResponse({ ok: true, synced: false, reason: 'stale_source' }, 200, headers)
    }

    const validated = []
    const seen = new Set()
    for (const candidate of data.candidates) {
      const item = await validateCandidate(candidate, nowMs)
      if (seen.has(item.candidate.candidateKey)) fail(422, 'duplicate_candidate_key')
      seen.add(item.candidate.candidateKey)
      validated.push(item)
    }

    const syncId = `github:${identity.syncId}`
    const existingRun = await env.DB.prepare('SELECT run_id, accepted_count FROM vip_candidate_sync_runs WHERE run_id = ?')
      .bind(syncId).first()
    if (existingRun) {
      return jsonResponse({ ok: true, synced: true, duplicate: true, syncId, acceptedCount: Number(existingRun.accepted_count || 0), publicationMode }, 200, headers)
    }
    const state = await env.DB.prepare('SELECT last_generated_at FROM vip_candidate_sync_state WHERE id = ?')
      .bind('vip').first()
    if (state && typeof state.last_generated_at === 'string' && generatedMs <= parseTime(state.last_generated_at)) {
      return jsonResponse({ ok: true, synced: false, reason: 'older_snapshot' }, 200, headers)
    }

    const generatedAt = new Date(generatedMs).toISOString()
    const sourceUpdatedAt = new Date(sourceUpdatedMs).toISOString()
    const receivedAt = new Date(nowMs).toISOString()
    const statements = [env.DB.prepare(`
      INSERT INTO vip_candidate_sync_state (id, last_generated_at, last_source_updated_at, last_sync_id, updated_at)
      VALUES ('vip', ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        last_generated_at = excluded.last_generated_at,
        last_source_updated_at = excluded.last_source_updated_at,
        last_sync_id = excluded.last_sync_id,
        updated_at = excluded.updated_at
      WHERE excluded.last_generated_at >= vip_candidate_sync_state.last_generated_at
    `).bind(generatedAt, sourceUpdatedAt, syncId, receivedAt)]

    for (const item of validated) {
      const candidate = item.candidate
      statements.push(env.DB.prepare(`
        INSERT INTO vip_candidates (
          candidate_key, material_hash, candidate_json, match_id, kickoff_at, analyzed_at,
          match_state, status, first_seen_at, last_seen_at, last_seen_sync_id,
          approved_at, rejected_at, ineligible_at, ineligible_reason,
          published_at, publication_window, telegram_message_id
        )
        SELECT ?, ?, ?, ?, ?, ?, ?, 'pending_owner_approval', ?, ?, ?,
               NULL, NULL, NULL, NULL, NULL, NULL, NULL
        WHERE EXISTS (SELECT 1 FROM vip_candidate_sync_state WHERE id = 'vip' AND last_sync_id = ?)
        ON CONFLICT(candidate_key) DO UPDATE SET
          material_hash = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.material_hash ELSE excluded.material_hash END,
          candidate_json = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.candidate_json ELSE excluded.candidate_json END,
          match_id = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.match_id ELSE excluded.match_id END,
          kickoff_at = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.kickoff_at ELSE excluded.kickoff_at END,
          analyzed_at = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.analyzed_at ELSE excluded.analyzed_at END,
          match_state = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.match_state ELSE excluded.match_state END,
          status = CASE
            WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN 'published'
            WHEN vip_candidates.material_hash = excluded.material_hash AND vip_candidates.status IN ('approved', 'rejected') THEN vip_candidates.status
            ELSE 'pending_owner_approval'
          END,
          first_seen_at = vip_candidates.first_seen_at,
          last_seen_at = excluded.last_seen_at,
          last_seen_sync_id = excluded.last_seen_sync_id,
          approved_at = CASE
            WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.approved_at
            WHEN vip_candidates.material_hash = excluded.material_hash AND vip_candidates.status = 'approved' THEN vip_candidates.approved_at
            ELSE NULL
          END,
          rejected_at = CASE
            WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.rejected_at
            WHEN vip_candidates.material_hash = excluded.material_hash AND vip_candidates.status = 'rejected' THEN vip_candidates.rejected_at
            ELSE NULL
          END,
          ineligible_at = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.ineligible_at ELSE NULL END,
          ineligible_reason = CASE WHEN vip_candidates.status = 'published' OR vip_candidates.telegram_message_id IS NOT NULL THEN vip_candidates.ineligible_reason ELSE NULL END,
          published_at = vip_candidates.published_at,
          publication_window = vip_candidates.publication_window,
          telegram_message_id = vip_candidates.telegram_message_id
        WHERE NOT EXISTS (SELECT 1 FROM vip_publications p WHERE p.candidate_key = vip_candidates.candidate_key)
      `).bind(
        candidate.candidateKey, item.materialHash, JSON.stringify(candidate), candidate.matchId,
        candidate.kickoffAt, candidate.analyzedAt, candidate.matchState,
        generatedAt, generatedAt, syncId, syncId,
      ))
    }

    statements.push(env.DB.prepare(`
      UPDATE vip_candidates
      SET status = 'ineligible', ineligible_at = ?, ineligible_reason = 'not_in_current_eligible_source', approved_at = NULL
      WHERE status IN ('pending_owner_approval', 'approved')
        AND published_at IS NULL AND last_seen_sync_id <> ?
        AND EXISTS (SELECT 1 FROM vip_candidate_sync_state WHERE id = 'vip' AND last_sync_id = ?)
        AND NOT EXISTS (SELECT 1 FROM vip_publications p WHERE p.candidate_key = vip_candidates.candidate_key)
    `).bind(receivedAt, syncId, syncId))
    const auditJson = JSON.stringify(auditForStorage(audit, validated.length, env.VIP_PUBLICATION_POLICY, validated))
    statements.push(env.DB.prepare(`
      INSERT OR IGNORE INTO vip_candidate_sync_runs
        (run_id, source_updated_at, generated_at, received_at, candidate_count, accepted_count, audit_json)
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE EXISTS (SELECT 1 FROM vip_candidate_sync_state WHERE id = 'vip' AND last_sync_id = ?)
    `).bind(syncId, sourceUpdatedAt, generatedAt, receivedAt, data.candidates.length, validated.length, auditJson, syncId))

    await env.DB.batch(statements)
    return jsonResponse({ ok: true, synced: true, duplicate: false, syncId, acceptedCount: validated.length, publicationMode }, 200, headers)
  } catch (error) {
    if (error instanceof CandidateApiError) return jsonResponse({ ok: false, error: error.code }, error.status, headers)
    return jsonResponse({ ok: false, error: 'storage_unavailable' }, 503, headers)
  }
}

async function adminListCandidates(env, headers) {
  try {
    const result = await env.DB.prepare(`
      SELECT candidate_key, material_hash, candidate_json, status, first_seen_at, last_seen_at,
             approved_at, rejected_at, ineligible_at, ineligible_reason, published_at, telegram_message_id, last_seen_sync_id
      FROM vip_candidates
      ORDER BY CASE status
        WHEN 'pending_owner_approval' THEN 0 WHEN 'approved' THEN 1
        WHEN 'ineligible' THEN 2 WHEN 'rejected' THEN 3 ELSE 4 END,
        kickoff_at ASC
      LIMIT 200
    `).all()
    const candidates = (result.results || []).map(row => {
      let candidate
      try { candidate = JSON.parse(row.candidate_json) } catch { fail(503, 'storage_unavailable') }
      return {
        ...candidate,
        candidateKey: row.candidate_key,
        materialHash: row.material_hash,
        status: row.status,
        firstSeenAt: row.first_seen_at,
        lastSeenAt: row.last_seen_at,
        lastSeenSyncId: row.last_seen_sync_id,
        approvedAt: row.approved_at,
        rejectedAt: row.rejected_at,
        ineligibleAt: row.ineligible_at,
        ineligibleReason: row.ineligible_reason,
        publishedAt: row.published_at,
        telegramMessageId: row.telegram_message_id,
      }
    })
    const syncRow = await env.DB.prepare(`
      SELECT source_updated_at, generated_at, candidate_count, accepted_count, audit_json, run_id
      FROM vip_candidate_sync_runs ORDER BY generated_at DESC, received_at DESC LIMIT 1
    `).first()
    let latestSync = null
    if (syncRow) {
      let audit
      try { audit = JSON.parse(syncRow.audit_json || '{}') } catch { fail(503, 'storage_unavailable') }
      const acceptedCount = Number(syncRow.accepted_count || 0)
      latestSync = {
        syncId: typeof syncRow.run_id === 'string' ? syncRow.run_id : null,
        sourceUpdatedAt: syncRow.source_updated_at,
        generatedAt: syncRow.generated_at,
        candidateCount: Number(syncRow.candidate_count || 0),
        acceptedCount,
        inputRows: Number.isSafeInteger(audit.inputRows) && audit.inputRows >= 0 ? audit.inputRows : null,
        eligibleBeforeFreeExclusion: Number.isSafeInteger(audit.eligibleBeforeFreeExclusion) && audit.eligibleBeforeFreeExclusion >= 0 ? audit.eligibleBeforeFreeExclusion : null,
        excludedAlreadyFree: Number.isSafeInteger(audit.excludedAlreadyFree) && audit.excludedAlreadyFree >= 0 ? audit.excludedAlreadyFree : null,
        excludedDuplicateKey: Number.isSafeInteger(audit.excludedDuplicateKey) && audit.excludedDuplicateKey >= 0 ? audit.excludedDuplicateKey : null,
        minimumTargetFixtures: Number.isSafeInteger(audit.minimumTargetFixtures) && audit.minimumTargetFixtures >= 1 ? audit.minimumTargetFixtures : null,
        maximumSelectedFixtures: Number.isSafeInteger(audit.maximumSelectedFixtures) && audit.maximumSelectedFixtures >= 1 ? audit.maximumSelectedFixtures : null,
        rankingPolicy: typeof audit.rankingPolicy === 'string' ? audit.rankingPolicy : null,
        eligibleDistinctFixturesAfterExclusions: Number.isSafeInteger(audit.eligibleDistinctFixturesAfterExclusions)
          && audit.eligibleDistinctFixturesAfterExclusions >= 0 ? audit.eligibleDistinctFixturesAfterExclusions : null,
        selectedDistinctFixtures: Number.isSafeInteger(audit.selectedDistinctFixtures) && audit.selectedDistinctFixtures >= 0
          ? audit.selectedDistinctFixtures : null,
        shortfall: Number.isSafeInteger(audit.shortfall) && audit.shortfall >= 0 ? audit.shortfall : null,
        shortfallReason: typeof audit.shortfallReason === 'string' ? audit.shortfallReason : null,
        ownerOutcome: audit.ownerOutcome || (acceptedCount === 0 ? 'no_eligible_picks_today' : 'awaiting_owner_approval'),
        ownerMessage: acceptedCount === 0
          ? 'Cette analyse ne contient aucun candidat VIP admissible après exclusions.'
          : typeof audit.ownerMessage === 'string' && audit.ownerMessage.trim()
            ? audit.ownerMessage : `${acceptedCount} candidat(s) VIP admis dans cet instantané; toute publication reste soumise aux contrôles du sender.`,
      }
    }
    const nowMs = Date.now()
    const presentedCandidates = await Promise.all(candidates.map(async candidate => {
      const isCurrent = Boolean(latestSync?.syncId && candidate.lastSeenSyncId === latestSync.syncId)
      let canReview = false
      let reviewBlockedReason = !isCurrent ? 'historical_snapshot' : candidate.status !== 'pending_owner_approval'
        ? candidate.ineligibleReason || candidate.status : 'candidate_failed_validation'
      if (isCurrent && latestSync.acceptedCount > 0 && candidate.status === 'pending_owner_approval') {
        try {
          const validated = await validateCandidate(candidate, nowMs)
          canReview = validated.materialHash === candidate.materialHash
          if (canReview) reviewBlockedReason = null
        } catch { /* Presentation never grants eligibility to an invalid or started fixture. */ }
      }
      const displayedRisk = assessPickRisk(candidate, nowMs)
      const displayRisk = {
        level: displayedRisk?.level ?? null,
        reasons: displayedRisk?.reasons ?? [],
        policy: displayedRisk?.policy ?? null,
        assessedAt: new Date(nowMs).toISOString(),
        evidenceStatus: displayedRisk ? 'reconciled_snapshot_only' : 'insufficient_or_stale_evidence',
      }
      return { ...candidate, isCurrent, canReview, reviewBlockedReason, displayRisk }
    }))
    return jsonResponse({ ok: true, candidates: presentedCandidates, latestSync, publicationEnabled: publicationConfigured(env) }, 200, headers)
  } catch (error) {
    if (error instanceof CandidateApiError) return jsonResponse({ ok: false, error: error.code }, error.status, headers)
    return jsonResponse({ ok: false, error: 'storage_unavailable' }, 503, headers)
  }
}

async function adminCandidateDecision(candidateKey, request, env, headers) {
  try {
    if (request.method !== 'POST') fail(405, 'method_not_allowed')
    if (!/^[a-f0-9]{64}$/.test(candidateKey)) fail(404, 'candidate_not_found')
    const data = await readJsonBounded(request, 16_384)
    if (!['approve', 'reject'].includes(data.decision) || typeof data.materialHash !== 'string' || !/^[a-f0-9]{64}$/.test(data.materialHash)) {
      fail(422, 'invalid_decision')
    }
    const row = await env.DB.prepare(`
      SELECT material_hash, candidate_json, status, kickoff_at, analyzed_at, match_state, last_seen_sync_id
      FROM vip_candidates WHERE candidate_key = ?
    `).bind(candidateKey).first()
    if (!row) fail(404, 'candidate_not_found')
    if (row.status !== 'pending_owner_approval') fail(409, 'candidate_not_pending')
    if (row.material_hash !== data.materialHash) fail(409, 'candidate_changed')

    const nowMs = Date.now()
    const kickoffMs = parseTime(row.kickoff_at)
    const analyzedMs = parseTime(row.analyzed_at)
    if (data.decision === 'approve' && (!Number.isFinite(kickoffMs) || kickoffMs <= nowMs
      || !Number.isFinite(analyzedMs) || analyzedMs > nowMs + MAX_FUTURE_SKEW_MS
      || nowMs - analyzedMs > MAX_ANALYSIS_AGE_MS
      || normalizedMatchState(row.match_state) !== 'PENDING')) {
      await env.DB.prepare(`
        UPDATE vip_candidates SET status = 'ineligible', ineligible_at = ?, ineligible_reason = 'candidate_stale_or_started'
        WHERE candidate_key = ? AND status = 'pending_owner_approval' AND material_hash = ?
          AND NOT EXISTS (SELECT 1 FROM vip_publications p WHERE p.candidate_key = vip_candidates.candidate_key)
      `).bind(new Date(nowMs).toISOString(), candidateKey, data.materialHash).run()
      fail(409, 'candidate_no_longer_eligible')
    }

    const timestamp = new Date(nowMs).toISOString()
    const status = data.decision === 'approve' ? 'approved' : 'rejected'
    const result = await env.DB.prepare(`
      UPDATE vip_candidates
      SET status = ?, approved_at = ?, rejected_at = ?, ineligible_at = NULL, ineligible_reason = NULL
      WHERE candidate_key = ? AND status = 'pending_owner_approval' AND material_hash = ?
        AND last_seen_sync_id = ?
        AND NOT EXISTS (SELECT 1 FROM vip_publications p WHERE p.candidate_key = vip_candidates.candidate_key)
    `).bind(
      status,
      data.decision === 'approve' ? timestamp : null,
      data.decision === 'reject' ? timestamp : null,
      candidateKey,
      data.materialHash,
      row.last_seen_sync_id,
    ).run()
    if (Number(result.meta?.changes || 0) !== 1) fail(409, 'candidate_changed')
    return jsonResponse({
      ok: true,
      candidateKey,
      status,
      approvedAt: status === 'approved' ? timestamp : null,
      rejectedAt: status === 'rejected' ? timestamp : null,
      published: false,
      telegramSent: false,
    }, 200, headers)
  } catch (error) {
    if (error instanceof CandidateApiError) return jsonResponse({ ok: false, error: error.code }, error.status, headers)
    return jsonResponse({ ok: false, error: 'storage_unavailable' }, 503, headers)
  }
}

export { adminCandidateDecision, adminListCandidates, handleCandidateSync }
