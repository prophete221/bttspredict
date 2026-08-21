import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale, translationsFor } from '@/lib/i18n'

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
  return (
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label={t.common.home} className="text-xs text-[#B7C4C1] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href={`/${value}`} className="hover:text-[#B8FF1A]">{t.common.home}</Link><span className="mx-1">/</span><span>Over 2.5 Today</span>
        </nav>
        <section className="max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(255, 209, 102, 0.12)', color: '#B8FF1A', border: '1px solid rgba(255, 209, 102, 0.25)' }}>Over 2.5 · Total goals</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{value === 'ar' ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today'}</h1>
          <p className="text-base sm:text-lg text-[#B7C4C1] leading-relaxed mb-3 max-w-3xl mx-auto">{value === 'ar' ? 'مباريات يُتوقع أن يتجاوز فيها إجمالي الأهداف 2.5، أي ثلاثة أهداف على الأقل. يتم التحديث والتحقق من النتائج بعد المباراة.' : "Today's Over 2.5 predictions: matches where total goals are expected to exceed 2.5, meaning at least 3 goals. Updated and checked after the match."}</p>
          <p className="text-sm text-[#B7C4C1] leading-relaxed max-w-3xl mx-auto">{t.legal.noGuarantee} {t.legal.eighteen}</p>
        </section>
        <section className="max-w-5xl mx-auto px-4 pb-12"><FreePredictions /></section>
      </main>
      <Footer />
    </div>
  )
}
