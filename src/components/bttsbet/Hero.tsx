'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SITE, AFFILIATE, SOCIAL_PROOF, TESTIMONIALS, URGENCY_MESSAGES } from '@/lib/constants'
import { useCountUp, useScrollAnimation } from '@/hooks/useAnimations'

/** AnimatedStat — counts up to target value when in view. */
function AnimatedStat({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
}: {
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const [ref, display] = useCountUp(value, duration, { decimals, threshold: 0.3 })
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const [copied, setCopied] = useState(false)
  const [urgencyIndex, setUrgencyIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  // Rotate urgency messages
  useEffect(() => {
    const interval = setInterval(() => {
      setUrgencyIndex((i) => (i + 1) % URGENCY_MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(interval)
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
    .replace('{n}', String(SOCIAL_PROOF.vipSpotsLeft))

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-midnight" />
        {/* Mesh gradient orbs */}
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[500px] bg-emerald/8 rounded-full blur-[140px] opacity-80" />
        <div className="absolute top-[5%] right-1/4 w-[450px] h-[400px] bg-emerald-dark/6 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-emerald/3 rounded-full blur-[100px]" />
        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
        {/* Urgent Ticker — Social proof + urgency rotating messages */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-5 sm:mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-emerald/8 border border-emerald/25 rounded-full px-3 sm:px-4 py-1.5 backdrop-blur-xl">
            <span className="v31-ticker-dot" />
            <span className="text-[10px] sm:text-xs text-emerald font-semibold tracking-wider uppercase">IA en direct</span>
            <span className="text-gray-600 text-[10px]">•</span>
            <motion.span
              key={urgencyIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] sm:text-xs text-gray-400"
            >
              {currentUrgency}
            </motion.span>
          </div>
        </motion.div>

        {/* Main Headline — Direct, benefit-focused */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-7xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight"
        >
          GAGNE TES PARIS{' '}
          <span className="text-emerald neon-glow">BTTS</span>
          {' '}&{' '}
          <span className="text-gold neon-glow-blue">OVER 2.5</span>
        </motion.h1>

        {/* Sub-headline — Social proof numbers */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-400 text-sm sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8 px-2"
        >
          +87% de précision vérifiée • 15 000+ pronostics analysés •{' '}
          <span className="text-success font-semibold">{SOCIAL_PROOF.members.toLocaleString()}+ parieurs</span> qui gagnent déjà
        </motion.p>

        {/* ═══════ PROMO CODE — THE MAIN CONVERSION ELEMENT ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="relative w-full max-w-lg">
            {/* Glow behind */}
            <div className="absolute inset-0 bg-gold/8 rounded-2xl blur-xl pointer-events-none" />

            <div className="relative bg-panel/90 border-2 border-gold/40 rounded-2xl px-5 py-5 sm:px-8 sm:py-6 backdrop-blur-xl overflow-hidden">
              {/* Top sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

              {/* Label */}
              <div className="text-center mb-2">
                <span className="text-[10px] sm:text-xs text-gold uppercase tracking-widest font-bold">🎁 Code Promo Exclusif</span>
              </div>

              {/* Promo code + Copy button */}
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl sm:text-4xl font-black tracking-[0.15em] promo-code-shimmer">
                  {SITE.promoCode}
                </span>
                <button
                  onClick={copyPromoCode}
                  className={`promo-copy-btn flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all ${
                    copied ? 'border-success/60 text-success' : 'text-gold'
                  }`}
                  aria-label="Copier le code promo"
                >
                  {copied ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      COPIÉ ✓
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      COPIER
                    </>
                  )}
                </button>
              </div>

              {/* Instruction */}
              <p className="text-center text-[11px] sm:text-xs text-gray-500">
                Utilise ce code sur <span className="text-linebet font-semibold">Linebet</span> ou <span className="text-star888 font-semibold">888starz</span> pour ton bonus exclusif
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bookmaker CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-stretch sm:items-center mb-8 sm:mb-10 max-w-md sm:max-w-none mx-auto"
        >
          <a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            className="v31-cta-wave flex items-center justify-center gap-2 px-4 py-2 btn-linebet text-[#06281F] text-xs sm:text-sm font-bold"
            data-cursor="hover"
          >
            <img src="/logos/linebet.svg" alt="Linebet" className="h-4 w-auto object-contain flex-shrink-0" loading="lazy" />
            S&apos;inscrire → Bonus 150$
          </a>
          <a
            href={AFFILIATE.star888}
            rel={AFFILIATE.rel}
            target="_blank"
            className="v31-cta-wave flex items-center justify-center gap-2 px-4 py-2 btn-star888 text-white text-xs sm:text-sm font-bold"
            data-cursor="hover"
          >
            <img src="/logos/888starz.svg" alt="888starz" className="h-4 w-auto object-contain flex-shrink-0" loading="lazy" />
            S&apos;inscrire → Bonus 100%
          </a>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="relative w-full max-w-2xl bg-panel/70 border border-edge rounded-2xl px-4 py-3.5 sm:px-8 sm:py-4 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

            <div className="relative flex items-center justify-between gap-2 sm:gap-6">
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-extrabold text-emerald neon-glow tabular-nums">
                  {isVisible ? <AnimatedStat value={87} duration={1800} suffix="%" prefix="~" /> : <span>~87%</span>}
                </div>
                <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <span className="pastille pastille-cyan" />
                  Précision
                </div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  {isVisible ? <AnimatedStat value={15} duration={1600} suffix="K+" /> : <span>15K+</span>}
                </div>
                <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <span className="pastille pastille-amber" />
                  Analysés
                </div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-extrabold text-gold tabular-nums">
                  {isVisible ? <AnimatedStat value={50} duration={1500} suffix="+" /> : <span>50+</span>}
                </div>
                <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <span className="pastille pastille-green" />
                  Championnats
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof Row — Testimonial + Urgency */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto"
        >
          {/* Testimonial */}
          <motion.div
            key={testimonialIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="testimonial-card flex-1 text-center sm:text-left"
          >
            <p className="text-xs text-gray-400 italic mb-1">&laquo; {currentTestimonial.text} &raquo;</p>
            <p className="text-[10px] text-gray-600">— {currentTestimonial.name}, {currentTestimonial.city}</p>
          </motion.div>

          {/* Urgency — VIP Spots */}
          <div className="urgent-badge rounded-xl px-4 py-2.5 text-center flex-shrink-0">
            <div className="text-[10px] text-red-400 uppercase tracking-wider font-bold mb-0.5">Offre limitée</div>
            <div className="text-lg font-black text-white tabular-nums">
              {SOCIAL_PROOF.vipSpotsLeft}<span className="text-gray-500 text-sm">/{SOCIAL_PROOF.totalVipSpots}</span>
            </div>
            <div className="text-[9px] text-gray-500">places VIP restantes</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
