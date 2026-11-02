'use client'

import { AFFILIATE } from '@/lib/constants'
import PromoLandingShell from '@/components/bttsbet/PromoLandingShell'

const CODE = 'VISION221'
const BRAND = 'Linebet'
const SELF = 'linebet'

const ALL_LINKS = [
  { id: '1xbet', label: '1xBet Vipbtts', href: '/code-promo-1xbet' },
  { id: 'linebet', label: 'Linebet VISION221', href: '/code-promo-linebet-senegal' },
  { id: 'melbet', label: 'Melbet Bttswin', href: '/code-promo-melbet' },
  { id: '888starz', label: '888Starz btts221', href: '/bonus-888starz' },
]

export default function LinebetClient() {
  return (
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
      title={`Code promo ${BRAND} ${CODE}`}
      badge="🏆 Meilleur code promo — 300% + 100 Free Spins"
      intro={`Utilise le code ${CODE} à l’inscription via notre lien pour activer l’offre annoncée par ${BRAND}. Respecte la casse exacte du code.`}
      offerHeadline="300% + 100 free spins"
      offerSub="Sans condition de mise selon l’annonce partenaire. Conditions affichées par l’opérateur. 18+."
      benefits={['Bonus 300%', '100 Free Spins', 'Sans condition de mise', 'App Android & iOS', 'International']}
      steps={[
        { n: '01', title: 'Inscris-toi via notre lien', desc: `Ouvre ${BRAND} avec notre lien partenaire pour que l’offre soit bien attribuée.` },
        { n: '02', title: `Entre le code ${CODE}`, desc: 'Saisis le code exact (casse sensible) dans le champ promo avant le premier dépôt.' },
        { n: '03', title: 'Dépose et active', desc: 'Suis les conditions affichées par l’opérateur après inscription — sans condition de mise selon l’annonce.' },
        { n: '04', title: 'Télécharge l’app', desc: 'Optionnel : installe l’APK officiel via le bouton de téléchargement.' },
      ]}
      faq={[
        { q: `Quel est le code promo ${BRAND} ?`, a: `Le code est ${CODE}. Saisis-le exactement comme indiqué.` },
        { q: 'Quelle est l’offre ?', a: '300% + 100 free spins sans condition de mise selon la campagne partenaire, sous conditions opérateur.' },
        { q: 'Disponible dans mon pays ?', a: `La disponibilité de ${BRAND} dépend de la réglementation locale.` },
      ]}
      crossLinks={ALL_LINKS.filter((l) => l.id !== SELF).map(({ label, href }) => ({ label, href }))}
    />
  )
}
