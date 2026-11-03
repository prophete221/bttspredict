'use client'

/**
 * BookmakersStrip — bloc « Tous les codes promo » réutilisable
 * (accueil, bas de page promo, VIP). Ordre officiel : Linebet, 1xBet,
 * puis Melbet et 888Starz (registre bookmakers.ts).
 *
 * - Logo RÉEL de chaque bookmaker sur pastille claire.
 * - Code + offre annoncée + lien vers la page code promo localisée.
 * - Pas de CTA externe ici : la conversion se fait sur les pages dédiées
 *   (une seule intention par bloc).
 */

import { localizedPath, type Locale } from '@/lib/i18n'
import { BOOKMAKER_ORDER, getBookmaker, offerShort } from '@/lib/bookmakers'
import { useLanguage } from '../bttsbet/LanguageSwitcher'

const COPY = {
  fr: {
    title: 'Codes promo partenaires',
    sub: 'Un code par bookmaker, vérifié manuellement. Nos partenaires prioritaires : Linebet et 1xBet.',
    priority: 'Prioritaire',
    pronos: 'Pronostics du jour',
    vip: 'Accès VIP',
  },
  en: {
    title: 'Partner promo codes',
    sub: 'One code per bookmaker, verified manually. Our priority partners: Linebet and 1xBet.',
    priority: 'Priority',
    pronos: 'Today’s predictions',
    vip: 'VIP access',
  },
  ar: {
    title: 'الرموز الترويجية للشركاء',
    sub: 'رمز واحد لكل مساعد، موثق يدوياً. شريكنا ذو الأولوية: Linebet و1xBet.',
    priority: 'أولوية',
    pronos: 'توقعات اليوم',
    vip: 'الدخول VIP',
  },
} as const

export default function BookmakersStrip({ initialLocale }: { initialLocale?: Locale } = {}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = COPY[lang]

  return (
    <section
      className="bms-strip"
      aria-labelledby="bms-strip-title"
      style={{ scrollMarginTop: '96px' }}
    >
      <div className="mx-auto w-full max-w-[860px] px-4 sm:px-6">
        <h2 id="bms-strip-title" className="bms-strip__title">{t.title}</h2>
        <p className="bms-strip__sub">{t.sub}</p>

        <div className="bms-strip__grid">
          {BOOKMAKER_ORDER.map(id => {
            const b = getBookmaker(id)
            return (
              <a
                key={id}
                href={localizedPath(b.promoPath, lang)}
                className="bms-card"
                data-cta={`bms-open-${b.id}`}
              >
                {b.featured && <span className="bms-card__star">{t.priority}</span>}
                <span className="bms-card__logo-wrap">
                  <img src={b.logo} alt="" width={96} height={30} loading="lazy" decoding="async" className="bms-card__logo" />
                </span>
                <span className="bms-card__code">{b.promoCode}</span>
                <span className="bms-card__offer">{offerShort(b)}</span>
                <span className="bms-card__cta">{lang === 'en' ? 'View the code' : lang === 'ar' ? 'عرض الرمز' : 'Voir le code'} →</span>
              </a>
            )
          })}
        </div>

        {/* Liens internes produit — une ligne, discret */}
        <div className="bms-strip__links">
          <a href={localizedPath('/btts/predictions/today', lang)} data-cta="bms-pronostics">{t.pronos} →</a>
          <span aria-hidden="true">·</span>
          <a href={localizedPath('/vip', lang)} data-cta="bms-vip">{t.vip} →</a>
        </div>
      </div>
    </section>
  )
}
