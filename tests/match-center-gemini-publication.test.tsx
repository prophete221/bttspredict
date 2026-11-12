import { readFileSync } from 'node:fs'
import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MatchCenter from '@/components/bttsbet/MatchCenter'
import { getDakarDateString, getDakarDayDiff } from '@/lib/dakar-date'
import { GEMINI_MODEL_ID, getGeminiPicks } from '@/lib/gemini-predictions'
import { generateMatchSlug } from '@/lib/match-slug'
import { getDynamicMatchSlugs } from '@/lib/match-page-ssg'
import { loadAllMatches } from '@/lib/matches'
import { selectUpcomingGeminiItems } from '@/lib/match-center-window'

vi.mock('@/components/bttsbet/LanguageSwitcher', () => ({
  useLanguage: () => ({ lang: 'fr' }),
}))
vi.mock('@/components/bttsbet/ComboBuilder', () => ({ default: () => null }))
vi.mock('@/components/bttsbet/BookmakerCardLinks', () => ({ default: () => null }))

// Synthetic records only: these test validation, never generate production picks.
function testPick(home: string, league: string, time: string) {
  return {
    home,
    away: 'Test Away',
    match: `${home} vs Test Away`,
    date: getDakarDateString(),
    time,
    league,
    ai_source: 'gemini-stats-v1',
    ai_abstain: false,
    ai_model: GEMINI_MODEL_ID,
    ai_response_status: 'pick',
    ai_market: 'BTTS',
    modelEngine: 'gemini-stats-v1',
    type: 'BTTS',
    prediction: 'Oui',
    proba: 0.63,
    predictions: [{ type: 'BTTS', prediction: 'Oui', proba: 0.63, modelEngine: GEMINI_MODEL_ID }],
  }
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Match Center Gemini-only publication', () => {
  it.each(['fr', 'en'] as const)('renders only genuine-source picks in priority order on %s, never a fixture-only analysis link', async locale => {
    const clubPick = testPick('Test Club', 'Club Friendly', '10:00')
    const internationalPick = testPick('Test National', 'International Friendly', '18:00')
    const abstention = {
      ...testPick('Test Abstention', 'UEFA Champions League', '16:00'),
      ai_abstain: true,
      ai_response_status: 'abstain',
    }
    const unsourced = {
      ...testPick('Test Unsourced', 'UEFA Champions League', '15:00'),
      ai_source: 'local-empirical-v1',
    }
    const fixtureOnly = {
      home: 'Barcelona', away: 'Arsenal', match: 'Barcelona vs Arsenal',
      date: getDakarDateString(), time: '17:45', league: "UEFA Women's Champions League",
      predictions: [],
    }
    vi.stubGlobal('fetch', vi.fn(async (url: string) => ({
      ok: true,
      json: async () => url === '/predictions.json'
        ? { free: [clubPick, abstention, unsourced, internationalPick, fixtureOnly], fixtures: [fixtureOnly, abstention] }
        : { history: [] },
    })))

    const { container } = render(<MatchCenter initialLocale={locale} />)
    await waitFor(() => expect(container.querySelectorAll('article')).toHaveLength(2))
    const cards = Array.from(container.querySelectorAll('article'))
    expect(cards.map(card => card.getAttribute('data-match'))).toEqual([
      internationalPick.match, clubPick.match,
    ])
    for (const card of cards) {
      expect(card.querySelector('.hp-pick__selection')?.textContent).toBe(locale === 'en' ? 'Yes' : 'Oui')
      expect(card.querySelector('a.hp-mc-open')?.getAttribute('href')).toMatch(
        locale === 'en' ? /^\/en\/match\// : /^\/match\//,
      )
    }
    expect(container.textContent).not.toContain('Barcelona')
    expect(container.textContent).not.toContain('Test Abstention')
    expect(container.textContent).not.toContain('Test Unsourced')
    expect(container.textContent).not.toContain('no prediction available')
    expect(container.textContent).not.toContain('aucun pronostic disponible')
    expect(container.querySelector('a[href*="barcelona-vs-arsenal"]')).toBeNull()
  })

  it('covers every current public-feed Gemini card with a generated FR/EN Match route', () => {
    const feed = JSON.parse(readFileSync('public/predictions.json', 'utf8'))
    const raw: Array<Record<string, unknown>> = Array.isArray(feed.free) ? feed.free : Array.isArray(feed.predictions) ? feed.predictions : []
    const normalized = raw.map((row: Record<string, unknown>) => ({
      ...row,
      date: String(row.date || ''),
      home: String(row.home || ''),
      away: String(row.away || ''),
      predictions: getGeminiPicks(row),
    }))
    const published = selectUpcomingGeminiItems(normalized, date => getDakarDayDiff(date))
    const builtSlugs = new Set(getDynamicMatchSlugs([...loadAllMatches().values()]))
    for (const row of published) {
      expect(row.predictions.length).toBeGreaterThan(0)
      const slug = generateMatchSlug(row.home, row.away, row.date)
      expect(builtSlugs.has(slug), `Missing generated FR/EN analysis route: ${slug}`).toBe(true)
    }
  })
})
