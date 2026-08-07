'use client'

import { motion } from 'framer-motion'

interface LockedContentProps {
  accentColor: string  // hex color for the lock icon
  accentLight: string  // lighter shade for text
  label?: string       // text below lock icon (default: 'VIP')
  children: React.ReactNode
  blurStrength?: number // default: 5
  className?: string
}

/**
 * LockedContent — Shared locked content overlay.
 * Used by PromoVip, VipSports, AviatorVip, FifaLinebet.
 *
 * Renders children with a blur effect + lock icon centered.
 * The overlay is `pointer-events-none` so CTAs below remain accessible
 * for screen readers (but visually obscured to encourage unlock).
 */
export default function LockedContent({
  accentColor,
  accentLight,
  label = 'VIP',
  children,
  blurStrength = 5,
  className = '',
}: LockedContentProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Children with blur */}
      <div
        style={{ filter: `blur(${blurStrength}px)` }}
        className="select-none pointer-events-none"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-lg pointer-events-none"
        style={{ backgroundColor: 'rgba(13, 15, 18, 0.85)' }}>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-midnight/90 rounded-full p-3 flex flex-col items-center gap-1"
          style={{ border: `1px solid ${accentColor}4D` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: accentLight }}
          >
            {label}
          </span>
        </motion.div>
      </div>
    </div>
  )
}
