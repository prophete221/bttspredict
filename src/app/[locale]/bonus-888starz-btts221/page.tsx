import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDakarDateString } from '@/lib/dakar-date'
import Btts221PromoClient from '@/components/bttsbet/Btts221PromoClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz-btts221'
const REVIEW_DATE = getDakarDateString()
const YEAR = Number(REVIEW_DATE.slice(0, 4))

type LocalizedLang = 'en' | 'ar'

function localizedJsonLd(lang: LocalizedLang) {
  const isArabic = lang === 'ar'
  const pageUrl = `${SITE_URL}/${lang}/${SLUG}`
  const text = isArabic ? {
    title: 'رمز 888Starz الترويجي btts221: عرض 150 لفة مجانية',
    description: 'رمز 888Starz الترويجي btts221: عرض معلن يتضمن 150 لفة مجانية وحد إيداع 1 دولار للتحقق حسب البلد والحساب والفترة. +18.',
    home: 'الرئيسية',
    name: 'رمز 888Starz btts221',
    steps: [
      ['فتح 888Starz', 'افتح رابط 888Starz الرسمي من هذه الصفحة.'],
      ['إدخال btts221', 'أنشئ حسابك وأدخل btts221 بأحرف صغيرة إذا كان الحقل متاحاً.'],
      ['التحقق من الشروط', 'تحقق من العرض الظاهر لبلدك قبل الإيداع.'],
      ['قراءة شروط المكافأة', 'اقرأ شروط اللفات المجانية والإيداع ومتطلبات المراهنة قبل التأكيد.'],
    ],
    faq: [
      ['ما هو الرمز الترويجي لـ 888Starz؟', 'الرمز المعروض في هذه الصفحة هو btts221 بأحرف صغيرة. تحقق من قبوله أثناء التسجيل.'],
      ['هل يمنح الرمز 150 لفة مجانية؟', 'تشير الحملة المعلنة إلى 150 لفة مجانية، لكن يجب تأكيد العرض على 888Starz حسب بلدك وحسابك والفترة.'],
      ['ما هو الحد الأدنى للإيداع؟', 'الحد الأدنى المعلن لهذه الحملة هو 1 دولار. تحقق من المبلغ الظاهر قبل إجراء أي معاملة.'],
      ['هل يعمل الرمز في كل البلدان؟', 'لا يوجد ضمان عام. قد تعتمد الأهلية على البلد والحساب والجهاز والقواعد المحلية للمشغل.'],
    ],
  } : {
    title: '888Starz promo code btts221: 150 free spins offer',
    description: '888Starz promo code btts221: announced 150 free spins and $1 minimum deposit offer to verify by country, account and period. 18+.',
    home: 'Home',
    name: '888Starz btts221 promo code',
    steps: [
      ['Open 888Starz', 'Open the official 888Starz link from this page.'],
      ['Enter btts221', 'Create your account and enter btts221 in lowercase if the field is available.'],
      ['Check the terms', 'Check the offer displayed for your country before depositing.'],
      ['Read the bonus rules', 'Read the free spins, deposit and wagering terms before confirming.'],
    ],
    faq: [
      ['What is the 888Starz promo code?', 'The code shown on this page is btts221 in lowercase. Check that it is accepted during registration.'],
      ['Does the code give 150 free spins?', 'The announced campaign mentions 150 free spins, but the offer must be confirmed on 888Starz for your country, account and period.'],
      ['What is the minimum deposit?', 'The announced minimum deposit is $1 for this campaign. Check the amount displayed before making any transaction.'],
      ['Does the code work everywhere?', 'Not guaranteed. Eligibility may depend on your country, account, device and the operator’s local rules.'],
    ],
  }
  return [
    { '@context': 'https://schema.org', '@type': 'Article', headline: text.title, description: text.description, url: pageUrl, datePublished: REVIEW_DATE, dateModified: REVIEW_DATE, author: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL }, publisher: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL }, mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: text.home, item: `${SITE_URL}/${lang}` }, { '@type': 'ListItem', position: 2, name: text.name, item: pageUrl }] },
    { '@context': 'https://schema.org', '@type': 'HowTo', name: text.name, description: text.description, totalTime: 'PT5M', step: text.steps.map(([name, stepText], index) => ({ '@type': 'HowToStep', position: index + 1, name, text: stepText })) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: text.faq.map(([name, answer]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ]
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'fr').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') {
    return {
      title: `888Starz promo code btts221: 150 free spins offer`,
      description: `888Starz promo code btts221: announced 150 free spins and $1 minimum deposit offer to verify by country, account and period. ${YEAR} guide, 18+.`,
      keywords: ['888starz btts221', '888starz promo code btts221', '888starz 150 free spins', '888starz bonus', '888starz promo code'],
      alternates: { canonical: `${SITE_URL}/en/${SLUG}`, languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` } },
      robots: { index: true, follow: true },
    }
  }
  if (locale === 'ar') {
    return {
      title: `رمز 888Starz btts221: عرض 150 لفة مجانية`,
      description: `رمز 888Starz الترويجي btts221: عرض معلن يتضمن 150 لفة مجانية وحد إيداع 1 دولار للتحقق حسب البلد والحساب والفترة. +18.`,
      keywords: ['888starz btts221', 'رمز 888starz btts221', 'مكافأة 888starz', 'لفات مجانية 888starz', 'رمز 888starz الترويجي'],
      alternates: { canonical: `${SITE_URL}/ar/${SLUG}`, languages: { fr: `${SITE_URL}/${SLUG}`, en: `${SITE_URL}/en/${SLUG}`, ar: `${SITE_URL}/ar/${SLUG}`, 'x-default': `${SITE_URL}/${SLUG}` } },
      robots: { index: true, follow: true },
    }
  }
  notFound()
}

export default async function LocalizedBtts221Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  const lang = locale as LocalizedLang
  return (
    <>
      {localizedJsonLd(lang).map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <Btts221PromoClient lang={lang} reviewDate={REVIEW_DATE} />
    </>
  )
}
