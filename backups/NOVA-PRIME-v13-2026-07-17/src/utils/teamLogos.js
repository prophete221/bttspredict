// ═══════════════════════════════════════════════════════════════
// BttsBet – Shared Team Logo Resolver
// Centralized country code map + logo resolver (flagcdn.com)
// Used by: FreePredictions, WinHistory, PromoVip
// ═══════════════════════════════════════════════════════════════

export const COUNTRY_CODE_MAP = {
  'argentina': 'ar', 'brazil': 'br', 'germany': 'de', 'france': 'fr',
  'spain': 'es', 'italy': 'it', 'england': 'gb-eng', 'portugal': 'pt',
  'netherlands': 'nl', 'belgium': 'be', 'croatia': 'hr', 'morocco': 'ma',
  'japan': 'jp', 'south korea': 'kr', 'united states': 'us', 'mexico': 'mx',
  'canada': 'ca', 'costa rica': 'cr', 'saudi arabia': 'sa',
  'iran': 'ir', 'iraq': 'iq', 'qatar': 'qa', 'uae': 'ae',
  'uruguay': 'uy', 'paraguay': 'py', 'colombia': 'co', 'ecuador': 'ec',
  'peru': 'pe', 'venezuela': 've', 'chile': 'cl', 'bolivia': 'bo',
  'tanzania': 'tz', 'rwanda': 'rw', 'senegal': 'sn', 'nigeria': 'ng',
  'ivory coast': 'ci', 'ghana': 'gh', 'cameroon': 'cm', 'egypt': 'eg',
  'tunisia': 'tn', 'algeria': 'dz', 'south africa': 'za',
  'scotland': 'gb-sct', 'wales': 'gb-wls', 'iceland': 'is',
  'sweden': 'se', 'norway': 'no', 'denmark': 'dk', 'finland': 'fi',
  'switzerland': 'ch', 'austria': 'at', 'czechia': 'cz', 'czech republic': 'cz',
  'poland': 'pl', 'romania': 'ro', 'hungary': 'hu', 'serbia': 'rs',
  'greece': 'gr', 'turkey': 'tr', 'türkiye': 'tr', 'russia': 'ru',
  'ukraine': 'ua', 'ireland': 'ie', 'bosnia-herzegovina': 'ba',
  'new zealand': 'nz', 'australia': 'au', 'haiti': 'ht',
  'cape verde': 'cv', 'curaçao': 'cw', 'suriname': 'sr',
  'jamaica': 'jm', 'panama': 'pa', 'honduras': 'hn',
  'guinea': 'gn', 'mali': 'ml', 'burkina faso': 'bf',
  'dr congo': 'cd', 'gabon': 'ga', 'congo': 'cg',
  'china': 'cn', 'thailand': 'th', 'vietnam': 'vn', 'india': 'in',
  'indonesia': 'id', 'malaysia': 'my', 'philippines': 'ph',
}

/**
 * Resolve a team name to a flagcdn.com logo URL.
 * Works for national teams — club teams return empty string.
 */
export function resolveTeamLogo(teamName) {
  if (!teamName) return ''
  const normalized = teamName.toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()

  // Direct match
  if (COUNTRY_CODE_MAP[normalized]) {
    return `https://flagcdn.com/w40/${COUNTRY_CODE_MAP[normalized]}.png`
  }

  // Partial match
  for (const [name, code] of Object.entries(COUNTRY_CODE_MAP)) {
    if (normalized.includes(name) || name.includes(normalized)) {
      return `https://flagcdn.com/w40/${code}.png`
    }
  }

  return ''
}
