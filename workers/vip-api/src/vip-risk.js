const FORMULA_WINDOW_MS = 12 * 60 * 60 * 1000

const finiteRate = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
const percent = value => `${Math.round(value * 100)} %`

/** Shared, deterministic risk policy used both before sync and again by the Worker. */
export function assessPickRisk(candidate, nowMs = Date.now()) {
  const tier = candidate?.qualityTier ?? 'vip'
  const analyzedAt = typeof candidate?.analyzedAt === 'string' ? Date.parse(candidate.analyzedAt) : NaN
  const ageMs = nowMs - analyzedAt
  const rates = [candidate?.empiricalSelectionRate, candidate?.homeSelectionRate, candidate?.awaySelectionRate]
  const counts = [candidate?.formCountHome, candidate?.formCountAway]
  const matchCounts = [candidate?.matchCountHome, candidate?.matchCountAway]
  if (!['vip', 'fallback'].includes(tier)
    || !finiteRate(candidate?.probability) || candidate.probability <= 0.5
    || !rates.every(finiteRate) || !counts.every(value => Number.isInteger(value) && value >= 5)
    || !matchCounts.every(value => Number.isInteger(value) && value >= 6)
    || candidate.dataQuality !== 'HIGH' || candidate.dataSource !== 'ESPN_TEAM_SCHEDULE'
    || !Number.isFinite(ageMs) || ageMs < 0 || ageMs > FORMULA_WINDOW_MS
    || (tier === 'vip' && (candidate.aiConfidence !== 'high' || candidate.sourceModel !== 'gemini-3.5-flash-lite'
      || candidate.probabilitySource !== 'gemini-estimate'))
    || (tier === 'fallback' && (candidate.aiConfidence !== 'not_applicable' || candidate.sourceModel !== 'empirical-team-form'
      || candidate.probabilitySource !== 'recent-form-empirical'
      || Math.abs(candidate.probability - candidate.empiricalSelectionRate) > 1e-9))) return null

  const [probability, homeRate, awayRate] = rates
  const minSample = Math.min(...counts)
  const minMatchSample = Math.min(...matchCounts)
  const weakestTeamRate = Math.min(homeRate, awayRate)
  const teamRateGap = Math.abs(homeRate - awayRate)
  const empiricalGap = Math.abs(probability - candidate.empiricalSelectionRate)
  const modelGap = tier === 'vip' ? Math.abs(candidate.probability - candidate.empiricalSelectionRate) : 0
  const ageHours = Math.floor(ageMs / (60 * 60 * 1000))
  const hasExplicitSourceStatus = [candidate.sourceMatchStatus, candidate.sourceStatus]
    .some(value => typeof value === 'string' && value.trim())

  const lowRisk = tier === 'vip' && probability >= 0.75 && weakestTeamRate >= 0.75
    && minSample >= 5 && minMatchSample >= 10 && teamRateGap <= 0.10
    && modelGap <= 0.05 && ageMs <= 3 * 60 * 60 * 1000 && hasExplicitSourceStatus
  const highRisk = probability < 0.60 || weakestTeamRate < 0.55 || teamRateGap >= 0.25
    || ageMs > 8 * 60 * 60 * 1000 || minMatchSample <= 6
    || (tier === 'vip' && modelGap >= 0.12)
    || (tier === 'fallback' && probability < 0.65 && minSample <= 6)
  const level = lowRisk ? 'FAIBLE' : highRisk ? 'ÉLEVÉ' : 'MODÉRÉ'
  const reasons = [
    tier === 'fallback'
      ? 'Sélection de repli : le seuil VIP renforcé n’a pas été atteint; taux empirique, pas confiance Gemini.'
      : 'Pick VIP renforcé, estimation Gemini corroborée par les taux observés.',
    `Taux de sélection récent : ${percent(probability)}; domicile ${percent(homeRate)}, extérieur ${percent(awayRate)}; forme ${counts[0]}/${counts[1]} matchs, historique ${matchCounts[0]}/${matchCounts[1]}.`,
    tier === 'vip' ? 'Confiance du modèle : élevée.' : 'Confiance du modèle : non applicable; estimation fondée sur la forme observée.',
    `Fraîcheur : analyse effectuée il y a environ ${ageHours} h.`,
  ]
  if (!hasExplicitSourceStatus) reasons.push('Statut source explicite absent; le match doit être confirmé par ESPN en direct avant envoi.')
  if (teamRateGap >= 0.10) reasons.push(`Écart domicile/extérieur : ${Math.round(teamRateGap * 100)} points de pourcentage.`)
  if (tier === 'vip' && modelGap >= 0.05) reasons.push(`Écart entre estimation Gemini et taux empirique : ${Math.round(modelGap * 100)} points.`)
  if (probability < 0.65) reasons.push('Le taux observé reste proche du hasard ou inférieur à 65 %.')
  return { level, reasons, policy: 'risk-v1', tier, ageHours, empiricalGap }
}
