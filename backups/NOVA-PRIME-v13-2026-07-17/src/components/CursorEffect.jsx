import { useEffect, useRef, useCallback } from 'react'

export default function CursorEffect() {
  const ref = useRef(null)

  useEffect(() => {
    // Desktop uniquement
    if (window.innerWidth < 1024) return

    const el = ref.current
    if (!el) return

    let rafId = null
    let visible = false

    const onMove = (e) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        el.style.left = `${e.clientX - 150}px`
        el.style.top = `${e.clientY - 150}px`
        if (!visible) {
          el.style.opacity = '1'
          visible = true
        }
        rafId = null
      })
    }

    const onLeave = () => {
      el.style.opacity = '0'
      visible = false
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="cursor-glow"
      style={{
        position: 'fixed',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 212, 170, 0.06) 0%, rgba(0, 212, 170, 0.02) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        transform: 'translate3d(0, 0, 0)',
        willChange: 'left, top',
        left: -300,
        top: -300,
      }}
      aria-hidden="true"
    />
  )
}
