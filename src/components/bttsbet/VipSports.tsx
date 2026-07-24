'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE, AFFILIATE, ANDROID_LOGO } from '@/lib/constants'
import { staggerContainer, staggerChildFadeUp, badgePulse, modalBackdrop, modalContent } from '@/lib/motionPresets'
import { useScrollAnimation, useCountUp, useStaggerReveal } from '@/hooks/useAnimations'
import { StatsIcon, FloatingParticles } from './AnimatedIcons'
import VipUnlockModal from './VipUnlockModal'

// ─────────────────────────────────────────────────────────────────────────────
// VipSports — Multi-sport VIP sections (Tennis, NBA, NFL, UFC, Handball)
// Same prediction system as PromoVip: 10 matches, daily cote, blurred picks,
// gated access via Linebet/888starz inscription + ID verification.
// Each section injects SEO keywords bettors search for on the given sport.
// ─────────────────────────────────────────────────────────────────────────────

// Reuse the same VipModal as PromoVip — bookmaker selection + ID verification

// Sport-specific team/player logo (initials fallback since real logos are not provided)
function SportTeamLogo({ name, accent = 'gold', size = 18 }: { name: string; accent?: 'gold' | 'emerald' | 'red' | 'cyan'; size?: number }) {
  const initials = name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
  const accentMap = {
    gold: 'bg-gold/10 border-gold/15 text-gold/70',
    emerald: 'bg-gold/10 border-gold/15 text-gold/70',
    red: 'bg-red-500/10 border-red-500/15 text-red-400',
    cyan: 'bg-cyan-400/10 border-cyan-400/15 text-cyan-400',
  }
  return (
    <div className={`rounded-full border flex items-center justify-center font-bold flex-shrink-0 ${accentMap[accent]}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials}
    </div>
  )
}

function SportCouponRow({ match, time, homeTeam, awayTeam, league, cote, index, badge }: {
  match: string; time: string; homeTeam: string; awayTeam: string; league: string; cote: number; index: number; badge: string
}) {
  return (
    <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(250,204,21,0.08)', transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }} whileTap={{ y: 0, transition: { duration: 0.15 } }} style={{ willChange: 'transform, opacity', animationDelay: `${0.15 + index * 0.08}s` }}
      className="v31-cascade-row v31-card-hover-glow relative bg-midnight/50 rounded-lg px-2.5 sm:px-3 py-2.5 sm:py-2 border border-gold/8 hover:border-gold/20 transition-colors overflow-hidden"
    >
      {/* Mobile: stacked layout, Desktop: row layout */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
        {/* Top row: time + teams */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
          <span className="text-[10px] sm:text-xs text-gold/60 font-mono tabular-nums w-10 text-center flex-shrink-0">{time}</span>
          {/* Teams - stacked on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 flex-1 min-w-0 blur-[4px] select-none">
            {/* Home team */}
            <div className="flex items-center gap-1 min-w-0">
              <SportTeamLogo name={homeTeam} size={14} />
              <span className="text-white text-xs sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{homeTeam}</span>
            </div>
            {/* VS separator */}
            <span className="text-gray-500 text-[10px] font-bold flex-shrink-0 hidden sm:block">vs</span>
            {/* Away team */}
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-gray-500 text-[10px] font-bold flex-shrink-0 sm:hidden">vs</span>
              <SportTeamLogo name={awayTeam} size={14} />
              <span className="text-white text-xs sm:text-sm font-semibold truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{awayTeam}</span>
            </div>
          </div>
        </div>
        {/* Bottom row: league + cote + badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 justify-between sm:justify-end">
          <span className="text-gray-500 text-[10px] flex-shrink-0 truncate max-w-[100px]">{league}</span>
          <span className="text-[10px] sm:text-xs text-gold font-bold bg-gold/10 border border-gold/15 rounded px-1.5 py-0.5 flex-shrink-0 tabular-nums blur-[3px] select-none">{cote.toFixed(2)}</span>
          <div className="relative flex items-center flex-shrink-0">
            <div className="blur-[4px] select-none">
              <span className="text-gold text-[10px] sm:text-xs font-bold px-1.5 py-0.5 bg-gold/10 rounded">{badge}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold/70">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SPORT DATA — keywords bettors search for + sample matches (rotating per day)
// ─────────────────────────────────────────────────────────────────────────────

type SportVip = {
  id: string
  name: string // 'Tennis', 'NBA', ...
  title: string // section headline keyword
  subtitle: string // SEO keywords bettors search for
  keywords: string[] // injected as hidden H2 for SEO
  badge: string // pick label (e.g., 'Gagnant', 'Over 2.5', 'Vainqueur')
  icon: React.ReactNode
  logo: string // path to sport logo SVG image
  dailyCoteMin: number
  dailyCoteMax: number
  matches: { time: string; home: string; away: string; league: string }[]
}

const SPORTS: SportVip[] = [
  {
    id: 'tennis',
    name: 'Tennis',
    title: 'PRONOSTICS VIP TENNIS',
    subtitle: 'ATP · WTA · Grand Chelem — Gagnant, Over/Under Games, Set 1 & Handicap',
    keywords: ['pronostic tennis', 'pari tennis ATP', 'pari tennis WTA', 'pronostic gagnant tennis', 'over games tennis', 'Grand Chelem pronostic', 'Roland Garros pronostic', 'Wimbledon picks'],
    badge: 'Gagnant',
    dailyCoteMin: 18,
    dailyCoteMax: 35,
    logo: '/logos/sport-tennis.svg',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/><path d="M12 2a10 10 0 0 1 0 20"/></svg>,
    matches: [
      { time: '11:00', home: 'Carlos Alcaraz', away: 'Jannik Sinner', league: 'ATP 1000' },
      { time: '13:30', home: 'Novak Djokovic', away: 'Daniil Medvedev', league: 'ATP 500' },
      { time: '15:00', home: 'Iga Swiatek', away: 'Aryna Sabalenka', league: 'WTA 1000' },
      { time: '16:30', home: 'Coco Gauff', away: 'Elena Rybakina', league: 'WTA 500' },
      { time: '18:00', home: 'Alexander Zverev', away: 'Andrey Rublev', league: 'ATP 500' },
      { time: '19:30', home: 'Taylor Fritz', away: 'Hubert Hurkacz', league: 'ATP 250' },
      { time: '20:30', home: 'Ons Jabeur', away: 'Jessica Pegula', league: 'WTA 500' },
      { time: '21:30', home: 'Stefanos Tsitsipas', away: 'Casper Ruud', league: 'ATP 500' },
      { time: '22:30', home: 'Holger Rune', away: 'Frances Tiafoe', league: 'ATP 250' },
      { time: '23:30', home: 'Marketa Vondrousova', away: 'Maria Sakkari', league: 'WTA 250' },
    ],
  },
  {
    id: 'nba',
    name: 'NBA',
    title: 'PRONOSTICS VIP NBA',
    subtitle: 'NBA · EuroLeague — Vainqueur, Over/Under Points, Margin & Player Props',
    keywords: ['pronostic NBA', 'pari NBA', 'pronostic basket', 'over points NBA', 'pari basket EuroLeague', 'NBA picks du jour', 'player props NBA', 'handicap basket'],
    badge: 'Over Pts',
    dailyCoteMin: 12,
    dailyCoteMax: 28,
    logo: '/logos/sport-nba.svg',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2v20M5 5l14 14M19 5L5 19"/></svg>,
    matches: [
      { time: '01:00', home: 'LA Lakers', away: 'Boston Celtics', league: 'NBA' },
      { time: '01:30', home: 'Golden State', away: 'Milwaukee Bucks', league: 'NBA' },
      { time: '02:00', home: 'Denver Nuggets', away: 'Phoenix Suns', league: 'NBA' },
      { time: '02:30', home: 'Miami Heat', away: 'Philadelphia 76ers', league: 'NBA' },
      { time: '03:00', home: 'Dallas Mavericks', away: 'Minnesota Timberwolves', league: 'NBA' },
      { time: '19:00', home: 'Real Madrid', away: 'FC Barcelona', league: 'EuroLeague' },
      { time: '19:30', home: 'Olympiacos', away: 'Panathinaikos', league: 'EuroLeague' },
      { time: '20:00', home: 'CSKA Moscou', away: 'Fenerbahce', league: 'EuroLeague' },
      { time: '20:30', home: 'Bayern Munich', away: 'Maccabi Tel Aviv', league: 'EuroLeague' },
      { time: '21:00', home: 'Olimpia Milano', away: 'ASVEL', league: 'EuroLeague' },
    ],
  },
  {
    id: 'nfl',
    name: 'NFL',
    title: 'PRONOSTICS VIP NFL',
    subtitle: 'NFL · College Football — Vainqueur, Over/Under Points, Spread & Touchdown Props',
    keywords: ['pronostic NFL', 'pari NFL', 'pronostic football americain', 'pari NFL américain', 'over under NFL', 'spread NFL', 'touchdown NFL', 'NFL picks dimanche'],
    badge: 'Spread',
    dailyCoteMin: 15,
    dailyCoteMax: 32,
    logo: '/logos/sport-nfl.svg',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="10" ry="6"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
    matches: [
      { time: '18:00', home: 'Kansas City Chiefs', away: 'Buffalo Bills', league: 'NFL' },
      { time: '18:30', home: 'San Francisco 49ers', away: 'Philadelphia Eagles', league: 'NFL' },
      { time: '19:00', home: 'Dallas Cowboys', away: 'NY Giants', league: 'NFL' },
      { time: '19:30', home: 'Green Bay Packers', away: 'Detroit Lions', league: 'NFL' },
      { time: '20:00', home: 'Baltimore Ravens', away: 'Cincinnati Bengals', league: 'NFL' },
      { time: '20:30', home: 'Miami Dolphins', away: 'NY Jets', league: 'NFL' },
      { time: '21:00', home: 'LA Rams', away: 'Seattle Seahawks', league: 'NFL' },
      { time: '21:30', home: 'Pittsburgh Steelers', away: 'Cleveland Browns', league: 'NFL' },
      { time: '22:00', home: 'Minnesota Vikings', away: 'Chicago Bears', league: 'NFL' },
      { time: '22:30', home: 'Las Vegas Raiders', away: 'Denver Broncos', league: 'NFL' },
    ],
  },
  {
    id: 'ufc',
    name: 'UFC',
    title: 'PRONOSTICS VIP UFC / MMA',
    subtitle: 'UFC · Bellator — Vainqueur, Méthode, Round & Over/Under Rounds',
    keywords: ['pronostic UFC', 'pari UFC', 'pronostic MMA', 'pari MMA', 'vainqueur UFC', 'methode victoire UFC', 'round UFC', 'pari combat MMA'],
    badge: 'Vainqueur',
    dailyCoteMin: 14,
    dailyCoteMax: 30,
    logo: '/logos/sport-ufc.svg',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/><path d="M12 22V12M2 7l10 5 10-5"/></svg>,
    matches: [
      { time: '21:00', home: 'Jon Jones', away: 'Tom Aspinall', league: 'UFC HW' },
      { time: '21:30', home: 'Islam Makhachev', away: 'Charles Oliveira', league: 'UFC LW' },
      { time: '22:00', home: 'Alex Pereira', away: 'Magomed Ankalaev', league: 'UFC LHW' },
      { time: '22:30', home: 'Ilia Topuria', away: 'Max Holloway', league: 'UFC FW' },
      { time: '23:00', home: 'Leon Edwards', away: 'Belal Muhammad', league: 'UFC WW' },
      { time: '23:30', home: 'Sean O\'Malley', away: 'Merab Dvalishvili', league: 'UFC BW' },
      { time: '00:00', home: 'Amanda Nunes', away: 'Julianna Pena', league: 'UFC WBW' },
      { time: '00:30', home: 'Conor McGregor', away: 'Michael Chandler', league: 'UFC LW' },
      { time: '01:00', home: 'Khamzat Chimaev', away: 'Robert Whittaker', league: 'UFC MW' },
      { time: '01:30', home: 'Dustin Poirier', away: 'Justin Gaethje', league: 'UFC LW' },
    ],
  },
  {
    id: 'handball',
    name: 'Handball',
    title: 'PRONOSTICS VIP HANDBALL',
    subtitle: 'Champions League · Ligue Nationale — Vainqueur, Over/Under Buts & Handicap',
    keywords: ['pronostic handball', 'pari handball', 'pronostic handball Champions League', 'over buts handball', 'pari handball LNH', 'handball EHF', 'picks handball', 'handicap handball'],
    badge: 'Over Buts',
    dailyCoteMin: 12,
    dailyCoteMax: 26,
    logo: '/logos/sport-handball.svg',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
    matches: [
      { time: '18:00', home: 'PSG Handball', away: 'FC Barcelona', league: 'Champions L.' },
      { time: '18:30', home: 'Kiel', away: 'Veszprem', league: 'Champions L.' },
      { time: '19:00', home: 'Flensburg', away: 'Aalborg', league: 'Champions L.' },
      { time: '19:30', home: 'Montpellier', away: 'Kolding', league: 'Champions L.' },
      { time: '20:00', home: 'Nantes', away: 'Szeged', league: 'Champions L.' },
      { time: '20:30', home: 'Magdeburg', away: 'Zagreb', league: 'Champions L.' },
      { time: '21:00', home: 'Pick Szeged', away: 'Wisla Plock', league: 'Champions L.' },
      { time: '21:30', home: 'Celje', away: 'Dinamo Bucarest', league: 'Champions L.' },
      { time: '22:00', home: 'HBC Nantes', away: 'Chambery', league: 'LNH' },
      { time: '22:30', home: 'Aix-en-Provence', away: 'Toulouse', league: 'LNH' },
    ],
  },
]

// Deterministic daily cote per sport
function getSportDailyCote(sportId: string, min: number, max: number): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + sportId.length
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const fraction = x - Math.floor(x)
  return Math.round((min + fraction * (max - min)) * 100) / 100
}

// ─────────────────────────────────────────────────────────────────────────────
// Single VIP sport section card
// ─────────────────────────────────────────────────────────────────────────────

function VipSportCard({ sport, onUnlock, index }: { sport: SportVip; onUnlock: (sportName: string) => void; index: number }) {
  const [ref, isVisible] = useScrollAnimation()
  const dailyCote = useMemo(() => getSportDailyCote(sport.id, sport.dailyCoteMin, sport.dailyCoteMax), [sport.id, sport.dailyCoteMin, sport.dailyCoteMax])

  const matchCount = sport.matches.length
  const cotePerMatch = Math.pow(dailyCote, 1 / matchCount)
  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1600, { decimals: 2, threshold: 0.3 })
  const [matchCountRef, matchCountDisplay] = useCountUp(matchCount, 1200, { threshold: 0.3 })
  const [accuracyRef, accuracyDisplay] = useCountUp(88 + index, 1800, { threshold: 0.3, from: 0 })

  return (
    <section ref={ref} id={`vip-${sport.id}`} className="py-6 sm:py-8 px-4 relative overflow-hidden">
      {/* Hidden SEO keywords — H2 injected for search engines */}
      <h2 className="sr-only">
        {sport.keywords.join(' · ')}
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(250,204,21,0.12)', transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
        whileTap={{ y: 0, transition: { duration: 0.15 } }}
        style={{ willChange: 'transform, opacity' }}
        className="v31-vip-lab-glow holo-border shimmer-card hover-ripple relative squircle-lg border border-gold/25 bg-gradient-to-b from-panel-2 to-panel overflow-hidden hover-lift card-elevate shadow-2xl max-w-4xl mx-auto"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold via-gold-light to-gold" />
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-gold/4 rounded-full blur-[100px] animate-pulse-gold" />
        <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-gold/3 rounded-full blur-[80px]" />

        <div className="relative p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 bg-gold/10 border border-gold/20 squircle flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={sport.logo} alt={sport.name} className="w-8 h-8 object-contain" loading="lazy"/>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {sport.title.split(' ').slice(0, -1).join(' ')} <span className="text-gold">{sport.title.split(' ').slice(-1)}</span>
                </h3>
                <p className="text-[10px] text-gold/60 font-medium tracking-[0.15em] uppercase">{sport.subtitle}</p>
              </div>
            </div>
            <motion.div variants={badgePulse} animate="animate" style={{ willChange: 'transform, opacity' }} className="flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
              <span className="text-[10px] text-gold font-semibold">LIVE</span>
            </motion.div>
            <span className="trust-badge">{sport.name} Vérifié</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 pb-4 border-b border-gold/8 flex-wrap">
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span className="text-[11px] text-gray-400"><span ref={matchCountRef} className="text-white font-semibold tabular-nums">{matchCountDisplay}</span> matchs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <span className="text-[11px] text-gray-400">Cote <span ref={coteRef} className="text-gold font-bold tabular-nums">{coteDisplay}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/60"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span className="text-[11px] text-gray-400">Précision <span ref={accuracyRef} className="text-gold font-bold tabular-nums">~{accuracyDisplay}%</span></span>
            </div>
          </div>

          {/* Matches */}
          <div className="space-y-1 mb-4 max-h-[340px] overflow-y-auto scrollbar-none">
            {sport.matches.map((m, i) => (
              <SportCouponRow
                key={i}
                match={`${m.home} vs ${m.away}`}
                league={m.league}
                time={m.time}
                homeTeam={m.home}
                awayTeam={m.away}
                cote={cotePerMatch}
                index={i}
                badge={sport.badge}
              />
            ))}
          </div>

          {/* Cote totale */}
          <div className="flex items-center justify-between bg-gold/5 border border-gold/10 rounded-lg px-3 py-2 mb-5">
            <span className="text-[11px] text-gray-500 font-medium">Cote totale du coupon {sport.name}</span>
            <span className="text-sm text-gold font-bold tabular-nums">{coteDisplay}</span>
          </div>

          {/* CTA */}
          <button
            onClick={() => onUnlock(sport.name)}
            className="v31-breathing v31-cta-wave relative flex items-center justify-center gap-2 px-4 py-2 btn-gold text-midnight text-xs w-full cursor-pointer overflow-hidden group/btn"
            style={{ ['--v31-wave-delay' as string]: `${3 + index}s` }}
            data-cursor="hover"
          >
            <img src={sport.logo} alt="" className="w-4 h-4 object-contain flex-shrink-0" loading="lazy"/>
            <span>Débloquer le VIP {sport.name}</span>
          </button>

          <div className="flex items-center justify-center gap-2 mt-3">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold/40"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p className="text-[10px] sm:text-[11px] text-gold/40 font-medium">VIP: Historique complet + 10 matchs/jour — <span className="text-gold/60">Débloque avec inscription via VISION221</span></p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — renders all sport VIP sections + shared modal
// ─────────────────────────────────────────────────────────────────────────────

export default function VipSports() {
  const [activeSport, setActiveSport] = useState<string | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [ref, isVisible] = useScrollAnimation()
  const [staggerRef] = useStaggerReveal()

  const handleUnlock = (sportName: string) => {
    setActiveSport(sportName)
    setModalOpen(true)
  }

  return (
    <>
      <section ref={ref} className="section-entrance morph-glow py-6 sm:py-10 px-4 relative overflow-hidden" id="vip-sports">
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-gold/4 rounded-full blur-[140px] opacity-50" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[350px] bg-gold/4 rounded-full blur-[120px] opacity-50" />
        </div>
        <FloatingParticles count={8} />

        <div ref={sectionRef} className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex justify-center mb-2">
              <StatsIcon size={40} />
            </div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em]">VIP Multi-Sports · IA</span>
            <h2 className="section-title font-bold text-white mt-2 tracking-tight">
              PRONOSTICS <span className="text-gold neon-underline">VIP SPORTS</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
              Notre algorithme IA scanne tous les sports : <span className="text-gold/90 font-semibold">Tennis, NBA, NFL, UFC/MMA, Handball</span>. Même système, même précision, mêmes cotes exclusives — débloquez la section VIP de votre sport préféré.
            </p>
            {/* Hidden SEO block — multi-sport keywords bettors search for */}
            <p className="sr-only">
              Pronostics VIP multi-sports : pari tennis ATP WTA, pronostic NBA basket, pari NFL football américain, pronostic UFC MMA combat, pari handball Champions League. Algorithme IA, cotes exclusives, code promo VISION221 sur Linebet et 888starz.
            </p>
          </motion.div>

          <div ref={staggerRef} className="stagger-scale">
          {SPORTS.map((sport, i) => (
            <VipSportCard key={sport.id} sport={sport} onUnlock={handleUnlock} index={i} />
          ))}
          </div>
        </div>
      </section>

      <VipUnlockModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Débloque les pronos VIP ${activeSport || ''}`} />
    </>
  )
}
