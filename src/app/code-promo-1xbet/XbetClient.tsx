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
        title="Code promo 1xBet vipbtts : bonus de dépôt 300 %"
        badge="CODE PROMO 1XBET"
        intro="Saisissez vipbtts dans le champ code promo de 1xBet. L’offre annoncée comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions et votre éligibilité auprès de l’opérateur."
        offerHeadline="Offre 1xBet"
        offerSub="Bonus de dépôt 300 % · cashback · bonus hebdomadaires."
        benefits={['Code promo : vipbtts', 'Bonus de dépôt annoncé : 300 %', 'Cashback et bonus hebdomadaires']}
        steps={[
          { n: '01', title: 'Copier le code exact', desc: 'Copiez vipbtts avant de créer votre compte.' },
          { n: '02', title: 'Vérifier la fiche de l’offre', desc: 'Vérifiez les conditions de l’offre et les critères d’éligibilité affichés par 1xBet.' },
          { n: '03', title: 'Choisir site ou APK', desc: 'Choisissez le site ou l’application officielle selon votre appareil.' },
        ]}
        faq={getPromoFaq('1xbet', 'fr')}
        crossLinks={ALL_LINKS.filter((link) => link.id !== SELF).map(({ label, href }) => ({ label, href }))}
      />
    </div>
  )
}
