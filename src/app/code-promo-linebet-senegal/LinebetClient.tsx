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
      title="Code promo Linebet Sénégal VISION221 : offre mondiale à 300 %"
      badge="OFFRE LINEBET"
      intro="Retrouvez le code exact VISION221 et les détails de l’offre mondiale de 300 % de Linebet."
      offerHeadline="Offre mondiale à 300 %"
      offerSub="Plus de cashback et des bonus hebdomadaires."
      benefits={['Offre mondiale à 300 %', 'Plus de cashback et des bonus hebdomadaires', 'Code exact VISION221', 'Lien Linebet']}
      steps={[
        { n: '01', title: 'Consulter Linebet', desc: 'Ouvrez Linebet via le lien affiché sur cette page.' },
        { n: '02', title: 'Code promo', desc: 'Code exact : VISION221' },
      ]}
      faq={getPromoFaq('linebet', 'fr')}
      crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
    />
  )
}
