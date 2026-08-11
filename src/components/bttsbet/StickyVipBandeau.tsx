'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '@/lib/constants'

/**
 * StickyVipBandeau — Premium banner placed right after the Hero.
 * Elevates the VIP offer with: VIP badge + key benefits + CTA.
 * Animates on scroll-in, hides when scrolled past.
 */
export default function StickyVipBandeau() {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Show after 1.5s (let Hero load first)
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleCta = () => {
    const el = document.getElementById('vip')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else if (window.location.pathname !== '/') window.location.href = '/#vip'
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
    } catch {
      document.execCommand('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative z-30 max-w-[440px] sm:max-w-2xl mx-auto px-4 sm:px-6 -mt-4 mb-1">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative squircle-xl overflow-hidden border-2"
            style={{
              borderColor: 'rgba(199, 244, 100, 0.35)',
              background: 'linear-gradient(135deg, rgba(199, 244, 100, 0.12) 0%, rgba(7, 17, 26, 0.85) 50%, rgba(199, 244, 100, 0.08) 100%)',
              boxShadow: '0 12px 32px rgba(7, 17, 26, 0.4), 0 0 60px rgba(199, 244, 100, 0.15), inset 0 1px 0 #94A3B8',
            }}
          >
            {/* Top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-5 p-4 sm:p-5">
              {/* Left: VIP badge */}
              <div className="flex items-center gap-3">
                {/* Crown icon with glow */}
                <div className="relative w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#10B981" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                  </svg>
                  <motion.div
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl bg-gold/10 blur-sm pointer-events-none"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-gold-light uppercase tracking-widest">VIP</span>
                    <span className="badge badge-gold text-[9px] py-0.5">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
                      Premium
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-papier leading-tight">
                    Historique complet + 10 matchs/jour
                  </div>
                </div>
              </div>

              {/* Middle: benefits (hidden on mobile) */}
              <div className="hidden sm:flex items-center justify-center gap-5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-cendre font-medium">+10 matchs/jour</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-cendre font-medium">Précision VIP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-cendre font-medium">Historique complet</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-cendre font-medium">5 sports VIP</span>
                </div>
              </div>

              {/* Right: CTA + promo code */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Promo code (hidden on very small screens) */}
                <button
                  onClick={copyCode}
                  className="hidden xs:flex items-center gap-2 px-3 py-2 rounded-lg border border-gold/30 bg-gold/[0.06] hover:bg-gold/10 transition-all"
                  aria-label={`Copier le code promo ${SITE.promoCode}`}
                >
                  <span className="text-[10px] text-gold-light/70 uppercase tracking-widest font-bold">Code</span>
                  <span className="promo-code-shimmer text-sm font-bold tracking-wider">
                    {copied ? '✓' : SITE.promoCode}
                  </span>
                </button>

                {/* CTA */}
                <button
                  onClick={handleCta}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 btn-gold cta-glow text-[#1E293B] text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Débloquer VIP
                </button>
              </div>
            </div>

            {/* Mobile benefits row (visible only on small screens) */}
            <div className="sm:hidden flex items-center justify-around gap-2 px-4 pb-3 text-[10px]">
              <div className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-cendre">10 matchs/j</span>
              </div>
              <div className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-cendre">Précision VIP</span>
              </div>
              <div className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span className="text-cendre">5 sports</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
