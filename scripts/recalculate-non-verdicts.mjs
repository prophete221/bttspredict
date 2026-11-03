// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — recalculate-non-verdicts.mjs (migration ONE-SHOT 2026-09-28)
// ═══════════════════════════════════════════════════════════════════════════════
// Corrige les verdicts déjà posés (WON/LOST) des pronostics "Non" inversés par
// l'ancienne logique de verify-results.mjs (bug : prediction "Non" ignorée).
//
// PRINCIPES (mission) :
//  - re-score UNIQUEMENT à partir de : prédiction originale + score final réel
//    (p.finalScore, déjà vérifié via ESPN) + type de marché ;
//  - AUCUN réseau, AUCUN changement de scores, AUCUNE suppression ;
//  - pertes ET victoires restent présentes (seul le sens peut être corrigé) ;
//  - chaque changement est loggé (traçabilité complète) ;
//  - vérifie ensuite qu'aucun doublon n'a été créé.
// Après migration, exécuter : node scripts/update-win-history.mjs
// ═══════════════════════════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';
import { computeVerdict } from './verdict.mjs';

const ARCHIVE_DIR = './public/predictions-archive';

function main() {
  const files = fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.json') && /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort();

  let totalChecked = 0, changed = 0, unchanged = 0, noScore = 0;
  const delta = { 'WON->LOST': 0, 'LOST->WON': 0 };
  const perFile = [];

  for (const file of files) {
    const fp = path.join(ARCHIVE_DIR, file);
    let data;
    try { data = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { continue; }
    const preds = data.predictions || data;
    if (!Array.isArray(preds)) continue;

    let fileChanges = 0;
    for (const p of preds) {
      if (p.status !== 'WON' && p.status !== 'LOST') continue; // PENDING : non touché
      totalChecked++;
      if (!p.finalScore || !/^\d+\s*-\s*\d+$/.test(p.finalScore)) { noScore++; continue; }
      const [hStr, aStr] = p.finalScore.split('-').map(s => parseInt(s.trim(), 10));
      if (Number.isNaN(hStr) || Number.isNaN(aStr)) { noScore++; continue; }

      const correct = computeVerdict(p.type, p.prediction, hStr, aStr);
      if (correct !== p.status) {
        console.log(`  ${file} ${p.match} | ${p.type} | prediction="${p.prediction}" | score ${p.finalScore} | ${p.status} -> ${correct}`);
        p.status = correct;
        p.recalculatedAt = new Date().toISOString(); // trace de la migration
        p.recalculationReason = 'verdict-bug-fix-2026-09-28';
        changed++;
        fileChanges++;
        delta[`${p.status === 'WON' ? 'LOST' : 'WON'}->${p.status}`]++;
      } else {
        unchanged++;
      }
    }

    if (fileChanges > 0) {
      fs.writeFileSync(fp, JSON.stringify(data, null, 2));
      perFile.push(`${file}: ${fileChanges} corrigé(s)`);
    }
  }

  // Contrôle d'intégrité : aucun doublon (même match + même date + même marché)
  const seen = new Map();
  let duplicates = 0;
  for (const file of files) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, file), 'utf8')); } catch { continue; }
    const preds = data.predictions || data;
    if (!Array.isArray(preds)) continue;
    for (const p of preds) {
      const key = `${file}|${p.match}|${p.type}|${p.date || ''}`;
      seen.set(key, (seen.get(key) || 0) + 1);
    }
  }
  for (const [k, v] of seen) if (v > 1) { duplicates++; console.log(`  ⚠ DOUBLON: ${k} (x${v})`); }

  console.log('════════════════════════════════════════════════════');
  console.log(`Vérifiés examinés : ${totalChecked}`);
  console.log(`Corrigés          : ${changed} (${delta['WON->LOST']} WON->LOST, ${delta['LOST->WON']} LOST->WON)`);
  console.log(`Inchangés         : ${unchanged}`);
  console.log(`Sans score final  : ${noScore}`);
  console.log(`Doublons          : ${duplicates} ${duplicates === 0 ? '✅' : '⚠'}`);
  console.log(`Fichiers modifiés : ${perFile.length}`);
}

main();
