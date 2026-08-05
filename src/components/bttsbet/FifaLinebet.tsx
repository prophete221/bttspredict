'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import VipUnlockModal from './VipUnlockModal'

const C = {
  bg: '#020617', card: '#FFFFFF', border: 'rgba(0,229,255,0.08)',
  cyan: '#16A34A', violet: '#22C55E', gold: '#FFD700',
  text: '#FFFFFF', textSec: '#94A3B8', textMute: '#64748B',
}

const FIFA_TEAMS = [
  'France', 'Brazil', 'Argentina', 'Germany', 'Spain', 'England',
  'Portugal', 'Italy', 'Netherlands', 'Belgium', 'Croatia', 'Morocco',
  'Japan', 'South Korea', 'Uruguay', 'Colombia', 'Mexico', 'USA',
  'Senegal', 'Nigeria', 'Cameroon', 'Egypt', 'Ghana', 'Ivory Coast',
]

const FIFA_LEAGUES = [
  'FIFA World Cup', 'Copa America', 'EURO Qualifiers', 'African Cup',
  'Asian Cup', 'Nations League', 'Friendly International', 'World Cup Qualifiers',
]

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

interface FifaMatch { home: string; away: string; league: string; cote: number; iaProba: number }

function generateFifaMatches(seed: number, count: number): FifaMatch[] {
  const matches: FifaMatch[] = []
  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(seed + i * 7); const r2 = seededRandom(seed + i * 13 + 3); const r3 = seededRandom(seed + i * 19 + 7)
    const homeIdx = Math.floor(r1 * FIFA_TEAMS.length)
    let awayIdx = Math.floor(r2 * FIFA_TEAMS.length)
    if (awayIdx === homeIdx) awayIdx = (awayIdx + 1) % FIFA_TEAMS.length
    const league = FIFA_LEAGUES[Math.floor(r3 * FIFA_LEAGUES.length)]
    const cote = Math.round((3.5 + seededRandom(seed + i * 23) * 11.5) * 100) / 100
    const iaProba = Math.round(50 + seededRandom(seed + i * 29) * 30)
    matches.push({ home: FIFA_TEAMS[homeIdx], away: FIFA_TEAMS[awayIdx], league, cote, iaProba })
  }
  return matches
}

export default function FifaLinebet() {
  const [ref, isVisible] = useScrollAnimation()
  const [showModal, setShowModal] = useState(false)

  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const matches = useMemo(() => generateFifaMatches(seed, 3), [seed])
  const dailyCote = useMemo(() => {
    const x = Math.sin(seed * 9301 + 49297) * 233280
    const frac = x - Math.floor(x)
    return Math.round((8 + frac * 7) * 100) / 100
  }, [seed])

  const [matchCountRef, matchCountDisplay] = useCountUp(matches.length, 1200, { threshold: 0.3 })

  return (
    <>
      <section ref={ref} id="fifa-linebet" className="section-pad overflow-x-hidden" style={{ paddingTop: '16px', paddingBottom: '16px' }}>
        <div className="max-w-[440px] sm:max-w-2xl mx-auto">
          {/* Compact card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4 }}
            className="rounded-[14px] overflow-hidden"
            style={{ backgroundColor: C.card, border: '1px solid ' + C.border, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            {/* Top accent — gold */}
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, ' + C.gold + ', transparent)' }} />

            <div className="p-3.5">
              {/* Header — compact */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2"><line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="17" y1="10" x2="17" y2="14"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900">Value Bets FIFA</h3>
                  <p className="text-[9px]" style={{ color: C.textMute }}>IA détection de cotes sous-évaluées</p>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(255,215,0,0.1)' }}>
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: C.gold }} />
                  <span className="font-mono text-[8px] font-bold" style={{ color: C.gold }}>LIVE</span>
                </div>
              </div>

              {/* Warning — compact */}
              <div className="p-2 rounded-lg mb-3" style={{ backgroundColor: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
                <p className="text-[9px] leading-relaxed" style={{ color: C.textSec }}>
                  ⚠️ <span style={{ color: C.gold }}>Value Bets :</span> Estimations statistiques. Cotes élevées, risque élevé. Pas de garantie de gain.
                </p>
              </div>

              {/* KPI — compact 3 inline */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex-1 p-2 rounded-lg text-center" style={{ backgroundColor: '#F3F4F6' }}>
                  <div className="text-sm font-bold tabular-nums text-gray-900">{matches.length}</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Matchs</div>
                </div>
                <div className="flex-1 p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(255,215,0,0.06)' }}>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.gold }}>VIP</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Cote totale</div>
                </div>
                <div className="flex-1 p-2 rounded-lg text-center" style={{ backgroundColor: 'rgba(0,229,255,0.06)' }}>
                  <div className="text-sm font-bold tabular-nums" style={{ color: C.cyan }}>~74%</div>
                  <div className="text-[8px] uppercase tracking-wider" style={{ color: C.textMute }}>Précision</div>
                </div>
              </div>

              {/* Locked matches — blur */}
              <div className="relative">
                <div className="space-y-1" style={{ filter: 'blur(5px)', opacity: 0.4, pointerEvents: 'none' }}>
                  {matches.map((m, i) => (
                    <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-medium text-gray-900 truncate">{m.home}</span>
                        <span className="text-[8px] text-gray-600">vs</span>
                        <span className="text-[10px] font-medium text-gray-900 truncate">{m.away}</span>
                      </div>
                      <span className="text-[9px] font-bold" style={{ color: C.gold }}>VIP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unlock button */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, #16A34A, #22C55E)', color: '#020617' }}
              >
                🔒 Débloquer les Value Bets FIFA
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal isOpen={showModal} onClose={() => setShowModal(false)} title="Débloque les Value Bets FIFA" />
    </>
  )
}
