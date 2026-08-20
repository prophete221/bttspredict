'use client'

import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'

/**
 * Hero — présentation de plateforme et centre d'analyse.
 * Les données et traductions restent inchangées ; seule la hiérarchie visuelle
 * est alignée sur la maquette sombre premium.
 */
export default function Hero({ initialLocale }: { initialLocale?: Locale } = {}) {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #071018 0%, #0B1623 52%, #071018 100%)',
        borderBottom: '1px solid rgba(91, 169, 255, 0.18)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -right-24 top-8 hidden h-80 w-80 rounded-full sm:block"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, rgba(69,199,247,0.30), rgba(69,199,247,0.08) 38%, transparent 70%)',
            boxShadow: 'inset -28px -18px 60px rgba(0,0,0,0.45), 0 0 70px rgba(69,199,247,0.10)',
            filter: 'blur(1px)',
            opacity: 0.72,
          }}
        />
        <div
          className="absolute -right-8 top-20 hidden h-64 w-64 rounded-full opacity-25 sm:block"
          style={{
            backgroundImage:
              'linear-gradient(rgba(91,169,255,0.42) 1px, transparent 1px), linear-gradient(90deg, rgba(91,169,255,0.42) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(circle, black 0%, transparent 68%)',
            WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 68%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(91,169,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,169,255,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div
        className="relative z-10 mx-auto max-w-[1120px] px-4 pb-9 pt-7 sm:px-6 sm:pb-12 sm:pt-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 420ms ease, transform 420ms ease',
        }}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{
              background: 'rgba(69,199,247,0.10)',
              border: '1px solid rgba(91,169,255,0.30)',
              color: '#A8D9F5',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: '#B8FF1A',
                boxShadow: '0 0 0 4px rgba(184,255,26,0.12), 0 0 12px rgba(184,255,26,0.55)',
              }}
            />
            {t.hero.badge}
          </span>
          <span className="text-[10px] font-medium tabular-nums" style={{ color: '#8292A3' }}>
            {t.hero.timezone}
          </span>
        </div>

        <div className="relative max-w-[780px]">
          <h1
            className="max-w-[760px] text-[clamp(2.15rem,8.5vw,4.65rem)] font-semibold leading-[0.98] tracking-[-0.055em]"
            style={{ color: '#F3F7FA', fontFamily: 'Poppins, sans-serif' }}
          >
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-[620px] text-[14px] leading-[1.7] sm:text-[16px]" style={{ color: '#A8B5C3' }}>
            {t.hero.subtitle}
          </p>

          <div className="mt-6">
            <a
              href="/btts/predictions/today"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 text-[13px] font-bold transition-transform hover:scale-[1.01] sm:w-auto sm:min-w-[230px]"
              style={{
                background: '#B8FF1A',
                color: '#071018',
                boxShadow: '0 10px 28px rgba(184,255,26,0.16)',
              }}
              data-cta="hero-primary"
            >
              {t.hero.cta}
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        <div className="mt-8 max-w-[860px]" aria-label={t.hero.commandCenter}>
          <div className="hero-market-dashboard hero-market-dashboard--premium">
            <div className="hero-market-dashboard__header">
              <div className="flex items-center gap-2">
                <span className="hero-market-dashboard__pulse" aria-hidden="true" />
                <span>{t.hero.commandCenter}</span>
              </div>
              <span className="hero-market-dashboard__status">{t.hero.liveData}</span>
            </div>
            <div className="hero-market-grid grid grid-cols-3 gap-3 sm:gap-5">
              {[
                ['BTTS', t.hero.btts, 'BTTS'],
                ['O2.5', t.hero.goals, 'TOTAL'],
                ['SCORE', t.hero.exact, 'EXACT'],
              ].map(([label, caption, code], index) => (
                <div key={label} className={`hero-market-card hero-market-card--${index}`}>
                  <div className="hero-market-card__topline">
                    <span className="hero-market-card__code">{code}</span>
                    <span className="hero-market-card__dot" aria-hidden="true" />
                  </div>
                  <div className="hero-market-card__label">{label}</div>
                  <div className="mt-1 text-[10px] leading-tight sm:text-[12px]" style={{ color: '#A8B5C3' }}>
                    {caption}
                  </div>
                  <div className="hero-market-card__signal" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="hero-market-card__footer">{t.hero.active}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
