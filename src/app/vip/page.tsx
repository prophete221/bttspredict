import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { checkSeo } from '@/lib/seo'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipClient = dynamic(() => import('./VipClient'), { loading: () => null })

/* ──────────────────────────────────────────────────────────────
   Metadata — VIP affilié + tiers restaurés v67.2
   ────────────────────────────────────────────────────────────── */
const TITLE = 'Débloquer VIP 1 Mois Gratuit — VISION221 / vision221'
const DESCRIPTION = "VIP 1 mois gratuit : code VISION221 (Linebet) ou vision221 (888Starz), dépôt 3000F, ID vérifié 15-60min WhatsApp. 6 pronos BTTS/jour avec xG. 18+."
checkSeo('vip', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Débloquer VIP 1 Mois Gratuit — BTTSPredict',
    description: DESCRIPTION,
    url: 'https://bttspredict.com/vip',
    type: 'website',
  },
}

/* ─── 4 VIP Tiers restaurés depuis bttspredictbackup ────────────────
   Source : backup/main:src/components/bttsbet/VipCardGlass.tsx
   + backup/main:src/components/bttsbet/VipLevelModal.tsx
   + backup/main:src/components/bttsbet/HowToGetVip.tsx
   ──────────────────────────────────────────────────────────────────── */
const VIP_TIERS = [
  {
    level: 'VIP Silver',
    levelId: 'silver',
    deposit: '3 000 XOF',
    color: '#C0C0C0',
    benefits: [
      '10 pronostics premium par jour',
      'BTTS + Over 2.5 détaillés',
      'Historique complet accessible',
      'Support WhatsApp 24/7',
    ],
    ctaLabel: 'Débloquer Silver',
  },
  {
    level: 'VIP Gold',
    levelId: 'gold',
    deposit: '6 000 XOF',
    color: '#D4AF37',
    benefits: [
      '20 pronostics premium par jour',
      'Multi-sports (Football, Tennis, NBA, NFL, UFC, Handball)',
      'Value Bets FIFA inclus',
      'Cotes détaillées + analyse xG',
      'Support WhatsApp prioritaire',
    ],
    ctaLabel: 'Débloquer Gold',
  },
  {
    level: 'VIP Elite',
    levelId: 'elite',
    deposit: '12 000 XOF',
    color: '#D4AF37',
    benefits: [
      '30+ pronostics premium par jour',
      'Tous les sports + marchés spéciaux',
      'Stats Aviator + Value Bets illimités',
      'Analyse personnalisée par notre expert',
      'Support VIP direct (WhatsApp + Telegram)',
      'Accès anticipé aux nouvelles fonctionnalités',
    ],
    ctaLabel: 'Débloquer Elite',
  },
  {
    level: 'VIP TOUS NIVEAUX',
    levelId: 'all',
    deposit: '12 000 XOF · 1 mois',
    color: '#FFC857',
    benefits: [
      'Silver + Gold + Elite débloqués',
      'Tous les pronostics premium illimités',
      'Tous les sports et marchés',
      'Stats Aviator + Value Bets illimités',
      'Support VIP prioritaire 24/7',
      'Analyse personnalisée par notre expert',
    ],
    ctaLabel: 'Débloquer Tout — 1 mois',
  },
] as const

/**
 * VIP page v67.2 — Plateforme PRO affiliée + tiers restaurés
 *
 * Architecture :
 *   - VipClient : 2 cartes affiliées (Linebet VISION221 + 888Starz vision221)
 *     + section vérification WhatsApp +15406704172
 *     + avantages + aperçu flouté
 *   - VIP_TIERS grid : 4 niveaux restaurés depuis bttspredictbackup
 *     (Silver / Gold / Elite / Tous Niveaux)
 *   - Footer
 */
export default function VipPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        {/* VipClient : 2 cartes affiliées + WhatsApp verification + avantages + preview */}
        <VipClient />

        {/* ═══════════════════════════════════════════════════════════
            VIP TIERS — Restaurés depuis bttspredictbackup
            Source : VipCardGlass.tsx + VipLevelModal.tsx + HowToGetVip.tsx
            4 niveaux : Silver (3 000 XOF) / Gold (6 000 XOF) /
            Elite (12 000 XOF) / Tous Niveaux (12 000 XOF · 1 mois)
            ═══════════════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center mb-8">
            <span
              className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3"
              style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', color: '#FFC857', border: '1px solid rgba(255, 200, 87, 0.25)' }}
            >
              💎 Niveaux VIP
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#F1F5F9' }}
            >
              Choisis ton <span style={{ color: '#D4AF37' }}>niveau VIP</span>
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#94A3B8' }}>
              Choisis le niveau qui te correspond. Activation en moins de 30 minutes via WhatsApp après dépôt.
              Ou déblocage gratuit via code VISION221 / vision221 + dépôt 3 000 F ci-dessus.
            </p>
          </div>

          {/* Grille des 4 tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIP_TIERS.map((tier) => (
              <div
                key={tier.levelId}
                className="rounded-2xl p-5 relative flex flex-col"
                style={{
                  backgroundColor: '#111827',
                  border: `1.5px solid ${tier.color}33`,
                  boxShadow: `0 8px 30px ${tier.color}11`,
                }}
              >
                {/* Badge niveau */}
                <div
                  className="inline-block self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                  style={{ backgroundColor: `${tier.color}1A`, color: tier.color, border: `1px solid ${tier.color}44` }}
                >
                  {tier.level}
                </div>

                {/* Dépôt */}
                <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>
                  Dépôt min.
                </p>
                <p
                  className="text-2xl font-black mb-4"
                  style={{ color: tier.color, fontFamily: 'var(--font-mono), monospace' }}
                >
                  {tier.deposit}
                </p>

                {/* Avantages */}
                <ul className="space-y-2 mb-5 flex-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: '#94A3B8' }}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: tier.color }}>✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA — ancre vers section vérification WhatsApp */}
                <a
                  href="#playerId"
                  className="block text-center py-2.5 rounded-[10px] font-bold text-[12px] transition-all"
                  style={{
                    backgroundColor: tier.color,
                    color: '#070A14',
                    border: 'none',
                  }}
                >
                  {tier.ctaLabel}
                </a>
              </div>
            ))}
          </div>

          {/* Note de transparence */}
          <p className="text-center text-[11px] mt-5 leading-relaxed" style={{ color: '#64748B' }}>
            💡 Tous les niveaux sont débloqués manuellement après vérification de ton dépôt via WhatsApp.
            Aucun paiement direct à BTTSPredict — les dépôts se font chez le bookmaker partenaire (Linebet / 888Starz)
            avec le code promo VISION221 / vision221. Valable 30 jours. 18+ Jouer responsable.
          </p>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
