import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'bttsbet_age_verified'
const EXPIRY_HOURS = 24

export default function AgeVerification() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        // Check if verification has expired
        const verifiedAt = new Date(data.timestamp)
        const now = new Date()
        const hoursSince = (now - verifiedAt) / (1000 * 60 * 60)
        if (hoursSince < EXPIRY_HOURS && data.verified) {
          return // Still valid
        }
      }
      setShow(true)
    } catch {
      setShow(true)
    }
  }, [])

  // Lock scroll when visible
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      verified: true,
      timestamp: new Date().toISOString(),
    }))
    setShow(false)
  }

  const handleDeny = () => {
    window.location.href = 'https://www.google.com'
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight/98 backdrop-blur-lg"
          role="dialog"
          aria-label="Vérification d'âge"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass-3d rounded-2xl p-8 sm:p-10 max-w-md mx-4 text-center"
          >
            {/* Warning Icon */}
            <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Vérification d&apos;âge
            </h2>

            {/* Description */}
            <p className="text-gray-400 mb-8 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              Ce site contient des informations sur les paris sportifs. Vous devez avoir au moins 18 ans pour accéder à ce contenu.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDeny}
                className="px-6 py-3.5 border border-red-500/30 rounded-xl text-red-400 font-semibold hover:bg-red-500/10 hover:border-red-500/50 transition-all text-sm"
              >
                Je suis mineur
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl hover:shadow-lg hover:shadow-emerald/30 hover:brightness-110 transition-all text-sm"
              >
                J&apos;ai 18 ans ou plus
              </button>
            </div>

            {/* Subtle note */}
            <p className="text-[11px] text-gray-600 mt-6">
              En confirmant, vous reconnaissez avoir l&apos;âge légal pour consulter du contenu lié aux paris sportifs.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
