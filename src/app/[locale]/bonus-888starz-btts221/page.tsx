import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Btts221PromoClient from '@/components/bttsbet/Btts221PromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz-btts221'
const FR_URL = `${SITE_URL}/${SLUG}`
const EN_URL = `${SITE_URL}/en/${SLUG}`
const AR_URL = `${SITE_URL}/ar/${SLUG}`
type LocalizedLang = 'en' | 'ar'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'fr').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEnglish = locale === 'en'
  if (!isEnglish && locale !== 'ar') notFound()
  const title = isEnglish ? '888Starz Promo Code btts221 · 300% Worldwide' : 'رمز 888Starz btts221 · 300% حول العالم'
  const description = isEnglish
    ? '888Starz promo code btts221: 300% worldwide, more cashback and weekly bonuses. 18+.'
    : 'رمز 888Starz الترويجي btts221: مكافأة 300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية. +18.'
  return {
    title,
    description,
    keywords: isEnglish
      ? ['888Starz btts221', '888Starz promo code', '888Starz 300% worldwide']
      : ['888Starz btts221', 'رمز 888Starz الترويجي', '888Starz 300% حول العالم'],
    alternates: {
      canonical: isEnglish ? EN_URL : AR_URL,
      languages: { fr: FR_URL, en: EN_URL, ar: AR_URL, 'x-default': FR_URL },
    },
    robots: { index: true, follow: true },
  }
}

function localizedStructuredData(lang: LocalizedLang) {
  const pageUrl = lang === 'en' ? EN_URL : AR_URL
  const title = lang === 'en' ? '888Starz btts221 · 300% Worldwide' : '888Starz btts221 · 300% حول العالم'
  const description = lang === 'en'
    ? '888Starz promo code btts221: 300% worldwide, more cashback and weekly bonuses.'
    : 'رمز 888Starz الترويجي btts221: مكافأة 300% حول العالم، مع استرداد نقدي أكبر ومكافآت أسبوعية.'
  const faq = buildPromoFaqJsonLd('888starz', lang)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url: pageUrl,
      author: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
      publisher: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
      mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'en' ? 'Home' : 'الرئيسية', item: lang === 'en' ? `${SITE_URL}/en` : `${SITE_URL}/ar` },
        { '@type': 'ListItem', position: 2, name: title, item: pageUrl },
      ],
    },
    faq,
  ]
}

export default async function LocalizedBtts221Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale as LocalizedLang
  return (
    <>
      {localizedStructuredData(lang).map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <Btts221PromoClient lang={lang} />
    </>
  )
}
