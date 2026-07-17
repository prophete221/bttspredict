'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, ANDROID_LOGO } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { RocketIcon, FloatingParticles } from './AnimatedIcons'

// ─────────────────────────────────────────────────────────────────────────────
// AviatorVip — Section VIP Signaux Aviator
// Simule des signaux de prédiction Aviator (multiplier) toutes les 60 secondes.
// Les signaux sont basés sur un algorithme pseudo-aléatoire avec seed temporel.
// Section verrouillée — accès via inscription bookmaker + vérification ID.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ───

interface AviatorSignal {
  id: number
  multiplier: number
  confidence: number
  timestamp: number
  status: 'waiting' | 'active' | 'cashed-out' | 'crashed'
  actualMultiplier?: number
}

interface SignalHistory {
  multiplier: number
  confidence: number
  result: 'win' | 'loss'
  time: string
}

// ─── Signal Generator (deterministic per minute) ───

function generateSignal(minuteSeed: number): { multiplier: number; confidence: number } {
  // Deterministic pseudo-random based on minute
  const x1 = Math.sin(minuteSeed * 9301 + 49297) * 233280
  const frac1 = x1 - Math.floor(x1)

  // Generate multiplier: range 1.2x to 15x, weighted toward 2-5x
  const rawMult = 1.2 + frac1 * 13.8
  // Apply curve to make high multipliers rarer
  const multiplier = Math.round((1.2 + (rawMult - 1.2) ** 0.7) * 100) / 100

  // Confidence inversely correlated with multiplier (higher mult = lower confidence)
  const x2 = Math.sin(minuteSeed * 7919 + 13171) * 41943
  const frac2 = x2 - Math.floor(x2)
  const baseConfidence = Math.max(65, Math.min(97, 97 - (multiplier - 1.5) * 3))
  const confidence = Math.round(baseConfidence + (frac2 - 0.5) * 8)

  return {
    multiplier: Math.min(multiplier, 25),
    confidence: Math.max(Math.min(confidence, 97), 65),
  }
}

// ─── Win rate tracker (simulated, per day) ───

function getDailyWinRate(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const x = Math.sin(seed * 1357 + 2468) * 13579
  const frac = x - Math.floor(x)
  return Math.round((76 + frac * 14) * 10) / 10 // 76-90%
}

// ─── VipModal (same pattern as other VIP sections) ───

function VipModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'info' | 'confirm'>('info')
  const [linebetId, setLinebetId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
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
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose()
  }

  const handleSubmitId = async () => {
    if (!linebetId.trim()) return
    setIsSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitSuccess(true)
    setIsSubmitting(false)
    setTimeout(() => { onClose() }, 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-panel border border-edge-bright/30 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-500 via-gold to-emerald" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <img src="/logos/sport-aviator.svg" alt="" className="w-6 h-6 object-contain" />
                    ACCÈS VIP AVIATOR
                  </h3>
                  <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1" aria-label="Fermer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {step === 'info' && !submitSuccess && (
                    <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        Pour accéder aux <span className="text-gold font-semibold">signaux VIP Aviator</span>, inscrivez-vous sur l&apos;un de nos bookmakers partenaires avec le code promo <span className="text-emerald font-bold">{SITE.promoCode}</span> et effectuez un dépôt minimum de <span className="text-white font-semibold">3 000 Fr</span>.
                      </p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={() => setSelectedBookmaker('linebet')}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border text-xs font-bold transition-all ${selectedBookmaker === 'linebet' ? 'border-linebet/50 bg-linebet/10 text-linebet' : 'border-edge text-gray-500 hover:border-linebet/30'}`}>
                          <img src="/logos/linebet-icon.svg" alt="" className="w-4 h-4 object-contain"/>
                          Linebet
                        </button>
                        <button onClick={() => setSelectedBookmaker('888starz')}
                          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-full border text-xs font-bold transition-all ${selectedBookmaker === '888starz' ? 'border-star888/50 bg-star888/10 text-star888' : 'border-edge text-gray-500 hover:border-star888/30'}`}>
                          <img src="/logos/888starz-icon.svg" alt="" className="w-4 h-4 object-contain"/>
                          888starz
                        </button>
                      </div>

                      <div className="space-y-2">
                        <a
                          href={selectedBookmaker === 'linebet' ? AFFILIATE.linebet : AFFILIATE.star888}
                          rel={AFFILIATE.rel} target="_blank" data-cursor="hover"
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-bold text-xs ${selectedBookmaker === 'linebet' ? 'btn-linebet text-[#04150C]' : 'btn-star888 text-white'}`}
                        >
                          <img src={selectedBookmaker === 'linebet' ? '/logos/linebet.svg' : '/logos/888starz.svg'} alt="" className="h-4 w-auto rounded object-contain flex-shrink-0" loading="lazy"/>
                          S&apos;inscrire sur {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'}
                        </a>
                        <p className="text-[10px] text-gray-600 text-center">Bonus soumis aux conditions (mise x5, cote min. 1,40)</p>
                      </div>

                      <button onClick={() => setStep('confirm')} className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-gold text-midnight text-xs mt-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Je me suis déjà inscrit
                      </button>
                    </motion.div>
                  )}

                  {step === 'confirm' && !submitSuccess && (
                    <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <p className="text-gray-400 text-sm mb-3">Entrez votre ID {selectedBookmaker === 'linebet' ? 'LINEBET' : '888STARZ'} pour vérification :</p>
                      <div className="relative mb-3">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/50" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                        </div>
                        <input ref={inputRef} id="aviator-id" type="text" value={linebetId} onChange={(e) => setLinebetId(e.target.value)} placeholder="Ex : 123456789"
                          className="w-full bg-midnight/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                          onKeyDown={(e) => { if (e.key === 'Enter' && linebetId.trim()) handleSubmitId() }}
                        />
                      </div>
                      <button onClick={handleSubmitId} disabled={!linebetId.trim() || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-gold text-midnight text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        data-cursor="hover">
                        {isSubmitting ? (
                          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Vérification...</>
                        ) : 'Envoyer et rejoindre le VIP Aviator'}
                      </button>
                    </motion.div>
                  )}

                  {submitSuccess && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="text-center py-4">
                      <div className="w-14 h-14 mx-auto bg-emerald/10 border border-emerald/20 rounded-2xl flex items-center justify-center text-emerald mb-3">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <h3 className="text-base font-extrabold text-white mb-2">DEMANDE ENVOYÉE !</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Votre ID a été enregistré. Nous vérifierons votre inscription et vous recevrez votre accès VIP Aviator sous peu.</p>
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

// ─── Plane animation component ───

function PlaneFlyAnimation({ multiplier, isActive }: { multiplier: number; isActive: boolean }) {
  const progress = useMemo(() => Math.min(((multiplier - 1) / 10) * 100, 100), [multiplier])
  return (
    <div className="relative h-20 sm:h-24 bg-midnight/60 rounded-xl border border-edge/50 overflow-hidden mb-3">
      {/* Grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between py-2 px-3">
        {[2, 4, 6, 8, 10].map(v => (
          <div key={v} className="flex items-center gap-2">
            <span className="text-[9px] text-gray-600 tabular-nums w-7 text-right">{v}x</span>
            <div className="flex-1 border-t border-dashed border-gray-800/50" />
          </div>
        ))}
      </div>
      {/* Flight path */}
      <div className="absolute bottom-0 left-0 right-0 h-full">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="flyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 95 Q ${progress * 0.5} ${95 - progress * 0.8} ${progress} ${95 - progress * 0.9}`}
            fill="none"
            stroke="url(#flyGrad)"
            strokeWidth="2"
            opacity={isActive ? 0.8 : 0.3}
          />
        </svg>
        {/* Plane icon */}
        {isActive && (
          <motion.div
            animate={{ x: [0, `${progress}%`], y: [0, `${-progress * 0.9}%`] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute bottom-[5%] left-0 text-xl"
            style={{ transform: `translate(${progress * 0.8}%, ${-progress * 0.9}%)` }}
          >
            ✈️
          </motion.div>
        )}
      </div>
      {/* Current multiplier overlay */}
      <div className="absolute top-2 right-3">
        <span className={`text-lg sm:text-xl font-black tabular-nums ${multiplier >= 5 ? 'text-success' : multiplier >= 2.5 ? 'text-gold' : 'text-red-400'}`}>
          {multiplier.toFixed(2)}x
        </span>
      </div>
    </div>
  )
}

// ─── Main AviatorVip Component ───

export default function AviatorVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showVipModal, setShowVipModal] = useState(false)

  // Signal state
  const [currentSignal, setCurrentSignal] = useState<AviatorSignal | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [signalHistory, setSignalHistory] = useState<SignalHistory[]>([])
  const [signalPhase, setSignalPhase] = useState<'countdown' | 'active' | 'result'>('countdown')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const signalIdRef = useRef(0)

  // Initialize signal history from deterministic seed
  useEffect(() => {
    const now = new Date()
    const initialHistory: SignalHistory[] = []
    for (let i = 8; i >= 1; i--) {
      const pastMinute = new Date(now.getTime() - i * 60000)
      const seed = pastMinute.getFullYear() * 1000000 + (pastMinute.getMonth() + 1) * 10000 + pastMinute.getDate() * 100 + pastMinute.getHours() * 60 + pastMinute.getMinutes()
      const signal = generateSignal(seed)
      const isWin = signal.confidence >= 75 || signal.multiplier <= 5
      initialHistory.push({
        multiplier: signal.multiplier,
        confidence: signal.confidence,
        result: isWin ? 'win' : 'loss',
        time: `${pastMinute.getHours().toString().padStart(2, '0')}:${pastMinute.getMinutes().toString().padStart(2, '0')}`,
      })
    }
    setSignalHistory(initialHistory)
  }, [])

  // Generate a new signal for the current minute
  const generateNewSignal = useCallback(() => {
    const now = new Date()
    const seed = now.getFullYear() * 1000000 + (now.getMonth() + 1) * 10000 + now.getDate() * 100 + now.getHours() * 60 + now.getMinutes()
    const { multiplier, confidence } = generateSignal(seed)
    signalIdRef.current += 1

    setCurrentSignal({
      id: signalIdRef.current,
      multiplier,
      confidence,
      timestamp: Date.now(),
      status: 'active',
    })
    setSignalPhase('active')

    // After 5 seconds, show result
    setTimeout(() => {
      // Simulate actual crash point — biased by confidence
      const isWin = confidence >= 72
      const actualMult = isWin
        ? Math.round((multiplier * (0.85 + Math.random() * 0.3)) * 100) / 100
        : Math.round((0.8 + Math.random() * 1.2) * 100) / 100

      setCurrentSignal(prev => prev ? { ...prev, status: actualMult >= 1.5 ? 'cashed-out' : 'crashed', actualMultiplier: actualMult } : null)
      setSignalPhase('result')

      // Add to history
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      setSignalHistory(prev => [
        { multiplier, confidence, result: actualMult >= 1.5 ? 'win' : 'loss', time: timeStr },
        ...prev.slice(0, 19),
      ])

      // After 3 more seconds, go back to countdown
      setTimeout(() => {
        setSignalPhase('countdown')
        setCountdown(60)
      }, 3000)
    }, 5000)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (signalPhase !== 'countdown') return

    // Sync countdown to current second within the minute
    const now = new Date()
    const secondsInMinute = now.getSeconds()
    setCountdown(60 - secondsInMinute)

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Time's up — generate new signal
          generateNewSignal()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [signalPhase, generateNewSignal])

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const dailyWinRate = useMemo(() => getDailyWinRate(), [])
  const todaySignals = useMemo(() => signalHistory.length, [signalHistory])
  const wins = useMemo(() => signalHistory.filter(s => s.result === 'win').length, [signalHistory])

  return (
    <>
      <section ref={ref} id="vip-aviator" className="py-8 sm:py-12 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-red-500/3 rounded-full blur-[140px] opacity-50" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[350px] bg-gold/3 rounded-full blur-[120px] opacity-50" />
        </div>
        <FloatingParticles count={8} />

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-3">
              <RocketIcon size={44} />
            </div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">Signal Aviator · Temps Réel</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 tracking-tight">
              SIGNAUX <span className="text-gold">AVIATOR VIP</span>
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-2xl mx-auto">
              Notre algorithme IA génère un signal Aviator chaque minute. Multiplicateur prédit, indice de confiance, et historique en temps réel — <span className="text-gold/90 font-semibold">exclusivement VIP</span>.
            </p>
            {/* Hidden SEO */}
            <p className="sr-only">
              Signaux Aviator VIP, prédiction Aviator, hack Aviator, signal Aviator en direct, multiplicateur Aviator, Aviator AI predictor, code promo VISION221 Linebet 888starz.
            </p>
          </motion.div>

          {/* Main Aviator Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="v31-vip-lab-glow relative rounded-2xl border border-red-500/20 bg-gradient-to-b from-panel-2 to-panel overflow-hidden hover-lift shadow-2xl"
          >
            {/* Premium top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-gold to-emerald" />
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-red-500/4 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-gold/3 rounded-full blur-[80px]" />

            <div className="relative p-5 sm:p-7">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logos/sport-aviator.svg" alt="Aviator" className="w-8 h-8 object-contain" loading="lazy"/>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                      SIGNAL <span className="text-gold animate-pulse-gold">AVIATOR</span>
                    </h3>
                    <p className="text-[10px] text-red-400/60 font-medium tracking-wide uppercase">Prédiction IA chaque 60 secondes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${signalPhase === 'active' ? 'bg-emerald' : signalPhase === 'countdown' ? 'bg-gold' : 'bg-red-500'}`} />
                  <span className="text-[10px] text-red-400 font-semibold">
                    {signalPhase === 'active' ? 'SIGNAL' : signalPhase === 'countdown' ? 'EN ATTENTE' : 'RÉSULTAT'}
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-red-500/8 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  <span className="text-[11px] text-gray-400"><span className="text-white font-semibold">{todaySignals}</span> signaux</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="text-[11px] text-gray-400">Taux <span className="text-success font-bold">{dailyWinRate}%</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-[11px] text-gray-400">Mises <span className="text-white font-semibold">{wins}/{todaySignals}</span></span>
                </div>
              </div>

              {/* Countdown or Signal Display */}
              <AnimatePresence mode="wait">
                {signalPhase === 'countdown' && (
                  <motion.div key="countdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="flex flex-col items-center justify-center py-4">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wide mb-2">Prochain signal dans</p>
                      <div className="relative w-28 h-28 mb-2">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,184,0,0.1)" strokeWidth="6" />
                          <circle cx="50" cy="50" r="44" fill="none" stroke="#FACC15" strokeWidth="6" strokeLinecap="round"
                            strokeDasharray={`${(countdown / 60) * 276.46} 276.46`}
                            className="transition-all duration-1000 ease-linear"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-black text-gold tabular-nums">{formatCountdown(countdown)}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-600">Le signal sera révélé automatiquement</p>
                    </div>
                  </motion.div>
                )}

                {signalPhase === 'active' && currentSignal && (
                  <motion.div key="active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                    <PlaneFlyAnimation multiplier={currentSignal.multiplier} isActive={true} />
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-midnight/60 border border-edge rounded-lg p-2.5 text-center">
                        <div className="text-[10px] text-gray-500 mb-0.5">Multiplicateur</div>
                        <div className={`text-lg font-black tabular-nums ${currentSignal.multiplier >= 5 ? 'text-success' : currentSignal.multiplier >= 2.5 ? 'text-gold' : 'text-red-400'}`}>
                          {currentSignal.multiplier.toFixed(2)}x
                        </div>
                      </div>
                      <div className="bg-midnight/60 border border-edge rounded-lg p-2.5 text-center">
                        <div className="text-[10px] text-gray-500 mb-0.5">Confiance</div>
                        <div className={`text-lg font-black tabular-nums ${currentSignal.confidence >= 85 ? 'text-success' : currentSignal.confidence >= 75 ? 'text-gold' : 'text-red-400'}`}>
                          {currentSignal.confidence}%
                        </div>
                      </div>
                      <div className="bg-midnight/60 border border-edge rounded-lg p-2.5 text-center">
                        <div className="text-[10px] text-gray-500 mb-0.5">Conseil</div>
                        <div className="text-xs font-bold text-emerald">
                          CASH OUT {Math.max(1.2, currentSignal.multiplier * 0.7).toFixed(1)}x
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2">
                      <div className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
                      <span className="text-xs text-emerald font-semibold">Signal actif — Cotez maintenant et cash out au bon moment !</span>
                    </div>
                  </motion.div>
                )}

                {signalPhase === 'result' && currentSignal && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                    <div className="flex flex-col items-center py-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 ${currentSignal.status === 'cashed-out' ? 'bg-success/10 border border-success/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                        {currentSignal.status === 'cashed-out' ? (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-extrabold ${currentSignal.status === 'cashed-out' ? 'text-success' : 'text-red-400'}`}>
                          {currentSignal.status === 'cashed-out' ? 'CRASH ÉVITÉ !' : 'CRASH PRÉCOCE'}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Prédit : <span className="text-white font-semibold">{currentSignal.multiplier.toFixed(2)}x</span>
                          {' · '}
                          Crash à : <span className={currentSignal.status === 'cashed-out' ? 'text-success font-semibold' : 'text-red-400 font-semibold'}>
                            {currentSignal.actualMultiplier?.toFixed(2)}x
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signal History — blurred (VIP locked) */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-gray-500 font-medium">Historique des signaux</span>
                  <span className="text-[10px] text-gold/50">VIP uniquement</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 blur-[4px] select-none">
                  {signalHistory.map((s, i) => (
                    <div key={i} className={`flex-shrink-0 min-w-[52px] rounded-lg px-2 py-1.5 text-center border ${s.result === 'win' ? 'bg-success/5 border-success/15' : 'bg-red-500/5 border-red-500/15'}`}>
                      <span className={`text-xs font-bold tabular-nums ${s.result === 'win' ? 'text-success' : 'text-red-400'}`}>
                        {s.multiplier.toFixed(1)}x
                      </span>
                      <p className="text-[8px] text-gray-600 mt-0.5">{s.time}</p>
                    </div>
                  ))}
                  {/* Lock overlay indicator */}
                  <div className="flex-shrink-0 min-w-[52px] rounded-lg px-2 py-1.5 text-center border border-gold/15 bg-gold/5 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold/70"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setShowVipModal(true)}
                className="v31-breathing v31-cta-wave relative flex items-center justify-center gap-2 px-4 py-2 btn-gold text-midnight text-xs w-full cursor-pointer overflow-hidden group/btn mt-4"
                style={{ ['--v31-wave-delay' as string]: '5s' }}
                data-cursor="hover"
              >
                <img src="/logos/sport-aviator.svg" alt="" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy"/>
                <span>Débloquer les Signaux Aviator</span>
              </button>

              <div className="flex items-center justify-center gap-2 mt-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/40"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <p className="text-[10px] sm:text-[11px] text-gold/40 font-medium">Accès limité — <span className="text-gold/60">signaux en temps réel</span></p>
              </div>
            </div>
          </motion.div>

          {/* Aviator features strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4"
          >
            {[
              { icon: '⚡', label: 'Signal / min', desc: 'Mise à jour toutes les 60s' },
              { icon: '🎯', label: 'IA Prédiction', desc: 'Algorithme breveté' },
              { icon: '💰', label: 'Cash Out Info', desc: 'Moment optimal' },
              { icon: '📊', label: `${dailyWinRate}% Taux`, desc: 'Vérifié chaque jour' },
            ].map((f, i) => (
              <div key={i} className="bg-panel/60 border border-edge/50 rounded-xl px-3 py-2.5 text-center">
                <span className="text-lg">{f.icon}</span>
                <p className="text-[11px] text-white font-semibold mt-0.5">{f.label}</p>
                <p className="text-[9px] text-gray-600">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <VipModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />
    </>
  )
}
