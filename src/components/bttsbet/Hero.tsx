'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE, SITE } from '@/lib/constants'

// ─── Ocean Tech palette ────────────────────────────────────────────────
const C = {
  bg:        '#0B1120',
  bgCard:    '#1E293B',
  cyan:      '#00D4FF',
  cyanDk:    '#00B4D8',
  gold:      '#FFD700',
  text:      '#F8FAFC',
  textSec:   '#94A3B8',
  textMute:  '#64748B',
  border:    '#334155',
}

// ─── Data ────────────────────────────────────────────────────────────────
const ACCURACY = {
  vip: { overall: 85, btts: 87, over: 82, value: 89 },
}

const ANALYSIS_STEPS = [
  'Forme récente', 'xG', 'Blessures', 'Cotes', 'Historique',
  'Value Bet', 'BTTS', 'Over 2.5', 'Score Exact', 'Double Chance',
]

// ═══════════════════════════════════════════════════════════════════════
// NeuralNetworkCanvas — canvas particle network (cyan, perf-optimized)
// ═══════════════════════════════════════════════════════════════════════
function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId: number
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 25 : 45
    const maxDist = isMobile ? 90 : 130

    type P = { x: number; y: number; vx: number; vy: number }
    let particles: P[] = []

    const init = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.offsetWidth
      const h = parent.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    const draw = () => {
      if (!running) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.3)'
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      rafId = requestAnimationFrame(draw)
    }

    init(); draw()

    const onVis = () => {
      running = !document.hidden
      if (running) rafId = requestAnimationFrame(draw)
      else cancelAnimationFrame(rafId)
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', init)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', init)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

// ═══════════════════════════════════════════════════════════════════════
// FootballPlayerLayer — photorealistic player with glow + parallax scroll
// ═══════════════════════════════════════════════════════════════════════
function FootballPlayerLayer() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return
      const scrolled = window.scrollY
      // Parallax: player moves at 0.3x scroll speed (floating effect)
      ref.current.style.transform = `translateY(${scrolled * 0.3}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-0 bottom-0 w-full lg:w-[45%] pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <img
        src="/hero-player.png"
        alt=""
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[110%] sm:h-[120%] lg:h-[130%] w-auto object-contain object-right"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.3)) drop-shadow(0 0 60px rgba(0, 212, 255, 0.15))',
          maskImage: 'linear-gradient(to left, black 60%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 95%)',
        }}
        loading="eager"
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// CountUpNumber — animate from 0 to target value
// ═══════════════════════════════════════════════════════════════════════
function CountUpNumber({ target, duration = 1500, suffix = '%' }: { target: number; duration?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(eased * target))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>
}

// ═══════════════════════════════════════════════════════════════════════
// HUD Card — Sci-Fi futuristic analysis panel (chamfered corners + glass)
// ═══════════════════════════════════════════════════════════════════════
function HudAnalysisCard({ progress, revealedSteps }: { progress: number; revealedSteps: number }) {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Glow halo */}
      <div
        className="absolute -inset-1 rounded-2xl blur-2xl pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${C.cyan}15, transparent 50%)`, opacity: 0.5 }}
      />

      {/* HUD Card — chamfered corners via clip-path */}
      <div
        className="relative backdrop-blur-xl border overflow-hidden"
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          borderColor: `${C.cyan}30`,
          clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
          boxShadow: `0 32px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 212, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.06)`,
        }}
      >
        {/* Top laser line — animated gradient sweep */}
        <div className="h-px w-full relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{ background: `linear-gradient(90deg, transparent, ${C.cyan}, ${C.cyanDk}, transparent)` }}
            animate={{ x: ['-30%', '30%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="p-5 sm:p-7 text-left">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: `${C.cyan}12`, border: `1px solid ${C.cyan}30` }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 10v6m11-11h-6m-10 0H1m17.07-7.07l-4.24 4.24m-5.66 5.66l-4.24 4.24m12.73 0l-4.24-4.24m-5.66-5.66L4.93 4.93" />
                  </svg>
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{ border: `1px solid ${C.cyan}` }}
                  animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.text }}>Analyse IA en cours…</div>
                <div className="text-[10px] font-mono" style={{ color: C.textMute }}>Moteur Poisson · {new Date().toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              style={{ backgroundColor: `${C.cyan}10`, border: `1px solid ${C.cyan}25` }}
            >
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.cyan }}
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span className="text-[9px] uppercase tracking-widest font-bold live-text">Live</span>
            </div>
          </div>

          {/* Laser progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: C.textSec }} className="font-medium">
                {progress < 100 ? 'Analyse en cours…' : 'Analyse terminée'}
              </span>
              <span className="font-mono font-bold tabular-nums" style={{ color: C.cyan }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              className="relative h-2.5 rounded-full overflow-hidden"
              style={{
                backgroundColor: 'rgba(51, 65, 85, 0.5)',
                boxShadow: `0 0 8px ${C.cyan}40, 0 0 16px ${C.cyan}20, inset 0 1px 2px rgba(0,0,0,0.3)`,
              }}
            >
              {/* Fill with laser effect */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${C.cyanDk}, ${C.cyan})`,
                  boxShadow: `0 0 12px ${C.cyan}`,
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
              {/* Laser sweep overlay */}
              <motion.div
                className="absolute inset-y-0 w-16 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${C.text}50, transparent)` }}
                animate={{ left: ['-10%', '110%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Scan checklist — flash animation per item */}
          <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(51, 65, 85, 0.5)' }}>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
              {ANALYSIS_STEPS.map((step, i) => {
                const visible = i < revealedSteps
                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0.15 }}
                    animate={visible ? { opacity: 1 } : { opacity: 0.15 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2 text-xs sm:text-[13px]"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={visible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                      className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: visible ? `${C.cyan}18` : 'transparent',
                        border: `1px solid ${visible ? C.cyan : 'rgba(100, 116, 139, 0.3)'}`,
                        boxShadow: visible ? `0 0 8px ${C.cyan}40` : 'none',
                      }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <span className="font-medium" style={{ color: visible ? C.text : 'rgba(100, 116, 139, 0.6)' }}>
                      {step}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Main Hero
// ═══════════════════════════════════════════════════════════════════════
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const [progress, setProgress] = useState(0)
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    if (!isVisible) return
    const duration = 4000
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const p = Math.min(100, eased * 100)
      setProgress(p)
      setRevealedSteps(Math.min(ANALYSIS_STEPS.length, Math.floor((p / 100) * ANALYSIS_STEPS.length) + 1))
      if (p < 100) rafId = requestAnimationFrame(tick)
      else setTimeout(() => setShowCta(true), 100)
    }

    rafId = requestAnimationFrame(tick)
    const earlyShow = setTimeout(() => setShowCta(true), 800)

    return () => { cancelAnimationFrame(rafId); clearTimeout(earlyShow) }
  }, [isVisible])

  const handleAnalyze = () => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })
  const handleDiscover = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: C.bg, paddingTop: 'clamp(2rem, 6vw, 4rem)', paddingBottom: 'clamp(0.5rem, 2vw, 1rem)' }}
    >
      {/* Layer 1: Neural network canvas */}
      <NeuralNetworkCanvas />

      {/* Layer 2: Glow gradients */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[min(900px,90vw)] h-[600px] rounded-full blur-[140px]"
          style={{ background: `radial-gradient(ellipse at center top, ${C.cyan}22, transparent 70%)` }} />
      </div>

      {/* Layer 3: Football player with parallax */}
      <FootballPlayerLayer />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md"
            style={{ backgroundColor: `${C.cyan}0d`, borderColor: `${C.cyan}30` }}
          >
            <span className="relative flex w-2 h-2">
              <motion.span className="absolute inset-0 rounded-full" style={{ backgroundColor: C.cyan }}
                animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              <span className="relative inline-flex w-2 h-2 rounded-full"
                style={{ backgroundColor: C.cyan, boxShadow: `0 0 8px ${C.cyan}` }} />
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] live-text">
              IA Active en Temps Réel
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 sm:mt-7 text-[1.75rem] sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-[-0.03em]"
            style={{ color: C.text }}
          >
            Votre <span style={{ color: C.cyan, textShadow: `0 0 24px ${C.cyan}80, 0 0 48px ${C.cyan}40` }}>IA</span> analyse plus de
            <br className="hidden sm:block" /> 1200 matchs chaque jour.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
            style={{ color: C.textSec }}
          >
            Obtenez des pronostics de haute précision pour maximiser vos gains.
            Inscrivez-vous sur Linebet avec le code{' '}
            <span className="font-bold" style={{ color: C.cyan, textShadow: `0 0 12px ${C.cyan}60` }}>
              {SITE.promoCode}
            </span>{' '}pour débloquer +85% de précision.
          </motion.p>
        </div>

        {/* HUD Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <HudAnalysisCard progress={progress} revealedSteps={revealedSteps} />
        </motion.div>

        {/* Confidence metrics with CountUp */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto mt-6 sm:mt-8"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold" style={{ color: C.textSec }}>
              Confiance IA — Pronostics VIP
            </span>
            <span className="text-[9px] font-mono" style={{ color: C.textMute }}>
              {new Date().toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: 'Confiance', value: ACCURACY.vip.overall, color: C.cyan },
              { label: 'BTTS', value: ACCURACY.vip.btts, color: C.cyan },
              { label: 'Over 2.5', value: ACCURACY.vip.over, color: C.cyanDk },
              { label: 'Value Bet', value: ACCURACY.vip.value, color: C.gold },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 8 }}
                animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="p-3 rounded-xl border text-center"
                style={{ backgroundColor: `${m.color}06`, borderColor: `${m.color}25` }}
              >
                <div className="text-xl sm:text-2xl font-bold" style={{ color: m.color, textShadow: `0 0 12px ${m.color}60` }}>
                  <CountUpNumber target={m.value} />
                </div>
                <div className="text-[9px] uppercase tracking-widest font-semibold mt-1" style={{ color: C.textSec }}>
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5 max-w-md sm:max-w-2xl mx-auto mt-6 sm:mt-8"
        >
          {/* Primary — Débloquer VIP */}
          <motion.a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            whileHover={{ scale: 1.02, y: -2, boxShadow: `0 8px 30px ${C.cyan}50, 0 0 60px ${C.cyan}30` }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-10 py-4 sm:py-5 rounded-xl text-sm sm:text-lg font-bold transition-all w-full"
            style={{
              background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.cyanDk} 100%)`,
              color: '#0B1120',
              boxShadow: `0 4px 15px ${C.cyan}40`,
            }}
            aria-label="S'inscrire sur Linebet avec le code promo VISION221"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Débloquer VIP avec {SITE.promoCode}
          </motion.a>

          {/* Ghost secondaries */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAnalyze}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{ backgroundColor: 'transparent', color: C.cyan, border: `1px solid ${C.cyan}40` }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              Analyser les matchs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleDiscover}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{ backgroundColor: 'transparent', color: C.cyan, border: `1px solid ${C.cyan}40` }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Découvrir la technologie IA
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={showCta ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-[10px] sm:text-xs text-center mt-5"
          style={{ color: C.textMute }}
        >
          Moteur IA entraîné sur 50 000+ matchs historiques · 18+ · Les paris comportent des risques
        </motion.p>
      </div>
    </section>
  )
}
