import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictionsWidget, VipCardWidget, LinebetApkButton } from '@/components/bttsbet'
import LinebetClient from './LinebetClient'
import { checkSeo } from '@/lib/seo'

/* ──────────────────────────────────────────────────────────────
   Metadata — SEO Afrique Ouest & Maroc
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-linebet-senegal'
const PAGE_URL = `${SITE_URL}/${SLUG}`

// SEO Bing — title court (41 chars) + description courte (117 chars).
// Avec le template "%s | BTTSPredict" (14 chars), le title rendu final
// fait 41 + 14 = 55 chars, bien sous la limite hard 70.
// Anti-récidive: checkSeo() lance une erreur build-time si title > 60 ou desc > 150.
const TITLE = 'Code Promo Linebet VISION221 : 90 000 XOF'
const DESCRIPTION = "Code VISION221 Linebet: 90 000 XOF pour Sénégal Mali CIV Guinée Congo Maroc. Dépôt Wave Orange Money dès 200 XOF. 18+"
checkSeo('code-promo-linebet-senegal', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  // `title: TITLE` (pas `{ absolute: ... }`) — laisse le template du layout
  // ajouter " | BTTSPredict" automatiquement.
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'code promo linebet', 'linebet senegal', 'bonus linebet', 'vision221', 'linebet wave',
    'linebet orange money', 'code promo linebet senegal', 'bonus 90000 xof', 'linebet inscription',
    'depot linebet senegal', 'linebet free money', 'paris sportifs senegal',
    // SEO v60 — cible Afrique de l'Ouest & Maroc
    'code promo linebet afrique ouest', 'linebet maroc', 'linebet mali', 'linebet cote d\'ivoire',
    'linebet guinee', 'linebet congo',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'article',
    locale: 'fr_SN',
    publishedTime: '2026-07-06',
    modifiedTime: '2026-08-09',
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
    datePublished: '2026-07-06',
    dateModified: '2026-08-09',
    author: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
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
      { '@type': 'ListItem', position: 2, name: 'Code Promo Linebet Afrique Ouest & Maroc', item: PAGE_URL },
    ],
  }
}

function buildHowToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment utiliser le code promo Linebet VISION221 en Afrique de l\'Ouest & Maroc',
    description: "Guide complet pour activer le bonus Linebet de 90 000 XOF (150$) avec le code promo VISION221 au Sénégal, Mali, Côte d'Ivoire, Guinée, Congo et Maroc.",
    totalTime: 'PT5M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'XOF', value: '200' },
    supply: [{ '@type': 'HowToSupply', name: 'Code promo VISION221' }],
    tool: [
      { '@type': 'HowToTool', name: 'Application Linebet ou site web' },
      { '@type': 'HowToTool', name: 'Wave, Orange Money, MTN, Moov ou Free Money' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: "S'inscrire sur Linebet via le lien de parrainage",
        text: "Clique sur le lien d'inscription Linebet, crée ton compte gratuit en 2 minutes avec ton email ou ton numéro.",
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Saisir le code promo VISION221',
        text: "Pendant l'inscription ou dans la section « Code Promo » de ton compte, colle exactement VISION221 en majuscules.",
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Effectuer un premier dépôt dès 200 XOF',
        text: "Dépose via Wave, Orange Money, MTN, Moov ou Free Money. Le dépôt est instantané.",
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Recevoir le bonus 90 000 XOF',
        text: "Le bonus de 90 000 XOF (environ 150$) est activé automatiquement sur ton premier dépôt après validation du code VISION221.",
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
        name: 'Quel est le code promo Linebet Afrique Ouest ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le code promo exclusif est VISION221 — saisi en majuscules lors de l'inscription ou dans la section « Code Promo » de ton compte. Il débloque un bonus de 90 000 XOF (~150$) sur ton premier dépôt, valable pour le Sénégal, le Mali, la Côte d'Ivoire, la Guinée, le Congo et le Maroc.",
        },
      },
      {
        '@type': 'Question',
        name: 'Comment déposer avec Wave sur Linebet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Sélectionne Wave dans la section Dépôt de Linebet, entre le montant (minimum 200 XOF), valide avec ton code secret Wave. Le dépôt est instantané. Le bonus VISION221 est activé automatiquement sur le premier dépôt, quel que soit le moyen utilisé.",
        },
      },
      {
        '@type': 'Question',
        name: "Le bonus est-il valable au Maroc, Mali et Côte d'Ivoire ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui. Le code VISION221 fonctionne pour les 6 pays couverts : Sénégal, Mali, Côte d'Ivoire, Guinée, Congo et Maroc. Le bonus de 90 000 XOF (ou équivalent dans ta devise locale) est crédité après validation du code promo et du premier dépôt.",
        },
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function CodePromoLinebetSenegalPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
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
        <LinebetClient />

        {/* Pronostics gratuits + VIP + APK — visibles sur toutes les pages */}
        <FreePredictionsWidget />
        <VipCardWidget />
        <div className="text-center pb-6">
          <LinebetApkButton />
        </div>
      </main>

      <Footer />
    </div>
  )
}
