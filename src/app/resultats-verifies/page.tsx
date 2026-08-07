import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import ResultatsClient from './ResultatsClient'

export const metadata: Metadata = {
  title: 'Résultats Vérifiés — ROI & Profit | BTTSPredict',
  description: 'Tableau complet des pronostics vérifiés avec scores réels ESPN. ROI, yield, profit en unités, export CSV. Aucun prono modifié après publication.',
  alternates: { canonical: 'https://bttspredict.com/resultats-verifies' },
  openGraph: {
    title: 'Résultats Vérifiés — ROI & Profit | BTTSPredict',
    description: 'Tableau complet des pronostics vérifiés avec scores réels ESPN. ROI, yield, profit en unités, export CSV.',
    url: 'https://bttspredict.com/resultats-verifies',
    type: 'website',
  },
}

export default function ResultatsVerifiesPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Résultats Vérifiés — <span className="text-[#5146F5]">ROI & Profit</span>
            </h1>
            <p className="text-sm text-[#A5ABC5]">
              Tous les pronostics vérifiés avec scores réels ESPN. Aucun prono modifié ou supprimé après publication.
            </p>
          </div>
          <ResultatsClient />
          <div className="mt-8 p-4 rounded-xl bg-[#0D1630] border border-[#303861]">
            <p className="text-[11px] text-[#6B7194] leading-relaxed">
              <strong className="text-[#A5ABC5]">Règle d'intégrité :</strong> Aucun pronostic n'est modifié ou supprimé après publication.
              Chaque entrée contient la date, le match, le marché, la proba, le score final, le résultat et la source de vérification (ESPN).
              Cote moyenne utilisée pour le ROI: 1.75. Les performances passées ne garantissent pas les résultats futurs. 18+ — Jeu responsable.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
