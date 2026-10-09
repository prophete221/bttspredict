'use client'

/**
 * Moving Gradient Button — adaptation Originkit (designer brief)
 * Dégradé animé rotatif autour de la bordure + hover animé framer-motion.
 * Garde-fous site : pause IntersectionObserver hors viewport,
 * prefers-reduced-motion → rendu statique, aucune boucle rAF.
 */

import * as React from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { motion, useAnimate, type Transition } from 'framer-motion'

const radiusFromPercent = (w: number, h: number, pct: number) =>
  (Math.min(w, h) / 2) * (Math.max(0, Math.min(100, pct)) / 100)

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

type BandWidths = { top: number; right: number; bottom: number; left: number }

const MAX_BAND_WIDTH = 30

const num = (v: unknown) => {
  const parsed = parseFloat(String(v ?? ''))
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, MAX_BAND_WIDTH)
    : 0
}

const bandWidthsOf = (b: any): BandWidths => {
  const fused = num(b?.borderWidth)
  return {
    top: b?.borderTopWidth !== undefined ? num(b.borderTopWidth) : fused,
    right: b?.borderRightWidth !== undefined ? num(b.borderRightWidth) : fused,
    bottom: b?.borderBottomWidth !== undefined ? num(b.borderBottomWidth) : fused,
    left: b?.borderLeftWidth !== undefined ? num(b.borderLeftWidth) : fused,
  }
}

const borderColorOf = (b: any): string => b?.borderColor ?? 'transparent'

const BAND_MASK: React.CSSProperties = {
  maskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  maskClip: 'border-box, content-box',
  maskComposite: 'exclude',
  WebkitMaskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  WebkitMaskClip: 'border-box, content-box',
  WebkitMaskComposite: 'xor',
} as React.CSSProperties

const DEG_PER_UNIT = 36

const perimeterOf = (w: number, h: number, r: number) => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  return 2 * (w - 2 * rr) + 2 * (h - 2 * rr) + 2 * Math.PI * rr
}

export type MovingGradientButtonProps = {
  label?: string
  href?: string
  onClick?: () => void
  dataCta?: string
  external?: boolean
  rel?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  font?: React.CSSProperties
  padding?: string
  rounded?: number
  colors?: {
    fill?: string
    textColor?: string
    hoverFill?: string
    hoverTextColor?: string
  }
  border?: Record<string, unknown>
  stroke?: {
    headColor?: string
    color?: string
    direction?: 'cw' | 'ccw'
    movement?: 'step' | 'continuous'
    count?: number
    trail?: number
    speed?: number
  }
  transition?: Transition
  icon?: React.ReactNode
}

/* Palette site — macOS noir + bleu analyse + cyan données */
const SITE_DEFAULTS = {
  fill: '#05070B',
  hoverFill: '#0A1017',
  textColor: '#FFFFFF',
  hoverTextColor: '#FFFFFF',
  border: {
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  stroke: {
    headColor: '#45C7F7',
    color: '#2F7DFF',
    direction: 'cw' as const,
    movement: 'step' as const,
    count: 2,
    trail: 72,
    speed: 16,
  },
}

export default function MovingGradientButton(props: MovingGradientButtonProps) {
  const {
    label,
    href,
    onClick,
    dataCta,
    external,
    rel,
    children,
    className,
    style,
    font = {
      fontWeight: 700,
      fontSize: '0.95rem',
      letterSpacing: '0.01em',
    },
    padding = '0.9rem 1.6rem',
    rounded = 100,
    colors = {},
    border = SITE_DEFAULTS.border,
    stroke = SITE_DEFAULTS.stroke,
    transition = {
      type: 'tween',
      ease: 'easeInOut',
      duration: 0.25,
    },
    icon,
  } = props

  const fill = colors?.fill ?? SITE_DEFAULTS.fill
  const textColor = colors?.textColor ?? SITE_DEFAULTS.textColor
  const hoverFill = colors?.hoverFill ?? SITE_DEFAULTS.hoverFill
  const hoverTextColor = colors?.hoverTextColor ?? SITE_DEFAULTS.hoverTextColor

  const {
    headColor: strokeHeadColor = SITE_DEFAULTS.stroke.headColor,
    color: strokeColor = SITE_DEFAULTS.stroke.color,
    direction = 'cw',
    movement = 'step',
    count = 2,
    trail = 72,
    speed: speedPct = 16,
  } = stroke

  const speed = 2 * (Math.max(0, Math.min(100, Math.round(speedPct))) / 50)

  const [scope, animate] = useAnimate()

  const [radiusBox, setRadiusBox] = useState({ w: 0, h: 0 })
  useIsoLayoutEffect(() => {
    const el = scope.current as HTMLElement | null
    if (!el) return
    const read = () =>
      setRadiusBox((prev) =>
        prev.w === el.offsetWidth && prev.h === el.offsetHeight
          ? prev
          : { w: el.offsetWidth, h: el.offsetHeight }
      )
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [scope])
  const radiusPx = radiusFromPercent(radiusBox.w, radiusBox.h, rounded)

  const glowRef = useRef<HTMLDivElement | null>(null)
  const coverRef = useRef<HTMLDivElement | null>(null)
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const [side, setSide] = useState(0)
  const [box, setBox] = useState({ w: 0, h: 0 })

  const hovered = useRef(false)
  const focused = useRef(false)
  const lit = useRef(false)
  const visible = useRef(true)

  const live = useRef({ degPerSec: 0, sign: 1 })
  useEffect(() => {
    live.current.sign = direction === 'ccw' ? -1 : 1
    live.current.degPerSec = Math.max(0, speed) * DEG_PER_UNIT * live.current.sign
  }, [direction, speed])

  const reducedMotion = useSyncExternalStore(
    React.useCallback((cb: () => void) => {
      try {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        mq.addEventListener('change', cb)
        return () => mq.removeEventListener('change', cb)
      } catch {
        return () => undefined
      }
    }, []),
    () => {
      try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      } catch {
        return false
      }
    },
    () => false
  )

  useEffect(() => {
    const el = scope.current as HTMLElement | null
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      setSide(Math.ceil(Math.hypot(w, h) * 1.02))
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [scope])

  /* Pause hors viewport — un seul bouton animé à la fois */
  useEffect(() => {
    const el = scope.current as HTMLElement | null
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [scope])

  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    let last = 0
    let angle = 0
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible.current) {
        last = t
        return
      }
      if (!last) last = t
      const dt = (t - last) / 1000
      last = t
      angle = (angle + live.current.degPerSec * dt) % 360
      const g = glowRef.current
      if (g) g.style.transform = `rotate(${angle}deg)`
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  const paint = useCallback(
    (want: boolean, instant: boolean) => {
      const t: any = instant ? { duration: 0 } : transition
      if (scope.current)
        animate(scope.current, { backgroundColor: want ? hoverFill : fill } as any, t)
      if (coverRef.current)
        animate(coverRef.current, { opacity: want ? 1 : 0 } as any, t)
      if (labelRef.current)
        animate(
          labelRef.current,
          { color: want ? hoverTextColor : textColor } as any,
          t
        )
    },
    [animate, scope, transition, fill, hoverFill, textColor, hoverTextColor]
  )

  const sync = useCallback(() => {
    const want = hovered.current || focused.current
    if (want === lit.current) return
    lit.current = want
    paint(want, false)
  }, [paint])

  useEffect(() => {
    paint(lit.current, true)
  }, [paint])

  const onPointerEnter = useCallback(() => {
    hovered.current = true
    sync()
  }, [sync])

  const onPointerLeave = useCallback(() => {
    hovered.current = false
    sync()
  }, [sync])

  const onFocus = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      let visibleFocus = true
      try {
        visibleFocus = e.currentTarget.matches(':focus-visible')
      } catch {
        /* no-op */
      }
      if (!visibleFocus) return
      focused.current = true
      sync()
    },
    [sync]
  )

  const onBlur = useCallback(() => {
    focused.current = false
    sync()
  }, [sync])

  const n = Math.max(1, Math.round(count))
  const period = 360 / n
  const tailDeg = Math.max(0.5, (period * Math.max(0, Math.min(100, trail))) / 100)
  const knee = (tailDeg * 0.45).toFixed(2)
  const gradient =
    direction === 'cw'
      ? `repeating-conic-gradient(from 0deg, transparent 0deg, transparent ${(period - tailDeg).toFixed(2)}deg, ${strokeColor} ${(period - tailDeg * 0.45).toFixed(2)}deg, ${strokeHeadColor} ${period.toFixed(2)}deg)`
      : `repeating-conic-gradient(from 0deg, ${strokeHeadColor} 0deg, ${strokeColor} ${knee}deg, transparent ${tailDeg.toFixed(2)}deg, transparent ${period.toFixed(2)}deg)`

  const perimeter = perimeterOf(box.w, box.h, radiusPx)
  void perimeter

  const coverGradient = `conic-gradient(from 0deg, ${strokeColor}, ${strokeHeadColor}, ${strokeColor}, ${strokeHeadColor}, ${strokeColor})`

  const band = bandWidthsOf(border)
  const bandPadding = `${band.top}px ${band.right}px ${band.bottom}px ${band.left}px`
  const fontStyles = (font ?? {}) as React.CSSProperties
  const isLink = typeof href === 'string' && href.length > 0
  const Root: any = isLink ? motion.a : motion.button
  const rootProps = {
    'data-cta': dataCta || undefined,
    onClick,
    ...(isLink
      ? {
          href,
          target: external ? '_blank' : undefined,
          rel: rel || (external ? 'noopener noreferrer' : undefined),
        }
      : { type: 'button' }),
  }

  return (
    <Root
      ref={scope}
      {...rootProps}
      className={className}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 10 : 0,
        padding,
        borderRadius: radiusPx,
        border: 'none',
        backgroundColor: fill,
        cursor: 'pointer',
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          boxSizing: 'border-box',
          padding: bandPadding,
          borderRadius: radiusPx,
          zIndex: 0,
          pointerEvents: 'none',
          ...BAND_MASK,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: borderColorOf(border),
          }}
        />

        {!reducedMotion && (
          <div
            ref={glowRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: side,
              height: side,
              marginTop: -side / 2,
              marginLeft: -side / 2,
              background: gradient,
            }}
          />
        )}

        <div
          ref={coverRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: coverGradient,
            opacity: 0,
          }}
        />
      </div>

      {icon}

      {children != null ? (
        <span
          ref={labelRef}
          style={{
            position: 'relative',
            zIndex: 1,
            color: textColor,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            ...fontStyles,
          }}
        >
          {children}
        </span>
      ) : (
        <span
          ref={labelRef}
          style={{
            position: 'relative',
            zIndex: 1,
            color: textColor,
            whiteSpace: 'nowrap',
            ...fontStyles,
          }}
        >
          {label}
        </span>
      )}
    </Root>
  )
}
