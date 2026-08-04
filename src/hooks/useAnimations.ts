import { useEffect, useRef, useState, useCallback } from 'react'

const visibleElements = new WeakSet<Element>()

/**
 * useCountUp — animates a number from 0 (or `from`) to `target` when the
 * element enters the viewport. Returns `[ref, displayValue, hasAnimated]`.
 *
 * The animation uses requestAnimationFrame with an ease-out cubic curve so
 * it feels premium and platform-like (not linear).
 *
 * @param target Final number to count up to
 * @param duration Animation duration in ms (default 1800)
 * @param options { from, decimals, prefix, suffix, triggerOnce }
 */
export function useCountUp(
  target: number,
  duration = 1800,
  options: {
    from?: number
    decimals?: number
    triggerOnce?: boolean
    threshold?: number
  } = {}
): [React.RefObject<HTMLElement | null>, string, boolean] {
  const { from = 0, decimals = 0, triggerOnce = true, threshold = 0.4 } = options
  // FIX BUG 2.1: Initialize with the FINAL value, not 'from'.
  // The animation will override this once it triggers.
  // This ensures the correct value is visible immediately (SSR + above-the-fold).
  const ref = useRef<HTMLElement>(null)
  const [display, setDisplay] = useState(target.toFixed(decimals))
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion: show final value immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target.toFixed(decimals))
      setHasAnimated(true)
      return
    }

    let rafId = 0
    let started = false
    let fallbackTimer: ReturnType<typeof setTimeout>

    const animate = () => {
      if (started) return
      started = true
      // Reset to 'from' for animation start
      setDisplay(from.toFixed(decimals))
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3)
        const current = from + (target - from) * eased
        setDisplay(current.toFixed(decimals))
        if (t < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          setDisplay(target.toFixed(decimals))
          setHasAnimated(true)
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    // If element is already in view on mount (e.g. above the fold), animate after a small delay
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallbackTimer)
          animate()
          if (triggerOnce) observer.unobserve(el)
        } else if (!triggerOnce && hasAnimated) {
          // Reset for re-trigger if not triggerOnce
          setDisplay(from.toFixed(decimals))
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(el)

    // FIX: Fallback — if observer hasn't triggered after 800ms, show final value
    // This handles cases where the element is already visible but the observer
    // hasn't fired yet (common in static export / SSR)
    fallbackTimer = setTimeout(() => {
      if (!started) {
        setDisplay(target.toFixed(decimals))
        setHasAnimated(true)
      }
    }, 800)

    return () => {
      observer.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(fallbackTimer)
    }
  }, [target, duration, from, decimals, triggerOnce, threshold, hasAnimated])

  return [ref as React.RefObject<HTMLElement | null>, display, hasAnimated]
}

/**
 * useRevealOnScroll — lightweight per-element reveal hook that adds
 * `is-visible` class when element enters viewport. Useful for individual
 * cards/rows that should reveal independently (not just once for the section).
 *
 * @param threshold IntersectionObserver threshold (default 0.15)
 * @param variant Optional reveal variant class to apply: 'fade-up' | 'fade-left' | 'scale' | 'blur'
 */
export function useRevealOnScroll(
  threshold = 0.15,
  variant: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'blur' = 'fade-up'
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Apply variant class for CSS targeting
    el.classList.add('reveal-card', `reveal-card--${variant}`)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, variant])

  return [ref, isVisible]
}

export function useScrollAnimation(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (visibleElements.has(el)) {
      queueMicrotask(() => setIsVisible(true))
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
 * Staggered scroll reveal hook.
 * Returns a ref to attach to a parent container. When the container
 * enters the viewport, the `.is-visible` class is added, which triggers
 * cascading reveal of all direct children (via CSS `.stagger-reveal` rules).
 *
 * @param threshold IntersectionObserver threshold (default 0.1)
 * @param variant Optional reveal variant class: 'from-left' | 'from-right' | 'scale-in' | 'blur-in'
 */
export function useStaggerReveal(
  threshold = 0.1,
  variant: 'default' | 'from-left' | 'from-right' | 'scale-in' | 'blur-in' = 'default'
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Apply variant class to the element
    if (variant !== 'default') {
      el.classList.add(variant)
    }

    if (visibleElements.has(el)) {
      queueMicrotask(() => {
        setIsVisible(true)
        el.classList.add('is-visible')
      })
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
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, variant])

  return [ref, isVisible]
}

/**
 * Simple reveal hook — adds `.is-visible` to a single element with one of the
 * `.reveal-*` classes. Useful for headings, hero text, or any solo element.
 */
export function useRevealEntry(
  variant: 'reveal-fade-up' | 'reveal-fade-left' | 'reveal-scale' | 'reveal-on-scroll' = 'reveal-fade-up',
  threshold = 0.1
): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Apply the reveal class
    el.classList.add(variant)

    if (visibleElements.has(el)) {
      queueMicrotask(() => {
        setIsVisible(true)
        el.classList.add('is-visible')
      })
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
  }, [variant, threshold])

  return [ref, isVisible]
}

// Backwards-compat: keep the default export behavior identical to v1
export default useScrollAnimation
