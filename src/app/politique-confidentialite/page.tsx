import type { Metadata } from 'next'
import { frEnAlternates } from '@/lib/seo'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttspredict.com'
const PAGE_URL = `${SITE_URL}/politique-confidentialite`
const TITLE = 'Politique de confidentialité et données personnelles'
const DESCRIPTION =
  'Politique de confidentialité de BTTSPredict : données personnelles, cookies, services tiers, liens d’affiliation et moyens de contact pour exercer vos droits.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: frEnAlternates('/politique-confidentialite', 'fr'),
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Politique de Confidentialité – BTTSPredict' }],
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
        name: 'Politique de Confidentialité',
        item: PAGE_URL,
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function PolitiqueConfidentialitePage() {
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
              <span className="text-cendre" aria-current="page">Politique de Confidentialité</span>
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
              POLITIQUE DE <span className="text-emerald neon-glow">CONFIDENTIALITÉ</span>
            </h1>
            <p className="text-cendre text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Comment BTTSPredict collecte, utilise et protège vos données personnelles.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">

              {/* 1. Introduction */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Introduction
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    La présente politique de confidentialité décrit les pratiques de BTTSPredict (ci-après « nous », « notre » ou « le site ») en matière de collecte, d&apos;utilisation, de stockage et de protection des données à caractère personnel des utilisateurs (ci-après « vous » ou « l&apos;utilisateur ») de notre site web accessible à l&apos;adresse{' '}
                    <a href={SITE_URL} className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                      {SITE_URL}
                    </a>.
                  </p>
                  <p>
                    Cette page décrit les pratiques relatives aux données que BTTSPredict présente sur le site. Elle ne constitue pas une analyse de conformité juridique; l&apos;applicabilité de textes précis et les obligations qui pourraient en découler ne sont pas vérifiées ici.
                  </p>
                  <p>
                    Aucune conformité au RGPD, à une loi nationale ou à un régime régional particulier n&apos;est revendiquée dans cette page. Toute obligation juridique spécifique en matière de données personnelles est non vérifiée.
                  </p>
                </div>
              </article>

              {/* 2. Données collectées */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Données collectées
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Le code examiné ne constitue pas un inventaire complet des données traitées par l&apos;hébergement ou les services tiers. Les éléments ci-dessous décrivent des fonctions présentes dans cette version, sans certifier la configuration active de chaque déploiement.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">2.1 Données de navigation</h3>
                  <p>
                    Le code contient un module Google Analytics 4. Il ne le charge que dans un build de production, si un identifiant de mesure est configuré et si le choix « analytics » est activé dans le panneau de consentement. Cela ne confirme pas que l&apos;outil est actif dans chaque déploiement ni ne décrit les journaux éventuellement conservés par l&apos;hébergeur.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">2.2 Cookies</h3>
                  <p>
                    Le panneau de consentement propose d&apos;accepter, de refuser ou de personnaliser des préférences. Le code enregistre ce choix dans le stockage local du navigateur, qui est distinct d&apos;un cookie. Le code examiné ne fournit pas un inventaire des cookies que pourraient déposer l&apos;hébergement ou les services tiers.
                  </p>
                  <p>
                    L&apos;option visible dans le panneau décrit un choix d&apos;interface; elle ne prouve pas, à elle seule, qu&apos;un service ou un cookie correspondant est actif. Le chargement de l&apos;outil Analytics est conditionné comme indiqué ci-dessus.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">2.3 Données de contact</h3>
                  <p>
                    Si vous écrivez à l&apos;adresse publiée sur cette page, le message et les coordonnées que vous choisissez d&apos;y inclure sont transmis par le service de messagerie utilisé. Cette page ne précise pas de durée de conservation ni d&apos;utilisation ultérieure non vérifiée.
                  </p>
                </div>
              </article>

              {/* 3. Utilisation des données */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Utilisation des données
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Les fonctions visibles comprennent l&apos;affichage des pages et pronostics, des formulaires de demande, des liens d&apos;affiliation et des événements Analytics soumis au choix de consentement décrit ci-dessus. Cette liste ne décrit pas les opérations éventuelles de l&apos;hébergeur ou de chaque prestataire.
                  </p>
                </div>
              </article>

              {/* 4. Services tiers */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Services tiers
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Le site contient des liens vers des services externes et un module Analytics conditionnel. Les services effectivement actifs peuvent dépendre de la configuration du déploiement.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">4.1 Service d&apos;analyse</h3>
                  <p>
                    Le code charge Google Analytics 4 uniquement dans un build de production lorsque l&apos;identifiant de mesure est configuré et que la préférence Analytics est activée. La configuration envoyée au service comporte un paramètre `anonymize_ip` et désactive Google Signals ainsi que la personnalisation publicitaire; ces réglages ne certifient pas l&apos;anonymat de l&apos;ensemble des données ni une conformité juridique.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">4.2 Programme d&apos;affiliation Linebet</h3>
                  <p>
                    Certains liens vers Linebet et d&apos;autres partenaires comprennent des paramètres de suivi. Le code du site peut envoyer un événement de clic à Google Analytics si la préférence Analytics est activée. Le code examiné ne permet pas de confirmer les cookies, données ou durées de conservation utilisés ensuite par un partenaire; consultez sa propre politique après redirection.
                  </p>
                  <p>
                    Le site ne mesure pas lui-même la réalisation d&apos;une inscription ou d&apos;une conversion chez l&apos;opérateur. Les conditions de suivi et les données traitées après l&apos;ouverture d&apos;un lien relèvent de la configuration du partenaire et ne sont pas détaillées ici.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">4.3 Autres services</h3>
                  <p>
                    Les destinations ouvertes par les liens externes sont exploitées par leurs fournisseurs respectifs. Le présent texte ne prétend pas dresser la liste complète des services tiers actifs ni décrire leurs pratiques.
                  </p>
                </div>
              </article>

              {/* 5. Droits des utilisateurs */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. Demandes concernant vos données
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Pour poser une question au sujet d&apos;informations que vous avez envoyées à BTTSPredict, vous pouvez utiliser l&apos;adresse de contact ci-dessous. Cette page ne qualifie pas une demande comme un droit prévu par une loi particulière et ne fixe pas de délai de réponse.
                  </p>
                  <p>
                    Contact :{' '}
                    <a
                      href="mailto:contact@bttspredict.com"
                      className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2"
                    >
                      contact@bttspredict.com
                    </a>.
                  </p>
                </div>
              </article>

              {/* 6. Politique de cookies */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  6. Politique de cookies
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Le panneau de consentement est présent dans l&apos;application. Il propose d&apos;accepter, de refuser ou de personnaliser les préférences; le choix est enregistré dans le stockage local du navigateur. Le code ne fixe pas de durée d&apos;expiration pour ce choix.
                  </p>
                  <p>
                    Les durées des cookies éventuellement déposés par l&apos;hébergement ou les services tiers ne sont pas établies dans le code examiné. Aucune durée de conservation précise n&apos;est annoncée ici.
                  </p>
                  <p>
                    Vous pouvez également gérer vos cookies directement via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter le fonctionnement et l&apos;expérience du site.
                  </p>
                </div>
              </article>

              {/* 7. Sécurité des données */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  7. Sécurité des données
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Cette page ne décrit ni ne certifie les mesures de sécurité, de stockage ou de contrôle d&apos;accès appliquées par l&apos;hébergement et les prestataires. L&apos;indication HTTPS du navigateur, si elle apparaît pour la connexion en cours, concerne le transport de cette connexion et ne certifie pas les pratiques de stockage ou de traitement.
                  </p>
                </div>
              </article>

              {/* 8. Modifications */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  8. Modifications de la politique
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Cette page peut être mise à jour. Consultez le texte actuellement affiché pour connaître son contenu. La notification requise et l&apos;effet juridique d&apos;une modification ou de l&apos;utilisation continue du site ne sont pas vérifiés ici.
                  </p>
                </div>
              </article>

              {/* 9. Contact */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-papier mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  9. Contact
                </h2>
                <div className="space-y-3 text-cendre text-sm leading-relaxed">
                  <p>
                    Pour toute question ou demande concernant les données présentées dans cette politique, vous pouvez nous contacter. Les droits et délais juridiques éventuellement applicables ne sont pas vérifiés ici :
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
                </div>
              </article>

              {/* Last updated */}
              <p className="text-center text-xs text-cendre pt-4">
                Dernière mise à jour : Juin 2026
              </p>
            </div>
          </div>
        </section>
      
      </main>

      <Footer />
    </div>
  )
}
