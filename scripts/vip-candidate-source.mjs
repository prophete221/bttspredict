#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

export const GEMINI_MODEL = 'gemini-3.5-flash-lite'
export const DAKAR_TIMEZONE = 'Africa/Dakar'
export const VIP_PUBLICATION_TIMES = Object.freeze(['00:00', '07:00', '16:00'])
export const MAX_ANALYSIS_AGE_MS = 12 * 60 * 60 * 1000
export const MIN_VIP_PROBABILITY = 0.70
export const MIN_TEAM_MATCHES = 6
export const MIN_FORM_MATCHES = 5

const ACCEPTED_MATCH_STATUSES = new Set(['PENDING', 'SCHEDULED', 'NOT_STARTED', 'UPCOMING'])
const CANDIDATE_STORE_VERSION = 1

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeMarket(value) {
  const market = String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (market === 'btts') return 'BTTS'
  if (market === 'over25' || market === 'o25') return 'OVER_25'
  return null
}

function normalizeSelection(value) {
  const selection = String(value ?? '').trim().toLowerCase()
  if (selection === 'oui' || selection === 'yes') return 'YES'
  if (selection === 'non' || selection === 'no') return 'NO'
  return null
}

function rowsFromPayload(payload) {
  if (Array.isArray(payload?.vipCandidates)) return payload.vipCandidates
  if (Array.isArray(payload?.free)) return payload.free
  if (Array.isArray(payload?.predictions)) return payload.predictions
  return []
}

function dakarDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: DAKAR_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function dakarTime(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DAKAR_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.hour}:${values.minute}`
}

function parseKickoff(dateValue, timeValue) {
  const date = String(dateValue ?? '')
  const time = String(timeValue ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null

  // Africa/Dakar uses UTC+00:00; the feed's date/time are Dakar local values.
  const timestamp = Date.parse(`${date}T${time}:00.000Z`)
  if (!Number.isFinite(timestamp)) return null
  const kickoff = new Date(timestamp)
  if (kickoff.toISOString().slice(0, 16) !== `${date}T${time}`) return null
  return kickoff
}

export function stableCandidateKey(row) {
  const date = String(row?.date ?? '').slice(0, 10)
  const league = normalizeText(row?.league)
  const home = normalizeText(row?.home)
  const away = normalizeText(row?.away)
  const market = normalizeMarket(row?.ai_market ?? row?.type ?? row?.market)
  const selection = normalizeSelection(row?.prediction)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !league || !home || !away || !market || !selection) return null
  const identity = [date, league, home, away, market, selection].join('|')
  return createHash('sha256').update(identity).digest('hex')
}

function checkFreshness(payload, now) {
  const rootDate = String(payload?.date ?? '')
  const rawUpdatedAt = payload?.lastUpdated
  const updatedAtMs = typeof rawUpdatedAt === 'string' ? Date.parse(rawUpdatedAt) : NaN
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rootDate) || rootDate !== dakarDate(now)) return { ok: false, reason: 'payload_day_not_current' }
  if (!Number.isFinite(updatedAtMs)) return { ok: false, reason: 'missing_payload_timestamp' }
  const sourceUpdatedAtMs = typeof payload?.sourceLastUpdated === 'string' ? Date.parse(payload.sourceLastUpdated) : NaN
  if (!Number.isFinite(sourceUpdatedAtMs)) return { ok: false, reason: 'missing_source_timestamp' }
  const expectedCount = payload?.analysisExpectedCount
  const responseCount = payload?.analysisResponseCount
  if (payload?.analysisComplete !== true || !Number.isSafeInteger(expectedCount) || expectedCount < 1
    || !Number.isSafeInteger(responseCount) || responseCount !== expectedCount) {
    return { ok: false, reason: 'analysis_incomplete' }
  }
  for (const timestamp of [updatedAtMs, sourceUpdatedAtMs]) {
    const age = now.getTime() - timestamp
    if (age < -5 * 60 * 1000) return { ok: false, reason: 'payload_timestamp_in_future' }
    if (age > MAX_ANALYSIS_AGE_MS) return { ok: false, reason: 'stale_payload' }
  }
  return {
    ok: true,
    analyzedAt: new Date(updatedAtMs).toISOString(),
    sourceUpdatedAt: new Date(sourceUpdatedAtMs).toISOString(),
  }
}

function checkedCandidate(row, analyzedAt, now) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return { reason: 'invalid_row' }
  if (
    row.ai_source !== 'gemini-stats-v1' || row.ai_model !== GEMINI_MODEL ||
    row.ai_response_status !== 'pick' || row.ai_abstain !== false ||
    row.modelEngine !== 'gemini-stats-v1'
  ) return { reason: 'unverified_gemini_decision' }

  const market = normalizeMarket(row.ai_market)
  const topLevelMarket = normalizeMarket(row.type)
  const selection = normalizeSelection(row.prediction)
  const probability = row.proba
  const nested = Array.isArray(row.predictions) ? row.predictions : []
  if (!market || market !== topLevelMarket || !selection || nested.length !== 1) return { reason: 'incomplete_pick' }
  if (typeof probability !== 'number' || !Number.isFinite(probability) || probability > 0.78) {
    return { reason: 'invalid_probability' }
  }
  if (probability < MIN_VIP_PROBABILITY) return { reason: 'below_high_probability_threshold' }

  const pick = nested[0]
  if (!pick || typeof pick !== 'object') return { reason: 'incomplete_nested_pick' }
  if (
    pick.modelEngine !== GEMINI_MODEL || normalizeMarket(pick.type) !== market ||
    normalizeSelection(pick.prediction) !== selection || typeof pick.proba !== 'number' ||
    !Number.isFinite(pick.proba) || Math.abs(pick.proba - probability) >= 1e-9
  ) return { reason: 'inconsistent_nested_pick' }

  const expectedConfidence = Math.round(probability * 100)
  if (
    typeof row.confidence !== 'number' || row.confidence !== expectedConfidence ||
    typeof pick.confidence !== 'number' || pick.confidence !== expectedConfidence ||
    !['low', 'medium', 'high'].includes(row.ai_confidence)
  ) return { reason: 'incomplete_confidence' }
  if (row.ai_confidence !== 'high') return { reason: 'confidence_below_vip_threshold' }
  const reasons = Array.isArray(row.ai_reasons) ? row.ai_reasons.filter(value => typeof value === 'string' && value.trim()) : []
  const risks = Array.isArray(row.ai_risks) ? row.ai_risks.filter(value => typeof value === 'string' && value.trim()) : []
  if (reasons.length < 2 || reasons.length > 4 || risks.length < 1 || risks.length > 2) {
    return { reason: 'incomplete_candidate_rationale' }
  }
  const freeMarket = normalizeMarket(row.freeMarket)
  const freeSelection = normalizeSelection(row.freeSelection)
  if ((row.freeMarket != null && !freeMarket) || (row.freeSelection != null && !freeSelection)
    || (freeMarket === null) !== (freeSelection === null)) return { reason: 'invalid_free_pick_reference' }
  if (freeMarket === market && freeSelection === selection) return { reason: 'same_as_free_pick' }

  const empiricalYesRate = market === 'BTTS' ? row.empiricalBttsRate : row.empiricalOver25Rate
  if (typeof empiricalYesRate !== 'number' || !Number.isFinite(empiricalYesRate) || empiricalYesRate < 0 || empiricalYesRate > 1) {
    return { reason: 'missing_empirical_market_rate' }
  }
  const formRateKey = market === 'BTTS' ? 'bttsRate' : 'over25Rate'
  const homeEmpiricalRate = row.formHome?.[formRateKey]
  const awayEmpiricalRate = row.formAway?.[formRateKey]
  if ([homeEmpiricalRate, awayEmpiricalRate].some(rate => typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0 || rate > 1)) {
    return { reason: 'missing_team_empirical_rate' }
  }
  if (Math.abs(empiricalYesRate - (homeEmpiricalRate + awayEmpiricalRate) / 2) > 0.01 + 1e-9) {
    return { reason: 'empirical_rate_inconsistent_with_team_forms' }
  }
  const empiricalSelectionRate = selection === 'YES' ? empiricalYesRate : 1 - empiricalYesRate
  if (empiricalSelectionRate < MIN_VIP_PROBABILITY) return { reason: 'empirical_rate_below_vip_threshold' }
  if (Math.abs(probability - empiricalSelectionRate) > 0.15 + 1e-9) {
    return { reason: 'empirical_probability_mismatch' }
  }
  const homeSelectionRate = selection === 'YES' ? homeEmpiricalRate : 1 - homeEmpiricalRate
  const awaySelectionRate = selection === 'YES' ? awayEmpiricalRate : 1 - awayEmpiricalRate
  if (homeSelectionRate < MIN_VIP_PROBABILITY || awaySelectionRate < MIN_VIP_PROBABILITY) {
    return { reason: 'team_empirical_rate_below_vip_threshold' }
  }
  if ([homeSelectionRate, awaySelectionRate].some(rate => Math.abs(probability - rate) > 0.15 + 1e-9)) {
    return { reason: 'team_empirical_probability_mismatch' }
  }

  if (
    typeof row.id !== 'string' || !row.id.trim() ||
    typeof row.home !== 'string' || !row.home.trim() ||
    typeof row.away !== 'string' || !row.away.trim() ||
    typeof row.league !== 'string' || !row.league.trim() ||
    typeof row.date !== 'string' || typeof row.time !== 'string'
  ) return { reason: 'incomplete_fixture' }

  if (row.dataQuality !== 'HIGH' || row.dataSource !== 'ESPN_TEAM_SCHEDULE') {
    return { reason: 'insufficient_data_quality' }
  }
  if (
    !Number.isInteger(row.matchCountHome) || row.matchCountHome < MIN_TEAM_MATCHES ||
    !Number.isInteger(row.matchCountAway) || row.matchCountAway < MIN_TEAM_MATCHES ||
    !Number.isInteger(row.formHome?.count) || row.formHome.count < MIN_FORM_MATCHES ||
    !Number.isInteger(row.formAway?.count) || row.formAway.count < MIN_FORM_MATCHES
  ) return { reason: 'incomplete_sample' }

  const status = String(row.status ?? '').trim().toUpperCase()
  if (!ACCEPTED_MATCH_STATUSES.has(status)) return { reason: status === 'POSTPONED' ? 'postponed' : 'match_state_unknown_or_started' }
  const kickoff = parseKickoff(row.date, row.time)
  if (!kickoff) return { reason: 'invalid_kickoff' }
  if (kickoff.getTime() <= now.getTime()) return { reason: 'kickoff_reached' }

  const key = stableCandidateKey(row)
  if (!key) return { reason: 'unidentifiable_candidate' }
  return {
    candidate: {
      candidateKey: key,
      matchId: row.id,
      home: row.home.trim(),
      away: row.away.trim(),
      league: row.league.trim(),
      date: row.date,
      time: row.time,
      matchState: status,
      kickoffAt: kickoff.toISOString(),
      market,
      freeMarket,
      freeSelection,
      selection,
      probability,
      confidence: expectedConfidence,
      aiConfidence: row.ai_confidence,
      dataQuality: row.dataQuality,
      dataSource: row.dataSource,
      matchCountHome: row.matchCountHome,
      matchCountAway: row.matchCountAway,
      formCountHome: row.formHome.count,
      formCountAway: row.formAway.count,
      sourceModel: row.ai_model,
      homeSelectionRate,
      awaySelectionRate,
      reasons: reasons.slice(0, 4),
      risks: risks.slice(0, 2),
      empiricalSelectionRate,
      analyzedAt,
      status: 'pending_owner_approval',
    },
  }
}

/**
 * Build private VIP candidates from verified Gemini rows. Rows matching the
 * public free feed are always excluded; no alternate market or estimate is synthesized.
 */
export function buildVipCandidates({ analysisPayload, freePayload = analysisPayload, now = new Date() }) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new TypeError('now must be a valid Date')
  const freshness = checkFreshness(analysisPayload, now)
  const sourceRows = rowsFromPayload(analysisPayload)
  const freeRows = rowsFromPayload(freePayload)
  const audit = {
    inputRows: sourceRows.length,
    verifiedGeminiRows: 0,
    eligibleBeforeFreeExclusion: 0,
    excludedAlreadyFree: 0,
    excludedDuplicateKey: 0,
    rejected: {},
    ownerOutcome: freshness.ok ? 'evaluating' : 'source_incomplete',
    ownerMessage: freshness.ok ? null : 'Analyse incomplète ou source non fraîche; aucun pick n’est déclaré.',
    payloadFresh: freshness.ok,
    evaluationComplete: freshness.ok,
    analyzedAt: freshness.analyzedAt ?? null,
    sourceUpdatedAt: freshness.sourceUpdatedAt ?? null,
    freshnessReason: freshness.reason ?? null,
  }
  if (!freshness.ok) {
    audit.rejected[freshness.reason] = sourceRows.length
    return { candidates: [], audit }
  }

  const freeKeys = new Set(freeRows.map(stableCandidateKey).filter(Boolean))
  const seen = new Set()
  const candidates = []
  for (const row of sourceRows) {
    if (row?.ai_source === 'gemini-stats-v1' && row?.ai_model === GEMINI_MODEL && row?.ai_response_status === 'pick') {
      audit.verifiedGeminiRows += 1
    }
    const result = checkedCandidate(row, freshness.analyzedAt, now)
    if (!result.candidate) {
      audit.rejected[result.reason] = (audit.rejected[result.reason] ?? 0) + 1
      continue
    }
    audit.eligibleBeforeFreeExclusion += 1
    if (freeKeys.has(result.candidate.candidateKey)) {
      audit.excludedAlreadyFree += 1
      continue
    }
    if (seen.has(result.candidate.candidateKey)) {
      audit.excludedDuplicateKey += 1
      continue
    }
    seen.add(result.candidate.candidateKey)
    candidates.push(result.candidate)
  }

  candidates.sort((a, b) => Number(a.market === a.freeMarket) - Number(b.market === b.freeMarket)
    || b.probability - a.probability || a.candidateKey.localeCompare(b.candidateKey))
  audit.ownerOutcome = candidates.length ? 'awaiting_owner_approval' : 'no_eligible_picks_today'
  audit.ownerMessage = candidates.length
    ? `${candidates.length} candidat(s) VIP en attente d’approbation du propriétaire.`
    : 'Aucun pick VIP éligible aujourd’hui; aucun message n’a été envoyé.'
  return { candidates, audit }
}

const MATERIAL_CANDIDATE_FIELDS = Object.freeze([
  'matchId', 'home', 'away', 'league', 'date', 'time', 'matchState', 'kickoffAt',
  'market', 'freeMarket', 'freeSelection', 'selection', 'probability', 'confidence', 'aiConfidence',
  'dataQuality', 'dataSource', 'matchCountHome', 'matchCountAway', 'formCountHome',
  'formCountAway', 'sourceModel', 'homeSelectionRate', 'awaySelectionRate',
  'reasons', 'risks', 'empiricalSelectionRate',
])

function sameMaterialCandidate(previous, current) {
  return MATERIAL_CANDIDATE_FIELDS.every(field => {
    const oldValue = previous?.[field]
    const newValue = current?.[field]
    if (Array.isArray(oldValue) || Array.isArray(newValue)) return JSON.stringify(oldValue) === JSON.stringify(newValue)
    return oldValue === newValue
  })
}

export function mergeCandidateStore(existingStore, candidates, { now = new Date(), audit = null } = {}) {
  const prior = existingStore && typeof existingStore === 'object' && Array.isArray(existingStore.candidates)
    ? existingStore
    : { version: CANDIDATE_STORE_VERSION, candidates: [] }
  if (audit?.payloadFresh !== true || audit?.evaluationComplete !== true) {
    return {
      version: CANDIDATE_STORE_VERSION,
      timezone: DAKAR_TIMEZONE,
      publicationTimes: [...VIP_PUBLICATION_TIMES],
      updatedAt: prior.updatedAt || now.toISOString(),
      lastAudit: audit,
      candidates: [...prior.candidates],
      added: 0,
    }
  }
  const rows = new Map()
  const incoming = new Map()
  for (const candidate of candidates) {
    if (candidate && typeof candidate.candidateKey === 'string' && !incoming.has(candidate.candidateKey)) {
      incoming.set(candidate.candidateKey, candidate)
    }
  }
  let added = 0
  const timestamp = now.toISOString()
  for (const previous of prior.candidates) {
    if (!previous || typeof previous.candidateKey !== 'string') continue
    const key = previous.candidateKey
    if (previous.status === 'published' || previous.publishedAt) {
      rows.set(key, previous)
      incoming.delete(key)
      continue
    }
    const current = incoming.get(key)
    if (!current) {
      if (previous.status === 'rejected') {
        rows.set(key, previous)
        continue
      }
      const invalidated = { ...previous, status: 'ineligible', invalidatedAt: timestamp, ineligibleReason: 'not_in_current_eligible_source' }
      delete invalidated.approvedAt
      rows.set(key, invalidated)
      continue
    }
    incoming.delete(key)
    if (sameMaterialCandidate(previous, current)) {
      const status = previous.status === 'approved' || previous.status === 'rejected'
        ? previous.status
        : 'pending_owner_approval'
      const refreshed = { ...current, status }
      if (status === 'approved' && previous.approvedAt) refreshed.approvedAt = previous.approvedAt
      if (status === 'rejected' && previous.rejectedAt) refreshed.rejectedAt = previous.rejectedAt
      rows.set(key, refreshed)
    } else {
      const changed = { ...current, status: 'pending_owner_approval', reapprovalRequiredAt: timestamp }
      delete changed.approvedAt
      delete changed.rejectedAt
      rows.set(key, changed)
    }
  }
  for (const candidate of incoming.values()) {
    rows.set(candidate.candidateKey, candidate)
    added += 1
  }
  return {
    version: CANDIDATE_STORE_VERSION,
    timezone: DAKAR_TIMEZONE,
    publicationTimes: [...VIP_PUBLICATION_TIMES],
    updatedAt: now.toISOString(),
    lastAudit: audit,
    candidates: [...rows.values()],
    added,
  }
}

export function publicationWindowAt(now = new Date()) {
  const time = dakarTime(now)
  if (!VIP_PUBLICATION_TIMES.includes(time)) return null
  return { date: dakarDate(now), time, timezone: DAKAR_TIMEZONE }
}

/** Pure selector only: it never sends, schedules, approves, or mutates candidates. */
export function selectApprovedCandidatesForWindow(store, now = new Date()) {
  if (!publicationWindowAt(now) || !Array.isArray(store?.candidates)) return []
  const seen = new Set()
  return store.candidates
    .filter(candidate => {
      const key = candidate?.candidateKey
      if (typeof key !== 'string' || !/^[a-f0-9]{64}$/.test(key) || seen.has(key)) return false
      if (candidate?.status !== 'approved' || candidate.publishedAt) return false
      if (!ACCEPTED_MATCH_STATUSES.has(String(candidate.matchState ?? '').trim().toUpperCase())) return false
      const kickoff = Date.parse(candidate.kickoffAt)
      const analyzedAt = Date.parse(candidate.analyzedAt)
      const approvedAt = Date.parse(candidate.approvedAt)
      const analysisAge = now.getTime() - analyzedAt
      const eligible = Number.isFinite(kickoff) && kickoff > now.getTime()
        && Number.isFinite(analyzedAt) && analysisAge >= 0 && analysisAge <= MAX_ANALYSIS_AGE_MS
        && Number.isFinite(approvedAt) && approvedAt <= now.getTime()
      if (eligible) seen.add(key)
      return eligible
    })
    .sort((a, b) => Number(a.market === a.freeMarket) - Number(b.market === b.freeMarket)
      || b.probability - a.probability || a.candidateKey.localeCompare(b.candidateKey))
}

/** Record a manually confirmed send after it occurs; this function does not send anything. */
export function markCandidatePublished(store, candidateKey, { publishedAt, telegramMessageId } = {}) {
  if (!Array.isArray(store?.candidates)) throw new TypeError('candidate store is invalid')
  const index = store.candidates.findIndex(candidate => candidate?.candidateKey === candidateKey)
  if (index < 0) throw new Error('candidate_not_found')
  const candidate = store.candidates[index]
  if (candidate.status !== 'approved' || candidate.publishedAt) throw new Error('candidate_not_publishable')
  const timestamp = publishedAt instanceof Date ? publishedAt : new Date(publishedAt)
  if (!Number.isFinite(timestamp.getTime()) || Date.parse(candidate.kickoffAt) <= timestamp.getTime()) {
    throw new Error('candidate_already_started')
  }
  if (!((typeof telegramMessageId === 'string' && telegramMessageId.trim()) || Number.isInteger(telegramMessageId))) {
    throw new Error('telegram_message_id_required')
  }
  const candidates = store.candidates.map((row, rowIndex) => rowIndex === index
    ? { ...row, status: 'published', publishedAt: timestamp.toISOString(), telegramMessageId: telegramMessageId ?? null }
    : row)
  return { ...store, candidates }
}

export function readPrivateCandidateStore(file) {
  if (!fs.existsSync(file)) return { version: CANDIDATE_STORE_VERSION, candidates: [] }
  const store = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (store?.version !== CANDIDATE_STORE_VERSION || !Array.isArray(store.candidates)) {
    throw new Error('private_candidate_store_invalid')
  }
  return store
}

export function writePrivateCandidateStore(file, store) {
  const absoluteFile = path.resolve(file)
  const parent = path.dirname(absoluteFile)
  fs.mkdirSync(parent, { recursive: true, mode: 0o700 })
  fs.chmodSync(parent, 0o700)
  const tempFile = `${absoluteFile}.${process.pid}.tmp`
  fs.writeFileSync(tempFile, `${JSON.stringify(store, null, 2)}\n`, { mode: 0o600 })
  fs.chmodSync(tempFile, 0o600)
  fs.renameSync(tempFile, absoluteFile)
  fs.chmodSync(absoluteFile, 0o600)
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const analysisFile = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'public', 'predictions.json')
  const freeFile = process.argv[3] ? path.resolve(process.argv[3]) : analysisFile
  const storeFile = process.argv[4] ? path.resolve(process.argv[4]) : path.join(root, '.private', 'vip-candidates.json')
  const now = new Date()
  const analysisPayload = JSON.parse(fs.readFileSync(analysisFile, 'utf8'))
  const freePayload = freeFile === analysisFile ? analysisPayload : JSON.parse(fs.readFileSync(freeFile, 'utf8'))
  const { candidates, audit } = buildVipCandidates({ analysisPayload, freePayload, now })
  const current = readPrivateCandidateStore(storeFile)
  const merged = mergeCandidateStore(current, candidates, { now, audit })
  writePrivateCandidateStore(storeFile, merged)
  console.log(
    `[vip-candidate-source] eligible=${candidates.length}; added=${merged.added}; ` +
    `free-overlap=${audit.excludedAlreadyFree}; rejected=${Object.values(audit.rejected).reduce((sum, count) => sum + count, 0)}; ` +
    `store=${storeFile}; publication=disabled`,
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
