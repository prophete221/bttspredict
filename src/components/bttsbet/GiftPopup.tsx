'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AFFILIATE } from '@/lib/constants'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

const GIFT_DISMISS_KEY = 'bttsbet_gift_popup_dismissed'
const GIFT_DISMISS_KEY_TODAY = 'bttsbet_gift_popup_dismissed_today'
const PRIORITY_PATH_RE = /^\/(?:en|ar)?\/?over-2-5\/predictions\/today\/?$/

type GiftLocale = 'fr' | 'en' | 'ar'

function detectLang(pathname: string): GiftLocale {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  if (pathname === '/ar' || pathname.startsWith('/ar/')) return 'ar'
  return 'fr'
}

const COPY: Record<GiftLocale, {
  kicker: string
  title: string
  offer: string
  spins: string
  sub: string
  linebetCta: string
  xbetCta: string
  register: string
  legal: string
  close: string
}> = {
  fr: {
    kicker: 'OFFRE PARTENAIRE',
    title: 'Un cadeau de bienvenue',
    offer: '300 % de bonus',
    spins: '+ 100 free spins*',
    sub: 'Choisissez un partenaire, puis saisissez son code pendant l’inscription. Consultez les conditions avant tout dépôt.',
    linebetCta: 'S’inscrire',
    xbetCta: 'S’inscrire',
    register: 'Ouvrir l’offre',
    legal: '*Selon l’offre et les conditions affichées par l’opérateur. 18+ · Lien d’affiliation.',
    close: 'Fermer le popup cadeau',
  },
  en: {
    kicker: 'PARTNER OFFER',
    title: 'A welcome gift',
    offer: '300% bonus',
    spins: '+ 100 free spins*',
    sub: 'Choose a partner, then enter its code during sign-up. Check the terms before making a deposit.',
    linebetCta: 'Sign up',
    xbetCta: 'Sign up',
    register: 'View offer',
    legal: '*Subject to the offer and terms shown by the operator. 18+ · Affiliate link.',
    close: 'Close gift popup',
  },
  ar: {
    kicker: 'عرض الشريك',
    title: 'هدية ترحيبية',
    offer: 'مكافأة 300%',
    spins: '+ 100 لفة مجانية*',
    sub: 'اختر شريكاً ثم أدخل رمزه أثناء التسجيل. راجع الشروط قبل إجراء أي إيداع.',
    linebetCta: 'التسجيل',
    xbetCta: 'التسجيل',
    register: 'عرض التفاصيل',
    legal: '*وفق العرض والشروط الظاهرة لدى المشغّل. 18+ · رابط تسويقي.',
    close: 'إغلاق نافذة الهدية',
  },
}

function GiftArtwork() {
  return (
    <svg className="hp-gift-artwork" viewBox="0 0 136 116" fill="none" role="img" aria-label="" focusable="false">
      <defs>
        <linearGradient id="giftBox" x1="22" y1="49" x2="103" y2="111" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4287FF" />
          <stop offset="1" stopColor="#1747A2" />
        </linearGradient>
        <linearGradient id="giftLid" x1="20" y1="35" x2="113" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#68ACFF" />
          <stop offset="1" stopColor="#2D70E8" />
        </linearGradient>
        <linearGradient id="giftRibbon" x1="57" y1="42" x2="75" y2="109" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5D98C" />
          <stop offset="1" stopColor="#C99A42" />
        </linearGradient>
        <linearGradient id="giftBow" x1="45" y1="8" x2="93" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE9AE" />
          <stop offset="1" stopColor="#D5A74F" />
        </linearGradient>
        <filter id="giftShadow" x="5" y="4" width="126" height="112" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <ellipse cx="68" cy="102" rx="48" ry="8" fill="#4C89FF" fillOpacity=".18" filter="url(#giftShadow)" />
      <path d="M59 34c-9-2-22-9-20-17 1-6 9-6 15-2 5 3 10 10 14 18-1-12 2-24 9-27 6-2 11 2 9 8-2 8-12 16-22 21" stroke="url(#giftBow)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 42h94v14H21z" fill="url(#giftLid)" stroke="#A7CAFF" strokeOpacity=".55" />
      <path d="M28 56h80v49H28z" fill="url(#giftBox)" stroke="#8FB9FF" strokeOpacity=".52" />
      <path d="M59 42h18v63H59z" fill="url(#giftRibbon)" />
      <path d="M21 42h94v6H21z" fill="#B8D5FF" fillOpacity=".25" />
      <path d="M28 56h80" stroke="#A7CAFF" strokeOpacity=".38" />
      <path d="M36 67v28" stroke="#A7CAFF" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
      <path d="M68 59v39" stroke="#FFF0C9" strokeOpacity=".38" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 35c-8-4-13-9-12-14 1-4 6-4 10-1 4 3 8 9 10 15m23-1c7-4 12-9 11-14-1-4-6-4-10-1-4 3-8 9-10 15" fill="url(#giftBow)" stroke="#FFF0C9" strokeOpacity=".75" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="16" cy="51" r="2" fill="#E8C268" />
      <circle cx="121" cy="30" r="2" fill="#73B8FF" />
      <path d="M118 76v6m-3-3h6M15 20v5m-2.5-2.5h5" stroke="#A9C8F3" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

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
      /* ignore unavailable storage */
    }

    const reveal = () => {
      setDismissed(false)
      setVisible(true)
    }

    if (isPriorityPage) {
      const timer = window.setTimeout(reveal, 900)
      return () => window.clearTimeout(timer)
    }

    let armed = false
    const revealOnce = () => {
      if (armed) return
      armed = true
      reveal()
      window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      const denominator = document.documentElement.scrollHeight - window.innerHeight
      if (denominator <= 0) return
      if (window.scrollY / denominator >= 0.3) revealOnce()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const safety = window.setTimeout(revealOnce, 7000)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(safety)
    }
  }, [isPriorityPage])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    const dismissKey = isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY
    try {
      sessionStorage.setItem(dismissKey, '1')
    } catch {
      /* ignore unavailable storage */
    }
  }

  if (dismissed && !visible) return null

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.aside
          className="hp-gift hp-gift--premium"
          role="complementary"
          aria-label={t.title}
          lang={lang}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          transition={reduceMotion ? { duration: 0.12 } : { type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="hp-gift-card hp-gift-card--refonte">
            <header className="hp-gift-head">
              <p className="hp-gift-kicker"><span aria-hidden="true" />{t.kicker}</p>
              <button type="button" className="hp-gift-close" onClick={dismiss} aria-label={t.close}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="m18 6-12 12M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="hp-gift-offer">
              <div className="hp-gift-art-wrap" aria-hidden="true"><GiftArtwork /></div>
              <div className="hp-gift-offer-copy">
                <h2 className="hp-gift-title">{t.title}</h2>
                <p className="hp-gift-bonus"><strong>{t.offer}</strong><span>{t.spins}</span></p>
              </div>
            </div>

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
                <span className="hp-gift-btn-brand">LINEBET</span>
                <code className="hp-gift-btn-code">VISION221</code>
                <span className="hp-gift-btn-cta">{t.linebetCta}</span>
                <span className="hp-gift-btn-arrow" aria-hidden="true">{lang === 'ar' ? '←' : '→'}</span>
              </a>
              <a
                href={AFFILIATE.oneXbet}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => trackAffiliateAction('1xbet', 'signup_cta_click', 'gift-popup-1xbet')}
                className="hp-gift-btn hp-gift-btn--xbet"
                data-cta="gift-popup-1xbet"
              >
                <span className="hp-gift-btn-brand">1XBET</span>
                <code className="hp-gift-btn-code">vipbtts</code>
                <span className="hp-gift-btn-cta">{t.xbetCta}</span>
                <span className="hp-gift-btn-arrow" aria-hidden="true">{lang === 'ar' ? '←' : '→'}</span>
              </a>
            </div>

            <p className="hp-gift-legal">{t.legal}</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
