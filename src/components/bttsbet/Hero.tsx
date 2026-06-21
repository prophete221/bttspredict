'use client'

import { motion } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'
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

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background — dark blue/teal gradient with subtle data grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-midnight" />
        {/* Mesh gradient orbs — cyan + teal + amber */}
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[500px] bg-emerald/10 rounded-full blur-[140px] opacity-80" />
        <div className="absolute top-[5%] right-1/4 w-[450px] h-[400px] bg-emerald-dark/8 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-gold/6 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-emerald/4 rounded-full blur-[100px]" />
        {/* Subtle conic gradient — slow aurora swirl */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.05]"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, #32B0C8 0deg, transparent 60deg, #F5A524 120deg, transparent 180deg, #1E6B7A 240deg, transparent 300deg, #32B0C8 360deg)',
            borderRadius: '50%',
          }}
        />
        {/* Data grid overlay — IA dashboard feel */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: 'linear-gradient(rgba(50,176,200,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(50,176,200,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
          }}
        />
        {/* Bottom divider line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/40 to-transparent" />
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
        {/* Top badge — IA live indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-5 sm:mb-6"
        >
          <div className="group inline-flex items-center gap-2 bg-emerald/8 border border-emerald/25 rounded-full px-3 sm:px-4 py-1.5 backdrop-blur-xl">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 bg-emerald rounded-full animate-ping opacity-75" />
              <span className="relative w-1.5 h-1.5 bg-emerald rounded-full" />
            </span>
            <span className="text-[10px] sm:text-xs text-emerald font-semibold tracking-wider uppercase">IA en direct</span>
            <span className="text-gray-600 text-[10px] sm:text-xs">•</span>
            <span className="text-[10px] sm:text-xs text-gray-400">Mis à jour il y a 2 min</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-[2.25rem] leading-[1.1] sm:text-5xl lg:text-7xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight"
        >
          PRONOSTICS{' '}
          <span className="text-emerald neon-glow">BTTS</span>
          {' '}&{' '}
          <span className="text-gold">OVER 2.5</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-400 text-sm sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8 px-2"
        >
          Propulsé par l&apos;intelligence artificielle — {SITE.accuracy} de précision sur 15 000+ pronostics
        </motion.p>

        {/* CTA buttons — primary + outline + brand-safe
            Mobile: full-width stacked (more app-like, less blog-like) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-stretch sm:items-center mb-8 sm:mb-10 max-w-md sm:max-w-none mx-auto"
        >
          <button
            onClick={() => {
              const el = document.getElementById('free-predictions')
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setTimeout(() => window.scrollBy({ top: -64, behavior: 'smooth' }), 400)
              }
            }}
            className="px-6 sm:px-8 py-3.5 btn-emerald text-sm sm:text-base"
            data-cursor="hover"
          >
            Pronostics du jour
          </button>
          <a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3.5 btn-linebet text-[#06281F] text-sm sm:text-base"
            data-cursor="hover"
          >
            <img src="/logos/linebet.svg" alt="Linebet" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
            Bonus 150$
          </a>
          <a
            href={AFFILIATE.star888}
            rel={AFFILIATE.rel}
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3.5 btn-star888 text-white text-sm sm:text-base"
            data-cursor="hover"
          >
            <img src="/logos/888starz.svg" alt="888starz" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
            Bonus 100%
          </a>
        </motion.div>

        {/* IA Stats Card — premium dashboard style with 3 stat panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-2xl bg-panel/70 border border-edge rounded-2xl px-4 py-3.5 sm:px-8 sm:py-4 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Premium top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {/* Cyan glow corner */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-20 h-px bg-emerald/70" />
            {/* Subtle moving sheen — animated */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  'linear-gradient(120deg, transparent 30%, rgba(50, 176, 200, 0.08) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer3d 4s linear infinite',
              }}
            />

            {/* Stats row — 3 stat panels with pastille dots */}
            <div className="relative flex items-center justify-between gap-2 sm:gap-6">
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-extrabold text-emerald neon-glow tabular-nums">
                  {isVisible && (
                    <AnimatedStat value={87} duration={1800} suffix="%" prefix="~" />
                  )}
                  {!isVisible && <span>~87%</span>}
                </div>
                <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <span className="pastille pastille-cyan" />
                  Précision
                </div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums">
                  {isVisible && (
                    <AnimatedStat value={15} duration={1600} suffix="K+" />
                  )}
                  {!isVisible && <span>15K+</span>}
                </div>
                <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <span className="pastille pastille-amber" />
                  Analysés
                </div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-extrabold text-gold tabular-nums">
                  {isVisible && (
                    <AnimatedStat value={50} duration={1500} suffix="+" />
                  )}
                  {!isVisible && <span>50+</span>}
                </div>
                <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                  <span className="pastille pastille-green" />
                  Championnats
                </div>
              </div>
            </div>

            {/* Promo code row */}
            <div className="relative mt-3 pt-3 border-t border-edge/50 flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Code promo</span>
              <span className="text-base sm:text-lg font-extrabold text-white tracking-widest promo-code-shimmer">{SITE.promoCode}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
