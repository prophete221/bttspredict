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
- **Preuves, contrôles et résultat :** les fichiers sont vérifiés après écriture, puis enregistrés dans un commit local limité à ces trois chemins. SHA du commit local communiqué dans le message de remise. Aucun push GitHub, intervention sur `main` ou production n’est autorisé par cette mission.
- **Décision en attente :** attendre l’analyse du chef de projet avant toute correction de code, de contenu, de métadonnées, de redirection ou de règle serveur.

## Protocole obligatoire pour les prochaines missions

1. Avant d’agir, relever branche, commit et état du dépôt.
2. Après chaque mission, ajouter une nouvelle entrée datée dans ce journal et mettre à jour `ETAT_PROJET.md`; créer un nouveau rapport daté plutôt que remplacer un ancien.
3. Pour chaque mission, inscrire le commit source exact, les fichiers concernés, les faits et hypothèses distinctement, les preuves, les tests réellement exécutés et le résultat.
4. Indiquer explicitement les tâches en attente d’une décision du chef de projet.
5. Vérifier réellement les fichiers écrits et le commit avant de déclarer les documents à jour.
6. Ne pas pousser sur GitHub et ne pas toucher à `main` ou à la production sans autorisation explicite.
