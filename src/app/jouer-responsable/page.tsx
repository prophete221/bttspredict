import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

/* ──────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────── */
const SITE_URL = 'https://bttsbet.online'
const PAGE_URL = `${SITE_URL}/jouer-responsable`
const TITLE = 'Jouer Responsable | BttsBet'
const DESCRIPTION =
  'Jouer responsable avec BttsBet — risques des jeux d\'argent, signes d\'addiction, conseils pour un jeu responsable, auto-exclusion et ressources d\'aide. 18+ uniquement.'

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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Jouer Responsable – BttsBet' }],
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
    description: 'Numéro national d\'aide aux joueurs problématiques. Service gratuit, anonyme et confidentiel, disponible de 8h à 2h.',
    website: 'https://www.joueurs-info-service.fr',
  },
  {
    country: '🇨🇲 Cameroun',
    name: 'MINSANT',
    phone: 'Contactez le Ministère de la Santé Publique',
    description: 'Le Ministère de la Santé Publique du Cameroun propose des ressources et orientations pour les personnes confrontées à l\'addiction aux jeux d\'argent.',
    website: '',
  },
  {
    country: '🇸🇳 Sénégal',
    name: 'Ligne d\'écoute nationale',
    phone: '33 867 22 22',
    description: 'Service d\'écoute et d\'orientation pour les personnes en difficulté avec les jeux d\'argent au Sénégal.',
    website: '',
  },
]

const addictionSigns = [
  'Vous passez plus de temps et d\'argent que prévu sur les paris sportifs',
  'Vous ressentez le besoin de parier avec des mises de plus en plus élevées pour ressentir la même excitation',
  'Vous devenez irritable, anxieux ou agité lorsque vous essayez de réduire ou d\'arrêter de parier',
  'Vous cachez l\'ampleur de vos paris à votre entourage',
  'Vous empruntez de l\'argent ou vendez des biens pour financer vos paris',
  'Vous pariez pour échapper au stress, à la solitude ou à la dépression',
  'Vous « chassez » vos pertes en augmentant vos mises pour récupérer l\'argent perdu',
  'Vos relations professionnelles, familiales ou sociales se détériorent à cause de vos habitudes de jeu',
  'Vous négligez vos obligations professionnelles, scolaires ou familiales',
  'Vous ressentez des sentiments de culpabilité ou de désespoir après avoir parié',
]

const responsibleTips = [
  {
    icon: '🎯',
    title: 'Fixez-vous un budget',
    description: 'Définissez avant de jouer un montant que vous êtes prêt à perdre et ne le dépassez jamais. Considérez ce montant comme un coût de divertissement, pas comme un investissement.',
  },
  {
    icon: '⏱️',
    title: 'Limitez votre temps de jeu',
    description: 'Définissez une durée maximale de jeu par session et respectez-la. Prenez des pauses régulières et ne pariez jamais quand vous êtes fatigué, stressé ou sous l\'influence de l\'alcool.',
  },
  {
    icon: '🚫',
    title: 'Ne chassez jamais vos pertes',
    description: 'Après une perte, résistez à la tentation de parier davantage pour récupérer votre argent. Les pertes font partie du jeu et doivent être acceptées comme telles. Augmenter ses mises après une perte est le chemin le plus sûr vers l\'endettement.',
  },
  {
    icon: '💰',
    title: 'Ne pariez jamais avec l\'argent dont vous avez besoin',
    description: 'Ne misez jamais l\'argent réservé aux dépenses essentielles (loyer, nourriture, factures, santé). N\'empruntez jamais pour parier et n\'utilisez jamais l\'argent d\'autres personnes.',
  },
  {
    icon: '🧠',
    title: 'Gardez le jeu comme un loisir',
    description: 'Les paris sportifs doivent rester un divertissement, pas un moyen de gagner votre vie. Ne considérez jamais les pronostics, même les plus fiables, comme des garanties de gain.',
  },
  {
    icon: '📊',
    title: 'Tenez un journal de vos paris',
    description: 'Notez chaque pari, son montant, son résultat et vos émotions. Ce journal vous permettra de prendre du recul sur vos habitudes de jeu et d\'identifier les comportements problématiques.',
  },
  {
    icon: '⚖️',
    title: 'Équilibrez votre vie',
    description: 'Assurez-vous que les paris sportifs ne prennent pas le pas sur vos autres activités : travail, famille, amis, sport, loisirs. Un équilibre sain est la meilleure prévention contre l\'addiction.',
  },
  {
    icon: '🛑',
    title: 'Sachez quand arrêter',
    description: 'Si vous sentez que vous perdez le contrôle, arrêtez immédiatement. Il n\'y a aucune honte à demander de l\'aide. L\'auto-exclusion est un outil puissant pour reprendre le contrôle.',
  },
]

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */
export default function JouerResponsablePage() {
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
              <span className="text-gray-400" aria-current="page">Jouer Responsable</span>
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
              JOUER <span className="text-emerald neon-glow">RESPONSABLE</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Les paris sportifs doivent rester un loisir. Informez-vous sur les risques et jouez de manière responsable.
            </p>
            <div className="accent-line-emerald max-w-xs mx-auto mt-8" />
          </div>
        </section>

        {/* Age Warning Banner */}
        <section className="pb-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-lose/10 border border-lose/30 rounded-xl p-4 sm:p-6 text-center">
              <p className="text-lose font-bold text-lg mb-1" style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                INTERDIT AUX MOINS DE 18 ANS
              </p>
              <p className="text-gray-400 text-sm">
                Les jeux d&apos;argent et de hasard sont interdits aux mineurs. BttsBet est strictement réservé aux personnes âgées de 18 ans ou plus.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">

              {/* 1. Risques des jeux d'argent */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  1. Les risques des jeux d&apos;argent
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Les paris sportifs, comme toute forme de jeu d&apos;argent, comportent des risques réels qui ne doivent pas être sous-estimés. Il est essentiel de comprendre que le modèle économique des bookmakers est conçu pour que la maison gagne sur le long terme. Même avec les meilleurs pronostics et les analyses les plus sophistiquées, le risque de perte est toujours présent.
                  </p>
                  <p>
                    Les risques principaux incluent :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Pertes financières :</strong> vous pouvez perdre tout l&apos;argent que vous misez, et potentiellement plus si vous ne gérez pas votre bankroll. L&apos;endettement est une conséquence fréquente du jeu excessif.</li>
                    <li><strong className="text-gray-300">Addiction :</strong> les jeux d&apos;argent activent le circuit de la récompense dans le cerveau, de manière similaire aux substances addictives. Le mécanisme de renforcement intermittent (gains occasionnels imprévisibles) est particulièrement puissant pour créer une dépendance.</li>
                    <li><strong className="text-gray-300">Impact psychologique :</strong> stress, anxiété, dépression, culpabilité, isolement social et idées noires peuvent accompagner le jeu problématique.</li>
                    <li><strong className="text-gray-300">Conséquences sociales :</strong> conflits familiaux, perte d&apos;emploi, isolement, mensonges à l&apos;entourage et détérioration des relations personnelles.</li>
                    <li><strong className="text-gray-300">Illusion de contrôle :</strong> la croyance erronée que l&apos;on peut « battre le système » ou que les pronostics garantissent des gains est un facteur de risque majeur.</li>
                  </ul>
                  <p>
                    BttsBet fournit des pronostics basés sur l&apos;intelligence artificielle avec un taux de précision historique d&apos;environ 87 %. Toutefois, ce chiffre est basé sur des données passées et ne constitue en aucune manière une garantie de résultats futurs. Même les meilleurs algorithmes ne peuvent pas prédire l&apos;avenir avec certitude.
                  </p>
                </div>
              </article>

              {/* 2. Signes d'addiction */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  2. Signes d&apos;addiction aux jeux d&apos;argent
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Il est important de rester vigilant face aux signes avant-coureurs de l&apos;addiction aux jeux d&apos;argent. Si vous reconnaissez un ou plusieurs des signes suivants dans votre comportement, il est temps de faire une pause et d&apos;envisager de demander de l&apos;aide :
                  </p>
                  <ul className="space-y-2 ml-2">
                    {addictionSigns.map((sign, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400">
                        <span className="text-lose mt-0.5 flex-shrink-0" aria-hidden="true">⚠</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4">
                    Si vous vous reconnaissez dans plusieurs de ces signes, n&apos;hésitez pas à contacter une ligne d&apos;écoute spécialisée. L&apos;aide est disponible et le premier pas est toujours le plus difficile.
                  </p>
                </div>
              </article>

              {/* 3. Conseils pour jouer responsable */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  3. Conseils pour un jeu responsable
                </h2>
                <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Voici nos recommandations pour maintenir une relation saine avec les paris sportifs :
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {responsibleTips.map((tip, i) => (
                      <div
                        key={i}
                        className="bg-panel/40 border border-edge/30 rounded-xl p-4 hover:border-emerald/20 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl" aria-hidden="true">{tip.icon}</span>
                          <h3 className="text-white font-semibold text-sm">{tip.title}</h3>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* 4. Auto-exclusion */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  4. Auto-exclusion
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    L&apos;auto-exclusion est un mécanisme qui vous permet de vous interdire volontairement l&apos;accès aux plateformes de jeux d&apos;argent pour une période déterminée. C&apos;est un outil puissant pour reprendre le contrôle de votre comportement de jeu.
                  </p>
                  <p>
                    Comment fonctionne l&apos;auto-exclusion :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Sur Linebet :</strong> vous pouvez activer l&apos;auto-exclusion directement dans les paramètres de votre compte. Des options de 6 mois, 1 an ou indéfinie sont généralement disponibles. Pendant la période d&apos;exclusion, vous ne pourrez ni parier ni effectuer de dépôt.</li>
                    <li><strong className="text-gray-300">Sur les autres bookmakers :</strong> la plupart des opérateurs de jeux d&apos;argent proposent des mécanismes similaires. Consultez la section « Jeu responsable » de chaque plateforme.</li>
                    <li><strong className="text-gray-300">Au niveau national :</strong> certains pays proposent des registres nationaux d&apos;auto-exclusion qui vous interdisent l&apos;accès à tous les sites de jeux d&apos;argent légaux. Renseignez-vous auprès des autorités de votre pays.</li>
                  </ul>
                  <p>
                    L&apos;auto-exclusion est une décision courageuse. Elle n&apos;est pas un signe de faiblesse mais au contraire une preuve de lucidité et de volonté de prendre soin de vous.
                  </p>
                </div>
              </article>

              {/* 5. Ressources d'aide */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  5. Ressources d&apos;aide
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    Si vous ou un proche avez besoin d&apos;aide, n&apos;hésitez pas à contacter ces services spécialisés. L&apos;appel est gratuit, anonyme et confidentiel :
                  </p>
                  <div className="space-y-4 mt-4">
                    {helpResources.map((resource, i) => (
                      <div
                        key={i}
                        className="bg-panel/40 border border-edge/30 rounded-xl p-4 sm:p-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg" aria-hidden="true">{resource.country}</span>
                          <h3 className="text-white font-semibold">{resource.name}</h3>
                        </div>
                        <div className="space-y-1 text-gray-400 text-sm">
                          <p>
                            <strong className="text-gold">Téléphone :</strong>{' '}
                            <span className="text-emerald font-mono">{resource.phone}</span>
                          </p>
                          <p>{resource.description}</p>
                          {resource.website && (
                            <p>
                              <strong className="text-gold">Site web :</strong>{' '}
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
                  <p className="mt-4">
                    Vous pouvez également nous contacter directement via{' '}
                    <a
                      href="https://wa.me/15406704172"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald hover:text-emerald-soft transition-colors underline underline-offset-2"
                    >
                      WhatsApp
                    </a>{' '}
                    si vous avez des questions ou besoin d&apos;orientation.
                  </p>
                </div>
              </article>

              {/* 6. Engagement BttsBet */}
              <article className="card p-6">
                <h2
                  className="text-2xl text-white mb-4"
                  style={{ fontFamily: "var(--font-bebas-neue), 'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}
                >
                  6. L&apos;engagement de BttsBet
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    En tant que plateforme de pronostics sportifs, BttsBet assume sa responsabilité dans la promotion du jeu responsable. Notre engagement se traduit par les actions concrètes suivantes :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                    <li><strong className="text-gray-300">Transparence :</strong> nous affichons clairement nos taux de précision comme des statistiques historiques, jamais comme des garanties de gains futurs. Nous rappelons systématiquement que les résultats passés ne préjugent pas des résultats futurs.</li>
                    <li><strong className="text-gray-300">Information :</strong> chaque page de notre site comporte un avertissement sur les risques liés aux paris sportifs et un lien vers cette page de jeu responsable.</li>
                    <li><strong className="text-gray-300">Vérification de l&apos;âge :</strong> nous mettons en place un dispositif de vérification de l&apos;âge pour empêcher l&apos;accès aux mineurs. Le site est strictement réservé aux personnes de 18 ans et plus.</li>
                    <li><strong className="text-gray-300">Pas d&apos;incitation excessive :</strong> nos contenus promotionnels sont conçus pour informer, pas pour inciter de manière agressive ou trompeuse au jeu.</li>
                    <li><strong className="text-gray-300">Aide accessible :</strong> nous facilitons l&apos;accès aux ressources d&apos;aide et aux numéros d&apos;écoute spécialisés pour nos utilisateurs.</li>
                    <li><strong className="text-gray-300">Nature du service :</strong> BttsBet est un site informatif et d&apos;affiliation. Nous ne prenons aucun pari, ne collectons aucun fonds et ne sommes pas un bookmaker. Les utilisateurs parient à leur entière discrétion sur les plateformes de leur choix.</li>
                  </ul>
                  <p>
                    Nous croyons fermement que les paris sportifs ne doivent être pratiqués que de manière responsable, dans le cadre d&apos;un budget de loisir clairement défini. Si vous ne pouvez pas vous permettre de perdre, ne pariez pas.
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
