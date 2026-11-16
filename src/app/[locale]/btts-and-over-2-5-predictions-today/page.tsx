import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { englishOnlyAlternates } from '@/lib/seo'
import LocalizedCombinedPredictionsClient from '@/components/bttsbet/LocalizedCombinedPredictionsClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/btts-and-over-2-5-predictions-today')
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'BTTS and Over 2.5 Predictions Today', description: 'Combined BTTS and Over 2.5 predictions for international matches.', alternates: englishOnlyAlternates('/btts-and-over-2-5-predictions-today') }
  return {}
}

export default async function LocalizedCombinedPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (locale !== 'en') notFound(); return <LocalizedCombinedPredictionsClient /> }
