import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'comment-analyser-match-btts'
const PAGE_URL = `${SITE_URL}/blog/${SLUG}`
const TITLE = 'Comment Analyser un Match pour le BTTS ? Guide Complet 2026'
const DESCRIPTION = 'Apprenez à analyser un match de football pour le marché BTTS (Both Teams To Score) : xG, statistiques défensives, face-à-face, motivation, blessures et méthode pas-à-pas avec exemples concrets.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['analyser match BTTS', 'both teams to score analyse', 'statistiques BTTS', 'xG BTTS', 'analyse match football', 'pronostic BTTS methode', 'facteurs BTTS', 'analyse pronostic football', 'H2H BTTS', 'checklist paris BTTS'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    publishedTime: '2026-03-20',
    modifiedTime: '2026-06-01',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Analyser un Match BTTS – Guide 2026' }],
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
    datePublished: '2026-03-20',
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

/* ──────────────────────────────────────────────────────────────
   Page Component (Server Component)
   ────────────────────────────────────────────────────────────── */
export default function CommentAnalyserMatchBttsPage() {
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
            <li><span className="text-gray-400" aria-current="page">Analyser un Match BTTS</span></li>
          </ol>
        </nav>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <header className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border bg-emerald/15 text-emerald border-emerald/30">
              Guide
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl text-white mt-4 mb-4 leading-tight"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              Comment Analyser un Match pour le{' '}
              <span className="text-emerald neon-glow">BTTS</span> ? Guide Complet 2026
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              L&apos;analyse d&apos;un match pour le marché BTTS va bien au-delà de regarder les statistiques basiques.
              Découvrez les facteurs clés, la méthodologie pas-à-pas et comment l&apos;IA peut vous donner un avantage
              décisif dans vos pronostics.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <time dateTime="2026-03-20">20 mars 2026</time>
              <span>•</span>
              <span>14 min de lecture</span>
            </div>
            <div className="accent-line-emerald max-w-xs mt-6" />
          </header>

          {/* Content */}
          <div className="prose-custom space-y-8">
            {/* Section 1 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Les 6 facteurs clés de l&apos;analyse BTTS
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Un pronostic BTTS fiable repose sur l&apos;examen minutieux de six facteurs fondamentaux. Chaque facteur
                pris isolément a une valeur prédictive limitée, mais combinés, ils forment une image claire de la
                probabilité que les deux équipes marquent. Voici le détail de chacun :
              </p>
            </section>

            {/* Factor 1: xG */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                1. Les Expected Goals (xG) : l&apos;indicateur roi
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Les Expected Goals, ou buts attendus, mesurent la qualité des occasions de but créées par une équipe.
                Contrairement au nombre de buts réels qui peut être trompeur (un but chanceux sur un tir à 30 mètres
                compte autant qu&apos;une finition de près), les xG pondèrent chaque tir en fonction de la probabilité
                qu&apos;il se transforme en but, basée sur des milliers de situations similaires.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Comment utiliser les xG pour le BTTS :</strong>
              </p>
              <ul className="space-y-2 mt-3 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span>Un xG offensif supérieur à 1.3 par match pour les deux équipes = signal positif pour le BTTS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span>Un xG contre (défensif) supérieur à 1.0 par match = la défense est perméable, l&apos;adversaire a des chances de marquer</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span>Comparez les xG récents (5 derniers matchs) avec les xG de la saison — un écart peut indiquer un changement de forme</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span>Si une équipe surperforme ses xG (plus de buts que la qualité des occasions), une correction statistique est probable</span>
                </li>
              </ul>
              <div className="mt-4 p-4 rounded-lg bg-emerald/10 border border-emerald/30">
                <p className="text-sm text-emerald-soft leading-relaxed">
                  <strong>Exemple concret :</strong> Lens vs Lille en Ligue 1. Lens a un xG offensif de 1.8 à domicile
                  et encaisse 1.2 xG contre. Lille a un xG offensif de 1.5 à l&apos;extérieur et encaisse 1.4 xG contre.
                  La somme des xG suggère un match ouvert avec environ 3 buts attendus — excellent profil BTTS.
                  Notre IA a détecté ce type de match avec une précision d&apos;environ 87%.
                </p>
              </div>
            </section>

            {/* Factor 2: Defensive Stats */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                2. Les statistiques défensives : le côté oublié
              </h2>
              <p className="text-gray-400 leading-relaxed">
                La plupart des parieurs BTTS se concentrent sur les statistiques offensives et oublient que
                le BTTS nécessite aussi que les défenses laissent passer des buts. Voici les métriques défensives
                essentielles :
              </p>
              <div className="grid gap-3 mt-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                  <h3 className="text-white font-semibold text-sm mb-1">Clean Sheets</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Le pourcentage de matchs sans encaisser. Moins de 20% de clean sheets = défense vulnérable.
                    Plus de 40% = défense solide, le BTTS est risqué.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                  <h3 className="text-white font-semibold text-sm mb-1">Buts encaissés/match</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Plus de 1.3 buts encaissés par match = signal BTTS positif. Entre 0.8 et 1.3 = neutre.
                    Moins de 0.8 = défense solide, à éviter pour le BTTS.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                  <h3 className="text-white font-semibold text-sm mb-1">Tirs cadrés concédés</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Plus de 5 tirs cadrés concédés par match = l&apos;adversaire a des occasions régulières.
                    Un indicateur parfois plus fiable que les buts encaissés.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                  <h3 className="text-white font-semibold text-sm mb-1">xG contre</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    L&apos;xG concédé mesure la qualité des occasions offertes à l&apos;adversaire. Supérieur à 1.2 xG
                    contre par match = signal fort pour le BTTS adverse.
                  </p>
                </div>
              </div>
            </section>

            {/* Factor 3: H2H */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                3. Les face-à-face (Head-to-Head)
              </h2>
              <p className="text-gray-400 leading-relaxed">
                L&apos;historique des confrontations entre deux équipes offre des indices précieux, mais il faut
                l&apos;utiliser avec nuance. Les face-à-face récents (2-3 dernières saisons) sont plus pertinents
                que l&apos;historique complet, car les effectifs et les tactiques changent.
              </p>
              <ul className="space-y-2 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span>Si les 5 derniers H2H ont produit 4+ matchs BTTS, la tendance est forte</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span>Les scores récurrents (souvent 1-1, 2-1, 2-2) indiquent un pattern entre les deux équipes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span>Attention aux confrontations en Coupe vs Championnat — le contexte tactique diffère</span>
                </li>
              </ul>
            </section>

            {/* Factor 4: Motivation */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                4. La motivation des équipes
              </h2>
              <p className="text-gray-400 leading-relaxed">
                La motivation est un facteur souvent sous-estimé mais crucial pour le BTTS. Une équipe qui
                doit absolument gagner pour se sauver de la relégation ou se qualifier pour l&apos;Europe va jouer
                de manière plus ouverte et offensée, augmentant les chances de buts des deux côtés.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm text-left border border-edge/50 rounded-lg overflow-hidden">
                  <thead className="bg-panel/70 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Contexte</th>
                      <th className="px-4 py-3 font-semibold">Impact BTTS</th>
                      <th className="px-4 py-3 font-semibold">Explication</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr className="border-t border-edge/30">
                      <td className="px-4 py-3 text-white">Lutte pour le maintien</td>
                      <td className="px-4 py-3"><span className="text-emerald font-semibold">+ + +</span></td>
                      <td className="px-4 py-3">Les deux équipes jouent à fond, espaces en défense</td>
                    </tr>
                    <tr className="border-t border-edge/30">
                      <td className="px-4 py-3 text-white">Qualification européenne</td>
                      <td className="px-4 py-3"><span className="text-emerald font-semibold">+ +</span></td>
                      <td className="px-4 py-3">Motivation élevée, matchs ouverts</td>
                    </tr>
                    <tr className="border-t border-edge/30">
                      <td className="px-4 py-3 text-white">Fin de saison sans enjeu</td>
                      <td className="px-4 py-3"><span className="text-lose font-semibold">- -</span></td>
                      <td className="px-4 py-3">Matchs amicaux déguisés, intensité réduite</td>
                    </tr>
                    <tr className="border-t border-edge/30">
                      <td className="px-4 py-3 text-white">Retour de blessé star</td>
                      <td className="px-4 py-3"><span className="text-gold font-semibold">+</span></td>
                      <td className="px-4 py-3">Boost psychologique, plus d&apos;occasions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Factor 5: Injuries */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                5. Blessures et suspensions
              </h2>
              <p className="text-gray-400 leading-relaxed">
                L&apos;absence d&apos;un joueur clé peut radicalement changer la dynamique d&apos;un match. Pour l&apos;analyse BTTS,
                concentrez-vous sur deux catégories de blessés :
              </p>
              <ul className="space-y-2 mt-3 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5">⚡</span>
                  <span><strong className="text-white">Blessés en attaque</strong> — L&apos;absence du meilleur buteur
                  peut réduire la probabilité que l&apos;équipe marque. Si les deux équipes perdent leur attaquant
                  principal, le BTTS est compromis. Vérifiez aussi les milieux offensifs créatifs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">⚡</span>
                  <span><strong className="text-white">Blessés en défense</strong> — L&apos;absence du défenseur central
                  titulaire ou du gardien numéro 1 augmente significativement les chances que l&apos;adversaire
                  marque. C&apos;est souvent un signal BTTS positif si UNE équipe est touchée défensivement.</span>
                </li>
              </ul>
            </section>

            {/* Factor 6: How AI helps */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                6. Comment l&apos;IA révolutionne l&apos;analyse BTTS
              </h2>
              <p className="text-gray-400 leading-relaxed">
                L&apos;intelligence artificielle de BttsBet analyse simultanément plus de 200 variables pour chaque match,
                ce qu&apos;un humain ne peut pas faire manuellement. Notre modèle de machine learning est entraîné sur
                plus de 50 000 matchs historiques et intègre des données en temps réel :
              </p>
              <ul className="space-y-2 mt-3 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Modèles xG avancés qui prennent en compte le placement des joueurs, la pression défensive et l&apos;angle de tir</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Analyse de sentiment basée sur les actualités (blessés de dernière minute, conflits internes)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Détection automatique des value bets où la cote du bookmaker est supérieure à la probabilité réelle</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Ajustement en temps réel des prédictions en fonction des lineups officiels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Indice de confiance calculé pour chaque pronostic, vous permettant d&apos;adapter votre mise</span>
                </li>
              </ul>
            </section>

            {/* Checklist */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Checklist pratique avant de parier BTTS
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Imprimez ou mémorisez cette checklist et consultez-la avant chaque pari BTTS :
              </p>
              <div className="mt-4 p-5 rounded-lg bg-panel/50 border border-emerald/30">
                <ul className="space-y-2.5 text-sm text-gray-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>Les deux équipes marquent dans plus de <strong className="text-white">55% de leurs matchs</strong> cette saison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>L&apos;xG offensif des deux équipes dépasse <strong className="text-white">1.2 par match</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>Les clean sheets des deux équipes sont inférieurs à <strong className="text-white">30%</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>Les <strong className="text-white">3 derniers H2H</strong> ont produit au moins 2 matchs BTTS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>Aucun attaquant clé n&apos;est <strong className="text-white">blessé ou suspendu</strong> dans les deux équipes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>Le championnat a un <strong className="text-white">taux BTTS supérieur à 50%</strong> (voir notre <a href="/blog/meilleurs-championnats-btts" className="text-emerald hover:underline">classement</a>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>Les deux équipes ont un <strong className="text-white">enjeu sportif</strong> (pas de match sans motivation)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">☐</span>
                    <span>La cote BTTS est supérieure à la probabilité estimée par l&apos;IA (<strong className="text-white">value bet</strong>)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  Si 6+ critères sont remplis → pariez avec confiance (2-3 unités). Si 4-5 → pari standard (1 unité).
                  Si 3 ou moins → évitez ce match.
                </p>
              </div>
            </section>

            {/* CTA */}
            <section className="mt-12 p-6 sm:p-8 rounded-xl bg-panel/50 border border-edge/50 text-center">
              <h2
                className="text-2xl sm:text-3xl text-white mb-3"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                Laissez l&apos;IA analyser pour vous
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
                Notre IA vérifie automatiquement tous ces critères sur 50+ championnats chaque jour.
                Consultez nos pronostics BTTS et commencez à parier intelligemment.
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
                <a href="/blog/meilleurs-championnats-btts" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-royal-soft">Analyse</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Les 10 Meilleurs Championnats BTTS</p>
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
