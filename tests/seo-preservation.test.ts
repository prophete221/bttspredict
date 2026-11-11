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
// Hash mis à jour le 2026-11-05 à la demande explicite du propriétaire :
// C corrige la copie xG/λ; D ajoute un résumé global de preuve dynamique et
// clarifie le statut du Score exact en FR/EN/AR. Aucun titre, URL, canonical
// ni libellé de navigation SEO n'est modifié.
const frozenI18nWithoutPartnerCta = '84373fa141fd59d06805058c0a0a6c4cf3f1fa1a21382449006cca99f4581e46'

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
  it('preserves i18n except approved promo copy and the full navigation label', () => {
    const source = readFileSync('src/lib/i18n.ts', 'utf8')
    let replacedBlocks = 0
    let normalizedPartnerCopy = source.replace(/^([ \t]*)ptEyebrow:.*\n\1ptText:.*\n\1ptCta:.*$/gm, (_block, indent: string) => {
      replacedBlocks += 1
      return `${indent}ptEyebrow: <PHASE3_PARTNER_COPY>\n${indent}ptText: <PHASE3_PARTNER_COPY>\n${indent}ptCta: <PHASE3_PARTNER_COPY>`
    })
    normalizedPartnerCopy = normalizedPartnerCopy
      .replace("partnerEyebrow: 'Publicité · Partenaire officiel', partnerJoin: 'Linebet · 300% worldwide · VISION221',", "partnerEyebrow: 'Partenaire officiel', partnerJoin: 'Linebet · Code VISION221',")
      .replace("promoLabel: 'Code promo', bonus: '300% worldwide confirmé sur Linebet',", "promoLabel: 'Code promo', bonus: '300% + 100 free spins* — sans condition de mise, sur Linebet',")
      .replace("partnerCta: 'Ouvrir Linebet · VISION221', partnerCtaShort: 'Ouvrir le guide',", "partnerCta: 'S’inscrire sur Linebet avec VISION221', partnerCtaShort: 'Créer mon compte',")
      .replace("partnerEyebrow: 'Advertisement · Official partner', partnerJoin: 'Linebet · 300% worldwide · VISION221',", "partnerEyebrow: 'Official partner', partnerJoin: 'Linebet · Code VISION221',")
      .replace("promoLabel: 'Promo code', bonus: '300% worldwide confirmed for Linebet',", "promoLabel: 'Promo code', bonus: '300% + 100 free spins* — no wagering requirements, on Linebet',")
      .replace("partnerCta: 'Open Linebet · VISION221', partnerCtaShort: 'Open the guide',", "partnerCta: 'Sign up on Linebet with VISION221', partnerCtaShort: 'Create my account',")
      .replace("partnerEyebrow: 'إعلان · شريك رسمي', partnerJoin: 'Linebet · 300% حول العالم · VISION221',", "partnerEyebrow: 'شريك رسمي', partnerJoin: 'Linebet · الرمز VISION221',")
      .replace("promoLabel: 'الرمز الترويجي', bonus: 'عرض 300% حول العالم مؤكد لـ Linebet',", "promoLabel: 'الرمز الترويجي', bonus: '300% + 100 لفة مجانية* — بدون شروط مراهنة، على Linebet',")
      .replace("partnerCta: 'افتح Linebet · VISION221', partnerCtaShort: 'افتح الدليل',", "partnerCta: 'سجّل على Linebet مع VISION221', partnerCtaShort: 'أنشئ حسابي',")
      .replace("partnerDisclaimer: 'Vérifiez les autres modalités directement auprès de Linebet. 18+.',", "partnerDisclaimer: '*Selon les conditions Linebet. 18+'.")
      .replace("partnerDisclaimer: 'Check additional terms directly with Linebet. 18+.',", "partnerDisclaimer: '*According to Linebet conditions. 18+'.")
      .replace("partnerDisclaimer: 'تحقق من التفاصيل الأخرى مباشرة لدى Linebet. +18.',", "partnerDisclaimer: '*وفقاً لشروط Linebet. 18+'.")
      .replace("convertLabel: 'Étape 1 — Consulter le guide Linebet',", "convertLabel: 'Étape 1 — Active ton bonus',")
      .replace("convertLabel: 'Step 1 — View the Linebet guide',", "convertLabel: 'Step 1 — Activate your bonus',")
      .replace("convertLabel: 'الخطوة 1 — عرض دليل Linebet',", "convertLabel: 'الخطوة 1 — فعّل مكافأتك',")
      .replace("mcKickoff: 'Coup d’envoi', mcTz: 'GMT',", "mcKickoff: 'Coup d’envoi', mcTz: 'GMT · Dakar',")
      .replace("mcKickoff: 'Kick-off', mcTz: 'GMT',", "mcKickoff: 'Kick-off', mcTz: 'GMT · Dakar',")
      .replace("mcKickoff: 'انطلاق المباراة', mcTz: 'GMT',", "mcKickoff: 'انطلاق المباراة', mcTz: 'GMT · داكار',")
    const oldNavCopy = "home: 'Accueil', predictions: 'Pronostics', vip: 'VIP'"
    const approvedNavCopy = "home: 'Accueil', predictions: 'Pronos', vip: 'VIP'"
    expect(normalizedPartnerCopy.split(oldNavCopy).length - 1).toBe(1)
    const normalized = normalizedPartnerCopy.replace(oldNavCopy, approvedNavCopy)
    expect(replacedBlocks).toBe(3)
    expect(hash(normalized)).toBe(frozenI18nWithoutPartnerCta)
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
