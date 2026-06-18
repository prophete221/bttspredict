// ═══════════════════════════════════════════════════════════════
// BttsBet – Centralized Data & Constants
// ═══════════════════════════════════════════════════════════════

export const SITE = {
  name: 'BttsBet',
  url: 'https://bttsbet.online',
  tagline: "Pronostics football BTTS & Over 2,5 basés sur l'IA pour parieurs sérieux",
  promoCode: 'VISION221',
  accuracy: '~87%',
  whatsapp: 'https://wa.me/15406704172',
  vipAccuracy: '~89%',
  historyRate: '88.3%',
  last30Rate: '91%',
}

export const AFFILIATE = {
  linebet: 'https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration',
  linebetDownload: 'https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803',
  linebetSocial: [
    'https://vision221.lineorgs.com/',
    'https://linebet.press/vision221',
    'https://linebetop.com/en?promocode=VISION221',
  ],
  // 888starz — Nouveau partenaire d'affiliation (même code promo VISION221)
  star888: 'https://888ghta.com/8hwF6V',
  star888Download: 'https://888ghta.com/5o6glw',
  rel: 'sponsored nofollow',
}

// Liste des bookmakers affiliés pour itération dans l'UI
export const BOOKMAKERS = [
  {
    id: 'linebet',
    name: 'Linebet',
    signupLink: AFFILIATE.linebet,
    downloadLink: AFFILIATE.linebetDownload,
    promoCode: 'VISION221',
    color: 'emerald',
    bonus: 'Bonus 150$',
    description: 'Bookmaker #1 en Afrique — Bonus exclusif de 150$',
    logoFull: '/logos/linebet.svg',
    logoIcon: '/logos/linebet-icon.svg',
  },
  {
    id: '888starz',
    name: '888starz',
    signupLink: AFFILIATE.star888,
    downloadLink: AFFILIATE.star888Download,
    promoCode: 'VISION221',
    color: 'gold',
    bonus: 'Bonus 100%',
    description: 'Nouveau bookmaker partenaire — Bonus 100% sur le 1er dépôt',
    logoFull: '/logos/888starz.svg',
    logoIcon: '/logos/888starz-icon.svg',
  },
] as const

// Logo Android — utilisé sur les boutons de téléchargement APK
export const ANDROID_LOGO = '/logos/android.svg'

export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Pronostics', scrollTarget: 'free-predictions' },
  { label: 'Résultats', scrollTarget: 'win-history' },
  { label: 'FIFA', scrollTarget: 'fifa-linebet', highlight: true },
  { label: 'VIP & Bonus', scrollTarget: 'vip' },
  { label: 'FAQ', scrollTarget: 'faq' },
]

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: "L'IA scanne les matchs",
    desc: "Notre intelligence artificielle analyse en temps réel plus de 200 variables statistiques pour chaque match : xG, forme récente, blessés, historique des confrontations.",
  },
  {
    step: '02',
    title: 'On sélectionne les meilleurs',
    desc: "Seuls les pronostics BTTS et Over 2,5 avec le plus haut indice de confiance sont retenus et publiés sur la plateforme.",
  },
  {
    step: '03',
    title: 'Tu paries en confiance',
    desc: "Utilise nos pronostics sur Linebet ou ton bookmaker habituel. Code promo VISION221 pour un bonus exclusif sur le premier dépôt.",
  },
]

export const HERO_STATS = [
  { value: '~87%', label: 'Précision historique', icon: 'target' },
  { value: '15 000+', label: 'Pronostics analysés', icon: 'chart' },
  { value: '50+', label: 'Championnats couverts', icon: 'globe' },
]

export const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que le BTTS ?",
    a: "BTTS signifie \"Both Teams To Score\" (les deux équipes marquent). C'est un type de pari où vous pariez que les deux équipes marqueront au moins un but durant le match, quelle que soit l'issue finale. Ce marché est très populaire car il ne dépend pas du résultat final du match, mais uniquement de la capacité des deux équipes à trouver le chemin des filets. Notre IA analyse les statistiques offensives et défensives pour identifier les matchs où les deux équipes ont une forte probabilité de marquer.",
  },
  {
    q: "Comment fonctionne l'IA de BttsBet ?",
    a: "Notre intelligence artificielle analyse des centaines de variables en temps réel : Expected Goals (xG), forme récente des équipes, blessés et suspensions, historique des confrontations directes, conditions météo, motivation des équipes (fin de saison, matchs décisifs), et bien plus encore. L'algorithme est entraîné sur plus de 50 000 matchs et affiche des résultats historiques d'environ 87% de précision. Chaque pronostic est accompagné d'un indice de confiance calculé par le modèle.",
  },
  {
    q: 'Comment utiliser le code promo VISION221 ?',
    a: "C'est très simple : inscrivez-vous sur Linebet via notre lien de parrainage, puis saisissez le code promo VISION221 lors de votre inscription ou dans la section \"Code Promo\" de votre compte. Vous recevrez automatiquement un bonus exclusif sur votre premier dépôt. Ce bonus vous permettra de commencer à parier avec un capital supplémentaire et de tester nos pronostics sans risque.",
  },
  {
    q: 'Les pronostics gratuits sont-ils fiables ?',
    a: "Oui, nos pronostics gratuits sont générés par la même IA que nos pronostics premium. Ils couvrent les matchs les plus populaires du jour avec une analyse complète. La différence avec les pronostics premium réside dans le nombre de matchs analysés et l'accès à des marchés supplémentaires. Nos résultats sont transparents et vérifiables sur notre plateforme.",
  },
  {
    q: 'Quels championnats sont couverts ?',
    a: "Nous couvrons plus de 50 championnats à travers le monde : Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, et de nombreux championnats africains, asiatiques et sud-américains. Notre IA s'adapte aux spécificités de chaque ligue pour fournir des pronostics les plus précis possibles.",
  },
  {
    q: 'Comment utiliser les pronostics BttsBet ?',
    a: "Nos pronostics sont des outils d'aide à la décision, pas des garanties de gain. Pour les utiliser au mieux, consultez nos pronostics gratuits chaque jour, vérifiez l'indice de confiance associé, et croisez avec votre propre analyse. Nous vous recommandons de toujours respecter votre gestion de bankroll et de ne jamais miser plus que ce que vous pouvez vous permettre de perdre. Les résultats passés ne garantissent pas les résultats futurs.",
  },
]

export const LEGAL = {
  disclaimer: "Les paris sportifs comportent des risques financiers. Ne misez jamais plus que ce que vous pouvez vous permettre de perdre. Les statistiques de précision de notre IA (environ 87%) sont basées sur des données historiques et ne garantissent pas de résultats futurs. BttsBet est un site informatif et d'affiliation : nous ne prenons pas de paris et ne collectons pas de fonds. Les témoignages présentés sur ce site reflètent des expériences individuelles et ne constituent pas une garantie de résultats. Jouez de manière responsable.",
  responsible: "Si vous ou un proche avez un problème lié aux jeux d'argent, contactez la ligne d'écoute nationale de votre pays. En France : 09-74-75-13-13 (Joueurs Info Service). Au Cameroun : contactez le MINSANT. Au Sénégal : 33 867 22 22.",
  copyright: `© ${new Date().getFullYear()} BttsBet. Tous droits réservés.`,
  links: [
    { label: 'Mentions Légales', href: '/mentions-legales' },
    { label: 'Politique de Confidentialité', href: '/politique-confidentialite' },
    { label: 'Jouer Responsable', href: '/jouer-responsable' },
    { label: 'CGU', href: '/cgu' },
  ],
}
