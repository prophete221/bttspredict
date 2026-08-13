import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { checkSeo } from '@/lib/seo'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const Star888Client = dynamic(() => import('./Star888Client'), { loading: () => null })

/* ──────────────────────────────────────────────────────────────
   Metadata — Code Promo 888Starz Afrique v64.1
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz'
const PAGE_URL = `${SITE_URL}/${SLUG}`

// SEO Bing — title court (39 chars) + description courte (128 chars).
// Avec le template "%s | BTTSPredict" (14 chars), le title rendu fait
// 39 + 14 = 53 chars, bien sous la limite hard 70.
const TITLE = 'Code Promo 888Starz VISION221 Afrique | BTTSPredict'
const DESCRIPTION = "Guide du code promo 888Starz VISION221 : inscription, code copiable et conditions à vérifier auprès de l'opérateur. 18+ et affiliation signalée."
checkSeo('bonus-888starz', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'code promo 888starz', 'bonus 888starz', 'vision221', '888starz senegal',
    '888starz bonus', 'code promo 888starz senegal', 'guide code 888starz', '888starz afrique ouest',
    '888starz maroc', '888starz mali', '888starz cote d\'ivoire',
    '888starz wave', '888starz orange money', 'depot 888starz senegal',
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
   JSON-LD — Article + Breadcrumb + FAQPage + HowTo
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
      { '@type': 'ListItem', position: 2, name: 'Code Promo 888Starz Afrique', item: PAGE_URL },
    ],
  }
}

function buildHowToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment utiliser le code promo 888Starz VISION221 en Afrique',
    description: "Guide complet pour activer un bonus 888Starz avec le code VISION221 au Sénégal, Mali, Côte d'Ivoire, Guinée, Congo et Maroc. Les conditions et montants peuvent évoluer.",
    totalTime: 'PT5M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'XOF', value: '200' },
    supply: [{ '@type': 'HowToSupply', name: 'Code promo VISION221' }],
    tool: [
      { '@type': 'HowToTool', name: 'Application 888Starz ou site web' },
      { '@type': 'HowToTool', name: 'Wave, Orange Money, MTN ou Moov' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: "S'inscrire sur 888Starz via le lien de parrainage",
        text: "Clique sur le lien d'inscription 888Starz, crée ton compte gratuit en 2 minutes.",
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Saisir le code promo VISION221',
        text: "Pendant l'inscription ou dans la section « Code Promo » de ton compte, colle exactement VISION221.",
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Effectuer un premier dépôt dès 200 XOF',
        text: "Dépose via Wave, Orange Money, MTN ou Moov. Le dépôt est instantané.",
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Recevoir le bonus',
        text: "Les conditions et montants des offres promotionnelles peuvent évoluer. Consultez les conditions actuellement affichées par l'opérateur avant toute inscription ou dépôt.",
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
        name: 'Quel est le code promo 888Starz Afrique ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le code promo est VISION221 — saisi en majuscules lors de l'inscription. Les conditions du bonus, les montants disponibles et les critères d'éligibilité peuvent évoluer. Vérifiez toujours les conditions actuellement affichées par l'opérateur avant toute inscription ou dépôt. Le code est valable pour le Sénégal, le Mali, la Côte d'Ivoire, la Guinée, le Congo et le Maroc.",
        },
      },
      {
        '@type': 'Question',
        name: 'Comment déposer avec Wave sur 888Starz ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Sélectionne Wave dans la section Dépôt de 888Starz, entre le montant (minimum 200 XOF), valide avec ton code secret Wave. Le dépôt est instantané. Le bonus VISION221 est activé automatiquement sur le premier dépôt.",
        },
      },
      {
        '@type': 'Question',
        name: 'Le bonus 888Starz est-il valable au Maroc, Mali et Côte d\'Ivoire ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui. Le code VISION221 fonctionne pour les 6 pays couverts : Sénégal, Mali, Côte d'Ivoire, Guinée, Congo et Maroc. Les conditions et montants du bonus peuvent évoluer ; vérifiez les conditions actuellement affichées par l'opérateur avant toute inscription ou dépôt.",
        },
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function Bonus888StarzPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      {/* Structured Data */}
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

      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <Star888Client />

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
