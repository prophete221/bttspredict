import { validateCandidate } from './vip-candidates.js'
import { publicationConfigured, VIP_PUBLICATION_POLICY, VIP_PUBLICATION_TIMES } from './vip-publication-config.js'
export { publicationConfigured, VIP_PUBLICATION_POLICY, VIP_PUBLICATION_TIMES } from './vip-publication-config.js'
const MAX_AGE_MS = 12 * 60 * 60 * 1000
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000
const MAX_WINDOW_DELAY_MS = 5 * 60 * 1000
const MIN_KICKOFF_LEAD_MS = 60 * 1000
const PREMATCH_NAMES = new Set(['STATUS_SCHEDULED', 'STATUS_PRE', 'STATUS_NOT_STARTED', 'STATUS_PRE_GAME'])

export function publicationWindowAt(value) {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime()) || date.getUTCSeconds() !== 0 || date.getUTCMilliseconds() !== 0) return null
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Dakar', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).map(part => [part.type, part.value]))
  const time = `${parts.hour}:${parts.minute}`
  if (!VIP_PUBLICATION_TIMES.includes(time)) return null
  return { key: `${parts.year}-${parts.month}-${parts.day}T${time}@Africa/Dakar`, time, timezone: 'Africa/Dakar', scheduledAt: date.toISOString() }
}

function fresh(value, now) {
  const timestamp = typeof value === 'string' ? Date.parse(value) : NaN
  return Number.isFinite(timestamp) && timestamp <= now + MAX_FUTURE_SKEW_MS && now - timestamp <= MAX_AGE_MS
}

function normalizeIdentity(value) {
  return String(value ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function normalizeMarket(value) {
  const market = String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  return market === 'btts' ? 'BTTS' : ['over25', 'o25'].includes(market) ? 'OVER_25' : null
}

function normalizeSelection(value) {
  const selection = String(value ?? '').trim().toLowerCase()
  return ['yes', 'oui'].includes(selection) ? 'YES' : ['no', 'non'].includes(selection) ? 'NO' : null
}

function freeIdentity(row, pick = row) {
  const market = normalizeMarket(pick.ai_market ?? pick.type ?? pick.market)
  const selection = normalizeSelection(pick.prediction ?? pick.selection)
  const parts = [row.date, normalizeIdentity(row.league), normalizeIdentity(row.home), normalizeIdentity(row.away), market, selection]
  return /^\d{4}-\d{2}-\d{2}$/.test(String(parts[0] || '')) && parts.every(Boolean) ? parts.join('|') : null
}

function candidateIdentity(candidate) {
  return [candidate.date, normalizeIdentity(candidate.league), normalizeIdentity(candidate.home), normalizeIdentity(candidate.away), candidate.market, candidate.selection].join('|')
}

function compareCandidateStrength(a, b) {
  const riskRank = { FAIBLE: 0, MODÉRÉ: 1, ÉLEVÉ: 2 }
  return Number(a.qualityTier === 'fallback') - Number(b.qualityTier === 'fallback')
    || Math.min(b.empiricalSelectionRate, b.homeSelectionRate, b.awaySelectionRate)
      - Math.min(a.empiricalSelectionRate, a.homeSelectionRate, a.awaySelectionRate)
    || b.probability - a.probability
    || Math.min(b.matchCountHome, b.matchCountAway) - Math.min(a.matchCountHome, a.matchCountAway)
    || riskRank[a.riskLevel] - riskRank[b.riskLevel]
    || Date.parse(a.kickoffAt) - Date.parse(b.kickoffAt)
}

async function boundedJson(url, options, fetcher) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetcher(url, { ...options, signal: controller.signal })
    const declared = Number(response.headers?.get('Content-Length') || 0)
    if (declared > 4_000_000) return null
    const text = await response.text()
    if (text.length > 4_000_000) return null
    let body
    try { body = JSON.parse(text) } catch { return null }
    return { ok: response.ok, status: response.status, body }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

async function publicFreeKeys(now, fetcher) {
  const result = await boundedJson('https://bttspredict.com/predictions.json', {
    headers: { Accept: 'application/json' }, cache: 'no-store',
  }, fetcher)
  const payload = result?.body
  if (!result?.ok || !payload || !fresh(payload.lastUpdated, now)
    || (!Array.isArray(payload.free) && !Array.isArray(payload.predictions))) return null
  const keys = new Set()
  for (const field of ['free', 'freeUpcoming', 'upcoming', 'predictions']) {
    if (!Array.isArray(payload[field])) continue
    for (const row of payload[field]) {
      if (!row || typeof row !== 'object' || Array.isArray(row)) continue
      const key = freeIdentity(row)
      if (key) keys.add(key)
      for (const pick of Array.isArray(row.predictions) ? row.predictions : []) {
        if (!pick || typeof pick !== 'object') continue
        const nestedKey = freeIdentity(row, pick)
        if (nestedKey) keys.add(nestedKey)
      }
    }
  }
  return keys
}

export async function verifyLiveFixture(candidate, now, fetcher = fetch) {
  if (!/^\d{1,20}$/.test(String(candidate.fixtureId || ''))
    || !/^[a-z0-9]+(?:\.[a-z0-9]+){1,3}$/.test(String(candidate.leagueSlug || ''))
    || !/^\d{1,20}$/.test(String(candidate.homeTeamId || ''))
    || !/^\d{1,20}$/.test(String(candidate.awayTeamId || ''))
    || candidate.homeTeamId === candidate.awayTeamId
    || Date.parse(candidate.sourceKickoffAt) !== Date.parse(candidate.kickoffAt)) return false
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${candidate.leagueSlug}/summary?event=${candidate.fixtureId}`
  const result = await boundedJson(url, { headers: { Accept: 'application/json' }, cache: 'no-store' }, fetcher)
  const header = result?.body?.header
  const competition = header?.competitions?.[0]
  if (!result?.ok || !competition || String(header.id || '') !== candidate.fixtureId) return false
  const kickoff = Date.parse(competition.date)
  if (!Number.isFinite(kickoff) || kickoff !== Date.parse(candidate.kickoffAt) || kickoff <= now + MIN_KICKOFF_LEAD_MS) return false
  for (const status of [header.status?.type, competition.status?.type]) {
    if (!status) continue
    if (status.completed === true) return false
    const state = String(status.state || '').trim().toLowerCase()
    const name = String(status.name || '').trim().toUpperCase()
    if (state && state !== 'pre' || name && !PREMATCH_NAMES.has(name)) return false
  }
  const competitors = Array.isArray(competition.competitors) ? competition.competitors : []
  const home = competitors.find(team => team.homeAway === 'home')
  const away = competitors.find(team => team.homeAway === 'away')
  return String(home?.team?.id || '') === candidate.homeTeamId && String(away?.team?.id || '') === candidate.awayTeamId
}

async function telegramRead(env, method, body, fetcher) {
  return boundedJson(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }, fetcher)
}

export async function telegramReadiness(env, fetcher = fetch) {
  const unavailable = { botReachable: false, destinationAccessible: false, canPublish: false }
  if (!publicationConfigured(env)) return unavailable
  const me = await telegramRead(env, 'getMe', {}, fetcher)
  const botId = me?.body?.result?.id
  if (!me?.ok || me.body?.ok !== true || !Number.isSafeInteger(botId) || botId <= 0) return unavailable
  const chatId = String(env.TELEGRAM_CHANNEL_ID)
  const chat = await telegramRead(env, 'getChat', { chat_id: chatId }, fetcher)
  const target = chat?.body?.result
  if (!chat?.ok || chat.body?.ok !== true || String(target?.id) !== chatId || !['channel', 'supergroup'].includes(target.type)) {
    return { ...unavailable, botReachable: true }
  }
  const member = await telegramRead(env, 'getChatMember', { chat_id: chatId, user_id: botId }, fetcher)
  const rights = member?.body?.result
  const allowed = member?.ok && member.body?.ok === true && rights?.user?.id === botId
    && ['creator', 'administrator'].includes(rights.status)
    && (target.type !== 'channel' || rights.can_post_messages === true)
  return { botReachable: true, destinationAccessible: true, canPublish: Boolean(allowed) }
}

export function formatVipMessage(candidate) {
  const market = candidate.market === 'BTTS' ? 'BTTS' : 'Over/Under 2,5'
  const selection = candidate.market === 'BTTS'
    ? candidate.selection === 'YES' ? 'Oui' : 'Non'
    : candidate.selection === 'YES' ? 'Over 2,5' : 'Under 2,5'
  const observed = rate => `${Math.round(rate * 100)} %`
  const fallback = candidate.qualityTier === 'fallback'
  const riskLabel = { FAIBLE: 'FAIBLE', MODÉRÉ: 'MODÉRÉ', ÉLEVÉ: 'ÉLEVÉ' }[candidate.riskLevel]
  if (!riskLabel || !Array.isArray(candidate.riskReasons) || candidate.riskReasons.length < 2) {
    throw new TypeError('risk_assessment_missing')
  }
  return [
    fallback ? 'BTTSPredict — VIP · Sélection de repli' : 'BTTSPredict — Sélection VIP',
    `${candidate.home} — ${candidate.away}`,
    candidate.league,
    `${candidate.date} · ${candidate.time} (Africa/Dakar)`,
    `${market} : ${selection}`,
    fallback
      ? `Probabilité empirique indicative : ${observed(candidate.probability)} (fréquence récente observée, non calibrée; aucune confiance Gemini revendiquée).`
      : `Estimation Gemini : ${observed(candidate.probability)} · confiance du modèle : élevée.`,
    `Taux observés : global ${observed(candidate.empiricalSelectionRate)}, domicile ${observed(candidate.homeSelectionRate)}, extérieur ${observed(candidate.awaySelectionRate)}.`,
    `Échantillon récent : ${candidate.matchCountHome} / ${candidate.matchCountAway} matchs; forme ${candidate.formCountHome} / ${candidate.formCountAway}.`,
    `Niveau de risque : ${riskLabel}.`,
    `Évaluation du risque : ${candidate.riskReasons.join(' · ')}`,
    ...candidate.reasons.map(reason => `• ${reason}`),
    `Risques : ${candidate.risks.join(' · ')}`,
    'Estimation, pas une garantie. 18+ · Joue de manière responsable.',
  ].join('\n')
}

// A single atomic INSERT decides who may send. Unique candidate and window keys
// prevent repeats across cron collisions, future windows and process restarts.
export const CLAIM_PUBLICATION_SQL = `
  INSERT OR IGNORE INTO vip_publications (
    candidate_key, window_key, claim_token, policy_version, material_hash,
    source_sync_id, snapshot_json, message_text, state, claimed_at
  )
  SELECT c.candidate_key, ?1, ?2, ?3, c.material_hash,
         c.last_seen_sync_id, ?4, ?5, 'claimed', ?6
  FROM vip_candidates c
  JOIN vip_candidate_sync_state s ON s.id = 'vip' AND s.last_sync_id = c.last_seen_sync_id
  JOIN vip_candidate_sync_runs r ON r.run_id = s.last_sync_id
  WHERE c.candidate_key = ?7 AND c.material_hash = ?8 AND c.last_seen_sync_id = ?9
    AND c.status IN ('pending_owner_approval', 'approved')
    AND c.published_at IS NULL AND c.telegram_message_id IS NULL
    AND c.match_state IN ('PENDING', 'SCHEDULED', 'NOT_STARTED', 'UPCOMING')
    AND c.kickoff_at > ?10 AND c.analyzed_at >= ?11 AND c.analyzed_at <= ?12
    AND s.last_source_updated_at >= ?11 AND s.last_source_updated_at <= ?12
    AND s.last_generated_at >= ?11 AND s.last_generated_at <= ?12
    AND r.generated_at = s.last_generated_at AND r.source_updated_at = s.last_source_updated_at
    AND r.accepted_count > 0
    AND json_extract(r.audit_json, '$.payloadFresh') = 1
    AND json_extract(r.audit_json, '$.evaluationComplete') = 1
    AND EXISTS (SELECT 1 FROM vip_publication_runs
      WHERE window_key = ?1 AND state = 'running' AND policy_version = ?3)
`

async function finishRun(env, window, state, now, claimed = 0, sent = 0) {
  await env.DB.prepare(`/* publisher:finish-run */
    UPDATE vip_publication_runs SET state = ?, finished_at = ?, claimed_count = ?, sent_count = ?
    WHERE window_key = ? AND state = 'running'
  `).bind(state, new Date(now).toISOString(), claimed, sent, window.key).run()
  return { outcome: state, window: window.key, claimed, sent }
}

export async function reconcileUnconfirmedClaims(env, now = Date.now()) {
  const cutoff = new Date(now - 10 * 60 * 1000).toISOString()
  const timestamp = new Date(now).toISOString()
  await env.DB.batch([
    env.DB.prepare(`/* publisher:abandoned-claims */
      UPDATE vip_publications SET state = 'unknown', resolved_at = ?, error_code = 'outcome_unconfirmed'
      WHERE state = 'claimed' AND claimed_at <= ?
    `).bind(timestamp, cutoff),
    env.DB.prepare(`/* publisher:abandoned-runs */
      UPDATE vip_publication_runs SET state = 'unknown', finished_at = ?
      WHERE state = 'running' AND started_at <= ?
    `).bind(timestamp, cutoff),
  ])
}

/** @param {Record<string, unknown>} env @param {{scheduledTime?: number|string, syncId?: string, expectedSyncId?: string, clock?: () => number, fetcher?: typeof fetch}} options */
export async function publishVipWindow(env, { scheduledTime, syncId, expectedSyncId, clock = Date.now, fetcher = fetch }) {
  const start = clock()
  const isSyncTrigger = typeof syncId === 'string'
  const window = isSyncTrigger && /^[A-Za-z0-9:._-]{1,160}$/.test(syncId)
    ? { key: `sync:${syncId}`, time: 'after-sync', timezone: 'Africa/Dakar', scheduledAt: new Date(start).toISOString() }
    : isSyncTrigger ? null : publicationWindowAt(scheduledTime)
  if (!window || !publicationConfigured(env)) return { outcome: 'disabled_or_not_due', claimed: 0, sent: 0 }
  if (!isSyncTrigger && (start < Number(scheduledTime) - 30_000 || start - Number(scheduledTime) > MAX_WINDOW_DELAY_MS)) {
    return { outcome: 'outside_delivery_window', claimed: 0, sent: 0 }
  }
  const run = await env.DB.prepare(`/* publisher:start-run */
    INSERT OR IGNORE INTO vip_publication_runs (window_key, policy_version, scheduled_at, started_at, state)
    VALUES (?, ?, ?, ?, 'running')
  `).bind(window.key, VIP_PUBLICATION_POLICY, window.scheduledAt, new Date(start).toISOString()).run()
  if (Number(run.meta?.changes || 0) !== 1) return { outcome: 'duplicate_window', claimed: 0, sent: 0 }
  let claim = null
  try {
    const sync = await env.DB.prepare(`/* publisher:latest-sync */
      SELECT s.last_sync_id, s.last_generated_at, s.last_source_updated_at,
             r.accepted_count, r.audit_json
      FROM vip_candidate_sync_state s JOIN vip_candidate_sync_runs r ON r.run_id = s.last_sync_id
      WHERE s.id = 'vip' AND r.generated_at = s.last_generated_at AND r.source_updated_at = s.last_source_updated_at
    `).first()
    let audit
    try { audit = JSON.parse(sync?.audit_json || '{}') } catch { audit = null }
    if (!sync || !fresh(sync.last_generated_at, start) || !fresh(sync.last_source_updated_at, start)
      || audit?.payloadFresh !== true || audit?.evaluationComplete !== true) {
      return await finishRun(env, window, 'source_incomplete', clock())
    }
    if (expectedSyncId && sync.last_sync_id !== expectedSyncId) return await finishRun(env, window, 'superseded_sync', clock())
    if (Number(sync.accepted_count) === 0) return await finishRun(env, window, 'no_candidates', clock())
    const result = await env.DB.prepare(`/* publisher:candidate-rows */
      SELECT c.candidate_key, c.material_hash, c.candidate_json, c.last_seen_sync_id
      FROM vip_candidates c
      WHERE c.last_seen_sync_id = ? AND c.status IN ('pending_owner_approval', 'approved')
        AND c.published_at IS NULL AND c.telegram_message_id IS NULL
        AND NOT EXISTS (SELECT 1 FROM vip_publications p WHERE p.candidate_key = c.candidate_key)
      ORDER BY c.kickoff_at ASC, c.candidate_key ASC LIMIT 200
    `).bind(sync.last_sync_id).all()
    const candidates = []
    for (const row of result.results || []) {
      try {
        const validated = await validateCandidate(JSON.parse(row.candidate_json), clock())
        if (validated.materialHash === row.material_hash && validated.candidate.candidateKey === row.candidate_key
          && row.last_seen_sync_id === sync.last_sync_id) candidates.push({ ...validated, row })
      } catch { /* Invalid/stale candidates are never substituted with synthetic picks. */ }
    }
    candidates.sort((a, b) => compareCandidateStrength(a.candidate, b.candidate)
      || a.candidate.candidateKey.localeCompare(b.candidate.candidateKey))
    if (!candidates.length) return await finishRun(env, window, 'no_candidates', clock())
    const free = await publicFreeKeys(clock(), fetcher)
    if (!free) return await finishRun(env, window, 'source_unavailable', clock())
    let selected = null
    for (const item of candidates) {
      if (free.has(candidateIdentity(item.candidate))) continue
      if (await verifyLiveFixture(item.candidate, clock(), fetcher)) { selected = item; break }
    }
    if (!selected) return await finishRun(env, window, 'no_candidates', clock())
    const ready = await telegramReadiness(env, fetcher)
    if (!ready.canPublish) return await finishRun(env, window, 'destination_unavailable', clock())
    const now = clock()
    if (!isSyncTrigger && now - Number(scheduledTime) > MAX_WINDOW_DELAY_MS) return await finishRun(env, window, 'source_unavailable', now)
    const candidate = selected.candidate
    const message = formatVipMessage(candidate)
    if (message.length > 4000) return await finishRun(env, window, 'source_incomplete', now)
    const token = crypto.randomUUID()
    const reserved = await env.DB.prepare(CLAIM_PUBLICATION_SQL).bind(
      window.key, token, VIP_PUBLICATION_POLICY, JSON.stringify(candidate), message, new Date(now).toISOString(),
      candidate.candidateKey, selected.materialHash, sync.last_sync_id,
      new Date(now + MIN_KICKOFF_LEAD_MS).toISOString(), new Date(now - MAX_AGE_MS).toISOString(),
      new Date(now + MAX_FUTURE_SKEW_MS).toISOString(),
    ).run()
    if (Number(reserved.meta?.changes || 0) !== 1) return await finishRun(env, window, 'claim_lost', clock())
    claim = { token, candidate, materialHash: selected.materialHash }
    // Exactly one send attempt. Timeouts/crashes/malformed replies remain quarantined.
    const response = await telegramRead(env, 'sendMessage', {
      chat_id: String(env.TELEGRAM_CHANNEL_ID), text: message, disable_web_page_preview: true,
    }, fetcher)
    const sent = response?.ok && response.body?.ok === true
      && Number.isSafeInteger(response.body.result?.message_id) && response.body.result.message_id > 0
      && String(response.body.result?.chat?.id) === String(env.TELEGRAM_CHANNEL_ID)
    const timestamp = new Date(clock()).toISOString()
    if (sent) {
      const messageId = String(response.body.result.message_id)
      const committed = await env.DB.batch([
        env.DB.prepare(`/* publisher:mark-candidate-sent */
          UPDATE vip_candidates SET status = 'published', published_at = ?, publication_window = ?, telegram_message_id = ?
          WHERE candidate_key = ? AND material_hash = ? AND status IN ('pending_owner_approval', 'approved')
            AND EXISTS (SELECT 1 FROM vip_publications WHERE candidate_key = ? AND claim_token = ? AND state = 'claimed')
        `).bind(timestamp, window.key, messageId, candidate.candidateKey, selected.materialHash, candidate.candidateKey, token),
        env.DB.prepare(`/* publisher:mark-sent */
          UPDATE vip_publications SET state = 'sent', resolved_at = ?, telegram_message_id = ?, error_code = NULL
          WHERE claim_token = ? AND state = 'claimed'
        `).bind(timestamp, messageId, token),
      ])
      if (Number(committed?.[0]?.meta?.changes || 0) !== 1 || Number(committed?.[1]?.meta?.changes || 0) !== 1) {
        await env.DB.prepare(`/* publisher:mark-unknown-after-send */
          UPDATE vip_publications SET state = 'unknown', resolved_at = ?, error_code = 'state_commit_unconfirmed'
          WHERE claim_token = ? AND state = 'claimed'
        `).bind(timestamp, token).run().catch(() => {})
        return await finishRun(env, window, 'unknown', clock(), 1, 0)
      }
      return await finishRun(env, window, 'sent', clock(), 1, 1)
    }
    const rejected = response && response.body?.ok === false
      && [400, 401, 403, 404, 429].includes(Number(response.body.error_code))
    const outcome = rejected ? 'not_sent' : 'unknown'
    await env.DB.prepare(`/* publisher:mark-unsent */
      UPDATE vip_publications SET state = ?, resolved_at = ?, error_code = ? WHERE claim_token = ? AND state = 'claimed'
    `).bind(outcome, timestamp, rejected ? `telegram_${Number(response.body.error_code)}` : 'telegram_outcome_unconfirmed', token).run()
    return await finishRun(env, window, outcome, clock(), 1, 0)
  } catch {
    if (claim) {
      await env.DB.prepare(`/* publisher:mark-unknown */
        UPDATE vip_publications SET state = 'unknown', resolved_at = ?, error_code = 'outcome_unconfirmed'
        WHERE claim_token = ? AND state = 'claimed'
      `).bind(new Date(clock()).toISOString(), claim.token).run().catch(() => {})
    }
    return await finishRun(env, window, claim ? 'unknown' : 'failed', clock(), claim ? 1 : 0, 0)
      .catch(() => ({ outcome: claim ? 'unknown' : 'failed', claimed: claim ? 1 : 0, sent: 0 }))
  }
}

export async function publishCandidatesAfterSync(env, syncId, options = {}) {
  if (options.publishMode !== 'immediate') {
    return { outcome: 'queued_for_scheduled_window', claimed: 0, sent: 0 }
  }
  return publishVipWindow(env, { ...options, syncId, expectedSyncId: syncId })
}

export async function adminPublicationStatus(env, { fetcher = fetch } = {}) {
  const [counts, latest] = await Promise.all([
    env.DB.prepare('SELECT state, COUNT(*) AS count FROM vip_publications GROUP BY state').all(),
    env.DB.prepare(`SELECT window_key, policy_version, scheduled_at, started_at, finished_at, state, claimed_count, sent_count
      FROM vip_publication_runs ORDER BY scheduled_at DESC LIMIT 1`).first(),
  ])
  return {
    ok: true, publicationEnabled: publicationConfigured(env), policy: env.VIP_PUBLICATION_POLICY === VIP_PUBLICATION_POLICY ? VIP_PUBLICATION_POLICY : null,
    timezone: 'Africa/Dakar', times: VIP_PUBLICATION_TIMES, maxNewPicksPerWindow: 1,
    automaticRetry: false, deliverySemantics: 'durable-claim-single-attempt-ambiguous-quarantined',
    destination: await telegramReadiness(env, fetcher),
    publicationCounts: Object.fromEntries((counts.results || []).map(row => [row.state, Number(row.count)])),
    latestRun: latest || null,
  }
}
