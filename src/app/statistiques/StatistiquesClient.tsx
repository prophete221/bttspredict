'use client'

import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'

export default function StatistiquesClient() {
  const { lang } = useLanguage()
  const copy = lang === 'fr' ? { title: 'Statistiques en cours de compilation', body: "Les statistiques détaillées seront affichées lorsque suffisamment de données vérifiées seront disponibles. Aucune statistique n’est affichée artificiellement lorsque l’échantillon disponible est insuffisant.", waiting: 'En attendant, découvrez les pronostics gratuits du jour ci-dessous.', cta: 'Voir les pronostics du jour →' } : lang === 'en' ? { title: 'Statistics are being compiled', body: 'Detailed statistics will be displayed when enough verified data is available. No statistics are fabricated when the available sample is insufficient.', waiting: 'Meanwhile, explore today’s free predictions below.', cta: 'See today’s predictions →' } : { title: 'يتم إعداد الإحصائيات', body: 'ستظهر الإحصائيات التفصيلية عند توفر بيانات موثقة كافية. لا نعرض أي إحصائيات مصطنعة عندما تكون العينة غير كافية.', waiting: 'في هذه الأثناء، اكتشف توقعات اليوم المجانية أدناه.', cta: 'عرض توقعات اليوم ←' }

  return (
    <div className="min-h-screen bg-[#071018] flex flex-col text-[#F5F8F3]">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{copy.title}</h1>
          <p className="text-sm text-[#B7C4C1] mb-3 leading-relaxed">{copy.body}</p>
          <p className="text-sm text-[#B7C4C1] mb-8">{copy.waiting}</p>
          <a href={lang === 'fr' ? '/#free-predictions' : `/${lang}#free-predictions`} className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-bold text-sm transition-all" style={{ backgroundColor: '#B8FF1A', color: '#071018' }}>{copy.cta}</a>
        </div>
        <section className="max-w-5xl mx-auto px-4 py-8"><FreePredictions /></section>
      </main>
      <Footer />
    </div>
  )
}
