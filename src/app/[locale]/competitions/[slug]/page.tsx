import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CompetitionPageContent from '@/components/bttsbet/CompetitionPageContent'
import { COMPETITION_SLUGS, competitionMeta, getCompetitionPage } from '@/lib/competition-pages'
import { isLocale, type Locale } from '@/lib/i18n'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return (['en', 'ar'] as const).flatMap((locale) => COMPETITION_SLUGS.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale) || locale === 'fr') return { robots: { index: false, follow: false } }
  return competitionMeta(slug, locale) || { robots: { index: false, follow: false } }
}

export default async function LocalizedCompetitionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale) || locale === 'fr') notFound()
  const competition = getCompetitionPage(slug)
  if (!competition) notFound()
  return <CompetitionPageContent competition={competition} locale={locale as Locale} />
}
