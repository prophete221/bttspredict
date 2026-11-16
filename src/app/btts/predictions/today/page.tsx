import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import BttsTodayDashboard from '@/components/bttsbet/BttsTodayDashboard'
import { buildBttsTodayDashboardData } from '@/lib/btts-today-dashboard-data'
import buildTimePredictions from '../../../../../public/predictions.json'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })

const TITLE = 'Pronostics BTTS du jour — Sélections gratuites'
const DESCRIPTION = 'Sélections BTTS publiques affichées après validation pour les matchs à venir. Aucun résultat futur n’est garanti. 18+.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: 'https://bttspredict.com/btts/predictions/today',
    languages: {
      fr: 'https://bttspredict.com/btts/predictions/today',
      en: 'https://bttspredict.com/en/btts/predictions/today',
      'x-default': 'https://bttspredict.com/btts/predictions/today',
    },
  },
  robots: process.env.NODE_ENV === 'development'
    ? { index: false, follow: false }
    : { index: true, follow: true },
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
  const initialNow = Date.now()
  const initialDashboard = buildBttsTodayDashboardData(buildTimePredictions, new Date(initialNow))
  return (
    <div className="page-design page-design--btts min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">Pronostics BTTS du jour</h1>
        <BttsTodayDashboard initialDashboard={initialDashboard} initialNow={initialNow} />
      </main>
      <Footer />
    </div>
  )
}
