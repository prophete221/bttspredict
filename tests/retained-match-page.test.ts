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
import { getStaticLocalesForPath } from '@/lib/locale-route-policy'
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
        "alternates: englishOnlyAlternates('/btts-and-over-2-5-predictions-today')",
        "if (locale === 'en') return { title: 'BTTS and Over 2.5 Predictions Today', description: 'Combined BTTS and Over 2.5 predictions for international matches.', alternates: englishOnlyAlternates('/btts-and-over-2-5-predictions-today') }",
        "if (locale !== 'en') notFound()",
      ]],
      ['src/components/bttsbet/LocalizedCombinedPredictionsClient.tsx', [
        "title: 'BTTS and Over 2.5 Predictions Today'",
        "title: 'توقعات BTTS وأكثر من 2.5 اليوم'",
        '<h1>{c.title}</h1>',
        "intro: 'Only matches with a validated public pick for BTTS and another for Over 2.5 are shown. A match with just one of the two picks is excluded.'",
        "intro: 'تظهر فقط المباريات التي لديها اختيار عام موثّق لسوق BTTS واختيار آخر لسوق Over 2.5. تُستبعد المباراة إذا توفر اختيار واحد فقط.'",
      ]],
      ['src/app/btts-and-over-2-5-predictions-today/page.tsx', [
        'A pick is shown only when both market selections pass validation.',
      ]],
    ],
  },
  {
    route: '/en',
    files: [
      ['src/app/[locale]/page.tsx', [
        "const url = `https://bttspredict.com/${locale}`",
        "const title = 'BTTS Predictions Today & Over 2.5'",
        'const description = t.hero.subtitle',
        "languages: { fr: 'https://bttspredict.com/', en: 'https://bttspredict.com/en', 'x-default': 'https://bttspredict.com/' }",
        "openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang.replace('-', '_') }",
      ]],
      ['src/components/bttsbet/Hero.tsx', [
        '<h1 className="hp-hero__title">',
        't.home2.heroTitle1',
        't.home2.heroTitle2',
      ]],
    ],
  },
  {
    route: '/en/over-2-5/predictions/today',
    files: [
      ['src/app/[locale]/over-2-5/predictions/today/page.tsx', [
        "const url = `https://bttspredict.com/${locale}/over-2-5/predictions/today`",
        "const title = 'Over 2.5 Predictions Today — Goal Analysis'",
        "const description = 'Upcoming Over 2.5 picks are shown only after passing the publication checks. No future outcome is guaranteed. 18+.'",
        "fr: 'https://bttspredict.com/over-2-5/predictions/today'",
        "en: 'https://bttspredict.com/en/over-2-5/predictions/today'",
        "'x-default': 'https://bttspredict.com/over-2-5/predictions/today'",
        'alternates: { canonical: url, languages:',
        "openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang }",
        "<AnimatedTitle as=\"h1\" text={isAr ? 'توقعات Over 2.5 اليوم' : 'Over 2.5 Predictions Today'}",
        "Upcoming matches with a validated Over 2.5 pick. Matches without a pick for this market are excluded.",
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
        "'x-default': 'https://bttspredict.com/'",
        'twitter: {',
        "card: 'summary_large_image'",
        '<h2 id="home-platform-summary">Sélections publiques BTTS et Over 2,5, avec résultats vérifiés</h2>',
        'BTTSPredict présente des sélections publiques pour des rencontres internationales.',
        'Les résultats gagnés et perdus sont archivés; les pages d’analyse séparent les pronostics des données',
        'sportives et de la vérification des scores. Aucun résultat futur n&apos;est garanti.',
      ]],
      ['src/components/bttsbet/Hero.tsx', [
        '<h1 className="hp-hero__title">',
        't.home2.heroTitle1',
        't.home2.heroTitle2',
      ]],
    ],
  },
  {
    route: '/en/ai-correct-score-predictions',
    files: [
      ['src/app/[locale]/ai-correct-score-predictions/page.tsx', [
        "const url = `https://bttspredict.com/${locale}/ai-correct-score-predictions`",
        "const title = 'AI Correct Score Predictions — Exact Scores'",
        "const description = 'Correct-score picks appear only after passing the publication checks. No local calculation or Poisson model is used. 18+.'",
        "fr: 'https://bttspredict.com/ai-correct-score-predictions'",
        "en: 'https://bttspredict.com/en/ai-correct-score-predictions'",
        "'x-default': 'https://bttspredict.com/ai-correct-score-predictions'",
        'alternates: { canonical: url, languages:',
        "openGraph: { title, description, url, siteName: 'BTTSPredict', type: 'website', locale: LOCALE_META[locale].htmlLang }",
      ]],
      ['src/app/ai-correct-score-predictions/layout.tsx', [
        "title: 'Pronostics de score exact par IA | BTTSPredict'",
        "description: 'Les scores exacts ne sont publiés que si une sélection passe les contrôles de validation.",
        "canonical: 'https://bttspredict.com/ai-correct-score-predictions'",
      ]],
      ['src/app/ai-correct-score-predictions/page.tsx', [
        "title: 'Prédictions de score exact par IA'",
        "title: 'AI Correct Score Predictions'",
        "message: 'Aucune sélection de score exact validée n’est actuellement publiée. BTTSPredict ne complète pas ce marché avec un calcul local ou un modèle de Poisson.",
        'There is currently no validated correct-score pick in the public selections. BTTSPredict does not fill this market with a local calculation or a Poisson model.',
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

    const locales = getStaticLocalesForPath('/match')
    expect(locales).toEqual(['en'])
    const localized = getLocalizedMatchStaticParams(sourceMatches, locales, TEST_NOW)
    expect(localized.some(param => param.locale === 'fr')).toBe(false)
    expect(localized.every(param => param.locale === 'en')).toBe(true)
    expect(new Set(localized.map(param => `${param.locale}:${param.slug}`)).size).toBe(localized.length)
    expect(localized).toEqual(locales.flatMap(locale =>
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
    const localizedParams = getLocalizedMatchStaticParams(sourceMatches, getStaticLocalesForPath('/match'), TEST_NOW)
    for (const entry of retainedClickedFrMatchPages.matches) {
      const match = retainedData.get(entry.slug)
      expect(entry.sourceArchiveFiles).toContain(entry.recordArchiveFile)
      expect(match).toBeDefined()
      expect(match?.predictions).toEqual([])
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

  it('keeps the exact localized home title and description text used by metadata and H1', () => {
    const english = translationsFor('en')
    expect(english.home2.heroTitle1).toBe('The [World’s No.1]')
    expect(english.home2.heroTitle2).toBe('BTTS & Over 2.5 Master Platform')
    expect(english.home2.heroText).toBe('Best BTTS, Over 2.5 and surebets picks | Reliable football analysis')
    expect(english.hero.subtitle).toBe('BTTS and Over 2.5 picks for upcoming matches, tracked to the verified result.')

    const french = translationsFor('fr')
    expect(french.home2.heroTitle1).toBe('Plateforme [N°1 Mondiale]')
    expect(french.home2.heroTitle2).toBe('BTTS & Over 2.5 Master')
    expect(french.home2.heroText).toBe('Meilleurs pronostics BTTS, Over 2.5 et surbets | Analyses foot fiables')

    const arabic = translationsFor('ar')
    expect(arabic.home2.heroTitle1).toBe('المنصة [الأولى عالمياً]')
    expect(arabic.home2.heroTitle2).toBe('BTTS و Over 2.5 Master')
    expect(arabic.home2.heroText).toBe('أفضل توقعات BTTS و Over 2.5 والسيربيت | تحليلات كرة قدم موثوقة')
    expect(arabic.hero.subtitle).toBe('اختيارات BTTS وOver 2.5 لمباريات قادمة، وتُتابع حتى النتيجة الموثّقة.')
  })
})
