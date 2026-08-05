'use client'

import { useEffect } from 'react'

export default function VipRedirect() {
  useEffect(() => {
    window.location.href = '/#vip'
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-gray-600 text-sm">Redirection vers la section VIP...</p>
        <a href="/#vip" className="inline-block mt-4 px-6 py-2 bg-gold text-midnight font-bold rounded-lg">
          Accéder au VIP →
        </a>
      </div>
    </div>
  )
}
