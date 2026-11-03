// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — affiliateTracking (v2, 2026-09-28)
// ═══════════════════════════════════════════════════════════════════════════════
// Événement GA4 unique : 'affiliate_funnel_action'
//
// Corrections v2 :
//  1. UNE SEULE émission par action (avant : dataLayer.push(objet GTM) + gtag
//     'event' → double risque de hit). Canal unique = gtag('event') quand gtag
//     est disponible, sinon push format gtag.js dans dataLayer (consommé au
//     chargement de gtag.js si l'utilisateur consent juste après un clic).
//  2. Consentement : aucun événement n'est émis si le consentement analytics
//     n'est pas accordé (même clé que AnalyticsLoader). Pas de backlog qui
//     fuirait les interactions pré-consentement.
//  3. Déduplication des événements de type "vue" (promo_view, prediction_view,
//     match_view) : 1 fois par placement par session (sessionStorage). Les
//     clics ne sont JAMAIS dédupliqués.
//  4. Noms normalisés — un clic n'est pas une inscription :
//     'signup' → 'signup_cta_click', 'download' → 'download_click'.
//     La conversion finale (inscription réelle) n'est PAS mesurable côté site :
//     elle doit être vérifiée dans le programme d'affiliation Linebet.
//  5. Contexte enrichi optionnel (marché, match, langue, page) via param `context`.
//     Aucune donnée personnelle : identifiants anonymes et paramètres de page.
// ═══════════════════════════════════════════════════════════════════════════════

export type AffiliatePartner = 'linebet' | '888starz'

export type AffiliateAction =
  | 'promo_view'        // vue d'un bloc promo / choix bookmaker
  | 'prediction_view'   // vue d'une prédiction (feed, dashboard, page prédictions)
  | 'match_view'        // vue d'une page match détaillée
  | 'copy_code'         // clic copie du code promo
  | 'signup_cta_click'  // clic sur un CTA d'inscription (≠ inscription réelle)
  | 'download_click'    // clic sur un lien de téléchargement (APK)
  | 'whatsapp_click'    // clic vérification WhatsApp
  | 'vip_unlock_open'   // ouverture d'une fenêtre de déblocage VIP

export type AffiliateContext = Record<string, string | number | boolean | undefined>

const CONSENT_KEY = 'bttsbet_cookie_consent'
const VIEW_DEDUP_KEY = 'bttsbet_affiliate_views'

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

function analyticsAllowed(): boolean {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return false
    const parsed = JSON.parse(stored) as { preferences?: { analytics?: boolean } }
    return parsed.preferences?.analytics === true
  } catch {
    return false
  }
}

function emitOncePerSession(eventKey: string): boolean {
  try {
    const raw = sessionStorage.getItem(VIEW_DEDUP_KEY)
    const seen: string[] = raw ? JSON.parse(raw) : []
    if (seen.includes(eventKey)) return false
    seen.push(eventKey)
    sessionStorage.setItem(VIEW_DEDUP_KEY, JSON.stringify(seen.slice(-100)))
    return true
  } catch {
    return true // session indisponible : émettre (mieux vaut un doublon qu'une perte de clic)
  }
}

/**
 * Émet un événement anonyme du funnel d'affiliation vers GA4.
 * N'émet RIEN sans consentement analytics. Aucune donnée personnelle.
 */
export function trackAffiliateAction(
  partner: AffiliatePartner,
  action: AffiliateAction,
  placement: string,
  context?: AffiliateContext,
): void {
  if (typeof window === 'undefined') return
  if (!analyticsAllowed()) return

  // Les "vues" ne comptent qu'une fois par placement et par session.
  const isView = action === 'promo_view' || action === 'prediction_view' || action === 'match_view'
  if (isView && !emitOncePerSession(`${action}:${placement}`)) return

  const params: Record<string, unknown> = {
    affiliate_partner: partner,
    affiliate_action: action,
    affiliate_placement: placement,
    ...context,
  }

  const w = window as AnalyticsWindow
  if (typeof w.gtag === 'function') {
    // Canal unique : gtag('event', ...) — format gtag.js standard.
    w.gtag('event', 'affiliate_funnel_action', params)
  } else {
    // gtag.js pas encore chargé (consentement accordé puis clic immédiat) :
    // push au format gtag.js, consommé par gtag.js au chargement.
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push(['event', 'affiliate_funnel_action', params])
  }
}

/** Clic sur "copier le code promo". */
export function trackAffiliateCodeCopy(
  partner: AffiliatePartner,
  placement: string,
  context?: AffiliateContext,
): void {
  trackAffiliateAction(partner, 'copy_code', placement, context)
}
