'use client'

import { Navbar, Footer } from '@/components/bttsbet'
import ResultatsClient from './ResultatsClient'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'

export default function ResultatsLocalizedShell({ initialData }: { initialData: unknown }) {
  const { lang } = useLanguage()
  const copy = lang === 'fr' ? {
    title: 'Résultats des sélections archivées', intro: 'Consultez les matchs, les marchés, les scores finaux et le statut de vérification des sélections archivées.', rule: 'Traçabilité :', body: 'Chaque ligne indique la date, le match, le marché, la probabilité publiée, le score final et la source disponible. Les résultats passés ne garantissent pas les suivants. 18+ — Jeu responsable.'
  } : lang === 'en' ? {
    title: 'Archived selection results', intro: 'Review the matches, markets, final scores and verification status of archived selections.', rule: 'Traceability:', body: 'Each row shows the date, match, market, published probability, final score and available source. Past results do not guarantee future outcomes. 18+ — Play responsibly.'
  } : {
    title: 'نتائج الاختيارات المؤرشفة', intro: 'راجع المباريات والأسواق والنتائج النهائية وحالة التحقق للاختيارات المؤرشفة.', rule: 'التتبع:', body: 'يعرض كل سجل التاريخ والمباراة والسوق والاحتمال المنشور والنتيجة النهائية والمصدر المتاح. النتائج السابقة لا تضمن النتائج المستقبلية. 18+ — العب بمسؤولية.'
  }

  return (
    <div className="page-design page-design--history min-h-screen bg-[#080D14] flex flex-col text-[#EDF2F7]">
      <Navbar />
      <main id="main-content" className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8"><h1 className="text-3xl font-bold mb-2 tracking-tight">{copy.title}</h1><p className="text-sm text-[#9DABBB]">{copy.intro}</p></div>
          <ResultatsClient initialData={initialData} />
          <div className="mt-8 p-4 rounded-xl bg-[#141C25] border border-[#6B7A8C]"><p className="text-[11px] text-[#9DABBB] leading-relaxed"><strong className="text-[#9DABBB]">{copy.rule}</strong> {copy.body}</p></div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
