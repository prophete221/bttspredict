import { isCurrentGeminiAbstention, isCurrentGeminiPick } from './filter-gemini-current-picks.mjs'

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

function validCalendarDate(value) {
  if (!ISO_DATE.test(value || '')) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function validClock(value) {
  if (!/^\d{2}:\d{2}$/.test(value || '')) return false
  const [hour, minute] = value.split(':').map(Number)
  return hour <= 23 && minute <= 59
}

function hasPickFields(row) {
  return (Array.isArray(row?.predictions) && row.predictions.length > 0) ||
    ['prediction', 'proba', 'confidence', 'bttsProb', 'over25Prob'].some(field =>
      Object.prototype.hasOwnProperty.call(row || {}, field),
    )
}

function validateFixtureRows(payload, today, now, checkKickoff, errors) {
  if (payload.fixtures === undefined) return []
  if (!Array.isArray(payload.fixtures)) {
    errors.push('fixtures must be an array')
    return []
  }
  const valid = []
  payload.fixtures.forEach((fixture, index) => {
    const prefix = `fixtures[${index}]`
    let rowValid = true
    for (const field of ['home', 'away', 'league']) {
      if (typeof fixture?.[field] !== 'string' || fixture[field].trim() === '') {
        errors.push(`${prefix}.${field} is required`)
        rowValid = false
      }
    }
    if (!validCalendarDate(fixture?.date)) {
      errors.push(`${prefix}.date must be a valid YYYY-MM-DD date`)
      rowValid = false
    } else if (fixture.date < today) {
      errors.push(`${prefix}.date is older than Africa/Dakar today`)
      rowValid = false
    }
    if (fixture?.time && !validClock(fixture.time)) {
      errors.push(`${prefix}.time must be a valid HH:MM clock when present`)
      rowValid = false
    }
    if (checkKickoff && fixture?.date === today && validClock(fixture?.time) &&
      Date.parse(`${fixture.date}T${fixture.time}:00Z`) <= now.getTime()) {
      errors.push(`${prefix}.time is already started in Africa/Dakar`)
      rowValid = false
    }
    if (hasPickFields(fixture)) {
      errors.push(`${prefix} must not contain prediction fields`)
      rowValid = false
    }
    if (rowValid) valid.push(fixture)
  })
  return valid
}

function upcomingSchedule(date, time, today, now) {
  if (!validCalendarDate(date) || date < today) return false
  if (date > today) return true
  if (!validClock(time)) return false
  return Date.parse(`${date}T${time}:00Z`) > now.getTime()
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
  const requireFutureGeminiPick = options.requireFutureGeminiPick === true
  const requireScheduledContent = options.requireScheduledContent === true
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
  // An empty prediction set is valid when a separate scoreboard fixture list exists.
  validatePreviewRows(payload, today, errors)
  const fixtures = validateFixtureRows(payload, today, now, checkKickoff, errors)
  const futureGeminiPicks = rows.filter(row =>
    ISO_DATE.test(row?.date || '') && row.date > today && isCurrentGeminiPick(row),
  )
  if (requireFutureGeminiPick && futureGeminiPicks.length === 0) {
    errors.push('at least one verified Gemini pick after Africa/Dakar today is required')
  }
  if (requireScheduledContent) {
    const hasUpcomingPick = rows.some(row =>
      isCurrentGeminiPick(row) && upcomingSchedule(row.date, row.time, today, now),
    )
    const hasUpcomingFixture = fixtures.some(fixture =>
      upcomingSchedule(fixture.date, fixture.time, today, now),
    )
    if (!hasUpcomingPick && !hasUpcomingFixture) {
      errors.push('at least one verified Gemini pick or valid scheduled fixture after the current time is required')
    }
  }

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
      if (!isCurrentGeminiPick(prediction) && !isCurrentGeminiAbstention(prediction)) {
        errors.push(`${prefix} must contain a verified Gemini pick or explicit abstention`)
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
    requireFutureGeminiPick: process.argv.includes('--require-future-gemini-pick'),
    requireScheduledContent: process.argv.includes('--require-scheduled-content'),
    checkKickoff: true,
  })
  if (errors.length > 0) {
    console.error(errors.join('\n'))
    process.exitCode = 1
  } else {
    console.log(`Valid predictions payload: ${file}`)
    if (process.argv.includes('--require-future-gemini-pick')) {
      const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Africa/Dakar' })
      const rows = rowsFromPayload(payload)
      const pick = rows.find(row => ISO_DATE.test(row?.date || '') && row.date > today && isCurrentGeminiPick(row))
      console.log(`[future-gemini-pick] verified future pick: ${pick.league} | ${pick.match} | ${pick.date} | ${pick.type} ${pick.prediction} (${pick.proba})`)
    }
  }
}
