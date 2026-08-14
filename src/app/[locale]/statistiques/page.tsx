import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StatistiquesPage from '@/app/statistiques/page'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Statistics | BTTSPredict', description: 'Verified prediction statistics from BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/en/statistiques' } }
  if (locale === 'ar') return { title: 'إحصائيات التوقعات | BTTSPredict', description: 'إحصائيات توقعات موثقة من BTTSPredict.', alternates: { canonical: 'https://bttspredict.com/ar/statistiques' } }
  return {}
}

export default async function LocalizedStatistiquesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  return <StatistiquesPage />
}
