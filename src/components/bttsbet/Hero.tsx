'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, SOCIAL_PROOF, TESTIMONIALS, URGENCY_MESSAGES } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { Football3D, FloatingParticles } from './AnimatedIcons'
import { staggerContainer, staggerChildFadeUp, buttonHover, badgePulse, EASE, DUR, cardHoverLift } from '@/lib/motionPresets'

export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const [copied, setCopied] = useState(false)
  const [urgencyIndex, setUrgencyIndex] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

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

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background — Clean gradient + particles */}
      <div className="absolute inset-0 bg-midnight" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(800px,100vw)] h-[500px] bg-gold/[0.06] rounded-full blur-[160px]" />
      <div className="absolute bottom-0 right-0 w-[min(400px,60vw)] h-[400px] bg-ultra/[0.04] rounded-full blur-[120px]" />
      <FloatingParticles count={16} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4 sm:pt-12 sm:pb-5"
      >
        {/* 3D Football — Desktop only, top right area */}
        <div className="hidden lg:block absolute top-20 right-8 xl:right-16">
          <Football3D size={80} />
        </div>

        {/* Ticker — Minimal pill */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex justify-center mb-5 sm:mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-edge/60 rounded-full px-4 py-1.5">
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

        {/* Headline — Large, bold, clean */}
        <motion.h1
          variants={staggerChildFadeUp}
          className="text-center section-title mb-4 sm:mb-5"
        >
          Gagne tes paris{' '}
          <span className="text-gold">BTTS</span>
          {' '}&{' '}
          <span className="text-ultra">Over 2.5</span>
        </motion.h1>

        {/* Sub-headline — Clean, spaced */}
        <motion.p
          variants={staggerChildFadeUp}
          className="text-center text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-5 sm:mb-6 px-2 leading-relaxed"
        >
          Précision IA historique ~87% • 15 000+ matchs analysés •{' '}
          <span className="text-white font-medium">{SOCIAL_PROOF.members.toLocaleString()}+ parieurs</span> qui gagnent déjà
        </motion.p>

        {/* Senegal-focused subtitle */}
        <p className="text-center text-gold text-xs sm:text-sm font-bold mt-1 max-w-md mx-auto">
          Bonus 90 000 XOF (150$) avec <span className="text-linebet font-bold">VISION221</span> — Dépôt Wave / Orange Money / Free Money
        </p>

        {/* 18+ Badge — Legal requirement */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/25 rounded-full px-3 py-1">
            <span className="text-gold font-extrabold text-xs">18+</span>
            <span className="text-[10px] text-gray-500">Jeu réservé aux adultes<span className="hidden xs:inline"> • Les paris comportent des risques</span></span>
          </div>
        </motion.div>

        {/* ═══ PROMO CODE — Animated card ═══ */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex justify-center mb-5 sm:mb-6"
        >
          <motion.div 
            variants={cardHoverLift}
            whileHover="hover"
            whileTap="tap"
            className="w-full max-w-md glass-promo squircle-lg px-5 py-5 sm:px-8 sm:py-6"
          >
            {/* Label */}
            <div className="text-center mb-3">
              <span className="text-[10px] sm:text-xs text-gold uppercase tracking-[0.15em] font-bold">Code Promo Exclusif</span>
            </div>

            {/* Promo code + Copy */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <motion.span 
                variants={badgePulse}
                animate="animate"
                className="text-2xl sm:text-3xl font-black tracking-[0.12em] promo-code-shimmer"
              >
                {SITE.promoCode}
              </motion.span>
              <motion.button
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
                onClick={copyPromoCode}
                className={`promo-copy-btn flex items-center gap-1.5 text-xs sm:text-sm font-bold transition-all ${
                  copied ? 'border-success/40 text-success' : 'text-gold'
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

            {/* Instruction */}
            <p className="text-center text-[11px] sm:text-xs text-gray-500">
              Utilise sur <span className="text-linebet font-semibold">Linebet</span> ou <span className="text-star888 font-semibold">888starz</span> pour ton bonus
            </p>
          </motion.div>
        </motion.div>

        {/* CTA Buttons — Premium hover animations */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex flex-row flex-wrap gap-2 sm:gap-3 justify-center items-center mb-6 sm:mb-8 mx-auto"
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
            <img src="/logos/linebet.svg" alt="Linebet" className="h-4 sm:h-4.5 w-auto object-contain flex-shrink-0" loading="lazy" />
            <span className="sm:hidden">Bonus 90 000 XOF</span>
            <span className="hidden sm:inline">S&apos;inscrire → Bonus 90 000 XOF (150$)</span>
          </motion.a>
        </motion.div>

        {/* Stats — Animated row — flex-wrap for very small screens */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex justify-center gap-4 sm:gap-8 md:gap-12 mb-5 flex-wrap"
        >
          <div className="text-center min-w-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gold tabular-nums">~87%</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Précision</div>
          </div>
          <div className="hidden sm:block w-px bg-edge/40 self-stretch" />
          <div className="text-center min-w-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tabular-nums">15K+</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Analysés</div>
          </div>
          <div className="hidden sm:block w-px bg-edge/40 self-stretch" />
          <div className="text-center min-w-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gold tabular-nums">50+</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">Championnats</div>
          </div>
        </motion.div>

        {/* Social Proof — Minimal */}
        <motion.div
          variants={staggerChildFadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
        >
          {/* Testimonial */}
          <motion.div
            key={testimonialIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 text-center sm:text-left"
          >
            <p className="text-xs text-gray-400 italic leading-relaxed">&laquo; {currentTestimonial.text} &raquo;</p>
            <p className="text-[10px] text-gray-600 mt-1">— {currentTestimonial.name}, {currentTestimonial.city}</p>
          </motion.div>

          {/* Urgency — VIP Badge with pulse */}
          <motion.div
            variants={badgePulse}
            animate="animate"
            className="squircle px-4 py-2.5 text-center flex-shrink-0 bg-gold/[0.06] border border-gold/20"
          >
            <div className="text-[9px] text-gold uppercase tracking-wider font-bold mb-0.5">VIP</div>
            <div className="text-sm sm:text-base font-black text-white">
              Historique complet + 10 matchs/jour
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
