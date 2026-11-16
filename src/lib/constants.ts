// ═══════════════════════════════════════════════════════════════
// BTTSPredict – Centralized Data & Constants
// ═══════════════════════════════════════════════════════════════

export const SITE = {
  name: 'BTTSPredict',
  url: 'https://bttspredict.com',
  tagline: 'Sélections football BTTS & Over 2,5 vérifiées, avec historique public consultable',
  promoCode: 'VISION221',
  accuracy: 'Calculé en temps réel depuis l\'archive publique',
  vipAccuracy: 'Calculé en temps réel depuis l\'archive publique',
  historyRate: 'Voir /historique',
  last30Rate: 'Voir /historique',
}

export const AFFILIATE = {
  // 1xbet — partenaire prioritaire (affilié 2026-11). Code promo : vipbtts
  // (casse EXACTE fournie par l'affiliateur — ne pas modifier la casse).
  oneXbet: 'https://reffpa.com/L?tag=d_6292935m_1599c_&site=6292935&ad=1599',
  oneXbetDownload: 'https://reffpa.com/L?tag=d_6292935m_45361c_&site=6292935&ad=45361',
  // Melbet — partenaire affilié (2026-11). Code promo : Bttswin (casse exacte).
  melbet: 'https://refpa3665.com/L?tag=d_6293054m_2170c_&site=6293054&ad=2170',
  melbetDownload: 'https://refpa3665.com/L?tag=d_6293054m_70867c_&site=6293054&ad=70867',
  linebet: 'https://lb-aff.com/L?tag=d_5589568m_22611c_&site=5589568&ad=22611',
  linebetDownload: 'https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803',
  linebetSocial: [
    'https://vision221.lineorgs.com/',
    'https://linebet.press/vision221',
    'https://linebetop.com/en?promocode=VISION221',
  ],
  // 888starz utilise btts221 — vipbtts est réservé à 1xbet, VISION221 à Linebet,
  // Bttswin à Melbet — ne jamais permuter les codes.
  star888: 'https://888ghta.com/8hwF6V',
  star888Download: 'https://888ghta.com/5o6glw',
  rel: 'sponsored nofollow',
}

// L’accès VIP reste verrouillé jusqu’à une confirmation manuelle du propriétaire.
export const VIP_POLICY = {
  partners: ['1xbet', 'linebet', 'melbet', '888starz'],
  access: 'locked',
  approval: 'manual-owner-confirmation',
  publicData: 'none',
} as const

// Ordre de priorité des partenaires : 1xbet et Linebet d'abord (affiliation
// prioritaire 2026-11), Melbet ensuite, 888starz en dernier.
// Ne pas réordonner sans validation. Codes = casse exacte de l'affiliateur.
export const BOOKMAKERS = [
  {
    id: '1xbet', name: '1xbet', signupLink: AFFILIATE.oneXbet, downloadLink: AFFILIATE.oneXbetDownload,
    promoCode: 'vipbtts', color: 'blue',
    logoFull: '/logos/1xbet-logo.png', logoIcon: '/logos/1xbet-logo.png',
  },
  {
    id: 'linebet', name: 'Linebet', signupLink: AFFILIATE.linebet, downloadLink: AFFILIATE.linebetDownload,
    promoCode: 'VISION221', color: 'emerald',
    logoFull: '/logos/linebet-logo.jpg', logoIcon: '/logos/linebet-logo.jpg',
  },
  {
    id: 'melbet', name: 'Melbet', signupLink: AFFILIATE.melbet, downloadLink: AFFILIATE.melbetDownload,
    promoCode: 'Bttswin', color: 'amber',
    logoFull: '/logos/melbet-logo.jpg', logoIcon: '/logos/melbet-logo.jpg',
  },
  {
    id: '888starz', name: '888starz', signupLink: AFFILIATE.star888, downloadLink: AFFILIATE.star888Download,
    promoCode: 'btts221', color: 'gold',
    logoFull: '/logos/888starz-logo.jpg', logoIcon: '/logos/888starz-logo.jpg',
  },
] as const

export const ANDROID_LOGO = '/logos/android.svg'

export const NAV_LINKS = [
  { label: 'Accueil', href: '/' }, { label: 'Pronos', scrollTarget: 'free-predictions' },
  { label: 'Historique', href: '/historique' }, { label: 'Méthodologie', href: '/methodologie' },
  { label: 'VIP', scrollTarget: 'vip', highlight: true },
]

export const HOW_IT_WORKS = [
  { step: '01', title: 'Les sélections sont contrôlées', desc: 'Les picks publics passent des contrôles de validation; le site ne les recalcule pas localement.' },
  { step: '02', title: 'Les sélections validées sont publiées', desc: 'Les picks BTTS et Over 2,5 sont affichés uniquement après validation; la disponibilité varie selon les données publiées.' },
  { step: '03', title: 'Consulte les informations partenaires', desc: 'Les codes et offres confirmées figurent dans les guides dédiés; vérifie directement auprès de chaque opérateur les autres modalités et l’applicabilité.' },
]

export const HERO_STATS = [
  { value: 'Voir /historique', label: 'Taux de réussite réel', icon: 'target' },
  { value: '—', label: 'Pronostics archivés (voir /historique)', icon: 'chart' },
  { value: 'Voir la liste', label: 'Compétitions configurées', icon: 'globe' },
]

export const FAQ_ITEMS = [
  { q: "Qu'est-ce que le BTTS ?", a: `BTTS signifie "Both Teams To Score" (les deux équipes marquent) : chaque équipe inscrit au moins un but. Sur BTTSPredict, un pick BTTS public n'est affiché que s'il fait partie des sélections publiques et passe les contrôles de validation; aucun résultat futur n'est garanti.` },
  { q: "Comment fonctionne l'analyse de BTTSPredict ?", a: 'Les sélections publiques BTTS et Over 2,5 sont publiées après avoir passé les contrôles de validation; le site ne les recalcule pas avec Poisson ou une heuristique locale. Les résultats historiques sont consultables dans l’archive publique; les performances passées ne garantissent pas les résultats futurs.' },
  { q: 'Où consulter les informations promotionnelles des partenaires ?', a: 'Les informations et éventuelles conditions promotionnelles figurent sur les guides dédiés à chaque partenaire. Vérifiez toujours les conditions affichées par l’opérateur avant toute inscription ou dépôt.' },
  { q: 'Les pronostics gratuits sont-ils fiables ?', a: 'Les pronostics affichés sont publiés uniquement après les contrôles de validation. Leur disponibilité varie selon les matchs et les marchés; aucun résultat futur n’est garanti. Consultez l’historique pour les résultats archivés.' },
  { q: 'Quels championnats sont couverts ?', a: 'Onze compétitions sont configurées pour les pages dédiées. Le flux public n’est pas un calendrier exhaustif et les matchs disponibles varient; seuls les picks validés sont affichés.' },
  { q: 'Comment utiliser les pronostics BTTSPredict ?', a: "Nos pronostics sont des outils d'aide à la décision, pas des garanties de gain. Pour les utiliser au mieux, consultez nos pronostics gratuits chaque jour, vérifiez l'indice de confiance associé, et croisez avec votre propre analyse. Nous vous recommandons de toujours respecter votre gestion de bankroll et de ne jamais miser plus que ce que vous pouvez vous permettre de perdre. Les résultats passés ne garantissent pas les résultats futurs." },
  { q: 'Peut-on prédire Aviator ou une faille de cotes FIFA ?', a: "Non. Aviator est un jeu 100% aléatoire basé sur un générateur certifié 'provably fair' — aucun outil au monde ne peut prédire le multiplicateur d'un round futur. Nos statistiques Aviator permettent d'observer l'historique des rounds et les tendances passées, mais ne constituent en aucun cas des prédictions. Concernant les 'Analyses de valeur FIFA (expérimental)', il s'agit d'estimations statistiques comparant les cotes des bookmakers à nos probabilités calculées — ce sont des outils d'analyse, pas des garanties de gain. Tout pari comporte un risque de perte." },
]

export const HOME_FAQ_ITEMS = [FAQ_ITEMS[0], FAQ_ITEMS[1], FAQ_ITEMS[3], FAQ_ITEMS[2]]

export const VIP_DESCRIPTION = 'Accès VIP verrouillé jusqu’à confirmation manuelle du propriétaire.'
export const LONASE = { name: 'LONASE', description: 'Loterie Nationale du Sénégal' }

export const LEGAL = {
  disclaimer: "Les paris sportifs comportent des risques financiers. Ne misez jamais plus que ce que vous pouvez vous permettre de perdre. Les picks publics passent des contrôles de validation avant publication. Les données historiques affichées distinguent les picks enregistrés des résultats source sans sélection; les performances passées ne garantissent aucun résultat futur. BTTSPredict fournit des informations et des liens d’affiliation; ce site ne permet pas de placer un pari. Jouez de manière responsable (18+).",
  responsible: "Si vous ou un proche êtes affecté par les jeux d’argent, contactez un service d’aide qualifié disponible dans votre région. Les ressources et numéros d’assistance varient selon le pays.",
  copyright: `© ${new Date().getFullYear()} BTTSPredict. Tous droits réservés.`,
  links: [
    { label: 'Mentions Légales', href: '/mentions-legales' }, { label: 'Politique de Confidentialité', href: '/politique-confidentialite' },
    { label: 'Jouer Responsable', href: 'https://www.begambleaware.org/' }, { label: 'CGU', href: '/cgu' },
  ],
}
