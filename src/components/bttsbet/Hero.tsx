'use client'

import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'

/**
 * Hero — présentation de plateforme et accès rapide aux marchés suivis.
 * Les données, traductions et destinations de navigation restent inchangées.
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
        background: 'linear-gradient(135deg, #071018 0%, #0B1623 52%, #071018 100%)',
        borderBottom: '1px solid rgba(91, 169, 255, 0.18)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(91,169,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,169,255,1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          className="absolute -right-32 top-16 hidden h-72 w-72 rounded-full sm:block"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(69,199,247,0.16), transparent 68%)',
            filter: 'blur(1px)',
          }}
        />
      </div>

      <div
        className="relative z-10 mx-auto max-w-[1120px] px-4 pb-7 pt-5 sm:px-6 sm:pb-10 sm:pt-9"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 360ms ease, transform 360ms ease',
        }}
      >
        <div className="hero-meta mb-5 flex items-start justify-between gap-3 sm:mb-7 sm:items-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{
              background: 'rgba(69,199,247,0.08)',
              border: '1px solid rgba(91,169,255,0.28)',
              color: '#A8D9F5',
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: '#B8FF1A', boxShadow: '0 0 0 4px rgba(184,255,26,0.10)' }}
            />
            {t.hero.badge}
          </span>
          <span className="hero-timezone text-right text-[10px] font-medium tabular-nums" style={{ color: '#8292A3' }}>
            {t.hero.timezone}
          </span>
        </div>

        <div className="relative max-w-[780px]">
          <h1
            className="max-w-[700px] text-[clamp(2rem,8.8vw,4.65rem)] font-semibold leading-[1.02] tracking-[-0.05em]"
            style={{ color: '#F3F7FA', fontFamily: 'Poppins, sans-serif' }}
          >
            {t.hero.title}
          </h1>
          <p className="mt-4 max-w-[610px] text-[14px] leading-[1.6] sm:mt-5 sm:text-[16px]" style={{ color: '#A8B5C3' }}>
            {t.hero.subtitle}
          </p>

          <div className="mt-5">
            <a
              href="#free-predictions"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 text-[13px] font-bold transition-transform hover:scale-[1.01] sm:w-auto sm:min-w-[220px]"
              style={{ background: '#B8FF1A', color: '#071018', boxShadow: '0 8px 20px rgba(184,255,26,0.12)' }}
              data-cta="hero-primary"
            >
              {t.hero.cta}
              <span className="ml-2" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="mt-6 max-w-[860px] sm:mt-8" aria-label={t.hero.commandCenter}>
          <div className="hero-market-dashboard hero-market-dashboard--compact">
            <div className="hero-market-dashboard__header">
              <div className="flex items-center gap-2">
                <span className="hero-market-dashboard__pulse" aria-hidden="true" />
                <span>{t.hero.commandCenter}</span>
              </div>
              <span className="hero-market-dashboard__status">{t.hero.liveData}</span>
            </div>
            <div className="hero-market-grid hero-market-grid--compact">
              {[
                ['BTTS', t.hero.btts, 'BTTS'],
                ['O2.5', t.hero.goals, 'TOTAL'],
                ['SCORE', t.hero.exact, 'EXACT'],
              ].map(([label, caption, code]) => (
                <a
                  key={label}
                  href="#free-predictions"
                  className="hero-market-option"
                  aria-label={`${label} — ${t.hero.cta}`}
                >
                  <span className="hero-market-option__code">{code}</span>
                  <strong className="hero-market-option__label">{label}</strong>
                  <span className="hero-market-option__caption">{caption}</span>
                  <span className="hero-market-option__action" aria-hidden="true">Voir</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
