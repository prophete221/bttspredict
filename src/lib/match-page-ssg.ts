import { getDakarMatchStatus } from './dakar-date'

export type MatchPageCandidate = {
  slug: string
  date: string
  time?: string
}

/** Fail instead of emitting two static pages for the same slug. */
export function assertUniqueMatchSlugs(slugs: readonly string[]): void {
  const seen = new Set<string>()
  for (const slug of slugs) {
    if (seen.has(slug)) throw new Error(`Duplicate match slug in SSG input: ${slug}`)
    seen.add(slug)
  }
}

/** Build only pages for matches that have not finished in Africa/Dakar time. */
export function getDynamicMatchSlugs(
  matches: readonly MatchPageCandidate[],
  now = new Date(),
): string[] {
  const slugs = matches.map(match => match.slug)
  assertUniqueMatchSlugs(slugs)
  return matches
    .filter(match => getDakarMatchStatus(match.date, match.time, now) !== 'finished')
    .map(match => match.slug)
}

/** Localized routes mirror the same active-match set; French uses the root route. */
export function getLocalizedMatchStaticParams(
  matches: readonly MatchPageCandidate[],
  locales: readonly string[],
  now = new Date(),
): Array<{ locale: string; slug: string }> {
  const dynamicSlugs = getDynamicMatchSlugs(matches, now)
  return locales
    .filter(locale => locale !== 'fr')
    .flatMap(locale => dynamicSlugs.map(slug => ({ locale, slug })))
}
