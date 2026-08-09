import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })

export const metadata: Metadata = {
  title: "Pronostic BTTS Aujourd'hui — Pronos Vérifiés",
  description: "Pronostics BTTS du jour gratuits et vérifiés. Mis à jour 4x/jour. Aucun gain garanti. 18+.",
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pronostic BTTS Aujourd'hui — BTTSPredict",
    description: 'Pronostics BTTS du jour par moteur IA. Aucun gain garanti. 18+.',
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
    <div className="min-h-screen bg-[#070A14] flex flex-col text-[#F1F5F9]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-6 sm:pt-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#64748B] mb-4">
            <Link href="/" className="hover:text-[#D4AF37]">Accueil</Link>
            <span className="mx-1">/</span>
            <Link href="/pronostics" className="hover:text-[#D4AF37]">Pronostics</Link>
            <span className="mx-1">/</span>
            <span className="text-[#94A3B8]">BTTS Today</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#10B981', border: '1px solid rgba(124, 58, 237, 0.25)' }}>
            BTTS · Both Teams To Score
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronostic BTTS Aujourd'hui Gratuit
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed mb-3 max-w-3xl mx-auto">
            Voici nos pronostics BTTS du {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} analysés par notre algorithme pour les championnats les plus ouverts. Pronos 100% gratuits, mis à jour à 08h, 12h, 16h et 20h.
          </p>
          <p className="text-sm text-[#64748B] leading-relaxed max-w-3xl mx-auto">
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
          <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
            BTTS signifie <strong>Both Teams To Score</strong> — un marché de paris sportifs où le pronostic porte sur le fait que les deux équipes marquent au moins un but chacun pendant le match. Le résultat final du match n'a pas d'importance : seuls les buts marqués comptent.
          </p>
          <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
            Le BTTS est un marché populaire car il offre de l'action jusqu'au dernier moment — un but à la 90e minute peut faire gagner un pari BTTS qui semblait perdu. Le moteur IA de BTTSPredict identifie les matchs où la dynamique offensive des deux équipes et leur propension à encaisser rendent le BTTS probable.
          </p>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Pour comprendre en détail comment fonctionne l'analyse BTTS, consultez notre <Link href="/methodologie" className="text-[#D4AF37] underline">méthodologie du moteur IA</Link>.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aller plus loin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              style={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}>
              <div className="text-sm font-bold text-[#F1F5F9]">Statistiques BTTS →</div>
              <div className="text-xs text-[#94A3B8] mt-1">Taux historique par ligue</div>
            </Link>
            <Link href="/vip" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              style={{ backgroundColor: '#111827', border: '1px solid #1F2937' }}>
              <div className="text-sm font-bold text-[#F1F5F9]">Pronostics premium →</div>
              <div className="text-xs text-[#94A3B8] mt-1">Programme VIP BTTSPredict</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
