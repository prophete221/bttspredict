'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

const GIFT_DISMISS_KEY = 'bttsbet_gift_popup_dismissed'
const GIFT_DISMISS_KEY_TODAY = 'bttsbet_gift_popup_dismissed_today'
const PRIORITY_PATH_RE = /^\/(?:en|ar)?\/?over-2-5\/predictions\/today\/?$/
const VIP_PATH_RE = /^\/(?:en|ar)?\/vip\/?$/
const PROMO_PATH_RE = /^\/(?:en\/|ar\/)?(?:code-promo-[^/]+|bonus-888starz(?:-btts221)?)\/?$/

function detectLang(pathname: string): 'fr' | 'en' | 'ar' {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  if (pathname === '/ar' || pathname.startsWith('/ar/')) return 'ar'
  return 'fr'
}

const COPY = {
  fr: {
    ad: 'Publicité · Lien partenaire',
    label: 'Offre partenaire 1xBet',
    bonus: 'Bonus 300 % worldwide',
    cta: 'Découvrir 1xBet',
    legal: '18+ · Les paris comportent un risque de perte.',
    close: 'Fermer',
    logoAlt: 'Logo officiel 1xBet',
  },
  en: {
    ad: 'Advertisement · Partner link',
    label: '1xBet partner offer',
    bonus: '300% bonus worldwide',
    cta: 'Discover 1xBet',
    legal: '18+ · Betting involves a risk of loss.',
    close: 'Close',
    logoAlt: 'Official 1xBet logo',
  },
  ar: {
    ad: 'إعلان · رابط الشريك',
    label: 'عرض الشريك 1xBet',
    bonus: 'مكافأة 300٪ حول العالم',
    cta: 'اكتشف 1xBet',
    legal: '18+ · تنطوي المراهنات على خطر الخسارة.',
    close: 'إغلاق',
    logoAlt: 'شعار 1xBet الرسمي',
  },
} as const

export default function GiftPopup() {
  const reduceMotion = useReducedMotion()
  const pathname = usePathname() ?? ''
  const lang = useMemo(() => detectLang(pathname), [pathname])
  const t = COPY[lang]
  const isPriorityPage = PRIORITY_PATH_RE.test(pathname)
  const isVipPage = VIP_PATH_RE.test(pathname)
  const isPromoPage = PROMO_PATH_RE.test(pathname)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isVipPage || isPromoPage) return
    const dismissKey = isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY
    try {
      if (sessionStorage.getItem(dismissKey) === '1') return
    } catch {
      /* ignore */
    }

    let revealed = false
    const revealAfterIntent = () => {
      if (revealed) return
      const denominator = document.documentElement.scrollHeight - window.innerHeight
      if (denominator <= 0 || window.scrollY / denominator < 0.3) return
      revealed = true
      setVisible(true)
      window.removeEventListener('scroll', revealAfterIntent)
    }

    window.addEventListener('scroll', revealAfterIntent, { passive: true })
    revealAfterIntent()
    return () => window.removeEventListener('scroll', revealAfterIntent)
  }, [isPriorityPage, isVipPage, isPromoPage])

  const dismiss = () => {
    setVisible(false)
    const dismissKey = isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY
    try {
      sessionStorage.setItem(dismissKey, '1')
    } catch {
      /* ignore */
    }
  }

  if (isVipPage || isPromoPage || !visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="hp-gift hp-gift--1xbet"
          role="complementary"
          aria-label={t.label}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={reduceMotion ? { duration: 0.12 } : { type: 'spring', stiffness: 360, damping: 30 }}
        >
          <div className="hp-gift-card hp-gift-card--1xbet">
            <button type="button" className="hp-gift-close" onClick={dismiss} aria-label={t.close}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="hp-gift-1xbet__brand">
              <img src="/logos/1xbet-logo.png" alt={t.logoAlt} width="78" height="44" loading="lazy" />
              <div className="hp-gift-1xbet__copy">
                <p className="hp-gift-1xbet__ad">{t.ad}</p>
                <p className="hp-gift-1xbet__label">{t.label}</p>
                <p className="hp-gift-1xbet__bonus">{t.bonus}</p>
              </div>
            </div>

            <a
              href={AFFILIATE.oneXbet}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'gift-popup-1xbet')}
              className="hp-gift-1xbet__cta"
              data-cta="gift-popup-1xbet"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded bg-white p-0.5">
                  <img src="/logos/1xbet-logo.png" alt="" width="24" height="24" className="h-6 w-6 object-contain" />
                </span>
                <span>{t.cta}</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>

            <p className="hp-gift-1xbet__legal">{t.legal}</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
