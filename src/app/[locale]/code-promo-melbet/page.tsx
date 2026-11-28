import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPromoClient from '@/components/bttsbet/LocalizedPromoClient'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-melbet'
const FR_URL = `${SITE_URL}/${SLUG}`
const EN_URL = `${SITE_URL}/en/${SLUG}`
const AR_URL = `${SITE_URL}/ar/${SLUG}`

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/code-promo-melbet')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'
  if (!isEnglish && locale !== 'ar') return {}
  const title = isEnglish ? 'Melbet Promo Code Bttswin: 300% Bonus + Cashback' : 'برومو كود Melbet Bttswin: مكافأة 300% واسترداد نقدي'
  const description = isEnglish
    ? 'Copy Bttswin: 300% deposit bonus, cashback and weekly bonuses. Learn how to use the Melbet code and check the current terms. 18+.'
    : 'انسخ Bttswin: مكافأة إيداع 300% واسترداد نقدي ومكافآت أسبوعية. تعرّف على طريقة استخدام الرمز وشروط Melbet. للبالغين 18+.'
  return {
    title,
    description,
    keywords: isEnglish
      ? ['Melbet promo code', 'Melbet promo code Bttswin', 'Bttswin', 'Melbet cashback 300%']
      : ['رمز Melbet الترويجي', 'رمز Melbet Bttswin', 'Bttswin', 'Melbet 300% استرداد نقدي'],
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

export default async function LocalizedMelbetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale === 'ar' ? 'ar' : 'en'
  const faqLd = buildPromoFaqJsonLd('melbet', lang)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <LocalizedPromoClient bookmaker="melbet" />
      <PromoVerificationGuide bookmaker="melbet" lang={lang} />
    </>
  )
}
