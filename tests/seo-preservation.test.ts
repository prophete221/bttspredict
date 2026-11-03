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
  'public/robots.txt': '678a5a55dde4dd3c548f807dca3aa23964e886efc0a65b3b2ce8ff9d34d162a4',
  'scripts/submit-indexnow.mjs': 'f427299dae1ca9b41d56506945e91eb55fcd3185d79d2b5077e6a5ae8ffe142d',
}
const frozenMetadata = {
  'src/app/layout.tsx': '00ed1e3d4fe5ad47d253833d6b2d0b31faca98a28e596efa0bf96b6082ceaaf3',
  'src/app/match/[slug]/page.tsx': 'f9e159cf3c41b1d5d9938d6f5f88c5acc559f9af3a6879d03538a5deb07d706d',
  'src/app/methodologie/page.tsx': '406a3795d7e897bff73c0fa74d5bbd14d28414cbb1040bca19f563fbd88ba434',
}
const hash = (value: string) => createHash('sha256').update(value).digest('hex')
const frozenI18nWithoutPartnerCta = 'b780a4f0bdef63777985cac5fc69b29b2507b2f9a640270b35b044495b4afc18'

describe('owner-requested SEO preservation', () => {
  it.each(Object.entries(frozenFiles))('preserves %s byte for byte', (file, expected) => {
    expect(hash(readFileSync(file, 'utf8'))).toBe(expected)
  })
  it('preserves i18n except the approved Phase 3 partner CTA copy', () => {
    const source = readFileSync('src/lib/i18n.ts', 'utf8')
    let replacedBlocks = 0
    const normalized = source.replace(/^([ \t]*)ptEyebrow:.*\n\1ptText:.*\n\1ptCta:.*$/gm, (_block, indent: string) => {
      replacedBlocks += 1
      return `${indent}ptEyebrow: <PHASE3_PARTNER_COPY>\n${indent}ptText: <PHASE3_PARTNER_COPY>\n${indent}ptCta: <PHASE3_PARTNER_COPY>`
    })
    expect(replacedBlocks).toBe(3)
    expect(hash(normalized)).toBe(frozenI18nWithoutPartnerCta)
  })
  it.each(Object.entries(frozenMetadata))('preserves titles/canonicals/indexation in %s', (file, expected) => {
    const text = readFileSync(file, 'utf8')
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const selected = ast.statements.filter(node =>
      (ts.isFunctionDeclaration(node) && node.name?.text === 'generateMetadata') ||
      (ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => declaration.name.getText(ast) === 'metadata')),
    ).map(node => node.getText(ast)).join('\n')
    expect(hash(selected)).toBe(expected)
  })
})
