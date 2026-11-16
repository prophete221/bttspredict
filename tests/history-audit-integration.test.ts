import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getWinHistory } from '../src/app/historique/getWinHistory'

function protectedSourceHashes() {
  return [
    '../public/win-history.json',
    '../public/history-exclusions.json',
    '../public/predictions-archive/2026-11-01.json',
  ].map(file => createHash('sha256').update(readFileSync(resolve(__dirname, file))).digest('hex'))
}

describe('read-only history projection boundary', () => {
  it('leaves historical source files untouched and does not add a reviewStatus field', () => {
    const before = protectedSourceHashes()
    const data = getWinHistory()

    expect(data).not.toBeNull()
    expect(data?.geminiOnly).toBe(true)
    expect(Array.isArray(data?.history)).toBe(true)
    expect(data?.history.every((row: Record<string, unknown>) => row.ai_source === 'gemini-stats-v1' && row.ai_abstain === false && row.ai_model === 'gemini-3.5-flash-lite' && row.ai_response_status === 'pick' && row.modelEngine === 'gemini-stats-v1')).toBe(true)
    expect(JSON.stringify(data?.history)).not.toMatch(/"(?:proba|confidence|xgHome|xgAway|xgTotal|homeLambda|awayLambda)"/)
    expect((data?.historyReviewRows || []).some((row: Record<string, unknown>) => 'reviewStatus' in row)).toBe(false)
    expect(protectedSourceHashes()).toEqual(before)
  })
})
