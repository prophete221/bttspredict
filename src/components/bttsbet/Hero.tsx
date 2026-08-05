'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE } from '@/lib/constants'

// ─── Palette BTTSPredict 2026 — produit data + paris sportifs ───
const C = {
  black:        '#0D1117',
  darkGreen:    '#0D1117',
  green:        '#00C49A',
  greenLight:   '#00DDB0',
  greenPale:    'rgba(0, 196, 154, 0.12)',
  grayDark:     '#0D1117',
  grayMid:      '#A8B3C2',
  grayLight:    '#F0F2F5',
  white:        '#F0F2F5',
  gold:         '#FFD700',
  blue:         '#00C49A',
}

/**
 * Hero (refonte palette 2026-08-05)
 * - Fond : dégradé vert foncé #00A882 → noir #0D1117
 * - H1 : "N°1 mondial des prédictions BTTS et Over 2.5" en blanc
 * - Badge : 84,5% vérifié en fond vert secondaire #00DDB0
 * - CTA principal : vert #00C49A
 * - CTA secondaire : transparent, bordure vert, texte vert
 */
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #161B22 0%, #0D1117 100%)`,
        paddingTop: '40px',
        paddingBottom: '40px',
      }}
    >
      <div className="relative z-10 max-w-[440px] mx-auto px-4 flex flex-col gap-5">

        {/* ═══ BADGE PREUVE — 84,5% vérifié (vert secondaire #00DDB0) ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: C.greenLight,
            color: C.white,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-mono text-[10px] font-bold tracking-[0.14em]">
            84,5% DE RÉUSSITE VÉRIFIÉE
          </span>
          <span className="font-mono text-[9px]" style={{ opacity: 0.85 }}>
            · 60/71 pronos
          </span>
        </motion.div>

        {/* ═══ H1 — Slogan "N°1 mondial" en blanc ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-bold leading-[1.05] tracking-tight" style={{ fontSize: '34px', color: C.white }}>
            N°1 mondial des{' '}
            <span style={{ color: C.greenLight }}>
              prédictions BTTS et Over 2.5
            </span>
          </h1>

          {/* Sous-titre en gris clair */}
          <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: C.grayLight, maxWidth: '380px' }}>
            Pronostics BTTS et Over 2.5 basés sur modèles Poisson calibrés sur 50 000+ matchs.
            Transparence totale, gagnés ET perdus affichés. Outil d&apos;aide à la décision,
            pas de promesse de gain.
          </p>

          {/* Sous-texte référence mondiale */}
          <p className="mt-2 text-[11px] leading-[1.5]" style={{ color: C.grayMid, maxWidth: '360px' }}>
            Référence mondiale basée sur transparence des résultats, méthodologie documentée et historique vérifiable.
          </p>
        </motion.div>

        {/* ═══ CTA principal + secondaire ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5"
        >
          {/* CTA principal : Voir les pronostics d'aujourd'hui (vert #00C49A) */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${C.green}66` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-[56px] rounded-[8px] font-bold text-[15px] flex items-center justify-center gap-2 transition-colors"
            style={{
              backgroundColor: C.green,
              color: C.white,
              border: 'none',
            }}
            data-cta="hero-primary"
            aria-label="Voir les pronostics d'aujourd'hui"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.greenLight}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = C.green}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Voir les pronostics d&apos;aujourd&apos;hui
          </motion.button>

          {/* CTA secondaire : S'inscrire sur Linebet (transparent, bordure vert) */}
          <motion.a
            href={AFFILIATE.linebet}
            rel="sponsored noopener"
            target="_blank"
            whileHover={{ scale: 1.02, backgroundColor: C.greenPale }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[48px] rounded-[8px] font-medium text-[14px] flex items-center justify-center gap-2 transition-colors"
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${C.green}`,
              color: C.green,
            }}
            data-cta="hero-secondary"
            aria-label="S'inscrire sur Linebet avec le code promo VISION221"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            S&apos;inscrire sur Linebet
          </motion.a>
        </motion.div>

        {/* ═══ MINI-TEXTE PORTÉE MONDIALE (gris moyen #A8B3C2) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-[11px]"
          style={{ color: C.grayMid }}
        >
          Parieurs dans tous les pays où Linebet est disponible · Europe · Afrique · Amérique latine · Asie
        </motion.div>
      </div>
    </section>
  )
}
