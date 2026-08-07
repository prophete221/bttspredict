'use client'

import { useEffect, useState } from 'react'

/**
 * ScrollProgressBar — fixed top progress bar that fills as the user scrolls
 * down the page. Provides a subtle "platform app" feel that's missing on
 * traditional blog-style sites. Works on both desktop and mobile.
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId = 0
    const update = () => {
      rafId = 0
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0
      setProgress(pct)
    }
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
    >
      <div
        className="h-full origin-left transition-transform duration-100 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          background:
            'linear-gradient(90deg, #18E0B5 0%, #18E0B5 30%, #5AF2A6 60%, #18E0B5 85%, #5AF2A6 100%)',
          boxShadow: '0 0 8px rgba(24, 224, 181, 0.5), 0 0 20px rgba(24, 224, 181, 0.2)',
        }}
      />
    </div>
  )
}
