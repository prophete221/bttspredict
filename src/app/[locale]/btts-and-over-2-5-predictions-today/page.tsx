import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedCombinedPredictionsClient from '@/components/bttsbet/LocalizedCombinedPredictionsClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'BTTS and Over 2.5 Predictions Today | BTTSPredict', description: 'Combined BTTS and Over 2.5 predictions for international matches.', alternates: { canonical: 'https://bttspredict.com/en/btts-and-over-2-5-predictions-today' } }
  if (locale === 'ar') return { title: 'توقعات BTTS وأكثر من 2.5 اليوم | BTTSPredict', description: 'توقعات مجمعة للمباريات الدولية.', alternates: { canonical: 'https://bttspredict.com/ar/btts-and-over-2-5-predictions-today' } }
  return {}
}
export default async function LocalizedCombinedPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedCombinedPredictionsClient /> }
