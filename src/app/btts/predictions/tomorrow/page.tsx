import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'

export const metadata: Metadata = {
  title: 'Pronostics BTTS de demain',
  description: 'Sélections BTTS de demain affichées uniquement après validation. Aucun résultat futur n’est garanti. 18+.',
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/tomorrow' },
  robots: { index: true, follow: true },
}

export default function BTTSPredictionsTomorrowPage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1" lang="fr">
        <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d’Ariane" className="text-xs text-[#9DABBB] mb-4">
            <Link href="/" className="hover:text-[#2F7DFF]">Accueil</Link>
            <span className="mx-1">/</span>
            <Link href="/btts/predictions/today" className="hover:text-[#2F7DFF]">Pronostics</Link>
            <span className="mx-1">/</span>
            <span className="text-[#9DABBB]">Demain</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(169, 196, 223, 0.12)', color: '#2F7DFF', border: '1px solid rgba(169, 196, 223, 0.25)' }}>
            BTTS · Demain
          </span>
          <AnimatedTitle
            as="h1"
            text="Pronostics BTTS de demain"
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
          <p className="text-base text-[#9DABBB] leading-relaxed mb-6">
            Seuls les matchs de demain avec un pick BTTS validé apparaissent ici. Une rencontre avec un pick Over 2,5 uniquement n’est pas présentée comme un pronostic BTTS.
          </p>

          <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Où consulter les autres sélections ?
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed">
              La page des <Link href="/btts/predictions/today" className="text-[#2F7DFF] underline">pronostics du jour</Link> regroupe les picks publics disponibles et permet de filtrer les rencontres par date.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="#free-predictions" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>
              Voir les sélections ci-dessous ↓
            </Link>
            <Link href="/btts/predictions/today" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
              style={{ backgroundColor: '#141C25', color: '#9DABBB', border: '1px solid #6B7A8C' }}>
              Tous les pronostics du jour →
            </Link>
          </div>

          <p className="text-xs text-[#9DABBB] mt-8 leading-relaxed">
            Aucun résultat futur n’est garanti. Les paris sportifs comportent un risque de perte. 18+ — Jouez de façon responsable.
          </p>
        </section>
        <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions initialLocale="fr" dayOffset={1} marketFilter="btts" />
        </section>
      </main>
      <Footer />
    </div>
  )
}
