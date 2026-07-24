'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, BOOKMAKERS } from '@/lib/constants'
import { modalBackdrop, modalContent, buttonHover } from '@/lib/motionPresets'

/**
 * VipUnlockModal — Premium VIP unlock modal
 * NO data collection. Just 2 affiliate buttons that open signup links.
 * Replaces all 4 previous ID-collection modals (PromoVip, VipSports, AviatorVip, FifaLinebet).
 */
export default function VipUnlockModal({
  isOpen,
  onClose,
  title = 'Débloque les pronos VIP',
  subtitle,
}: {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      setCopied(false)
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
    } catch {
      document.execCommand('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md glass-strong squircle-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Close button ── */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/[0.05] border border-edge/40 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors"
              aria-label="Fermer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* ── VIP Crown ── */}
            <div className="flex justify-center pt-6 pb-3">
              <div className="vip-crown-3d" style={{ width: 64, height: 64 }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  {/* Crown body */}
                  <path d="M12 44 L18 24 L26 34 L32 16 L38 34 L46 24 L52 44Z" fill="#FACC15" opacity="0.2" stroke="#FACC15" strokeWidth="2" />
                  {/* Crown band */}
                  <rect x="12" y="44" width="40" height="6" rx="2" fill="#FACC15" opacity="0.3" stroke="#FACC15" strokeWidth="1.5" />
                  {/* Jewels */}
                  <circle cx="22" cy="42" r="3" fill="#22D3EE" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="32" cy="40" r="3.5" fill="#FACC15" opacity="0.9">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="42" cy="42" r="3" fill="#4ADE80" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  {/* Star sparkle */}
                  <path d="M32 8 L33.5 13 L38 12 L34.5 15 L36 19 L32 16.5 L28 19 L29.5 15 L26 12 L30.5 13Z" fill="#FACC15" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="rotate" values="0 32 14;360 32 14" dur="6s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
            </div>

            {/* ── Title ── */}
            <div className="text-center px-5 pb-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
              )}
              {!subtitle && (
                <p className="text-sm text-gray-400 mt-1">
                  Inscris-toi avec <span className="text-gold font-bold">{SITE.promoCode}</span> pour débloquer
                </p>
              )}
            </div>

            {/* ── VIP Verified Badge ── */}
            <div className="flex justify-center mb-4">
              <div className="vip-verified-badge inline-flex items-center gap-2 px-4 py-2 bg-success/[0.08] border border-success/25 rounded-full">
                <span className="vip-pulse-dot" />
                <span className="text-xs font-bold text-success">VIP Vérifié</span>
                <span className="text-[10px] text-gray-500">Historique complet + 10 matchs/jour</span>
              </div>
            </div>

            {/* ── Promo Code Card ── */}
            <div className="mx-5 mb-4">
              <div className="promo-code-monolith squircle px-5 py-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-gold/60 uppercase tracking-wider font-bold mb-1">Code Promo</div>
                  <div className="text-2xl font-black tracking-[0.12em] promo-code-shimmer">{SITE.promoCode}</div>
                </div>
                <motion.button
                  variants={buttonHover}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={copyCode}
                  className={`promo-copy-btn flex items-center gap-1.5 text-sm font-bold px-3 py-2 rounded-lg transition-all ${
                    copied ? 'bg-success/20 border border-success/40 text-success' : 'bg-gold/[0.08] border border-gold/25 text-gold'
                  }`}
                  aria-label="Copier le code promo"
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Copié !
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      Copier
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* ── 2 Big Affiliate Buttons ── */}
            <div className="px-5 pb-6 space-y-3">
              {/* Linebet — Primary */}
              <motion.a
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                href={AFFILIATE.linebet}
                rel={AFFILIATE.rel}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 btn-linebet cta-glow text-[#04150C] text-base font-bold squircle-lg"
              >
                <img src="/logos/linebet.svg" alt="Linebet" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy" />
                <span>Linebet — Bonus 90 000 XOF (150$)</span>
              </motion.a>

              {/* 888starz — Secondary */}
              <motion.a
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                href={AFFILIATE.star888}
                rel={AFFILIATE.rel}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 btn-star888 text-white text-base font-bold squircle-lg"
              >
                <img src="/logos/888starz.svg" alt="888starz" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy" />
                <span>888starz — Bonus 100%</span>
              </motion.a>
            </div>

            {/* ── Micro-legal ── */}
            <div className="px-5 pb-4 text-center">
              <p className="text-[10px] text-gray-600">
                18+ | Jeu responsable | Aucune donnée collectée
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
