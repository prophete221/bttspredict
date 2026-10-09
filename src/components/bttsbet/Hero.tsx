'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'
import { AFFILIATE, SITE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { useCountUp } from '@/hooks/useAnimations'
import VectorWordmark from './VectorWordmark'
import MovingGradientButton from './MovingGradientButton'

interface WinHistoryStats {
  total?: number
  won?: number
  lost?: number
  pending?: number
  rate?: number
  displayedWinRate?: number
}

/** Compteur animé réutilisable — ne monte que lorsque la donnée réelle existe. */
function HeroStat({
  value,
  decimals = 0,
  suffix,
  label,
  accent,
  lang,
}: {
  value: number
  decimals?: number
  suffix?: string
  label: string
  accent?: boolean
  lang: string
}) {
  const [ref, display] = useCountUp(value, 1600, { decimals })
  const shown = lang === 'fr' ? display.replace('.', ',') : display
  return (
    <span className="home-hero__stat">
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={`home-hero__stat-value${accent ? ' home-hero__stat-value--win' : ''}`}
      >
        {shown}
        {suffix}
      </span>
      <span className="home-hero__stat-label">{label}</span>
    </span>
  )
}

const FUNNEL_KEYS = ['funnelData', 'funnelAnalysis', 'funnelPick', 'funnelAction'] as const
const FUNNEL_ICONS = ['▤', '◈', '◎', '➜']

/**
 * Hero — première impression de la plateforme.
 * V3 motion design : wordmark vectoriel animé (VectorWordmark), funnel
 * Données→Analyse→Pronostic→Action, bouton MovingGradientButton, preuves
 * chiffrées count-up alimentées UNIQUEMENT par win-history.json, panneau
 * partenaire LINEBET (code VISION221 suivi).
 */
export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [stats, setStats] = useState<WinHistoryStats | null>(null)
  const [funnelStep, setFunnelStep] = useState(0)
  const [copied, setCopied] = useState(false)

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

  // Funnel : chaque étape s'allume en boucle (pausée entre deux tours).
  useEffect(() => {
    const id = setInterval(() => {
      setFunnelStep(s => (s + 1) % (FUNNEL_KEYS.length + 1))
    }, 1250)
    return () => clearInterval(id)
  }, [])

  const verified = stats?.total
  const winRate = stats?.rate ?? stats?.displayedWinRate

  // Référence stable : évite de relancer l'animation du wordmark à chaque
  // re-render du Hero (funnel, stats, copie…).
  const wordmarkLines = useMemo(
    () => [t.hero.title1, t.hero.title2],
    [t.hero.title1, t.hero.title2]
  )

  const handleCopyCode = () => {
    trackAffiliateCodeCopy('linebet', 'home-hero')
    const done = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(SITE.promoCode).then(done).catch(done)
      return
    }
    // Fallback legacy (Android/iOS anciens)
    try {
      const ta = document.createElement('textarea')
      ta.value = SITE.promoCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    } catch { /* silence */ }
    done()
  }

  return (
    <section className="home-hero relative overflow-hidden">
      <div className="home-hero__media" aria-hidden="true" />
      <div className="home-hero__veil" aria-hidden="true" />
      <div className="home-hero__grid" aria-hidden="true" />

      <div className="home-hero__inner relative z-10 mx-auto max-w-[1180px] px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
        <div className="home-hero__layout">
          <div className="home-hero__copy">
            <div className="home-hero__meta">
              <span className="home-hero__badge" aria-label={t.hero.liveData}>
                <span className="home-hero__badge-dot" aria-hidden="true" />
                <span>LIVE</span>
              </span>
              <span className="home-hero__timezone">{t.hero.timezone}</span>
            </div>

            {/* SEO/WCAG : vrai h1 lisible par les moteurs et lecteurs d'écran */}
            <h1 className="sr-only">{t.hero.title1} {t.hero.title2}</h1>

            {/* Wordmark vectoriel animé (décoratif) */}
            <div className="home-hero__wordmark" aria-hidden="true">
              <VectorWordmark lines={wordmarkLines} lang={lang} />
              <span className="home-hero__trend-chip">
                <span className="home-hero__trend-dot" aria-hidden="true" />
                {t.hero.trendLabel}
              </span>
            </div>

            <p className="home-hero__subtitle">{t.hero.subtitle}</p>

            {/* Funnel motion : Données → Analyse → Pronostic → Action */}
            <div className="hero-funnel" aria-hidden="true">
              {FUNNEL_KEYS.map((key, i) => (
                <span key={key} className="hero-funnel__item">
                  {i > 0 && (
                    <span
                      className={`hero-funnel__arrow${funnelStep > i ? ' is-active' : ''}`}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                  <span className={`hero-funnel__step${funnelStep === i ? ' is-active' : ''}`}>
                    <span className="hero-funnel__icon" aria-hidden="true">{FUNNEL_ICONS[i]}</span>
                    {t.hero[key]}
                  </span>
                </span>
              ))}
            </div>

            <div className="home-hero__actions">
              <MovingGradientButton href="#free-predictions" mode="continuous" variant="primary">
                {t.hero.cta}
                <span aria-hidden="true">→</span>
              </MovingGradientButton>
              <a href="#win-history" className="home-hero__cta-ghost">{t.hero.ctaSecondary}</a>
              <span className="home-hero__note">{t.hero.note18}</span>
            </div>

            {/* Preuves chiffrées — 100% issues de win-history.json */}
            {verified !== undefined && (
              <div className="home-hero__stats">
                {winRate !== undefined && (
                  <HeroStat value={winRate} decimals={1} suffix="%" label={t.hero.statsRate} accent lang={lang} />
                )}
                <HeroStat value={verified} label={t.hero.statsTotal} lang={lang} />
                {stats?.won !== undefined && stats?.lost !== undefined && (
                  <span className="home-hero__stat">
                    <span className="home-hero__stat-value">{stats.won}W · {stats.lost}L</span>
                    <span className="home-hero__stat-label">{t.hero.statsRecord}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Panneau partenaire — LINEBET / VISION221 (suivi + rel sponsorisé) */}
          <aside className="home-hero__partner" aria-label={t.hero.partnerJoin}>
            <span className="home-hero__partner-glow" aria-hidden="true" />
            <span className="home-hero__partner-eyebrow">{t.hero.partnerEyebrow}</span>
            <h2 className="home-hero__partner-title">{t.hero.partnerJoin}</h2>
            <p className="home-hero__partner-question">{t.hero.partnerQuestion}</p>

            <div className="home-hero__promo">
              <span className="home-hero__promo-label">{t.hero.promoLabel}</span>
              <span className="home-hero__promo-code">{SITE.promoCode}</span>
              <button
                type="button"
                className="home-hero__promo-copy"
                onClick={handleCopyCode}
                aria-live="polite"
              >
                {copied ? t.hero.copied : t.hero.copy}
              </button>
            </div>

            <p className="home-hero__bonus">{t.hero.bonus}</p>

            <MovingGradientButton
              href={AFFILIATE.linebet}
              mode="step"
              variant="ghost"
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="home-hero__partner-cta"
              onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'home-hero-partner')}
            >
              {t.hero.partnerCta}
            </MovingGradientButton>

            <p className="home-hero__partner-disclaimer">{t.hero.partnerDisclaimer}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
