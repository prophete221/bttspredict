'use client'

/**
 * GiftPopup — paquet cadeau flottant (layout racine, toutes pages).
 * Refonte nov 2026 : i18n FR/EN/AR, double CTA Linebet + 1xBet prioritaires.
 * Comportement scroll / priorité / dismiss session inchangé.
 */

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

const GIFT_DISMISS_KEY = 'bttsbet_gift_popup_dismissed'
const GIFT_DISMISS_KEY_TODAY = 'bttsbet_gift_popup_dismissed_today'
const PRIORITY_PATH_RE = /^\/(?:en|ar)?\/?over-2-5\/predictions\/today\/?$/

function detectLang(pathname: string): 'fr' | 'en' | 'ar' {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  if (pathname === '/ar' || pathname.startsWith('/ar/')) return 'ar'
  return 'fr'
}

const COPY = {
  fr: {
    title: '🎁 TON BONUS DE BIENVENUE',
    offer: '300 % de bonus + 100 free spins*',
    sub: "Inscris-toi avec notre lien partenaire, puis saisis le code affiché lors de ton inscription. Vérifie les conditions de l'offre avant tout dépôt.",
    linebetCta: 'LINEBET — CODE VISION221',
    xbetCta: '1XBET — CODE vipbtts',
    legal: "18+ · Offre soumise aux conditions de l'opérateur.",
    close: 'Fermer',
  },
  en: {
    title: '🎁 YOUR WELCOME BONUS',
    offer: '300% bonus + 100 free spins*',
    sub: 'Sign up via our partner link, then enter the code shown during registration. Check the offer terms before any deposit.',
    linebetCta: 'LINEBET — CODE VISION221',
    xbetCta: '1XBET — CODE vipbtts',
    legal: '18+ · Offer subject to operator terms.',
    close: 'Close',
  },
  ar: {
    title: '🎁 مكافأة الترحيب',
    offer: 'بونص 300% + 100 لفة مجانية*',
    sub: 'سجّل عبر رابط الشريك ثم أدخل الرمز الظاهر عند التسجيل. تحقق من شروط العرض قبل أي إيداع.',
    linebetCta: 'LINEBET — CODE VISION221',
    xbetCta: '1XBET — CODE vipbtts',
    legal: '18+ · العرض يخضع لشروط المشغّل.',
    close: 'إغلاق',
  },
} as const

export default function GiftPopup() {
  const reduceMotion = useReducedMotion()
  const pathname = usePathname() ?? ''
  const lang = useMemo(() => detectLang(pathname), [pathname])
  const t = COPY[lang]
  const isPriorityPage = PRIORITY_PATH_RE.test(pathname)
  const [dismissed, setDismissed] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissKey = isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY
    try {
      if (sessionStorage.getItem(dismissKey) === '1') return
    } catch {
      /* ignore */
    }

    const reveal = () => {
      setDismissed(false)
      setVisible(true)
    }

    if (isPriorityPage) {
      const timer = setTimeout(reveal, 900)
      return () => clearTimeout(timer)
    }

    let armed = false
    const revealOnce = () => {
      if (armed) return
      armed = true
      reveal()
      window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      const denom = document.documentElement.scrollHeight - window.innerHeight
      if (denom <= 0) return
      if (window.scrollY / denom >= 0.3) revealOnce()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const safety = setTimeout(revealOnce, 7000)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(safety)
    }
  }, [isPriorityPage])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    const dismissKey = isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY
    try {
      sessionStorage.setItem(dismissKey, '1')
    } catch {
      /* ignore */
    }
  }

  if (dismissed && !visible) return null

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.aside
          className="hp-gift"
          role="complementary"
          aria-label={t.title}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 28 }}
        >
          <div className="hp-gift-card hp-gift-card--refonte">
            <button type="button" className="hp-gift-close" onClick={dismiss} aria-label={t.close}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="hp-gift-icon-wrap" aria-hidden="true">
              <motion.span
                className="hp-gift-emoji"
                animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎁
              </motion.span>
              <span className="hp-gift-halo" />
            </div>

            <div className="hp-gift-body">
              <p className="hp-gift-title">{t.title}</p>
              <p className="hp-gift-bonus">
                <span>{t.offer}</span>
              </p>
              <p className="hp-gift-sub">{t.sub}</p>

              <div className="hp-gift-actions">
                <a
                  href={AFFILIATE.linebet}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  onClick={() => trackAffiliateAction('linebet', 'signup_cta_click', 'gift-popup-300')}
                  className="hp-gift-btn hp-gift-btn--linebet"
                  data-cta="gift-popup-300"
                >
                  {t.linebetCta}
                  <span aria-hidden="true">→</span>
                </a>
                <a
                  href={AFFILIATE.oneXbet}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'gift-popup-1xbet')}
                  className="hp-gift-btn hp-gift-btn--xbet"
                  data-cta="gift-popup-1xbet"
                >
                  {t.xbetCta}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
              <p className="hp-gift-legal">{t.legal}</p>
            </div>

            <span className="hp-gift-spark hp-gift-spark--1" aria-hidden="true" />
            <span className="hp-gift-spark hp-gift-spark--2" aria-hidden="true" />
            <span className="hp-gift-spark hp-gift-spark--3" aria-hidden="true" />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
