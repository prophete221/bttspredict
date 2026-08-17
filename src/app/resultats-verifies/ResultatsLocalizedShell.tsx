'use client'

import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import ResultatsClient from './ResultatsClient'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'

export default function ResultatsLocalizedShell({ initialData }: { initialData: unknown }) {
  const { lang } = useLanguage()
  const copy = lang === 'fr' ? {
    title: 'Résultats vérifiés des pronostics', intro: 'Tous les pronostics vérifiés avec scores réels ESPN. Aucun prono modifié ou supprimé après publication.', rule: 'Règle d’intégrité :', body: 'Aucun pronostic n’est modifié ou supprimé après publication. Chaque entrée contient la date, le match, le marché, la probabilité, le score final, le résultat et la source ESPN. Les performances historiques ne garantissent pas les résultats futurs. 18+ — Jeu responsable.'
  } : lang === 'en' ? {
    title: 'Verified prediction results', intro: 'All predictions verified against real ESPN scores. No prediction is modified or deleted after publication.', rule: 'Integrity rule:', body: 'No prediction is modified or deleted after publication. Each entry contains the date, match, market, probability, final score, result and ESPN verification source. Historical performance does not guarantee future results. 18+ — Play responsibly.'
  } : {
    title: 'نتائج التوقعات الموثقة', intro: 'جميع التوقعات موثقة مقابل نتائج حقيقية من ESPN. لا يتم تعديل أو حذف أي توقع بعد نشره.', rule: 'قاعدة النزاهة:', body: 'لا يتم تعديل أو حذف أي توقع بعد نشره. يتضمن كل سجل التاريخ والمباراة والسوق والاحتمال والنتيجة النهائية ومصدر التحقق من ESPN. الأداء السابق لا يضمن النتائج المستقبلية. 18+ — العب بمسؤولية.'
  }

  return (
    <div className="min-h-screen bg-[#07131D] flex flex-col text-[#F3F7F5]">
      <Navbar />
      <main id="main-content" className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8"><h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.title}</h1><p className="text-sm text-[#B4C4CC]">{copy.intro}</p></div>
          <ResultatsClient initialData={initialData} />
          <div className="mt-8 p-4 rounded-xl bg-[#0D202D] border border-[#23495C]"><p className="text-[11px] text-[#B4C4CC] leading-relaxed"><strong className="text-[#B4C4CC]">{copy.rule}</strong> {copy.body}</p></div>
        </div>
        <section className="max-w-5xl mx-auto px-4 py-8"><FreePredictions /></section>
      </main>
      <Footer />
    </div>
  )
}
