import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { buildPromoFaqJsonLd } from '@/lib/promo-faq'
import { checkSeo } from '@/lib/seo'

const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const Btts221PromoClient = dynamic(() => import('@/components/bttsbet/Btts221PromoClient'), { loading: () => null })

const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz-btts221'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Code promo 888Starz btts221 : 300% worldwide'
const DESCRIPTION = 'Code promo 888Starz btts221 : bonus 300% worldwide, davantage de cashback et des bonus hebdomadaires. 18+.'

checkSeo(SLUG, TITLE, DESCRIPTION)

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
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, siteName: 'BTTSPredict', type: 'article', locale: 'fr_FR', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }] },
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
      <Btts221PromoClient lang="fr" />
      <Footer />
    </div>
  )
}
