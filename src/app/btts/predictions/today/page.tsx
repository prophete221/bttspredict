import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })

export const metadata: Metadata = {
  title: "BTTS Predictions Today (100% Free) - AI Football Tips & Stats",
  description: "Best Both Teams to Score (BTTS) predictions today. AI-powered football tips, stats, and high-probability betting predictions updated daily.",
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: "BTTS Predictions Today (100% Free) - AI Football Tips & Stats",
    description: "Best Both Teams to Score (BTTS) predictions today. AI-powered football tips, stats, and high-probability betting predictions updated daily.",
    url: 'https://bttspredict.com/btts/predictions/today',
    type: 'website',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "What are today's BTTS predictions?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Today's BTTS predictions are football matches where both teams are predicted to score at least one goal. BTTSPredict publishes a daily selection of BTTS picks produced by an AI engine based on recent team form, calibrated continuously. Predictions are archived and verified after the official match result.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are BTTS predictions guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. No future result is guaranteed. BTTS predictions are probabilistic estimates, not certainties. Sports betting carries a risk of loss. 18+.",
      },
    },
  ],
}

export default function BTTSPredictionsTodayPage() {
  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col text-[#F2F7F5]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-6 sm:pt-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#7F969E] mb-4">
            <Link href="/" className="hover:text-[#C7F464]">Accueil</Link>
            <span className="mx-1">/</span>
            <Link href="/pronostics" className="hover:text-[#C7F464]">Pronostics</Link>
            <span className="mx-1">/</span>
            <span className="text-[#B5C4C9]">BTTS Today</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(99, 214, 255, 0.12)', color: '#63D6FF', border: '1px solid rgba(99, 214, 255, 0.25)' }}>
            BTTS · Both Teams To Score
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronostic BTTS Aujourd&apos;hui Gratuit
          </h1>
          <p className="text-base sm:text-lg text-[#B5C4C9] leading-relaxed mb-2 max-w-3xl mx-auto">
            Pronostics BTTS du {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} par notre moteur IA. 100% gratuits, mis à jour 4x/jour.
          </p>
          <p className="text-sm text-[#7F969E] leading-relaxed max-w-3xl mx-auto">
            Aucun gain garanti. Paris sportifs = risque de perte. 18+.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Qu&apos;est-ce que le BTTS ?
          </h2>
          <p className="text-sm text-[#B5C4C9] leading-relaxed mb-3">
            BTTS signifie <strong>Both Teams To Score</strong>. Les deux équipes doivent marquer au moins un but chacune pendant le match, peu importe le score final. Pour en savoir plus, consultez notre <Link href="/methodologie" className="text-[#C7F464] underline">méthodologie</Link>.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts-and-over-2-5-predictions-today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">BTTS + Over 2.5 Combined →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">Both predictions in one</div>
            </Link>
            <Link href="/over-2-5/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">Over 2.5 Predictions →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">Total goals ≥ 3</div>
            </Link>
            <Link href="/ai-correct-score-predictions" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">AI Correct Score →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">Exact score probabilities</div>
            </Link>
            <Link href="/btts/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">BTTS Statistics →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">League stats</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
