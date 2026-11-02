'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'
import { getPromoFaq } from '@/lib/promo-faq'

const CODE = 'btts221'
const BRAND = '888Starz'
const SELF = '888starz' as const

const ALL_LINKS = [
  { id: '1xbet', label: '1xBet Vipbtts', href: '/code-promo-1xbet' },
  { id: 'linebet', label: 'Linebet VISION221', href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: 'Melbet Bttswin', href: '/code-promo-melbet' },
  { id: '888starz', label: '888Starz btts221', href: '/bonus-888starz' },
]

export default function Star888Client(_props: { reviewDate?: string } = {}) {
  return (
    <PromoLandingShell
      brand={BRAND}
      code={CODE}
      bookmakerId="888starz"
      accent="#FF4D6D"
      logo="/logos/888starz-logo.jpg"
      logoBg="#1a0a0f"
      signupUrl={AFFILIATE.star888}
      downloadUrl={AFFILIATE.star888Download}
      lang="fr"
      title={`Code promo ${BRAND} ${CODE}`}
      badge="Meilleur code promo — 300% + 100 Free Spins · btts221"
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
      faq={getPromoFaq('888starz', 'fr')}
      crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
    />
  )
}
