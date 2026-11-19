'use client'

/**
 * StadiumTilt — inclinaison 3D pilotée par le pointeur pour les cartes de
 * pronostic (MatchCenter « btp-match-card », dashboard « btx-card »,
 * pages de prédictions « prediction-match-card »).
 *
 * - Desktop uniquement (hover:hover + pointer:fine) ; désactivé en
 *   prefers-reduced-motion — les cartes restent alors statiques.
 * - Délégation d'événements sur un conteneur : un seul couple de listeners
 *   pour toutes les cartes, survit aux re-rendus React (aucun abonnement
 *   par carte, aucun state React).
 * - Écrit 4 variables CSS sur la carte survolée : --rx/--ry (rotation 3D),
 *   --gx/--gy (position du reflet lumineux). Le CSS identity-2026 fait le
 *   reste (transform, glare, halo).
 * - rAF-throttled, listeners passifs — zéro reflow subi.
 * Retourne une fonction de nettoyage.
 */
export function attachStadiumTilt(
  root: HTMLElement | null,
  selector = '.hp-mc-card, .btx-card, .prediction-match-card',
): () => void {
  if (!root || typeof window === 'undefined') return () => {}
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {}
  } catch {
    return () => {}
  }

  let raf = 0
  let current: HTMLElement | null = null

  const reset = (card: HTMLElement) => {
    card.classList.remove('is-tilting')
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }

  const onMove = (e: PointerEvent) => {
    const target = e.target as Element | null
    const card = (target?.closest?.(selector) as HTMLElement | null) ?? null
    if (card !== current && current) {
      reset(current)
      current = null
    }
    if (!card) return
    current = card
    if (raf) return
    const { clientX, clientY } = e
    raf = requestAnimationFrame(() => {
      raf = 0
      const r = card.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      const px = (clientX - r.left) / r.width
      const py = (clientY - r.top) / r.height
      card.style.setProperty('--rx', `${((0.5 - py) * 7.5).toFixed(2)}deg`)
      card.style.setProperty('--ry', `${((px - 0.5) * 9).toFixed(2)}deg`)
      card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
      card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
      card.classList.add('is-tilting')
    })
  }

  const onLeave = () => {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
    if (current) {
      reset(current)
      current = null
    }
  }

  root.addEventListener('pointermove', onMove, { passive: true })
  root.addEventListener('pointerleave', onLeave, { passive: true })
  return () => {
    root.removeEventListener('pointermove', onMove)
    root.removeEventListener('pointerleave', onLeave)
    onLeave()
  }
}
