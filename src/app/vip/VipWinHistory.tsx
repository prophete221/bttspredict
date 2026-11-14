'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import {
  groupWonMainHistoryByDate,
  selectWonMainHistoryEntries,
  type MainHistoryWin,
} from '@/lib/vipWinHistory'

type HistoryPayload = { history?: unknown }
type LoadState = 'loading' | 'available' | 'unavailable'

const COPY = {
  fr: {
    eyebrow: 'Historique VIP',
    loading: 'Chargement de l’historique…',
    unavailable: 'L’historique est momentanément indisponible. Réessayez plus tard.',
    empty: 'Aucune victoire vérifiée n’est disponible dans l’historique principal pour le moment.',
    selection: 'Sélection',
    market: 'Marché',
    score: 'Score final',
    win: 'GAGNÉ',
    unlock: 'Demander l’accès VIP',
  },
  en: {
    eyebrow: 'VIP history',
    loading: 'Loading history…',
    unavailable: 'History is temporarily unavailable. Please try again later.',
    empty: 'No verified wins are available in the main history yet.',
    selection: 'Selection',
    market: 'Market',
    score: 'Final score',
    win: 'WON',
    unlock: 'Request VIP access',
  },
  ar: {
    eyebrow: 'سجل VIP',
    loading: 'جارٍ تحميل السجل…',
    unavailable: 'السجل غير متاح مؤقتًا. يرجى المحاولة لاحقًا.',
    empty: 'لا تتوفر انتصارات موثقة في السجل الرئيسي حالياً.',
    selection: 'الاختيار',
    market: 'السوق',
    score: 'النتيجة النهائية',
    win: 'فوز',
    unlock: 'اطلب الوصول إلى VIP',
  },
} as const

function formatDate(date: string, lang: 'fr' | 'en' | 'ar') {
  const locale = lang === 'ar' ? 'ar' : lang === 'en' ? 'en-GB' : 'fr-FR'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' })
    .format(new Date(`${date}T12:00:00.000Z`))
}

function marketLabel(market?: string, lang: 'fr' | 'en' | 'ar' = 'fr') {
  if (market?.toLowerCase() === 'btts') return 'BTTS'
  if (market?.toLowerCase() === 'over25') return lang === 'fr' ? 'Over 2,5' : 'Over 2.5'
  return market?.trim() ? market.toUpperCase() : ''
}

export default function VipWinHistory({ onUnlock }: { onUnlock: () => void }) {
  const { lang } = useLanguage()
  const t = COPY[lang]
  const [rows, setRows] = useState<MainHistoryWin[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const groupedRows = useMemo(() => groupWonMainHistoryByDate(rows), [rows])

  useEffect(() => {
    let active = true
    fetch('/win-history.json', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Main history is unavailable')
        return response.json() as Promise<HistoryPayload>
      })
      .then((payload) => {
        if (!active) return
        setRows(selectWonMainHistoryEntries(payload.history, new Date()))
        setState('available')
      })
      .catch(() => {
        if (!active) return
        setRows([])
        setState('unavailable')
      })
    return () => { active = false }
  }, [])

  return (
    <section className="vipx-shell" id="historique-vip" data-testid="vip-history-panel" style={{ scrollMarginTop: '96px' }} aria-labelledby="vip-win-history-title">
      <header className="vipx-section-head">
        <h2 id="vip-win-history-title">{t.eyebrow}</h2>
      </header>

      {state === 'loading' ? (
        <p className="vipx-history-empty" role="status" aria-live="polite">{t.loading}</p>
      ) : groupedRows.length > 0 ? (
        <div className="vipx-history-card" role="region" aria-label={t.eyebrow}>
          {groupedRows.map((group, index) => (
            <details className="vipx-history-day" key={group.date} open={index === 0}>
              <summary className="vipx-history-day__summary">
                <time dateTime={group.date}>{formatDate(group.date, lang)}</time>
              </summary>
              <ul className="vipx-history-list">
                {group.records.map((record, recordIndex) => {
                  const finalScore = record.finalScore || record.score
                  const market = marketLabel(record.market, lang)
                  return (
                    <li className="vipx-history-row" key={`${record.date}-${record.match}-${record.market ?? ''}-${recordIndex}`}>
                      <div className="vipx-history-row__match">
                        <strong>{record.match}</strong>
                        {record.league && <span>{record.league}</span>}
                      </div>
                      <div className="vipx-history-row__meta">
                        {market && <span>{t.market}: {market}</span>}
                        {record.prediction && <span>{t.selection}: {record.prediction}</span>}
                        <span className="tracking-win-badge">{t.win}</span>
                      </div>
                      {finalScore && (
                        <div className="vipx-history-row__score">
                          <span>{t.score}</span>
                          <strong className="tracking-win-text">{finalScore}</strong>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </details>
          ))}
        </div>
      ) : (
        <p className="vipx-history-empty" role="status" aria-live="polite">
          {state === 'unavailable' ? t.unavailable : t.empty}
        </p>
      )}

      <div className="vipx-history-cta">
        <button type="button" className="vipx-btn vipx-btn--gold" onClick={onUnlock} data-cta="vip-history-unlock">
          {t.unlock}<span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
