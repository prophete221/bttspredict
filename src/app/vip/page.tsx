import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { AFFILIATE } from '@/lib/constants'
import { checkSeo } from '@/lib/seo'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })

/* ──────────────────────────────────────────────────────────────
   Metadata — VIP court
   ────────────────────────────────────────────────────────────── */
const TITLE = 'VIP — Pronostics premium BTTS et Over 2.5'
const DESCRIPTION = "Programme VIP BTTSPredict : pronostics premium et multi-sports. Accès après activation chez le bookmaker partenaire. Aucun gain garanti. 18+."
checkSeo('vip', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'VIP BTTSPredict — Pronostics premium',
    description: DESCRIPTION,
    url: 'https://bttspredict.com/vip',
    type: 'website',
  },
}

/**
 * VIP page — Plateforme PRO v64
 *
 * Refonte minimaliste : 1 carte pricing + 2 boutons affiliés.
 * Plus de 297 lignes de répétitions, plus de VipSports / AviatorVip / HowToGetVip /
 * VipLevelModal — l'utilisateur clique sur un des 2 bookmakers et débloque le VIP.
 *
 * Max 60 mots de texte explicatif.
 */
export default function VipPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Hero — 1 titre + 1 phrase (max 60 mots) */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-4 text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(255, 200, 87, 0.12)', color: '#FFC857' }}
          >
            Programme VIP
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Poppins, sans-serif', color: '#F7F8FF' }}
          >
            Pronostics premium BTTS &amp; Over 2.5
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#A5ABC5' }}>
            Débloque l&apos;accès VIP en t&apos;inscrivant sur l&apos;un des bookmakers partenaires ci-dessous.
            Pronostics multi-sports, mise min. 200 XOF. Aucun gain garanti. 18+.
          </p>
        </section>

        {/* Carte pricing unique avec 2 CTA */}
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
              Accès VIP exclusif
            </p>
            <p
              className="text-5xl sm:text-6xl font-black mb-2"
              style={{ color: '#FFC857', fontFamily: 'var(--font-mono), monospace', textShadow: '0 0 30px rgba(255, 200, 87, 0.5)' }}
            >
              VISION221
            </p>
            <p className="text-xs mb-6" style={{ color: '#A5ABC5' }}>
              Code promo à saisir sur Linebet ou 888starz
            </p>

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
                S&apos;inscrire sur 888Starz →
              </a>
            </div>

            <p className="text-[10px] mt-4" style={{ color: '#6B7194' }}>
              Lien d&apos;affiliation rémunéré · Dépôt min. 200 XOF · 18+ · Jouer responsable
            </p>
          </div>
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
