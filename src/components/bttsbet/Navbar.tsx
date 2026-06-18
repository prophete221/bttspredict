'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE, AFFILIATE, ANDROID_LOGO } from '@/lib/constants'

function scrollToSelector(selector: string) {
  const el = document.getElementById(selector)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => {
      window.scrollBy({ top: -64, behavior: 'smooth' })
    }, 400)
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent, link: typeof NAV_LINKS[0]) => {
    if (link.scrollTarget) {
      e.preventDefault()
      scrollToSelector(link.scrollTarget)
    }
    setIsOpen(false)
  }, [])

  return (
    <nav
      role="navigation"
      aria-label="Navigation principale"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/40 depth-3 border-b border-white/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-2.5 group"
            aria-label="BttsBet — Accueil"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald/25 to-emerald/5 border border-emerald/20 flex items-center justify-center group-hover:border-emerald/40 transition-all group-hover:shadow-lg group-hover:shadow-emerald/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
              <div className="absolute inset-0 rounded-xl bg-emerald/0 group-hover:bg-emerald/5 transition-colors" />
            </div>
            <span className="text-xl font-extrabold text-white group-hover:text-emerald transition-colors tracking-tight">
              {SITE.name}
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              link.highlight ? (
                <a
                  key={link.label}
                  href={link.href || '/'}
                  onClick={(e) => handleNavClick(e, link)}
                  className="px-4 py-1.5 bg-gradient-to-r from-royal-deep to-royal text-white font-bold rounded-lg text-sm hover:shadow-lg hover:shadow-royal/30 transition-all hover:brightness-110 cursor-pointer border border-royal/40"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href || '/'}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-gray-400 hover:text-white transition-colors text-sm font-medium relative group cursor-pointer"
                  data-cursor="hover"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald to-emerald-soft transition-all group-hover:w-full rounded-full" />
                </a>
              )
            ))}
            <a
              href={AFFILIATE.linebet}
              rel={AFFILIATE.rel}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 btn-linebet text-[#06281F] text-sm"
              data-cursor="hover"
            >
              <img src="/logos/linebet-icon.svg" alt="Linebet" className="w-5 h-5 rounded object-contain flex-shrink-0" loading="lazy"/>
              S&apos;inscrire
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/5"
            role="menu"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                link.highlight ? (
                  <a
                    key={link.label}
                    href={link.href || '/'}
                    onClick={(e) => handleNavClick(e, link)}
                    className="block text-center py-3 px-3 bg-gradient-to-r from-royal-deep to-royal text-white font-bold rounded-lg cursor-pointer border border-royal/40"
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href || '/'}
                    onClick={(e) => handleNavClick(e, link)}
                    className="block text-gray-300 hover:text-white transition-colors font-medium py-3 px-3 rounded-lg hover:bg-white/[0.04] cursor-pointer"
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                )
              ))}
              <div className="pt-3 space-y-2">
                <a
                  href={AFFILIATE.linebetDownload}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 border border-white/10 text-white font-semibold rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <img src={ANDROID_LOGO} alt="Android" className="w-5 h-5 object-contain flex-shrink-0" loading="lazy"/>
                  Télécharger Linebet
                </a>
                <a
                  href={AFFILIATE.star888Download}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 border border-white/10 text-white font-semibold rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <img src={ANDROID_LOGO} alt="Android" className="w-5 h-5 object-contain flex-shrink-0" loading="lazy"/>
                  Télécharger 888starz
                </a>
                <a
                  href={AFFILIATE.linebet}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 btn-linebet text-[#06281F]"
                  data-cursor="hover"
                >
                  <img src="/logos/linebet-icon.svg" alt="Linebet" className="w-5 h-5 rounded object-contain flex-shrink-0" loading="lazy"/>
                  S&apos;inscrire sur Linebet
                </a>
                {/* V23: Nouveau bouton 888starz */}
                <a
                  href={AFFILIATE.star888}
                  rel={AFFILIATE.rel}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-center px-5 py-3 btn-star888 text-white"
                  data-cursor="hover"
                >
                  <img src="/logos/888starz-icon.svg" alt="888starz" className="w-5 h-5 rounded object-contain flex-shrink-0" loading="lazy"/>
                  S&apos;inscrire sur 888starz
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
