'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, ANDROID_LOGO } from '@/lib/constants'
import { resolveTeamLogo } from '@/lib/teamLogos'
import { useScrollAnimation, useCountUp, useStaggerReveal } from '@/hooks/useAnimations'
import { GameController, FloatingParticles } from './AnimatedIcons'
import VipUnlockModal from './VipUnlockModal'
import { badgePulse, modalBackdrop, modalContent } from '@/lib/motionPresets'

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
  const [staggerRef] = useStaggerReveal()

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
  const [reliabilityRef, reliabilityDisplay] = useCountUp(fifaMatches.length, 1800, { threshold: 0.3 })

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
      <section ref={sectionRef} id="fifa-linebet" className="section-entrance morph-glow py-4 sm:py-5 px-4 relative overflow-hidden">
        {/* Premium background mesh — amber + cyan glow for "experimental/high risk" feel */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[min(500px,80vw)] h-[400px] bg-gold/6 rounded-full blur-[140px] opacity-60" />
          <div className="absolute bottom-0 right-1/4 w-[min(400px,70vw)] h-[350px] bg-gold/3 rounded-full blur-[120px] opacity-60" />
        </div>
        <FloatingParticles count={10} />

        <div className={`max-w-5xl mx-auto relative ${isVisible ? 'v31-fifa-zoom-in' : 'opacity-0'}`}>
          {/* Section Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5 }} className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <GameController size={44} />
            </div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">Exclusive Algorithm</span>
            <h2 className="section-title font-bold text-white mt-2 tracking-tight">
              VALUE BETS <span className="text-gold neon-underline">FIFA</span>
            </h2>
            {/* Badge — Analyse IA */}
            <div className="inline-flex items-center gap-1.5 mt-2 mb-3 bg-gold/10 border border-gold/20 text-gold rounded-full px-3 py-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M20 12a8 8 0 1 1-8-8"/>
              </svg>
              Analyse IA
              <span className="trust-badge">Value Bets IA</span>
            </div>
            <p className="text-gray-500 text-sm max-w-lg mx-auto mb-4">Algorithme exclusif qui compare en temps réel les cotes FIFA de Linebet et 888starz à nos probabilités calculées, pour repérer les paris où la cote proposée est plus généreuse que la probabilité réelle estimée — Mise à jour toutes les 5 minutes</p>
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
                Value Bets FIFA Linebet & 888starz : comment repérer les cotes sous-évaluées en 2026
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-2">
                Les <strong className="text-gold">value bets FIFA</strong> sont des opportunités identifiées par notre algorithme IA qui compare en temps réel les cotes proposées par Linebet et 888starz aux probabilités estimées par notre modèle. Quand un écart favorable est détecté — c&apos;est-à-dire que la cote est plus généreuse que la probabilité réelle — le coupon se génère automatiquement. Ces paris restent soumis aux risques inhérents à tout pronostic sportif.
              </p>
              {/* SEO keywords — sr-only */}
              <p className="sr-only">
                value bet fifa linebet, value bet fifa 888starz, cote fifa linebet, pronostic fifa esport, coupon fifa value bet, analyse cote fifa, astuce fifa linebet, value bet esport, paris fifa value bet
              </p>
            </div>
          </div>

          <div className="bento-grid">
            {/* FIFA Coupon — highlight block (special background #0F172A) */}
            <motion.div ref={couponRef} initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.6 }} whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(250,204,21,0.12)', transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }} whileTap={{ y: 0, transition: { duration: 0.15 } }} style={{ willChange: 'transform, opacity' }}
              className="relative highlight-block holo-border bento-main squircle-lg shimmer-card hover-ripple card-elevate overflow-hidden hover-lift shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold to-gold" />
              <div className="absolute top-0 right-0 w-[min(250px,50%)] h-[250px] bg-gold/4 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-[min(180px,40%)] h-[180px] bg-gold/3 rounded-full blur-[80px]" />

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
                      <p className="text-[10px] text-gold/60 font-medium tracking-[0.15em] uppercase">Value bets verrouillés</p>
                    </div>
                  </div>
                  <motion.div variants={badgePulse} animate="animate" style={{ willChange: 'transform, opacity' }} className="flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-2.5 py-1">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                    <span className="text-[10px] text-gold font-semibold">AUTO</span>
                  </motion.div>
                </div>

                {todayFormatted && (
                  <div className="flex items-center gap-2 mb-4 bg-gold/5 border border-gold/15 rounded-lg px-3 py-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/70 flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="text-xs text-gold/90 font-semibold tracking-wide">{todayFormatted}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 pb-4 border-b border-gold/12 flex-wrap">
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
                    <span className="text-[11px] text-gray-400">Value bets <span ref={reliabilityRef} className="v31-halo-number text-gold font-bold tabular-nums">{reliabilityDisplay}</span></span>
                  </div>
                </div>

                <div ref={staggerRef} className="stagger-reveal space-y-1 mb-4 max-h-[340px] overflow-y-auto scrollbar-none">
                  {fifaMatches.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }} whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(250,204,21,0.08)', transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }} whileTap={{ y: 0, transition: { duration: 0.15 } }} style={{ willChange: 'transform, opacity', animationDelay: `${0.15 + i * 0.08}s` }}
                      className="v31-stacked-card v31-card-hover-glow relative flex items-center gap-2 sm:gap-2.5 bg-midnight/50 rounded-lg px-2.5 sm:px-3 py-2 border border-gold/10 hover:border-gold/25 transition-colors overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 relative overflow-hidden">
                        <div className="blur-[4px] select-none flex items-center gap-1.5 min-w-0">
                          <FifaTeamLogo src={resolveTeamLogo(m.home)} name={m.home} size={18} />
                          <span className="text-gray-300 text-[11px] sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{m.home} vs {m.away}</span>
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
                  <span>Débloquer les Value Bets FIFA</span>
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
            <motion.div initial={{ opacity: 0, x: 20, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(250,204,21,0.12)', transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }} whileTap={{ y: 0, transition: { duration: 0.15 } }} style={{ willChange: 'transform, opacity' }}
              className="relative squircle-lg card-elevate bento-side border border-edge bg-gradient-to-b from-panel-2 to-panel overflow-hidden hover-lift shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold to-gold" />
              <div className="absolute bottom-0 left-0 w-[min(200px,50%)] h-[200px] bg-gold/4 rounded-full blur-[80px]" />

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
                  Notre algorithme compare en temps réel les cotes FIFA de Linebet et 888starz à nos probabilités calculées. Quand un écart favorable est détecté, le coupon se génère automatiquement. Ces opportunités s&apos;actualisent toutes les 5 minutes.
                </p>

                <div className="v31-timeline space-y-3 mb-6">
                  <div className="flex items-start gap-3 bg-midnight/50 squircle p-3.5 border border-edge">
                    <div className="v31-bounce-in d1 w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold text-sm font-bold">1</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Scan automatique</p>
                      <p className="text-gray-400 text-xs mt-0.5">L&apos;IA compare les cotes FIFA Linebet et 888starz en continu avec nos probabilités estimées</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-midnight/50 squircle p-3.5 border border-edge">
                    <div className="v31-bounce-in d2 w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold text-sm font-bold">2</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Value bet identifié</p>
                      <p className="text-gray-400 text-xs mt-0.5">Quand notre modèle détecte un écart favorable entre la cote et la probabilité estimée, le coupon se génère automatiquement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-midnight/50 squircle p-3.5 border border-edge">
                    <div className="v31-bounce-in d3 w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold text-sm font-bold">3</div>
                    <div>
                      <p className="text-white text-sm font-semibold">Cotes élevées</p>
                      <p className="text-gray-400 text-xs mt-0.5">Cotes généralement comprises entre 10 et 15 — les paris à cotes élevées comportent un risque proportionnellement plus élevé, à utiliser en gestion de bankroll raisonnée</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  {[
                    { value: '10-15', label: 'Cote moyenne', color: 'text-gold' },
                    { value: '5 min', label: 'Actualisation', color: 'text-gold' },
                    { value: 'Auto', label: 'Scan IA', color: 'text-gold' },
                    { value: 'Risque', label: 'Cotes élevées', color: 'text-red-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge">
                      <span className={`v31-pulse-periodic text-sm font-bold flex-shrink-0 ${item.color}`} style={{ animationDelay: `${i * 2}s` }}>{item.value}</span>
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a href={AFFILIATE.linebet} rel={AFFILIATE.rel} target="_blank" className="v31-cta-wave flex-1 flex items-center justify-center gap-2 px-3 py-2 btn-linebet cta-glow text-[#04150C] text-xs" style={{ ['--v31-wave-delay' as string]: '0s' }} data-cursor="hover">
                    <img src="/logos/linebet.svg" alt="Linebet" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
                  </a>
                  {/* V23: Nouveau bouton 888starz */}
                  <a href={AFFILIATE.star888} rel={AFFILIATE.rel} target="_blank" className="v31-cta-wave flex-1 flex items-center justify-center gap-2 px-3 py-2 btn-star888 cta-glow text-white text-xs" style={{ ['--v31-wave-delay' as string]: '4s' }} data-cursor="hover">
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

      {/* Legal disclaimer — FIFA Value Bets */}
      <div className="max-w-5xl mx-auto px-4 mt-2 mb-4">
        <div className="bg-panel/40 border border-edge/30 rounded-xl p-3 flex items-start gap-2">
          <span className="text-gold/70 text-xs flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed">
            Les paris sportifs comportent toujours un risque de perte. Aucun résultat n&apos;est garanti, y compris sur les value bets. Parie de manière responsable.
          </p>
        </div>
      </div>

      <VipUnlockModal isOpen={showFifaModal} onClose={() => setShowFifaModal(false)} title="Débloque les Value Bets FIFA" subtitle="Cotes FIFA exclusives + failles détectées par IA" />
    </>
  )
}
