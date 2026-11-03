'use client'

/**
 * VipUnlockModal v2 (refonte 2026-11) — parcours de déblocage VIP.
 *
 * Corrections par rapport à la v1 :
 *  - PLUS de débordement mobile : max-h 86dvh, paddings réduits (p-4),
 *    une seule colonne, espace vertical resserré (le « trop de space » signalé).
 *  - Fond de la modale : scrim sombre (l'ancien fond blanc « flashait »).
 *  - Les 4 bookmakers du registre (lib/bookmakers.ts) — Linebet et 1xBet
 *    d'abord avec badge « prioritaire ». Codes/liens plus codés en dur.
 *  - Le code promo est affiché DANS chaque carte bookmaker (plus de bloc
 *    dupliqué au-dessus) + bouton copier compact.
 *  - CTA inscription contextuel + WhatsApp inchangés (tracking conservé).
 *  - framer-motion : simple fondu (plus de ressort spectaculaire).
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { BOOKMAKER_ORDER, getBookmaker, type BookmakerId } from '@/lib/bookmakers'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

const STORAGE_KEY = 'bttsbet_vip_unlocked'
const ID_HASH_KEY = 'bttsbet_vip_id_hash'

type Step = 'conditions' | 'success'

const WHATSAPP_NUMBER = '15406704172'

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
  title = 'Prépare ta demande VIP',
}: {
  isOpen: boolean
  onClose: () => void
  title?: string
}) {
  const [step, setStep] = useState<Step>('conditions')
  const [selectedBookmaker, setSelectedBookmaker] = useState<BookmakerId | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [alreadyUnlocked, setAlreadyUnlocked] = useState(false)
  const [copied, setCopied] = useState(false)

  const selected = selectedBookmaker ? getBookmaker(selectedBookmaker) : null

  const copyCode = async () => {
    if (!selected) return
    try { await navigator.clipboard.writeText(selected.promoCode) } catch {
      const ta = document.createElement('textarea')
      ta.value = selected.promoCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    trackAffiliateCodeCopy(selected.id, 'vip-modal-code')
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
        } catch { /* no-op */ }
        setStep('conditions')
        setSelectedBookmaker(null)
        setPlayerId('')
        setVerificationError('')
      })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleVerify = async () => {
    setVerificationError('')
    if (!selectedBookmaker) { setVerificationError('Sélectionne un bookmaker'); return }
    if (!playerId.trim()) { setVerificationError('Saisis ton ID joueur'); return }
    if (playerId.trim().length < 3) { setVerificationError('ID trop court (minimum 3 caractères)'); return }
    const b = getBookmaker(selectedBookmaker)
    setIsUnlocking(true)
    try {
      const idHash = await sha256(selectedBookmaker + ':' + playerId.trim())
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
        localStorage.setItem(ID_HASH_KEY, idHash)
        localStorage.setItem('bttsbet_vip_bookmaker', selectedBookmaker)
      } catch { /* no-op */ }
      const whatsappText = `Bonjour BTTSPredict, je souhaite demander la validation de mon accès VIP. Bookmaker: ${b.name}. ID joueur: ${playerId.trim()}. Code promo: ${b.promoCode}. Merci de confirmer les conditions applicables.`
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`
      setTimeout(() => {
        setIsUnlocking(false)
        setStep('success')
        window.location.assign(whatsappUrl)
      }, 900)
    } catch { setVerificationError('Erreur de vérification. Réessaie.'); setIsUnlocking(false) }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={handleBackdropClick}
          style={{ backgroundColor: 'rgba(5, 8, 12, 0.74)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full sm:max-w-[420px] max-h-[86dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
            style={{
              backgroundColor: '#10161D',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 24px 80px rgba(7, 17, 26, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Fermeture — cible 44 px */}
            <button
              onClick={onClose}
              className="absolute top-2.5 right-2.5 w-11 h-11 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              aria-label="Fermer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F2F6FA" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            {step === 'conditions' && (
              <div className="p-4 pb-5">
                {/* En-tête */}
                <div className="flex items-center gap-3 mb-4 pr-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(47, 125, 255, 0.10)', border: '1px solid rgba(47, 125, 255, 0.3)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F7DFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-papier leading-tight">{title}</h3>
                    <p className="text-[11px] text-[#9DABBB] mt-0.5">3 étapes, puis une demande WhatsApp</p>
                  </div>
                </div>

                {alreadyUnlocked && (
                  <div className="mb-3 p-2.5 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(47, 125, 255, 0.08)', border: '1px solid rgba(47, 125, 255, 0.25)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F7DFF" strokeWidth="2.5" flex-shrink-0><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-[11px] text-[#2F7DFF] font-semibold">Une demande VIP a déjà été préparée sur cet appareil.</span>
                  </div>
                )}

                {/* Étape 1 — bookmaker */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5.5 h-5.5 p-1 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: 'rgba(47,125,255,0.10)', color: '#2F7DFF', border: '1px solid rgba(47,125,255,0.3)' }}>1</span>
                    <span className="text-[13px] font-semibold text-papier">Choisis ton bookmaker et copie son code</span>
                  </div>

                  <div className="grid gap-2">
                    {BOOKMAKER_ORDER.map(id => {
                      const b = getBookmaker(id)
                      const isSelected = selectedBookmaker === id
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => { setSelectedBookmaker(id); setCopied(false) }}
                          className="w-full p-2.5 rounded-xl text-left transition-all"
                          style={{
                            backgroundColor: isSelected ? 'rgba(47, 125, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                            border: isSelected ? '1px solid #2F7DFF' : '1px solid rgba(255, 255, 255, 0.12)',
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="flex h-7 w-12 items-center justify-center rounded bg-white px-1.5 flex-shrink-0">
                                <img src={b.logo} alt="" width={96} height={30} className="max-h-5 w-auto object-contain" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[13px] font-bold text-papier leading-tight">{b.name}</span>
                                <span className="block text-[10.5px] text-[#9DABBB] leading-tight">
                                  Code : <span className="font-mono font-bold text-[#2F7DFF]">{b.promoCode}</span>
                                </span>
                              </span>
                              {isSelected && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F7DFF" strokeWidth="3" className="flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                              )}
                            </div>
                            {b.featured && (
                              <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)', color: '#34D399' }}>Prioritaire</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Copie du code du bookmaker sélectionné */}
                  {selected && (
                    <button
                      onClick={copyCode}
                      className="w-full mt-2 px-3 py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all"
                      style={{ backgroundColor: copied ? 'rgba(52, 211, 153, 0.12)' : 'rgba(47, 125, 255, 0.10)', border: '1px solid rgba(47, 125, 255, 0.35)', color: copied ? '#34D399' : '#2F7DFF' }}
                      aria-label={`Copier le code promo ${selected.promoCode}`}
                    >
                      {copied ? (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Code {selected.promoCode} copié !</>
                      ) : (
                        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> Copier le code {selected.promoCode}</>
                      )}
                    </button>
                  )}
                </div>

                {/* Étape 2 — dépôt */}
                <div className="mb-2 flex gap-2.5 items-start">
                  <span className="w-5.5 p-1 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: 'rgba(47,125,255,0.10)', color: '#2F7DFF', border: '1px solid rgba(47,125,255,0.3)' }}>2</span>
                  <div className="text-[13px] text-[#9DABBB] leading-snug">
                    Effectue un <span className="text-papier font-semibold">dépôt minimum de 3 000 XOF</span> avec le code promo.
                  </div>
                </div>

                {/* Étape 3 — ID */}
                <div className="mb-3 flex gap-2.5 items-start">
                  <span className="w-5.5 p-1 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: 'rgba(47,125,255,0.10)', color: '#2F7DFF', border: '1px solid rgba(47,125,255,0.3)' }}>3</span>
                  <div className="text-[13px] text-[#9DABBB] leading-snug">
                    <span className="text-papier font-semibold">Saisis ton ID joueur</span> pour préparer le message WhatsApp.
                    <span className="block mt-0.5 text-[10px] text-[#6B7A8C]">BTTSPredict ne reçoit pas ton ID : il est inclus dans le message WhatsApp que tu choisis d’envoyer.</span>
                  </div>
                </div>

                {/* ID input */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder={selected ? `Ton ID joueur ${selected.name}` : 'Sélectionne un bookmaker ↑'}
                    disabled={!selected}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-papier"
                    style={{
                      backgroundColor: '#0B1016',
                      border: selected ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(255, 255, 255, 0.08)',
                      opacity: selected ? 1 : 0.5,
                    }}
                    aria-label="ID joueur"
                  />
                  {verificationError && <p className="text-[11px] text-[#F87171] mt-1.5">{verificationError}</p>}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {selected && (
                    <a
                      href={selected.signup}
                      rel="sponsored nofollow noopener noreferrer"
                      target="_blank"
                      onClick={() => trackAffiliateAction(selected.id, 'signup_cta_click', 'vip-modal-signup')}
                      className="flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg text-[11.5px] font-bold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#F2F6FA', border: '1px solid rgba(255,255,255,0.14)' }}
                    >
                      Inscription {selected.name} →
                    </a>
                  )}
                  {!selected && (
                    <a
                      href={AFFILIATE.linebet}
                      rel="sponsored nofollow noopener noreferrer"
                      target="_blank"
                      onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'vip-modal-signup-default')}
                      className="flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg text-[11.5px] font-bold"
                      style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#F2F6FA', border: '1px solid rgba(255,255,255,0.14)' }}
                    >
                      Inscription Linebet →
                    </a>
                  )}
                  <button
                    onClick={handleVerify}
                    disabled={isUnlocking || !selectedBookmaker || !playerId.trim()}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11.5px] font-bold transition-all"
                    style={{
                      backgroundColor: !selectedBookmaker || !playerId.trim() ? 'rgba(255,255,255,0.04)' : '#2F7DFF',
                      color: !selectedBookmaker || !playerId.trim() ? '#6B7A8C' : '#FFFFFF',
                      cursor: !selectedBookmaker || !playerId.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isUnlocking ? 'Préparation…' : '✓ Préparer ma demande'}
                  </button>
                </div>

                {/* Support WhatsApp */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite demander la validation de mon accès VIP. Merci de confirmer les conditions applicables.')}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[11.5px] font-bold mt-2"
                  style={{
                    backgroundColor: 'rgba(47, 125, 255, 0.08)',
                    border: '1px solid rgba(47, 125, 255, 0.28)',
                    color: '#2F7DFF',
                  }}
                  onClick={() => trackAffiliateAction(selectedBookmaker ?? 'linebet', 'whatsapp_click', 'vip-modal-whatsapp')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#2F7DFF"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01-1.87-1.87-4.36-2.91-7.01-2.91zm0 1.67c2.2 0 4.27.86 5.82 2.42 1.56 1.56 2.42 3.63 2.42 5.82 0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.81-1.29-1.24-2.79-1.24-4.34 0-4.54 3.7-8.24 8.24-8.24z"/></svg>
                  Déjà inscrit ? Demander la vérification via WhatsApp
                </a>

                <p className="text-[10px] text-[#6B7A8C] text-center mt-3">
                  18+ | Jeu responsable | Aucune donnée collectée
                </p>
              </div>
            )}

            {/* ═══ ÉTAPE SUCCÈS ═══ */}
            {step === 'success' && (
              <div className="p-6 text-center">
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(52, 211, 153, 0.10)', border: '2px solid #34D399' }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 className="text-lg font-bold text-papier mb-2">Demande VIP préparée</h3>
                <p className="text-[13px] text-[#9DABBB] mb-4">
                  Ton message WhatsApp est prêt pour <span className="text-papier font-semibold">{selected?.name}</span>. La validation finale dépend du support et des conditions du partenaire.
                </p>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}
                >
                  Retourner à l’espace VIP →
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
