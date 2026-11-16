export type AnalysisLocale = 'fr' | 'en' | 'ar'

/** Return analysis text only when it exists in the current UI language. */
export function selectLocalizedAnalysis(
  french: string | null | undefined,
  english: string | null | undefined,
  locale: AnalysisLocale,
): string | undefined {
  const value = locale === 'fr' ? french : locale === 'en' ? english : undefined
  return typeof value === 'string' && value.trim() ? value : undefined
}
