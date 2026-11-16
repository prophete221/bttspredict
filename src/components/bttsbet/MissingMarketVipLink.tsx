'use client'

import Link from 'next/link'
import { localizedPath, type Locale } from '@/lib/i18n'

export type MissingMarket = 'BTTS' | 'Over 2.5'

const LABEL: Record<'fr' | 'en', string> = {
  fr: 'Débloquer VIP',
  en: 'Unlock VIP',
}

export default function MissingMarketVipLink({ locale, market }: { locale: Locale; market: MissingMarket }) {
  const vipLocale: 'fr' | 'en' = locale === 'fr' ? 'fr' : 'en'

  return (
    <Link
      href={localizedPath('/vip', vipLocale)}
      aria-label={LABEL[vipLocale]}
      data-testid="missing-market-vip-link"
      data-missing-market={market}
      dir="ltr"
      className="inline-flex min-h-7 max-w-full items-center justify-center whitespace-nowrap rounded-md border border-[#E8C268]/30 bg-[#E8C268]/10 px-2 py-1 text-[10px] font-semibold leading-tight text-[#E8C268] no-underline transition-colors hover:bg-[#E8C268]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C268]"
    >
      {LABEL[vipLocale]}
    </Link>
  )
}
