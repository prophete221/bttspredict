import { getDakarDayDiff, parseDakarDateTime } from './dakar-date'
import { getGeminiPicks, type GeminiPrediction } from './gemini-predictions'
import { localizedPath, type Locale } from './i18n'
import { selectUpcomingGeminiItems } from './match-center-window'

export type CompetitionPageData = {
  slug: string
  name: string
  displayName: Record<Locale, string>
  espnLeague: string
  sourceUrl: string
}
export type CompetitionMatch = {
  id: string
  home: string
  away: string
  league: string
  date: string
  time: string
  kickoffAt: string
  predictions: GeminiPrediction[]
}

const DEFINITIONS = [
  { slug: 'serie-a', name: 'Serie A', displayName: { fr: 'Serie A', en: 'Serie A', ar: 'الدوري الإيطالي' }, espnLeague: 'ita.1' },
  { slug: 'bundesliga', name: 'Bundesliga', displayName: { fr: 'Bundesliga', en: 'Bundesliga', ar: 'الدوري الألماني' }, espnLeague: 'ger.1' },
  { slug: 'eredivisie', name: 'Eredivisie', displayName: { fr: 'Eredivisie', en: 'Eredivisie', ar: 'الدوري الهولندي' }, espnLeague: 'ned.1' },
  { slug: 'ligue-1', name: 'Ligue 1', displayName: { fr: 'Ligue 1', en: 'Ligue 1', ar: 'الدوري الفرنسي' }, espnLeague: 'fra.1' },
  { slug: 'laliga', name: 'LaLiga', displayName: { fr: 'LaLiga', en: 'LaLiga', ar: 'الدوري الإسباني' }, espnLeague: 'esp.1' },
  { slug: 'liga-portugal', name: 'Liga Portugal', displayName: { fr: 'Liga Portugal', en: 'Liga Portugal', ar: 'الدوري البرتغالي' }, espnLeague: 'por.1' },
  { slug: '2-bundesliga', name: '2. Bundesliga', displayName: { fr: '2. Bundesliga', en: '2. Bundesliga', ar: 'الدرجة الألمانية الثانية' }, espnLeague: 'ger.2' },
  { slug: 'jupiler-pro-league', name: 'Jupiler Pro League', displayName: { fr: 'Jupiler Pro League', en: 'Jupiler Pro League', ar: 'الدوري البلجيكي' }, espnLeague: 'bel.1' },
  { slug: 'scottish-premiership', name: 'Scottish Premiership', displayName: { fr: 'Scottish Premiership', en: 'Scottish Premiership', ar: 'الدوري الاسكتلندي' }, espnLeague: 'sco.1' },
  { slug: 'premier-league', name: 'Premier League', displayName: { fr: 'Premier League', en: 'Premier League', ar: 'الدوري الإنجليزي' }, espnLeague: 'eng.1' },
  { slug: 'austrian-bundesliga', name: 'Austrian Bundesliga', displayName: { fr: 'Austrian Bundesliga', en: 'Austrian Bundesliga', ar: 'الدوري النمساوي' }, espnLeague: 'aut.1' },
]
export const COMPETITION_PAGES: CompetitionPageData[] = DEFINITIONS.map(definition => ({
  ...definition,
  sourceUrl: `https://www.espn.com/soccer/schedule/_/league/${definition.espnLeague}`,
}))
export const COMPETITION_SLUGS = COMPETITION_PAGES.map(competition => competition.slug)
export function getCompetitionPage(slug: string): CompetitionPageData | undefined {
  return COMPETITION_PAGES.find(competition => competition.slug === slug)
}

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')
const LEAGUE_ALIASES: Record<string, string> = {
  'primeira liga': 'liga-portugal',
  'portuguese primeira liga': 'liga-portugal',
  'austria bundesliga': 'austrian-bundesliga',
}
export function getCompetitionSlug(league: string): string | undefined {
  const key = normalize(league)
  return COMPETITION_PAGES.find(competition => normalize(competition.name) === key || competition.espnLeague === key)?.slug || LEAGUE_ALIASES[key]
}

/** Read published ESPN-sourced fixtures and validated Gemini outputs only. No prediction calculation. */
export function readCurrentCompetitionFeed(payload: unknown, now = new Date()): {
  lastUpdated: string | null
  matches: Record<string, CompetitionMatch[]>
} {
  const matches: Record<string, CompetitionMatch[]> = Object.fromEntries(COMPETITION_SLUGS.map(slug => [slug, []]))
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !Number.isFinite(now.getTime())) return { lastUpdated: null, matches }
  const feed = payload as Record<string, unknown>
  const lastUpdated = typeof feed.lastUpdated === 'string' && Number.isFinite(Date.parse(feed.lastUpdated)) ? feed.lastUpdated : null
  const raw = Array.isArray(feed.free) ? feed.free : Array.isArray(feed.predictions) ? feed.predictions : []
  const candidates: CompetitionMatch[] = []
  for (const value of raw) {
    if (!value || typeof value !== 'object') continue
    const row = value as Record<string, unknown>
    if (typeof row.dataSource !== 'string' || !/^ESPN(?:_|$)/.test(row.dataSource)) continue
    if (typeof row.home !== 'string' || !row.home.trim() || typeof row.away !== 'string' || !row.away.trim() || typeof row.league !== 'string' || !getCompetitionSlug(row.league)) continue
    if (typeof row.date !== 'string' || typeof row.time !== 'string') continue
    const kickoff = parseDakarDateTime(row.date, row.time)
    if (!kickoff || kickoff.toISOString().slice(0, 10) !== row.date || kickoff.getTime() <= now.getTime()) continue
    const predictions = getGeminiPicks(row)
    if (predictions.length === 0) continue
    candidates.push({
      id: typeof row.id === 'string' ? row.id : `${row.date}|${row.home}|${row.away}|${row.league}`,
      home: row.home.trim(), away: row.away.trim(), league: row.league,
      date: row.date, time: row.time, kickoffAt: kickoff.toISOString(), predictions,
    })
  }
  for (const match of selectUpcomingGeminiItems(candidates, date => getDakarDayDiff(date, now))) {
    const slug = getCompetitionSlug(match.league)
    if (slug) matches[slug].push(match)
  }
  return { lastUpdated, matches }
}

export function formatCompetitionDate(date: string, locale: Locale): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const parsed = new Date(`${date}T12:00:00.000Z`)
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : locale === 'en' ? 'en-GB' : 'ar', { timeZone: 'Africa/Dakar', dateStyle: 'long' }).format(parsed)
}

function metadata(path: string, locale: Locale, title: string, description: string) {
  const canonical = `https://bttspredict.com${localizedPath(path, locale)}`
  return {
    title, description,
    alternates: { canonical, languages: {
      fr: `https://bttspredict.com${localizedPath(path, 'fr')}`,
      en: `https://bttspredict.com${localizedPath(path, 'en')}`,
      ar: `https://bttspredict.com${localizedPath(path, 'ar')}`,
      'x-default': `https://bttspredict.com${localizedPath(path, 'fr')}`,
    } },
    openGraph: { title, description, url: canonical, siteName: 'BTTSPredict', type: 'website' as const },
  }
}
export function competitionMeta(slug: string, locale: Locale) {
  const competition = getCompetitionPage(slug)
  if (!competition) return null
  const name = competition.displayName[locale]
  const title = locale === 'fr' ? `${name} : prochains matchs et sélections` : locale === 'en' ? `${name}: upcoming matches and picks` : `${name}: المباريات المقبلة والاختيارات`
  const description = locale === 'fr' ? `Les prochaines rencontres de ${name} disponibles dans le flux public BTTSPredict. Le calendrier n’est pas exhaustif.` : locale === 'en' ? `Upcoming ${name} matches available in BTTSPredict’s public feed. This is not a complete league schedule.` : `مباريات ${name} المقبلة المتاحة في بيانات BTTSPredict العامة؛ هذا ليس جدولاً كاملاً للبطولة.`
  return metadata(`/competitions/${slug}`, locale, title, description)
}
export function competitionIndexMeta(locale: Locale) {
  const title = locale === 'fr' ? 'Prochains matchs par compétition' : locale === 'en' ? 'Upcoming football matches by competition' : 'مباريات كرة القدم المقبلة حسب البطولة'
  const description = locale === 'fr' ? 'Parcours les prochains matchs disponibles dans le flux public BTTSPredict pour onze compétitions, avec les dates et les liens vers les calendriers ESPN.' : locale === 'en' ? 'Browse upcoming matches in BTTSPredict’s public feed across eleven competitions, with match dates and links to ESPN schedules.' : 'تصفح المباريات المقبلة في بيانات BTTSPredict العامة لإحدى عشرة بطولة، مع التواريخ وروابط جداول ESPN.'
  return metadata('/competitions', locale, title, description)
}
