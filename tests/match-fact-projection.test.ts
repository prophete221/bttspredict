import { describe, expect, it } from 'vitest'
import { projectGeminiKeyFact } from '../src/lib/match-fact-projection'

describe('projectGeminiKeyFact', () => {
  const record = {
    home: 'Manchester United',
    matchCountHome: 4,
    formHome: { goalsFor: 23, count: 4 },
    xgHome: 6.5,
    ai_key_fact: 'Manchester United a marqué 23 buts en 4 matchs pour une moyenne de 6.5 buts à domicile.',
    ai_key_fact_en: 'Manchester United scored 23 goals in 4 matches for an average of 6.5 goals at home.',
  }

  it('separates the observed average from the model projection in French and English', () => {
    expect(projectGeminiKeyFact(record, 'fr')).toBe(
      'Manchester United : 23 buts en 4 matchs (moyenne observée : 5,75 par match). Projection du modèle λ : 6,5.',
    )
    expect(projectGeminiKeyFact(record, 'en')).toBe(
      'Manchester United: 23 goals in 4 matches (observed average: 5.75 per match). Model projection λ: 6.5.',
    )
    expect(record.ai_key_fact).toContain('6.5')
  })

  it('preserves an unrelated key fact and a matching average claim', () => {
    expect(projectGeminiKeyFact({ ...record, ai_key_fact: 'The match is scheduled for 18:30.' }, 'fr'))
      .toBe('The match is scheduled for 18:30.')
    expect(projectGeminiKeyFact({ ...record, xgHome: 5.75 }, 'fr'))
      .toBe(record.ai_key_fact)
  })

  it('does not fall back to French when a localized key fact is missing', () => {
    expect(projectGeminiKeyFact({ ...record, ai_key_fact_en: undefined }, 'en')).toBeUndefined()
    expect(projectGeminiKeyFact(record, 'ar')).toBeUndefined()
  })
})
