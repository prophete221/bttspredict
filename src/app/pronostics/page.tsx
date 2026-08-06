import type { Metadata } from 'next'
import PronosticsRedirect from './redirect-client'

export const metadata: Metadata = {
  title: 'Pronostics BTTS aujourd\'hui',
  description: 'Pronostics BTTS aujourd\'hui gratuits et premium. 20+ matchs analysés par nos experts avec modèle Poisson. Code VISION221 pour bonus 90 000 XOF.',
  alternates: { canonical: 'https://bttspredict.com/pronostics' },
  robots: { index: true, follow: true },
}

import { FreePredictionsWidget, VipCardWidget, LinebetApkButton } from '@/components/bttsbet'

export default function PronosticsPage() {
  return <PronosticsRedirect />
}
