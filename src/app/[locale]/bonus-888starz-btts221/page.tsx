import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Btts221PromoClient from '@/components/bttsbet/Btts221PromoClient'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'
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
  const title = isEnglish ? 'How to Use 888Starz Promo Code btts221' : 'كيفية استخدام الرمز الترويجي 888Starz btts221'
  const description = isEnglish
    ? 'Learn where to enter 888Starz code btts221 and how to check whether the offer is applied. Confirm eligibility and terms with 888Starz. 18+.'
    : 'تعرف على مكان إدخال الرمز 888Starz btts221 وكيفية التحقق من تطبيق العرض. تحقق من الأهلية والشروط لدى 888Starz. للبالغين 18+.'
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
  const title = lang === 'en' ? '888Starz btts221 Promo Code for a 300% Worldwide Bonus' : 'رمز 888Starz btts221 الترويجي وعرض عالمي بنسبة 300%'
  const description = lang === 'en'
    ? '888Starz code btts221 works worldwide. The offer includes a 300% deposit bonus, cashback and weekly bonuses. 18+. Please gamble responsibly.'
    : 'يعمل رمز 888Starz btts221 حول العالم. يشمل العرض مكافأة إيداع بنسبة 300%، واستردادًا نقديًا ومكافآت أسبوعية. للبالغين 18+، والعب بمسؤولية.'
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
      {lang === 'en' && <PromoVerificationGuide bookmaker="888starz" lang="en" variant="code" />}
    </>
  )
}
