'use client'

import { BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateAction, type AffiliateContext, type AffiliatePartner } from '@/lib/affiliateTracking'
import type { Locale } from '@/lib/i18n'

const DISPLAY_NAMES: Record<AffiliatePartner, string> = {
  '1xbet': '1xBet',
  linebet: 'Linebet',
  melbet: 'MelBet',
  '888starz': '888Starz',
}

const VISIT_LABEL: Record<Locale, string> = {
  fr: 'Visiter',
  en: 'Visit',
  ar: 'زيارة',
}

const GROUP_LABEL: Record<Locale, string> = {
  fr: 'Liens des bookmakers partenaires',
  en: 'Partner bookmaker links',
  ar: 'روابط شركات المراهنات الشريكة',
}

export default function BookmakerCardLinks({
  locale,
  placement,
  compact = true,
  context,
}: {
  locale: Locale
  placement: string
  compact?: boolean
  context?: AffiliateContext
}) {
  return (
    <div
      className={`fi-bookmaker-links${compact ? ' fi-bookmaker-links--compact' : ''}`}
      role="group"
      aria-label={GROUP_LABEL[locale]}
      dir="ltr"
    >
      {BOOKMAKERS.map((partner) => {
        const id = partner.id as AffiliatePartner
        const name = DISPLAY_NAMES[id]
        return (
          <a
            key={id}
            className="fi-bookmaker-link"
            href={partner.signupLink}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            aria-label={`${VISIT_LABEL[locale]} ${name}`}
            title={`${VISIT_LABEL[locale]} ${name}`}
            data-affiliate-partner={id}
            data-cta={`${placement}-${id}`}
            onClick={() => trackAffiliateAction(id, 'signup_cta_click', placement, { ...context, lang: locale })}
          >
            <img src={partner.logoFull} alt="" width={96} height={32} loading="lazy" decoding="async" />
          </a>
        )
      })}
    </div>
  )
}
