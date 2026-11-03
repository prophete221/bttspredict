#!/usr/bin/env node
/**
 * ftp-diff.mjs — déploiement différentiel strict (bttspredict.com).
 *
 * Manifeste v2 :
 *   { version: 2, generatedAt, fileCount, totalBytes, files: { path: { hash, size } } }
 *
 * prepare [--require-prev]
 *   - génère out/deploy-manifest.json (v2)
 *   - compare au manifeste précédent out/deploy-manifest.prev.json
 *   - avec --require-prev : refuse si prev absent, version/schéma invalides
 *   - écrit out/deploy-list.txt (patterns lftp des fichiers modifiés/nouveaux)
 *   - écrit out/deploy-diff-stats.json (newPaths, changedPaths, bytesToAdd, ...)
 *
 * Ne produit JAMAIS une liste "tous les fichiers" par absence de prev.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'out')
const MANIFEST = path.join(OUT, 'deploy-manifest.json')
const PREV = path.join(OUT, 'deploy-manifest.prev.json')
const LIST = path.join(OUT, 'deploy-list.txt')
const STATS = path.join(OUT, 'deploy-diff-stats.json')
const SCHEMA_VERSION = 2

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function walk(dir, base = dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, base, acc)
    else if (entry.isFile()) acc.push(path.relative(base, full).split(path.sep).join('/'))
  }
  return acc
}

function buildManifest() {
  const files = walk(OUT).filter((f) =>
    !['deploy-manifest.json', 'deploy-manifest.prev.json', 'deploy-list.txt', 'deploy-diff-stats.json', 'remote-inventory.txt'].includes(f),
  )
  const manifest = {
    version: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    fileCount: 0,
    totalBytes: 0,
    files: {},
  }
  for (const rel of files) {
    const buf = fs.readFileSync(path.join(OUT, rel))
    manifest.files[rel] = {
      hash: createHash('sha256').update(buf).digest('hex').slice(0, 16),
      size: buf.length,
    }
    manifest.totalBytes += buf.length
  }
  manifest.fileCount = Object.keys(manifest.files).length
  return manifest
}

function validateManifest(obj, label) {
  if (!obj || typeof obj !== 'object') {
    return `${label}: not an object`
  }
  if (obj.version !== SCHEMA_VERSION) {
    return `${label}: version must be ${SCHEMA_VERSION} (got ${JSON.stringify(obj.version)})`
  }
  if (typeof obj.fileCount !== 'number' || obj.fileCount < 0) {
    return `${label}: invalid fileCount`
  }
  if (typeof obj.totalBytes !== 'number' || obj.totalBytes < 0) {
    return `${label}: invalid totalBytes`
  }
  if (!obj.files || typeof obj.files !== 'object') {
    return `${label}: missing files map`
  }
  const keys = Object.keys(obj.files)
  if (keys.length !== obj.fileCount) {
    return `${label}: fileCount ${obj.fileCount} != files map size ${keys.length}`
  }
  for (const [rel, meta] of Object.entries(obj.files)) {
    if (!meta || typeof meta.hash !== 'string' || typeof meta.size !== 'number') {
      return `${label}: invalid entry for ${rel}`
    }
  }
  return null
}

function cmdPrepare() {
  const requirePrev = process.argv.includes('--require-prev')
  if (!fs.existsSync(OUT)) {
    console.error('[ftp-diff] out/ introuvable — exécuter le build Next.js avant prepare.')
    process.exit(1)
  }
  const manifest = buildManifest()
  const localErr = validateManifest(manifest, 'local')
  if (localErr) {
    console.error(`[ftp-diff] ${localErr}`)
    process.exit(1)
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest))

  let prev = null
  try {
    prev = JSON.parse(fs.readFileSync(PREV, 'utf8'))
  } catch {
    prev = null
  }

  if (requirePrev) {
    if (!prev) {
      console.error('[ftp-diff] --require-prev: manifeste précédent absent — refus (pas d’upload complet).')
      process.exit(1)
    }
    const prevErr = validateManifest(prev, 'prev')
    if (prevErr) {
      console.error(`[ftp-diff] --require-prev: schéma invalide — ${prevErr}. Un manifeste historique non-v2 ne prouve pas le quota.`)
      process.exit(1)
    }
  }

  const prevFiles = prev?.files && typeof prev.files === 'object' ? prev.files : null
  const changed = []
  const newPaths = []
  const changedPaths = []
  let bytesToAdd = 0

  for (const [rel, meta] of Object.entries(manifest.files)) {
    if (!prevFiles || prevFiles[rel]?.hash !== meta.hash) {
      changed.push(rel)
      if (!prevFiles || !prevFiles[rel]) {
        newPaths.push(rel)
        bytesToAdd += meta.size
      } else {
        changedPaths.push(rel)
        // remplacement : compte la nouvelle taille (pire cas disque si l’ancien n’est pas libéré)
        bytesToAdd += meta.size
      }
    }
  }

  const patterns = changed.map((rel) => `^${escapeRe(rel)}$`)
  fs.writeFileSync(LIST, patterns.length ? patterns.join('\n') + '\n' : '')

  const stats = {
    schemaVersion: SCHEMA_VERSION,
    localFileCount: manifest.fileCount,
    localTotalBytes: manifest.totalBytes,
    prevFileCount: prevFiles ? Object.keys(prevFiles).length : null,
    prevTotalBytes: prev && typeof prev.totalBytes === 'number' ? prev.totalBytes : null,
    changedCount: changed.length,
    newPathCount: newPaths.length,
    changedPathCount: changedPaths.length,
    bytesToAdd,
    newPaths,
    changedPaths,
  }
  fs.writeFileSync(STATS, JSON.stringify(stats, null, 2))

  console.log(
    `[ftp-diff] ${changed.length}/${manifest.fileCount} à transférer ` +
      `(new=${newPaths.length}, changed=${changedPaths.length}, bytesToAdd=${bytesToAdd}) → ${LIST}`,
  )
}

function cmdFinish() {
  try {
    fs.copyFileSync(MANIFEST, PREV)
    console.log('[ftp-diff] manifeste courant copié → .prev')
  } catch (e) {
    console.error(`[ftp-diff] finish échoué: ${e.message}`)
    process.exitCode = 1
  }
}

const cmd = process.argv[2] || 'prepare'
if (cmd === 'prepare') cmdPrepare()
else if (cmd === 'finish') cmdFinish()
else {
  console.error('Usage: node scripts/ftp-diff.mjs [prepare|finish] [--require-prev]')
  process.exit(1)
}
