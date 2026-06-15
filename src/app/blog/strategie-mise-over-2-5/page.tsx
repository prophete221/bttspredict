import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'strategie-mise-over-2-5'
const PAGE_URL = `${SITE_URL}/blog/${SLUG}`
const TITLE = 'Stratégie de Mise Over 2,5 : Optimiser ses Gains en 2026'
const DESCRIPTION = 'Découvrez la stratégie complète pour les paris Over 2,5 buts : approche statistique, championnats et équipes à cibler, combinaison BTTS + Over 2,5, stratégies de live betting et pièges à éviter.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['strategie over 2.5', 'over 2.5 goals', 'paris over under', 'buts match', 'stratégie paris buts', 'over under 2.5', 'live betting over 2.5', 'BTTS over 2.5', 'paris plus de 2.5 buts', 'combinaison BTTS over'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    publishedTime: '2026-03-12',
    modifiedTime: '2026-06-01',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Stratégie Over 2,5 Buts 2026' }],
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
    datePublished: '2026-03-12',
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
export default function StrategieMiseOver25Page() {
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
            <li><span className="text-gray-400" aria-current="page">Stratégie Over 2,5</span></li>
          </ol>
        </nav>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <header className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border bg-gold/15 text-gold border-gold/30">
              Stratégie
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl text-white mt-4 mb-4 leading-tight"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              Stratégie de Mise Over 2,5 :{' '}
              <span className="text-gold neon-glow-blue">Optimiser ses Gains</span> en 2026
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Le marché Over 2,5 buts est l&apos;un des plus rentables du football si vous savez le maîtriser.
              Découvrez notre stratégie complète basée sur les statistiques, l&apos;analyse IA et les techniques
              de live betting pour maximiser vos gains.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <time dateTime="2026-03-12">12 mars 2026</time>
              <span>•</span>
              <span>16 min de lecture</span>
            </div>
            <div className="accent-line-gold max-w-xs mt-6" />
          </header>

          {/* Content */}
          <div className="prose-custom space-y-8">
            {/* Section 1 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Comprendre le marché Over 2,5
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le marché Over 2,5 buts est gagnant si le match se termine avec 3 buts ou plus (3-0, 2-1, 2-2, etc.).
                Le « 0,5 » est crucial : 2 buts exactement = pari perdu, 3 buts = pari gagné. C&apos;est un marché binaire,
                sans possibilité de remboursement, ce qui le rend plus tranché que le marché BTTS où les deux équipes
                doivent marquer individuellement.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                En moyenne, sur l&apos;ensemble des championnats professionnels, environ 48-52% des matchs de football
                se terminent avec plus de 2,5 buts. Ce taux varie considérablement selon les championnats :
                il dépasse 60% en Bundesliga mais tombe à environ 40% dans certains championnats défensifs.
                Cette variance est votre alliée — elle crée des value bets réguliers.
              </p>
              <div className="mt-4 p-4 rounded-lg bg-emerald/10 border border-emerald/30">
                <p className="text-sm text-emerald-soft leading-relaxed">
                  <strong>💡 Le saviez-vous ?</strong> Le score le plus courant au football est 1-0 (environ 12% des matchs).
                  Mais les scores à 3+ buts représentent près de 50% des résultats. C&apos;est ce qui rend le marché
                  Over 2,5 intéressant : les cotes sont souvent supérieures à 1.80, offrant un bon rendement
                  quand la probabilité réelle est supérieure à 55%.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                L&apos;approche statistique : les indicateurs clés
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Pour évaluer la probabilité d&apos;un Over 2,5, notre IA analyse des dizaines d&apos;indicateurs.
                Voici les plus importants que vous pouvez vérifier vous-même :
              </p>
              <ul className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Moyenne de buts par match</strong> — La moyenne combinée
                  des buts marqués et encaissés par les deux équipes. Si la somme dépasse 2.8, le match est un
                  bon candidat Over 2,5. Par exemple : équipe A marque 1.8 et encaisse 1.2, équipe B marque 1.5
                  et encaisse 1.3 → total = 5.8 ÷ 2 = 2.9 → favorable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">xG (Expected Goals)</strong> — Les buts attendus mesurent
                  la qualité des occasions créées. Un match où les deux équipes génèrent plus de 1.3 xG chacune
                  a une probabilité d&apos;Over 2,5 supérieure à 60%. Notre IA utilise les modèles xG avancés pour
                  affiner cette analyse.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Taux d&apos;Over 2,5 sur les 10 derniers matchs</strong> — Si
                  les deux équipes dépassent les 2,5 buts dans plus de 60% de leurs matchs récents, la tendance
                  est forte. Attention à la taille de l&apos;échantillon : 5 matchs ne suffisent pas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Statistiques défensives adverses</strong> — Autant important
                  que l&apos;attaque : une équipe qui encaisse régulièrement 2+ buts est l&apos;alliée du parieur Over 2,5.
                  Vérifiez les clean sheets (matchs sans encaisser) — moins il y en a, mieux c&apos;est.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Quels championnats et équipes cibler ?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le choix du championnat est déterminant pour le marché Over 2,5. Comme nous l&apos;avons détaillé
                dans notre article sur les <a href="/blog/meilleurs-championnats-btts" className="text-emerald hover:underline">meilleurs championnats BTTS</a>,
                les championnats les plus offensifs sont aussi les meilleurs pour l&apos;Over 2,5.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Championnats premium pour l&apos;Over 2,5 :</strong>
              </p>
              <ul className="space-y-2 mt-3 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald">🇩🇪</span>
                  <span><strong className="text-white">Bundesliga</strong> — Taux Over 2,5 : ~62%. Must-have.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald">🇳🇱</span>
                  <span><strong className="text-white">Eredivisie</strong> — Taux Over 2,5 : ~60%. Cotes souvent plus généreuses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald">🇬🇧</span>
                  <span><strong className="text-white">Premier League</strong> — Taux Over 2,5 : ~56%. Meilleur marché secondaire.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald">🇧🇪</span>
                  <span><strong className="text-white">Jupiler Pro League</strong> — Taux Over 2,5 : ~58%. Championnat sous-estimé.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald">🇹🇷</span>
                  <span><strong className="text-white">Süper Lig</strong> — Taux Over 2,5 : ~55%. Matchs imprévisibles et offensifs.</span>
                </li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Équipes « Over-friendly » à surveiller en 2026 :</strong>
              </p>
              <div className="grid gap-3 mt-3 sm:grid-cols-2">
                <div className="p-3 rounded-lg bg-panel/30 border border-edge/30">
                  <p className="text-white font-semibold text-sm">Bayern Munich 🇩🇪</p>
                  <p className="text-gray-500 text-xs">85% de matchs Over 2,5 (toutes compétitions)</p>
                </div>
                <div className="p-3 rounded-lg bg-panel/30 border border-edge/30">
                  <p className="text-white font-semibold text-sm">PSV Eindhoven 🇳🇱</p>
                  <p className="text-gray-500 text-xs">82% de matchs Over 2,5 en Eredivisie</p>
                </div>
                <div className="p-3 rounded-lg bg-panel/30 border border-edge/30">
                  <p className="text-white font-semibold text-sm">Atalanta Bergame 🇮🇹</p>
                  <p className="text-gray-500 text-xs">78% de matchs Over 2,5 en Serie A</p>
                </div>
                <div className="p-3 rounded-lg bg-panel/30 border border-edge/30">
                  <p className="text-white font-semibold text-sm">Brentford 🏴󠁧󠁢󠁥󠁮󠁧󠁿</p>
                  <p className="text-gray-500 text-xs">75% de matchs Over 2,5 en Premier League</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Combiner BTTS + Over 2,5 : la double opportunité
              </h2>
              <p className="text-gray-400 leading-relaxed">
                La combinaison BTTS + Over 2,5 est l&apos;une des stratégies les plus populaires chez les parieurs
                expérimentés. Pourquoi ? Parce qu&apos;un match BTTS (2 buts minimum, un de chaque côté) nécessite
                seulement un but supplémentaire pour que l&apos;Over 2,5 passe aussi. Statistiquement, environ 75%
                des matchs BTTS se terminent aussi Over 2,5.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">La stratégie en pratique :</strong>
              </p>
              <ol className="list-decimal list-inside space-y-2 mt-3 text-gray-400 leading-relaxed">
                <li>Identifiez un match avec une forte probabilité BTTS (notre IA le fait pour vous)</li>
                <li>Vérifiez que le taux d&apos;Over 2,5 des deux équipes dépasse 55%</li>
                <li>Pariez sur le combiné BTTS + Over 2,5 — la cote est généralement entre 2.20 et 2.80</li>
                <li>Si vous êtes plus prudent, pariez uniquement Over 2,5 comme « couverture »</li>
              </ol>
              <div className="mt-4 p-4 rounded-lg bg-gold/10 border border-gold/30">
                <p className="text-sm text-gold-light leading-relaxed">
                  <strong>Exemple de rentabilité :</strong> Si vous gagnez 55% de vos paris combinés BTTS + Over 2,5
                  à une cote moyenne de 2.50, votre ROI est de +37.5%. Sur 100 paris à 2 000 FCFA chacun,
                  vous investissez 200 000 FCFA et récupérez 275 000 FCFA — un profit net de 75 000 FCFA.
                  Bien sûr, cela nécessite une sélection rigoureuse des matchs.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Stratégies de Live Betting sur l&apos;Over 2,5
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le live betting (pari en direct) offre des opportunités uniques sur le marché Over 2,5,
                car les cotes évoluent en temps réel en fonction du déroulement du match. Voici les
                meilleures situations à exploiter :
              </p>
              <ul className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">⏱</span>
                  <span><strong className="text-white">0-0 à la mi-temps</strong> — La cote Over 2,5 monte souvent
                  à 2.50-3.00. Si les statistiques montrent beaucoup d&apos;occasions (tirs cadrés, xG élevé),
                  c&apos;est une aubaine. Les équipes vont ouvrir le jeu en deuxième mi-temps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">⏱</span>
                  <span><strong className="text-white">1-0 à la 60e minute</strong> — L&apos;équipe menée va tout
                  donner pour égaliser, créant des espaces en contre-attaque. La cote Over 2,5 est souvent
                  autour de 2.00-2.30, offrant un bon rapport risque/récompense.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">⏱</span>
                  <span><strong className="text-white">1-1 à la 70e minute</strong> — Il ne reste qu&apos;un seul but
                  pour gagner votre pari. Les équipes vont se lancer à l&apos;attaque dans les 20 dernières minutes.
                  La cote est généralement autour de 2.50-3.00.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">⏱</span>
                  <span><strong className="text-white">Match ouvert avec beaucoup d&apos;occasions</strong> — Si le match
                  est intense avec de nombreuses occasions (vérifiable sur les statistiques en direct),
                  un but est probablement imminent. Pariez Over 2,5 avant que la cote ne chute.</span>
                </li>
              </ul>
              <div className="mt-4 p-4 rounded-lg bg-lose/10 border border-lose/30">
                <p className="text-sm text-red-300 leading-relaxed">
                  <strong>⚠️ Attention :</strong> Le live betting est addictif et demande une discipline absolue.
                  Ne pariez jamais en live si vous ne suivez pas le match en direct. Les statistiques seules
                  ne suffisent pas — vous devez « sentir » le rythme du match. Fixez-vous une limite de 2 paris
                  live par journée et respectez-la.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Les pièges courants du marché Over 2,5
              </h2>
              <ol className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5">1.</span>
                  <span><strong className="text-white">Parier sur le nom plutôt que sur la forme</strong> — Même
                  le Real Madrid ou le Bayern peuvent traverser des périodes pauvres en buts. Vérifiez toujours
                  les 5 derniers matchs, pas le nom de l&apos;équipe.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5">2.</span>
                  <span><strong className="text-white">Ignorer les blessés en attaque</strong> — L&apos;absence d&apos;un
                  buteur clé peut transformer un match Over-friendly en match fermé. Consultez toujours la
                  liste des blessés avant de parier.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5">3.</span>
                  <span><strong className="text-white">Surenchérir après un match à 5 buts</strong> — Un match
                  finissant 3-2 ne signifie pas que le prochain sera similaire. Le biais de récence est
                  l&apos;ennemi du parieur rationnel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5">4.</span>
                  <span><strong className="text-white">Négliger le contexte</strong> — Un match de Coupe avec
                  prolongations potentielles n&apos;est pas le même qu&apos;un match de championnat. Un match aller
                  de Ligue des Champions peut être tactique (aller), alors que le retour sera ouvert.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5">5.</span>
                  <span><strong className="text-white">Oublier la gestion de bankroll</strong> — Même la meilleure
                  stratégie Over 2,5 ne fonctionne pas sans une <a href="/blog/gestion-bankroll-paris-sportifs" className="text-emerald hover:underline">gestion de bankroll stricte</a>.
                  Limitez chaque mise à 2-3% de votre capital.</span>
                </li>
              </ol>
            </section>

            {/* CTA */}
            <section className="mt-12 p-6 sm:p-8 rounded-xl bg-panel/50 border border-edge/50 text-center">
              <h2
                className="text-2xl sm:text-3xl text-white mb-3"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                Optimisez vos paris Over 2,5
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
                Notre IA sélectionne chaque jour les meilleurs matchs Over 2,5 et BTTS. Consultez nos pronostics
                et commencez à parier intelligemment avec le code VISION221 sur Linebet.
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
                <a href="/blog/gestion-bankroll-paris-sportifs" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Stratégie</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Gestion de Bankroll : Guide Ultime</p>
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
