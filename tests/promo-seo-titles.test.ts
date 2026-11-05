import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'out')

/** Codes exacts, à la casse près. */
const PROMO_PAGES: Array<{ file: string; code: string }> = [
  { file: 'src/app/code-promo-1xbet/page.tsx', code: 'vipbtts' },
  { file: 'src/app/code-promo-linebet-senegal/page.tsx', code: 'VISION221' },
  { file: 'src/app/code-promo-melbet/page.tsx', code: 'Bttswin' },
  { file: 'src/app/bonus-888starz/page.tsx', code: 'btts221' },
  { file: 'src/app/bonus-888starz-btts221/page.tsx', code: 'btts221' },
  { file: 'src/app/[locale]/code-promo-1xbet/page.tsx', code: 'vipbtts' },
  { file: 'src/app/[locale]/code-promo-linebet-senegal/page.tsx', code: 'VISION221' },
  { file: 'src/app/[locale]/code-promo-melbet/page.tsx', code: 'Bttswin' },
  { file: 'src/app/[locale]/bonus-888starz/page.tsx', code: 'btts221' },
  { file: 'src/app/[locale]/bonus-888starz-btts221/page.tsx', code: 'btts221' },
]

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
]

function readTitle(html: string): string | null {
  return html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim() ?? null
}

describe('Titres SEO des pages promo', () => {
  it.each(PROMO_PAGES)('le titre source de $file contient $code', ({ file, code }) => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    const titles = source.match(/title[^=]*=\s*[^\n]*/g) ?? []
    const candidates = titles.filter(line => line.includes("'") || line.includes('`'))
    expect(candidates.length).toBeGreaterThan(0)
    // Au moins une déclaration de titre localisé contient le code exact.
    expect(candidates.some(line => line.includes(code))).toBe(true)
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
    description: string | null
    canonical: string | null
    hreflang: Array<[string, string]>
  }>

  const hasExport = existsSync(OUT)

  it.each(Object.entries(baseline))('%s conserve title, description, canonical et hreflang', (key, expected) => {
    expect(expected.title).toBeTruthy()
    expect(expected.canonical).toBeTruthy()
    if (!hasExport) return
    const file = resolve(OUT, expected.path.replace(/^\//, ''))
    expect(existsSync(file)).toBe(true)
    const html = readFileSync(file, 'utf8')
    expect(readTitle(html)).toBe(expected.title)
    expect(html.match(/<meta name="description" content="([\s\S]*?)"/)?.[1].trim() ?? null).toBe(expected.description)
    expect(html.match(/<link rel="canonical" href="(.*?)"/)?.[1].trim() ?? null).toBe(expected.canonical)
    const hrefLang = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)]
      .map(match => [match[1], match[2]] as [string, string])
      .sort()
    expect(hrefLang).toEqual(expected.hreflang)
    // Aucune page protégée ne doit exposer un code promo dans son title.
    for (const { code } of PROMO_PAGES) {
      expect(expected.title).not.toContain(code)
    }
    expect(key).toBeTruthy()
  })
})
