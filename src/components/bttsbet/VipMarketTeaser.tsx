'use client'

import Link from 'next/link'
import { localizedPath, type Locale } from '@/lib/i18n'

const COPY: Record<Locale, { title: string; subtitle: string; markets: string[]; cta: string; aria: string }> = {
  fr: {
    title: 'Marchés VIP verrouillés',
    subtitle: 'Aperçu générique — aucune sélection ni cote affichée',
    markets: ['BTTS', 'Over 2,5', 'Score exact'],
    cta: 'Découvrir l’accès VIP',
    aria: 'Découvrir les marchés génériques réservés au VIP',
  },
  en: {
    title: 'VIP markets locked',
    subtitle: 'Generic preview — no picks or odds shown',
    markets: ['BTTS', 'Over 2.5', 'Exact score'],
    cta: 'Explore VIP access',
    aria: 'Explore generic markets reserved for VIP',
  },
  ar: {
    title: 'أسواق VIP مقفلة',
    subtitle: 'معاينة عامة — دون اختيارات أو احتمالات',
    markets: ['BTTS', 'Over 2.5', 'النتيجة الدقيقة'],
    cta: 'اكتشف وصول VIP',
    aria: 'اكتشف الأسواق العامة المتاحة لأعضاء VIP',
  },
}

export default function VipMarketTeaser({ locale }: { locale: Locale }) {
  const copy = COPY[locale]
  return (
    <Link
      href={localizedPath('/vip', locale)}
      className="vip-market-teaser"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      aria-label={copy.aria}
    >
      <div className="vip-market-teaser__head">
        <span className="vip-market-teaser__lock" aria-hidden="true">⌑</span>
        <span className="vip-market-teaser__copy">
          <strong>{copy.title}</strong>
          <span>{copy.subtitle}</span>
        </span>
        <span className="vip-market-teaser__arrow" aria-hidden="true">↗</span>
      </div>
      <div className="vip-market-teaser__markets" aria-hidden="true">
        {copy.markets.map((market) => (
          <span className="vip-market-teaser__market" key={market}>
            <span className="vip-market-teaser__mini-lock">•</span>{market}
          </span>
        ))}
      </div>
      <span className="vip-market-teaser__cta">{copy.cta}</span>
    </Link>
  )
}
