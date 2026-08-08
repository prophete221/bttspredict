import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: "Pronostics BTTS et Over 2.5 du jour",
  description: "Pronostics BTTS et Over 2.5 du jour par moteur IA. Sélections filtrées par ligues à fort taux. 18+.",
  alternates: { canonical: 'https://bttspredict.com/pronostics' },
  robots: { index: true, follow: true },
}

export default function PronosticsPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-6 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronostics BTTS et Over 2.5
          </h1>
          <p className="text-base sm:text-lg text-[#A5ABC5] leading-relaxed mb-3">
            Sélections du jour générées par le moteur IA, filtrées par ligues à fort taux de BTTS et forme récente des équipes.
          </p>
          <p className="text-sm text-[#6B7194] leading-relaxed">
            Aucun gain n'est garanti. Les pronostics sont publiés à titre informatif. 18+.
          </p>
        </section>
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
