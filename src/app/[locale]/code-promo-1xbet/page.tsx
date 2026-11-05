import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-1xbet'
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
  const title = isEnglish ? '1xBet Promo Code vipbtts · 300% Worldwide' : 'رمز 1xBet vipbtts · 300% حول العالم'
  const description = isEnglish
    ? '1xBet promo code vipbtts: 300% worldwide, more cashback and weekly bonuses. 18+.'
    : 'رمز 1xBet الترويجي vipbtts: مكافأة 300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية. +18.'
  return {
    title,
    description,
    keywords: isEnglish
      ? ['1xBet promo code', 'vipbtts', '1xBet 300% worldwide']
      : ['رمز 1xBet الترويجي', 'vipbtts', '1xBet 300% حول العالم'],
    alternates: {
      canonical: isEnglish ? EN_URL : AR_URL,
      languages: { fr: FR_URL, en: EN_URL, ar: AR_URL, 'x-default': FR_URL },
    },
    robots: { index: true, follow: true },
  }
}

export default async function Localized1xbetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale === 'ar' ? 'ar' : 'en'
  const faqLd = buildPromoFaqJsonLd('1xbet', lang)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <LocalizedPromoClient bookmaker="1xbet" />
    </>
  )
}
