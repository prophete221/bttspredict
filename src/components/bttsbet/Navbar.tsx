'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE, AFFILIATE } from '@/lib/constants'

const DESKTOP_LINKS = NAV_LINKS.filter(
  (l) => l.scrollTarget && l.label !== 'Accueil' && l.label !== 'FAQ'
)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const copyCode = useCallback(async () => {
    try { await navigator.clipboard.writeText(SITE.promoCode) } catch {}
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }

  const scrollToSection = (id: string) => {
    closeMenu()
    // Si on n'est pas sur la page d'accueil, rediriger vers l'accueil + section
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => window.scrollBy({ top: -56, behavior: 'smooth' }), 400)
    }
  }

  const handleHomeClick = () => {
    closeMenu()
    if (window.location.pathname !== '/') {
      window.location.href = '/'
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#0D1117',
        borderBottom: '1px solid rgba(0, 196, 154, 0.15)',
      }}
    >
      <div className="max-w-[440px] sm:max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Logo — ballon de foot */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleHomeClick() }}
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="BTTSPredict — Accueil"
          >
            {/* Ballon de foot SVG */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#0D1117" stroke="#00C49A" strokeWidth="1.5"/>
              {/* Hexagone central */}
              <path d="M16 7 L20 10 L18.5 15 L13.5 15 L12 10 Z" fill="#00C49A" opacity="0.9"/>
              {/* Pentagones autour */}
              <path d="M16 7 L13 3.5 L19 3.5 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M20 10 L24.5 8 L23 13 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M18.5 15 L22 18.5 L17 20 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M13.5 15 L10 18.5 L15 20 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M12 10 L7.5 8 L9 13 Z" fill="#00C49A" opacity="0.7"/>
              {/* Lignes */}
              <line x1="16" y1="7" x2="16" y2="3.5" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="20" y1="10" x2="24.5" y2="8" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="18.5" y1="15" x2="22" y2="18.5" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="13.5" y1="15" x2="10" y2="18.5" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="12" y1="10" x2="7.5" y2="8" stroke="#00C49A" strokeWidth="0.5"/>
            </svg>
            <span className="text-base font-bold tracking-tight" style={{ color: '#00C49A' }}>
              BTTSPredict
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            {DESKTOP_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.scrollTarget!)}
                className="text-sm font-medium transition-colors"
                style={{ color: '#F0F2F5' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00DDB0'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#F0F2F5'}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Promo code */}
            <button
              onClick={copyCode}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors"
              style={{
                backgroundColor: 'rgba(0, 196, 154, 0.12)',
                border: '1px solid #00C49A',
                color: '#00A882',
              }}
            >
              {copied ? '✓' : SITE.promoCode}
            </button>

            {/* CTA Desktop */}
            <button
              onClick={() => scrollToSection('free-predictions')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-sm font-bold transition-colors"
              style={{
                backgroundColor: '#00C49A',
                color: '#F0F2F5',
                border: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00DDB0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00C49A'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Pronos du jour
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ background: '#161B22' }}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
                {isOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: '#0D1117', borderTop: '1px solid rgba(0, 196, 154, 0.2)' }}
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.href) {
                      handleHomeClick()
                    } else if (link.scrollTarget) {
                      scrollToSection(link.scrollTarget)
                    }
                  }}
                  className="block w-full text-left py-3 px-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: '#F0F2F5' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 196, 154, 0.08)'; e.currentTarget.style.color = '#00DDB0' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#F0F2F5' }}
                >
                  {link.label}
                </button>
              ))}

              {/* Bookmaker buttons */}
              <div className="pt-3 grid grid-cols-2 gap-2">
                <a href={AFFILIATE.linebet} rel="sponsored noopener" target="_blank" onClick={closeMenu}
                  className="flex items-center justify-center px-3 py-2.5 rounded-[8px] text-xs font-bold transition-colors"
                  style={{ backgroundColor: '#00C49A', color: '#F0F2F5', border: 'none' }}>
                  Linebet
                </a>
                <a href={AFFILIATE.star888} rel="sponsored noopener" target="_blank" onClick={closeMenu}
                  className="flex items-center justify-center px-3 py-2.5 rounded-[8px] text-xs font-bold transition-colors"
                  style={{ backgroundColor: '#FFD700', color: '#0D1117', border: 'none' }}>
                  888starz
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
