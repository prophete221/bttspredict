import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'BTTS Predictions Today — Pronostics Both Teams To Score du jour',
  description: "Pronostics BTTS (Both Teams To Score) du jour générés par le moteur IA nouvelle génération de BTTSPredict. Sélection des matchs à fort potentiel BTTS, ligues à fort taux, forme récente. Aucun gain garanti. 18+.",
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'BTTS Predictions Today — BTTSPredict',
    description: 'Pronostics BTTS du jour générés par le moteur IA. Aucun gain garanti. 18+.',
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
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-6 sm:pt-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#6B7194] mb-4">
            <Link href="/" className="hover:text-[#5146F5]">Accueil</Link>
            <span className="mx-1">/</span>
            <Link href="/pronostics" className="hover:text-[#5146F5]">Pronostics</Link>
            <span className="mx-1">/</span>
            <span className="text-[#A5ABC5]">BTTS Today</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', border: '1px solid rgba(124, 58, 237, 0.25)' }}>
            BTTS · Both Teams To Score
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BTTS Predictions Today
          </h1>
          <p className="text-base sm:text-lg text-[#A5ABC5] leading-relaxed mb-3 max-w-3xl mx-auto">
            Pronostics BTTS du jour générés par le moteur IA nouvelle génération de BTTSPredict. Chaque sélection est basée sur la forme offensive et défensive récente des deux équipes, sur des ligues à fort taux historique de BTTS.
          </p>
          <p className="text-sm text-[#6B7194] leading-relaxed max-w-3xl mx-auto">
            Aucun gain n'est garanti. Les probabilités affichées sont comprises entre 40% et 54% — plage crédible de calibration. Les paris sportifs comportent un risque de perte. 18+.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Qu'est-ce que le BTTS ?
          </h2>
          <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
            BTTS signifie <strong>Both Teams To Score</strong> — un marché de paris sportifs où le pronostic porte sur le fait que les deux équipes marquent au moins un but chacun pendant le match. Le résultat final du match n'a pas d'importance : seuls les buts marqués comptent.
          </p>
          <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
            Le BTTS est un marché populaire car il offre de l'action jusqu'au dernier moment — un but à la 90e minute peut faire gagner un pari BTTS qui semblait perdu. Le moteur IA de BTTSPredict identifie les matchs où la dynamique offensive des deux équipes et leur propension à encaisser rendent le BTTS probable.
          </p>
          <p className="text-sm text-[#A5ABC5] leading-relaxed">
            Pour comprendre en détail comment fonctionne l'analyse BTTS, consultez notre <Link href="/methodologie" className="text-[#5146F5] underline">méthodologie du moteur IA</Link>.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aller plus loin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
              style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
              <div className="text-sm font-bold text-[#F7F8FF]">Statistiques BTTS →</div>
              <div className="text-xs text-[#A5ABC5] mt-1">Taux historique par ligue</div>
            </Link>
            <Link href="/historique" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
              style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
              <div className="text-sm font-bold text-[#F7F8FF]">Historique vérifié →</div>
              <div className="text-xs text-[#A5ABC5] mt-1">Suivi public depuis le 2026-08-08</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
