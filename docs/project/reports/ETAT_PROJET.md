# État du projet BTTSPredict

**État établi le 3 novembre 2026.**

## Référence de travail

- **Branche active :** `redesign/professional-global-2026-11-03`.
- **Commit source du diagnostic Phase 1 :** `325526d93c63fc52143741a5b739cf68f7ba0809`.
- **Commit du code échantillonné par l’audit central :** `71cf295e9d07794ea04b88710d474561cf128b35`.
- **Commit local de création des trois documents :** `97fa668e18dd758a774b022541dd546d870e6c06` (`docs: centralize phase 1 project reports`). Ce commit documentaire n’est pas le commit source du diagnostic.
- **État Git vérifié sur le commit de création des documents :** branche locale en avance d’un commit sur `origin/redesign/professional-global-2026-11-03`; aucun push effectué. La mise à jour courante du journal et de cet état est un nouveau commit local et ne sera pas poussée.
- **Dossier de rapports permanent :** `docs/project/reports/`.

## Phase en cours

**Phase 2A — Conception technique terminée, validation en attente.** Phase 1 est terminée; le plan de corrections est consigné dans `PLAN_CORRECTIONS_PHASE2.md`. La Phase 2B d’implémentation n’a pas commencé. Aucun code, contenu, métadonnée, route, redirection ou règle serveur ne doit être modifié avant validation explicite du chef de projet.

## Travaux terminés

- Phase 0 : audit technique, SEO et inventaire consigné dans `docs/project/BTTSPREDICT_AUDIT_COMPLET.md`.
- Phase 1 : diagnostic en lecture seule des dix URL match en 404, de l’URL match AR en 403, des robots d’erreur, de l’index d’archive, de `/en/over-2-5/statistics` et des 64 routes éditoriales FR/EN/AR.
- Matrice SEO exhaustive route par route et gabarit des 864 fichiers match consignés dans `RAPPORT_DIAGNOSTIC_PHASE1.md`.
- Phase 2A : conception des corrections P0.1, P0.2, P0.3 et P1, comparaison des trois stratégies match, inventaire des risques, critères de tests et recommandation en attente d’approbation dans `PLAN_CORRECTIONS_PHASE2.md`.
- Les documents permanents ont été créés, lus et validés. Voir la validation détaillée dans `JOURNAL_PROJET.md`.

## Décisions et actions en attente du chef de projet

1. Valider l’option B pour les anciennes URL match et choisir le périmètre initial : 10 pages FR ou 30 variantes FR/EN/AR; confirmer les critères de qualité, de fidélité historique et d’indexation.
2. Demander l’investigation d’hébergement pour le 403 de `/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25` (artefact, chemin, permissions, règles actives et journaux).
3. Valider la politique robots/HTTP des 404, 403, archives HTML, fichiers JSON et pages normales, notamment l’usage de `X-Robots-Tag` pour les JSON.
4. Valider l’approche de rendu initial de `lang`/`dir` et le H1 serveur des trois pages statistiques.
5. Décider de l’alignement hreflang/sitemap, du choix français `fr` ou `fr-SN`, et de la conduite à tenir pour les familles qui touchent une page SEO protégée. Aucun changement touchant les cinq pages gelées sans validation distincte.
6. Maintenir `/en/over-2-5/statistics` comme route non prise en charge jusqu’à une décision éditoriale séparée; aucune route à créer dans la Phase 2A.
7. Autoriser explicitement une phase d’implémentation distincte. Aucun changement applicatif, hébergement, production ou push GitHub n’est autorisé avant validation.

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
