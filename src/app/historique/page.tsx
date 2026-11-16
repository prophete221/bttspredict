import type { Metadata } from 'next'
import HistoriquePageContent from './HistoriquePageContent'
import { getWinHistory } from './getWinHistory'
import { getArchiveSummary } from './getArchiveSummary'
import { frEnAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Historique vérifié — Nouveau suivi public',
  description: 'Historique public BTTSPredict : sélections conservées et résultats contrôlés après les matchs. Aucun résultat futur n’est garanti. 18+.',
  alternates: frEnAlternates('/historique', 'fr'),
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Historique vérifié',
    description: "Nouveau suivi public des pronostics vérifiés. Volume insuffisant pendant les premières semaines. Aucun résultat futur n'est garanti.",
    url: 'https://bttspredict.com/historique',
    type: 'website',
  },
}

export default function HistoriquePage() {
  return <HistoriquePageContent initialData={getWinHistory()} archiveSummary={getArchiveSummary()} />
}
