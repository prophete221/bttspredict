'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface MatchAnalyticsChartsProps {
  bttsProb?: number
  over25Prob?: number
  exactScoreProb?: string
  homeLambda?: number
  awayLambda?: number
  xgTotal?: number
  lang?: 'fr' | 'en' | 'ar'
}

const COLORS = {
  blue: '#2F7DFF',
  gold: '#2F7DFF',
  slate: '#9DABBB',
  grid: '#2B3A50',
  surface: '#0B0F14',
}

function percent(value?: number): number | null {
  if (value == null || !Number.isFinite(value)) return null
  return Math.round(value * 100)
}

function exactPercent(value?: string): number | null {
  if (!value) return null
  const parsed = Number.parseFloat(value.replace('%', '').replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

function TooltipContent({ active, payload, label, locale, unit }: {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: string
  locale: 'fr' | 'en' | 'ar'
  unit?: string
}) {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  const localeTag = locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar' : 'fr-FR'
  const formatted = value == null || !Number.isFinite(value)
    ? '—'
    : unit === '%'
      ? new Intl.NumberFormat(localeTag, { style: 'percent', maximumFractionDigits: 0 }).format(value / 100)
      : new Intl.NumberFormat(localeTag, { maximumFractionDigits: 2 }).format(value)
  return (
    <div className="rounded-lg border border-[#223041] bg-[#0B0F14] px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-semibold text-[#F2F6FA]">{label}</div>
      <div className="font-mono text-[#2F7DFF]">{formatted}</div>
    </div>
  )
}

export default function MatchAnalyticsCharts(props: MatchAnalyticsChartsProps) {
  const lang = props.lang ?? 'fr'
  const localeTag = lang === 'en' ? 'en-GB' : lang === 'ar' ? 'ar' : 'fr-FR'
  const L = lang === 'en'
    ? { exact: 'Estimated exact score', home: 'Home team', away: 'Away team', reading: 'Match dashboard', values: 'Recent match data', probByMarket: 'Estimated probabilities', probAria: 'Chart of estimated BTTS, Over 2.5 and exact-score probabilities', probNote: 'Estimates are not guarantees or final match results.', goalsPerGame: 'Goals scored per game', recentAverage: 'Recent average', totalGoals: 'Sum of averages', xgAria: 'Chart of recent goals scored per game by each team' }
    : lang === 'ar'
      ? { exact: 'النتيجة الدقيقة المقدّرة', home: 'الفريق المضيف', away: 'الفريق الضيف', reading: 'لوحة المباراة', values: 'بيانات المباريات الأخيرة', probByMarket: 'احتمالات تقديرية', probAria: 'رسم بياني لاحتمالات BTTS وOver 2.5 والنتيجة الدقيقة المقدّرة', probNote: 'هذه تقديرات وليست ضماناً أو نتيجة نهائية للمباراة.', goalsPerGame: 'أهداف مسجلة في المباراة', recentAverage: 'متوسط حديث', totalGoals: 'مجموع المتوسطين', xgAria: 'رسم بياني لمتوسط الأهداف المسجلة حديثاً لكل فريق' }
      : { exact: 'Score exact estimé', home: 'Équipe à domicile', away: 'Équipe à l’extérieur', reading: 'Tableau du match', values: 'Données des matchs récents', probByMarket: 'Probabilités estimées', probAria: 'Graphique des probabilités estimées BTTS, Over 2.5 et score exact', probNote: "Ces estimations ne sont ni des garanties ni le résultat final du match.", goalsPerGame: 'Buts marqués par match', recentAverage: 'Moyenne récente', totalGoals: 'Somme des moyennes', xgAria: 'Graphique des moyennes récentes de buts marqués par équipe' }

  const marketData = [
    { name: 'BTTS', value: percent(props.bttsProb), color: COLORS.blue },
    { name: 'Over 2.5', value: percent(props.over25Prob), color: COLORS.gold },
    ...(exactPercent(props.exactScoreProb) != null
      ? [{ name: L.exact, value: exactPercent(props.exactScoreProb), color: COLORS.slate }]
      : []),
  ].filter(item => item.value != null) as Array<{ name: string; value: number; color: string }>

  const xgData = [
    { name: L.home, value: props.homeLambda ?? null },
    { name: L.away, value: props.awayLambda ?? null },
  ].filter(item => item.value != null) as Array<{ name: string; value: number }>

  if (marketData.length === 0 && xgData.length === 0) return null

  return (
    <section className="mb-8" aria-labelledby="match-analytics-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 id="match-analytics-title" className="mt-1 text-xl font-bold text-[#F2F6FA]">{L.reading}</h2>
        </div>
        <span className="text-right text-xs text-[#9DABBB]">{L.values}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {marketData.length > 0 && (
          <div className="rounded-2xl border border-[#223041] bg-[#141C25] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F2F6FA]">{L.probByMarket}</h3>
              <span className="text-xs uppercase tracking-wider text-[#9DABBB]">0–100 %</span>
            </div>
            <div className="h-52" role="img" aria-label={L.probAria}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(127,162,198,0.08)' }} content={<TooltipContent locale={lang} unit="%" />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                    {marketData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {xgData.length > 0 && (
          <div className="rounded-2xl border border-[#223041] bg-[#141C25] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F2F6FA]">{L.goalsPerGame}</h3>
              <span className="text-xs uppercase tracking-wider text-[#9DABBB]">{L.recentAverage}</span>
            </div>
            <div className="h-52" role="img" aria-label={L.xgAria}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xgData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(127,162,198,0.08)' }} content={<TooltipContent locale={lang} />} />
                  <Bar dataKey="value" fill={COLORS.gold} radius={[6, 6, 0, 0]} barSize={46} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#9DABBB]">
              <span>{L.totalGoals}</span>
              <strong className="font-mono text-[#2F7DFF]">{props.xgTotal != null && Number.isFinite(props.xgTotal) ? new Intl.NumberFormat(localeTag, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(props.xgTotal) : '—'}</strong>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
