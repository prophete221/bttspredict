'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Lang = 'fr' | 'en'

const STORAGE_KEY = 'bttsbet-lang'

const LANG_LABELS: Record<Lang, { label: string; flag: string; native: string }> = {
  fr: { label: 'FR', flag: '🇫🇷', native: 'Français' },
  en: { label: 'EN', flag: '🇬🇧', native: 'English' },
}

export function useLanguage() {
  const [lang, setLang] = useState<Lang>('fr')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Lang | null
    if (saved === 'fr' || saved === 'en') setLang(saved)
  }, [])

  const change = (newLang: Lang) => {
    setLang(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang)
      // Dispatch event so other components can react
      window.dispatchEvent(new CustomEvent('lang-change', { detail: newLang }))
    }
  }

  return { lang, change }
}

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, change } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-100 transition-all border border-edge"
        aria-label="Change language"
      >
        <span className="text-sm">{LANG_LABELS[lang].flag}</span>
        <span>{LANG_LABELS[lang].label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-1 z-50 glass-card rounded-lg overflow-hidden min-w-[140px]"
            >
              {(Object.keys(LANG_LABELS) as Lang[]).map(code => (
                <button
                  key={code}
                  onClick={() => {
                    change(code)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100 transition-colors ${
                    lang === code ? 'text-success bg-success/5' : 'text-gray-300'
                  }`}
                >
                  <span className="text-sm">{LANG_LABELS[code].flag}</span>
                  <span className="flex-1 text-left">{LANG_LABELS[code].native}</span>
                  {lang === code && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
              <div className="border-t border-edge px-3 py-1.5">
                <p className="text-[10px] text-gray-500">Plus de langues bientôt</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
