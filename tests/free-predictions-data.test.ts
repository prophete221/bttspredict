import { describe, expect, it } from 'vitest'
import { parseMatchesPayload } from '@/components/bttsbet/FreePredictions'
import { GEMINI_MODEL_ID } from '@/lib/gemini-predictions'

function pick(market: 'BTTS' | 'Over 2.5', date = '2026-11-16', time = '14:00', selection = 'Oui') {
  const proba = market === 'BTTS' ? 0.64 : 0.61
  return {
    match: 'Alpha vs Beta', home: 'Alpha', away: 'Beta', league: 'Test League', date, time,
    ai_source: 'gemini-stats-v1', ai_abstain: false, ai_model: GEMINI_MODEL_ID,
    ai_response_status: 'pick', ai_market: market === 'BTTS' ? 'BTTS' : 'O2.5',
    modelEngine: 'gemini-stats-v1', type: market, prediction: selection, proba,
    predictions: [{ modelEngine: GEMINI_MODEL_ID, type: market, prediction: selection, proba }],
  }
}

const NOW = new Date('2026-11-16T12:00:00.000Z')

describe('FreePredictions public feed parser', () => {
  it('merges complementary Gemini markets from both public arrays', () => {
    const rows = parseMatchesPayload({ free: [pick('BTTS')], predictions: [pick('Over 2.5')] }, NOW)
    expect(rows).toHaveLength(1)
    expect(rows[0].predictions.map(item => item.market)).toEqual(['BTTS', 'O2.5'])
  })

  it('withdraws a conflicting market instead of keeping the first array entry', () => {
    const rows = parseMatchesPayload({ free: [pick('BTTS')], predictions: [pick('BTTS', '2026-11-16', '14:00', 'Non')] }, NOW)
    expect(rows).toEqual([])
  })

  it('keeps distinct kick-off times separate and removes fixtures that have already started today', () => {
    const rows = parseMatchesPayload({ free: [pick('BTTS', '2026-11-16', '14:00'), pick('BTTS', '2026-11-16', '11:00')] }, NOW)
    expect(rows).toHaveLength(1)
    expect(rows[0].time).toBe('14:00')
  })

  it('does not impose a J+7 or 12-item cap on validated future picks', () => {
    const far = Array.from({ length: 15 }, (_, index) => ({
      ...pick('BTTS', `2026-12-${String(index + 1).padStart(2, '0')}`, '18:00'),
      home: `Home ${index}`, away: `Away ${index}`, match: `Home ${index} vs Away ${index}`,
    }))
    const rows = parseMatchesPayload({ free: far }, NOW)
    expect(rows).toHaveLength(15)
    expect(rows.at(-1)?.date).toBe('2026-12-15')
  })
})
