import fs from 'node:fs/promises'

const API_KEY = process.env.ODDS_API_KEY
const OUTPUT = 'public/vip-combos.json'
const API_BASE = 'https://api.odds-api.io/v3'
const TIME_ZONE = 'Africa/Dakar'
const BOOKMAKERS = process.env.ODDS_BOOKMAKERS || 'Bet365,Unibet'

function dakarDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function asDecimal(value) {
  const n = Number(value)
  return Number.isFinite(n) && n >= 1.01 && n <= 100 ? Number(n.toFixed(2)) : null
}

function extractLegs(event, oddsResponse) {
  const legs = []
  const bookmakers = oddsResponse?.bookmakers || {}
  for (const [bookmaker, markets] of Object.entries(bookmakers)) {
    for (const market of Array.isArray(markets) ? markets : []) {
      const marketName = String(market?.name || '').toLowerCase()
      const odds = Array.isArray(market?.odds) ? market.odds : []
      const isPeriodMarket = /(?:^|\s)(ht|1h|2h|half|period|first half|second half)(?:\s|$)/i.test(marketName)
      const isBttsMarket = marketName === 'btts' || marketName === 'both teams to score'
      const isTotalsMarket = marketName === 'totals' || marketName === 'total goals'
      if (isPeriodMarket || (!isBttsMarket && !isTotalsMarket)) continue
      for (const quote of odds) {
        let selection = null
        let price = null
        if (marketName.includes('btts') || marketName.includes('both teams')) {
          selection = quote.yes != null ? 'BTTS — Oui' : quote.no != null ? 'BTTS — Non' : null
          price = asDecimal(quote.yes ?? quote.no)
        } else if (isTotalsMarket) {
          const label = String(quote.label || '2.5')
          if (!/2[.,]5/.test(label) && !/over\s*2[.,]5/.test(marketName)) continue
          const over = quote.over ?? quote.Over
          if (over != null) { selection = 'Over 2.5'; price = asDecimal(over) }
        }
        if (selection && price) {
          legs.push({
            eventId: String(event.id), home: event.home, away: event.away,
            league: event.league?.name || event.league?.slug || 'Football',
            kickoff: event.date, bookmaker, market: market.name, selection,
            odds: price, source: 'Odds-API.io', updatedAt: market.updatedAt || oddsResponse.updatedAt || new Date().toISOString(),
          })
        }
      }
    }
  }
  const unique = new Map()
  for (const leg of legs) unique.set(`${leg.eventId}:${leg.bookmaker}:${leg.market}:${leg.selection}`, leg)
  return [...unique.values()]
}

function chooseCombo(legs, target) {
  const min = target === 2 ? 1.85 : 4.5
  const max = target === 2 ? 2.2 : 5.5
  const maxLegs = target === 2 ? 4 : 6
  let best = null
  function walk(start, chosen, product) {
    if (chosen.length >= 2 && product >= min && product <= max) {
      const score = Math.abs(product - target) + chosen.length * 0.01
      if (!best || score < best.score) best = { legs: [...chosen], totalOdds: Number(product.toFixed(2)), score }
      return
    }
    if (chosen.length >= maxLegs || product > max) return
    for (let i = start; i < legs.length; i++) {
      if (chosen.some(x => x.eventId === legs[i].eventId)) continue
      walk(i + 1, [...chosen, legs[i]], product * legs[i].odds)
    }
  }
  walk(0, [], 1)
  if (!best) return null
  const { score, ...combo } = best
  return combo
}

async function getJson(url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } })
  if (!response.ok) throw new Error(`Odds API HTTP ${response.status}`)
  return response.json()
}

async function writeUnavailable(reason) {
  await fs.writeFile(OUTPUT, `${JSON.stringify({ date: dakarDate(), timezone: TIME_ZONE, source: 'Odds-API.io', fetchedAt: new Date().toISOString(), status: 'unavailable', reason, combos: { target2: null, target5: null } }, null, 2)}\\n`)
}

async function main() {
  const today = dakarDate()
  if (!API_KEY) {
    console.warn('[vip-combos] ODDS_API_KEY absent — no combo published')
    await writeUnavailable('missing_api_key')
    return
  }
  const from = `${today}T00:00:00Z`
  const to = `${today}T23:59:59Z`
  const events = await getJson(`${API_BASE}/events?apiKey=${encodeURIComponent(API_KEY)}&sport=football&status=pending&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&limit=100`)
  const eventList = Array.isArray(events) ? events : events?.events || []
  // Odds-API.io is the source of truth for event identity here. ESPN and bookmaker
  // names are not stable enough for an exact join; filtering by ESPN caused events=0.
  const candidates = eventList.filter(e => e?.id && e?.home && e?.away && e?.date)
  const legs = []
  for (const event of candidates.slice(0, 40)) {
    try {
      const data = await getJson(`${API_BASE}/odds?apiKey=${encodeURIComponent(API_KEY)}&eventId=${encodeURIComponent(event.id)}&bookmakers=${encodeURIComponent(BOOKMAKERS)}`)
      legs.push(...extractLegs(event, data))
    } catch (error) { console.warn(`[vip-combos] odds unavailable for ${event.home} vs ${event.away}: ${error.message}`) }
  }
  const payload = {
    date: today, timezone: TIME_ZONE, source: 'Odds-API.io', fetchedAt: new Date().toISOString(),
    eventCount: candidates.length, legCount: legs.length,
    status: 'available', combos: { target2: chooseCombo(legs, 2), target5: chooseCombo(legs, 5) },
  }
  if (!payload.combos.target2 || !payload.combos.target5) payload.status = 'insufficient_verified_odds'
  await fs.writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`[vip-combos] ${payload.status}; events=${candidates.length}; legs=${legs.length}`)
}

main().catch(async error => {
  console.error(`[vip-combos] fatal: ${error.message}`)
  try { await writeUnavailable('provider_request_failed') } catch {}
  process.exit(1)
})
