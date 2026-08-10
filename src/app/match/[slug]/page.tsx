import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar, Footer } from '@/components/bttsbet'
import { generateMatchSlug, getAllMatchSlugs, getMatchBySlug } from '@/lib/matches'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Stratégie SSG explicite pour /match/[slug] :
// - generateStaticParams() pré-génère toutes les pages match valides au build
// - dynamicParams = false → toute URL /match/[slug] non pré-générée retourne 404
//   (au lieu d'être servie côté serveur, ce qui casserait en mode `output: export`)
// - dynamic = 'force-static' → garantie que la page est rendue en statique pur
//
// En cas de /match/[slug] introuvable, l'utilisateur voit la page /404.html
// personnalisée (gérée par LWS via .htaccess).
export const dynamicParams = false
export const dynamic = 'force-static'

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
  const description = `Pronostic BTTS et Over 2.5 : ${home} vs ${away} (${league}, ${date}). Analyse et résultat vérifié. 18+.`

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
  const aiExactScore = (match as any).ai_exact_score || null
  const exactScoreProb = (match as any).exact_score_prob || null
  const aiBttsProb = (match as any).ai_btts_prob || null
  const aiOver25Prob = (match as any).ai_over25_prob || null
  const aiKeyFact = (match as any).ai_key_fact || null
  const aiAnalysis = (match as any).ai_analysis || null

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
    <div className="min-h-screen bg-[#07111A] flex flex-col text-[#F2F7F5]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="max-w-4xl mx-auto px-4 pt-6 pb-2 text-xs text-[#7F969E]">
          <Link href="/" className="hover:text-[#C7F464]">Accueil</Link>
          <span className="mx-1">/</span>
          <Link href="/pronostics" className="hover:text-[#C7F464]">Pronostics</Link>
          <span className="mx-1">/</span>
          <span className="text-[#B5C4C9]">{home} vs {away}</span>
        </nav>

        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                {homeLogo && (
                  <img src={homeLogo} alt={`Logo ${home}`} width={80} height={80} className="rounded-xl object-contain" loading="lazy" decoding="async" />
                )}
                <span className="text-sm sm:text-base font-bold text-center">{home}</span>
              </div>
              <div className="text-2xl font-bold text-[#7F969E]">vs</div>
              <div className="flex flex-col items-center gap-2 flex-1">
                {awayLogo && (
                  <img src={awayLogo} alt={`Logo ${away}`} width={80} height={80} className="rounded-xl object-contain" loading="lazy" decoding="async" />
                )}
                <span className="text-sm sm:text-base font-bold text-center">{away}</span>
              </div>
            </div>

            <div className="text-center text-sm text-[#B5C4C9] mb-2">
              {league} · {date}{time ? ` · ${time}` : ''}
            </div>

            {finalScore && (
              <div className="text-center mb-2">
                <span className="inline-block px-4 py-2 rounded-xl text-lg font-bold" style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
                  Score final : {finalScore}
                </span>
              </div>
            )}
          </header>

          {/* BTTSPredict AI Analysis */}
          {(aiKeyFact || aiExactScore) && (
            <section className="mb-10">
              <div className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(99,214,255,0.06)', border: '1px solid rgba(99,214,255,0.2)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#63D6FF" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-xs uppercase tracking-widest font-bold text-[#63D6FF]">BTTSPredict AI</span>
                  </div>
                  {aiExactScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#7F969E]">Score prédit</span>
                      <span className="text-xl font-black font-mono text-[#C7F464] px-3 py-1 rounded-lg" style={{ backgroundColor: 'rgba(199,244,100,0.12)' }}>
                        {aiExactScore}
                      </span>
                    </div>
                  )}
                </div>

                {/* Probabilities row */}
                {(aiExactScore || aiBttsProb || aiOver25Prob) && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {aiExactScore && exactScoreProb && (
                      <div className="text-center rounded-lg p-2" style={{ backgroundColor: 'rgba(199,244,100,0.08)' }}>
                        <div className="text-[9px] uppercase tracking-wider text-[#7F969E] mb-1">Score exact</div>
                        <div className="text-lg font-bold text-[#C7F464]">{exactScoreProb}</div>
                      </div>
                    )}
                    {aiBttsProb && (
                      <div className="text-center rounded-lg p-2" style={{ backgroundColor: 'rgba(123,228,149,0.08)' }}>
                        <div className="text-[9px] uppercase tracking-wider text-[#7F969E] mb-1">BTTS</div>
                        <div className="text-lg font-bold text-[#7BE495]">{aiBttsProb}</div>
                      </div>
                    )}
                    {aiOver25Prob && (
                      <div className="text-center rounded-lg p-2" style={{ backgroundColor: 'rgba(255,209,102,0.08)' }}>
                        <div className="text-[9px] uppercase tracking-wider text-[#7F969E] mb-1">Over 2.5</div>
                        <div className="text-lg font-bold text-[#FFD166]">{aiOver25Prob}</div>
                      </div>
                    )}
                  </div>
                )}

                {aiKeyFact && (
                  <p className="text-sm text-[#F2F7F5] font-semibold mb-2">📊 {aiKeyFact}</p>
                )}
                {aiAnalysis && (
                  <p className="text-sm text-[#B5C4C9] leading-relaxed">{aiAnalysis}</p>
                )}
              </div>
            </section>
          )}

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
                const color = isBtts ? '#63D6FF' : isOver ? '#63D6FF' : '#B5C4C9'
                const isWon = p.status === 'WON'
                const isLost = p.status === 'LOST'
                const isPending = !p.status || p.status === 'PENDING'

                return (
                  <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: '#102333', border: `1px solid ${color}40` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                        {isBtts ? 'BTTS' : 'Over 2.5'}
                      </span>
                    </div>

                    <div className="text-2xl font-black mb-2" style={{ color: p.prediction === 'Oui' ? color : '#B5C4C9' }}>
                      {p.prediction}
                    </div>

                    {isWon && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(168, 224, 99, 0.15)', color: '#A8E063' }}>
                        ✓ Gagné
                      </div>
                    )}
                    {isLost && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255, 122, 122, 0.15)', color: '#FF7A7A' }}>
                        ✗ Perdu
                      </div>
                    )}
                    {isPending && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(165, 171, 197, 0.15)', color: '#B5C4C9' }}>
                        ⏳ En attente
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-[#7F969E] mt-4 leading-relaxed text-center">
              Aucun résultat futur n&apos;est garanti. 18+.
            </p>
          </section>

          {/* Vérification */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Vérification
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#A8E063]">{won}</div>
                  <div className="text-xs text-[#7F969E] uppercase">Gagnés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FF7A7A]">{lost}</div>
                  <div className="text-xs text-[#7F969E] uppercase">Perdus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#B5C4C9]">{pending}</div>
                  <div className="text-xs text-[#7F969E] uppercase">En attente</div>
                </div>
              </div>
              {verified.length > 0 && verified[0].verifiedAt && (
                <p className="text-xs text-[#7F969E] mt-3 text-center">
                  Vérifié le {new Date(verified[0].verifiedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              )}
              <p className="text-xs text-[#7F969E] mt-2 text-center">
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
              <Link href="/pronostics" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
                style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
                <div className="text-sm font-bold text-[#F2F7F5] mb-1">Voir les pronostics du jour →</div>
                <div className="text-xs text-[#B5C4C9]">Tous les matchs sélectionnés par le moteur IA</div>
              </Link>
              <Link href="/vip" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
                style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
                <div className="text-sm font-bold text-[#F2F7F5] mb-1">Pronostics premium →</div>
                <div className="text-xs text-[#B5C4C9]">Programme VIP BTTSPredict</div>
              </Link>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}>
              <p className="text-xs text-[#B5C4C9] leading-relaxed">
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
