
'use client'

import { useScrollAnimation } from '@/hooks/useAnimations'
import { useLanguage } from './LanguageSwitcher'
import { translationsFor, type Locale } from '@/lib/i18n'

/**
 * Hero — Command Center
 *
 * Un point d'entrée de plateforme, pas un article : le visiteur comprend
 * immédiatement le marché couvert, l'état des données et l'action suivante.
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
        background: 'linear-gradient(145deg, #07131D 0%, #101A2B 58%, #07131D 100%)',
        borderBottom: '1px solid rgba(169, 196, 223, 0.16)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-32 -right-20 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(127,162,198,0.18), transparent 68%)', filter: 'blur(18px)' }}
        />
        <div
          className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(211,177,109,0.10), transparent 66%)', filter: 'blur(22px)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: 'linear-gradient(rgba(244,247,251,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,251,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>
      <div
        className="relative z-10 mx-auto max-w-[980px] px-4 pb-8 pt-7 sm:px-6 sm:pb-10 sm:pt-9"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 420ms ease, transform 420ms ease' }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ background: 'rgba(127,162,198,0.12)', border: '1px solid rgba(169,196,223,0.34)', color: '#9896FF' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#E6A24C', boxShadow: '0 0 0 4px rgba(75,182,135,0.14)' }} />
            {t.hero.badge}
          </span>
          <span className="text-[10px] font-medium tabular-nums" style={{ color: '#7F98A4' }}>{t.hero.timezone}</span>
        </div>

        <h1 className="max-w-[520px] text-[clamp(2rem,8vw,3.7rem)] font-semibold leading-[0.98] tracking-[-0.055em]" style={{ color: '#F3F7F5', fontFamily: 'Poppins, sans-serif' }}>
          {t.hero.title}
        </h1>
        <p className="mt-4 max-w-[480px] text-[14px] leading-[1.65] sm:text-[15px]" style={{ color: '#B4C4CC' }}>
          {t.hero.subtitle}
        </p>

          <div className="hero-market-dashboard hero-market-dashboard--premium mt-7" aria-label={t.hero.commandCenter}>
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
                <div className="mt-1 text-[10px] leading-tight sm:text-[12px]" style={{ color: '#B4C4CC' }}>{caption}</div>
                <div className="hero-market-card__signal" aria-hidden="true">
                  <span /><span /><span /><span /><span />
                </div>
                <div className="hero-market-card__footer">{t.hero.active}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <a href="/btts/predictions/today" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl px-5 text-[13px] font-bold transition-transform hover:scale-[1.01]" style={{ background: '#E6A24C', color: '#07131D', boxShadow: '0 10px 30px rgba(211,177,109,0.16)' }} data-cta="hero-primary">
            {t.hero.cta}
            <span className="ml-2" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
