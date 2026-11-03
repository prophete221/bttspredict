'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { isLocale, localizedPath, LOCALE_META, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'

const STORAGE_KEY = 'bttsbet-lang'

export function useLanguage() {
  const pathname = usePathname() || '/'
  const pathLocale = pathname.split('/').filter(Boolean)[0]
  // L'URL est autoritaire : /en/… s'affiche toujours en anglais, /ar/… en
  // arabe, la racine en français. (Avant, un ancien localStorage
  // « bttsbet-lang » pouvait re-franciser les pages /en — corrigé.)
  // Le sélecteur de langue navigue de toute façon vers l'URL localisée,
  // donc la préférence sauvegardée n'a jamais à passer outre le chemin.
  const [lang] = useState<Locale>(isLocale(pathLocale) ? pathLocale : 'fr')

  const change = (newLang: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, newLang)
    } catch {
      /* localStorage indisponible — la navigation suffit */
    }
    window.dispatchEvent(new CustomEvent('lang-change', { detail: newLang }))
    // Navigation immédiate vers l'URL localisée : l'URL reste la source
    // unique de vérité pour la langue affichée.
    window.location.assign(localizedPath(pathname, newLang))
  }

  return { lang, change }
}

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, change } = useLanguage()

  return (
    <div className="ds-lang" dir="ltr" role="group" aria-label={LOCALE_META[lang].nativeLabel}>
      {SUPPORTED_LOCALES.map(code => (
        <button
          type="button"
          key={code}
          onClick={() => change(code)}
          aria-current={lang === code ? 'true' : undefined}
          aria-label={LOCALE_META[code].nativeLabel}
          title={LOCALE_META[code].nativeLabel}
        >
          {compact && code === 'ar' ? 'AR' : code === 'ar' && !compact ? 'ع' : code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
