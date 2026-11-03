import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getDakarDateString } from '@/lib/dakar-date'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'

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
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#9DABBB] mb-4 max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
          <Link href="/" className="hover:text-[#2F7DFF]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9DABBB]">Over 2.5 Today</span>
        </nav>

        <section className="max-w-5xl mx-auto px-4 pt-2 pb-6 sm:pt-4">
          <div className="rounded-2xl p-5 sm:p-7" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: 'rgba(47, 125, 255, 0.12)', color: '#2F7DFF', border: '1px solid rgba(47, 125, 255, 0.25)' }}>
                Over 2.5 · 3 buts ou plus
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.28)' }}>
                Aujourd&apos;hui · {dakarDateLabel}
              </span>
            </div>
            <AnimatedTitle
              as="h1"
              text="Pronostics Over 2.5 du jour"
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
            <p className="text-base sm:text-lg text-[#9DABBB] leading-relaxed max-w-3xl">
              Les matchs sélectionnés aujourd&apos;hui selon la probabilité d&apos;au moins 3 buts.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href="#over25-dashboard" className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
                Voir les matchs du jour
              </a>
              <Link href="/methodologie" className="inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:border-[#2F7DFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ borderColor: '#6B7A8C', color: '#F2F6FA' }}>
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
