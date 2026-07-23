'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Premium Site Loader ───
// Shows a sleek animated loader on first visit, then fades out.
// Uses only CSS + Framer Motion — no heavy 3D/WebGL.
// Duration: ~1.8s total (fast for 3G/4G mobile users in West Africa).

export default function SiteLoader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Hide loader after content is ready
    const timer = setTimeout(() => setVisible(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-midnight flex items-center justify-center"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 loader-grid-bg" />

          {/* Gold ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gold/[0.06] rounded-full blur-[100px]" />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo animation — orbiter ring */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Outer orbiting ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-16 h-16"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              </motion.div>

              {/* Inner pulsing circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Brand name reveal */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-2xl font-extrabold text-white tracking-tight">
                BttsBet
              </span>

              {/* Progress bar — slim, gold */}
              <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full"
                />
              </div>

              {/* Subtitle */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold"
              >
                IA • Pronostics • Stats
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
