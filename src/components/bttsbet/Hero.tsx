'use client'

import { useState, type ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'
import { SITE, AFFILIATE } from '@/lib/constants'
import AffiliateSignupCta from './AffiliateSignupCta'
import { trackAffiliateCodeCopy } from '@/lib/affiliateTracking'

/**
 * Hero — version resserrée : colonne unique (message + conversion).
 *
 * Structure : badge « Match intelligence », H1 positionnement n°1 mondial,
 * sous-titre, bloc code promo VISION221 (copie 1 tap), CTA primaire Linebet
 * dominant, CTA secondaire pronostics, mention 18+.
 *
 * Le panneau « Performance vérifiée » a été retiré : la preuve chiffrée reste
 * assurée par la section Historique (win-history.json) et la barre sticky.
 *
 * Conformité :
 *  - Liens affiliés via AffiliateSignupCta (rel="sponsored nofollow noopener noreferrer")
 *  - Tracking de la copie du code promo conservé
 *  - Micro-animations 100% CSS (aucun opacity-trap JS), prefers-reduced-motion respecté
 *  - Boutons pleine largeur ≥48px sur mobile, colonne unique sous 768px
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

export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  // Le hook reste pour la classe `is-visible` (amélioration visuelle) —
  // il ne masque jamais le contenu (isVisible init = true + fallback hard).
  const [sectionRef] = useScrollAnimation(0.05)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  const [copied, setCopied] = useState(false)

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
    trackAffiliateCodeCopy('linebet', 'home-hero')
    setCopied(true)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15)
    }
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={sectionRef} className="home-hero relative overflow-hidden">
      <div className="home-hero__inner relative z-10 mx-auto max-w-[1180px] px-4 sm:px-6">
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
      </div>
    </section>
  )
}
