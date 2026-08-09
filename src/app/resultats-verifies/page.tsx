import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import ResultatsClient from './ResultatsClient'

export const metadata: Metadata = {
  title: 'Historique Vérifié — Matchs • Preuves ESPN | BTTSPredict',
  description: 'Tableau complet des pronostics vérifiés avec scores réels ESPN. Taux, Gold Picks, tendance 30j, export CSV. Aucun prono modifié après publication.',
  alternates: { canonical: 'https://bttspredict.com/resultats-verifies' },
  openGraph: {
    title: 'Historique Vérifié — Matchs • Preuves ESPN | BTTSPredict',
    description: 'Tableau complet des pronostics vérifiés avec scores réels ESPN. Taux, Gold Picks, tendance 30j, export CSV.',
    url: 'https://bttspredict.com/resultats-verifies',
    type: 'website',
  },
}

export default function ResultatsVerifiesPage() {
  return (
    <div className="min-h-screen bg-[#070A14] flex flex-col text-[#F1F5F9]">
      <Navbar />
      <main id="main-content" className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Historique Vérifié — <span className="text-[#D4AF37]">Preuves ESPN</span>
            </h1>
            <p className="text-sm text-[#94A3B8]">
              Tous les pronostics vérifiés avec scores réels ESPN. Aucun prono modifié ou supprimé après publication.
            </p>
          </div>
          <ResultatsClient />
          <div className="mt-8 p-4 rounded-xl bg-[#111827] border border-[#1F2937]">
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              <strong className="text-[#94A3B8]">Règle d'intégrité :</strong> Aucun pronostic n'est modifié ou supprimé après publication.
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
