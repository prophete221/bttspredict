'use client'

import { AFFILIATE } from '@/lib/constants'

/**
 * LinebetApkButton — Bouton de téléchargement APK Linebet
 */
export default function LinebetApkButton() {
  return (
    <a
      href={AFFILIATE.linebetDownload}
      rel="sponsored nofollow noopener noreferrer"
      target="_blank"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors"
      style={{
        backgroundColor: 'rgba(75, 182, 135, 0.1)',
        border: '1px solid #E6A24C',
        color: '#E6A24C',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Télécharger l'APK Linebet (Android)
    </a>
  )
}
