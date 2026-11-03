import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

function createStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
    removeItem: (key: string) => { values.delete(key) },
    clear: () => { values.clear() },
  }
}

describe('affiliate funnel analytics contract', () => {
  let localStore: ReturnType<typeof createStorage>
  let sessionStore: ReturnType<typeof createStorage>
  let gtag: ReturnType<typeof vi.fn<(...args: unknown[]) => void>>
  let fakeWindow: { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }

  beforeEach(() => {
    localStore = createStorage()
    sessionStore = createStorage()
    gtag = vi.fn()
    fakeWindow = { gtag, dataLayer: [] }
    vi.stubGlobal('window', fakeWindow)
    vi.stubGlobal('localStorage', localStore)
    vi.stubGlobal('sessionStorage', sessionStore)
    localStore.setItem('bttsbet_cookie_consent', JSON.stringify({ preferences: { analytics: true } }))
  })

  afterEach(() => vi.unstubAllGlobals())

  it('emits one GA4 affiliate_funnel_action with stable partner/action/placement parameters', () => {
    trackAffiliateAction('1xbet', 'signup_cta_click', 'home-partner-1xbet')

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'affiliate_funnel_action', {
      affiliate_partner: '1xbet',
      affiliate_action: 'signup_cta_click',
      affiliate_placement: 'home-partner-1xbet',
    })
    expect(fakeWindow.dataLayer).toEqual([])
  })

  it('deduplicates views per partner, action, placement and session, but does not collide between partners', () => {
    trackAffiliateAction('platform', 'prediction_view', 'dashboard:/btts/predictions/today')
    trackAffiliateAction('platform', 'prediction_view', 'dashboard:/btts/predictions/today')
    trackAffiliateAction('1xbet', 'promo_view', 'same-placement')
    trackAffiliateAction('linebet', 'promo_view', 'same-placement')

    expect(gtag).toHaveBeenCalledTimes(3)
    expect(gtag.mock.calls.map((call) => call[2])).toEqual([
      expect.objectContaining({ affiliate_partner: 'platform', affiliate_action: 'prediction_view' }),
      expect.objectContaining({ affiliate_partner: '1xbet', affiliate_action: 'promo_view' }),
      expect.objectContaining({ affiliate_partner: 'linebet', affiliate_action: 'promo_view' }),
    ])
  })

  it('emits one signup_cta_click for each real click and never synthesizes signup_confirmed', () => {
    trackAffiliateAction('melbet', 'signup_cta_click', 'partner-band-melbet')
    trackAffiliateAction('melbet', 'signup_cta_click', 'partner-band-melbet')

    expect(gtag).toHaveBeenCalledTimes(2)
    expect(gtag.mock.calls.every((call) => call[1] === 'affiliate_funnel_action')).toBe(true)
    expect(gtag.mock.calls.every((call) => (call[2] as { affiliate_action: string }).affiliate_action === 'signup_cta_click')).toBe(true)
    expect(gtag.mock.calls.some((call) => call[1] === 'signup_confirmed')).toBe(false)
  })

  it('does not emit events before analytics consent', () => {
    localStore.removeItem('bttsbet_cookie_consent')

    trackAffiliateAction('888starz', 'signup_cta_click', 'partner-band-888starz')

    expect(gtag).not.toHaveBeenCalled()
    expect(fakeWindow.dataLayer).toEqual([])
  })

  it('suppresses views if session storage is unavailable, but preserves real clicks', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => { throw new Error('storage unavailable') },
      setItem: () => { throw new Error('storage unavailable') },
    })

    trackAffiliateAction('platform', 'prediction_view', 'dashboard:/btts/predictions/today')
    trackAffiliateAction('1xbet', 'signup_cta_click', 'home-partner-1xbet')

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag.mock.calls[0]?.[2]).toEqual(expect.objectContaining({
      affiliate_partner: '1xbet',
      affiliate_action: 'signup_cta_click',
    }))
  })

  it('uses exactly one dataLayer fallback when gtag is not loaded', () => {
    fakeWindow = { dataLayer: [] }
    vi.stubGlobal('window', fakeWindow)

    trackAffiliateAction('888starz', 'signup_cta_click', 'partner-band-888starz')

    expect(fakeWindow.dataLayer).toEqual([[
      'event',
      'affiliate_funnel_action',
      expect.objectContaining({
        affiliate_partner: '888starz',
        affiliate_action: 'signup_cta_click',
        affiliate_placement: 'partner-band-888starz',
      }),
    ]])
  })
})
