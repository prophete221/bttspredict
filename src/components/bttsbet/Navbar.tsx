'use client'

import { useState, useCallback } from 'react'
import { SITE } from '@/lib/constants'

const PAGE_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Pronos', href: '/pronostics' },
  { label: 'Over 2.5', href: '/over-2-5-predictions' },
  { label: 'Score Exact', href: '/correct-score-predictions' },
  { label: 'Today', href: '/football-predictions-today' },
  { label: 'Betting Tips', href: '/betting-tips' },
  { label: 'Ligues', href: '/league-predictions' },
  { label: 'Équipes', href: '/team-predictions' },
  { label: 'Matchs', href: '/match-predictions' },
  { label: 'VIP', href: '/vip' },
  { label: 'Historique', href: '/historique' },
  { label: 'Stats', href: '/statistiques' },
  { label: 'Méthode', href: '/methodologie' },
  { label: 'Équipe', href: '/equipe' },
  { label: 'Blog', href: '/blog' },
  { label: 'Presse', href: '/presse' },
  { label: 'Bookmakers', href: '/bookmakers' },
  { label: 'Code VISION221', href: '/linebet-promo-code' },
  { label: 'Bonus 888', href: '/bonus-888starz' },
  { label: 'BTTS ?', href: '/btts-c-est-quoi' },
  { label: 'Aviator', href: '/aviator-stats' },
  { label: 'Analyses de valeur FIFA (expérimental)', href: '/analyses-fifa' },
]

export default function Navbar() {
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const copyCode = useCallback(async () => {
    try { await navigator.clipboard.writeText(SITE.promoCode) } catch {}
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  // Liens principaux visibles par défaut
  const mainLinks = PAGE_LINKS.slice(0, 7)
  const moreLinks = PAGE_LINKS.slice(7)

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          backgroundColor: '#070B18',
          borderBottom: '1px solid rgba(81, 70, 245, 0.15)',
        }}
      >
        <div className="max-w-2xl mx-auto px-2">
          {/* Ligne 1: Logo + CTA */}
          <div className="flex items-center justify-between h-12 gap-2">
            {/* Logo BTTSPredict */}
            <a
              href="/"
              className="flex items-center gap-1.5 flex-shrink-0"
              aria-label="BTTSPredict — Accueil"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.svg" alt="BTTSPredict" width={24} height={24} className="flex-shrink-0" />
              <span className="text-xs font-bold" style={{ color: '#5146F5' }}>
                BTTSPredict
              </span>
            </a>

            {/* Code promo + CTA + Hamburger */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyCode}
                className="hidden sm:block px-2 py-1 rounded text-[10px] font-mono font-bold"
                style={{
                  backgroundColor: 'rgba(81, 70, 245, 0.12)',
                  border: '1px solid #5146F5',
                  color: '#A8E063',
                }}
              >
                {copied ? '✓' : SITE.promoCode}
              </button>
              <a
                href="/pronostics"
                className="hidden sm:block px-2.5 py-1.5 rounded text-[11px] font-bold transition-colors"
                style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}
              >
                Pronos
              </a>

              {/* Hamburger - mobile only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg"
                style={{ color: '#F7F8FF' }}
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

          {/* Ligne 2: Liens principaux scrollables — desktop only (lg:flex) */}
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto no-scrollbar pb-1.5" style={{ scrollbarWidth: 'none' }}>
            {mainLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap transition-colors"
                style={{ color: '#A5ABC5' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#5146F5'; e.currentTarget.style.backgroundColor = 'rgba(81, 70, 245, 0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#A5ABC5'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.label}
              </a>
            ))}
            {/* Bouton "Plus" */}
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap transition-colors"
              style={{ color: '#5146F5' }}
            >
              {showAll ? '✕ Fermer' : '+ Plus'}
            </button>
          </div>

          {/* Ligne 3: Tous les liens (dépliable) — desktop only */}
          {showAll && (
            <div className="hidden lg:block pb-2 pt-1 border-t" style={{ borderColor: 'rgba(81, 70, 245, 0.1)' }}>
              <div className="grid grid-cols-3 gap-1">
                {moreLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-[10px] font-medium px-2 py-1.5 rounded transition-colors text-center"
                    style={{ color: '#A5ABC5', backgroundColor: 'rgba(247, 248, 255,0.02)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#5146F5'; e.currentTarget.style.backgroundColor = 'rgba(81, 70, 245, 0.08)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#A5ABC5'; e.currentTarget.style.backgroundColor = 'rgba(247, 248, 255,0.02)' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* === DRAWER MOBILE === */}
      {menuOpen && (
        <>
          {/* Fond semi-transparent */}
          <div
            className="fixed inset-0 z-[60] lg:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div
            className="fixed top-0 left-0 right-0 z-[70] lg:hidden max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: '#0D1630',
              borderBottom: '1px solid #5146F5',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header du drawer */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(81, 70, 245, 0.15)' }}>
              <span className="text-sm font-bold text-[#F7F8FF]">Navigation</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{ color: '#A5ABC5' }}
                aria-label="Fermer le menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Liens du drawer */}
            <div className="px-2 py-2">
              {PAGE_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: '#A5ABC5' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#A8E063'; e.currentTarget.style.backgroundColor = 'rgba(81, 70, 245, 0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#A5ABC5'; e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Boutons CTA en bas du drawer */}
            <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: 'rgba(81, 70, 245, 0.15)' }}>
              <button
                onClick={() => { copyCode(); setMenuOpen(false) }}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-mono font-bold text-center"
                style={{
                  backgroundColor: 'rgba(81, 70, 245, 0.12)',
                  border: '1px solid #5146F5',
                  color: '#A8E063',
                }}
              >
                {copied ? '✓ Copié' : SITE.promoCode}
              </button>
              <a
                href="/pronostics"
                onClick={() => setMenuOpen(false)}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-bold text-center transition-colors"
                style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}
              >
                Voir les Pronos
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
