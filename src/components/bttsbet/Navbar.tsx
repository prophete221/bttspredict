'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SITE } from '@/lib/constants'
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
 * - Droite : code VISION221 (copie trackée), langues, CTA principal pronostics.
 * - Mobile : logo + menu (drawer) + CTA compact.
 */
export default function Navbar() {
  const { lang } = useLanguage()
  const t = translationsFor(lang)
  const pathname = usePathname()
  const home = localizedPath('/', lang)
  const pageLinks = [
    { label: t.nav.matchs, href: `${home}#matchs` },
    { label: t.nav.results, href: localizedPath('/resultats-verifies', lang) },
    { label: t.nav.history, href: localizedPath('/historique', lang) },
    { label: t.nav.methodology, href: localizedPath('/methodologie', lang) },
    { label: t.nav.stats2, href: localizedPath('/statistiques', lang) },
  ]
  const partnerLinks = [
    { label: '1xBet', href: localizedPath('/code-promo-1xbet', lang), code: 'Vipbtts', primary: true },
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
  const navPromoCode = is1xbetPage ? 'Vipbtts' : isMelbetPage ? 'Bttswin' : is888Page ? 'btts221' : SITE.promoCode
  const navPartner: 'linebet' | '888starz' | '1xbet' | 'melbet' = is1xbetPage ? '1xbet' : isMelbetPage ? 'melbet' : is888Page ? '888starz' : 'linebet'

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
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Logo */}
            <a
              href={home}
              className="flex items-center gap-2 flex-shrink-0"
              aria-label={`BTTSPredict — ${t.nav.home}`}
            >
              <img src="/favicon.svg" alt="" width={26} height={26} className="flex-shrink-0 rounded" />
              <span>
                <span className="block text-sm font-semibold leading-tight tracking-tight" style={{ color: '#E8EDF2' }}>BTTSPredict</span>
                <span className="block max-[379px]:hidden text-[10px] font-medium uppercase tracking-[0.14em] leading-none" style={{ color: '#8B97A6' }}>Football data</span>
              </span>
            </a>

            {/* Nav produit — desktop */}
            <div className="hidden lg:flex items-center gap-0.5">
              {pageLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`ds-nav-link whitespace-nowrap ${isActive(link.href) ? 'is-active' : ''}`}
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
                  className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap"
                  style={{ color: '#86E9BC', backgroundColor: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.22)' }}
                  title={t.home2.statusUpdated}
                >
                  <span className="hp-status-dot" aria-hidden="true" />
                  {t.home2.statusUpdated}
                </span>
              )}
              <LanguageSwitcher compact />
              <button
                onClick={copyCode}
                className="ds-code hidden md:inline-flex"
                style={copied ? { color: '#34D399' } : undefined}
                aria-label={lang === 'en' ? `Copy promo code ${navPromoCode}` : lang === 'ar' ? `انسخ الرمز الترويجي ${navPromoCode}` : `Copier le code promo ${navPromoCode}`}
              >
                {copied ? (lang === 'en' ? '✓ Copied' : lang === 'ar' ? '✓ تم النسخ' : '✓ Copié') : navPromoCode}
              </button>

              {/* CTA principal — desktop */}
              <a
                href={`${home}#matchs`}
                data-cta="navbar-open-picks"
                className="hidden sm:inline-flex items-center px-3.5 h-9 rounded-lg text-[13px] font-bold whitespace-nowrap transition-all hp-cta-primary"
              >
                {t.nav.ctaPronostics}
              </a>

              {/* Hamburger — mobile/tablette */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-papier hover:bg-white/[0.06] transition-colors"
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
            className="nav-drawer-backdrop fixed inset-0 z-[60] lg:hidden"
            style={{ backgroundColor: 'rgba(3, 6, 12, 0.72)', backdropFilter: 'blur(6px)' }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            className="nav-drawer ds-drawer fixed top-0 left-0 right-0 z-[70] lg:hidden flex flex-col"
            style={{ maxHeight: 'min(92vh, 680px)' }}
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
                <img src="/favicon.svg" alt="" width={22} height={22} className="rounded flex-shrink-0" />
                <div className="min-w-0">
                  <span className="block text-sm font-bold text-papier leading-tight">{t.nav.menu}</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary leading-none mt-0.5">
                    BTTSPredict
                  </span>
                </div>
              </div>
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

            <div className="overflow-y-auto flex-1 overscroll-contain">
              {/* Liens principaux en grille */}
              <nav className="px-3 pt-3 pb-2" aria-label={t.nav.menu}>
                <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#64748B' }}>
                  {lang === 'en' ? 'Navigate' : lang === 'ar' ? 'تصفح' : 'Navigation'}
                </p>
                <div className="grid grid-cols-1">
                  {pageLinks.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="ds-drawer-link"
                        aria-current={active ? 'page' : undefined}
                      >
                        <span>{link.label}</span>
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
                <div className="grid grid-cols-1">
                  {partnerLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="ds-drawer-link"
                    >
                      <span>{link.label}</span>
                      <span className="font-mono text-xs" style={{ color: '#8B97A6' }}>{link.code}</span>
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
              <button
                onClick={() => { copyCode(); setMenuOpen(false) }}
                className="w-full px-3 py-3 rounded-xl text-sm font-mono font-semibold text-center transition-colors"
                style={{
                  border: '1px solid rgba(59, 130, 246, 0.45)',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: copied ? '#34D399' : '#93C5FD',
                }}
              >
                {copied ? (lang === 'en' ? '✓ Copied' : lang === 'ar' ? '✓ تم النسخ' : '✓ Copié') : navPromoCode}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
