import type { Metadata } from 'next'
import CompetitionIndexContent from '@/components/bttsbet/CompetitionIndexContent'
import { competitionIndexMeta } from '@/lib/competition-pages'
import { getInitialCompetitionFeed } from '@/lib/competition-static-feed'

export const metadata: Metadata = competitionIndexMeta('fr')

export default function CompetitionsPage() {
  return <CompetitionIndexContent locale="fr" initialFeed={getInitialCompetitionFeed()} />
}
