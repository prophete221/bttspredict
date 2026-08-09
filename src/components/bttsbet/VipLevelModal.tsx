'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'

export type VipLevelId = 'silver' | 'gold' | 'elite' | 'all'

interface VipLevelConfig {
  id: VipLevelId
  level: string
  tagline: string
  deposit: string
  depositAmount: number
  pronosPerDay: string
  duration: string
  features: string[]
  perks: string[]
  accentColor: string
}

export const VIP_LEVELS: Record<VipLevelId, VipLevelConfig> = {
  silver: {
    id: 'silver',
    level: 'VIP Silver',
    tagline: 'Parieur Débutant',
    deposit: '3 000 XOF',
    depositAmount: 3000,
    pronosPerDay: '10 pronostics premium / jour',
    duration: 'Activation en moins de 30 minutes',
    features: [
      '10 pronostics premium par jour',
      'BTTS + Over 2.5 détaillés',
      'Historique complet accessible',
      'Support WhatsApp 24/7',
    ],
    perks: [
      'Pronostics BTTS et Over 2.5 détaillés',
      'Accès à l\'historique complet des résultats',
      'Indices de confiance sur chaque pronostic',
      'Support WhatsApp réactif 24/7',
    ],
    accentColor: '#94A3B8',
  },
  gold: {
    id: 'gold',
    level: 'VIP Gold',
    tagline: 'Parieur Expérimenté',
    deposit: '6 000 XOF',
    depositAmount: 6000,
    pronosPerDay: '20 pronostics premium / jour',
    duration: 'Activation en moins de 30 minutes',
    features: [
      '20 pronostics premium par jour',
      'Multi-sports (Football, Tennis, NBA, NFL, UFC, Handball)',
      'Analyses de valeur FIFA (expérimental) inclus',
      'Cotes détaillées + analyse xG',
      'Support WhatsApp prioritaire',
    ],
    perks: [
      'Multi-sports : Football, Tennis, NBA, NFL, UFC, Handball',
      'Analyses de valeur FIFA (expérimental) inclus',
      'Cotes détaillées + analyse xG',
      'Support WhatsApp prioritaire',
      'Alertes matchs en temps réel',
    ],
    accentColor: '#FFC857',
  },
  elite: {
    id: 'elite',
    level: 'VIP Elite',
    tagline: 'Parieur Professionnel',
    deposit: '12 000 XOF',
    depositAmount: 12000,
    pronosPerDay: '30+ pronostics premium / jour',
    duration: 'Activation en moins de 30 minutes',
    features: [
      '30+ pronostics premium par jour',
      'Tous les sports + marchés spéciaux',
      'Stats historiques Aviator (informatif, non prédictif) + Value Bets illimités',
      'Analyse personnalisée par notre expert',
      'Support VIP direct (WhatsApp + Telegram)',
      'Accès anticipé aux nouvelles fonctionnalités',
    ],
    perks: [
      'Tous les sports et marchés spéciaux débloqués',
      'Stats historiques Aviator (informatif, non prédictif) + Value Bets illimités',
      'Analyse personnalisée par notre expert',
      'Support VIP direct (WhatsApp + Telegram)',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Replays des analyses expert',
    ],
    accentColor: '#FFC857',
  },
  all: {
    id: 'all',
    level: 'VIP TOUS NIVEAUX',
    tagline: 'Accès complet 1 mois',
    deposit: '12 000 XOF',
    depositAmount: 12000,
    pronosPerDay: 'Tous les pronostics illimités',
    duration: 'Valable 1 mois complet',
    features: [
      'Silver + Gold + Elite débloqués',
      'Tous les pronostics premium illimités',
      'Tous les sports et marchés',
      'Stats historiques Aviator (informatif, non prédictif) + Value Bets illimités',
      'Support VIP prioritaire 24/7',
      'Analyse personnalisée par notre expert',
    ],
    perks: [
      'Silver + Gold + Elite débloqués simultanément',
      'Tous les pronostics premium illimités',
      'Tous les sports et marchés accessibles',
      'Stats historiques Aviator (informatif, non prédictif) + Value Bets illimités',
      'Support VIP prioritaire 24/7',
      'Analyse personnalisée par notre expert',
      'Replays et archives complètes',
    ],
    accentColor: '#FFC857',
  },
}

interface VipLevelModalProps {
  levelId: VipLevelId | null
  isOpen: boolean
  onClose: () => void
}

export default function VipLevelModal({ levelId, isOpen, onClose }: VipLevelModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!levelId) return null
  const config = VIP_LEVELS[levelId]
  if (!config) return null

  const copyCode = async () => {
    try { await navigator.clipboard.writeText('VISION221') } catch {}
    setCopied(true)
    navigator.vibrate?.(15)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappMsg = `Bonjour, je veux débloquer ${config.level} (dépôt min. ${config.deposit}). J'ai besoin de la procédure complète.`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          style={{ backgroundColor: 'rgba(7, 11, 24, 0.85)' }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl"
            style={{
              backgroundColor: '#070A14',
              border: `1px solid ${config.accentColor}40`,
              boxShadow: `0 24px 80px rgba(7, 11, 24, 0.8), 0 0 40px ${config.accentColor}20`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
              style={{ backgroundColor: '#111827', border: '1px solid rgba(247, 248, 255,0.1)' }}
              aria-label="Fermer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>

            <div className="p-5 sm:p-6">
              {/* Header — résumé du niveau */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b" style={{ borderColor: 'rgba(81, 70, 245, 0.15)' }}>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${config.accentColor}15`,
                    border: `1px solid ${config.accentColor}40`,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={config.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-papier truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {config.level}
                  </h3>
                  <p className="text-[11px]" style={{ color: '#94A3B8' }}>{config.tagline}</p>
                  <p className="text-[11px] mt-1" style={{ color: config.accentColor }}>
                    Dépôt min. <span className="font-bold">{config.deposit}</span> · {config.pronosPerDay}
                  </p>
                </div>
              </div>

              {/* Title procédure */}
              <p className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: '#94A3B8' }}>
                Procédure de déblocage
              </p>

              {/* ÉTAPE 1 — Code promo */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#111827', color: config.accentColor, border: `1px solid ${config.accentColor}40` }}
                  >1</span>
                  <span className="text-sm font-semibold text-papier">Copie le code promo</span>
                </div>
                <button
                  onClick={copyCode}
                  className="w-full p-4 rounded-xl flex items-center justify-between transition-all"
                  style={{
                    backgroundColor: '#111827',
                    border: `1px solid ${config.accentColor}40`,
                    boxShadow: copied ? `0 0 20px ${config.accentColor}30` : 'none',
                  }}
                  aria-label="Copier le code promo VISION221"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: '#94A3B8' }}>
                      Code promo (majuscules)
                    </div>
                    <div className="font-mono text-2xl font-black tracking-[0.1em]" style={{ color: config.accentColor }}>
                      VISION221
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: copied ? `${config.accentColor}20` : `${config.accentColor}10`,
                    }}
                  >
                    {copied ? (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={config.accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg><span className="text-xs font-bold" style={{ color: config.accentColor }}>Copié !</span></>
                    ) : (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={config.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg><span className="text-xs font-bold" style={{ color: config.accentColor }}>Copier</span></>
                    )}
                  </div>
                </button>
              </div>

              {/* ÉTAPE 2 — Inscription + Dépôt */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#111827', color: config.accentColor, border: `1px solid ${config.accentColor}40` }}
                  >2</span>
                  <span className="text-sm font-semibold text-papier">
                    Inscris-toi et dépose <span style={{ color: config.accentColor }}>{config.deposit}</span> minimum
                  </span>
                </div>
                <p className="text-[12px] mb-3 ml-9" style={{ color: '#94A3B8' }}>
                  Choisis ton bookmaker, inscris-toi avec le code <span className="font-mono font-bold text-papier">VISION221</span>, puis effectue un dépôt via Wave, Orange Money, Free Money ou carte bancaire.
                </p>
                <div className="grid grid-cols-2 gap-2 ml-9">
                  <a
                    href={AFFILIATE.linebet}
                    rel="sponsored noopener"
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
                    style={{ backgroundColor: '#D4AF37', color: '#F1F5F9' }}
                  >
                    Inscription Linebet →
                  </a>
                  <a
                    href={AFFILIATE.star888}
                    rel="sponsored noopener"
                    target="_blank"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #B9E7FF',
                      color: '#B9E7FF',
                    }}
                  >
                    Inscription 888starz →
                  </a>
                </div>
              </div>

              {/* ÉTAPE 3 — Confirmation WhatsApp */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: '#111827', color: config.accentColor, border: `1px solid ${config.accentColor}40` }}
                  >3</span>
                  <span className="text-sm font-semibold text-papier">Contacte le support</span>
                </div>
                <p className="text-[12px] mb-3 ml-9" style={{ color: '#94A3B8' }}>
                  Contacte le support avec ton ID joueur (pas de capture bancaire). Notre équipe active ton <span className="font-semibold text-papier">{config.level}</span> en moins de 30 minutes.
                </p>
                <a
                  href={`https://wa.me/15406704172?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold ml-9"
                  style={{
                    backgroundColor: 'rgba(81, 70, 245, 0.12)',
                    border: '1px solid rgba(81, 70, 245, 0.4)',
                    color: '#D4AF37',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01-1.87-1.87-4.36-2.91-7.01-2.91zm0 1.67c2.2 0 4.27.86 5.82 2.42 1.56 1.56 2.42 3.63 2.42 5.82 0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.81-1.29-1.24-2.79-1.24-4.34 0-4.54 3.7-8.24 8.24-8.24z"/></svg>
                  Contacter le support
                </a>
              </div>

              {/* Récap perks */}
              <div
                className="p-4 rounded-xl mb-4"
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(81, 70, 245, 0.15)',
                }}
              >
                <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: '#94A3B8' }}>
                  Ce que tu débloques
                </p>
                <ul className="space-y-1.5">
                  {config.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: '#94A3B8' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8E063" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confidentialité */}
              <p className="text-[10px] text-center" style={{ color: '#94A3B8' }}>
                {config.duration} · 18+ | Jeu responsable | Aucune donnée bancaire collectée
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
