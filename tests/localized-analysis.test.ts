import { describe, expect, it } from 'vitest'
import { selectLocalizedAnalysis } from '../src/lib/localized-analysis'

describe('selectLocalizedAnalysis', () => {
  it('uses only the text available for the selected locale', () => {
    expect(selectLocalizedAnalysis('Analyse française', 'English analysis', 'fr')).toBe('Analyse française')
    expect(selectLocalizedAnalysis('Analyse française', 'English analysis', 'en')).toBe('English analysis')
  })

  it('does not fall back to French when the English translation is missing', () => {
    expect(selectLocalizedAnalysis('Analyse française', undefined, 'en')).toBeUndefined()
  })

  it('does not show an untranslated analysis on Arabic surfaces', () => {
    expect(selectLocalizedAnalysis('Analyse française', 'English analysis', 'ar')).toBeUndefined()
  })
})
