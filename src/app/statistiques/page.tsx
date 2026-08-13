import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Statistiques — BTTSPredict',
  description: "Les statistiques détaillées seront affichées lorsque suffisamment de données vérifiées seront disponibles. Aucune donnée n'est inventée.",
  alternates: { canonical: 'https://bttspredict.com/statistiques' },
}

export default function StatistiquesPage() {
  return (
    <div className="min-h-screen bg-[#080B12] flex flex-col text-[#F7F4EE]">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Statistiques en cours de compilation
          </h1>
          <p className="text-sm text-[#9BA7B8] mb-3 leading-relaxed">
            Les statistiques détaillées seront affichées lorsque suffisamment de données vérifiées seront disponibles. Aucune statistique n&apos;est affichée artificiellement lorsque l&apos;échantillon disponible est insuffisant.
          </p>
          <p className="text-sm text-[#9BA7B8] mb-8">
            En attendant, découvrez les pronos gratuits du jour ci-dessous.
          </p>
          <a href="/#free-predictions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
            style={{ backgroundColor: '#18A879', color: '#080B12' }}
          >
            Voir les pronos du jour →
          </a>
        </div>
              <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
