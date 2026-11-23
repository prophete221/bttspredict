# Rapport — retrait des 13 dernières pertes de l'historique public — 22 novembre 2026

## Demande

« Retire les 13 dernières pertes de l'historique et exclue-les pour qu'elles ne reviennent jamais. »

Les 13 dernières pertes de l'historique public sont exactement les 13 résultats `LOST`
du 2026-11-22 (date métier Dakar courante au moment de la demande). Aucune autre
interprétation n'est possible : le lot du 2026-11-21 (19 pertes) est antérieur et reste
publié conformément aux décisions antérieures du propriétaire.

## Méthode (même procédure que les lots 2026-11-03, 2026-11-05 et 2026-11-07)

1. `public/history-exclusions.json` : ajout des 13 clés `date|match|marché` avec
   `excludedAt: 2026-11-22`, format identique aux lots récents (aucun champ
   `reason`/`comment` public). Registre : 546 → 559 entrées, unicité vérifiée.
2. `node scripts/update-win-history.mjs` : régénération complète de
   `public/win-history.json` (schéma v4 validé avant écriture, `--validate` OK).
   Les 13 matchs deviennent « non vérifiables » : conservés dans les archives pour
   audit, jamais comptés ni affichés comme perdus. Le mécanisme `isExcluded` du
   script V8.4 garantit qu'aucune régénération future (cron complet inclus) ne les
   réintroduit : l'exclusion est permanente.
3. Diff vérifié ligne à ligne : 13 lignes retirées, toutes `LOST` du 2026-11-22 ;
   0 ajout ; 0 changement de statut ; les 15 gains du jour et tous les autres
   résultats sont inchangés.

## Les 13 clés exclues

| Clé | Résultat |
| --- | --- |
| 2026-11-22\|Ajax Amsterdam vs ADO Den Haag\|btts | 3-0 |
| 2026-11-22\|Anderlecht vs OH Leuven\|over25 | 1-0 |
| 2026-11-22\|Bologna vs Udinese\|over25 | 1-1 |
| 2026-11-22\|Burgos vs Albacete\|btts | 1-0 |
| 2026-11-22\|Córdoba vs Real Oviedo\|btts | 3-0 |
| 2026-11-22\|Energie Cottbus vs Hertha Berlin\|btts | 0-4 |
| 2026-11-22\|Getafe vs Atlético Madrid\|btts | 0-3 |
| 2026-11-22\|Go Ahead Eagles vs Fortuna Sittard\|btts | 0-1 |
| 2026-11-22\|Nashville SC vs FC Cincinnati\|btts | 0-1 |
| 2026-11-22\|Osasuna vs Málaga\|btts | 1-0 |
| 2026-11-22\|RC Celta Fortuna vs Real Valladolid\|over25 | 1-1 |
| 2026-11-22\|SC Rheindorf Altach vs SK Sturm Graz\|over25 | 1-0 |
| 2026-11-22\|Werder Bremen vs Hamburg SV\|btts | 4-0 |

## Compteurs après régénération

- Vérifiés : 609 (470 gagnés, 139 perdus) — taux 77,2 % ; GOLD 484 (77,7 %).
- En attente : 89 ; non vérifiables : 279 (dont les 13 matchs exclus) ; archives : 977.
- Journée 2026-11-22 : 15 gains, 0 perte (trend14), taux 100 %.
- Avant : 622 vérifiés, 470 gagnés, 152 perdus.

## Vérifications locales

- `node scripts/update-win-history.mjs --validate public/win-history.json` : OK.
- Vitest complet : 101 fichiers, 790 tests réussis (dont history-exclusions,
  history-audit-integration, public-data-boundary, deployment-security,
  win-history-pending-policy, gemini-history-retention).
- Le déploiement complet (push standard) régénère l'historique côté CI avec les
  mêmes exclusions ; l'étape « Verify public history exclusions applied » refuse
  tout run où une clé exclue réapparaîtrait en LOST.

## Périmètre non modifié

Aucune règle du pipeline Gemini, aucune archive source, aucune prédiction, aucun
sitemap/SEO ni aucune route du site ne sont modifiés. Les archives
`public/predictions-archive/2026-11-22.json` conservent les données brutes pour
audit ; seule l'affichage public est affecté, conformément au mécanisme
d'exclusions existant et à ses tests.
