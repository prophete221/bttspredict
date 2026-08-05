'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'

// ─── Palette BTTSPredict 2026 — sobre, data-oriented ───
const C = {
  bg:       '#050B14',
  text:     '#ffffff',
  textSec:  '#94A3B8',
  textMute: '#64748B',
  neon:     '#00E5FF',
  gold:     '#FFD600',
  violet:   '#A78BFA',
}

/**
 * Hero (refonte 2026-08-05) — version mondiale sobre
 * - H1: "N°1 mondial des prédictions BTTS et Over 2.5"
 * - Sous-titre court orienté data
 * - 1 gros CTA: "Voir les pronostics d'aujourd'hui"
 * - Badge preuve: 84,5% vérifié (60/71)
 * - Mini-texte portée: pays Linebet (Europe, Afrique, Amérique latine, Asie)
 * - Sous-texte référence mondiale
 * - Style sobre, pas casino flashy
 */
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: C.bg, paddingTop: '32px', paddingBottom: '32px' }}
    >
      {/* ═══ Fond Stadium Neon — projecteurs animés sobres ═══ */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-[120px] animate-pulse"
          style={{ backgroundColor: 'rgba(0, 229, 255, 0.08)' }}
        />
        <div
          className="absolute top-10 right-1/4 w-[500px] h-[350px] rounded-full blur-[100px] animate-pulse"
          style={{ backgroundColor: 'rgba(167, 139, 250, 0.08)', animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 max-w-[440px] mx-auto px-4 flex flex-col gap-5">

        {/* ═══ BADGE PREUVE — 84,5% vérifié ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(0, 229, 255, 0.06)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-mono text-[10px] font-bold tracking-[0.14em]" style={{ color: '#00E5FF' }}>
            84,5% DE RÉUSSITE VÉRIFIÉE
          </span>
          <span className="font-mono text-[9px]" style={{ color: C.textMute }}>
            · 60/71 pronos
          </span>
        </motion.div>

        {/* ═══ H1 — Slogan "N°1 mondial" ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-bold leading-[1.05] tracking-tight" style={{ fontSize: '32px', color: C.text }}>
            N°1 mondial des{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00E5FF, #A78BFA)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              prédictions BTTS et Over 2.5
            </span>
          </h1>

          {/* Sous-titre court orienté data */}
          <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: C.textSec, maxWidth: '380px' }}>
            Pronostics BTTS et Over 2.5 basés sur modèles Poisson calibrés sur 50 000+ matchs.
            Transparence totale, gagnés ET perdus affichés. Outil d&apos;aide à la décision,
            pas de promesse de gain.
          </p>

          {/* Sous-texte référence mondiale (très petit) */}
          <p className="mt-2 text-[11px] leading-[1.5]" style={{ color: C.textMute, maxWidth: '360px' }}>
            Référence mondiale basée sur transparence des résultats, méthodologie documentée et historique vérifiable.
          </p>
        </motion.div>

        {/* ═══ GROS CTA — Voir les pronostics d'aujourd'hui ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0, 229, 255, 0.40)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-[56px] rounded-[14px] font-bold text-[15px] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #00B8D4 100%)',
              color: '#050B14',
              boxShadow: '0 0 0 1px rgba(0, 229, 255,.4), 0 8px 32px rgba(0, 229, 255,.25)',
            }}
            data-cta="hero-primary"
            aria-label="Voir les pronostics d'aujourd'hui"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Voir les pronostics d&apos;aujourd&apos;hui
          </motion.button>
        </motion.div>

        {/* ═══ MINI-TEXTE PORTÉE MONDIALE ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-[11px]"
          style={{ color: C.textSec }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span style={{ color: C.textMute }}>
            Parieurs dans tous les pays où Linebet est disponible
          </span>
          <span style={{ color: C.textSec }}>·</span>
          <span style={{ color: C.textSec, fontWeight: 600 }}>Europe · Afrique · Amérique latine · Asie</span>
        </motion.div>
      </div>
    </section>
  )
}
