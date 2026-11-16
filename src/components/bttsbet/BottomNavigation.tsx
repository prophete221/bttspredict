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

/** REFONTE 2026 — famille d'icônes SVG unique, trait 1.5, colorée via currentColor
    (suit l'état actif de l'onglet). Remplace les anciens PNG emoji hétérogènes. */
function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="bottomnav-logo"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function IconHome() {
  return (
    <NavIcon>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
    </NavIcon>
  )
}

function IconBall() {
  return (
    <NavIcon>
      {/* Ballon : cercle + pentagone central + rayons */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8.5 15.4 11l-1.3 4h-4.2L8.6 11z" />
      <path d="M12 3v5.5M15.4 11l5.2-1.7M14.1 15l3.2 4.4M9.9 15l-3.2 4.4M8.6 11 3.4 9.3" />
    </NavIcon>
  )
}

function IconCrown() {
  return (
    <NavIcon>
      <path d="M3.5 8.5 6.5 17h11l3-8.5-4.4 2.2L12 5l-4.1 5.7z" />
      <path d="M6.5 20.5h11" />
    </NavIcon>
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
    label: 'Pronostics',
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

  // L’arabe est conservé uniquement sur les pages promo; les trois onglets
  // globaux n’ont donc pas de destinations arabes publiées.
  if (lang === 'ar') return null

  return (
    <nav
      className="bottomnav-shell fixed bottom-0 left-0 right-0 z-50 flex lg:hidden"
      dir="ltr"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(68px + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label={lang === 'fr' ? 'Navigation principale' : lang === 'en' ? 'Main navigation' : 'التنقل الرئيسي'}
    >
      {tabs.map(tab => {
        const isActive = active === tab.id
        return (
          <a
            key={tab.id}
            href={tab.href}
            className={`bottomnav-tab bottomnav-tab--${tab.id} flex-1 flex flex-col items-center justify-center gap-1 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B9CF0] focus-visible:ring-inset ${isActive ? 'is-active' : ''}`}
            style={{ minHeight: '62px' }}
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
                  background: 'var(--accent, #2F7DFF)',
                  boxShadow: 'none',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div whileTap={{ scale: 0.88 }}>
              {tab.icon}
            </motion.div>
            <span
              className="text-[12px] font-semibold leading-none normal-case tracking-normal"
            >
              {tab.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
