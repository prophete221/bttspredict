'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import CopyableCode from './CopyableCode'
import VipUnlockModal from './VipUnlockModal'

const C = { bg:'#070A14', card:'#111827', elevated:'#111827', border:'#1F2937', neon:'#D4AF37', neonDk:'#10B981', gold:'#D4AF37', text:'#F1F5F9', textSec:'#94A3B8', textMute:'#64748B' }

function getDailyCote(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const fraction = x - Math.floor(x)
  return Math.round((12 + fraction * 18) * 100) / 100
}

function getMatchStatus(date: string, time?: string): 'live' | 'upcoming' | 'finished' {
  if (!date) return 'finished'
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const md = new Date(date + 'T00:00:00'); md.setHours(0, 0, 0, 0)
    if (md.getTime() < today.getTime()) return 'finished'
    if (md.getTime() > today.getTime()) return 'upcoming'
    if (!time || time === '--:--' || !/^\d{2}:\d{2}$/.test(time)) return 'upcoming'
    const [h, m] = time.split(':').map(Number)
    const mdt = new Date(date + 'T00:00:00'); mdt.setHours(h, m, 0, 0)
    const diffMs = mdt.getTime() - Date.now()
    const diffHours = diffMs / (1000 * 60 * 60)
    if (diffMs < 0 && diffHours > -2.5) return 'live'
    if (diffMs < 0) return 'finished'
    return 'upcoming'
  } catch { return 'finished' }
}

type VipMatch = {
  match: string; homeTeam: string; awayTeam: string; league: string
  date: string; time: string; homeLogo: string; awayLogo: string
  cote: number; confidence: number; index: number; status: 'live' | 'upcoming'
}

const FALLBACK: VipMatch[] = [
  { match: "FC Porto vs Alverca", homeTeam: "FC Porto", awayTeam: "Alverca", league: "Primeira Liga", date: new Date().toISOString().slice(0, 10), time: "19:00", homeLogo: "", awayLogo: "", cote: 1.5, confidence: 52, index: 0, status: 'upcoming' },
  { match: "Teungueth vs Jaraaf", homeTeam: "Teungueth", awayTeam: "Jaraaf", league: "L1 Sénégal", date: new Date().toISOString().slice(0, 10), time: "16:30", homeLogo: "", awayLogo: "", cote: 1.5, confidence: 52, index: 1, status: 'upcoming' },
  { match: "Raja vs Wydad", homeTeam: "Raja", awayTeam: "Wydad", league: "Botola", date: new Date().toISOString().slice(0, 10), time: "20:00", homeLogo: "", awayLogo: "", cote: 1.5, confidence: 52, index: 2, status: 'upcoming' },
  { match: "ASEC vs AFAD", homeTeam: "ASEC", awayTeam: "AFAD", league: "L1 CI", date: new Date().toISOString().slice(0, 10), time: "18:00", homeLogo: "", awayLogo: "", cote: 1.5, confidence: 52, index: 3, status: 'upcoming' },
  { match: "Arsenal vs Man City", homeTeam: "Arsenal", awayTeam: "Man City", league: "Premier League", date: new Date().toISOString().slice(0, 10), time: "21:00", homeLogo: "", awayLogo: "", cote: 1.5, confidence: 52, index: 4, status: 'upcoming' },
  { match: "Horoya vs Hafia", homeTeam: "Horoya", awayTeam: "Hafia", league: "L1 Guinée", date: new Date().toISOString().slice(0, 10), time: "17:00", homeLogo: "", awayLogo: "", cote: 1.5, confidence: 52, index: 5, status: 'upcoming' },
]

export default function PromoVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showVipModal, setShowVipModal] = useState(false)
  const [vipMatches, setVipMatches] = useState<VipMatch[]>([])
  const dailyCote = useMemo(() => getDailyCote(), [])
  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1500, { decimals: 2, threshold: 0.3 })
  const [matchCountRef, matchCountDisplay] = useCountUp(0, 1200, { threshold: 0.3 })

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) throw new Error('no predictions')
        const map = new Map<string, VipMatch>()
        for (const p of data.predictions) {
          if (getMatchStatus(p.date, p.time) === 'finished') continue
          const key = p.match
          if (!map.has(key)) {
            const [home, away] = (p.match || '').split(/\s+vs?\s+/i)
            map.set(key, {
              match: p.match, homeTeam: home?.trim() || '', awayTeam: away?.trim() || '',
              league: p.league || '', date: p.date || '', time: p.time || '--:--',
              homeLogo: p.homeLogo || '', awayLogo: p.awayLogo || '',
              cote: 1.5, confidence: 52, index: 0,
              status: getMatchStatus(p.date, p.time) as 'live' | 'upcoming',
            })
          }
        }
        let all = [...map.values()].sort((a, b) => {
          if (a.status === 'live' && b.status !== 'live') return -1
          if (b.status === 'live' && a.status !== 'live') return 1
          return (a.time || '').localeCompare(b.time || '')
        }).slice(0, 6)
        if (all.length === 0) all = FALLBACK
        const mc = all.length || 1
        const cpm = Math.pow(dailyCote, 1 / mc)
        setVipMatches(all.map((m, i) => ({ ...m, cote: cpm, confidence: 52 + (i % 5), index: i })))
      })
      .catch(() => {
        const mc = FALLBACK.length || 1
        const cpm = Math.pow(dailyCote, 1 / mc)
        setVipMatches(FALLBACK.map((m, i) => ({ ...m, cote: cpm, confidence: 52 + (i % 5), index: i })))
      })
  }, [dailyCote])

  return (
    <>
      <section ref={ref} id="vip-coupon" className="section-pad overflow-hidden relative" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(50% 30% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)' }} />
        <div className="max-w-[440px] mx-auto relative">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.5 }} className="text-center mb-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: C.neonDk }}>ZONE PREMIUM AUTONOME • {new Date().toLocaleDateString('fr-FR')}</span>
            <h2 className="font-bold text-xl mt-1" style={{ color: C.text }}>Coupon VIP du jour</h2>
            <p className="text-[12px] mt-1" style={{ color: C.textSec }}>{vipMatches.length} sélections réelles • Cote totale <span className="font-mono font-bold" style={{ color: C.neon }}>VIP</span></p>
          </motion.div>

          {/* Stats compact */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.4, delay: 0.1 }} className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <span className="font-mono text-[14px] font-bold" style={{ color: C.text }} ref={matchCountRef}>{vipMatches.length || matchCountDisplay}</span>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: C.textMute }}>matchs jour</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span className="font-mono text-[12px] font-bold" style={{ color: C.neonDk }}>TEAM VISIBLE</span>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: C.textMute }}>flouté 12px</span>
            </div>
          </motion.div>

          {/* Coupon card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-[16px] overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, boxShadow: '0 8px 30px rgba(7,10,20,0.5)' }}>
            {/* Top accent */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(16,185,129,0.5), transparent)' }} />

            <div className="p-3">
              {/* 2 matchs VISIBLES */}
              {vipMatches.slice(0, 2).map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={isVisible ? { opacity: 1, x: 0 } : undefined} transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }} className="flex items-center gap-2 py-2 px-2 rounded-[10px] mb-1" style={{ background: 'rgba(212,175,55,0.04)' }}>
                  <span className="font-mono text-[10px] w-8 text-center" style={{ color: m.status === 'live' ? C.neonDk : C.textMute }}>{m.status === 'live' ? 'LIVE' : m.time}</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {m.homeLogo && <img src={m.homeLogo} alt="" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy" />}
                    <span className="text-[11px] font-semibold truncate" style={{ color: C.text }}>{m.homeTeam}</span>
                    <span className="text-[9px] flex-shrink-0" style={{ color: C.textMute }}>vs</span>
                    <span className="text-[11px] font-semibold truncate" style={{ color: C.text }}>{m.awayTeam}</span>
                    {m.awayLogo && <img src={m.awayLogo} alt="" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy" />}
                  </div>
                  <span className="font-mono text-[10px] font-bold flex-shrink-0" style={{ color: C.neon }}>VISIBLE</span>
                </motion.div>
              ))}

              {/* Matchs FLOUTÉS */}
              {vipMatches.length > 2 && (
                <div className="relative">
                  <div style={{ filter: 'blur(12px)', opacity: 0.6, pointerEvents: 'none' }}>
                    {vipMatches.slice(2).map((m, i) => (
                      <div key={i} className="flex items-center gap-2 py-2 px-2 rounded-[10px] mb-1" style={{ background: 'rgba(241,245,249,0.02)' }}>
                        <span className="font-mono text-[10px] w-8" style={{ color: C.textMute }}>{m.time}</span>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="text-[11px] font-bold truncate" style={{ color: C.text }}>{m.homeTeam}</span>
                          <span className="text-[9px]" style={{ color: C.textMute }}>vs</span>
                          <span className="text-[11px] font-bold truncate" style={{ color: C.text }}>{m.awayTeam}</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold" style={{ color: C.neon }}>{m.cote.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(7,10,20,0.75)', backdropFilter: 'blur(2px)' }}>
                    <motion.button onClick={() => setShowVipModal(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] font-bold text-[13px]" style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.neonDk} 100%)`, color: '#070A14', boxShadow: '0 4px 20px rgba(212,175,55,0.3)' }} data-cta="vip-unlock">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      Débloquer les {vipMatches.length} sélections
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Cote totale bar */}
            <div className="px-3 py-2.5 flex items-center justify-between border-t" style={{ borderColor: C.border }}>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Cote totale</span>
              <span className="font-mono text-[16px] font-bold" ref={coteRef} style={{ color: C.neon }}>{coteDisplay}</span>
            </div>
          </motion.div>

          {/* Code promo bar */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={isVisible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.4, delay: 0.4 }} className="mt-3 flex items-center justify-between gap-3 px-4 py-3 rounded-[14px]" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Code promo</div>
              <CopyableCode code={SITE.promoCode} displayClassName="font-mono text-base font-bold" />
            </div>
            <span className="text-[11px] text-right" style={{ color: C.textSec }}>Bonus<br /><span className="font-bold" style={{ color: C.neon }}>exclusif AUTONOME</span></span>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />
    </>
  )
}
