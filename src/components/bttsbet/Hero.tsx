'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE } from '@/lib/constants'

// ─── Palette BTTSPredict 2026 — produit data + paris sportifs ───
const C = {
  black:        '#070B18',
  darkGreen:    '#070B18',
  green:        '#5146F5',
  greenLight:   '#5146F5',
  greenPale:    'rgba(81, 70, 245, 0.12)',
  grayDark:     '#070B18',
  grayMid:      '#A5ABC5',
  grayLight:    '#F7F8FF',
  white:        '#F7F8FF',
  gold:         '#5146F5',
  blue:         '#5146F5',
}

/**
 * Hero (refonte palette 2026-08-05)
 * - Fond : dégradé vert foncé #A8E063 → noir #070B18
 * - H1 : "N°1 mondial des prédictions BTTS et Over 2.5" en blanc
 * - Badge : taux réel sur /historique en fond vert secondaire #5146F5
 * - CTA principal : vert #5146F5
 * - CTA secondaire : transparent, bordure vert, texte vert
 */
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0D1630 0%, #070B18 100%)`,
        paddingTop: '40px',
        paddingBottom: '40px',
      }}
    >
      <div className="relative z-10 max-w-[440px] mx-auto px-4 flex flex-col gap-5">

        {/* ═══ BADGE PREUVE — taux réel sur /historique (vert secondaire #5146F5) ═══ */}
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
            RÉUSSITE VÉRIFIÉE EN TEMPS RÉEL
          </span>
          <span className="font-mono text-[9px]" style={{ opacity: 0.85 }}>
            · voir /historique
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
          {/* CTA principal : Voir les pronostics d'aujourd'hui (vert #5146F5) */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${C.green}66` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/#free-predictions'
              } else {
                document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
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

        {/* ═══ MINI-TEXTE PORTÉE MONDIALE (gris moyen #A5ABC5) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-[11px]"
          style={{ color: C.grayMid }}
        >
          Parieurs dans tous les pays où Linebet est disponible · Europe · Afrique · Amérique latine · Asie
        </motion.div>

        {/* ═══ BADGES SÉCURITÉ + 18+ (signaux de confiance visuels) ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 text-[10px]"
        >
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(81, 70, 245, 0.08)', color: '#5146F5', border: '1px solid rgba(81, 70, 245, 0.15)' }}
          >
            🔒 SSL Sécurisé
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(81, 70, 245, 0.08)', color: '#5146F5', border: '1px solid rgba(81, 70, 245, 0.15)' }}
          >
            ✅ Historique vérifiable
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(81, 70, 245, 0.08)', color: '#5146F5', border: '1px solid rgba(81, 70, 245, 0.15)' }}
          >
            🛡️ Jeu responsable
          </span>
          <a
            href="/jouer-responsable"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-bold transition-colors"
            style={{ backgroundColor: 'rgba(81, 70, 245, 0.1)', color: '#5146F5', border: '1px solid rgba(81, 70, 245, 0.2)' }}
          >
            18+ | Jeu responsable
          </a>
        </motion.div>
      </div>
    </section>
  )
}
