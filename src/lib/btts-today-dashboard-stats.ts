export type VisibleBttsPrediction = {
  bttsProb?: number | null
  over25Prob?: number | null
}

export type BttsTodayDashboardStats = {
  total: number
  bttsHigh: number
  overHigh: number
}

/** Summarize only the prediction matches already selected for display by the dashboard filters. */
export function summarizeVisibleBttsPredictions(
  visibleMatches: readonly VisibleBttsPrediction[],
): BttsTodayDashboardStats {
  return {
    total: visibleMatches.length,
    bttsHigh: visibleMatches.filter(match => (match.bttsProb ?? 0) >= 0.6).length,
    overHigh: visibleMatches.filter(match => (match.over25Prob ?? 0) >= 0.6).length,
  }
}
