import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CompetitionIndexContent from '@/components/bttsbet/CompetitionIndexContent'
import { competitionIndexMeta } from '@/lib/competition-pages'
import { isLocale, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { getInitialCompetitionFeed } from '@/lib/competition-static-feed'

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticLocaleParams('/competitions')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || locale === 'fr') return {}
  return competitionIndexMeta(locale)
}

export default async function LocalizedCompetitionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || locale === 'fr') notFound()
  return <CompetitionIndexContent locale={locale as Locale} initialFeed={getInitialCompetitionFeed()} />
}
