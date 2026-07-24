import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'code-promo-linebet-senegal'
const PAGE_URL = `${SITE_URL}/${SLUG}`
const TITLE = 'Code Promo Linebet Sénégal VISION221 — Bonus 90 000 XOF (150$) | BttsBet'
const DESCRIPTION = 'Code promo Linebet Sénégal VISION221 — Bonus exclusif 90 000 XOF (150$) sur votre premier dépôt. Inscription facile, dépôt via Wave, Orange Money, Free Money. Guide complet étape par étape.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['code promo linebet', 'linebet senegal', 'bonus linebet', 'vision221', 'linebet wave', 'linebet orange money', 'code promo linebet senegal', 'bonus 90000 xof', 'linebet inscription', 'depot linebet senegal', 'linebet free money', 'paris sportifs senegal'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: 'Code promo Linebet Sénégal VISION221 — Bonus 90 000 XOF. Dépôt Wave, Orange Money, Free Money.',
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    locale: 'fr_SN',
    publishedTime: '2026-07-06',
    modifiedTime: '2026-07-06',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Code Promo Linebet Sénégal VISION221 — Bonus 90 000 XOF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Promo Linebet Sénégal VISION221 — Bonus 90 000 XOF',
    description: 'Pronostics IA football +87% (historique). Code VISION221 = Bonus 90 000 XOF sur Linebet. Dépôt Wave, Orange Money au Sénégal.',
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
      { '@type': 'ListItem', position: 2, name: 'Code Promo Linebet Sénégal', item: PAGE_URL },
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
        name: 'Comment utiliser le code promo VISION221 sur Linebet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Inscrivez-vous sur Linebet via notre lien de parrainage, puis saisissez le code promo VISION221 lors de votre inscription ou dans la section Code Promo de votre compte. Le bonus de 90 000 XOF (150$) sera activé sur votre premier dépôt.",
        },
      },
      {
        '@type': 'Question',
        name: 'Comment déposer sur Linebet au Sénégal ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Linebet accepte les dépôts via Wave, Orange Money et Free Money au Sénégal. Le processus est simple : choisissez votre méthode de paiement dans la section Dépôt, entrez le montant, et validez. Le dépôt est instantané.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quel est le montant du bonus Linebet avec le code VISION221 ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le code promo VISION221 offre un bonus exclusif de 90 000 XOF (environ 150$) sur votre premier dépôt sur Linebet. Le bonus est crédité automatiquement après validation du code promo.",
        },
      },
      {
        '@type': 'Question',
        name: 'Linebet est-il disponible au Sénégal ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, Linebet est accessible au Sénégal. Les utilisateurs sénégalais peuvent s'inscrire, déposer via Wave/Orange Money/Free Money, et parier sur les sports populaires (football, NBA, tennis, UFC, etc.). L'application Android est également disponible.",
        },
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function CodePromoLinebetSenegalPage() {
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
              <span className="text-gray-400" aria-current="page">Code Promo Linebet Sénégal</span>
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
              CODE PROMO <span className="text-gold neon-glow">LINEBET</span> SÉNÉGAL
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Bonus exclusif <strong className="text-gold">90 000 XOF (150$)</strong> avec le code <strong className="text-emerald">VISION221</strong>. Dépôt via Wave, Orange Money, Free Money.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* Promo Banner */}
        <section className="pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 sm:p-6 text-center">
              <p className="text-gold font-bold text-3xl sm:text-4xl mb-2" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                VISION221
              </p>
              <p className="text-gray-300 text-sm">
                Code promo exclusif — Bonus <strong className="text-gold">90 000 XOF</strong> sur votre premier dépôt Linebet
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">

              {/* 1. Comment utiliser le code */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Comment utiliser le code promo VISION221
                </h2>
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <div className="space-y-3">
                    {[
                      { step: '1', text: 'Inscrivez-vous sur Linebet via notre lien de parrainage' },
                      { step: '2', text: 'Saisissez le code promo VISION221 lors de l\'inscription ou dans la section « Code Promo » de votre compte' },
                      { step: '3', text: 'Effectuez votre premier dépôt via Wave, Orange Money ou Free Money' },
                      { step: '4', text: 'Le bonus de 90 000 XOF (150$) est activé automatiquement' },
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

              {/* 2. Dépôt au Sénégal */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Dépôt sur Linebet au Sénégal
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Linebet accepte les méthodes de paiement locales au Sénégal, ce qui facilite les dépôts et retraits :
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3 mt-4">
                    {[
                      { name: 'Wave', icon: '📱', desc: 'Dépôt instantané via l\'application Wave. Le moyen le plus rapide au Sénégal.' },
                      { name: 'Orange Money', icon: '🟠', desc: 'Dépôt via Orange Money — disponible partout au Sénégal, même sans smartphone.' },
                      { name: 'Free Money', icon: '🔵', desc: 'Dépôt via Free Money — simple et rapide pour les utilisateurs Free.' },
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
                  <p className="mt-3">
                    Tous les dépôts sont <strong className="text-emerald">instantanés</strong>. Les retraits sont traités dans un délai de 24 à 48 heures.
                  </p>
                </div>
              </article>

              {/* 3. Conditions du bonus */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Conditions du bonus Linebet
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <span className="text-gold flex-shrink-0">•</span>
                      <span>Le bonus est valable sur le <strong className="text-white">premier dépôt uniquement</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold flex-shrink-0">•</span>
                      <span>Montant minimum de dépôt requis pour activer le bonus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold flex-shrink-0">•</span>
                      <span>Des conditions de mise (wagering requirements) doivent être respectées avant le retrait du bonus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold flex-shrink-0">•</span>
                      <span>Le bonus est crédité automatiquement après validation du code VISION221</span>
                    </li>
                  </ul>
                  <p className="mt-2">
                    Consultez les conditions complètes sur Linebet pour connaître les exigences de mise et la durée de validité du bonus.
                  </p>
                </div>
              </article>

              {/* 4. Application Linebet */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Application Linebet Android
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Linebet propose une application Android optimisée pour les utilisateurs sénégalais :
                  </p>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald flex-shrink-0">✓</span>
                      <span>Interface en français</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald flex-shrink-0">✓</span>
                      <span>Dépôt et retrait via Wave, Orange Money, Free Money</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald flex-shrink-0">✓</span>
                      <span>Pronostics en direct (live betting)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald flex-shrink-0">✓</span>
                      <span>Jeux casino, Aviator, FIFA virtuels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald flex-shrink-0">✓</span>
                      <span>Notifications de résultats en temps réel</span>
                    </li>
                  </ul>
                </div>
              </article>

              {/* Disclaimer */}
              <div className="bg-lose/10 border border-lose/30 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-xs">
                  ⚠ BttsBet est un site informatif et d&apos;affiliation. Nous ne prenons aucun pari, ne collectons aucun fonds et ne sommes pas un bookmaker. Les bonus sont soumis aux conditions de Linebet. Pariez responsable — <a href="/jouer-responsable" className="text-emerald underline underline-offset-2">en savoir plus</a>.
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
