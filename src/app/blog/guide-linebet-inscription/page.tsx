import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const SLUG = 'guide-linebet-inscription'
const PAGE_URL = `${SITE_URL}/blog/${SLUG}`
const TITLE = 'Guide Complet Linebet : Inscription, Dépôt et Code Promo VISION221'
const DESCRIPTION = 'Guide étape par étape pour créer votre compte Linebet, utiliser le code promo VISION221, effectuer un dépôt en Mobile Money ou crypto, et naviguer sur l\'application. Conseils pour les parieurs africains en Franc CFA.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['linebet inscription', 'code promo linebet', 'VISION221', 'linebet depot', 'linebet afrique', 'linebet mobile money', 'linebet franc CFA', 'bonus linebet', 'inscription linebet cameroun', 'linebet senegal'],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BttsBet',
    type: 'article',
    publishedTime: '2026-02-18',
    modifiedTime: '2026-06-01',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Guide Linebet – Code Promo VISION221' }],
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
    datePublished: '2026-02-18',
    dateModified: '2026-06-01',
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
    image: `${SITE_URL}/og-image.png`,
  }
}

function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: TITLE, item: PAGE_URL },
    ],
  }
}

/* ──────────────────────────────────────────────────────────────
   Page Component (Server Component)
   ────────────────────────────────────────────────────────────── */
export default function GuideLinebetInscription() {
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

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald focus:text-dark-900 focus:font-bold focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <Navbar />

      <main id="main-content" className="flex-1 relative z-10">
        {/* ── Breadcrumb ── */}
        <nav aria-label="Fil d'Ariane" className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li><a href="/blog" className="hover:text-emerald transition-colors">Blog</a></li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li><span className="text-gray-400" aria-current="page">Guide Linebet</span></li>
          </ol>
        </nav>

        {/* ── Article ── */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Header */}
          <header className="mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border bg-emerald/15 text-emerald border-emerald/30">
              Guide
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl text-white mt-4 mb-4 leading-tight"
              style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            >
              Guide Complet Linebet : Inscription, Dépôt et Code Promo{' '}
              <span className="text-gold animate-pulse-gold">VISION221</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Tout ce que vous devez savoir pour ouvrir votre compte Linebet, effectuer votre premier dépôt
              et profiter du bonus exclusif avec le code promo VISION221. Guide adapté aux parieurs africains.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <time dateTime="2026-02-18">18 février 2026</time>
              <span>•</span>
              <span>12 min de lecture</span>
            </div>
            <div className="accent-line-emerald max-w-xs mt-6" />
          </header>

          {/* Content */}
          <div className="prose-custom space-y-8">
            {/* Section 1 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Pourquoi choisir Linebet en 2026 ?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Linebet s&apos;est imposé comme l&apos;un des bookmakers les plus populaires en Afrique de l&apos;Ouest et centrale.
                Avec une interface intuitive disponible en français, des méthodes de dépôt adaptées au continent
                (Mobile Money, Orange Money, Wave, crypto-monnaies), et des cotes compétitives sur le football,
                Linebet répond aux besoins spécifiques des parieurs africains. La plateforme propose également
                des marchés spéciaux comme les paris sur les matchs FIFA virtuels, un secteur en pleine expansion.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                En 2026, Linebet couvre plus de 40 sports différents et propose des paris en direct sur des milliers
                d&apos;événements chaque jour. L&apos;application mobile, disponible sur Android et iOS, offre une expérience
                fluide même avec une connexion internet modeste — un atout majeur dans les régions où la bande passante
                est limitée. Les cotes de Linebet sont souvent supérieures de 2 à 5% à celles de la concurrence sur
                les marchés BTTS et Over/Under, ce qui fait une différence significative sur le long terme.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Étape 1 : Créer votre compte Linebet
              </h2>
              <p className="text-gray-400 leading-relaxed">
                L&apos;inscription sur Linebet est rapide et gratuite. Suivez ces étapes pour créer votre compte en moins de 3 minutes :
              </p>
              <ol className="list-decimal list-inside space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li>
                  <strong className="text-white">Accédez au site officiel</strong> — Rendez-vous sur Linebet via notre
                  lien de parrainage pour bénéficier automatiquement du code promo VISION221. Évitez les sites mirroirs
                  qui pourraient être des arnaques.
                </li>
                <li>
                  <strong className="text-white">Cliquez sur « Inscription »</strong> — Le bouton est visible en haut à
                  droite de la page d&apos;accueil. Quatre méthodes d&apos;inscription sont disponibles : numéro de téléphone,
                  e-mail, réseaux sociaux, ou en un clic.
                </li>
                <li>
                  <strong className="text-white">Remplissez vos informations</strong> — Indiquez votre numéro de téléphone
                  (format international, ex : +237 pour le Cameroun, +221 pour le Sénégal), créez un mot de passe solide
                  (minimum 8 caractères avec majuscules, chiffres et symboles), et sélectionnez votre devise. Pour les
                  pays de la zone CFA, sélectionnez XOF (Franc CFA BCEAO) ou XAF (Franc CFA BEAC).
                </li>
                <li>
                  <strong className="text-white">Saisissez le code promo VISION221</strong> — Dans le champ « Code promo »,
                  entrez <span className="text-gold font-bold">VISION221</span> pour activer votre bonus de bienvenue exclusif.
                  Ce code vous offre un bonus sur votre premier dépôt, augmentant ainsi votre capital de départ.
                </li>
                <li>
                  <strong className="text-white">Validez votre compte</strong> — Un code de confirmation sera envoyé par SMS
                  ou e-mail. Saisissez-le pour activer votre compte. Conservez précieusement vos identifiants.
                </li>
              </ol>
            </section>

            {/* Section 3 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Étape 2 : Effectuer votre premier dépôt
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Une fois votre compte créé, vous devez l&apos;approvisionner pour commencer à parier. Linebet offre
                plusieurs méthodes de dépôt adaptées aux utilisateurs africains :
              </p>
              <div className="grid gap-4 mt-4 sm:grid-cols-2">
                <div className="card p-4">
                  <h3 className="text-white font-bold text-sm mb-2">Mobile Money & Orange Money</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Dépôt instantané via MTN Mobile Money, Orange Money, Moov Money ou Wave. Montant minimum :
                    500 FCFA. Idéal pour les dépôts rapides sans carte bancaire. Le processus prend moins de 30 secondes.
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="text-white font-bold text-sm mb-2">Crypto-monnaies</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Bitcoin, Ethereum, USDT (TRC-20), Litecoin et d&apos;autres cryptos sont acceptés. Les dépôts en crypto
                    sont rapides (10-30 minutes) et sans frais supplémentaires. Le montant minimum en USDT est de 10 USDT
                    (environ 6 000 FCFA).
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="text-white font-bold text-sm mb-2">Carte bancaire / Virement</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Visa et Mastercard sont acceptées. Virement bancaire disponible pour les montants plus élevés.
                    Les dépôts par carte sont crédités instantanément, les virements peuvent prendre 1 à 3 jours ouvrés.
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="text-white font-bold text-sm mb-2">Agents locaux</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Dans certains pays (Cameroun, Sénégal, Côte d&apos;Ivoire), des agents locaux Linebet acceptent
                    les dépôts en espèces. Renseignez-vous auprès du service client pour trouver l&apos;agent le plus proche.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-gold/10 border border-gold/30">
                <p className="text-sm text-gold-light leading-relaxed">
                  <strong>Conseil BttsBet :</strong> Déposez au minimum 5 000 FCFA pour profiter pleinement du bonus
                  VISION221. Plus votre premier dépôt est élevé, plus le bonus est généreux. Évitez de déposer moins
                  de 1 000 FCFA car les frais relatifs réduisent votre capital effectif.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Étape 3 : Naviguer sur l&apos;application Linebet
              </h2>
              <p className="text-gray-400 leading-relaxed">
                L&apos;application Linebet est conçue pour être simple et efficace. Voici les sections essentielles
                que vous devez connaître :
              </p>
              <ul className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Section « Sports »</strong> — Accédez à tous les sports disponibles,
                  filtrez par championnat, et consultez les cotes en temps réel. Les marchés BTTS et Over/Under sont
                  accessibles en cliquant sur un match spécifique.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Section « Live »</strong> — Pariez en direct sur les matchs en cours.
                  Les cotes sont mises à jour en temps réel. Idéal pour les stratégies de <a href="/blog/strategie-mise-over-2-5" className="text-emerald hover:underline">mise Over 2,5 en live</a>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Section « FIFA Virtuel »</strong> — Paris sur les matchs FIFA simulés.
                  Un marché à part entière avec des opportunités spécifiques que notre IA analyse en permanence.
                  Découvrez notre <a href="/blog/faille-fifa-linebet" className="text-emerald hover:underline">analyse de la faille FIFA Linebet</a>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Coupon de paris</strong> — Ajoutez vos sélections au coupon, choisissez
                  votre mise et validez. Le coupon affiche le gain potentiel et vous permet de combiner plusieurs matchs
                  en un pari combiné.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald font-bold mt-0.5">▸</span>
                  <span><strong className="text-white">Mon compte</strong> — Gérez vos dépôts, retraits, historique de paris
                  et paramètres personnels. La vérification KYC (Know Your Customer) est recommandée pour faciliter
                  les retraits futurs.</span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Code promo VISION221 : Comment ça fonctionne ?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le code promo <span className="text-gold font-bold animate-pulse-gold">VISION221</span> est un code
                exclusif négocié par l&apos;équipe BttsBet en partenariat avec Linebet. Il vous offre un bonus
                sur votre premier dépôt, qui peut atteindre un montant significatif selon le dépôt effectué.
              </p>
              <div className="mt-4 p-5 rounded-lg bg-panel/50 border border-edge/50">
                <h3 className="text-white font-bold mb-3">Conditions à retenir :</h3>
                <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">✓</span>
                    Le code doit être saisi lors de l&apos;inscription ou dans les 7 jours suivant la création du compte
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">✓</span>
                    Le bonus est crédité automatiquement après le premier dépôt
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">✓</span>
                    Des conditions de mise (wagering requirements) s&apos;appliquent avant le retrait du bonus
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">✓</span>
                    Le bonus est valable une seule fois par utilisateur et par adresse IP
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald">✓</span>
                    Consultez les conditions complètes sur le site Linebet pour les détails à jour
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Conseils pour les parieurs africains
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Parier depuis l&apos;Afrique implique quelques spécificités qu&apos;il faut maîtriser pour optimiser
                votre expérience. Voici nos recommandations :
              </p>
              <ul className="space-y-3 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">1.</span>
                  <span><strong className="text-white">Choisissez la bonne devise</strong> — Optez pour le Franc CFA (XOF ou XAF)
                  comme devise de compte pour éviter les frais de conversion à chaque dépôt et retrait. Les taux de conversion
                  appliqués par les bookmakers sont souvent défavorables.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">2.</span>
                  <span><strong className="text-white">Privilégiez le Mobile Money</strong> — C&apos;est la méthode la plus rapide
                  et la plus économique. Les frais de transaction sont minimes (souvent gratuits pour les dépôts) et les
                  transferts sont instantanés. Conservez vos reçus de transaction en cas de litige.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">3.</span>
                  <span><strong className="text-white">Gérez votre bankroll en FCFA</strong> — Fixez-vous un budget mensuel clair
                  en Franc CFA et tenez-vous-y. Consultez notre <a href="/blog/gestion-bankroll-paris-sportifs" className="text-emerald hover:underline">guide complet de gestion de bankroll</a> pour
                  des exemples concrets adaptés à votre budget.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">4.</span>
                  <span><strong className="text-white">Effectuez la vérification KYC dès l&apos;inscription</strong> — Envoyez
                  votre pièce d&apos;identité et un justificatif de domicile dès la création du compte. Cela facilitera
                  grandement vos retraits ultérieurs et évitera les blocages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold font-bold mt-0.5">5.</span>
                  <span><strong className="text-white">Attention aux cotes et marchés locaux</strong> — Les championnats africains
                  (Ligue 1 Cameroun, Ligue 1 Sénégal, etc.) offrent parfois des cotes mal ajustées, créant des opportunités
                  de value bet. Notre IA les détecte automatiquement.</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2
                className="text-2xl sm:text-3xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Retirer vos gains sur Linebet
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Le retrait de vos gains est aussi important que le dépôt. Linebet propose les mêmes méthodes
                de retrait que pour les dépôts, avec quelques nuances :
              </p>
              <ul className="space-y-2 mt-4 text-gray-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald">▸</span>
                  <span><strong className="text-white">Mobile Money</strong> — Retrait en 5 à 30 minutes. Montant minimum :
                  1 000 FCFA. Montant maximum par transaction : 500 000 FCFA selon l&apos;opérateur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald">▸</span>
                  <span><strong className="text-white">Crypto</strong> — Retrait en 10 à 60 minutes selon la blockchain.
                  Idéal pour les montants importants sans limite de plafond.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald">▸</span>
                  <span><strong className="text-white">Virement bancaire</strong> — Délai de 1 à 5 jours ouvrés.
                  Nécessite un compte bancaire à votre nom.</span>
                </li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                Important : vérifiez que votre compte est validé (KYC) avant de demander un retrait. Les comptes
                non vérifiés peuvent subir des délais supplémentaires ou des blocages. Conservez toujours une trace
                de vos transactions et contactez le support Linebet en cas de problème.
              </p>
            </section>

            {/* CTA Section */}
            <section className="mt-12 p-6 sm:p-8 rounded-xl bg-panel/50 border border-edge/50 text-center">
              <h2
                className="text-2xl sm:text-3xl text-white mb-3"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                Prêt à commencer ?
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
                Consultez nos pronostics BTTS et Over 2,5 du jour, générés par notre IA avec une précision
                historique d&apos;environ 87%. Inscrivez-vous sur Linebet avec le code VISION221 pour un bonus exclusif.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/"
                  className="btn-emerald px-8 py-3 text-sm font-bold inline-block"
                >
                  Voir nos pronostics du jour
                </a>
                <a
                  href="https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration"
                  rel="sponsored nofollow"
                  target="_blank"
                  className="btn-gold px-8 py-3 text-sm font-bold inline-block"
                >
                  S&apos;inscrire sur Linebet
                </a>
              </div>
            </section>

            {/* Related Articles */}
            <section className="mt-10 pt-8 border-t border-edge/30">
              <h3
                className="text-xl text-white mb-4"
                style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
              >
                Articles <span className="text-emerald">liés</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <a href="/blog/gestion-bankroll-paris-sportifs" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">Stratégie</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Gestion de Bankroll aux Paris Sportifs</p>
                </a>
                <a href="/blog/faille-fifa-linebet" className="card p-4 group hover-lift">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">FIFA</span>
                  <p className="text-sm text-white font-semibold mt-1 group-hover:text-emerald transition-colors">Faille FIFA Linebet : Détecter les Cotes Erronées</p>
                </a>
              </div>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
