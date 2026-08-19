export type AffiliatePartner = 'linebet' | '888starz'
export type AffiliateAction = 'signup' | 'download' | 'copy_code' | 'promo_view' | 'vip_unlock_open' | 'whatsapp_click'

/**
 * Emits an anonymous affiliate-funnel event when an analytics layer is present.
 * No email, user ID, wager, or personal data is collected here.
 */
export function trackAffiliateAction(
  partner: AffiliatePartner,
  action: AffiliateAction,
  placement: string,
): void {
  if (typeof window === 'undefined') return

  const event = {
    event: 'affiliate_funnel_action',
    affiliate_partner: partner,
    affiliate_action: action,
    affiliate_placement: placement,
  }

  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, string>>
  }
  const dataLayer = analyticsWindow.dataLayer ?? []
  analyticsWindow.dataLayer = dataLayer
  dataLayer.push(event)

  const gtag = (window as Window & {
    gtag?: (...args: unknown[]) => void
  }).gtag

  if (typeof gtag === 'function') {
    gtag('event', 'affiliate_funnel_action', {
      affiliate_partner: partner,
      affiliate_action: action,
      affiliate_placement: placement,
    })
  }
}

export function trackAffiliateCodeCopy(
  partner: AffiliatePartner,
  placement: string,
): void {
  trackAffiliateAction(partner, 'copy_code', placement)
}
