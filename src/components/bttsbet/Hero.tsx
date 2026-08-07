'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'

/**
 * Hero — ECLIPSE v60
 * Copy exacte per spec:
 *   H1: "BTTS & OVER 2.5 / BASE OPEN-SOURCE DE PRONOSTICS"
 *   H2: "3 285 pronostics BTTS vérifiés avec scores réels. Modèle Poisson + open data. Pas de promesses, que des preuves."
 *   CTA primaire: "Voir les pronos du jour" #5146F5
 *   CTA secondaire: "Explorer le dataset open-source" outline
 * Background: #070B18 avec 2 blobs blur Indigo et Cyan + grille subtile
 * Barre sous Hero: "Dernier scan il y a 4h - 50 matchs analysés - 47 résultats vérifiés"
 */
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#070B18',
        paddingTop: '48px',
        paddingBottom: '32px',
      }}
    >
      {/* ═══ Background blobs (assombris) + grille subtile ═══ */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Blob Indigo — top left, opacity max 0.18 */}
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
          style={{
            backgroundColor: '#5146F5',
            opacity: 0.18,
            filter: 'blur(80px)',
          }}
        />
        {/* Blob Cyan — bottom right, opacity max 0.08 */}
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full"
          style={{
            backgroundColor: '#46DDB4',
            opacity: 0.08,
            filter: 'blur(100px)',
          }}
        />
        {/* Grille subtile — rgba(165,171,197,0.055) */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.055,
            backgroundImage: `
              linear-gradient(rgba(165, 171, 197, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(165, 171, 197, 1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[440px] mx-auto px-4 flex flex-col gap-5">
        {/* ═══ H1 ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-bold leading-[1.05] tracking-tight"
            style={{
              fontSize: '28px',
              color: '#F7F8FF',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Pronostics BTTS et Over 2.5
            <br />
            <span style={{ color: '#5146F5', fontSize: '22px' }}>Modèle statistique Poisson V3</span>
          </h1>

          {/* ═══ H2 ═══ */}
          <p className="mt-3 text-[13px] leading-[1.6]" style={{ color: '#A5ABC5', maxWidth: '380px' }}>
            Données ESPN publiques. Analyse statistique. Forme des équipes. 11 ligues HIGH_BTTS filtrées. Pronostics quotidiens vérifiables après le match.
          </p>
        </motion.div>

        {/* ═══ CTA primaire + lien secondaire ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          {/* CTA primaire: "Voir les pronostics du jour" */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              window.location.href = '/pronostics'
            }}
            className="w-full h-[52px] rounded-[10px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: '#5146F5',
              color: '#F7F8FF',
              border: 'none',
              boxShadow: '0 4px 16px rgba(81, 70, 245, 0.25)',
            }}
            data-cta="hero-primary"
            aria-label="Voir les pronostics du jour"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6258FF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5146F5'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Voir les pronostics du jour
          </motion.button>

          {/* Lien secondaire texte */}
          <button
            onClick={() => {
              window.location.href = '/historique'
            }}
            className="w-full text-center text-[14px] font-medium transition-colors py-2"
            style={{ color: '#A5ABC5', background: 'transparent', border: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F7F8FF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#A5ABC5')}
          >
            Voir l'historique vérifié →
          </button>
        </motion.div>

        {/* ═══ Barre sous Hero — données temps réel ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3 text-[10px] font-mono py-2 px-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(13, 22, 48, 0.6)',
            border: '1px solid rgba(48, 56, 97, 0.5)',
            color: '#6B7194',
          }}
        >
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Suivi public depuis le 2026-08-08
          </span>
          <span style={{ color: '#303861' }}>·</span>
          <span>11 ligues HIGH_BTTS</span>
          <span style={{ color: '#303861' }}>·</span>
          <span style={{ color: '#5DFDCB' }}>Modèle V3-Reliability</span>
        </motion.div>

        {/* ═══ Badges confiance — 1 ligne discrète ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-[10px] text-[#6B7194]"
        >
          Vérification ESPN public · 18+ · Jeu responsable
        </motion.div>
      </div>
    </section>
  )
}
