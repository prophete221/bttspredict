import { resolveTeamLogoSrc } from './teamLogoOverrides'

type MatchWithLogos = {
  homeLogo?: string
  awayLogo?: string
}

const FIXED_MATCH_PAGE_SLUGS = new Set([
  'brondby-vs-rosenborg-2026-11-11',
  'nantes-vs-lens-2026-11-13',
])

export function resolveMatchPageLogos<T extends MatchWithLogos>(slug: string, match: T | null): T | null {
  if (!match || !FIXED_MATCH_PAGE_SLUGS.has(slug)) return match

  return {
    ...match,
    homeLogo: resolveTeamLogoSrc(match.homeLogo),
    awayLogo: resolveTeamLogoSrc(match.awayLogo),
  }
}
