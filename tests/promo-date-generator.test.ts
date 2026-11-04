import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const script = path.resolve('scripts/update-promo-dates.mjs')
const tempRoots: string[] = []

function run(date: string, output: string) {
  return execFileSync(process.execPath, [script, `--date=${date}`, `--output=${output}`], {
    cwd: path.resolve('.'), encoding: 'utf8',
  })
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('mise à jour ciblée des dates promo', () => {
  it('génère uniquement la date de revue et son année depuis une date de build Dakar', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'promo-date-'))
    tempRoots.push(root)
    const output = path.join(root, 'promo-build-date.generated.ts')
    expect(run('2027-01-02', output)).toContain('date Dakar=2027-01-02; année=2027')
    expect(readFileSync(output, 'utf8')).toContain("export const PROMO_REVIEW_DATE = '2027-01-02'")
    expect(readFileSync(output, 'utf8')).toContain('export const PROMO_CURRENT_YEAR = 2027')
  })

  it('refuse une date civile impossible sans écraser le module existant', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'promo-date-invalid-'))
    tempRoots.push(root)
    const output = path.join(root, 'promo-build-date.generated.ts')
    run('2026-11-04', output)
    expect(() => run('2026-02-30', output)).toThrow()
    expect(readFileSync(output, 'utf8')).toContain("export const PROMO_REVIEW_DATE = '2026-11-04'")
  })
})
