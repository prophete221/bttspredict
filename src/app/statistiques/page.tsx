import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Statistiques — BTTSPredict',
  description: 'Nouveau système de vérification 100% live ESPN. Statistiques complètes disponibles prochainement.',
  alternates: { canonical: 'https://bttspredict.com/statistiques' },
}

export default function StatistiquesPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col text-[#F8FAFC]">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Nouveau système de vérification en cours
          </h1>
          <p className="text-sm text-[#94A3B8] mb-3 leading-relaxed">
            Nous passons à une vérification 100% live ESPN. Statistiques complètes disponibles dans 7 jours avec 100+ matchs vérifiés.
          </p>
          <p className="text-sm text-[#94A3B8] mb-8">
            En attendant, découvrez les pronos gratuits du jour ci-dessous.
          </p>
          <a href="/#free-predictions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
            style={{ backgroundColor: '#10B981', color: '#0F172A' }}
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
