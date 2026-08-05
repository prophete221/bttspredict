import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const SLUG = 'bonus-888starz'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Bonus 888starz — Code Promo & Inscription | BttsBet'
const DESCRIPTION = 'Bonus exclusif 888starz avec code promo. Inscription facile, dépôt local, value bets FIFA et pronostics IA. Guide complet pour profiter du bonus 888starz.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['bonus 888starz', 'code promo 888starz', '888starz inscription', '888starz senegal', '888starz depot', '888starz wave', '888starz orange money', 'paris sportifs 888starz', 'value bet fifa 888starz', '888starz bonus'],
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bonus 888starz — Code Promo & Inscription' }],
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
      { '@type': 'ListItem', position: 2, name: 'Bonus 888starz', item: PAGE_URL },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function Bonus888starzPage() {
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
              <span className="text-gray-400" aria-current="page">Bonus 888starz</span>
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
              BONUS <span className="text-gold neon-glow">888STARZ</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Bonus exclusif 888starz, inscription facile et value bets FIFA détectées par nos experts. Guide complet pour maximiser votre bonus.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">

              {/* 1. Inscription 888starz */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Inscription sur 888starz
                </h2>
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <div className="space-y-3">
                    {[
                      { step: '1', text: 'Visitez le site 888starz via notre lien de parrainage' },
                      { step: '2', text: 'Créez votre compte en remplissant vos informations personnelles' },
                      { step: '3', text: 'Confirmez votre inscription par email ou SMS' },
                      { step: '4', text: 'Effectuez votre premier dépôt pour activer le bonus' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-gold text-dark-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {item.step}
                        </span>
                        <p className="text-gray-300">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 2. Dépôt */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Dépôt sur 888starz
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    888starz propose plusieurs méthodes de dépôt adaptées aux utilisateurs africains :
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3 mt-4">
                    {[
                      { name: 'Wave', icon: '📱', desc: 'Dépôt instantané via Wave' },
                      { name: 'Orange Money', icon: '🟠', desc: 'Dépôt via Orange Money' },
                      { name: 'Crypto', icon: '₿', desc: 'Bitcoin, USDT et autres cryptos' },
                    ].map((item, i) => (
                      <div key={i} className="bg-panel/40 border border-edge/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg" aria-hidden="true">{item.icon}</span>
                          <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                        </div>
                        <p className="text-gray-400 text-xs">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 3. Value Bets FIFA */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Value Bets FIFA sur 888starz
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Notre équipe détecte les <strong className="text-gold">value bets FIFA</strong> sur 888starz — des cotes erronées sur les matchs FIFA virtuels que l&apos;algorithme identifie automatiquement.
                  </p>
                  <p>
                    Les value bets FIFA sont des estimations statistiques basées sur l&apos;analyse de thousands de matchs FIFA virtuels. Elles ne constituent pas des garanties de gain.
                  </p>
                  <div className="mt-4">
                    <a
                      href="/faille-fifa"
                      className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 text-gold text-sm font-semibold rounded-lg hover:border-gold/50 transition-colors"
                    >
                      En savoir plus sur les value bets FIFA →
                    </a>
                  </div>
                </div>
              </article>

              {/* 4. Aviator */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Aviator sur 888starz
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    888starz propose le jeu <strong className="text-gold">Aviator</strong> — un jeu de multiplicateur basé sur un algorithme pseudo-aléatoire certifié « provably fair ».
                  </p>
                  <p>
                    <strong className="text-lose">Important :</strong> Aviator est un jeu 100% aléatoire. Aucun outil ne peut prédire un round futur. Nos statistiques Aviator observent l&apos;historique, pas l&apos;avenir.
                  </p>
                  <div className="mt-4">
                    <a
                      href="/prediction-aviator"
                      className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 text-gold text-sm font-semibold rounded-lg hover:border-gold/50 transition-colors"
                    >
                      Statistiques Aviator →
                    </a>
                  </div>
                </div>
              </article>

              {/* Disclaimer */}
              <div className="bg-lose/10 border border-lose/30 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs">
                  ⚠ BttsBet est un site informatif et d&apos;affiliation. Nous ne prenons aucun pari, ne collectons aucun fonds et ne sommes pas un bookmaker. Les bonus sont soumis aux conditions de 888starz. Aviator est un jeu aléatoire — aucune prédiction possible. Pariez responsable — <a href="/jouer-responsable" className="text-emerald underline underline-offset-2">en savoir plus</a>.
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
