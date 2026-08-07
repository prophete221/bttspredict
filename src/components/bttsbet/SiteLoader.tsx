'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE, DUR } from '@/lib/motionPresets'

/* ═══════════════════════════════════════════════════════════════
   SiteLoader — Premium hi-tech opening animation
   
   Duration: ~1.6s total (optimized for 3G/4G mobile in West Africa)
   GPU-only: transform + opacity — no layout thrashing
   
   Sequence:
   1. Grid background fades in (0-0.3s)
   2. Logo orbiter ring scales in (0.2-0.5s)
   3. Brand name slides up (0.4-0.7s)
   4. Progress bar fills gold→cyan gradient (0.3-1.3s)
   5. Subtitle fades in (0.8-1.0s)
   6. Entire loader fades out (1.3-1.6s)
   ═══════════════════════════════════════════════════════════════ */

export default function SiteLoader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE.premium }}
          className="fixed inset-0 z-[9999] bg-midnight flex items-center justify-center"
          style={{ willChange: 'opacity' }}
        >
          {/* Animated background grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 loader-grid-bg"
          />

          {/* Gold ambient glow */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE.premium }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(300px,80vw)] h-[300px] bg-gold/[0.06] rounded-full blur-[100px]"
          />

          {/* Cyan secondary glow */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE.premium }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(200px,60vw)] h-[200px] bg-ultra/[0.04] rounded-full blur-[80px]"
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Logo animation — premium orbiter */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE.premium }}
              className="relative"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Outer orbiting ring — dual particles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 w-16 h-16"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_rgba(212, 175, 55,0.7)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-ultra rounded-full shadow-[0_0_8px_rgba(212, 175, 55,0.6)]" />
              </motion.div>

              {/* Inner pulsing circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15, ease: EASE.spring }}
                className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center"
              >
                {/* Globe SVG — hi-tech feel */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2"
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
              transition={{ duration: 0.5, delay: 0.35, ease: EASE.premium }}
              className="flex flex-col items-center gap-2"
              style={{ willChange: 'transform, opacity' }}
            >
              <span className="text-2xl font-extrabold text-papier tracking-tight">
                BTTSPredict
              </span>

              {/* Progress bar — premium gradient, slim */}
              <div className="w-36 h-[2px] bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.2, delay: 0.25, ease: EASE.spring }}
                  className="h-full bg-gradient-to-r from-gold-dark via-gold to-ultra rounded-full"
                  style={{ willChange: 'width' }}
                />
              </div>

              {/* Subtitle */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.4, delay: 0.75 }}
                className="text-[10px] text-cendre uppercase tracking-[0.2em] font-semibold"
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
