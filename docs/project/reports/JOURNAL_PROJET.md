# Journal du projet BTTSPredict

**Règle de tenue :** ajouter une nouvelle entrée après chaque mission ; ne jamais remplacer un ancien rapport ou effacer une entrée. Distinguer faits vérifiés, hypothèses, recommandations et décisions en attente. Ne déclarer un document à jour qu’après écriture et vérification réelle.

## 2026-11-03 — Phase 0 : audit technique, SEO et inventaire

- **Commit de référence de l’audit :** code examiné à `71cf295e9d07794ea04b88710d474561cf128b35`; rapport centralisé présent sur la branche au commit `325526d93c63fc52143741a5b739cf68f7ba0809`.
- **Branche :** `redesign/professional-global-2026-11-03`.
- **Fichiers concernés :** `docs/project/BTTSPREDICT_AUDIT_COMPLET.md` et le dépôt audité (routes `src/app/**`, composants, bibliothèques, tests, `public/**`, scripts et workflow de déploiement).
- **Faits vérifiés consignés dans le rapport :** inventaire des routes éditoriales et match, valeurs HTML de métadonnées, export statique, tests de base rapportés et extrait GSC; cinq pages SEO prioritaires identifiées comme protégées. Rapport indique un build réussi, 203 tests réussis, TypeScript et lint réussis avant la centralisation du rapport.
- **Hypothèses :** les limites de l’export GSC ne permettent pas d’attribuer automatiquement les faibles volumes à un défaut de contenu ou de snippet.
- **Résultat :** audit de référence disponible. Son fichier n’a pas été remplacé dans la mission de diagnostic Phase 1.

## 2026-11-03 — Phase 1 : diagnostic technique et matrice SEO, lecture seule

- **Commit exact de travail/source :** `325526d93c63fc52143741a5b739cf68f7ba0809` sur `redesign/professional-global-2026-11-03`.
- **Fichiers concernés par l’inspection :** `src/lib/matches.ts`; `src/app/match/[slug]/page.tsx`; `src/app/[locale]/match/[slug]/page.tsx`; `src/app/layout.tsx`; `src/app/[locale]/layout.tsx`; `src/app/not-found.tsx`; `src/app/sitemap.ts`; `public/.htaccess`; `public/404.html`; `public/robots.txt`; `public/predictions-archive/index.html`; `scripts/prune-archives.mjs`; export local `out/**`; rapport `docs/project/BTTSPREDICT_AUDIT_COMPLET.md`.
- **Faits vérifiés :** 10 URL match en 404, chacune retrouvée dans des snapshots locaux mais hors de la fenêtre des 14 archives chargées par la génération SSG; aucune page HTML locale produite pour ces slugs. L’URL San Diego AR répond 403 en public alors que l’HTML FR/EN/AR est généré localement, que les variantes FR/EN publiques répondent 200 et qu’une autre page AR répond 200. Les deux HTML d’erreur contiennent `noindex` et `index, follow`; la directive globale `index, follow` vient de `src/app/layout.tsx`. L’index d’archive est `noindex, follow`, est crawlable et absent du sitemap; cette directive ne s’étend pas aux JSON. `/en/over-2-5/statistics` n’est pas une route déclarée et son 404 est attendu. La matrice recense les 64 routes éditoriales, leurs champs HTML, hreflang et sitemap; la racine HTML initiale porte `lang=fr` et `dir` absent sur les routes localisées également.
- **Hypothèses / limites :** cause serveur fine du 403 non déterminée faute d’accès aux journaux et permissions de l’hébergement. Le `noindex` observé sur les HTML d’erreur est émis dans le rendu généré, sans métadonnée correspondante dans `src/app/not-found.tsx`; l’origine de framework/build est retenue, distincte de l’héritage racine `index, follow`. L’absence de réponse publique du JSON d’archive du 3 novembre malgré sa présence locale est observée, mais son origine reste inconnue.
- **Recommandations soumises, non exécutées :** examiner la politique des pages de match historiques, diagnostiquer l’accès du fichier AR côté hébergement, décider d’une directive unique pour les pages d’erreur, décider de l’indexation des JSON et valider toute correction de langue/hreflang/sitemap.
- **Contrôles effectués :** inspection de l’export local et requêtes HTTP GET publiques sans écriture. Aucun build ou suite `npm test`/TypeScript/lint n’a été relancé ; aucune modification de code ou de métadonnée, aucune règle de purge/redirection, aucun push ou déploiement.
- **Résultat / validation :** diagnostic remis ; corrections non commencées. Toutes les actions correctives attendent l’analyse et une décision explicite du chef de projet.

## 2026-11-03 — Centralisation documentaire des rapports

- **Commit de base exact sur lequel les documents ont été préparés :** `325526d93c63fc52143741a5b739cf68f7ba0809`.
- **Branche :** `redesign/professional-global-2026-11-03`.
- **Fichiers créés par cette mission :** `docs/project/reports/RAPPORT_DIAGNOSTIC_PHASE1.md`, `docs/project/reports/JOURNAL_PROJET.md`, `docs/project/reports/ETAT_PROJET.md`.
- **Fichiers applicatifs touchés :** aucun. Rapport d’audit central initial conservé sans modification.
- **Preuves, contrôles et résultat :** commit local de création des trois documents `97fa668e18dd758a774b022541dd546d870e6c06`; présence et lecture des trois fichiers confirmées, `git diff --check` réussi et commit ne contenant que ces trois chemins. Au contrôle de ce commit, la branche locale était en avance d’un commit sur `origin/redesign/professional-global-2026-11-03`; aucun push n’a été effectué. La mise à jour suivante de l’état et du journal est limitée à ces deux fichiers et reste locale.
- **Décision en attente :** attendre l’analyse du chef de projet avant toute correction de code, de contenu, de métadonnées, de redirection ou de règle serveur.

## Protocole obligatoire pour les prochaines missions

1. Avant d’agir, relever branche, commit et état du dépôt.
2. Après chaque mission, ajouter une nouvelle entrée datée dans ce journal et mettre à jour `ETAT_PROJET.md`; créer un nouveau rapport daté plutôt que remplacer un ancien.
3. Pour chaque mission, inscrire le commit source exact, les fichiers concernés, les faits et hypothèses distinctement, les preuves, les tests réellement exécutés et le résultat.
4. Indiquer explicitement les tâches en attente d’une décision du chef de projet.
5. Vérifier réellement les fichiers écrits et le commit avant de déclarer les documents à jour.
6. Ne pas pousser sur GitHub et ne pas toucher à `main` ou à la production sans autorisation explicite.

## 2026-11-03 — Mise à jour des preuves de validation documentaire

- **Commit exact de base de cette mise à jour :** `97fa668e18dd758a774b022541dd546d870e6c06`, branche `redesign/professional-global-2026-11-03`.
- **Fichiers modifiés :** `docs/project/reports/ETAT_PROJET.md` et `docs/project/reports/JOURNAL_PROJET.md` uniquement. `RAPPORT_DIAGNOSTIC_PHASE1.md` et tous les fichiers applicatifs sont inchangés.
- **Faits et validation consignés :** présence et lecture des trois rapports confirmées ; `git diff --check` a réussi sur le commit initial ; `97fa668e18dd758a774b022541dd546d870e6c06` contient exactement les trois fichiers de rapports. Au contrôle de ce commit, le dépôt local était en avance d’un commit sur l’upstream et aucun push n’avait été effectué.
- **Résultat de cette mission :** les deux mises à jour sont enregistrées dans un nouveau commit local limité à ces deux chemins. Aucun push GitHub, changement de branche, intervention sur `main` ou production. Le SHA de ce nouveau commit et l’état local/distant exacts sont communiqués dans la réponse de remise.
- **Décisions en attente :** toutes les corrections Phase 1 restent suspendues jusqu’à l’analyse et aux instructions du chef de projet.


## 2026-11-03 — Vérification intégrale des rapports et traçabilité

- **Commit source exact de l’instantané contrôlé :** `bdc0544cf97a30a87d06a70312f1f37ced2de91c`, branche `redesign/professional-global-2026-11-03`. La branche amont locale `origin/redesign/professional-global-2026-11-03` pointait sur `325526d93c63fc52143741a5b739cf68f7ba0809`. Les commits locaux observés dans l’ordre étaient `97fa668e18dd758a774b022541dd546d870e6c06`, puis `bdc0544cf97a30a87d06a70312f1f37ced2de91c` : avance de deux commits. L’arbre était propre à cet instant et aucun push n’avait été effectué. Cet instantané décrit le HEAD avant le commit de cette mission.
- **Fichiers lus intégralement :** `docs/project/reports/RAPPORT_DIAGNOSTIC_PHASE1.md` (244 lignes), `docs/project/reports/JOURNAL_PROJET.md` et `docs/project/reports/ETAT_PROJET.md`.
- **Faits vérifiés dans le rapport :** section 1 (lignes 21–48), tableau des dix URL 404 aux lignes 29–38, snapshots locaux cités et absence de pages HTML exportées ; section 2 (lignes 50–62), URL San Diego AR 403, variantes FR/EN à 200, HTML local présent et cause sous-jacente non établie. Les sections 3–10 incluent les constats robots/archives, la route EN, la matrice des 64 routes, les hreflang, les pages protégées, le gabarit des 864 pages de match, les recommandations et les contrôles rapportés. Le total contrôlé est de 11 URL concernées : dix 404 et une 403.
- **Faits vérifiés dans le journal et l’état :** les entrées Phase 1 et validation documentaire distinguent explicitement faits, hypothèses/limites, recommandations, contrôles, décisions en attente et actions à soumettre. Les tâches restant au chef de projet sont récapitulées dans `ETAT_PROJET.md`, section « Décisions et actions en attente du chef de projet ».
- **Hypothèses et limites de cette vérification :** les statuts HTTP et les preuves techniques du diagnostic antérieur ont été contrôlés dans les documents ; ils n’ont pas été rejoués pendant cette mission. Le contrôle Git porte sur les références locales présentes au moment de l’instantané et ne réinterroge pas le serveur distant.
- **Décisions et tâches en attente :** aucune correction applicative autorisée ou entreprise. Les décisions listées dans le rapport, section 10, restent en attente : devenir des dix pages match historiques, investigation hébergement du 403 AR, politique robots des pages d’erreur, indexation éventuelle des JSON, attributs de langue/hreflang et changements éventuels du sitemap. Attendre l’analyse et les instructions explicites du chef de projet.
- **Contrôles réellement effectués dans cette mission :** lecture complète des trois fichiers ; inspection de HEAD, référence amont, chaîne des commits, fichiers inclus dans les deux commits précédents et propreté de l’arbre. Aucun build, test, contrôle TypeScript/lint, appel HTTP ou changement applicatif effectué. Seuls `ETAT_PROJET.md` et `JOURNAL_PROJET.md` sont mis à jour ; `RAPPORT_DIAGNOSTIC_PHASE1.md` est conservé inchangé. Les mises à jour restent locales, sans push ; le SHA du commit de cette mission est communiqué avec le compte rendu.
