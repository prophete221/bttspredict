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
        title="Code promo Linebet VISION221 : offre mondiale 300 %"
        badge="CODE PROMO LINEBET · VISION221"
        intro="Le code promo Linebet VISION221 fonctionne dans le monde entier. L’offre comprend un bonus de dépôt de 300 %, du cashback et des bonus hebdomadaires ; vérifiez auprès de Linebet les modalités applicables dans votre pays."
        offerHeadline="Offre Linebet dans le monde"
        offerSub="Code VISION221 · bonus de dépôt mondial de 300 % · cashback et bonus hebdomadaires."
        benefits={['Code Linebet : VISION221', 'Fonctionne dans le monde entier', 'Bonus de dépôt mondial de 300 %', 'Cashback et bonus hebdomadaires']}
        steps={[
          { n: '01', title: 'Copier VISION221', desc: 'Le code promo Linebet VISION221 fonctionne dans le monde entier.' },
          { n: '02', title: 'Consulter Linebet', desc: 'Vérifiez auprès de l’opérateur les modalités applicables dans votre pays.' },
        ]}
        faq={getPromoFaq('linebet', 'fr')}
        crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
      />
    </div>
  )
}
