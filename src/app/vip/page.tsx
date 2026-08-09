import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { checkSeo } from '@/lib/seo'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const ErrorBoundary = dynamic(() => import('@/components/bttsbet/ErrorBoundary'), { loading: () => null })
const VipClient = dynamic(() => import('./VipClient'), { loading: () => null })

/* ──────────────────────────────────────────────────────────────
   Metadata — VIP affilié 1 mois gratuit v65.2
   ────────────────────────────────────────────────────────────── */
const TITLE = 'Débloquer VIP 1 Mois Gratuit — VISION221 / vision221'
const DESCRIPTION = "VIP 1 mois gratuit : code VISION221 (Linebet) ou vision221 (888Starz), dépôt 3000F, ID vérifié 15-60min WhatsApp. 6 pronos BTTS/jour avec xG. 18+."
checkSeo('vip', TITLE, DESCRIPTION)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Débloquer VIP 1 Mois Gratuit — BTTSPredict',
    description: DESCRIPTION,
    url: 'https://bttspredict.com/vip',
    type: 'website',
  },
}

/**
 * VIP page v65.2 — Plateforme PRO affiliée
 *
 * Pas de pricing 4900 F (supprimé en v65.2 — conflit avec modèle affilié).
 *
 * Architecture :
 *   - 2 cartes côte à côte (Linebet VISION221 MAJ + 888Starz vision221 MIN)
 *   - 3 steps communs (S'inscrire → Dépôt 3000F → Envoyer ID)
 *   - 3 boutons par carte (Copier / S'inscrire / Télécharger APK)
 *   - Section vérification WhatsApp avec input ID + select plateforme
 *   - 3 colonnes avantages
 *   - Aperçu VIP flouté (3 matchs avec xG différents)
 *   - Footer VIP avec liens affiliés + WhatsApp +1 540 670 4172
 */
export default function VipPage() {
  return (
    <div className="min-h-screen bg-dark-800 flex flex-col text-papier">
      <ErrorBoundary><Navbar /></ErrorBoundary>

      <main id="main-content" className="flex-1 relative z-10" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        <VipClient />
        <ErrorBoundary><Footer /></ErrorBoundary>
      </main>
    </div>
  )
}
