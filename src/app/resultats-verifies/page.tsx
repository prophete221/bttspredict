import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import ResultatsLocalizedShell from './ResultatsLocalizedShell'

export const metadata: Metadata = {
  title: 'Résultats vérifiés des pronostics | BTTSPredict',
  description: "Consultez l'historique des pronostics publiés avant les matchs et leurs résultats vérifiés après coup. Données datées et méthode transparente.",
  alternates: { canonical: 'https://bttspredict.com/resultats-verifies' },
  openGraph: {
    title: 'Résultats vérifiés des pronostics | BTTSPredict',
    description: "Consultez l'historique des pronostics publiés avant les matchs et leurs résultats vérifiés après coup. Données datées et méthode transparente.",
    url: 'https://bttspredict.com/resultats-verifies',
    type: 'website',
  },
}

function getWinHistory() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'win-history.json')
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

export default function ResultatsVerifiesPage() {
  return <ResultatsLocalizedShell initialData={getWinHistory()} />
}
