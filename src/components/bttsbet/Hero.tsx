'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { staggerContainer, staggerChildFadeUp } from '@/lib/motionPresets'
import { AFFILIATE, SITE } from '@/lib/constants'

// ─── IA Premium palette ────────────────────────────────────────────────
const C = {
  bg:        '#0A0E1A',
  bgCard:    '#11151F',
  iaGreen:   '#10b981',    // Emerald (per user spec #10b981)
  iaGreenDk: '#059669',
  gold:      '#FFD700',
  blue:      '#00E5B0',
  purple:    '#CD7F32',
  text:      '#F8F5F0',
  textSec:   '#A8B3C7',
  textMute:  '#6B7588',
  border:    'rgba(255, 255, 255, 0.06)',
  borderHi:  'rgba(255, 255, 255, 0.12)',
}

// ─── Data: free vs VIP rates ────────────────────────────────────────────
const ACCURACY = {
  free:   { overall: 52, btts: 50, over: 54, value: 56 },
  vip:    { overall: 85, btts: 87, over: 82, value: 89.2 },
}

// ─── Analysis checklist ────────────────────────────────────────────────
const ANALYSIS_STEPS = [
  { label: 'Forme récente',  category: 'data' },
  { label: 'xG',             category: 'data' },
  { label: 'Blessures',      category: 'data' },
  { label: 'Cotes',          category: 'data' },
  { label: 'Historique',     category: 'data' },
  { label: 'Value Bet',      category: 'predict' },
  { label: 'BTTS',           category: 'predict' },
  { label: 'Over 2.5',       category: 'predict' },
  { label: 'Score Exact',    category: 'predict' },
  { label: 'Double Chance',  category: 'predict' },
]

// ══════════════════════════════════════════════════════════════════════
// NeuralNetworkCanvas — Lightweight canvas-based neural network animation
// Particles connected by lines that drift slowly. Very perf-friendly:
// - Uses requestAnimationFrame (60fps)
// - Pauses when tab hidden (visibility API)
// - Respects prefers-reduced-motion
// - ~40 particles (mobile) / ~60 (desktop) — minimal CPU
// ══════════════════════════════════════════════════════════════════════
function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId: number
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 30 : 50
    const maxDist = isMobile ? 100 : 130 // connection distance

    type P = { x: number; y: number; vx: number; vy: number }
    let particles: P[] = []

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.offsetWidth
      const h = parent.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
    }

    const init = () => {
      resize()
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }))
    }

    const draw = () => {
      if (!running) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)'
        ctx.fill()
      }

      // Draw connections (lines between nearby particles)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    init()
    draw()

    // Pause when tab hidden (perf optimization)
    const onVisibility = () => {
      running = !document.hidden
      if (running) {
        rafId = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(rafId)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Handle resize
    const onResize = () => init()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

// ─── Confidence metric tile ────────────────────────────────────────────
function MetricTile({
  label, value, color, isVIP, delay,
}: {
  label: string
  value: number
  color: string
  isVIP?: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative p-3 sm:p-4 rounded-xl border"
      style={{
        backgroundColor: `${color}06`,
        borderColor: `${color}25`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-3 right-3 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          opacity: 0.7,
        }}
      />
      {/* VIP badge */}
      {isVIP && (
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `${C.purple}20`,
            color: C.purple,
            border: `1px solid ${C.purple}40`,
          }}
        >
          VIP
        </div>
      )}

      {/* Value */}
      <div
        className="text-xl sm:text-2xl lg:text-3xl font-bold tabular-nums"
        style={{
          color,
          textShadow: `0 0 16px ${color}80, 0 0 32px ${color}40`,
        }}
      >
        {value}%
      </div>
      {/* Label */}
      <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold mt-1.5"
        style={{ color: C.textSec }}
      >
        {label}
      </div>
      {/* Mini progress bar */}
      <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: `${color}20` }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }}
        />
      </div>
    </motion.div>
  )
}

// ─── Main Hero ─────────────────────────────────────────────────────────
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const [progress, setProgress] = useState(0)
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [showCta, setShowCta] = useState(false)

  // Animate progress bar 0 → 100% over 4s using requestAnimationFrame (60fps, perf-friendly)
  useEffect(() => {
    if (!isVisible) return

    const duration = 4000 // 4s
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)
      // easeOutQuad
      const eased = 1 - Math.pow(1 - t, 3)
      const newProgress = Math.min(100, eased * 100)
      setProgress(newProgress)

      const stepsToShow = Math.min(ANALYSIS_STEPS.length, Math.floor((newProgress / 100) * ANALYSIS_STEPS.length) + 1)
      setRevealedSteps(stepsToShow)

      if (newProgress < 100) {
        rafId = requestAnimationFrame(tick)
      } else {
        // Show CTA + confidence metrics after progress completes
        setTimeout(() => setShowCta(true), 100)
      }
    }

    rafId = requestAnimationFrame(tick)

    // Show CTA early (after 800ms) so users can act immediately, even before animation ends
    const earlyShow = setTimeout(() => setShowCta(true), 800)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(earlyShow)
    }
  }, [isVisible])

  const handleAnalyze = () => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })
  const handleDiscover = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: C.bg,
        // No padding here — section flows directly with LiveTicker below
        paddingTop: 'clamp(2.5rem, 7vw, 5rem)',
        paddingBottom: 'clamp(0.5rem, 2vw, 1rem)',
      }}
    >
      {/* Neural network canvas background — particles + connections */}
      <NeuralNetworkCanvas />

      {/* Soft glow gradients on top of canvas */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[min(900px,90vw)] h-[600px] rounded-full blur-[140px]"
          style={{ background: `radial-gradient(ellipse at center top, ${C.iaGreen}22, transparent 70%)` }}
        />
        <div
          className="absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${C.blue}14, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* ═══════════════════════════════════════════════════════════════
            HEADER — top badge + title + subtitle (centered, editorial)
            ═══════════════════════════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">

          {/* "IA ACTIVE EN TEMPS RÉEL" badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md"
            style={{
              backgroundColor: `${C.iaGreen}0d`,
              borderColor: `${C.iaGreen}30`,
            }}
          >
            <span className="relative flex w-2 h-2">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: C.iaGreen }}
                animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span
                className="relative inline-flex w-2 h-2 rounded-full"
                style={{ backgroundColor: C.iaGreen, boxShadow: `0 0 8px ${C.iaGreen}` }}
              />
            </span>
            <span
              className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] live-text"
            >
              IA Active en Temps Réel
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 sm:mt-7 text-[1.875rem] sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.05] tracking-[-0.03em]"
            style={{ color: C.text }}
          >
            Votre <span
              style={{
                color: C.iaGreen,
                textShadow: `0 0 24px ${C.iaGreen}80, 0 0 48px ${C.iaGreen}40`,
              }}
            >IA</span> analyse plus de
            <br className="hidden sm:block" />
            <span style={{ color: C.text }}> </span>1200 matchs chaque jour.
          </motion.h1>

          {/* Subtitle — with VISION221 in bold emerald */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
            style={{ color: C.textSec }}
          >
            Obtenez des pronostics de haute précision pour maximiser vos gains.
            Inscrivez-vous sur Linebet avec le code{' '}
            <span
              className="font-bold"
              style={{ color: C.iaGreen, textShadow: `0 0 12px ${C.iaGreen}60` }}
            >
              {SITE.promoCode}
            </span>{' '}
            pour débloquer +85% de précision.
          </motion.p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ANALYSIS CARD — asymmetric, floating
            ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Glow halo behind card */}
          <div
            className="absolute -inset-1 rounded-3xl blur-2xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${C.iaGreen}15, ${C.blue}10, ${C.purple}15)`,
              opacity: 0.6,
            }}
          />

          {/* Card */}
          <div
            className="relative rounded-2xl overflow-hidden border backdrop-blur-xl"
            style={{
              backgroundColor: C.bgCard,
              borderColor: C.borderHi,
              boxShadow: `
                0 32px 80px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.04),
                inset 0 1px 0 rgba(255, 255, 255, 0.05)
              `,
            }}
          >
            {/* Top accent line — animated gradient */}
            <div className="h-px w-full relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, ${C.iaGreen}, ${C.blue}, ${C.purple}, transparent)`,
                }}
                animate={{ x: ['-30%', '30%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="p-5 sm:p-7 text-left">

              {/* Card header */}
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-3">
                  {/* AI gear icon (rotating) */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor: `${C.iaGreen}12`,
                      border: `1px solid ${C.iaGreen}30`,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.iaGreen} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 10v6m11-11h-6m-10 0H1m17.07-7.07l-4.24 4.24m-5.66 5.66l-4.24 4.24m12.73 0l-4.24-4.24m-5.66-5.66L4.93 4.93" />
                      </svg>
                    </motion.div>
                    {/* Pulse ring */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ border: `1px solid ${C.iaGreen}` }}
                      animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: C.text }}>
                      Analyse IA en cours…
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: C.textMute }}>
                      Moteur Poisson · {new Date().toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                {/* LIVE chip */}
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md"
                  style={{ backgroundColor: `${C.iaGreen}10`, border: `1px solid ${C.iaGreen}25` }}
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: C.iaGreen }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span
                    className="text-[9px] uppercase tracking-widest font-bold live-text"
                  >
                    Live
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: C.textSec }} className="font-medium">
                    {progress < 100 ? 'Analyse en cours…' : 'Analyse terminée'}
                  </span>
                  <motion.span
                    key={Math.round(progress / 5) * 5}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="font-mono font-bold tabular-nums"
                    style={{ color: C.iaGreen }}
                  >
                    {Math.round(progress)}%
                  </motion.span>
                </div>
                <div
                  className="relative h-2 rounded-full overflow-hidden"
                  style={{
                    backgroundColor: `${C.textSec}15`,
                    boxShadow: `0 0 8px ${C.iaGreen}40, 0 0 16px ${C.iaGreen}20`,
                  }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${C.iaGreen}, ${C.blue})`,
                      boxShadow: `0 0 12px ${C.iaGreen}80`,
                    }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                  />
                  {/* Shimmer overlay */}
                  <motion.div
                    className="absolute inset-y-0 w-12 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${C.text}40, transparent)`,
                    }}
                    animate={{ left: ['-10%', '110%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Checklist — 2 columns, animated reveal */}
              <div className="mt-5 sm:mt-6 pt-5 border-t" style={{ borderColor: C.border }}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-2 sm:gap-y-2.5">
                  {ANALYSIS_STEPS.map((step, i) => {
                    const visible = i < revealedSteps
                    return (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={visible ? { opacity: 1, x: 0 } : { opacity: 0.15, x: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-2 text-xs sm:text-[13px]"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={visible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
                          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                          className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
                          style={{
                            backgroundColor: visible ? `${C.iaGreen}18` : 'transparent',
                            border: `1px solid ${visible ? C.iaGreen : C.textMute + '40'}`,
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.iaGreen} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                        <span
                          className="font-medium"
                          style={{ color: visible ? C.text : C.textMute + '60' }}
                        >
                          {step.label}
                        </span>
                        {step.category === 'predict' && visible && (
                          <span
                            className="ml-auto text-[8px] uppercase tracking-widest font-bold px-1 py-0.5 rounded"
                            style={{
                              backgroundColor: `${C.purple}15`,
                              color: C.purple,
                            }}
                          >
                            IA
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            CONFIDENCE METRICS — Free vs VIP comparison
            ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mt-6 sm:mt-8"
        >
          {/* Section label */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] sm:text-xs uppercase tracking-widest font-bold"
                style={{ color: C.textSec }}
              >
                Confiance IA — Gratuit vs VIP
              </span>
            </div>
            <span
              className="text-[9px] sm:text-[10px] font-mono"
              style={{ color: C.textMute }}
            >
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>

          {/* 4 metric tiles (2x2 grid mobile, 4 cols desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <MetricTile label="Confiance Globale" value={ACCURACY.vip.overall} color={C.iaGreen} isVIP delay={0.1} />
            <MetricTile label="BTTS"              value={ACCURACY.vip.btts}    color={C.iaGreen} isVIP delay={0.2} />
            <MetricTile label="Over 2.5"          value={ACCURACY.vip.over}    color={C.blue}   isVIP delay={0.3} />
            <MetricTile label="Value Bet"         value={ACCURACY.vip.value}   color={C.purple} isVIP delay={0.4} />
          </div>

          {/* Free vs VIP comparison row */}
          <div
            className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl border"
            style={{
              backgroundColor: `${C.bgCard}`,
              borderColor: C.border,
            }}
          >
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 items-center text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold"
                  style={{ backgroundColor: `${C.iaGreen}15`, color: C.iaGreen }}
                >
                  Free
                </span>
                <span style={{ color: C.textSec }} className="text-[11px] sm:text-xs">
                  Taux public actuel
                </span>
              </div>
              <div className="text-right font-mono tabular-nums text-sm sm:text-base" style={{ color: C.textSec }}>
                {ACCURACY.free.overall}%
              </div>
              <div className="w-16 sm:w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${C.iaGreen}20` }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ACCURACY.free.overall}%` }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: C.textSec, opacity: 0.7 }}
                />
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t grid grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 items-center text-xs sm:text-sm" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold"
                  style={{ backgroundColor: `${C.purple}15`, color: C.purple, border: `1px solid ${C.purple}40` }}
                >
                  VIP
                </span>
                <span style={{ color: C.text }} className="text-[11px] sm:text-xs font-medium">
                  Taux membres VIP
                </span>
              </div>
              <div className="text-right font-mono tabular-nums text-sm sm:text-base font-bold" style={{ color: C.iaGreen, textShadow: `0 0 10px ${C.iaGreen}60` }}>
                {ACCURACY.vip.overall}%
              </div>
              <div className="w-16 sm:w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${C.iaGreen}20` }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ACCURACY.vip.overall}%` }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: C.iaGreen, boxShadow: `0 0 8px ${C.iaGreen}` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            CTA BUTTONS — Primary (inscription) + 2 ghost secondaries
            ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5 max-w-md sm:max-w-2xl mx-auto mt-8 sm:mt-10"
        >
          {/* ══ PRIMARY — Débloquer VIP avec VISION221 (largest, gradient, glow) ══ */}
          <motion.a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            whileHover={{ scale: 1.02, y: -2, boxShadow: `0 8px 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.3)` }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-10 py-4 sm:py-5 rounded-xl text-sm sm:text-lg font-bold transition-all w-full"
            style={{
              background: `linear-gradient(90deg, ${C.iaGreen} 0%, ${C.iaGreenDk} 100%)`,
              color: '#FFFFFF',
              boxShadow: `0 4px 15px rgba(16, 185, 129, 0.4)`,
            }}
            aria-label="S'inscrire sur Linebet avec le code promo VISION221"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Débloquer VIP avec {SITE.promoCode}
          </motion.a>

          {/* ══ SECONDARY — Ghost buttons (attenuated) ══ */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAnalyze}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{
                backgroundColor: 'transparent',
                color: C.iaGreen,
                border: `1px solid ${C.iaGreen}40`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              Analyser les matchs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleDiscover}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{
                backgroundColor: 'transparent',
                color: C.iaGreen,
                border: `1px solid ${C.iaGreen}40`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Découvrir la technologie IA
            </motion.button>
          </div>
        </motion.div>

        {/* Tiny footer line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={showCta ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-[10px] sm:text-xs text-center mt-5 sm:mt-7"
          style={{ color: C.textMute }}
        >
          Moteur IA entraîné sur 50 000+ matchs historiques · 18+ · Les paris comportent des risques
        </motion.p>
      </div>
    </section>
  )
}
