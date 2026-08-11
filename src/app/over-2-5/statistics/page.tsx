import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import Link from 'next/link'

const TITLE = 'Over 2.5 Statistics by League — Goal Analysis'
const DESCRIPTION = "List of leagues covered by BTTSPredict for Over 2.5 market. Historical averages and rates to be integrated via verifiable source. 18+."

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
  { name: 'Bundesliga', country: 'Germany' },
  { name: 'Eredivisie', country: 'Netherlands' },
  { name: '2. Bundesliga', country: 'Germany' },
  { name: 'MLS', country: 'USA' },
  { name: 'Jupiler Pro League', country: 'Belgium' },
  { name: 'Austrian Bundesliga', country: 'Austria' },
  { name: 'Premier League', country: 'England' },
  { name: 'Swiss Super League', country: 'Switzerland' },
  { name: 'Liga Portugal', country: 'Portugal' },
  { name: 'Championship', country: 'England' },
  { name: 'Scottish Premiership', country: 'Scotland' },
]

export default function Over25StatisticsPage() {
  return (
    <div className="min-h-screen bg-[#131314] flex flex-col text-[#f0f4f9]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#9ca3af] mb-4 max-w-4xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#22c55e]">Accueil</Link>
          <span className="mx-1">/</span>
          <span className="text-[#9ca3af]">Over 2.5 Statistics</span>
        </nav>

        <section className="max-w-4xl mx-auto px-4 pt-4 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Over 2.5 Statistics by League
          </h1>
          <p className="text-base text-[#9ca3af] leading-relaxed mb-4">
            Leagues covered by BTTSPredict for the Over 2.5 market (≥ 3 goals). Historical averages and rates per league will be displayed once a verifiable source is integrated at build time.
          </p>
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            Aucune garantie future. 18+.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-4 pb-12">
          <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
            <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #2d2f31' }}>
                  <th className="text-left py-3 px-3 font-bold text-[#9ca3af]">League</th>
                  <th className="text-left py-3 px-3 font-bold text-[#9ca3af] hidden sm:table-cell">Country</th>
                  <th className="text-right py-3 px-3 font-bold text-[#9ca3af]">Goals/match</th>
                  <th className="text-right py-3 px-3 font-bold text-[#9ca3af]">Over 2.5 Rate</th>
                </tr>
              </thead>
              <tbody>
                {LEAGUES.map((league, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #2d2f31' }}>
                    <td className="py-2.5 px-3 font-semibold text-[#f0f4f9]">{league.name}</td>
                    <td className="py-2.5 px-3 text-[#9ca3af] hidden sm:table-cell">{league.country}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#9ca3af] text-xs">À VÉRIFIER</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#9ca3af] text-xs">À VÉRIFIER</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[#9ca3af] mt-3 leading-relaxed">
            Historical data not available — to be integrated via verifiable source. Aucune garantie future.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/over-2-5/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-sm font-bold text-[#f0f4f9]">Over 2.5 Predictions Today →</div>
              <div className="text-xs text-[#9ca3af] mt-1">Today's picks</div>
            </Link>
            <Link href="/btts/statistics" className="block p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{ backgroundColor: '#1e1f20', border: '1px solid #2d2f31' }}>
              <div className="text-sm font-bold text-[#f0f4f9]">BTTS Statistics →</div>
              <div className="text-xs text-[#9ca3af] mt-1">Both teams to score</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
