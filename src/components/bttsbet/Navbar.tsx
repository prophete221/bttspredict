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
  { label: 'Aviator', href: '/prediction-aviator' },
  { label: 'Faille FIFA', href: '/faille-fifa' },
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
        backgroundColor: '#0D1117',
        borderBottom: '1px solid rgba(0, 196, 154, 0.15)',
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
              <circle cx="16" cy="16" r="15" fill="#0D1117" stroke="#00C49A" strokeWidth="1.5"/>
              <path d="M16 7 L20 10 L18.5 15 L13.5 15 L12 10 Z" fill="#00C49A" opacity="0.9"/>
              <path d="M16 7 L13 3.5 L19 3.5 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M20 10 L24.5 8 L23 13 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M18.5 15 L22 18.5 L17 20 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M13.5 15 L10 18.5 L15 20 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M12 10 L7.5 8 L9 13 Z" fill="#00C49A" opacity="0.7"/>
            </svg>
            <span className="text-xs font-bold" style={{ color: '#00C49A' }}>
              BTTSPredict
            </span>
          </a>

          {/* Code promo + CTA */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCode}
              className="px-2 py-1 rounded text-[10px] font-mono font-bold"
              style={{
                backgroundColor: 'rgba(0, 196, 154, 0.12)',
                border: '1px solid #00C49A',
                color: '#00A882',
              }}
            >
              {copied ? '✓' : SITE.promoCode}
            </button>
            <a
              href="/pronostics"
              className="px-2.5 py-1.5 rounded text-[11px] font-bold transition-colors"
              style={{ backgroundColor: '#00C49A', color: '#F0F2F5' }}
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
              style={{ color: '#A8B3C2' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#00C49A'; e.currentTarget.style.backgroundColor = 'rgba(0, 196, 154, 0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#A8B3C2'; e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {link.label}
            </a>
          ))}
          {/* Bouton "Plus" */}
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap transition-colors"
            style={{ color: '#00C49A' }}
          >
            {showAll ? '✕ Fermer' : '+ Plus'}
          </button>
        </div>

        {/* Ligne 3: Tous les liens (dépliable) */}
        {showAll && (
          <div className="pb-2 pt-1 border-t" style={{ borderColor: 'rgba(0, 196, 154, 0.1)' }}>
            <div className="grid grid-cols-3 gap-1">
              {moreLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[10px] font-medium px-2 py-1.5 rounded transition-colors text-center"
                  style={{ color: '#A8B3C2', backgroundColor: 'rgba(255,255,255,0.02)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#00C49A'; e.currentTarget.style.backgroundColor = 'rgba(0, 196, 154, 0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#A8B3C2'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)' }}
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
