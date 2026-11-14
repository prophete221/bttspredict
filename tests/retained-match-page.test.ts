import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import verificationData from '@/data/match-verification-registry.json'
import retainedMatch from '@/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json'
import retainedClickedFrMatchPages from '@/data/retained-clicked-fr-match-pages.json'
import {
  getDynamicMatchSlugs,
  getFrenchMatchStaticParams,
  getLocalizedMatchStaticParams,
} from '@/lib/match-page-ssg'
import { getDakarDateString, getDakarMatchStatus } from '@/lib/dakar-date'
import { MatchVerificationRegistrySchema } from '@/lib/match-verification-registry'
import { generateMatchSlug, getMatchBySlug, loadAllMatches } from '@/lib/matches'
import { translationsFor } from '@/lib/i18n'

const PROTECTED_SEO_ROUTES = [
  {
    route: '/en/btts-and-over-2-5-predictions-today',
    files: [
      ['src/app/[locale]/btts-and-over-2-5-predictions-today/page.tsx', [
        "title: 'BTTS and Over 2.5 Predictions Today'",
        "description: 'Combined BTTS and Over 2.5 predictions for international matches.'",
        "canonical: 'https://bttspredict.com/en/btts-and-over-2-5-predictions-today'",
        "if (locale === 'ar') return { title: 'توقعات BTTS وأكثر من 2.5 اليوم', description: 'توقعات مجمعة للمباريات الدولية.'",
      ]],
      ['src/components/bttsbet/LocalizedCombinedPredictionsClient.tsx', [
        "title: 'BTTS and Over 2.5 Predictions Today'",
        "title: 'توقعات BTTS وأكثر من 2.5 اليوم'",
        '<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">{c.title}</h1>',
        "intro: 'This page lists only matches with both a BTTS selection and an Over 2.5 selection.'",
        "intro: 'تعرض هذه الصفحة المباريات التي تتوفر لها اختيارات BTTS وOver 2.5 معاً.'",
        'FreePredictions marketFilter="combined"',
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
        "<h1 className=\"text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight\">{isAr ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today'}</h1>",
        'Matches with a published Over 2.5 selection (at least three total goals).',
        'مباريات تتوفر لها اختيارات منشورة لسوق Over 2.5 (ثلاثة أهداف على الأقل).',
        'FreePredictions marketFilter="over25"',
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
        '<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">',
        "lang === 'en' ? 'AI Correct Score Predictions'",
        'Score estimates are calculated with a Poisson model using the available recent goal averages for each team. The five highest-ranked scorelines are shown for each match.',
        'تُحسب تقديرات النتائج باستخدام نموذج بواسون ومتوسطات الأهداف الحديثة المتاحة لكل فريق. تُعرض أعلى خمس نتائج لكل مباراة.',
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
const sourceMatches = [...loadAllMatches().values()]
const TEST_NOW = new Date('2026-11-04T10:00:00.000Z')
const dynamicSlugs = getDynamicMatchSlugs(sourceMatches, TEST_NOW)

describe('Match static export cleanup', () => {
  it('keeps today’s finished fixtures for linked details and excludes older finished matches', () => {
    const candidates = [
      { slug: 'yesterday-vs-team-2026-11-03', date: '2026-11-03', time: '19:00' },
      { slug: 'today-finished-vs-team-2026-11-04', date: '2026-11-04', time: '06:00' },
      { slug: 'today-live-vs-team-2026-11-04', date: '2026-11-04', time: '09:00' },
      { slug: 'today-upcoming-vs-team-2026-11-04', date: '2026-11-04', time: '10:00' },
      { slug: 'tomorrow-vs-team-2026-11-05', date: '2026-11-05', time: '10:00' },
      { slug: 'time-unknown-vs-team-2026-11-04', date: '2026-11-04', time: '--:--' },
    ]
    expect(getDakarMatchStatus('2026-11-04', '09:00', TEST_NOW)).toBe('live')
    expect(getDynamicMatchSlugs(candidates, TEST_NOW)).toEqual([
      'today-finished-vs-team-2026-11-04',
      'today-live-vs-team-2026-11-04',
      'today-upcoming-vs-team-2026-11-04',
      'tomorrow-vs-team-2026-11-05',
      'time-unknown-vs-team-2026-11-04',
    ])
  })

  it('keeps current source slugs unique and creates localized params for linked and active matches', () => {
    const sourceSlugs = sourceMatches.map(match => match.slug)
    expect(new Set(sourceSlugs).size).toBe(sourceSlugs.length)
    expect(dynamicSlugs).toEqual(sourceMatches
      .filter(match => match.date === getDakarDateString(TEST_NOW) || getDakarMatchStatus(match.date, match.time, TEST_NOW) !== 'finished')
      .map(match => match.slug))
    expect(() => getDynamicMatchSlugs([...sourceMatches, sourceMatches[0]], TEST_NOW)).toThrow(/Duplicate match slug/)

    const localized = getLocalizedMatchStaticParams(sourceMatches, ['fr', 'en', 'ar'], TEST_NOW)
    expect(localized.some(param => param.locale === 'fr')).toBe(false)
    expect(new Set(localized.map(param => `${param.locale}:${param.slug}`)).size).toBe(localized.length)
    expect(localized).toEqual(['en', 'ar'].flatMap(locale =>
      dynamicSlugs.map(slug => ({ locale, slug })),
    ))
  })

  it('exports all seven click-protected historical URLs in French only with archived source data', () => {
    const retainedSlugs = retainedClickedFrMatchPages.matches.map(entry => entry.slug)
    expect(retainedSlugs).toEqual([
      'barcelona-vs-aston-villa-2026-11-03',
      'lorient-vs-brest-2026-11-02',
      'real-madrid-vs-rb-leipzig-2026-10-21',
      'le-havre-ac-vs-paris-saint-germain-2026-10-30',
      'vfb-stuttgart-vs-borussia-mönchengladbach-2026-10-23',
      'paris-saint-germain-vs-lyon-2026-10-26',
      'grazer-ak-vs-tsv-hartberg-2026-10-30',
    ])
    expect(new Set(retainedSlugs).size).toBe(7)

    const retainedData = loadAllMatches(0, true)
    const frenchParams = getFrenchMatchStaticParams(sourceMatches, retainedSlugs, TEST_NOW)
    const localizedParams = getLocalizedMatchStaticParams(sourceMatches, ['en', 'ar'], TEST_NOW)
    for (const entry of retainedClickedFrMatchPages.matches) {
      const match = retainedData.get(entry.slug)
      expect(entry.sourceArchiveFiles).toContain(entry.recordArchiveFile)
      expect(match).toBeDefined()
      expect(match?.predictions.length).toBeGreaterThan(0)
      expect(generateMatchSlug(match!.home, match!.away, match!.date)).toBe(entry.slug)
      expect(getMatchBySlug(entry.slug)?.slug).toBe(entry.slug)
      expect(frenchParams).toContainEqual({ slug: entry.slug })
      expect(localizedParams.some(param => param.slug === entry.slug)).toBe(false)
    }
  })

  it('does not export the separately retained West Ham–QPR page but keeps its verified archive data', () => {
    expect(getDynamicMatchSlugs([
      { slug: retainedMatch.slug, date: '2026-10-09', time: '19:00' },
    ], TEST_NOW)).toEqual([])
    expect(existsSync(resolve('src/app/match', retainedMatch.slug, 'page.tsx'))).toBe(false)

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
  })
})

describe('five protected SEO routes', () => {
  it.each(PROTECTED_SEO_ROUTES)('preserves URL, title, H1 and SEO copy for $route', ({ files }) => {
    for (const [file, snippets] of files) sourceContains(file, snippets)
  })

  it('keeps accurate localized home H1s and the original descriptions used by metadata', () => {
    const english = translationsFor('en')
    expect(english.home2.heroTitle1).toBe('BTTS & Over 2.5 Predictions')
    expect(english.home2.heroTitle2).toBe('Football Analytics')
    expect(english.home2.heroText).toBe('BTTS and Over 2.5 selections based on the available match data.')
    expect(english.hero.subtitle).toBe('BTTS, Over 2.5 and correct-score analysis, published before kick-off and tracked to the verified result.')

    const french = translationsFor('fr')
    expect(french.home2.heroTitle1).toBe('Pronostics BTTS et Over 2,5')
    expect(french.home2.heroTitle2).toBe('Analyse footballistique')
    expect(french.home2.heroText).toBe('Des sélections BTTS et Over 2,5 à partir des données disponibles sur chaque match.')
    expect(french.hero.subtitle).toBe('Analyses BTTS, Over 2,5 et score exact, publiées avant le match et suivies jusqu’au résultat vérifié.')

    const arabic = translationsFor('ar')
    expect(arabic.home2.heroTitle1).toBe('توقعات BTTS وOver 2.5')
    expect(arabic.home2.heroTitle2).toBe('تحليل كرة القدم')
    expect(arabic.home2.heroText).toBe('اختيارات BTTS وOver 2.5 اعتماداً على البيانات المتاحة لكل مباراة.')
    expect(arabic.hero.subtitle).toBe('تحليلات BTTS وOver 2.5 والنتيجة الدقيقة، تُنشر قبل المباراة وتُتابع حتى النتيجة الموثّقة.')

    for (const text of [english.home2.heroTitle1, english.home2.heroText, french.home2.heroTitle1, french.home2.heroText, arabic.home2.heroTitle1, arabic.home2.heroText]) {
      expect(text).not.toMatch(/world.?s no\.? ?1|n°\s*1|الأولى عالمياً|surebets|surbets|مضمونة/i)
    }
  })

  it('keeps the verified-results integrity promise and public predictions feed', () => {
    sourceContains('src/app/resultats-verifies/ResultatsLocalizedShell.tsx', [
      "title: 'Verified prediction results'",
      'No prediction is modified or deleted after publication.',
      'FreePredictions',
    ])
  })

  it('keeps strategic statistics H1s and the BTTS predictions feed', () => {
    sourceContains('src/app/btts/statistics/page.tsx', ['<h1 className=', 'Statistiques BTTS par ligue', '<FreePredictions />'])
    sourceContains('src/app/over-2-5/statistics/page.tsx', ['Over 2.5 Statistics by League'])
  })

  it('keeps the methodology page connected to published predictions', () => {
    sourceContains('src/app/methodologie/LocalizedMethodologieClient.tsx', ['<FreePredictions />'])
  })
})
