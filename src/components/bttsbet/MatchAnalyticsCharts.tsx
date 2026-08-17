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
}

const COLORS = {
  blue: '#E6A24C',
  gold: '#E6A24C',
  slate: '#B4C4CC',
  grid: '#2B3A50',
  surface: '#07131D',
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

function TooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#304951] bg-[#07131D] px-3 py-2 text-xs shadow-xl">
      <div className="mb-1 font-semibold text-[#F3F7F5]">{label}</div>
      <div className="font-mono text-[#E6A24C]">{payload[0].value}%</div>
    </div>
  )
}

export default function MatchAnalyticsCharts(props: MatchAnalyticsChartsProps) {
  const marketData = [
    { name: 'BTTS', value: percent(props.bttsProb), color: COLORS.blue },
    { name: 'Over 2.5', value: percent(props.over25Prob), color: COLORS.gold },
    ...(exactPercent(props.exactScoreProb) != null
      ? [{ name: 'Score exact', value: exactPercent(props.exactScoreProb), color: COLORS.slate }]
      : []),
  ].filter(item => item.value != null) as Array<{ name: string; value: number; color: string }>

  const xgData = [
    { name: 'Domicile', value: props.homeLambda ?? null },
    { name: 'Extérieur', value: props.awayLambda ?? null },
  ].filter(item => item.value != null) as Array<{ name: string; value: number }>

  if (marketData.length === 0 && xgData.length === 0) return null

  return (
    <section className="mb-8" aria-labelledby="match-analytics-title">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6A24C]">Signal analytics</p>
          <h2 id="match-analytics-title" className="mt-1 text-xl font-bold text-[#F3F7F5]">Lecture des données</h2>
        </div>
        <span className="text-right text-[10px] text-[#7F98A4]">Valeurs issues du modèle publié</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {marketData.length > 0 && (
          <div className="rounded-2xl border border-[#304951] bg-[#0D202D] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F3F7F5]">Probabilités par marché</h3>
              <span className="text-[10px] uppercase tracking-wider text-[#7F98A4]">0–100 %</span>
            </div>
            <div className="h-52" role="img" aria-label="Graphique des probabilités BTTS, Over 2.5 et score exact">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketData} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(127,162,198,0.08)' }} content={<TooltipContent />} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                    {marketData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#7F98A4]">Une probabilité n’est pas une garantie et ne remplace pas l’analyse du risque.</p>
          </div>
        )}

        {xgData.length > 0 && (
          <div className="rounded-2xl border border-[#304951] bg-[#0D202D] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F3F7F5]">Expected goals (xG)</h3>
              <span className="text-[10px] uppercase tracking-wider text-[#7F98A4]">projection</span>
            </div>
            <div className="h-52" role="img" aria-label="Graphique des expected goals de l'équipe à domicile et de l'équipe extérieure">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xgData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 'auto']} tick={{ fill: COLORS.slate, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(211,177,109,0.08)' }} content={<TooltipContent />} />
                  <Bar dataKey="value" fill={COLORS.gold} radius={[6, 6, 0, 0]} barSize={46} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-[#7F98A4]">
              <span>Total xG</span>
              <strong className="font-mono text-[#E6A24C]">{props.xgTotal?.toFixed(2) ?? '—'}</strong>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
