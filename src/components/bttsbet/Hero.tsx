'use client'

import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale, localizedPath } from '@/lib/i18n'

/**
 * Hero — « football intelligence » court et orienté produit.
 *
 * Colonne gauche : eyebrow, H1 (BTTS + données accentués), texte, 2 CTA internes,
 * ligne de réassurance 18+.
 * Colonne droite : carte « Centre de transparence » — uniquement des faits
 * vérifiables (publication avant match, archives horodatées, résultats visibles,
 * modèle xG + Poisson, vérification externe) + timeline de publication.
 * Aucun pourcentage de réussite ici : la carte n’affiche que des éléments factuels.
 * Fond : var(--color-bg-main) — identique au reste du site (aucun gradient).
 * Colonnes empilées sous 1024px ; boutons pleine largeur ≥48px sur mobile.
 */

/** Met en évidence le mot utile du titre via des crochets [mot] — i18n-safe. */
function withAccent(text: string, key: string) {
  const m = text.match(/\[(.+?)\]/)
  if (!m || m.index === undefined) return text
  return (
    <span key={key}>
      {text.slice(0, m.index)}
      <em className="hp-title-em">{m[1]}</em>
      {text.slice(m.index + m[0].length)}
    </span>
  )
}

function CheckIcon() {
  return (
    <span className="hp-check" aria-hidden="true">
      <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
        <path d="M2.4 6.3l2.3 2.4 4.9-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const [sectionRef] = useScrollAnimation(0.05)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)

  const ctItems = [t.home2.ctPub, t.home2.ctArchives, t.home2.ctResults, t.home2.ctModel, t.home2.ctVerified]
  const timeline = [t.home2.ctTl1, t.home2.ctTl2, t.home2.ctTl3]

  return (
    <section ref={sectionRef} className="hp-hero relative overflow-hidden">
      <div className="hp-hero__inner relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="hp-hero__grid">
          {/* ═══ Colonne message ═══ */}
          <div className="hp-hero__copy">
            <p className="hp-eyebrow">
              <span className="hp-eyebrow__dot" aria-hidden="true" />
              {t.home2.heroEyebrow}
            </p>

            <h1 className="hp-hero__title">
              {withAccent(t.home2.heroTitle1, 'l1')}
              <span className="hp-hero__title-line2">{withAccent(t.home2.heroTitle2, 'l2')}</span>
            </h1>

            <p className="hp-hero__text">{t.home2.heroText}</p>

            <div className="hp-hero__cta-zone">
              <a href="#matchs" data-cta="hero-open-matchs" className="hp-btn-primary">
                {t.home2.heroCtaPrimary}
                <span className="hp-btn-arrow" aria-hidden="true">→</span>
              </a>
              <a href={localizedPath('/historique', lang)} data-cta="hero-history" className="hp-btn-ghost">
                {t.home2.heroCtaSecondary}
              </a>
            </div>

            <p className="hp-hero__reassurance">{t.home2.heroReassurance}</p>
          </div>

          {/* ═══ Carte Centre de transparence ═══ */}
          <aside className="hp-ct" aria-label={t.home2.ctTitle}>
            <p className="hp-ct__head">
              <CheckIcon />
              <span>{t.home2.ctTitle}</span>
            </p>

            <ul className="hp-ct__list">
              {ctItems.map((item) => (
                <li key={item} className="hp-ct__item">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Timeline de publication — états factuels du processus */}
            <div className="hp-ct__timeline" role="img" aria-label={`${t.home2.ctTl1} → ${t.home2.ctTl2} → ${t.home2.ctTl3}`}>
              {timeline.map((step, i) => (
                <div key={step} className="hp-ct__step">
                  <span className={`hp-ct__step-dot${i === 0 ? ' is-active' : ''}`} aria-hidden="true" />
                  {i < timeline.length - 1 && <span className="hp-ct__step-line" aria-hidden="true" />}
                  <span className="hp-ct__step-label">{step}</span>
                </div>
              ))}
            </div>

            <div className="hp-ct__links">
              <a href={localizedPath('/resultats-verifies', lang)} data-cta="hero-ct-results" className="hp-ct__link">
                {t.home2.ctLinkResults}
                <span aria-hidden="true">→</span>
              </a>
              <a href={localizedPath('/methodologie', lang)} data-cta="hero-ct-method" className="hp-ct__link">
                {t.home2.ctLinkMethod}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
