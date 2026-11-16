import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { frEnAlternates } from '@/lib/seo'
import StatistiquesPage from '@/app/statistiques/page'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/statistiques')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Statistics', description: 'Verified prediction statistics from BTTSPredict.', alternates: frEnAlternates('/statistiques', 'en') }
  return {}
}

export default async function LocalizedStatistiquesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'en') notFound()
  return <StatistiquesPage />
}
