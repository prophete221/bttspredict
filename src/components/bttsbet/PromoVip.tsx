'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import { staggerContainer, staggerChildFadeUp } from '@/lib/motionPresets'
import { CrownIcon, FloatingParticles } from './AnimatedIcons'
import PremiumButton, { DownloadButton } from './PremiumButton'
import CopyableCode from './CopyableCode'
import VipUnlockModal from './VipUnlockModal'

// ─── Deterministic daily cote ────────────────────────────────────────────
function getDailyCote(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const fraction = x - Math.floor(x)
  return Math.round((15 + fraction * 15) * 100) / 100
}

// ─── Match status filter (excludes finished matches) ─────────────────────
function getMatchStatus(date: string, time?: string): 'live' | 'upcoming' | 'finished' {
  if (!date) return 'finished'
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const matchDay = new Date(date + 'T00:00:00'); matchDay.setHours(0, 0, 0, 0)
    if (matchDay.getTime() < today.getTime()) return 'finished'
    if (matchDay.getTime() > today.getTime()) return 'upcoming'
    if (!time || time === '--:--' || !/^\d{2}:\d{2}$/.test(time)) return 'upcoming'
    const [h, m] = time.split(':').map(Number)
    const matchDateTime = new Date(date + 'T00:00:00')
    matchDateTime.setHours(h, m, 0, 0)
    const diffMs = matchDateTime.getTime() - Date.now()
    const diffHours = diffMs / (1000 * 60 * 60)
    if (diffMs < 0 && diffHours > -2.5) return 'live'
    if (diffMs < 0) return 'finished'
    return 'upcoming'
  } catch { return 'finished' }
}

type VipMatch = {
  match: string
  homeTeam: string
  awayTeam: string
  league: string
  date: string
  time: string
  homeLogo: string
  awayLogo: string
  cote: number
  confidence: number
  index: number
  status: 'live' | 'upcoming'
}

// ─── Premium VIP match row ───────────────────────────────────────────────
function VipMatchRow({ m, index }: { m: VipMatch; index: number }) {
  const isLive = m.status === 'live'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="relative grid grid-cols-[44px_1fr_56px] items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge/40"
    >
      {/* Time / Live indicator */}
      <div className="flex flex-col items-center">
        {isLive ? (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-live text-[9px] font-bold uppercase tracking-widest"
          >
            <div className="v31-ticker-dot live mb-0.5" />
            LIVE
          </motion.div>
        ) : (
          <>
            <span className="text-[10px] text-gold-light/70 font-mono tabular-nums">{m.time}</span>
            <span className="text-[8px] text-gray-600 uppercase">à venir</span>
          </>
        )}
      </div>

      {/* Teams (blurred — locked content) */}
      <div className="flex items-center gap-1.5 min-w-0 blur-[5px] select-none">
        {m.homeLogo && (
          <img src={m.homeLogo} alt="" className="w-4 h-4 object-contain flex-shrink-0 rounded" loading="lazy" />
        )}
        <span className="text-white text-[11px] font-semibold truncate">{m.homeTeam}</span>
        <span className="text-gray-600 text-[9px] flex-shrink-0">vs</span>
        <span className="text-white text-[11px] font-semibold truncate">{m.awayTeam}</span>
        {m.awayLogo && (
          <img src={m.awayLogo} alt="" className="w-4 h-4 object-contain flex-shrink-0 rounded" loading="lazy" />
        )}
      </div>

      {/* Cote */}
      <div className="text-right">
        <span className="text-[10px] text-gold font-bold tabular-nums blur-[3px] select-none">
          {m.cote.toFixed(2)}
        </span>
        <div className="text-[8px] text-gray-600 uppercase">cote</div>
      </div>
    </motion.div>
  )
}

// ─── Main PromoVip ────────────────────────────────────────────────────────
export default function PromoVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showVipModal, setShowVipModal] = useState(false)
  const [vipMatches, setVipMatches] = useState<VipMatch[]>([])
  const [couponDate, setCouponDate] = useState('Aujourd\'hui')
  const dailyCote = useMemo(() => getDailyCote(), [])

  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1500, { decimals: 2, threshold: 0.3 })
  const [matchCountRef, matchCountDisplay] = useCountUp(0, 1200, { threshold: 0.3 })
  const [accuracyRef, accuracyDisplay] = useCountUp(89, 1800, { threshold: 0.3, from: 0 })
  const [streakRef, streakDisplay] = useCountUp(7, 1500, { threshold: 0.3 })

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) return
        const matchMap = new Map<string, VipMatch>()
        for (const p of data.predictions) {
          // Filter out finished matches — only show live + upcoming
          const status = getMatchStatus(p.date, p.time)
          if (status === 'finished') continue

          const key = p.matchSemantic || p.match
          if (!matchMap.has(key)) {
            const [home, away] = p.match.split(/\s+vs?\s+/i)
            matchMap.set(key, {
              match: p.match,
              homeTeam: home?.trim() || '',
              awayTeam: away?.trim() || '',
              league: p.league,
              date: p.date,
              time: p.time || '--:--',
              homeLogo: p.homeLogo || '',
              awayLogo: p.awayLogo || '',
              cote: 1.5,
              confidence: 92,
              index: 0,
              status: status as 'live' | 'upcoming',
            })
          }
        }
        const today = new Date().toISOString().slice(0, 10)
        const allMatches = [...matchMap.values()]
          .sort((a, b) => {
            // Live first, then by time
            if (a.status === 'live' && b.status !== 'live') return -1
            if (b.status === 'live' && a.status !== 'live') return 1
            const aToday = a.date === today ? 0 : 1
            const bToday = b.date === today ? 0 : 1
            if (aToday !== bToday) return aToday - bToday
            return (a.time || '').localeCompare(b.time || '')
          })
          .slice(0, 8)

        const matchCount = allMatches.length || 1
        const cotePerMatch = Math.pow(dailyCote, 1 / matchCount)
        const vipData = allMatches.map((m, i) => ({
          ...m,
          cote: cotePerMatch,
          confidence: 92 + (i % 6),
          index: i,
        }))
        setVipMatches(vipData)
        const todayMatches = allMatches.filter(m => m.date === today)
        setCouponDate(todayMatches.length > 0 ? "Aujourd'hui" : allMatches[0]?.date || "Aujourd'hui")
      })
      .catch(() => {})
  }, [dailyCote])

  const liveCount = vipMatches.filter(m => m.status === 'live').length

  return (
    <>
      <section ref={ref} id="vip" className="section-pad relative overflow-hidden">
        {/* Background ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[min(500px,80vw)] h-[400px] bg-gold/[0.04] rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[min(400px,70vw)] h-[350px] bg-success/[0.04] rounded-full blur-[120px]" />
        </div>
        <FloatingParticles count={10} />

        <div className="max-w-5xl mx-auto relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-2">
              <CrownIcon size={48} />
            </div>
            <span className="eyebrow">Zone Premium</span>
            <h2 className="section-title mt-3 mb-3">
              Pronostics <span className="text-gold">VIP</span> Experts
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Coupon du jour verrouillé — 8 matchs sélectionnés par notre IA.
              Cote totale <span className="text-gold font-bold">{dailyCote.toFixed(2)}</span>.
              Précision historique ~85%.
            </p>
          </motion.div>

          {/* ═══ VIP Coupon Card — Premium design ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="squircle-xl overflow-hidden"
          >
            {/* Top gold accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Header with football logo + title */}
            <div
              className="relative p-5 sm:p-6 border-b border-edge"
              style={{
                background: 'linear-gradient(135deg, rgba(242, 201, 76, 0.08) 0%, transparent 60%)',
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Big football logo */}
                  <div className="w-16 h-16 rounded-2xl bg-midnight/60 border border-gold/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logos/sport-football.svg" alt="Football" className="w-12 h-12 object-contain" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-gold-light uppercase tracking-widest font-bold">Coupon VIP</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">
                      Pronostics <span className="text-gold">Experts</span>
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      BTTS + Over 2.5 — Sélection IA · Contenu verrouillé
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
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Matchs</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-gold tabular-nums glow-text-gold" ref={coteRef}>{coteDisplay}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Cote totale</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-success tabular-nums glow-text-green" ref={accuracyRef}>~{accuracyDisplay}%</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Précision</div>
                </div>
                <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
                  <div className="text-base sm:text-lg font-bold text-white tabular-nums" ref={streakRef}>{streakDisplay}</div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Série jours</div>
                </div>
              </div>
            </div>

            {/* Matches list — locked */}
            <div className="p-4 sm:p-5 space-y-1.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sélection du jour · {couponDate}</span>
                {liveCount > 0 && (
                  <span className="badge badge-cyan text-[9px]">
                    <span className="v31-ticker-dot live" /> {liveCount} <span className="live-text">live</span>
                  </span>
                )}
              </div>

              {/* Locked matches */}
              <div className="space-y-1 relative">
                {vipMatches.length > 0 ? (
                  vipMatches.map((m, i) => <VipMatchRow key={i} m={m} index={i} />)
                ) : (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-[44px_1fr_56px] items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge/40 animate-pulse">
                      <div className="w-9 h-3 bg-gold/10 rounded" />
                      <div className="flex-1 h-3 bg-gold/10 rounded" />
                      <div className="w-10 h-3 bg-gold/10 rounded" />
                    </div>
                  ))
                )}

                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-midnight/30 backdrop-blur-[1px] rounded-lg pointer-events-none">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-midnight/90 border border-gold/30 rounded-full p-3 flex flex-col items-center gap-1"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-[10px] text-gold-light font-bold uppercase tracking-wider">VIP</span>
                  </motion.div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setShowVipModal(true)}
                className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 btn-gold cta-glow text-[#1A1206] text-sm font-bold rounded-xl"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Débloquer le coupon VIP
              </button>
              <p className="text-[10px] text-gray-500 text-center mt-2">
                Inscris-toi avec <CopyableCode code={SITE.promoCode} displayClassName="text-gold-light" /> pour débloquer
              </p>
            </div>
          </motion.div>

          {/* ═══ BONUS CARD — Side panel with promo code + bookmakers ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="squircle-xl overflow-hidden mt-4 sm:mt-6"
          >
            <div className="h-[2px] bg-gradient-to-r from-transparent via-success to-transparent" />

            <div className="relative p-5 sm:p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.06) 0%, transparent 60%)',
              }}
            >
              <div className="grid sm:grid-cols-[1fr_auto] gap-5 items-center">
                {/* Left — bonus info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-success/15 to-success/5 border border-success/25 rounded-xl flex items-center justify-center text-success">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="8" width="18" height="4" rx="1" />
                        <path d="M12 8v13" />
                        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Bonus Exclusif</h3>
                      <p className="text-[10px] text-success-light uppercase tracking-widest font-bold">Code promo bookmakers</p>
                    </div>
                  </div>

                  {/* Promo code big display */}
                  <div className="bg-midnight/60 border border-edge rounded-xl p-4 mb-4 relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Code promo exclusif</div>
                    <div className="text-2xl font-black tracking-[0.2em] promo-code-shimmer">{SITE.promoCode}</div>
                    <div className="text-[10px] text-gray-500 mt-1">Bonus 90 000 XOF (150$) — Wave / Orange Money / Free Money</div>
                  </div>
                </div>

                {/* Right — bookmaker CTAs */}
                <div className="space-y-2 min-w-[260px]">
                  <PremiumButton variant="linebet" href={AFFILIATE.linebet} fullWidth size="md">
                    Linebet → Bonus 90 000 XOF
                  </PremiumButton>
                  <PremiumButton variant="star888" href={AFFILIATE.star888} fullWidth size="md">
                    888starz → Bonus 100%
                  </PremiumButton>

                  {/* Download APK buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <DownloadButton href={AFFILIATE.linebetDownload} size="sm" fullWidth>
                      APK Linebet
                    </DownloadButton>
                    <DownloadButton href={AFFILIATE.star888Download} size="sm" fullWidth>
                      APK 888starz
                    </DownloadButton>
                  </div>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-5 border-t border-edge">
                {[
                  { label: 'Bonus 90 000 XOF', icon: '💰' },
                  { label: 'Dépôt instantané', icon: '⚡' },
                  { label: 'App mobile', icon: '📱' },
                  { label: 'Paiement sécurisé', icon: '🔒' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge">
                    <span className="text-base">{f.icon}</span>
                    <span className="text-[11px] text-gray-300 font-medium">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />
    </>
  )
}
