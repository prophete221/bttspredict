'use client'

import Link from 'next/link'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import { useLanguage } from './LanguageSwitcher'
import VipButtons from './VipButtons'

export default function LocalizedCombinedPredictionsClient() {
  const { lang } = useLanguage()
  const copy = lang === 'fr' ? {
    eyebrow: 'MARCHÉS COMBINÉS',
    title: 'BTTS & Over 2.5',
    subtitle: 'Les deux équipes marquent et au moins trois buts dans le match.',
    update: 'Sélections publiées à partir du flux de matchs disponible. Aucun résultat futur n’est garanti.',
    picks: 'MATCHS ET SÉLECTIONS',
    links: 'Explorer les marchés',
    btts: 'Pronostics BTTS',
    over: 'Over 2.5',
    scores: 'Scores exacts',
  } : lang === 'en' ? {
    eyebrow: 'COMBINED MARKETS',
    title: 'BTTS & Over 2.5',
    subtitle: 'Both teams to score, with at least three goals in the match.',
    update: 'Selections are published from the available match feed. No future result is guaranteed.',
    picks: 'MATCHES AND PICKS',
    links: 'Explore markets',
    btts: 'BTTS predictions',
    over: 'Over 2.5',
    scores: 'Correct scores',
  } : {
    eyebrow: 'الأسواق المجمعة',
    title: 'BTTS وأكثر من 2.5',
    subtitle: 'يسجل الفريقان ثلاثة أهداف على الأقل في المباراة.',
    update: 'تُنشر الاختيارات اعتماداً على بيانات المباريات المتاحة. لا توجد ضمانات للنتائج المستقبلية.',
    picks: 'المباريات والاختيارات',
    links: 'استكشف الأسواق',
    btts: 'توقعات BTTS',
    over: 'أكثر من 2.5',
    scores: 'النتائج الدقيقة',
  }
  const path = (value: string) => lang === 'fr' ? value : `/${lang}${value}`

  return (
    <div className="btp-predictions-page" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main id="main-content" className="btp-predictions-page__main">
        <header className="btp-predictions-page__header">
          <p className="btp-predictions-page__eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="btp-predictions-page__subtitle">{copy.subtitle}</p>
          <p className="btp-predictions-page__note">{copy.update}</p>
          <div className="btp-predictions-page__actions"><VipButtons /></div>
        </header>

        <section className="btp-predictions-page__feed" aria-labelledby="btp-predictions-feed-title">
          <div className="btp-predictions-page__section-head">
            <h2 id="btp-predictions-feed-title">{copy.picks}</h2>
          </div>
          <FreePredictions />
        </section>

        <nav className="btp-predictions-page__links" aria-label={copy.links}>
          <h2>{copy.links}</h2>
          <div>
            <Link href={path('/btts/predictions/today')}>{copy.btts}<span aria-hidden="true">→</span></Link>
            <Link href={path('/over-2-5/predictions/today')}>{copy.over}<span aria-hidden="true">→</span></Link>
            <Link href={path('/ai-correct-score-predictions')}>{copy.scores}<span aria-hidden="true">→</span></Link>
          </div>
        </nav>
      </main>
      <Footer />
    </div>
  )
}
