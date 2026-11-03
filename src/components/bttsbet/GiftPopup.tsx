'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AFFILIATE, BOOKMAKERS } from '@/lib/constants'
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
    title: 'Partenaires BTTSPredict',
    subtitle: '1xBet en priorité · Linebet · MelBet · 888Starz',
    primary: 'Consulter 1xBet',
    terms: 'Offres, disponibilité et conditions à vérifier auprès de chaque opérateur avant toute inscription ou tout dépôt.',
    legal: '18+ · Les paris comportent un risque de perte. Aucun gain n’est garanti.',
    close: 'Fermer',
  },
  en: {
    title: 'BTTSPredict partners',
    subtitle: '1xBet first · Linebet · MelBet · 888Starz',
    primary: 'Visit 1xBet',
    terms: 'Check each operator’s current offers, country availability and terms before signing up or depositing.',
    legal: '18+ · Betting carries a risk of loss. No winnings are guaranteed.',
    close: 'Close',
  },
  ar: {
    title: 'شركاء BTTSPredict',
    subtitle: '1xBet أولاً · Linebet · MelBet · 888Starz',
    primary: 'زيارة 1xBet',
    terms: 'تحقق من العروض الحالية والتوفر في بلدك وشروط كل مشغّل قبل التسجيل أو الإيداع.',
    legal: '18+ · تنطوي المراهنات على مخاطر الخسارة. لا توجد أرباح مضمونة.',
    close: 'إغلاق',
  },
} as const

const PARTNERS = [
  {
    id: '1xbet' as const,
    name: '1xBet',
    code: BOOKMAKERS.find((bookmaker) => bookmaker.id === '1xbet')?.promoCode ?? '',
    href: AFFILIATE.oneXbet,
    primary: true,
    placement: 'gift-popup-1xbet',
  },
  {
    id: 'linebet' as const,
    name: 'Linebet',
    code: BOOKMAKERS.find((bookmaker) => bookmaker.id === 'linebet')?.promoCode ?? '',
    href: AFFILIATE.linebet,
    primary: false,
    placement: 'gift-popup-linebet',
  },
  {
    id: 'melbet' as const,
    name: 'MelBet',
    code: BOOKMAKERS.find((bookmaker) => bookmaker.id === 'melbet')?.promoCode ?? '',
    href: AFFILIATE.melbet,
    primary: false,
    placement: 'gift-popup-melbet',
  },
  {
    id: '888starz' as const,
    name: '888Starz',
    code: BOOKMAKERS.find((bookmaker) => bookmaker.id === '888starz')?.promoCode ?? '',
    href: AFFILIATE.star888,
    primary: false,
    placement: 'gift-popup-888starz',
  },
] as const

export default function GiftPopup() {
  const reduceMotion = useReducedMotion()
  const pathname = usePathname() ?? ''
  const lang = useMemo(() => detectLang(pathname), [pathname])
  const t = COPY[lang]
  const isPriorityPage = PRIORITY_PATH_RE.test(pathname)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
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
  }, [isPriorityPage])

  const dismiss = () => {
    setVisible(false)
    const dismissKey = isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY
    try {
      sessionStorage.setItem(dismissKey, '1')
    } catch {
      /* ignore */
    }
  }

  if (!visible) return null

  const [primaryPartner, ...secondaryPartners] = PARTNERS

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="hp-gift hp-gift--phase3"
          role="complementary"
          aria-label={t.title}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 360, damping: 30 }}
        >
          <div className="hp-gift-card hp-gift-card--phase3">
            <button type="button" className="hp-gift-close" onClick={dismiss} aria-label={t.close}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="hp-gift-phase3__heading">
              <span className="hp-gift-phase3__dot" aria-hidden="true" />
              <div>
                <p className="hp-gift-phase3__title">{t.title}</p>
                <p className="hp-gift-phase3__subtitle">{t.subtitle}</p>
              </div>
            </div>

            <a
              href={primaryPartner.href}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              onClick={() => trackAffiliateAction(primaryPartner.id, 'signup_cta_click', primaryPartner.placement)}
              className="hp-gift-phase3__primary"
              data-cta="gift-popup-1xbet"
            >
              <span>{t.primary}</span>
              <code dir="ltr">{primaryPartner.code}</code>
              <span aria-hidden="true">↗</span>
            </a>

            <div className="hp-gift-phase3__alternatives" aria-label={lang === 'fr' ? 'Autres partenaires' : lang === 'ar' ? 'شركاء آخرون' : 'Other partners'}>
              {secondaryPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.href}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  onClick={() => trackAffiliateAction(partner.id, 'signup_cta_click', partner.placement)}
                  data-cta={`gift-popup-${partner.id}`}
                >
                  <span>{partner.name}</span>
                  <code dir="ltr">{partner.code}</code>
                </a>
              ))}
            </div>

            <p className="hp-gift-phase3__terms">{t.terms}</p>
            <p className="hp-gift-legal hp-gift-phase3__legal">{t.legal}</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
