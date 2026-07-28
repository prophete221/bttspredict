'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type TabId = 'home' | 'predictions' | 'vip' | 'support'

const TABS: { id: TabId; label: string; icon: React.ReactNode; action: () => void }[] = [
  {
    id: 'home',
    label: 'Accueil',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
  {
    id: 'predictions',
    label: 'Pronostics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2 a10 10 0 0 1 10 10 l-10 0 z" fill="currentColor" />
      </svg>
    ),
    action: () => {
      const el = document.getElementById('free-predictions')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
  },
  {
    id: 'vip',
    label: 'VIP',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M5 16h14v3H5z" />
      </svg>
    ),
    action: () => {
      const el = document.getElementById('vip')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
  },
  {
    id: 'support',
    label: 'Support',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
    action: () => window.open('https://wa.me/221000000000?text=Bonjour%20BttsBet%2C%20j%27ai%20besoin%20d%27aide', '_blank'),
  },
]

export default function MobileTabBar() {
  const [active, setActive] = useState<TabId>('home')

  // Update active tab based on scroll position
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const predictionsEl = document.getElementById('free-predictions')
      const vipEl = document.getElementById('vip')
      const predictionsY = predictionsEl?.offsetTop || Infinity
      const vipY = vipEl?.offsetTop || Infinity

      if (scrollY < predictionsY - 200) setActive('home')
      else if (scrollY >= predictionsY - 200 && scrollY < vipY - 200) setActive('predictions')
      else if (scrollY >= vipY - 200) setActive('vip')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleTab = (tab: typeof TABS[0]) => {
    setActive(tab.id)
    tab.action()
  }

  return (
    <nav className="mobile-tab-bar" aria-label="Navigation mobile">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTab(tab)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-1 transition-colors ${
            active === tab.id ? 'text-success' : 'text-gray-500'
          }`}
          aria-label={tab.label}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={active === tab.id ? 'text-success' : 'text-gray-500'}
          >
            {tab.icon}
          </motion.div>
          <span className="text-[9px] font-semibold uppercase tracking-wider">{tab.label}</span>
          {active === tab.id && (
            <motion.div
              layoutId="mobile-tab-indicator"
              className="absolute top-0 w-8 h-0.5 bg-success rounded-full"
              transition={{ duration: 0.2 }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}
