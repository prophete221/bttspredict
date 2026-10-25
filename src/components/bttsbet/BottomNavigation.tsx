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

/** Icônes détaillées (style app premium) — currentColor pour l’état actif */
function IconHome() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bnHomeRoof" x1="4" y1="3" x2="20" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="1" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <path d="M3.5 10.2L12 3.5l8.5 6.7v9.3a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8v-9.3z" fill="url(#bnHomeRoof)" opacity="0.2" />
      <path d="M4 10.5L12 4l8 6.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 9.8V19.2a1 1 0 0 0 1 1h9.6a1 1 0 0 0 1-1V9.8" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 20.2V14.5a1.2 1.2 0 0 1 1.2-1.2h2.6a1.2 1.2 0 0 1 1.2 1.2v5.7" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="11.2" r="1.05" fill="currentColor" />
    </svg>
  )
}

function IconBall() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" fill="currentColor" opacity="0.14" />
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.75" />
      {/* Panneau central type ballon */}
      <path d="M12 7.2l2.35 1.7-.9 2.75H10.55l-.9-2.75L12 7.2z" fill="currentColor" opacity="0.95" />
      <path d="M12 7.2V5.1M14.35 8.9l1.85-1.35M13.45 11.65l1.9 1.25M10.55 11.65l-1.9 1.25M9.65 8.9L7.8 7.55" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M8.2 14.3l1.55 1.05-.35 2.1M15.8 14.3l-1.55 1.05.35 2.1M9.4 17.45h5.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.1 10.2c-.55 1.1-.85 2.35-.85 3.55 0 1.05.2 2.05.55 2.95M16.9 10.2c.55 1.1.85 2.35.85 3.55 0 1.05-.2 2.05-.55 2.95" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

function IconCrown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.2 16.8L3 7.5l4.6 3.4L12 5.2l4.4 5.7L21 7.5l-1.2 9.3H4.2z" fill="currentColor" opacity="0.18" />
      <path d="M3.2 7.6l4.5 3.3L12 4.8l4.3 6.1 4.5-3.3-.4 1.2-1.1 8.4H4.7L3.6 8.8 3.2 7.6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M5.2 18.6h13.6v1.7H5.2z" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="12.2" r="1.15" fill="currentColor" />
      <circle cx="7.6" cy="12.8" r="0.85" fill="currentColor" opacity="0.9" />
      <circle cx="16.4" cy="12.8" r="0.85" fill="currentColor" opacity="0.9" />
      <circle cx="12" cy="5.5" r="1" fill="currentColor" />
    </svg>
  )
}

const TABS: Tab[] = [
  {
    id: 'home',
    label: 'Accueil',
    href: '/',
    icon: <IconHome />,
    matchPath: (p) => p === '/',
  },
  {
    id: 'predictions',
    label: 'Pronos',
    href: '/btts/predictions/today',
    icon: <IconBall />,
    matchPath: (p) => p === '/btts/predictions/today' || p.startsWith('/btts/') || p.startsWith('/match/') || p.includes('/over-2-5') || p.includes('/btts-and-over'),
  },
  {
    id: 'vip',
    label: 'VIP',
    href: '/vip',
    icon: <IconCrown />,
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
      className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden"
      style={{
        backgroundColor: 'rgba(7, 11, 18, 0.97)',
        backdropFilter: 'blur(18px) saturate(170%)',
        WebkitBackdropFilter: 'blur(18px) saturate(170%)',
        borderTop: '1px solid rgba(51, 65, 85, 0.55)',
        boxShadow: '0 -8px 28px rgba(0, 0, 0, 0.45)',
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
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF] focus-visible:ring-inset"
            style={{
              color: isActive
                ? (tab.id === 'vip' ? '#E8C268' : tab.id === 'predictions' ? '#22D3EE' : '#3B82F6')
                : '#94A3B8',
              minHeight: '52px',
              textShadow: 'none',
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
                  background: '#2F7DFF',
                  boxShadow: 'none',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div whileTap={{ scale: 0.88 }}>
              {tab.icon}
            </motion.div>
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{
                color: isActive
                  ? (tab.id === 'vip' ? '#E8C268' : tab.id === 'predictions' ? '#22D3EE' : '#3B82F6')
                  : '#94A3B8',
              }}
            >
              {tab.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
