'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'
import { SITE, AFFILIATE } from '@/lib/constants'
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
 * Hero — design premium « football intelligence / data terminal ».
 *
 * Architecture :
 *  - Colonne message (≈58%) : eyebrow « Match intelligence · Données vérifiées »,
 *    H1 hiérarchisé, sous-titre positionnement, bloc code promo VISION221 élégant,
 *    CTA primaire Linebet dominant, CTA secondaire pronostics, mention 18+.
 *  - Panneau confiance (≈42%, desktop) : carte « Performance vérifiée »
 *    (anneau de progression + 3 chiffres + barre segmentée — 100% win-history.json),
 *    3 points de réassurance, bloc partenaire Linebet avec code + CTA.
 *
 * Conformité :
 *  - Aucune stat inventée : uniquement win-history.json (sinon la carte n'est pas rendue)
 *  - Aucune promesse de gain ; mentions 18+ / affiliation / conditions conservées
 *  - Liens affiliés via AffiliateSignupCta (rel="sponsored nofollow noopener noreferrer")
 *  - Micro-animations 100% CSS (aucun opacity-trap JS), prefers-reduced-motion respecté
 *  - Colonne unique sous 768px ; boutons pleine largeur ≥48px sur mobile
 */

/** Met en évidence le mot utile du titre via des crochets [mot] — i18n-safe (aucune casse RTL). */
function withAccent(text: string): ReactNode {
  const m = text.match(/\[(.+?)\]/)
  if (!m || m.index === undefined) return text
  const before = text.slice(0, m.index)
  const after = text.slice(m.index + m[0].length)
  return (
    <>
      {before}
      <em className="home-hero__title-em">{m[1]}</em>
      {after}
    </>
  )
}

const RING_RADIUS = 52
const RING_CIRC = 2 * Math.PI * RING_RADIUS

export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  // Le hook reste pour la classe `is-visible` (amélioration visuelle) —
  // il ne masque jamais le contenu (isVisible init = true + fallback hard).
  const [sectionRef] = useScrollAnimation(0.05)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [stats, setStats] = useState<WinHistoryStats | null>(null)
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

  const verified = stats?.total
  const winRate = stats?.rate ?? stats?.displayedWinRate
  const won = stats?.won
  const lost = stats?.lost

  const localeTag = lang === 'en' ? 'en-US' : 'fr-FR'
  const rateStr =
    winRate !== undefined
      ? winRate.toLocaleString(localeTag, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      : undefined

  // Anneau de progression — statique (pas d'animation agressive), offset calculé une fois.
  const ringOffset =
    winRate !== undefined
      ? RING_CIRC * (1 - Math.min(100, Math.max(0, winRate)) / 100)
      : RING_CIRC

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(SITE.promoCode)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = SITE.promoCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    trackAffiliateCodeCopy('linebet', 'home-hero-partner')
    setCopied(true)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15)
    }
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={sectionRef} className="home-hero relative overflow-hidden">
      <div className="home-hero__bg" aria-hidden="true" />

      <div className="home-hero__inner relative z-10 mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="home-hero__layout">
          {/* ═══ Colonne message (≈58%) ═══ */}
          <div className="home-hero__copy">
            <p className="home-hero__eyebrow">
              <span className="home-hero__eyebrow-dot" aria-hidden="true" />
              {t.hero.badge}
            </p>

            <h1 className="home-hero__title">
              {withAccent(t.hero.title1)}
              <span className="home-hero__title-line2">{t.hero.title2}</span>
            </h1>

            <p className="home-hero__subtitle">{t.hero.subtitle}</p>

            {/* Bloc code promo — élégant, monospace, copie en 1 tap */}
            <div className="home-hero__codecard">
              <div className="home-hero__codecard-main">
                <span className="home-hero__code-label">{t.hero.promoLabel}</span>
                <code className="home-hero__code">{SITE.promoCode}</code>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className={`home-hero__code-copy${copied ? ' is-copied' : ''}`}
                aria-label={`${t.hero.copy} ${SITE.promoCode}`}
                data-cta="hero-copy-vision221"
              >
                {copied ? t.hero.copied : t.hero.copy}
              </button>
            </div>

            {/* CTA primaire dominant + CTA secondaire discret */}
            <div className="home-hero__cta-zone">
              <AffiliateSignupCta
                href={AFFILIATE.linebet}
                partner="linebet"
                placement="home-hero-primary"
                className="home-hero__cta-primary"
              >
                {t.hero.partnerCta}
                <span className="home-hero__cta-arrow" aria-hidden="true">→</span>
              </AffiliateSignupCta>
              <a
                href="#free-predictions"
                className="home-hero__cta-soft"
                data-cta="hero-free-predictions"
              >
                {t.hero.cta}
              </a>
            </div>

            <p className="home-hero__legal-note">{t.hero.note18}</p>
          </div>

          {/* ═══ Panneau confiance (≈42% desktop, empilé sous le message sur mobile) ═══ */}
          <aside className="home-hero__panel" aria-label={t.hero.perfTitle}>
            {/* Carte Performance vérifiée — 100% win-history.json, sinon rien */}
            {verified !== undefined && (
              <div className="home-hero__perf">
                <p className="home-hero__perf-head">
                  <span className="home-hero__perf-check" aria-hidden="true">
                    <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                      <path d="M2.4 6.3l2.3 2.4 4.9-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>{t.hero.perfTitle}</span>
                </p>

                <div className="home-hero__perf-main">
                  {rateStr !== undefined && (
                    <div
                      className="home-hero__ring"
                      role="img"
                      aria-label={`${rateStr} % — ${t.hero.statsRate}`}
                    >
                      <svg viewBox="0 0 120 120" aria-hidden="true">
                        <circle className="home-hero__ring-track" cx="60" cy="60" r={RING_RADIUS} />
                        <circle
                          className="home-hero__ring-progress"
                          cx="60"
                          cy="60"
                          r={RING_RADIUS}
                          strokeDasharray={RING_CIRC}
                          strokeDashoffset={ringOffset}
                        />
                      </svg>
                      <span className="home-hero__ring-value">
                        {rateStr}
                        <i>%</i>
                      </span>
                    </div>
                  )}

                  <div className="home-hero__figures">
                    <div className="home-hero__figure">
                      <span className="home-hero__figure-value">{verified}</span>
                      <span className="home-hero__figure-label">{t.hero.statsTotal}</span>
                    </div>
                    {won !== undefined && (
                      <div className="home-hero__figure">
                        <span className="home-hero__figure-value is-win">{won}</span>
                        <span className="home-hero__figure-label">{t.hero.statsWon}</span>
                      </div>
                    )}
                    {lost !== undefined && (
                      <div className="home-hero__figure">
                        <span className="home-hero__figure-value is-loss">{lost}</span>
                        <span className="home-hero__figure-label">{t.hero.statsLost}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Barre segmentée gagnés/perdus — discrète, proportionnelle */}
                {won !== undefined && lost !== undefined && verified ? (
                  <div className="home-hero__perf-bar" aria-hidden="true">
                    <span style={{ flexGrow: won }} />
                    <span className="is-loss" style={{ flexGrow: lost }} />
                  </div>
                ) : null}
              </div>
            )}

            {/* 3 points de réassurance */}
            <ul className="home-hero__trust">
              <li className="home-hero__trust-item">
                <span className="home-hero__trust-icon" aria-hidden="true">
                  <svg viewBox="0 0 12 12" width="9" height="9" fill="none">
                    <path d="M2.4 6.3l2.3 2.4 4.9-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{t.hero.trust1}</span>
              </li>
              <li className="home-hero__trust-item">
                <span className="home-hero__trust-icon" aria-hidden="true">
                  <svg viewBox="0 0 12 12" width="9" height="9" fill="none">
                    <path d="M2.4 6.3l2.3 2.4 4.9-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{t.hero.trust2}</span>
              </li>
              <li className="home-hero__trust-item">
                <span className="home-hero__trust-icon" aria-hidden="true">
                  <svg viewBox="0 0 12 12" width="9" height="9" fill="none">
                    <path d="M2.4 6.3l2.3 2.4 4.9-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{t.hero.trust3}</span>
              </li>
            </ul>

            {/* Bloc partenaire — séparé visuellement, cohérent avec la carte */}
            <div className="home-hero__partner">
              <p className="home-hero__partner-eyebrow">{t.hero.partnerEyebrow}</p>
              <div className="home-hero__partner-row">
                <span className="home-hero__partner-brand">LINEBET</span>
                <span className="home-hero__partner-code">{SITE.promoCode}</span>
              </div>
              <AffiliateSignupCta
                href={AFFILIATE.linebet}
                partner="linebet"
                placement="home-hero-partner"
                className="home-hero__partner-cta"
              >
                {t.hero.partnerCtaShort}
              </AffiliateSignupCta>
              <p className="home-hero__partner-terms">{t.hero.partnerDisclaimer}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
