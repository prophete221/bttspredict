import type { Metadata } from 'next'
import BttsTomorrowLanding from '@/components/bttsbet/BttsTomorrowLanding'

export const metadata: Metadata = {
  title: 'BTTS Predictions Tomorrow — Pronostics demain',
  description: "Aperçu des pronostics BTTS de demain. Sélection quotidienne par moteur statistique. 18+.",
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/tomorrow' },
  robots: { index: true, follow: true },
}

export default function BTTSPredictionsTomorrowPage() {
  return <BttsTomorrowLanding locale="fr" />
}
