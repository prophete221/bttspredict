import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'gestion-bankroll-paris-sportifs'
const PAGE_URL = `${SITE_URL}/blog/${SLUG}`
const TITLE = 'Gestion de Bankroll aux Paris Sportifs : Le Guide Ultime 2026'
const DESCRIPTION = 'Maîtrisez votre capital de jeu avec notre guide complet sur la gestion de bankroll. La règle des 1-5%, les unités de mise, le flat betting, le critère de Kelly et les erreurs courantes — avec exemples en Franc CFA.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['bankroll paris sportifs', 'gestion bankroll', 'mise paris sportifs', 'unité de mise', 'flat betting', 'critère de Kelly', 'gestion capital paris', 'paris sportifs argent', 'bankroll FCFA', 'mise fixe paris'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    publishedTime: '2026-02-25',
    modifiedTime: '2026-06-01',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gestion de Bankroll Paris Sportifs' }],
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
    datePublished: '2026-02-25',
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
export default function GestionBankrollPage() {
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
            <li><span className="text-gray-400" aria-current="page">Gestion de Bankroll</span></li>
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
              Gestion de Bankroll aux Paris Sportifs :{' '}
              <span className="text-emerald neon-glow">Le Guide Ultime 2026</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              La différence entre un parieur qui perd tout et un parieur rentable n&apos;est pas la chance — c&apos;est
              la gestion de bankroll. Découvrez les méthodes éprouvées pour protéger votre capital et maximiser
              vos gains sur le long terme.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <time dateTime="2026-02-25">25 février 2026</time>
              <span>•</span>
              <span>15 min de lecture</span>
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
                Qu&apos;est-ce que la bankroll et pourquoi est-elle essentielle ?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                La bankroll, c&apos;est l&apos;ensemble des fonds que vous consacrez exclusivement aux paris sportifs.
                C&apos;est votre capital de jeu, séparé de votre argent de vie courante (loyer, nourriture, factures).
                Sans bankroll définie, vous jouez à l&apos;aveuglette et finirez inévitablement par tout perdre.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Pensez à votre bankroll comme au capital d&apos;une entreprise. Un commerçant à Douala ou Dakar ne
                dépense pas tout son stock en une seule journée — il gère son inventaire pour durer et prospérer.
                Votre bankroll, c&apos;est la même chose. Chaque pari est un investissement, et comme tout investissement,
                il comporte des risques. La gestion de bankroll vise précisément à minimiser ces risques tout en
                conservant un potentiel de croissance.
              </p>
              <div className="mt-4 p-4 rounded-lg bg-lose/10 border border-lose/30">
                <p className="text-sm text-red-300 leading-relaxed">
                  <strong>⚠️ Le piège n°1 :</strong> 90% des parieurs perdent de l&apos;argent à cause d&apos;une mauvaise
                  gestion de bankroll, pas à cause de mauvais pronostics. Même avec une précision de 65% sur des
                  cotes à 1.80, une mauvaise gestion peut vous ruiner en quelques jours.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                La règle des 1 à 5%
              </h2>
              <p className="text-gray-400 leading-relaxed">
                La règle d&apos;or de la gestion de bankroll est simple : ne jamais miser plus de 1 à 5% de votre
                bankroll sur un seul pari. Ce pourcentage varie selon votre profil de risque :
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm text-left border border-edge/50 rounded-lg overflow-hidden">
                  <thead className="bg-panel/70 text-gray-300">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Profil</th>
                      <th className="px-4 py-3 font-semibold">% par mise</th>
                      <th className="px-4 py-3 font-semibold">Bankroll 50 000 FCFA</th>
                      <th className="px-4 py-3 font-semibold">Bankroll 200 000 FCFA</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    <tr className="border-t border-edge/30">
                      <td className="px-4 py-3"><span className="text-emerald font-medium">Prudent</span></td>
                      <td className="px-4 py-3">1%</td>
                      <td className="px-4 py-3">500 FCFA</td>
                      <td className="px-4 py-3">2 000 FCFA</td>
                    </tr>
                    <tr className="border-t border-edge/30">
                      <td className="px-4 py-3"><span className="text-gold font-medium">Standard</span></td>
                      <td className="px-4 py-3">2-3%</td>
                      <td className="px-4 py-3">1 000 – 1 500 FCFA</td>
                      <td className="px-4 py-3">4 000 – 6 000 FCFA</td>
                    </tr>
                    <tr className="border-t border-edge/30">
                      <td className="px-4 py-3"><span className="text-lose font-medium">Agressif</span></td>
                      <td className="px-4 py-3">5%</td>
                      <td className="px-4 py-3">2 500 FCFA</td>
                      <td className="px-4 py-3">10 000 FCFA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-400 leading-relaxed mt-4">
                Pourquoi cette limite ? Parce que même les meilleurs parieurs subissent des séries de pertes
                (drawdowns). En limitant chaque mise à 2-3% de votre bankroll, vous pouvez encaisser jusqu&apos;à
                10 pertes consécutives sans perdre plus de 20-25% de votre capital — ce qui reste récupérable.
                Avec des mises de 10%, 5 pertes consécutives suffisent à perdre la moitié de votre bankroll.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                L&apos;unité de mise : votre boussole
              </h2>
              <p className="text-gray-400 leading-relaxed">
                L&apos;unité de mise est le montant de référence que vous utilisez pour chaque pari. Elle est
                généralement égale à 1% ou 2% de votre bankroll. Cette unité vous permet de standardiser vos
                mises et de mesurer vos performances de manière objective.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Exemple concret :</strong> Votre bankroll est de 100 000 FCFA.
                Vous décidez que 1 unité = 2% de la bankroll, soit 2 000 FCFA. Vous adaptez ensuite la taille
                de votre mise en fonction de votre confiance dans le pronostic :
              </p>
              <ul className="space-y-2 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">1U</span>
                  <span>Pari standard — 2 000 FCFA — Confiance normale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">2U</span>
                  <span>Pari important — 4 000 FCFA — Bonne valeur détectée</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5">3U</span>
                  <span>Pari premium — 6 000 FCFA — Confiance très élevée (rare)</span>
                </li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                La clé est de ne jamais dépasser 3 unités (6% de la bankroll) sur un seul pari, même si vous
                êtes « certain » du résultat. Personne n&apos;est jamais certain dans les paris sportifs — c&apos;est la
                première leçon à retenir.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Flat Betting vs Percentage Betting
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="card p-5">
                  <h3 className="text-white font-bold mb-2" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                    Flat Betting (Mise Fixe)
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Vous misez toujours le même montant, par exemple 2 000 FCFA par pari, quelle que soit
                    la taille de votre bankroll. Simple et discipliné. Idéal pour les débutants car il élimine
                    la tentation d&apos;augmenter les mises après une perte.
                  </p>
                  <p className="text-sm text-emerald mt-2">
                    ✅ Avantage : Facile à suivre, élimine les décisions émotionnelles
                  </p>
                  <p className="text-sm text-lose mt-1">
                    ❌ Inconvénient : Ne s&apos;adapte pas automatiquement à l&apos;évolution de la bankroll
                  </p>
                </div>
                <div className="card p-5">
                  <h3 className="text-white font-bold mb-2" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
                    Percentage Betting (Mise Proportionnelle)
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Vous misez un pourcentage fixe de votre bankroll actuelle. Si votre bankroll passe de
                    100 000 à 80 000 FCFA, votre mise passe de 2 000 à 1 600 FCFA. Si elle monte à 120 000 FCFA,
                    votre mise monte à 2 400 FCFA.
                  </p>
                  <p className="text-sm text-emerald mt-2">
                    ✅ Avantage : Protection naturelle contre les séries de pertes
                  </p>
                  <p className="text-sm text-lose mt-1">
                    ❌ Inconvénient : Ralentit la remontée après un drawdown
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mt-4">
                Notre recommandation pour les parieurs utilisant BttsBet : commencez en flat betting pendant
                au moins 2 mois pour développer votre discipline, puis passez progressivement au percentage betting
                une fois que vous êtes à l&apos;aise avec la gestion émotionnelle de vos mises.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Le Critère de Kelly
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le critère de Kelly est une formule mathématique qui calcule la mise optimale pour maximiser
                la croissance de votre bankroll. La formule est :
              </p>
              <div className="mt-3 p-4 rounded-lg bg-panel/50 border border-edge/50 text-center">
                <p className="text-emerald font-mono text-lg">
                  f = (b × p - q) / b
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  f = fraction de la bankroll à miser | b = cote décimale - 1 | p = probabilité de gain | q = 1 - p
                </p>
              </div>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Exemple :</strong> Notre IA estime que le BTTS a 60% de chances de
                se réaliser dans un match, mais la cote proposée est de 1.90. Le value bet est positif car
                60% × 1.90 = 1.14 &gt; 1. Appliquons Kelly :
              </p>
              <ul className="space-y-1 mt-2 text-gray-400 text-sm">
                <li>b = 1.90 - 1 = 0.90</li>
                <li>p = 0.60, q = 0.40</li>
                <li>f = (0.90 × 0.60 - 0.40) / 0.90 = 0.144 / 0.90 = 0.156, soit 15.6%</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-3">
                Le Kelly suggère une mise de 15.6% — bien trop agressif ! C&apos;est pourquoi les parieurs professionnels
                utilisent le <strong className="text-white">Fractional Kelly</strong> (Kelly fractionné), qui consiste
                à n&apos;utiliser que le quart ou le tiers du montant suggéré. Avec un Quarter Kelly, vous miseriez
                15.6% ÷ 4 = 3.9% de votre bankroll, ce qui est bien plus raisonnable et correspond à notre recommandation
                de 2-5% par mise.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Les erreurs fatales à éviter
              </h2>
              <ol className="space-y-4 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5 text-lg">1.</span>
                  <span>
                    <strong className="text-white">Le tilt (parier sous l&apos;effet de l&apos;émotion)</strong> — Après une
                    perte frustrante, la tentation est grande de « se refaire » en doublant la mise. C&apos;est la
                    stratégie la plus sûre pour vider votre bankroll. Si vous sentez le tilt arriver, arrêtez de
                    parier pour la journée.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5 text-lg">2.</span>
                  <span>
                    <strong className="text-white">Ne pas ajuster la bankroll</strong> — Si votre bankroll passe de
                    100 000 à 50 000 FCFA, vos mises doivent diminuer proportionnellement. Continuer à miser
                    2 000 FCFA sur une bankroll de 50 000 FCFA, c&apos;est miser 4% au lieu de 2%.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5 text-lg">3.</span>
                  <span>
                    <strong className="text-white">Le « all-in »</strong> — Miser toute sa bankroll sur un seul pari
                    est un suicide financier. Même avec une probabilité de 90%, il reste 10% de chances de tout perdre.
                    Sur le long terme, le all-in finit toujours par être sanctionné.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5 text-lg">4.</span>
                  <span>
                    <strong className="text-white">Parier avec l&apos;argent du loyer</strong> — Votre bankroll doit être
                    de l&apos;argent que vous êtes prêt à perdre sans impact sur votre vie quotidienne. Si vous avez
                    besoin de cet argent pour vivre, n&apos;en faites pas votre bankroll.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lose font-bold mt-0.5 text-lg">5.</span>
                  <span>
                    <strong className="text-white">Ignorer le volume</strong> — Un échantillon de 20 paris ne signifie
                    rien. Il faut au minimum 300 à 500 paris pour évaluer si votre stratégie est réellement rentable.
                    Ne tirez pas de conclusions hâtives.
                  </span>
                </li>
              </ol>
            </section>

            {/* Section 7 - Practical Example */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Exemple pratique : Un mois de gestion avec 50 000 FCFA
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Imaginons que vous démarrez avec une bankroll de 50 000 FCFA et que vous suivez notre stratégie
                de percentage betting à 2% par mise. Voici comment un mois type pourrait se dérouler :
              </p>
              <div className="mt-4 space-y-3">
                <div className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                  <h3 className="text-white font-semibold text-sm mb-2">Semaine 1 — Début prudent</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    10 paris à 1 000 FCFA chacun (2% de 50 000). 6 gagnants à cote moyenne 1.85.
                    Gains : 6 × 1 000 × 1.85 = 11 100 FCFA. Pertes : 4 × 1 000 = 4 000 FCFA.
                    Résultat : +7 100 FCFA. Nouvelle bankroll : 57 100 FCFA.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                  <h3 className="text-white font-semibold text-sm mb-2">Semaine 2 — Drawdown</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    10 paris à 1 142 FCFA (2% de 57 100). 4 gagnants seulement.
                    Gains : 4 × 1 142 × 1.85 = 8 451 FCFA. Pertes : 6 × 1 142 = 6 852 FCFA.
                    Résultat : +1 599 FCFA. Nouvelle bankroll : 58 699 FCFA.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-panel/30 border border-edge/30">
                  <h3 className="text-white font-semibold text-sm mb-2">Semaine 3 — Mauvaise série</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    10 paris à 1 174 FCFA (2% de 58 699). 3 gagnants seulement.
                    Gains : 3 × 1 174 × 1.85 = 6 516 FCFA. Pertes : 7 × 1 174 = 8 218 FCFA.
                    Résultat : -1 702 FCFA. Nouvelle bankroll : 56 997 FCFA.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald/10 border border-emerald/30">
                  <h3 className="text-emerald font-semibold text-sm mb-2">Semaine 4 — Remontée</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    10 paris à 1 140 FCFA (2% de 56 997). 7 gagnants.
                    Gains : 7 × 1 140 × 1.85 = 14 763 FCFA. Pertes : 3 × 1 140 = 3 420 FCFA.
                    Résultat : +11 343 FCFA. Nouvelle bankroll : <strong className="text-emerald">68 340 FCFA</strong>.
                  </p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mt-4">
                Bilan du mois : +18 340 FCFA (+36.7%) avec un taux de réussite de 50% seulement. La clé ? Des mises
                contrôlées, une gestion stricte, et la discipline de ne jamais dépasser 2% par pari. Avec les
                pronostics BttsBet qui affichent environ 87% de précision, le potentiel de croissance est encore
                plus important.
              </p>
            </section>

            {/* CTA */}
            <section className="mt-12 p-6 sm:p-8 rounded-xl bg-panel/50 border border-edge/50 text-center">
              <h2
                className="text-2xl sm:text-3xl text-white mb-3"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                Prêt à parier intelligemment ?
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
                Consultez nos pronostics BTTS et Over 2,5 générés par IA, appliquez une gestion de bankroll stricte,
                et inscrivez-vous sur Linebet avec le code VISION221 pour un bonus de bienvenue.
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
                <a href="/blog/strategie-mise-over-2-5" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Stratégie</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Stratégie de Mise Over 2,5</p>
                </a>
                <a href="/blog/guide-linebet-inscription" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald">Guide</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Guide Complet Linebet & Code VISION221</p>
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
