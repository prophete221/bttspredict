import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import ResultatsClient from './ResultatsClient'

export const metadata: Metadata = {
  title: 'Résultats des pronostics BTTS et Over 2,5 vérifiés',
  description: "Consultez l'historique des pronostics publiés avant les matchs et leurs résultats vérifiés après coup. Données datées et méthode transparente.",
  alternates: { canonical: 'https://bttspredict.com/resultats-verifies' },
  openGraph: {
    title: 'Résultats des pronostics BTTS et Over 2,5 vérifiés',
    description: "Consultez l'historique des pronostics publiés avant les matchs et leurs résultats vérifiés après coup. Données datées et méthode transparente.",
    url: 'https://bttspredict.com/resultats-verifies',
    type: 'website',
  },
}

// CORRECTION 7: Pre-render win-history data at build time
// Instead of client-side fetch, read the JSON at build time and pass as prop
function getWinHistory() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'win-history.json')
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default function ResultatsVerifiesPage() {
  const winHistory = getWinHistory()

  return (
    <div className="min-h-screen bg-[#131314] flex flex-col text-[#f0f4f9]">
      <Navbar />
      <main id="main-content" className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Résultats vérifiés des pronostics
            </h1>
            <p className="text-sm text-[#9ca3af]">
              Tous les pronostics vérifiés avec scores réels ESPN. Aucun prono modifié ou supprimé après publication.
            </p>
          </div>
          <ResultatsClient initialData={winHistory} />
          <div className="mt-8 p-4 rounded-xl bg-[#1e1f20] border border-[#2d2f31]">
            <p className="text-[11px] text-[#9ca3af] leading-relaxed">
              <strong className="text-[#9ca3af]">Règle d&apos;intégrité :</strong> Aucun pronostic n&apos;est modifié ou supprimé après publication.
              Chaque entrée contient la date, le match, le marché, la proba, le score final, le résultat et la source de vérification (ESPN).
              Cote moyenne utilisée pour le ROI: 1.75. Les performances passées ne garantissent pas les résultats futurs. 18+ — Jeu responsable.
            </p>
          </div>
        </div>
            <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
