import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { COMPETITION_PAGES, COMPETITION_SLUGS, competitionMeta, formatCompetitionDate, getCompetitionPage, readCurrentCompetitionFeed } from '@/lib/competition-pages'
import { getGeminiPicks } from '@/lib/gemini-predictions'

const source = JSON.parse(readFileSync('public/predictions.json', 'utf8'))
const feedDate = String(source.date || String(source.lastUpdated || '').slice(0, 10))
function shiftDate(date: string, days: number) {
  const shifted = new Date(`${date}T12:00:00.000Z`)
  shifted.setUTCDate(shifted.getUTCDate() + days)
  return shifted.toISOString().slice(0, 10)
}
const now = new Date(`${feedDate}T12:00:00.000Z`)
const realRow = source.free.find((row: Record<string, unknown>) => row.league === 'Bundesliga' && getGeminiPicks(row).length > 0)

describe('compétitions alimentées par le flux public courant', () => {
  it('expose onze slugs uniques sans ancien snapshot embarqué', () => {
    expect(COMPETITION_PAGES).toHaveLength(11)
    expect(new Set(COMPETITION_SLUGS).size).toBe(11)
    expect(COMPETITION_PAGES.every(page => page.sourceUrl.includes(page.espnLeague))).toBe(true)
    expect(COMPETITION_PAGES.every(page => !('matches' in page))).toBe(true)
  })
  it('reprend les sorties Gemini réelles, y compris au-delà de J+7, sans les recalculer', () => {
    const farFutureRow = { ...realRow, date: shiftDate(feedDate, 20), time: '18:30' }
    const fixtureFeed = { ...source, free: [farFutureRow], predictions: [farFutureRow] }
    const feed = readCurrentCompetitionFeed(fixtureFeed, now)
    expect(feed.lastUpdated).toBe(source.lastUpdated)
    const matches = Object.values(feed.matches).flat()
    expect(matches.length).toBeGreaterThan(0)
    expect(feed.matches.bundesliga.some(match => match.home === realRow.home && match.date === farFutureRow.date)).toBe(true)
    for (const match of matches) {
      expect(Date.parse(match.kickoffAt)).toBeGreaterThan(now.getTime())
      const rows = fixtureFeed.free.filter((row: Record<string, unknown>) => row.home === match.home && row.away === match.away && row.date === match.date)
      for (const pick of match.predictions) expect(rows.flatMap(getGeminiPicks)).toContainEqual(pick)
    }
    expect(feed.matches['liga-portugal']).toEqual([])
    expect(feed.matches['austrian-bundesliga']).toEqual([])
  })
  it('retire le passé, les heures/dates invalides, les abstentions et les sources non ESPN', () => {
    const variants = [
      { ...realRow, date: shiftDate(feedDate, -1) },
      { ...realRow, date: feedDate, time: '11:59' },
      { ...realRow, date: feedDate, time: '12:00' },
      { ...realRow, date: '2026-11-31' },
      { ...realRow, time: '25:00' },
      { ...realRow, ai_abstain: true },
      { ...realRow, dataSource: 'unverified' },
      { ...realRow, home: '' },
    ]
    expect(Object.values(readCurrentCompetitionFeed({ free: variants }, now).matches).flat()).toEqual([])
  })
  it('garde seulement le prochain coup d’envoi du jour à Dakar et retire automatiquement les dates devenues passées', () => {
    expect(readCurrentCompetitionFeed({ free: [{ ...realRow, date: feedDate, time: '12:01' }] }, now).matches.bundesliga).toHaveLength(1)
    expect(Object.values(readCurrentCompetitionFeed(source, new Date(`${shiftDate(feedDate, 30)}T00:00:00Z`)).matches).flat()).toEqual([])
  })
  it('déduplique une même sortie et masque un marché contradictoire au lieu de le choisir', () => {
    expect(readCurrentCompetitionFeed({ free: [realRow, realRow] }, now).matches.bundesliga).toHaveLength(1)
    const conflict = structuredClone(realRow)
    conflict.proba = 0.61
    conflict.predictions[0].proba = 0.61
    expect(getGeminiPicks(conflict)).toHaveLength(1)
    expect(readCurrentCompetitionFeed({ free: [realRow, conflict] }, now).matches.bundesliga).toEqual([])
  })
  it('fournit des métadonnées localisées stables sans compte de matchs périmé', () => {
    for (const locale of ['fr', 'en', 'ar'] as const) {
      expect(competitionMeta('serie-a', locale)?.alternates.canonical).toBe(`https://bttspredict.com${locale === 'fr' ? '' : `/${locale}`}/competitions/serie-a`)
    }
    expect(getCompetitionPage('unknown')).toBeUndefined()
    expect(competitionMeta('unknown', 'fr')).toBeNull()
    expect(formatCompetitionDate('2026-11-31', 'fr')).toBeNull()
    expect(Object.values(readCurrentCompetitionFeed(null, now).matches).flat()).toEqual([])
  })
})
