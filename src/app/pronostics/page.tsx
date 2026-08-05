import type { Metadata } from 'next'
import PronosticsRedirect from './redirect-client'

export const metadata: Metadata = {
  title: 'Pronostics BTTS aujourd\'hui & Over 2.5 — BTTSPredict',
  description: 'Pronostics btts aujourd\'hui gratuits et premium. 20+ matchs analysés chaque jour par nos experts avec modèles Poisson. Code promo VISION221 pour bonus 90 000 XOF.',
  alternates: { canonical: 'https://bttspredict.com/pronostics' },
  robots: { index: true, follow: true },
}

export default function PronosticsPage() {
  return <PronosticsRedirect />
}
