'use client'

import Link from 'next/link'
import { useLanguage } from './LanguageSwitcher'
import { localizedPath, type Locale } from '@/lib/i18n'

/**
 * VipButtons — paire de CTA « Rejoindre le VIP » + « Historique VIP ».
 * Inséré sur les pages de pronostics (combiné BTTS + Over 2.5, Over 2.5 du jour)
 * pour donner un accès direct à l'offre VIP et à l'historique public des picks.
 *
 * Libellés trilingues inline (fr / en / ar) — i18n.ts reste gelé, les
 * ajouts ponctuels vivent dans le composant. La langue vient de l'URL
 * (useLanguage lit le préfixe /en, /ar) ; la prop `locale` permet de la
 * fixer explicitement depuis une page serveur (pattern initialLocale).
 */
const LABELS: Record<Locale, { join: string; history: string; aria: string }> = {
  fr: { join: 'Rejoindre le VIP', history: 'Historique VIP', aria: 'Accès VIP' },
  en: { join: 'Join VIP', history: 'VIP History', aria: 'VIP access' },
  ar: { join: 'انضم إلى VIP', history: 'سجل VIP', aria: 'الوصول إلى VIP' },
}

export default function VipButtons({ locale }: { locale?: Locale } = {}) {
  const { lang: detected } = useLanguage()
  const lang = locale ?? detected
  const labels = LABELS[lang] ?? LABELS.fr

  return (
    <div className="flex flex-wrap items-center gap-3 vip-buttons" role="group" aria-label={labels.aria}>
      <Link href={localizedPath('/vip', lang)} className="btn btn-gold" data-cta="vip-join">
        {labels.join}<span aria-hidden="true">→</span>
      </Link>
      <Link href={localizedPath('/historique', lang)} className="btn btn-ghost" data-cta="vip-history">
        {labels.history}<span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
