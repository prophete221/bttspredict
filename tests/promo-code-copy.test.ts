import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const CODES = ['vipbtts', 'VISION221', 'Bttswin', 'btts221'] as const

/** Fichiers où la ponctuation collée à un code a été retirée (textes visibles). */
const SOURCES = [
  'src/lib/promo-faq.ts',
  'src/app/code-promo-1xbet/XbetClient.tsx',
  'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
  'src/app/code-promo-melbet/MelbetClient.tsx',
  'src/app/bonus-888starz/Star888Client.tsx',
  'src/components/bttsbet/Star888PromoClient.tsx',
  'src/components/bttsbet/Btts221PromoClient.tsx',
  'src/app/page.tsx',
  'src/app/cgu/page.tsx',
]

/** Handlers de copie : l’argument doit être une variable de code, jamais une phrase. */
const COPY_SOURCES = [
  'src/components/bttsbet/PromoLandingShell.tsx',
  'src/components/bttsbet/Star888PromoClient.tsx',
  'src/components/bttsbet/Btts221PromoClient.tsx',
  'src/components/bttsbet/Navbar.tsx',
  'src/components/bttsbet/HomeEditorial.tsx',
  'src/components/bttsbet/CopyableCode.tsx',
]

describe('Codes promo affichés sans ponctuation accolée', () => {
  it.each(SOURCES)('%s ne colle aucune ponctuation à un code', file => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    const offenders: string[] = []
    for (const code of CODES) {
      // Ponctuation latine, arabe ou idéographique directement après le code.
      const pattern = new RegExp(`${code}[.。،]`, 'g')
      for (const match of source.matchAll(pattern)) {
        const line = source.slice(0, match.index ?? 0).split('\n').length
        offenders.push(`${file}:${line} → ${match[0]}`)
      }
    }
    expect(offenders).toEqual([])
  })
})

describe('Copie presse-papier strictement égale au code', () => {
  it.each(COPY_SOURCES)('%s passe uniquement une valeur de code à la copie', file => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    const calls = [...source.matchAll(/copyTextToClipboard\(([^)]*)\)/g)].map(m => m[1].trim())
    const writeCalls = [...source.matchAll(/clipboard\.writeText\(([^)]*)\)/g)].map(m => m[1].trim())
    const all = [...calls, ...writeCalls]
    // Certaines pages délèguent la copie au shell promo : rien à contrôler ici.
    if (all.length === 0) return
    for (const arg of all) {
      // Un identifiant de code (CODE, p.code, promoCode, code, currentCode…) est accepté.
      expect(arg).toMatch(/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/)
      // Aucune ponctuation ajoutée autour de la valeur copiée.
      expect(arg).not.toMatch(/[`'"+,]/)
    }
  })
})
