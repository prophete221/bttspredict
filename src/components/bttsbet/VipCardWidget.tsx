'use client'

import { AFFILIATE, SITE } from '@/lib/constants'

/**
 * VipCardWidget — Carte VIP compacte
 * À insérer en bas de chaque page du site
 */
export default function VipCardWidget() {
  return (
    <section id="vip-card-widget" className="py-6 px-4" style={{ backgroundColor: '#070B18' }}>
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 22, 48, 0.9), rgba(81, 70, 245, 0.08))',
            border: '1px solid rgba(81, 70, 245, 0.3)',
          }}
        >
          {/* Badge VIP */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: '#5146F5', color: '#070B18' }}
            >
              ⭐ VIP PREMIUM
            </span>
            <span className="text-[10px]" style={{ color: '#A5ABC5' }}>Taux réel sur /historique</span>
          </div>

          <h3 className="text-sm font-bold mb-2" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>
            Débloque 20+ pronostics premium par jour
          </h3>
          <p className="text-[11px] mb-3" style={{ color: '#A5ABC5' }}>
            6 sports (Football, Tennis, NBA, NFL, UFC, Handball) · Analyses de valeur FIFA (expérimental) · Cotes détaillées
          </p>

          {/* Étapes */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#A5ABC5' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px]" style={{ backgroundColor: '#5146F5', color: '#070B18' }}>1</span>
              Inscris-toi
            </div>
            <span style={{ color: '#303861' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#A5ABC5' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px]" style={{ backgroundColor: '#5146F5', color: '#070B18' }}>2</span>
              Dépôt 3 000 / 6 000 / 12 000 XOF
            </div>
            <span style={{ color: '#303861' }}>→</span>
            <div className="flex items-center gap-1 text-[9px]" style={{ color: '#A5ABC5' }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px]" style={{ backgroundColor: '#5146F5', color: '#070B18' }}>3</span>
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
              style={{ backgroundColor: '#5146F5', color: '#070B18' }}
            >
              Débloquer le VIP
            </a>
            <a
              href="https://wa.me/15406704172"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-bold"
              style={{ backgroundColor: 'rgba(81, 70, 245, 0.15)', border: '1px solid #5146F5', color: '#5146F5' }}
            >
              WhatsApp
            </a>
          </div>

          {/* Code promo */}
          <div className="mt-3 text-center">
            <span className="text-[10px]" style={{ color: '#A5ABC5' }}>Code promo: </span>
            <span className="font-mono font-bold text-[11px]" style={{ color: '#5146F5' }}>{SITE.promoCode}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
