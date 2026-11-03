'use client'

import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import { localizedPath, type Locale } from '@/lib/i18n'

const PARTNER_CHOICES = [
  { id: '1xbet' as const, name: '1xBet', href: AFFILIATE.oneXbet, code: BOOKMAKERS.find((item) => item.id === '1xbet')?.promoCode ?? '' },
  { id: 'linebet' as const, name: 'Linebet', href: AFFILIATE.linebet, code: BOOKMAKERS.find((item) => item.id === 'linebet')?.promoCode ?? '' },
  { id: 'melbet' as const, name: 'MelBet', href: AFFILIATE.melbet, code: BOOKMAKERS.find((item) => item.id === 'melbet')?.promoCode ?? '' },
  { id: '888starz' as const, name: '888Starz', href: AFFILIATE.star888, code: BOOKMAKERS.find((item) => item.id === '888starz')?.promoCode ?? '' },
] as const

/** Bandeau d’affiliation compact, hiérarchie éditoriale distincte des pages VIP. */
export default function PartnerSignupBand({ locale = 'en' }: { locale?: Locale }) {
  const isAr = locale === 'ar'
  const isFr = locale === 'fr'
  const title = isAr ? 'شركاء BTTSPredict' : isFr ? 'Partenaires BTTSPredict' : 'BTTSPredict partners'
  const sub = isAr
    ? '1xBet الشريك الرئيسي، ثم Linebet وMelBet و888Starz. تحقق من الشروط والتوفر لدى المشغّل.'
    : isFr
      ? '1xBet est le partenaire principal, suivi de Linebet, MelBet et 888Starz. Vérifiez les conditions et la disponibilité auprès de l’opérateur.'
      : '1xBet is the primary partner, followed by Linebet, MelBet and 888Starz. Check each operator’s terms and availability.'
  const signup = isAr ? 'زيارة الموقع' : isFr ? 'Consulter' : 'Visit operator'

  return (
    <section className="mx-auto w-full max-w-[760px] px-4 py-4" aria-label={title}>
      <div className="rounded-2xl p-4 sm:p-5" style={{ background: 'linear-gradient(145deg, rgba(16,24,29,0.96), rgba(8,12,16,0.98))', border: '1px solid rgba(197,243,106,0.18)' }}>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#C5F36A]">{title}</p>
        <p className="mt-1 text-center text-xs leading-relaxed text-[#AAB5B2]">{sub}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PARTNER_CHOICES.slice(0, 2).map((partner, index) => (
            <a
              key={partner.id}
              href={partner.href}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction(partner.id, 'signup_cta_click', `partner-band-${partner.id}`)}
              data-cta={`partner-band-${partner.id}`}
              className="flex min-h-11 flex-col items-center justify-center rounded-xl px-3 py-2.5 text-center transition-transform active:scale-[0.98]"
              style={index === 0
                ? { background: 'linear-gradient(135deg, #D5FF7D, #B9E759)', color: '#10150B', boxShadow: '0 8px 22px rgba(197,243,106,0.16)' }
                : { background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.12)', color: '#E7ECE8' }}
            >
              <span className="text-sm font-bold">{partner.name} · <code dir="ltr" style={{ font: 'inherit', textTransform: 'none' }}>{partner.code}</code></span>
              <span className="mt-0.5 text-[11px] opacity-80">{signup}</span>
            </a>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {PARTNER_CHOICES.slice(2).map((partner) => (
            <a
              key={partner.id}
              href={partner.href}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction(partner.id, 'signup_cta_click', `partner-band-${partner.id}`)}
              data-cta={`partner-band-${partner.id}`}
              className="flex min-h-10 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.025] px-2 py-2 text-center text-[11px] font-semibold text-[#AEB9B5] hover:border-[#C5F36A]/40 hover:text-[#F3F6EE]"
            >
              <span>{partner.name}</span><code dir="ltr" style={{ fontFamily: 'ui-monospace, monospace', textTransform: 'none' }}>{partner.code}</code>
            </a>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px]">
          {PARTNER_CHOICES.map((partner) => {
            const path = partner.id === '1xbet'
              ? '/code-promo-1xbet'
              : partner.id === 'linebet'
                ? '/code-promo-linebet-senegal'
                : partner.id === 'melbet'
                  ? '/code-promo-melbet'
                  : '/bonus-888starz'
            return (
              <a key={partner.id} href={localizedPath(path, locale)} className="font-semibold text-[#9EADA8] underline decoration-dotted underline-offset-2 hover:text-[#C5F36A]" data-cta={`partner-band-guide-${partner.id}`}>
                {partner.name}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
