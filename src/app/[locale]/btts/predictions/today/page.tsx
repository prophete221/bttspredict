import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale } from '@/lib/i18n'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const BttsTodayDashboard = dynamic(() => import('@/components/bttsbet/BttsTodayDashboard'), { loading: () => null })

export const dynamicParams = false
export function generateStaticParams() {
  return getStaticLocaleParams('/btts/predictions/today')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value !== 'en') return {}
  const locale = value as Locale
  const url = `https://bttspredict.com/${locale}/btts/predictions/today`
  const title = 'BTTS Predictions Today — Free Football Picks'
  const description = 'Free BTTS predictions for international football matches, with statistical data, public history and responsible betting information. 18+.'
  return {
    title, description,
    alternates: { canonical: url, languages: { fr: 'https://bttspredict.com/btts/predictions/today', en: 'https://bttspredict.com/en/btts/predictions/today', 'x-default': 'https://bttspredict.com/btts/predictions/today' } },
    openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang },
  }
}

export default async function LocalizedBttsTodayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  if (!isLocale(value) || value !== 'en') notFound()

  return (
    <div className="page-design page-design--btts min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">BTTS Predictions Today</h1>
        <BttsTodayDashboard initialLocale={value as Locale} />
      </main>
      <Footer />
    </div>
  )
}
