'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'

export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#131314', paddingTop: '40px', paddingBottom: '24px' }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full"
          style={{ backgroundColor: '#22c55e', opacity: 0.06, filter: 'blur(80px)' }} />
        <div className="absolute -bottom-10 right-1/4 w-64 h-64 rounded-full"
          style={{ backgroundColor: '#06b6d4', opacity: 0.04, filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 max-w-[440px] mx-auto px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#06b6d4' }} />
            Analyse statistique · Données publiques ESPN
          </span>
        </motion.div>

        {/* H1 — product-style, concise */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-bold leading-[1.1] tracking-tight mb-3"
          style={{ fontSize: '26px', color: '#f0f4f9', fontFamily: 'Poppins, sans-serif' }}
        >
          Pronostics BTTS et Over 2.5
          <br />
          <span style={{ color: '#22c55e' }}>vérifiables après match</span>
        </motion.h1>

        {/* Subtitle — short, factual */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[13px] leading-[1.6] mb-5"
          style={{ color: '#9ca3af', maxWidth: '360px' }}
        >
          Données ESPN publiques · Modèle Poisson + xG · Suivi public depuis le 08/08/2026.
        </motion.p>

        {/* CTAs — primary + secondary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5 mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const el = document.getElementById('free-predictions') || document.getElementById('main-content')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              else window.location.href = '/'
            }}
            className="w-full h-[48px] rounded-[12px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: '#22c55e', color: '#131314', border: 'none' }}
            data-cta="hero-primary"
            aria-label="Voir les pronostics du jour"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Voir les pronostics du jour
          </motion.button>

          <a
            href="/methodologie"
            className="w-full h-[40px] rounded-[12px] font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-all"
            style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #2d2f31' }}
            data-cta="hero-methodology"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Voir la méthodologie
          </a>
        </motion.div>

        {/* Trust indicators — 1 line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3 text-[10px]"
          style={{ color: '#9ca3af' }}
        >
          <span className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Vérifiable
          </span>
          <span style={{ color: '#2d2f31' }}>·</span>
          <span>18+</span>
          <span style={{ color: '#2d2f31' }}>·</span>
          <span>Jeu responsable</span>
        </motion.div>
      </div>
    </section>
  )
}
