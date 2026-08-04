'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * CopyableCode — Renders the promo code as a clickable, copyable element.
 * Click to copy to clipboard. Shows "Copié!" feedback.
 * Use anywhere the promo code appears for consistency.
 */
export default function CopyableCode({
  code,
  className = '',
  displayClassName = '',
}: {
  code: string
  className?: string
  displayClassName?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <motion.button
        onClick={copy}
        whileTap={{ scale: 0.95 }}
        className={`cursor-pointer font-bold transition-colors ${displayClassName}`}
        aria-label={`Copier le code promo ${code}`}
        style={{ borderBottom: '1px dashed rgba(0, 224, 255, 0.3)' }}
      >
        {code}
      </motion.button>
      <motion.button
        onClick={copy}
        whileTap={{ scale: 0.9 }}
        className="inline-flex items-center justify-center w-4 h-4 rounded transition-colors"
        style={{ color: copied ? '#00E5A0' : '#00E0FF' }}
        aria-label="Copier"
      >
        {copied ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </motion.button>
    </span>
  )
}
