import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const BttsTodayDashboard = dynamic(() => import('@/components/bttsbet/BttsTodayDashboard'), { loading: () => null })

export const metadata: Metadata = {
  title: "BTTS Predictions Today (100% Free) - AI Football Tips & Stats",
  description: "Best Both Teams to Score (BTTS) predictions today. AI-powered football tips, stats, and high-probability betting predictions updated daily.",
  alternates: { canonical: 'https://bttspredict.com/btts/predictions/today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: "BTTS Predictions Today (100% Free) - AI Football Tips & Stats",
    description: "Best Both Teams to Score (BTTS) predictions today. AI-powered football tips, stats, and high-probability betting predictions updated daily.",
    url: 'https://bttspredict.com/btts/predictions/today',
    type: 'website',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "What are today's BTTS predictions?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Today's BTTS predictions are football matches where both teams are predicted to score at least one goal. BTTSPredict publishes a daily selection of BTTS picks produced by an AI engine based on recent team form, calibrated continuously. Predictions are archived and verified after the official match result.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are BTTS predictions guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. No future result is guaranteed. BTTS predictions are probabilistic estimates, not certainties. Sports betting carries a risk of loss. 18+.",
      },
    },
  ],
}

export default function BTTSPredictionsTodayPage() {
  return (
    <div className="min-h-screen bg-[#080B12] flex flex-col text-[#F7F4EE]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">BTTS Predictions Today</h1>
        <BttsTodayDashboard />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
