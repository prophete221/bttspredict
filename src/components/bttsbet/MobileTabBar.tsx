'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type TabId = 'home' | 'predictions' | 'vip' | 'support'

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
    id: 'support',
    label: 'Support',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    action: () => window.open('https://wa.me/15406704172', '_blank'),
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
        backgroundColor: 'rgba(8, 12, 26, 0.97)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        // Bordure néon cyan en haut — bien visible
        borderTop: '1px solid rgba(216, 186, 145, 0.45)',
        // Halo néon cyan + violet qui « remonte » depuis le menu
        boxShadow:
          '0 -6px 24px rgba(216, 186, 145, 0.28), 0 -2px 12px rgba(0, 212, 245, 0.20), inset 0 1px 0 rgba(216, 186, 145, 0.18)',
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
              // Actif = cyan néon éclatant, Inactif = gris clair lisible
              color: isActive ? '#D8BA91' : 'rgba(220, 230, 245, 0.65)',
              minHeight: '48px',
              textShadow: isActive
                ? '0 0 12px rgba(216, 186, 145, 0.85), 0 0 4px rgba(216, 186, 145, 0.6)'
                : 'none',
              filter: isActive
                ? 'drop-shadow(0 0 6px rgba(216, 186, 145, 0.75))'
                : 'none',
            }}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Pastille néon sous l'icône actif */}
            {isActive && (
              <motion.span
                layoutId="tab-glow"
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{
                  width: '32px',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, #D8BA91 0%, #E5CDB0 100%)',
                  boxShadow: '0 0 12px rgba(216, 186, 145, 0.9), 0 0 6px rgba(0, 212, 245, 0.6)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div whileTap={{ scale: 0.88 }}>
              {tab.icon}
            </motion.div>
            <span
              className="text-[9px] font-bold uppercase tracking-wider"
              style={{
                color: isActive ? '#D8BA91' : 'rgba(200, 215, 235, 0.7)',
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
