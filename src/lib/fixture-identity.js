function normalizeFixturePart(value) {
  return String(value ?? '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

/**
 * Canonical identity shared by the public-feed filter and prediction cards.
 * A match label alone is not enough: clubs can have the same names in different
 * competitions or on different dates.
 */
export function publicFixtureKey(row) {
  if (!row || typeof row !== 'object') return null

  const date = String(row.date ?? '').trim()
  const league = normalizeFixturePart(row.league)
  const home = normalizeFixturePart(row.home)
  const away = normalizeFixturePart(row.away)

  return date && league && home && away
    ? `${date}|${league}|${home}|${away}`
    : null
}
