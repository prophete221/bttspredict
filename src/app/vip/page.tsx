import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'
import { checkSeo } from '@/lib/seo'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

/* ──────────────────────────────────────────────────────────────
   Metadata — VIP court (v64.1)
   ────────────────────────────────────────────────────────────── */
const TITLE = 'VIP — 6 Pronostics BTTS Premium Afrique Ouest'
const DESCRIPTION = "Programme VIP BTTSPredict : 6 pronostics BTTS premium + Over 2.5 + xG par jour. Accès après activation Linebet ou 888Starz. Aucun gain garanti. 18+."
checkSeo('vip', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'VIP BTTSPredict — 6 Pronostics BTTS Premium',
    description: DESCRIPTION,
    url: 'https://bttspredict.com/vip',
    type: 'website',
  },
}

/**
 * VIP page — Plateforme PRO v64.1
 *
 * Refonte minimaliste AVEC DATA :
 *   - 1 carte pricing centrée (4900 FCFA / mois)
 *   - 2 boutons affiliés côte à côte (Linebet + 888Starz)
 *   - 3 cartes pronostics VIP floutées (blur + cadenas) pour montrer
 *     qu'il y a du contenu, pas 0 carte
 *
 * Max 80 mots de texte explicatif.
 */

// 3 avatars de matchs VIP floutés (anti-"VIP vide")
const VIP_PREVIEW = [
  { home: 'Real Madrid', away: 'Barcelona', league: 'La Liga', time: '21:00', proba: '67%' },
  { home: 'Liverpool', away: 'Arsenal', league: 'Premier League', time: '18:30', proba: '61%' },
  { home: 'Bayern Munich', away: 'Dortmund', league: 'Bundesliga', time: '20:30', proba: '64%' },
]

const VIP_BENEFITS = [
  '6 pronostics BTTS + Over 2.5 premium par jour',
  'Indices xG (Expected Goals) détaillés par équipe',
  'Accès multi-sports : Football, NBA, NFL, Tennis, UFC',
]

export default function VipPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Hero — 1 titre + 1 phrase (max 80 mots) */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-4 text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', color: '#FFC857' }}
          >
            ★ Programme VIP
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Poppins, sans-serif', color: '#F7F8FF' }}
          >
            VIP BTTSPredict — 6 Pronostics BTTS Premium
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#A5ABC5' }}>
            Débloque 6 pronostics premium BTTS + Over 2.5 + indices xG par jour.
            Accès après inscription chez Linebet ou 888Starz. Aucun gain garanti. 18+.
          </p>
        </section>

        {/* Carte pricing unique + 2 CTA */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-8">
          <div
            className="rounded-2xl p-6 sm:p-8 text-center"
            style={{
              backgroundColor: '#0D1630',
              border: '1.5px solid #FFC857',
              boxShadow: '0 0 60px rgba(255, 200, 87, 0.15), 0 10px 40px rgba(0,0,0,0.4)',
            }}
          >
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#FFC857' }}>
              Plan Mensuel
            </p>
            <p
              className="text-5xl sm:text-6xl font-black mb-1"
              style={{ color: '#FFC857', fontFamily: 'var(--font-mono), monospace', textShadow: '0 0 30px rgba(255, 200, 87, 0.5)' }}
            >
              4 900 FCFA
            </p>
            <p className="text-xs mb-5" style={{ color: '#A5ABC5' }}>
              / mois · Annulable à tout moment · 6 pronostics/jour
            </p>

            {/* Liste avantages */}
            <ul className="text-left space-y-2 mb-6 max-w-md mx-auto">
              {VIP_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm" style={{ color: '#F7F8FF' }}>
                  <span className="text-[#5DFDCB] flex-shrink-0 mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* 2 boutons affiliés côte à côte */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <a
                href={AFFILIATE.linebet}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: '#5146F5',
                  color: '#F7F8FF',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(81, 70, 245, 0.3)',
                }}
                data-cta="vip-linebet-v64"
              >
                S&apos;inscrire sur Linebet →
              </a>
              <a
                href={AFFILIATE.star888}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="flex-1 h-[52px] rounded-[10px] font-bold text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: '#FF7900',
                  color: '#070B18',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(255, 121, 0, 0.3)',
                }}
                data-cta="vip-888starz-v64"
              >
                Bonus 888Starz →
              </a>
            </div>

            <p className="text-[10px] mt-4" style={{ color: '#6B7194' }}>
              Lien d&apos;affiliation rémunéré · Code promo VISION221 · 18+ · Jouer responsable
            </p>
          </div>
        </section>

        {/* 3 cartes VIP floutées (preview pour montrer qu'il y a du contenu) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <h2
            className="text-xl sm:text-2xl mb-4 text-center"
            style={{ fontFamily: 'Poppins, sans-serif', color: '#F7F8FF' }}
          >
            Aperçu des pronostics VIP du jour
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VIP_PREVIEW.map((match) => (
              <div
                key={match.home}
                className="relative rounded-2xl p-5 overflow-hidden"
                style={{
                  backgroundColor: '#0D1630',
                  border: '1px solid rgba(255, 200, 87, 0.2)',
                }}
              >
                {/* Blur overlay qui masque le détail */}
                <div
                  className="absolute inset-0 z-10 backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(13, 22, 48, 0.4)' }}
                  aria-hidden="true"
                />

                {/* Cadenas en haut à droite */}
                <div
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255, 200, 87, 0.15)', border: '1px solid #FFC857' }}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFC857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                {/* Contenu visible (league + date) */}
                <div className="relative z-0">
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: '#FFC857' }}>
                    {match.league}
                  </p>
                  <p className="text-base font-bold mb-1" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>
                    {match.home}
                  </p>
                  <p className="text-xs mb-3" style={{ color: '#A5ABC5' }}>vs {match.away}</p>
                  <p className="text-xs" style={{ color: '#6B7194' }}>{match.time}</p>

                  {/* Proba floutée */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase" style={{ color: '#6B7194' }}>Proba BTTS</span>
                    <span className="text-lg font-black" style={{ color: '#5DFDCB', filter: 'blur(4px)', userSelect: 'none' }}>
                      {match.proba}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] mt-4" style={{ color: '#6B7194' }}>
            🔒 Débloque l&apos;accès complet en t&apos;inscrivant chez Linebet ou 888Starz ci-dessus
          </p>
        </section>

        {/* Disclaimer */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 113, 133, 0.06)', border: '1px solid rgba(255, 113, 133, 0.2)' }}>
            <p className="text-[11px] leading-relaxed" style={{ color: '#A5ABC5' }}>
              ⚠ Aucun gain n&apos;est garanti. Les paris sportifs comportent un risque de perte.
              BTTSPredict ne prend pas de paris et ne collecte pas de fonds. Bonus soumis aux
              conditions du bookmaker. <a href="/jouer-responsable" className="underline" style={{ color: '#5146F5' }}>En savoir plus</a>.
            </p>
          </div>
        </section>

        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
