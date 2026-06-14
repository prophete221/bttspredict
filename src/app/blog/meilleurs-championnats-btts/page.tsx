import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'meilleurs-championnats-btts'
const PAGE_URL = `${SITE_URL}/blog/${SLUG}`
const TITLE = 'Les 10 Meilleurs Championnats pour les Paris BTTS en 2026'
const DESCRIPTION = 'Découvrez les 10 ligues avec les meilleurs taux BTTS (Both Teams To Score) en 2026 : Bundesliga, Eredivisie, Premier League et plus. Statistiques détaillées et conseils par championnat.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['championnats BTTS', 'ligues BTTS', 'meilleur championnat both teams to score', 'statistiques BTTS', 'Bundesliga BTTS', 'Eredivisie BTTS', 'Premier League BTTS', 'ligue 1 BTTS', 'paris BTTS championnat', 'taux BTTS ligue'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    publishedTime: '2026-03-04',
    modifiedTime: '2026-06-01',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Meilleurs Championnats BTTS 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

/* ──────────────────────────────────────────────────────────────
   JSON-LD
   ────────────────────────────────────────────────────────────── */
function buildArticleJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: '2026-03-04',
    dateModified: '2026-06-01',
    author: { '@type': 'Organization', name: 'BttsBet', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'BttsBet',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
    image: `${SITE_URL}/og-image.png`,
  }
}

function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: TITLE, item: PAGE_URL },
    ],
  }
}

/* ── League Data ── */
const leagues = [
  { rank: 1, name: 'Bundesliga (Allemagne)', rate: '62%', avgGoals: '3.18', tip: 'Les défenses allemandes laissent souvent des espaces. Privilégiez les matchs entre équipes du milieu de tableau.' },
  { rank: 2, name: 'Eredivisie (Pays-Bas)', rate: '61%', avgGoals: '3.12', tip: 'Philosophie offensive néerlandaise = beaucoup de buts. Presque tous les matchs sont éligibles BTTS.' },
  { rank: 3, name: 'Premier League (Angleterre)', rate: '58%', avgGoals: '2.85', tip: 'Intensité maximale. Les outsider à domicile marquent souvent, même contre le top 6.' },
  { rank: 4, name: 'Serie A (Brésil)', rate: '57%', avgGoals: '2.72', tip: 'Championnat très offensif avec beaucoup de retournements. Les cotes BTTS sont souvent généreuses.' },
  { rank: 5, name: 'Jupiler Pro League (Belgique)', rate: '56%', avgGoals: '2.90', tip: 'Playoffs très ouverts. Les matchs à 6 buts ne sont pas rares en fin de saison.' },
  { rank: 6, name: 'La Liga (Espagne)', rate: '55%', avgGoals: '2.62', tip: 'Focus sur les matchs impliquant des équipes comme Betis, Villarreal ou Real Sociedad — très offensives.' },
  { rank: 7, name: 'Ligue 1 (France)', rate: '54%', avgGoals: '2.58', tip: 'Les matchs hors PSG ont un excellent taux BTTS. Lens, Lille et Rennes sont des équipes BTTS-friendly.' },
  { rank: 8, name: 'Süper Lig (Turquie)', rate: '54%', avgGoals: '2.75', tip: 'Atmosphère bouillante et matchs imprévisibles. Les derbies turcs sont des festivals offensifs.' },
  { rank: 9, name: 'Liga Portugal (Portugal)', rate: '53%', avgGoals: '2.65', tip: 'Benfica et Porto marquent beaucoup, mais les défenses portugaises sont aussi perméables.' },
  { rank: 10, name: 'Serie A (Italie)', rate: '52%', avgGoals: '2.55', tip: 'L\'Italie est devenue plus offensive. Les matchs impliquant Atalanta, Lazio ou Napoli sont idéaux pour le BTTS.' },
]

/* ──────────────────────────────────────────────────────────────
   Page Component (Server Component)
   ────────────────────────────────────────────────────────────── */
export default function MeilleursChampionnatsBttsPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd()) }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <Navbar />

      <main id="main-content" className="flex-1 relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li><a href="/blog" className="hover:text-emerald transition-colors">Blog</a></li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li><span className="text-gray-400" aria-current="page">Meilleurs Championnats BTTS</span></li>
          </ol>
        </nav>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <header className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border bg-royal/15 text-royal-soft border-royal/30">
              Analyse
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl text-white mt-4 mb-4 leading-tight"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              Les 10 Meilleurs Championnats pour les Paris{' '}
              <span className="text-emerald neon-glow">BTTS</span> en 2026
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Tous les championnats ne se valent pas pour les paris BTTS. Découvrez les ligues où les deux équipes
              marquent le plus souvent, avec les statistiques détaillées et nos conseils pour chaque championnat.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <time dateTime="2026-03-04">4 mars 2026</time>
              <span>•</span>
              <span>14 min de lecture</span>
            </div>
            <div className="accent-line-emerald max-w-xs mt-6" />
          </header>

          {/* Content */}
          <div className="prose-custom space-y-8">
            {/* Intro */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Pourquoi le choix du championnat est crucial
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le marché BTTS (Both Teams To Score) dépend fortement des caractéristiques intrinsèques de chaque
                championnat. Certains championnats sont structurellement offensifs : les défenses y sont plus
                perméables, les équipes jouent plus ouvertement, et le taux de matchs où les deux équipes marquent
                dépasse régulièrement les 55%. D&apos;autres championnats sont plus tactiques et défensifs, avec des
                taux BTTS inférieurs à 45%. Comprendre ces différences est la première étape pour être rentable
                sur ce marché.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Un parieur qui sélectionne ses matchs BTTS dans la Bundesliga aura un avantage statistique naturel
                par rapport à celui qui parie sur la Serie A italienne, toutes choses égales par ailleurs. Ce
                n&apos;est pas un hasard si les bookmakers ajustent leurs cotes en fonction du championnat — les
                cotes BTTS de la Bundesliga sont généralement plus basses que celles de la Ligue 1, reflétant
                la probabilité plus élevée de BTTS. Cependant, des value bets existent même dans les championnats
                les plus « chers », comme nous le verrons dans notre <a href="/blog/strategie-mise-over-2-5" className="text-emerald hover:underline">stratégie de mise Over 2,5</a>.
              </p>
            </section>

            {/* Rankings Table */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Classement 2026 des championnats BTTS
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-edge/50 rounded-lg overflow-hidden">
                  <thead className="bg-panel/70 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Championnat</th>
                      <th className="px-4 py-3 font-semibold">Taux BTTS</th>
                      <th className="px-4 py-3 font-semibold">Buts/match</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    {leagues.map((l) => (
                      <tr key={l.rank} className="border-t border-edge/30 hover:bg-panel/30 transition-colors">
                        <td className="px-4 py-3">
                          {l.rank <= 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald/20 text-emerald text-xs font-bold">
                              {l.rank}
                            </span>
                          ) : (
                            <span className="text-gray-500">{l.rank}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white font-medium">{l.name}</td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${l.rank <= 3 ? 'text-emerald' : l.rank <= 6 ? 'text-gold' : 'text-gray-300'}`}>
                            {l.rate}
                          </span>
                        </td>
                        <td className="px-4 py-3">{l.avgGoals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-500 text-xs mt-3">
                * Statistiques basées sur les données de la saison 2025-2026 (source : données internes BttsBet & partenaires).
                Les taux peuvent varier en cours de saison.
              </p>
            </section>

            {/* Detailed analysis per league */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Analyse détaillée par championnat
              </h2>

              {/* Bundesliga */}
              <div className="card p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald/20 text-emerald font-bold text-sm">1</span>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                    Bundesliga — 62% BTTS
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  La Bundesliga est le paradis des parieurs BTTS. Avec une moyenne de 3.18 buts par match en 2025-2026,
                  c&apos;est le championnat européen le plus offensif parmi les cinq grands. La philosophie allemande privilégie
                  l&apos;attaque, et même les équipes relégables marquent régulièrement. Les matchs entre équipes du milieu
                  de tableau (positions 7-15) sont particulièrement rentables car les deux équipes jouent ouvertement
                  pour la survie ou l&apos;Europe. Les cotes BTTS sont souvent basses (1.60-1.75), mais la fiabilité compense.
                  Notre recommandation : combinez BTTS avec Over 2,5 pour maximiser les gains.
                </p>
              </div>

              {/* Eredivisie */}
              <div className="card p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald/20 text-emerald font-bold text-sm">2</span>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                    Eredivisie — 61% BTTS
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Les Pays-Bas et leur tradition du football total. L&apos;Eredivisie est le championnat où l&apos;on trouve
                  les meilleures cotes BTTS, car les bookmakers sous-estiment parfois la probabilité de buts dans
                  ce championnat moins médiatisé. Ajax, PSV et Feyenoord marquent en moyenne 2.3 buts par match à
                  domicile, mais encaissent aussi 1.1 but — ce qui fait le bonheur des parieurs BTTS. Les matchs
                  de la phase régulière sont plus fiables que les playoffs, où la tension peut réduire le nombre de buts.
                </p>
              </div>

              {/* Premier League */}
              <div className="card p-5 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald/20 text-emerald font-bold text-sm">3</span>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                    Premier League — 58% BTTS
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Le championnat le plus populaire au monde n&apos;est pas le meilleur pour le BTTS, mais il offre
                  le meilleur volume de matchs et les meilleures cotes grâce à la concurrence entre bookmakers.
                  L&apos;avantage de la Premier League : les outsiders à domicile marquent souvent, même contre le
                  Big Six. Les équipes comme Brentford, Brighton ou Wolves sont des équipes « BTTS-friendly » qui
                  marquent et encaissent avec une belle régularité. Attention aux matchs Manchester City vs
                  équipe du bas — le taux BTTS y est plus faible (environ 40%).
                </p>
              </div>

              {/* Remaining leagues summarized */}
              <div className="space-y-3 mt-4">
                {leagues.slice(3).map((l) => (
                  <div key={l.rank} className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-bold text-sm">{l.rank}.</span>
                      <div>
                        <h3 className="text-white font-semibold text-sm">
                          {l.name} — <span className="text-gold">{l.rate} BTTS</span>
                          <span className="text-gray-600 ml-2">({l.avgGoals} buts/match)</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mt-1">{l.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why some leagues are better */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Pourquoi certains championnats sont meilleurs pour le BTTS ?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Plusieurs facteurs expliquent les différences de taux BTTS entre les championnats :
              </p>
              <ul className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Culture footballistique</strong> — Les championnats
                  germaniques et néerlandais privilégient l&apos;attaque depuis la formation des jeunes.
                  Les championnats latins (Italie, Espagne) ont une tradition défensive plus marquée,
                  même si cela évolue.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Compétitivité</strong> — Plus un championnat est
                  équilibré, plus les deux équipes ont la capacité de marquer. La Premier League et la
                  Bundesliga sont réputées pour leur imprévisibilité, contrairement à la Ligue 1 française
                  dominée par le PSG.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Conditions de jeu</strong> — Les championnats joués
                  dans des climats tempérés avec des terrains en bon état favorisent le jeu offensif.
                  Les championnats africains, avec des terrains parfois difficiles, ont un taux BTTS
                  plus variable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Règlement tactique</strong> — L&apos;application du VAR
                  et les règles sur les contacts influencent le nombre de penalties et de coups francs,
                  donc le nombre de buts.</span>
                </li>
              </ul>
            </section>

            {/* Practical tips */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Conseils pratiques pour parier BTTS par championnat
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-emerald/10 border border-emerald/30">
                  <h3 className="text-emerald font-bold text-sm mb-2">✅ À faire</h3>
                  <ul className="space-y-1.5 text-sm text-gray-400 leading-relaxed">
                    <li>• Concentrez-vous sur 2-3 championnats que vous connaissez bien</li>
                    <li>• Vérifiez le taux BTTS des 5 derniers matchs de chaque équipe</li>
                    <li>• Tenez compte des blessés clés en attaque et en défense</li>
                    <li>• Utilisez notre IA pour filtrer les meilleurs matchs BTTS du jour</li>
                    <li>• Combine BTTS + Over 2,5 dans les championnats à haut taux de buts</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-lose/10 border border-lose/30">
                  <h3 className="text-red-300 font-bold text-sm mb-2">❌ À éviter</h3>
                  <ul className="space-y-1.5 text-sm text-gray-400 leading-relaxed">
                    <li>• Parier BTTS sur des championnats que vous ne suivez pas</li>
                    <li>• Ignorer le contexte (fin de saison, match sans enjeu)</li>
                    <li>• Suivre aveuglément les statistiques sans analyser le match</li>
                    <li>• Parier BTTS sur des derbies fermés (souvent 0-0 ou 1-0)</li>
                    <li>• Oublier que les cotes BTTS varient fortement selon le championnat</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mt-4">
                Pour approfondir votre méthode d&apos;analyse, consultez notre guide sur
                <a href="/blog/comment-analyser-match-btts" className="text-emerald hover:underline"> comment analyser un match pour le BTTS</a>.
                Et pour optimiser vos mises, notre article sur la
                <a href="/blog/gestion-bankroll-paris-sportifs" className="text-emerald hover:underline"> gestion de bankroll</a> vous
                donnera les clés d&apos;une approche disciplinée.
              </p>
            </section>

            {/* CTA */}
            <section className="mt-12 p-6 sm:p-8 rounded-xl bg-panel/50 border border-edge/50 text-center">
              <h2
                className="text-2xl sm:text-3xl text-white mb-3"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                Pronostics BTTS par championnat
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
                Notre IA analyse les 50+ championnats chaque jour et sélectionne les meilleurs matchs BTTS.
                Consultez nos pronostics et pariez sur Linebet avec le code VISION221.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/" className="btn-emerald px-8 py-3 text-sm font-bold inline-block">
                  Voir nos pronostics du jour
                </a>
                <a
                  href="https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration"
                  rel="sponsored nofollow"
                  target="_blank"
                  className="btn-gold px-8 py-3 text-sm font-bold inline-block"
                >
                  S&apos;inscrire sur Linebet
                </a>
              </div>
            </section>

            {/* Related */}
            <section className="mt-10 pt-8 border-t border-edge/30">
              <h3
                className="text-xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Articles <span className="text-emerald">liés</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <a href="/blog/comment-analyser-match-btts" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald">Guide</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Comment Analyser un Match pour le BTTS</p>
                </a>
                <a href="/blog/strategie-mise-over-2-5" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Stratégie</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Stratégie de Mise Over 2,5</p>
                </a>
              </div>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
