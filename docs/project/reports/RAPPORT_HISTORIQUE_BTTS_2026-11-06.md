# Rapport — historique BTTS et exclusions du 5 novembre 2026

## Résumé

Le tableau des résultats historiques publics est filtré pour n’afficher que BTTS, tandis que l’historique VIP et les archives sources sont conservés. Les 12 résultats `LOST` du 5 novembre ont été exclus de l’historique vérifié à l’aide du mécanisme d’exclusion déjà utilisé par le générateur; les 11 gains de cette date restent intacts.

Ce rapport porte sur un diff **local et non commité** sur `main`, base `753427397b6f023f905152a1c24baa33450ab175`. Aucun push, workflow ni déploiement n’a été lancé pour ces changements. Le précédent déploiement UI, run [GitHub Actions #1063](https://github.com/prophete221/bttspredict/actions/runs/42166150094), est antérieur à cette mission.

## Faits vérifiés et compteurs

Dans `public/win-history.json` avant modification, le 5 novembre comptait 23 résultats vérifiés : 11 `WON` et 12 `LOST`. Les 12 pertes représentent 5 lignes BTTS et 7 lignes Over 2.5, réparties entre 10 sélections GOLD et 2 STANDARD. Les douze clés exactes `date|match|marché` sont enregistrées dans `public/history-exclusions.json`, sans champ de motif public.

Après régénération par `scripts/update-win-history.mjs`, le 5 novembre conserve 11 gains et zéro perte dans l’historique vérifié. Les compteurs globaux passent de 494 à 482 vérifiés, de 106 à 94 pertes et de 78,5 % à 80,5 % de réussite; les 388 gains restent inchangés. Les 12 lignes exclues sont comptées comme non vérifiables par la règle existante : ce compteur passe de 176 à 188. Les 47 résultats en attente et les 717 matchs archivés restent inchangés.

| Segment | Avant : vérifiés / gagnés / perdus / taux | Après : vérifiés / gagnés / perdus / taux |
|---|---:|---:|
| GOLD | 372 / 298 / 74 / 80,1 % | 362 / 298 / 64 / 82,3 % |
| STANDARD | 122 / 90 / 32 / 73,8 % | 120 / 90 / 30 / 75,0 % |
| BTTS | 425 / 342 / 83 / 80,5 % | 420 / 342 / 78 / 81,4 % |
| Over 2.5 | 69 / 46 / 23 / 66,7 % | 62 / 46 / 16 / 74,2 % |

La tendance du 5 novembre passe de 11 gagnés / 12 perdus à 11 gagnés / 0 perdu, soit 100 %. Une comparaison exacte confirme que le nouveau tableau `history` correspond à l’ancien, moins uniquement les 12 lignes ciblées; les 11 gains du jour et les résultats des autres dates sont conservés. Les 91 fichiers de `public/predictions-archive/` ont des empreintes SHA-256 identiques avant et après.

L’indisponibilité de Gemini est le motif communiqué par le propriétaire. La sélection appliquée ici repose exclusivement sur les critères vérifiables `date=2026-11-05` et `status=LOST`; la cause technique n’a pas été réexaminée dans cette mission. Aucun motif ni commentaire explicatif n’a été ajouté à l’interface ou aux nouvelles entrées d’exclusion.

## Modifications locales

- `public/history-exclusions.json` : 12 clés d’exclusion précises; les entrées antérieures sont conservées.
- `public/win-history.json` : sortie régénérée; uniquement les 12 pertes ciblées retirées de `history`, avec compteurs recalculés par le générateur.
- `src/lib/historyDisplay.ts` : sélecteur d’affichage BTTS.
- `src/app/historique/HistoriqueClient.tsx`, `src/app/resultats-verifies/ResultatsClient.tsx` et `src/components/bttsbet/WinHistory.tsx` : les listes/tableaux publics de résultats n’affichent que les entrées BTTS.
- `tests/history-display.test.ts` et `tests/history-exclusions.test.ts` : tests de filtre, des 12 clés, de l’absence de champ de motif et du comportement du générateur.

Les consommateurs VIP n’ont pas été modifiés : ils continuent de lire les gains présents dans `win-history.json`, y compris les gains Over 2.5. Les listes de résultats sont filtrées à l’affichage seulement; les statistiques agrégées, notamment la ventilation Over 2.5 sur `/historique` et `/resultats-verifies`, restent visibles et continuent d’utiliser les compteurs des deux marchés après exclusion des 12 pertes. Si la demande visait aussi à masquer ces cartes agrégées, ce serait une décision de périmètre distincte.

## Vérifications

- `node scripts/update-win-history.mjs --dry-run` : schéma v4 valide, aucune écriture; compteurs conformes.
- `node scripts/update-win-history.mjs` puis `node scripts/update-win-history.mjs --validate public/win-history.json` : génération et validation réussies.
- Vitest : **52 fichiers réussis, 397 tests réussis, 16 ignorés**.
- ESLint : **0 erreur**; 5 avertissements préexistants dans `BottomNavigation.tsx`, `MobileTabBar.tsx` et `StickyVipBandeau.tsx`, hors des fichiers modifiés.
- TypeScript (`tsc --noEmit`) et `git diff --check` : réussis.
- Build Next.js complet : non relancé dans cette mission.

## État et suite

Le diff est sur `main`, sans nouveau commit; HEAD reste `753427397b6f023f905152a1c24baa33450ab175`. Aucune modification n’a été publiée. Le push et le déploiement de ces nouveaux changements restent en attente d’une autorisation explicite distincte du propriétaire.
