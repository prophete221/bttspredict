import type { Metadata } from 'next'
import StatistiquesClient from './StatistiquesClient'

export const metadata: Metadata = {
  title: 'Statistiques',
  description: "Statistiques vérifiées du suivi public : taux avec dénominateurs explicites, évolution des résultats, répartition par marché et par compétition. Aucune donnée inventée, aucune projection.",
  alternates: { canonical: 'https://bttspredict.com/statistiques' },
}

export default function StatistiquesPage() {
  return <StatistiquesClient />
}
