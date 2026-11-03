import { createHash } from 'node:crypto'
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

const PROTECTED_ROUTE_SOURCE_HASHES = {
  '/en/btts-and-over-2-5-predictions-today': ['src/app/[locale]/btts-and-over-2-5-predictions-today/page.tsx', '34c06e41ff61105945bcc4bfa708a86827000f8b595d484b856913d149b69689'],
  '/en': ['src/app/[locale]/page.tsx', '20b38d4e5703745098eec123ae3dca778af7b29aa3f495e824df2e91ae6b013b'],
  '/en/over-2-5/predictions/today': ['src/app/[locale]/over-2-5/predictions/today/page.tsx', '86577a56d83d53b7cf5a2cabca75a1fed756c814ee1fc1866914c263a9324be0'],
  '/': ['src/app/page.tsx', '912e5fa124c67baa41c40f3eb32a7d95d009b2dbc99cceee6ac9f0c5d169254d'],
  '/en/ai-correct-score-predictions': ['src/app/[locale]/ai-correct-score-predictions/page.tsx', '5f356fa7b3be84c98a58aa007d49d139ac0136a5369e1cd9b38163f3ab758c64'],
} as const

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')
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
  it.each(Object.entries(PROTECTED_ROUTE_SOURCE_HASHES))('does not regress %s', (_route, [file, expected]) => {
    expect(sha256(readFileSync(resolve(file), 'utf8'))).toBe(expected)
  })
})
