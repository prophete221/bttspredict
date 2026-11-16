'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './LanguageSwitcher'

const STORAGE_KEY = 'bttsbet_cookie_consent'

const COOKIE_TYPES = [
  { id: 'analytics', label: 'Mesure d’audience (Google Analytics)', description: 'Chargée uniquement si configurée et après votre accord.' },
]

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [preferences, setPreferences] = useState({ analytics: false })
  const { lang } = useLanguage()
  const cookieTypes = lang === 'fr' ? COOKIE_TYPES : lang === 'en' ? [
    { id: 'analytics', label: 'Audience measurement (Google Analytics)', description: 'Loaded only when configured and after you consent.' },
  ] : [
    { id: 'analytics', label: 'قياس الجمهور (Google Analytics)', description: 'لا يتم التحميل إلا عند التهيئة وبعد موافقتك.' },
  ]

  useEffect(() => {
    const restorePreferences = (): boolean => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return false
      try {
        const parsed = JSON.parse(stored) as { preferences?: Partial<typeof preferences> }
        if (!parsed.preferences || typeof parsed.preferences !== 'object') {
          localStorage.removeItem(STORAGE_KEY)
          return false
        }
        setPreferences({
          analytics: parsed.preferences.analytics === true,
        })
        return true
      } catch {
        // Un consentement illisible est invalidé pour réafficher le choix.
        localStorage.removeItem(STORAGE_KEY)
        return false
      }
    }
    const checkConsent = () => {
      if (!restorePreferences()) setShow(true)
    }
    queueMicrotask(checkConsent)
    const handleReopen = () => {
      restorePreferences()
      setCustomize(true)
      setShow(true)
    }
    window.addEventListener('cookie-consent-reopen', handleReopen)
    return () => window.removeEventListener('cookie-consent-reopen', handleReopen)
  }, [])

  const persistConsent = (status: string, nextPreferences: typeof preferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, preferences: nextPreferences, timestamp: new Date().toISOString() }))
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: nextPreferences }))
    setShow(false)
  }

  const handleAccept = () => {
    persistConsent('accepted', { analytics: true })
  }
  const handleRefuse = () => {
    persistConsent('refused', { analytics: false })
  }
  const handleSavePreferences = () => {
    persistConsent(preferences.analytics ? 'customized' : 'refused', preferences)
  }
  const togglePreference = (id: string) => {
    if (id !== 'analytics') return
    setPreferences((prev) => ({ ...prev, [id]: !prev[id as keyof typeof prev] }))
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="cookie-consent-panel fixed z-[11000] p-3 sm:p-5"
          style={{ backgroundColor: 'rgba(7, 16, 24, 0.97)', backdropFilter: 'blur(18px)', borderTop: '1px solid rgba(91, 169, 255, 0.28)' }}
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="w-full max-w-[440px] sm:max-w-2xl mx-auto">
            <div className="flex flex-row items-start gap-3 mb-3 sm:gap-4 sm:mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(156, 196, 244, 0.14)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F7DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </div>
                <div>
                  <h3 id="cookie-consent-title" className="text-papier font-bold text-sm sm:text-base mb-0.5 sm:mb-1">{lang === 'fr' ? 'Préférences de mesure d’audience' : lang === 'en' ? 'Analytics preferences' : 'تفضيلات التحليلات'}</h3>
                  <p id="cookie-consent-description" className="text-xs sm:text-sm text-papier leading-snug sm:leading-relaxed">{lang === 'fr' ? 'Google Analytics est chargé uniquement si l’outil est configuré et après votre accord. Votre choix est enregistré localement dans ce navigateur.' : lang === 'en' ? 'Google Analytics loads only when configured and after your consent. Your choice is stored locally in this browser.' : 'لا يتم تحميل Google Analytics إلا عند تهيئته وبعد موافقتك. يُحفظ اختيارك محليًا في هذا المتصفح.'}</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {customize && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 space-y-3" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
                    {cookieTypes.map((cookie) => (
                      <label key={cookie.id} className="flex items-start gap-3 cursor-pointer group">
                        <div className="pt-0.5">
                          <input type="checkbox" checked={preferences[cookie.id as keyof typeof preferences]} onChange={() => togglePreference(cookie.id)} className="sr-only peer" />
                          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: preferences[cookie.id as keyof typeof preferences] ? '#2F7DFF' : 'transparent',
                              borderColor: preferences[cookie.id as keyof typeof preferences] ? '#2F7DFF' : 'rgba(244, 247, 251,0.2)',
                              opacity: 1,
                            }}>
                            {preferences[cookie.id as keyof typeof preferences] && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-papier font-medium">{cookie.label}</span>
                          </div>
                          <p className="text-xs text-cendre mt-0.5">{cookie.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <button onClick={() => setCustomize(!customize)}
                className="text-xs sm:text-sm text-papier hover:text-papier transition-colors underline underline-offset-2 order-3 sm:order-1">
                {lang === 'fr' ? 'Personnaliser' : lang === 'en' ? 'Customize' : 'تخصيص'}
              </button>
              <div className="flex gap-2 sm:gap-3 sm:ml-auto order-1 sm:order-2 w-full sm:w-auto">
                <button onClick={handleRefuse}
                  className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl font-medium transition-all"
                  style={{ border: '1px solid #35485C', color: '#9DABBB', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1A242F'; e.currentTarget.style.color = '#F2F6FA' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9DABBB' }}
                >
                  {lang === 'fr' ? 'Refuser' : lang === 'en' ? 'Reject' : 'رفض'}
                </button>
                {customize && (
                  <button onClick={handleSavePreferences}
                    className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl font-medium transition-all"
                    style={{ border: '1px solid #2F7DFF', color: '#2F7DFF', backgroundColor: 'transparent' }}
                  >
                    {lang === 'fr' ? 'Enregistrer' : lang === 'en' ? 'Save' : 'حفظ'}
                  </button>
                )}
                <button onClick={handleAccept}
                  className="flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl font-bold transition-all"
                  style={{
                    backgroundColor: '#2F7DFF',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(47, 125, 255, 0.28)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 20px rgba(47, 125, 255, 0.38)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(47, 125, 255, 0.28)'}
                >
                  {lang === 'fr' ? 'Accepter' : lang === 'en' ? 'Accept' : 'قبول'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
