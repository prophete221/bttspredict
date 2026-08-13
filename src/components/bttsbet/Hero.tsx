
'use client'

import { useScrollAnimation } from '@/hooks/useAnimations'

/**
 * Hero — Command Center
 *
 * Un point d'entrée de plateforme, pas un article : le visiteur comprend
 * immédiatement le marché couvert, l'état des données et l'action suivante.
 */
export default function Hero() {
  const [sectionRef, isVisible] = useScrollAnimation(0.05)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0B1220 0%, #101A2B 58%, #0B1220 100%)',
        borderBottom: '1px solid rgba(169, 196, 223, 0.16)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-32 -right-20 h-80 w-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(127,162,198,0.18), transparent 68%)', filter: 'blur(18px)' }}
        />
        <div
          className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(211,177,109,0.10), transparent 66%)', filter: 'blur(22px)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: 'linear-gradient(rgba(244,247,251,1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,251,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div
        className="relative z-10 mx-auto max-w-[560px] px-4 pb-8 pt-7 sm:px-6 sm:pb-10 sm:pt-9"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 420ms ease, transform 420ms ease' }}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ background: 'rgba(127,162,198,0.12)', border: '1px solid rgba(169,196,223,0.34)', color: '#A9C4DF' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#4BB687', boxShadow: '0 0 0 4px rgba(75,182,135,0.14)' }} />
            Tableau BTTS en direct
          </span>
          <span className="text-[10px] font-medium tabular-nums" style={{ color: '#9AA9BB' }}>Africa / GMT</span>
        </div>

        <h1 className="max-w-[520px] text-[clamp(2rem,8vw,3.7rem)] font-semibold leading-[0.98] tracking-[-0.055em]" style={{ color: '#F4F7FB', fontFamily: 'Poppins, sans-serif' }}>
          La plateforme mondiale de référence pour les prédictions BTTS.
        </h1>
        <p className="mt-4 max-w-[480px] text-[14px] leading-[1.65] sm:text-[15px]" style={{ color: '#C2CCD8' }}>
          Sélections BTTS, Over 2,5 et score exact sur des matchs internationaux, avec données horodatées, historique public et méthode documentée.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-[430px]">
          {[
            ['BTTS', 'Les deux marquent'],
            ['O2.5', 'Total de buts'],
            ['SCORE', 'Projection exacte'],
          ].map(([label, caption]) => (
            <div key={label} className="rounded-2xl px-3 py-3" style={{ background: 'rgba(17,26,42,0.78)', border: '1px solid rgba(127,162,198,0.28)' }}>
              <div className="text-[12px] font-bold tracking-[0.12em]" style={{ color: '#D3B16D' }}>{label}</div>
              <div className="mt-1 text-[10px] leading-tight" style={{ color: '#9AA9BB' }}>{caption}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="/btts/predictions/today" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl px-5 text-[13px] font-bold transition-transform hover:scale-[1.01]" style={{ background: '#D3B16D', color: '#0B1220', boxShadow: '0 10px 30px rgba(211,177,109,0.16)' }} data-cta="hero-primary">
            Ouvrir le tableau du jour
            <span className="ml-2" aria-hidden="true">→</span>
          </a>
          <a href="/code-promo-linebet-senegal" className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl px-5 text-[13px] font-semibold transition-colors hover:bg-white/10" style={{ background: 'rgba(127,162,198,0.10)', border: '1px solid rgba(169,196,223,0.34)', color: '#F4F7FB' }} data-cta="hero-secondary">
            Activer VISION221
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px]" style={{ color: '#9AA9BB' }}>
          <span className="inline-flex items-center gap-1.5"><span style={{ color: '#4BB687' }}>✓</span> Publication avant match</span>
          <span className="inline-flex items-center gap-1.5"><span style={{ color: '#4BB687' }}>✓</span> Gagnés et perdus archivés</span>
          <span className="inline-flex items-center gap-1.5"><span style={{ color: '#4BB687' }}>✓</span> Aucune garantie de gain</span>
        </div>
      </div>
    </section>
  )
}
