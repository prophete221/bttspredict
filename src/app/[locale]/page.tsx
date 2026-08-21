import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { isLocale, LOCALE_META, type Locale, translationsFor } from '@/lib/i18n'
import { AFFILIATE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Hero = dynamic(() => import('@/components/bttsbet/Hero'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const AffiliateSignupCta = dynamic(() => import('@/components/bttsbet/AffiliateSignupCta'), { loading: () => null })

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') return {}
  const locale = value as Locale
  const t = translationsFor(locale)
  const url = `https://bttspredict.com/${locale}`
  const title = locale === 'ar' ? 'توقعات BTTS اليوم وأكثر من 2.5' : 'BTTS Predictions Today & Over 2.5'
  const description = t.hero.subtitle
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: 'https://bttspredict.com/', en: 'https://bttspredict.com/en', ar: 'https://bttspredict.com/ar', 'x-default': 'https://bttspredict.com/' },
    },
    openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang.replace('-', '_') },
  }
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  const locale = isLocale(value) && value !== 'fr' ? value as Locale : 'en'
  const affiliateCopy = locale === 'ar'
    ? { title: 'التسجيل عبر Linebet', description: 'استخدم الرابط الرسمي وأدخل الرمز VISION221 وفقاً للشروط المعروضة من Linebet.', cta: 'التسجيل مع VISION221' }
    : { title: 'Register through Linebet', description: 'Use the partner link and enter VISION221 according to the terms displayed by Linebet.', cta: 'Register with VISION221' }
  return (
    <div className="min-h-screen bg-dark-800 relative">
      <main id="main-content" className="relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <Navbar />
        <Hero initialLocale={locale} />
        <FreePredictions initialLocale={locale} />
        <nav aria-label={locale === 'ar' ? 'روابط التوقعات' : 'Prediction resources'} className="max-w-[980px] mx-auto px-4 py-6 sm:px-6">
          <div className="grid gap-2 sm:grid-cols-3">
            <a href={`/${locale}/btts/predictions/today`} className="rounded-xl px-4 py-3 text-sm font-semibold transition-colors" style={{ backgroundColor: '#0D1722', border: '1px solid #324758', color: '#F3F7FA' }}>
              {locale === 'ar' ? 'توقعات BTTS اليوم' : 'Today’s BTTS predictions'}
            </a>
            <a href={`/${locale}/methodologie`} className="rounded-xl px-4 py-3 text-sm font-semibold transition-colors" style={{ backgroundColor: '#0D1722', border: '1px solid #324758', color: '#F3F7FA' }}>
              {locale === 'ar' ? 'المنهجية ومصادر البيانات' : 'Methodology and data sources'}
            </a>
            <a href={`/${locale}/resultats-verifies`} className="rounded-xl px-4 py-3 text-sm font-semibold transition-colors" style={{ backgroundColor: '#0D1722', border: '1px solid #324758', color: '#F3F7FA' }}>
              {locale === 'ar' ? 'النتائج الموثقة' : 'Verified prediction results'}
            </a>
          </div>
        </nav>
        <section className="max-w-[980px] mx-auto px-4 pb-6 sm:px-6">
          <div className="rounded-2xl p-5 sm:p-6" style={{ backgroundColor: '#0D1722', border: '1px solid rgba(184, 255, 26, 0.28)' }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#F3F7FA' }}>{affiliateCopy.title}</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: '#A8B5C3' }}>{affiliateCopy.description}</p>
              </div>
              <AffiliateSignupCta
                href={AFFILIATE.linebet}
                partner="linebet"
                placement={`locale-${locale}-hero-signup`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold"
                style={{ backgroundColor: '#B8FF1A', color: '#071018' }}
              >
                {affiliateCopy.cta}
              </AffiliateSignupCta>
            </div>
          </div>
        </section>
        <section className="max-w-[440px] mx-auto px-4 py-8">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
            <p className="text-sm text-[#B7C4C1]">18+ · Sports betting carries risk. No future result is guaranteed.</p>
          </div>
        </section>
        <Footer initialLocale={locale} />
      </main>
    </div>
  )
}
