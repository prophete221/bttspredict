import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const BttsTodayDashboard = dynamic(() => import('@/components/bttsbet/BttsTodayDashboard'), { loading: () => null })

const TITLE = 'Pronostics BTTS du jour — Sélections gratuites'
const DESCRIPTION = 'Pronostics BTTS du jour sur des matchs internationaux : sélections statistiques, données horodatées et méthode documentée. 18+.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://bttspredict.com/btts/predictions/today',
    languages: {
      fr: 'https://bttspredict.com/btts/predictions/today',
      en: 'https://bttspredict.com/en/btts/predictions/today',
      ar: 'https://bttspredict.com/ar/btts/predictions/today',
      'x-default': 'https://bttspredict.com/btts/predictions/today',
    },
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com/btts/predictions/today',
    siteName: 'BTTSPredict',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function BTTSPredictionsTodayPage() {
  return (
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">Pronostics BTTS du jour</h1>
        <BttsTodayDashboard />
      </main>
      <Footer />
    </div>
  )
}
