// @vitest-environment jsdom
import { StrictMode } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'
import PartnerSignupBand from '@/components/bttsbet/PartnerSignupBand'
import PremiumButton from '@/components/bttsbet/PremiumButton'

const affiliateLinks = {
  '1xbet': AFFILIATE.oneXbet,
  linebet: AFFILIATE.linebet,
  melbet: AFFILIATE.melbet,
  '888starz': AFFILIATE.star888,
} as const

describe('real partner CTA event paths', () => {
  let gtag: ReturnType<typeof vi.fn<(...args: unknown[]) => void>>

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem('bttsbet_cookie_consent', JSON.stringify({ preferences: { analytics: true } }))
    gtag = vi.fn<(...args: unknown[]) => void>()
    Object.assign(window, { gtag })
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
    sessionStorage.clear()
    delete (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  })

  it('displays the four partners under StrictMode without generating clicks, then emits exactly one per real click', () => {
    let renderCount = 0
    function StrictBand() {
      renderCount += 1
      return <PartnerSignupBand locale="fr" />
    }

    const { container } = render(<StrictMode><StrictBand /></StrictMode>)
    expect(renderCount).toBeGreaterThan(1)
    expect(gtag).not.toHaveBeenCalled()

    for (const partner of BOOKMAKERS) {
      const link = container.querySelector<HTMLAnchorElement>(`[data-cta="partner-band-${partner.id}"]`)
      expect(link, `CTA manquant pour ${partner.id}`).not.toBeNull()
      expect(link?.getAttribute('href')).toBe(affiliateLinks[partner.id])
      expect(link?.textContent).toContain(partner.promoCode)
      gtag.mockClear()

      fireEvent.click(link as HTMLAnchorElement)

      expect(gtag, `un clic doit produire exactement un hit (${partner.id})`).toHaveBeenCalledTimes(1)
      expect(gtag).toHaveBeenCalledWith('event', 'affiliate_funnel_action', expect.objectContaining({
        affiliate_partner: partner.id,
        affiliate_action: 'signup_cta_click',
        affiliate_placement: `partner-band-${partner.id}`,
      }))
    }
  })

  it('keeps the animated PremiumButton event path to one hit and invokes its consumer callback once', () => {
    const callback = vi.fn()
    const { container } = render(
      <StrictMode>
        <PremiumButton
          variant="linebet"
          href={AFFILIATE.linebet}
          trackingPlacement="match-card-secondary"
          onClick={callback}
          data-cta="animated-linebet-test"
        >
          Linebet · VISION221
        </PremiumButton>
      </StrictMode>,
    )
    const link = container.querySelector<HTMLAnchorElement>('[data-cta="animated-linebet-test"]')
    expect(link?.getAttribute('href')).toBe(AFFILIATE.linebet)
    expect(link?.textContent).toContain('VISION221')
    expect(gtag).not.toHaveBeenCalled()

    fireEvent.pointerOver(link as HTMLAnchorElement)
    fireEvent.pointerDown(link as HTMLAnchorElement)
    fireEvent.pointerUp(link as HTMLAnchorElement)
    fireEvent.click(link as HTMLAnchorElement)

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'affiliate_funnel_action', expect.objectContaining({
      affiliate_partner: 'linebet',
      affiliate_action: 'signup_cta_click',
      affiliate_placement: 'match-card-secondary',
    }))
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
