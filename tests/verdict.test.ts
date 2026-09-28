// ═══════════════════════════════════════════════════════════════════════════════
// Test de la logique de verdict BTTS / Over 2.5 — anti-régression du bug
// du 2026-09-28 (verdicts "Non" inversés dans verify-results.mjs).
// Les 6 cas BTTS exigés par la mission + cas Over 2.5 + fallback prédiction absente.
// Fixtures 100 % statiques (aucune donnée vivante).
// ═══════════════════════════════════════════════════════════════════════════════
import { describe, it, expect } from 'vitest';
import { computeVerdict, isBTTS, isOver, predictedYes } from '../scripts/verdict.mjs';

describe('computeVerdict — BTTS "Oui"', () => {
  it('BTTS Oui + 1-1 = WIN', () => {
    expect(computeVerdict('BTTS', 'Oui', 1, 1)).toBe('WON');
  });
  it('BTTS Oui + 2-1 = WIN', () => {
    expect(computeVerdict('BTTS', 'Oui', 2, 1)).toBe('WON');
  });
  it('BTTS Oui + 2-0 = LOSS', () => {
    expect(computeVerdict('BTTS', 'Oui', 2, 0)).toBe('LOST');
  });
});

describe('computeVerdict — BTTS "Non" (cas qui cassaient avant le fix)', () => {
  it('BTTS Non + 0-1 = WIN', () => {
    expect(computeVerdict('BTTS', 'Non', 0, 1)).toBe('WON');
  });
  it('BTTS Non + 2-0 = WIN', () => {
    expect(computeVerdict('BTTS', 'Non', 2, 0)).toBe('WON');
  });
  it('BTTS Non + 1-1 = LOSS', () => {
    expect(computeVerdict('BTTS', 'Non', 1, 1)).toBe('LOST');
  });
});

describe('computeVerdict — Over 2.5 (même bug potentiel sur le marché Over)', () => {
  it('Over 2.5 Oui + 2-1 (3 buts) = WIN', () => {
    expect(computeVerdict('Over 2.5', 'Oui', 2, 1)).toBe('WON');
  });
  it('Over 2.5 Oui + 1-0 (1 but) = LOSS', () => {
    expect(computeVerdict('Over 2.5', 'Oui', 1, 0)).toBe('LOST');
  });
  it('Over 2.5 Non + 1-1 (2 buts) = WIN', () => {
    expect(computeVerdict('Over 2.5', 'Non', 1, 1)).toBe('WON');
  });
  it('Over 2.5 Non + 3-0 (3 buts) = LOSS', () => {
    expect(computeVerdict('Over 2.5', 'Non', 3, 0)).toBe('LOST');
  });
});

describe('computeVerdict — cas limites', () => {
  it('prédiction absente → interprétée comme "Oui" (comportement historique)', () => {
    expect(computeVerdict('BTTS', undefined, 1, 1)).toBe('WON');
    expect(computeVerdict('BTTS', undefined, 2, 0)).toBe('LOST');
  });
  it('prédiction avec espaces/casse → normalisée', () => {
    expect(computeVerdict('BTTS', ' non ', 0, 2)).toBe('WON');
    expect(computeVerdict('btts', 'oui', 1, 1)).toBe('WON');
  });
  it('marché inconnu traité comme Over (comportement historique de verify-results)', () => {
    expect(computeVerdict('Score Exact', 'Oui', 1, 1)).toBe('LOST'); // 2 buts < 3
  });
});

describe('primitives', () => {
  it('isBTTS', () => {
    expect(isBTTS(1, 1)).toBe(true);
    expect(isBTTS(0, 1)).toBe(false);
    expect(isBTTS(3, 0)).toBe(false);
  });
  it('isOver', () => {
    expect(isOver(2, 1)).toBe(true);
    expect(isOver(1, 1)).toBe(false);
  });
  it('predictedYes', () => {
    expect(predictedYes('Oui')).toBe(true);
    expect(predictedYes('Non')).toBe(false);
    expect(predictedYes(undefined)).toBe(true);
  });
});
