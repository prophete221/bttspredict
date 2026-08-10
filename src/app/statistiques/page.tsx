import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Statistiques — BTTSPredict',
  description: 'Nouveau système de vérification 100% live ESPN. Statistiques complètes disponibles prochainement.',
  alternates: { canonical: 'https://bttspredict.com/statistiques' },
}

export default function StatistiquesPage() {
  return (
    <div className="min-h-screen bg-[#131314] flex flex-col text-[#f0f4f9]">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Nouveau système de vérification en cours
          </h1>
          <p className="text-sm text-[#9ca3af] mb-3 leading-relaxed">
            Nous passons à une vérification 100% live ESPN. Statistiques complètes disponibles dans 7 jours avec 100+ matchs vérifiés.
          </p>
          <p className="text-sm text-[#9ca3af] mb-8">
            En attendant, découvrez les pronos gratuits du jour ci-dessous.
          </p>
          <a href="/#free-predictions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
            style={{ backgroundColor: '#22c55e', color: '#131314' }}
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
