'use client'

import { SITE, AFFILIATE } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
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
        <div className="text-center">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 badge badge-primary mb-6 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"/>
            IA Active · +1,200 matchs/jour
          </div>

          {/* Main Headline */}
          <h1 className="text-display-xl text-papier mb-6 animate-slide-up delay-100">
            Le moteur IA qui{' '}
            <span className="gradient-text-primary">prédit</span>
            <br />
            les{' '}
            <span className="gradient-text-accent">meilleurs pronostics</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto animate-slide-up delay-200">
            Modèles Poisson avancés calibrés sur <strong className="text-papier">50,000+ matchs</strong>. 
            {' '}<span className="text-[var(--color-success)] font-semibold">Précision vérifiable</span> dans l'historique. 
            Code promo <span className="font-mono font-bold text-[var(--color-vip)]">{SITE.promoCode}</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-slide-up delay-300">
            <a 
              href={AFFILIATE.linebet} 
              target="_blank" 
              rel="sponsored noopener"
              className="btn btn-accent text-base px-8 py-4 w-full sm:w-auto shadow-lg"
              style={{ boxShadow: '0 10px 40px rgba(24, 224, 181, 0.4)' }}
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
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-text-muted)] animate-slide-up delay-400">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-success)]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9,12 12,15 16,10"/>
              </svg>
              Résultats vérifiés
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
              100% Gratuit
            </span>
          </div>
        </div>

        {/* Featured Leagues */}
        <div className="mt-16 animate-slide-up delay-500">
          <div className="text-center mb-6">
            <span className="text-label text-[var(--color-text-muted)]">Championnats couverts</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Premier League', 'La Liga', 'Serie A', 'Ligue 1', 'Bundesliga', 'Champions League', 'Europa League', 'Copa America'].map((league) => (
              <div 
                key={league}
                className="px-4 py-2 bg-[var(--color-dark-700)]/50 border border-[var(--color-card-border)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-papier hover:border-[var(--color-primary)] transition-all cursor-default"
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
