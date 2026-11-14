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

/** Logos fournis par le propriétaire, détourés en assets PNG transparents. */
function NavLogo({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={30}
      height={30}
      className="bottomnav-logo"
      style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }}
    />
  )
}

function IconHome() {
  return <NavLogo src="/logos/nav-home.png" alt="" />
}

function IconBall() {
  return <NavLogo src="/logos/nav-predictions.png" alt="" />
}

function IconCrown() {
  return <NavLogo src="/logos/nav-vip.png" alt="" />
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
    label: tab.id === 'home' ? (lang === 'fr' ? 'Accueil' : t.nav.home) : tab.id === 'predictions' ? (lang === 'fr' ? 'Pronostics' : t.nav.predictions) : t.nav.vip,
  }))
  const [active, setActive] = useState<TabId>('home')

  useEffect(() => {
    const matched = TABS.find(tab => tab.matchPath(normalizedPathname))
    queueMicrotask(() => setActive(matched ? matched.id : 'home'))
  }, [normalizedPathname])

  return (
    <nav
      className="bottomnav-shell fixed bottom-0 left-0 right-0 z-50 flex lg:hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(78px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label={lang === 'fr' ? 'Navigation principale' : lang === 'en' ? 'Main navigation' : 'التنقل الرئيسي'}
    >
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <a
            key={tab.id}
            href={tab.href}
            className={`bottomnav-tab bottomnav-tab--${tab.id} flex-1 flex flex-col items-center justify-center gap-1 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C268] focus-visible:ring-inset ${isActive ? 'is-active' : ''}`}
            style={{ minHeight: '74px' }}
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
                  background: '#E8C268',
                  boxShadow: 'none',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div whileTap={{ scale: 0.88 }}>
              {tab.icon}
            </motion.div>
            <span
              className="text-[12px] font-extrabold uppercase tracking-[0.08em] leading-none"
            >
              {tab.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
