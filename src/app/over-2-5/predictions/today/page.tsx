import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getDakarDateString } from '@/lib/dakar-date'

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
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#B7C4C1] mb-4 max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
          <Link href="/" className="hover:text-[#B8FF1A]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#B7C4C1]">Over 2.5 Today</span>
        </nav>

        <section className="max-w-5xl mx-auto px-4 pt-2 pb-6 sm:pt-4">
          <div className="rounded-2xl p-5 sm:p-7" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: 'rgba(184, 255, 26, 0.12)', color: '#B8FF1A', border: '1px solid rgba(184, 255, 26, 0.25)' }}>
                Over 2.5 · 3 buts ou plus
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.28)' }}>
                Aujourd&apos;hui · {dakarDateLabel}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pronostics Over 2.5 du jour
            </h1>
            <p className="text-base sm:text-lg text-[#B7C4C1] leading-relaxed max-w-3xl">
              Les matchs sélectionnés aujourd&apos;hui selon la probabilité d&apos;au moins 3 buts.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href="#over25-dashboard" className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]" style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>
                Voir les matchs du jour
              </a>
              <Link href="/methodologie" className="inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:border-[#B8FF1A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]" style={{ borderColor: '#5D7880', color: '#F5F8F3' }}>
                Comprendre la méthode
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#7F98A4]">Mise à jour 4 fois par jour · Aucun gain garanti · 18+</p>
          </div>
        </section>

        <section id="over25-dashboard" aria-label="Pronostics Over 2.5 du jour" className="max-w-5xl mx-auto px-4 pb-10 scroll-mt-6">
          <FreePredictions />
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-10">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comprendre Over 2.5 en 30 secondes
            </h2>
            <p className="text-sm text-[#B7C4C1] leading-relaxed mb-3">
              <strong>Over 2.5</strong> est validé si le match produit au moins 3 buts, quel que soit le vainqueur : 2-1, 3-0, 1-2 et 4-1 sont gagnants ; 0-0, 1-0, 1-1 et 2-0 ne le sont pas.
            </p>
            <p className="text-sm text-[#B7C4C1] leading-relaxed">
              À la différence du BTTS, Over 2.5 mesure le total de buts et non le fait que les deux équipes marquent. Consultez notre <Link href="/methodologie" className="text-[#B8FF1A] underline">méthodologie documentée</Link> pour le détail.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">BTTS Predictions Today →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">Both teams to score</div>
            </Link>
            <Link href="/btts-and-over-2-5-predictions-today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">BTTS + Over 2.5 Combined →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">Both conditions met</div>
            </Link>
            <Link href="/ai-correct-score-predictions" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">AI Correct Score →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">Exact score probabilities</div>
            </Link>
            <Link href="/over-2-5/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="text-sm font-bold text-[#F5F8F3]">Over 2.5 Statistics →</div>
              <div className="text-xs text-[#B7C4C1] mt-1">League stats</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
