import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BookmakerPromoPage from '@/components/promo/BookmakerPromoPage'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

/* Page code promo 1xBet — EN / AR (refonte 2026-11, client unifié) */

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-1xbet'
const YEAR = new Date().getUTCFullYear()

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return {
    title: '1xBet Promo Code Vipbtts: 300% + 100 Spins',
    description: `1xBet promo code Vipbtts: 300% bonus + 100 free spins, no wagering requirements, from a €1 deposit. ${YEAR} sign-up guide, 18+.`,
    keywords: ['1xbet promo code', 'vipbtts', '1xbet bonus', '1xbet welcome offer', '1xbet apk', '1xbet free spins'],
    alternates: {
      canonical: `${SITE_URL}/en/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  if (locale === 'ar') return {
    title: `رمز 1xBet الترويجي Vipbtts: 300% + 100 لفة مجانية`,
    description: `رمز 1xBet الترويجي Vipbtts: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة، بدءاً من إيداع 1 يورو. دليل ${YEAR}، 18+.`,
    keywords: ['رمز 1xBet الترويجي', 'Vipbtts', 'مكافأة 1xBet', 'تطبيق 1xBet'],
    alternates: {
      canonical: `${SITE_URL}/ar/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  return {}
}

export default async function Localized1xBetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  return <BookmakerPromoPage bookmaker="1xbet" initialLocale={locale as Locale} />
}
