import { describe, expect, it } from 'vitest'
import { ARABIC_PROMO_PATHS } from '../scripts/prune-arabic-nonpromo.mjs'
import {
  buildArabicAllowlistChecks,
  LEGACY_AR_MATCH_SLUGS,
  verifyArabicPromoAllowlist,
} from '../scripts/verify-arabic-promo-allowlist-live.mjs'

function response(status: number, url: string) {
  return {
    status,
    url,
    headers: { get: () => 'text/html; charset=utf-8' },
  }
}

describe('vérification live de l’allowlist arabe', () => {
  it('contrôle exactement les cinq promos et bloque les routes racines et historiques', () => {
    const checks = buildArabicAllowlistChecks()
    const allowed = checks.filter(check => check.kind === 'allowed-promo')
    const forbidden = checks.filter(check => check.kind === 'forbidden-route')

    expect(allowed.map(check => check.path).sort()).toEqual([...ARABIC_PROMO_PATHS].map(route => `/ar${route}`).sort())
    expect(allowed.every(check => check.expectedStatus === 200)).toBe(true)
    expect(forbidden).toHaveLength(8 + LEGACY_AR_MATCH_SLUGS.length)
    expect(forbidden.every(check => check.expectedStatus === 404)).toBe(true)
    expect(forbidden.map(check => check.path)).toContain('/ar')
    expect(forbidden.map(check => check.path)).toContain('/ar/')
    expect(forbidden.map(check => check.path)).toContain('/ar.html')
    expect(forbidden.map(check => check.path)).toContain('/ar/vip')
    expect(forbidden.map(check => check.path)).toContain('/ar/match/troyes-vs-le-havre-ac-2026-11-20')
  })

  it('réussit uniquement si les promos répondent 200 HTML et les autres routes 404', async () => {
    const checks = buildArabicAllowlistChecks()
    const expected = new Map(checks.map(check => [`https://example.test${check.path}`, check.expectedStatus]))
    const report = await verifyArabicPromoAllowlist({
      base: 'https://example.test/',
      fetchImpl: (async (url: string) => response(expected.get(url) ?? 500, url)) as unknown as typeof fetch,
      retryDelayMs: 0,
    })

    expect(report.outcome).toBe('verified')
    expect(report.allowedPromoCount).toBe(5)
    expect(report.routeCount).toBe(5 + 8 + LEGACY_AR_MATCH_SLUGS.length)
    expect(report.failedCount).toBe(0)
  })

  it('bloque la publication si une route interdite répond encore 200', async () => {
    const checks = buildArabicAllowlistChecks()
    const expected = new Map(checks.map(check => [`https://example.test${check.path}`, check.expectedStatus]))
    expected.set('https://example.test/ar', 200)
    const report = await verifyArabicPromoAllowlist({
      base: 'https://example.test',
      fetchImpl: (async (url: string) => response(expected.get(url) ?? 500, url)) as unknown as typeof fetch,
      retryDelayMs: 0,
    })

    expect(report.outcome).toBe('blocked')
    expect(report.failedCount).toBe(1)
    expect(report.results.find(result => result.path === '/ar')?.ok).toBe(false)
  })
})
