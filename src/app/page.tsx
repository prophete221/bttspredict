import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { checkSeo } from '@/lib/seo'
import { HOME_FAQ_ITEMS } from '@/lib/constants'
import { getArchiveSummary } from './historique/getArchiveSummary'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Hero = dynamic(() => import('@/components/bttsbet/Hero'), { loading: () => null })
const MatchCenter = dynamic(() => import('@/components/bttsbet/MatchCenter'), { loading: () => null })
const PerformanceDashboard = dynamic(() => import('@/components/bttsbet/PerformanceDashboard'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

const TITLE = "BTTSPredict — Pronostics BTTS du jour et Over 2,5"
const DESCRIPTION = "Pronostics BTTS du jour sur des matchs internationaux, avec sélections horodatées, historique public et méthode documentée. 18+."
checkSeo('homepage', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://bttspredict.com/',
    languages: {
      fr: 'https://bttspredict.com/',
      en: 'https://bttspredict.com/en',
      'x-default': 'https://bttspredict.com/',
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com',
    siteName: 'BTTSPredict',
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  description: 'Sélections publiques de football BTTS et Over 2,5, historique des résultats vérifiés et méthode documentée.',
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'BTTSPredict',
    url: 'https://bttspredict.com',
    logo: { '@type': 'ImageObject', url: 'https://bttspredict.com/icon-512.png' },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  logo: 'https://bttspredict.com/icon-512.png',
  description: 'Site informatif consacré aux sélections BTTS et Over 2,5, aux analyses de matchs et aux résultats vérifiés.',
  knowsAbout: ['BTTS', 'Over 2.5', 'football', 'analyse des données de football'],
  sameAs: [
    'https://twitter.com/bttspredict',
    'https://www.facebook.com/bttspredict',
    'https://www.instagram.com/bttspredict',
  ],
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'BTTSPredict — Pronostics BTTS et Over 2,5 du jour',
  url: 'https://bttspredict.com',
  description: 'Sélections publiques BTTS et Over 2,5, historique des résultats vérifiés et méthode documentée. Aucun résultat futur garanti. 18+.',
  isPartOf: { '@type': 'WebSite', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  about: [
    { '@type': 'Thing', name: 'BTTS — Both Teams To Score' },
    { '@type': 'Thing', name: 'Over 2.5 Goals' },
    { '@type': 'Thing', name: 'Sélections publiques de football vérifiées' },
  ],
  author: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  publisher: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  datePublished: '2026-01-01',
  dateModified: new Date().toISOString().slice(0, 10),
  keywords: 'BTTS, Over 2.5, pronostics btts aujourd’hui, analyse de football, code promo VISION221, Linebet, 888starz, pronostics football gratuits, pronostics Sénégal, both teams to score',
  inLanguage: 'fr',
}

const datasetJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'BTTSPredict — Archive publique des pronostics BTTS et Over 2,5',
  description: 'Archive des sélections publiées et de leurs résultats vérifiés, gagnés comme perdus. Les taux indiquent leur période et leur dénominateur; aucun résultat futur n’est garanti.',
  url: 'https://bttspredict.com/win-history.json',
  creator: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  license: 'https://creativecommons.org/licenses/by/4.0/',
  isAccessibleForFree: true,
  keywords: 'pronostics BTTS, historique résultats, taux de réussite, transparence, gagnés perdus, sélections vérifiées',
  distribution: [{
    '@type': 'DataDownload',
    encodingFormat: 'application/json',
    contentUrl: 'https://bttspredict.com/win-history.json',
  }],
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'Taux de réussite', value: 'Calculé à partir du registre public /historique' },
    { '@type': 'PropertyValue', name: 'Source de vérification', value: 'ESPN et TheSportsDB' },
    { '@type': 'PropertyValue', name: 'Contrôle des pronostics publics', value: 'Sélections vérifiées avant publication' },
    { '@type': 'PropertyValue', name: 'Suivi public', value: 'Voir /historique pour la période et la date des données' },
  ],
}

export default function Home() {
  return (
    <div className="bp-site-page page-design page-design--home relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-midnight focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <main id="main-content" className="relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <ErrorBoundary><Navbar /></ErrorBoundary>
        <ErrorBoundary><Hero /></ErrorBoundary>
        <ErrorBoundary><MatchCenter /></ErrorBoundary>
        <ErrorBoundary><PerformanceDashboard archiveSummary={getArchiveSummary()} /></ErrorBoundary>

        <section className="bp-home-summary" aria-labelledby="home-platform-summary">
          <div>
            <h2 id="home-platform-summary">Sélections publiques BTTS et Over 2,5, avec résultats vérifiés</h2>
            <p>
              BTTSPredict présente des sélections publiques pour des rencontres internationales.
              Les résultats gagnés et perdus sont archivés; les pages d’analyse séparent les pronostics des données
              sportives et de la vérification des scores. Aucun résultat futur n&apos;est garanti.
            </p>
          </div>
        </section>

        <section className="bp-responsible" aria-label="Jeu responsable">
          <div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8dbbfa" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-sm text-[#A4A4A4] leading-relaxed mb-1">
                <strong>18+</strong> · Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez perdre.
              </p>
              <a href="/jouer-responsable">En savoir plus →</a>
            </div>
          </div>
        </section>

        <section className="bp-internal-links" aria-label="Guides et offres">
          <a href="/bonus-888starz" className="text-[#9DABBB] hover:text-[#2F7DFF] transition-colors">Bonus 888Starz</a>
          <span className="text-[#223041]">·</span>
          <a href="/code-promo-linebet-senegal" className="text-[#9DABBB] hover:text-[#2F7DFF] transition-colors">Code Promo Linebet</a>
          <span className="text-[#223041]">·</span>
          <a href="/btts-c-est-quoi" className="text-[#9DABBB] hover:text-[#2F7DFF] transition-colors">BTTS signification</a>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
