import type { Metadata } from 'next'
import CompetitionIndexContent from '@/components/bttsbet/CompetitionIndexContent'
import { competitionIndexMeta } from '@/lib/competition-pages'

export const metadata: Metadata = competitionIndexMeta('fr')

export default function CompetitionsPage() {
  return <CompetitionIndexContent locale="fr" />
}
