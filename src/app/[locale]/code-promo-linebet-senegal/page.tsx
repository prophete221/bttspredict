import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-linebet-senegal'
const FR_URL = `${SITE_URL}/${SLUG}`
const EN_URL = `${SITE_URL}/en/${SLUG}`
const AR_URL = `${SITE_URL}/ar/${SLUG}`

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/code-promo-linebet-senegal')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'
  if (!isEnglish && locale !== 'ar') return {}
  const title = isEnglish ? 'Linebet Promo Code VISION221: Worldwide 300% + Cashback' : 'برومو كود Linebet VISION221: مكافأة 300% واسترداد نقدي'
  const description = isEnglish
    ? 'Linebet promo code VISION221: 300% deposit bonus, cashback and weekly bonuses. Check country availability and account terms before depositing. 18+.'
    : 'برومو كود Linebet هو VISION221: مكافأة إيداع 300% واسترداد نقدي ومكافآت أسبوعية. تحقق من التوافر وشروط بلدك وحسابك قبل الإيداع. +18.'
  return {
    title,
    description,
    keywords: isEnglish
      ? ['Linebet promo code', 'Linebet promo code VISION221', 'Linebet Senegal promo code', 'VISION221', 'Linebet 300% worldwide']
      : ['رمز Linebet الترويجي', 'رمز Linebet VISION221', 'VISION221', 'Linebet 300% حول العالم'],
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

export default async function LocalizedLinebetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale === 'ar' ? 'ar' : 'en'
  const faqLd = buildPromoFaqJsonLd('linebet', lang)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <LocalizedPromoClient bookmaker="linebet" />
      <PromoVerificationGuide bookmaker="linebet" lang={lang} />
    </>
  )
}
