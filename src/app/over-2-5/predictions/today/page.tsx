import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })

const TITLE = "Over 2.5 Predictions Today — AI Goal Analysis"
const DESCRIPTION = "Today's Over 2.5 goals predictions. AI-powered football tips where total match goals exceed 2.5. Free, updated 4x daily, verified post-match. 18+."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/over-2-5/predictions/today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com/over-2-5/predictions/today',
    type: 'website',
  },
}

export default function Over25PredictionsTodayPage() {
  return (
    <div className="min-h-screen bg-[#131314] flex flex-col text-[#f0f4f9]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#9ca3af] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#22c55e]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9ca3af]">Over 2.5 Today</span>
        </nav>

        <section className="max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(255, 209, 102, 0.12)', color: '#f59e0b', border: '1px solid rgba(255, 209, 102, 0.25)' }}>
            Over 2.5 · Plus de 2,5 buts
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Over 2.5 Predictions Today
          </h1>
          <p className="text-base sm:text-lg text-[#9ca3af] leading-relaxed mb-3 max-w-3xl mx-auto">
            Today&apos;s Over 2.5 predictions: matches where the total goals are expected to exceed 2.5 (at least 3 goals). Updated 4x daily, verified post-match.
          </p>
          <p className="text-sm text-[#9ca3af] leading-relaxed max-w-3xl mx-auto">
            Aucun gain n&apos;est garanti. 18+.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What is Over 2.5?
            </h2>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
              <strong>Over 2.5 goals</strong> is won if <strong>at least 3 goals</strong> are scored in the match, regardless of who scores. Scores like 2-1, 3-0, 1-2, 4-1 win Over 2.5. Scores like 0-0, 1-0, 0-1, 1-1, 2-0, 0-2 lose.
            </p>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
              <strong>Difference from BTTS:</strong> BTTS requires <em>both teams to score</em>. Over 2.5 requires <em>a high total goal count</em>. A 3-0 match wins Over 2.5 but loses BTTS. A 1-1 match wins BTTS but loses Over 2.5.
            </p>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              For the methodology, see our <Link href="/methodologie" className="text-[#22c55e] underline">methodology page</Link>.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>

        {/* Quick Links */}
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-sm font-bold text-[#f0f4f9]">BTTS Predictions Today →</div>
              <div className="text-xs text-[#9ca3af] mt-1">Both teams to score</div>
            </Link>
            <Link href="/btts-and-over-2-5-predictions-today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-sm font-bold text-[#f0f4f9]">BTTS + Over 2.5 Combined →</div>
              <div className="text-xs text-[#9ca3af] mt-1">Both conditions met</div>
            </Link>
            <Link href="/ai-correct-score-predictions" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-sm font-bold text-[#f0f4f9]">AI Correct Score →</div>
              <div className="text-xs text-[#9ca3af] mt-1">Exact score probabilities</div>
            </Link>
            <Link href="/over-2-5/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
              style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-sm font-bold text-[#f0f4f9]">Over 2.5 Statistics →</div>
              <div className="text-xs text-[#9ca3af] mt-1">League stats</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
