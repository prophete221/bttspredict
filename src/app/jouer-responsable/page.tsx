import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const PAGE_URL = `${SITE_URL}/jouer-responsable`
const TITLE = 'Jouer Responsable | BTTSPredict'
const DESCRIPTION =
  'Jouer responsable avec BTTSPredict : risques, addiction, conseils et ressources d\'aide. 18+ uniquement.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Jouer Responsable – BTTSPredict' }],
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
function buildWebPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    isPartOf: {
      '@type': 'WebSite',
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
        name: 'Jouer Responsable',
        item: PAGE_URL,
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Help Resources Data
   ────────────────────────────────────────────────────────────── */
const helpResources = [
  {
    country: '🇫🇷 France',
    name: 'Joueurs Info Service',
    phone: '09-74-75-13-13',
    description: 'Service gratuit, anonyme et confidentiel, disponible de 8h à 2h.',
    website: 'https://www.joueurs-info-service.fr',
  },
  {
    country: '🇸🇳 Sénégal',
    name: 'Ligne d\'écoute nationale',
    phone: '33 867 22 22',
    description: 'Service d\'écoute et d\'orientation pour les joueurs en difficulté.',
    website: '',
  },
  {
    country: '🇨🇲 Cameroun',
    name: 'MINSANT',
    phone: 'Ministère de la Santé Publique',
    description: 'Ressources et orientations pour les personnes confrontées à l\'addiction aux jeux.',
    website: '',
  },
]

const addictionSigns = [
  'Vous passez plus de temps et d\'argent que prévu sur les paris',
  'Vous augmentez les mises pour ressentir la même excitation',
  'Vous devenez irritable ou anxieux quand vous essayez d\'arrêter',
  'Vous cachez l\'ampleur de vos paris à votre entourage',
  'Vous empruntez de l\'argent pour financer vos paris',
  'Vous pariez pour échapper au stress ou à la dépression',
  'Vous « chassez » vos pertes en augmentant les mises',
  'Vos relations professionnelles ou familiales se détériorent',
]

const responsibleTips = [
  { icon: '🎯', title: 'Fixez un budget', description: 'Définissez un montant que vous pouvez perdre et ne le dépassez jamais.' },
  { icon: '⏱️', title: 'Limitez votre temps', description: 'Définissez une durée maximale par session et prenez des pauses régulières.' },
  { icon: '🚫', title: 'Ne chassez pas vos pertes', description: 'Après une perte, n\'essayez jamais de récupérer immédiatement.' },
  { icon: '💰', title: 'Ne pariez pas l\'argent essentiel', description: 'Loyer, nourriture, factures : jamais. N\'empruntez jamais pour parier.' },
  { icon: '🧠', title: 'Gardez le jeu comme loisir', description: 'Les paris ne sont pas un moyen de gagner sa vie.' },
  { icon: '📊', title: 'Tenez un journal', description: 'Notez chaque pari, son montant et vos émotions pour prendre du recul.' },
  { icon: '⚖️', title: 'Équilibrez votre vie', description: 'Les paris ne doivent pas remplacer travail, famille et loisirs.' },
  { icon: '🛑', title: 'Sachez arrêter', description: 'Si vous perdez le contrôle, arrêtez immédiatement et demandez de l\'aide.' },
]

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function JouerResponsablePage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebPageJsonLd()) }}
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
          <ol className="flex items-center gap-2 text-sm text-cendre">
            <li>
              <a href="/" className="hover:text-emerald transition-colors">
                Accueil
              </a>
            </li>
            <li aria-hidden="true" className="text-cendre">/</li>
            <li>
              <span className="text-cendre" aria-current="page">Jouer Responsable</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <section className="pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-4xl sm:text-5xl text-papier mb-3"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              JOUER <span className="text-emerald neon-glow">RESPONSABLE</span>
            </h1>
            <p className="text-cendre text-base max-w-2xl mx-auto leading-relaxed">
              Les paris sportifs doivent rester un loisir. 18+ uniquement.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-6" />
          </div>
        </section>

        {/* Age Warning Banner */}
        <section className="pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-lose/10 border border-lose/30 rounded-xl p-4 text-center">
              <p className="text-lose font-bold text-base mb-1" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                INTERDIT AUX MOINS DE 18 ANS
              </p>
              <p className="text-cendre text-xs">
                Les jeux d&apos;argent sont interdits aux mineurs. BTTSPredict est strictement réservé aux personnes de 18 ans ou plus.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-6">

              {/* 1. Risques */}
              <article className="card p-6">
                <h2 className="text-2xl text-papier mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>
                  1. Les risques
                </h2>
                <p className="text-cendre text-sm leading-relaxed mb-3">
                  Les paris sportifs comportent des risques réels. Le modèle des bookmakers est conçu pour que la maison gagne sur le long terme. Même avec les meilleurs pronostics, le risque de perte est toujours présent.
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-cendre text-sm">
                  <li><strong className="text-cendre">Pertes financières</strong> etendettement possible.</li>
                  <li><strong className="text-cendre">Addiction</strong> : les jeux activent le circuit de la récompense, comme les substances addictives.</li>
                  <li><strong className="text-cendre">Impact psychologique</strong> : stress, anxiété, culpabilité.</li>
                  <li><strong className="text-cendre">Conséquences sociales</strong> : conflits familiaux, isolement.</li>
                </ul>
                <p className="text-cendre text-sm leading-relaxed mt-3">
                  Nos taux de précision (voir <a href="/historique" className="text-emerald underline">/historique</a>) sont basés sur des données passées et ne garantissent aucun résultat futur.
                </p>
              </article>

              {/* 2. Signes d'addiction */}
              <article className="card p-6">
                <h2 className="text-2xl text-papier mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>
                  2. Signes d&apos;addiction
                </h2>
                <p className="text-cendre text-sm leading-relaxed mb-3">
                  Si vous reconnaissez plusieurs de ces signes, faites une pause et demandez de l&apos;aide :
                </p>
                <ul className="space-y-1.5 ml-2">
                  {addictionSigns.map((sign, i) => (
                    <li key={i} className="flex items-start gap-2 text-cendre text-sm">
                      <span className="text-lose mt-0.5 flex-shrink-0" aria-hidden="true">⚠</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* 3. Conseils */}
              <article className="card p-6">
                <h2 className="text-2xl text-papier mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>
                  3. Conseils pour jouer responsable
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {responsibleTips.map((tip, i) => (
                    <div
                      key={i}
                      className="bg-panel/40 border border-edge/30 rounded-xl p-3 hover:border-emerald/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg" aria-hidden="true">{tip.icon}</span>
                        <h3 className="text-papier font-semibold text-sm">{tip.title}</h3>
                      </div>
                      <p className="text-cendre text-xs leading-relaxed">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </article>

              {/* 4. Auto-exclusion */}
              <article className="card p-6">
                <h2 className="text-2xl text-papier mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>
                  4. Auto-exclusion
                </h2>
                <p className="text-cendre text-sm leading-relaxed mb-3">
                  L&apos;auto-exclusion vous permet de vous interdire volontairement l&apos;accès aux plateformes de jeux pour une période déterminée (6 mois, 1 an, ou indéfinie).
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-cendre text-sm">
                  <li><strong>Linebet :</strong> activez l&apos;auto-exclusion dans les paramètres du compte.</li>
                  <li><strong>Autres bookmakers :</strong> consultez la section « Jeu responsable ».</li>
                  <li><strong>Registres nationaux :</strong> certains pays proposent des registres d&apos;auto-exclusion globale.</li>
                </ul>
              </article>

              {/* 5. Ressources d'aide */}
              <article className="card p-6">
                <h2 className="text-2xl text-papier mb-3" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>
                  5. Ressources d&apos;aide
                </h2>
                <p className="text-cendre text-sm leading-relaxed mb-3">
                  Aide gratuite, anonyme et confidentielle :
                </p>
                <div className="space-y-3">
                  {helpResources.map((resource, i) => (
                    <div
                      key={i}
                      className="bg-panel/40 border border-edge/30 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg" aria-hidden="true">{resource.country}</span>
                        <h3 className="text-papier font-semibold text-sm">{resource.name}</h3>
                      </div>
                      <div className="text-cendre text-sm space-y-0.5">
                        <p>
                          <strong className="text-gold">Téléphone :</strong>{' '}
                          <span className="text-emerald font-mono">{resource.phone}</span>
                        </p>
                        <p className="text-xs">{resource.description}</p>
                        {resource.website && (
                          <p>
                            <a
                              href={resource.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2 inline-flex items-center gap-1"
                            >
                              {resource.website}
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-cendre text-sm leading-relaxed mt-3">
                  Contactez-nous à{' '}
                  <a
                    href="mailto:contact@bttspredict.com"
                    className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2"
                  >
                    contact@bttspredict.com
                  </a>{' '}
                  pour toute question.
                </p>
              </article>

              <p className="text-center text-xs text-cendre pt-2">
                Dernière mise à jour : Août 2026
              </p>
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
