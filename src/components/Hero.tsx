'use client'

import { useState, useEffect, useRef } from 'react'
import { SITE, AFFILIATE } from '@/lib/constants'

export default function Hero() {
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 2500)
          setProgress((1 - Math.pow(1 - t, 3)) * 100)
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const features = [
    { icon: '🎯', label: 'Précision', value: SITE.accuracy },
    { icon: '📊', label: 'Matchs', value: '15,000+' },
    { icon: '🏆', label: 'Championnats', value: '50+' },
  ]

  const pipelines = ['Forme', 'xG', 'Blessures', 'Cotes', 'Historique']

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-primary)] rounded-full opacity-10 blur-[120px]"/>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[var(--color-secondary)] rounded-full opacity-10 blur-[100px]"/>
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[var(--color-accent)] rounded-full opacity-10 blur-[80px]"/>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 animate-float opacity-20">
        <div className="w-32 h-32 border border-[var(--color-primary)] rounded-full"/>
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-float opacity-20" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-24 border border-[var(--color-accent)] rounded-lg rotate-45"/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 badge badge-danger mb-6 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-[var(--color-danger)] animate-pulse"/>
              IA Active · +1,200 matchs/jour
            </div>

            {/* Main Headline */}
            <h1 className="text-display-xl text-white mb-6 animate-slide-up delay-100">
              Le moteur IA qui{' '}
              <span className="gradient-text-primary">prédit</span>
              <br />
              les{' '}
              <span className="gradient-text-accent">meilleurs pronostics</span>
            </h1>

            {/* Subheadline */}
            <p className="text-body-lg text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up delay-200">
              Modèles Poisson avancés calibrés sur <strong className="text-white">50,000+ matchs</strong>. 
              {' '}<span className="text-[var(--color-success)] font-semibold">~{SITE.accuracy} de précision</span> vérifiable. 
              Code promo <span className="font-mono font-bold text-[var(--color-vip)]">{SITE.promoCode}</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 animate-slide-up delay-300">
              <a 
                href={AFFILIATE.linebet} 
                target="_blank" 
                rel="sponsored noopener"
                className="btn btn-accent text-base px-8 py-4 w-full sm:w-auto shadow-lg"
                style={{ boxShadow: '0 10px 40px rgba(249, 115, 22, 0.4)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Bonus 90,000 XOF
              </a>
              <a 
                href="#pronos"
                className="btn btn-ghost text-base px-8 py-4 w-full sm:w-auto"
              >
                Voir les pronostics
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-[var(--color-text-muted)] animate-slide-up delay-400">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-success)]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9,12 12,15 16,10"/>
                </svg>
                Vérifié
              </span>
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-success)]">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                18+
              </span>
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-success)]">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Gratuit
              </span>
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="relative animate-slide-in delay-200">
            {/* Main Stats Card */}
            <div className="card-gradient relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-primary)] rounded-full opacity-20 blur-[40px]"/>
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#8B5CF6] flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Performance IA</div>
                      <div className="text-xs text-[var(--color-text-muted)]">30 derniers jours</div>
                    </div>
                  </div>
                  <div className="badge badge-success">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    </svg>
                    +2.3%
                  </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {features.map((f, i) => (
                    <div key={i} className="text-center p-4 bg-[var(--color-dark-700)]/50 rounded-xl">
                      <div className="text-2xl mb-1">{f.icon}</div>
                      <div className="text-2xl font-bold text-white font-mono">{f.value}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{f.label}</div>
                    </div>
                  ))}
                </div>

                {/* Live Analysis */}
                <div className="p-4 bg-[var(--color-dark-700)]/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Analyse en cours</span>
                    <span className="font-mono text-sm font-bold text-[var(--color-primary-light)]">{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar mb-3">
                    <div className="progress-bar-fill primary" style={{ width: `${progress}%` }}/>
                  </div>
                  <div className="flex items-center justify-between">
                    {pipelines.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                          style={{
                            background: i < progress / 20 ? 'var(--color-primary)' : 'var(--color-dark-500)',
                            color: i < progress / 20 ? 'white' : 'var(--color-text-muted)'
                          }}
                        >
                          {i < progress / 20 ? '✓' : i + 1}
                        </div>
                        <span 
                          className="text-[10px] hidden sm:block"
                          style={{ color: i < progress / 20 ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
                        >
                          {p}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating VIP Badge */}
            <div className="absolute -bottom-4 -right-4 badge badge-vip px-4 py-3 shadow-xl animate-float">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Accès VIP Premium
            </div>
          </div>
        </div>

        {/* Featured Leagues */}
        <div className="mt-16 animate-slide-up delay-500">
          <div className="text-center mb-6">
            <span className="text-label text-[var(--color-text-muted)]">Champtonnats couverts</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Premier League', 'La Liga', 'Serie A', 'Ligue 1', 'Bundesliga', 'Champions League', 'Europa League', 'Copa America'].map((league) => (
              <div 
                key={league}
                className="px-4 py-2 bg-[var(--color-dark-700)]/50 border border-[var(--color-card-border)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)] transition-all cursor-default"
              >
                {league}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
