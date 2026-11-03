'use client'

import Link from 'next/link'
import { type Locale, localizedPath } from '@/lib/i18n'

type MarketId = 'btts' | 'over25' | 'score' | 'combo' | 'tomorrow'

type Copy = {
  title: string
  subtitle: string
  compactTitle: string
  items: Record<MarketId, { title: string; detail: string; code: string }>
}

const COPY: Record<Locale, Copy> = {
  fr: {
    title: 'Explorer les marchés',
    subtitle: 'Choisissez le type d’analyse qui vous intéresse.',
    compactTitle: 'Autres marchés',
    items: {
      btts: { title: 'BTTS du jour', detail: 'Les deux équipes marquent', code: 'BTTS' },
      over25: { title: 'Over 2,5', detail: 'Au moins 3 buts au total', code: 'O2.5' },
      score: { title: 'Score exact', detail: 'Les scores les plus probables', code: '01—05' },
      combo: { title: 'Marché combiné', detail: 'BTTS + Over 2,5', code: 'BTTS × O2.5' },
      tomorrow: { title: 'Pour demain', detail: 'Sélections publiées sur le tableau', code: 'J+1' },
    },
  },
  en: {
    title: 'Explore the markets',
    subtitle: 'Choose the type of match analysis you want to explore.',
    compactTitle: 'More markets',
    items: {
      btts: { title: 'BTTS today', detail: 'Both teams to score', code: 'BTTS' },
      over25: { title: 'Over 2.5', detail: '3 or more total goals', code: 'O2.5' },
      score: { title: 'Correct score', detail: 'Most likely scorelines', code: '01—05' },
      combo: { title: 'Combined market', detail: 'BTTS + Over 2.5', code: 'BTTS × O2.5' },
      tomorrow: { title: 'Tomorrow', detail: 'Selections appear on the board', code: 'J+1' },
    },
  },
  ar: {
    title: 'استكشف أسواق التوقعات',
    subtitle: 'اختر نوع تحليل المباريات الذي تريد استكشافه.',
    compactTitle: 'أسواق أخرى',
    items: {
      btts: { title: 'BTTS اليوم', detail: 'كلا الفريقين يسجلان', code: 'BTTS' },
      over25: { title: 'Over 2.5', detail: '3 أهداف أو أكثر', code: 'O2.5' },
      score: { title: 'النتيجة الدقيقة', detail: 'النتائج الأكثر احتمالاً', code: '01—05' },
      combo: { title: 'سوق مركّب', detail: 'BTTS + Over 2.5', code: 'BTTS × O2.5' },
      tomorrow: { title: 'توقعات الغد', detail: 'تظهر الاختيارات على لوحة اليوم', code: 'J+1' },
    },
  },
}

const HREFS: Record<MarketId, string> = {
  btts: '/btts/predictions/today',
  over25: '/over-2-5/predictions/today',
  score: '/ai-correct-score-predictions',
  combo: '/btts-and-over-2-5-predictions-today',
  tomorrow: '/btts/predictions/tomorrow',
}

const ORDER: MarketId[] = ['btts', 'over25', 'score', 'combo', 'tomorrow']

function MarketGlyph({ id }: { id: MarketId }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (id === 'btts') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17M3.8 9h4.1l2-2.6 3.7 7.2 2-3.1h4.6" /></svg>
  if (id === 'over25') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6" /><path d="M16 7h3v3" /></svg>
  if (id === 'score') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><path d="M8 9h.01M16 9h.01M8 15h.01M16 15h.01M11 9h2M11 15h2" /></svg>
  if (id === 'combo') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="9" cy="12" r="6.2" /><circle cx="15" cy="12" r="6.2" /><path d="M12 6.3v11.4" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17M8 13h3M8 16h3M14 13h2" /></svg>
}

export default function PredictionMarketNav({
  locale = 'fr',
  active,
  variant = 'compact',
}: {
  locale?: Locale
  active?: MarketId
  variant?: 'compact' | 'full'
}) {
  const t = COPY[locale]
  const isFull = variant === 'full'

  return (
    <section
      className={`prediction-nav${isFull ? ' prediction-nav--full' : ' prediction-nav--compact'}`}
      aria-label={t.title}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="prediction-nav__inner">
        <header className="prediction-nav__head">
          <div>
            <p className="prediction-nav__eyebrow">{locale === 'fr' ? 'CENTRE D’ANALYSE' : locale === 'ar' ? 'مركز التحليل' : 'ANALYSIS DESK'}</p>
            <h2>{isFull ? t.title : t.compactTitle}</h2>
            {isFull && <p className="prediction-nav__subtitle">{t.subtitle}</p>}
          </div>
          {isFull && <span className="prediction-nav__index" aria-hidden="true">01 / 05</span>}
        </header>
        <nav className="prediction-nav__links" aria-label={t.title}>
          {ORDER.map((id, index) => {
            const item = t.items[id]
            return (
              <Link
                key={id}
                href={localizedPath(HREFS[id], locale)}
                className={`prediction-nav__link${active === id ? ' is-active' : ''}`}
                aria-current={active === id ? 'page' : undefined}
                data-market={id}
              >
                <span className="prediction-nav__glyph"><MarketGlyph id={id} /></span>
                <span className="prediction-nav__copy">
                  <span className="prediction-nav__code">{item.code || `0${index + 1}`}</span>
                  <span className="prediction-nav__title">{item.title}</span>
                  {isFull && <span className="prediction-nav__detail">{item.detail}</span>}
                </span>
                <span className="prediction-nav__arrow" aria-hidden="true">{locale === 'ar' ? '←' : '→'}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </section>
  )
}
