'use client'

import { motion } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background — Premium Mesh Gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-midnight" />
        {/* Mesh gradient orbs */}
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[500px] bg-emerald/8 rounded-full blur-[140px] opacity-80" />
        <div className="absolute top-[5%] right-1/4 w-[450px] h-[400px] bg-gold/5 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-royal/6 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-emerald/3 rounded-full blur-[100px]" />
        {/* Subtle conic gradient */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.04]"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, #10E5A0 0deg, transparent 60deg, #F5C451 120deg, transparent 180deg, #4F8FF7 240deg, transparent 300deg, #10E5A0 360deg)',
            borderRadius: '50%',
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
          }}
        />
        {/* Bottom divider line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12 sm:pt-28 sm:pb-16">
        {/* Top badge — premium pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="group inline-flex items-center gap-2 bg-emerald/8 border border-emerald/25 rounded-full px-4 py-1.5 backdrop-blur-xl">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 bg-emerald rounded-full animate-ping opacity-75" />
              <span className="relative w-1.5 h-1.5 bg-emerald rounded-full" />
            </span>
            <span className="text-xs text-emerald font-semibold tracking-wider uppercase">IA en direct</span>
            <span className="text-gray-600 text-xs">•</span>
            <span className="text-xs text-gray-400">Mis à jour il y a 2 min</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
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
          className="text-center text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-8"
        >
          Propulsé par l&apos;intelligence artificielle — {SITE.accuracy} de précision sur 15 000+ pronostics
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
        >
          <button
            onClick={() => {
              const el = document.getElementById('free-predictions')
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setTimeout(() => window.scrollBy({ top: -64, behavior: 'smooth' }), 400)
              }
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald to-emerald-dark text-dark-900 font-bold rounded-xl text-base hover:shadow-lg hover:shadow-emerald/30 btn-emerald transition-all hover:brightness-110 hover-lift"
          >
            Pronostics du jour
          </button>
          <a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-base hover:shadow-lg hover:shadow-emerald/30 btn-emerald transition-all hover:brightness-110 hover-lift"
          >
            <img src="/logos/linebet.svg" alt="Linebet" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
            Bonus 150$
          </a>
          {/* V23: Nouveau bouton 888starz */}
          <a
            href={AFFILIATE.star888}
            rel={AFFILIATE.rel}
            target="_blank"
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-xl text-base hover:shadow-lg hover:shadow-red-500/30 transition-all hover:brightness-110 hover-lift"
          >
            <img src="/logos/888starz.svg" alt="888starz" className="h-5 w-auto object-contain flex-shrink-0" loading="lazy"/>
            Bonus 100%
          </a>
        </motion.div>

        {/* Stats ticker — premium dashboard style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative flex items-center gap-6 sm:gap-10 bg-panel/70 border border-white/[0.06] rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4 backdrop-blur-xl shadow-2xl">
            {/* Premium top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl" />
            {/* Emerald glow corner */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-20 h-px bg-emerald/60" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald neon-glow">{SITE.accuracy}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Précision</div>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-white">15K+</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Analysés</div>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-gold">50+</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Championnats</div>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block" />
            <div className="text-center hidden sm:block">
              <div className="text-lg font-extrabold text-white tracking-widest promo-code-shimmer">{SITE.promoCode}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">Code promo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
