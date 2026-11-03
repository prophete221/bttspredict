# Plan de corrections — Phase 2A : conception technique

**Date :** 3 novembre 2026
**Projet :** BTTSPredict
**Branche de travail :** `redesign/professional-global-2026-11-03`
**Commit local de référence avant cette mise à jour documentaire :** `d6fa1b4ac547a553086536428ee62d350dd4b435`
**Référence amont observée :** `325526d93c63fc52143741a5b739cf68f7ba0809` (branche locale en avance de trois commits documentaires; aucun push effectué).
**Statut :** proposition de conception, à valider par le chef de projet avant toute implémentation.

> Phase 2A reste strictement documentaire. Aucun code, contenu, donnée, route, règle d’hébergement, paramètre d’affiliation ou fichier Firebase n’a été modifié. Aucun build, test, appel HTTP nouveau ou déploiement n’a été exécuté pendant cette phase. Aucun push GitHub n’est autorisé.

## Décision proposée en bref

1. **P0.1 : retenir l’option B, avec sélection explicite par URL et par langue.** Restaurer en premier les dix anciennes URL FR déjà documentées dans l’export GSC, sous réserve d’un contrôle de complétude et de fidélité historique. Cela représente **10 nouvelles pages FR**. Ne créer leurs variantes EN/AR que si leurs propres URL, usages ou contenu localisé sont justifiés; si les trois langues sont générées pour chacun des dix slugs, le total est **30 nouvelles pages**. N’ajouter au sitemap que les pages satisfaisant les critères d’indexation ci-dessous. Ne pas générer automatiquement les 651 slugs.
2. **P0.2 : ne pas modifier `.htaccess` pour tenter de corriger le 403.** Les artefacts locaux sont présents; l’échec est ciblé côté serveur. L’équipe d’hébergement doit comparer le fichier et le chemin effectivement déployés, leurs permissions, les règles Apache actives, le WAF/CDN et les journaux. Aucun changement production ne relève de cette phase.
3. **P0.3 : définir une seule politique par statut et type de fichier.** 404 et 403 restent de vrais codes HTTP; les erreurs sont `noindex`. Garder l’index d’archive HTML accessible mais `noindex, follow`; si l’on décide d’exclure les JSON, le faire par en-tête HTTP `X-Robots-Tag`, sans bloquer leur crawl dans `robots.txt`. Les pages ordinaires restent indexables.
4. **P1 : rendre la langue et la direction correctes dans le HTML initial; rendre le H1 de statistiques côté serveur; aligner les alternates uniquement pour des familles de pages réellement équivalentes et réciproques.** Les cinq URL SEO protégées restent gelées. Toute modification de leur signal `hreflang` ou de leur entrée sitemap qui serait nécessaire pour obtenir une réciprocité doit être portée à une validation distincte avant implémentation.

## P0.1 — Pages historiques de matchs

### Preuves et mesure du corpus

`src/lib/matches.ts` lit les snapshots de `public/predictions-archive/` mais limite leur chargement aux **14 fichiers les plus récents** (`slice(-14)`), puis fusionne `public/predictions.json`. La route `src/app/match/[slug]/page.tsx` est en génération statique (`dynamicParams = false`). Le diagnostic Phase 1 a confirmé que les dix URL 404 ont des snapshots source, mais aucun HTML exporté dans cette fenêtre active (`docs/project/reports/RAPPORT_DIAGNOSTIC_PHASE1.md`, §1, lignes 21–48). Les 91 snapshots locaux contiennent **651 slugs distincts**; la fenêtre active en contient **288**, ce qui correspond aux **864 HTML match actuels** (288 × FR/EN/AR). Le JSON courant fournit 56 slugs, sans en ajouter à l’union des 14 snapshots. Les mesures de taille portent sur les fichiers HTML bruts de l’export local et ne sont pas des mesures de transfert compressé.

Les dix URL FR concernées cumulent **35 impressions, 0 clic** dans l’export GSC du 4 au 31 octobre 2026. Une URL compte 19 impressions; les neuf autres en comptent de 1 à 5 chacune. Ces métriques sont un agrégat de période, pas une preuve de demande actuelle après le GET 404 du 3 novembre. Source : `docs/project/BTTSPREDICT_AUDIT_COMPLET.md`, lignes 1386–1501, plus limites de l’export aux lignes 17–25.

| Ancienne URL FR | Snapshot(s) local(aux) contenant le match | Clics / impressions | Position moyenne |
|---|---|---:|---:|
| `/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10` | 2026-10-04 à 2026-10-09 | 0 / 19 | 12,32 |
| `/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20` | 2026-10-18, 2026-10-19 | 0 / 5 | 5,80 |
| `/match/borussia-dortmund-vs-werder-bremen-2026-10-09` | 2026-10-03 à 2026-10-08 | 0 / 3 | 4,67 |
| `/match/southampton-vs-bolton-wanderers-2026-10-17` | 2026-10-15, 2026-10-16 | 0 / 2 | 11,00 |
| `/match/fc-heidenheim-vs-kaiserslautern-2026-10-09` | 2026-10-03 à 2026-10-08 | 0 / 1 | 6,00 |
| `/match/nashville-sc-vs-toronto-fc-2026-09-27` | 2026-09-20 à 2026-09-26 | 0 / 1 | 9,00 |
| `/match/st-pauli-vs-vfl-wolfsburg-2026-09-12` | 2026-09-11 | 0 / 1 | 10,00 |
| `/match/waasland-beveren-vs-lommel-sk-2026-10-09` | 2026-10-03 à 2026-10-08 | 0 / 1 | 12,00 |
| `/match/west-ham-united-vs-queens-park-rangers-2026-10-09` | 2026-10-03 à 2026-10-08 | 0 / 1 | 89,00 |
| `/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09` | 2026-10-03 à 2026-10-08 | 0 / 1 | 123,00 |

### Comparaison des options

| Option | Pages HTML supplémentaires | Taille brute estimée | Temps de build | SEO et duplication | Historique | FR/EN/AR | Canonicals, sitemap et robots |
|---|---:|---:|---|---|---|---|---|
| **A. Générer tous les matchs de tous les snapshots conservés** | **+1 089** (651 slugs × 3 langues, moins les 864 pages déjà générées); **1 953 au total** | Environ **+133 Mo** de HTML brut, à partir de la moyenne observée d’environ 122 Ko par page; les HTML match passeraient d’environ 105,7 Mo à 239 Mo. Compression et taille réellement transférée non mesurées. | Le nombre de rendus de page serait multiplié par environ **2,26** (+126 % sur le lot match). Le temps global ne peut pas être extrapolé précisément sans benchmark : compilation, I/O et génération peuvent évoluer différemment. | Risque élevé d’indexation à grande échelle de pages anciennes, répétitives ou trop peu utiles. Les trois variantes ne sont pas des doublons stricts si leur contenu est réellement traduit, mais l’absence de hreflang actuelle et la qualité variable peuvent créer de la confusion. La génération seule ne force pas l’indexation; sitemap, liens et directives déterminent la découverte et l’indexabilité. | Rend accessibles les matchs dont les snapshots existent au moment du build. **Ne garantit pas une conservation permanente** : la purge des archives (`scripts/prune-archives.mjs`, `KEEP = 90`) peut retirer la source plus tard. L’agrégation actuelle peut aussi reprendre une version incomplète si les snapshots d’un match divergent; il faudra définir quelle ligne historique fait autorité. | Possible pour les 3 langues avec le gabarit existant, mais ne prouve pas que chaque variante a une URL utile ou un contenu localisé suffisamment substantiel. | Canonical propre à chaque URL seulement si les pages correspondent à des versions linguistiques distinctes; hreflang réciproque entre équivalents réels. Ne pas inscrire tout le corpus au sitemap par défaut. N’utiliser ni `Disallow` pour masquer un corpus à indexer ni une redirection générique; les pages non retenues pour l’index doivent porter `noindex` si elles sont servies. |
| **B. Générer une sélection fondée sur URL connue, signaux SEO ou historique utile** | **+10 pages FR** pour le périmètre vérifiable des dix anciennes URL; **+30** si les 10 variantes FR/EN/AR sont générées ensemble. Au-delà, le nombre dépendra de l’inventaire; plafond théorique identique à A (**+1 089**). | Environ **+1,2 Mo brut** pour 10 HTML FR; environ **+3,7 Mo** pour 30 pages. Estimation linéaire fondée sur le gabarit actuel, pas une mesure d’un build futur. | Faible hausse attendue : environ +1,2 % du lot match pour 10 pages ou +3,5 % pour 30, au nombre de rendus; temps réel non mesuré. | Risque modéré et contrôlable si l’éligibilité est explicite. Les seuls signaux GSC des dix URL sont faibles (35 impressions, aucun clic), donc la sélection ne doit pas reposer sur les impressions seules. Réduire le risque par une revue de contenu, de provenance, de fraîcheur et de doublons, et par `noindex` lorsque la page est utile mais pas assez complète pour l’indexation. | Préserve les URL choisies même après leur sortie de la fenêtre active, à condition d’enregistrer une source historique stable et de vérifier les résultats publiés. La liste d’éligibilité ne doit pas dépendre d’un snapshot que la purge supprimera sans stratégie de conservation. | Sélectionner les variantes **par chemin/langue**, pas seulement par slug. Le périmètre prouvé aujourd’hui est constitué de 10 URL FR. Ne créer EN/AR que si une URL existante, un signal, un lien ou une traduction de qualité le justifie; ne pas ajouter des variantes simplement parce que le gabarit les permet. | Canonical auto-identique pour chaque page historique distincte. Hreflang seulement si toutes les versions déclarées existent en 200, sont réellement équivalentes et se déclarent réciproquement. Sitemap réservé aux pages indexables, canoniques et en 200. Pages retenues pour la consultation mais non éligibles à l’index : `noindex, follow`, crawlables. |
| **C. Garder la génération actuelle; rediriger seulement vers une destination réellement équivalente** | **0 page** ajoutée; au plus 10 redirections si, après contrôle, une destination exacte existe pour chacune. Aucune équivalence de ce type n’est établie pour les dix cas dans les preuves actuelles. | **0 Mo** de HTML ajouté; quelques octets de règles par redirection, si nécessaire. | Pas d’impact de génération match; vérification des règles et du comportement hébergeur à prévoir. | Risque faible de duplication si la cible est réellement le même match et la même intention. Risque élevé si les URL vont vers l’accueil, les pronostics du jour ou une autre rencontre : redirection non pertinente et perte de contexte. | Les snapshots restent disponibles localement tant qu’ils sont conservés, mais ne restaurent pas l’accès public; aucune page historique n’est conservée à l’URL d’origine. | Aucune nouvelle variante. Une redirection localisée n’est possible que vers une URL équivalente dans la même langue ou une cible expressément choisie et pertinente. | 301 seulement pour une équivalence vérifiée, avec cible 200 et canonical cohérent. Les URL redirigées sont exclues du sitemap; ne pas bloquer la source dans `robots.txt`. Sans destination équivalente, conserver une réponse 404 et appliquer la politique 404. |

### Critères d’éligibilité recommandés pour l’option B

Établir un manifeste d’éligibilité stable, plutôt que d’utiliser « toutes les lignes de snapshot » comme critère. Une page conservée doit avoir un slug stable, un match et une date déterminables, un contenu provenant du snapshot correspondant, une provenance/date de publication traçable, et aucun conflit non résolu entre snapshots. Si un résultat est affiché, sa validation doit s’appuyer sur la source de résultat documentée; ne pas inventer ou reconstituer un score. Vérifier qu’elle n’est pas un doublon d’une URL déjà servie ou redirigée. Examiner les signaux URL par URL (GSC, liens, visites ou maillage) et la valeur d’usage de l’historique; les impressions seules ne suffisent pas. Pour chaque locale, confirmer que l’URL a une utilité démontrable et que les éléments éditoriaux sont réellement localisés.

La génération et l’indexation sont deux décisions distinctes : une page retenue peut être accessible mais `noindex, follow` si elle conserve une valeur d’historique sans répondre au seuil éditorial d’indexation. La sélection indexable seule entre dans le sitemap. Les archives doivent rester explorables si un `noindex` est utilisé; ne pas les bloquer dans `robots.txt`.

### Recommandation

**B est recommandé**, limité d’abord aux dix URL FR déjà connues et après vérification des données historiques; cela préserve les URL ayant au moins un signal vérifiable sans créer d’emblée 1 089 pages supplémentaires. Le volume initial quantifiable est **10 pages**, avec un plafond de **30** si le chef de projet choisit d’inclure les variantes EN/AR. La faible demande GSC de ce lot appelle une revue individuelle : un statut 200 n’implique pas automatiquement l’indexation. Si une ligne échoue aux critères de fidélité, de contenu ou de locale, ne pas publier une page faible pour satisfaire un compteur; laisser l’URL en 404 ou soumettre une destination équivalente au cas par cas. Ne jamais rediriger une ancienne rencontre vers une page générale.

## P0.2 — 403 sur une URL arabe

**URL concernée :** `/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25`.

### Ce qui est vérifiable localement

- Le diagnostic Phase 1 a constaté un GET public 403 sur cette seule URL observée, alors que les variantes FR/EN et une autre page match AR répondaient 200 (`RAPPORT_DIAGNOSTIC_PHASE1.md`, §2, lignes 50–62).
- L’export local contient les fichiers `out/match/{slug}.html`, `out/en/match/{slug}.html` et `out/ar/match/{slug}.html`; le chemin contient un slug ASCII, sans caractère arabe ni normalisation Unicode à résoudre. Les fichiers locaux étaient présents et lisibles.
- `src/app/[locale]/match/[slug]/page.tsx` et `src/app/match/[slug]/page.tsx` génèrent les variantes; `next.config.ts:3–9` active `output: "export"`.
- Les règles versionnées de `public/.htaccess` gèrent redirections, résolution des fichiers HTML et erreurs 404, sans règle explicite de blocage de `/ar/match/` dans le fichier inspecté. `public/_headers` n’établit pas qu’un en-tête est appliqué au serveur public. Le `Caddyfile` local ne prouve pas que le site public passe par Caddy.
- Le workflow `.github/workflows/deploy.yml` montre un export puis un transfert FTP; il documente un précédent `553 Permission denied` sur l’écrasement du `.htaccess`. C’est un axe de diagnostic, **pas** la preuve que ce fichier match précis est absent, mal placé ou mal permissionné en production.

### Diagnostic par hypothèse

| Hypothèse | Conclusion autorisée par les preuves locales |
|---|---|
| Fichier exporté | **Présent localement** sous `out/ar/match/{slug}.html`; une erreur de génération locale n’explique donc pas le 403. L’existence de la copie distante reste à confirmer. |
| Nom ou chemin | **Pas d’anomalie locale apparente** : le slug est ASCII et le fichier attendu existe. Le mapping FTP/`DocumentRoot`, la casse et le chemin réellement résolu par l’hôte restent inconnus. |
| Règles `.htaccess` | **Aucun blocage `/ar/match/` explicite** dans la version du dépôt consultée; impossible de dire si cette version ou d’autres règles parent sont actives sur le serveur. |
| Permissions/protections | **Indéterminé** : seules les permissions locales sont visibles. Les ACL/modes du serveur et filtres WAF/CDN nécessitent les accès et journaux de l’hébergeur. |
| Configuration propre au serveur | **Indéterminée** : l’hôte réel et son virtual host/configuration effective ne sont pas établis par les fichiers locaux. |

### Ce qui nécessite un accès réel à l’hébergement

Impossible, depuis le seul dépôt, de départager : fichier manquant dans le `DocumentRoot` ou mauvais chemin FTP; permissions/propriétaire/ACL d’un fichier ou dossier parent; `.htaccess` effectivement servi ou règles parent avec `AllowOverride`/modules; filtre WAF/ModSecurity/CDN ou configuration propre au virtual host; cache incohérent. L’état local, les modes locaux et le contenu de `.htaccess` ne prouvent pas la configuration déployée.

### Diagnostic serveur à demander, sans changement de production

1. Comparer l’existence, taille et date du fichier distant à `out/ar/match/{slug}.html`; confirmer le `DocumentRoot`, le niveau FTP et la convention réelle (fichier `.html` plat ou répertoire avec index).
2. Comparer la casse, l’URI brute reçue, son chemin décodé, le chemin disque et les éventuels encodages doubles. Le slug observé est ASCII; l’arabe de la page est le contenu, pas le nom de chemin.
3. Comparer propriétaire, groupe, mode et ACL du fichier et de chaque dossier parent à une page AR qui répond 200 et aux variantes FR/EN du même match. Confirmer la copie du fichier dans le journal FTP.
4. Lire le `.htaccess` effectivement déployé, la configuration Apache/virtual host et les règles parent; identifier le serveur/CDN réellement utilisé. Vérifier les journaux d’accès, d’erreur et WAF à l’heure exacte du 403 afin de repérer la règle ou permission qui l’a produit.
5. Après diagnostic et autorisation séparée, valider en environnement de test puis avec un GET non destructif que l’URL AR prévue retourne 200, le bon HTML, et que FR/EN ne régressent pas. Ne pas remplacer le 403 par une 404 ou une redirection par défaut.

## P0.3 — Politique robots et réponses HTTP

| Ressource | Réponse HTTP attendue | Balise HTML / en-tête attendu | Sitemap et `robots.txt` |
|---|---|---|---|
| **Page réellement introuvable** | `404` réel, jamais une home en `200` (soft 404). | Une seule directive cohérente : `<meta name="robots" content="noindex, follow">`; si le serveur contrôle mieux les pages d’erreur, `X-Robots-Tag: noindex, follow` cohérent avec le HTML. Retirer l’héritage contradictoire `index, follow` de la réponse d’erreur lors d’une future correction approuvée. | Exclure du sitemap. Laisser la route explorable; un blocage `robots.txt` empêcherait le crawler de lire le `noindex`. Les règles `.htaccess` existantes renvoient déjà un 404 prévu, mais le HTML exporté contenait les deux directives selon Phase 1.
| **Page refusée** | `403` tant que l’accès doit réellement être refusé. Pour le match AR qui doit être public, diagnostiquer d’abord le serveur puis viser `200`, pas maquiller l’incident en 404. | Pour la page générique 403, en-tête `X-Robots-Tag: noindex, nofollow`; si un HTML d’erreur est livré, balise équivalente. Un en-tête est préférable quand le robot ne peut pas lire le corps. Ne pas imposer ces directives à la page match une fois son accès public corrigé. | Exclure le 403 du sitemap; ne pas bloquer la route uniquement pour masquer le refus. État de l’en-tête à confirmer sur l’hôte réel.
| **Index HTML des archives** | `200`. | Conserver `noindex, follow` en HTML. Un `X-Robots-Tag` identique est facultatif si la balise est fiable; éviter des signaux contradictoires. | Hors sitemap si la page n’est pas destinée à l’index; garder crawlable afin que les moteurs voient `noindex` et suivent les liens.
| **JSON d’archives** | `200 application/json` lorsque le fichier existe. | La balise de la page d’index ne s’applique pas aux fichiers JSON. Recommandation : si l’objectif est de ne pas indexer les réponses JSON brutes, fournir `X-Robots-Tag: noindex` (ou `noindex, follow` si les liens sont pertinents) sur les seuls JSON. Aucun `<meta>` n’est possible dans un JSON. | Hors sitemap. Ne pas interdire le crawl des JSON si l’on compte sur l’en-tête pour leur désindexation. Confirmer que l’hébergement FTP honore la règle d’en-tête; `_headers` seul n’en est pas la preuve.
| **Page normale indexable** | `200`. | `index, follow` unique ou absence de directive restrictive (valeur par défaut); pas de `X-Robots-Tag: noindex`. Canonical auto-identique ou autre cible seulement si le contenu est réellement équivalent. | Autoriser le crawl. Inclure au sitemap uniquement si la page est indexable, canonique, en 200 et non redirigée.

`public/robots.txt` autorise globalement le crawl hors `/api/` et `/admin`; il ne faut pas ajouter de blocage de `/predictions-archive/` si un `noindex` HTML ou HTTP doit être observé. La balise `noindex` de `public/predictions-archive/index.html` ne couvre pas les fichiers JSON. Le serveur public et le support de `X-Robots-Tag` restent à vérifier. Toute modification de `public/.htaccess`, `public/_headers`, `public/robots.txt` ou du sitemap attend une validation explicite.

Le diagnostic Phase 1 a aussi relevé qu’un JSON du 3 novembre 2026 existe localement mais répondait 404 publiquement (`RAPPORT_DIAGNOSTIC_PHASE1.md`, lignes 76–78). Cet écart de déploiement n’établit pas une directive robots et doit rester distinct de la politique d’indexation des JSON.

## P1 — Langue, direction, H1 et versions localisées

### `lang` et `dir` dans le HTML initial

`src/app/layout.tsx` rend actuellement `<html lang="fr">` sans `dir`; son script navigateur change ensuite les attributs pour `/en` et `/ar`. Le layout localisé `src/app/[locale]/layout.tsx` ne définit qu’un `<div>` intérieur. Ainsi, les valeurs du document initial sont incorrectes pour EN/AR. Le référentiel local est `LOCALE_META` dans `src/lib/i18n.ts`: FR `fr-SN/ltr`, EN `en/ltr`, AR `ar/rtl`.

**Proposition :** rendre les attributs de l’élément `<html>` au moment du build/rendu, avec la locale du chemin et la valeur de `LOCALE_META`; le HTML initial devrait être FR `lang="fr-SN" dir="ltr"`, EN `lang="en" dir="ltr"`, AR `lang="ar" dir="rtl"`. Le script client ne doit plus être la source de vérité. La piste d’architecture à valider en amont est celle de layouts racine multiples sous un groupe de routes FR sans segment visible et sous le segment dynamique `[locale]` pour EN/AR. La documentation Next.js autorise un layout racine sous un segment dynamique et plusieurs root layouts; les transitions entre root layouts deviennent des chargements de page complète ([Next.js — layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout), [Next.js — internationalisation](https://nextjs.org/docs/app/guides/internationalization)). Comme ce dépôt a un root layout partagé et un export statique, le déplacement des routes/layouts doit faire l’objet d’un spike isolé et d’une validation de build avant toute mise en œuvre. Ne pas ajouter de segment `/fr` : les URL françaises doivent rester identiques.

Le changement doit conserver exactement les métadonnées globales gelées par `tests/seo-preservation.test.ts`; l’attribut racine ne justifie aucun changement de title, canonical, URL ou contenu des cinq pages protégées. `lang`/`dir` améliorent la sémantique, l’accessibilité et le rendu RTL; ils ne remplacent pas `hreflang`.

### Trois H1 manquants dans le HTML statique initial

Les routes visées sont `/statistiques`, `/en/statistiques` et `/ar/statistiques`. Il ne s’agit pas de `/btts/statistics` ni de `/over-2-5/statistics`, qui ont leurs propres H1. `StatistiquesClient.tsx` est client-side, démarre avec les données nulles et affiche un état de chargement avant de rendre le titre; son H1 final dépend de l’arrivée de `win-history.json` et peut manquer si le chargement échoue.

**Proposition :** faire émettre un H1 localisé depuis le wrapper serveur de chacune des trois routes, présent même pendant le chargement et en erreur, sans dépendre de JavaScript ni inventer de chiffres. Passer/centraliser le libellé `Statistiques vérifiées`, `Verified statistics`, `إحصائيات موثقة`; retirer ou convertir le titre client actuel pour qu’il n’y ait jamais deux H1 après hydratation. Ne pas modifier le H1 des cinq URL SEO protégées. Le changement doit laisser intactes les règles d’intégrité des données de `StatistiquesClient.tsx`.

### Hreflang, canonical et sitemap

`src/app/sitemap.ts` déclare 19 chemins localisés et produit les alternates FR/EN/AR et `x-default`. La matrice Phase 1 relève des annotations HTML absentes ou asymétriques : par exemple `/btts-and-over-2-5-predictions-today` a des variantes sitemap mais pas d’hreflang HTML; sur Linebet FR déclare un groupe dont EN/AR ne renvoient pas d’alternates. La racine HTML initiale et les pages de match ne sont pas alignées; plusieurs routes éditoriales ont une équivalence déclarée par sitemap sans annotation HTML correspondante. Voir `RAPPORT_DIAGNOSTIC_PHASE1.md`, lignes 90–191.

**Règle cible :** maintenir une liste source de familles de pages dont les versions sont réellement équivalentes et accessibles. Pour chaque membre d’un groupe, émettre dans le HTML la même liste d’URL absolues HTTPS, inclure l’URL elle-même, rendre les références réciproques, et s’assurer que chaque cible répond 200 et possède son propre canonical. Le sitemap doit reproduire cette même famille et ne lister que les URL canoniques, indexables, en 200 et non redirigées. Ne pas utiliser hreflang comme substitut au canonical; un canonical d’une page localisée reste auto-identique. N’ajouter aucun chemin localisé non pris en charge (notamment `/en/over-2-5/statistics`); ne pas inventer de traductions ou d’alternates pour les statistiques par marché FR seules. N’émettre `x-default` que lorsqu’une vraie page de repli est définie. Pour les indications Google, chaque variante doit lister les autres variantes et s’inclure elle-même ([Google Search Central — versions localisées](https://developers.google.com/search/docs/specialty/international/localized-versions)).

La cohérence des codes de langue doit être décidée et centralisée : le layout utilise `fr-SN` pour le HTML, tandis que plusieurs annotations/sitemap emploient `fr` et une page utilise `fr-SN`. Ne normaliser ni `fr` ni `fr-SN` sans choix explicite du marché visé; la valeur doit être cohérente dans la liste de familles, sans confondre langue HTML et URL.

**Garde-fou des cinq pages SEO protégées :** `/en/btts-and-over-2-5-predictions-today`, `/en`, `/en/over-2-5/predictions/today`, `/` et `/en/ai-correct-score-predictions` ne doivent subir aucune modification de leur URL, canonical, redirection, title, H1 ou contenu performant. Leurs alternates existants et leur représentation sitemap ne doivent pas être changés par effet de bord. Si la réciprocité requiert une annotation ou modification de sitemap qui les affecte, arrêter et demander une validation dédiée. Le test `tests/seo-preservation.test.ts` protège également par empreinte `src/app/sitemap.ts`; son évolution éventuelle devra conserver une vérification sémantique explicite de toutes les protections, et ne peut pas être faite dans cette phase.

## Fichiers concernés pour une phase ultérieure

Les fichiers ci-dessous sont des **candidats d’inspection/modification après validation**, pas des fichiers modifiés dans cette phase :

- **P0.1 :** `src/lib/matches.ts`; `src/app/match/[slug]/page.tsx`; `src/app/[locale]/match/[slug]/page.tsx`; `public/predictions-archive/*.json` (source en lecture seule); éventuellement un manifeste d’éligibilité et une politique de conservation à définir. Ne pas changer `scripts/prune-archives.mjs` sans décision dédiée.
- **P0.2 :** inspection de l’artefact `out/ar/match/{slug}.html`, du workflow `.github/workflows/deploy.yml` et des logs/configurations réellement présents chez l’hébergeur. Pas de changement de production dans la phase documentaire.
- **P0.3 :** `src/app/layout.tsx` et `src/app/not-found.tsx` pour le HTML d’erreur; éventuellement `public/.htaccess`, `public/_headers`, `public/robots.txt`, `public/predictions-archive/index.html`, et configuration HTTP de l’hébergeur pour les JSON. Ces règles sont en attente d’approbation.
- **P1 :** `src/app/layout.tsx`; `src/app/[locale]/layout.tsx`; les wrappers et le composant `src/app/statistiques/page.tsx`, `src/app/[locale]/statistiques/page.tsx`, `src/app/statistiques/StatistiquesClient.tsx`; métadonnées des routes localisées; `src/app/sitemap.ts`; tests SEO pertinents. `src/lib/i18n.ts` est actuellement protégé par une empreinte de test; éviter de le modifier sans décision spécifique.

Aucun des chemins ci-dessus n’a été touché. Seuls les documents explicitement autorisés — `ETAT_PROJET.md`, `JOURNAL_PROJET.md` et le présent plan — peuvent être mis à jour pendant Phase 2A.

## Tests et critères d’acceptation à préparer après approbation

Aucun des tests ci-dessous n’a été exécuté pendant Phase 2A.

1. **Archive/SSG :** tests unitaires de sélection et déduplication par slug; cas de snapshots discordants et de résultats vérifiés; preuve que les URL sélectionnées génèrent exactement les locales autorisées, sans ajout des autres 363 slugs hors fenêtre. Après build approuvé, contrôler que les 10 URL FR sélectionnées existent dans `out/`, renvoient un vrai HTML et restent stables après purge selon la politique de conservation choisie.
2. **Taille et durée :** mesurer les tailles brutes et compressées du build avant/après, et chronométrer au moins deux builds comparables. Les chiffres de ce rapport sont des estimations à partir de l’export local existant, pas un benchmark.
3. **Métadonnées :** extraire des HTML exportés les titles, H1, canonicals, robots, hreflang et `html lang/dir`; vérifier un seul robots cohérent, self-canonical, alternates réciproques seulement pour les familles validées, et sitemap sans 404/403/redirect/noindex.
4. **Pages d’erreur et archives :** vérifier dans l’export les 404 avec code et `noindex`, l’index HTML d’archive `200/noindex,follow`, les JSON avec `X-Robots-Tag` si cette politique est retenue, et l’absence de blocage robots contradictoire. Valider les en-têtes contre le serveur cible ou un staging qui reproduit réellement sa configuration.
5. **403 hébergement :** examiner les logs et l’objet réellement déployé; après autorisation séparée, contrôler le GET de l’URL arabe et les cas témoins FR/EN/AR. Ne pas déployer de règle expérimentale en production.
6. **H1/langues :** comparer le HTML brut avant JavaScript et le DOM après hydratation; s’assurer que les trois pages de statistiques ont exactement un H1 localisé et que l’arabe est RTL dès le HTML initial.
7. **Pages gelées :** exécuter `npm test`, vérifier `tests/seo-preservation.test.ts` et comparer leurs URL, canonicals, redirections, titles, H1 et contenu performant avant/après. Tout écart bloque le déploiement et demande une décision du chef de projet.
8. **Garde de build :** `npm run build` déclenche `prebuild`/`postbuild` définis dans `package.json` et peut écrire dans `public/` ou `out/`; exécuter les validations dans un worktree/environnement jetable autorisé, avec contrôle des fichiers suivis, plutôt que sur la production ou en laissant des modifications de données.

## Décisions requises avant Phase 2B

1. Valider ou rejeter l’option B; confirmer si le premier lot est limité aux 10 URL FR ou inclut aussi leurs variantes EN/AR (+10 contre +30 pages).
2. Approuver les critères d’éligibilité à l’index et le seuil éditorial; décider du statut des pages sélectionnées mais non indexables (`noindex` ou 404) après revue des snapshots et résultats.
3. Demander à l’hébergeur l’investigation du 403 avec accès aux journaux, fichier distant, permissions et règles actives.
4. Valider la politique unique robots/HTTP, notamment l’exclusion éventuelle des JSON via `X-Robots-Tag`.
5. Valider l’architecture root layouts pour `lang/dir` et le traitement serveur des H1 des statistiques.
6. Définir si et comment les familles hreflang affectant une page protégée pourront évoluer; confirmer le code de langue français (`fr` ou `fr-SN`) et les `x-default` utiles.
7. Autoriser explicitement une phase d’implémentation distincte. Aucune action applicative n’est permise avant cette validation.

## Sources vérifiées

- `docs/project/reports/RAPPORT_DIAGNOSTIC_PHASE1.md`, notamment §§1–7 et 10.
- `docs/project/BTTSPREDICT_AUDIT_COMPLET.md`, notamment pages match et GSC, lignes 1386–1501.
- `src/lib/matches.ts:245–255`; `src/app/match/[slug]/page.tsx`; `src/app/[locale]/match/[slug]/page.tsx`.
- `public/.htaccess`; `public/_headers`; `public/robots.txt`; `public/predictions-archive/index.html`.
- `src/app/layout.tsx:71–81,130–146`; `src/app/[locale]/layout.tsx:21–24`; `src/lib/i18n.ts:1–16`.
- `src/app/statistiques/page.tsx`; `src/app/[locale]/statistiques/page.tsx`; `src/app/statistiques/StatistiquesClient.tsx`.
- `src/app/sitemap.ts`; `tests/seo-preservation.test.ts`; `next.config.ts`; `.github/workflows/deploy.yml`; `package.json`.
- Documentation technique : [Next.js — layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout), [Next.js — internationalisation](https://nextjs.org/docs/app/guides/internationalization), [Google Search Central — versions localisées](https://developers.google.com/search/docs/specialty/international/localized-versions).
