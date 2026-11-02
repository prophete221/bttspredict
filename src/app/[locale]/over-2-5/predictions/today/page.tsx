import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale, translationsFor } from '@/lib/i18n'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'
import VipButtons from '@/components/bttsbet/VipButtons'
import { AFFILIATE } from '@/lib/constants'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })
const StickyCTABar = dynamic(() => import('@/components/bttsbet/StickyCTABar'), { loading: () => null })

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
  const isEn = value === 'en'
  const isAr = value === 'ar'
  return (
    <div className="page-design page-design--over25 min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1" style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))' }}>
        <nav aria-label={t.common.home} className="text-xs text-[#9DABBB] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href={`/${value}`} className="hover:text-[#2F7DFF]">{t.common.home}</Link><span className="mx-1">/</span><span>Over 2.5 Today</span>
        </nav>
        <section className="page-design__hero-wrap max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(91, 169, 255, 0.12)', color: '#2F7DFF', border: '1px solid rgba(91, 169, 255, 0.25)' }}>Over 2.5 · Total goals</span>
          <AnimatedTitle as="h1" text={isAr ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today'} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }} />
          <p className="text-base sm:text-lg text-[#9DABBB] leading-relaxed mb-3 max-w-3xl mx-auto">{isAr ? 'مباريات يُتوقع أن يتجاوز فيها إجمالي الأهداف 2.5، أي ثلاثة أهداف على الأقل. يتم التحديث والتحقق من النتائج بعد المباراة.' : "Today's Over 2.5 predictions: matches where total goals are expected to exceed 2.5, meaning at least 3 goals. Updated and checked after the match."}</p>
          <p className="text-sm text-[#9DABBB] leading-relaxed max-w-3xl mx-auto">{t.legal.noGuarantee} {t.legal.eighteen}</p>
          <div className="mt-5 flex justify-center">
            <VipButtons locale={value as Locale} />
          </div>
        </section>

        {/* Conversion strip — no SEO title change, only conversion CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-6" aria-label="Partner promo codes">
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: '#101a26', borderColor: 'rgba(27, 110, 243, 0.35)' }}>
            <p className="text-sm sm:text-base font-bold mb-1" style={{ color: '#F2F6FA' }}>
              {isAr ? 'رموز الشركاء — 300% + 100 لفة مجانية' : isEn ? 'Partner promo codes — 300% + 100 free spins' : 'Codes promo — 300% + 100 free spins'}
            </p>
            <p className="text-xs text-[#9DABBB] mb-4">
              {isAr ? 'سجّل عبر رابطنا، أدخل الرمز بدقة. 18+.' : isEn ? 'Sign up via our link and enter the exact code. 18+.' : 'Inscris-toi via notre lien et entre le code exact. 18+.'}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <a href={AFFILIATE.oneXbet} target="_blank" rel="sponsored nofollow noopener noreferrer" data-cta="over25-signup-1xbet" className="rounded-xl py-3 px-4 text-center text-sm font-bold" style={{ backgroundColor: '#1B6EF3', color: '#FFFFFF' }}>
                {isAr ? 'سجّل 1xbet · Vipbtts' : isEn ? 'Sign up 1xbet · Vipbtts' : 'S’inscrire 1xbet · Vipbtts'}
              </a>
              <a href={AFFILIATE.linebet} target="_blank" rel="sponsored nofollow noopener noreferrer" data-cta="over25-signup-linebet" className="rounded-xl py-3 px-4 text-center text-sm font-bold" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
                {isAr ? 'سجّل Linebet · VISION221' : isEn ? 'Sign up Linebet · VISION221' : 'S’inscrire Linebet · VISION221'}
              </a>
            </div>
          </div>
        </section>

        <section className="page-design__feed max-w-5xl mx-auto px-4 pb-12"><FreePredictions /></section>
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  )
}
