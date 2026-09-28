'use client'

// Émet l'événement match_view (1×/session/page de match) au montage.
// Monté uniquement sur /match/[slug]. Aucune donnée personnelle : match,
// ligue et marché proviennent des données publiques du site.

import { useEffect } from 'react'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

export default function MatchViewTracker({ match, league }: { match: string; league?: string }) {
  useEffect(() => {
    trackAffiliateAction('linebet', 'match_view', window.location.pathname, {
      match,
      league: league || undefined,
    })
  }, [match, league])

  return null
}
