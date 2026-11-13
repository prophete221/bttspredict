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
    <div className="page-design page-design--statistics min-h-screen bg-[#080D14] flex flex-col text-[#EDF2F7]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-8 text-xs text-[#93A3B5]">
          <Link href="/" className="hover:text-[#8DB8FF]">Home</Link>
          <span className="mx-2">/</span>
          <span>Over 2.5 statistics</span>
        </nav>

        <section className="mx-auto max-w-5xl px-4 pt-6 pb-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#8DB8FF]">Over 2.5 market</p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Competitions covered</h1>
          <p className="max-w-3xl text-sm leading-7 text-[#A6B4C4]">
            These are the competitions currently listed for the Over 2.5 market. League averages and hit rates are not published until a verifiable historical dataset is available.
          </p>
          <p className="mt-3 text-xs text-[#7F8FA2]">18+ · Statistical information only. No result is guaranteed.</p>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-12">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {LEAGUES.map((league) => (
              <article key={league.name} className="rounded-lg border border-[#263548] bg-[#101823] px-4 py-4">
                <h2 className="text-sm font-semibold text-[#E7EDF5]">{league.name}</h2>
                <p className="mt-1 text-xs text-[#8FA1B5]">{league.country}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-[#7F8FA2]">
            No league-level percentage is displayed without a dated sample and a documented calculation method.
          </p>
        </section>

        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-3 px-4 pb-14 sm:grid-cols-2">
          <Link href="/over-2-5/predictions/today" className="rounded-lg border border-[#263548] bg-[#101823] p-4 transition-colors hover:border-[#4B8DF8]">
            <span className="text-sm font-semibold text-[#E7EDF5]">Over 2.5 predictions today</span>
            <span className="mt-1 block text-xs text-[#8FA1B5]">View published match selections →</span>
          </Link>
          <Link href="/btts/statistics" className="rounded-lg border border-[#263548] bg-[#101823] p-4 transition-colors hover:border-[#4B8DF8]">
            <span className="text-sm font-semibold text-[#E7EDF5]">BTTS competition coverage</span>
            <span className="mt-1 block text-xs text-[#8FA1B5]">View the competitions listed for BTTS →</span>
          </Link>
        </section>
      </main>      <Footer />
    </div>
  )
}
