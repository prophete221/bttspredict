'use client'

/**
 * CtaButton — bouton d'action sobre et cohérent (refonte 2026-11).
 *
 * Remplace MovingGradientButton (gradient animé, halo, stroke SVG) partout
 * où un CTA principal est nécessaire. Une seule apparence « primary »
 * (bleu analyse) + styles optionnels via className. Cible tactile ≥ 44 px,
 * focus visible, réduction de mouvement native (aucune animation).
 *
 * Props compatibles avec l'ancien usage : href, external, rel, dataCta,
 * onClick, style, className, children.
 */

import type { CSSProperties, ReactNode, MouseEventHandler } from 'react'

interface CtaButtonProps {
  href: string
  children: ReactNode
  external?: boolean
  rel?: string
  dataCta?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  style?: CSSProperties
  className?: string
  ariaLabel?: string
}

export default function CtaButton({
  href,
  children,
  external,
  rel,
  dataCta,
  onClick,
  style,
  className = '',
  ariaLabel,
}: CtaButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank' } : {})}
      {...(rel ? { rel } : {})}
      data-cta={dataCta}
      onClick={onClick}
      style={style}
      className={`cta-btn ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  )
}
