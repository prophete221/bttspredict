import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale } from '@/lib/i18n'
import CorrectScorePage from '@/app/ai-correct-score-predictions/page'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') return {}
  const locale = value as Locale
  const url = `https://bttspredict.com/${locale}/ai-correct-score-predictions`
  const title = locale === 'ar' ? 'توقعات النتيجة الدقيقة بالذكاء الاصطناعي | BTTSPredict' : 'AI Correct Score Predictions — Exact Scores'
  const description = locale === 'ar' ? 'احتمالات النتائج الدقيقة المحسوبة بنموذج بواسون. تقديرات إحصائية وليست ضمانات. 18+.' : 'Exact-score probabilities calculated with a Poisson model. Statistical estimates, not guarantees. 18+.'
  return {
    title, description,
    alternates: { canonical: url, languages: { 'fr-SN': 'https://bttspredict.com/ai-correct-score-predictions', en: 'https://bttspredict.com/en/ai-correct-score-predictions', ar: 'https://bttspredict.com/ar/ai-correct-score-predictions', 'x-default': 'https://bttspredict.com/ai-correct-score-predictions' } },
    openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang },
  }
}

export default async function LocalizedCorrectScorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') notFound()
  return <CorrectScorePage />
}
