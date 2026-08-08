import type { Metadata } from 'next'
import PronosticsRedirect from './redirect-client'

export const metadata: Metadata = {
  title: 'Pronostics BTTS aujourd\'hui',
  description: "Pronostics BTTS et Over 2.5 du jour par moteur IA. Sélections filtrées par ligues à fort taux de BTTS. 18+.",
  alternates: { canonical: 'https://bttspredict.com/pronostics' },
  robots: { index: true, follow: true },
}

import { FreePredictionsWidget, VipCardWidget, LinebetApkButton } from '@/components/bttsbet'

export default function PronosticsPage() {
  return <PronosticsRedirect />
}
