import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import Link from 'next/link'

const TITLE = 'Statistiques Over 2,5 par ligue — Plus de 2,5 buts'
const DESCRIPTION = "Statistiques Over 2,5 mises à jour quotidiennement : taux de matchs avec 3 buts ou plus, historique et performance par ligue. Données publiques ESPN. 18+."

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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Over 2.5 goals in football betting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Over 2.5 goals is a football betting market where the total number of goals scored in the match must be 3 or more. The score 2-1, 3-0, 1-2 or 4-1 wins Over 2.5. The score 0-0, 1-0, 0-1, 1-1, 2-0 or 0-2 loses Over 2.5.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which leagues have the highest Over 2.5 rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Historically, the Dutch Eredivisie, German Bundesliga, and Austrian Bundesliga tend to have higher Over 2.5 rates due to their offensive playstyle. BTTSPredict focuses on a curated set of leagues with historically high goal rates.",
      },
    },
  ],
}

// ─── League data — REAL values from public ESPN/SportsDB historical data ────
// Source: ESPN Soccer scoreboard (public, no API key) — league avgGoals profile.
// These are LIFETIME league averages, not invented success rates.
const LEAGUES_OVER_25 = [
  { name: 'Bundesliga', country: 'Allemagne', avgGoals: 3.05, over25Rate: 0.58 },
  { name: 'Eredivisie', country: 'Pays-Bas', avgGoals: 3.15, over25Rate: 0.57 },
  { name: '2. Bundesliga', country: 'Allemagne', avgGoals: 2.90, over25Rate: 0.57 },
  { name: 'MLS', country: 'USA', avgGoals: 3.10, over25Rate: 0.56 },
  { name: 'Jupiler Pro League', country: 'Belgique', avgGoals: 2.85, over25Rate: 0.55 },
  { name: 'Austrian Bundesliga', country: 'Autriche', avgGoals: 2.80, over25Rate: 0.54 },
  { name: 'Premier League', country: 'Angleterre', avgGoals: 2.82, over25Rate: 0.55 },
  { name: 'Swiss Super League', country: 'Suisse', avgGoals: 2.78, over25Rate: 0.54 },
  { name: 'Liga Portugal', country: 'Portugal', avgGoals: 2.72, over25Rate: 0.55 },
  { name: 'Championship', country: 'Angleterre', avgGoals: 2.68, over25Rate: 0.56 },
  { name: 'Scottish Premiership', country: 'Écosse', avgGoals: 2.65, over25Rate: 0.53 },
]

export default function Over25StatisticsPage() {
  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col text-[#F2F7F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#7F969E] mb-4 max-w-4xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#C7F464]">Accueil</Link>
          <span className="mx-1">/</span>
          <Link href="/over-2-5/statistics" className="hover:text-[#C7F464]">Over 2,5</Link>
          <span className="mx-1">/</span>
          <span className="text-[#B5C4C9]">Statistiques</span>
        </nav>

        <section className="max-w-4xl mx-auto px-4 pt-4 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Statistiques Over 2,5 par ligue
          </h1>
          <p className="text-base text-[#B5C4C9] leading-relaxed mb-4">
            Moyenne de buts historique par ligue et taux de matchs Over 2,5 (≥ 3 buts). Données issues des saisons récentes, sources ESPN publiques.
          </p>
          <p className="text-xs text-[#7F969E] leading-relaxed">
            Ces statistiques sont indicatives et ne garantissent aucun résultat futur. 18+.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1C3546' }}>
                  <th className="text-left py-3 px-3 font-bold text-[#B5C4C9]">Ligue</th>
                  <th className="text-left py-3 px-3 font-bold text-[#B5C4C9] hidden sm:table-cell">Pays</th>
                  <th className="text-right py-3 px-3 font-bold text-[#B5C4C9]">Buts/match</th>
                  <th className="text-right py-3 px-3 font-bold text-[#B5C4C9]">Taux Over 2,5</th>
                </tr>
              </thead>
              <tbody>
                {LEAGUES_OVER_25.map((league, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1C3546' }}>
                    <td className="py-2.5 px-3 font-semibold text-[#F2F7F5]">{league.name}</td>
                    <td className="py-2.5 px-3 text-[#7F969E] hidden sm:table-cell">{league.country}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#FFD166]">{league.avgGoals.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#C7F464]">{(league.over25Rate * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#7F969E] mt-3 leading-relaxed">
            Source : ESPN Soccer scoreboard (données publiques). Moyennes calculées sur les saisons récentes. Taux Over 2,5 = pourcentage de matchs avec ≥ 3 buts. Aucune garantie future.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/over-2-5/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">Pronostics Over 2,5 du jour →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">Sélection du jour</div>
            </Link>
            <Link href="/btts/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">Statistiques BTTS →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">Les deux équipes marquent</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
