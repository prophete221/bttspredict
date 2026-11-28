import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'out')

/** Exact affiliate codes must remain correct; editorial wording is intentionally not frozen. */
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

describe('Promo page integrity', () => {
  it.each(PROMO_FILES)('$file retains the exact affiliate code', ({ file, code }) => {
    expect(readFileSync(resolve(ROOT, file), 'utf8')).toContain(code)
  })

  it('does not invent unconfirmed bonus terms or claim partner verification', () => {
    const source = PROMO_COPY_FILES.map(file => readFileSync(resolve(ROOT, file), 'utf8')).join('\n')
    expect(source).not.toMatch(/partner confirms|partner-confirmed|according to the partner|le partenaire confirme|confirmé par le partenaire|selon le partenaire|يؤكد الشريك|وفقًا للشريك/i)
    expect(source).not.toMatch(/100\s*free spins|100\s*لفة مجانية|no wagering requirements|sans condition de mise|بدون شروط مراهنة|first deposit|premier dépôt|dépôt de 1\s*€/i)
  })

  it('keeps the historic Linebet route and does not restrict the code to Senegal', () => {
    const page = readFileSync(resolve(ROOT, 'src/app/code-promo-linebet-senegal/page.tsx'), 'utf8')
    const client = readFileSync(resolve(ROOT, 'src/app/code-promo-linebet-senegal/LinebetClient.tsx'), 'utf8')
    expect(page).toContain("const SLUG = 'code-promo-linebet-senegal'")
    expect(client).not.toMatch(/réservé(?:e)? au Sénégal|uniquement au Sénégal/i)
  })

  it('keeps the affiliate disclosure visible on all promo clients', () => {
    const files = [
      'src/app/code-promo-1xbet/XbetClient.tsx',
      'src/app/code-promo-melbet/MelbetClient.tsx',
      'src/app/code-promo-linebet-senegal/LinebetClient.tsx',
      'src/components/bttsbet/Star888PromoClient.tsx',
    ]
    for (const file of files) {
      const source = readFileSync(resolve(ROOT, file), 'utf8')
      expect(source).toMatch(/affiliateDisclosure|data-affiliate-disclosure/)
    }
  })
})

describe('Routes SEO protégées hors pages promotionnelles', () => {
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
    expect(html.match(/<title>([\s\S]*?)<\/title>/)?.[1].trim() ?? null).toBe(expected.title)
    expect(html.match(/<link rel="canonical" href="(.*?)"/)?.[1].trim() ?? null).toBe(expected.canonical)
    expect(key).toBeTruthy()
  })
})
