'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import { getPromoFaq } from '@/lib/promo-faq'

const CODE = 'Bttswin'
const BRAND = 'Melbet'
const SELF = 'melbet' as const

const ALL_LINKS = [
  { id: '1xbet', label: 'Guide 1xBet', href: '/code-promo-1xbet' },
  { id: 'linebet', label: 'Guide Linebet', href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: 'Guide Melbet', href: '/code-promo-melbet' },
  { id: '888starz', label: 'Guide 888Starz', href: '/bonus-888starz' },
]

export default function MelbetClient(_props: { reviewDate?: string } = {}) {
  return (
    <PromoLandingShell
      brand={BRAND}
      code={CODE}
      bookmakerId="melbet"
      accent="#F59E0B"
      logo="/logos/melbet-logo.jpg"
      logoBg="#1b1b1b"
      signupUrl={AFFILIATE.melbet}
      downloadUrl={AFFILIATE.melbetDownload}
      lang="fr"
      title={`Meilleur code promo ${BRAND} · cashback et bonus hebdomadaires`}
      badge="OFFRE MELBET"
      intro="Bonus 300 % worldwide, davantage de cashback et des bonus hebdomadaires. Code exact : Bttswin"
      offerHeadline="300 % worldwide"
      offerSub="300 % worldwide, avec davantage de cashback et des bonus hebdomadaires."
      benefits={['300 % worldwide', 'Plus de cashback et bonus hebdomadaires', 'Code exact : Bttswin', 'Lien Melbet']}
      steps={[
        { n: '01', title: 'Ouvre Melbet', desc: 'Utilise le lien affiché sur cette page.' },
        { n: '02', title: 'Code promo', desc: 'Code exact : Bttswin' },
      ]}
      faq={getPromoFaq('melbet', 'fr')}
      crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
    />
  )
}
