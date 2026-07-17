import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * PWA Install Prompt — shows a custom "Install" banner when the browser
 * fires the `beforeinstallprompt` event (Chrome/Edge/Samsung Internet).
 * On iOS Safari, shows a manual instruction tooltip instead.
 */
export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true
    setIsStandalone(standalone)
    if (standalone) return

    // Check if user previously dismissed
    const dismissedAt = localStorage.getItem('pwa-install-dismissed')
    if (dismissedAt) {
      const hoursSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60)
      if (hoursSince < 24) {
        setDismissed(true)
        return
      }
    }

    // Detect iOS Safari
    const ua = navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
    const safari = /^((?!chrome|android).)*safari/i.test(ua)
    setIsIOS(ios && safari)

    // Listen for beforeinstallprompt (Chrome/Edge/Samsung)
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show after a short delay so it doesn't appear instantly
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Also show iOS prompt after delay
    if (ios && safari) {
      setTimeout(() => setShowPrompt(true), 3000)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Listen for app installed event
  useEffect(() => {
    const handler = () => {
      setShowPrompt(false)
      setDeferredPrompt(null)
      setIsStandalone(true)
    }
    window.addEventListener('appinstalled', handler)
    return () => window.removeEventListener('appinstalled', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't render if already installed or dismissed
  if (isStandalone || dismissed) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-[9999] max-w-lg mx-auto"
        >
          <div className="bg-[#111827] border border-emerald/20 rounded-2xl p-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              {/* App icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald/10 border border-emerald/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/icon-192.png"
                  alt="BttsBet"
                  className="w-10 h-10 rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">Installer BttsBet</h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {isIOS
                    ? 'Appuyez sur l\'icone de partage puis "Sur l\'écran d\'accueil"'
                    : 'Accédez aux pronostics plus vite, même hors connexion'
                  }
                </p>

                {/* iOS instructions */}
                {isIOS && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                      <polyline points="16 6 12 2 8 6"/>
                      <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    <span>Partager <strong className="text-gray-300">→</strong> Sur l'écran d'accueil</span>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isIOS && deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-xs hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110 active:scale-95"
                  >
                    Installer
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                  aria-label="Fermer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
