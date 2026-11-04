import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  buildSafeStateSeed,
  chooseBaseState,
  normalizeStatePath,
  parseMatchListing,
  parseActionState,
} from '../scripts/prepare-ftp-deploy-plan.mjs'

describe('FTP-Deploy safe state', () => {
  const baseState = {
    version: '1.0.0',
    data: [
      { type: 'file', name: './index.html', size: 100, hash: 'home-hash' },
      { type: 'file', name: './.htaccess', size: 12, hash: 'htaccess-hash' },
      { type: 'file', name: './robots.txt', size: 80, hash: 'old-robots' },
      { type: 'file', name: './sitemap.xml', size: 300, hash: 'old-sitemap' },
      { type: 'file', name: './en/match/finished-team-vs-other-2026-10-01.html', size: 45, hash: 'old-match' },
      { type: 'file', name: './unrelated-remote.json', size: 50, hash: 'unrelated' },
      { type: 'folder', name: './en' },
      { type: 'folder', name: './en/match' },
      { type: 'folder', name: './unused-remote-dir' },
    ],
  }
  const manifest = {
    files: {
      'index.html': { hash: 'new-home', size: 120 },
      '.htaccess': { hash: 'htaccess-hash', size: 12 },
      'robots.txt': { hash: 'new-robots', size: 90 },
      'sitemap.xml': { hash: 'new-sitemap', size: 350 },
      'en/match/current-team-vs-other-2026-11-05.html': { hash: 'current', size: 70 },
    },
  }

  it('keeps only paths still in the build and forces robots/sitemap to upload', () => {
    const { state, report } = buildSafeStateSeed(baseState, manifest)
    const names = state.data.map((entry: { name: string }) => normalizeStatePath(entry.name))
    expect(names).toContain('index.html')
    expect(names).toContain('.htaccess')
    expect(names).toContain('en')
    expect(names).toContain('en/match')
    expect(names).not.toContain('robots.txt')
    expect(names).not.toContain('sitemap.xml')
    expect(names).not.toContain('en/match/finished-team-vs-other-2026-10-01.html')
    expect(names).not.toContain('unrelated-remote.json')
    expect(names).not.toContain('unused-remote-dir')
    expect(report.droppedRemoteOnlyRecordCount).toBe(3)
    expect(report.forcedUploadStateRecordCount).toBe(2)
    expect(report.forcedUploadPaths).toEqual(['robots.txt', 'sitemap.xml'])
    expect(report.policy).toContain('aucun fichier distant absent du build ne peut être supprimé')
  })

  it('rejects malformed or path-traversing state rather than falling back to a full sync', () => {
    expect(() => parseActionState({ version: '2', data: [] })).toThrow(/version 1.0.0/)
    expect(() => normalizeStatePath('../outside.txt')).toThrow(/dangereux/)
    expect(() => parseActionState({
      version: '1.0.0',
      data: [{ type: 'file', name: '../outside.txt', size: 1, hash: 'x' }],
    })).toThrow(/dangereux/)
    expect(() => parseActionState({
      version: '1.0.0',
      data: [{ type: 'file', name: '_next/bad.js', size: 'not-a-size', hash: 'x' }],
    })).toThrow(/taille invalide/)
  })

  it('accepts and canonicalizes FTP-Deploy folder entries such as _next without file size/hash', () => {
    const rawState = {
      version: '1.0.0',
      data: [
        { type: 'folder', name: '_next' },
        { type: 'folder', name: '_next/static', size: 'not-a-file-size', hash: 'folder-hash' },
        { type: 'file', name: '_next/static/chunks/turbopack.js', size: 10, hash: 'chunk-hash' },
      ],
    }
    const parsed = parseActionState(rawState)
    expect(parsed.data).toEqual([
      { type: 'folder', name: '_next' },
      { type: 'folder', name: '_next/static' },
      { type: 'file', name: '_next/static/chunks/turbopack.js', size: 10, hash: 'chunk-hash' },
    ])
    expect(rawState.data[1]).toEqual({ type: 'folder', name: '_next/static', size: 'not-a-file-size', hash: 'folder-hash' })

    const currentManifest = {
      files: {
        ...manifest.files,
        '_next/static/chunks/turbopack.js': { hash: 'chunk-hash', size: 10 },
      },
    }
    const { state: seed } = buildSafeStateSeed(parsed, currentManifest)
    expect(seed.data).toContainEqual({ type: 'folder', name: '_next' })
    expect(seed.data).toContainEqual({ type: 'folder', name: '_next/static' })
    expect(seed.data).toContainEqual({ type: 'file', name: '_next/static/chunks/turbopack.js', size: 10, hash: 'chunk-hash' })
  })

  it('normalizes only HTML paths from the requested live locale directory', () => {
    expect(parseMatchListing([
      'en/match/old-team-vs-other-2026-10-01.html',
      'nested/current-team-vs-other-2026-11-05/index.html',
      'en/match/assets/logo.svg',
      'en/match/archive/',
    ].join('\n'), 'en')).toEqual([
      'en/match/nested/current-team-vs-other-2026-11-05/index.html',
      'en/match/old-team-vs-other-2026-10-01.html',
    ])
    expect(() => parseMatchListing('ar/match/other-2026-10-01.html', 'en')).toThrow(/autre locale/)
    expect(() => parseMatchListing('550 Access failed', 'ar')).toThrow(/listing ar\/match invalide/i)
  })

  it('rejects a local manifest that omits a required protected-root upload', () => {
    const incomplete = { files: { 'index.html': { hash: 'x', size: 1 }, '.htaccess': { hash: 'x', size: 1 }, 'robots.txt': { hash: 'x', size: 1 } } }
    expect(() => buildSafeStateSeed(baseState, incomplete)).toThrow(/sitemap.xml/)
  })

  it('uses legacy state when safe is absent and fails closed with an explicit error if both are absent', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bttspredict-ftp-state-'))
    const safe = path.join(dir, '.ftp-deploy-sync-state-safe.json')
    const legacy = path.join(dir, '.ftp-deploy-sync-state.json')
    const valid = JSON.stringify({ version: '1.0.0', data: [] })
    try {
      fs.writeFileSync(legacy, valid)
      expect(chooseBaseState(safe, legacy).source).toBe('legacy')
      fs.writeFileSync(safe, valid)
      expect(chooseBaseState(safe, legacy).source).toBe('safe')
      fs.rmSync(safe)
      fs.rmSync(legacy)
      expect(() => chooseBaseState(safe, legacy)).toThrow(/ni \.ftp-deploy-sync-state-safe\.json ni \.ftp-deploy-sync-state\.json.*avant tout transfert et toute suppression/)
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
})
