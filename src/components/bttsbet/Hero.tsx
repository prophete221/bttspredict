'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, SOCIAL_PROOF, TESTIMONIALS, URGENCY_MESSAGES } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { FloatingParticles } from './AnimatedIcons'
import { staggerContainer, staggerChildFadeUp, buttonHover, badgePulse, EASE, DUR, cardHoverLift } from '@/lib/motionPresets'

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
    homeLambda?: number
    awayLambda?: number
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

  // Load top prediction of the day
  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const preds: Prediction[] = data.predictions || []
        if (preds.length === 0) return
        // Pick the prediction with highest confidence
        const top = preds.reduce((best, p) =>
          (p.confidence || 0) > (best.confidence || 0) ? p : best, preds[0])
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

  // Format match teams for display
  const matchTeams = useMemo(() => {
    if (!topPrediction?.match) return null
    const parts = topPrediction.match.split(/\s+vs?\s+/i)
    return { home: parts[0] || '', away: parts[1] || '' }
  }, [topPrediction])

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background — Stadium night atmosphere */}
      <div className="absolute inset-0 bg-midnight" />
      <div className="stadium-glow-top" />
      <div className="stadium-glow-bottom-right" />
      <div className="stadium-glow-bottom-left" />
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <FloatingParticles count={20} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 sm:pt-12 sm:pb-16"
      >
        {/* Ticker — Live indicator pill */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-edge/60 rounded-full px-4 py-1.5 backdrop-blur-md">
            <span className="v31-ticker-dot" />
            <span className="text-[10px] sm:text-xs text-gold font-semibold tracking-wider uppercase">IA en direct</span>
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

        {/* ═══ TWO-COLUMN HERO: Headline + Top Prediction Card ═══ */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── LEFT — Headline + CTA ── */}
          <div className="text-center lg:text-left">
            <motion.h1
              variants={staggerChildFadeUp}
              className="section-title-lg mb-5"
            >
              Pronostics <span className="text-gold">BTTS</span>
              <br />
              & <span className="text-ultra">Over 2.5</span>
              <br />
              <span className="text-success">par IA</span>
            </motion.h1>

            <motion.p
              variants={staggerChildFadeUp}
              className="text-gray-400 text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-5 leading-relaxed"
            >
              Notre IA analyse <span className="text-white font-semibold">50 000+ matchs</span> en temps réel :
              xG, forme, blessés, historique. Précision historique{' '}
              <span className="text-gold font-bold">~87%</span>. Aucune garantie future.
            </motion.p>

            {/* Senegal-focused subtitle */}
            <motion.p
              variants={staggerChildFadeUp}
              className="text-gold text-xs sm:text-sm font-bold mb-6 max-w-md mx-auto lg:mx-0"
            >
              Bonus 90 000 XOF (150$) avec <span className="text-linebet font-bold">VISION221</span> — Dépôt Wave / Orange Money / Free Money
            </motion.p>

            {/* 18+ Badge */}
            <motion.div
              variants={staggerChildFadeUp}
              className="flex justify-center lg:justify-start mb-6"
            >
              <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/25 rounded-full px-3 py-1">
                <span className="text-gold font-extrabold text-xs">18+</span>
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
                className="w-full max-w-md glass-promo squircle-lg px-5 py-4 sm:px-6 sm:py-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-gold uppercase tracking-[0.15em] font-bold mb-1">Code Promo Exclusif</div>
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
                      copied ? 'border-success/40 text-success bg-success/10' : 'border-gold/30 text-gold bg-gold/5'
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
                  À utiliser sur <span className="text-linebet font-semibold">Linebet</span> ou <span className="text-star888 font-semibold">888starz</span>
                </p>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerChildFadeUp}
              className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start items-center"
            >
              <motion.a
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                href={AFFILIATE.linebet}
                rel={AFFILIATE.rel}
                target="_blank"
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 btn-linebet cta-glow text-[#04150C] text-xs sm:text-sm font-bold"
              >
                <img src="/logos/linebet.svg" alt="Linebet" className="h-4 w-auto object-contain flex-shrink-0" loading="lazy" />
                <span className="sm:hidden">Bonus 90 000 XOF</span>
                <span className="hidden sm:inline">S'inscrire → Bonus 90 000 XOF (150$)</span>
              </motion.a>

              <motion.a
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                href={AFFILIATE.star888}
                rel={AFFILIATE.rel}
                target="_blank"
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 sm:px-6 sm:py-3 btn-star888 cta-glow text-[#1A0008] text-xs sm:text-sm font-bold"
              >
                <img src="/logos/888starz.svg" alt="888starz" className="h-4 w-auto object-contain flex-shrink-0" loading="lazy" />
                <span>888starz Bonus 100%</span>
              </motion.a>
            </motion.div>
          </div>

          {/* ── RIGHT — Top Prediction Card (the star of the show) ── */}
          <motion.div
            variants={staggerChildFadeUp}
            className="relative"
          >
            {topPrediction && matchTeams ? (
              <motion.div
                variants={cardHoverLift}
                whileHover="hover"
                className="gradient-border p-[1px] squircle-xl"
              >
                <div className="bg-panel-2 squircle-xl p-5 sm:p-6 relative overflow-hidden">
                  {/* Top label */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2">
                      <span className="badge badge-gold badge-pulse">⭐ Top du jour</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {topPrediction.league}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mono">{topPrediction.time || '--:--'}</span>
                  </div>

                  {/* Teams */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 mb-5">
                    {/* Home team */}
                    <div className="flex flex-col items-center text-center">
                      {topPrediction.homeLogo ? (
                        <img
                          src={topPrediction.homeLogo}
                          alt={matchTeams.home}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-panel rounded-full mb-2" />
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-full">
                        {matchTeams.home}
                      </span>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-black text-gold mono">VS</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{topPrediction.date}</div>
                    </div>

                    {/* Away team */}
                    <div className="flex flex-col items-center text-center">
                      {topPrediction.awayLogo ? (
                        <img
                          src={topPrediction.awayLogo}
                          alt={matchTeams.away}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-2"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-panel rounded-full mb-2" />
                      )}
                      <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-full">
                        {matchTeams.away}
                      </span>
                    </div>
                  </div>

                  {/* Prediction */}
                  <div className="bg-midnight/50 rounded-xl p-4 mb-4 border border-edge">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pronostic IA</span>
                      <span className="badge badge-mint">{topPrediction.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-gold">
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
                        <div className="text-3xl sm:text-4xl font-black text-success tabular-nums">
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
                  <motion.a
                    variants={buttonHover}
                    whileHover="hover"
                    whileTap="tap"
                    href={AFFILIATE.linebet}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    className="flex items-center justify-center gap-2 px-4 py-3 btn-gold cta-glow text-xs sm:text-sm font-bold w-full"
                  >
                    <span>Parier sur Linebet →</span>
                  </motion.a>
                </div>
              </motion.div>
            ) : (
              // Skeleton while loading
              <div className="gradient-border p-[1px] squircle-xl">
                <div className="bg-panel-2 squircle-xl p-6 h-80 animate-pulse flex items-center justify-center">
                  <div className="text-gray-600 text-sm">Chargement du top pronostic…</div>
                </div>
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
            <div className="text-xl sm:text-3xl font-extrabold text-gold tabular-nums">~87%</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Précision historique</div>
          </div>
          <div className="stat-tile">
            <div className="text-xl sm:text-3xl font-extrabold text-white tabular-nums">15K+</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Matchs analysés</div>
          </div>
          <div className="stat-tile">
            <div className="text-xl sm:text-3xl font-extrabold text-ultra tabular-nums">50+</div>
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
            className="squircle px-4 py-2.5 text-center flex-shrink-0 bg-gold/[0.06] border border-gold/20"
          >
            <div className="text-[9px] text-gold uppercase tracking-wider font-bold mb-0.5">VIP</div>
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
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-success/90 text-midnight px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          >
            ✓ Code VISION221 copié !
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
