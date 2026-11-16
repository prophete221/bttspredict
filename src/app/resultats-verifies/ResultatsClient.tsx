'use client'

/**
 * /resultats-verifies — résultats vérifiés (Vague 2 → V3 motion design).
 * Données réelles de win-history.json uniquement ; chaque taux avec son
 * dénominateur ; sémantique stricte WIN (vert) / LOST (rouge) ; texte ≥ 12px.
 *
 * Motion design (macOS noir) :
 *  - révélation en cascade des cartes et du tableau (IntersectionObserver) ;
 *  - compteurs animés (count-up) sur les taux et totaux réels ;
 *  - barres de performance par marché qui grandissent à l'apparition ;
 *  - badges WIN/LOST avec pop d'apparition + lueur pour les gains ;
 *  - hover de ligne avec liseré vert/rouge selon le résultat ;
 *  - tout est désactivé sous prefers-reduced-motion.
 */

import { useState, useEffect, useRef } from 'react'
import ArchiveSummaryCards from '@/components/bttsbet/ArchiveSummaryCards'
import type { ArchiveSummary } from '@/lib/archive-summary'
import { useLanguage } from '@/components/bttsbet/LanguageSwitcher'
import { partitionRecordedPickHistory, selectBttsHistory, validateRecordedResult } from '@/lib/historyDisplay'

type ResultHistoryEntry = {
  date: string
  match: string
  type?: string
  market?: string
  prediction?: string
  provenanceVerified?: boolean
  status?: string
  isWon?: boolean
  tier?: string
  finalScore?: string
  score?: string
}

type Copy = {
  loading: string
  verified: string
  allRate: string
  goldPicks: string
  verifiedCount: string
  premiumSelection: string
  last30: string
  lastScan: string
  detailed: string
  date: string
  match: string
  market: string
  pick: string
  score: string
  result: string
  empty: string
  marketBreakdown: string
  sample: string
  noMarketData: string
  btts: string
  over: string
  won: string
  lost: string
  yes: string
  no: string
  source: string
}

const COPIES: Record<'fr' | 'en' | 'ar', Copy> = {
  fr: {
    loading: 'Chargement…', verified: 'Vérifiés', allRate: 'Taux global', goldPicks: 'Sélections Gold', verifiedCount: 'vérifiés', premiumSelection: 'Sélection premium', last30: '30 derniers jours', lastScan: 'Dernière vérification', detailed: 'Pronostics BTTS', date: 'Date', match: 'Match', market: 'Marché', pick: 'Prono', score: 'Score', result: 'Résultat', empty: 'Aucun résultat vérifié.', marketBreakdown: 'Performance par marché', sample: 'vérifiés', noMarketData: 'Pas encore de données suffisantes par marché.', btts: 'BTTS', over: 'Over 2.5', won: 'WIN', lost: 'LOST', yes: 'Oui', no: 'Non', source: 'Source : ESPN',
  },
  en: {
    loading: 'Loading…', verified: 'Verified', allRate: 'Overall rate', goldPicks: 'Gold picks', verifiedCount: 'verified', premiumSelection: 'Premium selection', last30: 'Last 30 days', lastScan: 'Last verification', detailed: 'BTTS predictions', date: 'Date', match: 'Match', market: 'Market', pick: 'Pick', score: 'Score', result: 'Result', empty: 'No verified result.', marketBreakdown: 'Performance by market', sample: 'verified', noMarketData: 'Not enough market-level data yet.', btts: 'BTTS', over: 'Over 2.5', won: 'WIN', lost: 'LOST', yes: 'Yes', no: 'No', source: 'Source: ESPN',
  },
  ar: {
    loading: 'جار التحميل…', verified: 'موثق', allRate: 'المعدل العام', goldPicks: 'اختيارات Gold', verifiedCount: 'موثق', premiumSelection: 'اختيار مميز', last30: 'آخر 30 يوماً', lastScan: 'آخر تحقق', detailed: 'توقعات BTTS', date: 'التاريخ', match: 'المباراة', market: 'السوق', pick: 'الاختيار', score: 'النتيجة', result: 'الحالة', empty: 'لا توجد نتائج موثقة.', marketBreakdown: 'الأداء حسب السوق', sample: 'موثق', noMarketData: 'لا توجد بيانات كافية حسب السوق بعد.', btts: 'BTTS', over: 'أكثر من 2.5', won: 'فوز', lost: 'خسارة', yes: 'نعم', no: 'لا', source: 'المصدر: ESPN',
  },
}

/** Révélation à l'entrée dans le viewport (une fois) — scopes compacts. */
function useReveal<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Révélation différée d'un frame (évite un setState synchrone dans
    // l'effet — cascade de rendus — tout en restant quasi immédiate).
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
    // Déjà dans le viewport au montage → révéler immédiatement (sinon un
    // conteneur plus grand que l'écran n'atteindrait jamais le seuil).
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

export default function ResultatsClient({ initialData, archiveSummary }: { initialData?: any; archiveSummary: ArchiveSummary | null }) {
  const { lang } = useLanguage()
  const copy = COPIES[lang]
  const [data, setData] = useState<any>(initialData || null)
  // Trois scopes indépendants : les seuils IO restent atteignables même si
  // le tableau fait plusieurs écrans de haut.
  const [tableRef, tableVisible] = useReveal<HTMLDivElement>()

  useEffect(() => {
    if (data) return
    fetch('/win-history.json').then(r => r.json()).then(d => { if (d?.geminiOnly === true) setData(d) }).catch(() => {})
  }, [data])

  if (!data || !data.stats) return <div className="text-center py-8 text-sm text-[#9DABBB]">{copy.loading}</div>

  const history: ResultHistoryEntry[] = (data.history || []).filter((h: ResultHistoryEntry) =>
    h.status === 'WON' || h.status === 'LOST' || (!h.status && typeof h.isWon === 'boolean')
  )
  // Never render an unknown/pending status through the LOST visual treatment.
  // The generated history should already contain verified rows only; this is
  // a defensive UI boundary for stale or malformed JSON.
  const bttsHistory = selectBttsHistory(history)
  const seen = new Set<string>()
  const dedupedHistorySource: ResultHistoryEntry[] = []
  for (const h of bttsHistory) {
    const key = `${h.date}-${h.match}-${h.type || h.market || ''}`
    if (seen.has(key)) continue
    seen.add(key)
    dedupedHistorySource.push(h)
  }
  const { withPick: pickedHistory } = partitionRecordedPickHistory(dedupedHistorySource)
  const dedupedHistory = pickedHistory.filter(row => validateRecordedResult(row) === 'verified')

  function getMarket(h: ResultHistoryEntry): string {
    const t = (h.type || h.market || '').toUpperCase()
    if (t.includes('BTTS')) return copy.btts
    if (t.includes('OVER')) return copy.over
    return t || '-'
  }

  /** Côté prédit (« Oui »/« Non ») : rend le verdict lisible (ex. BTTS Oui → 3-0 → LOST). */
  function getPick(h: ResultHistoryEntry): string {
    const v = (h.prediction || '').trim().toLowerCase()
    if (!v) return '—'
    if (v === 'non' || v === 'no') return copy.no
    if (v === 'oui' || v === 'yes') return copy.yes
    return h.prediction as string
  }

  // V8.3 : affichage public restreint aux résultats vérifiés (WON / LOST).
  // Les compteurs internes (publiés / en attente / non vérifiables) restent
  // dans win-history.json pour l'audit mais ne sont plus affichés sur le site.
  return (
    <div>
      <ArchiveSummaryCards summary={archiveSummary} lang={lang} />

      <div
        className={`rv-section${tableVisible ? ' is-visible' : ''}`}
        style={{ transitionDelay: '80ms' }}
        ref={tableRef as React.RefObject<HTMLDivElement>}
      >
        <h2 className="rv-section__title">{copy.detailed}</h2>
        <p className="rv-scroll-hint" role="note">
          {lang === 'fr' ? 'Sur téléphone, faites défiler le tableau horizontalement pour voir toutes les colonnes.' : lang === 'en' ? 'On phones, swipe the table horizontally to see every column.' : 'على الهاتف، مرّر الجدول أفقياً لرؤية جميع الأعمدة.'}
        </p>
        <div className="rv-table-wrap">
          <table className="rv-table">
            <thead>
              <tr>
                <th className="text-left">{copy.date}</th>
                <th className="text-left">{copy.match}</th>
                <th className="text-left">{copy.market}</th>
                <th className="rv-th-center">{copy.pick}</th>
                <th className="rv-th-center">{copy.score}</th>
                <th className="rv-th-center">{copy.result}</th>
              </tr>
            </thead>
            <tbody>
              {dedupedHistory.length === 0 ? (
                <tr><td colSpan={6} className="rv-empty-cell">{copy.empty}</td></tr>
              ) : dedupedHistory.slice(0, 100).map((h, i) => {
                const isWon = h.status === 'WON' || h.isWon === true
                const isGold = (h.tier || 'STANDARD').toUpperCase() === 'GOLD'
                // Cascade : 22 premières lignes échelonnées, les suivantes apparaissent avec la fin de la vague
                const rowDelay = Math.min(i, 22) * 34
                return (
                  <tr
                    key={i}
                    className={`rv-row rv-row--${isWon ? 'win' : 'loss'}${tableVisible ? ' is-visible' : ''}`}
                    style={{ transitionDelay: `${rowDelay}ms` }}
                  >
                    <td className="rv-cell rv-cell--date">{(h.date || '').slice(5)}</td>
                    <td className="rv-cell rv-cell--match">{h.match || '—'}</td>
                    <td className="rv-cell rv-cell--market">
                      {getMarket(h)}
                      {isGold && <span className="rv-gold-flag">GOLD</span>}
                    </td>
                    <td className="rv-cell rv-cell--pick">{getPick(h)}</td>
                    <td className="rv-cell rv-cell--score">{h.finalScore || h.score || '-'}</td>
                    <td className="rv-cell rv-cell--result">
                      <span className={`rv-badge rv-badge--${isWon ? 'win' : 'loss'}${tableVisible ? ' is-visible' : ''}${isWon ? ' tracking-win-badge' : ''}`} style={{ transitionDelay: `${60 + rowDelay}ms` }}>
                        <span className="rv-badge__dot" aria-hidden="true" />
                        {isWon ? 'WIN' : 'LOST'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
