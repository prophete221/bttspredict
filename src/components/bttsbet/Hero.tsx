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

  // Load top UPCOMING prediction of the day (filter out finished matches)
  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const preds: Prediction[] = data.predictions || []
        if (preds.length === 0) return

        // Filter out finished matches
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const visible = preds.filter(p => {
          if (!p.date) return false
          const matchDay = new Date(p.date + 'T00:00:00'); matchDay.setHours(0, 0, 0, 0)
          if (matchDay.getTime() < today.getTime()) return false
          if (matchDay.getTime() > today.getTime()) return true  // future = OK
          // Today — check time
          if (!p.time || p.time === '--:--' || !/^\d{2}:\d{2}$/.test(p.time)) return true
          const [h, m] = p.time.split(':').map(Number)
          const matchDateTime = new Date(p.date + 'T00:00:00')
          matchDateTime.setHours(h, m, 0, 0)
          const diffMs = matchDateTime.getTime() - Date.now()
          // Show if upcoming OR live (within last 2.5h)
          return diffMs > -2.5 * 60 * 60 * 1000
        })

        if (visible.length === 0) {
          setTopPrediction(null)
          return
        }

        // Pick the one with highest confidence (and upcoming preferred)
        const upcoming = visible.filter(p => {
          if (!p.time || p.time === '--:--') return true
          const [h, m] = p.time.split(':').map(Number)
          const matchDateTime = new Date(p.date + 'T00:00:00')
          matchDateTime.setHours(h, m, 0, 0)
          return matchDateTime.getTime() > Date.now()
        })

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

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-12 sm:pt-16 pb-12 sm:pb-20">
      {/* Aurora background orbs */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>
      <FloatingParticles count={20} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6"
      >
        {/* Ticker — Live indicator pill */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5">
            <span className="v31-ticker-dot" />
            <span className="text-[10px] sm:text-xs text-violet-light font-semibold tracking-wider uppercase">IA en direct</span>
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── LEFT — Headline + CTA ── */}
          <div className="text-center lg:text-left">
            <motion.div variants={staggerChildFadeUp} className="mb-4">
              <span className="eyebrow">Plateforme IA nouvelle génération</span>
            </motion.div>

            <motion.h1
              variants={staggerChildFadeUp}
              className="section-title-lg mb-5"
            >
              Pronostics <span className="gradient-text-violet-cyan">football</span>
              <br />
              propulsés par <span className="gradient-text-coral-amber">IA</span>
            </motion.h1>

            <motion.p
              variants={staggerChildFadeUp}
              className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed"
            >
              Notre IA analyse <span className="text-white font-semibold">50 000+ matchs</span> en temps réel :
              xG, forme, blessés, historique. Précision historique{' '}
              <span className="text-violet-light font-bold glow-text-violet">~87%</span>.
              Aucune garantie future.
            </motion.p>

            {/* Senegal-focused subtitle */}
            <motion.p
              variants={staggerChildFadeUp}
              className="text-coral-light text-sm sm:text-base font-bold mb-6 max-w-xl mx-auto lg:mx-0 urgency-pulse"
            >
              Bonus 90 000 XOF (150$) avec <span className="text-linebet-light font-bold">VISION221</span> — Wave / Orange Money / Free Money
            </motion.p>

            {/* 18+ Badge */}
            <motion.div
              variants={staggerChildFadeUp}
              className="flex justify-center lg:justify-start mb-6"
            >
              <div className="inline-flex items-center gap-1.5 bg-violet/10 border border-violet/25 rounded-full px-3 py-1">
                <span className="text-violet-light font-extrabold text-xs">18+</span>
                <span className="text-[10px] text-gray-500">Jeu réservé aux adultes • Les paris comportent des risques</span>
              </div>
            </motion.div>

            {/* ═══ PROMO CODE — Compact inline card ═══ */}
            <motion.div
              variants={staggerChildFadeUp}
              className="flex justify-center lg:justify-start mb-6"
            >
              <motion.div
                variants={cardHoverLift}
                whileHover="hover"
                whileTap="tap"
                className="w-full max-w-md glass-promo px-5 py-4 sm:px-6 sm:py-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-violet-light uppercase tracking-[0.15em] font-bold mb-1">Code Promo Exclusif</div>
                    <motion.span
                      variants={badgePulse}
                      animate="animate"
                      className="text-xl sm:text-2xl font-black tracking-[0.12em] promo-code-shimmer block"
                    >
                      {SITE.promoCode}
                    </motion.span>
                  </div>
                  <motion.button
                    variants={buttonHover}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={copyPromoCode}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all px-3 py-2 rounded-lg border ${
                      copied ? 'border-success/40 text-success bg-success/10' : 'border-violet/30 text-violet-light bg-violet/5'
                    }`}
                    aria-label="Copier le code promo"
                  >
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        Copié
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        Copier
                      </>
                    )}
                  </motion.button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  À utiliser sur <span className="text-linebet-light font-semibold">Linebet</span> ou <span className="text-star888-light font-semibold">888starz</span>
                </p>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerChildFadeUp}
              className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start items-center"
            >
              <PremiumButton variant="linebet" href={AFFILIATE.linebet} size="md">
                <span className="sm:hidden">Bonus 90 000 XOF</span>
                <span className="hidden sm:inline">Inscription → Bonus 90 000 XOF</span>
              </PremiumButton>

              <PremiumButton variant="star888" href={AFFILIATE.star888} size="md">
                888starz Bonus 100%
              </PremiumButton>
            </motion.div>
          </div>

          {/* ── RIGHT — Top Prediction Card ── */}
          <motion.div
            variants={staggerChildFadeUp}
            className="relative"
          >
            {topPrediction && matchTeams ? (
              <motion.div
                variants={cardHoverLift}
                whileHover="hover"
                className="relative"
              >
                <div className="glass-promo p-5 sm:p-6 relative overflow-hidden">
                  {/* Holographic gradient border effect */}
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, transparent 30%, transparent 70%, rgba(6, 182, 212, 0.4) 100%)',
                      padding: '1px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />

                  {/* Top label */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2">
                      <span className="badge badge-gold badge-pulse">⭐ Top du jour</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {topPrediction.league}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mono">{topPrediction.time || formatTimeFallback(topPrediction.date)}</span>
                  </div>

                  {/* Teams */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 mb-5">
                    {/* Home team */}
                    <div className="flex flex-col items-center text-center">
                      {topPrediction.homeLogo ? (
                        <img
                          src={topPrediction.homeLogo}
                          alt={matchTeams.home}
                          className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-panel rounded-2xl mb-2 flex items-center justify-center text-violet-light font-bold text-xl">
                          {matchTeams.home.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-full">
                        {matchTeams.home}
                      </span>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-black gradient-text-violet-cyan mono">VS</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{topPrediction.date}</div>
                    </div>

                    {/* Away team */}
                    <div className="flex flex-col items-center text-center">
                      {topPrediction.awayLogo ? (
                        <img
                          src={topPrediction.awayLogo}
                          alt={matchTeams.away}
                          className="w-14 h-14 sm:w-20 sm:h-20 object-contain mb-2"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-panel rounded-2xl mb-2 flex items-center justify-center text-violet-light font-bold text-xl">
                          {matchTeams.away.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-full">
                        {matchTeams.away}
                      </span>
                    </div>
                  </div>

                  {/* Prediction */}
                  <div className="bg-midnight/60 backdrop-blur-md rounded-xl p-4 mb-4 border border-edge">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pronostic IA</span>
                      <span className="badge badge-cyan">{topPrediction.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-violet-light glow-text-violet">
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
                        <div className="text-3xl sm:text-4xl font-black text-success tabular-nums glow-text-coral" style={{ color: 'var(--color-coral-light)' }}>
                          {topPrediction.confidence}%
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Confiance</div>
                      </div>
                    </div>
                    {/* Confidence bar */}
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
              // Skeleton while loading
              <div className="glass-promo p-6 h-96 animate-pulse flex items-center justify-center">
                <div className="text-gray-600 text-sm">Chargement du top pronostic…</div>
              </div>
            )}

            {/* Floating badge — Live analysis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-20"
            >
              <div className="bg-success/10 backdrop-blur-md border border-success/30 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <span className="v31-ticker-dot" />
                <span className="text-[10px] text-success font-bold uppercase tracking-wider">Analyse IA</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ═══ STATS ROW ═══ */}
        <motion.div
          variants={staggerChildFadeUp}
          className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mt-12 sm:mt-16"
        >
          <div className="stat-tile">
            <div className="text-xl sm:text-3xl font-bold text-violet-light tabular-nums">~87%</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Précision historique</div>
          </div>
          <div className="stat-tile">
            <div className="text-xl sm:text-3xl font-bold text-white tabular-nums">15K+</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Matchs analysés</div>
          </div>
          <div className="stat-tile">
            <div className="text-xl sm:text-3xl font-bold text-cyan-light tabular-nums">50+</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Championnats</div>
          </div>
        </motion.div>

        {/* Social Proof — Testimonial */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto mt-8"
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
            variants={badgePulse}
            animate="animate"
            className="squircle px-4 py-2.5 text-center flex-shrink-0 bg-violet/[0.08] border border-violet/25"
          >
            <div className="text-[9px] text-violet-light uppercase tracking-wider font-bold mb-0.5">VIP</div>
            <div className="text-sm sm:text-base font-black text-white">
              Historique + 10 matchs/jour
            </div>
            <div className="text-[9px] text-gray-500">Débloque avec VISION221</div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Copy Toast — Floating notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-success/95 text-midnight px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md"
          >
            ✓ Code VISION221 copié !
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function formatTimeFallback(date: string): string {
  try {
    const d = new Date(date + 'T12:00:00')
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  } catch { return '--:--' }
}
