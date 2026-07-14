'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE, AFFILIATE } from '@/lib/constants'

// ── Smooth scroll to a section ID with navbar offset ──────────────────
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => window.scrollBy({ top: -72, behavior: 'smooth' }), 400)
  }
}

// ── Desktop-only nav items (Accueil excluded — logo handles that) ──────
const DESKTOP_LINKS = NAV_LINKS.filter(
  (l) => l.scrollTarget && l.label !== 'Accueil' && l.label !== 'FAQ'
)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [copied, setCopied] = useState(false)

  // ── Scroll listener for glass effect ─────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Lock body scroll when mobile menu is open ────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Copy promo code with visual feedback ─────────────────────────────
  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
    } catch {
      // Fallback for insecure contexts
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

  // ── Nav link click handler ───────────────────────────────────────────
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

  // ── Logo click → scroll to top ───────────────────────────────────────
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsOpen(false)
  }, [])

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/40 border-b border-white/[0.04]'
          : 'bg-transparent'
      }`}
    >
      {/* ── Main bar ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* ── Logo ──────────────────────────────────────────────────── */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="BttsBet — Retour en haut"
          >
            {/* Globe SVG icon */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-ultra/25 to-ultra/5 border border-ultra/20 flex items-center justify-center group-hover:border-ultra/40 transition-all group-hover:shadow-lg group-hover:shadow-ultra/20">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors group-hover:stroke-emerald-soft"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <div className="absolute inset-0 rounded-xl bg-ultra/0 group-hover:bg-ultra/5 transition-colors" />
            </div>
            <span className="text-xl font-extrabold text-white group-hover:text-ultra transition-colors tracking-tight">
              {SITE.name}
            </span>
          </a>

          {/* ── Desktop nav links ─────────────────────────────────────── */}
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
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium relative group px-3 py-1.5"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-gradient-to-r from-emerald to-emerald-soft scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </a>
              )
            )}
          </div>

          {/* ── Right section: Promo Pill + CTA + Hamburger ───────────── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Promo Code Pill — ALWAYS visible in navbar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-gold/30 bg-gold/[0.08] cursor-pointer hover:bg-gold/[0.14] hover:border-gold/50 transition-all select-none"
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
              {/* Small gift/tag icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FACC15"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 hidden sm:block"
              >
                <path d="M20 12v10H4V12" />
                <path d="M2 12h20" />
                <path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z" />
                <path d="M12 2v8" />
              </svg>
              <span className="promo-code-shimmer text-xs sm:text-sm font-bold tracking-wide">
                {copied ? 'COPIÉ ✓' : SITE.promoCode}
              </span>
              {/* Copy icon */}
              {!copied && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              {/* Check icon when copied */}
              {copied && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </motion.div>

            {/* CTA Button — Desktop only */}
            <a
              href={AFFILIATE.linebet}
              rel={AFFILIATE.rel}
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 btn-linebet text-[#04150C] text-sm font-bold"
            >
              <img
                src="/logos/linebet-icon.svg"
                alt="Linebet"
                className="w-5 h-5 rounded object-contain flex-shrink-0"
                loading="lazy"
              />
              S&apos;inscrire
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-2 -mr-2"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden glass-strong border-t border-white/5 overflow-hidden"
            role="menu"
          >
            <div className="px-4 py-5 space-y-1 max-h-[80vh] overflow-y-auto">
              {/* Nav links */}
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
                    className="block text-gray-300 hover:text-white transition-colors font-medium py-3 px-3 rounded-lg hover:bg-white/[0.04]"
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                )
              )}

              {/* Promo code section — mobile */}
              <div className="pt-4 pb-2">
                <div
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gold/30 bg-gold/[0.08] cursor-pointer hover:bg-gold/[0.14] transition-all"
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FACC15"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <path d="M20 12v10H4V12" />
                    <path d="M2 12h20" />
                    <path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z" />
                    <path d="M12 2v8" />
                  </svg>
                  <span className="promo-code-shimmer text-sm font-bold tracking-wide">
                    {copied ? 'COPIÉ ✓' : SITE.promoCode}
                  </span>
                  {!copied && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 opacity-60"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  {copied && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span className="text-xs text-gold/70 ml-1">
                    Appuyez pour copier
                  </span>
                </div>
              </div>

              {/* Bookmaker signup buttons — mobile */}
              <div className="pt-2 space-y-2">
                <a
                  href={AFFILIATE.linebet}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 btn-linebet text-[#04150C] text-sm font-bold"
                  role="menuitem"
                >
                  <img
                    src="/logos/linebet-icon.svg"
                    alt="Linebet"
                    className="w-5 h-5 rounded object-contain flex-shrink-0"
                    loading="lazy"
                  />
                  S&apos;inscrire sur Linebet
                </a>
                <a
                  href={AFFILIATE.star888}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 btn-star888 text-white text-sm font-bold"
                  role="menuitem"
                >
                  <img
                    src="/logos/888starz-icon.svg"
                    alt="888starz"
                    className="w-5 h-5 rounded object-contain flex-shrink-0"
                    loading="lazy"
                  />
                  S&apos;inscrire sur 888starz
                </a>
                <a
                  href={AFFILIATE.linebetDownload}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 border border-edge text-white font-semibold rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-sm"
                  role="menuitem"
                >
                  <img
                    src="/logos/android.svg"
                    alt="Android"
                    className="w-5 h-5 object-contain flex-shrink-0"
                    loading="lazy"
                  />
                  Télécharger Linebet
                </a>
                <a
                  href={AFFILIATE.star888Download}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 border border-edge text-white font-semibold rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-sm"
                  role="menuitem"
                >
                  <img
                    src="/logos/android.svg"
                    alt="Android"
                    className="w-5 h-5 object-contain flex-shrink-0"
                    loading="lazy"
                  />
                  Télécharger 888starz
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
