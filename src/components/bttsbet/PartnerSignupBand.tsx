'use client'

import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import { localizedPath, type Locale } from '@/lib/i18n'

/**
 * Bandeau conversion discret — Linebet (VISION221) prioritaire, puis 1xBet (vipbtts).
 * Destiné aux pages EN à fort trafic. Aucune condition de bonus inventée.
 */
export default function PartnerSignupBand({ locale = 'en' }: { locale?: Locale }) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const title = isAr
    ? 'رموز الشركاء'
    : isFr
      ? 'Codes partenaires'
      : 'Partner promo codes'
  const sub = isAr
    ? 'Linebet أولاً ثم 1xBet — عبر رابطنا.'
    : isFr
      ? 'Linebet en priorité, puis 1xBet — via notre lien.'
      : 'Linebet first, then 1xBet — via our partner link.'

  return (
    <section
      className="mx-auto w-full max-w-[720px] px-4 py-4"
      aria-label={title}
    >
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{
          background: 'linear-gradient(145deg, rgba(16,24,38,0.95), rgba(8,12,20,0.98))',
          border: '1px solid rgba(47,125,255,0.22)',
        }}
      >
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#7EB6FF]">
          {title}
        </p>
        <p className="mt-1 text-center text-xs text-[#9DABBB]">{sub}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <a
            href={AFFILIATE.linebet}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'en-traffic-band-linebet')}
            data-cta="en-band-linebet"
            className="flex flex-col items-center justify-center rounded-xl px-3 py-3 text-center transition-transform active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #2F7DFF, #1B6EF3)',
              color: '#fff',
              boxShadow: '0 10px 24px rgba(47,125,255,0.3)',
            }}
          >
            <span className="text-sm font-bold">Linebet · VISION221</span>
            <span className="mt-0.5 text-[11px] opacity-90">
              {isAr ? 'سجّل' : isFr ? "S'inscrire" : 'Sign up'}
            </span>
          </a>
          <a
            href={AFFILIATE.oneXbet}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'en-traffic-band-1xbet')}
            data-cta="en-band-1xbet"
            className="flex flex-col items-center justify-center rounded-xl px-3 py-3 text-center transition-transform active:scale-[0.98]"
            style={{
              background: 'rgba(27,110,243,0.14)',
              border: '1px solid rgba(27,110,243,0.45)',
              color: '#E8F1FF',
            }}
          >
            <span className="text-sm font-bold">1xBet · vipbtts</span>
            <span className="mt-0.5 text-[11px] opacity-90">
              {isAr ? 'سجّل' : isFr ? "S'inscrire" : 'Sign up'}
            </span>
          </a>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-3 text-[11px]">
          <a
            href={localizedPath('/code-promo-linebet-senegal', locale)}
            className="font-semibold text-[#9CC6FF] underline decoration-dotted"
            data-cta="en-band-guide-linebet"
          >
            {isAr ? 'دليل Linebet' : isFr ? 'Guide Linebet' : 'Linebet promo code guide'}
          </a>
          <a
            href={localizedPath('/code-promo-1xbet', locale)}
            className="font-semibold text-[#9CC6FF] underline decoration-dotted"
            data-cta="en-band-guide-1xbet"
          >
            {isAr ? 'دليل 1xBet' : isFr ? 'Guide 1xBet' : '1xBet promo code guide'}
          </a>
        </div>
      </div>
    </section>
  )
}
