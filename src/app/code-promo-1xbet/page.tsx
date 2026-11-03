import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { checkSeo } from '@/lib/seo'
import BookmakerPromoPage from '@/components/promo/BookmakerPromoPage'
import BookmakersStrip from '@/components/promo/BookmakersStrip'

/* ────────────────────────────────────────────────────────────────────────────
   Page code promo 1xBet — Vipbtts (casse exacte fournie par la campagne).
   Partenaire prioritaire (avec Linebet). Offre annoncée : 300% de bonus +
   100 free spins, sans condition de mise, dès 1 € de dépôt.
   Nouvelle page 2026-11 — URLs additionnelles, aucune URL existante modifiée.
   ──────────────────────────────────────────────────────────────────────────── */
const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-1xbet'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const CURRENT_YEAR = new Date().getUTCFullYear()
const REVIEW_DATE = new Date().toISOString().slice(0, 10)

// SEO — title court (43 chars) + description <150.
// Anti-récidive : checkSeo() lance une erreur build-time si title > 60 ou desc > 150.
const TITLE = 'Code promo 1xBet Vipbtts : 300% + 100 spins'
const DESCRIPTION = `Code promo 1xBet Vipbtts : 300% de bonus + 100 free spins, sans condition de mise, dès 1 € de dépôt. Guide ${CURRENT_YEAR}, 18+.`
checkSeo('code-promo-1xbet', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'code promo 1xbet', '1xbet promo code', 'vipbtts', 'code vipbtts', '1xbet bonus',
    'bonus 1xbet', `code promo 1xbet ${CURRENT_YEAR}`, '1xbet inscription', '1xbet senegal',
    '1xbet afrique ouest', '1xbet maroc', '1xbet mali', '1xbet cote d\'ivoire', '1xbet guinee',
    '1xbet apk', 'application 1xbet', '1xbet 300 bonus', '1xbet free spins',
    '1xbet bonus sans condition de mise', '1xbet wave', '1xbet orange money',
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
    publishedTime: '2026-11-03',
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

/* ─── JSON-LD — Article + Breadcrumb + HowTo + FAQPage ─── */
function articleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    datePublished: '2026-11-03',
    dateModified: REVIEW_DATE,
    author: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
    inLanguage: 'fr',
  }
}

function breadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Codes promo', item: `${SITE_URL}/code-promo-linebet-senegal` },
      { '@type': 'ListItem', position: 3, name: 'Code promo 1xBet Vipbtts', item: PAGE_URL },
    ],
  }
}

function howToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Utiliser le code promo 1xBet Vipbtts en ${CURRENT_YEAR}`,
    description: DESCRIPTION,
    totalTime: 'PT3M',
    step: [
      {
        '@type': 'HowToStep', position: 1, name: 'S’inscrire via le lien affilié',
        text: 'Cliquez sur « S’inscrire sur 1xBet » et créez votre compte gratuit en deux minutes avec un e-mail ou un numéro de téléphone.',
      },
      {
        '@type': 'HowToStep', position: 2, name: 'Saisir le code Vipbtts',
        text: 'Dans le champ « Code promo » du formulaire d’inscription, collez le code Vipbtts exactement comme affiché.',
      },
      {
        '@type': 'HowToStep', position: 3, name: 'Déposer dès 1 €',
        text: 'Effectuez un premier dépôt à partir de 1 € avec Mobile Money, Wave, Orange Money, carte bancaire ou crypto, selon les moyens disponibles dans votre pays.',
      },
      {
        '@type': 'HowToStep', position: 4, name: 'Recevoir 300% de bonus + 100 free spins',
        text: 'Le bonus de 300% et les 100 free spins, sans condition de mise, sont crédités selon l’offre affichée par 1xBet. Vérifiez les conditions actuelles pour votre pays.',
      },
    ],
  }
}

function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quel est le code promo 1xBet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le code promo 1xBet est Vipbtts — à saisir exactement comme affiché (respect de la casse) lors de l’inscription ou dans la section « Code Promo » de votre compte.',
        },
      },
      {
        '@type': 'Question',
        name: `Que donne le code Vipbtts en ${CURRENT_YEAR} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le code Vipbtts donne 300% de bonus et 100 free spins, sans condition de mise, dès 1 € de dépôt — offre annoncée par la campagne partenaire. Vérifiez l’offre affichée par 1xBet pour votre pays avant tout dépôt.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment télécharger l’application 1xBet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'L’APK Android officiel se télécharge depuis le lien dédié de cette page. L’installation prend deux minutes ; autorisez l’installation depuis « Sources inconnues » si Android le demande.',
        },
      },
      {
        '@type': 'Question',
        name: 'Le bonus 1xBet est-il valable dans tous les pays ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La disponibilité du code et de l’offre dépend du pays, du compte et de la période. Vérifiez votre éligibilité et les conditions actuellement affichées par 1xBet avant toute inscription ou dépôt.',
        },
      },
    ],
  }
}

export default function CodePromo1xBetPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <BookmakerPromoPage bookmaker="1xbet" reviewDate={REVIEW_DATE} />
        <BookmakersStrip />
      </main>

      <ErrorBoundary><Footer /></ErrorBoundary>
    </div>
  )
}
