import { useEffect, useRef, useState, useCallback } from 'react'

const visibleElements = new WeakSet<Element>()

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
