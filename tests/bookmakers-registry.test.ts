import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'
import {
  BOOKMAKER_ORDER,
  BOOKMAKERS as REGISTRY,
  featuredBookmakers,
  getBookmaker,
} from '@/lib/bookmakers'

/**
 * Garde-fou refonte 2026-11 — le registre bookmakers est la source unique des
 * codes promo, liens affiliés, logos et pages. Toute divergence casse le build
 * de tests AVANT déploiement.
 */

const EXACT_CODES: Record<string, string> = {
  // Casse EXACTE fournie par chaque campagne — ne jamais normaliser.
  linebet: 'VISION221',
  '1xbet': 'Vipbtts',
  melbet: 'Bttswin',
  '888starz': 'btts221',
}

const EXPECTED_PAGE: Record<string, string> = {
  linebet: '/code-promo-linebet-senegal',
  '1xbet': '/code-promo-1xbet',
  melbet: '/code-promo-melbet',
  '888starz': '/bonus-888starz',
}

describe('garde-fou registre bookmakers (refonte 2026-11)', () => {
  it('contient exactement les 4 bookmakers, dans l’ordre de priorité officiel', () => {
    expect(REGISTRY.map(b => b.id)).toEqual(['linebet', '1xbet', 'melbet', '888starz'])
    expect(BOOKMAKER_ORDER).toEqual(['linebet', '1xbet', 'melbet', '888starz'])
  })

  it.each(REGISTRY.map(b => [b.id, b] as const))(
    'code promo exact (casse incluse) pour %s',
    (id, b) => {
      expect(b.promoCode).toBe(EXACT_CODES[id])
      expect(b.promoCodeIsCaps).toBe(b.promoCode !== b.promoCode.toLowerCase() && b.promoCode === b.promoCode.toUpperCase())
      // Le registre constants.ts (utilisé par l'ancien code) reste aligné.
      const legacy = BOOKMAKERS.find(x => x.id === id)
      if (legacy) expect(legacy.promoCode).toBe(EXACT_CODES[id])
    },
  )

  it.each(REGISTRY.map(b => [b.id, b] as const))(
    'liens affiliés https + page code promo valide pour %s',
    (id, b) => {
      expect(b.signup).toMatch(/^https:\/\//)
      expect(b.download).toMatch(/^https:\/\//)
      expect(b.promoPath).toBe(EXPECTED_PAGE[id])
      // Le lien signup du registre est celui d'AFFILIATE quand la clé existe.
      if (id === 'linebet') expect(b.signup).toBe(AFFILIATE.linebet)
      if (id === '888starz') expect(b.signup).toBe(AFFILIATE.star888)
    },
  )

  it('chaque logo référent existe physiquement dans public/logos/', () => {
    for (const b of REGISTRY) {
      const main = readFileSync(`public${b.logo}`)
      expect(main.length).toBeGreaterThan(1000)
      if (b.logoLight) {
        const light = readFileSync(`public${b.logoLight}`)
        expect(light.length).toBeGreaterThan(1000)
      }
    }
  })

  it('Linebet et 1xBet sont les 2 partenaires mis en avant (décision propriétaire)', () => {
    expect(featuredBookmakers().map(b => b.id)).toEqual(['linebet', '1xbet'])
  })

  it('getBookmaker lève sur un identifiant inconnu (pas de fallback silencieux)', () => {
    expect(() => getBookmaker('inconnu' as never)).toThrow()
  })

  it('aucune offre inventée : Melbet n’affiche pas de montant non communiqué', () => {
    const melbet = getBookmaker('melbet')
    expect(melbet.offer.bonus).toBeNull()
    expect(melbet.offer.freeSpins).toBeNull()
  })
})
