#!/usr/bin/env node
// Garde-fou anti-feed-vide (incident 2026-11-23).
//
// Contexte : pendant une indisponibilité Gemini (HTTP 503/504), l'enrichissement
// n'a produit aucune réponse vérifiée (0/40) ; le filtre
// filter-gemini-current-picks.mjs a alors vidé public/predictions.json
// (0 prédictions, 285 fixtures) et ce feed vide a été construit puis déployé,
// laissant bttspredict.com sans aucun pronostic pendant plusieurs heures.
//
// Politique : il vaut mieux échouer AVANT le commit et le transfert FTP pour
// conserver en ligne le build précédent (feed du jour précédent) plutôt que
// de publier un site vide. Le run planifié suivant retente automatiquement.
//
// Usage : node scripts/guard-nonempty-public-feed.mjs public/predictions.json

import fs from 'node:fs';

const file = process.argv[2] || 'public/predictions.json';

let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (err) {
  console.error(`[guard] FAIL — impossible de lire ${file} : ${err.message}`);
  process.exit(1);
}

const preds = Array.isArray(data.predictions) ? data.predictions : [];
const rawFixtures = data.fixtures;
const fixtures = Array.isArray(rawFixtures)
  ? rawFixtures.length
  : typeof rawFixtures === 'number'
    ? rawFixtures
    : 0;
const analyzed = Number(data.stats?.totalAnalyzed ?? fixtures) || 0;
const feedDate = data.date || '?';
const lastUpdated = data.lastUpdated || '?';

console.log(
  `[guard] feed=${file} date=${feedDate} lastUpdated=${lastUpdated} ` +
    `predictions=${preds.length} fixtures=${fixtures} analyzed=${analyzed}`
);

if (preds.length > 0) {
  console.log('[guard] OK — feed public non vide, publication autorisée.');
  process.exit(0);
}

if (analyzed > 0 || fixtures > 0) {
  console.error(
    '[guard] FAIL — 0 prédiction publiée alors que des fixtures existent ' +
      `(${fixtures} fixtures, ${analyzed} analysées).`
  );
  console.error(
    '[guard] Cause la plus probable : indisponibilité Gemini ' +
      '(0 réponse vérifiée) — cf. étape "Gemini enrichment".'
  );
  console.error(
    '[guard] Déploiement annulé : le build précédent reste en ligne ' +
      'au lieu d\'un site sans pronostics. Le prochain run planifié retentera.'
  );
  process.exit(1);
}

console.log(
  "[guard] OK — aucune rencontre aujourd'hui : feed vide légitime, publication autorisée."
);
