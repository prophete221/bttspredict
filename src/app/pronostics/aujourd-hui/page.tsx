import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: "Pronostics BTTS du jour — Sélections aujourd'hui",
  description: "Pronostics BTTS et Over 2.5 du jour basés sur un modèle statistique Poisson. Sélections filtrées par ligues HIGH_BTTS et forme récente. 18+.",
  alternates: { canonical: 'https://bttspredict.com/pronostics/aujourd-hui' },
  robots: { index: true, follow: true },
}

export default function PronosticsAujourdHuiPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-6xl mx-auto px-4 pt-12 pb-6 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronostics du jour
          </h1>
          <p className="text-sm text-[#A5ABC5] text-center mb-8">
            Sélections BTTS et Over 2.5 du jour, générées par le modèle Poisson V3-Reliability. Aucun gain garanti. 18+.
          </p>
        </section>
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
