'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'
import { AFFILIATE, SITE } from '@/lib/constants'
import AffiliateSignupCta from './AffiliateSignupCta'
import { trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

interface WinHistoryStats {
  total?: number
  won?: number
  lost?: number
  pending?: number
  rate?: number
  displayedWinRate?: number
}

/**
 * Hero — composition SaaS « sports analytics » :
 * 1. barre méta discrète (analyse en direct + fuseau),
 * 2. titre court = unique focus visuel,
 * 3. CTA dominant vers les analyses du jour (+ lien secondaire),
 * 4. mini-dashboard de preuves alimenté UNIQUEMENT par win-history.json
 *    (aucune statistique inventée — si la donnée manque, rien ne s'affiche),
 * 5. funnel DONNÉES → ANALYSE → PRONOSTIC → ACTION,
 * 6. module partenaire LINEBET compact et subordonné au contenu éditorial.
 */
export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [stats, setStats] = useState<WinHistoryStats | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/win-history.json')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!cancelled && data?.stats) setStats(data.stats)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => () => {
    if (copyTimer.current) window.clearTimeout(copyTimer.current)
  }, [])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
      trackAffiliateCodeCopy('linebet', 'home-hero-partner')
      setCopied(true)
      if (copyTimer.current) window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* presse-papiers indisponible : pas de feedback, pas d'erreur bloquante */
    }
  }

  const verified = stats?.total
  const winRate = stats?.rate ?? stats?.displayedWinRate
  const funnelSteps = [t.hero.funnelData, t.hero.funnelAnalysis, t.hero.funnelPick, t.hero.funnelAction]

  return (
    <section ref={sectionRef} className="home-hero relative overflow-hidden">
      <div className="home-hero__media" aria-hidden="true" />
      <div className="home-hero__grid" aria-hidden="true" />
      <div className="home-hero__veil" aria-hidden="true" />

      <div
        className="home-hero__inner relative z-10 mx-auto max-w-[1180px] px-4 pb-7 pt-5 sm:px-6 sm:pb-10 sm:pt-8"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 360ms ease, transform 360ms ease',
        }}
      >
        <div className="home-hero__layout">
          <div className="home-hero__copy">
            <div className="home-hero__meta">
              <span className="home-hero__badge" aria-label={t.hero.liveData}>
                <span className="home-hero__badge-dot" aria-hidden="true" />
                <span>{t.hero.liveData}</span>
              </span>
              <span className="home-hero__timezone">{t.hero.timezone}</span>
            </div>

            <h1>
              {t.hero.title1}
              <span className="home-hero__title-accent">{t.hero.title2}</span>
            </h1>

            <p className="home-hero__subtitle">{t.hero.subtitle}</p>

            <div className="home-hero__actions">
              <a href="#free-predictions" className="home-hero__cta" data-cta="hero-primary">
                {t.hero.cta}
                <span aria-hidden="true">→</span>
              </a>
              <a href="/methodologie" className="home-hero__cta-secondary" data-cta="hero-secondary">
                {t.hero.ctaSecondary}
              </a>
            </div>

            <p className="home-hero__note">{t.hero.note18}</p>
          </div>

          <div className="home-hero__panel">
            {/* Élément analytics purement décoratif : aucune valeur chiffrée inventée */}
            <div className="home-hero__trend" aria-hidden="true">
              <span className="home-hero__trend-label">{t.hero.trendLabel}</span>
              <svg className="home-hero__trend-spark" viewBox="0 0 96 24" focusable="false">
                <polyline points="0,19 12,17 24,18 36,13 48,14 60,10 72,11 84,6 96,4" />
              </svg>
            </div>

            {/* Preuves chiffrées — 100 % issues de win-history.json */}
            {verified !== undefined && (
              <div className="home-hero__stats">
                {winRate !== undefined && (
                  <div className="home-hero__stat">
                    <span className="home-hero__stat-value home-hero__stat-value--win">
                      {winRate.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR', { minimumFractionDigits: 1 })}
                      &nbsp;%
                    </span>
                    <span className="home-hero__stat-label">{t.hero.statsRate}</span>
                  </div>
                )}
                <div className="home-hero__stat">
                  <span className="home-hero__stat-value">{verified}</span>
                  <span className="home-hero__stat-label">{t.hero.statsTotal}</span>
                </div>
                {stats?.won !== undefined && stats?.lost !== undefined && (
                  <div className="home-hero__stat">
                    <span className="home-hero__stat-value">{stats.won}W&nbsp;·&nbsp;{stats.lost}L</span>
                    <span className="home-hero__stat-label">{t.hero.statsRecord}</span>
                  </div>
                )}
              </div>
            )}

            {/* Funnel éditorial — fine ligne de progression, pas des cartes */}
            <div className="home-hero__funnel">
              {funnelSteps.map((label, i) => (
                <Fragment key={label}>
                  {i > 0 && (
                    <span className="home-hero__funnel-arrow" aria-hidden="true">→</span>
                  )}
                  <span className={`home-hero__funnel-step${i === funnelSteps.length - 1 ? ' home-hero__funnel-step--action' : ''}`}>
                    <i aria-hidden="true">0{i + 1}</i>
                    {label}
                  </span>
                </Fragment>
              ))}
            </div>

            {/* Module partenaire — compact, premium, subordonné au contenu */}
            <aside className="home-hero__partner" aria-label="LINEBET, partenaire">
              <span className="home-hero__partner-eyebrow">{t.hero.partnerEyebrow}</span>
              <p className="home-hero__partner-question">{t.hero.partnerQuestion}</p>
              <p className="home-hero__partner-join">{t.hero.partnerJoin}</p>
              <div className="home-hero__partner-promo">
                <span className="home-hero__partner-promo-label">{t.hero.promoLabel}</span>
                <code className="home-hero__partner-code">{SITE.promoCode}</code>
                <button
                  type="button"
                  className={`home-hero__partner-copy${copied ? ' is-copied' : ''}`}
                  onClick={handleCopyCode}
                >
                  {copied ? t.hero.copied : t.hero.copy}
                </button>
              </div>
              <p className="home-hero__partner-bonus">{t.hero.bonus}</p>
              <AffiliateSignupCta
                href={AFFILIATE.linebet}
                partner="linebet"
                placement="home-hero-partner"
                className="home-hero__partner-cta"
              >
                {t.hero.partnerCta}
                <span aria-hidden="true">→</span>
              </AffiliateSignupCta>
              <p className="home-hero__partner-disclaimer">{t.hero.partnerDisclaimer}</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
