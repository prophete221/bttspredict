'use client'

import { SITE, PAYMENT_METHODS, FAQ_ITEMS, LEGAL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-steel)] py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* VIP Section */}
        <div className="gold-card mb-12">
          <div className="gold-card-inner text-center py-8">
            <div className="vip-badge mx-auto mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Accès VIP Premium
            </div>
            <h3 className="display-md text-[var(--color-text-primary)] mb-3">Débloquez le plein potentiel</h3>
            <p className="body-md text-[var(--color-text-secondary)] max-w-lg mx-auto mb-6">
              Plus de matchs analysés, historique complet, et signaux exclusifs FIFA/Aviator.
              Utilisez le code <span className="font-mono font-bold text-[var(--color-gold-champagne)]">{SITE.promoCode}</span> sur Linebet.
            </p>
            <a href="#" className="btn-premium">
              Devenir VIP
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {PAYMENT_METHODS.map(m => (
            <span key={m} className="px-4 py-2 rounded-lg text-xs font-medium glass-card text-[var(--color-text-secondary)] border border-[var(--color-glass-border)]">{m}</span>
          ))}
          <span className="px-4 py-2 rounded-lg text-xs font-medium glass-card text-[var(--color-text-secondary)] border border-[var(--color-glass-border)]">🔒 18+</span>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-gold-champagne)] font-semibold mb-3">BttsPredict</h4>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{SITE.tagline}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-gold-champagne)] font-semibold mb-3">Navigation</h4>
            <div className="flex flex-col gap-1.5">
              <a href="#pronos" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors">Pronostics</a>
              <a href="#resultats" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors">Résultats</a>
              <a href="#vip" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors">VIP</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-gold-champagne)] font-semibold mb-3">Légal</h4>
            <div className="flex flex-col gap-1.5">
              <a href="/mentions-legales" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors">Mentions légales</a>
              <a href="/cgu" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors">CGU</a>
              <a href="/jouer-responsable" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors">Jeu responsable</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-gold-champagne)] font-semibold mb-3">Contact</h4>
            <div className="flex flex-col gap-1.5">
              <a href={SITE.whatsapp} target="_blank" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold-champagne)] transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold mb-6"/>

        {/* Copyright */}
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          {LEGAL.copyright} ·{' '}
          <a href="https://www.begambleaware.org/" target="_blank" rel="noopener" className="text-[var(--color-gold-champagne)] hover:underline">
            BeGambleAware
          </a>
        </p>
        <p className="text-center text-xs text-[var(--color-text-tertiary)] mt-2">
          BttsPredict est un site informatif et d'affiliation. Les paris sportifs comportent des risques financiers.
        </p>
      </div>
    </footer>
  )
}
