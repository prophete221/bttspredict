import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ResultatsVerifiesPage from '@/app/resultats-verifies/page'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Verified prediction results | BTTSPredict', description: 'Publicly verified prediction results with dated data and transparent methodology.', alternates: { canonical: 'https://bttspredict.com/en/resultats-verifies' } }
  if (locale === 'ar') return { title: 'نتائج التوقعات الموثقة | BTTSPredict', description: 'نتائج توقعات موثقة وبيانات مؤرخة ومنهجية شفافة.', alternates: { canonical: 'https://bttspredict.com/ar/resultats-verifies' } }
  return {}
}

export default async function LocalizedResultatsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  return <ResultatsVerifiesPage />
}
