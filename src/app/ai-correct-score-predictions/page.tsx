'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

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
    <div className="min-h-screen bg-[#080B12] flex flex-col text-[#F7F4EE]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#9BA7B8] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#5B7FA3]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9BA7B8]">AI Correct Score</span>
        </nav>

        <section className="max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(99, 214, 255, 0.12)', color: '#5B7FA3', border: '1px solid rgba(99, 214, 255, 0.25)' }}>
            AI · Correct Score · Poisson Model
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            AI Correct Score Predictions
          </h1>
          <p className="text-base sm:text-lg text-[#9BA7B8] leading-relaxed mb-3 max-w-3xl mx-auto">
            Most likely exact scores computed by the Poisson model from each team&apos;s expected goals (xG). The top 5 scorelines are shown per match, ranked by probability.
          </p>
          <p className="text-sm text-[#9BA7B8] leading-relaxed max-w-3xl mx-auto">
            Aucun gain n&apos;est garanti. These are statistical probabilities, not certainties. 18+.
          </p>
        </section>

        {/* League filter */}
        <section className="max-w-5xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {leagues.map(league => (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                aria-pressed={activeLeague === league}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeLeague === league
                    ? 'bg-[#5B7FA3]/15 text-[#5B7FA3] border border-[#5B7FA3]/30'
                    : 'bg-[#111722] text-[#9BA7B8] border border-[#3A4556] hover:text-[#9BA7B8]'
                }`}
              >
                {league === 'all' ? 'All Leagues' : league}
              </button>
            ))}
          </div>
        </section>

        {/* Predictions table */}
        <section className="max-w-5xl mx-auto px-4 pb-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-xl h-48 animate-pulse" style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }}>
              <p className="text-sm text-[#9BA7B8]">No matches available today.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {filtered.map((m, i) => (
                <div key={`${m.home}-${m.away}-${i}`} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: '#080B12', borderBottom: '1px solid #3A4556' }}>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#9BA7B8] truncate">{m.league}</span>
                    <span className="text-[10px] font-mono text-[#9BA7B8]">{m.time}</span>
                  </div>
                  {/* Teams */}
                  <div className="px-3 py-3">
                    <div className="text-center mb-3">
                      <span className="text-sm font-bold text-[#F7F4EE]">{m.home}</span>
                      <span className="text-[#5B7FA3] mx-2 font-mono text-xs">vs</span>
                      <span className="text-sm font-bold text-[#F7F4EE]">{m.away}</span>
                    </div>
                    {/* Top 5 scores */}
                    <div className="space-y-1.5">
                      {m.topScores.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-[#9BA7B8] w-4">#{idx + 1}</span>
                            <span className="text-sm font-bold font-mono" style={{ color: idx === 0 ? '#5B7FA3' : '#F7F4EE' }}>{s.score}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-1 ml-3">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#080B12' }}>
                              <div className="h-full rounded-full" style={{ width: `${s.prob * 100}%`, backgroundColor: idx === 0 ? '#5B7FA3' : '#5B7FA3' }} />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#9BA7B8] tabular-nums">{(s.prob * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* xG info */}
                    <div className="mt-3 pt-2 border-t border-[#3A4556] flex justify-between text-[9px] text-[#9BA7B8]">
                      <span>xG Home: <strong className="text-[#9BA7B8] font-mono">{m.lambdaHome.toFixed(2)}</strong></span>
                      <span>xG Away: <strong className="text-[#9BA7B8] font-mono">{m.lambdaAway.toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Explanation */}
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How AI Correct Score works
            </h2>
            <p className="text-sm text-[#9BA7B8] leading-relaxed mb-3">
              The Poisson model calculates the probability of each exact scoreline from the expected goals (xG) of both teams. For each team, the probability of scoring <em>k</em> goals follows a Poisson distribution: P(k) = (λᵏ × e⁻λ) / k!
            </p>
            <p className="text-sm text-[#9BA7B8] leading-relaxed mb-3">
              The probability of a specific score (e.g. 2-1) is P(home=2) × P(away=1). We compute all 49 combinations (0-0 through 6-6) and rank the top 5 most likely scores.
            </p>
            <p className="text-xs text-[#9BA7B8] leading-relaxed">
              ⚠ Correct score betting is high-risk. Even the most likely score typically has only 8-15% probability. These predictions are statistical estimates, not guarantees. 18+.
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }}>
              <div className="text-sm font-bold text-[#F7F4EE]">BTTS Predictions Today →</div>
              <div className="text-xs text-[#9BA7B8] mt-1">Both teams to score</div>
            </Link>
            <Link href="/over-2-5/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }}>
              <div className="text-sm font-bold text-[#F7F4EE]">Over 2.5 Predictions Today →</div>
              <div className="text-xs text-[#9BA7B8] mt-1">Total goals ≥ 3</div>
            </Link>
            <Link href="/btts-and-over-2-5-predictions-today" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }}>
              <div className="text-sm font-bold text-[#F7F4EE]">BTTS + Over 2.5 Combined →</div>
              <div className="text-xs text-[#9BA7B8] mt-1">Both conditions met</div>
            </Link>
            <Link href="/methodologie" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#111722', border: '1px solid #3A4556' }}>
              <div className="text-sm font-bold text-[#F7F4EE]">Methodology →</div>
              <div className="text-xs text-[#9BA7B8] mt-1">How the model works</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
