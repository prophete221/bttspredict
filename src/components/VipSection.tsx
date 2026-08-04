'use client'

import { SITE, AFFILIATE } from '@/lib/constants'

export default function VipSection() {
  return (
    <section id="vip" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="vip-badge mx-auto mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Accès Premium
          </div>
          <h2 className="display-md text-[var(--color-text-primary)] mb-3">Débloquez les 8 sélections VIP</h2>
          <p className="body-lg text-[var(--color-text-secondary)] max-w-lg mx-auto">
            Sélectionnezions exclusives avec cotes combinées, value bets et matchs premium.
            Gratuit avec le code <span className="font-mono font-bold text-[var(--color-gold-champagne)]">{SITE.promoCode}</span>
          </p>
        </div>

        {/* VIP Card */}
        <div className="gold-card">
          <div className="gold-card-inner p-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="stat-card">
                <div className="stat-value">8</div>
                <div className="stat-label">Sélections VIP</div>
              </div>
              <div className="stat-card">
                <div className="stat-value text-[var(--color-emerald-vip)]">25.69</div>
                <div className="stat-label">Cote totale</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{SITE.vipAccuracy}</div>
                <div className="stat-label">Précision</div>
              </div>
            </div>

            {/* Locked matches */}
            <div className="space-y-3 relative">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-4 rounded-xl p-4 glass-card border border-[var(--color-steel)]">
                  <span className="text-sm font-mono text-[var(--color-text-muted)] w-16">{i < 10 ? `19:0${i}` : `19:${i}`}</span>
                  <div className="flex-1 blur-[3px] select-none opacity-50">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">Match Premium #{i}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">BTTS · Over 2.5</div>
                  </div>
                  <span className="text-lg font-bold font-mono text-[var(--color-gold-champagne)]">2.5{i}</span>
                </div>
              ))}
              
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-[var(--color-void)]/80 to-[var(--color-void)] rounded-xl">
                <div className="flex flex-col items-center gap-4 p-8 glass-card rounded-2xl border border-[var(--color-gold-champagne)]/20">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gold-champagne)] to-[var(--color-gold-dark)] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-void)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <span className="vip-badge">Contenu VIP</span>
                  <p className="text-sm text-[var(--color-text-secondary)] text-center max-w-xs">
                    Débloquez l'accès complet avec le code promo
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <a href={AFFILIATE.linebet} target="_blank" rel="sponsored noopener"
                className="btn-premium w-full justify-center text-base py-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Débloquer avec {SITE.promoCode}
              </a>
              <p className="text-center text-sm text-[var(--color-text-muted)] mt-3">
                Inscris-toi sur Linebet · Bonus jusqu'à 90 000 XOF
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
