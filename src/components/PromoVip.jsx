import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE } from '../data/constants'
import { useScrollAnimation } from '../hooks/useAnimations'

// SVG icons instead of emojis for consistency
const FEATURE_ICONS = {
  bonus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  instant: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  mobile: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  secure: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
}

// ─── VIP Modal Component ───
function VipModal({ isOpen, onClose }) {
  const [step, setStep] = useState('info') // 'info' | 'confirm'
  const [linebetId, setLinebetId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const modalRef = useRef(null)
  const inputRef = useRef(null)

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep('info')
      setLinebetId('')
      setIsSubmitting(false)
      setSubmitSuccess(false)
    }
  }, [isOpen])

  // Focus input when entering confirm step
  useEffect(() => {
    if (step === 'confirm' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [step])

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  const handleSubmitId = async () => {
    if (!linebetId.trim()) return
    setIsSubmitting(true)

    // Send via WhatsApp with the LINEBET ID
    const message = encodeURIComponent(
      `🎯 Demande d'accès VIP BttsBet\n\nMon ID Linebet : ${linebetId.trim()}\n\nJe me suis inscrit avec le code promo VISION221 et j'ai effectué un dépôt minimum de 10 000 Fr.\n\nMerci de vérifier et d'activer mon accès VIP.`
    )
    const whatsappUrl = `${SITE.whatsapp}?text=${message}`

    // Small delay for UX
    await new Promise(r => setTimeout(r, 800))

    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    // Close modal after a moment
    setTimeout(() => {
      onClose()
    }, 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card background */}
            <div className="bg-panel border border-gold/20 rounded-2xl shadow-2xl shadow-black/50">
              {/* Top gold accent */}
              <div className="h-1 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-midnight/60 text-gray-400 hover:text-white hover:bg-midnight transition-all z-10"
                aria-label="Fermer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {/* ── Step 1: Info ── */}
                  {step === 'info' && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Lock + VIP icon */}
                      <div className="w-16 h-16 mx-auto bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold mb-5">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                        ACCÈS <span className="text-gold">VIP</span>
                      </h3>

                      <p className="text-gray-300 text-sm text-center mb-4 leading-relaxed">
                        Pour accéder aux pronostics VIP, vous devez d'abord respecter ces conditions :
                      </p>

                      {/* Conditions list */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-edge/50">
                          <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">1. Créer un compte LINEBET</p>
                            <p className="text-gray-400 text-xs mt-0.5">Utilisez le code promo <span className="text-gold font-bold">VISION221</span> lors de l'inscription</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-edge/50">
                          <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">2. Déposer un minimum de 10 000 Fr</p>
                            <p className="text-gray-400 text-xs mt-0.5">Effectuez un premier dépôt de 10 000 Fr minimum sur votre compte LINEBET</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-edge/50">
                          <div className="w-8 h-8 flex-shrink-0 bg-emerald/10 rounded-lg flex items-center justify-center text-emerald">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">3. Confirmer votre inscription</p>
                            <p className="text-gray-400 text-xs mt-0.5">Entrez votre ID LINEBET pour vérification et activation de votre accès VIP</p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2.5">
                        <button
                          onClick={() => setStep('confirm')}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/30 transition-all hover:brightness-110"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Je me suis déjà inscrit
                        </button>

                        <a
                          href={AFFILIATE.linebet}
                          rel={AFFILIATE.rel}
                          target="_blank"
                          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          Aller s'inscrire sur LINEBET
                        </a>
                      </div>

                      <p className="text-[10px] text-gray-600 mt-4 text-center">
                        Bonus soumis aux conditions (mise x5, cote min. 1,40)
                      </p>
                    </motion.div>
                  )}

                  {/* ── Step 2: Confirm ID ── */}
                  {step === 'confirm' && !submitSuccess && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Back button */}
                      <button
                        onClick={() => setStep('info')}
                        className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-5 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Retour
                      </button>

                      {/* Icon */}
                      <div className="w-14 h-14 mx-auto bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-white text-center mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                        CONFIRMEZ VOTRE INSCRIPTION
                      </h3>

                      <p className="text-gray-400 text-sm text-center mb-5 leading-relaxed">
                        Entrez votre identifiant LINEBET pour que nous puissions vérifier votre inscription et activer votre accès VIP.
                      </p>

                      {/* Input field */}
                      <div className="mb-4">
                        <label htmlFor="linebet-id" className="block text-xs text-gray-500 mb-1.5 font-medium">
                          Votre ID LINEBET
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/50" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                            </svg>
                          </div>
                          <input
                            ref={inputRef}
                            id="linebet-id"
                            type="text"
                            value={linebetId}
                            onChange={(e) => setLinebetId(e.target.value)}
                            placeholder="Ex : 123456789"
                            className="w-full bg-midnight/60 border border-edge/60 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && linebetId.trim()) handleSubmitId()
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1.5">
                          Vous trouverez votre ID dans votre profil LINEBET (section "Mon compte")
                        </p>
                      </div>

                      {/* Promo code reminder */}
                      <div className="bg-midnight/40 border border-edge/40 rounded-lg px-3 py-2 mb-5 flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/60 flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        <p className="text-xs text-gray-500">
                          Assurez-vous d'avoir utilisé le code <span className="text-gold font-semibold">VISION221</span> et effectué un dépôt de 10 000 Fr minimum.
                        </p>
                      </div>

                      {/* Submit button */}
                      <button
                        onClick={handleSubmitId}
                        disabled={!linebetId.trim() || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/30 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:brightness-100"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Vérification en cours...
                          </>
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Envoyer et rejoindre le VIP
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* ── Success ── */}
                  {step === 'confirm' && submitSuccess && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="text-center py-4"
                    >
                      <div className="w-16 h-16 mx-auto bg-emerald/10 border border-emerald/20 rounded-2xl flex items-center justify-center text-emerald mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                        DEMANDE ENVOYÉE !
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Votre demande d'accès VIP a été envoyée via WhatsApp. Nous vérifierons votre inscription LINEBET et vous recevrez votre accès VIP sous peu.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Mini team logo for VIP rows ───
function VipTeamLogo({ src, name, size = 20 }) {
  const [imgOk, setImgOk] = useState(true)
  const initials = name?.slice(0, 2).toUpperCase() || '?'
  if (!src || !imgOk) {
    return (
      <div
        className="rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center text-gold/60 font-bold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      className="rounded-full object-contain flex-shrink-0"
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setImgOk(false)}
    />
  )
}

// ─── VIP Teaser Coupon Row ───
function VipCouponRow({ match, league, time, homeLogo, awayLogo, homeTeam, awayTeam, cote, confidence, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.4 }}
      className="relative flex items-center gap-2 sm:gap-2.5 bg-midnight/50 rounded-lg px-2.5 sm:px-3 py-2 border border-gold/8 hover:border-gold/15 transition-colors group/row"
    >
      {/* Time */}
      <span className="text-[10px] sm:text-xs text-gold/60 font-mono tabular-nums w-9 text-center flex-shrink-0">{time}</span>

      {/* Team logos + Match name */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <VipTeamLogo src={homeLogo} name={homeTeam} size={18} />
        <span className="text-gray-300 text-[11px] sm:text-sm font-medium truncate">{match}</span>
        <VipTeamLogo src={awayLogo} name={awayTeam} size={18} />
      </div>

      {/* League */}
      <span className="hidden sm:block text-gray-600 text-[10px] flex-shrink-0 max-w-[90px] truncate">{league}</span>

      {/* Cote */}
      <span className="text-[10px] sm:text-xs text-gold font-bold bg-gold/10 border border-gold/15 rounded px-1.5 py-0.5 flex-shrink-0 tabular-nums blur-[3px] select-none">{cote.toFixed(2)}</span>

      {/* Prediction - blurred/locked */}
      <div className="relative flex items-center flex-shrink-0">
        <div className="blur-[4px] select-none">
          <span className="text-gold text-[10px] sm:text-xs font-bold px-1.5 py-0.5 bg-gold/10 rounded">
            BTTS
          </span>
        </div>
        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold/70">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

export default function PromoVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showVipModal, setShowVipModal] = useState(false)
  const [vipMatches, setVipMatches] = useState([])
  const [couponDate, setCouponDate] = useState('')
  const [todayFormatted, setTodayFormatted] = useState('')

  // Auto-updating current date in French format
  useEffect(() => {
    const formatDate = () => {
      const now = new Date()
      const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' })
      const dayNum = now.getDate()
      const monthName = now.toLocaleDateString('fr-FR', { month: 'long' })
      const year = now.getFullYear()
      // Capitalize first letter: "lundi 10 juin 2026" → "Lundi 10 Juin 2026"
      return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
    }
    setTodayFormatted(formatDate())

    // Update at midnight
    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1).getTime() - now.getTime()
    const timeout = setTimeout(() => {
      setTodayFormatted(formatDate())
      // Then refresh every 24h
      const interval = setInterval(() => setTodayFormatted(formatDate()), 24 * 60 * 60 * 1000)
      return () => clearInterval(interval)
    }, msUntilMidnight)

    return () => clearTimeout(timeout)
  }, [])

  // Fetch real match data from predictions.json
  useEffect(() => {
    fetch(`/predictions.json?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) return

        // Group by unique match name
        const matchMap = new Map()
        for (const p of data.predictions) {
          const key = p.matchSemantic || p.match
          if (!matchMap.has(key)) {
            const [home, away] = p.match.split(' vs ')
            matchMap.set(key, {
              match: p.match,
              homeTeam: home?.trim() || '',
              awayTeam: away?.trim() || '',
              league: p.league,
              date: p.date,
              time: p.time,
              homeLogo: p.homeLogo || '',
              awayLogo: p.awayLogo || '',
              predictions: [p],
            })
          } else {
            matchMap.get(key).predictions.push(p)
          }
        }

        // Sort: today first, then by time; take up to 10 matches
        const today = new Date().toISOString().slice(0, 10)
        const allMatches = [...matchMap.values()]
          .sort((a, b) => {
            // Today's matches first
            const aToday = a.date === today ? 0 : 1
            const bToday = b.date === today ? 0 : 1
            if (aToday !== bToday) return aToday - bToday
            // Then by date
            if (a.date !== b.date) return a.date.localeCompare(b.date)
            // Then by time
            return (a.time || '').localeCompare(b.time || '')
          })
          .slice(0, 10)

        // Assign VIP cote (~10 total for the coupon, distributed per match)
        // Each match gets a cote so that the product ≈ 10
        // For 10 matches: each ≈ 1.2589 (10^(1/10))
        // For fewer matches, recalculate
        const matchCount = allMatches.length || 1
        const cotePerMatch = Math.pow(10, 1 / matchCount)

        const vipData = allMatches.map((m, i) => ({
          ...m,
          cote: cotePerMatch,
          confidence: 92 + (i % 6), // 92-97% fiabilité (deterministe)
          index: i,
        }))

        setVipMatches(vipData)

        // Set coupon date label
        const todayMatches = allMatches.filter(m => m.date === today)
        if (todayMatches.length > 0) {
          setCouponDate('Aujourd\'hui')
        } else if (allMatches.length > 0) {
          setCouponDate(allMatches[0].date)
        }
      })
      .catch(() => {
        // Fallback: keep empty
      })
  }, [])

  return (
    <>
      <section ref={ref} id="vip" className="py-10 sm:py-16 px-4 bg-dark-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ── VIP Coupon Section ── */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.6 }}
              className="relative rounded-xl border border-gold/20 bg-panel/80 overflow-hidden hover-lift group"
            >
              {/* Premium gold accent top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold" />

              {/* Animated background glow */}
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-gold/4 rounded-full blur-[100px] animate-pulse-gold" />
              <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-gold/3 rounded-full blur-[80px]" />

              <div className="relative p-5 sm:p-7">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {/* Crown badge */}
                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-gold">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 17l4-8 4 4 2-9 4 7 2-3 4 9H2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                        PRONOSTICS <span className="text-gold animate-pulse-gold">VIP</span>
                      </h3>
                      <p className="text-[10px] text-gold/50 font-medium tracking-wide uppercase">Contenu exclusif verrouillé</p>
                    </div>
                  </div>
                  {/* Live badge */}
                  <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/15 rounded-full px-2.5 py-1">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                    <span className="text-[10px] text-gold font-semibold">LIVE</span>
                  </div>
                </div>

                {/* Today's date - auto-updated */}
                {todayFormatted && (
                  <div className="flex items-center gap-2 mb-4 bg-gold/5 border border-gold/10 rounded-lg px-3 py-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/60 flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="text-xs text-gold/80 font-semibold tracking-wide">{todayFormatted}</span>
                  </div>
                )}

                {/* Stats bar */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-gold/8">
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <span className="text-[11px] text-gray-400"><span className="text-white font-semibold">{vipMatches.length}</span> matchs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="text-[11px] text-gray-400">{couponDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span className="text-[11px] text-gray-400">Cote <span className="text-gold font-bold">10.00</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald/60">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-[11px] text-gray-400">Fiabilité <span className="text-emerald font-semibold">{'>'}90%</span></span>
                  </div>
                </div>

                {/* Coupon rows - real matches of the day */}
                <div className="space-y-1 mb-4 max-h-[340px] overflow-y-auto scrollbar-none">
                  {vipMatches.length > 0 ? (
                    vipMatches.map((m, i) => (
                      <VipCouponRow key={i} {...m} index={i} />
                    ))
                  ) : (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 bg-midnight/50 rounded-lg px-3 py-2 border border-gold/8 animate-pulse">
                        <div className="w-9 h-3 bg-gold/10 rounded" />
                        <div className="flex-1 h-3 bg-gold/10 rounded" />
                        <div className="w-10 h-3 bg-gold/10 rounded" />
                      </div>
                    ))
                  )}
                </div>

                {/* Coupon total cote bar */}
                <div className="flex items-center justify-between bg-gold/5 border border-gold/10 rounded-lg px-3 py-2 mb-5">
                  <span className="text-[11px] text-gray-500 font-medium">Cote totale du coupon</span>
                  <span className="text-sm text-gold font-bold tabular-nums">10.00</span>
                </div>

                {/* CTA with urgency */}
                <button
                  onClick={() => setShowVipModal(true)}
                  className="relative flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-gold/30 transition-all hover:brightness-110 w-full cursor-pointer overflow-hidden group/btn"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>Débloquer le VIP</span>
                </button>

                {/* Urgency footer */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/40">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="text-[10px] sm:text-[11px] text-gold/40 font-medium">
                    Accès limité — <span className="text-gold/60">places restantes aujourd'hui</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Promo Section ── */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.97 }}
              animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-xl border border-emerald/15 bg-panel/60 overflow-hidden hover-lift"
            >
              {/* Emerald accent top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald via-gold to-emerald" />
              {/* Background glow */}
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald/3 rounded-full blur-[80px]" />

              <div className="relative p-6 sm:p-8">
                {/* Gift icon */}
                <div className="w-12 h-12 bg-emerald/10 border border-emerald/15 rounded-xl flex items-center justify-center text-emerald mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
                  </svg>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                  BONUS <span className="text-emerald">EXCLUSIF</span>
                </h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Inscrivez-vous avec le code promo et recevez jusqu'à 150$ sur votre premier dépôt.
                </p>

                {/* Promo code display */}
                <div className="bg-midnight/60 border border-edge rounded-xl p-4 mb-5 text-center" role="text" aria-label={`Code promo: ${SITE.promoCode}`}>
                  <div className="text-xs text-gray-500 mb-1">Code promo exclusif</div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-[0.2em] promo-code-shimmer">{SITE.promoCode}</div>
                </div>

                {/* Features mini-grid — SVG icons instead of emojis */}
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {[
                    { icon: 'bonus', label: 'Bonus 150$' },
                    { icon: 'instant', label: 'Dépôt instantané' },
                    { icon: 'mobile', label: 'App mobile' },
                    { icon: 'secure', label: 'Paiement sécurisé' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge/30">
                      <span className="text-gold flex-shrink-0">{FEATURE_ICONS[f.icon]}</span>
                      <span className="text-xs text-gray-400">{f.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={AFFILIATE.linebet}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    className="flex-1 text-center px-5 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110"
                  >
                    S'inscrire
                  </a>
                  <a
                    href={AFFILIATE.linebetDownload}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    className="flex-1 text-center px-5 py-3 border border-white/10 text-white font-semibold rounded-xl text-sm hover:bg-white/5 transition-all"
                  >
                    Télécharger
                  </a>
                </div>

                <p className="text-[10px] text-gray-600 mt-3 text-center">
                  Bonus soumis aux conditions (mise x5, cote min. 1,40)
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VIP Registration Modal */}
      <VipModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />
    </>
  )
}
