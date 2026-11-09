import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CompetitionIndexContent from '@/components/bttsbet/CompetitionIndexContent'
import { competitionIndexMeta } from '@/lib/competition-pages'
import { isLocale, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter((locale) => locale !== 'fr').map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || locale === 'fr') return {}
  return competitionIndexMeta(locale)
}

export default async function LocalizedCompetitionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale) || locale === 'fr') notFound()
  return <CompetitionIndexContent locale={locale as Locale} />
}
