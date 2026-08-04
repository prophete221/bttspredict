'use client'

import { useState, useEffect } from 'react'
import { SITE, AFFILIATE } from '@/lib/constants'

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
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'glass-card shadow-lg' : 'bg-transparent'}`}
      style={{ borderBottom: scrolled ? '1px solid var(--color-glass-border)' : '1px solid transparent' }}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-gold-champagne)] to-[var(--color-gold-dark)] shadow-lg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#05070A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-emerald-vip)] rounded-full border-2 border-[var(--color-void)]"/>
          </div>
          <div className="leading-none">
            <div className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">BttsPredict</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold-champagne)] font-medium">Intelligence Artificielle</div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#pronos" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors relative group">
            Pronostics
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-gold-champagne)] transition-all group-hover:w-full"/>
          </a>
          <a href="#resultats" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors relative group">
            Résultats
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-gold-champagne)] transition-all group-hover:w-full"/>
          </a>
          <a href="#vip" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors relative group flex items-center gap-1.5">
            VIP
            <span className="text-[8px] text-[var(--color-gold-champagne)]">◆</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-gold-champagne)] transition-all group-hover:w-full"/>
          </a>
          <a href="/historique" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors relative group">
            Historique
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-gold-champagne)] transition-all group-hover:w-full"/>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button onClick={copyCode}
            className="group relative px-4 py-2 rounded-lg text-sm font-semibold font-mono transition-all overflow-hidden"
            style={{ 
              background: 'var(--color-carbon)', 
              border: '1px solid var(--color-pewter)',
              color: copied ? 'var(--color-emerald-vip)' : 'var(--color-gold-champagne)'
            }}>
            <span className="relative z-10">{copied ? '✓ Copié' : `CODE: ${SITE.promoCode}`}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-champagne)] to-[var(--color-gold-light)] opacity-0 group-hover:opacity-10 transition-opacity"/>
          </button>
          <a href={AFFILIATE.linebet} target="_blank" rel="sponsored noopener"
            className="btn-premium hidden sm:flex">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Bonus Linebet
          </a>
        </div>
      </div>
    </nav>
  )
}
