'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import CopyableCode from './CopyableCode'
import VipUnlockModal from './VipUnlockModal'

// ─── Palette ────────────────────────────────────────────────────────────
const C = {
  bg:       '#0D0F12',
  card:     '#1E2228',
  elevated: '#1E2228',
  border:   '#A8B3C7',
  neon:     '#D4AF37',
  neonDk:   '#00A87E',
  gold:     '#D4AF37',
  text:     '#F4F7FA',
  textSec:  '#D4AF37',
  textMute: '#A8B3C7',
}

// ─── Deterministic daily cote ────────────────────────────────────────────
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
        if (!data?.predictions) return
        const matchMap = new Map<string, VipMatch>()
        for (const p of data.predictions) {
          if (getMatchStatus(p.date, p.time) === 'finished') continue
          const key = p.match
          if (!matchMap.has(key)) {
            const [home, away] = p.match.split(/\s+vs?\s+/i)
            const status = getMatchStatus(p.date, p.time)
            matchMap.set(key, {
              match: p.match, homeTeam: home?.trim() || '', awayTeam: away?.trim() || '',
              league: p.league, date: p.date, time: p.time || '--:--',
              homeLogo: p.homeLogo || '', awayLogo: p.awayLogo || '',
              cote: 1.5, confidence: 52, index: 0, status: status as 'live' | 'upcoming',
            })
          }
        }
        const today = new Date().toISOString().slice(0, 10)
        const allMatches = [...matchMap.values()]
          .sort((a, b) => {
            if (a.status === 'live' && b.status !== 'live') return -1
            if (b.status === 'live' && a.status !== 'live') return 1
            return (a.time || '').localeCompare(b.time || '')
          })
          .slice(0, 6)
        const matchCount = allMatches.length || 1
        const cotePerMatch = Math.pow(dailyCote, 1 / matchCount)
        const vipData = allMatches.map((m, i) => ({ ...m, cote: cotePerMatch, confidence: 52 + (i % 5), index: i }))
        setVipMatches(vipData)
      })
      .catch(() => {})
  }, [dailyCote])

  const liveCount = vipMatches.filter(m => m.status === 'live').length

  return (
    <>
      <section ref={ref} id="vip" className="section-pad overflow-x-hidden relative overflow-hidden" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(50% 30% at 50% 0%, rgba(212, 175, 55,0.06) 0%, transparent 70%)',
        }} />

        <div className="max-w-[440px] mx-auto relative">
          {/* ═══ HEADER compact ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: C.neon }}>ZONE PREMIUM</span>
            <h2 className="font-bold text-xl mt-1" style={{ color: C.text }}>Coupon VIP du jour</h2>
            <p className="text-[12px] mt-1" style={{ color: C.textSec }}>
              {vipMatches.length} sélections · Cote totale <span className="font-mono font-bold" style={{ color: C.neon }}>VIP</span>
            </p>
          </motion.div>

          {/* ═══ STATS COMPACT (3 mini-tiles inline) ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]" style={{ background: '#1E2228', border: '1px solid rgba(244, 247, 250, 0.08)' }}>
              <span className="font-mono text-[14px] font-bold text-papier" ref={matchCountRef}>{matchCountDisplay}</span>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: C.textMute }}>matchs</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]" style={{ background: 'rgba(212, 175, 55,0.06)', border: '1px solid rgba(212, 175, 55,0.15)' }}>
              <span className="font-mono text-[14px] font-bold" style={{ color: C.neon }}>~75%</span>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: C.textMute }}>précision</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]" style={{ background: '#1E2228', border: '1px solid rgba(244, 247, 250, 0.08)' }}>
              <span className="font-mono text-[14px] font-bold text-papier">7</span>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: C.textMute }}>série jours</span>
            </div>
          </motion.div>

          {/* ═══ COUPON CARD — compact, premium ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[16px] overflow-hidden"
          style={{ backgroundColor: '#1E2228', border: '1px solid rgba(244, 247, 250, 0.08)', boxShadow: '0 8px 30px rgba(13, 15, 18,0.4)' }}
            style={{ boxShadow: '0 8px 30px rgba(13, 15, 18,0.4)' }}
          >
            {/* Top accent line */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55,0.4), transparent)' }} />

            {/* Match list — 2 visible + rest blurred */}
            <div className="p-3">
              {vipMatches.slice(0, 2).map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 py-2 px-2 rounded-[10px] mb-1"
                  style={{ background: 'rgba(244, 247, 250,0.02)' }}
                >
                  <span className="font-mono text-[10px] w-8 text-center" style={{ color: m.status === 'live' ? C.neon : C.textMute }}>
                    {m.status === 'live' ? 'LIVE' : m.time}
                  </span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {m.homeLogo && <img src={m.homeLogo} alt={`Logo ${m.homeTeam}`} className="w-4 h-4 object-contain flex-shrink-0" loading="lazy" />}
                    <span className="text-[11px] font-semibold text-papier truncate">{m.homeTeam}</span>
                    <span className="text-[9px] text-cendre flex-shrink-0">vs</span>
                    <span className="text-[11px] font-semibold text-papier truncate">{m.awayTeam}</span>
                    {m.awayLogo && <img src={m.awayLogo} alt={`Logo ${m.awayTeam}`} className="w-4 h-4 object-contain flex-shrink-0" loading="lazy" />}
                  </div>
                  <span className="font-mono text-[10px] font-bold flex-shrink-0" style={{ color: C.neon }}>VIP</span>
                </motion.div>
              ))}

              {/* Blurred matches */}
              {vipMatches.length > 2 && (
                <div className="relative" style={{ filter: 'blur(6px)', opacity: 0.5, pointerEvents: 'none' }}>
                  {vipMatches.slice(2, 5).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 py-2 px-2 rounded-[10px] mb-1" style={{ background: 'rgba(244, 247, 250,0.02)' }}>
                      <span className="font-mono text-[10px] w-8" style={{ color: C.textMute }}>{m.time}</span>
                      <span className="text-[11px] text-papier truncate flex-1">{m.match}</span>
                      <span className="font-mono text-[10px] font-bold" style={{ color: C.neon }}>VIP</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Lock overlay */}
              <div className="relative flex items-center justify-center py-3 mt-1">
                <div className="absolute inset-0 flex items-center justify-center" style={{
                  background: 'rgba(13, 15, 18, 0.9)',
                }}>
                  <motion.button
                    onClick={() => setShowVipModal(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] font-bold text-[13px]"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #00A87E 100%)',
                      color: '#0D0F12',
                      boxShadow: '0 4px 20px rgba(212, 175, 55,0.3)',
                    }}
                    data-cta="vip-unlock"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Débloquer les {vipMatches.length} sélections
                  </motion.button>
                </div>
                <span className="text-[10px]" style={{ color: C.textMute }}>
                  +{Math.max(0, vipMatches.length - 2)} sélections verrouillées
                </span>
              </div>
            </div>

            {/* Cote totale bar */}
            <div className="px-3 py-2.5 flex items-center justify-between border-t" style={{ borderColor: '#1E2228' }}>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Cote totale</span>
              <span className="font-mono text-[16px] font-bold" style={{ color: C.neon }}>VIP</span>
            </div>
          </motion.div>

          {/* ═══ Bonus + CTA compact ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-3 flex items-center justify-between gap-3 px-4 py-3 rounded-[14px]"
          style={{ backgroundColor: '#1E2228', border: '1px solid rgba(244, 247, 250, 0.08)' }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Code promo</div>
              <CopyableCode code={SITE.promoCode} displayClassName="font-mono text-base font-bold" />
            </div>
            <span className="text-[11px] text-right" style={{ color: C.textSec }}>
              Bonus<br /><span className="font-bold" style={{ color: C.neon }}>exclusif</span>
            </span>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />
    </>
  )
}
