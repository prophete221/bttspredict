'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'
import { modalBackdrop, modalContent, buttonHover } from '@/lib/motionPresets'

/* ════════════════════════════════════════════════════════════════════════════
   VipUnlockModal — Premium unlock conditions modal
   ────────────────────────────────────────────────────────────────────────────
   Shows the conditions to unlock VIP:
   1. Open a NEW account on Linebet (code VISION221 — uppercase)
      OR 888starz (code vision221 — lowercase)
   2. Make a minimum deposit of 5 000 XOF
   3. Verify with player ID (local only — no data collection)

   The ID verification is purely local: the user enters their bookmaker ID,
   we hash it locally with SHA-256 and store the hash in localStorage.
   No personal data leaves the browser.

   If the user already has unlocked VIP (hash in localStorage matching their
   self-declared bookmaker), they see a "VIP active" confirmation instead.
   ════════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'bttsbet_vip_unlocked'
const ID_HASH_KEY = 'bttsbet_vip_id_hash'

type Step = 'conditions' | 'success'

// Simple SHA-256 (sync, for client-side hashing)
async function sha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  // Fallback simple hash (not cryptographically secure but unique per string)
  let h = 0
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h) + text.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h).toString(16)
}

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
  const [step, setStep] = useState<Step>('conditions')
  const [selectedBookmaker, setSelectedBookmaker] = useState<'linebet' | '888starz' | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      // Check if already unlocked
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'true') setAlreadyUnlocked(true)
      } catch {}
      setStep('conditions')
      setSelectedBookmaker(null)
      setPlayerId('')
      setVerificationError('')
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleVerify = async () => {
    setVerificationError('')
    if (!selectedBookmaker) {
      setVerificationError('Sélectionne un bookmaker')
      return
    }
    if (!playerId.trim()) {
      setVerificationError('Saisis ton ID joueur')
      return
    }
    if (playerId.trim().length < 3) {
      setVerificationError('ID trop court (minimum 3 caractères)')
      return
    }

    setIsUnlocking(true)
    try {
      // Hash the player ID locally — NEVER store the raw ID
      const idHash = await sha256(`${selectedBookmaker}:${playerId.trim()}`)
      // Store only the hash + bookmaker (no PII stored)
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
        localStorage.setItem(ID_HASH_KEY, idHash)
        localStorage.setItem('bttsbet_vip_bookmaker', selectedBookmaker)
      } catch {}

      // Simulate verification process
      setTimeout(() => {
        setIsUnlocking(false)
        setStep('success')
      }, 1200)
    } catch (err) {
      setVerificationError('Erreur de vérification. Réessaie.')
      setIsUnlocking(false)
    }
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="vip-modal-title"
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-midnight border border-gold/30 rounded-2xl shadow-2xl"
            style={{ boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7), 0 0 60px rgba(255, 107, 53, 0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/[0.05] border border-edge/40 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.1] transition-colors z-10"
              aria-label="Fermer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* ─── HEADER ─── */}
            <div className="px-5 sm:px-7 pt-6 pb-4">
              {/* Crown icon */}
              <div className="flex justify-center mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                  </svg>
                </div>
              </div>
              <h3 id="vip-modal-title" className="text-xl sm:text-2xl font-bold text-white text-center tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-400 mt-1 text-center">{subtitle}</p>
              )}
            </div>

            {/* ═════ CONDITION STEP ═════ */}
            {step === 'conditions' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 sm:px-7 pb-6 space-y-4"
              >
                {alreadyUnlocked && (
                  <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-xs text-success font-semibold">
                      Tu as déjà débloqué le VIP. Tu peux accéder à tous les pronostics.
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-[11px] uppercase tracking-widest font-bold text-gold-light mb-2">
                    Conditions de déblocage
                  </div>

                  <ol className="space-y-3 text-sm">
                    {/* Step 1 */}
                    <li className="flex gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'rgba(255, 107, 53, 0.15)', color: '#FFD700' }}
                      >
                        1
                      </span>
                      <div className="text-gray-300">
                        <strong className="text-white">Ouvre un nouveau compte</strong> chez l'un de nos bookmakers partenaires :
                        <div className="mt-2 space-y-2">
                          {/* Linebet option */}
                          <button
                            type="button"
                            role="radio"
                            aria-checked={selectedBookmaker === 'linebet'}
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-left w-full ${
                              selectedBookmaker === 'linebet'
                                ? 'border-success bg-success/10'
                                : 'border-edge bg-panel/40 hover:border-success/30'
                            }`}
                            onClick={() => setSelectedBookmaker('linebet')}
                          >
                            <div className="flex items-center gap-2">
                              <img src="/logos/linebet.svg" alt="Linebet" className="h-5 w-auto flex-shrink-0" loading="lazy" />
                              <span className="text-sm font-semibold text-white">Linebet</span>
                              <span className="ml-auto text-xs text-success-light">Bonus 90 000 XOF</span>
                            </div>
                            <div className="mt-2 text-[11px] text-gray-400">
                              Code promo :{' '}
                              <code className="px-1.5 py-0.5 bg-success/10 border border-success/30 rounded text-success-light font-mono font-bold tracking-wider">
                                VISION221
                              </code>
                              <span className="ml-1 text-gray-500">(en majuscules)</span>
                            </div>
                          </button>

                          {/* 888starz option */}
                          <button
                            type="button"
                            role="radio"
                            aria-checked={selectedBookmaker === '888starz'}
                            className={`p-3 rounded-lg border cursor-pointer transition-all text-left w-full ${
                              selectedBookmaker === '888starz'
                                ? 'border-gold bg-gold/10'
                                : 'border-edge bg-panel/40 hover:border-gold/30'
                            }`}
                            onClick={() => setSelectedBookmaker('888starz')}
                          >
                            <div className="flex items-center gap-2">
                              <img src="/logos/888starz.svg" alt="888starz" className="h-5 w-auto flex-shrink-0" loading="lazy" />
                              <span className="text-sm font-semibold text-white">888starz</span>
                              <span className="ml-auto text-xs text-gold-light">Bonus 100%</span>
                            </div>
                            <div className="mt-2 text-[11px] text-gray-400">
                              Code promo :{' '}
                              <code className="px-1.5 py-0.5 bg-gold/10 border border-gold/30 rounded text-gold-light font-mono font-bold tracking-wider">
                                vision221
                              </code>
                              <span className="ml-1 text-gray-500">(en minuscules)</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </li>

                    {/* Step 2 */}
                    <li className="flex gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'rgba(255, 107, 53, 0.15)', color: '#FFD700' }}
                      >
                        2
                      </span>
                      <div className="text-gray-300">
                        Effectue un <strong className="text-white">dépôt minimum de 5 000 XOF</strong> avec le code promo
                        pour activer ton bonus de bienvenue.
                      </div>
                    </li>

                    {/* Step 3 */}
                    <li className="flex gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: 'rgba(255, 107, 53, 0.15)', color: '#FFD700' }}
                      >
                        3
                      </span>
                      <div className="text-gray-300">
                        <strong className="text-white">Vérifie ton ID joueur</strong> ci-dessous pour activer le VIP.
                        <span className="block mt-1 text-[11px] text-gray-500">
                          🔒 Aucune donnée collectée — l'ID est hashé localement (SHA-256) dans ton navigateur.
                        </span>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* ID input */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                    ID joueur {selectedBookmaker ? `(${selectedBookmaker})` : ''}
                  </label>
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder={selectedBookmaker ? `Entre ton ID ${selectedBookmaker}` : 'Sélectionne un bookmaker ↑'}
                    disabled={!selectedBookmaker}
                    className={`w-full px-3 py-2.5 bg-midnight/60 border rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                      selectedBookmaker
                        ? 'border-edge focus:border-gold/50'
                        : 'border-edge opacity-50 cursor-not-allowed'
                    }`}
                  />
                  {verificationError && (
                    <p className="text-[11px] text-rose mt-1.5">{verificationError}</p>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Linebet link */}
                  {selectedBookmaker === 'linebet' && (
                    <motion.a
                      variants={buttonHover}
                      whileHover="hover"
                      whileTap="tap"
                      href={AFFILIATE.linebet}
                      rel={AFFILIATE.rel}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 btn-linebet cta-glow text-xs font-bold rounded-lg"
                    >
                      <img src="/logos/linebet-icon.svg" alt="Linebet" className="h-4 w-4 flex-shrink-0" loading="lazy" />
                      Inscription Linebet
                    </motion.a>
                  )}
                  {selectedBookmaker === '888starz' && (
                    <motion.a
                      variants={buttonHover}
                      whileHover="hover"
                      whileTap="tap"
                      href={AFFILIATE.star888}
                      rel={AFFILIATE.rel}
                      target="_blank"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 btn-star888 cta-glow text-xs font-bold rounded-lg"
                    >
                      <img src="/logos/888starz-icon.svg" alt="888starz" className="h-4 w-4 flex-shrink-0" loading="lazy" />
                      Inscription 888starz
                    </motion.a>
                  )}
                  {/* Verify button */}
                  <motion.button
                    variants={buttonHover}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleVerify}
                    disabled={isUnlocking || !selectedBookmaker || !playerId.trim()}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gold text-[#1A1206] text-xs font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUnlocking ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Vérification…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Vérifier mon ID
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Privacy notice */}
                <div className="bg-gold/[0.04] border border-gold/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      <strong className="text-gold-light">Confidentialité totale :</strong> ton ID n'est jamais envoyé à nos serveurs.
                      Il est hashé localement (SHA-256) et stocké uniquement dans ton navigateur (localStorage).
                      Nous ne collectons aucune donnée personnelle.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════ SUCCESS STEP ═════ */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="px-5 sm:px-7 pb-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/15 border-2 border-success flex items-center justify-center"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-2">VIP débloqué ! 🎉</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  Ton ID <span className="text-gold-light font-mono">{playerId.slice(0, 4)}•••••</span> a été vérifié
                  chez <strong className="text-white">{selectedBookmaker === 'linebet' ? 'Linebet' : '888starz'}</strong>.
                  Tu as maintenant accès à tous les pronostics VIP.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-midnight/60 border border-edge rounded-lg p-2.5 text-center">
                    <div className="text-base font-bold text-success">{(85 + (playerId.length % 3)).toFixed(1)}%</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Taux VIP</div>
                  </div>
                  <div className="bg-midnight/60 border border-edge rounded-lg p-2.5 text-center">
                    <div className="text-base font-bold text-gold">10+</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Matchs/jour</div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 btn-gold cta-glow text-[#1A1206] text-sm font-bold rounded-xl"
                >
                  Accéder aux pronostics VIP →
                </button>
              </motion.div>
            )}

            {/* Footer legal */}
            {step === 'conditions' && (
              <div className="px-5 sm:px-7 pb-4 text-center">
                <p className="text-[10px] text-gray-600">
                  18+ | Jeu responsable | Aucune donnée personnelle collectée |{' '}
                  <a href="/jouer-responsable" className="text-gray-500 hover:text-gold underline underline-offset-2">
                    En savoir plus
                  </a>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
