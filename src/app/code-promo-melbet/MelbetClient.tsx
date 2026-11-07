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
        title="Code promo Melbet Bttswin : 300 % + cashback"
        badge="GUIDE MELBET"
        intro="Le code promo Melbet Bttswin fonctionne dans le monde entier. L’offre comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Recopiez Bttswin en respectant le B majuscule."
        offerHeadline="Melbet : bonus et cashback"
        offerSub="Bonus mondial de dépôt 300 % · cashback · bonus hebdomadaires."
        benefits={['Code exact : Bttswin', 'Bonus mondial de dépôt 300 %', 'Cashback', 'Bonus hebdomadaires']}
        steps={[
          { n: '01', title: 'Recopier le code Bttswin', desc: 'Le code fourni pour Melbet est Bttswin, avec un B initial majuscule.' },
          { n: '02', title: 'Consulter Melbet', desc: 'Vérifiez les modalités de l’offre directement auprès de l’opérateur.' },
        ]}
        faq={getPromoFaq('melbet', 'fr')}
        crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
      />
    </div>
  )
}
