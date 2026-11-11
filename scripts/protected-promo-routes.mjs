// Routes promo non autorisées : conserver exactement les hashes déjà publiés.
// `en/code-promo-linebet-senegal` est l'exception approuvée pour corriger le
// body copy; title, canonical et keywords restent gelés par les tests SEO.
export const PRESERVED_PROMO_ROUTE_PREFIXES = Object.freeze([
  'ar/code-promo-1xbet',
  'en/bonus-888starz',
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
