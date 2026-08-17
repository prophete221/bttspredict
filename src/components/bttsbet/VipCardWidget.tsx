'use client'

import { AFFILIATE, SITE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

/**
 * VipCardWidget — Carte VIP compacte
 * À insérer en bas de chaque page du site
 */
export default function VipCardWidget() {
  return (
    <section id="vip-card-widget" className="py-6 px-4" style={{ backgroundColor: '#071018' }}>
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(7, 17, 26, 0.9), rgba(75, 182, 135, 0.08))',
            border: '1px solid rgba(127, 162, 198, 0.30)',
          }}
        >
          {/* Badge VIP */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: '#B8FF1A', color: '#071018' }}
            >
              ⭐ VIP PREMIUM
            </span>
            <span className="text-[10px]" style={{ color: '#B7C4C1' }}>Résultats publics sur /historique</span>
          </div>

          <h3 className="text-sm font-bold mb-2" style={{ color: '#F5F8F3', fontFamily: 'Poppins, sans-serif' }}>
            Accède aux sélections premium du jour
          </h3>
          <p className="text-[11px] mb-3" style={{ color: '#B7C4C1' }}>
            Analyses et sélections premium · conditions d’accès à vérifier avant toute inscription ou dépôt
          </p>

          {/* Étapes */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#B7C4C1' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>1</span>
              Inscris-toi
            </div>
            <span style={{ color: '#5D7880' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#B7C4C1' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>2</span>
              Vérifie les conditions
            </div>
            <span style={{ color: '#5D7880' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#B7C4C1' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>3</span>
              VIP activé
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2">
            <a
              href={AFFILIATE.linebet}
              rel="sponsored nofollow noopener noreferrer"
              target="_blank"
              className="flex-1 text-center py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: '#B8FF1A', color: '#071018' }}
              onClick={() => trackAffiliateAction('linebet', 'signup', 'vip-card-widget')}
              data-cta="vip-card-linebet"
            >
              Voir l’accès VIP
            </a>
            <a
              href="https://wa.me/15406704172"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: 'rgba(75, 182, 135, 0.15)', border: '1px solid #B8FF1A', color: '#B8FF1A' }}
            >
              WhatsApp
            </a>
          </div>

          {/* Code promo */}
          <div className="mt-3 text-center">
            <span className="text-[10px]" style={{ color: '#B7C4C1' }}>Code promo: </span>
            <span className="font-mono font-bold text-[11px]" style={{ color: '#B8FF1A' }}>{SITE.promoCode}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
