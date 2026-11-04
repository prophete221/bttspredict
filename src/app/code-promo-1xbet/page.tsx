import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictionsWidget, VipCardWidget } from '@/components/bttsbet'
import XbetClient from './XbetClient'
import { checkSeo } from '@/lib/seo'
import { PROMO_CURRENT_YEAR, PROMO_REVIEW_DATE } from '@/lib/promo-build-date.generated'

/* ──────────────────────────────────────────────────────────────
   Page /code-promo-1xbet — partenaire 1xbet (code vipbtts)
   Offre annoncée par la campagne : 300% + 100 free spins,
   sans condition de mise (uniformisée avec les 3 autres partenaires).
   SEO : page FR autonome + versions EN/AR sous /en/ et /ar/
   (hreflang déclarés dans alternates.languages).
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-1xbet'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const CURRENT_YEAR = PROMO_CURRENT_YEAR
const REVIEW_DATE = PROMO_REVIEW_DATE

// SEO — title court (48 chars) + description courte (<150).
// Avec le template "%s | BTTSPredict" (14 chars), le title rendu final
// fait 48 + 14 = 62 chars, sous la limite hard 70.
// Anti-récidive : checkSeo() lance une erreur build-time si title > 60 ou desc > 150.
const TITLE = 'Code promo 1xbet vipbtts : 300% + 100 free spins'
const DESCRIPTION = `Code promo 1xbet vipbtts : 300% de bonus + 100 free spins, sans condition de mise. Guide ${CURRENT_YEAR}, 18+.`
checkSeo(SLUG, TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'code promo 1xbet', '1xbet promo code', `code promo 1xbet ${CURRENT_YEAR}`, 'vipbtts',
    'bonus 1xbet 300', '1xbet bonus inscription', '1xbet 100 free spins', '1xbet free spins',
    '1xbet bonus sans condition de mise', 'code bonus 1xbet', '1xbet inscription',
    '1xbet senegal', '1xbet cote d\'ivoire', '1xbet mali', '1xbet maroc',
    'code vipbtts 1xbet', 'promo code 1xbet vipbtts',
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: {
      fr: PAGE_URL,
      en: `${SITE_URL}/en/${SLUG}`,
      ar: `${SITE_URL}/ar/${SLUG}`,
      'x-default': PAGE_URL,
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'article',
    locale: 'fr_FR',
    publishedTime: '2026-11-02',
    modifiedTime: REVIEW_DATE,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

/* ──────────────────────────────────────────────────────────────
   JSON-LD — Article + Breadcrumb + HowTo + FAQPage
   ────────────────────────────────────────────────────────────── */
function buildArticleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    datePublished: '2026-11-02',
    dateModified: REVIEW_DATE,
    author: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  }
}

function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Code Promo 1xbet', item: PAGE_URL },
    ],
  }
}

function buildHowToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment utiliser le code promo 1xbet vipbtts',
    description: "Guide pour activer l'offre 1xbet avec le code vipbtts : 300% de bonus + 100 free spins, sans condition de mise. Vérifie les conditions affichées par l'opérateur.",
    totalTime: 'PT5M',
    supply: [{ '@type': 'HowToSupply', name: 'Code promo vipbtts' }],
    tool: [
      { '@type': 'HowToTool', name: 'Application 1xbet ou site web' },
      { '@type': 'HowToTool', name: 'Moyen de paiement disponible selon le pays (Wave, Orange Money, MTN…)' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: "S'inscrire sur 1xbet via le lien de parrainage",
        text: 'Clique sur le lien d\'inscription 1xbet, crée ton compte gratuit en 2 minutes avec ton email ou ton numéro.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Saisir le code promo vipbtts',
        text: "Pendant l'inscription ou dans la section « Code Promo » de ton compte, colle exactement vipbtts, en respectant la casse.",
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Effectuer le premier dépôt',
        text: 'Effectue un premier dépôt avec le moyen de paiement disponible dans ton pays (Wave, Orange Money, MTN, carte…). Vérifie le montant minimum affiché par 1xbet.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Recevoir 300% de bonus + 100 free spins',
        text: "Les 300% de bonus et les 100 free spins, sans condition de mise, sont crédités selon l'offre affichée par 1xbet. Vérifie les conditions actuelles pour ton pays.",
      },
    ],
  }
}

function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quel est le code promo 1xbet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le code promo 1xbet est vipbtts — à recopier exactement tel quel lors de l'inscription ou dans la section « Code Promo » de ton compte 1xbet.",
        },
      },
      {
        '@type': 'Question',
        name: `Que donne le code vipbtts en ${CURRENT_YEAR} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le code vipbtts donne 300% de bonus + 100 free spins, sans condition de mise — offre annoncée par la campagne partenaire. Vérifie l'offre affichée par 1xbet pour ton pays avant tout dépôt.",
        },
      },
      {
        '@type': 'Question',
        name: 'Où saisir le code vipbtts sur 1xbet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Saisis vipbtts dans le champ « Code promo » du formulaire d'inscription 1xbet, ou plus tard dans ton compte, section « Code Promo ». Respecte la casse exacte.",
        },
      },
      {
        '@type': 'Question',
        name: '1xbet ou Linebet : quel code promo choisir ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Les deux sont nos partenaires officiels et annoncent la même offre : 300% de bonus + 100 free spins sans condition de mise, avec vipbtts (1xbet) comme avec VISION221 (Linebet, dès 1 € de dépôt). Choisis selon le bookmaker que tu préfères utiliser.",
        },
      },
      {
        '@type': 'Question',
        name: 'Le bonus 1xbet est-il valable dans tous les pays ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La disponibilité du code et de l'offre dépend du pays, du compte et de la période. Vérifie ton éligibilité et les conditions actuellement affichées par 1xbet avant toute inscription ou dépôt.",
        },
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function CodePromo1xbetPage() {
  return (
    <div className="xbt min-h-screen bg-dark-800 flex flex-col text-papier">
      {/* Structured Data — Article + Breadcrumb + HowTo + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHowToJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd()) }}
      />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <Navbar />

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <XbetClient />

        {/* Pronostics gratuits + VIP — visibles sur toutes les pages */}
        <FreePredictionsWidget />
        <VipCardWidget />
      </main>

      <Footer />
    </div>
  )
}
