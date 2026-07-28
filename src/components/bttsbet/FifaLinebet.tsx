'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE, SITE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import { staggerContainer } from '@/lib/motionPresets'
import VipUnlockModal from './VipUnlockModal'

// ─── FIFA data ───────────────────────────────────────────────────────────
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

interface FifaMatch {
  home: string
  away: string
  league: string
  cote: number
  iaProba: number
}

function generateFifaMatches(seed: number, count: number): FifaMatch[] {
  const matches: FifaMatch[] = []
  for (let i = 0; i < count; i++) {
    const r1 = seededRandom(seed + i * 7)
    const r2 = seededRandom(seed + i * 13 + 3)
    const r3 = seededRandom(seed + i * 19 + 7)

    const homeIdx = Math.floor(r1 * FIFA_TEAMS.length)
    let awayIdx = Math.floor(r2 * FIFA_TEAMS.length)
    if (awayIdx === homeIdx) awayIdx = (awayIdx + 1) % FIFA_TEAMS.length

    const home = FIFA_TEAMS[homeIdx]
    const away = FIFA_TEAMS[awayIdx]
    const league = FIFA_LEAGUES[Math.floor(r3 * FIFA_LEAGUES.length)]

    // Generate cote (3.5 - 15) and IA probability (50-89%)
    const cote = Math.round((3.5 + seededRandom(seed + i * 23) * 11.5) * 100) / 100
    const iaProba = Math.round(60 + seededRandom(seed + i * 29) * 25)

    matches.push({ home, away, league, cote, iaProba })
  }
  return matches
}

// ─── Value Bet visualization ─────────────────────────────────────────────
function ValueBetChart({ cote, iaProba }: { cote: number; iaProba: number }) {
  // Implied probability from cote = 1 / cote
  const impliedProba = Math.round((1 / cote) * 100)
  // Value = IA proba - implied proba
  const value = iaProba - impliedProba
  const hasValue = value > 0

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-500">Proba IA vs Proba bookmaker</span>
        <span className={`font-bold tabular-nums ${hasValue ? 'text-success-light' : 'text-lose-light'}`}>
          {hasValue ? '+' : ''}{value}%
        </span>
      </div>
      <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
        {/* Bookmaker implied probability bar (background) */}
        <div
          className="absolute inset-y-0 left-0 bg-rose/30 rounded-full"
          style={{ width: `${impliedProba}%` }}
        />
        {/* IA probability bar (foreground) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${iaProba}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-success-dark to-success rounded-full"
          style={{ boxShadow: '0 0 8px rgba(29, 185, 84, 0.4)' }}
        />
      </div>
      <div className="flex items-center justify-between text-[9px] text-gray-600">
        <span>Book: {impliedProba}% (cote {cote.toFixed(2)})</span>
        <span className="text-success-light">IA: {iaProba}%</span>
      </div>
    </div>
  )
}

// ─── Main FifaLinebet component ─────────────────────────────────────────
export default function FifaLinebet() {
  const [ref, isVisible] = useScrollAnimation()
  const [showModal, setShowModal] = useState(false)

  // Deterministic daily data
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const matches = useMemo(() => generateFifaMatches(seed, 5), [seed])

  const dailyCote = useMemo(() => {
    const x = Math.sin(seed * 9301 + 49297) * 233280
    const frac = x - Math.floor(x)
    return Math.round((8 + frac * 7) * 100) / 100 // 8-15
  }, [seed])

  const [matchCountRef, matchCountDisplay] = useCountUp(matches.length, 1200, { threshold: 0.3 })
  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1500, { decimals: 2, threshold: 0.3 })
  const [accuracyRef, accuracyDisplay] = useCountUp(82, 1500, { threshold: 0.3, from: 0 })
  const [valueBetsRef, valueBetsDisplay] = useCountUp(matches.length, 1200, { threshold: 0.3 })

  return (
    <>
      <section ref={ref} id="fifa-linebet" className="section-pad pt-0">
        <div className="max-w-5xl mx-auto">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="squircle-xl overflow-hidden"
          >
            {/* Top green accent line (FIFA value bet theme) */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-success to-transparent" />

            {/* Header with FIFA icon (game controller) */}
            <div
              className="relative p-5 sm:p-6 border-b border-edge"
              style={{
                background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.08) 0%, transparent 60%)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* FIFA game icon */}
                  <div className="w-16 h-16 rounded-2xl bg-midnight/60 border border-success/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="6" y1="11" x2="10" y2="11" />
                      <line x1="8" y1="9" x2="8" y2="13" />
                      <line x1="15" y1="12" x2="17" y2="12" />
                      <line x1="17" y1="10" x2="17" y2="14" />
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-success-light uppercase tracking-widest font-bold">VIP Coupon</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">
                      Value Bets <span className="text-success">FIFA</span>
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      IA détection de cotes sous-évaluées · Risque élevé · Analysis IA
                    </p>
                  </div>
                </div>

                {/* LIVE badge */}
                <motion.div
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-2.5 py-1"
                >
                  <span className="v31-ticker-dot live" />
                  <span className="text-[10px] live-text">Live</span>
                </motion.div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5">
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-white tabular-nums" ref={matchCountRef}>{matchCountDisplay}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Matchs FIFA</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-gold tabular-nums glow-text-gold" ref={coteRef}>{coteDisplay}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Cote totale</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-success tabular-nums glow-text-green" ref={accuracyRef}>~{accuracyDisplay}%</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Précision IA</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-success-light tabular-nums" ref={valueBetsRef}>{valueBetsDisplay}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Value bets</div>
                </div>
              </div>
            </div>

            {/* Content — locked FIFA matches */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Value bets du jour</span>
                <span className="badge badge-mint text-[9px]">Verrouillé</span>
              </div>

              {/* Locked matches list */}
              <div className="space-y-2 relative">
                {matches.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className="bg-midnight/40 rounded-lg px-3 py-3 border border-edge/40"
                  >
                    {/* Teams row */}
                    <div className="grid grid-cols-[1fr_auto_1fr_50px] items-center gap-2 mb-2">
                      <span className="text-white text-xs font-semibold truncate blur-[5px] select-none">{m.home}</span>
                      <span className="text-gray-600 text-[10px] font-mono">VS</span>
                      <span className="text-white text-xs font-semibold truncate text-right blur-[5px] select-none">{m.away}</span>
                      <span className="text-[10px] text-gold font-bold tabular-nums text-right blur-[3px] select-none">{m.cote.toFixed(2)}</span>
                    </div>

                    {/* Value bet visualization */}
                    <div className="blur-[5px] select-none">
                      <ValueBetChart cote={m.cote} iaProba={m.iaProba} />
                    </div>

                    {/* League + risk badge */}
                    <div className="flex items-center justify-between mt-2 blur-[3px] select-none">
                      <span className="text-[9px] text-gray-600 truncate">{m.league}</span>
                      <span className="badge badge-rose text-[9px]">Risque élevé</span>
                    </div>
                  </motion.div>
                ))}

                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-midnight/40 backdrop-blur-[2px] rounded-lg pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-midnight/90 border border-success/30 rounded-full p-3 flex flex-col items-center gap-1"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-[10px] text-success-light font-bold uppercase tracking-wider">VIP</span>
                  </motion.div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gold/[0.04] border border-gold/20 rounded-lg p-3 mt-4">
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  <strong className="text-gold-light">⚠️ Value bets :</strong> Les Value Bets FIFA sont des estimations statistiques
                  où l'IA détecte des cotes sous-évaluées par les bookmakers.
                  Cotes élevées (10-15), risque élevé — pas de garantie de gain.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 btn-gold cta-glow text-[#1A1206] text-sm font-bold rounded-xl"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Débloquer les Value Bets FIFA
              </button>
              <p className="text-[10px] text-gray-500 text-center mt-2">
                Inscris-toi avec <span className="text-gold-light font-semibold">{SITE.promoCode}</span> pour débloquer
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Débloque les Value Bets FIFA"
      />
    </>
  )
}
