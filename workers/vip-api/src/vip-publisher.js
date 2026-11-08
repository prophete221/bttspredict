import { validateCandidate } from './vip-candidates.js'
import { publicationConfigured, VIP_PUBLICATION_POLICY, VIP_PUBLICATION_TIMES } from './vip-publication-config.js'
export { publicationConfigured, VIP_PUBLICATION_POLICY, VIP_PUBLICATION_TIMES } from './vip-publication-config.js'
const MAX_AGE_MS = 12 * 60 * 60 * 1000
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000
const MAX_WINDOW_DELAY_MS = 5 * 60 * 1000
const MIN_KICKOFF_LEAD_MS = 60 * 1000
const ESPN_BUDGET_MS = 12_000
const ESPN_CONCURRENCY = 5
const MAX_ESPN_CANDIDATES = 10
const TELEGRAM_READINESS_TIMEOUT_MS = 2500
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
  const market = [pick.ai_market, pick.type, pick.market].map(normalizeMarket).find(Boolean) || null
  const selection = [pick.prediction, pick.selection].map(normalizeSelection).find(Boolean) || null
  const parts = [row.date, normalizeIdentity(row.league), normalizeIdentity(row.home), normalizeIdentity(row.away), market, selection]
  return /^\d{4}-\d{2}-\d{2}$/.test(String(parts[0] || '')) && parts.every(Boolean) ? parts.join('|') : null
}

function candidateIdentity(candidate) {
  return [candidate.date, normalizeIdentity(candidate.league), normalizeIdentity(candidate.home), normalizeIdentity(candidate.away), candidate.market, candidate.selection].join('|')
}

function compareCandidateStrength(a, b) {
  const riskRank = { FAIBLE: 0, MODÉRÉ: 1, ÉLEVÉ: 2 }
  const confidenceRank = { low: 0, medium: 1, high: 2 }
  return b.probability - a.probability
    || riskRank[a.riskLevel] - riskRank[b.riskLevel]
    || confidenceRank[b.aiConfidence] - confidenceRank[a.aiConfidence]
    || Math.min(b.matchCountHome, b.matchCountAway) - Math.min(a.matchCountHome, a.matchCountAway)
    || Math.min(b.formCountHome, b.formCountAway) - Math.min(a.formCountHome, a.formCountAway)
    || Math.abs(a.probability - a.empiricalSelectionRate) - Math.abs(b.probability - b.empiricalSelectionRate)
    || Date.parse(a.kickoffAt) - Date.parse(b.kickoffAt)
}

async function boundedJson(url, options, fetcher, timeoutMs = 8000) {
  const budget = Math.max(0, Math.min(8000, timeoutMs))
  if (!budget) return null
  const controller = new AbortController()
  let timeout
  try {
    const operation = (async () => {
      const response = await fetcher(url, { ...options, signal: controller.signal })
      const declared = Number(response.headers?.get('Content-Length') || 0)
      if (declared > 4_000_000) return null
      const text = await response.text()
      if (text.length > 4_000_000) return null
      let body
      try { body = JSON.parse(text) } catch { return null }
      return { ok: response.ok, status: response.status, body }
    })()
    const expired = new Promise(resolve => {
      timeout = setTimeout(() => { controller.abort(); resolve(null) }, budget)
    })
    return await Promise.race([operation, expired])
  } catch {
    return null
  } finally {
    if (timeout) clearTimeout(timeout)
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

export async function verifyLiveFixture(candidate, now, fetcher = fetch, deadlineAt = Infinity) {
  if (!/^\d{1,20}$/.test(String(candidate.fixtureId || ''))
    || !/^[a-z0-9]+(?:\.[a-z0-9]+){1,3}$/.test(String(candidate.leagueSlug || ''))
    || !/^\d{1,20}$/.test(String(candidate.homeTeamId || ''))
    || !/^\d{1,20}$/.test(String(candidate.awayTeamId || ''))
    || candidate.homeTeamId === candidate.awayTeamId
    || Date.parse(candidate.sourceKickoffAt) !== Date.parse(candidate.kickoffAt)) return false
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${candidate.leagueSlug}/summary?event=${candidate.fixtureId}`
  const result = await boundedJson(url, { headers: { Accept: 'application/json' }, cache: 'no-store' },
    fetcher, Math.min(8000, deadlineAt - Date.now()))
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

async function verifyFixturesConcurrently(items, fetcher, deadlineAt, clock) {
  const results = new Array(items.length).fill(false)
  let nextIndex = 0
  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++
      const item = items[index]
      const before = clock()
      if (Date.now() >= deadlineAt || Date.parse(item.candidate.kickoffAt) <= before + MIN_KICKOFF_LEAD_MS) continue
      const valid = await verifyLiveFixture(item.candidate, before, fetcher, deadlineAt)
      results[index] = valid && Date.now() < deadlineAt
        && Date.parse(item.candidate.kickoffAt) > clock() + MIN_KICKOFF_LEAD_MS
    }
  }
  await Promise.all(Array.from({ length: Math.min(ESPN_CONCURRENCY, items.length) }, worker))
  return results
}

async function telegramRead(env, method, body, fetcher, timeoutMs = 8000) {
  return boundedJson(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }, fetcher, timeoutMs)
}

export async function telegramReadiness(env, fetcher = fetch) {
  const unavailable = { botReachable: false, destinationAccessible: false, canPublish: false }
  if (!publicationConfigured(env)) return unavailable
  const chatId = String(env.TELEGRAM_CHANNEL_ID)
  const [me, chat] = await Promise.all([
    telegramRead(env, 'getMe', {}, fetcher, TELEGRAM_READINESS_TIMEOUT_MS),
    telegramRead(env, 'getChat', { chat_id: chatId }, fetcher, TELEGRAM_READINESS_TIMEOUT_MS),
  ])
  const botId = me?.body?.result?.id
  if (!me?.ok || me.body?.ok !== true || !Number.isSafeInteger(botId) || botId <= 0) return unavailable
  const target = chat?.body?.result
  if (!chat?.ok || chat.body?.ok !== true || String(target?.id) !== chatId || !['channel', 'supergroup'].includes(target.type)) {
    return { ...unavailable, botReachable: true }
  }
  const member = await telegramRead(env, 'getChatMember', { chat_id: chatId, user_id: botId }, fetcher, TELEGRAM_READINESS_TIMEOUT_MS)
  const rights = member?.body?.result
  const allowed = member?.ok && member.body?.ok === true && rights?.user?.id === botId
    && ['creator', 'administrator'].includes(rights.status)
    && (target.type !== 'channel' || rights.can_post_messages === true)
  return { botReachable: true, destinationAccessible: true, canPublish: Boolean(allowed) }
}

const VIP_MESSAGE_LANGUAGES = [
  { id: 'fr', flag: '🇫🇷', label: 'Français' },
  { id: 'en', flag: '🇬🇧', label: 'English' },
  { id: 'ar', flag: '🇸🇦', label: 'العربية' },
]

function localizedPercent(value, language, model = false) {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new TypeError('risk_assessment_missing')
  if (model && value < 0.0001) {
    return language === 'fr' ? '<0,01 %' : language === 'en' ? '<0.01%' : 'أقل من ٠٫٠١٪'
  }
  if (model && value > 0.9999) {
    return language === 'fr' ? '>99,99 %' : language === 'en' ? '>99.99%' : 'أكثر من ٩٩٫٩٩٪'
  }
  const locale = { fr: 'fr-FR', en: 'en-GB', ar: 'ar' }[language]
  const percentage = model ? value * 100 : Math.round(value * 100)
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: model ? 2 : 0 }).format(percentage)
  return language === 'fr' ? `${number} %` : language === 'en' ? `${number}%` : `${number}٪`
}

function vipRiskReasonKey(candidate, freshnessHours) {
  if (candidate.probability < 0.70) return 'below70'
  if (candidate.probability > 0.78) return 'above78'
  if (candidate.aiConfidence === 'low') return 'lowConfidence'
  if (Math.min(candidate.homeSelectionRate, candidate.awaySelectionRate) < 0.55) return 'weakRate'
  if (Math.abs(candidate.homeSelectionRate - candidate.awaySelectionRate) >= 0.25 - 1e-9) return 'teamRateGap'
  if (freshnessHours > 8) return 'stale'
  if (Math.abs(candidate.probability - candidate.empiricalSelectionRate) >= 0.12 - 1e-9) return 'modelGap'
  if (candidate.riskLevel === 'FAIBLE') return 'low'
  if (candidate.riskLevel === 'MODÉRÉ') return 'moderate'
  return 'high'
}

const VIP_RISK_REASON = {
  fr: {
    below70: 'probabilité modèle sous 70 %', above78: 'estimation Gemini au-dessus de 78 %, hors de la plage de référence 70–78 %',
    lowConfidence: 'confiance Gemini déclarée faible', weakRate: 'taux récent sous 55 % pour au moins une équipe',
    teamRateGap: 'écart élevé entre les taux récents des deux équipes', stale: 'analyse âgée de plus de 8 h',
    modelGap: 'écart estimation/fréquence d’au moins 12 points', low: 'critères de risque faible réunis; cela reste une estimation',
    moderate: 'risque modéré; tenir compte des taux et des échantillons',
    high: 'signaux de risque élevés; examiner les taux et la fraîcheur',
  },
  en: {
    below70: 'model estimate below 70%', above78: 'Gemini estimate above 78%, outside the 70–78% reference band',
    lowConfidence: 'Gemini declared low confidence', weakRate: 'recent rate below 55% for at least one team',
    teamRateGap: 'large gap between the teams’ recent rates', stale: 'analysis is over 8 hours old',
    modelGap: 'model-to-rate gap of at least 12 percentage points', low: 'low-risk criteria met; this remains an estimate',
    moderate: 'moderate risk; consider the rates and sample sizes',
    high: 'high-risk signals; review the rates and freshness',
  },
  ar: {
    below70: 'احتمال النموذج أقل من 70٪', above78: 'تقدير Gemini أعلى من 78٪، خارج النطاق المرجعي 70–78٪',
    lowConfidence: 'أعلن Gemini عن ثقة منخفضة', weakRate: 'المعدل الحديث أقل من 55٪ لفريق واحد على الأقل',
    teamRateGap: 'فجوة كبيرة بين المعدلين الحديثين للفريقين', stale: 'عمر التحليل أكثر من 8 ساعات',
    modelGap: 'الفارق بين التقدير والمعدل لا يقل عن 12 نقطة مئوية', low: 'تحققت شروط المخاطر المنخفضة، لكنه يظل تقديرًا',
    moderate: 'مخاطر متوسطة؛ راجع المعدلات وحجم العينة',
    high: 'مؤشرات مخاطر مرتفعة؛ راجع المعدلات وحداثة التحليل',
  },
}

function safeVipText(value) {
  if (typeof value !== 'string') throw new TypeError('risk_assessment_missing')
  const normalized = value.replace(/[\u0000-\u001f\u007f\u2028\u2029]/g, ' ')
    .replace(/[<>]/g, '').replace(/\s+/g, ' ').trim()
  const result = Array.from(normalized).slice(0, 120).join('')
  if (!result) throw new TypeError('risk_assessment_missing')
  return result
}

function localizedVipPick(candidate, language, number = 1) {
  if (candidate.qualityTier !== 'vip' || candidate.probabilitySource !== 'gemini-estimate'
    || !['low', 'medium', 'high'].includes(candidate.aiConfidence)) {
    throw new TypeError('model_estimate_contract_missing')
  }
  const riskLabels = {
    FAIBLE: { fr: 'FAIBLE', en: 'LOW', ar: 'منخفضة' },
    MODÉRÉ: { fr: 'MODÉRÉ', en: 'MODERATE', ar: 'متوسطة' },
    ÉLEVÉ: { fr: 'ÉLEVÉ', en: 'HIGH', ar: 'مرتفعة' },
  }
  const confidenceLabels = {
    low: { fr: 'faible', en: 'low', ar: 'منخفضة' },
    medium: { fr: 'moyenne', en: 'medium', ar: 'متوسطة' },
    high: { fr: 'élevée', en: 'high', ar: 'عالية' },
  }
  const sourceRiskLabel = riskLabels[candidate.riskLevel]?.[language]
  if (!sourceRiskLabel || !Array.isArray(candidate.riskReasons) || candidate.riskReasons.length < 2) {
    throw new TypeError('risk_assessment_missing')
  }
  const freshnessReason = candidate.riskReasons.find(value => typeof value === 'string' && value.startsWith('Fraîcheur :'))
  const freshnessMatch = freshnessReason?.match(/environ\s+(\d+)\s*h\b/i)
  if (!freshnessMatch) throw new TypeError('freshness_assessment_missing')
  const freshnessHours = Number(freshnessMatch[1])
  const empiricalRates = [candidate.empiricalSelectionRate, candidate.homeSelectionRate, candidate.awaySelectionRate]
  const sampleCounts = [candidate.matchCountHome, candidate.matchCountAway, candidate.formCountHome, candidate.formCountAway]
  if (!Number.isFinite(candidate.probability) || candidate.probability <= 0 || candidate.probability >= 1
    || !empiricalRates.every(value => Number.isFinite(value) && value >= 0 && value <= 1)
    || !sampleCounts.slice(0, 2).every(value => Number.isInteger(value) && value >= 8)
    || !sampleCounts.slice(2).every(value => Number.isInteger(value) && value >= 5)) {
    throw new TypeError('risk_assessment_missing')
  }
  const riskReasonKey = vipRiskReasonKey(candidate, freshnessHours)
  const elevatedSignals = new Set(['below70', 'above78', 'lowConfidence', 'weakRate', 'teamRateGap', 'stale', 'modelGap'])
  const riskLabel = elevatedSignals.has(riskReasonKey) ? riskLabels.ÉLEVÉ[language] : sourceRiskLabel
  const riskReason = VIP_RISK_REASON[language][riskReasonKey]
  const confidence = confidenceLabels[candidate.aiConfidence][language]
  const isBtts = candidate.market === 'BTTS'
  if (!isBtts && candidate.market !== 'OVER_25') throw new TypeError('risk_assessment_missing')
  if (!['YES', 'NO'].includes(candidate.selection)) throw new TypeError('risk_assessment_missing')
  const home = safeVipText(candidate.home)
  const away = safeVipText(candidate.away)
  const league = safeVipText(candidate.league)
  const date = safeVipText(candidate.date)
  const time = safeVipText(candidate.time)

  const marketSelection = {
    fr: isBtts ? `BTTS : ${candidate.selection === 'YES' ? 'Oui' : 'Non'}`
      : candidate.selection === 'YES' ? 'Plus de 2,5 buts' : 'Moins de 2,5 buts',
    en: isBtts ? `BTTS: ${candidate.selection === 'YES' ? 'Yes' : 'No'}`
      : candidate.selection === 'YES' ? 'Over 2.5 goals' : 'Under 2.5 goals',
    ar: isBtts ? `BTTS: ${candidate.selection === 'YES' ? 'نعم' : 'لا'}`
      : candidate.selection === 'YES' ? 'أكثر من 2.5 هدف' : 'أقل من 2.5 هدف',
  }[language]
  const dateLine = language === 'fr' ? `${date} · ${time} (Dakar)`
    : language === 'en' ? `${date} · ${time} (Dakar)`
      : `${date} · ${time} بتوقيت داكار`
  const modelLabel = language === 'fr' ? `Gemini ${localizedPercent(candidate.probability, language, true)} · confiance déclarée ${confidence}`
    : language === 'en' ? `Gemini estimate ${localizedPercent(candidate.probability, language, true)} · declared confidence ${confidence}`
      : `تقدير Gemini ${localizedPercent(candidate.probability, language, true)} · الثقة المعلنة ${confidence}`
  const ratesLabel = language === 'fr'
    ? `Taux récents non calibrés : global ${localizedPercent(candidate.empiricalSelectionRate, language)} · domicile ${localizedPercent(candidate.homeSelectionRate, language)} · extérieur ${localizedPercent(candidate.awaySelectionRate, language)}`
    : language === 'en'
      ? `Recent empirical rates (not calibrated): overall ${localizedPercent(candidate.empiricalSelectionRate, language)} · home ${localizedPercent(candidate.homeSelectionRate, language)} · away ${localizedPercent(candidate.awaySelectionRate, language)}`
      : `المعدلات التجريبية الحديثة (غير معايرة): الإجمالي ${localizedPercent(candidate.empiricalSelectionRate, language)} · المضيف ${localizedPercent(candidate.homeSelectionRate, language)} · الضيف ${localizedPercent(candidate.awaySelectionRate, language)}`
  const sampleFreshness = language === 'fr'
    ? `Historique ${candidate.matchCountHome}/${candidate.matchCountAway} · forme ${candidate.formCountHome}/${candidate.formCountAway} · fraîcheur ~${freshnessHours} h`
    : language === 'en'
      ? `History ${candidate.matchCountHome}/${candidate.matchCountAway} · form ${candidate.formCountHome}/${candidate.formCountAway} · analysis ~${freshnessHours} h old`
      : `السجل ${candidate.matchCountHome}/${candidate.matchCountAway} · الأداء ${candidate.formCountHome}/${candidate.formCountAway} · عمر التحليل نحو ${freshnessHours} ساعة`
  const riskLine = language === 'fr' ? `Risque ${riskLabel} — ${riskReason}`
    : language === 'en' ? `Risk ${riskLabel} — ${riskReason}`
      : `مستوى المخاطر ${riskLabel} — ${riskReason}`

  return [
    `${number}) ${home} ${language === 'ar' ? 'ضد' : language === 'en' ? 'vs' : '—'} ${away} · ${league}`,
    `${dateLine} | ${marketSelection}`,
    modelLabel,
    ratesLabel,
    sampleFreshness,
    riskLine,
  ].join('\n')
}

export function formatVipMessage(candidate) {
  return VIP_MESSAGE_LANGUAGES.map(({ id, flag, label }) =>
    `${flag} ${label}\n${localizedVipPick(candidate, id)}`).join('\n\n')
}

function formatVipBatchMessageFor(included) {
  const count = included.length
  const prefix = [
    `BTTSPredict — Sélections VIP / VIP Picks / توقعات VIP (${count}/5)`,
    'FR — Lot partiel ou complet selon les matchs revalidés.',
    'EN — Partial or complete batch based on live rechecks.',
    'AR — مجموعة جزئية أو كاملة بناءً على إعادة التحقق المباشر.',
  ].join('\n')
  const sections = VIP_MESSAGE_LANGUAGES.map(({ id, flag, label }) =>
    `${flag} ${label}\n${included.map((item, index) => localizedVipPick(item.candidate, id, index + 1)).join('\n\n')}`)
  const footer = [
    'FR — Estimation, pas une garantie. 18+ · Jeu responsable.',
    'EN — Estimate, not a guarantee. 18+ · Play responsibly.',
    'AR — تقدير وليس ضمانًا. +18 · العب بمسؤولية.',
  ].join('\n')
  return `${prefix}\n\n${sections.join('\n\n──────────\n\n')}\n\n${footer}`
}

export function formatVipBatchMessage(candidates) {
  if (!Array.isArray(candidates) || candidates.length < 2 || candidates.length > 5) return null
  const included = []
  for (const candidate of candidates) {
    try { VIP_MESSAGE_LANGUAGES.forEach(({ id }) => localizedVipPick(candidate, id)) } catch { continue }
    const tentative = [...included, { candidate }]
    if (formatVipBatchMessageFor(tentative).length <= 4096) included.push({ candidate })
  }
  if (included.length < 2) return null
  while (included.length && formatVipBatchMessageFor(included).length > 4096) included.pop()
  if (included.length < 2) return null
  return { message: formatVipBatchMessageFor(included), count: included.length, candidates: included.map(item => item.candidate) }
}

// Each candidate gets a durable atomic claim; fixture-level exclusion spans all
// markets and every prior state, including unknown outcomes.
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
    AND NOT EXISTS (SELECT 1 FROM vip_publications p
      WHERE json_extract(p.snapshot_json, '$.fixtureId') = json_extract(c.candidate_json, '$.fixtureId'))
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

/** @param {Record<string, unknown>} env @param {{scheduledTime?: number|string, syncId?: string, expectedSyncId?: string, clock?: () => number, fetcher?: typeof fetch, espnBudgetMs?: number}} options */
export async function publishVipWindow(env, { scheduledTime, syncId, expectedSyncId, clock = Date.now, fetcher = fetch, espnBudgetMs = ESPN_BUDGET_MS }) {
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
  let telegramAttempted = false
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
        AND NOT EXISTS (SELECT 1 FROM vip_publications p
          WHERE json_extract(p.snapshot_json, '$.fixtureId') = json_extract(c.candidate_json, '$.fixtureId'))
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
    const checkCandidates = []
    const seenFixtures = new Set()
    for (const item of candidates) {
      if (free.has(candidateIdentity(item.candidate))) continue
      const fixtureKey = String(item.candidate.fixtureId)
      if (seenFixtures.has(fixtureKey)) continue
      seenFixtures.add(fixtureKey)
      checkCandidates.push(item)
      if (checkCandidates.length === MAX_ESPN_CANDIDATES) break
    }
    const espnDeadlineAt = Date.now() + Math.max(0, Math.min(ESPN_BUDGET_MS, Number(espnBudgetMs) || 0))
    const initialChecks = await verifyFixturesConcurrently(checkCandidates, fetcher, espnDeadlineAt, clock)
    const selected = checkCandidates.filter((_, index) => initialChecks[index]).slice(0, 5)
    if (selected.length < 2) return await finishRun(env, window, 'no_candidates', clock())
    const ready = await telegramReadiness(env, fetcher)
    if (!ready.canPublish) return await finishRun(env, window, 'destination_unavailable', clock())
    const formatted = formatVipBatchMessage(selected.map(item => item.candidate))
    if (!formatted) return await finishRun(env, window, 'source_incomplete', clock())
    const claimedItems = formatted.candidates.map(candidate => selected.find(item => item.candidate.candidateKey === candidate.candidateKey))
      .filter(Boolean)
    const now = clock()
    if (!isSyncTrigger && now - Number(scheduledTime) > MAX_WINDOW_DELAY_MS) return await finishRun(env, window, 'source_unavailable', now)
    if (claimedItems.some(item => Date.parse(item.candidate.kickoffAt) <= now + MIN_KICKOFF_LEAD_MS)) {
      return await finishRun(env, window, 'no_candidates', now)
    }
    const tokens = claimedItems.map(() => crypto.randomUUID())
    const claimStatements = claimedItems.map((item, index) => env.DB.prepare(CLAIM_PUBLICATION_SQL).bind(
      window.key, tokens[index], VIP_PUBLICATION_POLICY, JSON.stringify(item.candidate), formatted.message, new Date(now).toISOString(),
      item.candidate.candidateKey, item.materialHash, sync.last_sync_id,
      new Date(now + MIN_KICKOFF_LEAD_MS).toISOString(), new Date(now - MAX_AGE_MS).toISOString(),
      new Date(now + MAX_FUTURE_SKEW_MS).toISOString(),
    ))
    const reserved = await env.DB.batch(claimStatements)
    const successfulIndexes = (reserved || []).flatMap((result, index) =>
      Number(result?.meta?.changes || 0) === 1 ? [index] : [])
    if (successfulIndexes.length !== claimedItems.length) {
      const timestamp = new Date(clock()).toISOString()
      if (successfulIndexes.length) {
        await env.DB.batch(successfulIndexes.map(index => env.DB.prepare(`/* publisher:release-partial-claim */
          UPDATE vip_publications SET state = 'not_sent', resolved_at = ?, error_code = 'batch_claim_incomplete'
          WHERE claim_token = ? AND state = 'claimed'
        `).bind(timestamp, tokens[index])))
      }
      return await finishRun(env, window, 'claim_lost', clock(), successfulIndexes.length, 0)
    }
    claim = { tokens, items: claimedItems }
    // Claims are followed immediately by fresh ESPN status, team and kickoff checks.
    const finalChecks = await verifyFixturesConcurrently(claimedItems, fetcher, espnDeadlineAt, clock)
    const sendAt = clock()
    const safeIndexes = claimedItems.flatMap((item, index) => finalChecks[index]
      && Date.parse(item.candidate.kickoffAt) > sendAt + MIN_KICKOFF_LEAD_MS ? [index] : [])
    const safeSet = new Set(safeIndexes)
    const timestamp = new Date(sendAt).toISOString()
    const unsafeTokens = tokens.filter((_, index) => !safeSet.has(index))
    if (unsafeTokens.length) {
      await env.DB.batch(unsafeTokens.map(token => env.DB.prepare(`/* publisher:mark-postclaim-invalid */
        UPDATE vip_publications SET state = 'not_sent', resolved_at = ?, error_code = 'live_revalidation_failed'
        WHERE claim_token = ? AND state = 'claimed'
      `).bind(timestamp, token)))
    }
    const safeItems = claimedItems.filter((_, index) => safeSet.has(index))
    const safeTokens = tokens.filter((_, index) => safeSet.has(index))
    if (!safeItems.length) {
      claim = null
      return await finishRun(env, window, 'no_candidates', clock(), claimedItems.length, 0)
    }
    const finalFormatted = formatVipBatchMessage(safeItems.map(item => item.candidate))
    if (!finalFormatted) {
      await env.DB.batch(safeTokens.map(token => env.DB.prepare(`/* publisher:mark-unformattable */
        UPDATE vip_publications SET state = 'not_sent', resolved_at = ?, error_code = 'message_format_failed'
        WHERE claim_token = ? AND state = 'claimed'
      `).bind(timestamp, token)))
      claim = null
      return await finishRun(env, window, 'source_incomplete', clock(), claimedItems.length, 0)
    }
    const messageItems = finalFormatted.candidates.map(candidate => safeItems.find(item =>
      item.candidate.candidateKey === candidate.candidateKey)).filter(Boolean)
    const messageTokens = messageItems.map(item => safeTokens[safeItems.indexOf(item)])
    const compactedTokens = safeTokens.filter(token => !messageTokens.includes(token))
    if (compactedTokens.length) {
      await env.DB.batch(compactedTokens.map(token => env.DB.prepare(`/* publisher:mark-compacted-out */
        UPDATE vip_publications SET state = 'not_sent', resolved_at = ?, error_code = 'message_compacted_out'
        WHERE claim_token = ? AND state = 'claimed'
      `).bind(timestamp, token)))
    }
    await env.DB.batch(messageTokens.map(token => env.DB.prepare(`/* publisher:update-final-batch-message */
      UPDATE vip_publications SET message_text = ? WHERE claim_token = ? AND state = 'claimed'
    `).bind(finalFormatted.message, token)))
    const preSendAt = clock()
    if (messageItems.some(item => Date.parse(item.candidate.kickoffAt) <= preSendAt + MIN_KICKOFF_LEAD_MS)) {
      await env.DB.batch(messageTokens.map(token => env.DB.prepare(`/* publisher:mark-final-kickoff-margin */
        UPDATE vip_publications SET state = 'not_sent', resolved_at = ?, error_code = 'kickoff_margin_below_one_minute'
        WHERE claim_token = ? AND state = 'claimed'
      `).bind(new Date(preSendAt).toISOString(), token)))
      claim = null
      return await finishRun(env, window, 'no_candidates', preSendAt, claimedItems.length, 0)
    }
    claim = { tokens: messageTokens, items: messageItems }
    // One Telegram send attempt for the entire batch; unknown is never retried.
    telegramAttempted = true
    const response = await telegramRead(env, 'sendMessage', {
      chat_id: String(env.TELEGRAM_CHANNEL_ID), text: finalFormatted.message, disable_web_page_preview: true,
    }, fetcher)
    const sent = response?.ok && response.body?.ok === true
      && Number.isSafeInteger(response.body.result?.message_id) && response.body.result.message_id > 0
      && String(response.body.result?.chat?.id) === String(env.TELEGRAM_CHANNEL_ID)
    const sendTimestamp = new Date(clock()).toISOString()
    if (sent) {
      const messageId = String(response.body.result.message_id)
      const statements = messageItems.flatMap((item, index) => [
        env.DB.prepare(`/* publisher:mark-candidate-sent */
          UPDATE vip_candidates SET status = 'published', published_at = ?, publication_window = ?, telegram_message_id = ?
          WHERE candidate_key = ? AND material_hash = ? AND status IN ('pending_owner_approval', 'approved')
            AND EXISTS (SELECT 1 FROM vip_publications WHERE candidate_key = ? AND claim_token = ? AND state = 'claimed')
        `).bind(sendTimestamp, window.key, messageId, item.candidate.candidateKey, item.materialHash, item.candidate.candidateKey, safeTokens[index]),
        env.DB.prepare(`/* publisher:mark-sent */
          UPDATE vip_publications SET state = 'sent', resolved_at = ?, telegram_message_id = ?, error_code = NULL
          WHERE claim_token = ? AND state = 'claimed'
        `).bind(sendTimestamp, messageId, safeTokens[index]),
      ])
      const committed = await env.DB.batch(statements)
      if ((committed || []).some(result => Number(result?.meta?.changes || 0) !== 1)) {
        await env.DB.prepare(`/* publisher:quarantine-batch-after-send */
          UPDATE vip_publications SET state = 'unknown', resolved_at = ?, telegram_message_id = NULL,
            error_code = 'state_commit_unconfirmed'
          WHERE window_key = ? AND state IN ('claimed', 'sent')
        `).bind(sendTimestamp, window.key).run().catch(() => {})
        return await finishRun(env, window, 'unknown', clock(), claimedItems.length, 0)
      }
      return await finishRun(env, window, 'sent', clock(), claimedItems.length, messageItems.length)
    }
    const rejected = response && response.body?.ok === false
      && [400, 401, 403, 404, 429].includes(Number(response.body.error_code))
    const outcome = rejected ? 'not_sent' : 'unknown'
    await env.DB.batch(tokens.map(token => env.DB.prepare(`/* publisher:mark-batch-unsent */
      UPDATE vip_publications SET state = ?, resolved_at = ?, error_code = ?
      WHERE claim_token = ? AND state = 'claimed'
      `).bind(outcome, sendTimestamp, rejected ? `telegram_${Number(response.body.error_code)}` : 'telegram_outcome_unconfirmed', token)))
    return await finishRun(env, window, outcome, clock(), claimedItems.length, 0)
  } catch {
    if (claim) {
      const claimState = telegramAttempted ? 'unknown' : 'not_sent'
      const claimError = telegramAttempted ? 'outcome_unconfirmed' : 'pre_send_failure'
      await env.DB.batch(claim.tokens.map(token => env.DB.prepare(`/* publisher:mark-batch-unknown */
        UPDATE vip_publications SET state = ?, resolved_at = ?, error_code = ?
        WHERE claim_token = ? AND state = 'claimed'
      `).bind(claimState, new Date(clock()).toISOString(), claimError, token))).catch(() => {})
    }
    const outcome = claim ? telegramAttempted ? 'unknown' : 'not_sent' : 'failed'
    return await finishRun(env, window, outcome, clock(), claim?.items.length || 0, 0)
      .catch(() => ({ outcome, claimed: claim?.items.length || 0, sent: 0 }))
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
    timezone: 'Africa/Dakar', times: VIP_PUBLICATION_TIMES, maxNewPicksPerWindow: 5,
    automaticRetry: false, deliverySemantics: 'durable-claim-single-attempt-ambiguous-quarantined',
    destination: await telegramReadiness(env, fetcher),
    publicationCounts: Object.fromEntries((counts.results || []).map(row => [row.state, Number(row.count)])),
    latestRun: latest || null,
  }
}
