export type PredictionMarketFilter = 'all' | 'btts' | 'over25' | 'combined'

type MarketRow = { predictions?: readonly { type?: string; market?: string }[] }

function marketsOf(row: MarketRow): Set<'btts' | 'over25'> {
  const markets = new Set<'btts' | 'over25'>()
  for (const pick of row.predictions ?? []) {
    const value = `${pick.market ?? ''} ${pick.type ?? ''}`.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (value.includes('btts') || value.includes('both')) markets.add('btts')
    if (value.includes('o25') || value.includes('over25')) markets.add('over25')
  }
  return markets
}

export function filterPredictionsByMarket<T extends MarketRow>(rows: readonly T[], filter: PredictionMarketFilter): T[] {
  if (filter === 'all') return [...rows]
  return rows.filter(row => {
    const markets = marketsOf(row)
    if (filter === 'combined') return markets.has('btts') && markets.has('over25')
    return markets.has(filter)
  })
}
