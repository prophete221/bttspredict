import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz'
const FR_URL = `${SITE_URL}/${SLUG}`
const EN_URL = `${SITE_URL}/en/${SLUG}`
const AR_URL = `${SITE_URL}/ar/${SLUG}`

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'fr').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'
  if (!isEnglish && locale !== 'ar') return {}
  const title = isEnglish ? '888Starz Promo Code btts221 · 300% Worldwide' : 'رمز 888Starz btts221 · 300% حول العالم'
  const description = isEnglish
    ? '888Starz promo code btts221: 300% worldwide, more cashback and weekly bonuses. 18+.'
    : 'رمز 888Starz الترويجي btts221: مكافأة 300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية. +18.'
  return {
    title,
    description,
    keywords: isEnglish
      ? ['888Starz promo code', 'btts221', '888Starz 300% worldwide']
      : ['رمز 888Starz الترويجي', 'btts221', '888Starz 300% حول العالم'],
    alternates: {
      canonical: isEnglish ? EN_URL : AR_URL,
      languages: { fr: FR_URL, en: EN_URL, ar: AR_URL, 'x-default': FR_URL },
    },
    robots: { index: true, follow: true },
  }
}

export default async function Localized888StarzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale === 'ar' ? 'ar' : 'en'
  const faqLd = buildPromoFaqJsonLd('888starz', lang)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <LocalizedPromoClient bookmaker="888starz" />
    </>
  )
}
