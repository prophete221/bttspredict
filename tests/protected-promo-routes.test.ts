import { describe, expect, it } from 'vitest'
import { isProtectedPromoPath } from '../scripts/protected-promo-routes.mjs'

describe('localized promo visual refresh allowlist', () => {
  it('allows the refreshed Arabic 1xBet and English 888Starz pages to replace legacy static shells', () => {
    expect(isProtectedPromoPath('ar/code-promo-1xbet.html')).toBe(false)
    expect(isProtectedPromoPath('ar/code-promo-1xbet/index.html')).toBe(false)
    expect(isProtectedPromoPath('en/bonus-888starz.html')).toBe(false)
    expect(isProtectedPromoPath('en/bonus-888starz/index.html')).toBe(false)
  })

  it('keeps the remaining explicitly protected legacy promo paths unchanged', () => {
    expect(isProtectedPromoPath('ar/bonus-888starz-btts221/index.html')).toBe(true)
    expect(isProtectedPromoPath('linebet-promo-code.html')).toBe(true)
  })
})
