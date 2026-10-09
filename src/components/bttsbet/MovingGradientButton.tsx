'use client'

import { useEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { motion, useAnimate, useReducedMotion } from 'framer-motion'

/**
 * MovingGradientButton — Originkit-style CTA.
 *
 * A masked conic-gradient "band" (BAND_MASK) travels around the button
 * border. Two stroke modes:
 *  - continuous: the band glides around the border without stopping;
 *  - step:       the band jumps in discrete increments (mechanical feel).
 *
 * The rotation is driven by framer-motion `useAnimate` on the CSS variable
 * --mg-angle, consumed by the masked border layer. Reduced motion freezes
 * the band. Affiliate usage MUST pass rel="sponsored nofollow noopener
 * noreferrer" and fire its own tracking (see Hero partner panel).
 */

type MovingGradientButtonProps = {
  href: string
  children: ReactNode
  mode?: 'continuous' | 'step'
  variant?: 'primary' | 'ghost'
  className?: string
  style?: CSSProperties
  onClick?: (ev: MouseEvent<HTMLAnchorElement>) => void
  target?: string
  rel?: string
  ariaLabel?: string
}

const STEP_ANGLE = 90
const STEP_INTERVAL = 1150

export default function MovingGradientButton({
  href,
  children,
  mode = 'continuous',
  variant = 'primary',
  className,
  style,
  onClick,
  target,
  rel,
  ariaLabel,
}: MovingGradientButtonProps) {
  const [scope, animate] = useAnimate()
  const reduceMotion = useReducedMotion()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const el = scope.current
    if (!el) return

    if (reduceMotion) return

    if (mode === 'continuous') {
      const controls = animate(
        el,
        { '--mg-angle': ['0deg', '360deg'] },
        { duration: 3.6, ease: 'linear', repeat: Infinity }
      )
      return () => controls.stop()
    }

    // step mode — band snaps in discrete increments
    let angle = 0
    const tick = () => {
      angle = (angle + STEP_ANGLE) % 360
      animate(el, { '--mg-angle': `${angle}deg` }, { duration: 0.24, ease: 'easeOut' })
    }
    intervalRef.current = setInterval(tick, STEP_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [mode, animate, reduceMotion, scope])

  return (
    <motion.a
      ref={scope}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      data-mg-mode={mode}
      className={`mg-btn mg-btn--${variant}${className ? ` ${className}` : ''}`}
      style={{ '--mg-angle': '0deg', ...style } as CSSProperties}
      whileHover={reduceMotion ? undefined : { scale: 1.025 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
    >
      <span className="mg-btn__border" aria-hidden="true" />
      <span className="mg-btn__sheen" aria-hidden="true" />
      <span className="mg-btn__label">{children}</span>
    </motion.a>
  )
}
