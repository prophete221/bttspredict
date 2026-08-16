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
const CURRENT_YEAR = new Date().getUTCFullYear()
const REVIEW_DATE = new Date().toISOString().slice(0, 10)
const TITLE = `Code promo 888Starz ${CURRENT_YEAR} : bonus VISION221`
const DESCRIPTION = `Code promo 888Starz ${CURRENT_YEAR} : VISION221, inscription et conditions du bonus selon le pays. Guide vérifié, affiliation signalée, 18+.`
checkSeo('bonus-888starz', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'code promo 888starz', '888starz promo code', `bonus 888starz ${CURRENT_YEAR}`, '888starz bonus',
    'code 888starz', 'vision221', '888starz senegal', 'code promo 888starz senegal',
    '888starz mali', '888starz maroc', '888starz cote d\'ivoire', '888starz guinee', '888starz congo',
    '888starz wave', '888starz orange money', 'inscription 888starz',
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
    locale: 'fr_SN',
    publishedTime: '2026-07-06',
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
    dateModified: REVIEW_DATE,
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
        name: 'Vérifier les conditions du premier dépôt',
        text: "Consulte les conditions affichées par 888Starz pour le premier dépôt et choisis un moyen de paiement disponible dans ton pays.",
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
        name: 'Quel est le code promo 888Starz ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le code présenté sur cette page est VISION221. Saisissez-le en majuscules et vérifiez son acceptation pendant l'inscription.",
        },
      },
      {
        '@type': 'Question',
        name: `Quel est le bonus 888Starz en ${CURRENT_YEAR} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Les montants, conditions et critères d’éligibilité du bonus 888Starz peuvent varier selon le pays et la période. Consulte l’offre actuellement affichée par l’opérateur avant toute inscription ou dépôt. Le code présenté sur cette page est VISION221.",
        },
      },
      {
        '@type': 'Question',
        name: 'Comment utiliser VISION221 ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Ouvrez le lien d'inscription, créez votre compte, saisissez VISION221 dans le champ prévu puis vérifiez les conditions du premier dépôt et du bonus affichées pour votre pays.",
        },
      },
      {
        '@type': 'Question',
        name: 'Le code fonctionne-t-il dans tous les pays ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La disponibilité peut dépendre du pays, du compte et de la période. Vérifiez votre éligibilité directement auprès de 888Starz avant de déposer.",
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
        <Star888Client reviewDate={REVIEW_DATE} />

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
