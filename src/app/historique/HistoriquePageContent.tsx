import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import HistoriqueClient from './HistoriqueClient'

export default function HistoriquePageContent({ h1 }: { h1: string }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">{h1}</h1>
        <HistoriqueClient />
        <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
