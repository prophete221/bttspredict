'use client'

import { BOOKMAKERS } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

const oneXbetLogo = BOOKMAKERS.find((bookmaker) => bookmaker.id === '1xbet')?.logoFull ?? '/logos/1xbet-logo.png'
const linebetLogo = BOOKMAKERS.find((bookmaker) => bookmaker.id === 'linebet')?.logoFull ?? '/logos/linebet-logo.jpg'

/**
 * VipCardWidget — Carte VIP compacte
 * À insérer en bas de chaque page du site
 */
export default function VipCardWidget() {
  return (
    <section id="vip-card-widget" className="py-6 px-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(7, 17, 26, 0.9), rgba(47, 125, 255, 0.08))',
            border: '1px solid rgba(127, 162, 198, 0.30)',
          }}
        >
          {/* Badge VIP */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}
            >
              ⭐ VIP PREMIUM
            </span>
            <span className="text-[10px]" style={{ color: '#9DABBB' }}>Résultats publics sur /historique</span>
          </div>

          <h3 className="text-sm font-bold mb-2" style={{ color: '#F2F6FA', fontFamily: 'Poppins, sans-serif' }}>
            Accède aux sélections premium du jour
          </h3>
          <p className="text-[11px] mb-3" style={{ color: '#9DABBB' }}>
            Analyses et sélections premium · conditions d’accès à vérifier avant toute inscription ou dépôt
          </p>

          {/* Étapes */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#9DABBB' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>1</span>
              Consulte le guide
            </div>
            <span style={{ color: '#6B7A8C' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#9DABBB' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>2</span>
              Validation manuelle
            </div>
            <span style={{ color: '#6B7A8C' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#9DABBB' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}>3</span>
              Accès après validation
            </div>
          </div>

          {/* CTA — guides partenaires dédiés */}
          <div className="flex gap-2">
            <a
              href="/code-promo-1xbet"
              className="flex-1 inline-flex items-center justify-center gap-1 text-center py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: '#1B6EF3', color: '#FFFFFF' }}
              onClick={() => trackAffiliateAction('1xbet', 'partner_select', 'vip-card-widget')}
              data-cta="vip-card-1xbet"
            >
              <img src={oneXbetLogo} alt="" className="fi-partner-signup-logo" />Guide 1xBet
            </a>
            <a
              href="/code-promo-linebet-senegal"
              className="flex-1 inline-flex items-center justify-center gap-1 text-center py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: '#2F7DFF', color: '#FFFFFF' }}
              onClick={() => trackAffiliateAction('linebet', 'partner_select', 'vip-card-widget')}
              data-cta="vip-card-linebet"
            >
              <img src={linebetLogo} alt="" className="fi-partner-signup-logo" />Guide Linebet
            </a>
            <a
              href="https://wa.me/15406704172"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: 'rgba(47, 125, 255, 0.15)', border: '1px solid #2F7DFF', color: '#2F7DFF' }}
            >
              WhatsApp
            </a>
          </div>
          <div className="mt-2 text-center">
            <a href="/vip" className="text-[10px] font-bold" style={{ color: '#9DABBB' }}>Voir l&apos;espace VIP →</a>
          </div>

        </div>
      </div>
    </section>
  )
}
