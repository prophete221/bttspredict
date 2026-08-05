'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * CopyableCode — Renders the promo code as a clickable, copyable element.
 * Click to copy to clipboard. Shows "Copié!" feedback.
 * Use anywhere the promo code appears for consistency.
 *
 * Props:
 * - gold: enables gold shimmer + glow effect (for hero)
 */
export default function CopyableCode({
  code,
  className = '',
  displayClassName = '',
  gold = false,
}: {
  code: string
  className?: string
  displayClassName?: string
  gold?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scroll position relative to element for glow effect
  useEffect(() => {
    if (!gold) return
    const onScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // 0 when element is below viewport, 1 when above, 0.5 when centered
      const center = rect.top + rect.height / 2
      const progress = 1 - Math.max(0, Math.min(1, center / windowHeight))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // Initial
    return () => window.removeEventListener('scroll', onScroll)
  }, [gold])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15)
    }
    setTimeout(() => setCopied(false), 2000)
  }

  // Gold glow intensity based on scroll (0 → max when centered)
  const glowIntensity = gold ? 0.4 + scrollProgress * 0.6 : 0
  const goldGlow = gold
    ? `text-shadow: 0 0 ${10 + scrollProgress * 20}px rgba(245, 158, 11, ${glowIntensity}), 0 0 ${20 + scrollProgress * 40}px rgba(245, 158, 11, ${glowIntensity * 0.5});`
    : ''

  if (gold) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <motion.button
          ref={ref}
          onClick={copy}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="cursor-pointer font-mono font-black tracking-[0.1em] transition-all"
          aria-label={`Copier le code promo ${code}`}
          style={{
            background: 'linear-gradient(100deg, #FACC15 0%, #FFE066 30%, #FFD700 50%, #FFE066 70%, #FACC15 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'goldShimmer 3s ease-in-out infinite',
            ...(goldGlow ? { cssText: goldGlow } : {}),
            borderBottom: '2px solid rgba(245, 158, 11, 0.4)',
          }}
        >
          {code}
        </motion.button>
        <motion.button
          onClick={copy}
          whileTap={{ scale: 0.9 }}
          className="inline-flex items-center justify-center w-4 h-4 rounded transition-colors"
          style={{ color: copied ? '#16A34A' : '#FACC15' }}
          aria-label="Copier"
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          )}
        </motion.button>
        <style>{`
          @keyframes goldShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <motion.button
        onClick={copy}
        whileTap={{ scale: 0.95 }}
        className={`cursor-pointer font-bold transition-colors ${displayClassName}`}
        aria-label={`Copier le code promo ${code}`}
        style={{ borderBottom: '1px dashed rgba(22, 163, 74, 0.3)' }}
      >
        {code}
      </motion.button>
      <motion.button
        onClick={copy}
        whileTap={{ scale: 0.9 }}
        className="inline-flex items-center justify-center w-4 h-4 rounded transition-colors"
        style={{ color: copied ? '#16A34A' : '#16A34A' }}
        aria-label="Copier"
      >
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
        )}
      </motion.button>
    </span>
  )
}
