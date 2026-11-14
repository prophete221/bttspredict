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
  'src/app/[locale]/code-promo-linebet-senegal/page.tsx': 'f801177e4b82c5bba4f3fb7e2072bf8bb74ab4605d3cfb7d6d9d98d79098e97a',
  'src/app/match/[slug]/page.tsx': 'f9e159cf3c41b1d5d9938d6f5f88c5acc559f9af3a6879d03538a5deb07d706d',
  'src/app/methodologie/page.tsx': '406a3795d7e897bff73c0fa74d5bbd14d28414cbb1040bca19f563fbd88ba434',
}
const hash = (value: string) => createHash('sha256').update(value).digest('hex')

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
  it('preserves the homepage SEO descriptions and core BTTS/Over 2.5 terms in each locale', () => {
    const source = readFileSync('src/lib/i18n.ts', 'utf8')
    for (const phrase of [
      "heroTitle1: 'Pronostics BTTS et Over 2,5'",
      "heroText: 'Des sélections BTTS et Over 2,5 à partir des données disponibles sur chaque match.'",
      "subtitle: 'Analyses BTTS, Over 2,5 et score exact, publiées avant le match et suivies jusqu’au résultat vérifié.'",
      "heroTitle1: 'BTTS & Over 2.5 Predictions'",
      "heroText: 'BTTS and Over 2.5 selections based on the available match data.'",
      "subtitle: 'BTTS, Over 2.5 and correct-score analysis, published before kick-off and tracked to the verified result.'",
      "heroTitle1: 'توقعات BTTS وOver 2.5'",
      "heroText: 'اختيارات BTTS وOver 2.5 اعتماداً على البيانات المتاحة لكل مباراة.'",
      "subtitle: 'تحليلات BTTS وOver 2.5 والنتيجة الدقيقة، تُنشر قبل المباراة وتُتابع حتى النتيجة الموثّقة.'",
    ]) {
      expect(source).toContain(phrase)
    }
    expect(source).not.toMatch(/World’s No\.1|N°1 Mondiale|الأولى عالمياً|surebets picks/i)
  })
  it.each(Object.entries(frozenMetadata))('preserves titles/canonicals/indexation in %s', (file, expected) => {
    const text = readFileSync(file, 'utf8')
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    let selected = ast.statements.filter(node =>
      (ts.isFunctionDeclaration(node) && node.name?.text === 'generateMetadata') ||
      (ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => declaration.name.getText(ast) === 'metadata')),
    ).map(node => node.getText(ast)).join('\n')
    if (file === 'src/app/match/[slug]/page.tsx') {
      const approvedLogoResolver = 'const match = resolveMatchPageLogos(slug, getMatchBySlug(slug))'
      expect(selected.split(approvedLogoResolver).length - 1).toBe(1)
      selected = selected.replace(approvedLogoResolver, 'const match = getMatchBySlug(slug)')
    }
    if (file === 'src/app/[locale]/code-promo-linebet-senegal/page.tsx') {
      const approvedDescription = "'Linebet code VISION221 is listed here; country availability is unverified. The offer includes a 300% deposit bonus, cashback and weekly bonuses. 18+.'"
      const originalDescription = "'Linebet code VISION221 works worldwide. The offer includes a 300% deposit bonus, cashback and weekly bonuses. 18+.'"
      expect(selected.split(approvedDescription).length - 1).toBe(1)
      selected = selected.replace(approvedDescription, originalDescription)
    }
    expect(hash(selected)).toBe(expected)
  })
})
