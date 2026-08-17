'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { localizedPath, translationsFor } from '@/lib/i18n'
import { useLanguage } from './LanguageSwitcher'

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
    href: '/btts/predictions/today',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2 a10 10 0 0 1 10 10 l-10 0 z" fill="currentColor" />
      </svg>
    ),
    matchPath: (p) => p === '/btts/predictions/today' || p.startsWith('/btts/') || p.startsWith('/match/'),
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
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const normalizedPathname = pathname.replace(/^\/(en|ar)(?=\/|$)/, '') || '/'
  const tabs = TABS.map(tab => ({
    ...tab,
    href: localizedPath(tab.href, lang),
    label: tab.id === 'home' ? t.nav.home : tab.id === 'predictions' ? t.nav.predictions : t.nav.vip,
  }))
  const [active, setActive] = useState<TabId>('home')

  useEffect(() => {
    const matched = TABS.find(tab => tab.matchPath(normalizedPathname))
    queueMicrotask(() => setActive(matched ? matched.id : 'home'))
  }, [normalizedPathname])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        display: 'flex',
        backgroundColor: 'rgba(7, 17, 26, 0.97)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid #23495C',
        boxShadow: '0 -4px 16px rgba(7, 17, 26, 0.4)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label={lang === 'fr' ? 'Navigation principale' : lang === 'en' ? 'Main navigation' : 'التنقل الرئيسي'}
    >
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <a
            key={tab.id}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6A24C] focus-visible:ring-inset"
            style={{
              color: isActive ? '#E6A24C' : '#B4C4CC',
              minHeight: '52px',
              textShadow: isActive ? '0 0 8px rgba(75, 182, 135, 0.4)' : 'none',
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
                  background: '#E6A24C',
                  boxShadow: '0 0 8px rgba(75, 182, 135, 0.6)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div whileTap={{ scale: 0.88 }}>
              {tab.icon}
            </motion.div>
            <span
              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider"
              style={{ color: isActive ? '#E6A24C' : '#B4C4CC' }}
            >
              {tab.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
