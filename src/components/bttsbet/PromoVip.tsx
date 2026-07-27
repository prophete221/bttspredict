'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE } from '@/lib/constants'
import { staggerContainer, staggerChildFadeUp, cardHoverLift, badgePulse } from '@/lib/motionPresets'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import { CrownIcon, FloatingParticles } from './AnimatedIcons'
import PremiumButton, { DownloadButton } from './PremiumButton'
import VipUnlockModal from './VipUnlockModal'

// ─── Déterministe daily cote ─────────────────────────────────────────────
function getDailyCote(): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const fraction = x - Math.floor(x)
  return Math.round((15 + fraction * 15) * 100) / 100
}

// ─── Anti-copy: holographic SVG pattern (unique per VIP card) ────────────
function HolographicPattern() {
  // Unique geometric pattern — looks like a holographic security sticker
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="holo-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.5" fill="rgba(255, 184, 0, 0.15)" />
          <path d="M0 20 L40 20 M20 0 L20 40" stroke="rgba(255, 184, 0, 0.04)" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="holo-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255, 184, 0, 0)" />
          <stop offset="40%" stopColor="rgba(255, 184, 0, 0.15)" />
          <stop offset="50%" stopColor="rgba(0, 229, 160, 0.1)" />
          <stop offset="60%" stopColor="rgba(0, 224, 255, 0.08)" />
          <stop offset="100%" stopColor="rgba(255, 184, 0, 0)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#holo-grid)" />
      <rect width="100%" height="100%" fill="url(#holo-shine)">
        <animate
          attributeName="x"
          from="-100%"
          to="100%"
          dur="6s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  )
}

// ─── Anti-copy: rotating geometric watermark ─────────────────────────────
function SecurityWatermark() {
  return (
    <div className="absolute top-3 right-3 pointer-events-none opacity-30 select-none">
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="sec-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#00E5A0" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#sec-grad)" strokeWidth="0.8">
          <circle cx="24" cy="24" r="22" />
          <circle cx="24" cy="24" r="18" strokeDasharray="2 2" />
          <circle cx="24" cy="24" r="14" />
          <path d="M24 6 L24 42 M6 24 L42 24" strokeDasharray="1 3" />
        </g>
        <text
          x="24"
          y="27"
          textAnchor="middle"
          fontSize="6"
          fill="url(#sec-grad)"
          fontWeight="700"
          fontFamily="monospace"
        >
          VIP
        </text>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 24 24"
          to="360 24 24"
          dur="20s"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  )
}

// ─── Anti-copy: unique ID badge ──────────────────────────────────────────
function UniqueId() {
  const id = useMemo(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const x = Math.sin(seed * 9301 + 49297) * 233280
    const fraction = x - Math.floor(x)
    const num = Math.floor(fraction * 999999).toString().padStart(6, '0')
    return `BTB-VIP-${num}`
  }, [])
  return (
    <div className="absolute bottom-3 right-3 pointer-events-none select-none">
      <span className="text-[8px] font-mono text-gold/40 tracking-widest">{id}</span>
    </div>
  )
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
}

function VipMatchRow({ m, index }: { m: VipMatch; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.35 }}
      className="relative flex items-center gap-2.5 bg-midnight/40 rounded-lg px-3 py-2 border border-edge/40 hover:border-gold/30 transition-colors"
    >
      <span className="text-[10px] sm:text-xs text-gold/70 font-mono tabular-nums w-10 text-center flex-shrink-0">
        {m.time || '--:--'}
      </span>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {/* Blurred — locked content */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 blur-[5px] select-none">
          {m.homeLogo && (
            <img src={m.homeLogo} alt="" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy" />
          )}
          <span className="text-white text-[11px] sm:text-xs font-semibold truncate">{m.homeTeam}</span>
          <span className="text-gray-500 text-[10px] flex-shrink-0">vs</span>
          <span className="text-white text-[11px] sm:text-xs font-semibold truncate">{m.awayTeam}</span>
          {m.awayLogo && (
            <img src={m.awayLogo} alt="" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy" />
          )}
        </div>
        {/* Lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-midnight/80 backdrop-blur-sm rounded-full p-1.5 border border-gold/20">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      </div>
      <span className="text-[10px] sm:text-xs text-gold font-bold bg-gold/10 border border-gold/20 rounded px-1.5 py-0.5 flex-shrink-0 tabular-nums">
        {m.cote.toFixed(2)}
      </span>
    </motion.div>
  )
}

export default function PromoVip() {
  const [ref, isVisible] = useScrollAnimation()
  const [showVipModal, setShowVipModal] = useState(false)
  const [vipMatches, setVipMatches] = useState<VipMatch[]>([])
  const [couponDate, setCouponDate] = useState('Aujourd\'hui')
  const dailyCote = useMemo(() => getDailyCote(), [])

  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1600, { decimals: 2, threshold: 0.3 })
  const [matchCountRef, matchCountDisplay] = useCountUp(0, 1200, { threshold: 0.3 })
  const [accuracyRef, accuracyDisplay] = useCountUp(89, 1800, { threshold: 0.3, from: 0 })

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(data => {
        if (!data?.predictions) return
        const matchMap = new Map<string, VipMatch>()
        for (const p of data.predictions) {
          const key = p.matchSemantic || p.match
          if (!matchMap.has(key)) {
            const [home, away] = p.match.split(' vs ')
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
            })
          }
        }
        const today = new Date().toISOString().slice(0, 10)
        const allMatches = [...matchMap.values()]
          .sort((a, b) => {
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

  return (
    <>
      <section ref={ref} id="vip" className="section-pad relative overflow-hidden">
        {/* Background ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[min(500px,80vw)] h-[400px] bg-gold/[0.04] rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[min(400px,70vw)] h-[350px] bg-success/[0.04] rounded-full blur-[120px]" />
        </div>
        <FloatingParticles count={10} />

        <div className="max-w-6xl mx-auto relative">
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
            <h2 className="section-title mt-2">
              Pronostics <span className="text-gold">VIP</span> Experts
            </h2>
            <p className="section-subtitle max-w-xl mx-auto mt-2">
              Coupon du jour verrouillé — 8 matchs sélectionnés par notre IA. Cote totale{' '}
              <span className="text-gold font-bold">{dailyCote.toFixed(2)}</span>. Précision historique ~89%.
            </p>
          </motion.div>

          {/* Bento grid: VIP card + Bonus card */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 sm:gap-6">

            {/* ═══ VIP COUPON CARD — Holographic anti-copy design ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="relative squircle-xl overflow-hidden border-2 border-gold/30"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.08) 0%, rgba(11, 14, 20, 0.95) 40%, rgba(0, 229, 160, 0.04) 100%)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 80px rgba(255, 184, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Holographic background pattern */}
              <HolographicPattern />

              {/* Top gold strip */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

              {/* Security watermark */}
              <SecurityWatermark />
              <UniqueId />

              <div className="relative p-5 sm:p-7">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2 a10 10 0 0 1 10 10 l-10 0 z" fill="#FFB800" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        Coupon <span className="text-gold">VIP</span>
                      </h3>
                      <p className="text-[10px] text-gold/70 font-medium tracking-[0.15em] uppercase">Contenu verrouillé</p>
                    </div>
                  </div>
                  <motion.div
                    variants={badgePulse}
                    animate="animate"
                    className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-2.5 py-1"
                  >
                    <span className="v31-ticker-dot" />
                    <span className="text-[10px] text-success font-bold uppercase tracking-wider">Live</span>
                  </motion.div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gold/10">
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Matchs</div>
                    <div className="text-lg font-bold text-white tabular-nums" ref={matchCountRef}>{matchCountDisplay}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Cote totale</div>
                    <div className="text-lg font-bold text-gold tabular-nums" ref={coteRef}>{coteDisplay}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Précision</div>
                    <div className="text-lg font-bold text-success tabular-nums" ref={accuracyRef}>~{accuracyDisplay}%</div>
                  </div>
                </div>

                {/* Date badge */}
                <div className="flex items-center gap-2 mb-3 bg-gold/[0.05] border border-gold/15 rounded-lg px-3 py-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="1.5" className="flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-xs text-gold/80 font-semibold tracking-wide">{couponDate}</span>
                </div>

                {/* Locked matches list */}
                <div className="space-y-1.5 mb-4 max-h-[280px] overflow-y-auto scroll-list">
                  {vipMatches.length > 0 ? (
                    vipMatches.map((m, i) => <VipMatchRow key={i} m={m} index={i} />)
                  ) : (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge/40 animate-pulse">
                        <div className="w-10 h-3 bg-gold/10 rounded" />
                        <div className="flex-1 h-3 bg-gold/10 rounded" />
                        <div className="w-10 h-3 bg-gold/10 rounded" />
                      </div>
                    ))
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => setShowVipModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 btn-gold cta-glow text-[#1A0F00] text-sm font-bold rounded-xl"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Débloquer le coupon VIP
                </button>
                <p className="text-[10px] text-gold/40 font-medium text-center mt-2">
                  Inscris-toi avec VISION221 pour débloquer l'accès complet
                </p>
              </div>
            </motion.div>

            {/* ═══ BONUS CARD — Premium conversion ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="relative squircle-xl overflow-hidden border border-gold/20"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 184, 0, 0.04) 0%, rgba(11, 14, 20, 0.95) 60%)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
              <div className="absolute bottom-0 left-0 w-[min(200px,50%)] h-[200px] bg-gold/[0.04] rounded-full blur-[80px]" />

              <div className="relative p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/25 rounded-2xl flex items-center justify-center text-gold">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="8" width="18" height="4" rx="1" />
                      <path d="M12 8v13" />
                      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Bonus Exclusif</h3>
                    <p className="text-[10px] text-gold/70 uppercase tracking-widest font-bold">Code promo</p>
                  </div>
                </div>

                {/* Promo code big display */}
                <div className="bg-midnight/60 border border-edge rounded-xl p-4 mb-4 text-center relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Code promo exclusif</div>
                  <div className="text-2xl sm:text-3xl font-black tracking-[0.2em] promo-code-shimmer">{SITE.promoCode}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Bonus 90 000 XOF (150$)</div>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-2 gap-2 mb-5">
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

                {/* Premium buttons */}
                <div className="space-y-2">
                  <PremiumButton variant="linebet" href={AFFILIATE.linebet} fullWidth size="md">
                    S'inscrire → Bonus 90 000 XOF
                  </PremiumButton>
                  <PremiumButton variant="star888" href={AFFILIATE.star888} fullWidth size="md">
                    888starz → Bonus 100%
                  </PremiumButton>

                  {/* Download APK buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <DownloadButton href={AFFILIATE.linebetDownload} size="sm" fullWidth>
                      APK Linebet
                    </DownloadButton>
                    <DownloadButton href={AFFILIATE.star888Download} size="sm" fullWidth>
                      APK 888starz
                    </DownloadButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <VipUnlockModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />
    </>
  )
}
