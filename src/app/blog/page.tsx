import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Blog – Pronostics BTTS & Over 2,5 | BttsBet',
  description:
    'Découvrez nos articles sur les paris BTTS, la stratégie Over 2,5, la gestion de bankroll et la faille FIFA Linebet. Conseils et analyses IA pour optimiser vos paris sportifs.',
  alternates: {
    canonical: 'https://bttsbet.online/blog',
  },
  openGraph: {
    title: 'Blog – Pronostics BTTS & Over 2,5 | BttsBet',
    description:
      'Articles, guides et stratégies BTTS & Over 2,5 propulsés par IA. Maîtrisez vos paris sportifs avec BttsBet.',
    url: 'https://bttsbet.online/blog',
    siteName: 'BttsBet',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Blog BttsBet' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog – Pronostics BTTS & Over 2,5 | BttsBet',
    description:
      'Articles, guides et stratégies BTTS & Over 2,5 propulsés par IA. Maîtrisez vos paris sportifs avec BttsBet.',
    images: ['/og-image.png'],
  },
}

/* ──────────────────────────────────────────────────────────────
   Data
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'

const articles = [
  {
    slug: 'guide-linebet-inscription',
    title: 'Guide complet Linebet : inscription, dépôt et code promo VISION221',
    description:
      'Apprenez à créer votre compte Linebet, effectuer un dépôt et activer le code promo VISION221 pour un bonus exclusif sur votre premier dépôt.',
    date: '2026-02-18',
    category: 'Guide',
  },
  {
    slug: 'gestion-bankroll-paris-sportifs',
    title: 'Gestion de bankroll aux paris sportifs : le guide ultime',
    description:
      'Maîtrisez votre capital de jeu grâce à notre guide complet sur la gestion de bankroll. Techniques, outils et erreurs à éviter pour parier intelligemment.',
    date: '2026-02-25',
    category: 'Stratégie',
  },
  {
    slug: 'meilleurs-championnats-btts',
    title: 'Les 10 meilleurs championnats pour les paris BTTS en 2026',
    description:
      'Découvrez les ligues les plus rentables pour le marché BTTS. Analyse statistique des championnats où les deux équipes marquent le plus souvent.',
    date: '2026-03-04',
    category: 'Analyse',
  },
  {
    slug: 'strategie-mise-over-2-5',
    title: 'Stratégie de mise Over 2,5 : optimiser ses gains en 2026',
    description:
      'Optimisez vos mises sur le marché Over 2,5 avec notre stratégie avancée. Méthodes de mise, critères de sélection et gestion du risque expliqués.',
    date: '2026-03-12',
    category: 'Stratégie',
  },
  {
    slug: 'comment-analyser-match-btts',
    title: 'Comment analyser un match pour le BTTS ? Guide complet 2026',
    description:
      'Apprenez à analyser un match de football pour le marché BTTS. Les indicateurs clés, les stats à surveiller et la méthode pas-à-pas.',
    date: '2026-03-20',
    category: 'Guide',
  },
  {
    slug: 'faille-fifa-linebet',
    title: 'Faille FIFA Linebet : comment détecter les cotes erronées en 2026',
    description:
      'Exploitez la faille FIFA sur Linebet pour repérer les cotes mal ajustées. Méthodologie de détection, exemples concrets et précautions à prendre.',
    date: '2026-04-01',
    category: 'FIFA',
  },
]

/* ──────────────────────────────────────────────────────────────
   JSON-LD
   ────────────────────────────────────────────────────────────── */
function buildBlogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog BttsBet',
    description:
      'Articles, guides et stratégies pour les paris BTTS et Over 2,5 propulsés par intelligence artificielle.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'BttsBet',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    blogPost: articles.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      url: `${SITE_URL}/blog/${a.slug}`,
      author: {
        '@type': 'Organization',
        name: 'BttsBet',
      },
      publisher: {
        '@type': 'Organization',
        name: 'BttsBet',
      },
    })),
  }
}

function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const categoryColor: Record<string, string> = {
  Guide: 'bg-emerald/15 text-emerald border-emerald/30',
  Stratégie: 'bg-gold/15 text-gold border-gold/30',
  Analyse: 'bg-royal/15 text-royal-soft border-royal/30',
  FIFA: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd()) }}
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
        {/* ── Breadcrumb ── */}
        <nav aria-label="Fil d'Ariane" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-emerald transition-colors">
                Accueil
              </a>
            </li>
            <li aria-hidden="true" className="text-gray-700">
              /
            </li>
            <li>
              <span className="text-gray-400" aria-current="page">
                Blog
              </span>
            </li>
          </ol>
        </nav>

        {/* ── Hero Section ── */}
        <section className="section-spacing pb-8 sm:pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white mb-4"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              BLOG{' '}
              <span className="text-emerald neon-glow">BTTSBET</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Guides, stratégies et analyses pour maîtriser les paris{' '}
              <span className="text-emerald font-semibold">BTTS</span> &{' '}
              <span className="text-gold font-semibold">Over 2,5</span>. Propulsé par notre intelligence artificielle.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* ── Articles Grid ── */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <a
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="card group flex flex-col p-5 sm:p-6 hover-lift"
                >
                  {/* Category + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                        categoryColor[article.category] ?? 'bg-emerald/15 text-emerald border-emerald/30'
                      }`}
                    >
                      {article.category}
                    </span>
                    <time
                      dateTime={article.date}
                      className="text-[11px] text-gray-600 tabular-nums"
                    >
                      {formatDate(article.date)}
                    </time>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-lg sm:text-xl text-white font-bold leading-snug mb-2 group-hover:text-emerald transition-colors"
                    style={{
                      fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif",
                      letterSpacing: '0.02em',
                    }}
                  >
                    {article.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {article.description}
                  </p>

                  {/* Read More */}
                  <span className="text-emerald text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Lire l&apos;article
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
