import { describe, expect, it } from 'vitest'
import { AFFILIATE, BOOKMAKERS, VIP_POLICY } from '@/lib/constants'

describe('affiliate and VIP consistency', () => {
  it('keeps each bookmaker code distinct and explicit', () => {
    // 2026-11 : 1xbet (vipbtts) et Linebet (VISION221) prioritaires, Melbet
    // (Bttswin) rejoint le programme, 888starz (btts221) reste en dernier.
    // ⚠️ CASSE EXACTE fournie par les affilieurs — ne jamais modifier.
    const oneXbet = BOOKMAKERS.find((bookmaker) => bookmaker.id === '1xbet')
    const linebet = BOOKMAKERS.find((bookmaker) => bookmaker.id === 'linebet')
    const melbet = BOOKMAKERS.find((bookmaker) => bookmaker.id === 'melbet')
    const star888 = BOOKMAKERS.find((bookmaker) => bookmaker.id === '888starz')

    expect(BOOKMAKERS[0]?.id).toBe('1xbet')
    expect(BOOKMAKERS[1]?.id).toBe('linebet')
    expect(BOOKMAKERS[2]?.id).toBe('melbet')
    expect(BOOKMAKERS[3]?.id).toBe('888starz')
    expect(oneXbet?.promoCode).toBe('vipbtts')
    expect(linebet?.promoCode).toBe('VISION221')
    expect(melbet?.promoCode).toBe('Bttswin')
    expect(star888?.promoCode).toBe('btts221')
    expect(VIP_POLICY.partners).toEqual(['1xbet', 'linebet', 'melbet', '888starz'])
    expect(VIP_POLICY.access).toBe('locked')
    expect(VIP_POLICY.approval).toBe('manual-owner-confirmation')
    expect(VIP_POLICY.publicData).toBe('none')
  })

  it('keeps affiliate destinations present for all partners', () => {
    expect(AFFILIATE.oneXbet).toMatch(/^https:\/\//)
    expect(AFFILIATE.oneXbetDownload).toMatch(/^https:\/\//)
    expect(AFFILIATE.linebet).toMatch(/^https:\/\//)
    expect(AFFILIATE.star888).toMatch(/^https:\/\//)
    expect(AFFILIATE.linebetDownload).toMatch(/^https:\/\//)
    expect(AFFILIATE.star888Download).toMatch(/^https:\/\//)
  })

  it('keeps Melbet affiliate destinations present', () => {
    expect(AFFILIATE.melbet).toMatch(/^https:\/\//)
    expect(AFFILIATE.melbetDownload).toMatch(/^https:\/\//)
  })

  it('uses the real affiliate links (no provisional 1xbet.com fallback)', () => {
    // Garde-fou : si le lien provisoire revient, ce test échoue.
    expect(AFFILIATE.oneXbet).not.toBe('https://1xbet.com/')
    expect(AFFILIATE.oneXbet).toContain('reffpa.com')
    expect(AFFILIATE.oneXbetDownload).toContain('reffpa.com')
    expect(AFFILIATE.melbet).toContain('refpa3665.com')
    expect(AFFILIATE.melbetDownload).toContain('refpa3665.com')
  })

  it('gives every bookmaker a real logo asset and download link', () => {
    for (const bookmaker of BOOKMAKERS) {
      expect(bookmaker.downloadLink, `downloadLink manquant pour ${bookmaker.id}`).toMatch(/^https:\/\//)
      expect(bookmaker.logoFull, `logo manquant pour ${bookmaker.id}`).toMatch(/^\/logos\//)
    }
  })
})
