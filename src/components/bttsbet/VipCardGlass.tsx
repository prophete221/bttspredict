'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import VipLevelModal, { type VipLevelId } from './VipLevelModal'

/**
 * VipCardGlass — Carte VIP "Glassmorphism" ultra-moderne
 *
 * Style : Verre dépoli (translucidité + backdrop-filter blur) sur fond sombre #111827
 * Accents : Émeraude vif #D4AF37 + Or Champagne #D4AF37
 * Bordure : Ligne fine lumineuse dégradée (1px)
 * Profondeur : Ombres portées 3D pour effet de flottement
 *
 * Structure :
 * 1. En-tête : Niveau VIP en Or Champagne (Poppins Bold) + Logo BTTSPredict
 * 2. Corps : Nom utilisateur (Blanc cassé #F1F5F9) + Liste avantages (Gris #94A3B8) avec puces émeraude
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
  variant?: 'silver' | 'gold' | 'elite'  // variante de couleur
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
  variant = 'silver',
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
      className={`vip-glass-card ${variant === 'gold' ? 'gold' : variant === 'elite' ? 'elite' : variant === 'silver' ? 'silver' : ''}`}
    >
      {/* ═══ 1. EN-TÊTE : Niveau VIP + Logo BTTSPredict ═══ */}
      <div className="vip-glass-header">
        <div className="vip-glass-level">
          {level}
        </div>
        <div className="vip-glass-logo">
          <div className="vip-glass-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#070A14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      level: 'VIP Essentiel',
      levelId: 'silver',
      username: 'Accès pronostics premium',
      benefits: [
        'Pronostics BTTS + Over 2.5 du jour',
        'Historique vérifiable accessible',
        'Modèle Poisson + indices de confiance',
        'Support par email',
      ],
      status: 'active',
      meta: 'Dépôt min. 3 000 XOF chez Linebet (pas chez BTTSPredict)',
      ctaLabel: 'Débloquer Essentiel',
      variant: 'silver',
      index: 0,
    },
    {
      level: 'VIP Pro',
      levelId: 'gold',
      username: 'Accès complet + Gold Picks',
      benefits: [
        'Pronostics premium + Gold Picks (proba≥65%)',
        'Multi-sports (Football, Tennis, NBA, NFL, UFC, Handball)',
        'Cotes détaillées + analyse xG',
        'Support prioritaire',
      ],
      status: 'active',
      meta: 'Dépôt min. 6 000 XOF chez Linebet (pas chez BTTSPredict)',
      ctaLabel: 'Débloquer Pro',
      variant: 'gold',
      index: 1,
    },
  ]

  return (
    <section id="vip-glass-cards" className="py-12 sm:py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-3" style={{ color: '#F1F5F9', fontFamily: 'Poppins, sans-serif' }}>
            Offres <span style={{ color: '#D4AF37' }}>VIP</span>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#94A3B8' }}>
            Accès pronostics premium. Dépôt chez Linebet/888starz — BTTSPredict ne reçoit pas vos fonds.
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
