'use client'

import { useEffect, useRef } from 'react'

/**
 * NeuralBackground — V31 IA high-tech effect
 * Canvas-based neural network: nodes connected by lines, slowly drifting.
 * Subtle brightness boost when the mouse moves over the canvas.
 * Respects prefers-reduced-motion (renders static frame only).
 */
interface Node {
  x: number
  y: number
  vx: number
  vy: number
  baseR: number
  pulse: number
}

export default function NeuralBackground({
  density = 0.00008,
  linkDist = 140,
  color = '50, 176, 200',
  className = '',
}: {
  density?: number
  linkDist?: number
  color?: string
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none), (max-width: 1023px)').matches

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let mouseX = -9999
    let mouseY = -9999
    let rafId: number | null = null

    const setup = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const targetCount = Math.max(18, Math.min(70, Math.floor(width * height * density)))
      nodes = Array.from({ length: targetCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        baseR: 0.8 + Math.random() * 1.4,
        pulse: Math.random() * Math.PI * 2,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Update + draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.018
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
        n.x = Math.max(0, Math.min(width, n.x))
        n.y = Math.max(0, Math.min(height, n.y))

        // Mouse proximity brightens the node
        const dx = n.x - mouseX
        const dy = n.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const boost = dist < 160 ? (1 - dist / 160) * 1.6 : 0
        const r = n.baseR + Math.sin(n.pulse) * 0.4 + boost
        const alpha = 0.45 + boost * 0.5
        ctx.beginPath()
        ctx.arc(n.x, n.y, Math.max(0.5, r), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.fill()
      }

      // Draw links between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < linkDist) {
            const t = 1 - dist / linkDist
            // Boost link opacity near mouse
            const mx = (a.x + b.x) / 2
            const my = (a.y + b.y) / 2
            const mdx = mx - mouseX
            const mdy = my - mouseY
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
            const mboost = mdist < 180 ? (1 - mdist / 180) * 0.45 : 0
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${color}, ${0.10 + t * 0.18 + mboost})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      if (!reduce) {
        rafId = requestAnimationFrame(draw)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    const onMouseLeave = () => {
      mouseX = -9999
      mouseY = -9999
    }

    setup()
    draw()

    // No mouse interactions on touch devices
    if (!isTouch) {
      container.addEventListener('mousemove', onMouseMove, { passive: true })
      container.addEventListener('mouseleave', onMouseLeave)
    }

    const onResize = () => {
      setup()
      if (reduce) draw()
    }
    window.addEventListener('resize', onResize)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      if (!isTouch) {
        container.removeEventListener('mousemove', onMouseMove)
        container.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [density, linkDist, color])

  return (
    <div ref={containerRef} className={`v31-neural-layer ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
