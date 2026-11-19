'use client'

/**
 * BrandMark — identité visuelle bttspredict 2026 (direction « Prime Time Volt »).
 * Marque : deux buts face à face + ballon sur la ligne = BTTS (les deux équipes marquent).
 * SVG pur, aucune dépendance, tailles pilotées par props (utilisé dans la navbar,
 * le footer, le drawer mobile, le favicon et les icônes PNG régénérées).
 */
export default function BrandMark({ size = 40, withBadge = true }: { size?: number; withBadge?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="bm-volt" x1="10" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#DFFF6A" />
          <stop offset="0.55" stopColor="#C6F53F" />
          <stop offset="1" stopColor="#8FD42B" />
        </linearGradient>
        <linearGradient id="bm-badge" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10160F" />
          <stop offset="1" stopColor="#0A0E08" />
        </linearGradient>
      </defs>

      {withBadge && (
        <>
          <rect x="1.5" y="1.5" width="45" height="45" rx="13.5" fill="url(#bm-badge)" />
          <rect
            x="1.5"
            y="1.5"
            width="45"
            height="45"
            rx="13.5"
            stroke="url(#bm-volt)"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Ligne médiane du terrain */}
      <line x1="24" y1="9" x2="24" y2="39" stroke="url(#bm-volt)" strokeOpacity="0.28" strokeWidth="1.6" strokeDasharray="2.5 3.5" strokeLinecap="round" />

      {/* But gauche (domestic) */}
      <path d="M12.5 15.5 V30 Q12.5 32.5 15 32.5 H19" stroke="url(#bm-volt)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* But droit (visiteur) */}
      <path d="M35.5 15.5 V30 Q35.5 32.5 33 32.5 H29" stroke="url(#bm-volt)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Ballon sur la ligne — les deux équipes marquent */}
      <circle cx="24" cy="24" r="6.2" fill="url(#bm-volt)" />
      <path d="M24 20.6 L26.5 22.5 L25.5 25.6 L22.5 25.6 L21.5 22.5 Z" fill="#0A0E08" opacity="0.85" />
      <path d="M24 20.6 V17.9 M26.5 22.5 L29.4 21.6 M25.5 25.6 L27.3 28.2 M22.5 25.6 L20.7 28.2 M21.5 22.5 L18.6 21.6" stroke="#0A0E08" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}
