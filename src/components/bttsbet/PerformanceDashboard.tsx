'use client'

import ArchiveSummaryCards from './ArchiveSummaryCards'
import { useLanguage } from './LanguageSwitcher'
import { localizedPath, translationsFor, type Locale } from '@/lib/i18n'
import type { ArchiveSummary } from '@/lib/archive-summary'

export default function PerformanceDashboard({ initialLocale, archiveSummary }: {
  initialLocale?: Locale
  archiveSummary: ArchiveSummary | null
}) {
  const { lang: detectedLang } = useLanguage()
  const lang = initialLocale ?? detectedLang
  const t = translationsFor(lang)
  return (
    <section id="performance" className="hp-section" style={{ scrollMarginTop: '72px' }}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="hp-sect-head">
          <h2 className="hp-sect-title">{t.home2.perfTitle}</h2>
        </div>
        <ArchiveSummaryCards summary={archiveSummary} lang={lang} />
        <a href={localizedPath('/historique', lang)} className="hp-btn-primary hp-btn-primary--sm" data-cta="perf-explore-history">{t.home2.perfExplore}</a>
        <p className="hp-perf__warning" role="note">{t.home2.perfWarning}</p>
      </div>
    </section>
  )
}
