'use client'

import { useEffect, useRef } from 'react'

/**
 * Quantum Aurora Cursor Effect — v6
 * - Custom cyan dot that tracks the cursor precisely (high z-index)
 * - Large 500px glow ring that follows with subtle lag (mix-blend-mode: screen)
 * - Dot grows + shifts to fuchsia when hovering interactive elements
 * - Hidden on touch devices / small screens via CSS
 */
export default function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Only run on desktop / pointer devices
    const isTouch = window.matchMedia('(hover: none), (max-width: 1023px)').matches
    if (isTouch) return

    const dot = dotRef.current
    const glow = glowRef.current
    if (!dot || !glow) return

    // Mouse position tracking
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    // Glow position (lagging)
    let glowX = mouseX
    let glowY = mouseY
    // Dot position (almost instant, slight smoothing)
    let dotX = mouseX
    let dotY = mouseY

    let rafId: number | null = null
    let visible = false

    const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input[type="checkbox"], input[type="radio"], select, [data-cursor="hover"]'

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) {
        dot.style.opacity = '1'
        glow.style.opacity = '1'
        visible = true
      }
      if (!rafId) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const animate = () => {
      // Dot follows quickly with tiny smoothing
      dotX += (mouseX - dotX) * 0.35
      dotY += (mouseY - dotY) * 0.35
      // Glow lags behind for trailing effect
      glowX += (mouseX - glowX) * 0.12
      glowY += (mouseY - glowY) * 0.12

      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`

      rafId = null
      // Continue animating if there's still a noticeable gap
      if (Math.abs(mouseX - glowX) > 0.5 || Math.abs(mouseY - glowY) > 0.5) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const onLeave = () => {
      dot.style.opacity = '0'
      glow.style.opacity = '0'
      visible = false
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const onDown = () => dot.classList.add('is-clicking')
    const onUp = () => dot.classList.remove('is-clicking')

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target) return
      if (target.closest && target.closest(INTERACTIVE_SELECTOR)) {
        dot.classList.add('is-hovering')
      }
    }
    const onOut = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target) return
      if (target.closest && target.closest(INTERACTIVE_SELECTOR)) {
        dot.classList.remove('is-hovering')
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    document.addEventListener('mousedown', onDown, { passive: true })
    document.addEventListener('mouseup', onUp, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Large outer glow — 500px, cyan + fuchsia aurora */}
      <div
        ref={glowRef}
        className="cursor-glow"
        style={{ opacity: 0, left: -500, top: -500 }}
        aria-hidden="true"
      />
      {/* Precise inner dot — cyan, grows on hover */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 0, left: -50, top: -50 }}
        aria-hidden="true"
      />
    </>
  )
}
