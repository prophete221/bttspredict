import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { pruneArchives } from '../scripts/prune-archives.mjs'

const temporaryRoots: string[] = []

function createArchiveSet(count = 125) {
  const root = mkdtempSync(path.join(tmpdir(), 'bttspredict-archive-retention-'))
  temporaryRoots.push(root)
  const archiveDir = path.join(root, 'predictions-archive')
  mkdirSync(archiveDir, { recursive: true })
  const files: string[] = []

  for (let index = 0; index < count; index += 1) {
    const day = new Date(Date.UTC(2026, 0, 1 + index)).toISOString().slice(0, 10)
    const name = `${day}.json`
    files.push(name)
    writeFileSync(path.join(archiveDir, name), `${JSON.stringify({ date: day, fixture: `archive-${index}` })}\n`)
  }

  return { archiveDir, files }
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('conservation des archives de prédictions', () => {
  it('ne supprime ni ne modifie aucune archive, même au-delà de 90 fichiers', () => {
    const { archiveDir, files } = createArchiveSet()
    const originalContents = new Map(files.map(name => [name, readFileSync(path.join(archiveDir, name))]))

    const result = pruneArchives({ archiveDir })

    expect(result).toEqual({ deleted: [], preservedExisting: 125, staleCandidates: [] })
    expect(readdirSync(archiveDir).sort()).toEqual(files)
    for (const [name, bytes] of originalContents) {
      expect(readFileSync(path.join(archiveDir, name)).equals(bytes)).toBe(true)
    }
  })

  it('désactive le pruning automatique et vérifie l’inventaire avant/après le run', () => {
    const workflow = readFileSync(path.resolve(process.cwd(), '.github/workflows/deploy.yml'), 'utf8')
    const inventoryStart = workflow.indexOf('name: Verify complete prediction archive inventory before refresh')
    const setupStart = workflow.indexOf('- name: Setup Node.js', inventoryStart)
    const deletionGuardStart = workflow.indexOf('name: Prevent deletion of existing prediction archives')
    const commitStart = workflow.indexOf('- name: Commit data', deletionGuardStart)
    const inventoryBlock = workflow.slice(inventoryStart, setupStart)
    const deletionGuardBlock = workflow.slice(deletionGuardStart, commitStart)

    expect(inventoryStart).toBeGreaterThanOrEqual(0)
    expect(inventoryStart).toBeLessThan(setupStart)
    expect(deletionGuardStart).toBeGreaterThanOrEqual(0)
    expect(deletionGuardStart).toBeLessThan(commitStart)
    expect(inventoryBlock).toContain("git ls-files -- 'public/predictions-archive/*.json'")
    expect(inventoryBlock).toContain('find public/predictions-archive')
    expect(deletionGuardBlock).toContain('git diff --name-only --diff-filter=D HEAD -- public/predictions-archive/')
    expect(workflow).not.toContain('Prune old predictions archives (keep 90)')
    expect(workflow).not.toContain('run: node scripts/prune-archives.mjs')
  })
})
