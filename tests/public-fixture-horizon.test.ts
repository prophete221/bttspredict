import { describe, expect, test } from 'vitest'
import {
  buildDateParams,
  FALLBACK_FUTURE_DAYS,
  FUTURE_DAYS,
  getTodayISO,
  shouldExtendPublicHorizon,
} from '../scripts/quick-update-predictions.mjs'

describe('public ESPN fixture horizon', () => {
  test('scans J0–J+6 first and J+7–J+15 only as the extension', () => {
    const baseDate = new Date('2026-11-09T12:00:00.000Z')
    const primary = buildDateParams(0, FUTURE_DAYS, baseDate)
    const extension = buildDateParams(FUTURE_DAYS, FALLBACK_FUTURE_DAYS - FUTURE_DAYS, baseDate)

    expect(primary).toHaveLength(7)
    expect(primary[0]).toBe('20261109')
    expect(primary.at(-1)).toBe('20261115')
    expect(extension).toHaveLength(9)
    expect(extension[0]).toBe('20261116')
    expect(extension.at(-1)).toBe('20261124')
    expect(new Set([...primary, ...extension]).size).toBe(16)
  })

  test('extends only when the public primary window has zero fixtures', () => {
    expect(shouldExtendPublicHorizon(0, false)).toBe(true)
    expect(shouldExtendPublicHorizon(1, false)).toBe(false)
    expect(shouldExtendPublicHorizon(0, true)).toBe(false)
  })

  test('uses the same Dakar date for today and ESPN ranges at midnight', () => {
    const beforeDakarMidnight = new Date('2026-11-09T23:59:59.999Z')
    const afterDakarMidnight = new Date('2026-11-10T00:00:00.001Z')
    expect(getTodayISO(beforeDakarMidnight)).toBe('2026-11-09')
    expect(buildDateParams(0, 1, beforeDakarMidnight)).toEqual(['20261109'])
    expect(getTodayISO(afterDakarMidnight)).toBe('2026-11-10')
    expect(buildDateParams(0, 1, afterDakarMidnight)).toEqual(['20261110'])
  })
})
