'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export interface DashboardTab {
  id: string
  label: string
  /** Clés des panneaux (attribut data-panel) affichés par cet onglet. */
  panels: string[]
}

/**
 * Barre d’onglets du dashboard de match.
 *
 * Les panneaux sont rendus côté serveur (donc présents dans le HTML statique et
 * lisibles sans JavaScript). Ce composant ne fait que filtrer leur visibilité :
 * il n’ajoute, ne calcule et ne masque aucune donnée inexistante.
 */
export default function MatchDashboardTabs({
  tabs,
  ariaLabel,
  children,
}: {
  tabs: DashboardTab[]
  ariaLabel: string
  children: ReactNode
}) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(tabs[0]?.id ?? 'all')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const current = tabs.find(tab => tab.id === active) ?? tabs[0]
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'))
    for (const panel of panels) {
      const key = panel.dataset.panel ?? ''
      const visible = !current || current.panels.includes(key)
      panel.hidden = !visible
      // Un panneau affiché doit montrer son contenu, pas rester replié.
      if (visible && panel instanceof HTMLDetailsElement) panel.open = true
    }
  }, [active, tabs])

  return (
    <div ref={rootRef} className="match-dash" data-match-dashboard="true">
      <div className="match-dash__bar" role="group" aria-label={ariaLabel}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active === tab.id}
            className={`match-dash__tab${active === tab.id ? ' is-active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="match-dash__body">{children}</div>
    </div>
  )
}
