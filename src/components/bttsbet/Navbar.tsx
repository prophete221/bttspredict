'use client'

import { useState, useCallback } from 'react'
import { SITE } from '@/lib/constants'

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
const PAGE_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Statistiques', href: '/btts/statistics' },
  { label: 'Historique vérifié', href: '/resultats-verifies' },
  { label: 'Méthode', href: '/methodologie' },
  { label: 'Code Linebet VISION221', href: '/code-promo-linebet-senegal' },
  { label: 'Bonus 888Starz', href: '/bonus-888starz' },
]

export default function Navbar() {
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
          backgroundColor: '#07111F',
          borderBottom: '1px solid rgba(199, 244, 100, 0.15)',
        }}
      >
        <div className="max-w-2xl mx-auto px-2">
          {/* Ligne 1: Logo + Code promo + Hamburger mobile */}
          <div className="flex items-center justify-between h-12 gap-2">
            {/* Logo BTTSPredict */}
            <a
              href="/"
              className="flex items-center gap-1.5 flex-shrink-0"
              aria-label="BTTSPredict — Accueil"
            >
              <img src="/favicon.svg" alt="BTTSPredict" width={24} height={24} className="flex-shrink-0" />
              <span className="text-xs font-bold" style={{ color: '#16A36A' }}>
                BTTSPredict
              </span>
            </a>

            {/* Code promo + Hamburger */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyCode}
                className="hidden sm:block px-2 py-1 rounded text-[10px] font-mono font-bold"
                style={{
                  backgroundColor: 'rgba(199, 244, 100, 0.12)',
                  border: '1px solid #16A36A',
                  color: '#16A36A',
                }}
              >
                {copied ? '✓' : SITE.promoCode}
              </button>

              {/* Hamburger - mobile only (les 6 liens dépliables) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg"
                style={{ color: '#F4F8FC' }}
                aria-label="Menu"
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

          {/* Ligne 2: 6 liens desktop (sm+) — une seule ligne, scrollable si besoin */}
          <div className="hidden sm:flex items-center gap-0.5 overflow-x-auto no-scrollbar pb-1.5" style={{ scrollbarWidth: 'none' }}>
            {PAGE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap transition-colors"
                style={{ color: '#B7C7D9' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#16A36A'; e.currentTarget.style.backgroundColor = 'rgba(199, 244, 100, 0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#B7C7D9'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* === DRAWER MOBILE — grille 2x3 des 6 liens === */}
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
              backgroundColor: '#0D1B2A',
              borderBottom: '1px solid #16A36A',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(199, 244, 100, 0.15)' }}>
              <span className="text-sm font-bold text-[#F4F8FC]">Navigation</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ color: '#B7C7D9' }}
                aria-label="Fermer le menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* 6 liens en grille 2x3 — finit en une seule "page" */}
            <div className="p-3 grid grid-cols-2 gap-2">
              {PAGE_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-xs font-semibold text-center transition-colors"
                  style={{
                    color: '#F4F8FC',
                    backgroundColor: 'rgba(199, 244, 100, 0.08)',
                    border: '1px solid rgba(199, 244, 100, 0.2)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(199, 244, 100, 0.18)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(199, 244, 100, 0.08)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Bouton CTA copier code en bas du drawer */}
            <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: 'rgba(199, 244, 100, 0.15)' }}>
              <button
                onClick={() => { copyCode(); setMenuOpen(false) }}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-mono font-bold text-center"
                style={{
                  backgroundColor: 'rgba(199, 244, 100, 0.12)',
                  border: '1px solid #16A36A',
                  color: '#16A36A',
                }}
              >
                {copied ? '✓ Copié' : SITE.promoCode}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
