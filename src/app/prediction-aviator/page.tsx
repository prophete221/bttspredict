import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar, Footer, AviatorVip } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: 'Aviator 2026 : statistiques historiques',
  description: 'Statistiques historiques Aviator et principe provably fair. Aucun multiplicateur futur ne peut être prédit. Informations 18+.',
  alternates: { canonical: 'https://bttspredict.com/prediction-aviator' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Aviator 2026 : statistiques historiques',
    description: 'Statistiques historiques Aviator et informations transparentes. Aucun outil ne peut prédire un round futur.',
    url: 'https://bttspredict.com/prediction-aviator',
    type: 'article',
  },
}

export default function PredictionAviatorPage() {
  return (
    <div className="min-h-screen bg-[#07131D] text-[#F3F7F5] flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#B4C4CC] mb-6">
            <Link href="/" className="hover:text-[#E6A24C] transition-colors">Accueil</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>Aviator</span>
          </nav>

          <header className="max-w-3xl mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em]"
              style={{ backgroundColor: 'rgba(83, 243, 255, 0.10)', color: '#53F3FF', border: '1px solid rgba(83, 243, 255, 0.28)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#53F3FF]" aria-hidden="true" />
              Information Aviator
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-4 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Aviator 2026 : statistiques historiques et fonctionnement
            </h1>
            <p className="text-base sm:text-lg text-[#B4C4CC] leading-relaxed">
              Une page claire pour consulter des statistiques de rounds passés et comprendre le principe provably fair. Ces données sont informatives : elles ne constituent pas une prédiction et aucun multiplicateur futur ne peut être connu à l'avance.
            </p>
          </header>

          <section className="grid gap-3 sm:grid-cols-3 mb-8" aria-label="Principes essentiels">
            <div className="rounded-xl p-4" style={{ backgroundColor: '#0D202D', border: '1px solid rgba(83, 243, 255, 0.20)' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-[#53F3FF] mb-2">Aléatoire</p>
              <p className="text-sm text-[#B4C4CC] leading-relaxed">Chaque round futur reste imprévisible.</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: '#0D202D', border: '1px solid rgba(184, 255, 26, 0.20)' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-[#E6A24C] mb-2">Historique</p>
              <p className="text-sm text-[#B4C4CC] leading-relaxed">Les indicateurs affichés décrivent des rounds passés.</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: '#0D202D', border: '1px solid rgba(140, 124, 255, 0.24)' }}>
              <p className="text-xs font-bold uppercase tracking-wider text-[#A99BFF] mb-2">Responsable</p>
              <p className="text-sm text-[#B4C4CC] leading-relaxed">18+ uniquement. Aucun gain n'est garanti.</p>
            </div>
          </section>

          <AviatorVip />

          <section className="max-w-3xl mx-auto mt-8 rounded-xl p-5 sm:p-6" style={{ backgroundColor: '#0D202D', border: '1px solid #23495C' }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Que signifient ces statistiques ?
            </h2>
            <p className="text-sm text-[#B4C4CC] leading-relaxed mb-3">
              Le taux de cash-out, le multiplicateur moyen et le maximum observé résument uniquement l'échantillon historique affiché. Ils ne permettent pas de déduire le résultat du prochain round et ne constituent pas une stratégie de mise.
            </p>
            <p className="text-xs text-[#B4C4CC] leading-relaxed">
              Aviator est un jeu de hasard. Ne jouez jamais avec de l'argent nécessaire à vos dépenses, fixez vos limites et arrêtez-vous si le jeu n'est plus maîtrisé. Consultez les règles et les conditions de l'opérateur avant toute action.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
