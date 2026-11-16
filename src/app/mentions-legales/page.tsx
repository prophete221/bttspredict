import type { Metadata } from 'next'
import { frEnAlternates } from '@/lib/seo'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const PAGE_URL = `${SITE_URL}/mentions-legales`
const TITLE = 'Mentions Légales '
const DESCRIPTION =
  'Informations générales sur BTTSPredict, les coordonnées de contact, la disponibilité du site et l’utilisation des contenus.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: frEnAlternates('/mentions-legales', 'fr'),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mentions Légales – BTTSPredict' }],
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
        name: 'Mentions Légales',
        item: PAGE_URL,
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function MentionsLegalesPage() {
  return (
    <div className="content-page legal-page min-h-screen flex flex-col">
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
              <span className="text-cendre" aria-current="page">Mentions Légales</span>
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
              MENTIONS <span className="text-emerald neon-glow">LÉGALES</span>
            </h1>
            <p className="text-cendre text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Informations générales sur l’éditeur, le contenu et les limites du site BTTSPredict.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">

              {/* 1. Éditeur du site */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Éditeur du site
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Le site <strong className="text-emerald">BTTSPredict</strong>, accessible à l&apos;adresse{' '}
                    <a href={SITE_URL} className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                      {SITE_URL}
                    </a>
                    , est un site informatif et d&apos;affiliation dédié aux pronostics sportifs, plus particulièrement aux marchés BTTS (Both Teams To Score) et Over 2,5 buts.
                  </p>
                  <p>
                    <strong className="text-gold">Dénomination sociale :</strong> BTTSPredict
                  </p>
                  <p>
                    <strong className="text-gold">Nature du site :</strong> Site informatif et d&apos;affiliation — BTTSPredict ne prend aucun pari, ne collecte aucun fonds et n&apos;agit pas en tant que bookmaker ou intermédiaire de jeux d&apos;argent. Les pronostics diffusés sur le site constituent des outils d&apos;aide à la décision et ne sauraient être considérés comme des conseils financiers ou des garanties de résultat.
                  </p>
                  <p>
                    <strong className="text-gold">Contact :</strong>{' '}
                    contact@bttspredict.com
                  </p>
                </div>
              </article>

              {/* 2. Hébergement */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Hébergement
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Le site peut faire appel à des prestataires techniques pour son hébergement. Cette page ne confirme pas l&apos;identité du prestataire ni la localisation des serveurs; ces détails ne sont pas présentés comme vérifiés ici.
                  </p>
                  <p>
                    Le site peut connaître des interruptions liées à la maintenance, à des mises à jour ou à des difficultés techniques. La disponibilité continue du site n&apos;est pas garantie; cette page ne détermine pas la responsabilité juridique applicable à une interruption.
                  </p>
                </div>
              </article>

              {/* 3. Propriété intellectuelle */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Propriété intellectuelle
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Les contenus publiés sur BTTSPredict — notamment les textes, graphismes, images, vidéos, pronostics, analyses et mises en page — sont produits par BTTSPredict ou utilisés avec l&apos;autorisation correspondante lorsqu&apos;elle est requise. Cette page ne revendique pas les marques ou contenus de tiers.
                  </p>
                  <p>
                    Pour toute demande de réutilisation d&apos;un contenu propre à BTTSPredict, contactez-nous à l&apos;adresse indiquée sur cette page. Les conditions applicables aux contenus de tiers relèvent de leurs titulaires respectifs.
                  </p>
                  <p>
                    Cette notice n&apos;attribue pas de qualification juridique à un usage particulier et ne désigne aucune loi nationale ou juridiction.
                  </p>
                  <p>
                    Les marques commerciales citées sur le site, notamment « Linebet », appartiennent à leurs propriétaires respectifs et sont utilisées à des fins informatives et d&apos;affiliation uniquement.
                  </p>
                </div>
              </article>

              {/* 4. Limitation de responsabilité */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Limitation de responsabilité
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    BTTSPredict est un site à vocation purement informative et d&apos;affiliation. Les pronostics, analyses et statistiques publiés sur le site sont fournis à titre indicatif uniquement et ne constituent en aucun cas des conseils en investissement, des incitations à parier ou des garanties de gains.
                  </p>
                  <p>
                    Les paris sportifs comportent des risques financiers importants. Les utilisateurs sont seuls responsables de leurs décisions de jeu et des sommes qu&apos;ils engagent. Les statistiques de précision affichées sur le site (voir /historique) sont basées sur des données historiques et ne garantissent en aucun cas des résultats futurs. Les performances passées ne préjugent pas des performances futures.
                  </p>
                  <p>
                    BTTSPredict ne saurait être tenu responsable des pertes financières, des dommages directs ou indirects, matériels ou immatériels, résultant de l&apos;utilisation des informations contenues sur le site, de l&apos;impossibilité d&apos;accéder au site, ou de l&apos;utilisation des services des bookmakers partenaires, notamment Linebet.
                  </p>
                  <p>
                    Le site peut contenir des liens vers des sites tiers, notamment des sites de bookmakers partenaires. BTTSPredict ne dispose d&apos;aucun contrôle sur le contenu de ces sites externes et décline toute responsabilité quant à leur contenu, leurs pratiques ou leur disponibilité. L&apos;utilisation de ces sites tiers est soumise à leurs propres conditions d&apos;utilisation et politiques de confidentialité.
                  </p>
                </div>
              </article>

              {/* 5. Droit applicable */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. Droit applicable et juridiction (non vérifiés)
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Le droit applicable, la juridiction compétente et les obligations juridiques propres à une juridiction n&apos;ont pas été vérifiés pour cette page. Aucune loi nationale ou régionale, procédure de résolution de litige ni juridiction particulière n&apos;est désignée ici.
                  </p>
                </div>
              </article>

              {/* 6. Contact */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  6. Contact
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Pour toute question relative aux présentes mentions légales, à l&apos;utilisation du site ou à vos droits, vous pouvez nous contacter via les moyens suivants :
                  </p>
                  <ul className="list-none space-y-2 ml-2">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>
                        <strong className="text-gold">Email :</strong>{' '}
                        <a
                          href="mailto:contact@bttspredict.com"
                          className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2"
                        >
                          contact@bttspredict.com
                        </a>
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span>
                        <strong className="text-gold">Site web :</strong>{' '}
                        <a href={SITE_URL} className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                          {SITE_URL}
                        </a>
                      </span>
                    </li>
                  </ul>
                  <p>
                    Les demandes peuvent être envoyées par les coordonnées ci-dessus. Aucun délai particulier de réponse n&apos;est garanti; toute obligation légale de délai est non vérifiée.
                  </p>
                </div>
              </article>

              {/* Last updated */}
              <p className="text-center text-xs text-cendre pt-4">
                Dernière mise à jour : 16 novembre 2026
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
