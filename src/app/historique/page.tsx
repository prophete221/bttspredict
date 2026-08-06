import type { Metadata } from 'next'
import { Navbar, Footer, WinHistory, ErrorBoundary } from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildPersonJsonLd, buildDatasetJsonLd } from '@/lib/seoSchemas'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'historique'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Historique Pronostics — 84,5% vérifié'
const DESCRIPTION = 'Historique complet des pronostics BTTS & Over 2.5. Gagnés ET perdus affichés, 84,5% vérifié. Transparence totale.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['historique pronostics', 'résultats pronostics', 'track record btts', 'historique bttspredict', 'pronostics vérifiés', 'transparence pronostics', 'win rate btts', 'over 2.5 résultats', 'pronostics btts aujourd\'hui', '84.5% réussite', 'pronostics football vérifiables'],
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Historique Pronostics BTTSPredict – Résultats vérifiés 84,5%' }],
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
function buildWebPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BTTSPredict',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
  }
}

function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Historique', item: PAGE_URL },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function HistoriquePage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebPageJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }}
      />
      {buildPersonJsonLd() && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonJsonLd()) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDatasetJsonLd()) }}
      />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <Navbar />

      <main id="main-content" className="flex-1 relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <a href="/" className="hover:text-emerald transition-colors">
                Accueil
              </a>
            </li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li>
              <span className="text-gray-400" aria-current="page">Historique</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <section className="pb-6 sm:pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl text-white mb-4"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              HISTORIQUE <span className="text-gold neon-glow">PRONOSTICS</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Tous les pronostics BTTS &amp; Over 2.5 — gagnés et perdus — sans filtrage. Transparence totale avec preuves vérifiables.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-6" />
          </div>
        </section>

        {/* Win History Component */}
        <ErrorBoundary>
          <WinHistory />
        </ErrorBoundary>

        {/* Explanation Section */}
        <section className="pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <article className="card p-6">
              <h2
                className="text-2xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Comment nous calculons nos résultats
              </h2>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>
                  Notre historique affiche <strong className="text-gold">tous les pronostics</strong> sans exception — les gagnés ET les perdus. Nous ne filtrons pas nos résultats pour présenter une image favorable. C&apos;est notre engagement de transparence.
                </p>
                <p>
                  Le taux de précision affiché est de <strong className="text-emerald">84,5%</strong>, calculé à partir de l&apos;ensemble des pronostics validés (60 gagnés sur 71 publiés), pas d&apos;un sous-ensemble sélectionné. Les performances passées ne garantissent pas les résultats futurs.
                </p>
                <p>
                  Chaque pronostic est vérifié après la fin du match avec le score final officiel. Les résultats sont mis à jour quotidiennement par notre équipe d&apos;analystes.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
