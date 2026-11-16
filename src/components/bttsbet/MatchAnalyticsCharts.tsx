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
  lang?: 'fr' | 'en' | 'ar'
}

const COLORS = {
  btts: '#2F7DFF',
  over: '#34D399',
  slate: '#9DABBB',
  grid: '#2B3A50',
}

function percent(value?: number): number | null {
  if (value == null || !Number.isFinite(value) || value < 0 || value > 1) return null
  return Math.round(value * 100)
}

function TooltipContent({ active, payload, label, locale }: {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: string
  locale: 'fr' | 'en' | 'ar'
}) {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  const localeTag = locale === 'en' ? 'en-GB' : locale === 'ar' ? 'ar' : 'fr-FR'
  const formatted = value == null || !Number.isFinite(value)
    ? '—'
    : new Intl.NumberFormat(localeTag, { style: 'percent', maximumFractionDigits: 0 }).format(value / 100)
  return (
    <div className="rounded-lg border border-[#223041] bg-[#0B0F14] px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-semibold text-[#F2F6FA]">{label}</div>
      <div className="font-mono text-[#2F7DFF]">{formatted}</div>
    </div>
  )
}

export default function MatchAnalyticsCharts(props: MatchAnalyticsChartsProps) {
  const lang = props.lang ?? 'fr'
  const labels = lang === 'en'
    ? {
        title: 'Published-pick probabilities',
        btts: 'BTTS pick',
        over: 'Over 2.5 pick',
        note: 'Values come from the published picks; they are not guarantees or final scores.',
        aria: 'Chart of the published BTTS and Over 2.5 pick probabilities',
      }
    : lang === 'ar'
      ? {
          title: 'احتمالات الاختيارات المنشورة',
          btts: 'اختيار BTTS',
          over: 'اختيار Over 2.5',
          note: 'القيم مأخوذة من الاختيارات المنشورة وليست ضماناً أو نتيجة نهائية.',
          aria: 'رسم بياني لاحتمالات اختياري BTTS وOver 2.5 المنشورين',
        }
      : {
          title: 'Probabilités des picks publiés',
          btts: 'Pick BTTS',
          over: 'Pick Over 2,5',
          note: 'Valeurs issues des picks publiés ; elles ne garantissent ni résultat ni score final.',
          aria: 'Graphique des probabilités des picks BTTS et Over 2,5 publiés',
        }

  const data = [
    { name: labels.btts, value: percent(props.bttsProb), color: COLORS.btts },
    { name: labels.over, value: percent(props.over25Prob), color: COLORS.over },
  ].filter(item => item.value != null) as Array<{ name: string; value: number; color: string }>

  if (data.length === 0) return null

  return (
    <section className="mb-8" aria-labelledby="match-analytics-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 id="match-analytics-title" className="mt-1 text-xl font-bold text-[#F2F6FA]">{labels.title}</h2>
        <span className="text-right text-xs text-[#9DABBB]">0–100 %</span>
      </div>
      <div className="rounded-2xl border border-[#223041] bg-[#141C25] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="h-52" role="img" aria-label={labels.aria}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
              <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={92} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(127,162,198,0.08)' }} content={<TooltipContent locale={lang} />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                {data.map(entry => <Cell key={entry.name} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[#9DABBB]">{labels.note}</p>
      </div>
    </section>
  )
}
