import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HistoriquePageContent from '@/app/historique/HistoriquePageContent'
import { getWinHistory } from '@/app/historique/getWinHistory'
import { getArchiveSummary } from '@/app/historique/getArchiveSummary'
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { frEnAlternates } from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/historique')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') return { title: 'Verified history — New public tracking', description: 'BTTSPredict public history: recorded picks and results checked after matches. No future result is guaranteed. 18+.', alternates: frEnAlternates('/historique', 'en') }
  return {}
}

export default async function LocalizedHistoriquePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'en') notFound()
  return <HistoriquePageContent initialData={getWinHistory()} archiveSummary={getArchiveSummary()} />
}
