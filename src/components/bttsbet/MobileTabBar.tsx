'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type TabId = 'home' | 'predictions' | 'vip' | 'support'

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
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
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
    action: () => document.getElementById('free-predictions')?.scrollIntoView({ behavior: 'smooth' }),
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
    action: () => document.getElementById('vip')?.scrollIntoView({ behavior: 'smooth' }),
  },
  {
    id: 'support',
    label: 'Support',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    action: () => window.open('https://wa.me/221781234567', '_blank'),
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
        backgroundColor: 'rgba(10, 10, 10, 0.98)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Navigation mobile"
    >
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTab(tab)}
          className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
          style={{
            color: active === tab.id ? '#00FF88' : '#5a5a5a',
            minHeight: '44px',
          }}
          aria-label={tab.label}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <motion.div whileTap={{ scale: 0.9 }}>
            {tab.icon}
          </motion.div>
          <span className="text-[9px] font-semibold uppercase tracking-wider">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
