import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import LinebetClient from './LinebetClient'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'
import { checkSeo } from '@/lib/seo'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-linebet-senegal'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Code promo Linebet VISION221 : offre mondiale 300 %'
const DESCRIPTION = 'Code promo Linebet VISION221 : bonus de dépôt mondial 300 %, cashback et bonus hebdomadaires. Éligibilité selon Linebet dans votre pays. 18+.'
const OPEN_GRAPH_TITLE = TITLE
const OPEN_GRAPH_DESCRIPTION = DESCRIPTION

if (process.env.NODE_ENV === 'production') checkSeo(SLUG, TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['code promo Linebet', 'code promo Linebet VISION221', 'Linebet promo code', 'code promo Linebet Sénégal', 'VISION221', 'Linebet 300% worldwide'],
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
      { '@type': 'ListItem', position: 2, name: 'Code promo Linebet VISION221', item: PAGE_URL },
    ],
  }
}

export default function CodePromoLinebetSenegalPage() {
  const faq = buildPromoFaqJsonLd('linebet', 'fr')
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg">Aller au contenu principal</a>
      <Navbar />
      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <LinebetClient />
        <PromoVerificationGuide bookmaker="linebet" lang="fr" />
      </main>
      <Footer />
    </div>
  )
}
