import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * useScrollAnimation — IntersectionObserver pour animations au scroll.
 * Utilise une seule observer partagée pour toutes les instances.
 */
const visibleElements = new WeakSet()

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Déjà visible (scroll ancien)
    if (visibleElements.has(el)) {
      setIsVisible(true)
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visibleElements.add(el)
          el.classList.add('is-visible')
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

/**
 * useMousePosition — Hook pour effet tilt 3D au hover.
 */
export function useMousePosition() {
  const positionRef = useRef({ x: 0.5, y: 0.5 })

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    positionRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    positionRef.current = { x: 0.5, y: 0.5 }
  }, [])

  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${(positionRef.current.y - 0.5) * -6}deg) rotateY(${(positionRef.current.x - 0.5) * 6}deg)`,
    transition: 'transform 0.5s ease-out',
  }

  return { handleMouseMove, handleMouseLeave, tiltStyle }
}
