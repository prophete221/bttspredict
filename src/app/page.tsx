import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { checkSeo } from '@/lib/seo'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Hero = dynamic(() => import('@/components/bttsbet/Hero'), { loading: () => null })
const ScrollProgressBar = dynamic(() => import('@/components/bttsbet/ScrollProgressBar'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const StickyCTABar = dynamic(() => import('@/components/bttsbet/StickyCTABar'), { loading: () => null })

// Tâche 002 — Title et description SEO alignés sur le Prompt Maître.
// Title : 49 chars (limite soft 60) — description : 139 chars (limite soft 150).
// Anti-récidive: checkSeo() lance une erreur build-time si title > 60 ou desc > 150.
const TITLE = "Pronostics BTTS et Over 2,5 du jour | BTTSPredict"
const DESCRIPTION = "Analyses football du jour : BTTS, Over 2,5 et résultats vérifiés. Données horodatées, méthode transparente et aucune garantie de gain. 18+."
checkSeo('homepage', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://bttspredict.com/',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com',
    siteName: 'BTTSPredict',
    type: 'website',
    locale: 'fr_FR',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

// JSON-LD WebSite — SearchAction for Google SERP
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  description: "Pronostics football BTTS & Over 2,5 basés sur un modèle statistique. Code promo VISION221 sur Linebet et 888starz.",
  inLanguage: 'fr',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://bttspredict.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'BTTSPredict',
    url: 'https://bttspredict.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://bttspredict.com/favicon.svg',
    },
  },
}

// JSON-LD FAQPage — Google SERP rich results
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Qu'est-ce que le BTTS ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BTTS signifie Both Teams To Score (les deux équipes marquent). C'est un type de pari où vous pariez que les deux équipes marqueront au moins un but durant le match, quelle que soit l'issue finale.",
      },
    },
    {
      '@type': 'Question',
      name: "Comment fonctionne l'analyse de BTTSPredict ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BTTSPredict publie des pronostics BTTS et Over 2.5 basés sur un modèle statistique. Le nouveau suivi public a été lancé le 2026-08-08 — voir /historique pour les chiffres réels. Aucun résultat futur n'est garanti.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment utiliser le code promo VISION221 ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Inscrivez-vous sur Linebet via notre lien de parrainage, puis saisissez le code promo VISION221 lors de votre inscription ou dans la section Code Promo de votre compte pour recevoir un bonus exclusif sur votre premier dépôt.",
      },
    },
    {
      '@type': 'Question',
      name: 'Les pronostics gratuits sont-ils fiables ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Nos pronostics gratuits sont produits par le même modèle statistique que nos pronostics premium. Ils couvrent les matchs les plus populaires du jour avec une analyse complète. Aucun résultat n'est garanti.",
      },
    },
    {
      '@type': 'Question',
      name: 'Pourquoi faire confiance à BTTSPredict ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BTTSPredict publie des pronostics BTTS et Over 2.5 basés sur un modèle statistique. (1) Transparence — tous les pronostics sont archivés et vérifiés publiquement. (2) Méthodologie — modèle statistique basé sur les données disponibles des équipes. (3) Couverture — compétitions disponibles dans les données du système. (4) Sources publiques — ESPN et TheSportsDB lorsque leurs données sont disponibles. (5) Suivi public — les pronostics sont horodatés et vérifiés après le résultat officiel. Aucun résultat futur n'est garanti.",
      },
    },
    {
      '@type': 'Question',
      name: 'BTTSPredict est-il un site de pronostics fiable ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. BTTSPredict publie un historique public vérifiable (gagnés ET perdus), une méthodologie documentée et un suivi public lancé le 2026-08-08. Le taux de réussite est calculé en temps réel à partir des résultats réels (voir /historique), pas un chiffre marketing. Aucun résultat n'est garanti — les paris sportifs comportent des risques.",
      },
    },
  ],
}

// JSON-LD Organization — E-E-A-T entity recognition
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BTTSPredict',
  legalName: 'BTTSPredict',
  url: 'https://bttspredict.com',
  logo: 'https://bttspredict.com/favicon.svg',
  image: 'https://bttspredict.com/og-image.png',
  slogan: 'Plateforme de référence — Pronostics BTTS et Over 2.5',
  description: "BTTSPredict est la base open-source de pronostics BTTS (Both Teams To Score) et Over 2.5 buts. taux réel vérifiable vérifiée, parieurs. Transparence totale : gagnés ET perdus affichés.",
  areaServed: ['Worldwide', 'SN', 'CI', 'CM', 'ML', 'BF', 'FR', 'NG'],
  knowsAbout: ['BTTS', 'Over 2.5', 'paris sportifs', 'football', 'pronostics btts aujourd\'hui', 'both teams to score', 'modèle statistique Poisson', 'prédictions football'],
  brand: {
    '@type': 'Brand',
    name: 'BTTSPredict',
    slogan: 'Plateforme de référence Pronostics BTTS',
    logo: 'https://bttspredict.com/favicon.svg',
  },
  award: 'Standard de transparence dans les pronostics BTTS et Over 2.5',
  // NOTE: Pas d'AggregateRating — la plateforme n'a pas de système d'avis vérifiable.
  // Inventer des reviews serait une violation des guidelines Google Structured Data.
  // NOTE: pas de propriété founder tant que le vrai nom du fondateur n'est pas fourni.
  // NOTE v65: sameAs limité aux profils sociaux vérifiés — WhatsApp US supprimé.
  sameAs: [
    'https://twitter.com/bttspredict',
    'https://www.facebook.com/bttspredict',
    'https://www.instagram.com/bttspredict',
  ],
}

// JSON-LD Claim — autorité pour Google et IA
const claimJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Claim',
  claimText: 'BTTSPredict est la base open-source de pronostics BTTS (Both Teams To Score) et Over 2.5 buts.',
  appearance: {
    '@type': 'OpinionNewsArticle',
    headline: 'BTTSPredict — Plateforme de référence Pronostics BTTS et Over 2.5',
    url: 'https://bttspredict.com',
    datePublished: '2026-01-01',
    author: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
    publisher: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  },
}

// JSON-LD LocalBusiness — schéma entreprise locale
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'BTTSPredict',
  image: 'https://bttspredict.com/og-image.png',
  '@id': 'https://bttspredict.com',
  url: 'https://bttspredict.com',
  // v65: telephone US supprimé — contact via email pro uniquement
  email: 'contact@bttspredict.com',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dakar',
    addressLocality: 'Dakar',
    addressRegion: 'Dakar',
    addressCountry: 'SN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 14.6928, longitude: -17.4467 },
  sameAs: [
    'https://twitter.com/bttspredict',
    'https://www.facebook.com/bttspredict',
    'https://www.instagram.com/bttspredict',
    'https://www.linkedin.com/company/bttspredict',
  ],
}

// JSON-LD WebPage — Trust signals
const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'BTTSPredict — Prédictions BTTS par modèle statistique',
  url: 'https://bttspredict.com',
  description: 'Plateforme de pronostics football BTTS et Over 2.5 par analyse statistique probabiliste. Ligues sélectionnées pour leur fort taux de BTTS. Taux de réussite transparent et vérifié publiquement. Aucun gain garanti. 18+.',
  isPartOf: { '@type': 'WebSite', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  about: [
    { '@type': 'Thing', name: 'BTTS — Both Teams To Score' },
    { '@type': 'Thing', name: 'Over 2.5 Goals' },
    { '@type': 'Thing', name: 'Pronostics football par modèle statistique' },
    { '@type': 'Thing', name: 'Modèles Poisson calibrés' },
  ],
  author: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  publisher: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  inLanguage: 'fr',
  datePublished: '2026-01-01',
  dateModified: new Date().toISOString().slice(0, 10),
  keywords: 'BTTS, Over 2.5, pronostics btts aujourd\'hui, analyse statistique football, modèles Poisson, code promo VISION221, Linebet, 888starz, pronostics football gratuits, pronostics Sénégal, both teams to score',
}

// JSON-LD Dataset — Transparency & credibility
const datasetJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'BTTSPredict — Historique des pronostics BTTS & Over 2.5',
  description: 'Historique complet des pronostics publiés par BTTSPredict, incluant les résultats gagnés ET perdus. Taux de réussite calculé sur les pronostics réellement publiés. Transparence totale.',
  url: 'https://bttspredict.com/win-history.json',
  creator: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  license: 'https://creativecommons.org/licenses/by/4.0/',
  isAccessibleForFree: true,
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://bttspredict.com/win-history.json',
    },
  ],
  keywords: 'pronostics BTTS, historique résultats, taux de réussite, transparence, gagnés perdus',
  variableMeasured: [
    { '@type': 'PropertyValue', name: 'Taux de réussite', value: 'Calculé en temps réel depuis /historique' },
    { '@type': 'PropertyValue', name: 'Ligues couvertes', value: 'Sélection de ligues à fort taux de BTTS' },
    { '@type': 'PropertyValue', name: 'Source de vérification', value: 'ESPN et TheSportsDB' },
    { '@type': 'PropertyValue', name: 'Modèle', value: 'Approche statistique probabiliste' },
    { '@type': 'PropertyValue', name: 'Suivi public', value: 'Lancé le 2026-08-08, voir /historique' },
  ],
}

// JSON-LD Review/Trust — SUPPRIMÉ (avis fictifs supprimés pour conformité Google Structured Data)
// La plateforme n'a pas de système d'avis vérifiable. Inventer des reviews serait une violation.
// Seules les métriques objectives (pronostics publiés, vérifiés, taux calculé depuis l'archive) sont affichées.
const reviewJsonLd = null

// JSON-LD BreadcrumbList — breadcrumbs in SERP
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://bttspredict.com/' },
    { '@type': 'ListItem', position: 2, name: 'Pronostics', item: 'https://bttspredict.com/#free-predictions' },
    { '@type': 'ListItem', position: 3, name: 'VIP', item: 'https://bttspredict.com/#vip' },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-800 relative">
      <h1 className="sr-only">Pronostics BTTS et Over 2,5 du jour</h1>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(claimJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ═══ SEO CONTENT FOR CRAWLERS & AI — minimal v91 ═══ */}
      <div className="sr-only">
        <h2>Pronostics BTTS et Over 2.5 — Afrique de l&apos;Ouest &amp; Maroc</h2>
        <p>
          BTTSPredict publie 8 pronostics BTTS &amp; Over 2.5 quotidiens pour le Sénégal, Mali,
          Côte d&apos;Ivoire, Guinée, Congo et Maroc. Données ESPN publiques. Suivi public
          depuis 2026-08-08, vérifiable après match. 18+ Jeu responsable.
        </p>
      </div>

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-midnight focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Main Content — Plateforme PRO v64
          Structure minimaliste type Flashscore :
          1. Hero (1 phrase)
          2. FreePredictions (filtres + cartes matchs)
          3. Bloc VIP court (1 CTA)
          4. Jeu responsable
          5. Footer */}
      <main id="main-content" className="relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <ErrorBoundary><Navbar /></ErrorBoundary>
        <ErrorBoundary><Hero /></ErrorBoundary>
        <ErrorBoundary><FreePredictions /></ErrorBoundary>

        {/* Bloc transparence — 3 éléments visuels */}
        <section className="max-w-[440px] mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-2">
            <a href="/resultats-verifies" className="block p-3 rounded-xl text-center transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#111a2a', border: '1px solid #7D90A7' }}>
              <div className="mb-1.5 flex justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7FA2C6" strokeWidth="2"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <div className="text-[10px] font-bold text-[#F4F7FB]">Historique vérifié</div>
              <div className="text-[9px] text-[#C2CCD8] mt-0.5">Gagnés et perdus</div>
            </a>
            <a href="/methodologie" className="block p-3 rounded-xl text-center transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#111a2a', border: '1px solid #7D90A7' }}>
              <div className="mb-1.5 flex justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7FA2C6" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </div>
              <div className="text-[10px] font-bold text-[#F4F7FB]">Méthodologie</div>
              <div className="text-[9px] text-[#C2CCD8] mt-0.5">Modèle Poisson + xG</div>
            </a>
            <a href="/predictions-archive/" className="block p-3 rounded-xl text-center transition-all hover:scale-[1.02]"
              style={{ backgroundColor: '#111a2a', border: '1px solid #7D90A7' }}>
              <div className="mb-1.5 flex justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D3B16D" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              </div>
              <div className="text-[10px] font-bold text-[#F4F7FB]">Données publiques</div>
              <div className="text-[9px] text-[#C2CCD8] mt-0.5">Archives horodatées</div>
            </a>
          </div>
        </section>

        {/* VIP — carte premium sobre */}
        <section className="max-w-[440px] mx-auto px-4 py-6">
          <div className="p-5 rounded-[16px]" style={{ backgroundColor: '#111a2a', border: '1px solid #7D90A7' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#D3B16D' }}>VIP Premium</span>
              <span className="text-[9px] text-[#C2CCD8]">18+ · Affiliation rémunéré</span>
            </div>
            <h2 className="text-lg font-bold mb-1.5" style={{ fontFamily: 'Poppins, sans-serif', color: '#F4F7FB' }}>
              Pronostics premium BTTS et Over 2.5
            </h2>
            <p className="text-[11px] text-[#C2CCD8] leading-relaxed mb-4">
              Sélections supplémentaires et analyses détaillées. Aucun gain garanti.
            </p>
            <a href="/vip" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] font-bold text-[12px] transition-all"
              style={{ backgroundColor: '#D3B16D', color: '#0B1220' }}
              data-cta="home-discover-vip">
              Découvrir le VIP
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </section>

        {/* Jeu responsable — compact et moderne */}
        <section className="max-w-[440px] mx-auto px-4 pb-6">
          <div className="p-4 rounded-[12px] flex items-start gap-3" style={{ backgroundColor: 'rgba(255, 113, 133, 0.05)', border: '1px solid rgba(255, 113, 133, 0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7185" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-[11px] text-[#C2CCD8] leading-relaxed mb-1">
                <strong className="text-[#FF7185]">18+</strong> · Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez perdre.
              </p>
              <a href="/jouer-responsable" className="text-[11px] font-bold text-[#7FA2C6] underline">
                En savoir plus →
              </a>
            </div>
          </div>
        </section>

        {/* Liens internes SEO */}
        <section className="px-4 py-4 max-w-[440px] mx-auto">
          <div className="flex flex-wrap gap-2 text-[11px]">
            <a href="/bonus-888starz" className="text-[#C2CCD8] hover:text-[#7FA2C6] transition-colors">Bonus 888Starz</a>
            <span className="text-[#7D90A7]">·</span>
            <a href="/code-promo-linebet-senegal" className="text-[#C2CCD8] hover:text-[#7FA2C6] transition-colors">Code Promo Linebet</a>
            <span className="text-[#7D90A7]">·</span>
            <a href="/btts-c-est-quoi" className="text-[#C2CCD8] hover:text-[#7FA2C6] transition-colors">BTTS signification</a>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>

      {/* Sticky CTA Bar — mobile only, appears after 60% scroll */}
      <StickyCTABar />
    </div>
  )
}
