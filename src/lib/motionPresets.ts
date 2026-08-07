/**
 * motionPresets.ts — Reusable Framer Motion animation variants & presets
 * 
 * Lightweight animation configs for BTTSPredict premium feel.
 * All animations use GPU-accelerated properties (transform, opacity) only.
 * Duration kept short for 3G/4G mobile performance.
 * 
 * Usage:
 *   import { fadeInUp, staggerContainer, cardHover } from '@/lib/motionPresets'
 *   <motion.div variants={fadeInUp} initial="hidden" whileInView="visible">
 */

// ─── Easing curves ───
export const EASE = {
  /** Premium ease-out — smooth deceleration, feels "platform-like" */
  premium: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Spring-like — quick bounce settle */
  spring: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  /** Gentle — for subtle micro-interactions */
  gentle: [0.4, 0, 0.2, 1] as [number, number, number, number],
}

// ─── Duration presets (ms → seconds) ───
export const DUR = {
  instant: 0.15,
  fast: 0.25,
  normal: 0.4,
  slow: 0.5,
  reveal: 0.6,
}

// ─── Fade variants ───
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.normal, ease: EASE.premium } },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.normal, ease: EASE.premium } },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.normal, ease: EASE.premium } },
}

export const fadeInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.normal, ease: EASE.premium } },
}

export const fadeInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.normal, ease: EASE.premium } },
}

// ─── Scale variants ───
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: DUR.normal, ease: EASE.premium } },
}

export const scaleInBounce = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { duration: DUR.slow, ease: EASE.spring } },
}

// ─── Blur variants ───
export const blurIn = {
  hidden: { opacity: 0, filter: 'blur(6px)' },
  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: DUR.slow, ease: EASE.premium } },
}

// ─── Stagger container ───
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
      ease: EASE.premium,
    },
  },
}

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
      ease: EASE.premium,
    },
  },
}

// ─── Stagger children (use inside staggerContainer) ───
export const staggerChildFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.normal, ease: EASE.premium } },
}

export const staggerChildScale = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: DUR.normal, ease: EASE.premium } },
}

export const staggerChildSlideLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.normal, ease: EASE.premium } },
}

// ─── Hover effects (use with whileHover/whileTap) ───
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -4, transition: { duration: DUR.fast, ease: EASE.gentle } },
  tap: { scale: 0.97, transition: { duration: DUR.instant } },
}

export const cardHoverLift = {
  rest: { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: { y: -6, boxShadow: '0 12px 40px rgba(168, 162, 158,0.12)', transition: { duration: DUR.fast, ease: EASE.gentle } },
  tap: { y: 0, transition: { duration: DUR.instant } },
}

export const glowHover = {
  rest: { boxShadow: '0 0 0 rgba(168, 162, 158,0)' },
  hover: { boxShadow: '0 0 20px rgba(168, 162, 158,0.2), 0 0 40px rgba(168, 162, 158,0.08)', transition: { duration: DUR.normal, ease: EASE.gentle } },
}

export const subtleHover = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: DUR.fast, ease: EASE.gentle } },
  tap: { scale: 0.96, transition: { duration: DUR.instant } },
}

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, boxShadow: '0 0 16px rgba(168, 162, 158,0.25)', transition: { duration: DUR.fast, ease: EASE.gentle } },
  tap: { scale: 0.95, transition: { duration: DUR.instant } },
}

// ─── Badge pulse (for VIP badges, live indicators) ───
export const badgePulse = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [1, 0.85, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: EASE.gentle,
    },
  },
}

export const badgePulseFast = {
  animate: {
    scale: [1, 1.12, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: EASE.gentle,
    },
  },
}

// ─── Section entrance ───
export const sectionEntrance = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE.premium } },
}

// ─── Modal ───
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.fast } },
  exit: { opacity: 0, transition: { duration: DUR.fast } },
}

export const modalContent = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: DUR.normal, ease: EASE.spring } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: DUR.fast } },
}

// ─── Row animation (for table rows, history items) ───
export const rowReveal = (index: number) => ({
  hidden: { opacity: 0, x: -12 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: DUR.normal, 
      delay: Math.min(index * 0.04, 0.3), 
      ease: EASE.premium 
    } 
  },
})

// ─── Number counter animation config ───
export const counterSpring = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 14,
  mass: 0.8,
}
