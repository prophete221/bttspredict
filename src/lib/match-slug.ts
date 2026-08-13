/**
 * Client-safe match slug helpers.
 * Keep filesystem-backed match loading in matches.ts only.
 */

function normalizeTeamName(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/\d+/g, '')
    .replace(/[^a-zà-ÿ\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'equipe'
}

export function generateMatchSlug(home: string, away: string, date: string): string {
  const h = normalizeTeamName(home)
  const a = normalizeTeamName(away)
  const d = (date || '').slice(0, 10)
  return `${h}-vs-${a}-${d}`
}
