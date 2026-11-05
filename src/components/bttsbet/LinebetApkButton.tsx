'use client'

import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

/**
 * LinebetApkButton — Bouton de téléchargement APK Linebet
 */
export default function LinebetApkButton() {
  return (
    <a
      href={AFFILIATE.linebetDownload}
      rel="sponsored nofollow noopener noreferrer"
      target="_blank"
      onClick={() => trackAffiliateAction('linebet', 'download_click', 'linebet-apk-button')}
      data-cta="linebet-apk-download"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors"
      style={{
        backgroundColor: 'rgba(47, 125, 255, 0.1)',
        border: '1px solid #2F7DFF',
        color: '#2F7DFF',
      }}
    >
      <img src="/logos/google-play.svg" alt="" aria-hidden="true" width="18" height="18" className="h-5 w-5 shrink-0 object-contain" />
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-white p-0.5">
        <img src="/logos/linebet-logo.jpg" alt="" width="20" height="20" className="h-5 w-5 object-contain" />
      </span>
      Télécharger l'APK Linebet (Android)
    </a>
  )
}
