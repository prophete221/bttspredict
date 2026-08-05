import type { Metadata } from 'next'
import { Navbar, Footer, WinHistory, ErrorBoundary } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'historique'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Historique Pronostics BTTSPredict — Résultats Vérifiés BTTS & Over 2.5 (84.5%)'
const DESCRIPTION = 'Historique complet des pronostics BTTS & Over 2.5 de BTTSPredict — tous les résultats, gagnés et perdus, sans filtrage. Transparence totale avec preuves vérifiables. Précision historique 84.5% (60/71).'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['historique pronostics', 'résultats pronostics', 'track record btts', 'historique bttspredict', 'pronostics vérifiés', 'transparence pronostics', 'win rate btts', 'over 2.5 résultats', 'pronostics btts aujourd\'hui', 'résultats BTTS'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'website',
    locale: 'fr_SN',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Historique Pronostics BTTSPredict – Résultats vérifiés' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

/* ──────────────────────────────────────────────────────────────
   JSON-LD
   ────────────────────────────────────────────────────────────── */
function buildDatasetJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Historique des pronostics BTTSPredict',
    description: 'Historique complet et vérifié des pronostics BTTS et Over 2.5 de BTTSPredict. 71 pronostics analysés avec un taux de réussite de 84.5% (60 gagnés sur 71). Tous les résultats sont vérifiables et mis à jour quotidiennement.',
    url: PAGE_URL,
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Taux de réussite global', value: '84.5%' },
      { '@type': 'PropertyValue', name: 'Pronostics gagnés', value: '60' },
      { '@type': 'PropertyValue', name: 'Total pronostics', value: '71' },
    ],
    publisher: {
      '@type': 'Person',
      name: 'BTTSPredict',
      jobTitle: 'Analyste Football Senior BTTSPredict',
      url: SITE_URL,
      sameAs: [SITE_URL],
    },
    dateModified: '2026-08-05',
  }
}

function buildWebPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: TITLE,
    url: PAGE_URL,
    description: DESCRIPTION,
    isPartOf: { '@type': 'WebSite', name: 'BTTSPredict', url: SITE_URL },
    author: {
      '@type': 'Person',
      name: 'BTTSPredict',
      jobTitle: 'Analyste Football Senior BTTSPredict',
      url: SITE_URL,
      sameAs: [SITE_URL],
    },
    publisher: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    inLanguage: 'fr-SN',
    dateModified: new Date().toISOString().slice(0, 10),
  }
}

function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Historique des pronostics', item: PAGE_URL },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function HistoriquePage() {
  return (
    <div className="min-h-screen bg-midnight">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDatasetJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebPageJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd()) }}
      />

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-midnight focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      {/* Main Content */}
      <main id="main-content" className="relative z-10" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))' }}>
        <ErrorBoundary><Navbar /></ErrorBoundary>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4">
                Historique des Pronostics
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
                Tous nos pronostics BTTS et Over 2.5, gagnés et perdus, sans filtre.
                Transparence totale — taux de réussite <strong className="text-gold">84.5% (60/71)</strong>.
              </p>
              <p className="text-sm text-white/50 mt-4">
                Historique mis à jour chaque jour par notre équipe. Résultats vérifiables avec les scores réels.
              </p>
            </div>

            <ErrorBoundary><WinHistory /></ErrorBoundary>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
