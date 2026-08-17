import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { isLocale, LOCALE_META, type Locale, translationsFor } from '@/lib/i18n'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Hero = dynamic(() => import('@/components/bttsbet/Hero'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') return {}
  const locale = value as Locale
  const t = translationsFor(locale)
  const url = `https://bttspredict.com/${locale}`
  const title = locale === 'ar' ? 'منصة توقعات BTTS وOver 2.5 | BTTSPredict' : 'Global BTTS, Over 2.5 & Exact Score Predictions | BTTSPredict'
  const description = t.hero.subtitle
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { 'fr-SN': 'https://bttspredict.com/', en: 'https://bttspredict.com/en', ar: 'https://bttspredict.com/ar', 'x-default': 'https://bttspredict.com/' },
    },
    openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang.replace('-', '_') },
  }
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  const locale = isLocale(value) && value !== 'fr' ? value as Locale : 'en'
  return (
    <div className="min-h-screen bg-dark-800 relative">
      <main id="main-content" className="relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <Navbar />
        <Hero initialLocale={locale} />
        <FreePredictions initialLocale={locale} />
        <section className="max-w-[440px] mx-auto px-4 py-8">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#0D202D', border: '1px solid #23495C' }}>
            <p className="text-sm text-[#B4C4CC]">18+ · Sports betting carries risk. No future result is guaranteed.</p>
          </div>
        </section>
        <Footer initialLocale={locale} />
      </main>
    </div>
  )
}
