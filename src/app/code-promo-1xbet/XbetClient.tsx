'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import { getPromoFaq } from '@/lib/promo-faq'

const CODE = 'vipbtts'
const BRAND = '1xBet'
const SELF = '1xbet' as const

const ALL_LINKS = [
  { id: '1xbet', label: 'Guide 1xBet', href: '/code-promo-1xbet' },
  { id: 'linebet', label: 'Guide Linebet', href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: 'Guide Melbet', href: '/code-promo-melbet' },
  { id: '888starz', label: 'Guide 888Starz', href: '/bonus-888starz' },
]

export default function XbetClient(_props: { reviewDate?: string } = {}) {
  return (
    <PromoLandingShell
      brand={BRAND}
      code={CODE}
      bookmakerId="1xbet"
      accent="#1B6EF3"
      logo="/logos/1xbet-logo.png"
      logoBg="#1a237e"
      signupUrl={AFFILIATE.oneXbet}
      downloadUrl={AFFILIATE.oneXbetDownload}
      lang="fr"
      title={`Meilleur code promo ${BRAND} · cashback et bonus hebdomadaires`}
      badge="OFFRE 1XBET"
      intro="Bonus 300 % worldwide, davantage de cashback et des bonus hebdomadaires. Code exact : vipbtts"
      offerHeadline="300 % worldwide"
      offerSub="300 % worldwide, avec davantage de cashback et des bonus hebdomadaires."
      benefits={['300 % worldwide', 'Plus de cashback et bonus hebdomadaires', 'Code exact : vipbtts', 'Lien 1xBet']}
      steps={[
        { n: '01', title: 'Ouvre 1xBet', desc: 'Utilise le lien affiché sur cette page.' },
        { n: '02', title: 'Code promo', desc: 'Code exact : vipbtts' },
      ]}
      faq={getPromoFaq('1xbet', 'fr')}
      crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
    />
  )
}
