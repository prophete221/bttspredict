'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, SOCIAL_PROOF, TESTIMONIALS, URGENCY_MESSAGES } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { FloatingParticles } from './AnimatedIcons'
import { staggerContainer, staggerChildFadeUp, buttonHover, badgePulse, cardHoverLift } from '@/lib/motionPresets'
import PremiumButton from './PremiumButton'

type Prediction = {
  match: string
  league: string
  date: string
  type: string
  prediction: string
  confidence: number
  time?: string
  homeLogo?: string
  awayLogo?: string
  analysis?: {
    bttsProb?: number
    over25Prob?: number
  }
}

function getMatchStatus(date: string, time?: string): 'live' | 'upcoming' | 'finished' {
  if (!date) return 'finished'
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const matchDay = new Date(date + 'T00:00:00'); matchDay.setHours(0, 0, 0, 0)
    if (matchDay.getTime() < today.getTime()) return 'finished'
    if (matchDay.getTime() > today.getTime()) return 'upcoming'
    if (!time || time === '--:--' || !/^\d{2}:\d{2}$/.test(time)) return 'upcoming'
    const [h, m] = time.split(':').map(Number)
    const matchDateTime = new Date(date + 'T00:00:00')
    matchDateTime.setHours(h, m, 0, 0)
    const diffMs = matchDateTime.getTime() - Date.now()
    const diffHours = diffMs / (1000 * 60 * 60)
    if (diffMs < 0 && diffHours > -2.5) return 'live'
    if (diffMs < 0) return 'finished'
    return 'upcoming'
  } catch { return 'finished' }
}

export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const [copied, setCopied] = useState(false)
  const [urgencyIndex, setUrgencyIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [topPrediction, setTopPrediction] = useState<Prediction | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setUrgencyIndex((i) => (i + 1) % URGENCY_MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Load top UPCOMING prediction (filter out finished)
  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const preds: Prediction[] = data.predictions || []
        if (preds.length === 0) return

        const visible = preds.filter(p => getMatchStatus(p.date, p.time) !== 'finished')
        if (visible.length === 0) {
          setTopPrediction(null)
          return
        }

        // Prefer upcoming over live
        const upcoming = visible.filter(p => getMatchStatus(p.date, p.time) === 'upcoming')
        const pool = upcoming.length > 0 ? upcoming : visible

        const top = pool.reduce((best, p) =>
          (p.confidence || 0) > (best.confidence || 0) ? p : best, pool[0])
        setTopPrediction(top)
      })
      .catch(() => {})
  }, [])

  const copyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
    } catch {
      document.execCommand('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const currentTestimonial = TESTIMONIALS[testimonialIndex]
  const currentUrgency = URGENCY_MESSAGES[urgencyIndex]
    .replace('{n}', String(SOCIAL_PROOF.winsToday))
    .replace('{n}', String(SOCIAL_PROOF.currentStreak))

  const matchTeams = useMemo(() => {
    if (!topPrediction?.match) return null
    const parts = topPrediction.match.split(/\s+vs?\s+/i)
    return { home: parts[0] || '', away: parts[1] || '' }
  }, [topPrediction])

  const status = topPrediction ? getMatchStatus(topPrediction.date, topPrediction.time) : null

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-6 sm:pt-12 pb-8 sm:pb-16">
      {/* Brand ambient background */}
      <div className="brand-glow-top" />
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <FloatingParticles count={16} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6"
      >
        {/* Ticker pill */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex justify-center mb-4 sm:mb-6"
        >
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5">
            <span className="v31-ticker-dot" />
            <span className="text-[10px] sm:text-xs text-success font-semibold tracking-wider uppercase">IA en direct</span>
            <span className="text-edge text-[10px]">|</span>
            <motion.span
              key={urgencyIndex}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] sm:text-xs text-gray-400"
            >
              {currentUrgency}
            </motion.span>
          </div>
        </motion.div>

        {/* ═══ TWO-COLUMN HERO ═══ */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">

          {/* ── LEFT — Brand + title + CTAs ── */}
          <div className="text-center lg:text-left">
            {/* Brand identity */}
            <motion.div variants={staggerChildFadeUp} className="mb-4 flex items-center gap-2 justify-center lg:justify-start">
              <div className="w-9 h-9 rounded-lg bg-brand border border-success/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D68F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M7 14l4-4 4 4 5-5" />
                </svg>
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                BttsBet <span className="text-success">AI</span>
              </span>
            </motion.div>

            <motion.div variants={staggerChildFadeUp} className="mb-3">
              <span className="eyebrow">Plateforme IA nouvelle génération</span>
            </motion.div>

            <motion.h1
              variants={staggerChildFadeUp}
              className="section-title-lg mb-5"
            >
              Plateforme de pronostics
              <br />
              <span className="gradient-text-green-gold">sportifs propulsée par IA</span>
            </motion.h1>

            <motion.p
              variants={staggerChildFadeUp}
              className="text-gray-400 text-sm sm:text-lg max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed"
            >
              BTTS, Over 2.5, multi-sports. Précision historique{' '}
              <span className="text-success font-bold glow-text-green">~87%</span> — pour parieurs pros en Afrique et dans le monde.
              Aucune garantie future.
            </motion.p>

            {/* Bonus subtitle */}
            <motion.p
              variants={staggerChildFadeUp}
              className="text-gold text-xs sm:text-base font-semibold mb-4 sm:mb-6 max-w-xl mx-auto lg:mx-0"
            >
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Bonus 90 000 XOF (150$) avec <span className="text-success-light font-bold">{SITE.promoCode}</span> — Wave / Orange Money / Free Money
              </span>
            </motion.p>

            {/* 18+ Badge */}
            <motion.div
              variants={staggerChildFadeUp}
              className="flex justify-center lg:justify-start mb-6"
            >
              <div className="inline-flex items-center gap-1.5 bg-brand/40 border border-success/25 rounded-full px-2.5 py-1">
                <span className="text-success-light font-bold text-xs">18+</span>
                <span className="text-[10px] text-gray-500">Jeu réservé aux adultes • Risques de perte</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={staggerChildFadeUp}
              className="flex flex-wrap gap-3 justify-center lg:justify-start items-center"
            >
              <motion.a
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                href="#free-predictions"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-6 py-3 btn-success cta-glow text-sm font-semibold rounded-xl"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2 a10 10 0 0 1 10 10 l-10 0 z" fill="currentColor" />
                </svg>
                Accéder aux pronostics du jour
              </motion.a>

              <motion.a
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 btn-ghost text-xs sm:text-sm font-medium rounded-xl"
              >
                Découvrir la méthode IA
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.a>
            </motion.div>

            {/* Promo code inline */}
            <motion.div
              variants={staggerChildFadeUp}
              className="mt-6 flex justify-center lg:justify-start"
            >
              <motion.div
                variants={cardHoverLift}
                whileHover="hover"
                whileTap="tap"
                className="glass-promo px-4 py-3 inline-flex items-center gap-3"
              >
                <div>
                  <div className="text-[9px] text-gold-light uppercase tracking-[0.15em] font-bold">Code promo</div>
                  <motion.span
                    variants={badgePulse}
                    animate="animate"
                    className="text-base font-black tracking-[0.12em] promo-code-shimmer"
                  >
                    {SITE.promoCode}
                  </motion.span>
                </div>
                <motion.button
                  variants={buttonHover}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={copyPromoCode}
                  className={`flex items-center gap-1 text-xs font-semibold transition-all px-2.5 py-1.5 rounded-lg border ${
                    copied ? 'border-success/40 text-success bg-success/10' : 'border-gold/30 text-gold-light bg-gold/5'
                  }`}
                  aria-label="Copier le code promo"
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Copié
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      Copier
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* ── RIGHT — Match of the day card ── */}
          <motion.div variants={staggerChildFadeUp} className="relative">
            {topPrediction && matchTeams ? (
              <motion.div variants={cardHoverLift} whileHover="hover" className="relative">
                <div className="squircle-xl p-5 sm:p-6 relative overflow-hidden border-2 border-success/20">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-success to-transparent" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex items-center gap-2">
                      <span className="badge badge-mint badge-pulse">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/></svg>
                        Match du jour
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold hidden sm:inline">
                        {topPrediction.league}
                      </span>
                    </div>
                    {status === 'live' && (
                      <span className="badge badge-live">
                        <span className="v31-ticker-dot live" /> LIVE
                      </span>
                    )}
                    {status === 'upcoming' && (
                      <span className="text-[10px] text-gray-500 mono">
                        {topPrediction.time || topPrediction.date}
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 mb-5">
                    <div className="flex flex-col items-center text-center">
                      {topPrediction.homeLogo ? (
                        <img src={topPrediction.homeLogo} alt={matchTeams.home} className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" loading="lazy" />
                      ) : (
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-panel-2 rounded-xl mb-2 flex items-center justify-center text-success font-bold text-xl">
                          {matchTeams.home.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-full">{matchTeams.home}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-success mono">VS</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{topPrediction.date}</div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      {topPrediction.awayLogo ? (
                        <img src={topPrediction.awayLogo} alt={matchTeams.away} className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2" loading="lazy" />
                      ) : (
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-panel-2 rounded-xl mb-2 flex items-center justify-center text-success font-bold text-xl">
                          {matchTeams.away.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-full">{matchTeams.away}</span>
                    </div>
                  </div>

                  {/* Prediction block */}
                  <div className="bg-midnight/50 rounded-lg p-4 mb-4 border border-edge">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pronostic IA</span>
                      <span className="badge badge-mint">{topPrediction.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-success glow-text-green">
                          {topPrediction.prediction}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {topPrediction.analysis?.bttsProb && topPrediction.type === 'BTTS'
                            ? `${Math.round(topPrediction.analysis.bttsProb * 100)}% de proba estimée`
                            : topPrediction.analysis?.over25Prob && topPrediction.type.includes('Over')
                            ? `${Math.round(topPrediction.analysis.over25Prob * 100)}% de proba estimée`
                            : 'Modèle Poisson calibré'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-bold text-success tabular-nums glow-text-green">
                          {topPrediction.confidence}%
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Confiance</div>
                      </div>
                    </div>
                    <div className="confidence-bar mt-3">
                      <div className="confidence-bar-fill" style={{ width: `${topPrediction.confidence}%` }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <PremiumButton variant="linebet" href={AFFILIATE.linebet} size="md" fullWidth>
                    Parier sur Linebet →
                  </PremiumButton>
                </div>
              </motion.div>
            ) : (
              <div className="squircle-xl p-6 h-96 animate-pulse flex items-center justify-center">
                <div className="text-gray-600 text-sm">Chargement du match du jour…</div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ═══ STATS ROW ═══ */}
        <motion.div
          variants={staggerChildFadeUp}
          className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto mt-8 sm:mt-16"
        >
          <div className="stat-tile">
            <div className="text-lg sm:text-3xl font-bold text-success tabular-nums glow-text-green">~87%</div>
            <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Précision historique</div>
          </div>
          <div className="stat-tile">
            <div className="text-lg sm:text-3xl font-bold text-white tabular-nums">15 000+</div>
            <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Matchs analysés</div>
          </div>
          <div className="stat-tile">
            <div className="text-lg sm:text-3xl font-bold text-gold tabular-nums">50+</div>
            <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Championnats</div>
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-3xl mx-auto mt-6 sm:mt-8"
        >
          <motion.div
            key={testimonialIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 text-center sm:text-left"
          >
            <p className="text-xs text-gray-400 italic leading-relaxed">« {currentTestimonial.text} »</p>
            <p className="text-[10px] text-gray-600 mt-1">— {currentTestimonial.name}, {currentTestimonial.city}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 4 }}
            animate={isVisible ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand/10 border border-success/30 rounded-full flex-shrink-0"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#00D68F">
              <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
            </svg>
            <span className="text-[10px] text-success-light font-semibold uppercase tracking-wider">VIP Premium</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-success text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          >
            ✓ Code VISION221 copié !
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
