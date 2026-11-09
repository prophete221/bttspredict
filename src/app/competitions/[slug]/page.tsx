import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CompetitionPageContent from '@/components/bttsbet/CompetitionPageContent'
import { COMPETITION_SLUGS, competitionMeta, getCompetitionPage } from '@/lib/competition-pages'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return COMPETITION_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return competitionMeta(slug, 'fr') || { robots: { index: false, follow: false } }
}

export default async function CompetitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const competition = getCompetitionPage(slug)
  if (!competition) notFound()
  return <CompetitionPageContent competition={competition} locale="fr" />
}
