import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale } from '@/lib/i18n'
import CorrectScorePage from '@/app/ai-correct-score-predictions/page'

export const dynamicParams = false
export function generateStaticParams() {
  return getStaticLocaleParams('/ai-correct-score-predictions')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value !== 'en') return {}
  const locale = value as Locale
  const url = `https://bttspredict.com/${locale}/ai-correct-score-predictions`
  const title = 'AI Correct Score Predictions — Exact Scores'
  const description = 'Correct-score picks appear only after passing the publication checks. No local calculation or Poisson model is used. 18+.'
  return {
    title, description,
    alternates: { canonical: url, languages: { fr: 'https://bttspredict.com/ai-correct-score-predictions', en: 'https://bttspredict.com/en/ai-correct-score-predictions', 'x-default': 'https://bttspredict.com/ai-correct-score-predictions' } },
    openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang },
  }
}

export default async function LocalizedCorrectScorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  if (!isLocale(value) || value !== 'en') notFound()
  return <CorrectScorePage />
}
