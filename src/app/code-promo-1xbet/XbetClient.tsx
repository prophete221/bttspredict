'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import { getPromoFaq } from '@/lib/promo-faq'

const CODE = 'vipbtts'
const BRAND = '1xBet'
const SELF = '1xbet' as const

const ALL_LINKS = [
  { id: '1xbet', label: '1xBet vipbtts', href: '/code-promo-1xbet' },
  { id: 'linebet', label: 'Linebet VISION221', href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: 'Melbet Bttswin', href: '/code-promo-melbet' },
  { id: '888starz', label: '888Starz btts221', href: '/bonus-888starz' },
]

export default function XbetClient(_props: { reviewDate?: string } = {}) {
  return (
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
      title={`Code promo ${BRAND} ${CODE}`}
      badge="Meilleur code promo — 300% + 100 Free Spins · vipbtts"
      intro={`Utilise le code ${CODE} à l’inscription via notre lien partenaire pour activer l’offre annoncée par ${BRAND}. Respecte la casse exacte. Les conditions définitives sont celles affichées par l’opérateur après inscription.`}
      offerHeadline="300% + 100 free spins"
      offerSub="Offre partenaire annoncée — sans condition de mise selon l’annonce. Vérifie toujours les termes sur le site de l’opérateur. 18+."
      benefits={['Bonus 300%', '100 Free Spins', 'Code exact obligatoire', 'App Android & iOS', 'Jeu responsable 18+']}
      steps={[
        { n: '01', title: 'Ouvre le lien partenaire', desc: `Clique sur « S’inscrire sur ${BRAND} » — le lien attribut correctement le compte partenaire.` },
        { n: '02', title: `Saisis ${CODE}`, desc: 'Entre le code dans le champ promo avant le premier dépôt, en respectant majuscules et minuscules.' },
        { n: '03', title: 'Vérifie les conditions', desc: 'Lis les termes affichés par l’opérateur (éligibilité, pays, délais) avant de déposer.' },
        { n: '04', title: 'Dépose et active', desc: 'Suis uniquement les instructions officielles après inscription. Télécharge l’APK si besoin.' },
      ]}
      faq={getPromoFaq('1xbet', 'fr')}
      crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
    />
  )
}
