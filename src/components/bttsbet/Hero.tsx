'use client'

import { useEffect, useState } from 'react'
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
 * Hero — conversion-first, mobile-first.
 *
 * Priorité visuelle :
 *  1. Badge live + timezone Africa/Dakar
 *  2. H1 orienté action + sous-titre
 *  3. Bloc "Étape 1 — Active ton bonus" : code VISION221 copiable en 1 tap
 *     + CTA PRIMAIRE d'inscription Linebet (AffiliateSignupCta, tracking intégré)
 *  4. Actions secondaires : voir les pronostics (#free-predictions) + méthode
 *  5. Colonne droite (desktop) : stats 100% win-history.json (si dispo),
 *     3 trust points, mini bloc partenaire Linebet secondaire
 *
 * Conformité :
 *  - Aucune stat inventée : uniquement win-history.json (sinon rien n'est affiché)
 *  - Aucun contenu masqué derrière opacity: 0 (fix opacity-trap)
 *  - Liens affiliés via AffiliateSignupCta (rel="sponsored nofollow noopener noreferrer")
 *  - Mention 18+ · Aucun gain garanti · Lien d'affiliation
 */
export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  // Le hook reste pour la classe `is-visible` (amélioration visuelle) —
  // il ne masque plus jamais le contenu (isVisible init = true + fallback hard).
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
      <div className="home-hero__media" aria-hidden="true" />
      <div className="home-hero__veil" aria-hidden="true" />

      {/* Toujours visible — plus aucun style conditionnel opacity/transform */}
      <div className="home-hero__inner relative z-10 mx-auto max-w-[1180px] px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
        <div className="home-hero__layout home-hero__layout--convert">
          {/* ═══ Colonne principale : promesse → bonus → CTA inscription ═══ */}
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

            {/* Étape 1 — Active ton bonus (CTA #1 = inscription Linebet) */}
            <div className="home-hero__convert">
              <p className="home-hero__convert-label">{t.hero.convertLabel}</p>
              <div className="home-hero__convert-code-row">
                <span className="home-hero__convert-code-label">{t.hero.promoLabel}</span>
                <code className="home-hero__convert-code">{SITE.promoCode}</code>
                <button
                  type="button"
                  onClick={copyCode}
                  className={`home-hero__convert-copy${copied ? ' is-copied' : ''}`}
                  aria-label={`${t.hero.copy} ${SITE.promoCode}`}
                  data-cta="hero-copy-vision221"
                >
                  {copied ? t.hero.copied : t.hero.copy}
                </button>
              </div>
              <AffiliateSignupCta
                href={AFFILIATE.linebet}
                partner="linebet"
                placement="home-hero-primary"
                className="home-hero__convert-cta"
              >
                {t.hero.partnerCta}
                <span aria-hidden="true">→</span>
              </AffiliateSignupCta>
              <p className="home-hero__convert-bonus">{t.hero.bonus}</p>
            </div>

            {/* Actions secondaires — explorer d'abord, convertir déjà proposé */}
            <div className="home-hero__actions--secondary">
              <a href="#free-predictions" className="home-hero__cta-secondary" data-cta="hero-free-predictions">
                {t.hero.cta}
                <span aria-hidden="true">↓</span>
              </a>
              <a href="/methodologie" className="home-hero__cta-ghost" data-cta="hero-method">
                {t.hero.ctaSecondary}
              </a>
            </div>
            <span className="home-hero__note">{t.hero.note18}</span>
          </div>

          {/* ═══ Colonne droite (desktop) : preuve + confiance + partenaire ═══ */}
          <div className="home-hero__side">
            {/* Preuves chiffrées — 100% issues de win-history.json, sinon rien */}
            {verified !== undefined && (
              <div className="home-hero__stats">
                {winRate !== undefined && (
                  <span className="home-hero__stat">
                    <span className="home-hero__stat-value home-hero__stat-value--win">
                      {winRate.toLocaleString(lang === 'en' ? 'en-US' : 'fr-FR', { minimumFractionDigits: 1 })}
                      &nbsp;%
                    </span>
                    <span className="home-hero__stat-label">{t.hero.statsRate}</span>
                  </span>
                )}
                <span className="home-hero__stat">
                  <span className="home-hero__stat-value">{verified}</span>
                  <span className="home-hero__stat-label">{t.hero.statsTotal}</span>
                </span>
                {stats?.won !== undefined && stats?.lost !== undefined && (
                  <span className="home-hero__stat">
                    <span className="home-hero__stat-value">{stats.won}W · {stats.lost}L</span>
                    <span className="home-hero__stat-label">{t.hero.statsRecord}</span>
                  </span>
                )}
              </div>
            )}

            <ul className="home-hero__trust-list">
              <li className="home-hero__trust-item">
                <span className="home-hero__trust-icon" aria-hidden="true">✓</span>
                <span>{t.hero.trust1}</span>
              </li>
              <li className="home-hero__trust-item">
                <span className="home-hero__trust-icon" aria-hidden="true">✓</span>
                <span>{t.hero.trust2}</span>
              </li>
              <li className="home-hero__trust-item">
                <span className="home-hero__trust-icon" aria-hidden="true">✓</span>
                <span>{t.hero.trust3}</span>
              </li>
            </ul>

            {/* Mini bloc partenaire — secondaire, jamais au même niveau que la marque */}
            <div className="home-hero__partner">
              <span className="home-hero__partner-eyebrow">{t.hero.partnerEyebrow}</span>
              <span className="home-hero__partner-join">{t.hero.partnerJoin}</span>
              <AffiliateSignupCta
                href={AFFILIATE.linebet}
                partner="linebet"
                placement="home-hero-partner"
                className="home-hero__partner-cta"
              >
                {t.hero.partnerCtaShort}
                <span aria-hidden="true">→</span>
              </AffiliateSignupCta>
              <span className="home-hero__partner-disclaimer">{t.hero.partnerDisclaimer}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
