import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Centre VIP — Intelligence match privée',
  description: 'Fiches VIP BTTS, Over 2.5 et score exact publiées avant le coup d’envoi, avec méthode documentée et accès vérifié.',
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Centre VIP — Intelligence match privée | BTTSPredict',
    description: 'Fiches VIP BTTS, Over 2.5 et score exact publiées avant le coup d’envoi, avec méthode documentée et accès vérifié.',
    url: 'https://bttspredict.com/vip',
    type: 'website',
  },
}

export default function VipLayout({ children }: { children: ReactNode }) {
  return children
}
