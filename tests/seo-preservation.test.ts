import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

// The owner explicitly freezes SEO and existing titles/URLs at the original 7faa1ff0 revision.
const frozenFiles = {
  'src/lib/seoSchemas.ts': '7444b699bce53a5ec32112791b0350b8a17b1f3de688cca1bf2bb0bdb111d103',
  // Hash mis à jour à la demande du propriétaire (2026-11) : ajout des pages
  // partenaires /code-promo-melbet (code Bttswin) + versions EN/AR des pages
  // /code-promo-1xbet (vipbtts) et /code-promo-melbet — aucune URL existante
  // modifiée ni supprimée.
  'src/app/sitemap.ts': '97dddf701e97cdac9cf4538b241ef3bd9cddfee6d87cc9131ad55b2f886827b5',
  'public/robots.txt': 'b4b9f8f614a1db2b109474b66dad46ae8c981f8f979b4df63beaaf653b61e25b',
  'scripts/submit-indexnow.mjs': 'f427299dae1ca9b41d56506945e91eb55fcd3185d79d2b5077e6a5ae8ffe142d',
}
const frozenMetadata = {
  'src/app/layout.tsx': '00ed1e3d4fe5ad47d253833d6b2d0b31faca98a28e596efa0bf96b6082ceaaf3',
  'src/app/page.tsx': '6f82608137a3ef5c77f5f325fac0a9b29d528c0c886d7e916f4b1631c74dc457',
  'src/app/match/[slug]/page.tsx': 'f9e159cf3c41b1d5d9938d6f5f88c5acc559f9af3a6879d03538a5deb07d706d',
  'src/app/methodologie/page.tsx': '406a3795d7e897bff73c0fa74d5bbd14d28414cbb1040bca19f563fbd88ba434',
}
const hash = (value: string) => createHash('sha256').update(value).digest('hex')
// Hash mis à jour le 2026-11-05 à la demande explicite du propriétaire :
// C corrige la copie xG/λ; D ajoute un résumé global de preuve dynamique et
// clarifie le statut du Score exact en FR/EN/AR. Aucun titre, URL, canonical
// ni libellé de navigation SEO n'est modifié.
// Approved 2026-11-16: normalize only removed non-promo Arabic alternates and
// neutralized publisher/language labels; frozen titles, canonicals and URLs stay intact.
// Owner-approved 2026-11-16: provider names are removed from public-facing copy; internal validation remains unchanged.
// Owner-approved 2026-11-24: heroTitle2 gains a non-breaking space in "Over\u00A02.5"
// (FR/EN/AR) so the phrase never splits across lines on mobile; rendered copy is identical.

describe('owner-requested SEO preservation', () => {
  it.each(Object.entries(frozenFiles))('preserves %s byte for byte', (file, expected) => {
    let source = readFileSync(file, 'utf8')
    // Owner-approved 2026-11-09: only Aviator + eleven competitions + index
    // (39 localized URLs). Everything outside those exact additions stays frozen.
    if (file === 'src/app/sitemap.ts') {
      source = source
        .replace("import { COMPETITION_SLUGS } from '@/lib/competition-pages'\n", '')
        .replace("  '/aviator',\n  '/competitions',\n", '')
        .replace('for (const slug of COMPETITION_SLUGS) LOCALIZED_PATHS.add(`/competitions/${slug}`)\n\n', '')
        .replace("  { path: '/aviator', priority: 0.75, changeFrequency: 'monthly' },\n  { path: '/competitions', priority: 0.8, changeFrequency: 'weekly' },\n  ...COMPETITION_SLUGS.map((slug) => ({ path: `/competitions/${slug}`, priority: 0.75, changeFrequency: 'weekly' as const })),\n", '')
      const guideEntry = "  { path: '/guide-que-signifie-btts', priority: 0.75, changeFrequency: 'monthly' },\n"
      expect(source.split(guideEntry).length - 1).toBe(1)
      source = source.replace(guideEntry, '')

      // The existing BTTS explainer now has a localized FR/EN route pair.
      const localizedGuidePath = "  '/btts-c-est-quoi',\n"
      expect(source.split(localizedGuidePath).length - 1).toBe(1)
      source = source.replace(localizedGuidePath, '')

      // Owner-approved 2026-11-16: keep Arabic only on the five promo routes.
      const arabicImport = "import { ARABIC_PROMO_PATHS } from '@/lib/arabic-promo-routes'\n"
      expect(source.split(arabicImport).length - 1).toBe(1)
      source = source.replace(arabicImport, '')
      const arabicComment = "/**\n * Sitemap FR + EN, avec l’arabe conservé uniquement sur les pages promotionnelles.\n */\n"
      const originalComment = "/**\n * Sitemap complet FR + EN + AR\n * Chaque page localisée a 3 entrées <url> distinctes (fr / en / ar)\n * avec hreflang croisés.\n */\n"
      expect(source.split(arabicComment).length - 1).toBe(1)
      source = source.replace(arabicComment, originalComment)
      const localizedSetComment = '/** Chemins disponibles en français et en anglais (tests + hreflang). */\n'
      const originalLocalizedSetComment = '/** Chemins disponibles en FR + EN + AR (tests + hreflang). */\n'
      expect(source.split(localizedSetComment).length - 1).toBe(1)
      source = source.replace(localizedSetComment, originalLocalizedSetComment)
      const arabicSet = 'const ARABIC_PROMO_PATH_SET = new Set<string>(ARABIC_PROMO_PATHS)\n'
      expect(source.split(arabicSet).length - 1).toBe(1)
      source = source.replace(arabicSet, '')
      const filteredLanguages = "  const languages: Record<string, string> = localized\n    ? { fr, en, ...(ARABIC_PROMO_PATH_SET.has(path) ? { ar } : {}), 'x-default': fr }\n    : { fr, 'x-default': fr }\n"
      const originalLanguages = "  const languages: Record<string, string> = localized\n    ? { fr, en, ar, 'x-default': fr }\n    : { fr, 'x-default': fr }\n"
      expect(source.split(filteredLanguages).length - 1).toBe(1)
      source = source.replace(filteredLanguages, originalLanguages)
      const filteredArabicEntry = "      if (ARABIC_PROMO_PATH_SET.has(page.path)) {\n        out.push(url(page.path, 'ar', page.priority, page.changeFrequency))\n      }\n"
      const originalArabicEntry = "      out.push(url(page.path, 'ar', page.priority, page.changeFrequency))\n"
      expect(source.split(filteredArabicEntry).length - 1).toBe(1)
      source = source.replace(filteredArabicEntry, originalArabicEntry)
    }
    if (file === 'scripts/submit-indexnow.mjs') {
      const guideUrl = "  'https://bttspredict.com/guide-que-signifie-btts',\n"
      expect(source.split(guideUrl).length - 1).toBe(1)
      source = source.replace(guideUrl, '')
      const updatedComment = "// URLs prioritaires à signaler à l'indexation après publication.\n"
      expect(source.split(updatedComment).length - 1).toBe(1)
      source = source.replace(updatedComment, '// URLs à soumettre (25 URLs du sitemap)\n')
    }
    expect(hash(source)).toBe(expected)
  })
  it('keeps the Linebet localized route canonical and indexable while allowing unrestricted promo copy', () => {
    const source = readFileSync('src/app/[locale]/code-promo-linebet-senegal/page.tsx', 'utf8')
    expect(source).toContain("const FR_URL = `${SITE_URL}/${SLUG}`")
    expect(source).toContain("const EN_URL = `${SITE_URL}/en/${SLUG}`")
    expect(source).toContain("const AR_URL = `${SITE_URL}/ar/${SLUG}`")
    expect(source).toContain("canonical: isEnglish ? EN_URL : AR_URL")
    expect(source).toContain("robots: { index: true, follow: true }")
  })

  it('keeps localized Linebet URLs canonical and indexable without freezing promo wording', () => {
    const source = readFileSync('src/app/[locale]/code-promo-linebet-senegal/page.tsx', 'utf8')
    expect(source).toContain("const FR_URL = `${SITE_URL}/${SLUG}`")
    expect(source).toContain("const EN_URL = `${SITE_URL}/en/${SLUG}`")
    expect(source).toContain("const AR_URL = `${SITE_URL}/ar/${SLUG}`")
    expect(source).toContain("canonical: isEnglish ? EN_URL : AR_URL")
    expect(source).toContain("robots: { index: true, follow: true }")
  })
  it.each(Object.entries(frozenMetadata))('preserves titles/canonicals/indexation in %s', (file, expected) => {
    const text = readFileSync(file, 'utf8')
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    let selected = ast.statements.filter(node =>
      (ts.isFunctionDeclaration(node) && node.name?.text === 'generateMetadata') ||
      (ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => declaration.name.getText(ast) === 'metadata')),
    ).map(node => node.getText(ast)).join('\n')
    if (file === 'src/app/layout.tsx') {
      const filtered = "      'en': 'https://bttspredict.com/en',\n      'x-default': 'https://bttspredict.com/',"
      const original = "      'en': 'https://bttspredict.com/en',\n      'ar': 'https://bttspredict.com/ar',\n      'x-default': 'https://bttspredict.com/',"
      expect(selected.split(filtered).length - 1).toBe(1)
      selected = selected.replace(filtered, original)
      const approvedDescription = 'description: "Pronostics BTTS et Over 2,5 sur des matchs internationaux. Sélections vérifiées, historique public et méthode documentée. 18+.",'
      const originalDescription = 'description: "Pronostics BTTS, Over 2,5 et score exact sur des matchs internationaux. Données horodatées, historique public et méthode documentée. 18+.",'
      expect(selected.split(approvedDescription).length - 1).toBe(1)
      selected = selected.replace(approvedDescription, originalDescription)
      const approvedSocialDescription = 'description: "Sélections publiques BTTS et Over 2,5 vérifiées avant publication, avec historique public vérifiable. 18+.",'
      const originalSocialDescription = 'description: "Sélections BTTS, Over 2,5 et score exact sur des matchs internationaux, avec données horodatées et méthode documentée. 18+.",'
      expect(selected.split(approvedSocialDescription).length - 1).toBe(2)
      selected = selected.replaceAll(approvedSocialDescription, originalSocialDescription)
    }
    if (file === 'src/app/page.tsx') {
      const filtered = "      en: 'https://bttspredict.com/en',\n      'x-default': 'https://bttspredict.com/',"
      const original = "      en: 'https://bttspredict.com/en',\n      ar: 'https://bttspredict.com/ar',\n      'x-default': 'https://bttspredict.com/',"
      expect(selected.split(filtered).length - 1).toBe(1)
      selected = selected.replace(filtered, original)
      const filteredOgLocale = "alternateLocale: ['en_US'],"
      expect(selected.split(filteredOgLocale).length - 1).toBe(1)
      selected = selected.replace(filteredOgLocale, "alternateLocale: ['en_US', 'ar_SA'],")
    }
    if (file === 'src/app/match/[slug]/page.tsx') {
      const approvedLogoResolver = 'const match = resolveMatchPageLogos(slug, getMatchBySlug(slug))'
      expect(selected.split(approvedLogoResolver).length - 1).toBe(1)
      selected = selected.replace(approvedLogoResolver, 'const match = getMatchBySlug(slug)')
    }
    if (file === 'src/app/methodologie/page.tsx') {
      const approvedAlternates = "alternates: frEnAlternates('/methodologie', 'fr'),"
      const originalCanonical = "alternates: { canonical: 'https://bttspredict.com/methodologie' },"
      expect(selected.split(approvedAlternates).length - 1).toBe(1)
      selected = selected.replace(approvedAlternates, originalCanonical)
    }
    expect(hash(selected)).toBe(expected)
  })

  it('keeps the local today preview noindex while production remains indexable', () => {
    const source = readFileSync('src/app/btts/predictions/today/page.tsx', 'utf8')
    expect(source).toContain("process.env.NODE_ENV === 'development'")
    expect(source).toContain('{ index: false, follow: false }')
    expect(source).toContain('{ index: true, follow: true }')
  })
})
