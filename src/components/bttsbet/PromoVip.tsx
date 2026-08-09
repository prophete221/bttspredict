'use client'
import { useState, useEffect, useMemo } from 'react'
import { SITE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import CopyableCode from './CopyableCode'
import VipUnlockModal from './VipUnlockModal'

const C = { bg:'#07111A', card:'#102333', border:'#1C3546', neon:'#C7F464', neonDk:'#63D6FF', text:'#F2F7F5', textSec:'#B5C4C9', textMute:'#7F969E' }

function getDailyCote(){ const t=new Date(); const s=t.getFullYear()*10000+(t.getMonth()+1)*100+t.getDate(); const x=Math.sin(s*9301+49297)*233280; return Math.round((12+(x-Math.floor(x))*18)*100)/100 }

const FALLBACK = [
  { home:"Teungueth", away:"Jaraaf", league:"Ligue 1 Sénégal", time:"16:30", xG_h:1.6, xG_a:1.1, odd_btts:1.90, prob_btts:65, odd_over:2.05, prob_over:68 },
  { home:"Raja", away:"Wydad", league:"Botola Pro (Maroc)", time:"20:00", xG_h:1.9, xG_a:1.4, odd_btts:1.80, prob_btts:70, odd_over:1.95, prob_over:74 },
  { home:"ASEC", away:"AFAD", league:"Ligue 1 Côte d'Ivoire", time:"18:00", xG_h:1.7, xG_a:0.9, odd_btts:2.00, prob_btts:62, odd_over:2.10, prob_over:66 },
  { home:"Arsenal", away:"Man City", league:"Premier League", time:"21:00", xG_h:2.1, xG_a:2.0, odd_btts:1.55, prob_btts:78, odd_over:1.65, prob_over:80 },
  { home:"Horoya", away:"Hafia", league:"Ligue 1 Guinée", time:"17:00", xG_h:1.5, xG_a:1.0, odd_btts:1.85, prob_btts:66, odd_over:1.90, prob_over:70 },
  { home:"FC Porto", away:"Alverca", league:"Primeira Liga", time:"19:00", xG_h:1.8, xG_a:1.2, odd_btts:1.75, prob_btts:68, odd_over:1.85, prob_over:72 },
]

export default function PromoVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showModal, setShowModal] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const dailyCote = useMemo(() => getDailyCote(), [])
  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1500, { decimals: 2, threshold: 0.3 })

  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        const arr: any[] = data?.predictions || data || []
        // Deduplicate by match name — each match appears ONLY ONCE
        const seen = new Set<string>()
        const unique: any[] = []
        for (const p of arr) {
          if (seen.has(p.match)) continue
          seen.add(p.match)
          unique.push(p)
        }
        // Take today's matches or upcoming, max 6 total
        const filtered = unique.filter(p => p.date >= todayStr).slice(0, 6)
        if (filtered.length >= 6) {
          setMatches(formatMatches(filtered))
        } else {
          // Complete with FALLBACK — but never duplicate a match already present
          const existingNames = new Set(filtered.map(p => p.match))
          const fallbackFiltered = FALLBACK.filter(f => !existingNames.has(`${f.home} vs ${f.away}`))
          const combined = [...filtered, ...fallbackFiltered.slice(0, 6 - filtered.length)]
          setMatches(formatMatches(combined.length > 0 ? combined : FALLBACK))
        }
      })
      .catch(() => {
        setMatches(formatMatches(FALLBACK))
      })
  }, [dailyCote])

  function formatMatches(arr: any[]): any[] {
    return arr.slice(0, 6).map((m, i) => {
      const [home, away] = m.match ? m.match.split(/\s+vs\s+/i) : [m.home, m.away]
      const a = m.analysis || {}
      return {
        id: i + 1,
        home: home?.trim() || m.home || '',
        away: away?.trim() || m.away || '',
        league: m.league || '',
        time: m.time || '--:--',
        xG_h: m.xG_h || a.homeLambda || 1.6,
        xG_a: m.xG_a || a.awayLambda || 1.1,
        odd_btts: m.odd_btts || 1.85,
        prob_btts: m.prob_btts || Math.round((a.bttsProb || 0.5) * 100) || 68,
        odd_over: m.odd_over || 1.95,
        prob_over: m.prob_over || Math.round((a.over25Prob || 0.5) * 100) || 70,
      }
    })
  }

  // TOUS les matchs sont floutés — aucun visible sans déblocage
  const blurred = matches.slice(0, 6)

  return (
    <>
      <section ref={ref} id="coupon-vip" className="py-6 relative">
        <div className="max-w-[480px] mx-auto relative">
          {/* Header — badge discret */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider" style={{ backgroundColor: 'rgba(99,214,255,0.08)', border: '1px solid rgba(99,214,255,0.2)', color: C.neonDk }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.neonDk }} />
              Mis à jour le {new Date().toLocaleDateString('fr-FR')}
            </span>
            <h2 className="font-bold text-[22px] mt-3" style={{ color: C.text }}>Coupon VIP du jour</h2>
            <p className="text-[12px] mt-1" style={{ color: C.textSec }}>{matches.length} matchs · Pronostics floutés · Débloque pour voir</p>
          </div>

          {/* Coupon card — tous floutés */}
          <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="h-[2px] w-full" style={{ backgroundColor: C.neon }} />

            <div className="p-2.5 space-y-2">
              {/* TOUS FLOUTÉS */}
              <div className="relative">
                <div style={{ filter: 'blur(12px)', opacity: 0.5, pointerEvents: 'none' }}>
                  {blurred.map((m, i) => (
                    <div key={m.id} className="rounded-[14px] overflow-hidden border mb-2" style={{ backgroundColor: '#0B1925', borderColor: C.border }}>
                      <div className="flex justify-between items-center px-3 py-2" style={{ backgroundColor: C.bg }}>
                        <span className="text-[10px]" style={{ color: C.textSec }}>{m.league} · {m.time}</span>
                        <span className="text-[9px]" style={{ color: C.textMute }}>VIP</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px]" style={{ backgroundColor: C.border, color: C.neon }}>{String(m.home)[0]}</div>
                          <span className="text-[13px] font-bold" style={{ color: C.text }}>{m.home}</span>
                          <span className="text-[10px]" style={{ color: C.textMute }}>xG {m.xG_h}</span>
                        </div>
                        <span className="text-[11px] px-2 py-1 rounded-full border" style={{ borderColor: 'rgba(199,244,100,0.2)', color: C.neon }}>VS</span>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px]" style={{ backgroundColor: C.border, color: C.neon }}>{String(m.away)[0]}</div>
                          <span className="text-[13px] font-bold" style={{ color: C.text }}>{m.away}</span>
                          <span className="text-[10px]" style={{ color: C.textMute }}>xG {m.xG_a}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: 'rgba(7,17,26,0.75)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.neon} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <span className="text-[10px] tracking-wider uppercase" style={{ color: C.textSec }}>{blurred.length} pronostics floutés</span>
                  <button onClick={() => setShowModal(true)} className="px-5 py-2 rounded-[10px] font-bold text-[12px]" style={{ backgroundColor: C.neon, color: C.bg }}>
                    Débloquer VIP pour voir
                  </button>
                </div>
              </div>
            </div>

            {/* Cote totale */}
            <div className="flex justify-between items-center px-4 py-3 border-t" style={{ borderColor: C.border }}>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Cote totale</span>
              <span className="font-mono text-[18px] font-bold" ref={coteRef} style={{ color: C.neon }}>{coteDisplay}</span>
            </div>
          </div>

          {/* Code promo bar */}
          <div className="mt-3 flex justify-between items-center px-4 py-2.5 rounded-[12px]" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div>
              <div className="text-[9px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Code promo</div>
              <CopyableCode code={SITE.promoCode} displayClassName="font-mono text-[15px] font-bold" />
            </div>
            <span className="text-[10px] text-right" style={{ color: C.textSec }}>{matches.length} matchs<br /><span style={{ color: C.neonDk }}>aujourd'hui</span></span>
          </div>
        </div>
      </section>

      <VipUnlockModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
