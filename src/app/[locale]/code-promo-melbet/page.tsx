import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-melbet'
const YEAR = new Date().getUTCFullYear()

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return {
    title: `Melbet Promo Code Bttswin: 300% + 100 Free Spins`,
    description: `Melbet promo code Bttswin: 300% bonus + 100 free spins, no wagering requirements. ${YEAR} sign-up guide, 18+.`,
    keywords: ['melbet promo code', 'melbet promo code Bttswin', 'code bttswin', 'melbet 300 bonus', 'melbet welcome bonus', 'melbet 100 free spins', 'melbet apk', 'bttswin'],
    alternates: {
      canonical: `${SITE_URL}/en/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  if (locale === 'ar') return {
    title: `رمز Melbet الترويجي Bttswin: 300% + 100 لفة مجانية`,
    description: `رمز Melbet الترويجي Bttswin: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة. دليل ${YEAR}، 18+.`,
    keywords: ['رمز Melbet الترويجي', 'كود Bttswin', 'مكافأة Melbet 300', 'Melbet 100 لفة مجانية', 'Melbet تسجيل', 'Melbet apk', 'Bttswin'],
    alternates: {
      canonical: `${SITE_URL}/ar/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  return {}
}
export default async function LocalizedMelbetPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedPromoClient bookmaker="melbet" /> }
