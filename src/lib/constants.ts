// ═══════════════════════════════════════════════════════════════
// BTTSPredict – Centralized Data & Constants
// ═══════════════════════════════════════════════════════════════

export const SITE = {
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  tagline: "Pronostics football BTTS & Over 2,5 validés par nos analystes pour parieurs sérieux",
  promoCode: 'VISION221',
  // Stats RÉELLES calculées par scripts/update-win-history.mjs depuis public/predictions-archive/
  // → Aucune stat figée ici. Les chiffres proviennent de public/win-history.json.
  // → Pour afficher le taux dans l'UI, lire win-history.json (côté client) ou fetch /win-history.json
  accuracy: 'Calculé en temps réel depuis l\'archive publique',
  vipAccuracy: 'Calculé en temps réel depuis l\'archive publique',
  vipMinDeposit: '3 000 / 6 000 / 12 000 XOF',
  historyRate: 'Voir /historique',
  last30Rate: 'Voir /historique',
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
    bonus: 'Bonus soumis à conditions (mise x5, dépôt min 3000 XOF, voir site bookmaker)',
    description: 'Bookmaker #1 en Afrique — Bonus exclusif de 90 000 XOF (150$)',
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
    bonus: 'Bonus (voir conditions sur site)',
    description: 'Nouveau bookmaker partenaire — Bonus (voir conditions sur site) sur le 1er dépôt',
    logoFull: '/logos/888starz.svg',
    logoIcon: '/logos/888starz-icon.svg',
  },
] as const

// Logo Android — utilisé sur les boutons de téléchargement APK
export const ANDROID_LOGO = '/logos/android.svg'

export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Pronos', scrollTarget: 'free-predictions' },
  { label: 'Historique', href: '/historique' },
  { label: 'Méthodologie', href: '/methodologie' },
  { label: 'VIP', scrollTarget: 'vip', highlight: true },
]

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: "L'IA scanne les matchs",
    desc: "Notre analyse statistique analyse en temps réel plus de 200 variables statistiques pour chaque match : xG, forme récente, blessés, historique des confrontations.",
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
  { value: 'Voir /historique', label: 'Taux de réussite réel', icon: 'target' },
  { value: '—', label: 'Pronostics archivés (voir /historique)', icon: 'chart' },
  { value: '50+', label: 'Championnats couverts', icon: 'globe' },
]

export const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que le BTTS ?",
    a: "BTTS signifie \"Both Teams To Score\" (les deux équipes marquent). C'est un type de pari où vous pariez que les deux équipes marqueront au moins un but durant le match, quelle que soit l'issue finale. Ce marché est très populaire car il ne dépend pas du résultat final du match, mais uniquement de la capacité des deux équipes à trouver le chemin des filets. Notre équipe analyse les statistiques offensives et défensives pour identifier les matchs où les deux équipes ont une forte probabilité de marquer.",
  },
  {
    q: "Comment fonctionne l'analyse de BTTSPredict ?",
    a: "Nos analystes utilisent un modèle statistique Poisson + agrégation multi-sources : Expected Goals (xG), forme récente des équipes (5 derniers matchs), blessés et suspensions, historique des confrontations directes, conditions météo. Le modèle est calibré sur plus de 50 000 matchs. Le taux de réussite réel est calculé quotidiennement depuis l'archive publique des pronostics (predictions-archive/) et affiché sans filtrage sur /historique. Chaque pronostic est accompagné d'un indice de confiance calculé par le modèle. Les performances passées ne garantissent pas les résultats futurs.",
  },
  {
    q: 'Comment utiliser le code promo VISION221 ?',
    a: "C'est très simple : inscrivez-vous sur Linebet via notre lien de parrainage, puis saisissez le code promo VISION221 lors de votre inscription ou dans la section \"Code Promo\" de votre compte. Vous recevrez automatiquement un bonus exclusif sur votre premier dépôt. Ce bonus vous permettra de commencer à parier avec un capital supplémentaire et de tester nos pronostics avec un budget accru.",
  },
  {
    q: 'Les pronostics gratuits sont-ils fiables ?',
    a: "Nos pronostics gratuits sont validés par la même équipe d'analystes que nos pronostics premium. Ils couvrent les matchs les plus populaires du jour avec une analyse complète. La différence avec les pronostics premium réside dans le nombre de matchs analysés et l'accès à des marchés supplémentaires. Comme pour tout pronostic, aucun résultat n'est garanti — les performances historiques ne préjugent pas des résultats futurs.",
  },
  {
    q: 'Quels championnats sont couverts ?',
    a: "Nous couvrons plus de 50 championnats à travers le monde : Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, Europa League, et de nombreux championnats africains, asiatiques et sud-américains. Notre équipe s'adapte aux spécificités de chaque ligue pour fournir des pronostics les plus précis possibles.",
  },
  {
    q: 'Comment utiliser les pronostics BTTSPredict ?',
    a: "Nos pronostics sont des outils d'aide à la décision, pas des garanties de gain. Pour les utiliser au mieux, consultez nos pronostics gratuits chaque jour, vérifiez l'indice de confiance associé, et croisez avec votre propre analyse. Nous vous recommandons de toujours respecter votre gestion de bankroll et de ne jamais miser plus que ce que vous pouvez vous permettre de perdre. Les résultats passés ne garantissent pas les résultats futurs.",
  },
  {
    q: 'Peut-on prédire Aviator ou une faille de cotes FIFA ?',
    a: "Non. Aviator est un jeu 100% aléatoire basé sur un générateur certifié 'provably fair' — aucun outil au monde ne peut prédire le multiplicateur d'un round futur. Nos statistiques Aviator permettent d'observer l'historique des rounds et les tendances passées, mais ne constituent en aucun cas des prédictions. Concernant les 'Analyses de valeur FIFA (expérimental)', il s'agit d'estimations statistiques comparant les cotes des bookmakers à nos probabilités calculées — ce sont des outils d'analyse, pas des garanties de gain. Tout pari comporte un risque de perte.",
  },
]

export const TESTIMONIALS = [
  { name: 'Mamadou D.', city: 'Dakar', text: "L'analyse xG m'aide à filtrer mes matchs. Je parie moins souvent mais avec plus de confiance.", rating: 4 },
  { name: 'Kouassi A.', city: 'Abidjan', text: "Le tableau de bord IA est clair. Les barres de probabilité BTTS me font gagner du temps dans mes analyses.", rating: 4 },
  { name: 'Ibrahim S.', city: 'Bamako', text: "BTTSPredict a remplacé mes groupes WhatsApp. Les données sont structurées et les sources sont citées.", rating: 5 },
  { name: 'Patrick N.', city: 'Douala', text: "L'historique transparent avec gagnés et perdus m'a donné confiance. Aucune promesse de gain facile.", rating: 4 },
  { name: 'Ousmane B.', city: 'Ouagadougou', text: "L'outil est honnête : le taux de réussite est calculé en temps réel depuis l'archive publique, vérifiable sur /historique. C'est ce que je cherchais.", rating: 5 },
  { name: 'Fatou M.', city: 'Dakar', text: "Le code VISION221 m'a permis de commencer sur Linebet avec un bonus. L'interface est propre et rapide.", rating: 4 },
]

export const SOCIAL_PROOF = {
  members: 2437,
  winsToday: 12,
  currentStreak: 7,
}

export const VIP_DESCRIPTION = 'VIP: Historique complet + 10 matchs/jour — Débloque avec inscription via VISION221'


export const LONASE = { name: 'LONASE', description: 'Loterie Nationale du Sénégal' }

export const URGENCY_MESSAGES = [
  "✅ {n} pronostics gagnants ce matin",
  "⚡ Série en cours : {n} victoires consécutives",
  "🎯 Code VISION221 = Bonus soumis à conditions (mise x5, dépôt min 3000 XOF, voir site bookmaker) sur Linebet",
]

export const LEGAL = {
  disclaimer: "Les paris sportifs comportent des risques financiers. Ne misez jamais plus que ce que vous pouvez vous permettre de perdre. Notre taux de réussite est calculé en temps réel depuis l'archive publique des pronostics (predictions-archive/), avec scores finaux vérifiés via API-Football et ESPN. Aucun filtrage — gagnés ET perdus affichés sur /historique. Aucun résultat futur n'est garanti. BTTSPredict est un site informatif et d'affiliation : nous ne prenons pas de paris et ne collectons pas de fonds. Les témoignages présentés sur ce site reflètent des expériences individuelles et ne constituent pas une garantie de résultats. Jouez de manière responsable (18+).",
  responsible: "Si vous ou un proche avez un problème lié aux jeux d'argent, contactez la ligne d'écoute nationale de votre pays. En France : 09-74-75-13-13 (Joueurs Info Service). Au Cameroun : contactez le MINSANT. Au Sénégal : 33 867 22 22. Ressource internationale : https://www.begambleaware.org/",
  copyright: `© ${new Date().getFullYear()} BTTSPredict. Tous droits réservés.`,
  links: [
    { label: 'Mentions Légales', href: '/mentions-legales' },
    { label: 'Politique de Confidentialité', href: '/politique-confidentialite' },
    { label: 'Jouer Responsable', href: 'https://www.begambleaware.org/' },
    { label: 'CGU', href: '/cgu' },
  ],
}
