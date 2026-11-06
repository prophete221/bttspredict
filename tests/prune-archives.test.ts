import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { pruneArchives } from '../scripts/prune-archives.mjs'

const temporaryRoots: string[] = []

function createArchiveSet(count = 91) {
  const root = mkdtempSync(path.join(tmpdir(), 'bttspredict-archive-prune-'))
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

describe('pruning des archives de prédictions', () => {
  it('préserve et vérifie toutes les archives présentes au début du déploiement protégé', () => {
    const { archiveDir, files } = createArchiveSet(91)
    const originalContents = new Map(files.map((name) => [name, readFileSync(path.join(archiveDir, name))]))

    const result = pruneArchives({ archiveDir, preserveExisting: true })

    expect(result.deleted).toEqual([])
    expect(result.preservedExisting).toBe(91)
    expect(result.staleCandidates).toEqual([files[0]])
    expect(readdirSync(archiveDir).sort()).toEqual(files)
    for (const [name, bytes] of originalContents) {
      expect(readFileSync(path.join(archiveDir, name)).equals(bytes)).toBe(true)
    }
  })

  it('garde le pruning KEEP=90 actif quand le mode protecteur de ce run n’est pas demandé', () => {
    const { archiveDir, files } = createArchiveSet(91)

    const result = pruneArchives({ archiveDir })

    expect(result.deleted).toEqual([files[0]])
    expect(readdirSync(archiveDir).sort()).toEqual(files.slice(1))
  })

  it('active la protection et son contrôle avant tout setup ou mise à jour du run complet', () => {
    const workflow = readFileSync(path.resolve(process.cwd(), '.github/workflows/deploy.yml'), 'utf8')
    const pruneStart = workflow.indexOf('name: Prune old predictions archives')
    const verifyStart = workflow.indexOf('name: Verify existing prediction archives remain intact')
    const setupStart = workflow.indexOf('- name: Setup Node.js', verifyStart)
    const pruneBlock = workflow.slice(pruneStart, verifyStart)
    const verifyBlock = workflow.slice(verifyStart, setupStart)

    expect(pruneStart).toBeGreaterThanOrEqual(0)
    expect(pruneStart).toBeLessThan(verifyStart)
    expect(verifyStart).toBeLessThan(setupStart)
    expect(pruneBlock).toContain("PRESERVE_EXISTING_ARCHIVES: ${{ github.event_name == 'push' && contains(github.event.head_commit.message, '[preserve-archives]') }}")
    expect(pruneBlock).toContain('run: node scripts/prune-archives.mjs')
    expect(verifyBlock).toContain('git diff --quiet HEAD -- public/predictions-archive/')
    expect(verifyBlock).toContain("git ls-files -- 'public/predictions-archive/*.json'")
    expect(verifyBlock).toContain('find public/predictions-archive')
    expect((workflow.match(/\[preserve-archives\]/g) ?? [])).toHaveLength(2)
  })
})
