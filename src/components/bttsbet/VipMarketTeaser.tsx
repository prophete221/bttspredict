'use client'

import Link from 'next/link'
import { localizedPath, type Locale } from '@/lib/i18n'

type TeaserCopy = {
  title: string
  markets: [string, string]
  unlock: string
  aria: string
  marketsAria: string
}

const COPY: Record<Locale, TeaserCopy> = {
  fr: {
    title: '2 marchés VIP verrouillés',
    markets: ['BTTS avancé', 'Score exact'],
    unlock: 'Débloquer',
    aria: 'Deux marchés VIP verrouillés.',
    marketsAria: 'Deux types de marchés VIP verrouillés',
  },
  en: {
    title: '2 VIP markets locked',
    markets: ['Advanced BTTS', 'Exact score'],
    unlock: 'Unlock',
    aria: 'Two VIP markets are locked.',
    marketsAria: 'Two locked VIP market types',
  },
  ar: {
    title: 'سوقان من VIP مقفلان',
    markets: ['BTTS متقدم', 'النتيجة الدقيقة'],
    unlock: 'افتح VIP',
    aria: 'سوقان من VIP مقفلان.',
    marketsAria: 'نوعان من أسواق VIP المقفلة',
  },
}

export default function VipMarketTeaser({ locale }: { locale: Locale }) {
  const copy = COPY[locale]

  return (
    <section
      data-testid="vip-market-teaser"
      aria-label={copy.aria}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="prediction-match-card__vip-teaser mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-[#E8C268]/15 bg-[#E8C268]/[0.035] px-2.5 py-2"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D9C58C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <strong className="text-[10px] leading-tight font-semibold text-[#D9C58C]">{copy.title}</strong>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1" aria-label={copy.marketsAria}>
          {copy.markets.map((market) => (
            <span
              key={market}
              data-vip-market
              className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-black/20 px-1.5 py-0.5 text-[9px] leading-tight text-[#AAB7C5]"
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#AAB7C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {market}
            </span>
          ))}
        </div>
      </div>
      <Link
        href={localizedPath('/vip', locale)}
        className="shrink-0 rounded-md border border-[#E8C268]/25 px-2 py-1 text-[10px] font-semibold text-[#E8C268] transition-colors hover:bg-[#E8C268]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C268]"
      >
        {copy.unlock}
      </Link>
    </section>
  )
}
