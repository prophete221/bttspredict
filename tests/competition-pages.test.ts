import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { COMPETITION_PAGES, COMPETITION_SLUGS, competitionIndexMeta, competitionMeta, formatCompetitionDate, getCompetitionPage, readCurrentCompetitionFeed } from '@/lib/competition-pages'
import { getGeminiPicks } from '@/lib/gemini-predictions'

const source = JSON.parse(readFileSync('tests/fixtures/competition-feed.json', 'utf8'))
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
  it('préserve canonical et hreflang tout en retirant les mentions techniques des métadonnées', () => {
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const competition = competitionMeta('serie-a', locale)!
      const index = competitionIndexMeta(locale)
      const expectedCompetition = {
        fr: { title: 'Serie A : prochains matchs et sélections', description: 'Les prochaines rencontres de Serie A disponibles dans le flux public BTTSPredict. Le calendrier n’est pas exhaustif.' },
        en: { title: 'Serie A: upcoming matches and picks', description: 'Upcoming Serie A matches available in BTTSPredict’s public feed. This is not a complete league schedule.' },
        ar: { title: 'الدوري الإيطالي: المباريات المقبلة والاختيارات', description: 'مباريات الدوري الإيطالي المقبلة المتاحة في بيانات BTTSPredict العامة؛ هذا ليس جدولاً كاملاً للبطولة.' },
      }[locale]
      const expectedIndex = {
        fr: { title: 'Prochains matchs par compétition', description: 'Parcours les prochains matchs disponibles dans le flux public BTTSPredict pour onze compétitions, avec les dates et les liens vers les calendriers ESPN.' },
        en: { title: 'Upcoming football matches by competition', description: 'Browse upcoming matches in BTTSPredict’s public feed across eleven competitions, with match dates and links to ESPN schedules.' },
        ar: { title: 'مباريات كرة القدم المقبلة حسب البطولة', description: 'تصفح المباريات المقبلة في بيانات BTTSPredict العامة لإحدى عشرة بطولة، مع التواريخ وروابط جداول ESPN.' },
      }[locale]
      expect(competition.title).toBe(expectedCompetition.title)
      expect(competition.description).toBe(expectedCompetition.description)
      expect(index.title).toBe(expectedIndex.title)
      expect(index.description).toBe(expectedIndex.description)
      expect(competition.alternates.canonical).toBe(`https://bttspredict.com${locale === 'fr' ? '' : `/${locale}`}/competitions/serie-a`)
      expect(competition.alternates.languages.fr).toBe('https://bttspredict.com/competitions/serie-a')
      expect(competition.alternates.languages.en).toBe('https://bttspredict.com/en/competitions/serie-a')
      expect(competition.alternates.languages.ar).toBe('https://bttspredict.com/ar/competitions/serie-a')
      expect(competition.alternates.languages['x-default']).toBe('https://bttspredict.com/competitions/serie-a')
      expect(`${competition.title} ${competition.description} ${index.title} ${index.description}`).not.toMatch(/Gemini|Dakar|داكار/i)
    }
    expect(getCompetitionPage('unknown')).toBeUndefined()
    expect(competitionMeta('unknown', 'fr')).toBeNull()
    expect(formatCompetitionDate('2026-11-31', 'fr')).toBeNull()
    expect(Object.values(readCurrentCompetitionFeed(null, now).matches).flat()).toEqual([])
  })
})
