'use client'

import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BOOKMAKERS } from '@/lib/constants'
import LanguageSwitcher, { useLanguage } from './LanguageSwitcher'
import { localizedPath, translationsFor, type Locale } from '@/lib/i18n'
import { trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'
import { GlobalNavigationContext } from './NavigationContext'

type NavLink = { id: string; label: Record<Locale, string>; href: string; icon: string }
type NavGroup = { id: string; label: Record<Locale, string>; links: NavLink[] }

const copy = (lang: Locale, fr: string, en: string, ar: string) => ({ fr, en, ar })[lang]

function NavIcon({ kind }: { kind: string }) {
  const common = { viewBox: '0 0 24 24', 'aria-hidden': true as const }
  switch (kind) {
    case 'home': return <svg {...common}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>
    case 'btts': return <svg {...common}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3"/></svg>
    case 'over': return <svg {...common}><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></svg>
    case 'combined': return <svg {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>
    case 'score': return <svg {...common}><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M8 12h8M12 8v8"/></svg>
    case 'trophy': return <svg {...common}><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"/></svg>
    case 'stats': return <svg {...common}><path d="M4 20V11M10 20V4M16 20v-6M22 20H2"/></svg>
    case 'history': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
    case 'method': return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="5"/><path d="m12 9 1.7 3-3 1.7"/></svg>
    case 'vip': return <svg {...common}><path d="m3 8 5 3 4-7 4 7 5-3-1.5 10h-15L3 8Z"/><path d="M6 21h12"/></svg>
    case 'info': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
    default: return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>
  }
}

function NavItems({ groups, lang, isActive, onNavigate, partnerRoutes }: {
  groups: NavGroup[]
  lang: Locale
  isActive: (href: string) => boolean
  onNavigate?: () => void
  partnerRoutes: Record<string, string>
}) {
  const partnerIds = ['1xbet', 'linebet', 'melbet', '888starz'] as const
  return (
    <>
      {groups.map(group => (
        <section className="fi-nav-group" key={group.id} aria-label={group.label[lang]}>
          <p className="fi-nav-group__label">{group.label[lang]}</p>
          {group.links.map(link => (
            <a
              className="fi-nav-link"
              href={link.href}
              key={link.id}
              aria-current={isActive(link.href) ? 'page' : undefined}
              onClick={onNavigate}
              title={link.label[lang]}
            >
              <span className="fi-nav-icon"><NavIcon kind={link.icon} /></span>
              <span className="fi-nav-link__label">{link.label[lang]}</span>
            </a>
          ))}
          {group.id === 'partners' && partnerIds.map(id => {
            const partner = BOOKMAKERS.find(item => item.id === id)
            if (!partner) return null
            const name: Record<typeof id, string> = { '1xbet': '1xBet', linebet: 'Linebet', melbet: 'MelBet', '888starz': '888Starz' }
            return (
              <a className="fi-nav-link fi-nav-partner" href={partnerRoutes[id]} key={id} onClick={onNavigate} title={name[id]}>
                <span className="fi-nav-partner__logo"><img src={partner.logoFull} alt={`${name[id]} logo`} loading="lazy" /></span>
                <span className="fi-nav-link__label">{name[id]}</span>
                <span className="fi-nav-partner__external" aria-hidden="true">↗</span>
              </a>
            )
          })}
        </section>
      ))}
    </>
  )
}

export default function Navbar({ global = false }: { global?: boolean }) {
  const insideGlobalShell = useContext(GlobalNavigationContext)
  if (insideGlobalShell && !global) return null
  return <NavigationContent />
}

function NavigationContent() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const pathname = usePathname() || '/'
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [dataToday, setDataToday] = useState(false)

  const paths = useMemo(() => ({
    home: localizedPath('/', lang),
    btts: localizedPath('/btts/predictions/today', lang),
    over: localizedPath('/over-2-5/predictions/today', lang),
    combined: localizedPath('/btts-and-over-2-5-predictions-today', lang),
    score: localizedPath('/ai-correct-score-predictions', lang),
    results: localizedPath('/resultats-verifies', lang),
    stats: localizedPath('/statistiques', lang),
    history: localizedPath('/historique', lang),
    method: localizedPath('/methodologie', lang),
    vip: localizedPath('/vip', lang),
    promo1xbet: localizedPath('/code-promo-1xbet', lang),
    promolinebet: localizedPath('/code-promo-linebet-senegal', lang),
    promomelbet: localizedPath('/code-promo-melbet', lang),
    promo888: localizedPath('/bonus-888starz', lang),
    guide: localizedPath('/btts-c-est-quoi', lang),
    responsible: localizedPath('/jouer-responsable', lang),
    terms: localizedPath('/cgu', lang),
    privacy: localizedPath('/politique-confidentialite', lang),
    legal: localizedPath('/mentions-legales', lang),
  }), [lang])

  const groups = useMemo<NavGroup[]>(() => [
    {
      id: 'workspace', label: { fr: 'Espace de travail', en: 'Workspace', ar: 'مساحة العمل' }, links: [
        { id: 'home', label: { fr: 'Match Center', en: 'Match Center', ar: 'مركز المباريات' }, href: `${paths.home}#matchs`, icon: 'home' },
        { id: 'btts', label: { fr: 'Pronostics BTTS', en: 'BTTS predictions', ar: 'توقعات BTTS' }, href: paths.btts, icon: 'btts' },
        { id: 'opportunities', label: { fr: 'Meilleures opportunités', en: 'Top opportunities', ar: 'أفضل الفرص' }, href: `${paths.btts}#opportunities`, icon: 'btts' },
        { id: 'over', label: { fr: 'Pronostics Over 2,5', en: 'Over 2.5 predictions', ar: 'توقعات أكثر من 2.5' }, href: paths.over, icon: 'over' },
        { id: 'combined', label: { fr: 'Vue combinée', en: 'Combined view', ar: 'عرض مشترك' }, href: paths.combined, icon: 'combined' },
        { id: 'score', label: { fr: 'Scores exacts', en: 'Exact scores', ar: 'النتائج الدقيقة' }, href: paths.score, icon: 'score' },
      ],
    },
    {
      id: 'analysis', label: { fr: 'Analyse', en: 'Analysis', ar: 'التحليل' }, links: [
        { id: 'results', label: { fr: 'Résultats vérifiés', en: 'Verified results', ar: 'النتائج الموثقة' }, href: paths.results, icon: 'trophy' },
        { id: 'stats', label: { fr: 'Statistiques', en: 'Statistics', ar: 'الإحصائيات' }, href: paths.stats, icon: 'stats' },
        { id: 'history', label: { fr: 'Historique', en: 'History', ar: 'السجل' }, href: paths.history, icon: 'history' },
        { id: 'method', label: { fr: 'Méthodologie', en: 'Methodology', ar: 'المنهجية' }, href: paths.method, icon: 'method' },
      ],
    },
    {
      id: 'service', label: { fr: 'Services', en: 'Services', ar: 'الخدمات' }, links: [
        { id: 'vip', label: { fr: 'Accès VIP', en: 'VIP access', ar: 'دخول VIP' }, href: paths.vip, icon: 'vip' },
      ],
    },
    { id: 'partners', label: { fr: 'Partenaires', en: 'Partners', ar: 'الشركاء' }, links: [] },
    {
      id: 'information', label: { fr: 'Informations', en: 'Information', ar: 'معلومات' }, links: [
        { id: 'guide', label: { fr: 'Guide BTTS', en: 'BTTS guide', ar: 'دليل BTTS' }, href: paths.guide, icon: 'info' },
        { id: 'responsible', label: { fr: 'Jeu responsable', en: 'Responsible play', ar: 'اللعب المسؤول' }, href: paths.responsible, icon: 'info' },
        { id: 'terms', label: { fr: 'Conditions', en: 'Terms', ar: 'الشروط' }, href: paths.terms, icon: 'info' },
        { id: 'privacy', label: { fr: 'Confidentialité', en: 'Privacy', ar: 'الخصوصية' }, href: paths.privacy, icon: 'info' },
        { id: 'legal', label: { fr: 'Mentions légales', en: 'Legal notice', ar: 'إشعار قانوني' }, href: paths.legal, icon: 'info' },
      ],
    },
  ], [paths])

  const partnerRoutes = useMemo(() => ({ '1xbet': paths.promo1xbet, linebet: paths.promolinebet, melbet: paths.promomelbet, '888starz': paths.promo888 }), [paths])
  const flatLinks = groups.flatMap(group => group.links)
  const activePage = flatLinks.find(link => isActive(link.href))
  const pageTitle = activePage?.label[lang] ?? (lang === 'ar' ? 'مساحة التحليل' : lang === 'en' ? 'Analysis workspace' : 'Espace d’analyse')

  const currentPartner = useMemo(() => {
    if (pathname.includes('code-promo-1xbet')) return BOOKMAKERS.find(item => item.id === '1xbet')
    if (pathname.includes('code-promo-linebet-senegal') || pathname.includes('linebet-promo-code')) return BOOKMAKERS.find(item => item.id === 'linebet')
    if (pathname.includes('code-promo-melbet')) return BOOKMAKERS.find(item => item.id === 'melbet')
    if (pathname.includes('bonus-888starz')) return BOOKMAKERS.find(item => item.id === '888starz')
    return undefined
  }, [pathname])

  useEffect(() => {
    let cancelled = false
    fetch('/predictions.json')
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (cancelled || !data?.lastUpdated) return
        setDataToday(String(data.lastUpdated).slice(0, 10) === new Date().toISOString().slice(0, 10))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const copyCode = useCallback(async () => {
    if (!currentPartner) return
    const ok = await copyTextToClipboard(currentPartner.promoCode)
    if (!ok) return
    trackAffiliateCodeCopy(currentPartner.id, 'global-navigation-promo-code')
    setCopied(true)
    navigator.vibrate?.(15)
    window.setTimeout(() => setCopied(false), 2000)
  }, [currentPartner])

  function isActive(href: string) {
    const clean = href.split('#')[0].replace(/\/$/, '') || '/'
    const current = pathname.replace(/\/$/, '') || '/'
    if (clean === paths.home.replace(/\/$/, '') || clean === '') return current === clean
    return current === clean || current.startsWith(`${clean}/`)
  }

  const appName = 'BTTSPredict'
  const menuLabel = copy(lang, 'Navigation principale', 'Main navigation', 'التنقل الرئيسي')
  const mobileOpenLabel = copy(lang, 'Ouvrir le menu', 'Open menu', 'فتح القائمة')
  const mobileCloseLabel = copy(lang, 'Fermer le menu', 'Close menu', 'إغلاق القائمة')
  const partnerHeading = copy(lang, 'Partenaires', 'Partners', 'الشركاء')
  const footerLabel = copy(lang, 'Données du site', 'Site data', 'بيانات الموقع')
  const copiedText = copy(lang, '✓ Copié', '✓ Copied', '✓ تم النسخ')
  const copyCodeLabel = currentPartner ? copy(lang, `Copier le code ${currentPartner.promoCode}`, `Copy code ${currentPartner.promoCode}`, `نسخ الرمز ${currentPartner.promoCode}`) : ''
  const titleLabel = copy(lang, 'Espace d’analyse', 'Analysis workspace', 'مساحة التحليل')

  return (
    <div className={`fi-navigation${collapsed ? ' is-collapsed' : ''}`}>
      <aside className="fi-sidebar" data-collapsed={collapsed ? 'true' : 'false'} aria-label={menuLabel}>
        <a className="fi-sidebar__brand" href={paths.home} aria-label={`${appName} — ${groups[0].links[0].label[lang]}`}>
          <img src="/brand/bttspredict-logo-3d-final.png?v=20261104b" alt="" width="44" height="44" />
          <span className="fi-brand-copy"><strong>{appName}</strong><small>FOOTBALL INTELLIGENCE</small></span>
        </a>
        <nav className="fi-sidebar__scroll" aria-label={menuLabel}>
          <NavItems groups={groups} lang={lang} isActive={isActive} partnerRoutes={partnerRoutes} />
        </nav>
        <div className="fi-sidebar__foot" title={footerLabel}>
          <span className={`fi-status-dot${dataToday ? ' is-fresh' : ''}`} aria-hidden="true" />
          <span className="fi-sidebar__foot-note">{footerLabel}</span>
          <span className="fi-sidebar__foot-age">{dataToday ? copy(lang, 'À JOUR', 'UPDATED', 'محدّث') : '18+'}</span>
        </div>
      </aside>

      <header className="fi-topbar">
        <div className="fi-topbar__left">
          <button
            type="button"
            className="fi-icon-button fi-mobile-menu"
            aria-label={menuOpen ? mobileCloseLabel : mobileOpenLabel}
            aria-expanded={menuOpen}
            aria-controls="fi-mobile-navigation"
            onClick={() => setMenuOpen(value => !value)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={menuOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
          <a className="fi-mobile-brand" href={paths.home} aria-label={`${appName} — ${groups[0].links[0].label[lang]}`}>
            <img src="/brand/bttspredict-logo-3d-final.png?v=20261104b" alt="" width="32" height="32" /><strong>{appName}</strong><span>FOOTBALL INTELLIGENCE</span>
          </a>
          <div className="fi-topbar__context">
            <span className="fi-topbar__overline">{titleLabel}</span>
            <span className="fi-topbar__divider" aria-hidden="true" />
            <span className="fi-topbar__page">{pageTitle}</span>
          </div>
        </div>
        <div className="fi-topbar__actions">
          {dataToday && <span className="fi-topbar__fresh"><span className="fi-status-dot" aria-hidden="true" />{copy(lang, 'Données actualisées', 'Data updated', 'تم تحديث البيانات')}</span>}
          {currentPartner && <button type="button" onClick={copyCode} className="fi-topbar__promo" aria-label={copyCodeLabel}>{copied ? copiedText : currentPartner.promoCode}</button>}
          <LanguageSwitcher compact />
          <a className="fi-topbar__vip" href={paths.vip} aria-label={copy(lang, 'Ouvrir l’accès VIP', 'Open VIP access', 'فتح دخول VIP')}>
            <NavIcon kind="vip" /><span>{t.nav.vip}</span>
          </a>
          <button
            type="button"
            className="fi-icon-button fi-collapse-toggle"
            aria-label={collapsed ? copy(lang, 'Développer la navigation', 'Expand navigation', 'توسيع القائمة') : copy(lang, 'Replier la navigation', 'Collapse navigation', 'طيّ القائمة')}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(value => !value)}
            title={collapsed ? copy(lang, 'Développer la navigation', 'Expand navigation', 'توسيع القائمة') : copy(lang, 'Replier la navigation', 'Collapse navigation', 'طيّ القائمة')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={collapsed ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} /></svg>
          </button>
        </div>
      </header>

      {menuOpen && <>
        <button type="button" className="fi-nav-backdrop" aria-label={mobileCloseLabel} onClick={() => setMenuOpen(false)} />
        <aside className="fi-nav-drawer" id="fi-mobile-navigation" role="dialog" aria-modal="true" aria-label={menuLabel}>
          <div className="fi-nav-drawer__head">
            <a className="fi-mobile-brand" href={paths.home} onClick={() => setMenuOpen(false)}>
              <img src="/brand/bttspredict-logo-3d-final.png?v=20261104b" alt="" width="32" height="32" /><strong>{appName}</strong>
            </a>
            <div className="fi-topbar__actions"><LanguageSwitcher compact /><button type="button" className="fi-icon-button" aria-label={mobileCloseLabel} onClick={() => setMenuOpen(false)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button></div>
          </div>
          <nav className="fi-nav-drawer__scroll" aria-label={menuLabel}>
            <NavItems groups={groups} lang={lang} isActive={isActive} onNavigate={() => setMenuOpen(false)} partnerRoutes={partnerRoutes} />
          </nav>
          <div className="fi-nav-drawer__foot"><div className="fi-sidebar__foot"><span className={`fi-status-dot${dataToday ? ' is-fresh' : ''}`} aria-hidden="true"/><span className="fi-sidebar__foot-note">{footerLabel}</span><span className="fi-sidebar__foot-age">{dataToday ? copy(lang, 'À JOUR', 'UPDATED', 'محدّث') : '18+'}</span></div></div>
        </aside>
      </>}
    </div>
  )
}
