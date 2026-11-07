import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('1xBet promo mobile layout', () => {
  it('keeps the page grid and sections in one column below 700px', () => {
    const css = readFileSync('src/app/globals.css', 'utf8')
    const mobileBreakpoint = css.lastIndexOf('@media (max-width: 700px)')
    const ruleStart = css.indexOf('.promo-shell--1xbet > main.promo-main {', mobileBreakpoint)

    expect(mobileBreakpoint).toBeGreaterThan(-1)
    expect(ruleStart).toBeGreaterThan(mobileBreakpoint)

    const rule = css.slice(ruleStart, css.indexOf('}', ruleStart))
    expect(rule).toContain('grid-template-columns: minmax(0, 1fr);')
    expect(rule).toContain('grid-template-areas: "story" "offer" "benefits" "trust" "steps" "faq" "crosslinks" "responsible";')
  })
})
