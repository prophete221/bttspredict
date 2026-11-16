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
    intro: 'Seuls les matchs avec un pick public validé sur BTTS et un autre sur Over 2.5 sont affichés. Un match avec un seul des deux picks reste exclu.',
    update: 'Aucun pronostic n’est calculé localement pour compléter un marché manquant. Aucun résultat futur n’est garanti. 18+.',
    what: 'Qu’est-ce que BTTS + Over 2.5 ?',
    btts: 'BTTS signifie que les deux équipes marquent au moins un but. Over 2.5 signifie au moins trois buts au total.',
    why: 'La page exige deux sélections distinctes et validées. Elle n’infère pas localement le marché manquant.',
    links: 'Liens rapides',
    methodology: 'Voir la méthodologie →',
  } : lang === 'en' ? {
    badge: 'BTTS + Over 2.5 · Combined',
    title: 'BTTS and Over 2.5 Predictions Today',
    intro: 'Only matches with a validated public pick for BTTS and another for Over 2.5 are shown. A match with just one of the two picks is excluded.',
    update: 'No local prediction is calculated to fill a missing market. No future outcome is guaranteed. 18+.',
    what: 'What is BTTS + Over 2.5?',
    btts: 'BTTS means both teams score at least one goal. Over 2.5 means at least three total goals.',
    why: 'This page requires two separate validated selections. It does not infer the missing market locally.',
    links: 'Quick links',
    methodology: 'View methodology →',
  } : {
    badge: 'BTTS + Over 2.5 · معاً',
    title: 'توقعات BTTS وأكثر من 2.5 اليوم',
    intro: 'تظهر فقط المباريات التي لديها اختيار عام موثّق لسوق BTTS واختيار آخر لسوق Over 2.5. تُستبعد المباراة إذا توفر اختيار واحد فقط.',
    update: 'لا نحسب محلياً توقعاً لإكمال سوق مفقود. لا توجد نتيجة مستقبلية مضمونة. 18+.',
    what: 'ما هو BTTS وأكثر من 2.5؟',
    btts: 'يعني BTTS أن يسجل كلا الفريقين هدفاً واحداً على الأقل. أكثر من 2.5 يعني ثلاثة أهداف على الأقل.',
    why: 'تتطلب هذه الصفحة اختيارين منفصلين وموثقين، ولا تستنتج محلياً السوق المفقود.',
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
          <FreePredictions marketFilter="combined" />
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
