import type { Metadata } from 'next'
import ResultatsLocalizedShell from './ResultatsLocalizedShell'
import { getWinHistory } from '../historique/getWinHistory'
import { getArchiveSummary } from '../historique/getArchiveSummary'
import { frEnAlternates } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Résultats vérifiés des pronostics',
  description: "Consultez l'historique des pronostics publiés avant les matchs et leurs résultats vérifiés après coup. Données datées et méthode transparente.",
  alternates: frEnAlternates('/resultats-verifies', 'fr'),
  openGraph: {
    title: 'Résultats vérifiés des pronostics | BTTSPredict',
    description: "Consultez l'historique des pronostics publiés avant les matchs et leurs résultats vérifiés après coup. Données datées et méthode transparente.",
    url: 'https://bttspredict.com/resultats-verifies',
    type: 'website',
  },
}

export default function ResultatsVerifiesPage() {
  return <ResultatsLocalizedShell initialData={getWinHistory()} archiveSummary={getArchiveSummary()} />
}
