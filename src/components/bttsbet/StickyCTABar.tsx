'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import { useLanguage } from './LanguageSwitcher'

/**
 * StickyCTABar — Mobile-only (après 15% scroll).
 * Priorité : Linebet VISION221 puis 1xBet Vipbtts. Pas Melbet/888.
 */
export default function StickyCTABar() {
  const { lang } = useLanguage()
  const langKey = lang === 'en' || lang === 'ar' ? lang : 'fr'
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const labels = useMemo(() => {
    if (langKey === 'en') {
      return {
        linebet: 'Linebet · VISION221',
        xbet: '1xBet · Vipbtts',
        close: 'Close',
      }
    }
    if (langKey === 'ar') {
      return {
        linebet: 'Linebet · VISION221',
        xbet: '1xBet · Vipbtts',
        close: 'إغلاق',
      }
    }
    return {
      linebet: 'Linebet · VISION221',
      xbet: '1xBet · Vipbtts',
      close: 'Fermer',
    }
  }, [langKey])

  useEffect(() => {
    if (dismissed) return
    const onScroll = () => {
      const denom = document.documentElement.scrollHeight - window.innerHeight
      if (denom <= 0) {
        setVisible(false)
        return
      }
      setVisible(window.scrollY / denom > 0.15)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [dismissed])

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
          style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2.5 backdrop-blur-xl"
            style={{
              backgroundColor: 'rgba(7, 17, 26, 0.95)',
              borderTop: '1px solid rgba(47, 125, 255, 0.2)',
              boxShadow: '0 -4px 20px rgba(7, 17, 26, 0.4)',
            }}
          >
            <a
              href={AFFILIATE.linebet}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'sticky-linebet')}
              data-cta="sticky-register-linebet"
              className="flex h-12 flex-1 items-center justify-center rounded-xl px-2 text-center text-[12px] font-bold leading-tight text-white"
              style={{
                background: 'linear-gradient(135deg, #2F7DFF 0%, #1B6EF3 100%)',
                boxShadow: '0 8px 20px rgba(47, 125, 255, 0.35)',
              }}
            >
              {labels.linebet}
            </a>
            <a
              href={AFFILIATE.oneXbet}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'sticky-1xbet')}
              data-cta="sticky-register-1xbet"
              className="flex h-12 flex-1 items-center justify-center rounded-xl px-2 text-center text-[12px] font-bold leading-tight"
              style={{
                color: '#E8F1FF',
                background: 'rgba(27, 110, 243, 0.16)',
                border: '1px solid rgba(27, 110, 243, 0.45)',
              }}
            >
              {labels.xbet}
            </a>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="flex h-12 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[#9DABBB]"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#141C25' }}
              aria-label={labels.close}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
