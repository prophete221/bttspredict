import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedMethodologieClient from '@/app/methodologie/LocalizedMethodologieClient'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Methodology | BTTSPredict', description: 'Transparent BTTS and Over 2.5 methodology, data sources and limitations.', alternates: { canonical: 'https://bttspredict.com/en/methodologie' } }
  if (locale === 'ar') return { title: 'منهجية BTTSPredict', description: 'منهجية شفافة لتوقعات BTTS وOver 2.5 ومصادر البيانات والحدود.', alternates: { canonical: 'https://bttspredict.com/ar/methodologie' } }
  return {}
}

export default async function LocalizedMethodologiePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SUPPORTED_LOCALES.includes(locale as Locale) || locale === 'fr') notFound()
  return <LocalizedMethodologieClient />
}
