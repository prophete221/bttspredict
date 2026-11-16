type MatchFactRecord = {
  home?: unknown
  matchCountHome?: unknown
  formHome?: { goalsFor?: unknown; count?: unknown } | null
  xgHome?: unknown
  homeLambda?: unknown
  ai_key_fact?: unknown
  ai_key_fact_en?: unknown
}

export type MatchFactLocale = 'fr' | 'en' | 'ar'

/**
 * Preserve Gemini key facts unless a numeric average claim demonstrably confuses
 * observed goals per match with the separate model projection (lambda). Never
 * substitute French copy when a requested translation is absent.
 */
export function projectGeminiKeyFact(row: MatchFactRecord, locale: MatchFactLocale): string | undefined {
  const rawValue = locale === 'fr' ? row.ai_key_fact : locale === 'en' ? row.ai_key_fact_en : undefined
  const raw = typeof rawValue === 'string' ? rawValue.trim() : ''
  if (!raw) return undefined

  const goals = Number(row.formHome?.goalsFor)
  const count = Number(row.matchCountHome ?? row.formHome?.count)
  const projection = Number(row.xgHome ?? row.homeLambda)
  if (!Number.isFinite(goals) || !Number.isFinite(count) || count <= 0 || !Number.isFinite(projection)) return raw
  if (!/(moyenne|average|mean|avg\.?)/i.test(raw)) return raw

  const claimedNumbers = raw.match(/\d+(?:[.,]\d+)?/g) ?? []
  const claimsProjectionAsAverage = claimedNumbers.some(value => {
    const parsed = Number(value.replace(',', '.'))
    return Number.isFinite(parsed) && Math.abs(parsed - projection) < 0.01
  })
  const observedAverage = goals / count
  if (!claimsProjectionAsAverage || Math.abs(projection - observedAverage) < 0.01) return raw

  const numberLocale = locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar' : 'fr-FR'
  const format = (value: number) => new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 2 }).format(value)
  const home = typeof row.home === 'string' && row.home.trim() ? row.home.trim() : (locale === 'en' ? 'The home team' : locale === 'ar' ? 'الفريق المضيف' : 'L’équipe à domicile')
  if (locale === 'en') {
    return `${home}: ${format(goals)} goals in ${format(count)} matches (observed average: ${format(observedAverage)} per match). Model projection λ: ${format(projection)}.`
  }
  if (locale === 'ar') {
    return `${home}: ${format(goals)} هدفاً في ${format(count)} مباريات (المتوسط المرصود: ${format(observedAverage)} لكل مباراة). توقع النموذج λ: ${format(projection)}.`
  }
  return `${home} : ${format(goals)} buts en ${format(count)} matchs (moyenne observée : ${format(observedAverage)} par match). Projection du modèle λ : ${format(projection)}.`
}
