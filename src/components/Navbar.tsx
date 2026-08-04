'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SITE } from '@/lib/constants'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(SITE.promoCode) } catch {}
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-card' : ''}`}
      style={{ borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--grad-primary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5">
              <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
            </svg>
          </div>
          <div className="leading-none">
            <div className="font-bold text-lg text-white">BTTSPredict</div>
            <div className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]">IA BTTS</div>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#pronos" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Pronostics</a>
          <a href="#resultats" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Résultats</a>
          <a href="#vip" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">VIP</a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          <button onClick={copyCode}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all"
            style={{ background: 'var(--color-neon-dim)', border: '1px solid rgba(0,255,136,0.2)', color: 'var(--color-neon)' }}>
            {copied ? '✓ Copié' : SITE.promoCode}
          </button>
          <a href={SITE.affiliate} target="_blank" rel="sponsored noopener"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'var(--grad-primary)', color: '#0a0a0a', boxShadow: 'var(--shadow-cta)' }}>
            S'inscrire
          </a>
        </div>
      </div>
    </nav>
  )
}
