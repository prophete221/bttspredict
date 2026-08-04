'use client'

import { SITE, AFFILIATE } from '@/lib/constants'

export default function VipSection() {
  const features = [
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ), 
      title: '+20 Pronostics/Jour', 
      desc: 'Accédez à toutes les analyses' 
    },
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      ), 
      title: 'Cotes Boostées', 
      desc: 'Combinés jusqu\'à 50.00' 
    },
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ), 
      title: 'Signaux en Direct', 
      desc: 'Alertes temps réel' 
    },
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ), 
      title: 'Value Bets', 
      desc: 'Paris à forte valeur' 
    },
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <path d="M6 12h4M8 10v4"/>
          <circle cx="16" cy="10" r="1" fill="currentColor"/>
          <circle cx="16" cy="14" r="1" fill="currentColor"/>
        </svg>
      ), 
      title: 'FIFA & Aviator', 
      desc: 'Signaux gaming exclusifs' 
    },
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ), 
      title: 'Historique Complet', 
      desc: 'Toutes les analyses' 
    },
  ]

  return (
    <section id="vip" className="py-20 px-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full opacity-5 blur-[150px]"/>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="text-white font-bold">Accès VIP Premium</span>
          </div>
          
          <h2 className="text-display-md text-white mb-4">
            Passez au niveau supérieur
          </h2>
          <p className="text-body-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
            Déblockez tous les pronostics, cotes boostées et signaux exclusifs. 
            Utilisez le code <span className="font-mono font-bold text-[var(--color-vip)]">{SITE.promoCode}</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="card group hover:border-[var(--color-primary)] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 lg:p-12" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-vip)] rounded-full opacity-10 blur-[80px]"/>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-primary)] rounded-full opacity-10 blur-[60px]"/>
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-dark-700)] border border-[var(--color-vip)]/30 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-vip)">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span className="text-sm font-semibold text-[var(--color-vip)]">Contenu Premium</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Prêt à gagner plus ?
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                Bonus de bienvenue jusqu'à <span className="text-[var(--color-success)] font-bold">90,000 XOF</span>
              </p>
            </div>
            
            {/* Right */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href={AFFILIATE.linebet} 
                target="_blank" 
                rel="sponsored noopener"
                className="btn btn-vip text-lg px-8 py-4"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                S'inscrire avec {SITE.promoCode}
              </a>
              <div className="text-center">
                <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Inscription</div>
                <div className="text-sm text-[var(--color-success)] font-semibold">100% Gratuite</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
