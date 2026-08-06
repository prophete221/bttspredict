'use client'

import { useState, useCallback } from 'react'
import { NAV_LINKS, SITE, AFFILIATE } from '@/lib/constants'

const ALL_LINKS = NAV_LINKS

export default function Navbar() {
  const [copied, setCopied] = useState(false)

  const copyCode = useCallback(async () => {
    try { await navigator.clipboard.writeText(SITE.promoCode) } catch {}
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  const handleNav = (link: { href?: string; scrollTarget?: string }) => {
    if (link.href === '/') {
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (link.scrollTarget) {
      if (window.location.pathname !== '/') {
        window.location.href = `/#${link.scrollTarget}`
      } else {
        const el = document.getElementById(link.scrollTarget)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => window.scrollBy({ top: -56, behavior: 'smooth' }), 400)
        }
      }
    }
  }

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: '#0D1117',
        borderBottom: '1px solid rgba(0, 196, 154, 0.15)',
      }}
    >
      <div className="max-w-2xl mx-auto px-3">
        <div className="flex items-center justify-between h-14 gap-1">
          {/* Logo — ballon de foot */}
          <button
            onClick={() => handleNav({ href: '/' })}
            className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
            aria-label="BTTSPredict — Accueil"
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" fill="#0D1117" stroke="#00C49A" strokeWidth="1.5"/>
              <path d="M16 7 L20 10 L18.5 15 L13.5 15 L12 10 Z" fill="#00C49A" opacity="0.9"/>
              <path d="M16 7 L13 3.5 L19 3.5 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M20 10 L24.5 8 L23 13 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M18.5 15 L22 18.5 L17 20 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M13.5 15 L10 18.5 L15 20 Z" fill="#00C49A" opacity="0.7"/>
              <path d="M12 10 L7.5 8 L9 13 Z" fill="#00C49A" opacity="0.7"/>
              <line x1="16" y1="7" x2="16" y2="3.5" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="20" y1="10" x2="24.5" y2="8" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="18.5" y1="15" x2="22" y2="18.5" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="13.5" y1="15" x2="10" y2="18.5" stroke="#00C49A" strokeWidth="0.5"/>
              <line x1="12" y1="10" x2="7.5" y2="8" stroke="#00C49A" strokeWidth="0.5"/>
            </svg>
            <span className="text-sm font-bold tracking-tight" style={{ color: '#00C49A' }}>
              BTTSPredict
            </span>
          </button>

          {/* Liens — visibles sur tous les écrans */}
          <div className="flex items-center gap-1">
            {ALL_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link)}
                className="text-[11px] font-medium px-2 py-1.5 rounded transition-colors"
                style={{ color: '#F0F2F5' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00DDB0'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#F0F2F5'}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Promo code */}
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

            {/* CTA Pronos */}
            <button
              onClick={() => handleNav({ scrollTarget: 'free-predictions' })}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-bold transition-colors"
              style={{
                backgroundColor: '#00C49A',
                color: '#F0F2F5',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00DDB0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00C49A'}
            >
              Pronos
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
