'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import VipLevelModal, { type VipLevelId } from './VipLevelModal'

/**
 * VipCardGlass — Carte VIP "Glassmorphism" ultra-moderne
 *
 * Style : Verre dépoli (translucidité + backdrop-filter blur) sur fond sombre #0F1316
 * Accents : Émeraude vif #E0C191 + Or Champagne #E0C191
 * Bordure : Ligne fine lumineuse dégradée (1px)
 * Profondeur : Ombres portées 3D pour effet de flottement
 *
 * Structure :
 * 1. En-tête : Niveau VIP en Or Champagne (Poppins Bold) + Logo BTTSPredict
 * 2. Corps : Nom utilisateur (Blanc cassé #F6F2E9) + Liste avantages (Gris #9E9B96) avec puces émeraude
 * 3. Pied : Statut "Actif" discret
 */

export interface VipCardProps {
  level: string           // ex: "VIP Gold", "VIP Premium", "VIP Elite"
  levelId?: VipLevelId    // identifiant pour la modale dédiée
  username?: string       // nom utilisateur (placeholder si non fourni)
  benefits: string[]      // liste d'avantages
  status?: 'active' | 'pending' | 'locked'
  meta?: string           // ex: "30 jours", "Illimité"
  ctaLabel?: string       // texte du bouton CTA
  ctaHref?: string        // lien du CTA (fallback si pas de levelId)
  variant?: 'emerald' | 'gold'  // variante de couleur
  index?: number          // pour animation stagger
}

export default function VipCardGlass({
  level,
  levelId,
  username = 'Membre VIP',
  benefits,
  status = 'active',
  meta,
  ctaLabel = 'Débloquer le VIP',
  ctaHref = '#vip',
  variant = 'emerald',
  index = 0,
}: VipCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const statusLabel = status === 'active' ? 'Actif' : status === 'pending' ? 'En attente' : 'Verrouillé'
  const ctaClickHandler = levelId
    ? (e: React.MouseEvent) => { e.preventDefault(); setModalOpen(true) }
    : undefined

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`vip-glass-card ${variant === 'gold' ? 'gold' : ''}`}
    >
      {/* ═══ 1. EN-TÊTE : Niveau VIP + Logo BTTSPredict ═══ */}
      <div className="vip-glass-header">
        <div className="vip-glass-level">
          {level}
        </div>
        <div className="vip-glass-logo">
          <div className="vip-glass-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#05070A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 4 4 5-5" />
            </svg>
          </div>
          <span className="vip-glass-logo-text">BTTSPredict</span>
        </div>
      </div>

      {/* ═══ 2. CORPS : Utilisateur + Avantages ═══ */}
      <div className="vip-glass-body">
        <div className="vip-glass-username">{username}</div>
        <ul className="vip-glass-benefits">
          {benefits.map((benefit, i) => (
            <li key={i} className="vip-glass-benefit">
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* ═══ CTA ═══ */}
      <a
        href={ctaClickHandler ? '#' : ctaHref}
        onClick={ctaClickHandler}
        className="vip-glass-cta"
      >
        {ctaLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>

      {/* ═══ 3. PIED : Statut + Meta ═══ */}
      <div className="vip-glass-footer">
        <span className="vip-glass-status">
          {statusLabel}
        </span>
        {meta && <span className="vip-glass-meta">{meta}</span>}
      </div>
    </motion.div>

    {levelId && (
      <VipLevelModal
        levelId={levelId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    )}
    </>
  )
}

/**
 * VipCardGrid — Section complète avec 3 cartes VIP glassmorphism
 * À insérer dans la page d'accueil après la section VIP existante
 */
export function VipCardGrid() {
  const cards: VipCardProps[] = [
    {
      level: 'VIP Silver',
      levelId: 'silver',
      username: 'Parieur Débutant',
      benefits: [
        '10 pronostics premium par jour',
        'BTTS + Over 2.5 détaillés',
        'Historique complet accessible',
        'Support WhatsApp 24/7',
      ],
      status: 'active',
      meta: 'Dépôt min. 3 000 XOF',
      ctaLabel: 'Débloquer Silver',
      variant: 'emerald',
      index: 0,
    },
    {
      level: 'VIP Gold',
      levelId: 'gold',
      username: 'Parieur Expérimenté',
      benefits: [
        '20 pronostics premium par jour',
        'Multi-sports (Football, Tennis, NBA, NFL, UFC, Handball)',
        'Value Bets FIFA inclus',
        'Cotes détaillées + analyse xG',
        'Support WhatsApp prioritaire',
      ],
      status: 'active',
      meta: 'Dépôt min. 6 000 XOF',
      ctaLabel: 'Débloquer Gold',
      variant: 'gold',
      index: 1,
    },
    {
      level: 'VIP Elite',
      levelId: 'elite',
      username: 'Parieur Professionnel',
      benefits: [
        '30+ pronostics premium par jour',
        'Tous les sports + marchés spéciaux',
        'Stats Aviator + Value Bets illimités',
        'Analyse personnalisée par notre expert',
        'Support VIP direct (WhatsApp + Telegram)',
        'Accès anticipé aux nouvelles fonctionnalités',
      ],
      status: 'active',
      meta: 'Dépôt min. 12 000 XOF',
      ctaLabel: 'Débloquer Elite',
      variant: 'emerald',
      index: 2,
    },
    {
      level: 'VIP TOUS NIVEAUX',
      levelId: 'all',
      username: 'Accès complet 1 mois',
      benefits: [
        'Silver + Gold + Elite débloqués',
        'Tous les pronostics premium illimités',
        'Tous les sports et marchés',
        'Stats Aviator + Value Bets illimités',
        'Support VIP prioritaire 24/7',
        'Analyse personnalisée par notre expert',
      ],
      status: 'active',
      meta: 'Dépôt min. 12 000 XOF · 1 mois',
      ctaLabel: 'Débloquer Tout — 1 mois',
      variant: 'gold',
      index: 3,
    },
  ]

  return (
    <section id="vip-glass-cards" className="py-12 sm:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="eyebrow">💎 Niveaux VIP</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-3" style={{ color: '#F6F2E9', fontFamily: 'Poppins, sans-serif' }}>
            Choisis ton <span style={{ color: '#E0C191' }}>niveau VIP</span>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#9E9B96' }}>
            Choisis le niveau qui te correspond. Activation en moins de 30 minutes via WhatsApp après dépôt.
          </p>
        </div>

        {/* Cartes */}
        <div className="vip-glass-grid">
          {cards.map((card) => (
            <VipCardGlass key={card.level} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
