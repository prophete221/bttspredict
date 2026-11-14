import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'out')

/** Codes exacts, à la casse près. */
const PROMO_PAGES: Array<{ file: string; code: string; title: string }> = [
  { file: 'src/app/code-promo-1xbet/page.tsx', code: 'vipbtts', title: 'Code promo 1xBet vipbtts : bonus mondial 300 %' },
  { file: 'src/app/code-promo-linebet-senegal/page.tsx', code: 'VISION221', title: 'Code promo Linebet VISION221 : offre mondiale 300 %' },
  { file: 'src/app/code-promo-melbet/page.tsx', code: 'Bttswin', title: 'Code promo Melbet Bttswin : 300 % + cashback' },
  { file: 'src/app/bonus-888starz/page.tsx', code: 'btts221', title: 'Code promo 888Starz btts221 : offre mondiale 300 %' },
  { file: 'src/app/bonus-888starz-btts221/page.tsx', code: 'btts221', title: 'Guide du code 888Starz btts221 : utilisation' },
  { file: 'src/app/[locale]/code-promo-1xbet/page.tsx', code: 'vipbtts', title: '1xBet Promo Code vipbtts: 300% Worldwide Bonus' },
  { file: 'src/app/[locale]/code-promo-linebet-senegal/page.tsx', code: 'VISION221', title: 'Linebet Promo Code VISION221: Worldwide 300% Offer' },
  { file: 'src/app/[locale]/code-promo-melbet/page.tsx', code: 'Bttswin', title: 'Melbet Promo Code Bttswin: 300% + Cashback' },
  { file: 'src/app/[locale]/bonus-888starz/page.tsx', code: 'btts221', title: '888Starz Promo Code btts221: 300% Worldwide Bonus' },
  { file: 'src/app/[locale]/bonus-888starz-btts221/page.tsx', code: 'btts221', title: '888Starz btts221 Promo Code for a 300% Worldwide Bonus' },
  { file: 'src/app/[locale]/code-promo-1xbet/page.tsx', code: 'vipbtts', title: 'رمز 1xBet الترويجي vipbtts: مكافأة عالمية 300%' },
  { file: 'src/app/[locale]/code-promo-linebet-senegal/page.tsx', code: 'VISION221', title: 'رمز Linebet VISION221 الترويجي: عرض عالمي 300%' },
  { file: 'src/app/[locale]/code-promo-melbet/page.tsx', code: 'Bttswin', title: 'رمز Melbet الترويجي Bttswin: 300% واسترداد نقدي' },
  { file: 'src/app/[locale]/bonus-888starz/page.tsx', code: 'btts221', title: 'رمز 888Starz الترويجي btts221: مكافأة عالمية 300%' },
  { file: 'src/app/[locale]/bonus-888starz-btts221/page.tsx', code: 'btts221', title: 'رمز 888Starz btts221 الترويجي وعرض عالمي بنسبة 300%' },
  { file: 'src/app/linebet-promo-code/page.tsx', code: 'VISION221', title: 'Code Promo Linebet VISION221 Sénégal' },
]

const PROMO_H1S: Array<{ file: string; code: string; text: string }> = [
  { file: 'src/app/code-promo-1xbet/XbetClient.tsx', code: 'vipbtts', text: 'Code promo 1xBet vipbtts : bonus de dépôt 300 %' },
  { file: 'src/app/code-promo-linebet-senegal/LinebetClient.tsx', code: 'VISION221', text: 'Code promo Linebet VISION221 : bonus de dépôt 300 %' },
  { file: 'src/app/code-promo-melbet/MelbetClient.tsx', code: 'Bttswin', text: 'Code promo Melbet Bttswin : bonus de dépôt 300 %' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: '1xBet promo code: vipbtts' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'Linebet Promo Code VISION221: 300% Offer' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'Melbet promo code: Bttswin' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: 'رمز 1xBet الترويجي: vipbtts' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'رمز Linebet الترويجي: VISION221' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'رمز Melbet الترويجي: Bttswin' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'Code promo 888Starz : btts221' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: '888Starz promo code: btts221' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'رمز 888Starz الترويجي: btts221' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'Guide du code promo 888Starz : btts221' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: '888Starz code guide: btts221' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'دليل رمز 888Starz الترويجي: btts221' },
]

const PROMO_BODY_COPY: Array<{ file: string; code?: string; text: string }> = [
  { file: 'src/app/code-promo-1xbet/XbetClient.tsx', code: 'vipbtts', text: 'Saisissez vipbtts dans le champ code promo de 1xBet.' },
  { file: 'src/app/code-promo-linebet-senegal/LinebetClient.tsx', code: 'VISION221', text: 'Saisissez VISION221 lors de votre inscription chez Linebet.' },
  { file: 'src/app/code-promo-melbet/MelbetClient.tsx', code: 'Bttswin', text: 'Le code Melbet est Bttswin (B majuscule).' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: 'Enter vipbtts in the 1xBet promo-code field.' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'Linebet promo code VISION221 is listed here; country availability has not been verified.' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'The Melbet code is Bttswin (capital B).' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: 'أدخل vipbtts في خانة الرمز الترويجي لدى 1xBet.' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'أدخل VISION221 عند التسجيل لدى Linebet.' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'رمز Melbet هو Bttswin بحرف B كبير.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'Le code 888Starz est btts221.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'The 888Starz code is btts221.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'رمز 888Starz هو btts221.' },
  { file: 'src/lib/promo-faq.ts', code: 'vipbtts', text: 'Le code promo 1xBet est vipbtts et fonctionne dans le monde entier.' },
  { file: 'src/lib/promo-faq.ts', code: 'VISION221', text: 'Le code VISION221 fonctionne dans le monde entier' },
  { file: 'src/lib/promo-faq.ts', code: 'Bttswin', text: 'Le code promo Melbet est Bttswin et fonctionne dans le monde entier.' },
  { file: 'src/lib/promo-faq.ts', code: 'btts221', text: 'Le code promo 888Starz est btts221 et fonctionne dans le monde entier.' },
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
  it.each(PROMO_PAGES)('le titre source de $file contient le texte attendu et $code', ({ file, code, title }) => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    expect(source).toContain(title)
    expect(title).toContain(code)
  })

  it.each(PROMO_H1S)('le H1 de $file contient le texte attendu et $code', ({ file, code, text }) => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    expect(source).toContain(text)
    expect(text).toContain(code)
  })

  it.each(PROMO_BODY_COPY)('le texte promo visible de $file contient le contenu attendu et $code', ({ file, code, text }) => {
    const source = readFileSync(resolve(ROOT, file), 'utf8')
    expect(source).toContain(text)
    if (code) expect(text).toContain(code)
  })

  it('affirme les faits confirmés sans les attribuer au partenaire ni majorer le cashback', () => {
    const source = PROMO_COPY_FILES.map(file => readFileSync(resolve(ROOT, file), 'utf8')).join('\n')
    expect(source).not.toMatch(/partner confirms|partner-confirmed|according to the partner|le partenaire confirme|confirmé par le partenaire|selon le partenaire|يؤكد الشريك|وفقًا للشريك/i)
    expect(source).not.toMatch(/advertised offer|announced offer|offre annoncée|العرض المعلن|extra cashback|more cashback|plus de cashback|davantage de cashback|cashback supérieur|استرداد نقدي إضافي|استرداد نقدي أكبر/i)
  })

  it('keeps the Linebet FR URL and metadata while asking users to confirm local eligibility', () => {
    const page = readFileSync(resolve(ROOT, 'src/app/code-promo-linebet-senegal/page.tsx'), 'utf8')
    const client = readFileSync(resolve(ROOT, 'src/app/code-promo-linebet-senegal/LinebetClient.tsx'), 'utf8')
    expect(page).toContain("const TITLE = 'Code promo Linebet VISION221 : offre mondiale 300 %'")
    expect(client).toContain('title="Code promo Linebet VISION221 : bonus de dépôt 300 %"')
    expect(client).toContain('Saisissez VISION221 lors de votre inscription chez Linebet.')
    expect(client).toContain('Vérifiez les conditions et la disponibilité auprès de Linebet.')
    expect(client).not.toMatch(/fonctionne dans le monde entier|international, pour les pays/i)
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
