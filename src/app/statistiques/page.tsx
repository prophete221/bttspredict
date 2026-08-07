import type { Metadata } from 'next'
import StatsDashboard from '@/components/bttsbet/StatsDashboard'

const SITE_URL = 'https://bttspredict.com'

export const metadata: Metadata = {
  title: "Statistiques BTTS & Over 2.5",
  description: "Tableau de bord statistique BTTSPredict : courbe 30 jours, répartition par ligue, ROI. Transparence totale, 80% vérifié.",
  alternates: { canonical: `${SITE_URL}/statistiques` },
  openGraph: {
    title: "Statistiques — BTTSPredict",
    description: "Courbe de réussite 30 jours, répartition par ligue, ROI. Transparence totale.",
    url: `${SITE_URL}/statistiques`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Statistiques BTTSPredict — Taux de réussite des pronostics BTTS & Over 2.5',
  description: "Tableau de bord transparent des performances des pronostics BTTS et Over 2.5 validés par l'équipe d'analystes BTTSPredict. Compilé quotidiennement à partir des résultats réels.",
  url: `${SITE_URL}/statistiques`,
  creator: {
    '@type': 'Organization',
    name: 'BTTSPredict',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'BTTSPredict',
    url: SITE_URL,
  },
  keywords: ['BTTS', 'Over 2.5', 'statistiques', 'taux de réussite', 'pronostics football'],
  temporalCoverage: 'P30D',
  inLanguage: 'fr',
  isAccessibleForFree: true,
  // Champ "license" obligatoire pour Google Search Console (Dataset)
  license: 'https://creativecommons.org/licenses/by/4.0/',
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: `${SITE_URL}/predictions.json`,
    },
  ],
}

import { FreePredictionsWidget, VipCardWidget, LinebetApkButton } from '@/components/bttsbet'

export default function StatistiquesPage() {
  return (
    <div className="min-h-screen bg-dark-800 relative">
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
