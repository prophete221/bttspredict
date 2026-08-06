'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE, AFFILIATE } from '@/lib/constants'
import LanguageSwitcher from './LanguageSwitcher'

const DESKTOP_LINKS = NAV_LINKS.filter(
  (l) => l.scrollTarget && l.label !== 'Accueil' && l.label !== 'FAQ'
)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const scrollToSection = (id: string) => {
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
    setIsOpen(false)
  }

  const handleHomeClick = () => {
    if (window.location.pathname !== '/') {
      window.location.href = '/'
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsOpen(false)
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
          {/* Logo — vert #00C49A */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); handleHomeClick() }}
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="BTTSPredict — Accueil"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00C49A' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0F2F5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight" style={{ color: '#00C49A' }}>
              BTTSPredict
            </span>
          </a>

          {/* Desktop links — texte blanc, hover vert secondaire */}
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
            {/* Promo code — compact */}
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

            {/* CTA — Desktop only : Voir les pronostics du jour (vert #00C49A) */}
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
            style={{ backgroundColor: '#0D1117', borderTop: '1px solid #A8B3C2' }}
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
                <a href={AFFILIATE.linebet} rel="sponsored noopener" target="_blank"
                  className="flex items-center justify-center px-3 py-2.5 rounded-[8px] text-xs font-bold transition-colors"
                  style={{ backgroundColor: '#00C49A', color: '#F0F2F5', border: 'none' }}>
                  Linebet
                </a>
                <a href={AFFILIATE.star888} rel="sponsored noopener" target="_blank"
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
