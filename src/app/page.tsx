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

// SEO homepage — title court (49 chars) conforme aux limites Bing SERP.
// Le template "%s | BTTSPredict" du layout ajoute " | BTTSPredict" (14 chars)
// → title final rendu: 49 + 14 = 63 chars, sous la limite hard 70.
// Description: 132 chars, sous la limite hard 160.
// Anti-récidive: checkSeo() lance une erreur build-time si title > 60 ou desc > 150.
const TITLE = "Pronostic BTTS Afrique Ouest & Maroc Aujourd'hui"
const DESCRIPTION = "Pronostics BTTS & Over 2.5 pour Sénégal, Mali, CIV, Guinée, Congo, Maroc. IA gratuite, vérifiable après match. 18+"
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
  description: "Pronostics football BTTS & Over 2,5 par nos experts. Value bets FIFA sur Linebet et 888starz. Code promo VISION221.",
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
        text: "BTTSPredict publie des pronostics BTTS et Over 2.5 basés sur un modèle IA nouvelle génération. Le nouveau suivi public a été lancé le 2026-08-08 — voir /historique pour les chiffres réels. Aucun résultat futur n'est garanti.",
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
        text: "Nos pronostics gratuits sont validés par la même équipe d'analystes que nos pronostics premium. Ils couvrent les matchs les plus populaires du jour avec une analyse complète. Aucun résultat n'est garanti.",
      },
    },
    {
      '@type': 'Question',
      name: 'Peut-on prédire Aviator ou une faille de cotes FIFA ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non. Aviator est un jeu 100% aléatoire basé sur un générateur certifié 'provably fair' — aucun outil ne peut prédire un round futur. Nos statistiques Aviator observent l'historique, pas l'avenir. Les Analyses de valeur FIFA (expérimental) sont des estimations statistiques, pas des garanties de gain.",
      },
    },
    {
      '@type': 'Question',
      name: 'Pourquoi faire confiance à BTTSPredict ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BTTSPredict publie des pronostics BTTS et Over 2.5 basés sur un modèle IA nouvelle génération. (1) Transparence — tous les pronostics sont archivés et vérifiés publiquement. (2) Méthodologie — moteur IA nouvelle génération entraîné sur la forme récente des équipes. (3) Couverture — ligues sélectionnées pour leur taux élevé de BTTS. (4) Sources publiques — ESPN et TheSportsDB. (5) Suivi public — nouveau suivi lancé le 2026-08-08, tous les pronostics sont horodatés et vérifiés après le résultat officiel. Aucun résultat futur n'est garanti.",
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
  knowsAbout: ['BTTS', 'Over 2.5', 'paris sportifs', 'analystes football', 'football', 'analyses de valeur statistique FIFA', 'statistiques Aviator', 'pronostics btts aujourd\'hui', 'both teams to score', 'modèle IA nouvelle génération football', 'prédictions football'],
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
  name: 'BTTSPredict — Prédictions BTTS par nos experts',
  url: 'https://bttspredict.com',
  description: 'Plateforme de pronostics football BTTS et Over 2.5 par analyse statistique probabiliste. Ligues sélectionnées pour leur fort taux de BTTS. Taux de réussite transparent et vérifié publiquement. Aucun gain garanti. 18+.',
  isPartOf: { '@type': 'WebSite', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  about: [
    { '@type': 'Thing', name: 'BTTS — Both Teams To Score' },
    { '@type': 'Thing', name: 'Over 2.5 Goals' },
    { '@type': 'Thing', name: 'Pronostics football par nos experts' },
    { '@type': 'Thing', name: 'Modèles Poisson calibrés' },
  ],
  author: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  publisher: { '@type': 'Organization', name: 'BTTSPredict', url: 'https://bttspredict.com' },
  inLanguage: 'fr',
  datePublished: '2026-01-01',
  dateModified: new Date().toISOString().slice(0, 10),
  keywords: 'BTTS, Over 2.5, pronostics btts aujourd\'hui, pronostics analystes, analyse statistique football, modèles Poisson, Analyses de valeur FIFA (expérimental), Aviator Provably Fair, code promo VISION221, Linebet, 888starz, pronostics football gratuits, pronostics Sénégal, both teams to score',
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
    { '@type': 'ListItem', position: 4, name: 'Analyses de valeur FIFA (expérimental)', item: 'https://bttspredict.com/#fifa-linebet' },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-800 relative">
      <h1 className="sr-only">Pronostic BTTS Aujourd'hui Afrique Ouest & Maroc - IA Over 2.5 Gratuit</h1>
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

      {/* ═══ SEO CONTENT FOR CRAWLERS & AI — minimal v64 ═══ */}
      {/* Plateforme PRO v64 : on garde un minimum de contenu sr-only pour les crawlers
          (transparence méthodologie + sources), sans répéter 50 paragraphes. */}
      <div className="sr-only">
        <h2>Pronostics BTTS et Over 2.5 — Afrique de l&apos;Ouest &amp; Maroc</h2>
        <p>
          BTTSPredict publie 6 pronostics BTTS &amp; Over 2.5 quotidiens pour le Sénégal, Mali,
          Côte d&apos;Ivoire, Guinée, Congo et Maroc. Données ESPN publiques. Suivi public
          depuis 2026-08-08, vérifiable après match. 18+ Jeu responsable.
        </p>
        <p>
          <strong>Méthodologie :</strong> Modèle IA nouvelle génération calibré sur la forme
          récente des équipes. Sources : ESPN et TheSportsDB. Archive horodatée, vérification
          post-match publique. Aucune garantie de gain.
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




        {/* Bloc VIP court — un seul CTA vers /vip */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <div className="p-6 sm:p-8 rounded-2xl" style={{ backgroundColor: '#111827', border: '1px solid rgba(255, 200, 87, 0.25)' }}>
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3"
                style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', color: '#FFC857' }}>
                Programme VIP
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Pronostics premium BTTS et Over 2.5
              </h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-2xl mx-auto mb-2">
                Le programme VIP propose des sélections supplémentaires et des analyses détaillées, basées sur une approche statistique probabiliste.
              </p>
              <p className="text-xs text-[#64748B] leading-relaxed max-w-2xl mx-auto">
                Aucun gain n'est garanti. Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. 18+.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="/vip" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
                style={{ backgroundColor: '#FFC857', color: '#070A14' }}
                data-cta="home-discover-vip">
                Découvrir le VIP
              </a>
            </div>
          </div>
        </section>

        {/* Jeu responsable */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <div className="p-5 rounded-2xl" style={{ backgroundColor: 'rgba(255, 113, 133, 0.06)', border: '1px solid rgba(255, 113, 133, 0.2)' }}>
            <h2 className="text-lg font-bold mb-3 text-[#EF4444]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              18+ · Jouer responsable
            </h2>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-3">
              Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez vous permettre de perdre. BTTSPredict ne prend pas de paris et ne collecte pas de fonds.
            </p>
            <a href="/jouer-responsable" className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded">
              En savoir plus sur le jeu responsable →
            </a>
          </div>
        </section>

        {/* Liens internes SEO — pages GSC qui reçoivent déjà des clics (3 clics / 2 clics / 2 clics) */}
        <section className="px-4 py-6 space-y-3 max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="/bonus-888starz" className="underline">Bonus 888Starz Sénégal</a>
            <span>·</span>
            <a href="/code-promo-linebet-senegal" className="underline">Code Promo Linebet Sénégal</a>
            <span>·</span>
            <a href="/btts-c-est-quoi" className="underline">BTTS signification</a>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>

      {/* Sticky CTA Bar — mobile only, appears after 60% scroll */}
      <StickyCTABar />
    </div>
  )
}
