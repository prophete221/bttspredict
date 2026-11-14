'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import { useLanguage } from './LanguageSwitcher'

/**
 * StickyCTABar — mobile only, après 15 % de défilement.
 * Ordre : 1xBet, puis Linebet; les codes restent sur les guides dédiés.
 * MelBet et 888Starz restent dans le menu et les blocs dédiés.
 */
export default function StickyCTABar() {
  const { lang } = useLanguage()
  const langKey = lang === 'en' || lang === 'ar' ? lang : 'fr'
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const labels = useMemo(() => {
    return {
      close: langKey === 'en' ? 'Close' : langKey === 'ar' ? 'إغلاق' : 'Fermer',
    }
  }, [langKey])

  useEffect(() => {
    if (dismissed) return
    const onScroll = () => {
      const denominator = document.documentElement.scrollHeight - window.innerHeight
      if (denominator <= 0) {
        setVisible(false)
        return
      }
      setVisible(window.scrollY / denominator > 0.15)
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
          className="fixed left-0 right-0 z-40 md:hidden bp-sticky-cta"
          style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2.5 backdrop-blur-xl bp-sticky-cta__inner"
            style={{
              backgroundColor: 'rgba(7, 17, 26, 0.95)',
              borderTop: '1px solid rgba(197, 243, 106, 0.2)',
              boxShadow: '0 -4px 20px rgba(7, 17, 26, 0.4)',
            }}
          >
            <a
              href={AFFILIATE.oneXbet}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'sticky-1xbet')}
              data-cta="sticky-register-1xbet"
              className="flex h-12 flex-1 items-center justify-center rounded-xl px-2 text-center text-[12px] font-bold leading-tight"
              style={{
                background: 'linear-gradient(135deg, #D5FF7D, #B9E759)',
                color: '#10150B',
                boxShadow: '0 8px 20px rgba(197, 243, 106, 0.22)',
              }}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-white p-0.5"><img src="/logos/1xbet-logo.png" alt="" width="24" height="24" className="h-6 w-6 object-contain" /></span>
                <span>1xBet</span>
              </span>
            </a>
            <a
              href={AFFILIATE.linebet}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'sticky-linebet')}
              data-cta="sticky-register-linebet"
              className="flex h-12 flex-1 items-center justify-center rounded-xl px-2 text-center text-[12px] font-bold leading-tight"
              style={{
                color: '#E8F1FF',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-white p-0.5"><img src="/logos/linebet-logo.jpg" alt="" width="24" height="24" className="h-6 w-6 object-contain" /></span>
                <span>Linebet</span>
              </span>
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
