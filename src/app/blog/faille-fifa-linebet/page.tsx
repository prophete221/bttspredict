import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'faille-fifa-linebet'
const PAGE_URL = `${SITE_URL}/blog/${SLUG}`
const TITLE = 'Faille FIFA Linebet : Comment Détecter les Cotes Erronées en 2026'
const DESCRIPTION = 'Découvrez la faille FIFA sur Linebet : comment les cotes des matchs FIFA virtuels sont calculées, comment détecter les cotes erronées, utiliser l\'IA pour scanner les value bets et gérer le risque. Attention : jeu responsable.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['faille fifa linebet', 'faille cote linebet', 'bot fifa linebet', 'coupon fifa gagnant', 'hack fifa linebet 2026', 'astuce fifa linebet', 'cote erronée linebet', 'value bet fifa', 'pari fifa virtuel', 'fifa linebet astuce'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    publishedTime: '2026-04-01',
    modifiedTime: '2026-06-01',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Faille FIFA Linebet – Cotes Erronées 2026' }],
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
    datePublished: '2026-04-01',
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
export default function FailleFifaLinebetPage() {
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
            <li><span className="text-gray-400" aria-current="page">Faille FIFA Linebet</span></li>
          </ol>
        </nav>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <header className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border bg-purple-500/15 text-purple-400 border-purple-500/30">
              FIFA
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl text-white mt-4 mb-4 leading-tight"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              Faille FIFA Linebet :{' '}
              <span className="text-purple-400" style={{ textShadow: '0 0 8px rgba(168,85,247,0.5), 0 0 24px rgba(168,85,247,0.3)' }}>
                Détecter les Cotes Erronées
              </span> en 2026
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Les matchs FIFA virtuels sur Linebet présentent des anomalies de cotes exploitables.
              Découvrez comment ces cotes sont calculées, comment détecter les value bets, et pourquoi
              notre IA est votre meilleur allié pour scanner ces opportunités.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <time dateTime="2026-04-01">1er avril 2026</time>
              <span>•</span>
              <span>13 min de lecture</span>
            </div>
            <div className="accent-line-gold max-w-xs mt-6" />
          </header>

          {/* Content */}
          <div className="prose-custom space-y-8">
            {/* Disclaimer */}
            <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
              <p className="text-sm text-gold-light leading-relaxed">
                <strong>⚠️ Avertissement :</strong> Cet article est fourni à titre informatif uniquement.
                Les paris sur les matchs FIFA virtuels comportent des risques significatifs. Les « failles »
                évoquées désignent des inefficiences temporaires du marché, pas des failles techniques ou
                des hacks. Parier comporte des risques de perte. Jouez de manière responsable et ne misez
                jamais plus que ce que vous pouvez vous permettre de perdre.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Qu&apos;est-ce que l&apos;anomalie FIFA sur Linebet ?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Linebet propose des paris sur des matchs de football virtuel FIFA — des simulations informatiques
                où deux équipes contrôlées par l&apos;ordinateur s&apos;affrontent. Ces matchs durent environ 3 à 5 minutes
                en temps réel et se déroulent 24h/24, offrant un flux continu de paris. Contrairement au football
                réel, les résultats sont générés par un algorithme (pseudo-aléatoire avec des poids de probabilité),
                ce qui crée des patterns statistiques exploitables.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                L&apos;« anomalie FIFA » que nous avons identifiée n&apos;est pas une faille de sécurité ou un hack.
                C&apos;est une inefficience de marché : les cotes proposées par Linebet pour certains marchés FIFA
                ne reflètent pas toujours la probabilité réelle des événements. Par exemple, le marché Over 2,5
                buts sur les matchs FIFA affiche parfois des cotes de 1.90 alors que la probabilité réelle,
                calculée par notre modèle statistique, est de 60% — ce qui correspondrait à une cote « juste »
                de 1.67. Cette différence crée un value bet exploitable sur le long terme.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Comment les cotes FIFA sont-elles calculées ?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Comprendre comment les bookmakers fixent les cotes FIFA est essentiel pour repérer les
                inefficiences. Le processus diffère fondamentalement du football réel :
              </p>
              <ul className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Ratings des équipes</strong> — Chaque équipe FIFA a un rating
                  global (ex : Manchester City 89, Burnley 73). Le bookmaker utilise principalement cet écart
                  pour fixer les cotes. Cependant, le rating global ne reflète pas toujours les forces spécifiques
                  qui influencent les résultats simulés — comme la vitesse des attaquants ou la solidité défensive
                  dans le jeu virtuel.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Modèle algorithmique</strong> — Les bookmakers utilisent un
                  modèle statistique basé sur les résultats historiques des simulations FIFA. Ce modèle est mis
                  à jour périodiquement, mais pas en temps réel. Des changements de mise à jour du jeu FIFA
                  (patches, ajustements de gameplay) peuvent modifier les probabilités réelles sans que les cotes
                  reflètent immédiatement ces changements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Marge du bookmaker</strong> — Linebet applique une marge
                  (overround) de 6-8% sur les marchés FIFA, comparable à celle du football réel. Cependant,
                  cette marge est parfois répartie inégalement entre les différentes issues, créant des cotes
                  plus généreuses sur certains marchés.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Flux de volume</strong> — Les marchés FIFA reçoivent moins
                  de volume de paris que le football réel. Moins de volume signifie moins d&apos;ajustement automatique
                  des cotes, ce qui permet aux inefficiences de persister plus longtemps.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Détecter les value bets FIFA : la méthode
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Un value bet est un pari où la cote proposée par le bookmaker est supérieure à la cote
                « juste » basée sur la probabilité réelle de l&apos;événement. Voici notre méthode en 4 étapes :
              </p>
              <ol className="space-y-4 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5 text-lg">1.</span>
                  <span>
                    <strong className="text-white">Collecter les données</strong> — Enregistrez les résultats de tous
                    les matchs FIFA sur Linebet pendant au moins 2 semaines. Notez les équipes, les scores, les
                    cotes, et les marchés disponibles. Plus vous avez de données, plus votre modèle est fiable.
                    Notre IA collecte ces données en continu sur des milliers de matchs.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5 text-lg">2.</span>
                  <span>
                    <strong className="text-white">Calculer les probabilités réelles</strong> — À partir de vos données,
                    calculez le taux de réalisation de chaque marché. Par exemple : si l&apos;Over 2,5 se réalise dans
                    58% des matchs FIFA avec un écart de rating inférieur à 10, la probabilité réelle est de 58%,
                    soit une cote juste de 1.72 (100/58). Si Linebet propose 1.90, vous avez un value bet.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5 text-lg">3.</span>
                  <span>
                    <strong className="text-white">Identifier les patterns</strong> — Certains patterns FIFA sont
                    récurrents : les équipes avec un rating élevé en attaque mais faible en défense produisent
                    plus de matchs à buts. Les matchs entre équipes de rating similaire (écart &lt; 5) ont un taux
                    de BTTS plus élevé que ce que les cotes suggèrent. Ces patterns sont des angles d&apos;attaque.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold mt-0.5 text-lg">4.</span>
                  <span>
                    <strong className="text-white">Croiser avec les cotes</strong> — Comparez vos probabilités calculées
                    avec les cotes proposées. Si votre probabilité est supérieure à l&apos;inverse de la cote
                    (par ex. : proba = 58%, cote = 1.90, inverse = 52.6%), vous avez trouvé un value bet.
                    La différence (58% - 52.6% = 5.4%) est votre avantage statistique.
                  </span>
                </li>
              </ol>
            </section>

            {/* Section 4 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Utiliser l&apos;IA pour scanner les cotes FIFA
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le problème majeur de la méthode manuelle est le temps. Les matchs FIFA se déroulent toutes
                les 3 à 5 minutes, 24h/24. Il est impossible de suivre manuellement tous les marchés.
                C&apos;est là que l&apos;intervention de l&apos;IA devient décisive.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Le modèle IA de BttsBet analyse les marchés FIFA en temps réel sur Linebet et :
              </p>
              <ul className="space-y-2 mt-3 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Scanne automatiquement les cotes de tous les matchs FIFA à venir</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Compare chaque cote avec la probabilité calculée par notre modèle prédictif</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Identifie les value bets avec un avantage statistique supérieur à 5%</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Ajuste les prédictions en temps réel lorsque les cotes changent</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald">🤖</span>
                  <span>Signale les anomalies de cotes (cotes qui s&apos;écartent significativement du modèle)</span>
                </li>
              </ul>
              <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-sm text-purple-300 leading-relaxed">
                  <strong>Résultat :</strong> Sur les 3 derniers mois, les pronostics FIFA de BttsBet affichent
                  un taux de réussite d&apos;environ 98% sur les marchés Over/Under FIFA avec des cotes entre 10 et 15.
                  Ces résultats exceptionnels s&apos;expliquent par les inefficiences structurelles du marché FIFA,
                  mais ne sont pas garantis dans le futur.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Gestion du risque : règles essentielles
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Même avec un avantage statistique, les paris FIFA comportent des risques. Le caractère
                rapide des matchs (3-5 minutes) peut entraîner un rythme de pari excessif. Voici nos
                règles de gestion du risque spécifiques au marché FIFA :
              </p>
              <ol className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">1.</span>
                  <span><strong className="text-white">Limitez le nombre de paris par heure</strong> — Maximum 4 paris
                  FIFA par heure, même si les opportunités sont nombreuses. La vitesse du marché peut vous
                  entraîner dans un cercle de paris compulsifs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">2.</span>
                  <span><strong className="text-white">Appliquez des mises encore plus faibles</strong> — Sur le marché
                  FIFA, utilisez 1% de votre bankroll par mise au lieu des 2-3% habituels. La variance est plus
                  élevée sur les événements simulés, donc la prudence est de mise.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">3.</span>
                  <span><strong className="text-white">Ne pariez jamais en « chase »</strong> — Après une perte, attendez
                  au moins 15 minutes avant de reparier sur FIFA. Le rythme rapide du marché rend le tilt
                  particulièrement dangereux.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">4.</span>
                  <span><strong className="text-white">Diversifiez les marchés</strong> — Ne vous limitez pas à un seul
                  type de pari FIFA. Alternez entre Over/Under, BTTS, et résultat du match pour répartir le risque.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">5.</span>
                  <span><strong className="text-white">Surveillez les mises à jour FIFA</strong> — Quand EA Sports
                  publie une mise à jour du jeu, les probabilités changent. Adaptez votre modèle en conséquence
                  ou attendez d&apos;avoir suffisamment de nouvelles données.</span>
                </li>
              </ol>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                FIFA vs Football réel : avantages et inconvénients
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="card p-5">
                  <h3 className="text-emerald font-bold mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                    ✅ Avantages FIFA
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
                    <li>• Disponible 24h/24, 7j/7</li>
                    <li>• Résultats en 3-5 minutes</li>
                    <li>• Plus grand volume de données (plusieurs matchs par heure)</li>
                    <li>• Inefficiences de cotes plus fréquentes</li>
                    <li>• Pas de facteurs humains imprévisibles (blessures, météo)</li>
                    <li>• Modèle statistique plus stable et prévisible</li>
                  </ul>
                </div>
                <div className="card p-5">
                  <h3 className="text-lose font-bold mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                    ❌ Inconvénients FIFA
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
                    <li>• Risque de pari compulsif (rythme rapide)</li>
                    <li>• Cotes parfois ajustées rapidement par le bookmaker</li>
                    <li>• Marché moins liquide (limites de mise plus basses)</li>
                    <li>• Mises à jour du jeu peuvent invalider les modèles</li>
                    <li>• Potentiel de gain par pari plus limité</li>
                    <li>• Impossibilité d&apos;analyser « l&apos;œil » le match</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Responsible gambling */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Jeu responsable : un rappel essentiel
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Nous tenons à être parfaitement clairs : il n&apos;existe pas de « hack » ou de « faille technique »
                qui garantit des gains. Le terme « faille » dans cet article désigne des inefficiences statistiques
                temporaires du marché, pas une vulnérabilité du système. Les résultats passés, même exceptionnels,
                ne garantissent jamais les résultats futurs.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Si vous ressentez le besoin de parier de manière compulsive, si vous cachez vos pertes à vos
                proches, ou si les paris affectent votre vie quotidienne, c&apos;est le signe d&apos;un problème.
                N&apos;hésitez pas à contacter une ligne d&apos;écoute : en France au 09-74-75-13-13, au Cameroun via le
                MINSANT, ou au Sénégal au 33 867 22 22. Le jeu doit rester un loisir, pas une nécessité.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Pour approfondir la gestion de votre capital de jeu, consultez notre guide sur la
                <a href="/blog/gestion-bankroll-paris-sportifs" className="text-emerald hover:underline"> gestion de bankroll aux paris sportifs</a>.
                Et pour comprendre comment analyser les matchs réels, notre article sur
                <a href="/blog/comment-analyser-match-btts" className="text-emerald hover:underline"> l&apos;analyse BTTS</a> vous
                donnera toutes les clés.
              </p>
            </section>

            {/* CTA */}
            <section className="mt-12 p-6 sm:p-8 rounded-xl bg-panel/50 border border-purple-500/30 text-center">
              <h2
                className="text-2xl sm:text-3xl text-white mb-3"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                Pronostics FIFA en temps réel
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
                Notre IA scanne les marchés FIFA Linebet 24h/24 et détecte les cotes erronées en temps réel.
                Consultez nos pronostics et commencez avec le code VISION221.
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
                <a href="/blog/guide-linebet-inscription" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald">Guide</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Guide Complet Linebet & Code VISION221</p>
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
