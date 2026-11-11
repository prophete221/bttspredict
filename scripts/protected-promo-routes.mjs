// Pages promo à conserver strictement telles qu'elles sont déjà publiées.
// Elles ne font pas partie des onze corrections locales approuvées.
export const PRESERVED_PROMO_ROUTE_PREFIXES = Object.freeze([
  'en/code-promo-linebet-senegal',
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
