'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE, SITE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import { staggerContainer, staggerChildFadeUp } from '@/lib/motionPresets'
import VipUnlockModal from './VipUnlockModal'
import CopyableCode from './CopyableCode'

// ─── Sport data ─────────────────────────────────────────────────────────
type SportColor = 'gold' | 'orange' | 'bronze' | 'red' | 'cyan'

type SportVip = {
  id: string
  name: string
  shortName: string
  title: string
  subtitle: string
  keywords: string[]
  badge: string
  badgeColor: 'green' | 'gold' | 'cyan' | 'rose'
  color: SportColor  // per-sport accent color
  logo: string
  dailyCoteMin: number
  dailyCoteMax: number
  accuracy: number
  matches: { time: string; home: string; away: string; league: string }[]
}

// Per-sport accent colors (CSS variables)
const SPORT_COLORS: Record<SportColor, { hex: string; light: string; cssVar: string }> = {
  gold:   { hex: '#FFB800', light: '#FFD54F', cssVar: 'gold' },
  orange: { hex: '#FF9500', light: '#FFB155', cssVar: 'orange' },
  bronze: { hex: '#CD7F32', light: '#E0A84F', cssVar: 'bronze' },
  red:    { hex: '#FF7A93', light: '#FF7A93', cssVar: 'lose' },
  cyan:   { hex: '#00E0FF', light: '#5DEDBE', cssVar: 'live' },
}

const SPORTS: SportVip[] = [
  {
    id: 'tennis',
    name: 'Tennis',
    shortName: 'Tennis',
    title: 'Tennis',
    subtitle: 'ATP · WTA · Grand Chelem — Gagnant, Over/Under Games, Set 1 & Handicap',
    keywords: ['pronostic tennis', 'pari tennis ATP', 'pari tennis WTA', 'pronostic gagnant tennis', 'over games tennis', 'Grand Chelem pronostic', 'Roland Garros pronostic', 'Wimbledon picks'],
    badge: 'Gagnant',
    badgeColor: 'gold',
    color: 'gold',
    dailyCoteMin: 18,
    dailyCoteMax: 35,
    accuracy: 54,
    logo: '/logos/sport-tennis.svg',
    matches: [
      { time: '11:00', home: 'Carlos Alcaraz', away: 'Jannik Sinner', league: 'ATP 1000' },
      { time: '13:30', home: 'Novak Djokovic', away: 'Daniil Medvedev', league: 'ATP 500' },
      { time: '15:00', home: 'Iga Swiatek', away: 'Aryna Sabalenka', league: 'WTA 1000' },
      { time: '16:30', home: 'Coco Gauff', away: 'Elena Rybakina', league: 'WTA 500' },
      { time: '18:00', home: 'Alexander Zverev', away: 'Andrey Rublev', league: 'ATP 500' },
      { time: '19:30', home: 'Taylor Fritz', away: 'Hubert Hurkacz', league: 'ATP 250' },
      { time: '20:30', home: 'Ons Jabeur', away: 'Jessica Pegula', league: 'WTA 500' },
      { time: '21:30', home: 'Stefanos Tsitsipas', away: 'Casper Ruud', league: 'ATP 500' },
    ],
  },
  {
    id: 'nba',
    name: 'NBA',
    shortName: 'NBA',
    title: 'NBA / Basket',
    subtitle: 'NBA · EuroLeague — Vainqueur, Over/Under Points, Margin & Player Props',
    keywords: ['pronostic NBA', 'pari NBA', 'pronostic basket', 'over points NBA', 'pari basket EuroLeague', 'NBA picks du jour', 'player props NBA', 'handicap basket'],
    badge: 'Over Pts',
    badgeColor: 'gold',
    color: 'orange',
    dailyCoteMin: 12,
    dailyCoteMax: 28,
    accuracy: 52,
    logo: '/logos/sport-nba.svg',
    matches: [
      { time: '01:00', home: 'LA Lakers', away: 'Boston Celtics', league: 'NBA' },
      { time: '01:30', home: 'Golden State', away: 'Milwaukee Bucks', league: 'NBA' },
      { time: '02:00', home: 'Denver Nuggets', away: 'Phoenix Suns', league: 'NBA' },
      { time: '02:30', home: 'Miami Heat', away: 'Philadelphia 76ers', league: 'NBA' },
      { time: '03:00', home: 'Dallas Mavericks', away: 'Minnesota Timberwolves', league: 'NBA' },
      { time: '19:00', home: 'Real Madrid', away: 'FC Barcelona', league: 'EuroLeague' },
      { time: '19:30', home: 'Olympiacos', away: 'Panathinaikos', league: 'EuroLeague' },
      { time: '20:30', home: 'Bayern Munich', away: 'Maccabi Tel Aviv', league: 'EuroLeague' },
    ],
  },
  {
    id: 'nfl',
    name: 'NFL',
    shortName: 'NFL',
    title: 'NFL',
    subtitle: 'NFL · College Football — Vainqueur, Over/Under Points, Spread & Touchdown Props',
    keywords: ['pronostic NFL', 'pari NFL', 'pronostic football americain', 'pari NFL américain', 'over under NFL', 'spread NFL', 'touchdown NFL', 'NFL picks dimanche'],
    badge: 'Spread',
    badgeColor: 'cyan',
    color: 'bronze',
    dailyCoteMin: 15,
    dailyCoteMax: 32,
    accuracy: 50,
    logo: '/logos/sport-nfl.svg',
    matches: [
      { time: '18:00', home: 'Kansas City Chiefs', away: 'Buffalo Bills', league: 'NFL' },
      { time: '18:30', home: 'San Francisco 49ers', away: 'Philadelphia Eagles', league: 'NFL' },
      { time: '19:00', home: 'Dallas Cowboys', away: 'NY Giants', league: 'NFL' },
      { time: '19:30', home: 'Green Bay Packers', away: 'Detroit Lions', league: 'NFL' },
      { time: '20:00', home: 'Baltimore Ravens', away: 'Cincinnati Bengals', league: 'NFL' },
      { time: '20:30', home: 'Miami Dolphins', away: 'NY Jets', league: 'NFL' },
      { time: '21:00', home: 'LA Rams', away: 'Seattle Seahawks', league: 'NFL' },
      { time: '22:30', home: 'Las Vegas Raiders', away: 'Denver Broncos', league: 'NFL' },
    ],
  },
  {
    id: 'ufc',
    name: 'UFC / MMA',
    shortName: 'UFC',
    title: 'UFC / MMA',
    subtitle: 'UFC · Bellator — Vainqueur, Méthode, Round & Over/Under Rounds',
    keywords: ['pronostic UFC', 'pari UFC', 'pronostic MMA', 'pari MMA', 'vainqueur UFC', 'methode victoire UFC', 'round UFC', 'pari combat MMA'],
    badge: 'Vainqueur',
    badgeColor: 'rose',
    color: 'red',
    dailyCoteMin: 14,
    dailyCoteMax: 30,
    accuracy: 48,
    logo: '/logos/sport-ufc.svg',
    matches: [
      { time: '21:00', home: 'Jon Jones', away: 'Tom Aspinall', league: 'UFC HW' },
      { time: '21:30', home: 'Islam Makhachev', away: 'Charles Oliveira', league: 'UFC LW' },
      { time: '22:00', home: 'Alex Pereira', away: 'Magomed Ankalaev', league: 'UFC LHW' },
      { time: '22:30', home: 'Ilia Topuria', away: 'Max Holloway', league: 'UFC FW' },
      { time: '23:00', home: 'Leon Edwards', away: 'Belal Muhammad', league: 'UFC WW' },
      { time: '23:30', home: "Sean O'Malley", away: 'Merab Dvalishvili', league: 'UFC BW' },
      { time: '00:30', home: 'Conor McGregor', away: 'Michael Chandler', league: 'UFC LW' },
      { time: '01:30', home: 'Dustin Poirier', away: 'Justin Gaethje', league: 'UFC LW' },
    ],
  },
  {
    id: 'handball',
    name: 'Handball',
    shortName: 'Hand',
    title: 'Handball',
    subtitle: 'Champions League · Ligue Nationale — Vainqueur, Over/Under Buts & Handicap',
    keywords: ['pronostic handball', 'pari handball', 'pronostic handball Champions League', 'over buts handball', 'pari handball LNH', 'handball EHF', 'picks handball', 'handicap handball'],
    badge: 'Over Buts',
    badgeColor: 'cyan',
    color: 'cyan',
    dailyCoteMin: 12,
    dailyCoteMax: 26,
    accuracy: 53,
    logo: '/logos/sport-handball.svg',
    matches: [
      { time: '18:00', home: 'PSG Handball', away: 'FC Barcelona', league: 'Champions L.' },
      { time: '18:30', home: 'Kiel', away: 'Veszprem', league: 'Champions L.' },
      { time: '19:00', home: 'Flensburg', away: 'Aalborg', league: 'Champions L.' },
      { time: '19:30', home: 'Montpellier', away: 'Kolding', league: 'Champions L.' },
      { time: '20:00', home: 'Nantes', away: 'Szeged', league: 'Champions L.' },
      { time: '20:30', home: 'Magdeburg', away: 'Zagreb', league: 'Champions L.' },
      { time: '21:30', home: 'Celje', away: 'Dinamo Bucarest', league: 'Champions L.' },
      { time: '22:00', home: 'HBC Nantes', away: 'Chambery', league: 'LNH' },
    ],
  },
]

// Deterministic daily cote
function getDailyCote(sportId: string, min: number, max: number): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + sportId.length
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const fraction = x - Math.floor(x)
  return Math.round((min + fraction * (max - min)) * 100) / 100
}

const BADGE_STYLES = {
  green: 'bg-success/15 text-success-light border-success/30',
  gold: 'bg-gold/15 text-gold-light border-gold/30',
  cyan: 'bg-live/15 text-live-light border-live/30',
  rose: 'bg-lose/15 text-lose-light border-lose/30',
}

// ─── Premium VIP Sport Card ──────────────────────────────────────────────
function VipSportPanel({ sport, onUnlock }: { sport: SportVip; onUnlock: () => void }) {
  const dailyCote = useMemo(() => getDailyCote(sport.id, sport.dailyCoteMin, sport.dailyCoteMax), [sport.id, sport.dailyCoteMin, sport.dailyCoteMax])
  const matchCount = sport.matches.length
  const cotePerMatch = Math.pow(dailyCote, 1 / matchCount)

  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1500, { decimals: 2, threshold: 0.3 })
  const [matchCountRef, matchCountDisplay] = useCountUp(matchCount, 1200, { threshold: 0.3 })

  const accent = SPORT_COLORS[sport.color]
  // Convert hex to rgba for opacity variants
  const hex2rgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  const accentBg = hex2rgba(accent.hex, 0.08)
  const accentBgHover = hex2rgba(accent.hex, 0.15)
  const accentGlow = hex2rgba(accent.hex, 0.4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="squircle-xl overflow-hidden"
      style={{ borderColor: hex2rgba(accent.hex, 0.25) }}
    >
      {/* Top accent — sport color gradient */}
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)` }} />

      {/* Header with sport logo + title */}
      <div className="relative p-5 sm:p-6 border-b border-edge"
        style={{
          background: `linear-gradient(135deg, ${accentBg} 0%, transparent 60%)`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Big sport logo with sport color border */}
            <div
              className="w-16 h-16 rounded-2xl bg-midnight/60 flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ border: `1px solid ${hex2rgba(accent.hex, 0.3)}` }}
            >
              <img src={sport.logo} alt={sport.name} className="w-12 h-12 object-contain" loading="lazy" />
            </div>
            <div className="min-w-0">
              <span
                className="text-[10px] uppercase tracking-widest font-bold"
                style={{ color: accent.light }}
              >
                VIP Pronostics
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">
                {sport.title}
              </h3>
              <p className="text-[10px] text-gray-500 mt-1 truncate">{sport.subtitle}</p>
            </div>
          </div>

          {/* LIVE badge */}
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-1.5 bg-success/10 border border-success/30 rounded-full px-2.5 py-1"
          >
            <span className="v31-ticker-dot live" />
            <span className="text-[10px] text-success font-bold uppercase tracking-wider">Live</span>
          </motion.div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-white tabular-nums" ref={matchCountRef}>{matchCountDisplay}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Matchs</div>
          </div>
          <div
            className="bg-midnight/40 border rounded-lg p-2.5 text-center"
            style={{ borderColor: hex2rgba(accent.hex, 0.2) }}
          >
            <div
              className="text-lg font-bold tabular-nums"
              style={{ color: accent.light, textShadow: `0 0 20px ${accentGlow}, 0 0 40px ${hex2rgba(accent.hex, 0.3)}` }}
              ref={coteRef}
            >
              {coteDisplay}
            </div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Cote totale</div>
          </div>
          <div className="bg-midnight/40 border border-edge rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-success tabular-nums glow-text-green">{sport.accuracy}%</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Précision</div>
          </div>
        </div>
      </div>

      {/* Matches list — blurred (locked) */}
      <div className="p-4 sm:p-5 space-y-1.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sélection du jour</span>
          <span
            className="badge text-[9px]"
            style={{
              background: hex2rgba(accent.hex, 0.12),
              color: accent.light,
              border: `1px solid ${hex2rgba(accent.hex, 0.3)}`,
            }}
          >
            {sport.badge}
          </span>
        </div>

        {/* Locked matches */}
        <div className="space-y-1 relative">
          {sport.matches.slice(0, 6).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className="relative grid grid-cols-[40px_1fr_60px] items-center gap-2 bg-midnight/40 rounded-lg px-3 py-2 border border-edge/40"
            >
              <span
                className="text-[10px] font-mono tabular-nums"
                style={{ color: hex2rgba(accent.light, 0.7) }}
              >
                {m.time}
              </span>
              <div className="flex items-center gap-1.5 min-w-0 blur-[5px] select-none">
                <span className="text-white text-xs font-semibold truncate">{m.home}</span>
                <span className="text-gray-600 text-[9px]">vs</span>
                <span className="text-white text-xs font-semibold truncate">{m.away}</span>
              </div>
              <span
                className="text-[10px] font-bold tabular-nums blur-[3px] select-none text-right"
                style={{ color: accent.light }}
              >
                {cotePerMatch.toFixed(2)}
              </span>
            </motion.div>
          ))}

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-midnight/30 backdrop-blur-[1px] rounded-lg pointer-events-none">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-midnight/90 rounded-full p-3 flex flex-col items-center gap-1"
              style={{ border: `1px solid ${hex2rgba(accent.hex, 0.3)}` }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent.hex} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: accent.light }}
              >
                VIP
              </span>
            </motion.div>
          </div>

          {/* "+X more matches" hint */}
          {sport.matches.length > 6 && (
            <div className="text-center text-[10px] text-gray-500 mt-2">
              +{sport.matches.length - 6} matchs supplémentaires en VIP
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onUnlock}
          className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 cta-glow text-sm font-bold rounded-xl transition-all"
          style={{
            background: `linear-gradient(180deg, ${accent.light}, ${accent.hex})`,
            color: sport.color === 'cyan' || sport.color === 'red' ? '#FFFFFF' : '#1A0F00',
            boxShadow: `0 4px 12px ${hex2rgba(accent.hex, 0.3)}, inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Débloquer le VIP {sport.shortName}
        </button>

        <p className="text-[10px] text-gray-500 text-center mt-2">
          Inscris-toi avec <CopyableCode code={SITE.promoCode} displayClassName="font-semibold" /> pour débloquer
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main VipSports ─────────────────────────────────────────────────────
export default function VipSports() {
  const [ref, isVisible] = useScrollAnimation()
  const [activeId, setActiveId] = useState<string>('tennis')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSportName, setModalSportName] = useState('')

  const activeSport = SPORTS.find(s => s.id === activeId) || SPORTS[0]

  const handleUnlock = (sportName: string) => {
    setModalSportName(sportName)
    setModalOpen(true)
  }

  return (
    <>
      <section ref={ref} id="vip-sports" className="section-pad">
        <div className="max-w-5xl mx-auto">
          {/* Clean SEO title (was keyword stuffing — fixed bug 2.4) */}
          <h2 className="sr-only">VIP Multi-Sports — Tennis, NBA, NFL, UFC, Handball</h2>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="eyebrow">VIP Multi-Sports · IA</span>
            <h2 className="section-title mt-3 mb-3">
              Pronostics VIP <span className="text-gold">Multi-Sports</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Notre IA scanne tous les sports — Tennis, NBA, NFL, UFC/MMA, Handball.
              Même système, même précision, cotes exclusives.
            </p>
          </motion.div>

          {/* Sport tabs — horizontal scroll on mobile, centered on desktop */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            className="flex items-center justify-center gap-2 mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {SPORTS.map(sport => {
              const isActive = sport.id === activeId
              return (
                <motion.button
                  key={sport.id}
                  variants={staggerChildFadeUp}
                  onClick={() => setActiveId(sport.id)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-gold/15 border border-gold/40'
                      : 'bg-panel/40 border border-edge hover:border-gold/20'
                  }`}
                  aria-label={`Sélectionner ${sport.name}`}
                >
                  <img
                    src={sport.logo}
                    alt={sport.name}
                    className={`w-6 h-6 object-contain transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`}
                    loading="lazy"
                  />
                  <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? 'text-gold-light' : 'text-gray-400'}`}>
                    {sport.shortName}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Active sport panel */}
          <AnimatePresence mode="wait">
            <VipSportPanel
              key={activeId}
              sport={activeSport}
              onUnlock={() => handleUnlock(activeSport.name)}
            />
          </AnimatePresence>

          {/* Below: comparison row — all sports KPIs at a glance */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2"
          >
            {SPORTS.map(sport => {
              const dailyCote = getDailyCote(sport.id, sport.dailyCoteMin, sport.dailyCoteMax)
              return (
                <button
                  key={sport.id}
                  onClick={() => setActiveId(sport.id)}
                  className={`squircle p-3 text-center transition-all ${
                    sport.id === activeId ? 'border-gold/40 bg-gold/[0.06]' : 'hover:border-success/30'
                  }`}
                >
                  <img src={sport.logo} alt={sport.name} className="w-8 h-8 mx-auto object-contain mb-1.5" loading="lazy" />
                  <div className="text-[10px] text-white font-semibold truncate">{sport.shortName}</div>
                  <div className="text-[9px] text-gold tabular-nums mono mt-0.5">{dailyCote.toFixed(2)}</div>
                </button>
              )
            })}
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : undefined}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-[10px] text-gray-500">
              VIP Multi-Sports : 5 sports · 40+ matchs/jour · Précision ~52% (publié)
            </p>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Débloque les pronos VIP ${modalSportName}`}
      />
    </>
  )
}
