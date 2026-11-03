import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, LOCALE_META, type Locale, translationsFor } from '@/lib/i18n'
import VipButtons from '@/components/bttsbet/VipButtons'
import { AFFILIATE } from '@/lib/constants'
import PredictionMarketNav from '@/components/bttsbet/PredictionMarketNav'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })
const StickyCTABar = dynamic(() => import('@/components/bttsbet/StickyCTABar'), { loading: () => null })
const PartnerSignupBand = dynamic(() => import('@/components/bttsbet/PartnerSignupBand'), { loading: () => null })

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
        <PredictionMarketNav locale={value as Locale} active="over25" />
        <section className="max-w-5xl mx-auto px-4 pt-1 pb-7">
          <div className="market-hero market-hero--over25">
            <div className="market-hero__content">
              <p className="market-hero__eyebrow">{isAr ? 'Over 2.5 · مجموع الأهداف' : 'Over 2.5 · Total goals'}</p>
              <h1 className="market-hero__title">{isAr ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today'}</h1>
              <p className="market-hero__text">{isAr ? 'مباريات يُتوقع أن يتجاوز فيها إجمالي الأهداف 2.5، أي ثلاثة أهداف على الأقل. تُعرض التوقعات وفق البيانات المنشورة.' : "Today's Over 2.5 predictions: matches selected for a total of at least three goals, based on the published data."}</p>
              <p className="market-hero__meta">{t.legal.noGuarantee} {t.legal.eighteen}</p>
              <div className="mt-4"><VipButtons locale={value as Locale} /></div>
            </div>
            <aside className="market-hero__visual" aria-label={isAr ? 'قاعدة سوق Over 2.5' : 'Over 2.5 market rule'}>
              <div className="market-visual-card">
                <div className="market-visual-card__label"><span>{isAr ? 'قاعدة السوق' : 'MARKET RULE'}</span><span className="market-visual-card__mark">O2.5</span></div>
                <strong className="market-visual-card__big">3+</strong>
                <span className="market-visual-card__caption">{isAr ? 'أهداف إجمالية لتجاوز 2.5' : 'total goals to clear the 2.5 line'}</span>
                <div className="market-visual-card__scores" aria-label={isAr ? 'أمثلة على النتائج' : 'Example scorelines'}><span>2–1</span><span>3–0</span><span>1–2</span></div>
              </div>
            </aside>
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
                {isAr ? 'سجّل 1xbet · vipbtts' : isEn ? 'Sign up 1xbet · vipbtts' : 'S’inscrire 1xbet · vipbtts'}
              </a>
              <a href={AFFILIATE.linebet} target="_blank" rel="sponsored nofollow noopener noreferrer" data-cta="over25-signup-linebet" className="rounded-xl py-3 px-4 text-center text-sm font-bold" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
                {isAr ? 'سجّل Linebet · VISION221' : isEn ? 'Sign up Linebet · VISION221' : 'S’inscrire Linebet · VISION221'}
              </a>
            </div>
          </div>
        </section>

        <PartnerSignupBand locale={value as Locale} />
        <section className="page-design__feed max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  )
}
