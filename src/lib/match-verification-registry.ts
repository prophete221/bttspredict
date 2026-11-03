import { z } from 'zod'

const DATE = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const CLOCK = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
const IANA_TIME_ZONE = z.string().refine(value => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value })
    return true
  } catch {
    return false
  }
}, 'Expected a valid IANA time-zone identifier')

const MatchVerificationRecordSchema = z.object({
  id: z.string().min(1),
  matchDate: DATE,
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  competition: z.string().min(1),
  source: z.string().min(1),
  sourceUrl: z.string().url(),
  result: z.object({
    homeGoals: z.number().int().nonnegative(),
    awayGoals: z.number().int().nonnegative(),
    display: z.string().min(1),
  }).strict().superRefine((result, ctx) => {
    if (result.display !== `${result.homeGoals}-${result.awayGoals}`) {
      ctx.addIssue({ code: 'custom', message: 'Display score must match the structured score' })
    }
  }),
  verifiedAt: z.string().datetime(),
  status: z.enum(['pending', 'verified', 'disputed', 'rejected']),
  kickoff: z.object({ time: CLOCK, timeZone: IANA_TIME_ZONE }).strict(),
  snapshot: z.object({ time: CLOCK.nullable(), timeZone: IANA_TIME_ZONE.nullable() }).strict(),
  display: z.object({ time: CLOCK, timeZone: IANA_TIME_ZONE }).strict(),
}).strict()

export const MatchVerificationRegistrySchema = z.object({
  schemaVersion: z.literal(1),
  records: z.array(MatchVerificationRecordSchema).superRefine((records, ctx) => {
    const seen = new Set<string>()
    records.forEach((record, index) => {
      if (seen.has(record.id)) {
        ctx.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate match verification id: ${record.id}` })
      }
      seen.add(record.id)
    })
  }),
}).strict()

export type MatchVerificationRecord = z.infer<typeof MatchVerificationRecordSchema>
