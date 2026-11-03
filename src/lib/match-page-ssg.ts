export const RETAINED_FR_ONLY_MATCH_SLUG =
  'west-ham-united-vs-queens-park-rangers-2026-10-09'

const RETAINED_FR_ONLY_MATCH_SLUGS = new Set([RETAINED_FR_ONLY_MATCH_SLUG])

/** Fail instead of emitting two static pages for the same slug. */
export function assertUniqueMatchSlugs(slugs: readonly string[]): void {
  const seen = new Set<string>()
  for (const slug of slugs) {
    if (seen.has(slug)) throw new Error(`Duplicate match slug in SSG input: ${slug}`)
    seen.add(slug)
  }
}

/** Slugs served by the generic [slug] route; retained literal routes stay out. */
export function getDynamicMatchSlugs(slugs: readonly string[]): string[] {
  assertUniqueMatchSlugs(slugs)
  return slugs.filter(slug => !RETAINED_FR_ONLY_MATCH_SLUGS.has(slug))
}

/** Existing localized route set, less any explicitly French-only retained match. */
export function getLocalizedMatchStaticParams(
  slugs: readonly string[],
  locales: readonly string[],
): Array<{ locale: string; slug: string }> {
  const dynamicSlugs = getDynamicMatchSlugs(slugs)
  return locales
    .filter(locale => locale !== 'fr')
    .flatMap(locale => dynamicSlugs.map(slug => ({ locale, slug })))
}
