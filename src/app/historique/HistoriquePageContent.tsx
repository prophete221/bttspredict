import { Navbar, Footer } from '@/components/bttsbet'
import HistoriqueClient, { type WinHistory } from './HistoriqueClient'

export default function HistoriquePageContent({ h1, initialData }: { h1: string; initialData: WinHistory | null }) {
  return (
    <div className="page-design page-design--history min-h-screen bg-[#080D14] flex flex-col text-[#EDF2F7]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">{h1}</h1>
        <HistoriqueClient initialData={initialData} />
      </main>
      <Footer />
    </div>
  )
}
