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
// Approved 2026-11-16: normalize only removed non-promo Arabic alternates and
// neutralized publisher/language labels; frozen titles, canonicals and URLs stay intact.
// Owner-approved 2026-11-16: provider names are removed from public-facing copy; internal validation remains unchanged.
// Owner-approved 2026-11-24: heroTitle2 gains a non-breaking space in "Over\u00A02.5"
// (FR/EN/AR) so the phrase never splits across lines on mobile; rendered copy is identical.
const frozenI18nWithoutPartnerCta = '0cd62856dd08eba360808d5b2ed218b73db70e4a998a01733163c92956f47ece'

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
  it('preserves i18n except approved promo and factual Gemini-copy corrections', () => {
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
      .replace("pil3T: 'Analyse structurée', pil3D: 'Contexte des équipes, statistiques observées et sélections publiques.',", "pil3T: 'Analyse structurée', pil3D: 'Forme récente, buts marqués et encaissés, BTTS et buts attendus (λ) modélisés selon disponibilité.',")
      .replace("met2T: 'Validation Gemini', met2D: 'Le flux Gemini fournit les sélections; le site ne les recalcule pas localement.',", "met2T: 'Modélisation', met2D: 'Projection statistique basée sur les données récentes.',")
      .replace("met3T: 'Sélection', met3D: 'Seules les sélections BTTS ou Over 2,5 validées par Gemini sont publiées.',", "met3T: 'Sélection', met3D: 'Identification des signaux compatibles avec BTTS, Over 2,5 ou score exact.',")
      .replace("metNote: 'Les sélections restent incertaines; aucun résultat futur n’est garanti.',", "metNote: 'Un modèle statistique réduit l’arbitraire, mais ne supprime jamais l’incertitude du football.',")
      .replace("ftTagline: 'BTTSPredict publie des sélections BTTS et Over 2,5 validées par Gemini, avec un historique public vérifiable.',", "ftTagline: 'BTTSPredict analyse les matchs de football à partir de données, de modèles statistiques et d’un historique public vérifiable.',")
      .replace("subtitle: 'Sélections BTTS et Over 2,5, publiées avant le match et suivies jusqu’au résultat vérifié.',", "subtitle: 'Analyses BTTS, Over 2,5 et score exact, publiées avant le match et suivies jusqu’au résultat vérifié.',")
      .replace("liveData: 'Pronos du jour', timezone: 'GMT',", "liveData: 'Pronos du jour', timezone: 'Africa/Dakar',")
      .replace("met2T: 'Gemini validation', met2D: 'The Gemini feed supplies the picks; the site does not recalculate them locally.',", "met2T: 'Modelling', met2D: 'Statistical projection based on recent data.',")
      .replace("met3T: 'Selection', met3D: 'Only BTTS or Over 2.5 picks validated by Gemini are published.',", "met3T: 'Selection', met3D: 'Identifying signals compatible with BTTS, Over 2.5 or exact score.',")
      .replace("metNote: 'Picks remain uncertain; no future result is guaranteed.',", "metNote: 'A statistical model reduces arbitrariness, but never removes football’s uncertainty.',")
      .replace("ftTagline: 'BTTSPredict publishes Gemini-validated BTTS and Over 2.5 picks with a publicly verifiable history.',", "ftTagline: 'BTTSPredict analyses football matches using data, statistical models and a publicly verifiable history.',")
      .replace("subtitle: 'BTTS and Over 2.5 picks, published before kick-off and tracked to the verified result.',", "subtitle: 'BTTS, Over 2.5 and correct-score analysis, published before kick-off and tracked to the verified result.',")
      .replace("liveData: 'Today’s picks', timezone: 'GMT',", "liveData: 'Today’s picks', timezone: 'Africa/Dakar',")
      .replace("met2T: 'تحقق Gemini', met2D: 'يوفر تدفق Gemini الاختيارات؛ ولا يعيد الموقع حسابها محلياً.',", "met2T: 'النمذجة', met2D: 'إسقاط إحصائي مبني على البيانات الأخيرة.',")
      .replace("met3T: 'الاختيار', met3D: 'لا تُنشر إلا اختيارات BTTS أو Over 2.5 التي تحقق منها Gemini.',", "met3T: 'الاختيار', met3D: 'تحديد الإشارات المتوافقة مع BTTS أو Over 2.5 أو النتيجة الدقيقة.',")
      .replace("metNote: 'تبقى الاختيارات غير مؤكدة؛ ولا توجد نتيجة مستقبلية مضمونة.',", "metNote: 'النموذج الإحصائي يقلّص العشوائية لكنه لا يلغي أبداً عدم تأكد كرة القدم.',")
      .replace("ftTagline: 'ينشر BTTSPredict اختيارات BTTS وOver 2.5 التي تحقق منها Gemini، مع سجل عام قابل للتحقق.',", "ftTagline: 'يحلّل BTTSPredict مباريات كرة القدم اعتماداً على البيانات والنماذج الإحصائية وسجل عام قابل للتحقق.',")
      .replace("subtitle: 'اختيارات BTTS وOver 2.5، تُنشر قبل المباراة وتُتابع حتى النتيجة الموثّقة.',", "subtitle: 'تحليلات BTTS وOver 2.5 والنتيجة الدقيقة، تُنشر قبل المباراة وتُتابع حتى النتيجة الموثّقة.',")
      .replace("liveData: 'توقعات اليوم', timezone: 'GMT',", "liveData: 'توقعات اليوم', timezone: 'Africa/Dakar',")
      .replace("htmlLang: 'fr', direction: 'ltr'", "htmlLang: 'fr-SN', direction: 'ltr'")
      .replace("publisher: 'Éditeur : BTTSPredict'", "publisher: 'Éditeur : BTTSPredict · Dakar, Sénégal'")
      .replace("publisher: 'Publisher: BTTSPredict'", "publisher: 'Publisher: BTTSPredict · Dakar, Senegal'")
      .replace("publisher: 'الناشر: BTTSPredict'", "publisher: 'الناشر: BTTSPredict · داكار، السنغال'")
      .replace("mcSignal: 'Sélection Gemini'", "mcSignal: 'Signal du modèle'")
      .replace("trust3: 'Sélections Gemini validées'", "trust3: 'Modèle statistique + données ESPN'")
      .replace("aiPick: 'Sélection Gemini'", "aiPick: 'Notre lecture du match'")
      .replace("mcSignal: 'Gemini pick'", "mcSignal: 'Model signal'")
      .replace("pil3T: 'Structured analysis', pil3D: 'Team context and observed statistics are shown separately from validated public Gemini picks.'", "pil3T: 'Structured analysis', pil3D: 'Recent form, goals scored and conceded, BTTS and expected goals (λ) modelled from available data.'")
      .replace("trust3: 'Validated Gemini picks'", "trust3: 'Statistical model + ESPN data'")
      .replace("aiPick: 'Gemini pick'", "aiPick: 'Our match analysis'")
      .replace("a: 'BTTS means that both teams score at least one goal. BTTSPredict publishes a public BTTS pick only when it comes from the Gemini feed and passes validation; no result is guaranteed.'", "a: 'BTTS means that both teams score at least one goal. It is a statistical estimate, never a guarantee.'")
      .replace("mcSignal: 'اختيار Gemini'", "mcSignal: 'إشارة النموذج'")
      .replace("pil3T: 'تحليل مُهيكل', pil3D: 'يُعرض سياق الفريق والإحصاءات المتاحة بصورة منفصلة عن اختيارات Gemini العامة التي اجتازت التحقق.'", "pil3T: 'تحليل مُهيكل', pil3D: 'اللياقة الحديثة، الأهداف المسجلة والمستقبلة، BTTS والأهداف المتوقعة (λ) المحسوبة حسب البيانات المتاحة.'")
      .replace("trust3: 'اختيارات Gemini موثّقة'", "trust3: 'نموذج إحصائي + بيانات ESPN'")
      .replace("aiPick: 'اختيار Gemini'", "aiPick: 'تحليلنا للمباراة'")
      .replace("a: 'يعني BTTS أن يسجل كلا الفريقين هدفاً واحداً على الأقل. لا يظهر اختيار BTTS العام في BTTSPredict إلا إذا ورد في تدفق Gemini واجتاز التحقق؛ ولا توجد نتيجة مضمونة.'", "a: 'يعني BTTS أن يسجل كلا الفريقين هدفاً واحداً على الأقل. إنه تقدير إحصائي وليس ضماناً.'")
      .replace("mcSubtitle: 'Sélections Gemini pour les matchs à venir.'", "mcSubtitle: 'Sélections disponibles, publiées avant le coup d’envoi.'")
      .replace("mcSubtitle: 'Validated Gemini picks for upcoming matches.'", "mcSubtitle: 'Available selections, published before kick-off.'")
      .replace("mcSubtitle: 'اختيارات Gemini لمباريات قادمة.'", "mcSubtitle: 'توقعات متاحة، تُنشر قبل انطلاق المباراة.'")
      .replace("mcPublished: 'Horodatage de publication non enregistré'", "mcPublished: 'Publié avant le coup d’envoi'")
      .replace("mcPublished: 'Publication timestamp not recorded'", "mcPublished: 'Published before kick-off'")
      .replace("mcPublished: 'وقت النشر غير مسجل'", "mcPublished: 'نُشر قبل انطلاق المباراة'")
      .replace("pil1T: 'Sélections pour les matchs à venir', pil1D: 'Les sélections portent sur des matchs à venir; l’heure de publication n’est pas enregistrée par pronostic.'", "pil1T: 'Publication avant match', pil1D: 'Chaque sélection est visible avant le coup d’envoi.'")
      .replace("pil1T: 'Picks for upcoming matches', pil1D: 'Picks are shown for upcoming matches; their publication time is not recorded per pick.'", "pil1T: 'Pre-match publication', pil1D: 'Every selection is visible before kick-off.'")
      .replace("pil1T: 'اختيارات لمباريات قادمة', pil1D: 'تُعرض الاختيارات لمباريات قادمة؛ ولا يُسجل وقت نشر كل اختيار.'", "pil1T: 'نشر قبل المباراة', pil1D: 'كل توقيت يصبح مرئياً قبل الانطلاق.'")
      .replace("subtitle: 'Sélections BTTS et Over 2,5 pour les matchs à venir, suivies jusqu’au résultat vérifié.'", "subtitle: 'Analyses BTTS, Over 2,5 et score exact, publiées avant le match et suivies jusqu’au résultat vérifié.'")
      .replace("subtitle: 'BTTS and Over 2.5 picks for upcoming matches, tracked to the verified result.'", "subtitle: 'BTTS, Over 2.5 and correct-score analysis, published before kick-off and tracked to the verified result.'")
      .replace("subtitle: 'اختيارات BTTS وOver 2.5 لمباريات قادمة، وتُتابع حتى النتيجة الموثّقة.'", "subtitle: 'تحليلات BTTS وOver 2.5 والنتيجة الدقيقة، تُنشر قبل المباراة وتُتابع حتى النتيجة الموثّقة.'")
      .replace("trust1: 'Pronos pour des matchs à venir'", "trust1: 'Pronos publiés avant le match'")
      .replace("trust1: 'Picks for upcoming matches'", "trust1: 'Picks published before kick-off'")
      .replace("trust1: 'توقعات لمباريات قادمة'", "trust1: 'توقعات منشورة قبل المباراة'")
    const oldNavCopy = "home: 'Accueil', predictions: 'Pronostics', vip: 'VIP'"
    const approvedNavCopy = "home: 'Accueil', predictions: 'Pronos', vip: 'VIP'"
    expect(normalizedPartnerCopy.split(oldNavCopy).length - 1).toBe(1)
    const normalized = normalizedPartnerCopy.replace(oldNavCopy, approvedNavCopy)
    expect(replacedBlocks).toBe(3)
    expect(hash(normalized)).toBe(frozenI18nWithoutPartnerCta)
  })
  it('keeps the Linebet localized route canonical and indexable while allowing promo title optimization', () => {\n    const source = readFileSync('src/app/[locale]/code-promo-linebet-senegal/page.tsx', 'utf8')\n    expect(source).toContain("const FR_URL = `${SITE_URL}/${SLUG}`")\n    expect(source).toContain("const EN_URL = `${SITE_URL}/en/${SLUG}`")\n    expect(source).toContain("const AR_URL = `${SITE_URL}/ar/${SLUG}`")\n    expect(source).toContain("canonical: isEnglish ? EN_URL : AR_URL")\n    expect(source).toContain("robots: { index: true, follow: true }")\n  })\n\n  it.each(Object.entries(frozenMetadata))('preserves titles/canonicals/indexation in %s', (file, expected) => {
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
    if (file === 'src/app/[locale]/code-promo-linebet-senegal/page.tsx') {
      const approvedDescription = "'Linebet promo code VISION221: worldwide 300% deposit bonus, cashback and weekly bonuses. Check local terms with Linebet. 18+.'"
      const originalDescription = "'Linebet code VISION221 works worldwide. The offer includes a 300% deposit bonus, cashback and weekly bonuses. 18+.'"
      expect(selected.split(approvedDescription).length - 1).toBe(1)
      selected = selected.replace(approvedDescription, originalDescription)
      const approvedSocialMetadata = "    openGraph: {\n      title,\n      description,\n      url: isEnglish ? EN_URL : AR_URL,\n      siteName: 'BTTSPredict',\n      type: 'article',\n      locale: isEnglish ? 'en_US' : 'ar',\n      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],\n    },\n    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },\n"
      expect(selected.split(approvedSocialMetadata).length - 1).toBe(1)
      selected = selected.replace(approvedSocialMetadata, '')
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
