import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import Link from 'next/link'
import PredictionMarketNav from '@/components/bttsbet/PredictionMarketNav'

const TITLE = 'Statistiques Over 2,5 par ligue — Analyse des buts'
const DESCRIPTION = 'Ligues couvertes par BTTSPredict pour le marché Over 2,5. Les taux historiques seront publiés lorsqu’une source vérifiable sera disponible. 18+.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/over-2-5/statistics' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com/over-2-5/statistics',
    type: 'article',
  },
}

const LEAGUES = [
    { name: 'Bundesliga', country: 'Allemagne' },
    { name: 'Eredivisie', country: 'Pays-Bas' },
    { name: '2. Bundesliga', country: 'Allemagne' },
    { name: 'MLS', country: 'États-Unis' },
    { name: 'Jupiler Pro League', country: 'Belgique' },
    { name: 'Austrian Bundesliga', country: 'Autriche' },
    { name: 'Premier League', country: 'Angleterre' },
    { name: 'Swiss Super League', country: 'Suisse' },
    { name: 'Liga Portugal', country: 'Portugal' },
    { name: 'Championship', country: 'Angleterre' },
    { name: 'Scottish Premiership', country: 'Écosse' },
]

export default function Over25StatisticsPage() {
  return (
    <div className="page-design page-design--stats min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#9DABBB] mb-4 max-w-4xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#2F7DFF]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9DABBB]">Statistiques Over 2,5</span>
        </nav>

        <PredictionMarketNav locale="fr" active="over25" />
        <section className="max-w-5xl mx-auto px-4 pt-1 pb-8">
          <div className="market-hero market-hero--stats">
            <div className="market-hero__content">
              <p className="market-hero__eyebrow">OVER 2,5 · STATISTIQUES PAR LIGUE</p>
              <h1 className="market-hero__title">Statistiques Over 2,5 par ligue</h1>
              <p className="market-hero__text">Ligues couvertes pour le marché Over 2,5 (au moins 3 buts). Les taux et moyennes historiques ne seront affichés qu’après intégration d’une source vérifiable.</p>
              <p className="market-hero__meta">Aucune garantie de résultat futur · 18+</p>
              <div className="market-hero__actions"><Link href="/over-2-5/predictions/today" className="market-hero__primary">Voir les pronostics du jour <span aria-hidden="true">→</span></Link></div>
            </div>
            <aside className="market-hero__visual" aria-label="Disponibilité des statistiques">
              <div className="market-visual-card">
                <div className="market-visual-card__label"><span>SOURCE VÉRIFIABLE</span><span className="market-visual-card__mark">O2.5</span></div>
                <strong className="market-visual-card__big">—</strong>
                <span className="market-visual-card__caption">Aucun taux historique publié sans source contrôlable.</span>
                <div className="market-visual-card__rule" />
                <div className="market-visual-card__footer"><span>Données en préparation</span><span>18+</span></div>
              </div>
            </aside>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #6B7A8C' }}>
                  <th className="text-left py-3 px-3 font-bold text-[#9DABBB]">Ligue</th>
                  <th className="text-left py-3 px-3 font-bold text-[#9DABBB] hidden sm:table-cell">Pays</th>
                  <th className="text-right py-3 px-3 font-bold text-[#9DABBB]">Buts/match</th>
                  <th className="text-right py-3 px-3 font-bold text-[#9DABBB]">Taux Over 2,5</th>
                </tr>
              </thead>
              <tbody>
                {LEAGUES.map((league, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #6B7A8C' }}>
                    <td className="py-2.5 px-3 font-semibold text-[#F2F6FA]">{league.name}</td>
                    <td className="py-2.5 px-3 text-[#9DABBB] hidden sm:table-cell">{league.country}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#9DABBB] text-xs">Données en préparation</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#9DABBB] text-xs">Données en préparation</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#9DABBB] mt-3 leading-relaxed">
            Données historiques indisponibles — à intégrer via une source vérifiable. Aucune garantie future.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/over-2-5/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">Pronostics Over 2,5 du jour →</div>
              <div className="text-xs text-[#9DABBB] mt-1">Sélection publiée aujourd’hui</div>
            </Link>
            <Link href="/btts/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#141C25', border: '1px solid #6B7A8C' }}>
              <div className="text-sm font-bold text-[#F2F6FA]">Statistiques BTTS →</div>
              <div className="text-xs text-[#9DABBB] mt-1">Les deux équipes marquent</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
