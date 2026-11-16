export const ARABIC_PROMO_PATHS = [
  '/code-promo-1xbet',
  '/code-promo-linebet-senegal',
  '/code-promo-melbet',
  '/bonus-888starz',
  '/bonus-888starz-btts221',
] as const

const ARABIC_PROMO_PATH_SET = new Set<string>(ARABIC_PROMO_PATHS)

export function isArabicPromoPath(pathname: string | null | undefined): boolean {
  const cleanPath = ((pathname || '/').split(/[?#]/, 1)[0] || '/').replace(/\/+$/, '') || '/'
  const withoutLocale = cleanPath.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
  return ARABIC_PROMO_PATH_SET.has(withoutLocale)
}
