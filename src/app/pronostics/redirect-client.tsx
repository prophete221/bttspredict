'use client'

import { useEffect } from 'react'

export default function PronosticsRedirect() {
  useEffect(() => {
    window.location.href = '/#free-predictions'
  }, [])

  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center">
      <h1 className="sr-only">Pronostics BTTS aujourd'hui et Over 2.5</h1>
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin mb-4" />
        <p className="text-cendre text-sm">Redirection vers les pronostics du jour...</p>
        <a href="/#free-predictions" className="inline-block mt-4 px-6 py-2 bg-emerald text-midnight font-bold rounded-lg">
          Voir les pronostics btts aujourd'hui →
        </a>
      </div>
    </div>
  )
}
