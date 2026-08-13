export const DAKAR_TIME_ZONE = 'Africa/Dakar'

function getDateParts(date: Date): { year: string; month: string; day: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: DAKAR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return {
    year: values.year,
    month: values.month,
    day: values.day,
  }
}

/** Retourne la date métier courante au format ISO dans le fuseau Africa/Dakar. */
export function getDakarDateString(now = new Date()): string {
  const { year, month, day } = getDateParts(now)
  return `${year}-${month}-${day}`
}

/**
 * Convertit une date et une heure de calendrier Africa/Dakar en instant.
 * Dakar est UTC+0 ; Date.UTC conserve donc exactement le calendrier métier.
 */
export function parseDakarDateTime(date: string, time = '12:00'): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  if (month < 1 || month > 12 || day < 1 || day > 31 || hours > 23 || minutes > 59) return null

  const result = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0))
  return Number.isNaN(result.getTime()) ? null : result
}

export function formatDakarDateLabel(date: string, now = new Date()): string {
  const today = getDakarDateString(now)
  const match = parseDakarDateTime(date)
  if (!match) return '--:--'

  const diffDays = Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000)
  if (diffDays === 0) return 'Auj.'
  if (diffDays === 1) return 'Dem.'

  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: DAKAR_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
  }).format(match)
}

export function getDakarDateSeed(now = new Date()): number {
  return Number(getDakarDateString(now).replaceAll('-', ''))
}
