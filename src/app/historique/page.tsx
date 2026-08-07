import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Historique Vérifié — BTTSPredict',
  description: 'Nouveau système de vérification 100% live ESPN. Historique complet disponible prochainement.',
  alternates: { canonical: 'https://bttspredict.com/historique' },
}

export default function HistoriquePage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Nouveau système de vérification en cours
          </h1>
          <p className="text-sm text-[#A5ABC5] mb-3 leading-relaxed">
            Nous passons à une vérification 100% live ESPN. Historique complet disponible dans 7 jours avec 100+ matchs vérifiés.
          </p>
          <p className="text-sm text-[#A5ABC5] mb-8">
            En attendant, découvrez les pronos gratuits du jour ci-dessous.
          </p>
          <a href="/#free-predictions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
            style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}
          >
            Voir les pronos du jour →
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
