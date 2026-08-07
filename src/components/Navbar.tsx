'use client'

import { useState, useEffect } from 'react'
import { SITE, AFFILIATE } from '@/lib/constants'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[var(--color-dark-700)]/95 backdrop-blur-xl border-b border-[var(--color-card-border)] shadow-xl' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#1F8A70] flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-success)] rounded-full border-2 border-[var(--color-dark-700)] animate-pulse"/>
            </div>
            <div>
              <div className="font-[var(--font-display)] text-xl font-bold text-white leading-tight">BttsPredict</div>
              <div className="text-[10px] font-semibold text-[var(--color-primary-light)] tracking-wider">IA PRONOSTICS</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { href: '#pronos', label: 'Pronostics' },
              { href: '#resultats', label: 'Résultats' },
              { href: '#vip', label: 'VIP' },
              { href: '#statistiques', label: 'Stats' },
              { href: '/historique', label: 'Historique' },
            ].map((item) => (
              <a 
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={copyCode}
              className="group relative px-3 py-2 rounded-lg text-xs font-bold font-mono transition-all"
              style={{ 
                background: copied ? 'var(--color-success)' : 'rgba(168, 162, 158, 0.15)',
                border: '1px solid',
                borderColor: copied ? 'var(--color-success)' : 'var(--color-primary)',
                color: copied ? 'white' : 'var(--color-primary-light)'
              }}
            >
              {copied ? '✓ Copié!' : SITE.promoCode}
            </button>
            
            <a 
              href={AFFILIATE.linebet} 
              target="_blank" 
              rel="sponsored noopener"
              className="hidden sm:flex btn btn-accent text-sm px-5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Bonus 90K XOF
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1 p-2 bg-[var(--color-dark-700)] rounded-xl border border-[var(--color-card-border)]">
              {[
                { href: '#pronos', label: 'Pronostics' },
                { href: '#resultats', label: 'Résultats' },
                { href: '#vip', label: 'VIP' },
                { href: '#statistiques', label: 'Stats' },
                { href: '/historique', label: 'Historique' },
              ].map((item) => (
                <a 
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 border-t border-[var(--color-card-border)]">
                <a 
                  href={AFFILIATE.linebet} 
                  target="_blank" 
                  rel="sponsored noopener"
                  className="btn btn-accent w-full justify-center"
                >
                  Bonus 90K XOF
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
