'use client'

import {
  Navbar,
  Hero,
  SportMarquee,
  StickyVipBandeau,
  LiveTicker,
  HowItWorks,
  FreePredictions,
  PromoVip,
  VipSports,
  AviatorVip,
  WinHistory,
  FifaLinebet,
  About,
  Footer,
  CookieConsent,
  ScrollProgressBar,
  ErrorBoundary,
  MobileTabBar,
  StickyCTABar,
} from '@/components/bttsbet'

// JSON-LD WebSite — SearchAction for Google SERP
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BttsBet',
  url: 'https://bttspredict.com',
  description: "Pronostics football BTTS & Over 2,5 générés par IA. Value bets FIFA sur Linebet et 888starz. Statistiques Aviator. Code promo VISION221.",
  inLanguage: 'fr',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://bttspredict.com/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'BttsBet',
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
      name: "Comment fonctionne l'IA de BttsBet ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Notre intelligence artificielle analyse des centaines de variables en temps réel : Expected Goals (xG), forme récente, blessés, historique des confrontations, conditions météo. L'algorithme est entraîné sur plus de 50 000 matchs avec environ 52% de précision historique. Ces performances passées ne garantissent pas les résultats futurs.",
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
        text: "Nos pronostics gratuits sont générés par la même IA que nos pronostics premium. Ils couvrent les matchs les plus populaires du jour avec une analyse complète. Aucun résultat n'est garanti.",
      },
    },
    {
      '@type': 'Question',
      name: 'Peut-on prédire Aviator ou une faille de cotes FIFA ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non. Aviator est un jeu 100% aléatoire basé sur un générateur certifié 'provably fair' — aucun outil ne peut prédire un round futur. Nos statistiques Aviator observent l'historique, pas l'avenir. Les Value Bets FIFA sont des estimations statistiques, pas des garanties de gain.",
      },
    },
  ],
}

// JSON-LD Organization — E-E-A-T entity recognition
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BttsBet',
  url: 'https://bttspredict.com',
  logo: 'https://bttspredict.com/favicon.svg',
  description: "Plateforme de pronostics football BTTS & Over 2,5 basés sur l'IA. Value bets FIFA sur Linebet et 888starz. Statistiques Aviator.",
  areaServed: ['SN', 'CI', 'CM', 'ML', 'BF', 'FR'],
  knowsAbout: ['BTTS', 'Over 2.5', 'paris sportifs', 'IA', 'football', 'value bets FIFA', 'statistiques Aviator'],
}

// JSON-LD BreadcrumbList — breadcrumbs in SERP
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://bttspredict.com/' },
    { '@type': 'ListItem', position: 2, name: 'Pronostics', item: 'https://bttspredict.com/#free-predictions' },
    { '@type': 'ListItem', position: 3, name: 'VIP', item: 'https://bttspredict.com/#vip' },
    { '@type': 'ListItem', position: 4, name: 'Value Bets FIFA', item: 'https://bttspredict.com/#fifa-linebet' },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen bg-midnight relative">
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

      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-gold focus:text-midnight focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Main Content — ordre optimisé pour conversion (CRO brief section 5.11)
          Hero → Pronostics gratuits → Historique/Preuve → Coupon VIP → Multi-Sports →
          Value Bets → Aviator → Méthode IA → À propos → Témoignages (Footer) → FAQ (Footer) */}
      <main id="main-content" className="relative z-10">
        <ErrorBoundary><Navbar /></ErrorBoundary>
        <ErrorBoundary><Hero /></ErrorBoundary>
        <ErrorBoundary><LiveTicker /></ErrorBoundary>
        <ErrorBoundary><FreePredictions /></ErrorBoundary>
        <ErrorBoundary><WinHistory /></ErrorBoundary>
        <ErrorBoundary><PromoVip /></ErrorBoundary>
        <ErrorBoundary><VipSports /></ErrorBoundary>
        <ErrorBoundary><FifaLinebet /></ErrorBoundary>
        <ErrorBoundary><AviatorVip /></ErrorBoundary>
        <ErrorBoundary><HowItWorks /></ErrorBoundary>
        <ErrorBoundary><About /></ErrorBoundary>
        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>

      {/* Mobile Tab Bar — bottom navigation */}
      <MobileTabBar />

      {/* Sticky CTA Bar — mobile only, appears after 60% scroll */}
      <StickyCTABar />

      {/* Cookie Consent Banner (RGPD) */}
      <CookieConsent />
    </div>
  )
}
