// ═══════════════════════════════════════════════════════════════════════════
// BTTSPredict — Registre central des bookmakers partenaires
// ═══════════════════════════════════════════════════════════════════════════
// Source de vérité unique pour les codes promo, liens d'affiliation,
// APK et logos. Utilisé par : pages codes promo, GiftPopup, Navbar, Footer,
// StickyCTABar, parcours VIP.
//
// RÈGLES :
// - Les codes promo sont écrits EXACTEMENT comme donnés par chaque campagne
//   (casse comprise) : Linebet → VISION221, 1xBet → Vipbtts,
//   Melbet → Bttswin, 888starz → btts221.
// - `featured` met en avant Linebet et 1xBet (décision propriétaire 2026-11).
// - Les liens sont des liens d'affiliation rémunérés → toujours
//   rel="sponsored nofollow noopener noreferrer" à l'affichage.
// - Les libellés d'offre restent formulés « offre annoncée par la campagne ».
// ═══════════════════════════════════════════════════════════════════════════

export type BookmakerId = 'linebet' | '1xbet' | 'melbet' | '888starz'

export interface Bookmaker {
  id: BookmakerId
  name: string
  /** Code promo — casse exacte fournie par la campagne. */
  promoCode: string
  /** Indication de casse pour l'utilisateur (trilingue, dérivée de promoCode). */
  promoCodeIsCaps: boolean
  /** Lien d'inscription (affilié). */
  signup: string
  /** Lien APK Android (affilié). */
  download: string
  /** Logo transparent (fond sombre). */
  logo: string
  /** Variante logo pour fond clair (si le wordmark contient du blanc). */
  logoLight?: string
  /** Page code promo du site (route FR racine ; /en/… et /ar/… existent). */
  promoPath: string
  /** Mis en avant (Linebet + 1xBet). */
  featured: boolean
  /** Couleur d'accent de la marque (hex) — badges, bordures. */
  accent: string
  /** Offre annoncée par la campagne (sans garantie, à vérifier chez l'opérateur). */
  offer: {
    bonus: string | null        // ex. « 300% » — null si non communiqué
    freeSpins: string | null    // ex. « 100 » — null si non communiqué
    wagering: string            // ex. « Sans condition de mise »
    minDeposit: string          // ex. « 1 € »
  }
}

export const BOOKMAKERS: Bookmaker[] = [
  {
    id: 'linebet',
    name: 'Linebet',
    promoCode: 'VISION221',
    promoCodeIsCaps: true,
    signup: 'https://lb-aff.com/L?tag=d_5589568m_22611c_site&site=5589568&ad=22611&r=registration',
    download: 'https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803',
    logo: '/logos/linebet-logo.png',
    logoLight: '/logos/linebet-logo.png',
    promoPath: '/code-promo-linebet-senegal',
    featured: true,
    accent: '#1FA84A',
    offer: { bonus: '300%', freeSpins: '100', wagering: 'Sans condition de mise', minDeposit: '1 €' },
  },
  {
    id: '1xbet',
    name: '1xBet',
    promoCode: 'Vipbtts',
    promoCodeIsCaps: false,
    signup: 'https://reffpa.com/L?tag=d_6292935m_1599c_&site=6292935&ad=1599',
    download: 'https://reffpa.com/L?tag=d_6292935m_45361c_&site=6292935&ad=45361',
    // Sur fond sombre (popup cadeau, strip) : wordmark blanc lisible.
    // Sur fond clair (cartes promo, modale) : logo officiel bleu.
    logo: '/logos/1xbet-logo-light.png',
    logoLight: '/logos/1xbet-logo.png',
    promoPath: '/code-promo-1xbet',
    featured: true,
    accent: '#1D8FD1',
    offer: { bonus: '300%', freeSpins: '100', wagering: 'Sans condition de mise', minDeposit: '1 €' },
  },
  {
    id: 'melbet',
    name: 'Melbet',
    promoCode: 'Bttswin',
    promoCodeIsCaps: false,
    signup: 'https://refpa3665.com/L?tag=d_6293054m_2170c_&site=6293054&ad=2170',
    download: 'https://refpa3665.com/L?tag=d_6293054m_70867c_&site=6293054&ad=70867',
    logo: '/logos/melbet-logo.png',
    logoLight: '/logos/melbet-logo-dark.png',
    promoPath: '/code-promo-melbet',
    featured: false,
    accent: '#F5A623',
    offer: { bonus: null, freeSpins: null, wagering: 'Offre affichée lors de l’inscription', minDeposit: '1 €' },
  },
  {
    id: '888starz',
    name: '888Starz',
    promoCode: 'btts221',
    promoCodeIsCaps: false,
    signup: 'https://888ghta.com/8hwF6V',
    download: 'https://888ghta.com/5o6glw',
    logo: '/logos/888starz-logo.png',
    logoLight: '/logos/888starz-logo.png',
    promoPath: '/bonus-888starz',
    featured: false,
    accent: '#D63148',
    offer: { bonus: '300%', freeSpins: '100', wagering: 'Sans condition de mise', minDeposit: '1 €' },
  },
]

/** Ordre d'affichage officiel : Linebet et 1xBet d'abord (décision propriétaire). */
export const BOOKMAKER_ORDER: BookmakerId[] = ['linebet', '1xbet', 'melbet', '888starz']

export function getBookmaker(id: BookmakerId): Bookmaker {
  const b = BOOKMAKERS.find(x => x.id === id)
  if (!b) throw new Error(`Bookmaker inconnu : ${id}`)
  return b
}

export function featuredBookmakers(): Bookmaker[] {
  return BOOKMAKER_ORDER.map(getBookmaker).filter(b => b.featured)
}

/** Libellé d'offre court, trilingue-safe (chiffres + symboles universels). */
export function offerShort(b: Bookmaker): string {
  if (b.offer.bonus && b.offer.freeSpins) {
    return `${b.offer.bonus} + ${b.offer.freeSpins} free spins`
  }
  if (b.offer.bonus) return `${b.offer.bonus} bonus`
  return 'Bonus de bienvenue'
}
