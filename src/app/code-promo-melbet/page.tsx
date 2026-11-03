import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { checkSeo } from '@/lib/seo'
import BookmakerPromoPage from '@/components/promo/BookmakerPromoPage'
import BookmakersStrip from '@/components/promo/BookmakersStrip'

/* ────────────────────────────────────────────────────────────────────────────
   Page code promo Melbet — Bttswin (casse exacte fournie par la campagne).
   Aucun montant de bonus n'est communiqué par la campagne Melbet : la page
   reste factuelle (« offre affichée lors de l'inscription ») — rien d'inventé.
   Nouvelle page 2026-11 — URLs additionnelles, aucune URL existante modifiée.
   ──────────────────────────────────────────────────────────────────────────── */
const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-melbet'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const CURRENT_YEAR = new Date().getUTCFullYear()
const REVIEW_DATE = new Date().toISOString().slice(0, 10)

// SEO — title court (46 chars) + description <150.
const TITLE = 'Code promo Melbet Bttswin : bonus de bienvenue'
const DESCRIPTION = `Code promo Melbet Bttswin : activez le bonus de bienvenue Melbet dès 1 € de dépôt. Code vérifié manuellement, guide d'inscription ${CURRENT_YEAR}, 18+.`
checkSeo('code-promo-melbet', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'code promo melbet', 'melbet promo code', 'bttswin', 'code bttswin', 'melbet bonus',
    'bonus melbet', `code promo melbet ${CURRENT_YEAR}`, 'melbet inscription', 'melbet senegal',
    'melbet afrique ouest', 'melbet maroc', 'melbet mali', 'melbet cote d\'ivoire', 'melbet guinee',
    'melbet apk', 'application melbet', 'melbet wave', 'melbet orange money',
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
      { '@type': 'ListItem', position: 3, name: 'Code promo Melbet Bttswin', item: PAGE_URL },
    ],
  }
}

function howToJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Utiliser le code promo Melbet Bttswin en ${CURRENT_YEAR}`,
    description: DESCRIPTION,
    totalTime: 'PT3M',
    step: [
      {
        '@type': 'HowToStep', position: 1, name: 'S’inscrire via le lien affilié',
        text: 'Cliquez sur « S’inscrire sur Melbet » et créez votre compte gratuit en deux minutes avec un e-mail ou un numéro de téléphone.',
      },
      {
        '@type': 'HowToStep', position: 2, name: 'Saisir le code Bttswin',
        text: 'Dans le champ « Code promo » du formulaire d’inscription, collez le code Bttswin exactement comme affiché.',
      },
      {
        '@type': 'HowToStep', position: 3, name: 'Déposer dès 1 €',
        text: 'Effectuez un premier dépôt à partir de 1 € avec Mobile Money, Wave, Orange Money, carte bancaire ou crypto, selon les moyens disponibles dans votre pays.',
      },
      {
        '@type': 'HowToStep', position: 4, name: 'Recevoir le bonus de bienvenue',
        text: 'Le bonus de bienvenue est crédité selon l’offre affichée par Melbet sur votre compte. Vérifiez les conditions actuelles pour votre pays avant tout dépôt.',
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
        name: 'Quel est le code promo Melbet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le code promo Melbet est Bttswin — à saisir exactement comme affiché (respect de la casse) lors de l’inscription ou dans la section « Code Promo » de votre compte.',
        },
      },
      {
        '@type': 'Question',
        name: `Que donne le code Bttswin en ${CURRENT_YEAR} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le code Bttswin active l’offre de bienvenue affichée par Melbet lors de votre premier dépôt, dès 1 €. Le montant et les conditions exacts sont affichés par l’opérateur — vérifiez-les avant tout dépôt.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment télécharger l’application Melbet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'L’APK Android officiel se télécharge depuis le lien dédié de cette page. L’installation prend deux minutes ; autorisez l’installation depuis « Sources inconnues » si Android le demande.',
        },
      },
      {
        '@type': 'Question',
        name: 'Le bonus Melbet est-il valable dans tous les pays ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La disponibilité du code et de l’offre dépend du pays, du compte et de la période. Vérifiez votre éligibilité et les conditions actuellement affichées par Melbet avant toute inscription ou dépôt.',
        },
      },
    ],
  }
}

export default function CodePromoMelbetPage() {
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
        <BookmakerPromoPage bookmaker="melbet" reviewDate={REVIEW_DATE} />
        <BookmakersStrip />
      </main>

      <ErrorBoundary><Footer /></ErrorBoundary>
    </div>
  )
}
