import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const PAGE_URL = `${SITE_URL}/politique-confidentialite`
const TITLE = 'Politique de Confidentialité | BttsBet'
const DESCRIPTION =
  'Politique de confidentialité de BttsBet — collecte de données, utilisation, services tiers, droits des utilisateurs, politique de cookies et contact.'

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
    siteName: 'BttsBet',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Politique de Confidentialité – BttsBet' }],
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
    <div className="min-h-screen bg-dark-900 flex flex-col">
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
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-emerald transition-colors">
                Accueil
              </a>
            </li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li>
              <span className="text-gray-400" aria-current="page">Politique de Confidentialité</span>
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
              POLITIQUE DE <span className="text-emerald neon-glow">CONFIDENTIALITÉ</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Comment BttsBet collecte, utilise et protège vos données personnelles.
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
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Introduction
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    La présente politique de confidentialité décrit les pratiques de BttsBet (ci-après « nous », « notre » ou « le site ») en matière de collecte, d&apos;utilisation, de stockage et de protection des données à caractère personnel des utilisateurs (ci-après « vous » ou « l&apos;utilisateur ») de notre site web accessible à l&apos;adresse{' '}
                    <a href={SITE_URL} className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                      {SITE_URL}
                    </a>.
                  </p>
                  <p>
                    Nous attachons une importance particulière au respect de votre vie privée et à la protection de vos données personnelles. En utilisant notre site, vous acceptez les pratiques décrites dans la présente politique. Nous vous invitons à la lire attentivement et à la consulter régulièrement, car elle peut être mise à jour de temps à autre.
                  </p>
                  <p>
                    Cette politique est établie en conformité avec les principes du Règlement Général sur la Protection des Données (RGPD) de l&apos;Union Européenne, de la loi n° 2010/012 du 21 décembre 2010 relative à la cybercriminalité et à la protection des données personnelles au Cameroun, ainsi que des autres réglementations applicables en matière de protection des données dans la zone CEMAC.
                  </p>
                </div>
              </article>

              {/* 2. Données collectées */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Données collectées
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet collecte différents types de données dans le cadre de son fonctionnement et de l&apos;amélioration de ses services :
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">2.1 Données de navigation</h3>
                  <p>
                    Lors de votre visite sur le site, certaines informations techniques peuvent être collectées automatiquement, notamment : votre adresse IP, le type et la version de votre navigateur, votre système d&apos;exploitation, les pages visitées, la date et l&apos;heure de votre visite, la source de renvoi (site référent), la résolution de votre écran et le temps passé sur chaque page. Ces données sont collectées de manière anonyme et agrégée via des outils d&apos;analyse tiers.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">2.2 Cookies</h3>
                  <p>
                    Notre site utilise des cookies pour améliorer votre expérience de navigation, mesurer l&apos;audience du site et proposer des contenus adaptés. Les cookies sont de petits fichiers texte déposés sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite. Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres de votre navigateur ou via notre bandeau de consentement.
                  </p>
                  <p>
                    Nous utilisons les catégories de cookies suivantes :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Cookies strictement nécessaires :</strong> indispensables au fonctionnement du site (session, sécurité, consentement).</li>
                    <li><strong className="text-gray-300">Cookies analytiques :</strong> permettent de comprendre comment les visiteurs utilisent le site (Google Analytics).</li>
                    <li><strong className="text-gray-300">Cookies de fonctionnalité :</strong> mémorisent vos préférences (thème, langue, paramètres d&apos;affichage).</li>
                    <li><strong className="text-gray-300">Cookies marketing/affiliation :</strong> utilisés pour le suivi des conversions et le programme d&apos;affiliation avec nos partenaires.</li>
                  </ul>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">2.3 Données de contact</h3>
                  <p>
                    Si vous nous contactez via WhatsApp ou tout autre canal de communication, les informations que vous nous transmettez volontairement (nom, numéro de téléphone, contenu du message) sont conservées uniquement dans le but de répondre à votre demande et ne sont pas utilisées à des fins commerciales sans votre consentement explicite.
                  </p>
                </div>
              </article>

              {/* 3. Utilisation des données */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Utilisation des données
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Les données collectées sont utilisées aux fins suivantes :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Fourniture du service :</strong> assurer le bon fonctionnement du site, afficher les pronostics et les contenus, garantir la sécurité et la stabilité de la plateforme.</li>
                    <li><strong className="text-gray-300">Analyse et amélioration :</strong> comprendre les habitudes de navigation, mesurer l&apos;audience, identifier les pages les plus consultées et améliorer continuellement l&apos;expérience utilisateur.</li>
                    <li><strong className="text-gray-300">Affiliation :</strong> suivre les clics sur les liens d&apos;affiliation vers nos partenaires (notamment Linebet) afin de comptabiliser les conversions et d&apos;optimiser nos partenariats.</li>
                    <li><strong className="text-gray-300">Personnalisation :</strong> adapter le contenu affiché en fonction de vos préférences et de votre historique de navigation.</li>
                    <li><strong className="text-gray-300">Sécurité :</strong> protéger le site contre les attaques, le spam, les accès non autorisés et les activités frauduleuses.</li>
                    <li><strong className="text-gray-300">Obligations légales :</strong> respecter les exigences légales et réglementaires applicables, répondre aux demandes des autorités compétentes.</li>
                  </ul>
                </div>
              </article>

              {/* 4. Services tiers */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Services tiers
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet fait appel à des services tiers qui peuvent collecter des données lors de votre navigation :
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">4.1 Google Analytics</h3>
                  <p>
                    Nous utilisons Google Analytics, un service d&apos;analyse web fourni par Google LLC. Ce service utilise des cookies pour analyser l&apos;utilisation du site de manière anonyme. Les données collectées (pages visitées, durée de visite, source de trafic, données démographiques agrégées) sont transmises et stockées sur les serveurs de Google aux États-Unis. Google peut utiliser ces données pour contextualiser et personnaliser les annonces de son réseau publicitaire. Vous pouvez vous opposer au suivi par Google Analytics en installant le module complémentaire de désactivation pour navigateurs fourni par Google.
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">4.2 Programme d&apos;affiliation Linebet</h3>
                  <p>
                    Notre site participe au programme d&apos;affiliation de Linebet. Les liens d&apos;affiliation présents sur le site contiennent des identifiants de suivi qui permettent à Linebet de comptabiliser les visites et les inscriptions générées depuis BttsBet. Lorsque vous cliquez sur un lien d&apos;affiliation, un cookie d&apos;affiliation peut être déposé sur votre terminal par Linebet. La collecte et le traitement de ces données sont soumis à la politique de confidentialité propre de Linebet, que nous vous invitons à consulter.
                  </p>
                  <p>
                    BttsBet ne partage aucune donnée personnelle avec Linebet en dehors des informations de suivi d&apos;affiliation anonymisées (clic sur lien, conversion).
                  </p>

                  <h3 className="text-lg text-gold font-semibold mt-4 mb-2">4.3 Autres services</h3>
                  <p>
                    Le site peut également recourir à des services tiers pour l&apos;hébergement de contenu, la distribution d&apos;images, la gestion des polices de caractères (Google Fonts) et les fonctionnalités de réseaux sociaux. Chacun de ces services est soumis à sa propre politique de confidentialité.
                  </p>
                </div>
              </article>

              {/* 5. Droits des utilisateurs */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. Vos droits
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Conformément aux réglementations applicables en matière de protection des données, notamment le RGPD et la loi camerounaise sur la protection des données personnelles, vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Droit d&apos;accès :</strong> vous avez le droit d&apos;obtenir la confirmation que des données vous concernant sont ou ne sont pas traitées, ainsi qu&apos;une copie de ces données.</li>
                    <li><strong className="text-gray-300">Droit de rectification :</strong> vous avez le droit de demander la correction de données inexactes ou incomplètes vous concernant.</li>
                    <li><strong className="text-gray-300">Droit à l&apos;effacement :</strong> dans certaines conditions, vous avez le droit de demander la suppression de vos données personnelles (droit à l&apos;oubli).</li>
                    <li><strong className="text-gray-300">Droit à la limitation du traitement :</strong> vous avez le droit de demander la limitation du traitement de vos données dans certaines circonstances.</li>
                    <li><strong className="text-gray-300">Droit à la portabilité :</strong> vous avez le droit de recevoir vos données dans un format structuré, couramment utilisé et lisible par machine.</li>
                    <li><strong className="text-gray-300">Droit d&apos;opposition :</strong> vous avez le droit de vous opposer au traitement de vos données pour des motifs légitimes, ou vous opposer à tout moment au traitement de vos données à des fins de marketing direct.</li>
                    <li><strong className="text-gray-300">Droit de retirer votre consentement :</strong> lorsque le traitement repose sur votre consentement, vous pouvez le retirer à tout moment sans que cela ne compromette la licéité du traitement effectué avant le retrait.</li>
                  </ul>
                  <p>
                    Pour exercer vos droits, veuillez nous contacter via{' '}
                    <a
                      href="https://wa.me/15406704172"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2"
                    >
                      WhatsApp
                    </a>. Nous nous engageons à répondre à votre demande dans un délai maximum de trente (30) jours.
                  </p>
                </div>
              </article>

              {/* 6. Politique de cookies */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  6. Politique de cookies
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Lors de votre première visite sur BttsBet, un bandeau d&apos;information sur les cookies s&apos;affiche, vous permettant d&apos;accepter ou de refuser les cookies non essentiels. Vous pouvez à tout moment modifier vos préférences de cookies en cliquant sur le lien « Paramètres cookies » situé dans le pied de page du site.
                  </p>
                  <p>
                    Voici la durée de conservation des différents types de cookies utilisés sur le site :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Cookies de session :</strong> durée de la session de navigation.</li>
                    <li><strong className="text-gray-300">Cookie de consentement :</strong> 13 mois à compter du dépôt.</li>
                    <li><strong className="text-gray-300">Cookies analytiques (Google Analytics) :</strong> 14 mois maximum (durée de conservation par défaut configurée).</li>
                    <li><strong className="text-gray-300">Cookies d&apos;affiliation :</strong> 30 à 90 jours selon les conditions du programme d&apos;affiliation Linebet.</li>
                  </ul>
                  <p>
                    Vous pouvez également gérer vos cookies directement via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter le fonctionnement et l&apos;expérience du site.
                  </p>
                </div>
              </article>

              {/* 7. Sécurité des données */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  7. Sécurité des données
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, toute modification, divulgation ou destruction illégale. Le site utilise le protocole HTTPS (SSL/TLS) pour chiffrer les communications entre votre navigateur et nos serveurs.
                  </p>
                  <p>
                    Malgré nos efforts, aucune méthode de transmission sur Internet ou de stockage électronique n&apos;est totalement sécurisée. Nous ne pouvons donc garantir de manière absolue la sécurité des informations transmises via notre site.
                  </p>
                </div>
              </article>

              {/* 8. Modifications */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  8. Modifications de la politique
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute modification substantielle sera notifiée sur le site. Nous vous encourageons à consulter régulièrement cette page pour rester informé des évolutions. L&apos;utilisation continue du site après la publication de modifications constitue votre acceptation de ces dernières.
                  </p>
                </div>
              </article>

              {/* 9. Contact */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  9. Contact
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Pour toute question concernant la présente politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter :
                  </p>
                  <ul className="list-none space-y-2 ml-2">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>
                        <strong className="text-gold">WhatsApp :</strong>{' '}
                        <a
                          href="https://wa.me/15406704172"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2"
                        >
                          +1 540 670 4172
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
              <p className="text-center text-xs text-gray-600 pt-4">
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
