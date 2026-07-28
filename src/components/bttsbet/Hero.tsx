'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { staggerContainer, staggerChildFadeUp } from '@/lib/motionPresets'

// ─── IA Premium palette (per user spec, hard-coded) ────────────────────
const COLORS = {
  bg:        '#090B10',
  iaGreen:   '#00F5A0',
  blue:      '#00C2FF',
  purple:    '#8B5CF6',
  text:      '#FFFFFF',
  textSec:   '#A8B3C7',
}

// ─── Checklist of analysis steps (revealed progressively) ──────────────
const ANALYSIS_STEPS = [
  'Forme récente',
  'xG',
  'Blessures',
  'Cotes',
  'Historique',
  'Value Bet',
  'BTTS',
  'Over',
  'Under',
  'Score Exact',
]

// ─── IA Confidence metrics ─────────────────────────────────────────────
const CONFIDENCE_METRICS = [
  { label: 'Confiance IA', value: 94, color: COLORS.iaGreen },
  { label: 'BTTS',         value: 91, color: COLORS.iaGreen },
  { label: 'Over 2.5',     value: 88, color: COLORS.blue },
  { label: 'Value Bet',    value: 96, color: COLORS.purple },
]

// ─── Discrete floating particles ──────────────────────────────────────
function IAParticles() {
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 6,
    color: i % 3 === 0 ? COLORS.iaGreen : i % 3 === 1 ? COLORS.blue : COLORS.purple,
  })), [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Futuristic grid overlay ───────────────────────────────────────────
function IAGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.4]"
      aria-hidden="true"
      style={{
        backgroundImage: `
          linear-gradient(${COLORS.iaGreen}0a 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.iaGreen}0a 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 80%)',
      }}
    />
  )
}

// ─── Radial glow behind the title ───────────────────────────────────────
function IAGlow() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Top emerald glow */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[min(900px,80vw)] h-[400px] rounded-full blur-[120px]"
        style={{
          background: `radial-gradient(ellipse at center top, ${COLORS.iaGreen}25, transparent 70%)`,
          opacity: 0.5,
        }}
      />
      {/* Side blue glow */}
      <div
        className="absolute right-0 top-1/3 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${COLORS.blue}1a, transparent 70%)`,
        }}
      />
      {/* Side purple glow */}
      <div
        className="absolute left-0 bottom-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${COLORS.purple}1a, transparent 70%)`,
        }}
      />
    </div>
  )
}

// ─── Animated checkmark ─────────────────────────────────────────────────
function CheckItem({ label, visible }: { label: string; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2.5 text-sm"
      style={{ color: visible ? COLORS.text : COLORS.textSec + '40' }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={visible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center"
        style={{
          backgroundColor: visible ? `${COLORS.iaGreen}20` : 'transparent',
          border: `1px solid ${visible ? COLORS.iaGreen : COLORS.textSec + '20'}`,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={COLORS.iaGreen} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>
      <span className="font-medium" style={{ color: visible ? COLORS.text : COLORS.textSec + '60' }}>
        {label}
      </span>
    </motion.div>
  )
}

// ─── Progress bar component ─────────────────────────────────────────────
function IAProgress({ progress }: { progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: COLORS.textSec }} className="font-medium">
          {progress < 100 ? 'Analyse IA en cours…' : 'Analyse terminée'}
        </span>
        <motion.span
          key={Math.round(progress)}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="font-mono font-bold tabular-nums"
          style={{ color: COLORS.iaGreen }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: COLORS.textSec + '15' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${COLORS.iaGreen}, ${COLORS.blue})`,
            boxShadow: `0 0 12px ${COLORS.iaGreen}80`,
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-y-0 w-12 rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${COLORS.text}40, transparent)`,
          }}
          animate={{ left: ['-10%', '110%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  )
}

// ─── Confidence tile ────────────────────────────────────────────────────
function ConfidenceTile({ metric, index, visible }: {
  metric: typeof CONFIDENCE_METRICS[0]
  index: number
  visible: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="text-center p-3 rounded-lg border"
      style={{
        backgroundColor: `${metric.color}08`,
        borderColor: `${metric.color}30`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
        className="text-2xl sm:text-3xl font-bold tabular-nums"
        style={{
          color: metric.color,
          textShadow: `0 0 12px ${metric.color}80`,
        }}
      >
        {metric.value}%
      </motion.div>
      <div
        className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold mt-1"
        style={{ color: COLORS.textSec }}
      >
        {metric.label}
      </div>
    </motion.div>
  )
}

// ─── Main Hero ─────────────────────────────────────────────────────────
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const [progress, setProgress] = useState(0)
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [confidenceVisible, setConfidenceVisible] = useState(false)

  // Animate progress bar 0 → 98% over 3.5s when section visible
  useEffect(() => {
    if (!isVisible) return
    let frame = 0
    const interval = setInterval(() => {
      frame++
      // Easing: fast first half, slow second half
      const t = frame / 70 // 70 frames ~ 3.5s
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const newProgress = Math.min(98, eased * 98)
      setProgress(newProgress)

      // Reveal checkmarks progressively
      const stepsToShow = Math.min(ANALYSIS_STEPS.length, Math.floor((newProgress / 98) * ANALYSIS_STEPS.length) + 1)
      setRevealedSteps(stepsToShow)

      if (newProgress >= 98) {
        clearInterval(interval)
        // Show confidence metrics after a brief pause
        setTimeout(() => setConfidenceVisible(true), 200)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [isVisible])

  const handleAnalyze = () => {
    document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDiscover = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-8 sm:pt-12 pb-10 sm:pb-16"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* Background layers */}
      <IAGlow />
      <IAGrid />
      <IAParticles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* ═══ TOP — "IA ACTIVE EN TEMPS RÉEL" badge ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md"
            style={{
              backgroundColor: `${COLORS.iaGreen}10`,
              borderColor: `${COLORS.iaGreen}30`,
            }}
          >
            {/* Animated green dot */}
            <span className="relative flex w-2 h-2">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: COLORS.iaGreen }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span
                className="relative inline-flex w-2 h-2 rounded-full"
                style={{
                  backgroundColor: COLORS.iaGreen,
                  boxShadow: `0 0 8px ${COLORS.iaGreen}`,
                }}
              />
            </span>
            <span
              className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: COLORS.iaGreen }}
            >
              IA Active en Temps Réel
            </span>
          </div>
        </motion.div>

        {/* ═══ TITLE ═══ */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 sm:mb-6 max-w-3xl mx-auto"
          style={{ color: COLORS.text, letterSpacing: '-0.02em' }}
        >
          Votre <span
            style={{
              color: COLORS.iaGreen,
              textShadow: `0 0 24px ${COLORS.iaGreen}80, 0 0 48px ${COLORS.iaGreen}40`,
            }}
          >IA</span> analyse plus de 1200 matchs chaque jour.
        </motion.h1>

        {/* ═══ SUBTITLE ═══ */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10"
          style={{ color: COLORS.textSec }}
        >
          Notre intelligence artificielle collecte les statistiques, compare les modèles prédictifs,
          détecte les meilleures opportabilités <span style={{ color: COLORS.text }} className="font-medium">BTTS</span>,{' '}
          <span style={{ color: COLORS.text }} className="font-medium">Over 2.5</span>,{' '}
          <span style={{ color: COLORS.text }} className="font-medium">Score Exact</span> et{' '}
          <span style={{ color: COLORS.text }} className="font-medium">Double Chance</span> en quelques secondes.
        </motion.p>

        {/* ═══ IA INTERFACE CARD ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative max-w-2xl mx-auto"
        >
          {/* Card */}
          <div
            className="relative rounded-2xl overflow-hidden border backdrop-blur-md"
            style={{
              backgroundColor: '#0C0E13',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: `
                0 24px 60px rgba(0, 0, 0, 0.5),
                0 0 80px ${COLORS.iaGreen}10,
                inset 0 1px 0 rgba(255, 255, 255, 0.04)
              `,
            }}
          >
            {/* Top accent line */}
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${COLORS.iaGreen}, ${COLORS.blue}, transparent)`,
              }}
            />

            <div className="p-5 sm:p-7 text-left">
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {/* IA icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${COLORS.iaGreen}15`,
                      border: `1px solid ${COLORS.iaGreen}30`,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.iaGreen} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 10v6m11-11h-6m-10 0H1m17.07-7.07l-4.24 4.24m-5.66 5.66l-4.24 4.24m12.73 0l-4.24-4.24m-5.66-5.66L4.93 4.93" />
                      </svg>
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: COLORS.text }}>
                      Analyse IA en cours…
                    </div>
                    <div className="text-[10px]" style={{ color: COLORS.textSec }}>
                      Moteur prédictif Poisson · {new Date().toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                {/* Live indicator */}
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS.iaGreen }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-widest font-bold"
                    style={{ color: COLORS.iaGreen }}
                  >
                    Live
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <IAProgress progress={progress} />

              {/* Checklist grid (2 cols on desktop, 1 col mobile) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-2 mt-5 pt-5 border-t border-white/5">
                {ANALYSIS_STEPS.map((step, i) => (
                  <CheckItem
                    key={step}
                    label={step}
                    visible={i < revealedSteps}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ CONFIDENCE METRICS ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={confidenceVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto mt-6 sm:mt-8"
        >
          {CONFIDENCE_METRICS.map((metric, i) => (
            <ConfidenceTile
              key={metric.label}
              metric={metric}
              index={i}
              visible={confidenceVisible}
            />
          ))}
        </motion.div>

        {/* ═══ CTA BUTTONS ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={confidenceVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-md sm:max-w-none mx-auto mt-8 sm:mt-10"
        >
          {/* Primary button — Neon green */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all"
            style={{
              backgroundColor: COLORS.iaGreen,
              color: '#001A10',
              boxShadow: `0 8px 24px ${COLORS.iaGreen}50, 0 0 40px ${COLORS.iaGreen}30, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Analyser les matchs
          </motion.button>

          {/* Secondary button — Transparent outline */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDiscover}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all backdrop-blur-md"
            style={{
              backgroundColor: 'transparent',
              color: COLORS.text,
              border: `1px solid ${COLORS.blue}40`,
              boxShadow: `inset 0 0 0 0 ${COLORS.blue}, 0 0 24px ${COLORS.blue}15`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Découvrir la technologie IA
          </motion.button>
        </motion.div>

        {/* ═══ TINY FOOTER LINE ═══ */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={confidenceVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-[10px] sm:text-xs mt-6 sm:mt-8"
          style={{ color: COLORS.textSec + '80' }}
        >
          Moteur IA entraîné sur 50 000+ matchs historiques · 18+ · Les paris comportent des risques
        </motion.p>
      </div>
    </section>
  )
}
