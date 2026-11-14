'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import styles from '@/components/bttsbet/PromoBookmakerGlass.module.css'
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
    <div className={`${styles.glassPage} ${styles.melbet}`}>
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
        title="Code promo Melbet Bttswin : bonus de dépôt 300 %"
        badge="GUIDE MELBET"
        intro="Le code Melbet est Bttswin (B majuscule). L’offre comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions auprès de Melbet."
        offerHeadline="Offre Melbet"
        offerSub="Bonus de dépôt 300 % · cashback · bonus hebdomadaires."
        benefits={['Code promo : Bttswin', 'Bonus de dépôt annoncé : 300 %', 'Cashback et bonus hebdomadaires']}
        steps={[
          { n: '01', title: 'Repérer le code exact', desc: 'Copiez Bttswin en respectant le B majuscule.' },
          { n: '02', title: 'Vérifier les modalités', desc: 'Vérifiez les conditions de l’offre et votre éligibilité auprès de Melbet.' },
        ]}
        faq={getPromoFaq('melbet', 'fr')}
        crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
      />
    </div>
  )
}
