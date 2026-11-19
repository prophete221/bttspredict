#!/usr/bin/env node
/**
 * Ancienne commande de pruning conservée pour compatibilité, désormais non destructive.
 * Les archives constituent l’historique source : aucune exécution automatique ne doit
 * les supprimer ou les tronquer.
 */
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARCHIVE_DIR = 'public/predictions-archive';
const THIS_FILE = fileURLToPath(import.meta.url);

function listArchiveFiles(archiveDir) {
  return readdirSync(archiveDir)
    .filter((file) => file.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort();
}

export function pruneArchives({ archiveDir = ARCHIVE_DIR } = {}) {
  const files = listArchiveFiles(archiveDir);
  console.log(`[prune-archives] Suppression désactivée : ${files.length} archive(s) conservée(s).`);
  return { deleted: [], preservedExisting: files.length, staleCandidates: [] };
}

if (process.argv[1] && resolve(process.argv[1]) === THIS_FILE) {
  try {
    pruneArchives();
  } catch (err) {
    console.error(`[prune-archives] Erreur : ${err.message}`);
    process.exitCode = 1;
  }
}
