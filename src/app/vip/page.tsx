import type { Metadata } from 'next'
import VipRedirect from './redirect-client'

export const metadata: Metadata = {
  title: 'VIP Multi-Sports — Pronostics Premium',
  description: "VIP BTTSPredict : pronostics premium sur 6 sports. Taux réel sur /historique. Dépôt 3 000 XOF + code VISION221.",
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
}

import { FreePredictionsWidget, VipCardWidget, LinebetApkButton } from '@/components/bttsbet'

export default function VipPage() {
  return <VipRedirect />
}
