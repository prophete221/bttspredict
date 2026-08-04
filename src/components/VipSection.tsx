'use client'

import { motion } from 'framer-motion'
import { SITE } from '@/lib/constants'

export default function VipSection() {
  return (
    <section id="vip" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: 'var(--color-neon)' }}>Premium</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Débloque les 8 sélections VIP du jour</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">Gratuit avec le code {SITE.promoCode} — cotes combinées, value bets et matchs premium</p>
          </div>

          {/* VIP Card */}
          <div className="glass rounded-3xl p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold mono text-white">8</div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Sélections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mono" style={{ color: 'var(--color-neon)' }}>25.69</div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Cote totale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mono text-white">~52%</div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Précision</div>
              </div>
            </div>

            {/* Locked matches */}
            <div className="space-y-2 relative">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xs mono text-[var(--color-text-muted)] w-12">19:0{i}</span>
                  <div className="flex-1 blur-md select-none">
                    <div className="text-sm text-white">Match Premium #{i}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">BTTS · Over 2.5</div>
                  </div>
                  <span className="text-sm mono font-bold" style={{ color: 'var(--color-neon)' }}>2.5{i}</span>
                </div>
              ))}
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-neon)' }}>VIP</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a href={SITE.affiliate} target="_blank" rel="sponsored noopener"
              className="mt-6 w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-base transition-all"
              style={{ background: 'var(--grad-primary)', color: '#0a0a0a', boxShadow: 'var(--shadow-cta)' }}>
              Débloquer avec {SITE.promoCode}
            </a>
            <p className="text-center text-[11px] text-[var(--color-text-muted)] mt-2">
              Inscris-toi sur Linebet avec le code · Bonus 90 000 XOF
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
