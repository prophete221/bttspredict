const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/

function rowsFromPayload(payload) {
  if (Array.isArray(payload)) return payload
  return Array.isArray(payload?.free) ? payload.free : Array.isArray(payload?.predictions) ? payload.predictions : []
}

function pickRows(row) {
  const nested = Array.isArray(row?.predictions)
    ? row.predictions.filter(item => item && typeof item === 'object')
    : []
  if (nested.length) return nested
  return typeof row?.prediction === 'string' && row.prediction.trim() ? [row] : []
}

function validatePreviewRows(payload, today, errors) {
  if (!Array.isArray(payload?.vipPreview)) return
  payload.vipPreview.forEach((fixture, index) => {
    const prefix = `vipPreview[${index}]`
    for (const field of ['id', 'home', 'away', 'league', 'date']) {
      if (typeof fixture?.[field] !== 'string' || fixture[field].trim() === '') {
        errors.push(`${prefix}.${field} is required`)
      }
    }
    if (fixture?.vip !== true) errors.push(`${prefix}.vip must be true`)
    if (!ISO_DATE.test(fixture?.date || '')) errors.push(`${prefix}.date must be YYYY-MM-DD`)
    else if (fixture.date < today) errors.push(`${prefix}.date is older than Africa/Dakar today`)
    if (fixture?.time && !/^\d{2}:\d{2}$/.test(fixture.time)) {
      errors.push(`${prefix}.time must be HH:MM when present`)
    }
  })
}

export function validatePredictionPayload(payload, options = {}) {
  const errors = []
  const today = options.today || new Date().toLocaleDateString('sv-SE', { timeZone: 'Africa/Dakar' })
  const requireTimestamp = options.requireTimestamp === true
  const checkKickoff = options.checkKickoff === true
  const requireGemini = options.requireGemini === true
  const now = options.now instanceof Date ? options.now : new Date()

  if (!payload || typeof payload !== 'object') {
    return ['payload must be an object']
  }
  if (!ISO_DATE.test(payload.date || '')) errors.push('top-level date must be YYYY-MM-DD')
  else if (payload.date !== today) errors.push('top-level date is not Africa/Dakar today')
  if (requireTimestamp && !ISO_TIMESTAMP.test(payload.lastUpdated || '')) {
    errors.push('lastUpdated must be an ISO UTC timestamp')
  }

  const rows = rowsFromPayload(payload)
  // An empty set is a legitimate abstention when no fixture has enough evidence.
  validatePreviewRows(payload, today, errors)

  rows.forEach((prediction, index) => {
    const prefix = `prediction[${index}]`
    for (const field of ['id', 'match', 'home', 'away', 'league', 'date']) {
      if (typeof prediction?.[field] !== 'string' || prediction[field].trim() === '') {
        errors.push(`${prefix}.${field} is required`)
      }
    }
    if (!ISO_DATE.test(prediction?.date || '')) errors.push(`${prefix}.date must be YYYY-MM-DD`)
    else if (prediction.date < today) errors.push(`${prefix}.date is older than Africa/Dakar today`)
    const picks = pickRows(prediction)
    if (requireGemini) {
      if (picks.length === 0) {
        if (prediction?.ai_abstain !== true) errors.push(`${prefix}.ai_abstain must be true when no Gemini pick is published`)
        if (prediction?.ai_source && prediction.ai_source !== 'gemini-stats-v1') {
          errors.push(`${prefix}.ai_source must not identify a non-Gemini source`)
        }
        for (const field of ['proba', 'confidence', 'bttsProb', 'over25Prob', 'bttsProbDisplay', 'over25ProbDisplay']) {
          if (prediction?.[field] !== undefined) errors.push(`${prefix}.${field} must be absent for a no-pick abstention`)
        }
      } else {
        if (prediction?.ai_source !== 'gemini-stats-v1') errors.push(`${prefix}.ai_source must be gemini-stats-v1 for published picks`)
        if (prediction?.ai_abstain !== false) errors.push(`${prefix}.ai_abstain must be false when a Gemini pick is published`)
        if (prediction?.modelEngine !== 'gemini-stats-v1') errors.push(`${prefix}.modelEngine must be gemini-stats-v1 for published picks`)
        picks.forEach((pick, pickIndex) => {
          const pickPrefix = picks.length > 1 ? `${prefix}.predictions[${pickIndex}]` : prefix
          if (typeof pick?.type !== 'string' || pick.type.trim() === '') errors.push(`${pickPrefix}.type is required for a Gemini pick`)
          if (typeof pick?.prediction !== 'string' || !['Oui', 'Non', 'Yes', 'No'].includes(pick.prediction)) {
            errors.push(`${pickPrefix}.prediction must be a Gemini Yes/No selection`)
          }
          const probability = pick?.proba ?? (String(pick?.type || '').toLowerCase().includes('btts') ? pick?.bttsProb : pick?.over25Prob)
          if (typeof probability !== 'number' || probability < 0 || probability > 1) {
            errors.push(`${pickPrefix}.proba must be between 0 and 1`)
          }
        })
      }
    } else if (picks.length > 0) {
      for (const field of ['type', 'prediction']) {
        if (typeof prediction?.[field] !== 'string' || prediction[field].trim() === '') {
          errors.push(`${prefix}.${field} is required`)
        }
      }
      if (typeof prediction?.proba !== 'number' || prediction.proba < 0 || prediction.proba > 1) {
        errors.push(`${prefix}.proba must be between 0 and 1`)
      }
    }
    if (typeof prediction?.reliabilityScore !== 'number' || prediction.reliabilityScore < 0 || prediction.reliabilityScore > 100) {
      errors.push(`${prefix}.reliabilityScore must be between 0 and 100`)
    }
    if (!['HIGH', 'MEDIUM', 'LOW'].includes(prediction?.dataQuality)) {
      errors.push(`${prefix}.dataQuality must be HIGH, MEDIUM or LOW`)
    }
    if (typeof prediction?.dataSource !== 'string' || prediction.dataSource.trim() === '') {
      errors.push(`${prefix}.dataSource is required`)
    }
    if (prediction?.time && !/^\d{2}:\d{2}$/.test(prediction.time)) {
      errors.push(`${prefix}.time must be HH:MM when present`)
    }
    if (checkKickoff && prediction?.date === today && /^\d{2}:\d{2}$/.test(prediction.time || '')) {
      const kickoff = Date.parse(`${prediction.date}T${prediction.time}:00Z`)
      if (Number.isFinite(kickoff) && kickoff <= now.getTime()) {
        errors.push(`${prefix}.time is already started in Africa/Dakar`)
      }
    }
  })

  return errors
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2] || 'public/predictions.json'
  const payload = JSON.parse(await import('node:fs/promises').then(fs => fs.readFile(file, 'utf8')))
  const errors = validatePredictionPayload(payload, {
    requireTimestamp: process.argv.includes('--require-timestamp'),
    requireGemini: process.argv.includes('--require-gemini'),
    checkKickoff: true,
  })
  if (errors.length > 0) {
    console.error(errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(`Valid predictions payload: ${file}`)
  }
}
