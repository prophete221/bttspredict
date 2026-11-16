import type { ArchiveSummary } from '@/lib/archive-summary'

type Locale = 'fr' | 'en' | 'ar'

export default function ArchiveSummaryCards({ summary, lang }: { summary: ArchiveSummary | null; lang: Locale }) {
  if (!summary) return null
  const copy = lang === 'fr' ? {
    title: 'Bilan des archives', note: 'Résultats enregistrés dans les archives. Les détails vérifiés sont présentés séparément.',
    overall: 'Taux global', results: 'résultats enregistrés', won: 'W', lost: 'L',
  } : lang === 'en' ? {
    title: 'Archive summary', note: 'Results recorded in the archive. Verified details are shown separately.',
    overall: 'Overall rate', results: 'recorded results', won: 'W', lost: 'L',
  } : {
    title: 'ملخص الأرشيف', note: 'نتائج مسجلة في الأرشيف، وتُعرض التفاصيل المتحقق منها بشكل منفصل.',
    overall: 'المعدل الإجمالي', results: 'نتيجة مسجلة', won: 'ف', lost: 'خ',
  }
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'ar' ? 'ar' : 'en-US'
  const cards = [
    { label: copy.overall, value: summary },
    { label: 'BTTS', value: summary.byType.btts },
    { label: 'Over 2.5', value: summary.byType.over25 },
  ]
  return (
    <section className="archive-summary max-w-5xl mx-auto px-4 pb-8" aria-label={copy.title} data-testid="archive-summary">
      <h2 className="text-xl font-bold mb-2">{copy.title}</h2>
      <p className="text-sm text-[#9DABBB] mb-4">{copy.note}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ label, value }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
            <div className="text-xs uppercase tracking-wider text-[#9DABBB] font-bold mb-2">{label}</div>
            <div className="text-3xl font-bold text-[#F2F6FA]">{new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value.rate)} %</div>
            <div className="text-xs text-[#9DABBB] mt-1"><span className="tracking-win-text">{value.won} {copy.won}</span> · {value.lost} {copy.lost} · {value.total} {copy.results}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
