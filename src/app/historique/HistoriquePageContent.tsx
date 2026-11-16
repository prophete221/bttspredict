import { Navbar, Footer } from '@/components/bttsbet'
import HistoriqueClient, { type WinHistory } from './HistoriqueClient'
import type { ArchiveSummary } from '@/lib/archive-summary'

export default function HistoriquePageContent({ initialData, archiveSummary }: { initialData: WinHistory | null; archiveSummary: ArchiveSummary | null }) {
  return (
    <div className="content-page min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <HistoriqueClient initialData={initialData} archiveSummary={archiveSummary} />
      </main>
      <Footer />
    </div>
  )
}
