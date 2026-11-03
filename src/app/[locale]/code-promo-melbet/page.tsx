import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BookmakerPromoPage from '@/components/promo/BookmakerPromoPage'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

/* Page code promo Melbet — EN / AR (refonte 2026-11, client unifié).
   Aucun montant inventé : l'offre Melbet est décrite génériquement. */

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-melbet'
const YEAR = new Date().getUTCFullYear()

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return {
    title: 'Melbet Promo Code Bttswin: Welcome Bonus',
    description: `Melbet promo code Bttswin: activate the Melbet welcome bonus from a €1 deposit. Manually verified code, ${YEAR} sign-up guide, 18+.`,
    keywords: ['melbet promo code', 'bttswin', 'melbet bonus', 'melbet welcome offer', 'melbet apk'],
    alternates: {
      canonical: `${SITE_URL}/en/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  if (locale === 'ar') return {
    title: `رمز Melbet الترويجي Bttswin: مكافأة الترحيب`,
    description: `رمز Melbet الترويجي Bttswin: فعّل مكافأة الترحيب من Melbet بدءاً من إيداع 1 يورو. رمز موثق يدوياً، دليل ${YEAR}، 18+.`,
    keywords: ['رمز Melbet الترويجي', 'Bttswin', 'مكافأة Melbet', 'تطبيق Melbet'],
    alternates: {
      canonical: `${SITE_URL}/ar/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  return {}
}

export default async function LocalizedMelbetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  return <BookmakerPromoPage bookmaker="melbet" initialLocale={locale as Locale} />
}
