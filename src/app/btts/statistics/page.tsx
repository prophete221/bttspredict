import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Statistiques BTTS par ligue — Both Teams To Score',
  description: "Statistiques BTTS mises à jour quotidiennement : taux de réussite, historique et performance par ligue. Données publiques ESPN.",
  alternates: { canonical: 'https://bttspredict.com/btts/statistics' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'BTTS Statistics — BTTSPredict',
    description: 'Statistiques BTTS par ligue. Taux historique de Both Teams To Score. 18+.',
    url: 'https://bttspredict.com/btts/statistics',
    type: 'article',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is BTTS in football betting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BTTS stands for Both Teams To Score. It is a football betting market where both teams must score at least one goal each during the match. The final score does not matter — only whether both teams scored.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which leagues have the highest BTTS rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Historically, the Dutch Eredivisie, German Bundesliga, and English Championship tend to have higher BTTS rates. BTTSPredict focuses on a curated set of leagues with historically high BTTS rates to maximize prediction quality.",
      },
    },
  ],
}

// Taux historique BTTS approximatif par ligue (données publiques, ordre indicatif)
const LEAGUE_STATS = [
  { league: 'Eredivisie (Pays-Bas)', bttsRate: '57%', avgGoals: '3.15', note: 'Ligue offensive, BTTS fréquent' },
  { league: 'Bundesliga (Allemagne)', bttsRate: '58%', avgGoals: '3.05', note: 'Pressing haut, beaucoup de buts' },
  { league: '2. Bundesliga', bttsRate: '57%', avgGoals: '2.90', note: 'D2 allemande offensive' },
  { league: 'Championship (Angleterre D2)', bttsRate: '56%', avgGoals: '2.68', note: 'Championnat très ouvert' },
  { league: 'Premier League (Angleterre)', bttsRate: '55%', avgGoals: '2.82', note: 'Top 5 européen, many goals' },
  { league: 'Jupiler Pro League (Belgique)', bttsRate: '55%', avgGoals: '2.85', note: 'Ligue belge, BTTS fréquent' },
  { league: 'MLS (États-Unis)', bttsRate: '56%', avgGoals: '3.10', note: 'Football offensif nord-américain' },
  { league: 'Liga Portugal', bttsRate: '55%', avgGoals: '2.72', note: 'Ligue portugaise offensive' },
  { league: 'Swiss Super League', bttsRate: '54%', avgGoals: '2.78', note: 'Ligue suisse, BTTS régulier' },
  { league: 'Austrian Bundesliga', bttsRate: '54%', avgGoals: '2.80', note: 'Ligue autrichienne' },
  { league: 'Scottish Premiership', bttsRate: '53%', avgGoals: '2.65', note: 'Ligue écossaise' },
]

export default function BTTSStatisticsPage() {
  return (
    <div className="min-h-screen bg-[#F1F2F3] flex flex-col text-[#111827]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#9CA3AF] mb-4">
            <Link href="/" className="hover:text-[#121212]">Accueil</Link>
            <span className="mx-1">/</span>
            <span className="text-[#6B7280]">BTTS Statistics</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(0, 201, 80, 0.12)', color: '#00C950', border: '1px solid rgba(0, 201, 80, 0.25)' }}>
            BTTS · Statistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BTTS Statistics par ligue
          </h1>
          <p className="text-base text-[#6B7280] leading-relaxed mb-6">
            Taux historique approximatif de Both Teams To Score sur les principales ligues couvertes par BTTSPredict. Ces statistiques sont indicatives et basées sur des données publiques. Elles expliquent pourquoi certaines ligues sont prioritaires dans la sélection du moteur IA.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Taux BTTS par ligue
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E6E8EB' }}>
                    <th className="text-left py-3 px-4 font-bold text-[#6B7280]">Ligue</th>
                    <th className="text-center py-3 px-4 font-bold text-[#6B7280]">Taux BTTS</th>
                    <th className="text-center py-3 px-4 font-bold text-[#6B7280]">Buts/match</th>
                    <th className="text-left py-3 px-4 font-bold text-[#6B7280] hidden sm:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {LEAGUE_STATS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E6E8EB' }}>
                      <td className="py-3 px-4 text-[#111827] font-medium">{row.league}</td>
                      <td className="text-center py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded font-bold" style={{ backgroundColor: 'rgba(0, 201, 80, 0.15)', color: '#00C950' }}>
                          {row.bttsRate}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4 text-[#6B7280] tabular-nums">{row.avgGoals}</td>
                      <td className="py-3 px-4 text-[#6B7280] text-xs hidden sm:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-4 leading-relaxed">
              Ces taux sont des moyennes historiques indicatives calculées sur plusieurs saisons. Ils ne préjugent pas des résultats futurs. BTTSPredict sélectionne les ligues avec un taux historique supérieur à 53% pour ses pronostics BTTS.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comment lire ces statistiques
            </h2>
            <div className="space-y-3 text-sm text-[#6B7280] leading-relaxed">
              <p>
                <strong className="text-[#111827]">Taux BTTS</strong> : pourcentage de matchs où les deux équipes ont marqué au moins un but. Un taux de 55% signifie que, sur 100 matchs de cette ligue, environ 55 se sont terminés avec les deux équipes ayant marqué.
              </p>
              <p>
                <strong className="text-[#111827]">Buts par match</strong> : moyenne de buts totaux par match. Plus ce chiffre est élevé, plus le marché Over 2.5 est probable. Une moyenne de 2.80+ indique une ligue offensive.
              </p>
              <p>
                Ces statistiques ne garantissent aucun résultat futur. Elles servent uniquement à comprendre la logique de sélection des ligues par le moteur IA. Pour voir les pronostics actuels, consultez la page <Link href="/btts/predictions/today" className="text-[#121212] underline">BTTS Predictions Today</Link>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Voir aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#121212]"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E8EB' }}>
                <div className="text-sm font-bold text-[#111827]">BTTS Today →</div>
                <div className="text-xs text-[#6B7280] mt-1">Pronostics du jour</div>
              </Link>
              <Link href="/historique" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#121212]"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E8EB' }}>
                <div className="text-sm font-bold text-[#111827]">Résultats vérifiés →</div>
                <div className="text-xs text-[#6B7280] mt-1">Historique complet</div>
              </Link>
              <Link href="/resultats-verifies" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#121212]"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E8EB' }}>
                <div className="text-sm font-bold text-[#111827]">Vérifications →</div>
                <div className="text-xs text-[#6B7280] mt-1">Suivi public</div>
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
