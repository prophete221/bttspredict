'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import { getPromoFaq } from '@/lib/promo-faq'

const CODE = 'VISION221'
const BRAND = 'Linebet'
const SELF = 'linebet' as const

const ALL_LINKS = [
  { id: '1xbet', label: 'Guide 1xBet', href: '/code-promo-1xbet' },
  { id: 'linebet', label: 'Guide Linebet', href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: 'Guide Melbet', href: '/code-promo-melbet' },
  { id: '888starz', label: 'Guide 888Starz', href: '/bonus-888starz' },
]

export default function LinebetClient(_props: { reviewDate?: string } = {}) {
  return (
    <PromoLandingShell
      brand={BRAND}
      code={CODE}
      bookmakerId="linebet"
      accent="#2F7DFF"
      logo="/logos/linebet-logo.jpg"
      logoBg="#0d1b2a"
      signupUrl={AFFILIATE.linebet}
      downloadUrl={AFFILIATE.linebetDownload}
      lang="fr"
      title={`Meilleur code promo ${BRAND} · cashback et bonus hebdomadaires`}
      badge="OFFRE LINEBET"
      intro="Bonus 300 % worldwide, davantage de cashback et des bonus hebdomadaires. Code exact : VISION221"
      offerHeadline="300 % worldwide"
      offerSub="300 % worldwide, avec davantage de cashback et des bonus hebdomadaires."
      benefits={['300 % worldwide', 'Plus de cashback et bonus hebdomadaires', 'Code exact : VISION221', 'Lien Linebet']}
      steps={[
        { n: '01', title: 'Ouvre Linebet', desc: 'Utilise le lien affiché sur cette page.' },
        { n: '02', title: 'Code promo', desc: 'Code exact : VISION221' },
      ]}
      faq={getPromoFaq('linebet', 'fr')}
      crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
    />
  )
}
