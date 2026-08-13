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
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#B7C4C1] mb-4">
            <Link href="/" className="hover:text-[#B8FF1A]">Accueil</Link>
            <span className="mx-1">/</span>
            <Link href="/btts/predictions/today" className="hover:text-[#B8FF1A]">Pronostics</Link>
            <span className="mx-1">/</span>
            <span className="text-[#B7C4C1]">BTTS Tomorrow</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(169, 196, 223, 0.12)', color: '#B8FF1A', border: '1px solid rgba(169, 196, 223, 0.25)' }}>
            BTTS · Tomorrow
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BTTS Predictions Tomorrow
          </h1>
          <p className="text-base text-[#B7C4C1] leading-relaxed mb-6">
            BTTSPredict publie chaque jour une nouvelle sélection de pronostics BTTS. Les pronostics pour les matchs de demain sont publiés la veille au soir et le jour même, plusieurs fois par jour. Chaque sélection est issue du modèle statistique, basée sur les données disponibles des deux équipes.
          </p>

          <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comment accéder aux pronostics BTTS de demain ?
            </h2>
            <p className="text-sm text-[#B7C4C1] leading-relaxed mb-3">
              Les pronostics de demain sont disponibles sur la page <Link href="/btts/predictions/today" className="text-[#B8FF1A] underline">Pronostics du jour</Link> dès qu'ils sont publiés par le moteur. La page est mise à jour automatiquement 4 fois par jour via GitHub Actions.
            </p>
            <p className="text-sm text-[#B7C4C1] leading-relaxed">
              Vous pouvez filtrer par date (aujourd'hui, demain, 7 jours) directement sur la page des pronostics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>
              Voir les pronostics du jour →
            </Link>
            <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#0D1A20', color: '#B7C4C1', border: '1px solid #5D7880' }}>
              BTTS du jour →
            </Link>
          </div>

          <p className="text-xs text-[#B7C4C1] mt-8 leading-relaxed">
            Aucun résultat futur n'est garanti. Les paris sportifs comportent un risque de perte. 18+ — Jouez responsable.
          </p>
        </section>
              <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
