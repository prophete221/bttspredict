'use client'

import Link from 'next/link'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import { useLanguage } from './LanguageSwitcher'
import VipButtons from './VipButtons'

export default function LocalizedCombinedPredictionsClient() {
  const { lang } = useLanguage()
  const c = lang === 'fr' ? {
    badge: 'BTTS + Over 2.5 · Pronostics',
    title: 'Prédictions BTTS et Over 2.5 du jour',
    intro: 'Les matchs à venir avec un pick validé sur BTTS ou Over 2.5 sont affichés. Chaque sélection reste liée à son marché.',
    update: 'Seules les sélections validées sont affichées. Aucun résultat futur n’est garanti. 18+.',
    what: 'Qu’est-ce que BTTS + Over 2.5 ?',
    btts: 'BTTS signifie que les deux équipes marquent au moins un but. Over 2.5 signifie au moins trois buts au total.',
    why: 'Un match peut apparaître dès qu’un pick est validé sur l’un des marchés. Aucun pick n’est ajouté pour un marché sans sélection disponible.',
    links: 'Liens rapides',
    methodology: 'Voir la méthodologie →',
  } : lang === 'en' ? {
    badge: 'BTTS + Over 2.5 · Picks',
    title: 'BTTS and Over 2.5 Predictions Today',
    intro: 'Upcoming matches with a validated pick for BTTS or Over 2.5 are shown. Each selection is listed for its own market.',
    update: 'Only validated selections are shown. No future outcome is guaranteed. 18+.',
    what: 'What is BTTS + Over 2.5?',
    btts: 'BTTS means both teams score at least one goal. Over 2.5 means at least three total goals.',
    why: 'A match may appear with a pick for either market. No selection is added when a pick is unavailable.',
    links: 'Quick links',
    methodology: 'View methodology →',
  } : {
    badge: 'BTTS + Over 2.5 · التوقعات',
    title: 'توقعات BTTS وأكثر من 2.5 اليوم',
    intro: 'تظهر المباريات القادمة التي لديها اختيار موثّق لسوق BTTS أو Over 2.5. ويُعرض كل اختيار ضمن سوقه فقط.',
    update: 'تُعرض الاختيارات الموثّقة فقط. لا توجد نتيجة مستقبلية مضمونة. 18+.',
    what: 'ما هو BTTS وأكثر من 2.5؟',
    btts: 'يعني BTTS أن يسجل كلا الفريقين هدفاً واحداً على الأقل. أكثر من 2.5 يعني ثلاثة أهداف على الأقل.',
    why: 'يمكن أن تظهر المباراة عند توفر اختيار موثّق لأحد السوقين. لا يُضاف اختيار عند عدم توفره.',
    links: 'روابط سريعة',
    methodology: 'عرض المنهجية ←',
  }
  const path = (p: string) => lang === 'fr' ? p : `/${lang}${p}`

  return (
    <div lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className="bp-content-page">
      <Navbar />
      <main id="main-content" className="bp-content-page__main">
        <header className="bp-content-page__header">
          <p className="bp-content-page__eyebrow">{c.badge}</p>
          <h1>{c.title}</h1>
          <p className="bp-content-page__intro">{c.intro}</p>
          <p className="bp-content-page__note">{c.update}</p>
          <div className="bp-content-page__vip"><VipButtons /></div>
        </header>

        <section className="bp-definition" aria-labelledby="bp-definition-title">
          <div>
            <p className="bp-definition__eyebrow">{lang === 'en' ? 'THE MARKET' : lang === 'ar' ? 'السوق' : 'LE MARCHÉ'}</p>
            <h2 id="bp-definition-title">{c.what}</h2>
          </div>
          <div className="bp-definition__copy">
            <p>{c.btts}</p>
            <p>{c.why} <Link href={path('/methodologie')}>{c.methodology}</Link></p>
          </div>
        </section>

        <section className="bp-content-page__feed" aria-label={lang === 'en' ? 'Today’s match predictions' : lang === 'ar' ? 'توقعات مباريات اليوم' : 'Pronostics des matchs'}>
          <FreePredictions marketFilter="all" />
        </section>

        <nav className="bp-content-page__links" aria-label={c.links}>
          <h2>{c.links}</h2>
          <div>
            {[
              [path('/btts/predictions/today'), lang === 'en' ? 'BTTS Predictions Today' : lang === 'ar' ? 'توقعات BTTS اليوم' : 'Prédictions BTTS du jour'],
              [path('/over-2-5/predictions/today'), lang === 'en' ? 'Over 2.5 Predictions Today' : lang === 'ar' ? 'توقعات أكثر من 2.5 اليوم' : 'Prédictions Over 2.5 du jour'],
              [path('/ai-correct-score-predictions'), lang === 'en' ? 'AI Correct Score' : lang === 'ar' ? 'النتيجة الدقيقة بالذكاء الاصطناعي' : 'Score exact IA'],
            ].map(([href, label]) => <Link key={href} href={href}>{label}<span aria-hidden="true">→</span></Link>)}
          </div>
        </nav>
      </main>
      <Footer />
    </div>
  )
}
