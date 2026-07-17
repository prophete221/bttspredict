import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SITE, AFFILIATE } from '../data/constants'

function scrollToSelector(selector) {
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
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = location.pathname === '/'

  const handleNavClick = (e, link) => {
    if (link.scrollTarget) {
      e.preventDefault()
      if (!isHomePage) {
        navigate('/')
        setTimeout(() => scrollToSelector(link.scrollTarget), 300)
      } else {
        scrollToSelector(link.scrollTarget)
      }
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Navbar */}
      <nav
        role="navigation"
        aria-label="Navigation principale"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-black/30 depth-3'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="flex items-center gap-2.5 group"
              aria-label="BttsBet — Accueil"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald/20 flex items-center justify-center group-hover:bg-emerald/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white group-hover:text-emerald transition-colors">
                {SITE.name}
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href || '/'}
                  onClick={(e) => handleNavClick(e, link)}
                  aria-current={link.href === '/' && isHomePage ? 'page' : undefined}
                  className="text-gray-300 hover:text-emerald transition-colors text-sm font-medium relative group cursor-pointer"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald transition-all group-hover:w-full" />
                </a>
              ))}
              <a
                href={AFFILIATE.linebet}
                rel={AFFILIATE.rel}
                target="_blank"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-lg text-sm hover:shadow-lg hover:shadow-emerald/30 transition-all hover:brightness-110 hover-lift"
              >
                S'inscrire
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
                  <a
                    key={link.label}
                    href={link.href || '/'}
                    onClick={(e) => handleNavClick(e, link)}
                    className="block text-gray-300 hover:text-emerald transition-colors font-medium py-3 px-3 rounded-lg hover:bg-white/5 cursor-pointer"
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 space-y-2">
                  <a
                    href={AFFILIATE.linebetDownload}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    className="block text-center px-5 py-3 border border-white/10 text-white font-semibold rounded-lg"
                  >
                    Télécharger Linebet
                  </a>
                  <a
                    href={AFFILIATE.linebet}
                    rel={AFFILIATE.rel}
                    target="_blank"
                    className="block text-center px-5 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-lg"
                  >
                    S'inscrire sur Linebet
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
