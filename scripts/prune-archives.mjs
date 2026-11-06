#!/usr/bin/env node
/**
 * Prune les archives de prédictions : conserve normalement les 90 fichiers les plus récents.
 *
 * Pour un déploiement complet explicitement autorisé à préserver son inventaire,
 * PRESERVE_EXISTING_ARCHIVES=true protège et vérifie tous les fichiers présents au
 * démarrage. Le pruning s’exécute, calcule ses candidats, mais ne retire aucune archive
 * déjà présente; le comportement KEEP=90 reste inchangé pour les exécutions ultérieures.
 *
 * Aligné sur les fenêtres déjà utilisées par le pipeline :
 *   - scripts/verify-results.mjs      → lit les 90 derniers fichiers d'archive
 *   - scripts/update-win-history.mjs  → agrège les 90 derniers fichiers d'archive
 *
 * Objectif : borner la croissance du dépôt git et du build statique (out/),
 * donc du serveur FTP. Les suppressions sont commitées par l'étape
 * "Commit data" du workflow (git add public/predictions-archive/ couvre les rm).
 * Les erreurs restent non bloquantes dans le mode standard; le mode protecteur échoue
 * fermé pour que le préflight du workflow puisse arrêter le run avant les mises à jour.
 */
import { readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARCHIVE_DIR = 'public/predictions-archive';
const KEEP = 90;
const THIS_FILE = fileURLToPath(import.meta.url);

function listArchiveFiles(archiveDir) {
  return readdirSync(archiveDir)
    .filter((f) => f.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort(); // YYYY-MM-DD.json → tri lexicographique = tri chronologique
}

export function pruneArchives({ archiveDir = ARCHIVE_DIR, keep = KEEP, preserveExisting = false } = {}) {
  const files = listArchiveFiles(archiveDir);
  const stale = files.slice(0, Math.max(0, files.length - keep));

  if (preserveExisting) {
    const baseline = new Map(files.map((name) => [name, readFileSync(join(archiveDir, name))]));
    const removable = stale.filter((name) => !baseline.has(name));
    for (const name of removable) unlinkSync(join(archiveDir, name));

    const after = listArchiveFiles(archiveDir);
    const missing = [...baseline.keys()].filter((name) => !after.includes(name));
    const changed = [...baseline.entries()]
      .filter(([name, bytes]) => !readFileSync(join(archiveDir, name)).equals(bytes))
      .map(([name]) => name);
    if (missing.length || changed.length) {
      throw new Error(`Archives préexistantes altérées — absentes: ${missing.join(', ') || 'aucune'}; modifiées: ${changed.join(', ') || 'aucune'}`);
    }

    console.log(
      `[prune-archives] Mode protecteur vérifié : ${baseline.size} archive(s) présentes au démarrage conservées; ` +
        `${stale.length} candidate(s) ancienne(s) évaluée(s); suppression des archives préexistantes interdite pour ce déploiement.`
    );
    return { deleted: removable, preservedExisting: baseline.size, staleCandidates: stale };
  }

  if (files.length <= keep) {
    console.log(`[prune-archives] ${files.length} fichier(s) ≤ ${keep} — rien à supprimer.`);
    return { deleted: [], preservedExisting: 0, staleCandidates: [] };
  }

  for (const name of stale) unlinkSync(join(archiveDir, name));
  console.log(
    `[prune-archives] Supprimé ${stale.length} archive(s) (${stale[0]} → ${stale[stale.length - 1]}), ` +
      `conserve les ${keep} plus récentes.`
  );
  return { deleted: stale, preservedExisting: 0, staleCandidates: stale };
}

if (process.argv[1] && resolve(process.argv[1]) === THIS_FILE) {
  const preserveExisting = process.env.PRESERVE_EXISTING_ARCHIVES === 'true';
  try {
    pruneArchives({ preserveExisting });
  } catch (err) {
    console.error(`[prune-archives] Erreur${preserveExisting ? ' (mode protecteur, arrêt)' : ' (non bloquant)'}: ${err.message}`);
    if (preserveExisting) process.exitCode = 1;
  }
}
