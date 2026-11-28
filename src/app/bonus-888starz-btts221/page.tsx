import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'
import PromoVerificationGuide from '@/components/bttsbet/PromoVerificationGuide'

const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const Btts221PromoClient = dynamic(() => import('@/components/bttsbet/Btts221PromoClient'), { loading: () => null })

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz-btts221'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Code 888Starz btts221 : où le saisir et vérifier l’offre'
const DESCRIPTION = 'Où saisir le code 888Starz btts221 ? Suivez les étapes pour repérer le champ promo, vérifier l’application du code et consulter les conditions. 18+.'
const OPEN_GRAPH_TITLE = TITLE
const OPEN_GRAPH_DESCRIPTION = 'Guide 888Starz btts221 : où saisir le code, comment vérifier son application et quelles conditions consulter avant de l’utiliser. 18+.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['code promo 888Starz btts221', '888Starz btts221', 'code btts221', '888Starz promo code', '888Starz 300% worldwide'],
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

export default function Bonus888StarzBtts221Page() {
  const faq = buildPromoFaqJsonLd('888starz', 'fr')
  return (
    <div className="min-h-screen bg-dark-800 text-papier">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <a href="#star888-title" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg">Aller directement au code 888Starz btts221</a>
      <nav aria-label="Navigation de cette page" className="mx-auto max-w-5xl px-5 pt-5">
        <a href="/bonus-888starz" className="text-emerald underline underline-offset-4">Vous cherchez l’offre 888Starz ? Consultez la page dédiée à l’offre.</a>
      </nav>
      <Btts221PromoClient lang="fr" />
      <PromoVerificationGuide bookmaker="888starz" lang="fr" variant="code" />
      <Footer />
    </div>
  )
}
