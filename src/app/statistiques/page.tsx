import type { Metadata } from 'next'
import StatistiquesClient from './StatistiquesClient'
import { getWinHistory } from '../historique/getWinHistory'
import { getArchiveSummary } from '../historique/getArchiveSummary'
import { frEnAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Statistiques',
  description: "Statistiques vérifiées du suivi public : taux avec dénominateurs explicites, évolution des résultats, répartition par marché et par compétition. Aucune donnée inventée, aucune projection.",
  alternates: frEnAlternates('/statistiques', 'fr'),
}

export default function StatistiquesPage() {
  return <StatistiquesClient initialData={getWinHistory()} archiveSummary={getArchiveSummary()} />
}
