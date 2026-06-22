'use client'

import {
  Navbar,
  Hero,
  FreePredictions,
  PromoVip,
  VipSports,
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

// JSON-LD Organization — strengthens E-E-A-T entity recognition
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BttsBet',
  url: 'https://bttsbet.online',
  logo: 'https://bttsbet.online/favicon.svg',
  description: "Plateforme de pronostics football BTTS & Over 2,5 basés sur l'IA. Détection automatique de la Faille FIFA sur Linebet et 888starz.",
  sameAs: [
    'https://wa.me/15406704172',
  ],
  areaServed: ['SN', 'CI', 'CM', 'ML', 'BF', 'FR'],
  knowsAbout: ['BTTS', 'Over 2.5', 'paris sportifs', 'IA', 'football', 'faille FIFA'],
}

// JSON-LD BreadcrumbList — breadcrumbs in SERP
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://bttsbet.online/' },
    { '@type': 'ListItem', position: 2, name: 'Pronostics', item: 'https://bttsbet.online/#free-predictions' },
    { '@type': 'ListItem', position: 3, name: 'VIP', item: 'https://bttsbet.online/#vip' },
    { '@type': 'ListItem', position: 4, name: 'Faille FIFA', item: 'https://bttsbet.online/#fifa-linebet' },
  ],
}

// JSON-LD SportsEvent — signals sports betting content to Googlebot
// Static sample events derived from FIFA coupon (cote 10.74, fiabilité 98%)
const sportsEventsJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SportsEvent',
      name: 'Coupon FIFA — Faille FIFA Linebet & 888starz',
      sport: 'Soccer',
      startDate: new Date().toISOString(),
      location: { '@type': 'Place', name: 'International' },
      homeTeam: { '@type': 'SportsTeam', name: 'FIFA Match 1' },
      awayTeam: { '@type': 'SportsTeam', name: 'FIFA Match 2' },
      description: "Coupon FIFA exclusif détecté par l'IA BttsBet — cote totale 10.74, fiabilité 98%. Faille FIFA identifiée automatiquement sur Linebet et 888starz.",
      offers: {
        '@type': 'Offer',
        name: 'Code promo VISION221',
        description: 'Bonus exclusif Linebet 150$ / 888starz 100% sur premier dépôt',
        url: 'https://bttsbet.online/#fifa-linebet',
      },
    },
    {
      '@type': 'SportsEvent',
      name: 'Pronostics BTTS & Over 2.5 du jour',
      sport: 'Soccer',
      startDate: new Date().toISOString(),
      location: { '@type': 'Place', name: 'International' },
      description: "Pronostics BTTS et Over 2.5 générés par IA avec ~87% de précision historique sur plus de 50 000 matchs analysés.",
      url: 'https://bttsbet.online/#free-predictions',
    },
    {
      '@type': 'SportsEvent',
      name: 'VIP Tennis — ATP / WTA',
      sport: 'Tennis',
      startDate: new Date().toISOString(),
      description: "Pronostics VIP Tennis (ATP, WTA, Grand Chelem) — gagnant, over/under games, set 1. Cotes exclusives via IA BttsBet.",
      url: 'https://bttsbet.online/#vip-tennis',
    },
    {
      '@type': 'SportsEvent',
      name: 'VIP NBA — Basket professionnel',
      sport: 'Basketball',
      startDate: new Date().toISOString(),
      description: "Pronostics VIP NBA et EuroLeague — vainqueur, over/under points, player props. Algorithme IA BttsBet.",
      url: 'https://bttsbet.online/#vip-nba',
    },
    {
      '@type': 'SportsEvent',
      name: 'VIP UFC / MMA — Combats',
      sport: 'MMA',
      startDate: new Date().toISOString(),
      description: "Pronostics VIP UFC et MMA — vainqueur, méthode de victoire, round. IA BttsBet spécialisée combat.",
      url: 'https://bttsbet.online/#vip-ufc',
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
      {/* JSON-LD BreadcrumbList — helps Google show breadcrumbs in SERP */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* JSON-LD SportsEvent — signals sports betting content to Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventsJsonLd) }}
      />
      {/* JSON-LD Organization — strengthens entity recognition for E-E-A-T */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
        <VipSports />
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
