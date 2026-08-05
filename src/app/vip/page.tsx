import type { Metadata } from 'next'
import VipRedirect from './redirect-client'

export const metadata: Metadata = {
  title: 'VIP Multi-Sports — Pronostics premium Football, Tennis, NBA, NFL | BTTSPredict',
  description: 'Accès VIP BTTSPredict : pronostics premium sur 6 sports (Football, Tennis, NBA, NFL, UFC, Handball). Taux de réussite 69-81% selon le sport. Code VISION221 requis.',
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
}

export default function VipPage() {
  return <VipRedirect />
}
