'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import styles from '@/components/bttsbet/PromoBookmakerGlass.module.css'
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
    <div className={`${styles.glassPage} ${styles.oneXbet}`}>
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
        title="Code promo 1xBet vipbtts : bonus mondial 300 %"
        badge="CODE PROMO 1XBET"
        intro="Le code promo 1xBet vipbtts fonctionne dans le monde entier. L’offre comprend un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires. Consultez 1xBet pour les modalités en vigueur."
        offerHeadline="Bonus de dépôt 1xBet"
        offerSub="Bonus de dépôt mondial de 300 % · cashback · bonus hebdomadaires."
        benefits={['Code exact : vipbtts', 'Bonus de dépôt mondial de 300 %', 'Cashback', 'Bonus hebdomadaires']}
        steps={[
          { n: '01', title: 'Copier le code exact', desc: 'Recopiez vipbtts tel qu’il apparaît sur cette page.' },
          { n: '02', title: 'Consulter 1xBet', desc: 'Ouvrez le site de l’opérateur pour lire les modalités en vigueur.' },
        ]}
        faq={getPromoFaq('1xbet', 'fr')}
        crossLinks={ALL_LINKS.filter((link) => link.id !== SELF).map(({ label, href }) => ({ label, href }))}
      />
    </div>
  )
}
