'use client'

import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import type { Locale } from '@/lib/i18n'

const COPY: Record<Locale, {
  eyebrow: string
  title: string
  cardLabel: string
  locked: string
  fixturePlaceholder: string
  detailsLocked: string
  activationNote: string
  viewPlans: string
  requestNote: string
}> = {
  fr: {
    eyebrow: 'Aperçu VIP verrouillé',
    title: 'Les pronostics VIP restent verrouillés',
    cardLabel: 'Carte de pronostic VIP verrouillée',
    locked: 'Verrouillé',
    fixturePlaceholder: 'Rencontre masquée',
    detailsLocked: 'Sélection réservée aux membres VIP',
    activationNote: 'L’accès sera activé côté serveur après connexion et vérification de la formule.',
    viewPlans: 'Voir les formules',
    requestNote: 'Les inscriptions ne sont pas encore ouvertes.',
  },
  en: {
    eyebrow: 'Locked VIP preview',
    title: 'VIP predictions remain locked',
    cardLabel: 'Locked VIP prediction card',
    locked: 'Locked',
    fixturePlaceholder: 'Fixture hidden',
    detailsLocked: 'Selection reserved for VIP members',
    activationNote: 'Access will be enabled server-side after sign-in and plan verification.',
    viewPlans: 'View plans',
    requestNote: 'Registration is not open yet.',
  },
  ar: {
    eyebrow: 'معاينة VIP مقفلة',
    title: 'توقعات VIP تبقى مقفلة',
    cardLabel: 'بطاقة توقع VIP مقفلة',
    locked: 'مقفل',
    fixturePlaceholder: 'مباراة مخفية',
    detailsLocked: 'الاختيار مخصص لأعضاء VIP',
    activationNote: 'سيتم تفعيل الوصول على الخادم بعد تسجيل الدخول والتحقق من الخطة.',
    viewPlans: 'عرض الخطط',
    requestNote: 'التسجيل غير متاح بعد.',
  },
}

const PREVIEW_CARD_IDS = [1, 2, 3] as const

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export default function VipLockedPicks({ onViewPlans }: { onViewPlans: () => void }) {
  const { lang } = useLanguage()
  const text = COPY[lang]

  return (
    <section
      className="vipx-preview vipx-shell"
      id="pronostics-vip-verrouilles"
      data-testid="vip-locked-prediction-cards"
      aria-labelledby="vip-locked-prediction-title"
    >
      <header className="vipx-section-head">
        <span className="vipx-eyebrow"><i aria-hidden="true" />{text.eyebrow}</span>
        <h2 id="vip-locked-prediction-title">{text.title}</h2>
      </header>

      <ul className="vipx-locked-preview-grid">
        {PREVIEW_CARD_IDS.map((id) => (
          <li key={id}>
            <article className="vipx-locked-preview-card" aria-label={text.cardLabel}>
              <div className="vipx-locked-preview-card__top">
                <span className="vipx-locked-preview-card__badge">VIP</span>
                <span className="vipx-locked-preview-card__lock"><LockIcon />{text.locked}</span>
              </div>
              <div className="vipx-locked-preview-card__fixture" aria-hidden="true">
                <span className="vipx-locked-preview-card__skeleton" />
                <b>VS</b>
                <span className="vipx-locked-preview-card__skeleton vipx-locked-preview-card__skeleton--short" />
              </div>
              <div className="vipx-locked-preview-card__details">
                <strong>{text.fixturePlaceholder}</strong>
                <span>{text.detailsLocked}</span>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="vipx-locked-preview-footer">
        <p>{text.activationNote}</p>
        <button type="button" className="vipx-btn vipx-btn--gold" onClick={onViewPlans} data-cta="vip-locked-preview-view-plans">
          {text.viewPlans}<span aria-hidden="true">→</span>
        </button>
        <small>{text.requestNote}</small>
      </div>
    </section>
  )
}
