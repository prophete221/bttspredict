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
          const t = Math.min(1, (now - start) / 3000)
          setProgress((1 - Math.pow(1 - t, 3)) * 100)
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const steps = ['Forme', 'xG', 'Blessures', 'Cotes', 'Historique', 'BTTS', 'Over 2.5']

  return (
    <section ref={ref} className="relative overflow-hidden pt-12 pb-16">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-gold-champagne)] rounded-full opacity-[0.03] blur-[100px]"/>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--color-emerald-vip)] rounded-full opacity-[0.03] blur-[80px]"/>
      </div>
      
      {/* Gold line decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--color-gold-champagne)] to-transparent opacity-30"/>
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-champagne)] to-transparent opacity-20"/>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* VIP Badge */}
        <div className="inline-flex items-center gap-2 vip-badge mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[var(--color-emerald-vip)] animate-pulse"/>
          IA Active · +1200 matchs/jour
        </div>

        {/* Main Title */}
        <h1 className="display-xl mb-6 text-[var(--color-text-primary)] animate-fade-in stagger-1">
          L'excellence des{' '}
          <span className="gradient-text-gold">pronostics IA</span>
          <br />
          <span className="text-[var(--color-text-secondary)] font-normal italic">pour les parieurs exigeants</span>
        </h1>

        {/* Subtitle */}
        <p className="body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
          Modèles statistiques avancés calibrés sur plus de 50 000 matchs.
          {' '}<span className="text-[var(--color-gold-champagne)] font-semibold">~{SITE.accuracy} de précision</span>{' '}
          vérifiable dans l'historique. Code promo{' '}
          <span className="font-mono font-bold text-[var(--color-gold-champagne)]">{SITE.promoCode}</span>{' '}
          = Bonus exclusif sur Linebet.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in stagger-3">
          <a href={AFFILIATE.linebet} target="_blank" rel="sponsored noopener"
            className="btn-premium text-base px-8 py-4 w-full sm:w-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Bonus 90 000 XOF avec {SITE.promoCode}
          </a>
          <a href="#pronos"
            className="btn-ghost text-base px-8 py-4 w-full sm:w-auto">
            Découvrir les pronostics
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 animate-fade-in stagger-4">
          <div className="stat-card">
            <div className="stat-value">{SITE.accuracy}</div>
            <div className="stat-label">Précision</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">15K+</div>
            <div className="stat-label">Matchs analysés</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">50+</div>
            <div className="stat-label">Championnats</div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-text-muted)] animate-fade-in stagger-5">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9,12 12,15 16,10"/>
            </svg>
            Résultats vérifiés
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Paris responsables
          </span>
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Aucun paiement requis
          </span>
          <span>18+</span>
        </div>

        {/* AI Pipeline Card */}
        <div className="glass-card p-6 mt-10 max-w-lg mx-auto animate-fade-in stagger-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Pipeline d'analyse IA</span>
            <span className="font-mono text-sm font-bold text-[var(--color-emerald-vip)]">{Math.round(progress)}%</span>
          </div>
          <div className="confidence-bar mb-4">
            <div className="confidence-fill h-full rounded-full" style={{ width: `${progress}%` }}/>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: i < progress / 14 ? 'var(--color-emerald-glow)' : 'var(--color-steel)',
                    border: '1px solid ' + (i < progress / 14 ? 'var(--color-emerald-vip)' : 'var(--color-pewter)'),
                  }}>
                  {i < progress / 14 ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald-vip)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <span className="text-[8px] text-[var(--color-text-muted)]">{i + 1}</span>
                  )}
                </div>
                <span className="text-[10px]" style={{ color: i < progress / 14 ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
