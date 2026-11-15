// Routes promo encore gelées : conserver exactement les hashes déjà publiés.
// Les pages AR 1xBet et EN 888Starz sont désormais servies par les layouts
// localisés communs ; leurs métadonnées title/canonical restent inchangées.
export const PRESERVED_PROMO_ROUTE_PREFIXES = Object.freeze([
  'ar/bonus-888starz-btts221',
  'linebet-promo-code',
])

export function isProtectedPromoPath(relativePath) {
  if (typeof relativePath !== 'string') return false
  return PRESERVED_PROMO_ROUTE_PREFIXES.some(route =>
    relativePath === `${route}.html` ||
    relativePath === `${route}.txt` ||
    relativePath.startsWith(`${route}/`),
  )
}
