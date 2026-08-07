'use client'

import { AFFILIATE, SITE } from '@/lib/constants'

/**
 * VipCardWidget — Carte VIP compacte
 * À insérer en bas de chaque page du site
 */
export default function VipCardWidget() {
  return (
    <section id="vip-card-widget" className="py-6 px-4" style={{ backgroundColor: '#050507' }}>
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(12, 12, 16, 0.9), rgba(168, 162, 158, 0.08))',
            border: '1px solid rgba(168, 162, 158, 0.3)',
          }}
        >
          {/* Badge VIP */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: '#A8A29E', color: '#050507' }}
            >
              ⭐ VIP PREMIUM
            </span>
            <span className="text-[10px]" style={{ color: '#7A7874' }}>84,5% vérifié</span>
          </div>

          <h3 className="text-sm font-bold mb-2" style={{ color: '#F8F7F4', fontFamily: 'Poppins, sans-serif' }}>
            Débloque 20+ pronostics premium par jour
          </h3>
          <p className="text-[11px] mb-3" style={{ color: '#7A7874' }}>
            6 sports (Football, Tennis, NBA, NFL, UFC, Handball) · Value Bets FIFA · Cotes détaillées
          </p>

          {/* Étapes */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#7A7874' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px]" style={{ backgroundColor: '#A8A29E', color: '#050507' }}>1</span>
              Inscris-toi
            </div>
            <span style={{ color: '#2A2A30' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#7A7874' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px]" style={{ backgroundColor: '#A8A29E', color: '#050507' }}>2</span>
              Dépôt 3 000 / 6 000 / 12 000 XOF
            </div>
            <span style={{ color: '#2A2A30' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#7A7874' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px]" style={{ backgroundColor: '#A8A29E', color: '#050507' }}>3</span>
              VIP activé
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2">
            <a
              href={AFFILIATE.linebet}
              rel="sponsored noopener"
              target="_blank"
              className="flex-1 text-center py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: '#A8A29E', color: '#050507' }}
            >
              Débloquer le VIP
            </a>
            <a
              href="https://wa.me/15406704172"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: 'rgba(168, 162, 158, 0.15)', border: '1px solid #A8A29E', color: '#A8A29E' }}
            >
              WhatsApp
            </a>
          </div>

          {/* Code promo */}
          <div className="mt-3 text-center">
            <span className="text-[10px]" style={{ color: '#7A7874' }}>Code promo: </span>
            <span className="font-mono font-bold text-[11px]" style={{ color: '#A8A29E' }}>{SITE.promoCode}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
