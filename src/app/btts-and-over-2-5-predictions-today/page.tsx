import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })

export const metadata: Metadata = {
  title: 'BTTS and Over 2.5 Predictions Today — Combined AI Tips',
  description: "Today's best BTTS + Over 2.5 combined predictions. AI-powered football tips where both teams score AND total goals exceed 2.5. Free, updated 4x daily. 18+.",
  alternates: { canonical: 'https://bttspredict.com/btts-and-over-2-5-predictions-today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'BTTS and Over 2.5 Predictions Today — Combined AI Tips',
    description: "Today's best BTTS + Over 2.5 combined predictions. AI-powered football tips. 18+.",
    url: 'https://bttspredict.com/btts-and-over-2-5-predictions-today',
    type: 'website',
  },
}

export default function BttsAndOver25Page() {
  return (
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#B7C4C1] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#B8FF1A]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#B7C4C1]">BTTS + Over 2.5 Today</span>
        </nav>

        <section className="max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(127, 162, 198, 0.16)', color: '#B8FF1A', border: '1px solid rgba(127, 162, 198, 0.30)' }}>
            BTTS + Over 2.5 · Combined
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BTTS and Over 2.5 Predictions Today
          </h1>
          <p className="text-base sm:text-lg text-[#B7C4C1] leading-relaxed mb-3 max-w-3xl mx-auto">
            Combined predictions where <strong>both teams score</strong> (BTTS) AND <strong>total goals exceed 2.5</strong>. These high-confidence matches meet both criteria simultaneously — the most offensive games of the day.
          </p>
          <p className="text-sm text-[#B7C4C1] leading-relaxed max-w-3xl mx-auto">
            Updated 4x daily. Aucun gain n&apos;est garanti. 18+.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What is BTTS + Over 2.5?
            </h2>
            <p className="text-sm text-[#B7C4C1] leading-relaxed mb-3">
              <strong>BTTS (Both Teams To Score)</strong> means both teams score at least one goal. <strong>Over 2.5</strong> means at least 3 goals total in the match. When <strong>both conditions are met</strong>, the match ends with a score like 2-1, 1-2, 2-2, 3-1, 1-3, etc.
            </p>
            <p className="text-sm text-[#B7C4C1] leading-relaxed mb-3">
              <strong>Why combine them?</strong> Matches where both BTTS and Over 2.5 hit are the most offensive, high-scoring games. The Poisson model identifies these by checking that both teams have high expected goals (xG) individually, and the total xG exceeds 2.5.
            </p>
            <p className="text-sm text-[#B7C4C1] leading-relaxed">
              For the methodology, see our <Link href="/methodologie" className="text-[#B8FF1A] underline">methodology page</Link>.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>

        {/* Quick Links — internal linking */}
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]"
              style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">BTTS Predictions Today →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">Both teams to score only</div>
            </Link>
            <Link href="/over-2-5/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]"
              style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">Over 2.5 Predictions Today →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">Total goals ≥ 3 only</div>
            </Link>
            <Link href="/ai-correct-score-predictions" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]"
              style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">AI Correct Score Predictions →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">Exact score probabilities</div>
            </Link>
            <Link href="/resultats-verifies" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]"
              style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">Verified Results →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">Historical performance</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
