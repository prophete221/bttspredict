const GEMINI_MODEL_ID = 'gemini-3.5-flash-lite'

function normalizeMarket(value) {
  const market = String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
  if (market === 'btts') return 'BTTS'
  if (market === 'over25' || market === 'o25') return 'O2.5'
  return null
}

function normalizeSelection(value) {
  const selection = String(value ?? '').trim().toLowerCase()
  if (selection === 'oui' || selection === 'yes') return 'yes'
  if (selection === 'non' || selection === 'no') return 'no'
  return null
}

function validProbability(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
}

function getStrictGeminiPick(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null
  if (row.ai_source !== 'gemini-stats-v1' || row.ai_abstain !== false ||
      row.ai_model !== GEMINI_MODEL_ID || row.ai_response_status !== 'pick' ||
      row.modelEngine !== 'gemini-stats-v1') return null
  const market = normalizeMarket(row.ai_market)
  const topMarket = normalizeMarket(row.type)
  const selection = normalizeSelection(row.prediction)
  if (!market || market !== topMarket || !selection || !validProbability(row.proba)) return null
  if (!Array.isArray(row.predictions) || row.predictions.length !== 1) return null
  const pick = row.predictions[0]
  if (!pick || typeof pick !== 'object') return null
  if (pick.modelEngine !== GEMINI_MODEL_ID || normalizeMarket(pick.type) !== market ||
      normalizeSelection(pick.prediction) !== selection || !validProbability(pick.proba) ||
      Math.abs(pick.proba - row.proba) >= 1e-9) return null
  return { market, prediction: selection === 'yes' ? 'Oui' : 'Non' }
}

function historyMarket(value) {
  const market = String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  if (market === 'btts' || market === 'bothteamstoscore') return 'btts'
  if (market === 'over25' || market === 'o25') return 'over25'
  return ''
}

function historySelection(value) {
  const selection = String(value ?? '').trim().toLowerCase()
  if (selection === 'oui' || selection === 'yes') return 'yes'
  if (selection === 'non' || selection === 'no') return 'no'
  return ''
}

function historyKey(row, pick) {
  const date = String(row?.date ?? '').trim()
  const match = String(row?.match ?? '').trim()
  const market = historyMarket(pick?.market ?? row?.market ?? row?.type)
  const prediction = historySelection(pick?.prediction ?? row?.prediction)
  const status = String(row?.status ?? '').trim().toUpperCase()
  const score = String(row?.finalScore ?? row?.score ?? '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !match || !market || !prediction || !['WON', 'LOST'].includes(status) || !score) return null
  return [date, match, market, prediction, status, score].join('|')
}

export function buildStrictGeminiHistoryKeys(archiveRows) {
  const keys = new Set()
  for (const row of archiveRows || []) {
    const pick = getStrictGeminiPick(row)
    const key = pick && historyKey(row, pick)
    if (key) keys.add(key)
  }
  return keys
}

export function selectStrictGeminiHistoryRows(rows, strictKeys) {
  return (rows || []).filter(row => {
    const key = historyKey(row)
    return key !== null && strictKeys.has(key)
  })
}

function isRecordedPick(row) {
  return typeof row?.prediction === 'string' && row.prediction.trim().length > 0
}

function scoreParts(value) {
  if (typeof value !== 'string') return null
  const match = value.match(/^\s*(\d+)\s*[-–:]\s*(\d+)\s*$/)
  return match ? [Number(match[1]), Number(match[2])] : null
}

function pickedYes(value) {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  if (['yes', 'oui', 'over', 'btts yes'].includes(normalized)) return true
  if (['no', 'non', 'under', 'btts no'].includes(normalized)) return false
  return null
}

export function validateRecordedGeminiResult(row) {
  if (!isRecordedPick(row)) return 'no-pick'
  const status = typeof row.status === 'string' ? row.status.trim().toUpperCase() : ''
  if (status === 'PENDING') return 'pending'
  if (status !== 'WON' && status !== 'LOST') return 'needs-review'
  const markets = [row.type, row.market].map(historyMarket)
  const btts = markets.includes('btts')
  const over = markets.includes('over25')
  if (btts === over) return 'needs-review'
  const score = scoreParts(row.finalScore ?? row.score)
  const prediction = pickedYes(row.prediction)
  if (!score || prediction === null) return 'needs-review'
  const outcome = btts ? score[0] > 0 && score[1] > 0 : score[0] + score[1] >= 3
  return status === (prediction === outcome ? 'WON' : 'LOST') ? 'verified' : 'needs-review'
}

function summarizeRows(rows) {
  const won = rows.filter(row => row.status === 'WON').length
  const lost = rows.filter(row => row.status === 'LOST').length
  const total = won + lost
  return { total, won, lost, rate: total ? +(won / total * 100).toFixed(1) : 0 }
}

export function summarizeStrictGeminiHistory(history, options = {}) {
  const withPick = (history || []).filter(isRecordedPick)
  const pickedResultRows = withPick.filter(row => row.status === 'WON' || row.status === 'LOST')
  const rows = pickedResultRows.filter(row => validateRecordedGeminiResult(row) === 'verified')
  const unverifiedPickCount = pickedResultRows.length - rows.length
  const bttsRows = rows.filter(row => [row.type, row.market].some(value => historyMarket(value) === 'btts'))
  const overRows = rows.filter(row => [row.type, row.market].some(value => historyMarket(value) === 'over25'))
  const goldRows = rows.filter(row => typeof row.tier === 'string' && row.tier.toUpperCase() === 'GOLD')
  const standardRows = rows.filter(row => !row.tier || typeof row.tier !== 'string' || row.tier.toUpperCase() !== 'GOLD')
  const dailyMap = new Map()
  for (const row of rows) {
    if (typeof row.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) continue
    const group = dailyMap.get(row.date) || []
    group.push(row)
    dailyMap.set(row.date, group)
  }
  const daily = [...dailyMap.entries()].sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayRows]) => ({ date, ...summarizeRows(dayRows) }))
  const asOfMs = Number.isFinite(options.asOf) ? options.asOf : Date.now()
  const asOfDate = new Date(asOfMs)
  asOfDate.setUTCHours(0, 0, 0, 0)
  const dayMs = 24 * 60 * 60 * 1000
  const periodRows = days => rows.filter(row => {
    if (typeof row.date !== 'string') return false
    const dateMs = Date.parse(`${row.date}T00:00:00Z`)
    return Number.isFinite(dateMs) && dateMs >= asOfDate.getTime() - days * dayMs
  })
  const seasonRows = options.trackingStart
    ? rows.filter(row => typeof row.date === 'string' && row.date >= options.trackingStart)
    : rows
  return {
    ...summarizeRows(rows),
    gold: summarizeRows(goldRows),
    standard: summarizeRows(standardRows),
    byType: { btts: summarizeRows(bttsRows), over25: summarizeRows(overRows) },
    daily,
    trend14: daily.slice(-14),
    periods: {
      last7: summarizeRows(periodRows(7)),
      last30: summarizeRows(periodRows(30)),
      season: summarizeRows(seasonRows),
      total: summarizeRows(rows),
    },
    noPickCount: (history || []).filter(row => !isRecordedPick(row)).length,
    unverifiedPickCount,
    sourceRowCount: (history || []).length,
  }
}

export function buildStrictGeminiHistoryProjection({ payload, fullHistory, archiveRows, archivesRead, sourceStats }) {
  const strictKeys = buildStrictGeminiHistoryKeys(archiveRows)
  const geminiFullHistory = selectStrictGeminiHistoryRows(fullHistory, strictKeys)
  const sourceDetailRows = Array.isArray(payload.history) ? payload.history : []
  const geminiDetailRows = selectStrictGeminiHistoryRows(sourceDetailRows, strictKeys)
  const sourceOutsideDetailRows = (fullHistory || []).slice(sourceDetailRows.length)
  const geminiOutsideDetailRows = selectStrictGeminiHistoryRows(sourceOutsideDetailRows, strictKeys)
  const asOfParsed = Date.parse(payload.generatedAt || '')
  const asOf = Number.isFinite(asOfParsed) ? asOfParsed : Date.now()
  const trackingStart = payload.trackingPeriod?.startDate
  const pickStats = summarizeStrictGeminiHistory(geminiFullHistory, { asOf, trackingStart })
  const detailStats = summarizeStrictGeminiHistory(geminiDetailRows, { asOf, trackingStart })
  const outsideStats = summarizeStrictGeminiHistory(geminiOutsideDetailRows, { asOf, trackingStart })
  const sourceNoPickRows = (fullHistory || []).filter(row => !isRecordedPick(row))
  const sourceNoPick = sourceNoPickRows.length
  const sourceRecordedPickRows = (fullHistory || []).length - sourceNoPick
  const sourceNeedsReviewRows = (fullHistory || []).filter(row => isRecordedPick(row) && validateRecordedGeminiResult(row) === 'needs-review').length
  const noPickWins = sourceNoPickRows.filter(row => row.status === 'WON').length
  const noPickLosses = sourceNoPickRows.filter(row => row.status === 'LOST').length
  const sourceDetailNoPick = sourceDetailRows.filter(row => !isRecordedPick(row)).length
  const sourceOutsideDetailNoPick = sourceOutsideDetailRows.filter(row => !isRecordedPick(row)).length
  const reviewRows = (fullHistory || [])
    .filter(row => validateRecordedGeminiResult(row) === 'needs-review')
    .map(row => {
      const provenanceVerified = strictKeys.has(historyKey(row))
      return {
        date: row.date,
        match: row.match,
        market: row.market || row.type,
        prediction: provenanceVerified ? row.prediction : undefined,
        provenanceVerified,
        status: row.status,
        finalScore: row.finalScore || row.score,
      }
    })
  const publishedStats = payload.stats || {}
  const sourceMatchesPublished = ['total', 'won', 'lost'].every(key => Number(sourceStats?.[key]) === Number(publishedStats[key]))
  const historyAudit = {
    archivesRead,
    sourceRows: (fullHistory || []).length,
    sourceWon: Number(sourceStats?.won) || 0,
    sourceLost: Number(sourceStats?.lost) || 0,
    sourceTotal: Number(sourceStats?.total) || (fullHistory || []).length,
    sourceNoPick,
    sourceNoPickWon: noPickWins,
    sourceNoPickLost: noPickLosses,
    sourceRecordedPickRows,
    geminiRecordedPickRows: geminiFullHistory.length,
    nonGeminiOrUnknownSourcePickRows: sourceRecordedPickRows - geminiFullHistory.length,
    sourceNeedsReviewRows,
    fullPickRows: pickStats.total,
    fullPickWon: pickStats.won,
    fullPickLost: pickStats.lost,
    fullPickRate: pickStats.rate,
    fullPickUnverifiedRows: pickStats.unverifiedPickCount,
    detailLimit: 500,
    detailRows: sourceDetailRows.length,
    detailSourceRecordedPickRows: sourceDetailRows.length - sourceDetailNoPick,
    detailGeminiRows: geminiDetailRows.length,
    detailRecordedPickRows: geminiDetailRows.length,
    detailPickRows: detailStats.total,
    detailPickWon: detailStats.won,
    detailPickLost: detailStats.lost,
    detailNeedsReviewRows: detailStats.unverifiedPickCount,
    detailNoPick: sourceDetailNoPick,
    outsideDetailRows: sourceOutsideDetailRows.length,
    outsideDetailSourceRecordedPickRows: sourceOutsideDetailRows.length - sourceOutsideDetailNoPick,
    outsideDetailGeminiRows: geminiOutsideDetailRows.length,
    outsideDetailRecordedPickRows: geminiOutsideDetailRows.length,
    outsideDetailPickRows: outsideStats.total,
    outsideDetailNeedsReviewRows: outsideStats.unverifiedPickCount,
    outsideDetailNoPick: sourceOutsideDetailNoPick,
    sourceMatchesPublished,
    publishedSourceRows: Number(publishedStats.total) || 0,
    publishedSourceWon: Number(publishedStats.won) || 0,
    publishedSourceLost: Number(publishedStats.lost) || 0,
  }
  const stats = {
    ...(payload.stats || {}),
    total: pickStats.total,
    verified: pickStats.total,
    won: pickStats.won,
    lost: pickStats.lost,
    pending: 0,
    unverifiable: 0,
    archivedTotal: pickStats.total,
    rate: pickStats.rate,
    last30Rate: pickStats.periods.last30.rate,
    gold: pickStats.gold,
    standard: pickStats.standard,
    byType: pickStats.byType,
    trend14: pickStats.trend14,
    period: {
      ...(payload.stats?.period || {}),
      total: pickStats.total,
      won: pickStats.won,
      lost: pickStats.lost,
      rate: pickStats.rate,
    },
  }
  const verifiedGeminiDetail = geminiDetailRows.filter(row => validateRecordedGeminiResult(row) === 'verified')
  const publicHistory = verifiedGeminiDetail.map(row => {
    const market = historyMarket(row.market || row.type)
    const score = row.finalScore || row.score
    return {
      date: row.date,
      match: row.match,
      ...(typeof row.league === 'string' ? { league: row.league } : {}),
      market,
      type: market === 'btts' ? 'BTTS' : 'Over 2.5',
      ...(typeof row.prediction === 'string' ? { prediction: row.prediction } : {}),
      ai_source: 'gemini-stats-v1',
      ai_abstain: false,
      ai_model: GEMINI_MODEL_ID,
      ai_response_status: 'pick',
      modelEngine: 'gemini-stats-v1',
      status: row.status,
      ...(typeof row.tier === 'string' ? { tier: row.tier } : {}),
      ...(typeof score === 'string' ? { finalScore: score, score } : {}),
      ...(typeof row.verifiedAt === 'string' ? { verifiedAt: row.verifiedAt } : {}),
      ...(typeof row.source === 'string' ? { source: row.source } : {}),
    }
  })
  const { legacyStats: _privateLegacyStats, ...publicPayload } = payload
  return {
    ...publicPayload,
    geminiOnly: true,
    history: publicHistory,
    stats,
    pickStats,
    historyAudit,
    historyReviewRows: reviewRows,
  }
}
