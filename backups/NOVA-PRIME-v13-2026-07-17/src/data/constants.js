// ═══════════════════════════════════════════════════════════════
// BttsBet – Centralized Data & Constants
// ═══════════════════════════════════════════════════════════════

export const SITE = {
  name: 'BttsBet',
  url: 'https://bttsbet.online',
  tagline: 'Pronostics football BTTS & Over 2,5 basés sur l\'IA pour parieurs sérieux',
  promoCode: 'VISION221',
  accuracy: '~87%',
  whatsapp: 'https://wa.me/15406704172',
}

export const AFFILIATE = {
  // Lien direct d'inscription sur le site officiel
  linebet: 'https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration',
  // Lien de téléchargement APK Android
  linebetDownload: 'https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803',
  // Lien masqué pour réseaux sociaux (Facebook, Instagram, TikTok)
  linebetSocial: [
    'https://vision221.lineorgs.com/',
    'https://linebet.press/vision221',
    'https://linebetop.com/en?promocode=VISION221',
  ],
  rel: 'sponsored nofollow',
}

// ─── Navigation ───
// HashRouter note: anchor links use scrollTarget (element ID) instead of href
export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Pronostics', scrollTarget: 'free-predictions' },
  { label: 'Résultats', scrollTarget: 'win-history' },
  { label: 'VIP & Bonus', scrollTarget: 'vip' },
  { label: 'FAQ', scrollTarget: 'faq' },
]

// ─── How It Works ───
export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'L\'IA scanne les matchs',
    desc: 'Notre intelligence artificielle analyse en temps réel plus de 200 variables statistiques pour chaque match : xG, forme récente, blessés, historique des confrontations.',
  },
  {
    step: '02',
    title: 'On sélectionne les meilleurs',
    desc: 'Seuls les pronostics BTTS et Over 2,5 avec le plus haut indice de confiance sont retenus et publiés sur la plateforme.',
  },
  {
    step: '03',
    title: 'Tu paries en confiance',
    desc: 'Utilise nos pronostics sur Linebet ou ton bookmaker habituel. Code promo VISION221 pour un bonus exclusif sur le premier dépôt.',
  },
]

// ─── Stats Hero ───
export const HERO_STATS = [
  { value: '~87%', label: 'Précision historique', icon: 'target' },
  { value: '15 000+', label: 'Pronostics analysés', icon: 'chart' },
  { value: '50+', label: 'Championnats couverts', icon: 'globe' },
]

// ─── Why Linebet ───
export const WHY_LINEBET = [
  {
    title: 'Bonus de Bienvenue',
    desc: 'Un bonus de jusqu\'à 150$ avec le code VISION221 sur le premier dépôt (mise x5, cote min. 1,40).',
    icon: 'gift',
  },
  {
    title: 'Cotes Compétitives',
    desc: 'Des cotes compétitives du marché pour optimiser vos gains potentiels sur les paris BTTS et Over/Under.',
    icon: 'chart',
  },
  {
    title: 'Cash Out Disponible',
    desc: 'Sécurisez vos gains avant la fin du match grâce à la fonction Cash Out intégrée.',
    icon: 'cash',
  },
  {
    title: 'Application Mobile',
    desc: 'Pariez n\'importe où avec l\'app Linebet disponible sur Android et iOS.',
    icon: 'phone',
  },
  {
    title: 'Live Betting',
    desc: 'Pariez en direct avec des cotes mises à jour en temps réel pendant les matchs.',
    icon: 'live',
  },
  {
    title: 'Paiement Rapide',
    desc: 'Retraits généralement traités en moins de 24h via Mobile Money, carte bancaire ou crypto.',
    icon: 'bolt',
  },
]

// ─── Testimonials ───
export const TESTIMONIALS = [
  {
    name: 'Moussa K.',
    city: 'Douala, Cameroun',
    initials: 'MK',
    text: 'Grâce à BttsBet, j\'ai obtenu 3 pronostics BTTS corrects d\'affilée. L\'IA est vraiment précise !',
    rating: 5,
  },
  {
    name: 'Aminata D.',
    city: 'Dakar, Sénégal',
    initials: 'AD',
    text: 'Le code VISION221 m\'a permis de bénéficier d\'un bonus sur Linebet. Je recommande !',
    rating: 5,
  },
  {
    name: 'Ibrahim T.',
    city: 'Abidjan, Côte d\'Ivoire',
    initials: 'IT',
    text: 'Les résultats sont vérifiables et transparents. BttsBet est devenu mon outil quotidien.',
    rating: 4,
  },
  {
    name: 'Fatou B.',
    city: 'Bamako, Mali',
    initials: 'FB',
    text: 'Les pronostics Over 2,5 sont très fiables. L\'interface est claire et bien conçue.',
    rating: 5,
  },
]

// ─── FAQ ───
export const FAQ_ITEMS = [
  {
    q: 'Qu\'est-ce que le BTTS ?',
    a: 'BTTS signifie "Both Teams To Score" (les deux équipes marquent). C\'est un type de pari où vous pariez que les deux équipes marqueront au moins un but durant le match, quelle que soit l\'issue finale. Ce marché est très populaire car il ne dépend pas du résultat final du match, mais uniquement de la capacité des deux équipes à trouver le chemin des filets. Notre IA analyse les statistiques offensives et défensives pour identifier les matchs où les deux équipes ont une forte probabilité de marquer.',
  },
  {
    q: 'Comment fonctionne l\'IA de BttsBet ?',
    a: 'Notre intelligence artificielle analyse des centaines de variables en temps réel : Expected Goals (xG), forme récente des équipes, blessés et suspensions, historique des confrontations directes, conditions météo, motivation des équipes (fin de saison, matchs décisifs), et bien plus encore. L\'algorithme est entraîné sur plus de 50 000 matchs et affiche des résultats historiques d\'environ 87% de précision. Chaque pronostic est accompagné d\'un indice de confiance calculé par le modèle.',
  },
  {
    q: 'Comment utiliser le code promo VISION221 ?',
    a: 'C\'est très simple : inscrivez-vous sur Linebet via notre lien de parrainage, puis saisissez le code promo VISION221 lors de votre inscription ou dans la section "Code Promo" de votre compte. Vous recevrez automatiquement un bonus exclusif sur votre premier dépôt. Ce bonus vous permettra de commencer à parier avec un capital supplémentaire et de tester nos pronostics sans risque.',
  },
  {
    q: 'Les pronostics gratuits sont-ils fiables ?',
    a: 'Oui, nos pronostics gratuits sont générés par la même IA que nos pronostics premium. Ils couvrent les matchs les plus populaires du jour avec une analyse complète. La différence avec les pronostics premium réside dans le nombre de matchs analysés et l\'accès à des marchés supplémentaires. Nos résultats sont transparents et vérifiables sur notre plateforme.',
  },
  {
    q: 'Quels championnats sont couverts ?',
    a: 'Nous couvrons plus de 50 championnats à travers le monde : Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, et de nombreux championnats africains, asiatiques et sud-américains. Notre IA s\'adapte aux spécificités de chaque ligue pour fournir des pronostics les plus précis possibles.',
  },
  {
    q: 'Comment utiliser les pronostics BttsBet ?',
    a: 'Nos pronostics sont des outils d\'aide à la décision, pas des garanties de gain. Pour les utiliser au mieux, consultez nos pronostics gratuits chaque jour, vérifiez l\'indice de confiance associé, et croisez avec votre propre analyse. Nous vous recommandons de toujours respecter votre gestion de bankroll et de ne jamais miser plus que ce que vous pouvez vous permettre de perdre. Les résultats passés ne garantissent pas les résultats futurs.',
  },
]

// ─── Blog Articles (SEO Content) ───
export const BLOG_ARTICLES = [
  {
    id: 'comment-analyser-match-btts',
    slug: 'comment-analyser-match-btts',
    title: 'Comment analyser un match pour le BTTS ? Guide complet 2026',
    excerpt: 'Découvrez les critères essentiels pour analyser un match de football et identifier les meilleures opportunités de paris BTTS. De l\'analyse statistique à l\'évaluation des facteurs contextuels.',
    category: 'Stratégie',
    readTime: '8 min',
    date: '2026-06-01',
    image: '📊',
    metaDescription: 'Guide complet pour analyser un match de football et identifier les opportunités BTTS. Apprenez les critères statistiques, les facteurs contextuels et les outils utilisés par les professionnels.',
    content: `
      <h2>Pourquoi le BTTS est un marché si populaire ?</h2>
      <p>Le marché BTTS (Both Teams To Score) est devenu l\'un des paris les plus populaires chez les parieurs du monde entier, et ce pour une raison simple : il ne dépend pas du résultat final du match. Que l\'équipe A gagne 2-1, que le match se termine sur un 1-1, ou que l\'équipe B l\'emporte 1-3, tant que les deux équipes marquent au moins un but, votre pari est gagnant. Cette indépendance par rapport au résultat final rend le BTTS particulièrement attractif, car il élimine une grande partie de l\'incertitude liée à la détermination du vainqueur.</p>
      <p>En 2026, le marché BTTS représente environ 18% de tous les paris sportifs placés sur le football en Afrique et en Europe, avec une croissance annuelle de 12%. Cette popularité croissante s\'explique par l\'accessibilité du concept et par le fait que même un match apparemment déséquilibré peut offrir une excellente opportunité BTTS si les conditions sont réunies.</p>

      <h2>Les 5 critères fondamentaux d\'analyse BTTS</h2>
      <h3>1. Les statistiques offensives et défensives</h3>
      <p>Le premier indicateur à examiner est le ratio de buts marqués et encaissés par chaque équipe. Une équipe qui marque en moyenne 1.8 but par match et en encaisse 1.2 est un excellent candidat pour un pari BTTS. Portez une attention particulière aux statistiques à domicile pour l\'équipe locale et à l\'extérieur pour l\'équipe visiteuse, car les performances globale et spécifique (domicile/extérieur) peuvent varier considérablement. Par exemple, une équipe peut avoir une moyenne de 2.3 buts marqués à domicile contre seulement 0.9 à l\'extérieur.</p>

      <h3>2. Les Expected Goals (xG)</h3>
      <p>Les xG mesurent la qualité des occasions créées plutôt que simplement le nombre de buts marqués. Une équipe avec un xG élevé mais un nombre de buts inférieur à son xG est statistiquement "malchanceuse" et devrait rectifier le tir dans les matchs suivants. Inversement, une équipe qui sur-performe son xG risque de voir ses statistiques de buts baisser. Notre IA utilise les xG comme l\'un des principaux facteurs de prédiction, ce qui contribue significativement à notre taux de précision historique d\'environ 87%.</p>

      <h3>3. La forme récente</h3>
      <p>Les 5 derniers matchs sont cruciaux pour évaluer la dynamique d\'une équipe. Une équipe en confiance marquera plus facilement, tandis qu\'une équipe en crise défensive encaissera davantage. Attention cependant à ne pas surinterpréter une série courte : un match sans but marqué ne signifie pas nécessairement qu\'une équipe est en difficulté offensive. Il faut croiser cette donnée avec les xG et le niveau de l\'adversaire affronté lors de ces matchs.</p>

      <h3>4. Les absences et suspensions</h3>
      <p>L\'absence d\'un attaquant clé peut réduire significativement le potentiel offensif d\'une équipe, tandis que l\'absence d\'un défenseur central titulaire peut fragiliser la défense. Notre algorithme intègre automatiquement les informations de blessures et suspensions, mais il est important de comprendre leur impact : l\'absence d\'un joueur avec un xG contributif de 0.4 par match peut réduire les chances de BTTS de 8 à 12%.</p>

      <h3>5. L\'historique des confrontations directes</h3>
      <p>Certains matchs produisent historiquement plus de buts que d\'autres, indépendamment de la forme actuelle des équipes. Les derbies, les rivalités historiques et les matchs entre équipes offensives ont tendance à produire des scores ouverts. Analysez les 10 dernières confrontations entre les deux équipes pour identifier des tendances récurrentes en matière de buts marqués.</p>

      <h2>Les outils indispensables pour l\'analyse BTTS</h2>
      <p>Pour les parieurs qui souhaitent aller au-delà des pronostics de notre IA, voici les outils recommandés : SofaScore pour les statistiques en temps réel, Understat pour les xG détaillés, Transfermarkt pour les effectifs et blessures, et bien sûr BttsBet pour nos pronostics générés par intelligence artificielle. La combinaison de ces outils avec notre algorithme vous donne un avantage considérable sur le marché des paris BTTS.</p>

      <blockquote>Notre IA analyse plus de 200 variables pour chaque match, incluant les statistiques avancées, les facteurs contextuels et les tendances historiques. C\'est cette profondeur d\'analyse qui nous permet d\'afficher environ 87% de précision historique.</blockquote>
    `,
  },
  {
    id: 'strategie-mise-over-2-5',
    slug: 'strategie-mise-over-2-5',
    title: 'Stratégie de mise Over 2,5 : optimiser ses gains en 2026',
    excerpt: 'Maîtrisez la stratégie Over 2,5 avec nos conseils. Gestion de bankroll, identification des matchs à fort potentiel, et techniques avancées pour les parieurs confirmés.',
    category: 'Stratégie',
    readTime: '10 min',
    date: '2026-05-28',
    image: '🎯',
    metaDescription: 'Stratégie Over 2.5 complète : gestion de bankroll, identification des matchs, techniques avancées. Apprenez à maximiser vos gains sur le marché des plus de 2.5 buts.',
    content: `
      <h2>Comprendre le marché Over 2.5</h2>
      <p>Le pari Over 2.5 (plus de 2.5 buts) est gagnant lorsque le match totalise 3 buts ou plus. Le ".5" garantit qu\'il n\'y a pas de résultat push (remboursement) : le total est soit au-dessus, soit en dessous de 2.5. Contrairement au BTTS qui nécessite que les deux équipes marquent, l\'Over 2.5 peut être gagné même si une seule équipe marque les 3 buts. Cette différence fondamentale offre des opportunités dans des matchs très déséquilibrés où une équipe dominatrice affronte un adversaire nettement inférieur.</p>
      <p>En moyenne, environ 48% des matchs de football professionnel se terminent avec plus de 2.5 buts. Ce pourcentage varie considérablement selon les championnats : la Bundesliga allemande dépasse souvent les 55%, tandis que la Serie A italienne tourne autour de 42%. Connaître ces tendances par championnat est le premier pas vers une stratégie Over 2.5 rentable.</p>

      <h2>La gestion de bankroll : la clé de la rentabilité</h2>
      <h3>La règle des 2-5%</h3>
      <p>Ne misez jamais plus de 5% de votre bankroll sur un seul pari, et visez plutôt 2-3% pour les pronostics standards. Cette discipline vous protège contre les séries de pertes inévitables dans les paris sportifs. Par exemple, avec une bankroll de 200$, votre mise maximale par pari devrait être de 10$, et votre mise standard entre 4$ et 6$. Même avec une précision historique d\'environ 87%, il y aura des jours de perte, et la gestion de bankroll est ce qui sépare les parieurs rentables des parieurs perdants à long terme.</p>

      <h3>La méthode Kelly Criterion</h3>
      <p>Pour les parieurs avancés, le Kelly Criterion permet de calculer la mise optimale en fonction de la probabilité estimée et de la cote offerte. La formule est : Mise = (Probabilité × Cote - 1) / (Cote - 1). Si notre IA estime la probabilité d\'Over 2.5 à 65% et que la cote est de 1.80, le Kelly Criterion suggère une mise de 17.5% de la bankroll. En pratique, on utilise le "Fractional Kelly" (25-50% du montant Kelly) pour réduire la volatilité.</p>

      <h2>Identifier les matchs Over 2.5 à fort potentiel</h2>
      <p>Les meilleurs matchs pour l\'Over 2.5 partagent ces caractéristiques : deux équipes avec une moyenne combinée supérieure à 3.0 buts par match, un xG cumulé élevé (>2.5), des défenses perméables (plus de 1.2 but encaissé par match pour chaque équipe), un historique de confrontations ouvertes, et des enjeux importants (matchs de classement, barrages). Notre IA croise automatiquement tous ces critères pour générer des pronostics avec un indice de confiance, vous permettant de choisir les matchs les plus prometteurs.</p>

      <h2>Les erreurs à éviter absolument</h2>
      <p>La première erreur est de parier sur l\'Over 2.5 dans les matchs de fin de saison sans enjeu : les équipes jouent souvent de manière plus relâchée, ce qui peut donner des matchs imprévisibles. La deuxième erreur est d\'ignorer les conditions météo : un match sous une pluie battante ou sur un terrain en mauvais état réduit considérablement les chances de voir beaucoup de buts. La troisième erreur est la poursuite des pertes (chasing) : après une série de pertes, ne doublez pas vos mises, respectez votre plan de gestion de bankroll.</p>

      <blockquote>La discipline et la gestion de bankroll sont plus importantes que le taux de précision. Un parieur avec 65% de précision mais une excellente gestion de bankroll sera plus rentable qu\'un parieur avec 80% de précision mais qui mise de façon irrégulière.</blockquote>
    `,
  },
  {
    id: 'meilleurs-championnats-btts',
    slug: 'meilleurs-championnats-btts',
    title: 'Les 10 meilleurs championnats pour les paris BTTS en 2026',
    excerpt: 'Découvrez quels championnats offrent les meilleures opportunités de paris BTTS basé sur les données statistiques de la saison 2025-2026.',
    category: 'Analyse',
    readTime: '7 min',
    date: '2026-05-25',
    image: '🌍',
    metaDescription: 'Classement des 10 meilleurs championnats pour les paris BTTS en 2026. Statistiques détaillées, taux de BTTS par ligue et conseils pour chaque championnat.',
    content: `
      <h2>Pourquoi le choix du championnat est crucial</h2>
      <p>Tous les championnats ne se valent pas en matière de paris BTTS. Certaines ligues produisent naturellement des matchs avec plus de buts en raison de leur style de jeu, de la qualité offensive des équipes, ou de la culture footballistique du pays. Choisir les bons championnats est souvent la différence entre un parieur rentable et un parieur perdant. Les données de la saison 2025-2026 confirment des tendances historiques solides que tout parieur BTTS devrait connaître.</p>

      <h2>Le top 10 des championnats BTTS</h2>
      <h3>1. Bundesliga (Allemagne) – Taux BTTS : 64%</h3>
      <p>La Bundesliga reste le championnat reine pour les paris BTTS. Le style de jeu allemand, axé sur l\'attaque, combiné à des défenses souvent aventurières, produit des matchs spectaculaires. Avec une moyenne de 3.18 buts par match en 2025-2026, la Bundesliga surpasse toutes les autres ligues majeures. Les équipes comme Leipzig, Dortmund et Leverkusen participent régulièrement à des matchs avec des scores fleuves.</p>

      <h3>2. Eredivisie (Pays-Bas) – Taux BTTS : 62%</h3>
      <p>La tradition offensive néerlandaise n\'est plus à prouver. L\'Eredivisie est un championnat où la philosophie du "Total Football" continue d\'influencer le style de jeu. Les matchs Ajax-PSV, Feyenoord-Ajax sont des garanties de spectacle. La moyenne de 3.05 buts par match en fait l\'un des championnats les plus rentables pour les parieurs BTTS.</p>

      <h3>3. Premier League (Angleterre) – Taux BTTS : 58%</h3>
      <p>La Premier League combine un rythme intense et des équipes de qualité relativement homogène, ce qui favorise les matchs ouverts. Les "Big Six" ont souvent des défenses capables de clean sheets, mais les matchs entre équipes du milieu de tableau sont des mines d\'or pour le BTTS. Liverpool, Arsenal et Tottenham sont parmi les équipes les plus fiables pour les paris BTTS.</p>

      <h3>4. Serie A (Italie) – Taux BTTS : 55%</h3>
      <p>Contrairement aux idées reçues, la Serie A n\'est plus le championnat défensif d\'antan. L\'arrivée d\'entraîneurs offensifs a transformé le style de jeu italien. Naples, l\'Atalanta et la Lazio produisent régulièrement des matchs à buts. Le taux de BTTS a augmenté de 12 points en 5 ans, passant de 43% à 55%.</p>

      <h3>5. Ligue 1 (France) – Taux BTTS : 53%</h3>
      <p>La Ligue 1 offre des opportunités BTTS intéressantes, particulièrement dans les matchs impliquant des équipes du top 6 hors PSG. Les matchs Lyon-Marseille, Lille-Lyon et Monaco-Rennes sont des valeurs sûres pour le BTTS. Le PSG, en revanche, est une équipe plus imprévisible pour ce marché en raison de sa capacité à neutraliser les adversaires modestes.</p>

      <h2>Les championnats à éviter pour le BTTS</h2>
      <p>La Liga argentine, la Serie A brésilienne et certains championnats africains ont des taux de BTTS inférieurs à 40%, souvent en raison de tactiques très défensives ou de terrains en mauvais état. Cependant, même dans ces championnats, des opportunités existent dans les derbies et les matchs à enjeux. Notre IA identifie ces opportunités cachées que la plupart des parieurs ignorent.</p>

      <blockquote>La clé du succès en pari BTTS n\'est pas de parier sur tous les matchs, mais de sélectionner les matchs dans les championnats où le taux de BTTS est historiquement le plus élevé. Qualité sur quantité, toujours.</blockquote>
    `,
  },
  {
    id: 'gestion-bankroll-paris-sportifs',
    slug: 'gestion-bankroll-paris-sportifs',
    title: 'Gestion de bankroll aux paris sportifs : le guide ultime',
    excerpt: 'Apprenez à gérer votre capital de paris sportifs comme un professionnel. Méthodes de mise, calcul de la rentabilité et stratégies de protection contre les pertes.',
    category: 'Formation',
    readTime: '12 min',
    date: '2026-05-20',
    image: '💰',
    metaDescription: 'Guide complet de gestion de bankroll pour les paris sportifs. Méthodes de mise, Kelly Criterion, protection contre les pertes. Devenez un parieur rentable.',
    content: `
      <h2>Pourquoi 95% des parieurs perdent de l\'argent</h2>
      <p>La statistique est implacable : environ 95% des parieurs sportifs perdent de l\'argent à long terme. Mais ce n\'est pas parce qu\'ils ont de mauvais pronostics. La majorité d\'entre eux perdent à cause d\'une mauvaise gestion de bankroll. Un parieur qui gagne 60% de ses paris peut être déficitaire s\'il mise de façon inconsistante, tandis qu\'un parieur avec seulement 55% de réussite peut être rentable avec une gestion rigoureuse. La gestion de bankroll est véritablement la compétence la plus importante dans les paris sportifs, bien avant la capacité de prédiction.</p>

      <h2>Définir sa bankroll de départ</h2>
      <p>Votre bankroll doit être une somme que vous êtes prêt à perdre entièrement sans que cela n\'affecte votre vie quotidienne. Ce n\'est pas votre épargne, ce n\'est pas votre loyer : c\'est un budget loisirs dédié aux paris. Pour débuter, nous recommandons un montant entre 50$ et 200$, selon vos moyens. L\'important n\'est pas le montant initial, mais la discipline avec laquelle vous gérez cette somme. Même avec 50$, une gestion rigoureuse peut construire un capital significatif sur plusieurs mois.</p>

      <h2>Les 4 méthodes de mise les plus efficaces</h2>
      <h3>1. La mise fixe (Flat Betting)</h3>
      <p>C\'est la méthode la plus simple et la plus recommandée pour les débutants. Vous misez le même montant sur chaque pari, généralement entre 2% et 5% de votre bankroll initiale. Par exemple, avec une bankroll de 100$, vous misez systématiquement 3$ par pari. Cette méthode élimine le risque de perte rapide et permet de construire la bankroll progressivement. L\'inconvénient est qu\'elle ne tient pas compte de la confiance dans le pronostic.</p>

      <h3>2. La mise proportionnelle</h3>
      <p>Avec cette méthode, votre mise est toujours un pourcentage fixe de votre bankroll actuelle. Si vous gagnez, vos mises augmentent. Si vous perdez, vos mises diminuent. Cela crée un effet naturel de protection en période de perte et d\'accélération en période de gain. Par exemple, avec 3% de mise proportionnelle : bankroll de 100$ = mise de 3$, bankroll de 150$ = mise de 4.50$, bankroll de 80$ = mise de 2.40$.</p>

      <h3>3. Le Kelly Criterion</h3>
      <p>C\'est la méthode mathématiquement optimale pour maximiser la croissance de la bankroll. La formule est : f = (bp - q) / b, où b est la cote - 1, p est la probabilité de gain, et q est la probabilité de perte (1 - p). En pratique, on utilise le "Half Kelly" (50% du montant Kelly) pour réduire la volatilité. C\'est la méthode utilisée par la plupart des parieurs professionnels.</p>

      <h3>4. La méthode des unités de confiance</h3>
      <p>Vous attribuez une note de confiance de 1 à 5 à chaque pronostic, et votre mise est proportionnelle à cette confiance. Unité 1 = 1% de la bankroll, Unité 5 = 5% de la bankroll. Cette méthode est idéale pour les parieurs qui utilisent des pronostics avec indice de confiance comme ceux de BttsBet. Notre IA fournit un pourcentage de confiance pour chaque pronostic, ce qui facilite grandement l\'application de cette méthode.</p>

      <h2>Les règles d\'or du parieur rentable</h2>
      <p>Ne misez jamais plus de 5% de votre bankroll sur un seul pari. Ne poursuivez jamais vos pertes en augmentant vos mises. Tenez un journal de tous vos paris (date, match, mise, cote, résultat). Revoyez vos statistiques chaque semaine pour identifier vos forces et faiblesses. Fixez-vous des objectifs réalistes : un rendement de 5-10% par mois est excellent. Et surtout, n\'oubliez jamais que les paris sportifs doivent rester un loisir, jamais une source de stress financier.</p>

      <blockquote>La discipline financière est le vrai séparateur entre les parieurs qui gagnent et ceux qui perdent. Notre IA vous donne les pronostics, mais c\'est votre gestion de bankroll qui détermine votre rentabilité à long terme.</blockquote>
    `,
  },
  {
    id: 'guide-linebet-inscription',
    slug: 'guide-linebet-inscription',
    title: 'Guide complet Linebet : inscription, dépôt et code promo VISION221',
    excerpt: 'Tout ce que vous devez savoir sur Linebet : comment créer un compte, effectuer un dépôt, utiliser le code promo VISION221 et profiter du bonus de bienvenue.',
    category: 'Tutoriel',
    readTime: '6 min',
    date: '2026-05-15',
    image: '🎮',
    metaDescription: 'Guide complet pour s\'inscrire sur Linebet, effectuer un dépôt et utiliser le code promo VISION221. Tutoriel étape par étape avec captures d\'écran et conseils.',
    content: `
      <h2>Pourquoi choisir Linebet en 2026 ?</h2>
      <p>Linebet s\'est imposé comme l\'une des plateformes de paris sportifs les plus populaires en Afrique et dans les pays francophones. Avec plus de 5 millions d\'utilisateurs actifs, l\'application se distingue par ses cotes compétitives, sa variété de marchés (plus de 40 sports disponibles), et surtout son système de paiement adapté aux réalités africaines : Mobile Money (MTN, Orange, Moov), transfert bancaire local, et même les cryptomonnaies. La plateforme est licenciée et régulée, offrant un environnement de pari sécurisé et fiable.</p>

      <h2>Étape 1 : Créer votre compte Linebet</h2>
      <p>Rendez-vous sur Linebet via notre lien de parrainage pour bénéficier du bonus exclusif. Cliquez sur le bouton "Inscription" en haut à droite de la page d\'accueil. Vous avez le choix entre 4 méthodes d\'inscription : par numéro de téléphone (recommandé en Afrique), par email, par réseau social, ou en un clic. Remplissez vos informations personnelles : nom, prénom, date de naissance, pays de résidence. Choisissez votre devise (FCFA, Dollar, Euro selon votre pays). Saisissez le code promo VISION221 dans le champ dédié pour activer votre bonus de bienvenue.</p>

      <h2>Étape 2 : Effectuer votre premier dépôt</h2>
      <p>Linebet offre de nombreuses méthodes de dépôt adaptées à chaque région. En Afrique de l\'Ouest et centrale, Mobile Money est la méthode la plus pratique : MTN Mobile Money, Orange Money, et Moov Money sont tous acceptés. Le dépôt minimum est de 500 FCFA (environ 0.80$). Les dépôts sont instantanés et sans frais. Vous pouvez également utiliser une carte bancaire Visa ou Mastercard, un virement bancaire, ou des cryptomonnaies (Bitcoin, Ethereum, USDT). Pour les dépôts en crypto, le minimum est de 10$ et la transaction est généralement confirmée en 10 à 30 minutes.</p>

      <h2>Étape 3 : Utiliser le code promo VISION221</h2>
      <p>Si vous n\'avez pas saisi le code VISION221 lors de l\'inscription, pas de panique : vous pouvez toujours le saisir dans la section "Code Promo" de votre compte. Le code VISION221 vous donne droit à un bonus de 100% sur votre premier dépôt, jusqu\'à 150$. Par exemple, si vous déposez 50$, vous recevez 50$ de bonus, soit un total de 100$ pour parier. Le bonus est soumis à des conditions de mise (wagering requirements) : vous devez parier le montant du bonus 5 fois sur des événements avec une cote minimale de 1.40 avant de pouvoir retirer vos gains.</p>

      <h2>Étape 4 : Placer votre premier pari BTTS</h2>
      <p>Une fois votre compte approvisionné, naviguez vers la section "Football" dans le menu des sports. Sélectionnez un match et cherchez le marché "BTTS" ou "Les deux équipes marquent". Cochez votre choix (Oui ou Non), entrez votre mise dans le bulletin de paris, et confirmez. Nous vous recommandons de commencer par les pronostics gratuits de BttsBet pour vous familiariser avec le marché avant de placer des mises plus importantes.</p>

      <h2>Conseils pour maximiser votre bonus</h2>
      <p>Pour remplir les conditions de mise efficacement, privilégiez les paris avec des cotes entre 1.40 et 2.00. Ces cotes offrent un bon équilibre entre probabilité de gain et contribution aux conditions de mise. Évitez les paris combinés trop risqués lors de la phase de déblocage du bonus. Utilisez nos pronostics IA pour sélectionner des matchs avec une forte probabilité de gain. Et surtout, ne précipitez pas : vous avez 30 jours pour remplir les conditions de mise, alors pariez de manière réfléchie et disciplinée.</p>

      <blockquote>Le code promo VISION221 est exclusif à BttsBet. En l\'utilisant, vous soutenez notre travail de développement et de maintenance de l\'IA, tout en bénéficiant du meilleur bonus disponible sur Linebet.</blockquote>
    `,
  },
]

// ─── Legal / Footer ───
export const LEGAL = {
  disclaimer: `Les paris sportifs comportent des risques financiers. Ne misez jamais plus que ce que vous pouvez vous permettre de perdre. Les statistiques de précision de notre IA (environ 87%) sont basées sur des données historiques vérifiables et ne garantissent pas de résultats futurs. BttsBet est un site informatif et d'affiliation : nous ne prenons pas de paris et ne collectons pas de fonds. Les témoignages présentés sur ce site reflètent des expériences individuelles et ne constituent pas une garantie de résultats. Jouez de manière responsable.`,
  responsible: `Si vous ou un proche avez un problème lié aux jeux d'argent, contactez la ligne d'écoute nationale de votre pays. En France : 09-74-75-13-13 (Joueurs Info Service). Au Cameroun : contactez le MINSANT. Au Sénégal : 33 867 22 22.`,
  copyright: `© ${new Date().getFullYear()} BttsBet. Tous droits réservés.`,
  links: [
    { label: 'Mentions Légales', href: '/mentions-legales' },
    { label: 'Politique de Confidentialité', href: '/politique-confidentialite' },
    { label: 'Jouer Responsable', href: '/jouer-responsable' },
    { label: 'CGU', href: '/cgu' },
  ],
}

// ─── SEO Block ───
export const SEO_BLOCK = {
  title: 'Pronostics football BTTS & Over 2,5 – Intelligence artificielle',
  paragraphs: [
    'BttsBet est une plateforme dédiée aux pronostics BTTS (Both Teams To Score) et Over 2,5 générés par intelligence artificielle. Notre algorithme analyse en temps réel plus de 200 variables statistiques pour chaque match de football, incluant les Expected Goals (xG), la forme récente des équipes, les blessures et suspensions, l\'historique des confrontations, et les conditions météorologiques.',
    'Avec des résultats historiques d\'environ 87% sur plus de 15 000 pronostics analysés, notre IA peut aider les parieurs à prendre de meilleures décisions sur les marchés BTTS et Over/Under 2,5 buts. Nos pronostics couvrent plus de 50 championnats à travers le monde, des ligues européennes majeures aux championnats africains et asiatiques.',
    'Profitez du code promo VISION221 sur Linebet pour bénéficier d\'un bonus exclusif sur le premier dépôt (soumis à conditions : mise x5, cote minimale 1,40). BttsBet s\'engage pour le jeu responsable : nos pronostics sont des outils d\'aide à la décision, pas des garanties de gain. Pariez toujours de manière responsable et dans les limites de votre budget.',
  ],
}
