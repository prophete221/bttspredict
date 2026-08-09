'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'bttsbet_cookie_consent'

const COOKIE_TYPES = [
  { id: 'essential', label: 'Cookies essentiels', description: 'Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.', required: true },
  { id: 'analytics', label: 'Cookies analytiques', description: 'Nous aident à comprendre comment les visiteurs utilisent le site.', required: false },
  { id: 'advertising', label: 'Cookies publicitaires', description: 'Utilisés pour afficher des publicités pertinentes et mesurer leur efficacité.', required: false },
]

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [preferences, setPreferences] = useState({ essential: true, analytics: false, advertising: false })

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem(STORAGE_KEY)
      if (!consent) setShow(true)
    }
    queueMicrotask(checkConsent)
    const handleReopen = () => { setCustomize(true); setShow(true) }
    window.addEventListener('cookie-consent-reopen', handleReopen)
    return () => window.removeEventListener('cookie-consent-reopen', handleReopen)
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'accepted', preferences: { essential: true, analytics: true, advertising: true }, timestamp: new Date().toISOString() }))
    setShow(false)
  }
  const handleRefuse = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'refused', preferences: { essential: true, analytics: false, advertising: false }, timestamp: new Date().toISOString() }))
    setShow(false)
  }
  const handleSavePreferences = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: preferences.analytics || preferences.advertising ? 'customized' : 'refused', preferences, timestamp: new Date().toISOString() }))
    setShow(false)
  }
  const togglePreference = (id: string) => {
    if (id === 'essential') return
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
          className="fixed left-0 right-0 z-[60] p-4 sm:p-6"
          style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))', backgroundColor: 'rgba(241, 242, 243, 0.98)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(18, 18, 18, 0.15)' }}
          role="dialog"
          aria-label="Consentement aux cookies"
        >
          <div className="max-w-[440px] sm:max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(18, 18, 18, 0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-papier font-bold text-base mb-1">Consentement aux cookies</h3>
                  <p className="text-sm text-papier leading-relaxed">Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre utilisation de cookies.</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {customize && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="rounded-xl p-4 mb-4 space-y-3" style={{ backgroundColor: 'rgba(241, 242, 243, 0.6)', border: '1px solid rgba(17, 24, 39, 0.08)' }}>
                    {COOKIE_TYPES.map((cookie) => (
                      <label key={cookie.id} className="flex items-start gap-3 cursor-pointer group">
                        <div className="pt-0.5">
                          <input type="checkbox" checked={preferences[cookie.id as keyof typeof preferences]} onChange={() => togglePreference(cookie.id)} disabled={cookie.required} className="sr-only peer" />
                          <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: preferences[cookie.id as keyof typeof preferences] ? '#121212' : 'transparent',
                              borderColor: preferences[cookie.id as keyof typeof preferences] ? '#121212' : 'rgba(17, 24, 39,0.2)',
                              opacity: cookie.required ? 0.7 : 1,
                            }}>
                            {preferences[cookie.id as keyof typeof preferences] && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F1F2F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-papier font-medium">{cookie.label}</span>
                            {cookie.required && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(18, 18, 18,0.15)', color: '#121212' }}>Obligatoire</span>
                            )}
                          </div>
                          <p className="text-xs text-cendre mt-0.5">{cookie.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button onClick={() => setCustomize(!customize)}
                className="text-sm text-papier hover:text-papier transition-colors underline underline-offset-2 order-3 sm:order-1">
                Personnaliser
              </button>
              <div className="flex gap-3 sm:ml-auto order-1 sm:order-2 w-full sm:w-auto">
                <button onClick={handleRefuse}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-sm rounded-xl font-medium transition-all"
                  style={{ border: '1px solid rgba(17, 24, 39,0.1)', color: '#6B7280', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#111827' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6B7280' }}
                >
                  Refuser
                </button>
                {customize && (
                  <button onClick={handleSavePreferences}
                    className="flex-1 sm:flex-initial px-5 py-2.5 text-sm rounded-xl font-medium transition-all"
                    style={{ border: '1px solid rgba(18, 18, 18,0.3)', color: '#121212', backgroundColor: 'transparent' }}
                  >
                    Enregistrer
                  </button>
                )}
                <button onClick={handleAccept}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-sm rounded-xl font-bold transition-all"
                  style={{
                    backgroundColor: '#121212',
                    color: '#F1F2F3',
                    boxShadow: '0 0 0 1px rgba(18, 18, 18,.3), 0 4px 16px rgba(18, 18, 18,.2)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 0 1px rgba(18, 18, 18,.5), 0 8px 24px rgba(18, 18, 18,.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 0 1px rgba(18, 18, 18,.3), 0 4px 16px rgba(18, 18, 18,.2)'}
                >
                  Accepter
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
