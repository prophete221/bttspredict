'use client'

import { motion } from 'framer-motion'
import { SITE, PAYMENT_METHODS, FAQ_ITEMS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {PAYMENT_METHODS.map(m => (
            <span key={m} className="px-3 py-1.5 rounded-lg text-xs font-semibold glass text-[var(--color-text-secondary)]">{m}</span>
          ))}
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold glass text-[var(--color-text-secondary)]">🔒 18+</span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold glass text-[var(--color-text-secondary)]">📱 13K TikTok</span>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-sm">
          <div>
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">BTTSPredict</h4>
            <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">{SITE.tagline}. IA BTTS & Over 2.5.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Liens</h4>
            <a href="#pronos" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">Pronostics</a>
            <a href="#resultats" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">Résultats</a>
            <a href="#vip" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">VIP</a>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Légal</h4>
            <a href="#" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">Mentions légales</a>
            <a href="#" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">CGU</a>
            <a href="#" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">Jeu responsable</a>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-widest text-[var(--color-text-muted)]">Contact</h4>
            <a href={SITE.whatsapp} target="_blank" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">WhatsApp</a>
            <a href={SITE.tiktok} target="_blank" className="block text-xs text-[var(--color-text-secondary)] hover:text-white py-0.5">TikTok</a>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-6">
          <h3 className="font-bold text-white mb-3 text-sm">Questions fréquentes</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {FAQ_ITEMS.map((item, i) => (
              <details key={i} className="glass rounded-xl p-3 text-xs">
                <summary className="font-semibold text-white cursor-pointer">{item.q}</summary>
                <p className="text-[var(--color-text-secondary)] mt-2 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="glass rounded-xl p-3 text-center text-[10px] text-[var(--color-text-muted)] leading-relaxed">
          Liens d'affiliation — BTTSPredict est un site informatif indépendant. Les paris sportifs comportent des risques.
          18+ · Jouez responsable · <a href="https://www.begambleaware.org/" className="underline">BeGambleAware</a>
        </div>
      </div>
    </footer>
  )
}
