import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
/** Sources whose rendered promo-code elements must contain only the code itself. */
const CODE_ELEMENT_SOURCES = [
  'src/components/bttsbet/PromoLandingShell.tsx',
  'src/components/bttsbet/Star888PromoClient.tsx',
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
  it.each(CODE_ELEMENT_SOURCES)('%s ne colle aucune ponctuation à un code affiché', file => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    const codeElements = [...source.matchAll(/<code\b[^>]*>([\s\S]*?)<\/code>/g)]
    expect(codeElements.length, `${file} doit rendre le code dans un élément <code>`).toBeGreaterThan(0)
    for (const [, content] of codeElements) {
      const renderedExpression = content.replace(/\{[^}]+\}/g, 'CODE').replace(/<[^>]+>/g, '').trim()
      expect(renderedExpression).not.toMatch(/[.。،]\s*$/)
    }
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
