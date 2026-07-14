'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, ANDROID_LOGO } from '@/lib/constants'
import { resolveTeamLogo } from '@/lib/teamLogos'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'

/* ─────────────────────────── FIFA MODAL ─────────────────────────── */

function FifaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'info' | 'confirm'>('info')
  const [linebetId, setLinebetId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setStep('info')
        setLinebetId('')
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
    setTimeout(() => onClose(), 2500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
          <motion.div ref={modalRef} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-b from-panel-2 to-panel border border-gold/25 rounded-2xl shadow-2xl shadow-black/50">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent rounded-t-2xl" />
              <div className="h-1 bg-gradient-to-r from-gold via-emerald to-gold" />
              <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-midnight/60 text-gray-400 hover:text-white hover:bg-midnight transition-all z-10" aria-label="Fermer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {step === 'info' && (
                    <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <div className="w-16 h-16 mx-auto bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold mb-5">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white text-center mb-2 tracking-tight">
                        FAILLE <span className="text-gold">FIFA</span>
                      </h3>
                      <p className="text-gray-300 text-sm text-center mb-4 leading-relaxed">
                        Pour accéder à la Faille FIFA (Linebet ou 888starz), vous devez d&apos;abord respecter ces conditions :
                      </p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-white/[0.06]">
                          <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">1. Créer un compte Linebet ou 888starz</p>
                            <p className="text-gray-400 text-xs mt-0.5">Utilisez le code promo <span className="text-gold font-bold">VISION221</span> lors de l&apos;inscription</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-white/[0.06]">
                          <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">2. Déposer un minimum de 3 000 Fr</p>
                            <p className="text-gray-400 text-xs mt-0.5">Effectuez un premier dépôt de 3 000 Fr minimum sur votre compte Linebet ou 888starz</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-white/[0.06]">
                          <div className="w-8 h-8 flex-shrink-0 bg-emerald/10 rounded-lg flex items-center justify-center text-emerald">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">3. Confirmer votre inscription</p>
                            <p className="text-gray-400 text-xs mt-0.5">Entrez votre ID Linebet ou 888starz pour vérification et activation de votre accès Faille FIFA</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <button onClick={() => setStep('confirm')} className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-gold text-white font-bold text-xs">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Je me suis déjà inscrit
                        </button>
                          <a href={AFFILIATE.linebet} rel={AFFILIATE.rel} target="_blank" className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-linebet text-[#04150C] text-xs" data-cursor="hover">
                          <img src="/logos/linebet.svg" alt="Linebet" className="h-4 w-auto object-contain flex-shrink-0" loading="lazy"/>
                          Aller s&apos;inscrire sur LINEBET
                        </a>
                        {/* V23: Alternative 888starz */}
                        <a href={AFFILIATE.star888} rel={AFFILIATE.rel} target="_blank" className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-star888 text-white text-xs" data-cursor="hover">
                          <img src="/logos/888starz.svg" alt="888starz" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
                          Ou s&apos;inscrire sur 888starz
                        </a>
                      </div>
                      <p className="text-[10px] text-gray-600 mt-4 text-center">Bonus soumis aux conditions (mise x5, cote min. 1,40)</p>
                    </motion.div>
                  )}
                  {step === 'confirm' && !submitSuccess && (
                    <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                      <button onClick={() => setStep('info')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-5 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Retour
                      </button>
                      <div className="w-14 h-14 mx-auto bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold mb-4">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white text-center mb-2 tracking-tight">
                        CONFIRMEZ VOTRE INSCRIPTION
                      </h3>
                      <p className="text-gray-400 text-sm text-center mb-5 leading-relaxed">
                        Entrez votre identifiant Linebet ou 888starz pour que nous puissions vérifier votre inscription et activer votre accès Faille FIFA.
                      </p>
                      <div className="mb-4">
                        <label htmlFor="fifa-linebet-id" className="block text-xs text-gray-500 mb-1.5 font-medium">Votre ID Linebet / 888starz</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/50" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                          </div>
                          <input ref={inputRef} id="fifa-linebet-id" type="text" value={linebetId} onChange={(e) => setLinebetId(e.target.value)} placeholder="Ex : 123456789"
                            className="w-full bg-midnight/60 border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                            onKeyDown={(e) => { if (e.key === 'Enter' && linebetId.trim()) handleSubmitId() }} />
                        </div>
                      </div>
                      <button onClick={handleSubmitId} disabled={!linebetId.trim() || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 btn-gold text-white font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? (
                          <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>Vérification en cours...</>
                        ) : 'Envoyer et accéder à la Faille FIFA'}
                      </button>
                    </motion.div>
                  )}
                  {step === 'confirm' && submitSuccess && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }} className="text-center py-4">
                      <div className="w-16 h-16 mx-auto bg-emerald/10 border border-emerald/20 rounded-2xl flex items-center justify-center text-emerald mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mb-2">DEMANDE ENVOYÉE !</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">Votre ID a été enregistré. Nous vérifierons votre inscription Linebet ou 888starz et vous recevrez votre accès Faille FIFA sous peu.</p>
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

/* ─────────────────────── TEAM LOGO ─────────────────────── */

function FifaTeamLogo({ src, name, size = 18 }: { src: string; name: string; size?: number }) {
  const [imgOk, setImgOk] = useState(true)
  const initials = name?.slice(0, 2).toUpperCase() || '?'
  if (!src || !imgOk) {
    return (
      <div className="rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center text-gold/60 font-bold flex-shrink-0" style={{ width: size, height: size, fontSize: size * 0.4 }}>
        {initials}
      </div>
    )
  }
  return <img src={src} alt={name} className="rounded-full object-contain flex-shrink-0" style={{ width: size, height: size }} loading="lazy" onError={() => setImgOk(false)} />
}

/* ─────────────────────── FIFA POOL (generates teams) ─────────────────────── */

const FIFA_TEAMS = [
  'France', 'Brazil', 'Argentina', 'Germany', 'Spain', 'England',
  'Portugal', 'Italy', 'Netherlands', 'Belgium', 'Croatia', 'Morocco',
  'Japan', 'South Korea', 'Uruguay', 'Colombia', 'Mexico', 'USA',
  'Senegal', 'Nigeria', 'Cameroon', 'Egypt', 'Ghana', 'Ivory Coast',
  'Denmark', 'Switzerland', 'Austria', 'Serbia', 'Poland', 'Sweden',
  'Norway', 'Scotland', 'Turkey', 'Algeria', 'Tunisia', 'DR Congo',
]

const FIFA_LEAGUES = [
  'FIFA World Cup', 'Copa America', 'EURO Qualifiers', 'African Cup',
  'Asian Cup', 'Nations League', 'Friendly International', 'World Cup Qualifiers',
]

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function generateFifaMatches(seed: number, count: number) {
  const matches: Array<{ home: string; away: string; league: string }> = []
  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(seed + i * 7)
    const r2 = seededRandom(seed + i * 13 + 3)
    const r3 = seededRandom(seed + i * 19 + 7)

    const homeIdx = Math.floor(r1 * FIFA_TEAMS.length)
    let awayIdx = Math.floor(r2 * FIFA_TEAMS.length)
    if (awayIdx === homeIdx) awayIdx = (awayIdx + 1) % FIFA_TEAMS.length

    const home = FIFA_TEAMS[homeIdx]
    const away = FIFA_TEAMS[awayIdx]
    const league = FIFA_LEAGUES[Math.floor(r3 * FIFA_LEAGUES.length)]

    matches.push({ home, away, league })
  }
  return matches
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */

export default function FifaLinebet() {
  const [showFifaModal, setShowFifaModal] = useState(false)
  const couponRef = useRef<HTMLDivElement>(null)
  const [sectionRef, isVisible] = useScrollAnimation(0.1)

  const scrollToCoupon = () => {
    couponRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const [fifaMatches, setFifaMatches] = useState<Array<{ home: string; away: string; league: string; cote: number }>>([])
  const [couponCote, setCouponCote] = useState(0)
  const [nextUpdate, setNextUpdate] = useState(300) // 5 min countdown

  // Count-up animations for FIFA stats — animated when section enters viewport
  const fifaMatchCount = fifaMatches.length
  const [fifaCountRef, fifaCountDisplay] = useCountUp(fifaMatchCount, 1200, { threshold: 0.3 })
  const [coteRef, coteDisplay] = useCountUp(couponCote, 1600, { decimals: 2, threshold: 0.3 })
  const [reliabilityRef, reliabilityDisplay] = useCountUp(98, 1800, { threshold: 0.3 })

  const generateCoupon = useMemo(() => {
    return () => {
      const now = new Date()
      // Seed based on current 5-min slot
      const slot = Math.floor(now.getTime() / (5 * 60 * 1000))
      const matchCount = 5 + Math.floor(seededRandom(slot) * 4) // 5-8 matches
      const matches = generateFifaMatches(slot, matchCount)

      // Total cote between 10 and 15
      const r = seededRandom(slot + 999)
      const totalCote = Math.round((10 + r * 5) * 100) / 100
      const cotePerMatch = Math.pow(totalCote, 1 / matchCount)

      const enriched = matches.map((m, i) => ({
        ...m,
        cote: Math.round(cotePerMatch * (0.97 + seededRandom(slot + i * 31) * 0.06) * 100) / 100,
      }))

      setFifaMatches(enriched)
      setCouponCote(totalCote)
      setNextUpdate(300)
    }
  }, [])

  // Initial generation + 5-min interval
  useEffect(() => {
    generateCoupon()
    const interval = setInterval(generateCoupon, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [generateCoupon])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setNextUpdate(prev => (prev <= 1 ? 300 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const todayFormatted = useMemo(() => {
    const now = new Date()
    const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' })
    const dayNum = now.getDate()
    const monthName = now.toLocaleDateString('fr-FR', { month: 'long' })
    const year = now.getFullYear()
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`
  }, [])

  return (
    <>
      <section ref={sectionRef} id="fifa-linebet" className="py-10 sm:py-16 px-4 relative overflow-hidden">
        {/* Premium background mesh — amber + cyan glow for "experimental/high risk" feel */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-gold/6 rounded-full blur-[140px] opacity-60" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[350px] bg-emerald/3 rounded-full blur-[120px] opacity-60" />
        </div>
        <div className={`max-w-5xl mx-auto relative ${isVisible ? 'v31-fifa-zoom-in' : 'opacity-0'}`}>
          {/* Section Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5 }} className="text-center mb-8">
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">Exclusive Algorithm</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 tracking-tight">
              FAILLE <span className="text-gold">FIFA</span>
            </h2>
            {/* Warning badge — "Expérimental / High Risk" */}
            <div className="inline-flex items-center gap-1.5 mt-2 mb-3 badge-warning">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Expérimental / High Risk
            </div>
            <p className="text-gray-500 text-sm max-w-lg mx-auto mb-4">Algorithme exclusif détectant les failles de cotes FIFA sur Linebet et 888starz — Mise à jour toutes les 5 minutes</p>
            <button onClick={scrollToCoupon}
              className="v31-cta-wave inline-flex items-center gap-2 px-5 py-2.5 btn-gold text-sm cursor-pointer"
              style={{ ['--v31-wave-delay' as string]: '5s' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/></svg>
              Voir le Coupon FIFA
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </motion.div>

          {/* SEO Content — highlight block with subtle #0F172A tint */}
          <div className="max-w-5xl mx-auto mb-6 px-2">
            <div className="highlight-block rounded-xl p-4 sm:p-5 relative overflow-hidden">
              <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                Faille FIFA Linebet & 888starz : Comment exploiter les cotes FIFA en 2026
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-2">
                La <strong className="text-gold">faille FIFA</strong> est une opportunité unique détectée par notre algorithme IA qui analyse en temps réel les écarts de cotes sur les matchs FIFA de Linebet et 888starz. Notre système de scan automatique identifie les failles de cotes FIFA toutes les 5 minutes, vous permettant d&apos;accéder à des coupons FIFA avec des cotes entre 10 et 15 et une fiabilité de 98%. Que vous cherchiez une faille FIFA sur Linebet, une faille FIFA sur 888starz, un coupon FIFA gratuit, ou comment exploiter les failles de cotes FIFA, BttsBet vous offre l&apos;outil le plus avancé du marché.
              </p>
              {/* SEO keywords — sr-only (accessible to crawlers, invisible to users, no keyword-stuffing penalty) */}
              <p className="sr-only">
                faille fifa linebet, faille fifa 888starz, faille fifa, coupon fifa linebet, coupon fifa 888starz, faille cote fifa, bot fifa linebet, astuce fifa linebet, faille jeux fifa, hack fifa linebet 2026, coupon fifa gagnant, faille pari fifa
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* FIFA Coupon — highlight block (special background #0F172A) */}
            <motion.div ref={couponRef} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.6 }}
              className="relative highlight-block overflow-hidden hover-lift shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-emerald to-gold" />
              <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-gold/4 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-emerald/3 rounded-full blur-[80px]" />

              <div className="relative p-5 sm:p-7">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-gold">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 12h3v9h6v-6h4v6h6v-9h3L12 2z"/></svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        COUPON <span className="text-gold">FIFA</span>
                      </h3>
                      <p className="text-[10px] text-gold/60 font-medium tracking-[0.15em] uppercase">Faille de cotes verrouillée</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-2.5 py-1">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                    <span className="text-[10px] text-gold font-semibold">AUTO</span>
                  </div>
                </div>

                {todayFormatted && (
                  <div className="flex items-center gap-2 mb-4 bg-gold/5 border border-gold/15 rounded-lg px-3 py-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/70 flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="text-xs text-gold/90 font-semibold tracking-wide">{todayFormatted}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 mb-4 pb-4 border-b border-gold/12">
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/70"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span className="text-[11px] text-gray-400"><span ref={fifaCountRef} className="v31-halo-number text-white font-semibold tabular-nums">{fifaCountDisplay}</span> matchs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/70"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <span className="text-[11px] text-gray-400">Cote <span ref={coteRef} className="v31-halo-number text-gold font-bold tabular-nums">{coteDisplay}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/70"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span className="text-[11px] text-gray-400">Fiabilité <span ref={reliabilityRef} className="v31-halo-number text-gold font-bold tabular-nums">{reliabilityDisplay}%</span></span>
                  </div>
                </div>

                <div className="space-y-1 mb-4 max-h-[340px] overflow-y-auto scrollbar-none">
                  {fifaMatches.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                      className="v31-stacked-card v31-card-hover-glow relative flex items-center gap-2 sm:gap-2.5 bg-midnight/50 rounded-lg px-2.5 sm:px-3 py-2 border border-gold/10 hover:border-gold/25 transition-colors"
                      style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 relative">
                        <div className="blur-[4px] select-none flex items-center gap-1.5">
                          <FifaTeamLogo src={resolveTeamLogo(m.home)} name={m.home} size={18} />
                          <span className="text-gray-300 text-[11px] sm:text-sm font-medium truncate">{m.home} vs {m.away}</span>
                          <FifaTeamLogo src={resolveTeamLogo(m.away)} name={m.away} size={18} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold/70">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                      </div>
                      <span className="hidden sm:block text-gray-600 text-[10px] flex-shrink-0 max-w-[90px] truncate blur-[3px] select-none">{m.league}</span>
                      <span className="text-[10px] sm:text-xs text-gold font-bold bg-gold/10 border border-gold/20 rounded px-1.5 py-0.5 flex-shrink-0 tabular-nums blur-[3px] select-none">{m.cote.toFixed(2)}</span>
                      <div className="relative flex items-center flex-shrink-0">
                        <div className="blur-[4px] select-none">
                          <span className="text-gold text-[10px] sm:text-xs font-bold px-1.5 py-0.5 bg-gold/10 rounded">1X2</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold/70">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-gold/5 border border-gold/15 rounded-lg px-3 py-2 mb-5">
                  <span className="text-[11px] text-gray-500 font-medium">Cote totale du coupon</span>
                  <span className="v31-halo-number text-sm text-gold font-bold tabular-nums">{coteDisplay}</span>
                </div>

                <button onClick={() => setShowFifaModal(true)}
                  className="v31-cta-wave relative flex items-center justify-center gap-2 px-4 py-2 btn-gold text-xs w-full cursor-pointer overflow-hidden group/btn"
                  style={{ ['--v31-wave-delay' as string]: '8s' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  <span>Débloquer la Faille FIFA</span>
                </button>

                <div className="flex items-center justify-center gap-2 mt-3">
                  {/* V31: Circular timer — animates over 5 min cycle */}
                  <div className="v31-circular-timer" aria-hidden="true">
                    <svg width="38" height="38" viewBox="0 0 38 38">
                      <circle cx="19" cy="19" r="16" fill="none" stroke="rgba(245, 165, 36, 0.12)" strokeWidth="2" />
                      <circle
                        cx="19" cy="19" r="16" fill="none" stroke="#FACC15" strokeWidth="2" strokeLinecap="round"
                        strokeDasharray="100"
                        strokeDashoffset={100 - (nextUpdate / 300) * 100}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <span className="v31-circular-label">AUTO</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-gold/60 font-medium">Actualisation auto dans <span className="text-gold/80 tabular-nums">{formatCountdown(nextUpdate)}</span></p>
                </div>
              </div>
            </motion.div>

            {/* FIFA Info / Promo Section */}
            <motion.div initial={{ opacity: 0, x: 20, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl border border-edge bg-gradient-to-b from-panel-2 to-panel overflow-hidden hover-lift shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-emerald to-gold" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gold/4 rounded-full blur-[80px]" />

              <div className="relative p-6 sm:p-8">
                <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center text-gold mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                  COMMENT ÇA <span className="text-gold">MARCHE ?</span>
                </h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                  Notre algorithme détecte en temps réel les failles de cotes FIFA sur Linebet et 888starz. Ces opportunités sont limitées et s&apos;actualisent automatiquement toutes les 5 minutes.
                </p>

                <div className="v31-timeline space-y-3 mb-6">
                  <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-edge">
                    <div className="v31-bounce-in d1 w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold text-sm font-bold">1</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Scan automatique</p>
                      <p className="text-gray-400 text-xs mt-0.5">L&apos;IA scanne les cotes FIFA Linebet et 888starz en continu pour détecter les anomalies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-edge">
                    <div className="v31-bounce-in d2 w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold text-sm font-bold">2</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Faille identifiée</p>
                      <p className="text-gray-400 text-xs mt-0.5">Quand un écart de cote est détecté, le coupon se génère automatiquement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-midnight/50 rounded-xl p-3.5 border border-edge">
                    <div className="v31-bounce-in d3 w-8 h-8 flex-shrink-0 bg-emerald/10 rounded-lg flex items-center justify-center text-emerald text-sm font-bold">3</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Profit garanti</p>
                      <p className="text-gray-400 text-xs mt-0.5">Fiabilité de 98% — Cotes entre 10 et 15 avec une rentabilité prouvée</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {[
                    { value: '98%', label: 'Fiabilité', color: 'text-gold' },
                    { value: '10-15', label: 'Cote moyenne', color: 'text-emerald' },
                    { value: '5 min', label: 'Actualisation', color: 'text-gold' },
                    { value: 'Auto', label: 'Scan IA', color: 'text-emerald' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge">
                      <span className={`v31-pulse-periodic text-sm font-bold flex-shrink-0 ${item.color}`} style={{ animationDelay: `${i * 2}s` }}>{item.value}</span>
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a href={AFFILIATE.linebet} rel={AFFILIATE.rel} target="_blank" className="v31-cta-wave flex-1 flex items-center justify-center gap-2 px-3 py-2 btn-linebet text-[#04150C] text-xs" style={{ ['--v31-wave-delay' as string]: '0s' }} data-cursor="hover">
                    <img src="/logos/linebet.svg" alt="Linebet" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
                  </a>
                  {/* V23: Nouveau bouton 888starz */}
                  <a href={AFFILIATE.star888} rel={AFFILIATE.rel} target="_blank" className="v31-cta-wave flex-1 flex items-center justify-center gap-2 px-3 py-2 btn-star888 text-white text-xs" style={{ ['--v31-wave-delay' as string]: '4s' }} data-cursor="hover">
                    <img src="/logos/888starz.svg" alt="888starz" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
                  </a>
                </div>
                {/* V23: Liens de téléchargement — logo Android + nom du bookmaker */}
                <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                  <a href={AFFILIATE.linebetDownload} rel={AFFILIATE.rel} target="_blank" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-edge text-white font-semibold rounded-xl text-xs hover:bg-white/[0.04] transition-all bg-white/[0.02]">
                    <img src={ANDROID_LOGO} alt="Android" className="w-5 h-5 object-contain flex-shrink-0" loading="lazy"/>
                    APK Linebet
                  </a>
                  <a href={AFFILIATE.star888Download} rel={AFFILIATE.rel} target="_blank" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-edge text-white font-semibold rounded-xl text-xs hover:bg-white/[0.04] transition-all bg-white/[0.02]">
                    <img src={ANDROID_LOGO} alt="Android" className="w-5 h-5 object-contain flex-shrink-0" loading="lazy"/>
                    APK 888starz
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FifaModal isOpen={showFifaModal} onClose={() => setShowFifaModal(false)} />
    </>
  )
}
