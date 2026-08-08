/**
 * Tests unitaires pour la bibliothèque matches.ts
 */
import { describe, test, expect } from 'vitest'
import {
  generateMatchSlug,
  loadAllMatches,
  getMatchBySlug,
  getAllMatchSlugs,
} from '@/lib/matches'

describe('generateMatchSlug', () => {
  test('produit un slug stable', () => {
    expect(generateMatchSlug('Arsenal', 'Chelsea', '2026-08-15')).toBe('arsenal-vs-chelsea-2026-08-15')
  })
  test('normalise les noms (supprime chiffres)', () => {
    expect(generateMatchSlug('1. FC Heidenheim 1846', 'VfL Osnabruck', '2026-08-08')).toBe('fc-heidenheim-vs-vfl-osnabruck-2026-08-08')
  })
  test('case insensitive', () => {
    expect(generateMatchSlug('PSV', 'Ajax', '2026-08-08')).toBe('psv-vs-ajax-2026-08-08')
    expect(generateMatchSlug('psv', 'AJAX', '2026-08-08')).toBe('psv-vs-ajax-2026-08-08')
  })
  test('fallback equipe si nom vide', () => {
    expect(generateMatchSlug('', 'Chelsea', '2026-08-15')).toBe('equipe-vs-chelsea-2026-08-15')
  })
})

describe('loadAllMatches', () => {
  test('retourne un Map', () => {
    const matches = loadAllMatches()
    expect(matches).toBeInstanceOf(Map)
  })
})

describe('getMatchBySlug', () => {
  test('retourne null pour slug inexistant', () => {
    const m = getMatchBySlug('nonexistent-slug-2026-01-01')
    expect(m).toBeNull()
  })
})

describe('getAllMatchSlugs', () => {
  test('retourne un tableau', () => {
    const slugs = getAllMatchSlugs()
    expect(Array.isArray(slugs)).toBe(true)
  })
})
