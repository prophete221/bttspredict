import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Pronostics BTTS et Over 2.5 du jour",
  description: "Pronostics BTTS et Over 2.5 du jour basés sur un modèle statistique probabiliste. Sélections filtrées par ligues à fort taux de BTTS et forme récente des équipes. 18+.",
  alternates: { canonical: 'https://bttspredict.com/pronostics' },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pronostics BTTS et Over 2.5 du jour — BTTSPredict",
    description: "Pronostics BTTS et Over 2.5 basés sur un modèle statistique probabiliste. 18+. Aucun gain garanti.",
    url: 'https://bttspredict.com/pronostics',
    type: 'website',
  },
}

export default function PronosticsPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />

      <main id="main-content" className="flex-1">
        <section className="max-w-6xl mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(81, 70, 245, 0.12)', color: '#5146F5', border: '1px solid rgba(81, 70, 245, 0.25)' }}>
              Pronostics du jour
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pronostics BTTS et Over 2.5
            </h1>
            <p className="text-base sm:text-lg text-[#A5ABC5] leading-relaxed mb-3">
              Sélections du jour générées par le modèle statistique probabiliste, filtrées par ligues à fort taux de BTTS et forme récente des équipes.
            </p>
            <p className="text-sm text-[#6B7194] leading-relaxed">
              Aucun gain n'est garanti. Les pronostics sont publiés à titre informatif. 18+.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link href="/methodologie"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-bold transition-all"
              style={{ backgroundColor: '#0D1630', color: '#A5ABC5', border: '1px solid #303861' }}>
              Méthodologie →
            </Link>
            <Link href="/historique"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-bold transition-all"
              style={{ backgroundColor: '#0D1630', color: '#A5ABC5', border: '1px solid #303861' }}>
              Historique vérifié →
            </Link>
            <Link href="/vip"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-bold transition-all"
              style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', color: '#FFC857', border: '1px solid rgba(255, 200, 87, 0.25)' }}>
              Pronostics premium →
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>
      </main>

      <Footer />
    </div>
  )
}
