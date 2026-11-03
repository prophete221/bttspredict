import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getDakarDateString } from '@/lib/dakar-date'
import VipButtons from '@/components/bttsbet/VipButtons'
import PredictionMarketNav from '@/components/bttsbet/PredictionMarketNav'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })

const TITLE = 'Pronostics Over 2,5 du jour'
const DESCRIPTION = 'Pronostics Over 2,5 du jour sur des matchs internationaux : sélection statistique, date Africa/Dakar et méthode documentée. 18+.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://bttspredict.com/over-2-5/predictions/today',
    languages: {
      fr: 'https://bttspredict.com/over-2-5/predictions/today',
      en: 'https://bttspredict.com/en/over-2-5/predictions/today',
      ar: 'https://bttspredict.com/ar/over-2-5/predictions/today',
      'x-default': 'https://bttspredict.com/over-2-5/predictions/today',
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com/over-2-5/predictions/today',
    siteName: 'BTTSPredict',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function Over25PredictionsTodayPage() {
  const dakarDate = getDakarDateString()
  const dakarDateLabel = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Dakar',
    dateStyle: 'full',
  }).format(new Date(`${dakarDate}T12:00:00Z`))

  return (
    <div className="page-design page-design--over25 min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#9DABBB] mb-4 max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
          <Link href="/" className="hover:text-[#2F7DFF]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9DABBB]">Over 2.5 Today</span>
        </nav>

        <PredictionMarketNav locale="fr" active="over25" />

        <section className="max-w-5xl mx-auto px-4 pt-1 pb-7 sm:pt-2">
          <div className="market-hero market-hero--over25">
            <div className="market-hero__content">
              <p className="market-hero__eyebrow">Over 2,5 · Total de buts · Aujourd&apos;hui · {dakarDateLabel}</p>
              <h1 className="market-hero__title">Pronostics Over 2,5 du jour</h1>
              <p className="market-hero__text">Les matchs sélectionnés aujourd&apos;hui selon la probabilité d&apos;au moins trois buts. Les données affichées proviennent du tableau de pronostics.</p>
              <div className="market-hero__actions">
                <a href="#over25-dashboard" className="market-hero__primary">Voir les matchs du jour <span aria-hidden="true">↓</span></a>
                <Link href="/methodologie" className="market-hero__secondary">Comprendre la méthode</Link>
              </div>
              <div className="mt-4"><VipButtons locale="fr" /></div>
              <p className="market-hero__meta">Mise à jour 4 fois par jour · Aucun gain garanti · 18+</p>
            </div>
            <aside className="market-hero__visual" aria-label="Règle du marché Over 2,5">
              <div className="market-visual-card">
                <div className="market-visual-card__label"><span>RÈGLE DU MARCHÉ</span><span className="market-visual-card__mark">O2.5</span></div>
                <strong className="market-visual-card__big">3+</strong>
                <span className="market-visual-card__caption">buts au total pour valider Over 2,5</span>
                <div className="market-visual-card__scores" aria-label="Exemples de scores avec au moins trois buts">
                  <span>2–1</span><span>3–0</span><span>1–2</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="over25-dashboard" aria-label="Pronostics Over 2.5 du jour" className="max-w-5xl mx-auto px-4 pb-10 scroll-mt-6">
          <FreePredictions />
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-10">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comprendre Over 2.5 en 30 secondes
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-3">
              <strong>Over 2.5</strong> est validé si le match produit au moins 3 buts, quel que soit le vainqueur : 2-1, 3-0, 1-2 et 4-1 sont gagnants ; 0-0, 1-0, 1-1 et 2-0 ne le sont pas.
            </p>
            <p className="text-sm text-[#9DABBB] leading-relaxed">
              À la différence du BTTS, Over 2.5 mesure le total de buts et non le fait que les deux équipes marquent. Consultez notre <Link href="/methodologie" className="text-[#2F7DFF] underline">méthodologie documentée</Link> pour le détail.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">BTTS Predictions Today →</div>
              <div className="text-xs text-[#9DABBB] mt-1">Both teams to score</div>
            </Link>
            <Link href="/btts-and-over-2-5-predictions-today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">BTTS + Over 2.5 Combined →</div>
              <div className="text-xs text-[#9DABBB] mt-1">Both conditions met</div>
            </Link>
            <Link href="/ai-correct-score-predictions" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">AI Correct Score →</div>
              <div className="text-xs text-[#9DABBB] mt-1">Exact score probabilities</div>
            </Link>
            <Link href="/over-2-5/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">Over 2.5 Statistics →</div>
              <div className="text-xs text-[#9DABBB] mt-1">League stats</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
