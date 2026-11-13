import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale, translationsFor } from '@/lib/i18n'
import VipButtons from '@/components/bttsbet/VipButtons'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') return {}
  const locale = value as Locale
  const url = `https://bttspredict.com/${locale}/over-2-5/predictions/today`
  const title = locale === 'ar' ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today — Goal Analysis'
  const description = locale === 'ar' ? 'توقعات أكثر من 2.5 هدف للمباريات الدولية، مع تحليل إحصائي وتحديثات يومية. لا توجد ضمانات للنتائج. 18+.' : 'Over 2.5 goals predictions for international football matches, with statistical analysis and daily updates. No future result is guaranteed. 18+.'
  return {
    title, description,
    alternates: { canonical: url, languages: { fr: 'https://bttspredict.com/over-2-5/predictions/today', en: 'https://bttspredict.com/en/over-2-5/predictions/today', ar: 'https://bttspredict.com/ar/over-2-5/predictions/today', 'x-default': 'https://bttspredict.com/over-2-5/predictions/today' } },
    openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang },
  }
}

export default async function LocalizedOver25TodayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params
  if (!isLocale(value) || value === 'fr') notFound()
  const t = translationsFor(value)
  const isAr = value === 'ar'
  return (
    <div className="page-design page-design--over25 min-h-screen bg-[#080D14] flex flex-col text-[#EDF2F7]">
      <Navbar />
      <main id="main-content" className="flex-1" style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))' }}>
        <nav aria-label={t.common.home} className="text-xs text-[#9DABBB] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href={`/${value}`} className="hover:text-[#2F7DFF]">{t.common.home}</Link><span className="mx-1">/</span><span>Over 2.5 Today</span>
        </nav>
        <section className="over25-intro-section page-design__hero-wrap max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(91, 169, 255, 0.12)', color: '#2F7DFF', border: '1px solid rgba(91, 169, 255, 0.25)' }}>Over 2.5 · Total goals</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">{isAr ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today'}</h1>
          <p className="text-base sm:text-lg text-[#9DABBB] leading-relaxed mb-3 max-w-3xl mx-auto">{isAr ? 'مباريات تتوفر لها اختيارات منشورة لسوق Over 2.5 (ثلاثة أهداف على الأقل).' : "Matches with a published Over 2.5 selection (at least three total goals)."}</p>
          <p className="text-sm text-[#9DABBB] leading-relaxed max-w-3xl mx-auto">{t.legal.noGuarantee} {t.legal.eighteen}</p>
          <div className="mt-5 flex justify-center">
            <VipButtons locale={value as Locale} />
          </div>
        </section>

        <section className="over25-results-section page-design__feed max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions marketFilter="over25" />
        </section>
      </main>
      <Footer />
    </div>
  )
}
