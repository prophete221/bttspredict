'use client'

import { SITE, LEGAL } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-16 px-4 mt-20">
      {/* Gradient Border Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50"/>

      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#8B5CF6] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <div>
                <div className="font-[var(--font-display)] font-bold text-white">BttsPredict</div>
                <div className="text-[10px] text-[var(--color-primary-light)]">IA Pronostics</div>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
              {SITE.tagline}. IA BTTS & Over 2.5 pour les parieurs exigeants.
            </p>
            <div className="flex items-center gap-2">
              {['🔒 18+', '✓ Vérifié'].map((badge) => (
                <span key={badge} className="text-xs text-[var(--color-text-muted)]">{badge}</span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <div className="space-y-2">
              {[
                { href: '#pronos', label: 'Pronostics' },
                { href: '#resultats', label: 'Résultats' },
                { href: '#vip', label: 'VIP Premium' },
                { href: '/historique', label: 'Historique' },
                { href: '/statistiques', label: 'Statistiques' },
              ].map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Légal</h4>
            <div className="space-y-2">
              {[
                { href: '/mentions-legales', label: 'Mentions légales' },
                { href: '/cgu', label: 'CGU' },
                { href: '/politique-confidentialite', label: 'Confidentialité' },
                { href: '/jouer-responsable', label: 'Jeu responsable' },
              ].map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <a href={SITE.whatsapp} target="_blank" className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-success)] transition-colors">
                <span>📱</span> WhatsApp
              </a>
              <a href={SITE.tiktok} target="_blank" className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
                <span>🎵</span> TikTok
              </a>
            </div>
            
            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="font-semibold text-white mb-3 text-sm">Méthodes de paiement</h4>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <span 
                    key={method}
                    className="px-2 py-1 bg-[var(--color-dark-700)] rounded text-xs text-[var(--color-text-muted)]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* VIP CTA Banner */}
        <div className="card-gradient mb-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-heading-lg text-white mb-2">Prêt à gagner plus ?</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Utilisez le code <span className="font-mono font-bold text-[var(--color-vip)]">{SITE.promoCode}</span> sur Linebet pour le bonus
              </p>
            </div>
            <a 
              href={SITE.affiliate} 
              target="_blank" 
              rel="sponsored noopener"
              className="btn btn-accent"
            >
              S'inscrire maintenant
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="divider"/>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-muted)] text-center sm:text-left">
            © {currentYear} {LEGAL.copyright}
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] text-center sm:text-right max-w-md">
            BttsPredict est un site informatif et d'affiliation. Les paris sportifs comportent des risques. 
            <a href="https://www.begambleaware.org/" target="_blank" rel="noopener" className="text-[var(--color-primary-light)] hover:underline ml-1">
              Jouez responsable
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
