'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { BOOKMAKERS } from '@/lib/constants'
import LanguageSwitcher, { useLanguage } from './LanguageSwitcher'
import { localizedPath, translationsFor } from '@/lib/i18n'
import { trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'

/**
 * Navbar BTTSPredict — header plateforme « football intelligence ».
 *
 * - Navigation produit : Matchs du jour (#matchs), Résultats, Historique,
 *   Méthode, Statistiques — uniquement des pages/ancres réelles.
 * - Statut données : point vert « Données mises à jour aujourd’hui »
 *   AFFICHÉ UNIQUEMENT SI VRAI (date de predictions.json == aujourd’hui, UTC — Dakar = UTC+0).
 * - Droite : code partenaire uniquement dans sa page dédiée, langues, CTA pronostics.
 * - Mobile : logo + menu (drawer) + CTA compact.
 */
export default function Navbar() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const pathname = usePathname()
  const home = localizedPath('/', lang)
  const pageLinks = [
    { label: t.nav.matchs, href: `${home}#matchs` },
    { label: lang === 'fr' ? 'Meilleures opportunités' : lang === 'ar' ? 'أفضل الفرص' : 'Top opportunities', href: `${localizedPath('/btts/predictions/today', lang)}#opportunities` },
    { label: t.nav.results, href: localizedPath('/resultats-verifies', lang) },
    { label: t.nav.history, href: localizedPath('/historique', lang) },
    { label: t.nav.methodology, href: localizedPath('/methodologie', lang) },
    { label: t.nav.stats2, href: localizedPath('/statistiques', lang) },
  ]
  const partnerLinks = [
    { label: '1xBet', href: localizedPath('/code-promo-1xbet', lang), code: 'vipbtts', primary: true },
    { label: 'Linebet', href: localizedPath('/code-promo-linebet-senegal', lang), code: 'VISION221', primary: true },
    { label: 'Melbet', href: localizedPath('/code-promo-melbet', lang), code: 'Bttswin', primary: false },
    { label: '888Starz', href: localizedPath('/bonus-888starz', lang), code: 'btts221', primary: false },
  ]
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dataToday, setDataToday] = useState(false)

  // Statut données — strictement factuel : date(lastUpdated) == aujourd’hui (UTC)
  useEffect(() => {
    let cancelled = false
    fetch('/predictions.json')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (cancelled || !d?.lastUpdated) return
        const updatedDay = String(d.lastUpdated).slice(0, 10)
        setDataToday(updatedDay === new Date().toISOString().slice(0, 10))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  /* Code promo contextuel par page : casse exacte de chaque bookmaker.
     1xbet et Linebet prioritaires ; Melbet et 888Starz contextuels. */
  const is888Page = pathname?.includes('bonus-888starz') ?? false
  const is1xbetPage = pathname?.includes('code-promo-1xbet') ?? false
  const isMelbetPage = pathname?.includes('code-promo-melbet') ?? false
  const isLinebetPage = pathname?.includes('code-promo-linebet-senegal') || pathname?.includes('linebet-promo-code')
  const navPartnerId = is1xbetPage ? '1xbet' : isMelbetPage ? 'melbet' : is888Page ? '888starz' : isLinebetPage ? 'linebet' : null
  const navPromoCode = navPartnerId ? BOOKMAKERS.find(bookmaker => bookmaker.id === navPartnerId)?.promoCode ?? '' : ''
  const navPartner: 'linebet' | '888starz' | '1xbet' | 'melbet' = navPartnerId ?? 'linebet'

  const copyCode = useCallback(async () => {
    // « Copié » n'est affiché que si la copie a réellement réussi
    const ok = await copyTextToClipboard(navPromoCode)
    if (!ok) return
    trackAffiliateCodeCopy(navPartner, 'navbar-promo-code')
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }, [navPromoCode, navPartner])

  const isActive = (href: string) => {
    const clean = href.split('#')[0]
    if (clean === '/' || clean === localizedPath('/', lang)) return pathname === clean || pathname === ''
    return pathname === clean || pathname.startsWith(clean + '/')
  }

  return (
    <>
      <nav
        className="sticky top-0 z-50 navbar-blur"
        aria-label={lang === 'en' ? 'Main navigation' : lang === 'ar' ? 'التنقل الرئيسي' : 'Navigation principale'}
        style={{
          backgroundColor: '#0B131C',
          borderBottom: '1px solid rgba(219, 230, 234, 0.14)',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px] min-[801px]:h-[72px] gap-3">
            {/* Logo */}
            <a
              href={home}
              className="nav-brand flex items-center gap-2 flex-shrink-0"
              aria-label={`BTTSPredict Match Intelligence — ${t.nav.home}`}
            >
              <img src="/favicon.svg" alt="" width={31} height={31} className="bp-brand-icon flex-shrink-0 rounded" />
              <span className="min-w-0">
                <span className="nav-brand-name block text-sm font-bold leading-tight text-papier tracking-tight">BTTSPredict</span>
                <span className="nav-brand-sub block max-[359px]:hidden text-[10px] font-semibold uppercase tracking-[0.18em] leading-none">Match Intelligence</span>
              </span>
            </a>

            {/* Nav produit — desktop */}
            <div className="nav-main hidden min-[801px]:flex items-center flex-1 justify-center">
              {pageLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="nav-main__link whitespace-nowrap transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Actions droite */}
            <div className="flex items-center gap-2">
              {/* Statut données — seulement si techniquement vrai */}
              {dataToday && (
                <span
                  className="hidden min-[1100px]:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                  style={{ color: '#86E9BC', backgroundColor: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.22)' }}
                  title={t.home2.statusUpdated}
                >
                  <span className="hp-status-dot" aria-hidden="true" />
                  {t.home2.statusUpdated}
                </span>
              )}
              <div className="hidden min-[801px]:block"><LanguageSwitcher compact /></div>
              {navPartnerId && <button
                onClick={copyCode}
                className="hidden items-center px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors"
                style={{
                  border: '1px solid rgba(47, 125, 255, 0.45)',
                  backgroundColor: 'rgba(47, 125, 255, 0.10)',
                  color: copied ? '#34D399' : '#4A90FF',
                }}
                aria-label={lang === 'en' ? `Copy promo code ${navPromoCode}` : lang === 'ar' ? `انسخ الرمز الترويجي ${navPromoCode}` : `Copier le code promo ${navPromoCode}`}
              >
                {copied ? (lang === 'en' ? '✓ Copied' : lang === 'ar' ? '✓ تم النسخ' : '✓ Copié') : navPromoCode}
              </button>}

              {/* CTA principal — desktop */}
              <a
                href={`${home}#matchs`}
                data-cta="navbar-open-picks"
                className="hidden min-[1100px]:inline-flex items-center px-3.5 h-9 rounded-lg text-[13px] font-bold whitespace-nowrap transition-all hp-cta-primary"
              >
                {t.nav.ctaPronostics}
              </a>

              {/* Hamburger — mobile/tablette */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="min-[801px]:hidden flex items-center justify-center w-9 h-9 rounded-lg text-papier hover:bg-white/[0.06] transition-colors"
                aria-label={t.nav.openMenu}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* === DRAWER MOBILE — design plateforme === */}
      {menuOpen && (
        <>
          <div
            className="nav-drawer-backdrop fixed inset-0 z-[60] min-[801px]:hidden"
            style={{ backgroundColor: 'rgba(3, 6, 12, 0.72)', backdropFilter: 'blur(6px)' }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            className="nav-drawer fixed top-0 left-0 right-0 z-[70] min-[801px]:hidden flex flex-col"
            style={{
              maxHeight: 'min(94vh, 720px)',
              background: 'linear-gradient(165deg, #0E1624 0%, #0A1018 55%, #080D14 100%)',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              borderBottom: '1px solid rgba(59, 130, 246, 0.22)',
              boxShadow: '0 28px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(148,163,184,0.06)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.45)' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img src="/favicon.svg" alt="" width={31} height={31} className="bp-brand-icon rounded flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-sm font-bold text-papier leading-tight">BTTSPredict</span>
                  <span className="nav-brand-sub block text-[9px] font-semibold uppercase tracking-[0.16em] leading-none mt-0.5">Match Intelligence</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSwitcher compact />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-cendre hover:text-papier transition-colors flex-shrink-0"
                style={{ backgroundColor: 'rgba(148, 163, 184, 0.08)', border: '1px solid rgba(51, 65, 85, 0.5)' }}
                aria-label={t.nav.closeMenu}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 overscroll-contain">
              {/* Liens principaux en grille */}
              <nav className="nav-drawer-main px-3 pt-3 pb-2" aria-label={t.nav.menu}>
                <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#64748B' }}>
                  {lang === 'en' ? 'Navigate' : lang === 'ar' ? 'تصفح' : 'Navigation'}
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {pageLinks.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all"
                        style={
                          active
                            ? {
                                color: '#F8FAFC',
                                background: 'linear-gradient(135deg, rgba(59,130,246,0.22), rgba(34,211,238,0.08))',
                                border: '1px solid rgba(59, 130, 246, 0.4)',
                                boxShadow: '0 0 0 1px rgba(59,130,246,0.08) inset',
                              }
                            : {
                                color: '#CBD5E1',
                                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                                border: '1px solid rgba(51, 65, 85, 0.55)',
                              }
                        }
                      >
                        <span>{link.label}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: active ? 1 : 0.35 }}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </a>
                    )
                  })}
                </div>
              </nav>

              {dataToday && (
                <div className="px-4 py-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: '#6EE7B7', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.28)' }}
                  >
                    <span className="hp-status-dot" aria-hidden="true" />
                    {t.home2.statusUpdated}
                  </span>
                </div>
              )}

              {/* Partenaires */}
              <div className="px-3 pt-2 pb-1">
                <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#64748B' }}>
                  {lang === 'en' ? 'Partners' : lang === 'ar' ? 'شركاء' : 'Partenaires'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {partnerLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex flex-col items-center justify-center gap-0.5 px-2.5 py-3 rounded-2xl text-center transition-all active:scale-[0.98]"
                      style={{
                        color: '#F1F5F9',
                        background: link.primary
                          ? 'linear-gradient(145deg, rgba(27,110,243,0.22) 0%, rgba(15,23,42,0.95) 100%)'
                          : 'rgba(15, 23, 42, 0.88)',
                        border: link.primary
                          ? '1px solid rgba(59, 130, 246, 0.45)'
                          : '1px solid rgba(51, 65, 85, 0.65)',
                        boxShadow: link.primary ? '0 0 20px rgba(27,110,243,0.12)' : 'none',
                      }}
                    >
                      <span className="text-sm font-bold leading-tight">{link.label}</span>
                      <span className="text-[10px] font-mono font-semibold tracking-wide" style={{ color: link.primary ? '#93C5FD' : '#94A3B8' }}>
                        {link.code}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA sticky bas du drawer */}
            <div
              className="px-3 pt-2 pb-3 flex-shrink-0 grid gap-2"
              style={{
                borderTop: '1px solid rgba(51, 65, 85, 0.45)',
                background: 'linear-gradient(180deg, transparent, rgba(12, 18, 28, 0.95))',
                paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
              }}
            >
              <a
                href={`${home}#matchs`}
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center w-full px-3 py-3 rounded-xl text-sm font-bold hp-cta-primary"
                style={{ borderRadius: 12 }}
              >
                {t.nav.ctaPronostics}
              </a>
              {navPartnerId && <button
                onClick={() => { copyCode(); setMenuOpen(false) }}
                className="w-full px-3 py-3 rounded-xl text-sm font-mono font-semibold text-center transition-colors"
                style={{
                  border: '1px solid rgba(59, 130, 246, 0.45)',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: copied ? '#34D399' : '#93C5FD',
                }}
              >
                {copied ? (lang === 'en' ? '✓ Copied' : lang === 'ar' ? '✓ تم النسخ' : '✓ Copié') : navPromoCode}
              </button>}
            </div>
          </div>
        </>
      )}
    </>
  )
}
