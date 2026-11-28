import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'out')

/** Codes exacts, à la casse près. */
const PROMO_FILES: Array<{ file: string; code: string }> = [
  { file: 'src/app/code-promo-1xbet/page.tsx', code: 'vipbtts' },
  { file: 'src/app/code-promo-1xbet/XbetClient.tsx', code: 'vipbtts' },
  { file: 'src/app/code-promo-linebet-senegal/page.tsx', code: 'VISION221' },
  { file: 'src/app/code-promo-linebet-senegal/LinebetClient.tsx', code: 'VISION221' },
  { file: 'src/app/code-promo-melbet/page.tsx', code: 'Bttswin' },
  { file: 'src/app/code-promo-melbet/MelbetClient.tsx', code: 'Bttswin' },
  { file: 'src/app/bonus-888starz/page.tsx', code: 'btts221' },
  { file: 'src/app/bonus-888starz-btts221/page.tsx', code: 'btts221' },
  { file: 'src/app/linebet-promo-code/page.tsx', code: 'VISION221' },
  { file: 'src/app/[locale]/code-promo-1xbet/page.tsx', code: 'vipbtts' },
  { file: 'src/app/[locale]/code-promo-linebet-senegal/page.tsx', code: 'VISION221' },
  { file: 'src/app/[locale]/code-promo-melbet/page.tsx', code: 'Bttswin' },
  { file: 'src/app/[locale]/bonus-888starz/page.tsx', code: 'btts221' },
  { file: 'src/app/[locale]/bonus-888starz-btts221/page.tsx', code: 'btts221' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221' },
]

const PROMO_COPY_FILES = [
  'src/app/code-promo-1xbet/page.tsx',
  'src/app/code-promo-1xbet/XbetClient.tsx',
  'src/app/code-promo-linebet-senegal/page.tsx',
  'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
  'src/app/code-promo-melbet/page.tsx',
  'src/app/code-promo-melbet/MelbetClient.tsx',
  'src/app/bonus-888starz/page.tsx',
  'src/app/bonus-888starz-btts221/page.tsx',
  'src/app/linebet-promo-code/page.tsx',
  'src/app/[locale]/code-promo-1xbet/page.tsx',
  'src/app/[locale]/code-promo-linebet-senegal/page.tsx',
  'src/app/[locale]/code-promo-melbet/page.tsx',
  'src/app/[locale]/bonus-888starz/page.tsx',
  'src/app/[locale]/bonus-888starz-btts221/page.tsx',
  'src/components/bttsbet/LocalizedPromoClient.tsx',
  'src/components/bttsbet/Star888PromoClient.tsx',
  'src/components/bttsbet/PromoLandingShell.tsx',
  'src/components/bttsbet/PromoVerificationGuide.tsx',
  'src/lib/promo-faq.ts',
] as const

const PROMO_SEO_LIMITS = [
  'src/app/code-promo-1xbet/page.tsx',
  'src/app/code-promo-linebet-senegal/page.tsx',
  'src/app/code-promo-melbet/page.tsx',
  'src/app/bonus-888starz/page.tsx',
  'src/app/bonus-888starz-btts221/page.tsx',
] as const

/** Titres réellement rendus, vérifiés après build dans out/. */
const PROMO_EXPORTS: Array<{ html: string; code: string }> = [
  { html: 'code-promo-1xbet.html', code: 'vipbtts' },
  { html: 'code-promo-linebet-senegal.html', code: 'VISION221' },
  { html: 'code-promo-melbet.html', code: 'Bttswin' },
  { html: 'bonus-888starz.html', code: 'btts221' },
  { html: 'bonus-888starz-btts221.html', code: 'btts221' },
  { html: 'en/code-promo-1xbet.html', code: 'vipbtts' },
  { html: 'en/code-promo-linebet-senegal.html', code: 'VISION221' },
  { html: 'en/code-promo-melbet.html', code: 'Bttswin' },
  { html: 'en/bonus-888starz.html', code: 'btts221' },
  { html: 'en/bonus-888starz-btts221.html', code: 'btts221' },
  { html: 'ar/code-promo-1xbet.html', code: 'vipbtts' },
  { html: 'ar/code-promo-linebet-senegal.html', code: 'VISION221' },
  { html: 'ar/code-promo-melbet.html', code: 'Bttswin' },
  { html: 'ar/bonus-888starz.html', code: 'btts221' },
  { html: 'ar/bonus-888starz-btts221.html', code: 'btts221' },
  { html: 'linebet-promo-code.html', code: 'VISION221' },
]

function readTitle(html: string): string | null {
  return html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim() ?? null
}

describe('Titres SEO des pages promo', () => {
  it.each(PROMO_FILES)('$file contient le code exact et une formulation correspondant à une recherche promo', ({ file, code }) => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    expect(source).toContain(code)
    expect(source).toMatch(/Code promo|Promo Code|promo code|رمز|code promo/i)
    expect(source).toMatch(/title|TITLE|<h1/i)
  })

  it('affirme les faits confirmés sans les attribuer au partenaire ni majorer le cashback', () => {
    const source = PROMO_COPY_FILES.map(file => readFileSync(resolve(ROOT, file), 'utf8')).join('\n')
    expect(source).not.toMatch(/partner confirms|partner-confirmed|according to the partner|le partenaire confirme|confirmé par le partenaire|selon le partenaire|يؤكد الشريك|وفقًا للشريك/i)
    expect(source).not.toMatch(/advertised offer|announced offer|offre annoncée|العرض المعلن|extra cashback|more cashback|plus de cashback|davantage de cashback|cashback supérieur|استرداد نقدي إضافي|استرداد نقدي أكبر/i)
  })

  it('vise une audience internationale sans limiter le code au Sénégal et garde son URL historique', () => {
    const page = readFileSync(resolve(ROOT, 'src/app/code-promo-linebet-senegal/page.tsx'), 'utf8')
    const client = readFileSync(resolve(ROOT, 'src/app/code-promo-linebet-senegal/LinebetClient.tsx'), 'utf8')
    expect(page).toContain("const TITLE = 'Code promo Linebet VISION221 : 300 % + cashback'")
    expect(client).toContain('est international, pour les pays où Linebet l’accepte')
    expect(client).toContain('bonus de dépôt mondial de 300 %')
    expect(client).not.toContain('joueurs d’Afrique')
    expect(client).toContain('Vérifiez la disponibilité, l’éligibilité et les modalités auprès de Linebet pour votre pays')
    expect(client).not.toMatch(/réservé(?:e)? au Sénégal|uniquement au Sénégal/i)
    expect(page).toContain("'code promo Linebet Sénégal'")
    expect(page).toContain("const SLUG = 'code-promo-linebet-senegal'")
  })

  it.each(PROMO_SEO_LIMITS)('%s respecte les limites de title et description', file => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    const title = source.match(/const TITLE = '([^']*)'/)?.[1]
    const description = source.match(/const DESCRIPTION = '([^']*)'/)?.[1]
    if (!title || !description) throw new Error(`${file} ne définit pas son title et sa description`)
    expect(title.length).toBeLessThanOrEqual(60)
    expect(description.length).toBeLessThanOrEqual(150)
  })

  const hasExport = existsSync(OUT)
  it.skipIf(!hasExport).each(PROMO_EXPORTS)('le title rendu de $html contient $code', ({ html, code }) => {
    const file = resolve(OUT, html)
    expect(existsSync(file)).toBe(true)
    const title = readTitle(readFileSync(file, 'utf8'))
    expect(title).toBeTruthy()
    expect(title).toContain(code)
  })
})

describe('Routes SEO protégées', () => {
  const baselineFile = resolve(ROOT, 'tests/fixtures/seo-protected-baseline.json')
  const baseline = JSON.parse(readFileSync(baselineFile, 'utf8')) as Record<string, {
    path: string
    title: string | null
    canonical: string | null
  }>

  const hasExport = existsSync(OUT)

  it.each(Object.entries(baseline))('%s conserve son URL, son titre et son canonical', (key, expected) => {
    expect(expected.title).toBeTruthy()
    expect(expected.canonical).toBeTruthy()
    if (!hasExport) return
    const file = resolve(OUT, expected.path.replace(/^\//, ''))
    expect(existsSync(file)).toBe(true)
    const html = readFileSync(file, 'utf8')
    expect(readTitle(html)).toBe(expected.title)
    expect(html.match(/<link rel="canonical" href="(.*?)"/)?.[1].trim() ?? null).toBe(expected.canonical)
    // Aucune page protégée ne doit exposer un code promo dans son title.
    for (const { code } of PROMO_FILES) {
      expect(expected.title).not.toContain(code)
    }
    expect(key).toBeTruthy()
  })
})
