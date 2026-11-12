import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedCombinedPredictionsClient from '@/components/bttsbet/LocalizedCombinedPredictionsClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() { return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') {
    const title = 'BTTS and Over 2.5 Predictions Today'
    const description = 'BTTS (GG) and Over 2.5 predictions today, with match stats and tracked results. No forecast is certain; review the analysis. 18+.'
    const seoDescription = description
      .replace(
        'BTTS (GG) and Over 2.5 predictions today, with match stats and tracked results.',
        'Search query: sure btts and over 2.5 today. BTTS (GG) and Over 2.5 predictions, with match stats and tracked results.',
      )
      .replace('No forecast is certain; review the analysis.', 'No forecast is guaranteed.')
    const url = 'https://bttspredict.com/en/btts-and-over-2-5-predictions-today'
    return {
      title,
      description: seoDescription,
      alternates: { canonical: url },
      openGraph: { title, description: seoDescription, url, siteName: 'BTTSPredict', type: 'website', locale: 'en', images: ['/og-image.png'] },
      twitter: { card: 'summary_large_image' as const, title, description: seoDescription, images: ['/og-image.png'] },
    }
  }
  if (locale === 'ar') return { title: 'توقعات BTTS وأكثر من 2.5 اليوم', description: 'توقعات مجمعة للمباريات الدولية.', alternates: { canonical: 'https://bttspredict.com/ar/btts-and-over-2-5-predictions-today' } }
  return {}
}
export default async function LocalizedCombinedPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound(); return <LocalizedCombinedPredictionsClient /> }
