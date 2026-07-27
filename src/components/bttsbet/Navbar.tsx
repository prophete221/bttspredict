'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE, AFFILIATE } from '@/lib/constants'
import { buttonHover, subtleHover, modalBackdrop, modalContent } from '@/lib/motionPresets'
import LanguageSwitcher from './LanguageSwitcher'

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => window.scrollBy({ top: -72, behavior: 'smooth' }), 400)
  }
}

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
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = SITE.promoCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleNavClick = useCallback(
    (e: React.MouseEvent, link: (typeof NAV_LINKS)[0]) => {
      if (link.scrollTarget) {
        e.preventDefault()
        scrollToSection(link.scrollTarget)
      }
      setIsOpen(false)
    },
    []
  )

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsOpen(false)
  }, [])

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className={`sticky top-0 z-50 transition-all duration-300 nav-premium ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group shrink-0"
            aria-label="BttsBet — Retour en haut"
          >
            <div className="w-9 h-9 rounded-lg bg-brand border border-success/30 flex items-center justify-center group-hover:border-success/60 transition-colors">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1DB954"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 4 4 5-5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {SITE.name} <span className="text-success">AI</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {DESKTOP_LINKS.map((link) =>
              link.highlight ? (
                <a
                  key={link.label}
                  href={`#${link.scrollTarget}`}
                  onClick={(e) => handleNavClick(e, link)}
                  className="px-4 py-1.5 btn-ghost-quantum text-sm"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={`#${link.scrollTarget}`}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium px-3 py-1.5"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Promo Code Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              variants={subtleHover}
              whileHover="hover"
              whileTap="tap"
              style={{ willChange: 'transform, opacity' }}
              className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 min-h-[44px] rounded-full border border-gold/20 bg-gold/[0.04] cursor-pointer hover:bg-gold/[0.08] hover:border-gold/40 transition-all select-none"
              onClick={copyCode}
              role="button"
              tabIndex={0}
              aria-label={`Copier le code promo ${SITE.promoCode}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  copyCode()
                }
              }}
            >
              <span className="promo-code-shimmer text-[11px] sm:text-sm font-bold tracking-wide">
                {copied ? '✓' : SITE.promoCode}
              </span>
            </motion.div>

            {/* CTA — Desktop */}
            <motion.a
              href={AFFILIATE.linebet}
              rel={AFFILIATE.rel}
              target="_blank"
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              style={{ willChange: 'transform, opacity' }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 btn-linebet cta-glow text-[#04150C] text-sm font-bold"
            >
              <img
                src="/logos/linebet-icon.svg"
                alt="Linebet"
                className="w-4 h-4 rounded object-contain flex-shrink-0"
                loading="lazy"
              />
              S&apos;inscrire
            </motion.a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            id="mobile-menu"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden bg-midnight/98 border-t border-edge/40 backdrop-blur-lg overflow-hidden"
            role="menu"
          >
            <div className="px-4 py-5 space-y-1 max-h-[80vh] overflow-y-auto">
              {NAV_LINKS.map((link) =>
                link.highlight ? (
                  <a
                    key={link.label}
                    href={link.href || `#${link.scrollTarget}`}
                    onClick={(e) => handleNavClick(e, link)}
                    className="block text-center py-3 px-3 btn-ghost-quantum text-sm"
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href || `#${link.scrollTarget}`}
                    onClick={(e) => handleNavClick(e, link)}
                    className="block text-gray-300 hover:text-white transition-colors font-medium py-3 px-3 rounded-lg hover:bg-white/[0.03]"
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                )
              )}

              {/* Promo code — mobile */}
              <div className="pt-4 pb-2">
                <div
                  className="flex items-center justify-center gap-3 px-4 py-3 min-h-[44px] rounded-xl border border-gold/20 bg-gold/[0.04] cursor-pointer hover:bg-gold/[0.08] transition-all"
                  onClick={copyCode}
                  role="button"
                  tabIndex={0}
                  aria-label={`Copier le code promo ${SITE.promoCode}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      copyCode()
                    }
                  }}
                >
                  <span className="promo-code-shimmer text-sm font-bold tracking-wide">
                    {copied ? 'Copié ✓' : SITE.promoCode}
                  </span>
                  <span className="text-xs text-gold/50 ml-1">
                    Appuyez pour copier
                  </span>
                </div>
              </div>

              {/* Bookmaker buttons — mobile, compact pills */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <a
                  href={AFFILIATE.linebet}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 text-center px-3 py-2.5 min-h-[44px] btn-linebet cta-glow text-[#04150C] text-[11px] font-bold"
                  role="menuitem"
                >
                  <img src="/logos/linebet-icon.svg" alt="Linebet" className="w-3.5 h-3.5 rounded object-contain flex-shrink-0" loading="lazy" />
                  Linebet
                </a>
                <a
                  href={AFFILIATE.star888}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 text-center px-3 py-2.5 min-h-[44px] btn-star888 cta-glow text-white text-[11px] font-bold"
                  role="menuitem"
                >
                  <img src="/logos/888starz-icon.svg" alt="888starz" className="w-3.5 h-3.5 rounded object-contain flex-shrink-0" loading="lazy" />
                  888starz
                </a>
                <a
                  href={AFFILIATE.linebetDownload}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 text-center px-3 py-2.5 min-h-[44px] border border-edge text-white font-semibold text-[11px] bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-full"
                  role="menuitem"
                >
                  <img src="/logos/android.svg" alt="Android" className="w-3.5 h-3.5 object-contain flex-shrink-0" loading="lazy" />
                  APK Linebet
                </a>
                <a
                  href={AFFILIATE.star888Download}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 text-center px-3 py-2.5 min-h-[44px] border border-edge text-white font-semibold text-[11px] bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-full"
                  role="menuitem"
                >
                  <img src="/logos/android.svg" alt="Android" className="w-3.5 h-3.5 object-contain flex-shrink-0" loading="lazy" />
                  APK 888starz
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
