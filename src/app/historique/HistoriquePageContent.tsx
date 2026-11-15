import { Navbar, Footer } from '@/components/bttsbet'
import HistoriqueClient, { type WinHistory } from './HistoriqueClient'

export default function HistoriquePageContent({ h1, initialData }: { h1: string; initialData: WinHistory | null }) {
  return (
    <div className="content-page min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">{h1}</h1>
        <HistoriqueClient initialData={initialData} />
      </main>
      <Footer />
    </div>
  )
}
