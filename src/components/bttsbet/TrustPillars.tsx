'use client'

import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'

/**
 * TrustPillars — « Pourquoi la plateforme est différente ».
 * 4 piliers, icônes linéaires discrètes, chaque pilier mène vers une
 * destination réelle (ancre #matchs ou pages /historique, /methodologie).
 * Aucune promesse, aucune statistique inventée.
 */
export default function TrustPillars({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const home = localizedPath('/', lang)

  const pillars = [
    {
      title: t.home2.pil1T,
      text: t.home2.pil1D,
      href: `${home}#matchs`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        </svg>
      ),
    },
    {
      title: t.home2.pil2T,
      text: t.home2.pil2D,
      href: localizedPath('/historique', lang),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /><path d="M12 7v5l3 2" />
        </svg>
      ),
    },
    {
      title: t.home2.pil3T,
      text: t.home2.pil3D,
      href: `${home}#matchs`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20h18" /><path d="M6 20v-6" /><path d="M12 20V9" /><path d="M18 20V4" />
        </svg>
      ),
    },
    {
      title: t.home2.pil4T,
      text: t.home2.pil4D,
      href: localizedPath('/methodologie', lang),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ]

  return (
    <section className="hp-section hp-section--tint" aria-label={t.home2.pilTitle}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="hp-sect-head hp-sect-head--center">
          <div>
            <h2 className="hp-sect-title">{t.home2.pilTitle}</h2>
          </div>
        </div>
        <div className="hp-pillars">
          {pillars.map(p => (
            <a key={p.title} href={p.href} className="hp-pillar" data-cta={`pillar-${p.href}`}>
              <span className="hp-pillar__icon" aria-hidden="true">{p.icon}</span>
              <span className="hp-pillar__title">{p.title}</span>
              <span className="hp-pillar__text">{p.text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
