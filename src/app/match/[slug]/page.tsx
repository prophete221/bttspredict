import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar, Footer } from '@/components/bttsbet'
import { generateMatchSlug, getAllMatchSlugs, getMatchBySlug, getVerifiedHistoryForMatch, verifiedMarketKey } from '@/lib/matches'
import Link from 'next/link'
import MatchAnalyticsCharts from '@/components/bttsbet/MatchAnalyticsCharts'
import { localizedPath, type Locale } from '@/lib/i18n'

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

const MATCH_COPY: Record<Locale, {
  home: string; predictions: string; breadcrumb: string; finalScore: string; report: string; published: string;
  bttsSubtitle: string; overSubtitle: string; won: string; lost: string; pending: string; noFuture: string;
  keyFact: string; analysis: string; verification: string; verifiedAt: string; source: string;
  intelligence: string; further: string; today: string; todayDesc: string; premium: string; vipDesc: string; disclaimer: string;
}> = {
  fr: { home: 'Accueil', predictions: 'Pronostics', breadcrumb: 'Fil d’Ariane', finalScore: 'Score final', report: 'Rapport de signal', published: 'Données publiées', bttsSubtitle: 'Les deux équipes marquent', overSubtitle: 'Total de buts ≥ 3', won: 'Gagné', lost: 'Perdu', pending: 'En attente', noFuture: 'Aucun résultat futur n’est garanti. 18+.', keyFact: 'Statistique clé — xG & données disponibles', analysis: 'Analyse statistique', verification: 'Vérification', verifiedAt: 'Vérifié le', source: 'Source : ESPN et TheSportsDB. Suivi public depuis le 2026-08-08.', intelligence: 'Intelligence du match', further: 'Aller plus loin', today: 'Voir les pronostics du jour →', todayDesc: 'Tous les matchs sélectionnés par le moteur IA', premium: 'Pronostics premium →', vipDesc: 'Programme VIP BTTSPredict', disclaimer: '18+ · Les paris sportifs comportent un risque de perte. Aucun résultat futur n’est garanti. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. Pronostic publié à titre informatif, ne constitue pas une incitation à parier.' },
  en: { home: 'Home', predictions: 'Predictions', breadcrumb: 'Breadcrumb', finalScore: 'Final score', report: 'Signal report', published: 'Published data', bttsSubtitle: 'Both teams to score', overSubtitle: 'Total goals ≥ 3', won: 'Won', lost: 'Lost', pending: 'Pending', noFuture: 'No future result is guaranteed. 18+.', keyFact: 'Key statistic — xG & available data', analysis: 'Statistical analysis', verification: 'Verification', verifiedAt: 'Verified on', source: 'Source: ESPN and TheSportsDB. Public tracking since 2026-08-08.', intelligence: 'Match intelligence', further: 'Explore further', today: 'View today’s predictions →', todayDesc: 'All matches selected by the AI engine', premium: 'Premium predictions →', vipDesc: 'BTTSPredict VIP programme', disclaimer: '18+ · Sports betting carries a risk of loss. No future result is guaranteed. BTTSPredict does not take bets or hold funds. This prediction is informational and is not an invitation to bet.' },
  ar: { home: 'الرئيسية', predictions: 'التوقعات', breadcrumb: 'مسار التنقل', finalScore: 'النتيجة النهائية', report: 'تقرير الإشارة', published: 'بيانات منشورة', bttsSubtitle: 'كلا الفريقين يسجلان', overSubtitle: 'إجمالي الأهداف ≥ 3', won: 'فوز', lost: 'خسارة', pending: 'قيد الانتظار', noFuture: 'لا توجد ضمانات لأي نتيجة مستقبلية. 18+.', keyFact: 'إحصائية أساسية — xG والبيانات المتاحة', analysis: 'تحليل إحصائي', verification: 'التحقق', verifiedAt: 'تم التحقق في', source: 'المصدر: ESPN وTheSportsDB. متابعة عامة منذ 2026-08-08.', intelligence: 'ذكاء المباراة', further: 'استكشف المزيد', today: 'عرض توقعات اليوم ←', todayDesc: 'جميع المباريات التي اختارها محرك الذكاء الاصطناعي', premium: 'التوقعات المميزة ←', vipDesc: 'برنامج VIP من BTTSPredict', disclaimer: '18+ · المراهنات الرياضية تنطوي على خطر الخسارة. لا توجد ضمانات لأي نتيجة مستقبلية. BTTSPredict لا يقبل الرهانات ولا يحتفظ بالأموال. هذا التوقع إعلامي وليس دعوة للمراهنة.' },
}

export default async function MatchPage({ params, locale = 'fr' }: PageProps & { locale?: Locale }) {
  const { slug } = await params
  const match = getMatchBySlug(slug)

  if (!match) notFound()
  const copy = MATCH_COPY[locale]

  const { home, away, league, date, time, homeLogo, awayLogo, predictions } = match
  const verifiedHistory = getVerifiedHistoryForMatch(home, away, date)
  const aiExactScore = match.aiExactScore || null
  const exactScoreProb = match.exactScoreProb || null
  const aiBttsProb = match.aiBttsProb || null
  const aiOver25Prob = match.aiOver25Prob || null
  const aiKeyFact = match.aiKeyFact || null
  const aiAnalysis = match.aiAnalysis || null

  // One market card per prediction type. Archived feeds can contain repeated
  // rows for the same market; the match page must never present duplicates.
  const marketMap = new Map<string, (typeof predictions)[number]>()
  for (const prediction of predictions) {
    const market = (prediction.type || prediction.market || 'prediction').toLowerCase()
    const existing = marketMap.get(market)
    if (!existing || (!existing.status && prediction.status)) marketMap.set(market, prediction)
  }
  const marketPredictions = Array.from(marketMap.values()).map(prediction => {
    const verified = verifiedHistory.find(entry => verifiedMarketKey(entry.market || entry.type) === verifiedMarketKey(prediction.type || prediction.market))
    if (!verified) return prediction
    return {
      ...prediction,
      status: verified.status || (verified.isWon === true ? 'WON' : verified.isWon === false ? 'LOST' : prediction.status),
      isWon: verified.isWon,
      finalScore: verified.finalScore || verified.score || prediction.finalScore,
      verifiedAt: verified.verifiedAt || prediction.verifiedAt,
      source: verified.source || prediction.source,
    }
  })

  // Aggregate verification status from unique markets only.
  const verified = marketPredictions.filter(p => p.status === 'WON' || p.status === 'LOST')
  const won = verified.filter(p => p.status === 'WON').length
  const lost = verified.filter(p => p.status === 'LOST').length
  const pending = marketPredictions.filter(p => !p.status || p.status === 'PENDING').length
  const finalScore = verified[0]?.finalScore || marketPredictions.find(p => p.finalScore && p.finalScore !== '-')?.finalScore || null

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Pronostics', item: `${SITE_URL}/btts/predictions/today` },
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
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <Navbar />

      <main id="main-content" className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label={copy.breadcrumb} className="max-w-4xl mx-auto px-4 pt-6 pb-2 text-xs text-[#B7C4C1]">
          <Link href={localizedPath('/', locale)} className="hover:text-[#B8FF1A]">{copy.home}</Link>
          <span className="mx-1">/</span>
          <Link href={localizedPath('/btts/predictions/today', locale)} className="hover:text-[#B8FF1A]">{copy.predictions}</Link>
          <span className="mx-1">/</span>
          <span className="text-[#B7C4C1]">{home} vs {away}</span>
        </nav>

        <article className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8 rounded-3xl border border-[#304951] bg-[#0D1A20] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] sm:p-8">
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                {homeLogo && (
                  <img src={homeLogo} alt={`Logo ${home}`} width={80} height={80} className="rounded-xl object-contain" loading="lazy" decoding="async" />
                )}
                <span className="text-sm sm:text-base font-bold text-center">{home}</span>
              </div>
              <div className="text-2xl font-bold text-[#B7C4C1]">vs</div>
              <div className="flex flex-col items-center gap-2 flex-1">
                {awayLogo && (
                  <img src={awayLogo} alt={`Logo ${away}`} width={80} height={80} className="rounded-xl object-contain" loading="lazy" decoding="async" />
                )}
                <span className="text-sm sm:text-base font-bold text-center">{away}</span>
              </div>
            </div>

            <div className="text-center text-sm text-[#B7C4C1] mb-2">
              {league} · {date}{time ? ` · ${time}` : ''}
            </div>

            {finalScore && (
              <div className="text-center mb-2">
                <span className="inline-block px-4 py-2 rounded-xl text-lg font-bold" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
                  {copy.finalScore} : {finalScore}
                </span>
              </div>
            )}
          </header>

          {/* Pronostics */}
          <section className="mb-10">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8FF1A]">{copy.intelligence}</p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {copy.report}
                </h1>
              </div>
              <span className="text-right text-[10px] uppercase tracking-wider text-[#9FB0B0]">{copy.published}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {marketPredictions.map((p, i) => {
                const market = (p.type || p.market || '').toLowerCase()
                const isBtts = market.includes('btts')
                const isOver = market.includes('over') || market.includes('o2.5') || market.includes('o25')
                const color = isBtts ? '#B8FF1A' : isOver ? '#B8FF1A' : '#B7C4C1'
                const label = isBtts ? 'BTTS' : isOver ? 'Over 2.5' : (p.type || p.market || 'Prediction')
                const isWon = p.status === 'WON'
                const isLost = p.status === 'LOST'
                const isPending = !p.status || p.status === 'PENDING'
                const probLabel = isBtts ? aiBttsProb : isOver ? aiOver25Prob : null

                return (
                  <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: '#0D1A20', border: `1px solid ${color}40` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>
                        {label}
                      </span>
                      {probLabel && (
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded" style={{ backgroundColor: `${color}15`, color }}>
                          {probLabel}
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-black mb-2" style={{ color: p.prediction === 'Oui' ? color : '#B7C4C1' }}>
                      {p.prediction === 'Oui' ? (locale === 'ar' ? 'نعم' : locale === 'en' ? 'Yes' : 'Oui') : p.prediction === 'Non' ? (locale === 'ar' ? 'لا' : locale === 'en' ? 'No' : 'Non') : p.prediction}
                    </div>

                    {/* Subtitle to make cards visually distinct */}
                    <div className="text-[10px] text-[#B7C4C1] mb-2">
                      {isBtts ? copy.bttsSubtitle : isOver ? copy.overSubtitle : ''}
                    </div>

                    {isWon && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#B8FF1A' }}>
                        ✓ {copy.won}
                      </div>
                    )}
                    {isLost && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(255, 113, 133, 0.15)', color: '#FF7B7B' }}>
                        ✗ {copy.lost}
                      </div>
                    )}
                    {isPending && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: 'rgba(156, 163, 175, 0.15)', color: '#B7C4C1' }}>
                        ⏳ {copy.pending}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-[#B7C4C1] mt-4 leading-relaxed text-center">
              {copy.noFuture}
            </p>
          </section>

          <MatchAnalyticsCharts
            bttsProb={match.bttsProb}
            over25Prob={match.over25Prob}
            exactScoreProb={exactScoreProb || undefined}
            homeLambda={match.homeLambda}
            awayLambda={match.awayLambda}
            xgTotal={match.xgTotal}
          />

          {/* SECTION RAPPORT D'ANALYSE BTTSPREDICT AI */}
          {(aiKeyFact || aiExactScore) && (
            <section className="mb-10">
              <div className="rounded-2xl border border-[#304951] bg-[#0D1A20] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-6">
                <div className="flex items-center justify-between border-b border-[#304951] pb-3">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-[#F5F8F3]">
                    <span className="text-[#B8FF1A]">{copy.report}</span> — BTTSPredict AI
                  </h2>
                  {aiExactScore && (
                    <span className="px-2.5 py-1 text-xs font-black rounded-md" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#B8FF1A', border: '1px solid rgba(245,158,11,0.3)' }}>
                      {copy.finalScore} : {aiExactScore}
                    </span>
                  )}
                </div>

                {/* Probabilities row */}
                {(exactScoreProb || aiBttsProb || aiOver25Prob) && (
                  <div className="grid grid-cols-3 gap-2">
                    {exactScoreProb && (
                      <div className="text-center rounded-lg p-2" style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}>
                        <div className="text-[9px] uppercase tracking-wider text-[#B7C4C1]">Score exact</div>
                        <div className="text-base font-bold text-[#B8FF1A]">{exactScoreProb}</div>
                      </div>
                    )}
                    {aiBttsProb && (
                      <div className="text-center rounded-lg p-2" style={{ backgroundColor: 'rgba(6,182,212,0.08)' }}>
                        <div className="text-[9px] uppercase tracking-wider text-[#B7C4C1]">BTTS</div>
                        <div className="text-base font-bold text-[#B8FF1A]">{aiBttsProb}</div>
                      </div>
                    )}
                    {aiOver25Prob && (
                      <div className="text-center rounded-lg p-2" style={{ backgroundColor: 'rgba(255,209,102,0.08)' }}>
                        <div className="text-[9px] uppercase tracking-wider text-[#B7C4C1]">Over 2.5</div>
                        <div className="text-base font-bold text-[#B8FF1A]">{aiOver25Prob}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Statistique Clé */}
                {aiKeyFact && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#071018', border: '1px solid #5D7880' }}>
                    <span className="text-[11px] font-bold text-[#B8FF1A] uppercase tracking-wider block mb-1">
                      📌 {copy.keyFact}
                    </span>
                    <p className="text-xs text-[#F5F8F3] italic">&ldquo;{aiKeyFact}&rdquo;</p>
                  </div>
                )}

                {/* Analyse Complète */}
                {aiAnalysis && (
                  <div className="p-3.5 rounded-lg" style={{ backgroundColor: '#071018', border: '1px solid #5D7880' }}>
                    <span className="text-[11px] font-bold text-[#B7C4C1] uppercase tracking-wider block mb-1">
                      📝 {copy.analysis}
                    </span>
                    <p className="text-xs text-[#B7C4C1] leading-relaxed">
                      {aiAnalysis}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Vérification */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {copy.verification}
            </h2>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#B8FF1A]">{won}</div>
                  <div className="text-xs text-[#B7C4C1] uppercase">{copy.won}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FF7B7B]">{lost}</div>
                  <div className="text-xs text-[#B7C4C1] uppercase">{copy.lost}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#B7C4C1]">{pending}</div>
                  <div className="text-xs text-[#B7C4C1] uppercase">{copy.pending}</div>
                </div>
              </div>
              {verified.length > 0 && verified[0].verifiedAt && (
                <p className="text-xs text-[#B7C4C1] mt-3 text-center">
                  {copy.verifiedAt} {new Date(verified[0].verifiedAt).toLocaleString(locale === 'ar' ? 'ar' : locale === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </p>
              )}
              <p className="text-xs text-[#B7C4C1] mt-2 text-center">
                {copy.source}
              </p>
            </div>
          </section>

          {/* Liens internes */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {copy.further}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href={localizedPath('/btts/predictions/today', locale)} className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]"
                style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
                <div className="text-sm font-bold text-[#F5F8F3] mb-1">{copy.today}</div>
                <div className="text-xs text-[#B7C4C1]">{copy.todayDesc}</div>
              </Link>
              <Link href={localizedPath('/vip', locale)} className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF1A]"
                style={{ backgroundColor: '#0D1A20', border: '1px solid #5D7880' }}>
                <div className="text-sm font-bold text-[#F5F8F3] mb-1">{copy.premium}</div>
                <div className="text-xs text-[#B7C4C1]">{copy.vipDesc}</div>
              </Link>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'rgba(255, 122, 122, 0.06)', border: '1px solid rgba(255, 122, 122, 0.2)' }}>
              <p className="text-xs text-[#B7C4C1] leading-relaxed">
                {copy.disclaimer}
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
