import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar, Footer } from '@/components/bttsbet'
import { generateMatchSlug, getAllMatchSlugs, getMatchBySlug } from '@/lib/matches'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllMatchSlugs()
  // Si aucune page match n'est disponible, on génère un fallback pour que le build SSG passe
  if (slugs.length === 0) {
    return [{ slug: '_placeholder' }]
  }
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const match = getMatchBySlug(slug)
  if (!match) {
    return {
      title: 'Match introuvable — BTTSPredict',
      robots: { index: false, follow: false },
    }
  }

  const home = match.home
  const away = match.away
  const league = match.league
  const date = match.date
  // Title court — limite Bing 70 chars (avec template " | BTTSPredict").
  // Format: "Home vs Away BTTS 08/08" — on évite "Pronostic" pour les équipes longues.
  const shortDate = date ? date.slice(5).replace('-', '/') : '' // "2026-08-08" → "08/08"
  const title = `${home} vs ${away} BTTS${shortDate ? ` ${shortDate}` : ''}`
  const description = `Pronostic BTTS et Over 2.5 : ${home} vs ${away} (${league}, ${date}). Analyse, probabilités et résultat vérifié. 18+.`

  return {
    title,
    description,
    alternates: { canonical: `https://bttspredict.com/match/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `https://bttspredict.com/match/${slug}`,
      type: 'article',
      images: match.homeLogo ? [{ url: match.homeLogo, alt: `Logo ${home}` }] : [],
    },
  }
}

const SITE_URL = 'https://bttspredict.com'

export default async function MatchPage({ params }: PageProps) {
  const { slug } = await params
  const match = getMatchBySlug(slug)

  if (!match) notFound()

  const { home, away, league, date, time, homeLogo, awayLogo, predictions } = match

  // Aggregate verification status
  const verified = predictions.filter(p => p.status === 'WON' || p.status === 'LOST')
  const won = verified.filter(p => p.status === 'WON').length
  const lost = verified.filter(p => p.status === 'LOST').length
  const pending = predictions.length - verified.length
  const finalScore = verified[0]?.finalScore || predictions.find(p => p.finalScore && p.finalScore !== '-')?.finalScore || null

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Pronostics', item: `${SITE_URL}/pronostics` },
      { '@type': 'ListItem', position: 3, name: `${home} vs ${away}`, item: `${SITE_URL}/match/${slug}` },
    ],
  }

  // SportsEvent JSON-LD (if real data)
  const sportsEventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${home} vs ${away}`,
    sport: 'Football',
    startDate: `${date}T${time || '00:00'}`,
    location: { '@type': 'Place', name: league },
    homeTeam: { '@type': 'SportsTeam', name: home, logo: homeLogo },
    awayTeam: { '@type': 'SportsTeam', name: away, logo: awayLogo },
  }

  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="max-w-4xl mx-auto px-4 pt-6 pb-2 text-xs text-[#6B7194]">
          <Link href="/" className="hover:text-[#5146F5]">Accueil</Link>
          <span className="mx-1">/</span>
          <Link href="/pronostics" className="hover:text-[#5146F5]">Pronostics</Link>
          <span className="mx-1">/</span>
          <span className="text-[#A5ABC5]">{home} vs {away}</span>
        </nav>

        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                {homeLogo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={homeLogo} alt={`Logo ${home}`} width={80} height={80} className="rounded-xl object-contain" loading="lazy" decoding="async" />
                )}
                <span className="text-sm sm:text-base font-bold text-center">{home}</span>
              </div>
              <div className="text-2xl font-bold text-[#6B7194]">vs</div>
              <div className="flex flex-col items-center gap-2 flex-1">
                {awayLogo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={awayLogo} alt={`Logo ${away}`} width={80} height={80} className="rounded-xl object-contain" loading="lazy" decoding="async" />
                )}
                <span className="text-sm sm:text-base font-bold text-center">{away}</span>
              </div>
            </div>

            <div className="text-center text-sm text-[#A5ABC5] mb-2">
              {league} · {date}{time ? ` · ${time}` : ''}
            </div>

            {finalScore && (
              <div className="text-center mb-2">
                <span className="inline-block px-4 py-2 rounded-xl text-lg font-bold" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                  Score final : {finalScore}
                </span>
              </div>
            )}
          </header>

          {/* Pronostics */}
          <section className="mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pronostics BTTS et Over 2.5
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((p, i) => {
                const market = (p.type || p.market || '').toLowerCase()
                const isBtts = market.includes('btts')
                const isOver = market.includes('over') || market.includes('o2.5') || market.includes('o25')
                const color = isBtts ? '#7C3AED' : isOver ? '#5DFDCB' : '#A5ABC5'
                const probaPct = Math.round(p.proba * 100)
                const isWon = p.status === 'WON'
                const isLost = p.status === 'LOST'
                const isPending = !p.status || p.status === 'PENDING'

                return (
                  <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1630', border: `1px solid ${color}40` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                        {isBtts ? 'BTTS' : 'Over 2.5'}
                      </span>
                      {p.tier === 'GOLD' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(255, 200, 87, 0.15)', color: '#FFC857' }}>
                          GOLD
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xl font-bold">{p.prediction}</span>
                      <span className="text-sm font-bold tabular-nums" style={{ color }}>{probaPct}%</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full mb-3" style={{ backgroundColor: '#1E2340' }}>
                      <div className="h-full rounded-full" style={{ width: `${probaPct}%`, backgroundColor: color }} />
                    </div>

                    <div className="text-xs text-[#6B7194] mb-2">Confiance : {p.confidence}%</div>

                    {isWon && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(168, 224, 99, 0.15)', color: '#A8E063' }}>
                        ✓ Gagné
                      </div>
                    )}
                    {isLost && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255, 113, 133, 0.15)', color: '#FF7185' }}>
                        ✗ Perdu
                      </div>
                    )}
                    {isPending && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(165, 171, 197, 0.15)', color: '#A5ABC5' }}>
                        ⏳ En attente
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-[#6B7194] mt-4 leading-relaxed text-center">
              Les probabilités affichées sont comprises entre 40% et 54% — plage crédible de calibration du moteur. Aucune probabilité n'est présentée comme une garantie. Aucun résultat futur n'est garanti. 18+.
            </p>
          </section>

          {/* Vérification */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Vérification
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#A8E063]">{won}</div>
                  <div className="text-xs text-[#6B7194] uppercase">Gagnés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FF7185]">{lost}</div>
                  <div className="text-xs text-[#6B7194] uppercase">Perdus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#A5ABC5]">{pending}</div>
                  <div className="text-xs text-[#6B7194] uppercase">En attente</div>
                </div>
              </div>
              {verified.length > 0 && verified[0].verifiedAt && (
                <p className="text-xs text-[#6B7194] mt-3 text-center">
                  Vérifié le {new Date(verified[0].verifiedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              )}
              <p className="text-xs text-[#6B7194] mt-2 text-center">
                Source : ESPN et TheSportsDB. Suivi public depuis le 2026-08-08.
              </p>
            </div>
          </section>

          {/* Liens internes */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Aller plus loin
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/pronostics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
                style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="text-sm font-bold text-[#F7F8FF] mb-1">Voir les pronostics du jour →</div>
                <div className="text-xs text-[#A5ABC5]">Tous les matchs sélectionnés par le moteur IA</div>
              </Link>
              <Link href="/vip" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5]"
                style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
                <div className="text-sm font-bold text-[#F7F8FF] mb-1">Pronostics premium →</div>
                <div className="text-xs text-[#A5ABC5]">Programme VIP BTTSPredict</div>
              </Link>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 113, 133, 0.06)', border: '1px solid rgba(255, 113, 133, 0.2)' }}>
              <p className="text-xs text-[#A5ABC5] leading-relaxed">
                18+ · Les paris sportifs comportent un risque de perte. Aucun résultat futur n'est garanti. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. Pronostic publié à titre informatif, ne constitue pas une incitation à parier.
              </p>
            </div>
          </section>
        </article>
      </main>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventJsonLd) }} />
    </div>
  )
}
