import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const PAGE_URL = `${SITE_URL}/cgu`
const TITLE = 'Conditions Générales d\'Utilisation | BttsBet'
const DESCRIPTION =
  'Conditions Générales d\'Utilisation de BttsBet — acceptation des conditions, description du service, affiliation, avertissement sur les pronostics, responsabilités, propriété intellectuelle et droit applicable.'

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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CGU – BttsBet' }],
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
        name: 'Conditions Générales d\'Utilisation',
        item: PAGE_URL,
      },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function CGUPage() {
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
              <span className="text-gray-400" aria-current="page">Conditions Générales d&apos;Utilisation</span>
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
              CONDITIONS <span className="text-emerald neon-glow">GÉNÉRALES</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Conditions d&apos;utilisation du site BttsBet — veuillez lire attentivement avant d&apos;utiliser le site.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">

              {/* 1. Acceptation des conditions */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Acceptation des conditions
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    En accédant au site BttsBet accessible à l&apos;adresse{' '}
                    <a href={SITE_URL} className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                      {SITE_URL}
                    </a>
                    , vous reconnaissez avoir lu, compris et accepté sans réserve les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU »). Si vous n&apos;acceptez pas l&apos;une quelconque de ces conditions, vous devez cesser immédiatement toute utilisation du site.
                  </p>
                  <p>
                    Les présentes CGU s&apos;appliquent à tous les visiteurs, utilisateurs et toute autre personne accédant au site. Elles complètent nos{' '}
                    <a href="/mentions-legales" className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                      Mentions Légales
                    </a>{' '}
                    et notre{' '}
                    <a href="/politique-confidentialite" className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                      Politique de Confidentialité
                    </a>
                    , qui font partie intégrante des présentes conditions par renvoi.
                  </p>
                  <p>
                    BttsBet se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site. L&apos;utilisation continue du site après la publication de modifications constitue votre acceptation de ces dernières. Nous vous recommandons de consulter régulièrement cette page.
                  </p>
                </div>
              </article>

              {/* 2. Description du service */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Description du service
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet est un site web à vocation <strong className="text-emerald">informative et d&apos;affiliation</strong> spécialisé dans les pronostics sportifs, plus particulièrement sur les marchés BTTS (Both Teams To Score) et Over 2,5 buts. Le site utilise des algorithmes d&apos;intelligence artificielle pour analyser des données statistiques et générer des pronostics football.
                  </p>

                  <div className="bg-panel/40 border border-edge/30 rounded-xl p-4 my-3">
                    <p className="text-gold font-semibold text-sm mb-2">
                      ⚠️ Point essentiel
                    </p>
                    <p className="text-gray-400 text-sm">
                      BttsBet <strong className="text-white">ne prend aucun pari</strong>, ne collecte <strong className="text-white">aucun fonds</strong>, ne gère <strong className="text-white">aucun compte de jeu</strong> et n&apos;agit pas en tant que bookmaker, intermédiaire ou opérateur de jeux d&apos;argent. Les utilisateurs parient à leur entière discrétion et sous leur seule responsabilité sur les plateformes de leur choix.
                    </p>
                  </div>

                  <p>
                    Les services proposés par BttsBet incluent :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                    <li>Pronostics gratuits basés sur l&apos;analyse IA (marchés BTTS et Over 2,5)</li>
                    <li>Pronostics VIP avec un indice de confiance plus élevé</li>
                    <li>Analyses statistiques et historiques des matchs de football</li>
                    <li>Contenu éditorial : articles, guides et stratégies de paris sportifs</li>
                    <li>Liens d&apos;affiliation vers des plateformes de paris sportifs partenaires</li>
                    <li>Détection de cotes potentiellement erronées sur les matchs FIFA virtuels</li>
                  </ul>
                </div>
              </article>

              {/* 3. Affiliation avec Linebet */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Affiliation avec Linebet
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet participe au programme d&apos;affiliation de Linebet. À ce titre, le site diffuse des liens sponsorisés vers la plateforme Linebet. Lorsqu&apos;un utilisateur s&apos;inscrit sur Linebet via un lien d&apos;affiliation présent sur BttsBet et utilise le code promo VISION221, BttsBet perçoit une commission d&apos;affiliation.
                  </p>
                  <p>
                    Cette relation d&apos;affiliation n&apos;affecte en aucune manière l&apos;objectivité des pronostics diffusés sur le site. Les analyses et recommandations sont générées indépendamment par notre algorithme d&apos;intelligence artificielle et ne sont pas influencées par notre partenariat avec Linebet.
                  </p>
                  <p>
                    Il est important de noter que :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                    <li>BttsBet n&apos;est pas une filiale, une succursale ou un représentant de Linebet.</li>
                    <li>BttsBet n&apos;est pas responsable des services, conditions ou pratiques de Linebet.</li>
                    <li>L&apos;utilisation de Linebet est soumise aux conditions générales propres à cette plateforme.</li>
                    <li>Les éventuels litiges avec Linebet doivent être traités directement avec ce dernier.</li>
                    <li>Le code promo VISION221 est soumis aux conditions de Linebet, qui se réserve le droit de le modifier ou de l&apos;annuler à tout moment.</li>
                  </ul>
                </div>
              </article>

              {/* 4. Avertissement sur les pronostics */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Avertissement sur les pronostics
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <div className="bg-lose/10 border border-lose/30 rounded-xl p-4 mb-3">
                    <p className="text-lose font-semibold text-sm mb-2">
                      Avertissement important
                    </p>
                    <p className="text-gray-400 text-sm">
                      Les pronostics diffusés sur BttsBet sont fournis à titre <strong className="text-white">strictement informatif</strong> et ne constituent en aucun cas des conseils financiers, des incitations à parier ou des garanties de résultat.
                    </p>
                  </div>
                  <p>
                    Nos pronostics sont le résultat d&apos;analyses statistiques effectuées par notre algorithme d&apos;intelligence artificielle. Bien que notre taux de précision historique soit d&apos;environ 87 %, ce chiffre repose sur des données passées et <strong className="text-emerald">ne garantit pas les résultats futurs</strong>. Les performances passées ne préjugent pas des performances futures.
                  </p>
                  <p>
                    De nombreux facteurs imprévisibles peuvent influencer le résultat d&apos;un match de football : blessures de dernière minute, conditions météorologiques, décisions arbitrales, motivation des équipes, événements imprévus, etc. Aucun algorithme, aussi sophistiqué soit-il, ne peut intégrer l&apos;ensemble de ces variables avec certitude absolue.
                  </p>
                  <p>
                    Les utilisateurs sont seuls responsables de l&apos;utilisation qu&apos;ils font des pronostics et des décisions de jeu qu&apos;ils prennent. BttsBet ne saurait être tenu responsable des pertes financières résultant de l&apos;utilisation de ses pronostics.
                  </p>
                </div>
              </article>

              {/* 5. Responsabilités de l'utilisateur */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. Responsabilités de l&apos;utilisateur
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    En utilisant le site BttsBet, vous vous engagez à :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Être majeur :</strong> vous certifiez être âgé de 18 ans ou plus. L&apos;accès au site est strictement interdit aux mineurs. BttsBet se réserve le droit de mettre en place des dispositifs de vérification de l&apos;âge.</li>
                    <li><strong className="text-gray-300">Respecter les lois locales :</strong> vous êtes responsable de vous assurer que l&apos;utilisation de notre site et la participation à des paris sportifs sont conformes aux lois et réglementations de votre juridiction. Les lois sur les jeux d&apos;argent varient considérablement d&apos;un pays à l&apos;autre.</li>
                    <li><strong className="text-gray-300">Jouer de manière responsable :</strong> vous reconnaissez que les paris sportifs comportent des risques financiers et vous vous engagez à jouer de manière responsable, en ne misant jamais plus que ce que vous pouvez vous permettre de perdre. Nous vous invitons à consulter notre page{' '}
                      <a href="/jouer-responsable" className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2">
                        Jouer Responsable
                      </a>.
                    </li>
                    <li><strong className="text-gray-300">Ne pas utiliser le site à des fins illicites :</strong> vous vous engagez à ne pas utiliser le site d&apos;une manière qui pourrait endommager, désactiver, surcharger ou altérer le fonctionnement du site, ni tenter d&apos;accéder de manière non autorisée à des systèmes, données ou informations liés au site.</li>
                    <li><strong className="text-gray-300">Ne pas reproduire le contenu :</strong> vous vous abstiendrez de copier, reproduire, distribuer, publier ou exploiter commercialement tout contenu du site sans autorisation préalable écrite de BttsBet.</li>
                    <li><strong className="text-gray-300">Fournir des informations exactes :</strong> si vous êtes amené à fournir des informations (contact, commentaires), vous vous engagez à ce qu&apos;elles soient exactes et à jour.</li>
                  </ul>
                </div>
              </article>

              {/* 6. Propriété intellectuelle */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  6. Propriété intellectuelle
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    L&apos;ensemble des contenus du site BttsBet — textes, graphismes, logos, icônes, images, algorithmes, pronostics, analyses, mises en page et codes sources — est protégé par le droit d&apos;auteur et les droits de propriété intellectuelle. Ces contenus appartiennent exclusivement à BttsBet ou font l&apos;objet d&apos;une licence d&apos;utilisation.
                  </p>
                  <p>
                    Sont notamment protégés :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                    <li>L&apos;algorithme d&apos;intelligence artificielle et les modèles prédictifs utilisés pour générer les pronostics</li>
                    <li>Les designs, interfaces et éléments visuels du site</li>
                    <li>Les articles, guides et contenus éditoriaux publiés sur le site et le blog</li>
                    <li>Le nom commercial « BttsBet » et les éléments de marque associés</li>
                    <li>Les bases de données statistiques et historiques utilisées par le service</li>
                  </ul>
                  <p>
                    Toute utilisation non autorisée, toute reproduction ou diffusion, même partielle, des éléments précités est interdite et pourra faire l&apos;objet de poursuites judiciaires conformément aux dispositions légales applicables en matière de propriété intellectuelle.
                  </p>
                </div>
              </article>

              {/* 7. Limitation de responsabilité */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  7. Limitation de responsabilité
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet fournit ses services « en l&apos;état » (as is) sans garantie d&apos;aucune sorte, expresse ou implicite. Dans la mesure permise par la loi applicable, BttsBet décline toute garantie, notamment quant à la disponibilité ininterrompue du site, l&apos;exactitude des informations, la fiabilité des pronostics ou l&apos;adéquation du service à un besoin particulier.
                  </p>
                  <p>
                    En aucun cas BttsBet ne pourra être tenu responsable :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-400">
                    <li>Des pertes financières directes ou indirectes résultant de l&apos;utilisation des pronostics ou des informations du site</li>
                    <li>De l&apos;indisponibilité temporaire ou permanente du site, due à des maintenance, mises à jour, pannes techniques ou causes extérieures</li>
                    <li>Des pratiques, services ou contenus des sites tiers accessibles via les liens d&apos;affiliation</li>
                    <li>De l&apos;impossibilité pour un utilisateur d&apos;accéder à son compte sur un site partenaire (Linebet ou autre)</li>
                    <li>Des erreurs, omissions ou retards dans la mise à jour des pronostics ou des informations</li>
                    <li>Des dommages résultant de l&apos;utilisation non autorisée du site ou de la violation des présentes CGU</li>
                  </ul>
                </div>
              </article>

              {/* 8. Modification des conditions */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  8. Modification des conditions
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    BttsBet se réserve le droit de modifier, mettre à jour ou remplacer tout ou partie des présentes CGU à tout moment et sans préavis. Les modifications prennent effet dès leur publication sur le site.
                  </p>
                  <p>
                    Il incombe à l&apos;utilisateur de consulter régulièrement les présentes CGU pour prendre connaissance des éventuelles modifications. L&apos;utilisation continue du site après la publication de CGU modifiées vaut acceptation sans réserve des nouvelles conditions.
                  </p>
                  <p>
                    En cas de modification substantielle des conditions, BttsBet s&apos;efforcera d&apos;informer les utilisateurs par un avis visible sur le site. Toutefois, l&apos;absence de notification ne saurait invalider les modifications apportées.
                  </p>
                </div>
              </article>

              {/* 9. Droit applicable et juridiction compétente */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  9. Droit applicable et juridiction compétente
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Les présentes CGU sont régies par le droit camerounais et les dispositions applicables au sein de la Communauté Économique et Monétaire de l&apos;Afrique Centrale (CEMAC), et notamment l&apos;Acte Uniforme révisé de l&apos;OHADA relatif au droit commercial général.
                  </p>
                  <p>
                    En cas de litige relatif à l&apos;interprétation ou à l&apos;exécution des présentes CGU, les parties s&apos;efforceront de résoudre le différend à l&apos;amiable dans un délai de trente (30) jours à compter de la notification du litige par l&apos;une des parties.
                  </p>
                  <p>
                    À défaut de résolution amiable, le litige sera soumis aux juridictions compétentes du Cameroun. L&apos;utilisation du site à partir d&apos;autres juridictions se fait à l&apos;initiative de l&apos;utilisateur, qui est seul responsable du respect des lois locales applicables.
                  </p>
                </div>
              </article>

              {/* 10. Contact */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  10. Contact
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Pour toute question relative aux présentes Conditions Générales d&apos;Utilisation, vous pouvez nous contacter :
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
                    Nous nous engageons à répondre à toute demande dans un délai raisonnable de trente (30) jours ouvrables.
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
