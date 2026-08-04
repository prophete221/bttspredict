'use client'

import { SITE, AFFILIATE } from '@/lib/constants'

export default function VipSection() {
  const benefits = [
    { icon: '🎯', title: '+20 pronostics/jour', desc: 'Accès à toutes les分析的' },
    { icon: '📈', title: 'Cotes boostées', desc: 'Combinés jusqu\'à 50.00' },
    { icon: '⚡', title: 'Signaux en direct', desc: 'Alertes temps réel' },
    { icon: '💎', title: 'Value bets exclusifs', desc: 'Paris à forte valeur' },
    { icon: '🎮', title: 'FIFA & Aviator', desc: 'Signaux gaming' },
    { icon: '📊', title: 'Historique complet', desc: 'Toutes les analyses' },
  ]

  const vipStats = [
    { value: '87%', label: 'Précision VIP' },
    { value: '25+', label: 'Cote combinée' },
    { value: '500+', label: 'Membres actifs' },
  ]

  return (
    <section id="vip" className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-vip)] rounded-full opacity-5 blur-[120px]"/>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 badge badge-vip mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Accès VIP Premium
          </div>
          <h2 className="text-display-md text-white mb-4">
            Débloquez le plein potentiel
          </h2>
          <p className="text-body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Plus de pronostics, cotes boostées, et signaux exclusifs. 
            Utilisez le code <span className="font-mono font-bold text-[var(--color-vip)]">{SITE.promoCode}</span> sur Linebet.
          </p>
        </div>

        {/* VIP Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {vipStats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value gradient-text-vip">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main VIP Card */}
        <div className="card-vip max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Benefits List */}
            <div className="flex-1">
              <h3 className="text-heading-lg text-white mb-6">Ce que vous obtenez :</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-3 p-4 bg-[var(--color-dark-700)]/50 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-vip)] to-[var(--color-vip-dark)] flex items-center justify-center text-lg flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{benefit.title}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{benefit.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locked Content Preview */}
            <div className="lg:w-80">
              <div className="p-6 bg-[var(--color-dark-700)]/70 rounded-xl border border-[var(--color-card-border)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Contenu VIP</span>
                  <div className="badge badge-vip text-xs">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Privé
                  </div>
                </div>

                {/* Sample Locked Matches */}
                <div className="space-y-3 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-3 p-3 bg-[var(--color-dark-600)]/50 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--color-dark-500)] flex items-center justify-center text-xs">
                        🔒
                      </div>
                      <div className="flex-1 blur-sm select-none">
                        <div className="text-sm text-white">Match VIP #{i}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">BTTS · Over 2.5</div>
                      </div>
                      <span className="font-mono font-bold text-[var(--color-vip)]">2.{i}0</span>
                    </div>
                  ))}
                </div>

                {/* Lock Overlay */}
                <div className="relative p-6 bg-[var(--color-dark-800)] rounded-xl text-center">
                  <div className="absolute inset-0 backdrop-blur-sm rounded-xl"/>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-vip)] to-[var(--color-vip-dark)] flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark-900)" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </div>
                    <div className="font-semibold text-white mb-2">Contenu VIP</div>
                    <div className="text-xs text-[var(--color-text-muted)] mb-4">
                      Utilisez le code promo pour débloquer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <a 
              href={AFFILIATE.linebet} 
              target="_blank" 
              rel="sponsored noopener"
              className="btn btn-vip text-lg px-10 py-5 inline-flex items-center gap-3"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Débloquer avec {SITE.promoCode}
            </a>
            <p className="text-sm text-[var(--color-text-muted)] mt-4">
              Bonus de bienvenue jusqu'à 90,000 XOF · Inscription gratuite
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
