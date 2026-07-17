import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'bttsbet_cookie_consent'

const COOKIE_TYPES = [
  {
    id: 'essential',
    label: 'Cookies essentiels',
    description: 'Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.',
    required: true,
  },
  {
    id: 'analytics',
    label: 'Cookies analytiques',
    description: 'Nous aident à comprendre comment les visiteurs utilisent le site.',
    required: false,
  },
  {
    id: 'advertising',
    label: 'Cookies publicitaires',
    description: 'Utilisés pour afficher des publicités pertinentes et mesurer leur efficacité.',
    required: false,
  },
]

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const [customize, setCustomize] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    advertising: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      setShow(true)
    }

    // Listen for reopen events (from footer "Paramètres cookies" button)
    const handleReopen = () => {
      setCustomize(true)
      setShow(true)
    }
    window.addEventListener('cookie-consent-reopen', handleReopen)
    return () => window.removeEventListener('cookie-consent-reopen', handleReopen)
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      status: 'accepted',
      preferences: {
        essential: true,
        analytics: true,
        advertising: true,
      },
      timestamp: new Date().toISOString(),
    }))
    setShow(false)
  }

  const handleRefuse = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      status: 'refused',
      preferences: {
        essential: true,
        analytics: false,
        advertising: false,
      },
      timestamp: new Date().toISOString(),
    }))
    setShow(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      status: preferences.analytics || preferences.advertising ? 'customized' : 'refused',
      preferences,
      timestamp: new Date().toISOString(),
    }))
    setShow(false)
  }

  const togglePreference = (id) => {
    if (id === 'essential') return
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-[60] bg-dark-900/95 backdrop-blur-md border-t border-white/10 p-4 sm:p-6"
          role="dialog"
          aria-label="Consentement aux cookies"
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center text-emerald flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">Consentement aux cookies</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre utilisation des cookies.
                  </p>
                </div>
              </div>
            </div>

            {/* Customization Panel */}
            <AnimatePresence>
              {customize && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="bg-dark-800/60 rounded-xl border border-white/5 p-4 mb-4 space-y-3">
                    {COOKIE_TYPES.map((cookie) => (
                      <label
                        key={cookie.id}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="pt-0.5">
                          <input
                            type="checkbox"
                            checked={preferences[cookie.id]}
                            onChange={() => togglePreference(cookie.id)}
                            disabled={cookie.required}
                            className="sr-only peer"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            preferences[cookie.id]
                              ? 'bg-emerald border-emerald'
                              : 'border-white/20 group-hover:border-white/40'
                          } ${cookie.required ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {preferences[cookie.id] && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B1120" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-medium">{cookie.label}</span>
                            {cookie.required && (
                              <span className="text-[10px] bg-emerald/15 text-emerald px-2 py-0.5 rounded-full font-medium">
                                Obligatoire
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{cookie.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setCustomize(!customize)}
                className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-2 order-3 sm:order-1"
              >
                Personnaliser
              </button>
              <div className="flex gap-3 sm:ml-auto order-1 sm:order-2 w-full sm:w-auto">
                <button
                  onClick={handleRefuse}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-sm border border-white/10 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all font-medium"
                >
                  Refuser
                </button>
                {customize && (
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 sm:flex-initial px-5 py-2.5 text-sm border border-emerald/30 rounded-xl text-emerald hover:bg-emerald/10 transition-all font-medium"
                  >
                    Enregistrer
                  </button>
                )}
                <button
                  onClick={handleAccept}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-sm bg-gradient-to-r from-emerald to-emerald-dark text-dark-900 font-bold rounded-xl hover:shadow-lg hover:shadow-emerald/30 hover:brightness-110 transition-all"
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
