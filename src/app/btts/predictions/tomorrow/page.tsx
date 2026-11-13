import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BTTS Predictions Tomorrow — Pronostics demain',
  description: "Aperçu des pronostics BTTS de demain. Sélection quotidienne par moteur IA. 18+.",
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/tomorrow' },
  robots: { index: true, follow: true },
}

export default function BTTSPredictionsTomorrowPage() {
  return (
    <div className="page-design page-design--btts min-h-screen bg-[#080D14] flex flex-col text-[#EDF2F7]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#9DABBB] mb-4">
            <Link href="/" className="hover:text-[#2F7DFF]">Accueil</Link>
            <span className="mx-1">/</span>
            <Link href="/btts/predictions/today" className="hover:text-[#2F7DFF]">Pronostics</Link>
            <span className="mx-1">/</span>
            <span className="text-[#9DABBB]">BTTS · Tomorrow</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(169, 196, 223, 0.12)', color: '#2F7DFF', border: '1px solid rgba(169, 196, 223, 0.25)' }}>
            BTTS · Tomorrow
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">BTTS Predictions Tomorrow</h1>
          <p className="text-base text-[#9DABBB] leading-relaxed mb-6">
            Les sélections BTTS pour demain apparaissent ci-dessous lorsque les données nécessaires sont disponibles. Chaque carte présente les estimations publiées pour le match.
          </p>

          <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Disponibilité des sélections
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              La liste est construite à partir des données disponibles pour la date de demain. Si aucun match n’apparaît, aucune sélection BTTS n’est publiée pour cette date.
            </p>
            <p className="text-sm text-[#9DABBB] leading-relaxed">
              Les probabilités sont des estimations statistiques, pas des certitudes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
              Voir les pronostics du jour →
            </Link>
            <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#141C25', color: '#9DABBB', border: '1px solid #6B7A8C' }}>
              BTTS du jour →
            </Link>
          </div>

          <p className="text-xs text-[#9DABBB] mt-8 leading-relaxed">
            Aucun résultat futur n'est garanti. Les paris sportifs comportent un risque de perte. 18+ — Jouez responsable.
          </p>
        </section>
              <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions dayOffset={1} marketFilter="btts" />
        </section>
      </main>
      <Footer />
    </div>
  )
}
