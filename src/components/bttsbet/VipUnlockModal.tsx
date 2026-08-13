'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'

const STORAGE_KEY = 'bttsbet_vip_unlocked'
const ID_HASH_KEY = 'bttsbet_vip_id_hash'

type Step = 'conditions' | 'success'

async function sha256(text: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  let h = 0
  for (let i = 0; i < text.length; i++) { h = ((h << 5) - h) + text.charCodeAt(i); h |= 0 }
  return Math.abs(h).toString(16)
}

export default function VipUnlockModal({
  isOpen,
  onClose,
  title = 'Débloque les pronos VIP',
}: {
  isOpen: boolean
  onClose: () => void
  title?: string
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<Step>('conditions')
  const [selectedBookmaker, setSelectedBookmaker] = useState<'linebet' | '888starz' | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false)
  const [copied, setCopied] = useState(false)

  // Get the correct code based on selected bookmaker
  const currentCode = selectedBookmaker === 'linebet' ? 'VISION221' : selectedBookmaker === '888starz' ? 'vision221' : 'VISION221'

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(currentCode) } catch {
      const ta = document.createElement('textarea')
      ta.value = currentCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      queueMicrotask(() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored === 'true') setAlreadyUnlocked(true)
        } catch {}
        setStep('conditions')
        setSelectedBookmaker(null)
        setPlayerId('')
        setVerificationError('')
      })
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleVerify = async () => {
    setVerificationError('')
    if (!selectedBookmaker) { setVerificationError('Sélectionne un bookmaker'); return }
    if (!playerId.trim()) { setVerificationError('Saisis ton ID joueur'); return }
    if (playerId.trim().length < 3) { setVerificationError('ID trop court (minimum 3 caractères)'); return }
    setIsUnlocking(true)
    try {
      const idHash = await sha256(selectedBookmaker + ':' + playerId.trim())
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
        localStorage.setItem(ID_HASH_KEY, idHash)
        localStorage.setItem('bttsbet_vip_bookmaker', selectedBookmaker)
      } catch {}
      setTimeout(() => { setIsUnlocking(false); setStep('success') }, 1200)
    } catch { setVerificationError('Erreur de vérification. Réessaie.'); setIsUnlocking(false) }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          style={{ backgroundColor: '#080B12' }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              backgroundColor: '#080B12',
              border: '1px solid rgba(91, 127, 163, 0.30)',
              boxShadow: '0 24px 80px rgba(7, 17, 26, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: '#111722', border: '1px solid rgba(242, 247, 245,0.1)' }}
              aria-label="Fermer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7F4EE" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            {/* ═══ CONDITIONS STEP ═══ */}
            {step === 'conditions' && (
              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#111722', border: '1px solid rgba(199, 244, 100,0.3)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B7FA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-papier">{title}</h3>
                    <p className="text-[11px] text-[#9BA7B8]">3 étapes pour accéder au VIP</p>
                  </div>
                </div>

                {alreadyUnlocked && (
                  <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(199, 244, 100,0.1)', border: '1px solid rgba(199, 244, 100,0.3)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B7FA3" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-xs text-[#5B7FA3] font-semibold">Tu as déjà débloqué le VIP.</span>
                  </div>
                )}

                {/* Step 1 — Bookmaker + Code promo copiable */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#111722', color: '#5B7FA3', border: '1px solid rgba(199, 244, 100,0.3)' }}>1</span>
                    <span className="text-sm font-semibold text-papier">Choisis ton bookmaker</span>
                  </div>

                  {/* Big copyable code promo — always visible */}
                  <button
                    onClick={copyCode}
                    className="w-full mb-3 p-4 rounded-xl flex items-center justify-between transition-all"
                    style={{
                      backgroundColor: '#111722',
                      border: '1px solid rgba(91, 127, 163, 0.30)',
                      boxShadow: copied ? '0 0 20px rgba(199, 244, 100, 0.2)' : 'none',
                    }}
                    aria-label={`Copier le code promo ${currentCode}`}
                  >
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: '#9BA7B8' }}>
                        Code promo {selectedBookmaker === '888starz' ? '(minuscules)' : '(majuscules)'}
                      </div>
                      <div className="font-mono text-2xl font-black tracking-[0.1em]" style={{ color: '#5B7FA3' }}>
                        {currentCode}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ backgroundColor: copied ? 'rgba(199, 244, 100, 0.15)' : 'rgba(199, 244, 100, 0.1)' }}>
                      {copied ? (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B7FA3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><span className="text-xs font-bold text-[#5B7FA3]">Copié !</span></>
                      ) : (
                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B7FA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg><span className="text-xs font-bold text-[#5B7FA3]">Copier</span></>
                      )}
                    </div>
                  </button>

                  {/* Linebet */}
                  <button
                    type="button"
                    onClick={() => setSelectedBookmaker('linebet')}
                    className="w-full p-3 rounded-lg text-left mb-2 transition-all"
                    style={{
                      backgroundColor: selectedBookmaker === 'linebet' ? 'rgba(199, 244, 100, 0.15)' : 'rgba(242, 247, 245, 0.05)',
                      border: selectedBookmaker === 'linebet' ? '1px solid #5B7FA3' : '1px solid #9BA7B8',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-papier">Linebet</span>
                          {selectedBookmaker === 'linebet' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B7FA3" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5B7FA3]">
                          Code : <span className="font-mono font-bold text-[#5B7FA3]">VISION221</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'rgba(199, 244, 100, 0.1)', color: '#5B7FA3' }}>Bonus exclusif</span>
                    </div>
                  </button>

                  {/* 888starz */}
                  <button
                    type="button"
                    onClick={() => setSelectedBookmaker('888starz')}
                    className="w-full p-3 rounded-lg text-left transition-all"
                    style={{
                      backgroundColor: selectedBookmaker === '888starz' ? 'rgba(199, 244, 100, 0.15)' : 'rgba(242, 247, 245, 0.05)',
                      border: selectedBookmaker === '888starz' ? '1px solid #5B7FA3' : '1px solid #9BA7B8',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-papier">888starz</span>
                          {selectedBookmaker === '888starz' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B7FA3" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5B7FA3]">
                          Code : <span className="font-mono font-bold text-[#5B7FA3]">vision221</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'rgba(199, 244, 100, 0.1)', color: '#5B7FA3' }}>Bonus exclusif</span>
                    </div>
                  </button>
                </div>

                {/* Step 2 — Deposit */}
                <div className="mb-4 flex gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#111722', color: '#5B7FA3', border: '1px solid rgba(199, 244, 100,0.3)' }}>2</span>
                  <div className="text-sm text-[#5B7FA3]">
                    Effectue un <span className="text-papier font-semibold">dépôt minimum de 3 000 XOF</span> avec le code promo.
                  </div>
                </div>

                {/* Step 3 — ID */}
                <div className="mb-4 flex gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#111722', color: '#5B7FA3', border: '1px solid rgba(199, 244, 100,0.3)' }}>3</span>
                  <div className="text-sm text-[#5B7FA3]">
                    <span className="text-papier font-semibold">Vérifie ton ID joueur</span> ci-dessous.
                    <span className="block mt-1 text-[10px] text-[#9BA7B8]">🔒 Aucune donnée collectée — vérifié localement (SHA-256) dans ton navigateur.</span>
                  </div>
                </div>

                {/* ID input */}
                <div className="mb-4">
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-[#9BA7B8] mb-2">
                    ID joueur {selectedBookmaker ? `(${selectedBookmaker})` : ''}
                  </label>
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder={selectedBookmaker ? `Ton ID ${selectedBookmaker}` : 'Sélectionne un bookmaker ↑'}
                    disabled={!selectedBookmaker}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-papier"
                    style={{
                      backgroundColor: '#111722',
                      border: selectedBookmaker ? '1px solid rgba(242, 247, 245,0.12)' : '1px solid #9BA7B8',
                      opacity: selectedBookmaker ? 1 : 0.5,
                    }}
                  />
                  {verificationError && <p className="text-[11px] text-[#5B7FA3] mt-1.5">{verificationError}</p>}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {selectedBookmaker === 'linebet' && (
                    <a href={AFFILIATE.linebet} rel="sponsored nofollow noopener noreferrer" target="_blank"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold"
                      style={{ backgroundColor: '#5B7FA3', color: '#080B12' }}>
                      Inscription Linebet →
                    </a>
                  )}
                  {selectedBookmaker === '888starz' && (
                    <a href={AFFILIATE.star888} rel="sponsored nofollow noopener noreferrer" target="_blank"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold"
                      style={{ backgroundColor: '#5B7FA3', color: '#080B12' }}>
                      Inscription 888starz →
                    </a>
                  )}
                  <button
                    onClick={handleVerify}
                    disabled={isUnlocking || !selectedBookmaker || !playerId.trim()}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      backgroundColor: !selectedBookmaker || !playerId.trim() ? '#111722' : '#5B7FA3',
                      color: !selectedBookmaker || !playerId.trim() ? '#9BA7B8' : '#080B12',
                      cursor: !selectedBookmaker || !playerId.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isUnlocking ? 'Vérification…' : '✓ Vérifier mon ID'}
                  </button>
                </div>

                {/* Privacy */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#111722', border: '1px solid rgba(242, 247, 245, 0.08)' }}>
                  <p className="text-[10px] text-[#9BA7B8] leading-relaxed">
                    <span className="text-[#5B7FA3] font-semibold">Confidentialité totale :</span> ton ID n'est jamais envoyé à nos serveurs. Hashé localement (SHA-256) et stocké uniquement dans ton navigateur.
                  </p>
                </div>

                {/* WhatsApp support */}
                <a
                  href={`https://wa.me/15406704172?text=${encodeURIComponent("Bonjour, j'ai confirmé mon inscription et mon dépôt avec le code VISION221. Je veux débloquer mon accès VIP.")}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold mb-3"
                  style={{
                    backgroundColor: 'rgba(199, 244, 100, 0.1)',
                    border: '1px solid rgba(91, 127, 163, 0.30)',
                    color: '#5B7FA3',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#5B7FA3"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01-1.87-1.87-4.36-2.91-7.01-2.91zm0 1.67c2.2 0 4.27.86 5.82 2.42 1.56 1.56 2.42 3.63 2.42 5.82 0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.81-1.29-1.24-2.79-1.24-4.34 0-4.54 3.7-8.24 8.24-8.24z"/></svg>
                  Déjà inscrit ? Débloque via WhatsApp
                </a>

                {/* Footer */}
                <p className="text-[10px] text-[#9BA7B8] text-center mt-3">
                  18+ | Jeu responsable | Aucune donnée collectée
                </p>
              </div>
            )}

            {/* ═══ SUCCESS STEP ═══ */}
            {step === 'success' && (
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(199, 244, 100,0.1)', border: '2px solid #5B7FA3' }}
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5B7FA3" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </motion.div>
                <h3 className="text-xl font-bold text-papier mb-2">VIP débloqué ! 🎉</h3>
                <p className="text-sm text-[#5B7FA3] mb-4">
                  Ton ID <span className="font-mono text-[#5B7FA3]">{playerId.slice(0, 4)}•••••</span> a été vérifié chez{' '}
                  <span className="text-papier font-semibold">{selectedBookmaker === 'linebet' ? 'Linebet' : '888starz'}</span>.
                </p>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: '#5B7FA3', color: '#080B12' }}
                >
                  Accéder aux pronostics VIP →
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
