'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'

/**
 * Hero — ECLIPSE v60
 * Copy exacte per spec:
 *   H1: "BTTS & OVER 2.5 / LA PLUS GRANDE BASE DE DONNÉES VÉRIFIÉE"
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
      {/* ═══ Background blobs (Indigo + Cyan) + grille subtile ═══ */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Blob Indigo — top left */}
        <div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30"
          style={{
            backgroundColor: '#5146F5',
            filter: 'blur(80px)',
          }}
        />
        {/* Blob Cyan — bottom right */}
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{
            backgroundColor: '#5DFDCB',
            filter: 'blur(100px)',
          }}
        />
        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(247, 248, 255, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(247, 248, 255, 1) 1px, transparent 1px)
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
              fontSize: '32px',
              color: '#F7F8FF',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            BTTS &amp; OVER 2.5
            <br />
            <span style={{ color: '#5146F5' }}>LA PLUS GRANDE</span>{' '}
            <span style={{ color: '#5DFDCB' }}>BASE DE DONNÉES VÉRIFIÉE</span>
          </h1>

          {/* ═══ H2 ═══ */}
          <p className="mt-3 text-[13px] leading-[1.6]" style={{ color: '#A5ABC5', maxWidth: '380px' }}>
            2 909 pronostics archivés. Modèle Poisson + open data.
            Scores vérifiés via API-Football et TheSportsDB.
            Pas de promesses, que des preuves.
          </p>
        </motion.div>

        {/* ═══ CTA primaire + secondaire ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5"
        >
          {/* CTA primaire: "Voir les pronos du jour" */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/#free-predictions'
              } else {
                document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="w-full h-[52px] rounded-[8px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: '#5146F5',
              color: '#F7F8FF',
              border: '1px solid rgba(81, 70, 245, 0.6)',
              boxShadow: '0 4px 16px rgba(81, 70, 245, 0.35)',
            }}
            data-cta="hero-primary"
            aria-label="Voir les pronos du jour"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6B61FF'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(81, 70, 245, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5146F5'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(81, 70, 245, 0.35)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Voir les pronos du jour
          </motion.button>

          {/* CTA secondaire: "Explorer le dataset open-source" outline */}
          <motion.a
            href="/historique"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[48px] rounded-[8px] font-medium text-[14px] flex items-center justify-center gap-2 transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #5DFDCB',
              color: '#5DFDCB',
            }}
            data-cta="hero-secondary"
            aria-label="Explorer le dataset open-source"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Explorer le dataset open-source
          </motion.a>
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
            Dernier scan il y a 4h
          </span>
          <span style={{ color: '#303861' }}>·</span>
          <span>50 matchs analysés</span>
          <span style={{ color: '#303861' }}>·</span>
          <span style={{ color: '#5DFDCB' }}>6 résultats vérifiés</span>
        </motion.div>

        {/* ═══ Badges confiance + 18+ ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 text-[10px]"
        >
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(185, 231, 255, 0.08)', color: '#B9E7FF', border: '1px solid rgba(185, 231, 255, 0.15)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            SSL Sécurisé
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(185, 231, 255, 0.08)', color: '#B9E7FF', border: '1px solid rgba(185, 231, 255, 0.15)' }}
          >
            Historique vérifiable
          </span>
          <a
            href="/jouer-responsable"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-bold transition-colors"
            style={{ backgroundColor: 'rgba(255, 113, 133, 0.1)', color: '#FF7185', border: '1px solid rgba(255, 113, 133, 0.2)' }}
          >
            18+ | Jeu responsable
          </a>
        </motion.div>
      </div>
    </section>
  )
}
