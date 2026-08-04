'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE, SITE } from '@/lib/constants'
import CopyableCode from './CopyableCode'

// ─── Palette BTTSPredict (Noir / Vert néon / Blanc) ────────────────────
const C = {
  bg:       '#0A0E14',
  card:     '#0F172A',
  elevated: '#1E293B',
  border:   'rgba(255,255,255,0.08)',
  neon:     '#10B981',
  neonDk:   '#059669',
  text:     '#ffffff',
  textSec:  '#a0a0a0',
  textMute: '#5a5a5a',
}

// ─── Types ──────────────────────────────────────────────────────────────
interface Prediction {
  match: string
  league: string
  date: string
  time?: string
  type: string
  prediction: string
  confidence: number
  homeLogo?: string
  awayLogo?: string
  analysis?: { bttsProb?: number; over25Prob?: number }
}

// ─── Next match preview (fetches first upcoming prediction) ─────────────
function NextMatchPreview() {
  const [match, setMatch] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const preds: Prediction[] = data.predictions || []
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const upcoming = preds.filter(p => {
          const md = new Date(p.date + 'T00:00:00'); md.setHours(0, 0, 0, 0)
          if (md.getTime() < today.getTime()) return false
          if (!p.time || p.time === '--:--' || !/^\d{2}:\d{2}$/.test(p.time)) return true
          const [h, m] = p.time.split(':').map(Number)
          const mdt = new Date(p.date + 'T00:00:00'); mdt.setHours(h, m, 0, 0)
          return mdt.getTime() > Date.now()
        })
        if (upcoming.length > 0) setMatch(upcoming[0])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-[20px] p-4 glass" style={{ minHeight: '120px' }}>
        <div className="skeleton h-4 w-24 rounded mb-3" />
        <div className="skeleton h-8 w-full rounded mb-2" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    )
  }

  if (!match) return null

  const teams = match.match.split(/\s+vs?\s+/i)
  const home = teams[0]?.trim() || ''
  const away = teams[1]?.trim() || ''
  const prob = match.analysis?.bttsProb || match.analysis?.over25Prob || (match.confidence / 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[20px] overflow-hidden glass"
      style={{ boxShadow: 'var(--shadow-card, 0 8px 30px rgba(0,0,0,0.4))' }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: C.textMute }}>
          PROCHAIN MATCH
        </span>
        <span className="font-mono text-[10px]" style={{ color: C.textMute }}>
          {match.time || match.date}
        </span>
      </div>

      {/* Teams */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          {match.homeLogo ? (
            <img src={match.homeLogo} alt={home} className="w-10 h-10 object-contain" loading="lazy" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
              style={{ background: 'rgba(59, 130, 246,0.1)', color: C.neon }}>
              {home.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-[12px] font-semibold text-white truncate max-w-full">{home}</span>
        </div>

        <div className="flex flex-col items-center px-3">
          <span className="text-[16px] font-bold" style={{ color: C.neon }}>VS</span>
          <span className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: C.textMute }}>
            {match.type}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          {match.awayLogo ? (
            <img src={match.awayLogo} alt={away} className="w-10 h-10 object-contain" loading="lazy" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
              style={{ background: 'rgba(59, 130, 246,0.1)', color: C.neon }}>
              {away.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-[12px] font-semibold text-white truncate max-w-full">{away}</span>
        </div>
      </div>

      {/* Prediction bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium" style={{ color: C.textSec }}>
            IA : <span className="font-bold text-white">{match.prediction}</span>
          </span>
          <span className="font-mono text-[12px] font-bold" style={{ color: C.neon }}>
            {match.confidence}%
          </span>
        </div>
        <div className="h-[4px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${match.confidence}%` }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'var(--grad-primary, linear-gradient(90deg, #10B981, #059669))', boxShadow: '0 0 8px rgba(59, 130, 246,0.4)' }}
          />
        </div>
      </div>

      {/* League + time */}
      <div className="px-4 pb-3 flex items-center justify-between border-t" style={{ borderColor: 'rgba(255,255,255,0.04)', paddingTop: '8px' }}>
        <span className="text-[10px]" style={{ color: C.textMute }}>{match.league}</span>
        <span className="text-[10px] font-mono" style={{ color: C.neon }}>{match.date}</span>
      </div>
    </motion.div>
  )
}

// TrustBadges removed (Wave/Orange Money/TikTok)

// ═══════════════════════════════════════════════════════════════════════
// Main Hero — BTTSPredict 2026 Premium
// ═══════════════════════════════════════════════════════════════════════
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: C.bg, paddingTop: '20px', paddingBottom: '16px' }}
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(60% 50% at 20% 0%, rgba(59, 130, 246,0.08) 0%, transparent 60%), radial-gradient(50% 50% at 85% 10%, rgba(59, 130, 246,0.04) 0%, transparent 60%)'
      }} />

      <div className="relative z-10 max-w-[420px] mx-auto px-4 flex flex-col gap-4">

        {/* ═══ BADGE ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(59, 130, 246,0.08)', border: '1px solid rgba(59, 130, 246,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full live-dot" style={{ backgroundColor: C.neon, boxShadow: '0 0 8px ' + C.neon }} />
          <span className="font-mono text-[10px] font-bold tracking-[0.14em]" style={{ color: C.neon }}>
            IA ACTIVE — 50+ PRONOS/JOUR
          </span>
        </motion.div>

        {/* ═══ TITRE ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-bold leading-[1.05] tracking-tight" style={{ fontSize: '28px', color: C.text }}>
            Le moteur IA qui sait quand les <span style={{ color: C.neon }}>deux équipes marquent</span>.
          </h1>
          <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: C.textSec, maxWidth: '340px' }}>
            Modèles Poisson calibrés sur 50 000 matchs. Inscrivez-vous avec le code Inscrivez-vous avec le code{' '}
            <CopyableCode code={SITE.promoCode} gold />{' '}pour débloquer le VIP.
          </p>
        </motion.div>

        {/* ═══ PROCHAIN MATCH (remplace l'ancienne carte analyse IA) ═══ */}
        <NextMatchPreview />

        {/* ═══ CTA — 1 vert + 1 ghost ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col gap-2.5"
        >
          <motion.a
            href={AFFILIATE.linebet}
            rel="sponsored noopener"
            target="_blank"
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-[56px] rounded-[14px] font-bold text-[15px] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#0A0E14',
              boxShadow: '0 0 0 1px rgba(59, 130, 246,.4), 0 8px 32px rgba(59, 130, 246,.22)',
            }}
            aria-label="S'inscrire sur Linebet avec le code promo VISION221"
            data-cta="hero-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
            S'inscrire sur Linebet
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-[48px] rounded-[14px] font-medium text-[13px] flex items-center justify-center gap-2"
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
            data-cta="hero-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            Voir les pronostics du jour
          </motion.button>
        </motion.div>



        {/* ═══ FOOTER ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-[11px]"
          style={{ color: C.textMute }}
        >
          18+ · Résultats vérifiés · Aucun paiement sur BTTSPredict · Les paris comportent des risques
        </motion.div>
      </div>
    </section>
  )
}
