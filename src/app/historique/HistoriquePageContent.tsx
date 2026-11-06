import { Navbar, Footer } from '@/components/bttsbet'
import HistoriqueClient, { type WinHistory } from './HistoriqueClient'

export default function HistoriquePageContent({ h1, initialData }: { h1: string; initialData: WinHistory | null }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col text-[#F2F6FA]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">{h1}</h1>
        <HistoriqueClient initialData={initialData} />
      </main>
      <Footer />
    </div>
  )
}
