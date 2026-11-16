import { ARABIC_PROMO_PATHS, isArabicPromoPath } from './arabic-promo-routes'
import { SUPPORTED_LOCALES, type Locale } from './i18n'

type LocalizedStaticLocale = Exclude<Locale, 'fr'>
const ARABIC_PROMO_PATH_SET = new Set<string>(ARABIC_PROMO_PATHS)

function normalizePathname(pathname: string | null | undefined): string {
  const cleanPath = ((pathname || '/').split(/[?#]/, 1)[0] || '/').replace(/\/+$/, '') || '/'
  return cleanPath.replace(/^\/(?:en|ar)(?=\/|$)/, '') || '/'
}

/** Arabic is selectable only on the five explicitly allowed promotional routes. */
export function getAvailableLocales(pathname: string | null | undefined): Locale[] {
  return isArabicPromoPath(pathname)
    ? [...SUPPORTED_LOCALES]
    : SUPPORTED_LOCALES.filter((locale): locale is Locale => locale !== 'ar')
}

/** Locale segments actually emitted by generateStaticParams for a leaf route. */
export function getStaticLocalesForPath(pathname: string): LocalizedStaticLocale[] {
  return ARABIC_PROMO_PATH_SET.has(normalizePathname(pathname)) ? ['en', 'ar'] : ['en']
}

/** Standard generateStaticParams result for a non-nested localized route. */
export function getStaticLocaleParams(pathname: string): Array<{ locale: LocalizedStaticLocale }> {
  return getStaticLocalesForPath(pathname).map((locale) => ({ locale }))
}

/** VIP content and navigation are available in French and English only. */
export function isVipAvailable(locale: Locale): boolean {
  return locale !== 'ar'
}
