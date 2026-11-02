'use client'

import Link from 'next/link'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import StickyCTABar from '@/components/bttsbet/StickyCTABar'
import { useLanguage } from './LanguageSwitcher'
import AnimatedTitle from './HeroWordmark'
import VipButtons from './VipButtons'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

export default function LocalizedCombinedPredictionsClient() {
  const { lang } = useLanguage()
  const c = lang === 'fr' ? {
    badge: 'BTTS + Over 2.5 · Combiné',
    title: 'Prédictions BTTS et Over 2.5 du jour',
    intro: 'Prédictions combinées où les deux équipes marquent et où le total dépasse 2,5 buts. Ces matchs doivent satisfaire les deux critères simultanément.',
    update: 'Mise à jour quatre fois par jour. Aucun gain n’est garanti. 18+.',
    what: 'Qu’est-ce que BTTS + Over 2.5 ?',
    btts: 'BTTS signifie que les deux équipes marquent au moins un but. Over 2.5 signifie au moins trois buts au total.',
    why: 'Notre modèle statistique vérifie les buts attendus (xG) des deux équipes et le total xG, à partir des données récentes.',
    links: 'Liens rapides',
    methodology: 'Voir la méthodologie →',
    offerTitle: 'Codes promo partenaires — 300% + 100 free spins',
    offerSub: 'Inscris-toi via notre lien, entre le code exact, puis dépose selon les conditions affichées par l’opérateur. 18+.',
    cta1: 'S’inscrire 1xbet · Vipbtts',
    cta2: 'S’inscrire Linebet · VISION221',
    guide1: 'Guide code 1xbet',
    guide2: 'Guide code Linebet',
  } : lang === 'en' ? {
    badge: 'BTTS + Over 2.5 · Combined',
    title: 'BTTS and Over 2.5 Predictions Today',
    intro: 'Combined predictions where both teams score and total goals exceed 2.5. Matches must meet both criteria simultaneously.',
    update: 'Updated four times daily. No profit is guaranteed. 18+.',
    what: 'What is BTTS + Over 2.5?',
    btts: 'BTTS means both teams score at least one goal. Over 2.5 means at least three total goals.',
    why: 'Our statistical model checks both teams’ expected goals (xG) and the combined xG total, based on recent data.',
    links: 'Quick links',
    methodology: 'View methodology →',
    offerTitle: 'Partner promo codes — 300% + 100 free spins',
    offerSub: 'Sign up via our link, enter the exact code, then deposit per the operator’s displayed terms. 18+.',
    cta1: 'Sign up 1xbet · Vipbtts',
    cta2: 'Sign up Linebet · VISION221',
    guide1: '1xbet promo guide',
    guide2: 'Linebet promo guide',
  } : {
    badge: 'BTTS + Over 2.5 · معاً',
    title: 'توقعات BTTS وأكثر من 2.5 اليوم',
    intro: 'توقعات مجمعة حيث يسجل الفريقان ويتجاوز إجمالي الأهداف 2.5. يجب أن تحقق المباراة الشرطين معاً.',
    update: 'يتم التحديث أربع مرات يومياً. لا توجد ضمانات للربح. 18+.',
    what: 'ما هو BTTS وأكثر من 2.5؟',
    btts: 'يعني BTTS أن يسجل كلا الفريقين هدفاً واحداً على الأقل. أكثر من 2.5 يعني ثلاثة أهداف على الأقل.',
    why: 'يتحقق نموذجنا الإحصائي من الأهداف المتوقعة (xG) للفريقين ومجموع xG استناداً إلى البيانات الأخيرة.',
    links: 'روابط سريعة',
    methodology: 'عرض المنهجية ←',
    offerTitle: 'رموز الشركاء — 300% + 100 لفة مجانية',
    offerSub: 'سجّل عبر رابطنا، أدخل الرمز بدقة، ثم أودع وفق شروط المشغل. 18+.',
    cta1: 'سجّل 1xbet · Vipbtts',
    cta2: 'سجّل Linebet · VISION221',
    guide1: 'دليل 1xbet',
    guide2: 'دليل Linebet',
  }
  const path = (p: string) => lang === 'fr' ? p : `/${lang}${p}`

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1" style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))' }}>
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 text-[#2F7DFF] border border-[#2F7DFF55]">{c.badge}</span>
          <AnimatedTitle as="h1" text={c.title} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" />
          <p className="text-base text-[#9DABBB] leading-relaxed mb-3 max-w-3xl">{c.intro}</p>
          <p className="text-sm text-[#9DABBB]">{c.update}</p>
          <div className="mt-5"><VipButtons /></div>
        </section>

        {/* Conversion strip — above predictions, EN-first traffic (GSC) */}
        <section className="max-w-5xl mx-auto px-4 pb-6" aria-label={c.offerTitle}>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: '#101a26', borderColor: 'rgba(27, 110, 243, 0.35)' }}>
            <p className="text-sm sm:text-base font-bold mb-1" style={{ color: '#F2F6FA' }}>{c.offerTitle}</p>
            <p className="text-xs text-[#9DABBB] mb-4">{c.offerSub}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={AFFILIATE.oneXbet}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'combined-page-top')}
                data-cta="combined-signup-1xbet"
                className="rounded-xl py-3 px-4 text-center text-sm font-bold"
                style={{ backgroundColor: '#1B6EF3', color: '#FFFFFF' }}
              >
                {c.cta1}
              </a>
              <a
                href={AFFILIATE.linebet}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'combined-page-top')}
                data-cta="combined-signup-linebet"
                className="rounded-xl py-3 px-4 text-center text-sm font-bold"
                style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}
              >
                {c.cta2}
              </a>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
              <Link href={path('/code-promo-1xbet')} className="underline decoration-dotted" style={{ color: '#9CC6FF' }}>{c.guide1} →</Link>
              <Link href={path('/code-promo-linebet-senegal')} className="underline decoration-dotted" style={{ color: '#9CC6FF' }}>{c.guide2} →</Link>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="rounded-xl p-5 bg-[#141C25] border border-[#6B7A8C]">
            <h2 className="text-lg font-bold mb-3">{c.what}</h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">{c.btts}</p>
            <p className="text-sm text-[#9DABBB] leading-relaxed">{c.why} <Link href={path('/methodologie')} className="text-[#2F7DFF] underline">{c.methodology}</Link></p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3">{c.links}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              [path('/btts/predictions/today'), lang === 'en' ? 'BTTS Predictions Today' : lang === 'ar' ? 'توقعات BTTS اليوم' : 'Prédictions BTTS du jour'],
              [path('/over-2-5/predictions/today'), lang === 'en' ? 'Over 2.5 Predictions Today' : lang === 'ar' ? 'توقعات أكثر من 2.5 اليوم' : 'Prédictions Over 2.5 du jour'],
              [path('/ai-correct-score-predictions'), lang === 'en' ? 'AI Correct Score' : lang === 'ar' ? 'النتيجة الدقيقة بالذكاء الاصطناعي' : 'Score exact IA'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="p-4 rounded-xl bg-[#141C25] border border-[#6B7A8C] text-sm font-bold">{label} →</Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  )
}
