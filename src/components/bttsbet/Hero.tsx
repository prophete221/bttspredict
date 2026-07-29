'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { AFFILIATE, SITE } from '@/lib/constants'
import CopyableCode from './CopyableCode'

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
  green:     '#10b981',
}

// ─── Data ───────────────────────────────────────────────────────────────
const ACCURACY = {
  vip: { overall: 85, btts: 87, over: 82, value: 89 },
  free: { overall: 52, btts: 50, over: 54 },
}

const ANALYSIS_STEPS = [
  'Forme récente', 'xG', 'Blessures', 'Cotes', 'Historique',
  'Value Bet', 'BTTS', 'Over 2.5', 'Score Exact', 'Double Chance',
]

// Live data feed — fetched from transfers.json (auto-updated by CI scraper)
interface TransferItem {
  player: string
  from: string
  to: string
  fee: string
  league: string
  country: string
}

const FALLBACK_TRANSFERS: TransferItem[] = [
  { player: 'Mbappé', from: 'PSG', to: 'Real Madrid', fee: 'Libre', league: 'La Liga', country: '🇪🇸' },
  { player: 'Haaland', from: 'Dortmund', to: 'Man City', fee: '60M€', league: 'Premier League', country: '🇬🇧' },
  { player: 'Bellingham', from: 'Dortmund', to: 'Real Madrid', fee: '103M€', league: 'La Liga', country: '🇪🇸' },
  { player: 'Vinicius Jr', from: 'Real Madrid', to: 'Al-Ahli', fee: '200M€', league: 'Saudi Pro League', country: '🇸🇦' },
  { player: 'Wirtz', from: 'Leverkusen', to: 'Bayern', fee: '80M€', league: 'Bundesliga', country: '🇩🇪' },
  { player: 'Kvaratskhelia', from: 'Naples', to: 'PSG', fee: '75M€', league: 'Ligue 1', country: '🇫🇷' },
]

// Sparkline data (14-day win rate)
const SPARKLINE_DATA = [62, 65, 68, 64, 70, 73, 69, 75, 78, 76, 80, 82, 79, 85]

// =======================================================================
// NeuralNetworkCanvas — subtle animated background
// =======================================================================
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
      const w = parent.offsetWidth, h = parent.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      }))
    }

    const draw = () => {
      if (!running) return
      const w = canvas.width / dpr, h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.12)'; ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / maxDist) * 0.05})`
            ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      rafId = requestAnimationFrame(draw)
    }

    init(); draw()
    const onVis = () => { running = !document.hidden; if (running) rafId = requestAnimationFrame(draw); else cancelAnimationFrame(rafId) }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', init)
    return () => { cancelAnimationFrame(rafId); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', init) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

// =======================================================================
// CountUpNumber — animated counter
// =======================================================================
function CountUpNumber({ target, duration = 1500, suffix = '%' }: { target: number; duration?: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>
}

// =======================================================================
// Sparkline — animated SVG chart (14-day trend)
// =======================================================================
function Sparkline() {
  const max = Math.max(...SPARKLINE_DATA)
  const min = Math.min(...SPARKLINE_DATA)
  const range = max - min || 1
  const points = SPARKLINE_DATA.map((v, i) => {
    const x = (i / (SPARKLINE_DATA.length - 1)) * 100
    const y = 30 - ((v - min) / range) * 25 - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-12">
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.cyan} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
        points={'0,32 ' + points + ' 100,32'}
        fill="url(#spark-grad)"
      />
      <motion.polyline
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
        points={points}
        fill="none"
        stroke={C.cyan}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Last point dot */}
      <motion.circle
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring' }}
        cx={100} cy={30 - ((SPARKLINE_DATA[SPARKLINE_DATA.length - 1] - min) / range) * 25 - 2}
        r="2" fill={C.cyan}
        style={{ filter: 'drop-shadow(0 0 4px ' + C.cyan + ')' }}
      />
    </svg>
  )
}

// =======================================================================
// TransferFeed — cycling latest player transfers (auto-updated via CI)
// =======================================================================
function TransferFeed() {
  const [index, setIndex] = useState(0)
  const [transfers, setTransfers] = useState<TransferItem[]>(FALLBACK_TRANSFERS)

  useEffect(() => {
    fetch('/transfers.json')
      .then(r => r.json())
      .then(data => {
        if (data?.transfers?.length > 0) {
          setTransfers(data.transfers.slice(0, 8))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % transfers.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [transfers.length])

  const item = transfers[index]
  if (!item) return null

  return (
    <div className="relative h-7 overflow-hidden rounded-lg" style={{ backgroundColor: 'rgba(11, 17, 32, 0.6)', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-between px-3"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm flex-shrink-0">{item.country}</span>
            <span className="text-[10px] font-bold text-white truncate">{item.player}</span>
            <span className="text-[9px] text-gray-500 flex-shrink-0 hidden sm:inline">{item.from}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.5" className="flex-shrink-0">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
            <span className="text-[10px] font-bold truncate" style={{ color: C.cyan }}>{item.to}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', color: C.gold }}>{item.fee}</span>
            <span className="text-[8px] text-gray-600 hidden sm:inline">{item.league}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// =======================================================================
// KPI Card with progress bar
// =======================================================================
function KpiCard({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="relative p-2.5 rounded-lg overflow-hidden"
      style={{ backgroundColor: color + '08', border: '1px solid ' + color + '25' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, ' + color + ', transparent)', opacity: 0.6 }} />
      <div className="text-lg sm:text-xl font-extrabold" style={{ color, textShadow: '0 0 10px ' + color + '50' }}>
        <CountUpNumber target={value} />
      </div>
      <div className="text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: C.textSec }}>{label}</div>
      {/* Mini progress bar */}
      <div className="mt-1.5 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: color + '15' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: value + "%" }}
          transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: '0 0 4px ' + color }}
        />
      </div>
    </motion.div>
  )
}

// =======================================================================
// Main Hero — Dynamic IA Analysis Platform
// =======================================================================
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const [progress, setProgress] = useState(0)
  const [revealedSteps, setRevealedSteps] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    const duration = 3500
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const p = Math.min(100, eased * 100)
      setProgress(p)
      setRevealedSteps(Math.min(ANALYSIS_STEPS.length, Math.floor((p / 100) * ANALYSIS_STEPS.length) + 1))
      if (p < 100) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isVisible])

  const handleAnalyze = () => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' })
  const handleDiscover = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: C.bg, paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)', paddingBottom: 'clamp(0.5rem, 1.5vw, 1rem)' }}
    >
      <NeuralNetworkCanvas />

      {/* Subtle top glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[min(800px,90vw)] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(ellipse at center top, rgba(0, 212, 255, 0.09), transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

        {/* === TOP: Logo + Badge + Title === */}
        <div className="text-center mb-5 sm:mb-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2.5 mb-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.12), rgba(0, 180, 216, 0.06))', border: '1px solid rgba(0, 212, 255, 0.19)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold tracking-tight" style={{ color: C.text }}>BttsBet <span style={{ color: C.cyan }}>AI</span></div>
              <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: C.textMute }}>Plateforme de pronostics IA</div>
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined }
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md mb-4"
            style={{ backgroundColor: 'rgba(0, 212, 255, 0.05)', borderColor: 'rgba(0, 212, 255, 0.19)' }}
          >
            <span className="relative flex w-2 h-2">
              <motion.span className="absolute inset-0 rounded-full" style={{ backgroundColor: C.cyan }}
                animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
              <span className="relative inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: C.cyan, boxShadow: '0 0 8px ' + C.cyan }} />
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] live-text">IA Active en Temps Réel</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined }
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.15] tracking-[-0.02em] mb-3"
            style={{ color: C.text }}
          >
            Votre <span style={{ color: C.cyan, textShadow: '0 0 20px ' + C.cyan + '60' }}>IA</span> analyse plus de 1200 matchs chaque jour.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-5"
            style={{ color: C.textSec }}
          >
            Obtenez des pronostics de haute précision. Inscrivez-vous sur Linebet avec le code{' '}
            <CopyableCode code={SITE.promoCode} displayClassName="text-cyan" />{' '}
            pour débloquer +85% de précision.
          </motion.p>
        </div>

        {/* === DASHBOARD — 2 columns on desktop, stacked on mobile === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined }
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid lg:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          {/* === LEFT: IA Analysis Panel === */}
          <div
            className="relative backdrop-blur-md border rounded-xl overflow-hidden"
            style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', borderColor: 'rgba(0, 212, 255, 0.12)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)' }}
          >
            {/* Top laser line */}
            <div className="h-px w-full relative overflow-hidden">
              <motion.div className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, ' + C.cyan + ', ' + C.cyanDk + ', transparent)' }}
                animate={{ x: ['-30%', '30%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
            </div>

            <div className="p-4 sm:p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <motion.div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 212, 255, 0.06)', border: '1px solid rgba(0, 212, 255, 0.16)' }}
                    animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 10v6m11-11h-6m-10 0H1" />
                    </svg>
                  </motion.div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: C.text }}>Analyse IA en cours…</div>
                    <div className="text-[9px] font-mono" style={{ color: C.textMute }}>{new Date().toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0, 212, 255, 0.06)', border: '1px solid rgba(0, 212, 255, 0.16)' }}>
                  <motion.span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.cyan }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  <span className="text-[8px] uppercase tracking-widest font-bold live-text">Live</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: C.textSec }} className="font-medium">{progress < 100 ? 'Analyse en cours…' : 'Analyse terminée'}</span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: C.cyan }}>{Math.round(progress)}%</span>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'rgba(51, 65, 85, 0.5)', boxShadow: '0 0 6px rgba(0, 212, 255, 0.19)' }}>
                  <motion.div className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: 'linear-gradient(90deg, ' + C.cyanDk + ', ' + C.cyan + ')', boxShadow: '0 0 8px ' + C.cyan }}
                    animate={{ width: progress + "%" }} transition={{ duration: 0.05, ease: 'linear' }} />
                  <motion.div className="absolute inset-y-0 w-12 rounded-full"
                    style={{ background: 'linear-gradient(90deg, transparent, ' + C.text + '40, transparent)' }}
                    animate={{ left: ['-10%', '110%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                </div>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-3 border-t" style={{ borderColor: 'rgba(51, 65, 85, 0.5)' }}>
                {ANALYSIS_STEPS.map((step, i) => {
                  const visible = i < revealedSteps
                  return (
                    <motion.div key={step}
                      initial={{ opacity: 0.15 }} animate={visible ? { opacity: 1 } : { opacity: 0.15 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-1.5 text-[11px]">
                      <motion.div
                        initial={{ scale: 0 }} animate={visible ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.2, type: 'spring', stiffness: 200 }}
                        className="flex-shrink-0 w-3.5 h-3.5 rounded flex items-center justify-center"
                        style={{ backgroundColor: visible ? 'rgba(0, 212, 255, 0.09)' : 'transparent', border: '1px solid ' + (visible ? C.cyan : 'rgba(100, 116, 139, 0.3)') }}>
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

          {/* === RIGHT: Live Stats Panel === */}
          <div className="flex flex-col gap-3">
            <div
              className="backdrop-blur-md border rounded-xl p-3"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', borderColor: 'rgba(51, 65, 85, 0.4)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textSec }}>Derniers transferts</span>
                <span className="text-[9px] font-mono" style={{ color: C.textMute }}>Mis a jour quotidien</span>
              </div>
              <TransferFeed />
            </div>

            <div
              className="backdrop-blur-md border rounded-xl p-3"
              style={{ backgroundColor: 'rgba(30, 41, 59, 0.6)', borderColor: 'rgba(51, 65, 85, 0.4)' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textSec }}>Tendance 14 jours</span>
                <span className="text-xs font-bold" style={{ color: C.cyan }}>+85%</span>
              </div>
              <Sparkline />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <KpiCard label="Confiance" value={ACCURACY.vip.overall} color={C.cyan} delay={0.6} />
              <KpiCard label="BTTS" value={ACCURACY.vip.btts} color={C.cyan} delay={0.7} />
              <KpiCard label="Over 2.5" value={ACCURACY.vip.over} color={C.cyanDk} delay={0.8} />
              <KpiCard label="Value Bet" value={ACCURACY.vip.value} color={C.gold} delay={0.9} />
            </div>
          </div>
        </motion.div>

        {/* === CTA === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined }
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-2.5 max-w-md sm:max-w-xl mx-auto mt-5 sm:mt-6"
        >
          {/* Primary */}
          <motion.a
            href={AFFILIATE.linebet} rel={AFFILIATE.rel} target="_blank"
            whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-10 py-4 sm:py-5 rounded-xl text-sm sm:text-lg font-extrabold transition-all w-full"
            style={{ background: 'linear-gradient(90deg, #00D4FF, #00B4D8)', color: '#0B1120', boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)' }}
            aria-label="Inscription Linebet code promo VISION221"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Débloquer VIP avec {SITE.promoCode}
          </motion.a>

          {/* Ghost secondaries */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleAnalyze}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{ backgroundColor: 'transparent', color: C.cyan, border: '1px solid rgba(0, 212, 255, 0.25)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              Analyser les matchs
            </motion.button>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleDiscover}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
              style={{ backgroundColor: 'transparent', color: C.cyan, border: '1px solid rgba(0, 212, 255, 0.25)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              Découvrir la technologie IA
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : undefined }
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-[10px] sm:text-xs text-center mt-4" style={{ color: C.textMute }}
        >
          Moteur IA entraîné sur 50 000+ matchs historiques · 18+ · Les paris comportent des risques
        </motion.p>
      </div>
    </section>
  )
}
