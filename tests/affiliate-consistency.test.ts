import { describe, expect, it } from 'vitest'
import { AFFILIATE, BOOKMAKERS, VIP_POLICY } from '@/lib/constants'

describe('affiliate and VIP consistency', () => {
  it('keeps each bookmaker code distinct and explicit', () => {
    // 2026-11 : 1xbet (VIPBTTS) rejoint Linebet (VISION221) en partenaire
    // prioritaire — les deux doivent rester en tête de BOOKMAKERS.
    const oneXbet = BOOKMAKERS.find((bookmaker) => bookmaker.id === '1xbet')
    const linebet = BOOKMAKERS.find((bookmaker) => bookmaker.id === 'linebet')
    const star888 = BOOKMAKERS.find((bookmaker) => bookmaker.id === '888starz')

    expect(BOOKMAKERS[0]?.id).toBe('1xbet')
    expect(BOOKMAKERS[1]?.id).toBe('linebet')
    expect(oneXbet?.promoCode).toBe('VIPBTTS')
    expect(linebet?.promoCode).toBe('VISION221')
    expect(star888?.promoCode).toBe('btts221')
    expect(VIP_POLICY.partner).toBe('1xbet ou Linebet')
    expect(VIP_POLICY.promoCode).toContain('VIPBTTS')
    expect(VIP_POLICY.promoCode).toContain(linebet?.promoCode ?? '')
  })

  it('keeps affiliate destinations present for all partners', () => {
    expect(AFFILIATE.oneXbet).toMatch(/^https:\/\//)
    expect(AFFILIATE.linebet).toMatch(/^https:\/\//)
    expect(AFFILIATE.star888).toMatch(/^https:\/\//)
    expect(AFFILIATE.linebetDownload).toMatch(/^https:\/\//)
    expect(AFFILIATE.star888Download).toMatch(/^https:\/\//)
  })
})
