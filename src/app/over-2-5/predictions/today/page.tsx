import type { Metadata } from 'next'
<<<<<<< HEAD
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'
=======
import Link from 'next/link'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
>>>>>>> 54d988f9 (feat(seo+aeo): Prompt Maitre 15 phases — match SSG + topical + audit + tests)

export const metadata: Metadata = {
  title: 'Over 2.5 Predictions Today — Pronostics Over 2.5 du jour',
  description: "Pronostics Over 2.5 du jour générés par le moteur IA nouvelle génération de BTTSPredict. Sélection de matchs à fort potentiel de buts (3+). Ligues offensives, forme récente. Aucun gain garanti. 18+.",
  alternates: { canonical: 'https://bttspredict.com/over-2-5/predictions/today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Over 2.5 Predictions Today — BTTSPredict',
    description: 'Pronostics Over 2.5 du jour générés par le moteur IA. Aucun gain garanti. 18+.',
    url: 'https://bttspredict.com/over-2-5/predictions/today',
    type: 'website',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "What are today's Over 2.5 predictions?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Today's Over 2.5 predictions are football matches where the total number of goals is predicted to be 3 or more. BTTSPredict publishes a daily selection of Over 2.5 picks produced by an AI engine based on recent team form. Predictions are archived and verified after the official match result.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are Over 2.5 predictions guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. No future result is guaranteed. Over 2.5 predictions are probabilistic estimates. Sports betting carries a risk of loss. 18+.",
      },
    },
  ],
}

export default function Over25PredictionsTodayPage() {
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
            <span className="text-[#A5ABC5]">Over 2.5 Today</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(93, 253, 203, 0.12)', color: '#5DFDCB', border: '1px solid rgba(93, 253, 203, 0.25)' }}>
            Over 2.5 · 3+ buts
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Over 2.5 Predictions Today
          </h1>
          <p className="text-base sm:text-lg text-[#A5ABC5] leading-relaxed mb-3 max-w-3xl mx-auto">
            Pronostics Over 2.5 du jour générés par le moteur IA nouvelle génération de BTTSPredict. Chaque sélection identifie les matchs où le total de buts devrait dépasser 2.5 (3 buts ou plus), sur la base de la forme offensive et défensive récente des deux équipes.
          </p>
          <p className="text-sm text-[#6B7194] leading-relaxed max-w-3xl mx-auto">
<<<<<<< HEAD
            Aucun gain n'est garanti. Les probabilités affichées sont comprises entre 40% et 54% — plage crédible de calibration. Les paris sportifs comportent un risque de perte. 18+.
=======
            Aucun gain n'est garanti. Les paris sportifs comportent un risque de perte. 18+.
>>>>>>> 54d988f9 (feat(seo+aeo): Prompt Maitre 15 phases — match SSG + topical + audit + tests)
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
<<<<<<< HEAD
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Qu'est-ce que l'Over 2.5 ?
          </h2>
=======
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Qu'est-ce que l'Over 2.5 ?</h2>
>>>>>>> 54d988f9 (feat(seo+aeo): Prompt Maitre 15 phases — match SSG + topical + audit + tests)
          <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
            <strong>Over 2.5</strong> signifie parier que le total des buts d'un match sera supérieur à 2.5 — c'est-à-dire 3 buts ou plus. Le « 2.5 » est utilisé car il n'y a pas de demi-buts : un match à 2 buts est Under 2.5, un match à 3 buts est Over 2.5.
          </p>
          <p className="text-sm text-[#A5ABC5] leading-relaxed mb-4">
            L'Over 2.5 est un marché populaire car il ne dépend pas du résultat du match (victoire/nul/défaite) mais uniquement du nombre total de buts. Le moteur IA de BTTSPredict identifie les matchs où les dynamiques offensives des deux équipes et les faiblesses défensives rendent probable un total élevé de buts.
          </p>
<<<<<<< HEAD
          <p className="text-sm text-[#A5ABC5] leading-relaxed">
            Pour comprendre comment l'analyse Over 2.5 est calculée, consultez notre <Link href="/methodologie" className="text-[#5146F5] underline">méthodologie du moteur IA</Link>.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aller plus loin
          </h2>
=======
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Aller plus loin</h2>
>>>>>>> 54d988f9 (feat(seo+aeo): Prompt Maitre 15 phases — match SSG + topical + audit + tests)
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/over-2-5/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
              style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
              <div className="text-sm font-bold text-[#F7F8FF]">Statistiques Over 2.5 →</div>
              <div className="text-xs text-[#A5ABC5] mt-1">Taux historique par ligue</div>
            </Link>
            <Link href="/vip" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
              style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
              <div className="text-sm font-bold text-[#F7F8FF]">Pronostics premium →</div>
              <div className="text-xs text-[#A5ABC5] mt-1">Programme VIP BTTSPredict</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
