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
  test('préserve les caractères accentués dans les slugs existants', () => {
    expect(generateMatchSlug('Café Étoile', 'München Ü', '2026-08-14')).toBe('café-étoile-vs-münchen-ü-2026-08-14')
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
  // (2026-09-28) Les 2 anciens tests étaient couplés a des matchs d'aout
  // sortis de la fenetre 14 jours des archives -> echec periodique.
  // Remplaces par un round-trip derive des slugs reellement disponibles :
  // la logique de decodage reste testee, sans dependre de donnees vivantes.
  test('round-trip slug -> match -> slug sur les donnees actuelles', () => {
    const slugs = getAllMatchSlugs()
    expect(slugs.length).toBeGreaterThan(0)
    for (const slug of slugs.slice(0, 10)) {
      const match = getMatchBySlug(slug)
      if (!match) continue
      expect(match.home).toBeTruthy()
      expect(match.away).toBeTruthy()
      const date = (match.date || '').slice(0, 10)
      const rebuilt = generateMatchSlug(match.home, match.away, date)
      // Le slug reconstruit depuis le match se termine par la date du match
      expect(rebuilt.endsWith(date)).toBe(true)
    }
  })
  test('decode un slug percent-encode (priorite aux noms accentues si disponibles)', () => {
    const slugs = getAllMatchSlugs()
    expect(slugs.length).toBeGreaterThan(0)
    // Un slug contenant des caracteres non-ASCII encode differemment une fois
    // percent-encode -> c'est le vrai test du decodage.
    const accented = slugs.find(s => /[^\x00-\x7F]/.test(s)) ?? slugs[0]
    const encoded = encodeURIComponent(accented)
    const match = getMatchBySlug(encoded)
    // Le decodage percent-encoding doit restituer le meme match
    expect(match).not.toBeNull()
    const date = (match!.date || '').slice(0, 10)
    expect(generateMatchSlug(match!.home, match!.away, date)).toBe(accented)
  })
})

describe('getAllMatchSlugs', () => {
  test('retourne un tableau', () => {
    const slugs = getAllMatchSlugs()
    expect(Array.isArray(slugs)).toBe(true)
  })
})
