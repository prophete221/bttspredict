import { getDakarDateString, getDakarMatchStatus } from './dakar-date'

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

/** Build upcoming/live routes plus today's fixtures still linked from Match Center. */
export function getDynamicMatchSlugs(
  matches: readonly MatchPageCandidate[],
  now = new Date(),
): string[] {
  const slugs = matches.map(match => match.slug)
  assertUniqueMatchSlugs(slugs)
  const today = getDakarDateString(now)
  return matches
    .filter(match => match.date === today || getDakarMatchStatus(match.date, match.time, now) !== 'finished')
    .map(match => match.slug)
}

/** French root pages additionally retain only the explicitly protected historical URLs. */
export function getFrenchMatchStaticParams(
  matches: readonly MatchPageCandidate[],
  retainedSlugs: readonly string[],
  now = new Date(),
): Array<{ slug: string }> {
  const slugs = new Set([...getDynamicMatchSlugs(matches, now), ...retainedSlugs])
  return [...slugs].map(slug => ({ slug }))
}

/** Localized routes mirror the same published-match set; French uses the root route. */
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
