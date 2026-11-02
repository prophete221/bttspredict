'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction, trackAffiliateCodeCopy } from '@/lib/affiliateTracking'
import { copyTextToClipboard } from '@/lib/clipboard'
import { useLanguage } from './LanguageSwitcher'

/**
 * StickyCTABar — Mobile-only sticky CTA (appears after 15% scroll).
 * Priorité affiliation 2026-11 : 1xbet (Vipbtts) en principal.
 * Labels selon la locale URL (trafic GSC majoritairement EN / mobile Afrique).
 */
export default function StickyCTABar() {
  const { lang } = useLanguage()
  const langKey = lang === 'en' || lang === 'ar' ? lang : 'fr'
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)

  const primaryCode = 'Vipbtts'
  const primaryHref = AFFILIATE.oneXbet

  const labels = useMemo(() => {
    if (langKey === 'en') {
      return {
        copied: 'Copied!',
        copyAria: `Copy promo code ${primaryCode}`,
        signup: `Sign up · ${primaryCode}`,
        close: 'Close',
      }
    }
    if (langKey === 'ar') {
      return {
        copied: 'تم النسخ!',
        copyAria: `نسخ الرمز ${primaryCode}`,
        signup: `سجّل · ${primaryCode}`,
        close: 'إغلاق',
      }
    }
    return {
      copied: 'Copié!',
      copyAria: `Copier le code promo ${primaryCode}`,
      signup: `S'inscrire · ${primaryCode}`,
      close: 'Fermer',
    }
  }, [langKey, primaryCode])

  useEffect(() => {
    if (dismissed) return
    const onScroll = () => {
      const denom = document.documentElement.scrollHeight - window.innerHeight
      if (denom <= 0) {
        setVisible(false)
        return
      }
      const scrollPercent = window.scrollY / denom
      setVisible(scrollPercent > 0.15)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [dismissed])

  const copyCode = async () => {
    const ok = await copyTextToClipboard(primaryCode)
    if (ok) {
      trackAffiliateCodeCopy('1xbet', 'sticky-vipbtts')
      setCopied(true)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15)
      }
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-0 right-0 z-40 md:hidden"
          style={{
            bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
            paddingBottom: '0px',
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2.5 backdrop-blur-xl"
            style={{
              backgroundColor: 'rgba(7, 17, 26, 0.95)',
              borderTop: '1px solid rgba(47, 125, 255, 0.2)',
              boxShadow: '0 -4px 20px rgba(7, 17, 26, 0.4)',
            }}
          >
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-3 h-[48px] rounded-[12px] flex-shrink-0 transition-all"
              style={{
                backgroundColor: copied ? 'rgba(27, 110, 243, 0.2)' : '#141C25',
                border: '1px solid ' + (copied ? 'rgba(27, 110, 243, 0.45)' : 'rgba(244, 247, 251, 0.12)'),
              }}
              aria-label={labels.copyAria}
              data-cta="sticky-copy-1xbet"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CC9F0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(244, 247, 251,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              )}
              <span className="font-mono text-[13px] font-bold" style={{ color: copied ? '#4CC9F0' : '#F2F6FA' }}>
                {copied ? labels.copied : primaryCode}
              </span>
            </button>

            <a
              href={primaryHref}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'sticky-register')}
              data-cta="sticky-register-1xbet"
              className="flex-1 flex items-center justify-center gap-2 h-[48px] rounded-[12px] font-bold text-[14px] transition-opacity hover:opacity-95"
              style={{ backgroundColor: '#1B6EF3', color: '#FFFFFF' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
              {labels.signup}
            </a>

            <button
              onClick={() => setDismissed(true)}
              className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] flex-shrink-0"
              style={{ backgroundColor: '#141C25' }}
              aria-label={labels.close}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(244, 247, 251,0.4)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
