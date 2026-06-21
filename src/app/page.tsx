'use client'

import {
  Navbar,
  Hero,
  FreePredictions,
  PromoVip,
  WinHistory,
  FifaLinebet,
  Footer,
  CookieConsent,
  AgeVerification,
  FloatingElements,
  CursorEffect,
  ScrollProgressBar,
} from '@/components/bttsbet'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BttsBet',
  url: 'https://bttsbet.online',
  description: "Pronostics football BTTS & Over 2,5 générés par IA. Faille FIFA détectée automatiquement sur Linebet et 888starz. Code promo VISION221.",
  inLanguage: 'fr',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://bttsbet.online/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'BttsBet',
    url: 'https://bttsbet.online',
    logo: {
      '@type': 'ImageObject',
      url: 'https://bttsbet.online/favicon.svg',
    },
  },
}

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
      name: "Comment fonctionne l'IA de BttsBet ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Notre intelligence artificielle analyse des centaines de variables en temps réel : Expected Goals (xG), forme récente, blessés, historique des confrontations, conditions météo. L'algorithme est entraîné sur plus de 50 000 matchs avec environ 87% de précision.",
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
        text: "Oui, nos pronostics gratuits sont générés par la même IA que nos pronostics premium. Ils couvrent les matchs les plus populaires du jour avec une analyse complète.",
      },
    },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-900 relative">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      {/* Floating Elements Layer */}
      <FloatingElements />

      {/* Cursor Glow Effect */}
      <CursorEffect />

      {/* Scroll Progress Bar — premium platform feel */}
      <ScrollProgressBar />

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        <Navbar />
        <Hero />
        <FreePredictions />
        <PromoVip />
        <WinHistory />
        <FifaLinebet />
        <Footer />
      </main>

      {/* Age Verification Modal (18+) */}
      <AgeVerification />

      {/* Cookie Consent Banner (RGPD) */}
      <CookieConsent />
    </div>
  )
}
