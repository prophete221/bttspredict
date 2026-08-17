import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'btts-c-est-quoi'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'BTTS : définition, fonctionnement et exemples au football'
const DESCRIPTION = 'Comprenez le pari BTTS, la différence entre BTTS Oui et Non, les exemples et les limites d’un pronostic football. 18+.'

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
    siteName: 'BTTSPredict',
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
      name: 'BTTSPredict',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.png`,
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
        name: "Comment BTTSPredict calcule-t-il le BTTS ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "BTTSPredict estime la probabilité que les deux équipes marquent au moins un but à partir des données disponibles dans son modèle statistique. Selon les données disponibles, l'analyse peut notamment utiliser les buts, les expected goals (xG), les paramètres lambda, les probabilités calculées par le modèle et les indicateurs de qualité des données. Les données non disponibles ne sont pas inventées pour compléter une analyse. Aucun résultat futur n'est garanti.",
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
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
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
          <ol className="flex items-center gap-2 text-sm text-cendre">
            <li>
              <a href="/" className="hover:text-emerald transition-colors">
                Accueil
              </a>
            </li>
            <li aria-hidden="true" className="text-cendre">/</li>
            <li>
              <span className="text-cendre" aria-current="page">BTTS — Guide complet</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <section className="pb-8 sm:pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl text-papier mb-4"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              BTTS : qu&apos;est-ce que cela signifie ?
            </h1>
            <p className="text-cendre text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Both Teams To Score : fonctionnement et exemples pour parier intelligemment.
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
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Qu&apos;est-ce que le BTTS ?
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    <strong className="text-gold">BTTS</strong> signifie <strong className="text-emerald">Both Teams To Score</strong> : vous pariez que les deux équipes marqueront au moins un but, indépendamment du score final.
                  </p>
                  <div className="bg-panel/40 border border-edge/30 rounded-xl p-4">
                    <h3 className="text-papier font-semibold text-sm mb-2">Exemples :</h3>
                    <ul className="space-y-1.5 text-cendre">
                      <li className="flex items-center gap-2">
                        <span className="text-success">✓</span>
                        <span>1-1, 2-1, 3-2 → <strong className="text-emerald">BTTS Oui = Gagné</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-lose">✗</span>
                        <span>0-0, 2-0, 0-3 → <strong className="text-lose">BTTS Oui = Perdu</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* 2. BTTS Oui vs BTTS Non */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. BTTS Oui vs BTTS Non
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-panel/40 border border-emerald/20 rounded-xl p-4">
                    <h3 className="text-emerald font-semibold mb-2">BTTS Oui</h3>
                    <p className="text-cendre text-xs">Les deux équipes marquent au moins un but (cotes ~1.5–2.5).</p>
                  </div>
                  <div className="bg-panel/40 border border-lose/20 rounded-xl p-4">
                    <h3 className="text-lose font-semibold mb-2">BTTS Non</h3>
                    <p className="text-cendre text-xs">Au moins une équipe ne marque pas : 0-0, 2-0, 0-3… (cotes ~2.0–4.0).</p>
                  </div>
                </div>
              </article>

              {/* 3. Meilleurs championnats */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Les meilleurs championnats pour le BTTS
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { league: 'Eredivisie (Hollande)', rate: '~58%' },
                    { league: 'Bundesliga (Allemagne)', rate: '~56%' },
                    { league: 'Liga MX (Mexique)', rate: '~55%' },
                    { league: 'Jupiler Pro League (Belgique)', rate: '~54%' },
                    { league: 'Premier League (Angleterre)', rate: '~53%' },
                    { league: 'Serie A (Italie)', rate: '~48%' },
                  ].map((item, i) => (
                    <div key={i} className="bg-panel/40 border border-edge/30 rounded-xl p-3 flex items-center justify-between">
                      <h3 className="text-papier font-semibold text-sm">{item.league}</h3>
                      <span className="text-gold font-mono text-xs">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </article>

              {/* 4. Comment l'IA prédit le BTTS */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Comment BTTSPredict calcule le BTTS
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Le modèle statistique de BTTSPredict estime la probabilité que les deux équipes marquent à partir des données disponibles, notamment les buts, les expected goals (xG), les paramètres lambda et les indicateurs de qualité des données. Les données non disponibles ne sont pas inventées.
                  </p>
                  <p>
                    Détails complets sur notre <a href="/methodologie" className="text-emerald underline underline-offset-2">page Méthodologie</a>. Aucun résultat futur n&apos;est garanti.
                  </p>
                </div>
              </article>

              {/* 5. BTTS vs Over 2.5 */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. BTTS vs Over 2.5
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-edge/30 rounded-lg">
                    <thead>
                      <tr className="bg-panel/60 text-cendre">
                        <th className="px-3 py-2 text-left">Score</th>
                        <th className="px-3 py-2 text-center">BTTS Oui</th>
                        <th className="px-3 py-2 text-center">Over 2.5</th>
                      </tr>
                    </thead>
                    <tbody className="text-cendre">
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
              </article>

              {/* Disclaimer */}
              <div className="bg-lose/10 border border-lose/30 rounded-xl p-4 text-center">
                <p className="text-cendre text-xs">
                  ⚠ Les paris sportifs comportent des risques. Les statistiques (voir <a href="/historique" className="text-emerald underline underline-offset-2">/historique</a>) ne garantissent pas les résultats futurs. Pariez responsable — <a href="/jouer-responsable" className="text-emerald underline underline-offset-2">en savoir plus</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pronostics gratuits + VIP + APK sur toutes les pages */}
        <FreePredictionsWidget />
        <VipCardWidget />
        <div className="text-center pb-6">
          <LinebetApkButton />
        </div>
      </main>

      <Footer />
    </div>
  )
}
