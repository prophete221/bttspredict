'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion' // removed for bundle size

type TabId = 'home' | 'predictions' | 'history' | 'vip'

// Helper : naviguer vers une section (gère le cas multi-pages)
function goToSection(id: string) {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function goHome() {
  if (window.location.pathname !== '/') {
    window.location.href = '/'
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const TABS: { id: TabId; label: string; icon: React.ReactNode; action: () => void }[] = [
  {
    id: 'home',
    label: 'Accueil',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    action: goHome,
  },
  {
    id: 'predictions',
    label: 'Pronos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2 a10 10 0 0 1 10 10 l-10 0 z" fill="currentColor" />
      </svg>
    ),
    action: () => goToSection('free-predictions'),
  },
  {
    id: 'vip',
    label: 'VIP',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M5 16h14v3H5z" />
      </svg>
    ),
    action: () => goToSection('vip'),
  },
  {
    id: 'history',
    label: 'Historique',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
    action: () => {
      if (window.location.pathname !== '/historique') {
        window.location.href = '/historique'
      }
    },
  },
]

export default function MobileTabBar() {
  const [active, setActive] = useState<TabId>('home')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const pEl = document.getElementById('free-predictions')
      const vEl = document.getElementById('vip')
      const pY = pEl ? pEl.getBoundingClientRect().top + scrollY : Infinity
      const vY = vEl ? vEl.getBoundingClientRect().top + scrollY : Infinity

      if (scrollY < pY - 200) setActive('home')
      else if (scrollY >= pY - 200 && scrollY < vY - 200) setActive('predictions')
      else if (scrollY >= vY - 200) setActive('vip')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleTab = (tab: typeof TABS[0]) => {
    setActive(tab.id)
    tab.action()
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        display: 'flex',
        backgroundColor: 'rgba(7, 17, 26, 0.97)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        // Bordure subtile en haut — sobre
        borderTop: '1px solid #2d2f31',
        // Ombre légère — pas de halo agressif
        boxShadow: '0 -4px 16px rgba(7, 17, 26, 0.4)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Navigation mobile"
    >
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => handleTab(tab)}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative"
            style={{
              // Actif = turquoise sobre, Inactif = gris lisible
              color: isActive ? '#22c55e' : '#9ca3af',
              minHeight: '48px',
              textShadow: isActive
                ? '0 0 8px rgba(199, 244, 100, 0.4)'
                : 'none',
              filter: isActive
                ? 'drop-shadow(0 0 4px rgba(199, 244, 100, 0.4))'
                : 'none',
            }}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Pastille turquoise sous l'icône actif */}
            {isActive && (
              <span
                layoutId="tab-glow"
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{
                  width: '32px',
                  height: '3px',
                  borderRadius: '2px',
                  background: '#22c55e',
                  boxShadow: '0 0 8px rgba(199, 244, 100, 0.6)',
                }}
              />
            )}
            <div>
              {tab.icon}
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{
                color: isActive ? '#22c55e' : '#9ca3af',
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
