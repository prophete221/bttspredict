# État du projet BTTSPredict

**État établi le 3 novembre 2026.**

## Référence de travail

- **Branche active :** `redesign/professional-global-2026-11-03`.
- **Commit source du diagnostic Phase 1 :** `325526d93c63fc52143741a5b739cf68f7ba0809`.
- **Commit du code échantillonné par l’audit central :** `71cf295e9d07794ea04b88710d474561cf128b35`.
- **Commit local de création des premiers documents (historique) :** `97fa668e18dd758a774b022541dd546d870e6c06` (`docs: centralize phase 1 project reports`). Ce commit documentaire n’est pas le commit source du diagnostic ni le HEAD actuel.
- **État Git observé lors de cette première centralisation (historique) :** branche locale en avance d’un commit sur l’amont; aucun push effectué. L’instantané Git actuel est consigné dans la dernière entrée de `JOURNAL_PROJET.md` et l’addendum de sélection ci-dessous.
- **Dossier de rapports permanent :** `docs/project/reports/`.

## Phase en cours

**Phase 2C — implémentation locale autorisée et réalisée; build et contrôles réussis.** La page West Ham–QPR est FR seulement, `noindex, follow`, avec canonical auto-référent sur cette page uniquement et sans ajout au sitemap. Le résultat et les preuves sont consignés plus bas. Le prochain jalon est la revue du diff; aucun commit ou push n’a été effectué et aucun push ne sera fait sans autorisation explicite.

## Travaux terminés

- Phase 0 : audit technique, SEO et inventaire consigné dans `docs/project/BTTSPREDICT_AUDIT_COMPLET.md`.
- Phase 1 : diagnostic en lecture seule des dix URL match en 404, de l’URL match AR en 403, des robots d’erreur, de l’index d’archive, de `/en/over-2-5/statistics` et des 64 routes éditoriales FR/EN/AR.
- Matrice SEO exhaustive route par route et gabarit des 864 fichiers match consignés dans `RAPPORT_DIAGNOSTIC_PHASE1.md`.
- Phase 2A : conception des corrections P0.1, P0.2, P0.3 et P1, comparaison des trois stratégies match, inventaire des risques, critères de tests et recommandation en attente d’approbation dans `PLAN_CORRECTIONS_PHASE2.md`.
- Les documents permanents ont été créés, lus et validés. Voir la validation détaillée dans `JOURNAL_PROJET.md`.

## Décisions et actions en attente du chef de projet

1. Examiner l’implémentation locale Phase 2C et ses preuves de tests/build; attendre une autorisation explicite avant tout push.
2. Demander l’investigation d’hébergement pour le 403 de `/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25` (artefact, chemin, permissions, règles actives et journaux).
3. Valider la politique robots/HTTP des 404, 403, archives HTML, fichiers JSON et pages normales, notamment l’usage de `X-Robots-Tag` pour les JSON.
4. Valider l’approche de rendu initial de `lang`/`dir` et le H1 serveur des trois pages statistiques.
5. Décider de l’alignement hreflang/sitemap, du choix français `fr` ou `fr-SN`, et de la conduite à tenir pour les familles qui touchent une page SEO protégée. Aucun changement touchant les cinq pages gelées sans validation distincte.
6. Maintenir `/en/over-2-5/statistics` comme route non prise en charge jusqu’à une décision éditoriale séparée; aucune route à créer dans la Phase 2A.
7. Toute extension hors du périmètre livré (autres pages, sitemap, règles robots globales, hébergement ou production) exige une validation distincte; aucun commit/push n’est effectué sans demande explicite.

## Pages SEO protégées

Ne pas modifier sans validation préalable l’URL, le canonical, la redirection, le title SEO, le H1 principal ou le contenu performant de :

- `/en/btts-and-over-2-5-predictions-today`
- `/en`
- `/en/over-2-5/predictions/today`
- `/`
- `/en/ai-correct-score-predictions`

## Garde-fous permanents

- Protéger Firebase/Auth, les affiliations et statistiques, les traductions et le RTL, les données/résultats, les tests d’intégrité et l’export statique.
- Ne supprimer aucune route, aucun contenu, aucune fonction et aucune donnée sans justification et validation.
- Ne pas toucher à `main` ni à la production.
- Ne pousser aucun changement sur GitHub sans autorisation explicite.
- Après chaque mission, actualiser ces documents dans le dépôt, préserver les anciens rapports, inscrire le commit exact et distinguer faits, hypothèses, recommandations et décisions en attente.

## Validation documentaire

### Instantané Git contrôlé au commit source

Les observations de cette vérification sont un instantané pris au commit source `bdc0544cf97a30a87d06a70312f1f37ced2de91c`, sur `redesign/professional-global-2026-11-03`, avant le nouveau commit documentaire de cette mission. À cet instant, le HEAD local était `bdc0544cf97a30a87d06a70312f1f37ced2de91c`, la référence locale de suivi `origin/redesign/professional-global-2026-11-03` pointait sur `325526d93c63fc52143741a5b739cf68f7ba0809`, et la branche locale avait deux commits d’avance, dans l’ordre `97fa668e18dd758a774b022541dd546d870e6c06` puis `bdc0544cf97a30a87d06a70312f1f37ced2de91c`. L’arbre de travail était propre ; aucun push n’avait été effectué. Ces valeurs décrivent le contrôle au commit source, pas le HEAD après l’ajout documentaire de cette mission.

### Documents et contenu contrôlés

Les trois documents permanents ont été lus intégralement : `RAPPORT_DIAGNOSTIC_PHASE1.md` (244 lignes), `JOURNAL_PROJET.md` et `ETAT_PROJET.md`. Le rapport Phase 1 contient bien dix URL match en 404 dans le tableau de la section 1 (lignes 21–48, URL aux lignes 29–38), et une URL match en 403 dans la section 2 (lignes 50–62), avec les preuves associées. Les sections 3–10 couvrent les directives robots, l’archive, la route EN non prise en charge, les 64 routes éditoriales, les groupes hreflang, les pages protégées, les 864 pages de match, les recommandations et les contrôles réellement effectués. Le journal sépare les faits vérifiés, les hypothèses/limites, les recommandations et les décisions ou actions en attente ; cette mission est ajoutée sans remplacer les entrées antérieures.

Cette mission de vérification ne modifie ni le rapport Phase 1 ni aucun fichier applicatif. Les seules mises à jour locales sont cet état et le journal ; elles sont enregistrées dans le commit documentaire dédié et n’ont pas été poussées. La validation de cette mission portait sur le contenu des documents et les références Git ; aucun build, test, contrôle TypeScript/lint ni nouvelle requête HTTP n’a été exécuté.

Le diagnostic Phase 1 était en lecture seule : aucun nouveau build, `npm test`, TypeScript ou lint n’a été exécuté. Aucune correction de code n’est commencée ; attendre la décision du chef de projet.


## Mise à jour du 3 novembre 2026 — dossier de sélection Phase 2A

**Décision soumise, non appliquée :** retenir provisoirement une seule page FR, West Ham United–Queens Park Rangers (`/match/west-ham-united-vs-queens-park-rangers-2026-10-09`), et aucune variante EN/AR. Ne pas retenir les neuf autres URL à ce stade. Le dossier [`SELECTION_MATCHES.md`](./SELECTION_MATCHES.md) fournit les dix évaluations URL par URL, les scores/source, les données historiques, les signaux GSC, les motifs de sélection, la règle reproductible, l’impact technique et le contrôle du 403. Cette proposition attend la validation du chef de projet; la stratégie B acceptée comme principe ne vaut pas autorisation de coder.

**Faits nouveaux vérifiés :** les snapshots des dix candidats ont un score, un statut et un horodatage, mais une seule rencontre — West Ham–QPR — a une source de résultat enregistrée dans `public/win-history.json`; les autres scores ne peuvent pas être traités comme résultat vérifié interne sur la seule base de `verifiedAt`. Les 20 variantes EN/AR vérifiées par GET public répondent 404; les exports locaux candidats sont absents. Les données GSC restent un agrégat du 4 au 31 octobre 2026 (35 impressions, 0 clic pour les dix URL), sans attribution au seul 31 octobre. Nashville–Toronto conserve une incertitude de date/fuseau (snapshot 27 septembre à 00:30, source au jour local du 26).

**Contrôles et limites :** code et snapshots inspectés en lecture seule; GET publics EN/AR effectués sans écriture; aucun accès à l’hébergement ni aux journaux; aucune cause du 403 déterminée. Aucun build, test, lint ou TypeScript exécuté. Aucun fichier applicatif ou donnée, `main` ou production modifié.

**Instantané Git de cette mission :** branche `redesign/professional-global-2026-11-03`; HEAD de base `149733160d0c9e7796dc36d3f86f80a2284eecf8`; référence amont observée `325526d93c63fc52143741a5b739cf68f7ba0809` (branche locale en avance de quatre commits au début de la mission; arbre initial propre). Les seuls fichiers modifiés/créés sont `ETAT_PROJET.md`, `JOURNAL_PROJET.md`, `PLAN_CORRECTIONS_PHASE2.md` et `SELECTION_MATCHES.md`. Les changements demeurent locaux, non commités et non poussés. Aucun changement sur `main` ou en production.

## Mise à jour du 3 novembre 2026 — contrôles préalables à la validation

**Statut actuel :** West Ham United–QPR (1–1) reste le seul candidat provisoirement acceptable, limité à une page FR. Les vérifications documentées ne valent ni sélection finale ni autorisation d’implémenter. La Phase 2B attend l’approbation explicite du chef de projet.

- Le rapport officiel de West Ham confirme le vendredi 9 octobre 2026 à 20:00 BST. À cette date, BST = UTC+1 : 20:00 BST = 19:00 UTC = 19:00 à Dakar (UTC+0). Les six snapshots indiquent `2026-10-09`, `19:00`, sans fuseau. L’application interprète cette heure selon `Africa/Dakar`, mais le fuseau d’origine du snapshot n’est pas établi; seule la date locale est confirmée sans ambiguïté.
- `public/win-history.json` contient l’entrée `history[246]` correspondant aux équipes, date et score 1–1; elle indique `source: ESPN public`, `status: WON` et `verifiedAt: 2026-10-23T05:42:15.167Z`. La page ESPN gameId 401880233 et le rapport officiel concordent. Le fichier actuel ne conserve pas d’URL source directe.
- Le plan Phase 2 précise une option de conservation par fichier dédié hors de `public/predictions-archive/`, une modification minimale limitant ce candidat à FR sans supprimer les autres pages, et un schéma de registre séparé. Ce sont des conceptions, pas des changements réalisés.
- L’indexation demeure une décision ouverte : option indexable ou option `noindex, follow`; ni l’une ni l’autre n’est choisie dans le dossier.

**À décider par le chef de projet :** approuver ou corriger la sélection d’une page FR; approuver la conservation durable distincte des archives roulantes et le filtre FR-only; choisir entre indexable et `noindex, follow`; valider le schéma du registre avant tout développement. Aucun code, snapshot, registre, archive, route, sitemap, canonical, directive robots, production, `main` ou état distant n’a été modifié. Aucun commit/push n’a eu lieu.


## Mise à jour du 3 novembre 2026 — proposition Phase 2C en attente

**Statut :** le diff proposé pour West Ham–QPR (1–1) est consultable dans [`PHASE2C_PROPOSITION_DIFF_WEST_HAM_QPR.md`](./PHASE2C_PROPOSITION_DIFF_WEST_HAM_QPR.md). La sélection de la page FR reste à valider et aucun changement applicatif n’est autorisé. Aucune option d’indexation n’est choisie.

La proposition conserve le snapshot historique hors de la fenêtre roulante, conserve la source et le score ESPN vérifiés, sépare le fuseau de l’événement, celui du snapshot (inconnu) et celui d’affichage, rend une page française littérale, et exclut ce slug de la génération dynamique FR/EN/AR afin de prévenir les doublons. Elle offre deux modes robots exclusifs : indexable ou `noindex, follow`. Elle ne modifie pas le sitemap, les canonicals existants, les cinq pages SEO protégées, `main` ni la production. Un canonical de page propre à la nouvelle route apparaît uniquement dans le code proposé, non appliqué.

**Contrôles réellement effectués :** vérification du worktree, de la branche, HEAD et amont; lecture des quatre rapports; inspection du code de génération SSG, du registre `win-history.json`, des six snapshots et des tests existants; comparaison structurelle des six enregistrements; relevé des empreintes des fichiers correspondant aux cinq routes protégées. Ces empreintes sont des références documentaires pour le test proposé, pas des tests exécutés.

**Limites :** fuseau d’origine du snapshot non déterminé; l’export statique d’une route littérale en présence de `[slug]` reste à tester après approbation. Aucun build, test, lint ou TypeScript exécuté. Aucun code, donnée, snapshot, registre, archive, route, sitemap, canonical existant, robots, `main`, production, commit ou push modifié/effectué. Les modifications documentaires précédentes ont été préservées; le rapport Phase 1 reste intact.

**Décisions attendues :** valider la sélection `/match/west-ham-united-vs-queens-park-rangers-2026-10-09`; choisir l’une des deux options robots; valider le schéma de conservation et de vérification; autoriser séparément une phase d’implémentation et les tests/build isolés.

## Contrôles complémentaires de la proposition Phase 2C — 3 novembre 2026

Un mini-projet temporaire Next.js 16.1.3 (`output: 'export'`, webpack) a compilé avec une page littérale sous `/match/` et une route `/match/[slug]`; son manifeste les distingue et génère les pages prévues. Ce résultat vérifie la cohabitation des deux formes de route, mais pas la compilation complète du projet ni la compatibilité de tous ses layouts. La première tentative du mini-projet, sous `/tmp`, a été interrompue par Turbopack à cause du lien `node_modules` hors de son root; le second essai sous `/workspace` a réussi. Les fichiers temporaires ont été supprimés.

Le test existant `npm test -- tests/seo-preservation.test.ts` réussit (8 tests). Les empreintes recalculées des cinq pages protégées sont égales aux empreintes proposées; aucun fichier applicatif n’apparaît dans `git status`. `git apply --check` confirme que le diff proposé correspond au code de base, sans l’appliquer. Les tests nouveaux, TypeScript et build complet restent non exécutés. Le filtre SSG proposé ne retire qu’un slug; `getAllMatchSlugs()` construit ses résultats depuis les clés uniques d’une `Map`. Le fichier proposé sous `src/data/retained-match-pages/` est hors du répertoire de purge `public/predictions-archive/` et le rendu dédié l’importe directement.


## Mise à jour du 3 novembre 2026 — Implémentation locale Phase 2C

**Décision appliquée :** l’autorisation explicite a couvert la seule route FR `/match/west-ham-united-vs-queens-park-rangers-2026-10-09`, la copie de conservation dédiée, l’exclusion du slug des générateurs dynamiques FR/EN/AR, `noindex, follow`, un canonical auto-référent pour cette nouvelle route seulement et aucun ajout au sitemap.

- **Code ajouté/modifié :** `src/lib/match-page-ssg.ts`, `src/lib/match-verification-registry.ts`, `src/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json`, `src/data/match-verification-registry.json`, la page littérale `src/app/match/west-ham-united-vs-queens-park-rangers-2026-10-09/page.tsx`, les seuls générateurs de matchs `src/app/match/[slug]/page.tsx` et `src/app/[locale]/match/[slug]/page.tsx`, ainsi que `tests/retained-match-page.test.ts`. Le registre sépare l’heure de coup d’envoi BST, le fuseau d’origine inconnu du snapshot (`null`) et l’affichage Dakar. Le résultat de la page vient du registre de vérification ESPN, non du score prédictif archivé.
- **Tests et contrôles statiques finaux :** `npm test` — 30 fichiers, 211 tests réussis; cela inclut 8 contrôles du test de rétention, dont les empreintes des cinq pages protégées, et les 8 tests de `tests/seo-preservation.test.ts`. `./node_modules/.bin/tsc --noEmit` et `npm run lint` ont terminé sans erreur. Une première exécution a révélé un compte de hunk erroné dans le diff (61 lignes annoncées pour 71) et l’incomplétude correspondante de la page; la page a été complétée, puis une garde de lookup a été typée correctement avant les contrôles finaux réussis.
- **Build complet :** `npm run build` réussi sous Next.js 16.1.3; compilation et vérification TypeScript du build réussies, génération statique 933/933. Les hooks `prebuild`/`postbuild` ont chacun annoncé 0 fichier nettoyé.
- **Vérification de l’export frais local :** `out/match/west-ham-united-vs-queens-park-rangers-2026-10-09.html` existait dans l’export produit par ce build. Son HTML rend le H1 West Ham–QPR 1–1, le résultat 1-1, `ESPN public` et le lien ESPN gameId 401880233; `main` porte `lang="fr"`; canonical exactement `https://bttspredict.com/match/west-ham-united-vs-queens-park-rangers-2026-10-09`; robots `noindex, follow` pour robots et Googlebot. Aucun fichier EN/AR pour ce slug et aucune entrée correspondante dans `sitemap.xml` exporté. `src/app/sitemap.ts` et `public/robots.txt` sont inchangés.
- **Garde-fous et état local :** les empreintes des cinq fichiers de page protégés correspondent aux valeurs de référence; aucun de ces fichiers n’a été modifié. Les 93 JSON publics contrôlés (prédictions et archives) gardent leurs empreintes; aucun changement aux snapshots ou archives glissantes. Les dossiers préexistants `out/` et `.next/` ont été déplacés pendant le build, puis restaurés après vérification de l’export frais. Branche locale toujours `redesign/professional-global-2026-11-03`, HEAD source `149733160d0c9e7796dc36d3f86f80a2284eecf8`, amont local observé `325526d93c63fc52143741a5b739cf68f7ba0809`; aucun commit, push, merge, changement à `main` ou intervention en production.

**À faire :** revue du diff et du bilan; attendre une autorisation distincte avant tout push. Le statut HTTP public de la nouvelle route n’a pas été testé, car aucun déploiement n’a été demandé ni effectué.


## Mise à jour du 5 novembre 2026 — Correctif Gemini/UI déployé

**Résultat :** le correctif ciblé du préflight FTP est en production. Le veto global qui échouait sur une page Match historique terminée a été remplacé par une conservation explicite des pages présentes dans le manifeste courant; le périmètre de suppression limité et les protections existantes sont maintenus.

- **Git :** `main` contient le correctif `cc08038617a2bfd9d1659ee37f12fc7301c687d2`, puis le commit de données automatique `9d809114e60c4e83777665871146525664d53394`.
- **Gemini :** 22 réponses vérifiées sur 24; les deux candidats non vérifiés ont été exclus. Le flux public comporte 22 sélections, toutes marquées `gemini-stats-v1`, `gemini-3.5-flash-lite` et `pick`. Les taux empiriques conservés dans le JSON sont des métriques de contexte, pas des pronostics de repli.
- **Sécurité FTP :** le run [#42125234994](https://github.com/prophete221/bttspredict/actions/runs/42125234994) a réussi tous les contrôles. Le plan a conservé 635/635 enregistrements distants et n’a produit aucune suppression; l’allowlist a transféré 1 756 fichiers, FTP code 0. La page AR terminée AGF–Braga a été confirmée parmi les chemins envoyés et vérifiée en HTTP 200 avec l’empreinte du manifeste.
- **Validation :** 50 fichiers Vitest, 25 tests Python, lint, TypeScript et build statique réussis dans Actions. `predictions.json` public répond HTTP 200. Les preuves détaillées sont consignées dans `RAPPORT_CORRECTION_PREFLIGHT_FTP_GEMINI_2026-11-05.md`.
- **Limite locale :** l’installation `npm ci` locale a échoué sur saturation des inodes; les contrôles complets ont été exécutés avec succès dans le runner distant. Aucun autre worktree n’a été nettoyé ou modifié.
- **Décision :** aucune action supplémentaire n’est en attente pour le correctif autorisé; aucune autre modification applicative n’est incluse dans cette mise à jour d’état.
