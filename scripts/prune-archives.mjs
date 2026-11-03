#!/usr/bin/env node
/**
 * Prune les archives de prédictions : conserve les 90 fichiers les plus récents.
 *
 * Aligné sur les fenêtres déjà utilisées par le pipeline :
 *   - scripts/verify-results.mjs      → lit les 90 derniers fichiers d'archive
 *   - scripts/update-win-history.mjs  → agrège les 90 derniers fichiers d'archive
 *
 * Objectif : borner la croissance du dépôt git et du build statique (out/),
 * donc du serveur FTP. Les suppressions sont commitées par l'étape
 * "Commit data" du workflow (git add public/predictions-archive/ couvre les rm).
 *
 * Non bloquant : toute erreur est logguée et exit 0 (le déploiement continue).
 */
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ARCHIVE_DIR = 'public/predictions-archive';
const KEEP = 90;

try {
  const files = readdirSync(ARCHIVE_DIR)
    .filter((f) => f.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort(); // YYYY-MM-DD.json → tri lexicographique = tri chronologique

  if (files.length <= KEEP) {
    console.log(`[prune-archives] ${files.length} fichier(s) ≤ ${KEEP} — rien à supprimer.`);
    process.exit(0);
  }

  const stale = files.slice(0, files.length - KEEP);
  for (const f of stale) {
    unlinkSync(join(ARCHIVE_DIR, f));
  }
  console.log(
    `[prune-archives] Supprimé ${stale.length} archive(s) (${stale[0]} → ${stale[stale.length - 1]}), ` +
      `conserve les ${KEEP} plus récentes.`
  );
} catch (err) {
  console.error(`[prune-archives] Erreur (non bloquant): ${err.message}`);
}
process.exit(0);
