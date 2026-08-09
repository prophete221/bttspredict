'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

type TabId = 'home' | 'predictions' | 'vip'

interface Tab {
  id: TabId
  label: string
  href: string
  icon: React.ReactNode
  matchPath: (pathname: string) => boolean
}

const TABS: Tab[] = [
  {
    id: 'home',
    label: 'Accueil',
    href: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    matchPath: (p) => p === '/',
  },
  {
    id: 'predictions',
    label: 'Pronos',
    href: '/pronostics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2 a10 10 0 0 1 10 10 l-10 0 z" fill="currentColor" />
      </svg>
    ),
    matchPath: (p) => p === '/' || p.startsWith('/btts/') || p.startsWith('/match/'),
  },
  {
    id: 'vip',
    label: 'VIP',
    href: '/vip',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M5 16h14v3H5z" />
      </svg>
    ),
    matchPath: (p) => p.startsWith('/vip'),
  },
]

export default function BottomNavigation() {
  const pathname = usePathname() || '/'
  const [active, setActive] = useState<TabId>('home')

  useEffect(() => {
    const matched = TABS.find(tab => tab.matchPath(pathname))
    setActive(matched ? matched.id : 'home')
  }, [pathname])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        display: 'flex',
        backgroundColor: 'rgba(7, 11, 24, 0.97)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid #303861',
        boxShadow: '0 -4px 16px rgba(7, 11, 24, 0.4)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label="Navigation principale"
    >
      {TABS.map(tab => {
        const isActive = active === tab.id
        return (
          <a
            key={tab.id}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146F5] focus-visible:ring-inset"
            style={{
              color: isActive ? '#5146F5' : '#A5ABC5',
              minHeight: '52px',
              textShadow: isActive ? '0 0 8px rgba(81, 70, 245, 0.4)' : 'none',
            }}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <motion.span
                layoutId="bottomnav-glow"
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{
                  width: '32px',
                  height: '3px',
                  borderRadius: '2px',
                  background: '#5146F5',
                  boxShadow: '0 0 8px rgba(81, 70, 245, 0.6)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div whileTap={{ scale: 0.88 }}>
              {tab.icon}
            </motion.div>
            <span
              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider"
              style={{ color: isActive ? '#5146F5' : '#A5ABC5' }}
            >
              {tab.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
