import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import Link from 'next/link'
import AnimatedTitle from '@/components/bttsbet/HeroWordmark'

const TITLE = 'Statistiques Over 2,5 par championnat'
const DESCRIPTION = 'Les statistiques Over 2,5 par championnat ne sont pas publiées tant que les chiffres ne disposent pas d’une source vérifiable.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/over-2-5/statistics' },
  robots: { index: false, follow: true },
  openGraph: {
    title: `${TITLE} | BTTSPredict`,
    description: DESCRIPTION,
    url: 'https://bttspredict.com/over-2-5/statistics',
    type: 'article',
    locale: 'fr_FR',
  },
}

export default function Over25StatisticsPage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1" lang="fr">
        <nav aria-label="Fil d’Ariane" className="text-xs text-[#9DABBB] mb-4 max-w-4xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#2F7DFF]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9DABBB]">Statistiques Over 2,5</span>
        </nav>

        <section className="max-w-4xl mx-auto px-4 pt-4 pb-12">
          <AnimatedTitle
            as="h1"
            text={TITLE}
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          />
          <div className="rounded-2xl p-5 sm:p-7" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
            <h2 className="text-lg font-bold mb-2">Les chiffres par championnat ne sont pas disponibles.</h2>
            <p className="text-sm text-[#B4BCC8] leading-relaxed">
              Nous n’affichons pas de moyennes de buts ni de taux Over 2,5 par ligue sans données vérifiables. Aucun classement ou chiffre provisoire n’est présenté comme une statistique réelle.
            </p>
          </div>
          <p className="text-xs text-[#9DABBB] leading-relaxed mt-4">
            Les sélections Over 2,5 disponibles ont passé les contrôles de validation. Elles ne garantissent aucun résultat futur. 18+.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">Voir les pronostics Over 2,5 du jour →</div>
              <div className="text-xs text-[#9DABBB] mt-1">Choisissez le filtre Over 2,5 sur la page des pronostics.</div>
            </Link>
            <Link href="/statistiques" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">Statistiques générales →</div>
              <div className="text-xs text-[#9DABBB] mt-1">Consulter les résultats historiques vérifiés.</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
