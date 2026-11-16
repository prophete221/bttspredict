export type VisibleBttsPrediction = {
  bttsProb?: number | null
  over25Prob?: number | null
}

export type BttsTodayDashboardStats = {
  total: number
}

/** Count the prediction cards selected for display; no probability threshold is applied. */
export function summarizeVisibleBttsPredictions(
  visibleMatches: readonly VisibleBttsPrediction[],
): BttsTodayDashboardStats {
  return { total: visibleMatches.length }
}
