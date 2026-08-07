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
          {/* Logo ballon de foot */}
          <a
            href="/"
            className="flex items-center gap-1.5 flex-shrink-0"
            aria-label="BTTSPredict — Accueil"
          >
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#070B18" stroke="#5146F5" strokeWidth="1.5"/>
              <path d="M16 7 L20 10 L18.5 15 L13.5 15 L12 10 Z" fill="#5146F5" opacity="0.9"/>
              <path d="M16 7 L13 3.5 L19 3.5 Z" fill="#5146F5" opacity="0.7"/>
              <path d="M20 10 L24.5 8 L23 13 Z" fill="#5146F5" opacity="0.7"/>
              <path d="M18.5 15 L22 18.5 L17 20 Z" fill="#5146F5" opacity="0.7"/>
              <path d="M13.5 15 L10 18.5 L15 20 Z" fill="#5146F5" opacity="0.7"/>
              <path d="M12 10 L7.5 8 L9 13 Z" fill="#5146F5" opacity="0.7"/>
            </svg>
            <span className="text-xs font-bold" style={{ color: '#5146F5' }}>
              BTTSPredict
            </span>
          </a>

          {/* Code promo + CTA */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCode}
              className="px-2 py-1 rounded text-[10px] font-mono font-bold"
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
              className="px-2.5 py-1.5 rounded text-[11px] font-bold transition-colors"
              style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}
            >
              Pronos
            </a>
          </div>
        </div>

        {/* Ligne 2: Liens principaux scrollables */}
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar pb-1.5" style={{ scrollbarWidth: 'none' }}>
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

        {/* Ligne 3: Tous les liens (dépliable) */}
        {showAll && (
          <div className="pb-2 pt-1 border-t" style={{ borderColor: 'rgba(81, 70, 245, 0.1)' }}>
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
  )
}
