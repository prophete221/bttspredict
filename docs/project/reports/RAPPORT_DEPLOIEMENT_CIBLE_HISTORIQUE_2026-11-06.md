# Rapport — run ciblé pour publier l’historique — 6 novembre 2026

## Résumé

Le propriétaire a autorisé un seul second push/run ciblé après l’annulation du run [#1064](https://github.com/prophete221/bttspredict/actions/runs/42176654263), interrompu avant l’étape FTP. La branche `main` distante et locale est sur `b185b16e0d19f95753f12462256751305d455268` avant cette mission. Le commit local `6e2166ba7b01eb57e5def3c514f0fdf221405404` ajoute un chemin de transfert qui publie le code déjà préparé et autorise exactement les deux fichiers JSON d’historique nécessaires. Il porte les marqueurs `[code-only] [history-json]`; il n’a pas encore été poussé au moment de ce rapport.

## Ce qui est autorisé à partir

Le workflow refuse le marqueur `[history-json]` s’il n’est pas combiné avec `[code-only]`, avant toute étape de pruning. En mode ciblé, il saute les actualisations automatiques de prédictions/Gemini et la purge des archives. Avant le build, il exige 12 clés d’exclusion distinctes du 5 novembre, zéro résultat `LOST` ce jour-là et les compteurs attendus. Après le build, il compare octet par octet `public/win-history.json` et `public/history-exclusions.json` avec leur copie dans `out/`.

Le diff force uniquement `win-history.json` et `history-exclusions.json`, même si leurs empreintes n’ont pas changé. Toutes les autres données — prédictions, transferts, équipes, combinaisons VIP et archives — restent exclues. La gate finale vérifie que l’allowlist et le fichier de commandes LFTP autorisent exactement ces deux JSON parmi les données; le manifeste distant reste intact en mode code-only. Le préflight FTP existant, le refroidissement de 300 secondes, les uploads explicites de `robots.txt`/`sitemap.xml`, le traitement séparé de `.htaccess` et les suppressions Match limitées aux chemins EN/AR contrôlés sont conservés. Aucun miroir ou `delete` général n’est introduit.

## Données et périmètre

Le payload déjà présent sur `main` a été relu sans le régénérer : 12 clés uniques de pertes exclues le 5 novembre, aucune perte `LOST` de cette date dans l’historique public, et les 11 gains du jour conservés. Les compteurs sont `482` résultats vérifiés, `388` gains, `94` pertes, `188` non vérifiables, `47` en attente et `717` archives. `node scripts/update-win-history.mjs --validate public/win-history.json` réussit. Les JSON de l’export local sont identiques à ceux de `public/`. Ce commit ne modifie ni JSON métier, ni archive, ni URL, canonique, redirection, SEO, sitemap source ou règle robots; aucun motif technique n’est affiché sur le site. La panne Gemini du 5 novembre reste un fait rapporté par le propriétaire; elle n’est pas réinterprétée ici.

### Faits, hypothèses et recommandation

**Faits :** le run #1064 a été annulé avant FTP; la production doit donc encore recevoir le payload historique contrôlé. Le diff de ce correctif ne modifie que le workflow, les scripts de transfert et leurs tests. **Hypothèses :** aucune nouvelle hypothèse sur la cause de la panne Gemini; le motif vient du propriétaire et les exclusions reposent seulement sur la date et le statut. **Recommandation :** pousser une seule fois le commit de code et celui du présent rapport, attendre le run automatique, puis vérifier les deux JSON/pages en production; ne pas relancer en cas d’échec sans nouvelle autorisation. La provenance du run annulé est le [run GitHub #1064](https://github.com/prophete221/bttspredict/actions/runs/42176654263); le calcul des exclusions est détaillé dans [`RAPPORT_HISTORIQUE_BTTS_2026-11-06.md`](RAPPORT_HISTORIQUE_BTTS_2026-11-06.md).

## Fichiers modifiés

- `.github/workflows/deploy.yml` : garde de marqueurs, validation des données, comparaison export/source et gate avant upload.
- `scripts/ftp-diff.mjs` et `scripts/prepare-ftp-deploy-plan.mjs` : option ciblée, chemins forcés exacts et propagation du mode.
- `scripts/prepare-ftp-upload-allowlist.mjs` : validation stricte des chemins, commandes, compteurs et maintien du manifeste distant.
- `tests/deployment-security.test.ts`, `tests/ftp-diff-force.test.ts`, `tests/ftp-upload-allowlist.test.ts` : couverture du mode et de ses refus fermés.

Les rapports antérieurs, notamment `RAPPORT_HISTORIQUE_BTTS_2026-11-06.md` et `RAPPORT_HISTORIQUE_PERPLEXITY_VIP_2026-11-06.md`, sont conservés.

## Vérifications locales

- Vitest complet : **53 fichiers et 421 tests réussis**; les tests ciblés FTP/workflow passent aussi (**21 tests**).
- Tests Python : **25 réussis**. L’environnement note que `google-genai` n’est pas installé; aucun travail Gemini n’est exécuté par ce mode.
- ESLint : **0 erreur**, 5 avertissements préexistants hors des fichiers modifiés. `tsc --noEmit` réussit.
- `npm run build -- --webpack` réussit. Export statique : fichiers `videos/vip-parcours.mp4` et `videos/vip-parcours-poster.jpg` présents; les deux JSON sont identiques aux sources.
- YAML du workflow parsé avec succès (**38 étapes**); les blocs Node ciblés passent `node --check`. Les scripts `.mjs` modifiés passent aussi `node --check`; `git diff --check` est propre.
- Le build a régénéré `src/lib/promo-build-date.generated.ts`; ce changement hors périmètre a été restauré avant le commit.

## État et suite

Le commit de code est local sur `main`; aucun push, run ou déploiement n’a été effectué pour ce correctif. La prochaine action autorisée est un unique push contenant le commit de code et le commit de ce rapport, tous deux avec `[code-only] [history-json]` afin que le workflow lise les bons marqueurs sur le commit de tête. Après ce push, il reste à vérifier le résultat du workflow et les fichiers/pages de production. Aucun nouvel essai ne sera déclenché si ce run échoue sans autorisation distincte.
