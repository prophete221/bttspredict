'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE, SITE } from '@/lib/constants'
import { useScrollAnimation, useCountUp } from '@/hooks/useAnimations'
import VipUnlockModal from './VipUnlockModal'
import CopyableCode from './CopyableCode'

// ─── Palette ────────────────────────────────────────────────────────────
const C = {
  bg:       '#07080C',
  card:     '#F4F1EA',
  elevated: '#1A1F35',
  border:   '#8A8494',
  neon:     '#C9A227',
  neonDk:   '#3DDC97',
  gold:     '#C9A227',
  text:     '#ffffff',
  textSec:  '#a0a0a0',
  textMute: '#5a5a5a',
  success:  '#C9A227',
}

// ─── Sport data ─────────────────────────────────────────────────────────
type SportVip = {
  id: string
  name: string
  logo: string
  accuracy: number
  color: string
}

const SPORTS: SportVip[] = [
  { id: 'football', name: 'Football', logo: '/logos/sport-football.svg', accuracy: 75, color: C.neon },
  { id: 'tennis', name: 'Tennis', logo: '/logos/sport-tennis.svg', accuracy: 73, color: C.gold },
  { id: 'nba', name: 'NBA', logo: '/logos/sport-nba.svg', accuracy: 71, color: C.neon },
  { id: 'nfl', name: 'NFL', logo: '/logos/sport-nfl.svg', accuracy: 69, color: C.neon },
  { id: 'ufc', name: 'UFC', logo: '/logos/sport-ufc.svg', accuracy: 72, color: '#FF6B4A' },
  { id: 'handball', name: 'Handball', logo: '/logos/sport-handball.svg', accuracy: 77, color: C.success },
]

// Deterministic daily cote
function getDailyCote(sportId: string, min: number, max: number): number {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + sportId.length
  const x = Math.sin(seed * 9301 + 49297) * 233280
  const fraction = x - Math.floor(x)
  return Math.round((min + fraction * (max - min)) * 100) / 100
}

const WHATSAPP_NUMBER = '+15406704172'
const WHATSAPP_MSG = "Bonjour, j'ai confirmé mon inscription et mon dépôt sur Linebet/888starz avec le code VISION221. Je veux débloquer mon accès VIP."

export default function VipSports() {
  const [ref, isVisible] = useScrollAnimation()
  const [activeId, setActiveId] = useState<string>('football')
  const [showModal, setShowModal] = useState(false)

  const activeSport = SPORTS.find(s => s.id === activeId) || SPORTS[0]
  const dailyCote = useMemo(() => getDailyCote(activeId, 12, 30), [activeId])

  const [coteRef, coteDisplay] = useCountUp(dailyCote, 1500, { decimals: 2, threshold: 0.3 })

  return (
    <>
      <section ref={ref} id="vip-sports" className="section-pad overflow-x-hidden" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <div className="max-w-[440px] sm:max-w-2xl mx-auto">
          {/* Clean SEO title */}
          <h2 className="sr-only">VIP Multi-Sports — Tennis, NBA, NFL, UFC, Handball</h2>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="text-center mb-5"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: C.gold }}>ZONE PREMIUM</span>
            <h2 className="font-bold text-xl mt-1" style={{ color: C.text }}>VIP Multi-Sports</h2>
            <p className="text-[12px] mt-1" style={{ color: C.textSec }}>
              Pronostics IA sur 6 sports — précision 69-77%
            </p>
          </motion.div>

          {/* Sport selector — big logos visible */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4"
          >
            {SPORTS.map(sport => {
              const isActive = sport.id === activeId
              return (
                <button
                  key={sport.id}
                  onClick={() => setActiveId(sport.id)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: isActive ? '#F4F1EA' : '#F4F1EA',
                    border: isActive
                      ? '1px solid ' + sport.color
                      : '1px solid #8A8494',
                    boxShadow: isActive ? '0 0 12px ' + sport.color + '30' : 'none',
                  }}
                  aria-label={`Sélectionner ${sport.name}`}
                  aria-pressed={isActive}
                >
                  <img
                    src={sport.logo}
                    alt={sport.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    style={{
                      filter: isActive ? 'none' : 'grayscale(0.5) opacity(0.6)',
                      transition: 'all 0.2s',
                    }}
                    loading="lazy"
                  />
                  <span
                    className="text-[9px] sm:text-[10px] font-semibold"
                    style={{ color: isActive ? sport.color : C.textMute }}
                  >
                    {sport.name}
                  </span>
                </button>
              )
            })}
          </motion.div>

          {/* Active sport card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-[16px] overflow-hidden"
              style={{
                backgroundColor: '#0F1219',
                border: '1px solid rgba(244, 241, 234, 0.08)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}
            >
              {/* Top accent */}
              <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, ' + activeSport.color + ', transparent)' }} />

              {/* Header with big logo */}
              <div className="p-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#1A1F35', border: '1px solid ' + activeSport.color + '30' }}>
                  <img src={activeSport.logo} alt={activeSport.name} className="w-10 h-10 object-contain" loading="lazy" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{activeSport.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[12px] font-bold" style={{ color: activeSport.color }}>~{activeSport.accuracy}%</span>
                    <span className="text-[10px]" style={{ color: C.textMute }}>précision VIP</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)', border: '1px solid rgba(201, 162, 39, 0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: C.success }}>Live</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="px-4 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-mono text-base font-bold text-white">8</div>
                    <div className="text-[8px] uppercase tracking-widest" style={{ color: C.textMute }}>matchs</div>
                  </div>
                  <div className="w-px h-6 bg-dark-800" />
                  <div className="text-center">
                    <div className="font-mono text-base font-bold" style={{ color: activeSport.color }}>VIP</div>
                    <div className="text-[8px] uppercase tracking-widest" style={{ color: C.textMute }}>cote</div>
                  </div>
                </div>
              </div>

              {/* Locked matches */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: C.textMute }}>Sélection du jour</span>
                  <span className="text-[9px]" style={{ color: C.textMute }}>Verrouillé</span>
                </div>
                <div className="space-y-1.5" style={{ filter: 'blur(6px)', opacity: 0.5 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                      <div className="w-6 h-3 rounded" style={{ backgroundColor: '#0F1219' }} />
                      <div className="flex-1 h-3 rounded" style={{ backgroundColor: '#0F1219' }} />
                      <div className="w-8 h-3 rounded" style={{ backgroundColor: '#0F1219' }} />
                    </div>
                  ))}
                </div>

                {/* Simple CTA — doesn't block navigation */}
                <div className="flex items-center justify-center py-4 mt-2">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-5 py-2.5 rounded-xl font-bold text-[13px]"
                    style={{
                      background: 'linear-gradient(135deg, #C9A227, #3DDC97)',
                      color: '#07080C',
                      boxShadow: '0 4px 16px rgba(201, 162, 39, 0.3)',
                    }}
                  >
                    🔒 Débloquer le VIP
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* WhatsApp support */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-3 rounded-[14px] p-3"
            style={{ backgroundColor: '#0F1219', border: '1px solid rgba(201, 162, 39, 0.2)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#C9A227">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01-1.87-1.87-4.36-2.91-7.01-2.91zm0 1.67c2.2 0 4.27.86 5.82 2.42 1.56 1.56 2.42 3.63 2.42 5.82 0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.81-1.29-1.24-2.79-1.24-4.34 0-4.54 3.7-8.24 8.24-8.24zM8.53 7.33c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.74 2.78 4.31 3.79 2.57 1.01 2.57.67 3.04.63.46-.04 1.5-.61 1.71-1.21.21-.6.21-1.11.15-1.21-.06-.11-.23-.17-.48-.29-.25-.12-1.5-.74-1.72-.82-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.07-.39-2.04-1.26-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[12px] font-bold text-white">Inscription confirmée ?</div>
                <div className="text-[10px]" style={{ color: C.textMute }}>Débloque ton VIP via WhatsApp si tu as déjà inscrit et déposé</div>
              </div>
              <a
                href={`https://wa.me/15406704172?text=${encodeURIComponent(WHATSAPP_MSG)}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                style={{ backgroundColor: '#C9A227', color: '#F4F1EA' }}
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <VipUnlockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Débloque les pronos VIP ${activeSport.name}`}
      />
    </>
  )
}
