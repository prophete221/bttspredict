// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — verdict.mjs
// Logique de verdict d'un pronostic à partir du score final RÉEL.
// Source unique partagée entre verify-results.mjs et les tests Vitest.
//
// Règles (fix bug 2026-09-28 : le verdict ignorant la prédiction "Non"):
//   BTTS   + prediction "Oui" → WON ssi les DEUX équipes ont marqué (h>0 && a>0)
//   BTTS   + prediction "Non" → WON ssi AU MOINS une équipe n'a pas marqué
//   Over2.5 + prediction "Oui" → WON ssi total de buts >= 3
//   Over2.5 + prediction "Non" → WON ssi total de buts <= 2
//   prediction absente → interprétée comme "Oui" (comportement historique)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Les deux équipes ont-elles marqué ?
 * @param {number} h buts domicile
 * @param {number} a buts extérieur
 */
export function isBTTS(h, a) {
  return h > 0 && a > 0;
}

/**
 * Total de buts >= 2.5 (strictement supérieur à 2) ?
 */
export function isOver(h, a) {
  return h + a >= 3;
}

/**
 * Le pronostic prédit-il le "Oui" du marché ?
 * @param {string|undefined} prediction "Oui" | "Non" | absent
 */
export function predictedYes(prediction) {
  return (prediction || '').trim().toLowerCase() !== 'non';
}

/**
 * Verdict d'un pronostic.
 * @param {string} type marché ("BTTS", "Over 2.5", ...)
 * @param {string|undefined} prediction "Oui" | "Non"
 * @param {number} h buts réels domicile
 * @param {number} a buts réels extérieur
 * @returns {'WON'|'LOST'} verdict corrigé
 */
export function computeVerdict(type, prediction, h, a) {
  const t = (type || '').toUpperCase();
  const marketOutcome = t.includes('BTTS') ? isBTTS(h, a) : isOver(h, a);
  const yes = predictedYes(prediction);
  return yes ? (marketOutcome ? 'WON' : 'LOST') : (marketOutcome ? 'LOST' : 'WON');
}
