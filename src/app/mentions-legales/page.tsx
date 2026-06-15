import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const PAGE_URL = `${SITE_URL}/mentions-legales`
const TITLE = 'Mentions Légales | BttsBet'
const DESCRIPTION =
  'Mentions légales du site BttsBet — informations sur l\'éditeur, l\'hébergement, la propriété intellectuelle, la limitation de responsabilité et le droit applicable.'

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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mentions Légales – BttsBet' }],
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
              <span className="text-gray-400" aria-current="page">Mentions Légales</span>
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
              MENTIONS <span className="text-emerald neon-glow">LÉGALES</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Informations légales relatives au site BttsBet conformément aux réglementations en vigueur.
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
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Éditeur du site
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Le site <strong className="text-emerald">BttsBet</strong>, accessible à l&apos;adresse{' '}
                    <a href={SITE_URL} className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                      {SITE_URL}
                    </a>
                    , est un site informatif et d&apos;affiliation dédié aux pronostics sportifs, plus particulièrement aux marchés BTTS (Both Teams To Score) et Over 2,5 buts.
                  </p>
                  <p>
                    <strong className="text-gold">Dénomination sociale :</strong> BttsBet
                  </p>
                  <p>
                    <strong className="text-gold">Nature du site :</strong> Site informatif et d&apos;affiliation — BttsBet ne prend aucun pari, ne collecte aucun fonds et n&apos;agit pas en tant que bookmaker ou intermédiaire de jeux d&apos;argent. Les pronostics diffusés sur le site constituent des outils d&apos;aide à la décision et ne sauraient être considérés comme des conseils financiers ou des garanties de résultat.
                  </p>
                  <p>
                    <strong className="text-gold">Contact :</strong>{' '}
                    <a
                      href="https://wa.me/15406704172"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2"
                    >
                      WhatsApp
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>{' '}
                    — +1 540 670 4172
                  </p>
                </div>
              </article>

              {/* 2. Hébergement */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Hébergement
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Le site BttsBet est hébergé par un prestataire d&apos;hébergement professionnel assurant la disponibilité, la sécurité et la performance du service. Les coordonnées de l&apos;hébergeur sont disponibles sur demande via le canal de contact indiqué ci-dessus.
                  </p>
                  <p>
                    L&apos;hébergeur assure la continuité de son service conformément aux obligations légales en vigueur. En cas d&apos;indisponibilité temporaire du site, due notamment à des opérations de maintenance, de mise à jour ou à des circonstances indépendantes de la volonté de l&apos;éditeur, BttsBet ne pourra être tenu responsable des conséquences directes ou indirectes liées à cette indisponibilité.
                  </p>
                </div>
              </article>

              {/* 3. Propriété intellectuelle */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Propriété intellectuelle
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    L&apos;ensemble des contenus présents sur le site BttsBet — incluant, de manière non exhaustive, les textes, articles, graphismes, logos, icônes, images, vidéos, sons, logiciels, algorithmes, pronostics, analyses statistiques et mises en page — est protégé par les lois relatives à la propriété intellectuelle et appartient à BttsBet ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation.
                  </p>
                  <p>
                    Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, des éléments du site, par quelque moyen que ce soit, est interdite sans l&apos;autorisation écrite préalable de BttsBet, conformément aux dispositions du Code de la Propriété Intellectuelle et des conventions internationales applicables, notamment la Convention de Berne et les accords ADPIC.
                  </p>
                  <p>
                    Toute exploitation non autorisée du site ou de l&apos;un quelconque des éléments qu&apos;il contient sera considérée comme constitutive d&apos;une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
                  </p>
                  <p>
                    Les marques commerciales citées sur le site, notamment « Linebet », appartiennent à leurs propriétaires respectifs et sont utilisées à des fins informatives et d&apos;affiliation uniquement.
                  </p>
                </div>
              </article>

              {/* 4. Limitation de responsabilité */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Limitation de responsabilité
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet est un site à vocation purement informative et d&apos;affiliation. Les pronostics, analyses et statistiques publiés sur le site sont fournis à titre indicatif uniquement et ne constituent en aucun cas des conseils en investissement, des incitations à parier ou des garanties de gains.
                  </p>
                  <p>
                    Les paris sportifs comportent des risques financiers importants. Les utilisateurs sont seuls responsables de leurs décisions de jeu et des sommes qu&apos;ils engagent. Les statistiques de précision affichées sur le site (environ 87 %) sont basées sur des données historiques et ne garantissent en aucun cas des résultats futurs. Les performances passées ne préjugent pas des performances futures.
                  </p>
                  <p>
                    BttsBet ne saurait être tenu responsable des pertes financières, des dommages directs ou indirects, matériels ou immatériels, résultant de l&apos;utilisation des informations contenues sur le site, de l&apos;impossibilité d&apos;accéder au site, ou de l&apos;utilisation des services des bookmakers partenaires, notamment Linebet.
                  </p>
                  <p>
                    Le site peut contenir des liens vers des sites tiers, notamment des sites de bookmakers partenaires. BttsBet ne dispose d&apos;aucun contrôle sur le contenu de ces sites externes et décline toute responsabilité quant à leur contenu, leurs pratiques ou leur disponibilité. L&apos;utilisation de ces sites tiers est soumise à leurs propres conditions d&apos;utilisation et politiques de confidentialité.
                  </p>
                </div>
              </article>

              {/* 5. Droit applicable */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. Droit applicable
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Les présentes mentions légales sont régies par le droit camerounais et, de manière générale, par les dispositions applicables au sein de la zone CEMAC (Communauté Économique et Monétaire de l&apos;Afrique Centrale), et notamment l&apos;Acte Uniforme révisé de l&apos;OHADA relatif au droit commercial général.
                  </p>
                  <p>
                    En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes, les parties s&apos;efforceront de trouver une solution amiable. À défaut d&apos;accord amiable dans un délai de trente (30) jours, le litige sera soumis aux juridictions compétentes du Cameroun.
                  </p>
                  <p>
                    Les conventions internationales applicables en matière de propriété intellectuelle, de protection des données à caractère personnel et de commerce électronique s&apos;appliquent également dans la mesure où elles ont été ratifiées par le Cameroun ou les États membres de la CEMAC.
                  </p>
                </div>
              </article>

              {/* 6. Contact */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  6. Contact
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Pour toute question relative aux présentes mentions légales, à l&apos;utilisation du site ou à vos droits, vous pouvez nous contacter via les moyens suivants :
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
                  <p>
                    Nous nous engageons à répondre à toute demande d&apos;information ou de réclamation dans un délai raisonnable de trente (30) jours ouvrables.
                  </p>
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
