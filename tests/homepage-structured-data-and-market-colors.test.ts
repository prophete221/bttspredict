import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const homepage = readFileSync('src/app/page.tsx', 'utf8')
const constants = readFileSync('src/lib/constants.ts', 'utf8')
const footer = readFileSync('src/components/bttsbet/Footer.tsx', 'utf8')
const hero = readFileSync('src/components/bttsbet/Hero.tsx', 'utf8')
const matchCenter = readFileSync('src/components/bttsbet/MatchCenter.tsx', 'utf8')
const redesignCss = readFileSync('src/app/refonte-2026.css', 'utf8')

describe('homepage SEO structure and market styling', () => {
  it('keeps a truthful FAQ schema aligned with four distinct visible homepage FAQs', () => {
    expect(constants).toContain('export const HOME_FAQ_ITEMS = [FAQ_ITEMS[0], FAQ_ITEMS[1], FAQ_ITEMS[3], FAQ_ITEMS[2]]')
    expect(footer).toContain("pathname === '/' ? HOME_FAQ_ITEMS")
    expect(homepage).toContain("'@type': 'FAQPage'")
    expect(homepage).toContain('mainEntity: HOME_FAQ_ITEMS.map')
    expect(homepage).toContain('JSON.stringify(faqJsonLd)')
  })

  it('keeps dashboard mobile order and BTTS/Over colors distinct after localized overrides', () => {
    const dashboardCss = readFileSync('src/app/football-intelligence.css', 'utf8')
    const matchPage = readFileSync('src/app/match/[slug]/page.tsx', 'utf8')
    expect(dashboardCss).not.toMatch(/grid-template-areas:\s*"filters"\s*"insights"\s*"feed"/)
    expect(dashboardCss).toContain('#btts-today-dashboard .btx-prob[data-market="BTTS"] .btx-prob__value')
    expect(dashboardCss).toContain('#btts-today-dashboard .btx-prob[data-market="O2.5"] .btx-prob__value')
    expect(dashboardCss).toContain('#main-content [data-market="BTTS"] [style*="#34D399"]')
    expect(dashboardCss).toContain('#main-content [data-market="O2.5"] [style*="#FBBF24"]')
    expect(dashboardCss).toContain('#main-content [data-market="BTTS"] [role="img"][aria-label*="%"] > div')
    expect(dashboardCss).toContain('#main-content [data-market="O2.5"] [role="img"][aria-label*="%"] > div')
    expect(matchPage).toContain('data-market={marketKey}')
    expect(matchPage).toContain("const marketColor = isBtts ? '#34D399' : isOver ? '#FBBF24'")
  })

  it('preserves structured SEO fields and does not attach an unverified Linebet bonus to the home link', () => {
    expect(homepage).toContain("datePublished: '2026-01-01'")
    expect(homepage).toContain('dateModified: new Date().toISOString().slice(0, 10)')
    expect(homepage).toContain('keywords:')
    expect(homepage).toContain('Code Promo Linebet</a>')
    expect(homepage).not.toContain('300% worldwide')
  })

  it('styles BTTS and Over picks by their Gemini market, not their array position', () => {
    // Hero marque (maquette validée) : classes par marché, jamais par position.
    expect(hero).toContain("p.type === 'BTTS' ? ' is-btts' : p.type.includes('Over')")
    expect(matchCenter).toContain("isBtts ? 'btp-market--btts' : 'btp-market--over25'")
    expect(redesignCss).toContain('.bp-feature__pick.is-btts strong')
    expect(redesignCss).toContain('.bp-feature__pick.is-over strong')
    expect(redesignCss).toContain('.btp-market.btp-market--btts .btp-market__name')
    expect(redesignCss).toContain('.btp-market.btp-market--over25 .btp-market__name')
  })
})
