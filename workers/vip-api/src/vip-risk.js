const FORMULA_WINDOW_MS = 12 * 60 * 60 * 1000
const MODEL_CONFIDENCE = new Set(['low', 'medium', 'high'])
const EPSILON = 1e-9

const finiteRate = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
const percent = value => {
  const percentage = value * 100
  if (percentage > 0 && percentage < 0.01) return '<0,01 %'
  if (percentage > 99.99 && percentage < 100) return '>99,99 %'
  return `${String(Number(percentage.toFixed(2))).replace('.', ',')} %`
}

/** Shared deterministic disclosure policy: it never replaces the model probability with a frequency. */
export function assessPickRisk(candidate, nowMs = Date.now()) {
  const tier = candidate?.qualityTier ?? 'vip'
  const analyzedAt = typeof candidate?.analyzedAt === 'string' ? Date.parse(candidate.analyzedAt) : NaN
  const ageMs = nowMs - analyzedAt
  const rates = [candidate?.empiricalSelectionRate, candidate?.homeSelectionRate, candidate?.awaySelectionRate]
  const counts = [candidate?.formCountHome, candidate?.formCountAway]
  const matchCounts = [candidate?.matchCountHome, candidate?.matchCountAway]
  if (tier !== 'vip' || candidate?.probabilitySource !== 'gemini-estimate'
    || !finiteRate(candidate?.probability) || candidate.probability <= 0 || candidate.probability >= 1
    || !MODEL_CONFIDENCE.has(candidate?.aiConfidence)
    || !rates.every(finiteRate) || !counts.every(value => Number.isInteger(value) && value >= 5)
    || !matchCounts.every(value => Number.isInteger(value) && value >= 8)
    || candidate.dataQuality !== 'HIGH' || candidate.dataSource !== 'ESPN_TEAM_SCHEDULE'
    || !Number.isFinite(ageMs) || ageMs < 0 || ageMs > FORMULA_WINDOW_MS
    || candidate.sourceModel !== 'gemini-3.5-flash-lite') return null

  const probability = candidate.probability
  const [, homeRate, awayRate] = rates
  const minSample = Math.min(...counts)
  const minMatchSample = Math.min(...matchCounts)
  const weakestTeamRate = Math.min(homeRate, awayRate)
  const teamRateGap = Math.abs(homeRate - awayRate)
  const modelGap = Math.abs(probability - candidate.empiricalSelectionRate)
  const ageHours = Math.floor(ageMs / (60 * 60 * 1000))
  const hasExplicitSourceStatus = [candidate.sourceMatchStatus, candidate.sourceStatus]
    .some(value => typeof value === 'string' && value.trim())

  const lowRisk = candidate.aiConfidence === 'high' && probability >= 0.75 && weakestTeamRate >= 0.75
    && minSample >= 5 && minMatchSample >= 10 && teamRateGap <= 0.10 + EPSILON
    && modelGap <= 0.05 + EPSILON && ageMs <= 3 * 60 * 60 * 1000 && hasExplicitSourceStatus
  const highRisk = probability < 0.70 || candidate.aiConfidence === 'low'
    || weakestTeamRate < 0.55 || teamRateGap >= 0.25 - EPSILON
    || ageMs > 8 * 60 * 60 * 1000 || modelGap >= 0.12 - EPSILON
  const level = lowRisk ? 'FAIBLE' : highRisk ? 'ÉLEVÉ' : 'MODÉRÉ'
  const reasons = []
  if (probability < 0.70) reasons.push('Probabilité modèle inférieure à 70 % : risque ÉLEVÉ, même si le modèle déclare une confiance élevée.')
  if (candidate.aiConfidence === 'low') reasons.push('Le modèle déclare une confiance faible : risque ÉLEVÉ.')
  reasons.push(`Probabilité modèle : ${percent(probability)}; fréquences récentes de cette sélection, équipe A ${percent(homeRate)}, équipe B ${percent(awayRate)}.`)
  reasons.push(`Forme ${counts[0]}/${counts[1]} matchs; historique ${matchCounts[0]}/${matchCounts[1]}; confiance déclarée du modèle : ${candidate.aiConfidence}.`)
  if (modelGap >= 0.05 - EPSILON) reasons.push(`Écart estimation Gemini/fréquence de cette sélection : ${Math.round(modelGap * 100)} points.`)
  if (teamRateGap >= 0.10 - EPSILON) reasons.push(`Écart entre les fréquences des deux équipes : ${Math.round(teamRateGap * 100)} points.`)
  if (minMatchSample === 8) reasons.push('Historique au plancher admissible de 8 matchs pour une équipe.')
  if (!hasExplicitSourceStatus) reasons.push('Statut source explicite absent; ESPN doit confirmer le match avant envoi.')
  reasons.push(`Fraîcheur : analyse effectuée il y a environ ${ageHours} h.`)
  return { level, reasons: reasons.slice(0, 6), policy: 'risk-v2-model-specific', tier, ageHours, empiricalGap: modelGap }
}
