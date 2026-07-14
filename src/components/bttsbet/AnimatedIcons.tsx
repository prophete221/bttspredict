'use client'

import { motion } from 'framer-motion'

/* ═══════════════════════════════════════════════════════════════
   AnimatedIcons — Animated SVG icons for section headers
   Each icon has a unique animation: spin, pulse, orbit, float, etc.
   ═══════════════════════════════════════════════════════════════ */

// ─── 3D Spinning Football ───
export function Football3D({ size = 56, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-spin-3d" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#FF6B2B" opacity="0.15" />
          <circle cx="32" cy="32" r="28" stroke="#FF6B2B" strokeWidth="1.5" fill="none" opacity="0.6" />
          {/* Pentagon patches */}
          <polygon points="32,10 38,16 36,24 28,24 26,16" fill="#FF6B2B" opacity="0.3" />
          <polygon points="50,28 48,36 42,32 42,24 48,22" fill="#FF6B2B" opacity="0.25" />
          <polygon points="14,28 16,36 22,32 22,24 16,22" fill="#FF6B2B" opacity="0.25" />
          <polygon points="24,44 30,48 30,54 24,52 20,46" fill="#FF6B2B" opacity="0.2" />
          <polygon points="40,44 34,48 34,54 40,52 44,46" fill="#FF6B2B" opacity="0.2" />
          {/* Seam lines */}
          <path d="M32 4 L32 60" stroke="#FF6B2B" strokeWidth="0.5" opacity="0.15" />
          <path d="M4 32 L60 32" stroke="#FF6B2B" strokeWidth="0.5" opacity="0.15" />
        </svg>
      </div>
      {/* Orbit ring */}
      <div className="gradient-orbit-ring absolute inset-[-8px]"
        style={{ '--orbit-duration': '6s', '--orbit-dot-color': '#FF6B2B' } as React.CSSProperties} />
    </div>
  )
}

// ─── AI Brain with pulsing ───
export function AIBrain({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-pulse-scale" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#22D3EE" strokeWidth="1" opacity="0.2" />
          {/* Brain shape */}
          <path d="M16 28c0-6 3-10 8-12 5 2 8 6 8 12" stroke="#22D3EE" strokeWidth="1.5" fill="none" />
          <path d="M16 28c-2-1-3-4-2-7s4-5 6-5" stroke="#22D3EE" strokeWidth="1.5" fill="none" />
          <path d="M32 28c2-1 3-4 2-7s-4-5-6-5" stroke="#22D3EE" strokeWidth="1.5" fill="none" />
          <path d="M20 20c1-3 3-5 4-6" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
          <path d="M28 20c-1-3-3-5-4-6" stroke="#22D3EE" strokeWidth="1" opacity="0.5" />
          {/* Neural connections */}
          <circle cx="20" cy="22" r="1.5" fill="#22D3EE" opacity="0.8" />
          <circle cx="28" cy="22" r="1.5" fill="#22D3EE" opacity="0.8" />
          <circle cx="24" cy="26" r="1.5" fill="#22D3EE" opacity="0.6" />
          <line x1="20" y1="22" x2="24" y2="26" stroke="#22D3EE" strokeWidth="0.5" opacity="0.4" />
          <line x1="28" y1="22" x2="24" y2="26" stroke="#22D3EE" strokeWidth="0.5" opacity="0.4" />
          <line x1="20" y1="22" x2="28" y2="22" stroke="#22D3EE" strokeWidth="0.5" opacity="0.3" />
          {/* Sparkle */}
          <circle cx="24" cy="14" r="1" fill="#FACC15" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  )
}

// ─── Aviator Rocket ───
export function RocketIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-rocket" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Flame trail */}
          <path d="M20 38 L24 48 L28 38" fill="#FACC15" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="0.5s" repeatCount="indefinite" />
          </path>
          <path d="M22 38 L24 44 L26 38" fill="#FF6B2B" opacity="0.7">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.3s" repeatCount="indefinite" />
          </path>
          {/* Rocket body */}
          <path d="M24 6 C20 14 18 24 18 32 L30 32 C30 24 28 14 24 6Z" fill="#FACC15" opacity="0.2" stroke="#FACC15" strokeWidth="1.5" />
          {/* Window */}
          <circle cx="24" cy="20" r="3" fill="#22D3EE" opacity="0.5" stroke="#22D3EE" strokeWidth="1" />
          {/* Fins */}
          <path d="M18 28 L12 34 L18 32Z" fill="#FACC15" opacity="0.3" />
          <path d="M30 28 L36 34 L30 32Z" fill="#FACC15" opacity="0.3" />
          {/* Stars */}
          <circle cx="10" cy="12" r="1" fill="#FACC15" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="38" cy="16" r="0.8" fill="#22D3EE" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="36" cy="8" r="0.6" fill="#FF6B2B" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      {/* Particles behind rocket */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold/60 animate-particle-1" />
      <div className="absolute bottom-0 left-1/3 w-0.5 h-0.5 rounded-full bg-emerald/40 animate-particle-2" style={{ animationDelay: '0.5s' }} />
    </div>
  )
}

// ─── Crown VIP ───
export function CrownIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-float-drift" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Crown */}
          <path d="M8 32 L14 16 L20 24 L24 12 L28 24 L34 16 L40 32Z" fill="#FACC15" opacity="0.15" stroke="#FACC15" strokeWidth="1.5" />
          {/* Crown band */}
          <rect x="8" y="32" width="32" height="4" rx="1" fill="#FACC15" opacity="0.2" stroke="#FACC15" strokeWidth="1" />
          {/* Jewels */}
          <circle cx="16" cy="30" r="2" fill="#FF6B2B" opacity="0.7">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="24" cy="28" r="2" fill="#22D3EE" opacity="0.7">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="32" cy="30" r="2" fill="#4ADE80" opacity="0.7">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Sparkle top */}
          <path d="M24 8 L25 11 L28 10 L26 12 L27 15 L24 13 L21 15 L22 12 L20 10 L23 11Z" fill="#FACC15" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" values="0 24 12;360 24 12" dur="8s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
    </div>
  )
}

// ─── FIFA Controller ───
export function GameController({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-wiggle" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Controller body */}
          <rect x="8" y="18" width="32" height="18" rx="8" fill="#EF4444" opacity="0.12" stroke="#EF4444" strokeWidth="1.5" />
          {/* D-pad */}
          <rect x="14" y="23" width="3" height="8" rx="1" fill="#EF4444" opacity="0.4" />
          <rect x="11" y="26" width="8" height="3" rx="1" fill="#EF4444" opacity="0.4" />
          {/* Buttons */}
          <circle cx="32" cy="24" r="2" fill="#22D3EE" opacity="0.5" />
          <circle cx="36" cy="27" r="2" fill="#FACC15" opacity="0.5" />
          <circle cx="28" cy="27" r="2" fill="#4ADE80" opacity="0.5" />
          <circle cx="32" cy="30" r="2" fill="#FF6B2B" opacity="0.5" />
          {/* Antenna / signal */}
          <path d="M24 18 L24 12" stroke="#EF4444" strokeWidth="1" opacity="0.3" />
          <path d="M20 14 Q24 8 28 14" stroke="#EF4444" strokeWidth="0.8" fill="none" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M16 12 Q24 4 32 12" stroke="#EF4444" strokeWidth="0.8" fill="none" opacity="0.15">
            <animate attributeName="opacity" values="0.05;0.3;0.05" dur="2.5s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
    </div>
  )
}

// ─── Stats/Chart icon ───
export function StatsIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Chart bars with animation */}
          <rect x="8" y="28" width="6" height="12" rx="1" fill="#4ADE80" opacity="0.3">
            <animate attributeName="height" values="8;12;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y" values="32;28;32" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="17" y="20" width="6" height="20" rx="1" fill="#FF6B2B" opacity="0.3">
            <animate attributeName="height" values="14;20;14" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="y" values="26;20;26" dur="3.5s" repeatCount="indefinite" />
          </rect>
          <rect x="26" y="14" width="6" height="26" rx="1" fill="#FACC15" opacity="0.3">
            <animate attributeName="height" values="18;26;18" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="22;14;22" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="35" y="8" width="6" height="32" rx="1" fill="#22D3EE" opacity="0.3">
            <animate attributeName="height" values="24;32;24" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="y" values="16;8;16" dur="3.2s" repeatCount="indefinite" />
          </rect>
          {/* Trend line */}
          <polyline points="11,26 20,18 29,12 38,6" stroke="#4ADE80" strokeWidth="1.5" fill="none" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </polyline>
          {/* Arrow tip */}
          <path d="M36 4 L40 6 L36 8" stroke="#4ADE80" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}

// ─── Trophy/Winner icon ───
export function TrophyIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="animate-pulse-scale" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Trophy cup */}
          <path d="M14 12 L14 24 C14 30 19 34 24 34 C29 34 34 30 34 24 L34 12Z" fill="#FACC15" opacity="0.15" stroke="#FACC15" strokeWidth="1.5" />
          {/* Handles */}
          <path d="M14 16 C8 16 6 22 10 26 C12 28 14 26 14 24" stroke="#FACC15" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M34 16 C40 16 42 22 38 26 C36 28 34 26 34 24" stroke="#FACC15" strokeWidth="1.5" fill="none" opacity="0.4" />
          {/* Stem */}
          <rect x="22" y="34" width="4" height="4" fill="#FACC15" opacity="0.3" />
          {/* Base */}
          <rect x="16" y="38" width="16" height="3" rx="1.5" fill="#FACC15" opacity="0.3" />
          {/* Star */}
          <polygon points="24,16 25.5,20 30,20 26.5,23 27.5,27 24,24.5 20.5,27 21.5,23 18,20 22.5,20" fill="#FACC15" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
          </polygon>
        </svg>
      </div>
    </div>
  )
}

// ─── Section Icon Wrapper (container with orbit + glow) ───
export function SectionIcon({ children, color = '#FF6B2B', size = 56 }: {
  children: React.ReactNode
  color?: string
  size?: number
}) {
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-full animate-icon-glow"
        style={{
          background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
          '--glow-color': `${color}30`,
        } as React.CSSProperties}
      />
      {/* Orbit ring */}
      <div
        className="gradient-orbit-ring absolute"
        style={{
          inset: '-6px',
          '--orbit-duration': '7s',
          '--orbit-dot-color': color,
        } as React.CSSProperties}
      />
      {/* Icon content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// ─── Floating Particles Background ───
export function FloatingParticles({ count = 12, className = '' }: { count?: number; className?: string }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const colors = ['#FF6B2B', '#22D3EE', '#FACC15', '#4ADE80']
    const color = colors[i % colors.length]
    const size = 2 + (i % 3) * 1.5
    const left = ((i * 37 + 13) % 100)
    const top = ((i * 53 + 7) % 90) + 5
    const animClass = ['animate-particle-1', 'animate-particle-2', 'animate-particle-3'][i % 3]
    const delay = (i * 0.7) % 4

    return (
      <div
        key={i}
        className={`absolute rounded-full ${animClass}`}
        style={{
          width: size,
          height: size,
          left: `${left}%`,
          top: `${top}%`,
          backgroundColor: color,
          opacity: 0.3,
          animationDelay: `${delay}s`,
          animationDuration: `${3 + (i % 3) * 1.5}s`,
        } as React.CSSProperties}
      />
    )
  })

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles}
    </div>
  )
}

// ─── Animated Section Header ───
export function AnimatedSectionHeader({
  icon,
  label,
  title,
  titleAccent,
  subtitle,
  labelColor = 'text-emerald',
  accentColor = 'text-emerald',
}: {
  icon: React.ReactNode
  label: string
  title: string
  titleAccent?: string
  subtitle?: string
  labelColor?: string
  accentColor?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <span className={`text-[10px] font-bold ${labelColor} uppercase tracking-[0.15em]`}>{label}</span>
      <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 tracking-tight">
        {title} {titleAccent && <span className={accentColor}>{titleAccent}</span>}
      </h2>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </motion.div>
  )
}
