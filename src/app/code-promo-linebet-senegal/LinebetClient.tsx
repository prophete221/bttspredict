'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import styles from '@/components/bttsbet/PromoBookmakerGlass.module.css'
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
    <div className={`${styles.glassPage} ${styles.linebet}`}>
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
        title="Code promo Linebet VISION221 : bonus de dépôt 300 %"
        badge="CODE PROMO LINEBET · VISION221"
        intro="Saisissez VISION221 lors de votre inscription chez Linebet. L’offre comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires. Vérifiez les conditions et la disponibilité auprès de Linebet."
        offerHeadline="Offre Linebet"
        offerSub="Bonus de dépôt 300 % · cashback · bonus hebdomadaires."
        benefits={['Code promo : VISION221', 'Bonus de dépôt annoncé : 300 %', 'Cashback et bonus hebdomadaires']}
        steps={[
          { n: '01', title: 'Garder le code à portée de main', desc: 'Copiez le code avant de créer votre compte.' },
          { n: '02', title: 'Lire les détails de l’offre', desc: 'Consultez les conditions et les critères d’éligibilité affichés par Linebet.' },
          { n: '03', title: 'Choisir votre parcours', desc: 'Choisissez le site ou l’application officielle selon votre appareil.' },
        ]}
        faq={getPromoFaq('linebet', 'fr')}
        crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
      />
    </div>
  )
}
