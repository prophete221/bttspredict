import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import XbetClient from './XbetClient'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'
import { checkSeo } from '@/lib/seo'

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'code-promo-1xbet'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Code promo 1xBet vipbtts : bonus mondial 300 %'
const DESCRIPTION = 'Code promo 1xBet vipbtts : bonus de dépôt mondial de 300 %, cashback et bonus hebdomadaires. Guide du code et modalités à vérifier. 18+.'
const OPEN_GRAPH_TITLE = TITLE
const OPEN_GRAPH_DESCRIPTION = DESCRIPTION

checkSeo(SLUG, TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['code promo 1xBet', 'code promo 1xBet vipbtts', 'vipbtts', '1xBet bonus 300%'],
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
      { '@type': 'ListItem', position: 2, name: 'Code promo 1xBet vipbtts : offre mondiale 300 %', item: PAGE_URL },
    ],
  }
}

export default function CodePromo1xbetPage() {
  const faq = buildPromoFaqJsonLd('1xbet', 'fr')
  return (
    <div className="page-design page-design--promo xbt min-h-screen bg-[#080D14] flex flex-col text-[#EDF2F7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg">Aller au contenu principal</a>
      <Navbar />
      <XbetClient />
      <Footer />
    </div>
  )
}
