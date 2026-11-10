import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { checkSeo } from '@/lib/seo'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const Star888Client = dynamic(() => import('./Star888Client'), { loading: () => null })

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Code promo 888Starz btts221 : offre mondiale 300 %'
const DESCRIPTION = 'Code promo 888Starz btts221 valable dans le monde entier : bonus de dépôt de 300 %, cashback et bonus hebdomadaires. 18+.'
const OPEN_GRAPH_TITLE = TITLE
const OPEN_GRAPH_DESCRIPTION = 'Le code 888Starz btts221 fonctionne dans le monde entier. L’offre comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. 18+.'

if (process.env.NODE_ENV === 'production') checkSeo(SLUG, TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['code promo 888Starz', 'code promo 888Starz btts221', 'bonus 888Starz', 'btts221', '888Starz 300% worldwide'],
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
  openGraph: { title: OPEN_GRAPH_TITLE, description: OPEN_GRAPH_DESCRIPTION, url: PAGE_URL, siteName: 'BTTSPredict', type: 'article', locale: 'fr_FR', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: OPEN_GRAPH_TITLE }] },
  twitter: { card: 'summary_large_image', title: OPEN_GRAPH_TITLE, description: OPEN_GRAPH_DESCRIPTION, images: ['/og-image.png'] },
}

function articleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    author: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  }
}

function breadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Code promo 888Starz btts221', item: PAGE_URL },
    ],
  }
}

export default function Bonus888StarzPage() {
  const faq = buildPromoFaqJsonLd('888starz', 'fr')
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg">Aller au contenu principal</a>
      <ErrorBoundary><Navbar /></ErrorBoundary>
      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <Star888Client />
        <PromoVerificationGuide bookmaker="888starz" lang="fr" variant="offer" />
      </main>
      <ErrorBoundary><Footer /></ErrorBoundary>
    </div>
  )
}
