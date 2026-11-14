import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { checkSeo } from '@/lib/seo'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Hero = dynamic(() => import('@/components/bttsbet/Hero'), { loading: () => null })
const MatchCenter = dynamic(() => import('@/components/bttsbet/MatchCenter'), { loading: () => null })
const PerformanceDashboard = dynamic(() => import('@/components/bttsbet/PerformanceDashboard'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
// Tâche 002 — Title et description SEO alignés sur le Prompt Maître.
// Title : 49 chars (limite soft 60) — description : 139 chars (limite soft 150).
// Anti-récidive: checkSeo() lance une erreur build-time si title > 60 ou desc > 150.
const TITLE = "BTTSPredict — Pronostics BTTS du jour et Over 2,5"
const DESCRIPTION = "Pronostics BTTS du jour sur des matchs internationaux, avec sélections horodatées, historique public et méthode documentée. 18+."
checkSeo('homepage', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://bttspredict.com/',
    languages: {
      fr: 'https://bttspredict.com/',
      en: 'https://bttspredict.com/en',
      ar: 'https://bttspredict.com/ar',
      'x-default': 'https://bttspredict.com/',
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com',
    siteName: 'BTTSPredict',
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US', 'ar_SA'],
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
  description: "Plateforme de sélections football BTTS, Over 2,5 et score exact pour les parieurs africains. Matchs internationaux, données publiques et historique vérifiable.",
  inLanguage: 'fr',
  publisher: {
    '@type': 'Organization',
    name: 'BTTSPredict',
    url: 'https://bttspredict.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://bttspredict.com/icon-512.png',
    },
  },
}

// JSON-LD Organization — identité éditoriale vérifiable, sans récompense ni autorité auto-déclarée.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  logo: 'https://bttspredict.com/icon-512.png',
  description: 'Site informatif consacré aux sélections BTTS, Over 2.5 et score exact sur des matchs internationaux.',
  knowsAbout: ['BTTS', 'Over 2.5', 'football', 'modèle statistique Poisson'],
  sameAs: [
    'https://twitter.com/bttspredict',
    'https://www.facebook.com/bttspredict',
    'https://www.instagram.com/bttspredict',
  ],
}

export default function Home() {
  return (
    <div className="page-design page-design--home min-h-screen bg-dark-800 relative">

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

      {/* Main Content — Plateforme football intelligence
          Structure : Header produit → Hero + Signal en vedette →
          Matchs du jour (MatchCenter) → Piliers → Performance/Historique →
          Méthode → Compétitions → Partenaire VISION221 → Jeu responsable →
          Footer. Bloc partenaire placé APRÈS la valeur produit. */}
      <main id="main-content" className="relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <ErrorBoundary><Navbar /></ErrorBoundary>
        <ErrorBoundary><Hero /></ErrorBoundary>
        <ErrorBoundary><MatchCenter /></ErrorBoundary>
        <ErrorBoundary><PerformanceDashboard /></ErrorBoundary>

        {/* Jeu responsable — compact et moderne */}
        <section className="mx-auto max-w-[980px] px-4 pb-6 sm:px-6">
          <div className="p-4 rounded-[12px] flex items-start gap-3" style={{ backgroundColor: '#191919', border: '1px solid #303030' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#63D471" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-sm text-[#A4A4A4] leading-relaxed mb-1">
                <strong className="text-[#63D471]">18+</strong> · Les paris sportifs comportent un risque de perte. Ne pariez jamais plus que ce que vous pouvez perdre.
              </p>
              <a href="/jouer-responsable" className="text-sm font-semibold text-[#63D471] underline">
                En savoir plus →
              </a>
            </div>
          </div>
        </section>

        {/* Liens internes SEO */}
        <section className="mx-auto max-w-[980px] px-4 py-4 sm:px-6">
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="/bonus-888starz" className="text-[#9DABBB] hover:text-[#2F7DFF] transition-colors">Bonus 888Starz</a>
            <span className="text-[#223041]">·</span>
            <a href="/code-promo-linebet-senegal" className="text-[#9DABBB] hover:text-[#2F7DFF] transition-colors">Code Promo Linebet</a>
            <span className="text-[#223041]">·</span>
            <a href="/btts-c-est-quoi" className="text-[#9DABBB] hover:text-[#2F7DFF] transition-colors">BTTS signification</a>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>

    </div>
  )
}
