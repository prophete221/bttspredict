import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import verificationData from '@/data/match-verification-registry.json'
import retainedMatch from '@/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json'
import {
  getDynamicMatchSlugs,
  getLocalizedMatchStaticParams,
  RETAINED_FR_ONLY_MATCH_SLUG,
} from '@/lib/match-page-ssg'
import { MatchVerificationRegistrySchema } from '@/lib/match-verification-registry'
import { getAllMatchSlugs } from '@/lib/matches'
import { translationsFor } from '@/lib/i18n'

const PROTECTED_SEO_ROUTES = [
  {
    route: '/en/btts-and-over-2-5-predictions-today',
    files: [
      ['src/app/[locale]/btts-and-over-2-5-predictions-today/page.tsx', [
        "title: 'BTTS and Over 2.5 Predictions Today'",
        "description: 'Combined BTTS and Over 2.5 predictions for international matches.'",
        "canonical: 'https://bttspredict.com/en/btts-and-over-2-5-predictions-today'",
      ]],
      ['src/components/bttsbet/LocalizedCombinedPredictionsClient.tsx', [
        "title: 'BTTS and Over 2.5 Predictions Today'",
        "title: 'توقعات BTTS وأكثر من 2.5 اليوم'",
        '<AnimatedTitle as="h1" text={c.title}',
        "intro: 'Combined predictions where both teams score and total goals exceed 2.5. Matches must meet both criteria simultaneously.'",
        "intro: 'توقعات مجمعة حيث يسجل الفريقان ويتجاوز إجمالي الأهداف 2.5. يجب أن تحقق المباراة الشرطين معاً.'",
      ]],
    ],
  },
  {
    route: '/en',
    files: [
      ['src/app/[locale]/page.tsx', [
        "const url = `https://bttspredict.com/${locale}`",
        "const title = locale === 'ar' ? 'توقعات BTTS اليوم وأكثر من 2.5' : 'BTTS Predictions Today & Over 2.5'",
        'const description = t.hero.subtitle',
        "languages: { fr: 'https://bttspredict.com/', en: 'https://bttspredict.com/en', ar: 'https://bttspredict.com/ar', 'x-default': 'https://bttspredict.com/' }",
        "openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang.replace('-', '_') }",
      ]],
      ['src/components/bttsbet/Hero.tsx', [
        '<h1 className="hp-hero__title">',
        'plainTitle(t.home2.heroTitle1)',
        'plainTitle(t.home2.heroTitle2)',
        '{t.home2.heroText}',
      ]],
    ],
  },
  {
    route: '/en/over-2-5/predictions/today',
    files: [
      ['src/app/[locale]/over-2-5/predictions/today/page.tsx', [
        "const url = `https://bttspredict.com/${locale}/over-2-5/predictions/today`",
        "const title = locale === 'ar' ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today — Goal Analysis'",
        "description = locale === 'ar' ? 'توقعات أكثر من 2.5 هدف للمباريات الدولية، مع تحليل إحصائي وتحديثات يومية. لا توجد ضمانات للنتائج. 18+.' : 'Over 2.5 goals predictions for international football matches, with statistical analysis and daily updates. No future result is guaranteed. 18+.'",
        "fr: 'https://bttspredict.com/over-2-5/predictions/today'",
        "en: 'https://bttspredict.com/en/over-2-5/predictions/today'",
        "ar: 'https://bttspredict.com/ar/over-2-5/predictions/today'",
        "'x-default': 'https://bttspredict.com/over-2-5/predictions/today'",
        'alternates: { canonical: url, languages:',
        "openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang }",
        "<AnimatedTitle as=\"h1\" text={isAr ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today'}",
        "Today's Over 2.5 predictions: matches where total goals are expected to exceed 2.5, meaning at least 3 goals. Updated and checked after the match.",
        'مباريات يُتوقع أن يتجاوز فيها إجمالي الأهداف 2.5، أي ثلاثة أهداف على الأقل. يتم التحديث والتحقق من النتائج بعد المباراة.',
      ]],
    ],
  },
  {
    route: '/',
    files: [
      ['src/app/page.tsx', [
        'const TITLE = "BTTSPredict — Pronostics BTTS du jour et Over 2,5"',
        'const DESCRIPTION = "Pronostics BTTS du jour sur des matchs internationaux, avec sélections horodatées, historique public et méthode documentée. 18+."',
        "canonical: 'https://bttspredict.com/'",
        "fr: 'https://bttspredict.com/'",
        "en: 'https://bttspredict.com/en'",
        "ar: 'https://bttspredict.com/ar'",
        "'x-default': 'https://bttspredict.com/'",
        'twitter: {',
        "card: 'summary_large_image'",
        '<h2>Plateforme de sélections BTTS, Over 2.5 et score exact</h2>',
        'BTTSPredict aide les parieurs africains à lire des sélections de matchs internationaux :',
        'BTTS, Over 2.5 et projection de score exact. Les données sont publiées avant le match,',
        'les résultats gagnés et perdus sont archivés, et aucun gain futur n&apos;est garanti.',
      ]],
      ['src/components/bttsbet/Hero.tsx', [
        '<h1 className="hp-hero__title">',
        'plainTitle(t.home2.heroTitle1)',
        'plainTitle(t.home2.heroTitle2)',
        '{t.home2.heroText}',
      ]],
    ],
  },
  {
    route: '/en/ai-correct-score-predictions',
    files: [
      ['src/app/[locale]/ai-correct-score-predictions/page.tsx', [
        "const url = `https://bttspredict.com/${locale}/ai-correct-score-predictions`",
        "const title = locale === 'ar' ? 'توقعات النتيجة الدقيقة بالذكاء الاصطناعي ' : 'AI Correct Score Predictions — Exact Scores'",
        "description = locale === 'ar' ? 'احتمالات النتائج الدقيقة المحسوبة بنموذج بواسون. تقديرات إحصائية وليست ضمانات. 18+.' : 'Exact-score probabilities calculated with a Poisson model. Statistical estimates, not guarantees. 18+.'",
        "'fr-SN': 'https://bttspredict.com/ai-correct-score-predictions'",
        "en: 'https://bttspredict.com/en/ai-correct-score-predictions'",
        "ar: 'https://bttspredict.com/ar/ai-correct-score-predictions'",
        "'x-default': 'https://bttspredict.com/ai-correct-score-predictions'",
        'alternates: { canonical: url, languages:',
        "openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang }",
      ]],
      ['src/app/ai-correct-score-predictions/page.tsx', [
        "text={lang === 'fr' ? 'Prédictions de score exact par IA' : lang === 'en' ? 'AI Correct Score Predictions'",
        "'AI Correct Score Predictions' : 'توقعات النتيجة الدقيقة بالذكاء الاصطناعي'",
        'text={lang === \'fr\' ? \'Prédictions de score exact par IA\' : lang === \'en\' ? \'AI Correct Score Predictions\' : \'توقعات النتيجة الدقيقة بالذكاء الاصطناعي\'}',
        'Most likely exact scores computed by our statistical model from each team’s expected goals (xG). The top 5 scorelines are shown per match, ranked by probability.',
        'يحسب نموذجنا الإحصائي النتائج الدقيقة الأكثر احتمالاً من الأهداف المتوقعة لكل فريق. نعرض أفضل خمسة نتائج مرتبة حسب الاحتمال.',
      ]],
    ],
  },
] as const

const sourceContains = (file: string, snippets: readonly string[]) => {
  const source = readFileSync(resolve(file), 'utf8')
  for (const snippet of snippets) {
    expect(source.includes(snippet), `${file} should preserve: ${snippet}`).toBe(true)
  }
}
const sourceSlugs = getAllMatchSlugs()
const dynamicSlugs = getDynamicMatchSlugs(sourceSlugs)

describe('retained West Ham–QPR page', () => {
  it('keeps each existing dynamic slug once and excludes the dedicated slug', () => {
    expect(new Set(sourceSlugs).size).toBe(sourceSlugs.length)
    expect(dynamicSlugs).toEqual(sourceSlugs.filter(slug => slug !== RETAINED_FR_ONLY_MATCH_SLUG))
    expect(dynamicSlugs).not.toContain(RETAINED_FR_ONLY_MATCH_SLUG)
    expect(() => getDynamicMatchSlugs([...sourceSlugs, sourceSlugs[0]])).toThrow(/Duplicate match slug/)
  })

  it('generates exactly one FR URL for the retained slug and no EN/AR parameters', () => {
    const dedicatedPath = `/match/${RETAINED_FR_ONLY_MATCH_SLUG}`
    const frPaths = [...dynamicSlugs.map(slug => `/match/${slug}`), dedicatedPath]
    expect(frPaths.filter(path => path === dedicatedPath)).toHaveLength(1)
    const frGeneratorSource = readFileSync(resolve('src/app/match/[slug]/page.tsx'), 'utf8')
    const localizedGeneratorSource = readFileSync(resolve('src/app/[locale]/match/[slug]/page.tsx'), 'utf8')
    expect(frGeneratorSource).toContain('getDynamicMatchSlugs(getAllMatchSlugs())')
    expect(localizedGeneratorSource).toContain('getLocalizedMatchStaticParams(getAllMatchSlugs(), SUPPORTED_LOCALES)')

    const localized = getLocalizedMatchStaticParams(sourceSlugs, ['en', 'ar'])
    expect(localized.some(param => param.slug === RETAINED_FR_ONLY_MATCH_SLUG)).toBe(false)
    expect(new Set(localized.map(param => `${param.locale}:${param.slug}`)).size).toBe(localized.length)
    expect(localized).toEqual(['en', 'ar'].flatMap(locale =>
      dynamicSlugs.map(slug => ({ locale, slug })),
    ))
    expect(existsSync(resolve('src/app/match', RETAINED_FR_ONLY_MATCH_SLUG, 'page.tsx'))).toBe(true)
  })

  it('preserves the archived snapshot and the source-backed verified result', () => {
    const registry = MatchVerificationRegistrySchema.parse(verificationData)
    const record = registry.records.find(entry => entry.id === retainedMatch.slug)
    expect(record).toMatchObject({
      source: 'ESPN public',
      sourceUrl: 'https://www.espn.com/soccer/match/_/gameId/401880233/queens-park-rangers-west-ham-united',
      status: 'verified',
      result: { homeGoals: 1, awayGoals: 1, display: '1-1' },
      verifiedAt: '2026-10-23T05:42:15.167Z',
      kickoff: { time: '20:00', timeZone: 'Europe/London' },
      snapshot: { time: '19:00', timeZone: null },
      display: { time: '19:00', timeZone: 'Africa/Dakar' },
    })
    expect(retainedMatch.sourceArchiveFiles).toHaveLength(6)
    expect(retainedMatch.snapshotTimeZone).toBeNull()
    expect(retainedMatch.record).toMatchObject({
      dataQuality: 'HIGH', matchCountHome: 8, matchCountAway: 8,
      finalScore: '1-1', status: 'WON', verifiedAt: '2026-10-23T05:42:15.167Z',
    })
    const dedicatedPageSource = readFileSync(
      resolve('src/app/match', RETAINED_FR_ONLY_MATCH_SLUG, 'page.tsx'),
      'utf8',
    )
    expect(dedicatedPageSource).toContain('MatchVerificationRegistrySchema.parse(verificationData)')
    expect(dedicatedPageSource).toContain('{verification.result.display}')
    expect(dedicatedPageSource).toContain('{verification.source}')
    expect(dedicatedPageSource).toContain('{verification.sourceUrl}')
    expect(dedicatedPageSource).not.toContain('{snapshot.finalScore}')
  })
})

describe('five protected SEO routes', () => {
  it.each(PROTECTED_SEO_ROUTES)('preserves URL, title, H1 and SEO copy for $route', ({ files }) => {
    for (const [file, snippets] of files) sourceContains(file, snippets)
  })

  it('keeps the exact localized home title and description text used by metadata and H1', () => {
    const english = translationsFor('en')
    expect(english.home2.heroTitle1).toBe('The [World’s No.1]')
    expect(english.home2.heroTitle2).toBe('BTTS & Over 2.5 Master Platform')
    expect(english.home2.heroText).toBe('Best BTTS, Over 2.5 and surebets picks | Reliable football analysis')
    expect(english.hero.subtitle).toBe('BTTS, Over 2.5 and correct-score analysis, published before kick-off and tracked to the verified result.')

    const french = translationsFor('fr')
    expect(french.home2.heroTitle1).toBe('Plateforme [N°1 Mondiale]')
    expect(french.home2.heroTitle2).toBe('BTTS & Over 2.5 Master')
    expect(french.home2.heroText).toBe('Meilleurs pronostics BTTS, Over 2.5 et surbets | Analyses foot fiables')

    const arabic = translationsFor('ar')
    expect(arabic.home2.heroTitle1).toBe('المنصة [الأولى عالمياً]')
    expect(arabic.home2.heroTitle2).toBe('BTTS و Over 2.5 Master')
    expect(arabic.home2.heroText).toBe('أفضل توقعات BTTS و Over 2.5 والسيربيت | تحليلات كرة قدم موثوقة')
    expect(arabic.hero.subtitle).toBe('تحليلات BTTS وOver 2.5 والنتيجة الدقيقة، تُنشر قبل المباراة وتُتابع حتى النتيجة الموثّقة.')
  })
})
