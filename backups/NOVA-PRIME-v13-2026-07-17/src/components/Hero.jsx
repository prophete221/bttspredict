import { motion } from 'framer-motion'
import { SITE, AFFILIATE } from '../data/constants'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background — gradient stadium feel */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-dark-900" />
        {/* Stadium light beams */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-emerald/4 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[350px] bg-gold/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald/2 rounded-full blur-[80px]" />
        {/* Horizontal accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-12 sm:pt-28 sm:pb-16">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-emerald/8 border border-emerald/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
            <span className="text-xs text-emerald font-medium tracking-wide">IA EN DIRECT</span>
          </div>
        </motion.div>

        {/* Main headline — bold, short, sports-centric */}
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
          className="text-center text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8"
        >
          Propulsé par l'intelligence artificielle — {SITE.accuracy} de précision sur 15 000+ pronostics
        </motion.p>

        {/* CTA buttons — centered */}
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
            className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-dark-900 font-bold rounded-xl text-base hover:shadow-lg hover:shadow-gold/30 btn-gold transition-all hover:brightness-110 hover-lift"
          >
            Bonus 150$ Linebet
          </a>
        </motion.div>

        {/* Stats ticker — horizontal strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-6 sm:gap-10 bg-panel/60 border border-edge rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald">{SITE.accuracy}</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Précision</div>
            </div>
            <div className="w-px h-8 bg-edge" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-white">15K+</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Analysés</div>
            </div>
            <div className="w-px h-8 bg-edge" />
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-gold">50+</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Championnats</div>
            </div>
            <div className="w-px h-8 bg-edge hidden sm:block" />
            <div className="text-center hidden sm:block">
              <div className="text-lg font-extrabold text-white tracking-widest promo-code-shimmer">{SITE.promoCode}</div>
              <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Code promo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
