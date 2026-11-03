'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { translationsFor, localizedPath } from '@/lib/i18n'
import PredictionMarketNav from '@/components/bttsbet/PredictionMarketNav'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })

// ─── Poisson correct score computation ───────────────────────────────────────
// P(home=i, away=j) = PoissonP(i, lambdaHome) * PoissonP(j, lambdaAway)
// where PoissonP(k, lambda) = (lambda^k * e^(-lambda)) / k!

function poissonP(k: number, lambda: number): number {
  return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k)
}

function factorial(n: number): number {
  if (n <= 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

interface ScorePrediction {
  home: string
  away: string
  league: string
  date: string
  time: string
  homeLogo?: string
  awayLogo?: string
  lambdaHome: number
  lambdaAway: number
  topScores: { score: string; prob: number }[]
}

function computeTopScores(lambdaHome: number, lambdaAway: number, topN = 5): { score: string; prob: number }[] {
  const scores: { score: string; prob: number }[] = []
  for (let i = 0; i <= 6; i++) {
    for (let j = 0; j <= 6; j++) {
      const prob = poissonP(i, lambdaHome) * poissonP(j, lambdaAway)
      scores.push({ score: `${i}-${j}`, prob })
    }
  }
  scores.sort((a, b) => b.prob - a.prob)
  return scores.slice(0, topN)
}

export default function AICorrectScorePage() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const [predictions, setPredictions] = useState<ScorePrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLeague, setActiveLeague] = useState<string>('all')

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const arr = data?.free || data?.predictions || []
        const scored: ScorePrediction[] = arr.map((m: any) => {
          const lh = m.homeLambda || m.xgHome || 1.3
          const la = m.awayLambda || m.xgAway || 1.1
          return {
            home: m.home,
            away: m.away,
            league: m.league || '',
            date: m.date,
            time: m.time || '--:--',
            homeLogo: m.homeLogo,
            awayLogo: m.awayLogo,
            lambdaHome: lh,
            lambdaAway: la,
            topScores: computeTopScores(lh, la, 5),
          }
        })
        setPredictions(scored)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const leagues = ['all', ...Array.from(new Set(predictions.map(p => p.league))).slice(0, 10)]
  const filtered = activeLeague === 'all' ? predictions : predictions.filter(p => p.league === activeLeague)

  return (
    <div className="page-design page-design--score min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label={lang === 'en' ? 'Breadcrumb' : lang === 'ar' ? 'مسار التنقل' : "Fil d'Ariane"} className="text-xs text-[#9DABBB] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href={lang === 'fr' ? '/' : `/${lang}`} className="hover:text-[#2F7DFF]">{t.common.home}</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9DABBB]">{lang === 'fr' ? 'Score exact IA' : lang === 'ar' ? 'النتيجة الدقيقة بالذكاء الاصطناعي' : 'AI Correct Score'}</span>
        </nav>

        <PredictionMarketNav locale={lang} active="score" />
        <section className="max-w-5xl mx-auto px-4 pt-1 pb-6">
          <div className="market-hero market-hero--score">
            <div className="market-hero__content">
              <p className="market-hero__eyebrow">{lang === 'fr' ? 'ANALYSE · SCORE EXACT · MODÈLE STATISTIQUE' : lang === 'en' ? 'ANALYSIS · CORRECT SCORE · STATISTICAL MODEL' : 'تحليل · النتيجة الدقيقة · نموذج إحصائي'}</p>
              <h1 className="market-hero__title">{lang === 'fr' ? 'Prédictions de score exact par IA' : lang === 'en' ? 'AI Correct Score Predictions' : 'توقعات النتيجة الدقيقة بالذكاء الاصطناعي'}</h1>
              <p className="market-hero__text">{lang === 'fr' ? 'Les scores exacts sont classés par le modèle à partir des buts attendus de chaque équipe. Les cinq scores les plus probables sont affichés pour chaque match.' : lang === 'en' ? 'The model ranks exact scorelines using each team’s expected goals. The five most likely scores are shown for each match.' : 'يرتب النموذج النتائج الدقيقة اعتماداً على الأهداف المتوقعة لكل فريق. نعرض النتائج الخمس الأكثر احتمالاً لكل مباراة.'}</p>
              <p className="market-hero__meta">{t.legal.noGuarantee} {lang === 'fr' ? 'Ce sont des probabilités, pas des certitudes.' : lang === 'en' ? 'These are probabilities, not certainties.' : 'هذه احتمالات وليست يقيناً.'} {t.legal.eighteen}</p>
              <div className="market-hero__actions">
                <a href="#exact-score-board" className="market-hero__primary">{lang === 'fr' ? 'Explorer les matchs' : lang === 'en' ? 'Explore matches' : 'استكشف المباريات'} <span aria-hidden="true">↓</span></a>
                <Link href={localizedPath('/methodologie', lang)} className="market-hero__secondary">{lang === 'fr' ? 'Méthode' : lang === 'en' ? 'Method' : 'المنهجية'}</Link>
              </div>
            </div>
            <aside className="market-hero__visual" aria-label={lang === 'fr' ? 'Fonctionnement du calcul' : lang === 'en' ? 'How the score model works' : 'طريقة حساب النتائج'}>
              <div className="market-visual-card">
                <div className="market-visual-card__label"><span>{lang === 'fr' ? 'DISTRIBUTION DE SCORES' : lang === 'en' ? 'SCORE DISTRIBUTION' : 'توزيع النتائج'}</span><span className="market-visual-card__mark">POISSON</span></div>
                <strong className="market-visual-card__big">49</strong>
                <span className="market-visual-card__caption">{lang === 'fr' ? 'combinaisons évaluées par match' : lang === 'en' ? 'score combinations evaluated per match' : 'تركيبة نتيجة تُقيّم لكل مباراة'}</span>
                <div className="market-visual-card__rule" />
                <div className="market-visual-card__footer"><span>λ {lang === 'fr' ? 'domicile / extérieur' : lang === 'en' ? 'home / away' : 'صاحب الأرض / الضيف'}</span><span>TOP 5</span></div>
              </div>
            </aside>
          </div>
        </section>

        {/* League filter */}
        <section className="max-w-5xl mx-auto px-4 pb-4">
          <div className="score-filters flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {leagues.map(league => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                aria-pressed={activeLeague === league}
                className={`score-filter px-3 py-2 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeLeague === league
                    ? 'bg-[#2F7DFF]/15 text-[#2F7DFF] border border-[#2F7DFF]/30'
                    : 'bg-[#141C25] text-[#9DABBB] border border-[#6B7A8C] hover:text-[#9DABBB]'
                }`}
              >
                {league === 'all' ? t.predictions.leagues : league}
              </button>
            ))}
          </div>
        </section>

        {/* Predictions table */}
        <section id="exact-score-board" className="max-w-5xl mx-auto px-4 pb-8 scroll-mt-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-xl h-48 animate-pulse" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <p className="text-sm text-[#9DABBB]">{lang === 'fr' ? 'Aucun match disponible aujourd’hui.' : lang === 'en' ? 'No matches available today.' : 'لا توجد مباريات متاحة اليوم.'}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {filtered.map((m, i) => (
                <div key={`${m.home}-${m.away}-${i}`} className="score-card">
                  {/* Header */}
                  <div className="score-card__head">
                    <span className="score-card__league">{m.league}</span>
                    <span className="score-card__time">{m.time}</span>
                  </div>
                  {/* Teams */}
                  <div className="score-card__body">
                    <div className="score-card__teams">
                      <div className="score-card__team">{m.homeLogo ? <img src={m.homeLogo} alt="" loading="lazy" decoding="async" /> : <span className="score-card__crest">{m.home.slice(0, 2).toUpperCase()}</span>}<span>{m.home}</span></div>
                      <span className="score-card__vs">VS</span>
                      <div className="score-card__team score-card__team--away">{m.awayLogo ? <img src={m.awayLogo} alt="" loading="lazy" decoding="async" /> : <span className="score-card__crest">{m.away.slice(0, 2).toUpperCase()}</span>}<span>{m.away}</span></div>
                    </div>
                    {/* Top 5 scores */}
                    <div className="score-card__scores">
                      {m.topScores.map((s, idx) => (
                        <div key={idx} className={`score-card__row${idx === 0 ? ' is-top' : ''}`}>
                          <div className="score-card__rank">
                            <span className="score-card__rank-no">{String(idx + 1).padStart(2, '0')}</span>
                            <span className="score-card__score">{s.score}</span>
                          </div>
                          <div className="score-card__probability">
                            <div className="score-card__bar" role="img" aria-label={`${(s.prob * 100).toFixed(1)}%`}>
                              <span style={{ width: `${s.prob * 100}%`, opacity: idx === 0 ? 1 : 0.52 }} />
                            </div>
                            <span className="score-card__percent">{(s.prob * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Buts attendus modélisés (λ du modèle Poisson, source ESPN) */}
                    <div className="score-card__model" title={lang === 'en' ? 'Modeled expected goals (λ): recent real goals averages (ESPN) converted through a Poisson model. Not provider xG.' : lang === 'ar' ? 'أهداف متوقعة نمذجة (λ) من متوسطات أهداف حقيقية حديثة (ESPN) عبر نموذج بواسون. ليست xG من مزود.' : 'Buts attendus modélisés (λ) : moyennes de buts récents (ESPN) converties en modèle Poisson. Pas des xG de fournisseur.'}>
                      <span>λ {lang === 'fr' ? 'Domicile' : lang === 'en' ? 'Home' : 'المضيف'} <strong>{m.lambdaHome.toFixed(2)}</strong></span>
                      <span>λ {lang === 'fr' ? 'Extérieur' : lang === 'en' ? 'Away' : 'الضيف'} <strong>{m.lambdaAway.toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Explanation */}
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {lang === 'fr' ? 'Comment fonctionne le score exact IA' : lang === 'en' ? 'How AI Correct Score works' : 'كيف تعمل توقعات النتيجة الدقيقة'}
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              {lang === 'fr' ? <>Le modèle de Poisson calcule la probabilité de chaque score exact à partir des buts attendus (xG) des deux équipes. Pour chaque équipe, la probabilité de marquer <em>k</em> buts suit une distribution de Poisson.</> : lang === 'en' ? <>The Poisson model calculates the probability of each exact scoreline from both teams’ expected goals (xG). For each team, the probability of scoring <em>k</em> goals follows a Poisson distribution.</> : <>يحسب نموذج بواسون احتمال كل نتيجة دقيقة من الأهداف المتوقعة للفريقين. احتمال تسجيل <em>k</em> أهداف يتبع توزيع بواسون.</>}
            </p>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              {lang === 'fr' ? 'La probabilité d’un score précis comme 2-1 est le produit des probabilités de buts des deux équipes. Nous calculons 49 combinaisons et classons les cinq scores les plus probables.' : lang === 'en' ? 'The probability of a specific score such as 2-1 is P(home=2) × P(away=1). We compute 49 combinations from 0-0 to 6-6 and rank the five most likely scores.' : 'احتمال نتيجة محددة مثل 2-1 هو حاصل ضرب احتمال أهداف صاحب الأرض والضيف. نحسب 49 تركيبة ونرتب النتائج الخمس الأكثر احتمالاً.'}
            </p>
            <p className="text-xs text-[#9DABBB] leading-relaxed">
              {lang === 'fr' ? '⚠ Les paris sur le score exact comportent un risque élevé. Même le score le plus probable ne représente généralement que 8 à 15 %. Ces estimations ne sont pas des garanties. 18+.' : lang === 'en' ? '⚠ Correct-score betting is high-risk. Even the most likely score typically has only 8–15% probability. These are estimates, not guarantees. 18+.' : '⚠ المراهنة على النتيجة الدقيقة عالية المخاطر. حتى النتيجة الأكثر احتمالاً تكون عادة بين 8 و15%. هذه تقديرات وليست ضمانات. 18+.'}
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>{t.common.quickLinks}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href={localizedPath('/btts/predictions/today', lang)} className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">{lang === 'fr' ? 'Prédictions BTTS du jour →' : lang === 'en' ? 'BTTS Predictions Today →' : 'توقعات BTTS اليوم ←'}</div>
              <div className="text-xs text-[#9DABBB] mt-1">{lang === 'fr' ? 'Les deux équipes marquent' : lang === 'en' ? 'Both teams to score' : 'كلا الفريقين يسجلان'}</div>
            </Link>
            <Link href={localizedPath('/over-2-5/predictions/today', lang)} className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">{lang === 'fr' ? 'Prédictions Over 2.5 du jour →' : lang === 'en' ? 'Over 2.5 Predictions Today →' : 'توقعات Over 2.5 اليوم ←'}</div>
              <div className="text-xs text-[#9DABBB] mt-1">{lang === 'fr' ? 'Total de buts ≥ 3' : lang === 'en' ? 'Total goals ≥ 3' : 'إجمالي الأهداف ≥ 3'}</div>
            </Link>
            <Link href={localizedPath('/btts-and-over-2-5-predictions-today', lang)} className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">{lang === 'fr' ? 'BTTS + Over 2.5 combiné →' : lang === 'en' ? 'BTTS + Over 2.5 Combined →' : 'BTTS + Over 2.5 معاً ←'}</div>
              <div className="text-xs text-[#9DABBB] mt-1">{lang === 'fr' ? 'Les deux conditions réunies' : lang === 'en' ? 'Both conditions met' : 'تحقق الشرطان'}</div>
            </Link>
            <Link href={localizedPath('/methodologie', lang)} className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">{lang === 'fr' ? 'Méthodologie →' : lang === 'en' ? 'Methodology →' : 'المنهجية ←'}</div>
              <div className="text-xs text-[#9DABBB] mt-1">{lang === 'fr' ? 'Fonctionnement du modèle' : lang === 'en' ? 'How the model works' : 'كيف يعمل النموذج'}</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
