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
    <div className="min-h-screen bg-[#0B1220] flex flex-col text-[#F4F7FB]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#C2CCD8] mb-4">
            <Link href="/" className="hover:text-[#7FA2C6]">Accueil</Link>
            <span className="mx-1">/</span>
            <Link href="/btts/predictions/today" className="hover:text-[#7FA2C6]">Pronostics</Link>
            <span className="mx-1">/</span>
            <span className="text-[#C2CCD8]">BTTS Tomorrow</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(169, 196, 223, 0.12)', color: '#7FA2C6', border: '1px solid rgba(169, 196, 223, 0.25)' }}>
            BTTS · Tomorrow
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BTTS Predictions Tomorrow
          </h1>
          <p className="text-base text-[#C2CCD8] leading-relaxed mb-6">
            BTTSPredict publie chaque jour une nouvelle sélection de pronostics BTTS. Les pronostics pour les matchs de demain sont publiés la veille au soir et le jour même, plusieurs fois par jour. Chaque sélection est issue du modèle statistique, basée sur les données disponibles des deux équipes.
          </p>

          <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: '#111a2a', border: '1px solid #7D90A7' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comment accéder aux pronostics BTTS de demain ?
            </h2>
            <p className="text-sm text-[#C2CCD8] leading-relaxed mb-3">
              Les pronostics de demain sont disponibles sur la page <Link href="/btts/predictions/today" className="text-[#7FA2C6] underline">Pronostics du jour</Link> dès qu'ils sont publiés par le moteur. La page est mise à jour automatiquement 4 fois par jour via GitHub Actions.
            </p>
            <p className="text-sm text-[#C2CCD8] leading-relaxed">
              Vous pouvez filtrer par date (aujourd'hui, demain, 7 jours) directement sur la page des pronostics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#7FA2C6', color: '#0B1220' }}>
              Voir les pronostics du jour →
            </Link>
            <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#111a2a', color: '#C2CCD8', border: '1px solid #7D90A7' }}>
              BTTS du jour →
            </Link>
          </div>

          <p className="text-xs text-[#C2CCD8] mt-8 leading-relaxed">
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
