'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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

// ─── Data ───────────────────────────────────────────────────────────────
const ACCURACY = {
  vip: { overall: 85, btts: 87, over: 82, value: 89 },
}

const ANALYSIS_STEPS = [
  'Forme récente', 'xG', 'Blessures', 'Cotes', 'Historique',
  'Value Bet', 'BTTS', 'Over 2.5', 'Score Exact', 'Double Chance',
]

// ═══════════════════════════════════════════════════════════════════════
// NeuralNetworkCanvas — very subtle (low opacity, few particles)
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
    const count = isMobile ? 15 : 30
    const maxDist = isMobile ? 80 : 120

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
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
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
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.15)'
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.06
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
// CountUpNumber
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
// BttsBet Logo — SVG inline (data + chart icon)
// ═══════════════════════════════════════════════════════════════════════
function BttsBetLogo() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${C.cyan}20, ${C.cyanDk}10)`,
          border: `1px solid ${C.cyan}30`,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 4 4 5-5" />
        </svg>
      </div>
      {/* Text */}
      <div className="text-left">
        <div className="text-xl font-bold tracking-tight" style={{ color: C.text }}>
          BttsBet <span style={{ color: C.cyan }}>AI</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: C.textMute }}>
          Plateforme de pronostics IA
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Main Hero — Professional SaaS design (clean, readable, no distraction)
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
      style={{ backgroundColor: C.bg, paddingTop: 'clamp(2.5rem, 6vw, 4rem)', paddingBottom: 'clamp(0.5rem, 2vw, 1rem)' }}
    >
      {/* Layer 1: Neural network canvas (very subtle) */}
      <NeuralNetworkCanvas />

      {/* Layer 2: Subtle top glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[min(800px,90vw)] h-[500px] rounded-full blur-[140px]"
          style={{ background: `radial-gradient(ellipse at center top, ${C.cyan}15, transparent 70%)` }}
        />
      </div>

      {/* Content — centered, clean, professional */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* ═══ Logo BttsBet AI ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          <BttsBetLogo />
        </motion.div>

        {/* ═══ Badge "IA Active" ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md mb-6"
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

        {/* ═══ H1 — Clean, bold, readable ═══ */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-[-0.02em] mb-4"
          style={{ color: C.text }}
        >
          Votre <span style={{ color: C.cyan }}>IA</span> analyse plus de 1200 matchs chaque jour.
        </motion.h1>

        {/* ═══ Subtitle — Clear, concise ═══ */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8"
          style={{ color: C.textSec }}
        >
          Obtenez des pronostics de haute précision pour maximiser vos gains.
          Inscrivez-vous sur Linebet avec le code{' '}
          <span className="font-bold" style={{ color: C.cyan }}>{SITE.promoCode}</span>{' '}
          pour débloquer +85% de précision.
        </motion.p>

        {/* ═══ HUD Analysis Card — compact, pro ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative max-w-xl mx-auto mb-6"
        >
          <div
            className="relative backdrop-blur-md border rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderColor: `${C.cyan}20`,
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Top accent */}
            <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)` }} />

            <div className="p-4 sm:p-5 text-left">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <motion.div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${C.cyan}10`, border: `1px solid ${C.cyan}25` }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 10v6m11-11h-6m-10 0H1" />
                    </svg>
                  </motion.div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: C.text }}>Analyse IA en cours…</div>
                    <div className="text-[9px] font-mono" style={{ color: C.textMute }}>{new Date().toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1" style={{ backgroundColor: `${C.cyan}10`, border: `1px solid ${C.cyan}25`, borderRadius: 6, padding: '2px 6px' }}>
                  <motion.span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.cyan }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  <span className="text-[8px] uppercase tracking-widest font-bold live-text">Live</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: C.textSec }} className="font-medium">
                    {progress < 100 ? 'Analyse en cours…' : 'Analyse terminée'}
                  </span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: C.cyan }}>{Math.round(progress)}%</span>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', boxShadow: `0 0 6px ${C.cyan}30` }}>
                  <motion.div className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${C.cyanDk}, ${C.cyan})`, boxShadow: `0 0 8px ${C.cyan}` }}
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.05, ease: 'linear' }} />
                  <motion.div className="absolute inset-y-0 w-12 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${C.text}40, transparent)` }}
                    animate={{ left: ['-10%', '110%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                </div>
              </div>

              {/* Checklist — compact 2 cols */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t" style={{ borderColor: 'rgba(51, 65, 85, 0.5)' }}>
                {ANALYSIS_STEPS.map((step, i) => {
                  const visible = i < revealedSteps
                  return (
                    <motion.div key={step}
                      initial={{ opacity: 0.15 }}
                      animate={visible ? { opacity: 1 } : { opacity: 0.15 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-1.5 text-[11px]"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={visible ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
                        className="flex-shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center"
                        style={{ backgroundColor: visible ? `${C.cyan}15` : 'transparent', border: `1px solid ${visible ? C.cyan : 'rgba(100, 116, 139, 0.3)'}` }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                      <span className="font-medium" style={{ color: visible ? C.text : 'rgba(100, 116, 139, 0.5)' }}>{step}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Confidence KPIs with CountUp ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto mb-6"
        >
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Confiance', value: ACCURACY.vip.overall, color: C.cyan },
              { label: 'BTTS', value: ACCURACY.vip.btts, color: C.cyan },
              { label: 'Over 2.5', value: ACCURACY.vip.over, color: C.cyanDk },
              { label: 'Value Bet', value: ACCURACY.vip.value, color: C.gold },
            ].map((m, i) => (
              <motion.div key={m.label}
                initial={{ opacity: 0, y: 8 }}
                animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="p-2 sm:p-3 rounded-lg border text-center"
                style={{ backgroundColor: `${m.color}06`, borderColor: `${m.color}25` }}
              >
                <div className="text-base sm:text-xl font-bold" style={{ color: m.color, textShadow: `0 0 10px ${m.color}50` }}>
                  <CountUpNumber target={m.value} />
                </div>
                <div className="text-[8px] sm:text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: C.textSec }}>
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ CTA ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={showCta ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-2.5 max-w-md sm:max-w-xl mx-auto"
        >
          {/* Primary */}
          <motion.a
            href={AFFILIATE.linebet}
            rel={AFFILIATE.rel}
            target="_blank"
            whileHover={{ scale: 1.02, y: -2, boxShadow: `0 8px 30px ${C.cyan}50, 0 0 60px ${C.cyan}30` }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all w-full"
            style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.cyanDk})`, color: '#0B1120', boxShadow: `0 4px 15px ${C.cyan}40` }}
            aria-label="S'inscrire sur Linebet avec le code promo VISION221"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Débloquer VIP avec {SITE.promoCode}
          </motion.a>

          {/* Secondaries — ghost */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={handleAnalyze}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{ backgroundColor: 'transparent', color: C.cyan, border: `1px solid ${C.cyan}40` }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Analyser les matchs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={handleDiscover}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{ backgroundColor: 'transparent', color: C.cyan, border: `1px solid ${C.cyan}40` }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              Découvrir la technologie IA
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={showCta ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-[10px] sm:text-xs mt-5"
          style={{ color: C.textMute }}
        >
          Moteur IA entraîné sur 50 000+ matchs historiques · 18+ · Les paris comportent des risques
        </motion.p>
      </div>
    </section>
  )
}
