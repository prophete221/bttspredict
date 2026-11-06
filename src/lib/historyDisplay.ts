type MarketHistoryEntry = {
  market?: unknown
  type?: unknown
}

function isBttsMarket(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '')
  return normalized === 'btts' || normalized === 'bothteamstoscore'
}

export function selectBttsHistory<T extends MarketHistoryEntry>(history: readonly T[]): T[] {
  return history.filter(entry => isBttsMarket(entry.type) || isBttsMarket(entry.market))
}
