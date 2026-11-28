import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz'
const FR_URL = `${SITE_URL}/${SLUG}`
const EN_URL = `${SITE_URL}/en/${SLUG}`
const AR_URL = `${SITE_URL}/ar/${SLUG}`

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/bonus-888starz')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'
  if (!isEnglish && locale !== 'ar') return {}
  const title = isEnglish ? '888Starz Promo Code btts221: 300% + Cashback' : 'رمز 888Starz btts221: مكافأة 300% واسترداد نقدي'
  const description = isEnglish
    ? '888Starz promo code btts221: copy the code, follow the steps and confirm that the offer appears in your account before depositing. 18+.'
    : 'برومو كود 888Starz هو btts221. انسخ الرمز واتبع الخطوات للتحقق من ظهوره في حسابك ومراجعة شروط العرض قبل الإيداع. +18.'
  return {
    title,
    description,
    keywords: isEnglish
      ? ['888Starz promo code', '888Starz promo code btts221', 'btts221', '888Starz 300% worldwide']
      : ['رمز 888Starz الترويجي', 'رمز 888Starz btts221', 'btts221', '888Starz 300% حول العالم'],
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

export default async function Localized888StarzPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale === 'ar' ? 'ar' : 'en'
  const faqLd = buildPromoFaqJsonLd('888starz', lang)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <LocalizedPromoClient bookmaker="888starz" />
      <PromoVerificationGuide bookmaker="888starz" lang={lang} variant="offer" />
    </>
  )
}
