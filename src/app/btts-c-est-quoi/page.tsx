import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'btts-c-est-quoi'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'BTTS (Both Teams To Score) — Guide Complet 2026 | BttsBet'
const DESCRIPTION = 'Qu\'est-ce que le BTTS ? Guide complet sur le pari Both Teams To Score : fonctionnement, stratégies, statistiques, meilleurs championnats et FAQ. Comprendre le BTTS pour mieux parier.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['btts c est quoi', 'both teams to score', 'pari btts', 'comment parier btts', 'guide btts', 'stratégie btts', 'explication btts', 'paris sportifs btts', 'over 2.5 guide', 'football pari but'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    locale: 'fr_SN',
    publishedTime: '2026-07-06',
    modifiedTime: '2026-07-06',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTS (Both Teams To Score) – Guide complet 2026' }],
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
    url: PAGE_URL,
    datePublished: '2026-07-06',
    dateModified: '2026-07-06',
    author: {
      '@type': 'Organization',
      name: 'BttsBet',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BttsBet',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': PAGE_URL,
    },
  }
}

function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'BTTS — Guide', item: PAGE_URL },
    ],
  }
}

function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Qu'est-ce que le BTTS ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "BTTS signifie Both Teams To Score (les deux équipes marquent). C'est un type de pari où vous pariez que les deux équipes marqueront au moins un but durant le match, quelle que soit l'issue finale. Le score final peut être 1-1, 2-1, 3-2, etc. — tant que chaque équipe a marqué au moins un but, le pari BTTS est gagnant.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quelle est la différence entre BTTS Oui et BTTS Non ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "BTTS Oui : vous pariez que les deux équipes marqueront. BTTS Non : vous pariez qu'au moins une équipe ne marquera pas (0-0, 2-0, 0-3, etc.). Les cotes de BTTS Non sont souvent plus élevées car ce résultat est moins fréquent dans certains championnats.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quels championnats sont les meilleurs pour le BTTS ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Les championnats où le BTTS est le plus fréquent sont : Eredivisie (Hollande), Bundesliga (Allemagne), Liga MX (Mexique), Jupiler Pro League (Belgique), et la Premier League (Angleterre). Ces ligues ont des taux de BTTS supérieurs à 55% en moyenne.",
        },
      },
      {
        '@type': 'Question',
        name: "Comment l'IA de BttsBet prédit le BTTS ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Notre IA analyse plus de 50 variables : Expected Goals (xG), forme récente des deux équipes, taux de BTTS historique, blessures, conditions météo, historique des confrontations directes, et statistiques défensives. L'algorithme est entraîné sur 50 000+ matchs avec ~52% de précision historique. Ces performances passées ne garantissent pas les résultats futurs.",
        },
      },
      {
        '@type': 'Question',
        name: 'Le pari BTTS est-il différent du Over 2.5 ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui. BTTS concerne uniquement le fait que les deux équipes marquent, indépendamment du nombre total de buts. Over 2.5 concerne le nombre total de buts du match (plus de 2.5 buts = 3 buts ou plus). Un match 1-1 est BTTS Oui mais pas Over 2.5. Un match 3-0 est Over 2.5 mais pas BTTS Oui.",
        },
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function BttsGuidePage() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd()) }}
      />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <Navbar />

      <main id="main-content" className="flex-1 relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-emerald transition-colors">
                Accueil
              </a>
            </li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li>
              <span className="text-gray-400" aria-current="page">BTTS — Guide complet</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <section className="pb-8 sm:pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl text-white mb-4"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              BTTS — <span className="text-gold neon-glow">GUIDE COMPLET</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Both Teams To Score : fonctionnement, stratégies, statistiques et FAQ pour comprendre et parier intelligemment.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">

              {/* 1. Qu'est-ce que le BTTS */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Qu&apos;est-ce que le BTTS ?
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    <strong className="text-gold">BTTS</strong> signifie <strong className="text-emerald">Both Teams To Score</strong> — en français, « les deux équipes marquent ». C&apos;est un marché de paris sportifs où vous pariez que les deux équipes inscriront au moins un but pendant le match.
                  </p>
                  <p>
                    Le résultat final du match n&apos;a aucune importance. Que le score soit 1-1, 2-3, 4-2 ou 5-1, le pari BTTS est gagné dès que chaque équipe a marqué au moins un but.
                  </p>
                  <div className="bg-panel/40 border border-edge/30 rounded-xl p-4 mt-4">
                    <h3 className="text-white font-semibold text-sm mb-2">Exemples de résultats BTTS :</h3>
                    <ul className="space-y-1.5 text-gray-400">
                      <li className="flex items-center gap-2">
                        <span className="text-success">✓</span>
                        <span>1-1, 2-1, 3-2, 2-3 → <strong className="text-emerald">BTTS Oui = Gagné</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-lose">✗</span>
                        <span>0-0, 2-0, 0-3, 1-0 → <strong className="text-lose">BTTS Oui = Perdu</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* 2. BTTS Oui vs BTTS Non */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. BTTS Oui vs BTTS Non
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Il existe deux variantes du pari BTTS :
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="bg-panel/40 border border-emerald/20 rounded-xl p-4">
                      <h3 className="text-emerald font-semibold mb-2">BTTS Oui</h3>
                      <p className="text-gray-400 text-xs">Vous pariez que les deux équipes marqueront au moins un but. C&apos;est le pari le plus populaire sur ce marché. Les cotes sont généralement entre 1.5 et 2.5 selon les statistiques des équipes.</p>
                    </div>
                    <div className="bg-panel/40 border border-lose/20 rounded-xl p-4">
                      <h3 className="text-lose font-semibold mb-2">BTTS Non</h3>
                      <p className="text-gray-400 text-xs">Vous pariez qu&apos;au moins une équipe ne marquera pas. Ce pari est gagnant si le match se termine en 0-0, ou si une équipe garde sa cage inviolée. Les cotes sont souvent plus élevées (2.0–4.0).</p>
                    </div>
                  </div>
                </div>
              </article>

              {/* 3. Différence BTTS vs Over 2.5 */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. BTTS vs Over 2.5 — Quelle différence ?
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Bien que souvent associés, <strong className="text-gold">BTTS</strong> et <strong className="text-gold">Over 2.5</strong> sont deux marchés distincts :
                  </p>
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-xs border border-edge/30 rounded-lg">
                      <thead>
                        <tr className="bg-panel/60 text-gray-500">
                          <th className="px-3 py-2 text-left">Score</th>
                          <th className="px-3 py-2 text-center">BTTS Oui</th>
                          <th className="px-3 py-2 text-center">Over 2.5</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-300">
                        <tr className="border-t border-edge/20">
                          <td className="px-3 py-2">1-1</td>
                          <td className="px-3 py-2 text-center text-success">Gagné</td>
                          <td className="px-3 py-2 text-center text-lose">Perdu</td>
                        </tr>
                        <tr className="border-t border-edge/20">
                          <td className="px-3 py-2">2-1</td>
                          <td className="px-3 py-2 text-center text-success">Gagné</td>
                          <td className="px-3 py-2 text-center text-success">Gagné</td>
                        </tr>
                        <tr className="border-t border-edge/20">
                          <td className="px-3 py-2">3-0</td>
                          <td className="px-3 py-2 text-center text-lose">Perdu</td>
                          <td className="px-3 py-2 text-center text-success">Gagné</td>
                        </tr>
                        <tr className="border-t border-edge/20">
                          <td className="px-3 py-2">0-0</td>
                          <td className="px-3 py-2 text-center text-lose">Perdu</td>
                          <td className="px-3 py-2 text-center text-lose">Perdu</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3">
                    La combinaison <strong className="text-emerald">BTTS + Over 2.5</strong> est un marché très populaire : il exige que les deux équipes marquent ET que le total dépasse 2.5 buts. Les cotes sont plus élevées (2.5–4.0) mais la probabilité est plus faible.
                  </p>
                </div>
              </article>

              {/* 4. Meilleurs championnats */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Les meilleurs championnats pour le BTTS
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Certains championnats produisent naturellement plus de matchs BTTS en raison de leur style de jeu offensif :
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 mt-4">
                    {[
                      { league: 'Eredivisie (Hollande)', rate: '~58%', reason: 'Jeu très offensif, défenses perméables' },
                      { league: 'Bundesliga (Allemagne)', rate: '~56%', reason: 'High pressing, beaucoup de buts' },
                      { league: 'Liga MX (Mexique)', rate: '~55%', reason: 'Style ouvert, matchs spectaculaires' },
                      { league: 'Jupiler Pro League (Belgique)', rate: '~54%', reason: 'Equipes offensives, scores élevés' },
                      { league: 'Premier League (Angleterre)', rate: '~53%', reason: 'Qualité offensive, variété tactique' },
                      { league: 'Serie A (Italie)', rate: '~48%', reason: 'Plus défensive, BTTS Non intéressant' },
                    ].map((item, i) => (
                      <div key={i} className="bg-panel/40 border border-edge/30 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-semibold text-sm">{item.league}</h3>
                          <span className="text-gold font-mono text-xs">{item.rate}</span>
                        </div>
                        <p className="text-gray-400 text-xs">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 5. Stratégies BTTS */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. Stratégies pour parier sur le BTTS
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                      <div>
                        <strong className="text-white">Analyser les statistiques de buts</strong>
                        <p className="text-gray-400 text-xs mt-0.5">Regardez le taux de BTTS des deux équipes sur les 10 derniers matchs. Si les deux équipes ont un taux &gt; 60%, le BTTS Oui est statistiquement favorable.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                      <div>
                        <strong className="text-white">Considérer les blessures</strong>
                        <p className="text-gray-400 text-xs mt-0.5">L&apos;absence d&apos;un attaquant clé ou d&apos;un défenseur central peut significativement modifier la probabilité de BTTS.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                      <div>
                        <strong className="text-white">Utiliser l&apos;IA pour les prédictions</strong>
                        <p className="text-gray-400 text-xs mt-0.5">Notre IA analyse 50+ variables (xG, forme, historique) pour générer des pronostics BTTS avec ~52% de précision historique. Aucun résultat n&apos;est garanti.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                      <div>
                        <strong className="text-white">Combiner BTTS + Over 2.5</strong>
                        <p className="text-gray-400 text-xs mt-0.5">Quand les statistiques indiquent un match ouvert avec beaucoup de buts, la combinaison BTTS + Over 2.5 offre des cotes plus élevées pour un risque calculé.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Disclaimer */}
              <div className="bg-lose/10 border border-lose/30 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs">
                  ⚠ Les paris sportifs comportent des risques financiers. Les statistiques mentionnées (~52%) sont basées sur des données historiques et ne garantissent pas les résultats futurs. Pariez responsable — <a href="/jouer-responsable" className="text-emerald underline underline-offset-2">en savoir plus</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
