import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-1xbet'
const YEAR = new Date().getUTCFullYear()

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return {
    title: `1xbet Promo Code vipbtts: 300% + 100 Free Spins`,
    description: `1xbet promo code vipbtts: 300% bonus + 100 free spins, no wagering requirements. ${YEAR} sign-up guide, 18+.`,
    keywords: ['1xbet promo code', '1xbet promo code vipbtts', 'code vipbtts', '1xbet bonus 300', '1xbet welcome bonus', '1xbet 100 free spins', '1xbet apk', 'vipbtts'],
    alternates: {
      canonical: `${SITE_URL}/en/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  if (locale === 'ar') return {
    title: `رمز 1xbet الترويجي vipbtts: 300% + 100 لفة مجانية`,
    description: `رمز 1xbet الترويجي vipbtts: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة. دليل ${YEAR}، 18+.`,
    keywords: ['رمز 1xbet الترويجي', 'كود vipbtts', 'مكافأة 1xbet 300', '1xbet 100 لفة مجانية', '1xbet تسجيل', '1xbet apk', 'vipbtts'],
    alternates: {
      canonical: `${SITE_URL}/ar/${SLUG}`,
      languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` },
    },
    robots: { index: true, follow: true },
  }
  return {}
}
export default async function Localized1xbetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale === 'ar' ? 'ar' : 'en'
  const faqLd = buildPromoFaqJsonLd('1xbet', lang)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <LocalizedPromoClient bookmaker="1xbet" />
    </>
  )
}
