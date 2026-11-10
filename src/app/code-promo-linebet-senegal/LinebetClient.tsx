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
        intro="Le code promo Linebet VISION221 est international, pour les pays où Linebet l’accepte. L’offre comprend un bonus de dépôt mondial de 300 %, du cashback et des bonus hebdomadaires. Ce guide s’adresse aux joueurs d’Afrique, d’Europe et d’autres régions. Vérifiez la disponibilité, l’éligibilité et les modalités auprès de Linebet pour votre pays."
        offerHeadline="Repères sur l’offre Linebet"
        offerSub="Bonus de dépôt mondial de 300 % · cashback · bonus hebdomadaires."
        benefits={['Code exact : VISION221', 'Site et APK : deux parcours distincts', 'Modalités locales à vérifier avant dépôt']}
        steps={[
          { n: '01', title: 'Garder le code à portée de main', desc: 'Copiez VISION221 et distinguez-le du lien d’accès au site ou au téléchargement APK.' },
          { n: '02', title: 'Lire les détails de l’offre', desc: 'Sur Linebet, vérifiez les conditions, l’éligibilité et la façon d’utiliser le code avant toute action.' },
          { n: '03', title: 'Choisir votre parcours', desc: 'Utilisez le lien du site ou celui de l’APK selon votre besoin, puis suivez les indications affichées par Linebet.' },
        ]}
        faq={getPromoFaq('linebet', 'fr')}
        crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
      />
    </div>
  )
}
