import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-1xbet'
const FR_URL = `${SITE_URL}/${SLUG}`
const EN_URL = `${SITE_URL}/en/${SLUG}`
const AR_URL = `${SITE_URL}/ar/${SLUG}`

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/code-promo-1xbet')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'
  if (!isEnglish && locale !== 'ar') return {}
  const title = isEnglish ? '1xBet Promo Code vipbtts: 300% + Cashback' : 'برومو كود 1xBet vipbtts: مكافأة 300% واسترداد نقدي'
  const description = isEnglish
    ? '1xBet promo code vipbtts: 300% deposit bonus, cashback and weekly bonuses. This is not a verified free-bet or no-deposit offer; check your account terms before depositing. 18+.'
    : 'برومو كود 1xBet هو vipbtts: مكافأة إيداع 300% واسترداد نقدي ومكافآت أسبوعية. ليس رهانًا مجانيًا مؤكدًا أو عرضًا دون إيداع؛ تحقق من الشروط قبل الإيداع. +18.'
  return {
    title,
    description,
    keywords: isEnglish
      ? ['1xBet promo code', '1xBet promo code vipbtts', 'vipbtts', '1xBet 300% worldwide']
      : ['رمز 1xBet الترويجي', 'رمز 1xBet vipbtts', 'vipbtts', '1xBet 300% حول العالم'],
    alternates: {
      canonical: isEnglish ? EN_URL : AR_URL,
      languages: { fr: FR_URL, en: EN_URL, ar: AR_URL, 'x-default': FR_URL },
    },
    openGraph: {
      title,
      description,
      url: isEnglish ? EN_URL : AR_URL,
      siteName: 'BTTSPredict',
      type: 'article',
      locale: isEnglish ? 'en_US' : 'ar',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
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
      <PromoVerificationGuide bookmaker="1xbet" lang={lang} />
    </>
  )
}
