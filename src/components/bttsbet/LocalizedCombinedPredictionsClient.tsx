'use client'

import Link from 'next/link'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import { useLanguage } from './LanguageSwitcher'
import VipButtons from './VipButtons'

export default function LocalizedCombinedPredictionsClient() {
  const { lang } = useLanguage()
  const c = lang === 'fr' ? {
    badge: 'BTTS + Over 2.5 · Combiné',
    title: 'Prédictions BTTS et Over 2.5 du jour',
    intro: 'Cette page affiche uniquement les matchs disposant d’une sélection BTTS et d’une sélection Over 2,5.',
    update: 'Estimations statistiques uniquement. Aucun résultat n’est garanti. 18+.',
    what: 'Qu’est-ce que BTTS + Over 2.5 ?',
    btts: 'BTTS signifie que les deux équipes marquent au moins un but. Over 2.5 signifie au moins trois buts au total.',
    why: 'Les deux marchés sont affichés séparément avec leurs estimations respectives.',
    links: 'Autres analyses',
    methodology: 'Voir la méthodologie →',
  } : lang === 'en' ? {
    badge: 'BTTS + Over 2.5 · Combined',
    title: 'BTTS and Over 2.5 Predictions Today',
    intro: 'This page lists only matches with both a BTTS selection and an Over 2.5 selection.',
    update: 'Statistical estimates only. No result is guaranteed. 18+.',
    what: 'What is BTTS + Over 2.5?',
    btts: 'BTTS means both teams score at least one goal. Over 2.5 means at least three total goals.',
    why: 'Both markets are displayed separately with their respective estimates.',
    links: 'Other analysis pages',
    methodology: 'View methodology →',
  } : {
    badge: 'BTTS + Over 2.5 · معاً',
    title: 'توقعات BTTS وأكثر من 2.5 اليوم',
    intro: 'تعرض هذه الصفحة المباريات التي تتوفر لها اختيارات BTTS وOver 2.5 معاً.',
    update: 'تقديرات إحصائية فقط. لا توجد نتيجة مضمونة. 18+.',
    what: 'ما هو BTTS وأكثر من 2.5؟',
    btts: 'يعني BTTS أن يسجل كلا الفريقين هدفاً واحداً على الأقل. أكثر من 2.5 يعني ثلاثة أهداف على الأقل.',
    why: 'يُعرض كل سوق بشكل منفصل مع التقدير الخاص به.',
    links: 'صفحات تحليل أخرى',
    methodology: 'عرض المنهجية ←',
  }
  const path = (p: string) => lang === 'fr' ? p : `/${lang}${p}`

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1" style={{ paddingBottom: 'calc(140px + env(safe-area-inset-bottom, 0px))' }}>
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 text-[#2F7DFF] border border-[#2F7DFF55]">{c.badge}</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">{c.title}</h1>
          <p className="text-base text-[#9DABBB] leading-relaxed mb-3 max-w-3xl">{c.intro}</p>
          <p className="text-sm text-[#9DABBB]">{c.update}</p>
          <div className="mt-5"><VipButtons /></div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="rounded-xl p-5 bg-[#141C25] border border-[#6B7A8C]">
            <h2 className="text-lg font-bold mb-3">{c.what}</h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">{c.btts}</p>
            <p className="text-sm text-[#9DABBB] leading-relaxed">{c.why} <Link href={path('/methodologie')} className="text-[#2F7DFF] underline">{c.methodology}</Link></p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions marketFilter="combined" />
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3">{c.links}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              [path('/btts/predictions/today'), lang === 'en' ? 'BTTS Predictions Today' : lang === 'ar' ? 'توقعات BTTS اليوم' : 'Prédictions BTTS du jour'],
              [path('/over-2-5/predictions/today'), lang === 'en' ? 'Over 2.5 Predictions Today' : lang === 'ar' ? 'توقعات أكثر من 2.5 اليوم' : 'Prédictions Over 2.5 du jour'],
              [path('/ai-correct-score-predictions'), lang === 'en' ? 'Correct Score Estimates' : lang === 'ar' ? 'تقديرات النتيجة الدقيقة' : 'Estimations de score exact'],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="p-4 rounded-xl bg-[#141C25] border border-[#6B7A8C] text-sm font-bold">{label} →</Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
