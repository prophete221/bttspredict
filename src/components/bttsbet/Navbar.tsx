'use client'

import { useState, useCallback } from 'react'
import { SITE } from '@/lib/constants'
import LanguageSwitcher, { useLanguage } from './LanguageSwitcher'
import { localizedPath, translationsFor } from '@/lib/i18n'

/**
 * Navbar BTTSPredict v64 — Plateforme PRO
 *
 * Refonte du menu 22 liens → 6 liens.
 * Plus de blog 2000, plus de doorway pages : on garde seulement
 * les pages essentielles type Flashscore (Stats / Historique / Méthode)
 * + 2 CTAs bookmakers (Linebet VISION221 + Bonus 888Starz).
 *
 * Liste définitive des 6 liens :
 *   1. Accueil
 *   2. Statistiques
 *   3. Historique vérifié
 *   4. Méthode
 *   5. Code Linebet VISION221
 *   6. Bonus 888Starz
 *
 * Plus de bouton "Plus", plus de drawer mobile complexe.
 * Les 6 liens tiennent en une ligne sur desktop, en grille 2x3 sur mobile.
 */
export default function Navbar() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const pageLinks = [
    { label: t.nav.today, href: localizedPath('/btts/predictions/today', lang) },
    { label: t.nav.history, href: localizedPath('/resultats-verifies', lang) },
    { label: t.nav.statistics, href: localizedPath('/btts/statistics', lang) },
    { label: t.nav.methodology, href: localizedPath('/methodologie', lang) },
    { label: 'Linebet', href: localizedPath('/code-promo-linebet-senegal', lang) },
    { label: '888Starz', href: localizedPath('/bonus-888starz', lang) },
  ]
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const copyCode = useCallback(async () => {
    try { await navigator.clipboard.writeText(SITE.promoCode) } catch {}
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#07131D',
          borderBottom: '1px solid rgba(75, 182, 135, 0.15)',
        }}
      >
        <div className="max-w-2xl mx-auto px-2">
          {/* Ligne 1: Logo + Code promo + Hamburger mobile */}
          <div className="flex items-center justify-between h-12 gap-2">
            {/* Logo BTTSPredict */}
            <a
              href={localizedPath('/', lang)}
              className="flex items-center gap-1.5 flex-shrink-0"
              aria-label={`BTTSPredict — ${t.nav.home}`}
            >
              <img src="/favicon.svg" alt="BTTSPredict" width={24} height={24} className="flex-shrink-0" />
              <span>
                <span className="block text-xs font-bold leading-none" style={{ color: '#F3F7F5' }}>BTTSPredict</span>
                <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#E6A24C' }}>Match intelligence</span>
              </span>
            </a>

            {/* Code promo + Hamburger */}
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher compact />
              <button
                onClick={copyCode}
                className="hidden sm:block px-2 py-1 rounded text-[10px] font-mono font-bold"
                style={{
                  backgroundColor: 'rgba(127, 162, 198, 0.16)',
                  border: '1px solid #E6A24C',
                  color: '#E6A24C',
                }}
              >
                {copied ? '✓' : SITE.promoCode}
              </button>

              {/* Hamburger - mobile only (les 6 liens dépliables) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg"
                style={{ color: '#F3F7F5' }}
                aria-label={t.nav.openMenu}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Ligne 2: navigation produit desktop */}
          <div className="hidden sm:flex items-center gap-0.5 overflow-x-auto no-scrollbar pb-1.5" style={{ scrollbarWidth: 'none' }}>
            {pageLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap transition-colors"
                style={{ color: '#B4C4CC' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E6A24C'; e.currentTarget.style.backgroundColor = 'rgba(75, 182, 135, 0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#B4C4CC'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* === DRAWER MOBILE — navigation produit === */}
      {menuOpen && (
        <>
          {/* Fond semi-transparent */}
          <div
            className="fixed inset-0 z-[60] sm:hidden"
            style={{ backgroundColor: 'rgba(6, 16, 25, 0.6)' }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className="fixed top-0 left-0 right-0 z-[70] sm:hidden"
            style={{
              backgroundColor: '#0D202D',
              borderBottom: '1px solid #E6A24C',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(75, 182, 135, 0.15)' }}>
              <span className="text-sm font-bold text-[#F3F7F5]">{t.nav.menu}</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ color: '#B4C4CC' }}
                aria-label={t.nav.closeMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* 6 liens en grille 2x3 — finit en une seule "page" */}
            <div className="p-3 grid grid-cols-2 gap-2">
              {pageLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-xs font-semibold text-center transition-colors"
                  style={{
                    color: '#F3F7F5',
                    backgroundColor: 'rgba(75, 182, 135, 0.08)',
                    border: '1px solid rgba(75, 182, 135, 0.2)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(75, 182, 135, 0.18)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(75, 182, 135, 0.08)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Bouton CTA copier code en bas du drawer */}
            <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: 'rgba(75, 182, 135, 0.15)' }}>
              <button
                onClick={() => { copyCode(); setMenuOpen(false) }}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-mono font-bold text-center"
                style={{
                  backgroundColor: 'rgba(127, 162, 198, 0.16)',
                  border: '1px solid #E6A24C',
                  color: '#E6A24C',
                }}
              >
                {copied ? '✓' : SITE.promoCode}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
