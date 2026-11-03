'use client'

/**
 * GiftPopup — offre de bienvenue discrète et professionnelle (refonte 2026-11).
 *
 * Design :
 *  - carte compacte ancrée en bas (mobile) / en bas à droite (desktop) ;
 *  - DEUX codes correctement associés : Linebet → VISION221, 1xBet → Vipbtts ;
 *  - une seule intention par ligne (copier le code), le CTA principal ouvre
 *    la page code promo du bookmaker (pas de redirection brutale) ;
 *  - fermeture évidente (croix ≥ 44 px cible) + clic sur l'arrière-plan ;
 *  - entrée douce en CSS pur — plus de framer-motion ni d'étincelles ;
 *  - prefers-reduced-motion respecté ; SSR : rend null (zéro SEO/CLS impact).
 *
 * Comportement (inchangé) :
 *  - page prioritaire /over-2-5/predictions/today : affichage immédiat (900 ms),
 *    clé de fermeture dédiée ;
 *  - autres pages : après ~30 % de scroll ou filet de sécurité 7 s ;
 *  - fermeture mémorisée en sessionStorage (par contexte) ;
 *  - tracking affiliation consent-gated : signup_cta_click / gift-popup-*.
 */

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getBookmaker } from '@/lib/bookmakers'
import { localizedPath, type Locale } from '@/lib/i18n'
import { trackAffiliateAction } from '@/lib/affiliateTracking'
import { useLanguage } from './LanguageSwitcher'

const GIFT_DISMISS_KEY = 'bttsbet_gift_popup_dismissed'
const GIFT_DISMISS_KEY_TODAY = 'bttsbet_gift_popup_dismissed_today'

/** Pages prioritaires : /over-2-5/predictions/today (+ variantes /en et /ar). */
const PRIORITY_PATH_RE = /^\/(?:en|ar)?\/?over-2-5\/predictions\/today\/?$/

/** Bookmakers mis en avant dans le cadeau — Linebet d'abord, puis 1xBet. */
const GIFT_BOOKMAKERS = ['linebet', '1xbet'] as const

const COPY = {
  fr: {
    title: 'Bonus de bienvenue',
    sub: 'Codes vérifiés — valables à l’inscription',
    view: 'Voir le code',
    close: 'Fermer l’offre',
  },
  en: {
    title: 'Welcome bonus',
    sub: 'Verified codes — valid at sign-up',
    view: 'View the code',
    close: 'Close the offer',
  },
  ar: {
    title: 'مكافأة الترحيب',
    sub: 'رموز موثقة — صالحة عند التسجيل',
    view: 'عرض الرمز',
    close: 'إغلاق العرض',
  },
} as const

export default function GiftPopup() {
  const pathname = usePathname() ?? ''
  const isPriorityPage = PRIORITY_PATH_RE.test(pathname)
  const { lang } = useLanguage()
  const t = COPY[lang]

  // SSR-safe : caché par défaut, révélé uniquement côté client si non fermé.
  const [dismissed, setDismissed] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissKey = isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY
    try {
      if (sessionStorage.getItem(dismissKey) === '1') return
    } catch {
      /* sessionStorage indisponible — on affiche normalement */
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
      window.removeEventListener('resize', onScroll)
    }
    const onScroll = () => {
      const denom = document.documentElement.scrollHeight - window.innerHeight
      if (denom <= 0 || window.scrollY / denom >= 0.3) revealOnce()
    }
    const arm = requestAnimationFrame(() => {
      setDismissed(false)
      onScroll()
    })
    const fallback = setTimeout(revealOnce, 7000)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(arm)
      clearTimeout(fallback)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isPriorityPage])

  const close = () => {
    setVisible(false)
    try {
      sessionStorage.setItem(isPriorityPage ? GIFT_DISMISS_KEY_TODAY : GIFT_DISMISS_KEY, '1')
    } catch {
      /* no-op */
    }
  }

  if (dismissed) return null

  return (
    <aside
      className={`giftv2${visible ? ' is-visible' : ''}`}
      role="complementary"
      aria-label={t.title}
      style={{ '--gift-delay': isPriorityPage ? '0ms' : '120ms' } as React.CSSProperties}
    >
      <div className="giftv2__card">
        <button onClick={close} className="giftv2__close" aria-label={t.close} data-cta="gift-popup-close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <header className="giftv2__head">
          <p className="giftv2__title">{t.title}</p>
          <p className="giftv2__sub">{t.sub}</p>
        </header>

        <div className="giftv2__rows">
          {GIFT_BOOKMAKERS.map(id => {
            const b = getBookmaker(id)
            return (
              <a
                key={id}
                href={localizedPath(b.promoPath, lang as Locale)}
                className="giftv2__row"
                data-cta={`gift-popup-open-${b.id}`}
                onClick={() => trackAffiliateAction(b.id, 'signup_cta_click', 'gift-popup-open')}
              >
                <span className="giftv2__logo-wrap">
                  <img src={b.logo} alt="" width={72} height={24} loading="lazy" decoding="async" className="giftv2__logo" />
                </span>
                <span className="giftv2__row-body">
                  <span className="giftv2__brand">{b.name}</span>
                  <span className="giftv2__offer">
                    {b.offer.bonus ? `${b.offer.bonus} + ${b.offer.freeSpins} FS` : b.offer.wagering}
                  </span>
                </span>
                <span className="giftv2__code">{b.promoCode}</span>
                <span className="giftv2__go" aria-hidden="true">→</span>
              </a>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
