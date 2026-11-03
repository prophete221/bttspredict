import type { Metadata } from 'next'
import LocalizedCombinedPredictionsClient from '@/components/bttsbet/LocalizedCombinedPredictionsClient'

export const metadata: Metadata = {
  title: 'Prédictions combinées BTTS + Over 2,5 aujourd’hui',
  description: 'Sélection de matchs qui réunissent les critères BTTS et Over 2,5, avec données du modèle statistique. Aucun résultat n’est garanti. 18+.',
  alternates: { canonical: 'https://bttspredict.com/btts-and-over-2-5-predictions-today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Prédictions BTTS + Over 2,5 | BTTSPredict',
    description: 'Analyse combinée BTTS et Over 2,5, fondée sur les données disponibles. 18+.',
    url: 'https://bttspredict.com/btts-and-over-2-5-predictions-today',
    type: 'website',
  },
}

export default function BttsAndOver25Page() {
  return <LocalizedCombinedPredictionsClient />
}
