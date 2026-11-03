import type { Metadata } from 'next'
import HistoriquePageContent from './HistoriquePageContent'

export const metadata: Metadata = {
  title: 'Historique vérifié — Nouveau suivi public',
  description: "Historique vérifié BTTSPredict : chaque pronostic enregistré, horodaté et évalué après le résultat officiel. 18+.",
  alternates: { canonical: 'https://bttspredict.com/historique' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Historique vérifié',
    description: "Nouveau suivi public des pronostics vérifiés. Volume insuffisant pendant les premières semaines. Aucun résultat futur n'est garanti.",
    url: 'https://bttspredict.com/historique',
    type: 'website',
  },
}

export default function HistoriquePage() {
  return <HistoriquePageContent h1="Historique vérifié — BTTSPredict" />
}
