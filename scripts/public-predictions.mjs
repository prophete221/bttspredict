// Un export statique n'est pas un contrôle d'accès : aucun choix VIP ne doit y figurer.
export function isVipRow(row) {
  return row?.vip === true || row?.isVip === true || String(row?.tier || '').toUpperCase() === 'VIP'
}

const LEGACY_AI_CHOICES = [
  'ai_exact_score', 'exact_score_prob', 'ai_btts_prob', 'ai_over25_prob',
  'ai_winner', 'ai_winner_prob', 'ai_team_over15', 'ai_double_chance', 'ai_main_prediction', 'ai_risk',
]
export function observedFormBtts(row) {
  const rates = [row?.formHome?.bttsRate, row?.formAway?.bttsRate]
    .filter(rate => typeof rate === 'number' && Number.isFinite(rate) && rate >= 0 && rate <= 1)
  return rates.length ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length * 100) : null
}
// Une ligne publiée doit reposer sur des données réelles suffisantes
// (≥ 4 matchs enregistrés par équipe) — sinon elle est retenue à l'export.
// Les lignes sans aucun compteur (ancien schéma) restent tolérées.
export function sufficientRecordedEvidence(row) {
  if (!('matchCountHome' in row) && !('matchCountAway' in row)) return true
  return Number.isFinite(row.matchCountHome) && row.matchCountHome >= 4 &&
    Number.isFinite(row.matchCountAway) && row.matchCountAway >= 4
}
function withoutLegacyAiChoices(row) {
  const safe = { ...row }
  for (const field of LEGACY_AI_CHOICES) delete safe[field]
  // Ne pas réutiliser le taux v91 calculé depuis une moyenne de buts.
  safe.formBTTS = observedFormBtts(row)
  return safe
}

export function publicPredictionPayload(payload, { retireLegacyAiNumbers = false } = {}) {
  if (Array.isArray(payload)) return payload.filter(row => !isVipRow(row)).map(stripVipFields)
  if (!payload || typeof payload !== 'object') return payload
  const result = stripVipFields(payload)
  for (const field of ['free', 'predictions']) {
    if (Array.isArray(payload[field])) result[field] = payload[field].filter(row => !isVipRow(row) && (!retireLegacyAiNumbers || sufficientRecordedEvidence(row))).map(row => stripVipFields(retireLegacyAiNumbers ? withoutLegacyAiChoices(row) : row))
  }
  if (retireLegacyAiNumbers && Array.isArray(result.free) && result.stats) {
    result.stats = { ...result.stats, freeCount: result.free.length }
  }
  return result
}

// Le verrou CSS/JS n'est jamais un contrôle d'accès. Un export statique ne doit
// contenir aucune donnée VIP, même dans les archives, les compteurs ou les objets imbriqués.
function stripVipFields(value) {
  if (Array.isArray(value)) return value.filter(row => !isVipRow(row)).map(stripVipFields)
  if (!value || typeof value !== 'object') return value
  const safe = {}
  for (const [key, child] of Object.entries(value)) {
    if (/vip|combo/i.test(key)) continue
    if (key === 'tier' && String(child).toUpperCase() === 'VIP') continue
    safe[key] = stripVipFields(child)
  }
  return safe
}
