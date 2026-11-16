export type MatchDataAvailability = 'sufficient' | 'limited' | 'insufficient'

/** Describe the recorded match sample only; this never accepts, ranks or creates a prediction. */
export function matchDataAvailability(input: unknown): MatchDataAvailability {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return 'insufficient'
  const row = input as Record<string, unknown>
  const home = row.matchCountHome
  const away = row.matchCountAway
  if (
    typeof home !== 'number' || !Number.isInteger(home) || home < 0 ||
    typeof away !== 'number' || !Number.isInteger(away) || away < 0
  ) return 'insufficient'
  const sampleSize = Math.min(home, away)
  if (sampleSize >= 6) return 'sufficient'
  if (sampleSize >= 4) return 'limited'
  return 'insufficient'
}

/** User-facing wording about sample availability, not pick confidence or likelihood. */
export function humanMatchDataAvailabilityLabel(
  availability: MatchDataAvailability,
  locale: 'fr' | 'en' | 'ar' = 'fr',
): string {
  if (locale === 'en') {
    return availability === 'sufficient'
      ? 'Recent match data available'
      : availability === 'limited'
        ? 'Limited match sample'
        : 'Not enough historical matches'
  }
  if (locale === 'ar') {
    return availability === 'sufficient'
      ? 'تتوفر بيانات مباريات حديثة'
      : availability === 'limited'
        ? 'عينة المباريات محدودة'
        : 'لا تتوفر مباريات تاريخية كافية'
  }
  return availability === 'sufficient'
    ? 'Données de matchs récentes disponibles'
    : availability === 'limited'
      ? 'Échantillon de matchs limité'
      : 'Historique de matchs insuffisant'
}
