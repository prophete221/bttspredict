import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, waitFor } from '@testing-library/react'
import CompetitionPageContent from '@/components/bttsbet/CompetitionPageContent'
import CompetitionIndexContent from '@/components/bttsbet/CompetitionIndexContent'
import { formatCompetitionDate, getCompetitionPage, readCurrentCompetitionFeed } from '@/lib/competition-pages'

vi.mock('next/dynamic', () => ({ default: () => () => null }))
const feed = JSON.parse(readFileSync('public/predictions.json', 'utf8'))
const feedDate = String(feed.date || String(feed.lastUpdated || '').slice(0, 10))
function shiftDate(date: string, days: number) {
  const shifted = new Date(`${date}T12:00:00.000Z`)
  shifted.setUTCDate(shifted.getUTCDate() + days)
  return shifted.toISOString().slice(0, 10)
}
const now = new Date(`${feedDate}T12:00:00Z`)
const originalWidth = window.innerWidth
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(now)
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(feed) } as Response)))
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth }) })

describe('rendu des nouvelles pages depuis le flux courant', () => {
  it.each(([390, 1280] as const).flatMap(width => (['fr', 'en', 'ar'] as const).map(locale => ({ width, locale }))))('affiche les mêmes rencontres réelles en $locale à $width px', async ({ width, locale }) => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
    const { container } = render(<CompetitionPageContent competition={getCompetitionPage('bundesliga')!} locale={locale} />)
    const expected = readCurrentCompetitionFeed(feed, now).matches.bundesliga
    await waitFor(() => expect(container.querySelectorAll('.competition-match-card')).toHaveLength(expected.length))
    const cards = [...container.querySelectorAll<HTMLElement>('.competition-match-card')]
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.every(card => Date.parse(card.dataset.kickoff!) > now.getTime())).toBe(true)
    expect(container.textContent).toContain('Bayern Munich')
    expect(container.textContent).toContain('FC Cologne')
    expect(container.textContent).not.toContain(formatCompetitionDate(shiftDate(feedDate, -1), 'fr'))
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/predictions.json')
    expect(container.firstElementChild?.getAttribute('dir')).toBe(locale === 'ar' ? 'rtl' : 'ltr')
  })
  it('présente onze liens dans l’index sans prétendre que les compétitions vides ont des matchs', async () => {
    const { container } = render(<CompetitionIndexContent locale="fr" />)
    await waitFor(() => expect(container.textContent).toContain('0 rencontre à venir'))
    const links = [...container.querySelectorAll('a')].filter(link => link.getAttribute('href')?.startsWith('/competitions/'))
    expect(links).toHaveLength(11)
    expect(container.textContent).toContain(formatCompetitionDate(feedDate, 'fr'))
  })
  it('indique honnêtement une compétition sans pick courant', async () => {
    const { container } = render(<CompetitionPageContent competition={getCompetitionPage('liga-portugal')!} locale="fr" />)
    await waitFor(() => expect(container.textContent).toContain('Aucune prochaine rencontre avec analyse Gemini validée'))
    expect(container.querySelectorAll('.competition-match-card')).toHaveLength(0)
  })
  it('ne remplace pas un feed inaccessible par l’ancien snapshot', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network'))))
    const { container } = render(<CompetitionPageContent competition={getCompetitionPage('bundesliga')!} locale="fr" />)
    await waitFor(() => expect(container.textContent).toContain('temporairement indisponible'))
    expect(container.querySelectorAll('.competition-match-card')).toHaveLength(0)
  })
})
