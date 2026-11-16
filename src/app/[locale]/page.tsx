import { getStaticLocaleParams } from '@/lib/locale-route-policy'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale, translationsFor } from '@/lib/i18n'
import { getArchiveSummary } from '../historique/getArchiveSummary'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Hero = dynamic(() => import('@/components/bttsbet/Hero'), { loading: () => null })
const MatchCenter = dynamic(() => import('@/components/bttsbet/MatchCenter'), { loading: () => null })
const PerformanceDashboard = dynamic(() => import('@/components/bttsbet/PerformanceDashboard'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })

export const dynamicParams = false
export function generateStaticParams() {
  return getStaticLocaleParams('/')
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value !== 'en') return {}
  const locale = value as Locale
  const t = translationsFor(locale)
  const url = `https://bttspredict.com/${locale}`
  const title = 'BTTS Predictions Today & Over 2.5'
  const description = t.hero.subtitle
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: 'https://bttspredict.com/', en: 'https://bttspredict.com/en', 'x-default': 'https://bttspredict.com/' },
    },
    openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang.replace('-', '_') },
  }
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  if (!isLocale(value) || value !== 'en') notFound()
  const locale = value as Locale
  return (
    <div className="bp-site-page page-design page-design--home relative">
      <main id="main-content" className="relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <Navbar />
        <Hero initialLocale={locale} />
        <MatchCenter initialLocale={locale} />
        <PerformanceDashboard initialLocale={locale} archiveSummary={getArchiveSummary()} />
        <section className="bp-responsible" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-label={locale === 'ar' ? 'اللعب المسؤول' : 'Responsible play'}>
          <div>
            <p>
              {locale === 'ar'
                ? '18+ · المراهنات الرياضية تنطوي على مخاطر الخسارة. لا تراهن بأكثر مما يمكنك تحمّل خسارته.'
                : '18+ · Sports betting involves the risk of loss. Never bet more than you can afford to lose.'}
            </p>
          </div>
        </section>
        <Footer initialLocale={locale} />
      </main>
    </div>
  )
}
