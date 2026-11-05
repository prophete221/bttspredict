import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'out')

/** Codes exacts, à la casse près. */
const PROMO_PAGES: Array<{ file: string; code: string; title: string }> = [
  { file: 'src/app/code-promo-1xbet/page.tsx', code: 'vipbtts', title: 'Code promo 1xBet vipbtts : offre mondiale à 300 %' },
  { file: 'src/app/code-promo-linebet-senegal/page.tsx', code: 'VISION221', title: 'Linebet Sénégal : code promo VISION221 et offre à 300 %' },
  { file: 'src/app/code-promo-melbet/page.tsx', code: 'Bttswin', title: 'Code promo Melbet Bttswin : offre mondiale à 300 %' },
  { file: 'src/app/bonus-888starz/page.tsx', code: 'btts221', title: 'Code promo 888Starz btts221 : offre mondiale à 300 %' },
  { file: 'src/app/bonus-888starz-btts221/page.tsx', code: 'btts221', title: '888Starz btts221 : code promo et offre mondiale à 300 %' },
  { file: 'src/app/[locale]/code-promo-1xbet/page.tsx', code: 'vipbtts', title: '1xBet Promo Code vipbtts for a 300% Worldwide Offer' },
  { file: 'src/app/[locale]/code-promo-linebet-senegal/page.tsx', code: 'VISION221', title: 'Linebet Promo Code VISION221 for a 300% Worldwide Offer' },
  { file: 'src/app/[locale]/code-promo-melbet/page.tsx', code: 'Bttswin', title: 'Melbet Promo Code Bttswin for a 300% Worldwide Offer' },
  { file: 'src/app/[locale]/bonus-888starz/page.tsx', code: 'btts221', title: '888Starz Promo Code btts221 for a 300% Worldwide Offer' },
  { file: 'src/app/[locale]/bonus-888starz-btts221/page.tsx', code: 'btts221', title: '888Starz btts221 Promo Code for a 300% Worldwide Bonus' },
  { file: 'src/app/[locale]/code-promo-1xbet/page.tsx', code: 'vipbtts', title: 'رمز 1xBet الترويجي vipbtts لعرض عالمي بنسبة 300%' },
  { file: 'src/app/[locale]/code-promo-linebet-senegal/page.tsx', code: 'VISION221', title: 'رمز Linebet الترويجي VISION221 لعرض عالمي بنسبة 300%' },
  { file: 'src/app/[locale]/code-promo-melbet/page.tsx', code: 'Bttswin', title: 'رمز Melbet الترويجي Bttswin لعرض عالمي بنسبة 300%' },
  { file: 'src/app/[locale]/bonus-888starz/page.tsx', code: 'btts221', title: 'رمز 888Starz الترويجي btts221 لعرض عالمي بنسبة 300%' },
  { file: 'src/app/[locale]/bonus-888starz-btts221/page.tsx', code: 'btts221', title: 'رمز 888Starz btts221 الترويجي وعرض عالمي بنسبة 300%' },
  { file: 'src/app/linebet-promo-code/page.tsx', code: 'VISION221', title: 'Code Promo Linebet VISION221 Sénégal' },
]

const PROMO_H1S: Array<{ file: string; code: string; text: string }> = [
  { file: 'src/app/code-promo-1xbet/XbetClient.tsx', code: 'vipbtts', text: 'Code promo 1xBet vipbtts : offre mondiale à 300 %' },
  { file: 'src/app/code-promo-linebet-senegal/LinebetClient.tsx', code: 'VISION221', text: 'Code promo Linebet Sénégal VISION221 : offre mondiale à 300 %' },
  { file: 'src/app/code-promo-melbet/MelbetClient.tsx', code: 'Bttswin', text: 'Code promo Melbet Bttswin : bonus mondial de 300 %' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: '1xBet Promo Code vipbtts for a 300% Worldwide Offer' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'Linebet Promo Code VISION221 for a 300% Worldwide Offer' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'Melbet Promo Code Bttswin for a 300% Worldwide Offer' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: 'رمز 1xBet الترويجي vipbtts لعرض عالمي بنسبة 300%' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'رمز Linebet الترويجي VISION221 لعرض عالمي بنسبة 300%' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'رمز Melbet الترويجي Bttswin لعرض عالمي بنسبة 300%' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'Code promo 888Starz btts221 pour l’offre mondiale à 300 %' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: '888Starz Promo Code btts221 for a 300% Worldwide Offer' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'رمز 888Starz الترويجي btts221 لعرض عالمي بنسبة 300%' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'Découvrez le code promo 888Starz btts221 et l’offre mondiale à 300 %' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'Explore the 888Starz btts221 Promo Code and 300% Worldwide Offer' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', code: 'btts221', text: 'اكتشف رمز 888Starz الترويجي btts221 والعرض العالمي بنسبة 300%' },
]

const PROMO_BODY_COPY: Array<{ file: string; code?: string; text: string }> = [
  { file: 'src/app/code-promo-1xbet/XbetClient.tsx', code: 'vipbtts', text: 'Découvrez l’offre 1xBet de 300 %, annoncée dans le monde entier, avec le code vipbtts' },
  { file: 'src/app/code-promo-1xbet/XbetClient.tsx', text: 'Plus de cashback et des bonus hebdomadaires' },
  { file: 'src/app/code-promo-linebet-senegal/LinebetClient.tsx', code: 'VISION221', text: 'Retrouvez le code exact VISION221 et les détails de l’offre mondiale de 300 % de Linebet.' },
  { file: 'src/app/code-promo-linebet-senegal/LinebetClient.tsx', text: 'Plus de cashback et des bonus hebdomadaires' },
  { file: 'src/app/code-promo-melbet/MelbetClient.tsx', code: 'Bttswin', text: 'Retrouvez le code exact Bttswin et les informations sur l’offre Melbet de 300 %, annoncée dans le monde entier.' },
  { file: 'src/app/code-promo-melbet/MelbetClient.tsx', text: 'Plus de cashback et des bonus hebdomadaires' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: 'Explore 1xBet’s worldwide 300% offer and the exact code vipbtts' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'Explore Linebet’s worldwide 300% offer and the exact code VISION221' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'Explore Melbet’s worldwide 300% offer and the exact code Bttswin' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'vipbtts', text: 'تعرّف على عرض 1xBet بنسبة 300% المعلن عالميًا، مع الرمز vipbtts' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'VISION221', text: 'تعرّف على عرض Linebet بنسبة 300% المعلن عالميًا، مع الرمز VISION221' },
  { file: 'src/components/bttsbet/LocalizedPromoClient.tsx', code: 'Bttswin', text: 'تعرّف على عرض Melbet بنسبة 300% المعلن عالميًا، مع الرمز Bttswin' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', text: 'Plus de cashback et des bonus hebdomadaires.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', text: 'Extra cashback and weekly bonuses.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', text: 'استرداد نقدي إضافي ومكافآت أسبوعية.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', text: 'Retrouvez le code exact et les détails de l’offre 888Starz annoncée dans le monde entier.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', text: 'Find the exact code and details of 888Starz’s worldwide promotion.' },
  { file: 'src/components/bttsbet/Star888PromoClient.tsx', text: 'تعرّف على الرمز الدقيق وتفاصيل عرض 888Starz المتاح عالميًا.' },
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
