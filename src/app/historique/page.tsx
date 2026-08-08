import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import HistoriqueClient from './HistoriqueClient'

export const metadata: Metadata = {
  title: 'Historique vérifié — Nouveau suivi public',
  description: "Historique vérifié BTTSPredict : chaque pronostic enregistré, horodaté et évalué après le résultat officiel. 18+.",
  alternates: { canonical: 'https://bttspredict.com/historique' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Historique vérifié — BTTSPredict',
    description: "Suivi public des pronostics vérifiés BTTSPredict. Nouvelle période depuis le 2026-08-08. 18+.",
    url: 'https://bttspredict.com/historique',
    type: 'website',
  },
}

export default function HistoriquePage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <HistoriqueClient />
      </main>
      <Footer />
    </div>
  )
}
