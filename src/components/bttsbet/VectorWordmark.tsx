'use client'

import { useEffect, useRef } from 'react'

/**
 * VectorWordmark — motion-design wordmark (Originkit-style).
 *
 * The heading is rasterised on an offscreen canvas, sampled into a grid of
 * vector points, then re-drawn as a live particle field:
 *  1. DRAW-IN  — points fly from a scattered cloud to their glyph position,
 *     staggered left→right so the wordmark looks "hand-drawn".
 *  2. DRIFT    — once drawn, every point breathes on a sine drift
 *     (DRIFT_X / DRIFT_Y) so the title is never static.
 *  3. REPEL    — the pointer pushes nearby points away; they spring back.
 *
 * Accessibility: the component renders aria-hidden canvas only — Hero keeps a
 * visually-hidden real <h1> for SEO/screen readers. prefers-reduced-motion
 * renders the final static frame. Works with FR/EN/AR (full string fillText,
 * so Arabic shaping is preserved).
 */

type WordmarkProps = {
  lines: string[]
  lang?: string
  className?: string
}

type SamplePoint = {
  tx: number
  ty: number
  x: number
  y: number
  sx: number
  sy: number
  delay: number
  phase: number
  speed: number
  line: number
}

const DRAW_DURATION = 1100
const STAGGER = 520
const DRIFT_X = 2.6
const DRIFT_Y = 2.1
const MAX_POINTS = 3000
const POINTS_CAP_COLOR_0 = 'rgba(245, 245, 247, 0.92)'

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function resolveFontFamily(): string {
  if (typeof window === 'undefined') return 'Poppins, system-ui, sans-serif'
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--font-display')
    const cleaned = raw.trim()
    return cleaned ? `${cleaned}, system-ui, sans-serif` : 'Poppins, system-ui, sans-serif'
  } catch {
    return 'Poppins, system-ui, sans-serif'
  }
}

/** Rasterise `lines` and sample glyph pixels into animation targets. */
function sampleWordmark(
  lines: string[],
  opts: { width: number; fontFamily: string; fontWeight: number; step: number }
): { points: SamplePoint[]; height: number; fontSize: number } {
  const { width, fontFamily, fontWeight } = opts
  let step = opts.step

  const measure = document.createElement('canvas')
  const mctx = measure.getContext('2d')
  const probeText = lines.reduce((a, b) => (b.length > a.length ? b : a), '')
  let fontSize = 100
  if (mctx) {
    mctx.font = `${fontWeight} 100px ${fontFamily}`
    const w = mctx.measureText(probeText).width
    if (w > 0) fontSize = Math.min(100, Math.max(30, (width / w) * 100 * 0.98))
  }

  const lineHeight = fontSize * 1.14
  const height = Math.ceil(lineHeight * lines.length + fontSize * 0.24)

  const build = (s: number): SamplePoint[] => {
    const off = document.createElement('canvas')
    off.width = Math.max(1, Math.ceil(width))
    off.height = Math.max(1, height)
    const ctx = off.getContext('2d', { willReadFrequently: true })
    if (!ctx) return []
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, lineHeight * i + lineHeight * 0.55)
    })

    const img = ctx.getImageData(0, 0, off.width, off.height).data
    const pts: SamplePoint[] = []
    const cx = width / 2
    const cy = height / 2
    // PAS ENTIER obligatoire : un pas flottant produirait des indices non
    // entiers dans le TypedArray (undefined) et un nuage de points vide.
    const stepI = Math.max(2, Math.round(s))
    for (let y = 0; y < off.height; y += stepI) {
      for (let x = 0; x < off.width; x += stepI) {
        const alpha = img[(y * off.width + x) * 4 + 3]
        if (alpha > 140) {
          const ang = Math.random() * Math.PI * 2
          const dist = 60 + Math.random() * 190
          pts.push({
            tx: x,
            ty: y,
            x: 0,
            y: 0,
            sx: cx + Math.cos(ang) * dist,
            sy: cy + Math.sin(ang) * dist,
            delay: (x / Math.max(1, off.width)) * STAGGER + Math.random() * 90,
            phase: Math.random() * Math.PI * 2,
            speed: 0.0009 + Math.random() * 0.0009,
            line: 0,
          })
        }
      }
    }
    return pts
  }

  let points = build(step)
  while (points.length > MAX_POINTS && step < 9) {
    step += 1
    points = build(step)
  }

  // Tag which visual line each point belongs to (for the accent colour pass).
  const lh = fontSize * 1.14
  for (const p of points) {
    p.line = Math.min(lines.length - 1, Math.floor(p.ty / lh))
  }

  return { points, height, fontSize }
}

export default function VectorWordmark({ lines, lang = 'fr', className }: WordmarkProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<{
    points: SamplePoint[]
    width: number
    height: number
    fontSize: number
    start: number
    drawn: boolean
    driftAmp: number
    pointerX: number
    pointerY: number
    hasPointer: boolean
    raf: number
    running: boolean
    reduced: boolean
  }>({
    points: [], width: 0, height: 0, fontSize: 0, start: 0, drawn: false,
    driftAmp: 0, pointerX: -9999, pointerY: -9999, hasPointer: false,
    raf: 0, running: false, reduced: false,
  })

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const st = stateRef.current
    st.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let disposed = false
    let ro: ResizeObserver | null = null
    let io: IntersectionObserver | null = null

    const dpr = Math.min(2, window.devicePixelRatio || 1)

    const render = (now: number) => {
      if (!st.running) return
      const w = st.width
      const h = st.height
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const elapsed = now - st.start
      if (!st.drawn && elapsed > STAGGER + DRAW_DURATION + 400) {
        st.drawn = true
      }
      const targetAmp = st.drawn ? 1 : 0
      st.driftAmp += (targetAmp - st.driftAmp) * 0.03

      for (let i = 0; i < st.points.length; i++) {
        const p = st.points[i]
        const t = Math.min(1, Math.max(0, (elapsed - p.delay) / DRAW_DURATION))
        const e = easeOutCubic(t)
        let x = p.sx + (p.tx - p.sx) * e
        let y = p.sy + (p.ty - p.sy) * e

        // Continuous sine drift (never fully static after draw-in).
        const amp = st.driftAmp * e
        x += Math.sin(now * p.speed + p.phase) * DRIFT_X * amp
        y += Math.cos(now * p.speed * 0.92 + p.phase * 1.37) * DRIFT_Y * amp

        // Pointer repulsion field.
        if (st.hasPointer) {
          const dx = x - st.pointerX
          const dy = y - st.pointerY
          const d2 = dx * dx + dy * dy
          const R = 90
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const f = (R - d) / R
            x += (dx / d) * f * 26
            y += (dy / d) * f * 26
          }
        }

        const pulse = 0.78 + 0.22 * Math.sin(now * 0.0021 + p.phase)
        const r = Math.max(0.7, st.fontSize * 0.045) * pulse

        if (p.line === 0) {
          ctx.fillStyle = POINTS_CAP_COLOR_0
        } else {
          const k = p.tx / Math.max(1, w)
          const cr = Math.round(10 + 60 * k)
          const cg = Math.round(132 + 70 * k)
          const cb = Math.round(255 - 15 * k)
          ctx.fillStyle = `rgba(${cr},${cg},${cb},0.95)`
        }
        ctx.globalAlpha = Math.max(0.08, e)
        ctx.fillRect(x - r, y - r, r * 2, r * 2)
      }
      ctx.globalAlpha = 1

      st.raf = requestAnimationFrame(render)
    }

    const startLoop = () => {
      if (st.running || st.reduced || disposed) return
      st.running = true
      st.raf = requestAnimationFrame(render)
    }
    const stopLoop = () => {
      st.running = false
      if (st.raf) cancelAnimationFrame(st.raf)
      st.raf = 0
    }

    const drawStatic = () => {
      // Final frame, no animation (reduced motion).
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, st.width, st.height)
      for (const p of st.points) {
        const r = Math.max(0.7, st.fontSize * 0.045)
        if (p.line === 0) ctx.fillStyle = POINTS_CAP_COLOR_0
        else {
          const k = p.tx / Math.max(1, st.width)
          ctx.fillStyle = `rgba(${Math.round(10 + 60 * k)},${Math.round(132 + 70 * k)},${Math.round(255 - 15 * k)},0.95)`
        }
        ctx.fillRect(p.tx - r, p.ty - r, r * 2, r * 2)
      }
    }

    const resample = () => {
      if (disposed) return
      const rect = host.getBoundingClientRect()
      const w = Math.max(120, Math.floor(rect.width))
      const baseStep = Math.max(2.4, w / 150)
      const sample = sampleWordmark(lines, {
        width: w,
        fontFamily: resolveFontFamily(),
        fontWeight: 700,
        step: baseStep,
      })
      st.points = sample.points
      st.width = w
      st.height = sample.height
      st.fontSize = sample.fontSize
      st.drawn = false
      st.driftAmp = 0

      canvas.width = Math.ceil(w * dpr)
      canvas.height = Math.ceil(sample.height * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${sample.height}px`

      if (st.reduced) {
        drawStatic()
        stopLoop()
      } else {
        st.start = performance.now()
        startLoop()
      }
    }

    const ready = (fn: () => void) => {
      let done = false
      const run = () => { if (!done && !disposed) { done = true; fn() } }
      if (typeof document !== 'undefined' && 'fonts' in document) {
        (document as Document).fonts.ready.then(run).catch(run)
      }
      setTimeout(run, 1600)
    }

    ready(() => {
      if (disposed) return
      resample()

      ro = new ResizeObserver(() => {
        if (!disposed) resample()
      })
      ro.observe(host)

      io = new IntersectionObserver(
        ([entry]) => {
          if (disposed) return
          if (st.reduced) return
          if (entry.isIntersecting) {
            if (!st.drawn) st.start = performance.now()
            startLoop()
          } else {
            stopLoop()
          }
        },
        { threshold: 0.05 }
      )
      io.observe(host)
    })

    const onPointerMove = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      st.pointerX = ev.clientX - rect.left
      st.pointerY = ev.clientY - rect.top
      st.hasPointer = true
    }
    const onPointerLeave = () => { st.hasPointer = false }

    const onVisibility = () => {
      if (disposed || st.reduced) return
      if (document.hidden) stopLoop()
      else startLoop()
    }

    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerleave', onPointerLeave, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      disposed = true
      stopLoop()
      ro?.disconnect()
      io?.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [lines])

  return (
    <div ref={hostRef} className={`vector-wordmark${className ? ` ${className}` : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="vector-wordmark__canvas" />
    </div>
  )
}
