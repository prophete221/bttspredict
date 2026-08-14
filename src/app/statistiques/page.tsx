import type { Metadata } from 'next'
import StatistiquesClient from './StatistiquesClient'

export const metadata: Metadata = {
  title: 'Statistiques — BTTSPredict',
  description: "Les statistiques détaillées seront affichées lorsque suffisamment de données vérifiées seront disponibles. Aucune donnée n'est inventée.",
  alternates: { canonical: 'https://bttspredict.com/statistiques' },
}

export default function StatistiquesPage() {
  return <StatistiquesClient />
}
