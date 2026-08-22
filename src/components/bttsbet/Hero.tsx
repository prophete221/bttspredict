'use client'

import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'

/**
 * Hero — première impression de la plateforme et accès rapide aux marchés suivis.
 * Les données, traductions et destinations de navigation restent inchangées.
 */
export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)

  const marketRoutes = {
    btts: lang === 'fr' ? '/btts/predictions/today' : `/${lang}/btts/predictions/today`,
    goals: lang === 'fr' ? '/over-2-5/predictions/today' : `/${lang}/over-2-5/predictions/today`,
    exact: lang === 'fr' ? '/ai-correct-score-predictions' : `/${lang}/ai-correct-score-predictions`,
  } as const

  const markets = [
    ['BTTS', t.hero.btts, 'BTTS', marketRoutes.btts],
    ['O2.5', t.hero.goals, 'TOTAL', marketRoutes.goals],
    ['SCORE', t.hero.exact, 'EXACT', marketRoutes.exact],
  ] as const

  return (
    <section ref={sectionRef} className="home-hero relative overflow-hidden">
      <div className="home-hero__media" aria-hidden="true" />
      <div className="home-hero__veil" aria-hidden="true" />

      <div
        className="relative z-10 mx-auto max-w-[1180px] px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 360ms ease, transform 360ms ease',
        }}
      >
        <div className="home-hero__layout">
          <div className="home-hero__copy">
            <div className="home-hero__meta">
              <span className="home-hero__badge">
                <span className="home-hero__badge-dot" aria-hidden="true" />
                {t.hero.badge}
              </span>
              <span className="home-hero__timezone">{t.hero.timezone}</span>
            </div>

            <h1>{t.hero.title}</h1>
            <p className="home-hero__subtitle">{t.hero.subtitle}</p>

            <div className="home-hero__actions">
              <a href="#free-predictions" className="home-hero__cta" data-cta="hero-primary">
                {t.hero.cta}
                <span aria-hidden="true">→</span>
              </a>
              <span className="home-hero__note">18+ · Données publiées avant le match</span>
            </div>
          </div>

          <aside className="home-hero__markets" aria-label={t.hero.commandCenter}>
            <div className="home-hero__markets-head">
              <div className="home-hero__markets-title">
                <span className="home-hero__live-dot" aria-hidden="true" />
                <span>{t.hero.commandCenter}</span>
              </div>
              <span className="home-hero__live-label">{t.hero.liveData}</span>
            </div>

            <div className="home-hero__market-list">
              {markets.map(([label, caption, code, href]) => (
                <a
                  key={label}
                  href={href}
                  className="home-hero__market"
                  aria-label={`${label} — ${t.hero.cta}`}
                >
                  <span className="home-hero__market-code">{code}</span>
                  <strong>{label}</strong>
                  <span>{caption}</span>
                  <span className="home-hero__market-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>

          </aside>
        </div>
      </div>
    </section>
  )
}
