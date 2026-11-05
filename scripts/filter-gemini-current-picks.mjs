import fs from 'node:fs'

export const GEMINI_MODEL = 'gemini-3.5-flash-lite'

function normalizeText(value) {
  return String(value ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ')
}

export function canonicalMarket(value) {
  const key = String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (key === 'btts') return 'BTTS'
  if (key === 'over25') return 'OVER_25'
  if (key === 'abstain') return 'ABSTAIN'
  return key.toUpperCase()
}

function normalizeSelection(value) {
  const key = String(value ?? '').trim().toLowerCase()
  if (key === 'yes' || key === 'oui') return 'yes'
  if (key === 'no' || key === 'non') return 'no'
  return ''
}

function fixtureKey(row) {
  const date = String(row?.date ?? '').trim()
  const league = normalizeText(row?.league)
  const home = normalizeText(row?.home)
  const away = normalizeText(row?.away)
  return date && league && home && away ? `${date}|${league}|${home}|${away}` : null
}

export function isCurrentGeminiPick(row) {
  if (
    row?.ai_source !== 'gemini-stats-v1' || row?.ai_abstain !== false ||
    row?.ai_model !== GEMINI_MODEL || row?.ai_response_status !== 'pick' ||
    row?.modelEngine !== 'gemini-stats-v1'
  ) return false

  const market = canonicalMarket(row.ai_market)
  const selection = normalizeSelection(row.prediction)
  const probability = row.proba
  const nested = Array.isArray(row.predictions) ? row.predictions : []
  if (!['BTTS', 'OVER_25'].includes(market) || canonicalMarket(row.type) !== market) return false
  if (!selection || typeof probability !== 'number' || !Number.isFinite(probability) || probability < 0.48 || probability > 0.78) return false
  if (nested.length !== 1) return false

  const pick = nested[0]
  return Boolean(
    pick?.modelEngine === GEMINI_MODEL && canonicalMarket(pick.type) === market &&
    normalizeSelection(pick.prediction) === selection && typeof pick.proba === 'number' &&
    Number.isFinite(pick.proba) && Math.abs(pick.proba - probability) < 1e-9,
  )
}

function hasNoPickValues(row) {
  return ['prediction', 'proba', 'confidence', 'predictions', 'bttsProb', 'over25Prob']
    .every(field => !Object.hasOwn(row, field))
}

export function isCurrentGeminiAbstention(row) {
  return Boolean(
    row?.ai_source === 'gemini-stats-v1' && row?.ai_model === GEMINI_MODEL &&
    row?.ai_response_status === 'abstain' && row?.ai_abstain === true &&
    row?.ai_market === 'ABSTAIN' && row?.modelEngine === 'gemini-stats-v1' &&
    hasNoPickValues(row),
  )
}

export function hasCurrentGeminiDecision(row) {
  return isCurrentGeminiPick(row) || isCurrentGeminiAbstention(row)
}

function isCurrentGeminiRejection(row) {
  return Boolean(
    row?.ai_source === 'gemini-stats-v1' && row?.ai_model === GEMINI_MODEL &&
    row?.ai_response_status === 'rejected' && row?.ai_abstain === true &&
    row?.ai_market === 'ABSTAIN' && row?.modelEngine === 'gemini-stats-v1' &&
    hasNoPickValues(row),
  )
}

function rowsFromPayload(payload) {
  return Array.isArray(payload?.free) ? payload.free : Array.isArray(payload?.predictions) ? payload.predictions : []
}

export function filterGeminiCurrentPicks(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new TypeError('predictions payload must be an object')
  }
  const candidates = rowsFromPayload(payload)
  const verified = candidates.filter(hasCurrentGeminiDecision)
  const groups = new Map()
  let unidentifiable = 0

  for (const candidate of verified) {
    const key = fixtureKey(candidate)
    if (!key) {
      unidentifiable += 1
      continue
    }
    const group = groups.get(key) ?? []
    group.push(candidate)
    groups.set(key, group)
  }

  const selected = []
  let duplicateFixtures = 0
  for (const group of groups.values()) {
    if (group.length !== 1) {
      duplicateFixtures += group.length
      continue
    }
    selected.push(group[0])
  }

  const metrics = {
    candidates: candidates.length,
    verifiedDecisions: verified.length,
    directPicks: candidates.filter(isCurrentGeminiPick).length,
    abstentions: candidates.filter(isCurrentGeminiAbstention).length,
    rejectedResponses: candidates.filter(isCurrentGeminiRejection).length,
    unverifiedOrMissing: candidates.filter(row => !hasCurrentGeminiDecision(row) && !isCurrentGeminiRejection(row)).length,
    duplicateFixtures,
    unidentifiable,
    excluded: candidates.length - selected.length,
    published: selected.length,
  }

  return {
    payload: {
      ...payload,
      free: selected,
      predictions: selected,
      ...(payload.stats && typeof payload.stats === 'object'
        ? { stats: { ...payload.stats, freeCount: selected.length } }
        : {}),
    },
    metrics,
  }
}

function main() {
  const file = process.argv[2] || 'public/predictions.json'
  const payload = JSON.parse(fs.readFileSync(file, 'utf8'))
  const { payload: filtered, metrics } = filterGeminiCurrentPicks(payload)
  const temporaryFile = `${file}.${process.pid}.tmp`
  fs.writeFileSync(temporaryFile, `${JSON.stringify(filtered, null, 2)}\n`)
  fs.renameSync(temporaryFile, file)
  console.log(
    `[gemini-feed] candidates=${metrics.candidates}; verified decisions=${metrics.verifiedDecisions}; ` +
    `picks=${metrics.directPicks}; explicit abstentions=${metrics.abstentions}; ` +
    `rejected=${metrics.rejectedResponses}; unverified/missing=${metrics.unverifiedOrMissing}; ` +
    `duplicate fixtures=${metrics.duplicateFixtures}; published=${metrics.published}`,
  )
  if (metrics.excluded > 0) {
    console.log(
      `::warning::Gemini current feed retained ${metrics.published}/${metrics.candidates} fixtures; ` +
      `${metrics.excluded} unverified, rejected, duplicate, or unidentifiable rows were excluded.`,
    )
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main()
