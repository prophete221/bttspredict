import type { Metadata } from 'next'
import StatsDashboard from '@/components/bttsbet/StatsDashboard'

export const metadata: Metadata = {
  title: "Statistiques — Taux de réussite BTTS & Over 2.5 | BttsBet",
  description: "Tableau de bord statistique BttsBet : courbe de réussite sur 30 jours, répartition par championnat, par type de pronostic, ROI simulé. Données transparentes mises à jour quotidiennement.",
  alternates: { canonical: 'https://bttsbet.online/statistiques' },
  openGraph: {
    title: "Statistiques — BttsBet",
    description: "Courbe de réussite 30 jours, répartition par ligue, ROI. Transparence totale.",
    url: 'https://bttsbet.online/statistiques',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Statistiques BttsBet — Taux de réussite des pronostics IA',
  description: "Tableau de bord transparent des performances des pronostics BTTS et Over 2.5 générés par l'IA BttsBet. Compilé quotidiennement à partir des résultats réels.",
  url: 'https://bttsbet.online/statistiques',
  creator: { '@type': 'Organization', name: 'BttsBet', url: 'https://bttsbet.online' },
  keywords: ['BTTS', 'Over 2.5', 'statistiques', 'taux de réussite', 'pronostics IA'],
  temporalCoverage: 'P30D',
  inLanguage: 'fr',
}

export default function StatistiquesPage() {
  return (
    <div className="min-h-screen bg-midnight relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="stadium-glow-top" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <header className="text-center mb-10">
          <span className="eyebrow">📊 Transparence totale</span>
          <h1 className="section-title mt-3 mb-4">
            Statistiques <span className="text-gold">en direct</span>
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Tous nos résultats, gagnés et perdus, calculés à partir des scores réels.
            Aucune sélection, aucune triche. Les performances passées ne garantissent pas les résultats futurs.
          </p>
        </header>
        <StatsDashboard />
      </div>
    </div>
  )
}
