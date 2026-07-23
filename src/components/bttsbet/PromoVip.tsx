'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, BOOKMAKERS, ANDROID_LOGO } from '@/lib/constants'
import { useScrollAnimation, useCountUp, useStaggerReveal } from '@/hooks/useAnimations'
import { CrownIcon, FloatingParticles } from './AnimatedIcons'

function VipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'info' | 'confirm'>('info')
  const [linebetId, setLinebetId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  // V23: Sélecteur de bookmaker — par défaut Linebet, mais l'utilisateur peut choisir 888starz
  const [selectedBookmaker, setSelectedBookmaker] = useState<'linebet' | '888starz'>('linebet')
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setStep('info')
        setLinebetId('')
        setSelectedBookmaker('linebet')
        setIsSubmitting(false)
        setSubmitSuccess(false)
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (step === 'confirm' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [step])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleSubmitId = async () => {
    if (!linebetId.trim()) return
    setIsSubmitting(true)

    await new Promise(r => setTimeout(r, 800))

    setSubmitSuccess(true)
    setIsSubmitting(false)

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
            <div className="bg-panel border border-gold/20 rounded-2xl shadow-2xl shadow-black/50">
              <div className="h-1 bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />

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
                  {step === 'info' && (
                    <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <div className="w-16 h-16 mx-auto bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold mb-5">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-2">
                        ACCÈS <span className="text-gold">VIP</span>
                      </h3>
                      <p className="text-gray-300 text-sm text-center mb-4 leading-relaxed">
                        Pour accéder aux pronostics VIP, vous devez d&apos;abord respecter ces conditions :
                      </p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-white/[0.06]">
                          <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">1. Créer un compte sur un bookmaker partenaire</p>
                            <p className="text-gray-400 text-xs mt-0.5">Utilisez le code promo <span className="text-gold font-bold">VISION221</span> lors de l&apos;inscription</p>
                            {/* V23: Sélecteur de bookmaker — Linebet OU 888starz */}
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <button
                                type="button"
                                onClick={() => setSelectedBookmaker('linebet')}
                                className={`flex flex-col items-center justify-center gap-1 text-xs font-bold px-3 py-2 rounded-lg border-2 transition-all ${
                                  selectedBookmaker === 'linebet'
                                    ? 'border-gold bg-gold/10 text-gold'
                                    : 'border-white/[0.08] text-gray-400 hover:border-gold/40'
                                }`}
                              >
                                <span className="flex items-center justify-center gap-1.5">
                                  <img src="/logos/linebet-icon.svg" alt="Linebet" className="w-5 h-5 rounded object-contain flex-shrink-0" loading="lazy"/>
                                  Linebet
                                </span>
                                <span className="text-[9px] font-normal opacity-70">Bonus 150$</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedBookmaker('888starz')}
                                className={`flex flex-col items-center justify-center gap-1 text-xs font-bold px-3 py-2 rounded-lg border-2 transition-all ${
                                  selectedBookmaker === '888starz'
                                    ? 'border-red-500 bg-red-500/10 text-red-400'
                                    : 'border-white/[0.08] text-gray-400 hover:border-red-500/40'
                                }`}
                              >
                                <span className="flex items-center justify-center gap-1.5">
                                  <img src="/logos/888starz-icon.svg" alt="888starz" className="w-5 h-5 rounded object-contain flex-shrink-0" loading="lazy"/>
                                  888starz
                                </span>
                                <span className="text-[9px] font-normal opacity-70">Bonus 100%</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-white/[0.06]">
                          <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">2. Déposer un minimum de 3 000 Fr</p>
                            <p className="text-gray-400 text-xs mt-0.5">Effectuez un premier dépôt de 3 000 Fr minimum sur votre compte {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-white/[0.06]">
                          <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">3. Confirmer votre inscription</p>
                            <p className="text-gray-400 text-xs mt-0.5">Entrez votre ID {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'} pour vérification et activation de votre accès VIP</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <button onClick={() => setStep('confirm')} className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-gold text-midnight text-xs">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Je me suis déjà inscrit
                        </button>
                        {/* V23: Lien d'inscription dynamique selon le bookmaker sélectionné */}
                        <a
                          href={selectedBookmaker === 'linebet' ? AFFILIATE.linebet : AFFILIATE.star888}
                          rel={AFFILIATE.rel}
                          target="_blank"
                          data-cursor="hover"
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-bold text-xs ${
                            selectedBookmaker === 'linebet'
                              ? 'btn-linebet text-[#04150C]'
                              : 'btn-star888 text-white'
                          }`}
                        >
                          <img
                            src={selectedBookmaker === 'linebet' ? '/logos/linebet.svg' : '/logos/888starz.svg'}
                            alt={selectedBookmaker === 'linebet' ? 'Linebet' : '888starz'}
                            className="h-4 w-auto rounded object-contain flex-shrink-0"
                            loading="lazy"
                          />
                          S&apos;inscrire sur {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'}
                        </a>
                      </div>
                      <p className="text-[10px] text-gray-600 mt-4 text-center">Bonus soumis aux conditions (mise x5, cote min. 1,40)</p>
                    </motion.div>
                  )}

                  {step === 'confirm' && !submitSuccess && (
                    <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                      <button onClick={() => setStep('info')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-5 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Retour
                      </button>
                      <div className="w-14 h-14 mx-auto bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white text-center mb-2">
                        CONFIRMEZ VOTRE INSCRIPTION
                      </h3>
                      <p className="text-gray-400 text-sm text-center mb-5 leading-relaxed">
                        Entrez votre identifiant {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'} pour que nous puissions vérifier votre inscription et activer votre accès VIP.
                      </p>
                      <div className="mb-4">
                        <label htmlFor="linebet-id" className="block text-xs text-gray-500 mb-1.5 font-medium">Votre ID {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'}</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/50" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
                            </svg>
                          </div>
                          <input ref={inputRef} id="linebet-id" type="text" value={linebetId} onChange={(e) => setLinebetId(e.target.value)} placeholder="Ex : 123456789"
                            className="w-full bg-midnight/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                            onKeyDown={(e) => { if (e.key === 'Enter' && linebetId.trim()) handleSubmitId() }}
                          />
                        </div>
                      </div>
                      <button onClick={handleSubmitId} disabled={!linebetId.trim() || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-gold text-midnight text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        data-cursor="hover">
                        {isSubmitting ? (
                          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Vérification en cours...</>
                        ) : 'Envoyer et rejoindre le VIP'}
                      </button>
                    </motion.div>
                  )}

                  {step === 'confirm' && submitSuccess && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="text-center py-4">
                      <div className="w-16 h-16 mx-auto bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mb-2">DEMANDE ENVOYÉE !</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Votre ID a été enregistré. Nous vérifierons votre inscription {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'} et vous recevrez votre accès VIP sous peu.</p>
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

function VipTeamLogo({ src, name, size = 20 }: { src: string; name: string; size?: number }) {
  const [imgOk, setImgOk] = useState(true)
  const initials = name?.slice(0, 2).toUpperCase() || '?'
  if (!src || !imgOk) {
    return (
      <div className="rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center text-gold/60 font-bold flex-shrink-0" style={{ width: size, height: size, fontSize: size * 0.4 }}>
        {initials}
      </div>
    )
  }
  return (
    <img src={src} alt={name} className="rounded-full object-contain flex-shrink-0" style={{ width: size, height: size }} loading="lazy" onError={() => setImgOk(false)} />
  )
}

function VipCouponRow({ match, league, time, homeLogo, awayLogo, homeTeam, awayTeam, cote, index }: {
  match: string; league: string; time: string; homeLogo: string; awayLogo: string; homeTeam: string; awayTeam: string; cote: number; index: number
}) {
  return (
    <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`v31-cascade-row v31-card-hover-glow relative flex items-center gap-2 sm:gap-2.5 bg-midnight/50 rounded-lg px-2.5 sm:px-3 py-2 border border-gold/8 hover:border-gold/20 transition-colors`}
      style={{ animationDelay: `${0.15 + index * 0.08}s` }}
    >
      <span className="text-[10px] sm:text-xs text-gold/60 font-mono tabular-nums w-9 text-center flex-shrink-0">{time}</span>
      <div className="flex items-center gap-1.5 flex-1 min-w-0 blur-[4px] select-none">
        <VipTeamLogo src={homeLogo} name={homeTeam} size={18} />
        <span className="text-white text-[11px] sm:text-sm font-semibold truncate">{homeTeam}</span>
        <span className="text-gray-500 text-[10px] font-bold flex-shrink-0">vs</span>
        <span className="text-white text-[11px] sm:text-sm font-semibold truncate">{awayTeam}</span>
        <VipTeamLogo src={awayLogo} name={awayTeam} size={18} />
      </div>
      <span className="hidden sm:block text-gray-600 text-[10px] flex-shrink-0 max-w-[90px] truncate">{league}</span>
      <span className="text-[10px] sm:text-xs text-gold font-bold bg-gold/10 border border-gold/15 rounded px-1.5 py-0.5 flex-shrink-0 tabular-nums blur-[3px] select-none">{cote.toFixed(2)}</span>
      <div className="relative flex items-center flex-shrink-0">
        <div className="blur-[4px] select-none">
          <span className="text-gold text-[10px] sm:text-xs font-bold px-1.5 py-0.5 bg-gold/10 rounded">BTTS</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold/70">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

const FEATURE_ICONS = {
  bonus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  instant: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  mobile: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  secure: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
}

// Generate a deterministic daily cote between 15 and 30 based on the date
function getDailyCote(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  // Simple deterministic pseudo-random from seed
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const fraction = x - Math.floor(x)
  return Math.round((15 + fraction * 15) * 100) / 100 // between 15.00 and 30.00
}

export default function PromoVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [staggerRef] = useStaggerReveal()
  const [showVipModal, setShowVipModal] = useState(false)
  const [vipMatches, setVipMatches] = useState<Array<Record<string, unknown>>>([])
  const [couponDate, setCouponDate] = useState('')
  const [todayFormatted, setTodayFormatted] = useState('')
  const dailyCote = useMemo(() => getDailyCote(), [])

  // Count-up for daily cote — animates when section enters viewport
  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1600, { decimals: 2, threshold: 0.3 })
  // Count-up for VIP match count
  const vipMatchCount = vipMatches.length
  const [matchCountRef, matchCountDisplay] = useCountUp(vipMatchCount, 1200, { threshold: 0.3 })
  // Count-up for VIP accuracy (~89%)
  const [accuracyRef, accuracyDisplay] = useCountUp(89, 1800, { threshold: 0.3, from: 0 })

  useEffect(() => {
    const formatDate = () => {
      const now = new Date()
      const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' })
      const dayNum = now.getDate()
      const monthName = now.toLocaleDateString('fr-FR', { month: 'long' })
      const year = now.getFullYear()
      return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
    }
    queueMicrotask(() => setTodayFormatted(formatDate()))
  }, [])

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) return
        const matchMap = new Map()
        for (const p of data.predictions) {
          const key = p.matchSemantic || p.match
          if (!matchMap.has(key)) {
            const [home, away] = p.match.split(' vs ')
            matchMap.set(key, {
              match: p.match, homeTeam: home?.trim() || '', awayTeam: away?.trim() || '',
              league: p.league, date: p.date, time: p.time,
              homeLogo: p.homeLogo || '', awayLogo: p.awayLogo || '', predictions: [p],
            })
          } else {
            matchMap.get(key).predictions.push(p)
          }
        }
        const today = new Date().toISOString().slice(0, 10)
        const allMatches = [...matchMap.values()]
          .sort((a: Record<string, string>, b: Record<string, string>) => {
            const aToday = a.date === today ? 0 : 1; const bToday = b.date === today ? 0 : 1
            if (aToday !== bToday) return aToday - bToday
            if (a.date !== b.date) return a.date.localeCompare(b.date)
            return (a.time || '').localeCompare(b.time || '')
          })
          .slice(0, 10)
        const matchCount = allMatches.length || 1
        const cotePerMatch = Math.pow(dailyCote, 1 / matchCount)
        const vipData = allMatches.map((m: Record<string, unknown>, i: number) => ({ ...m, cote: cotePerMatch, confidence: 92 + (i % 6), index: i }))
        setVipMatches(vipData)
        const todayMatches = allMatches.filter((m: Record<string, string>) => m.date === today)
        if (todayMatches.length > 0) setCouponDate("Aujourd'hui")
        else if (allMatches.length > 0) setCouponDate(allMatches[0].date)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <section ref={ref} id="vip" className="section-entrance morph-glow py-10 sm:py-16 px-4 relative overflow-hidden">
        {/* Premium background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-gold/4 rounded-full blur-[140px] opacity-60" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[350px] bg-gold/3 rounded-full blur-[120px] opacity-60" />
        </div>
        <FloatingParticles count={10} />

        <div className="max-w-5xl mx-auto relative">
          {/* Section Header with Crown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="flex justify-center mb-2">
              <CrownIcon size={44} />
            </div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">Zone Premium</span>
            <h2 className="section-title font-bold text-white mt-1 tracking-tight">
              PRONOSTICS <span className="text-gold neon-underline">VIP</span>
            </h2>
          </motion.div>

          <div className="bento-grid">
            {/* VIP Coupon */}
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined} transition={{ duration: 0.6 }}
              className="v31-vip-lab-glow holo-border bento-main relative squircle-lg glass-vip shimmer-card hover-ripple overflow-hidden hover-lift shadow-2xl">
              {/* Premium top sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold" />
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-gold/4 rounded-full blur-[100px] animate-pulse-gold" />
              <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-gold/3 rounded-full blur-[80px]" />

              <div className="relative p-5 sm:p-7">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 bg-gold/10 border border-gold/20 squircle flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src="/logos/sport-football.svg" alt="Football" className="w-8 h-8 object-contain" loading="lazy"/>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        PRONOSTICS <span className="text-gold">EXPERTS</span>
                      </h3>
                      <p className="text-[10px] text-gold/60 font-medium tracking-[0.15em] uppercase">Contenu exclusif verrouillé</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-2.5 py-1">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                    <span className="text-[10px] text-gold font-semibold">LIVE</span>
                  </div>
                </div>

                {todayFormatted && (
                  <div className="flex items-center gap-2 mb-4 bg-gold/5 border border-gold/10 rounded-lg px-3 py-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/60 flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="text-xs text-gold/80 font-semibold tracking-wide">{todayFormatted}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-gold/8">
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span className="text-[11px] text-gray-400"><span ref={matchCountRef} className="text-white font-semibold tabular-nums">{matchCountDisplay}</span> matchs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span className="text-[11px] text-gray-400">{couponDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <span className="text-[11px] text-gray-400">Cote <span ref={coteRef} className="text-gold font-bold tabular-nums">{coteDisplay}</span></span>
                    <span className="trust-badge">VIP Vérifié</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span className="text-[11px] text-gray-400">Précision <span ref={accuracyRef} className="text-gold font-bold tabular-nums">~{accuracyDisplay}%</span></span>
                  </div>
                </div>

                <div ref={staggerRef} className="stagger-scale">
                <div className="space-y-1 mb-4 max-h-[340px] overflow-y-auto scrollbar-none">
                  {vipMatches.length > 0 ? (
                    vipMatches.map((m, i) => (
                      <VipCouponRow key={i} match={m.match as string} league={m.league as string} time={m.time as string} homeLogo={m.homeLogo as string} awayLogo={m.awayLogo as string} homeTeam={m.homeTeam as string} awayTeam={m.awayTeam as string} cote={m.cote as number} index={i} />
                    ))
                  ) : (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 bg-midnight/50 rounded-lg px-3 py-2 border border-gold/8 animate-pulse">
                        <div className="w-9 h-3 bg-gold/10 rounded" />
                        <div className="flex-1 h-3 bg-gold/10 rounded" />
                        <div className="w-10 h-3 bg-gold/10 rounded" />
                      </div>
                    ))
                  )}
                </div>
                </div>

                <div className="flex items-center justify-between bg-gold/5 border border-gold/10 rounded-lg px-3 py-2 mb-5">
                  <span className="text-[11px] text-gray-500 font-medium">Cote totale du coupon</span>
                  <span className="text-sm text-gold font-bold tabular-nums">{coteDisplay}</span>
                </div>

                <button onClick={() => setShowVipModal(true)}
                  className="v31-breathing v31-cta-wave relative flex items-center justify-center gap-2 px-4 py-2 btn-gold text-midnight text-xs w-full cursor-pointer overflow-hidden group/btn"
                  style={{ ['--v31-wave-delay' as string]: '3s' }}
                  data-cursor="hover">
                  <img src="/logos/sport-football.svg" alt="" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy"/>
                  <span>Débloquer le VIP</span>
                </button>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/40"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <p className="v31-blink text-[10px] sm:text-[11px] text-gold/40 font-medium">Accès limité — <span className="text-gold/60">places restantes aujourd&apos;hui</span></p>
                </div>
              </div>
            </motion.div>

            {/* Promo Section — fintech-style offer card */}
            <motion.div initial={{ opacity: 0, x: 20, scale: 0.97 }} animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : undefined} transition={{ duration: 0.5, delay: 0.1 }}
              className="bento-side relative squircle-lg card-elevate border border-gold/25 overflow-hidden hover-lift shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(50, 176, 200, 0.08) 0%, rgba(15, 21, 37, 0.95) 40%, rgba(245, 165, 36, 0.06) 100%)',
              }}>
              {/* Premium top sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gold/4 rounded-full blur-[80px]" />
              <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-gold/4 rounded-full blur-[80px]" />

              <div className="relative p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-5">
                  {/* Gift icon — large */}
                  <div className="w-14 h-14 bg-gradient-to-br from-gold/15 to-gold/10 border border-gold/20 squircle-lg flex items-center justify-center text-gold">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      BONUS <span className="text-gold">EXCLUSIF</span>
                    </h3>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Inscrivez-vous avec le code promo et recevez jusqu&apos;à 150$ sur votre premier dépôt.
                </p>

                {/* Bonus amount — large display */}
                <div className="bg-midnight/60 border border-edge squircle p-4 mb-4 text-center relative overflow-hidden" role="text" aria-label={`Code promo: ${SITE.promoCode}`}>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="text-xs text-gray-500 mb-1">Code promo exclusif</div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-[0.2em] promo-code-shimmer">{SITE.promoCode}</div>
                </div>

                <div className={`grid grid-cols-2 gap-2.5 mb-6 stagger-reveal ${isVisible ? 'is-visible' : ''}`}>
                  {[
                    { icon: 'bonus', label: 'Bonus 150$' },
                    { icon: 'instant', label: 'Dépôt instantané' },
                    { icon: 'mobile', label: 'App mobile' },
                    { icon: 'secure', label: 'Paiement sécurisé' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge">
                      <span className="text-gold flex-shrink-0">{FEATURE_ICONS[f.icon as keyof typeof FEATURE_ICONS]}</span>
                      <span className="text-xs text-gray-400">{f.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <a href={AFFILIATE.linebet} rel={AFFILIATE.rel} target="_blank" className="v31-cta-wave cta-glow flex-1 flex items-center justify-center gap-2 px-3 py-2 btn-linebet text-[#04150C] text-xs" style={{ ['--v31-wave-delay' as string]: '2s' }} data-cursor="hover">
                    <img src="/logos/linebet.svg" alt="Linebet" className="h-4 w-auto object-contain flex-shrink-0" loading="lazy"/>
                  </a>
                  {/* V23: Nouveau bouton 888starz à côté de Linebet */}
                  <a href={AFFILIATE.star888} rel={AFFILIATE.rel} target="_blank" className="v31-cta-wave cta-glow flex-1 flex items-center justify-center gap-2 px-3 py-2 btn-star888 text-white text-xs" style={{ ['--v31-wave-delay' as string]: '6s' }} data-cursor="hover">
                    <img src="/logos/888starz.svg" alt="888starz" className="h-4 w-auto object-contain flex-shrink-0" loading="lazy"/>
                  </a>
                </div>
                {/* V23: Lien de téléchargement pour les deux bookmakers — logo Android + nom du bookmaker */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <a href={AFFILIATE.linebetDownload} rel={AFFILIATE.rel} target="_blank" className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-edge text-white font-semibold rounded-full text-[11px] hover:bg-white/[0.04] transition-all bg-white/[0.02]">
                    <img src={ANDROID_LOGO} alt="Android" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy"/>
                    APK Linebet
                  </a>
                  <a href={AFFILIATE.star888Download} rel={AFFILIATE.rel} target="_blank" className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-edge text-white font-semibold rounded-full text-[11px] hover:bg-white/[0.04] transition-all bg-white/[0.02]">
                    <img src={ANDROID_LOGO} alt="Android" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy"/>
                    APK 888starz
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <VipModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />
    </>
  )
}
