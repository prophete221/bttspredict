import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Over 2.5 Statistics — Statistiques Over 2.5 par ligue',
  description: "Statistiques Over 2.5 buts : suivi des matchs, performance par championnat et historique des prédictions vérifiées.",
  alternates: { canonical: 'https://bttspredict.com/over-2-5/statistics' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Over 2.5 Statistics — BTTSPredict',
    description: 'Statistiques Over 2.5 par ligue. Taux historique de matchs à 3+ buts. 18+.',
    url: 'https://bttspredict.com/over-2-5/statistics',
    type: 'article',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does Over 2.5 mean in football betting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Over 2.5 means betting that the total number of goals in a match will be 3 or more. The '2.5' is used because there are no half-goals: a match with 2 goals is Under 2.5, a match with 3 goals is Over 2.5.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which leagues have the highest Over 2.5 rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Historically, the Dutch Eredivisie, German Bundesliga, and MLS tend to have higher Over 2.5 rates due to their offensive style of play. BTTSPredict focuses on a curated set of leagues with historically high goal averages.",
      },
    },
  ],
}

const LEAGUE_STATS = [
  { league: 'Eredivisie (Pays-Bas)', over25Rate: '57%', avgGoals: '3.15', note: 'Ligue très offensive' },
  { league: 'MLS (États-Unis)', over25Rate: '56%', avgGoals: '3.10', note: 'Football offensif, beaucoup de buts' },
  { league: 'Bundesliga (Allemagne)', bttsRate: '55%', avgGoals: '3.05', note: 'Pressing haut, score élevé' },
  { league: '2. Bundesliga', over25Rate: '54%', avgGoals: '2.90', note: 'D2 allemande offensive' },
  { league: 'Premier League (Angleterre)', over25Rate: '52%', avgGoals: '2.82', note: 'Top 5 européen' },
  { league: 'Jupiler Pro League (Belgique)', over25Rate: '53%', avgGoals: '2.85', note: 'Ligue belge' },
  { league: 'Liga Portugal', over25Rate: '52%', avgGoals: '2.72', note: 'Ligue portugaise' },
  { league: 'Swiss Super League', over25Rate: '51%', avgGoals: '2.78', note: 'Ligue suisse' },
  { league: 'Austrian Bundesliga', over25Rate: '51%', avgGoals: '2.80', note: 'Ligue autrichienne' },
  { league: 'Championship (Angleterre D2)', over25Rate: '50%', avgGoals: '2.68', note: 'D2 anglaise, matchs serrés' },
  { league: 'Scottish Premiership', over25Rate: '48%', avgGoals: '2.65', note: 'Ligue écossaise' },
]

export default function Over25StatisticsPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#6B7194] mb-4">
            <Link href="/" className="hover:text-[#5146F5]">Accueil</Link>
            <span className="mx-1">/</span>
            <span className="text-[#A5ABC5]">Over 2.5 Statistics</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(93, 253, 203, 0.12)', color: '#5DFDCB', border: '1px solid rgba(93, 253, 203, 0.25)' }}>
            Over 2.5 · Statistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Over 2.5 Statistics par ligue
          </h1>
          <p className="text-base text-[#A5ABC5] leading-relaxed mb-6">
            Taux historique approximatif d'Over 2.5 (3 buts ou plus) sur les principales ligues couvertes par BTTSPredict. Ces statistiques sont indicatives et basées sur des données publiques. Elles expliquent la priorisation des ligues par le moteur IA.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Taux Over 2.5 par ligue
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #303861' }}>
                    <th className="text-left py-3 px-4 font-bold text-[#A5ABC5]">Ligue</th>
                    <th className="text-center py-3 px-4 font-bold text-[#A5ABC5]">Over 2.5</th>
                    <th className="text-center py-3 px-4 font-bold text-[#A5ABC5]">Buts/match</th>
                    <th className="text-left py-3 px-4 font-bold text-[#A5ABC5] hidden sm:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {LEAGUE_STATS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #303861' }}>
                      <td className="py-3 px-4 text-[#F7F8FF] font-medium">{row.league}</td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded font-bold" style={{ backgroundColor: 'rgba(93, 253, 203, 0.15)', color: '#5DFDCB' }}>
                          {row.over25Rate || row.bttsRate}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 text-[#A5ABC5] tabular-nums">{row.avgGoals}</td>
                      <td className="py-3 px-4 text-[#A5ABC5] text-xs hidden sm:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
              Ces taux sont des moyennes historiques indicatives calculées sur plusieurs saisons. Ils ne préjugent pas des résultats futurs.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Over 2.5 vs BTTS : quelle différence ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(93, 253, 203, 0.25)' }}>
                <h3 className="text-base font-bold mb-2 text-[#5DFDCB]">Over 2.5</h3>
                <p className="text-sm text-[#A5ABC5] leading-relaxed">
                  Le total des buts du match doit être de 3 ou plus. Le score 2-1, 3-0, 1-2, 2-2 — tous gagnants. Un match 1-1 est perdant.
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(124, 58, 237, 0.25)' }}>
                <h3 className="text-base font-bold mb-2 text-[#7C3AED]">BTTS</h3>
                <p className="text-sm text-[#A5ABC5] leading-relaxed">
                  Les deux équipes doivent marquer au moins un but chacune. Le score 1-1, 2-1, 1-2, 2-2 — tous gagnants. Un match 2-0 ou 3-0 est perdant.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#6B7194] mt-4 leading-relaxed">
              Les deux marchés sont liés mais non identiques : un match 2-2 gagne les deux (Over 2.5 + BTTS). Un match 3-0 gagne Over 2.5 mais perd BTTS. Un match 1-1 gagne BTTS mais perd Over 2.5.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Voir aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/over-2-5/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
                style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="text-sm font-bold text-[#F7F8FF]">Over 2.5 Today →</div>
                <div className="text-xs text-[#A5ABC5] mt-1">Pronostics du jour</div>
              </Link>
              <Link href="/btts/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
                style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="text-sm font-bold text-[#F7F8FF]">BTTS Stats →</div>
                <div className="text-xs text-[#A5ABC5] mt-1">Statistiques BTTS</div>
              </Link>
              <Link href="/historique" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
                style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="text-sm font-bold text-[#F7F8FF]">Historique →</div>
                <div className="text-xs text-[#A5ABC5] mt-1">Résultats vérifiés</div>
              </Link>
            </div>
          </section>
        </article>
              <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions />
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
