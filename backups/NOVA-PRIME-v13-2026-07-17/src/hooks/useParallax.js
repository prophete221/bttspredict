import { useEffect, useRef } from 'react'

/**
 * useParallax — Parallax scroll via transform direct (pas de setState).
 * Beaucoup plus performant que la version avec useState.
 */
export function useParallax(speed = 0.15) {
  const ref = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const windowHeight = window.innerHeight
        if (rect.bottom >= -200 && rect.top <= windowHeight + 200) {
          const scrollY = window.scrollY
          const elementTop = rect.top + scrollY
          const translateY = (scrollY - elementTop) * speed * -1
          el.style.transform = `translate3d(0, ${translateY}px, 0)`
        }
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed])

  // Retourne juste le ref, le style est appliqué directement sur le DOM
  return [ref, {}]
}

/**
 * useParallaxMouse — Parallax souris via ref direct (pas de setState).
 */
export function useParallaxMouse(intensity = 15) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let rafId = null

    const handleMouseMove = (e) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const x = (e.clientX - centerX) / window.innerWidth * intensity
        const y = (e.clientY - centerY) / window.innerHeight * intensity
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        rafId = null
      })
    }

    // Desktop uniquement
    if (window.innerWidth < 1024) return

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [intensity])

  return { containerRef, style: {} }
}
