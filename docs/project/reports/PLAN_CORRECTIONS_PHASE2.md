# Plan de corrections — Phase 2A : conception technique

**Date :** 3 novembre 2026
**Projet :** BTTSPredict
**Branche de travail :** `redesign/professional-global-2026-11-03`
**Commit local de référence avant cette mise à jour documentaire :** `d6fa1b4ac547a553086536428ee62d350dd4b435`
**Référence amont observée :** `325526d93c63fc52143741a5b739cf68f7ba0809` (branche locale en avance de trois commits documentaires; aucun push effectué).
**Statut actualisé :** le plan reste l’archive de conception Phase 2A; son lot West Ham–QPR a été implémenté localement après autorisation explicite le 3 novembre 2026. Le résultat des contrôles figure dans l’addendum final. Aucun commit ni push.

> Phase 2A reste strictement documentaire. Aucun code, contenu, donnée, route, règle d’hébergement, paramètre d’affiliation ou fichier Firebase n’a été modifié. Aucun build, test, appel HTTP nouveau ou déploiement n’a été exécuté pendant cette phase. Aucun push GitHub n’est autorisé.

## Décision proposée en bref

1. **P0.1 : stratégie B validée comme principe; lot provisoire proposé : une URL FR.** Le dossier `SELECTION_MATCHES.md` recommande de retenir `/match/west-ham-united-vs-queens-park-rangers-2026-10-09` et de ne pas retenir les neuf autres URL à ce stade. Aucune variante EN/AR n’est retenue : les 20 URL testées répondent 404 et leur fidélité éditoriale n’est pas établie pour ces matchs. Cette validation de principe n’autorise aucun code, contenu, donnée, métadonnée, sitemap, hébergement, déploiement ou push. La règle reproductible et les limites de cette sélection sont précisées dans le dossier.
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
| **B. Générer une sélection fondée sur URL connue, qualité et historique (lot proposé : 1 FR)** | **+1 page FR** si une sélection par locale est appliquée; **+3** si le code actuel génère aussi EN/AR pour le slug. | **121 481 octets (~0,121 Mo)** estimés pour la page FR; **367 076 octets (~0,367 Mo)** si les 3 locales sortent. Moyennes de HTML brut mesurées sur les exports existants; ressources partagées et compression exclues. | +0,12 % des 864 pages match si 1 page; +0,35 % si 3. Durée réelle non mesurée. | Sélection URL par URL, et non sur les impressions seules : 35 impressions, 0 clic sur l’agrégat GSC du 4–31 octobre. La page choisie a 1 impression et aucune donnée de clic démontrant une demande. Vérifier contenu et provenance avant décision d’indexation. | La page West Ham dispose de six snapshots répétés et d’un résultat source-traceable; conserver une source stable après la fenêtre d’archives. Les autres neuf URL sont exclues à ce stade. | Le lot proposé est **FR seulement**. Les 20 variantes EN/AR testées répondent 404 et les champs éditoriaux spécifiques ne sont pas traduits; filtre par locale requis pour ne pas les générer par défaut. | Un canonical FR auto-référent; aucun hreflang EN/AR. `src/app/sitemap.ts` n’énumère aucune page match : envisager une seule entrée FR uniquement après validation d’indexabilité et statut 200. Les pages non indexables restent hors sitemap et suivent la politique robots approuvée. |
| **C. Garder la génération actuelle; rediriger seulement vers une destination réellement équivalente** | **0 page** ajoutée; au plus 10 redirections si, après contrôle, une destination exacte existe pour chacune. Aucune équivalence de ce type n’est établie pour les dix cas dans les preuves actuelles. | **0 Mo** de HTML ajouté; quelques octets de règles par redirection, si nécessaire. | Pas d’impact de génération match; vérification des règles et du comportement hébergeur à prévoir. | Risque faible de duplication si la cible est réellement le même match et la même intention. Risque élevé si les URL vont vers l’accueil, les pronostics du jour ou une autre rencontre : redirection non pertinente et perte de contexte. | Les snapshots restent disponibles localement tant qu’ils sont conservés, mais ne restaurent pas l’accès public; aucune page historique n’est conservée à l’URL d’origine. | Aucune nouvelle variante. Une redirection localisée n’est possible que vers une URL équivalente dans la même langue ou une cible expressément choisie et pertinente. | 301 seulement pour une équivalence vérifiée, avec cible 200 et canonical cohérent. Les URL redirigées sont exclues du sitemap; ne pas bloquer la source dans `robots.txt`. Sans destination équivalente, conserver une réponse 404 et appliquer la politique 404. |

### Critères d’éligibilité recommandés pour l’option B

Établir un manifeste d’éligibilité stable, plutôt que d’utiliser « toutes les lignes de snapshot » comme critère. Une page conservée doit avoir un slug stable, un match et une date déterminables, un contenu provenant du snapshot correspondant, une provenance/date de publication traçable, et aucun conflit non résolu entre snapshots. Si un résultat est affiché, sa validation doit s’appuyer sur la source de résultat documentée; ne pas inventer ou reconstituer un score. Vérifier qu’elle n’est pas un doublon d’une URL déjà servie ou redirigée. Examiner les signaux URL par URL (GSC, liens, visites ou maillage) et la valeur d’usage de l’historique; les impressions seules ne suffisent pas. Pour chaque locale, confirmer que l’URL a une utilité démontrable et que les éléments éditoriaux sont réellement localisés.

La génération et l’indexation sont deux décisions distinctes : une page retenue peut être accessible mais `noindex, follow` si elle conserve une valeur d’historique sans répondre au seuil éditorial d’indexation. La sélection indexable seule entre dans le sitemap. Les archives doivent rester explorables si un `noindex` est utilisé; ne pas les bloquer dans `robots.txt`.

### Recommandation

**B est retenu comme principe**, mais le premier lot proposé après revue est **une seule page FR**, choisie pour l’existence d’un résultat interne traçable dans `public/win-history.json`, des identités/dates cohérentes et un échantillon de forme de huit matchs par équipe. Les neuf autres URL ne sont pas retenues à ce stade, même lorsque des scores apparaissent dans les snapshots ou sont visibles sur des sources externes : leur résultat n’a pas de ligne source-traceable dans le registre que le rendu utilise, ou leur échantillon/date échoue au seuil. La période GSC agrégée du 4 au 31 octobre 2026 ne montre aucun clic pour les dix URL et ne constitue pas un signal de demande actuelle. Aucun statut HTTP ou score seul ne justifie l’indexation. Aucun code ni donnée ne sera modifié avant une validation distincte.

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

1. **Archive/SSG :** tests unitaires de sélection et déduplication par slug; cas de snapshots discordants et de résultats vérifiés; preuve que les URL sélectionnées génèrent exactement les locales autorisées, sans ajout des autres 363 slugs hors fenêtre. Si le lot d’une URL FR est approuvé, vérifier qu’exactement **une** page apparaît dans `out/` (aucune EN/AR sans autorisation distincte) et qu’elle reste disponible après purge selon une politique de conservation approuvée. Le routage localisé actuel génère aussi EN/AR pour tout slug; le test doit bloquer cette sur-génération.
2. **Taille et durée :** mesurer les tailles brutes et compressées du build avant/après, et chronométrer au moins deux builds comparables. Les chiffres de ce rapport sont des estimations à partir de l’export local existant, pas un benchmark.
3. **Métadonnées :** extraire des HTML exportés les titles, H1, canonicals, robots, hreflang et `html lang/dir`; vérifier un seul robots cohérent, self-canonical, alternates réciproques seulement pour les familles validées, et sitemap sans 404/403/redirect/noindex.
4. **Pages d’erreur et archives :** vérifier dans l’export les 404 avec code et `noindex`, l’index HTML d’archive `200/noindex,follow`, les JSON avec `X-Robots-Tag` si cette politique est retenue, et l’absence de blocage robots contradictoire. Valider les en-têtes contre le serveur cible ou un staging qui reproduit réellement sa configuration.
5. **403 hébergement :** examiner les logs et l’objet réellement déployé; après autorisation séparée, contrôler le GET de l’URL arabe et les cas témoins FR/EN/AR. Ne pas déployer de règle expérimentale en production.
6. **H1/langues :** comparer le HTML brut avant JavaScript et le DOM après hydratation; s’assurer que les trois pages de statistiques ont exactement un H1 localisé et que l’arabe est RTL dès le HTML initial.
7. **Pages gelées :** exécuter `npm test`, vérifier `tests/seo-preservation.test.ts` et comparer leurs URL, canonicals, redirections, titles, H1 et contenu performant avant/après. Tout écart bloque le déploiement et demande une décision du chef de projet.
8. **Garde de build :** `npm run build` déclenche `prebuild`/`postbuild` définis dans `package.json` et peut écrire dans `public/` ou `out/`; exécuter les validations dans un worktree/environnement jetable autorisé, avec contrôle des fichiers suivis, plutôt que sur la production ou en laissant des modifications de données.

## Décisions requises avant Phase 2B

1. Examiner et valider ou corriger la proposition URL par URL de `SELECTION_MATCHES.md` : une URL FR West Ham United–Queens Park Rangers, aucune variante EN/AR et neuf URL non retenues à ce stade. Cette revue n’autorise pas la Phase 2B.
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


## Addendum du 3 novembre 2026 — résultat de la sélection Phase 2A

Cet addendum remplace, pour le lot initial, les estimations préalables de 10 pages FR ou 30 variantes. Il ne change pas la stratégie B validée comme principe et n’autorise pas la Phase 2B. Le dossier détaillé, les sources par URL et les statuts EN/AR sont dans [`SELECTION_MATCHES.md`](./SELECTION_MATCHES.md).

### Proposition de sélection

**Lot proposé : 1 page FR, 0 EN, 0 AR — 1 URL retenue au total**, sous validation du chef de projet :

- Retenir `/match/west-ham-united-vs-queens-park-rangers-2026-10-09`.
- Ne pas retenir à ce stade les neuf autres URL : New England–Seattle, Wolves–Portsmouth, Dortmund–Werder, Southampton–Bolton, Heidenheim–Kaiserslautern, Nashville–Toronto, St. Pauli–Wolfsburg, Waasland-Beveren–Lommel et Braunschweig–Holstein Kiel.
- Les dix snapshots possèdent `finalScore`, `status` et `verifiedAt`; seul West Ham–QPR possède aussi une entrée appariée dans `public/win-history.json`, avec `source: ESPN public`. L’horodatage sans source du snapshot ne suffit pas à attribuer un score vérifié dans le rendu actuel. Les autres scores sont recoupables par des sources sportives externes, mais leur provenance n’est pas enregistrée dans le registre consommé par la page.
- Dortmund–Werder (4+4 matchs d’échantillon) et St. Pauli–Wolfsburg (4+4, un seul snapshot) échouent aussi au seuil historique. Nashville–Toronto porte une date snapshot 2026-09-27/00:30 et une date locale source du 26 septembre; son fuseau n’est pas documenté dans la donnée.
- La GSC des dix URL est agrégée du 4 au 31 octobre 2026 : 35 impressions, 0 clic. L’intérêt SEO observé est faible, et aucune métrique ne doit être décrite comme propre au 31 octobre.

### Règle applicable aux futurs matchs

Sélectionner une page historique seulement si les conditions suivantes sont toutes satisfaites : identité équipes/compétition/date cohérente entre sources; documenter le fuseau si une heure est affichée ou si la date locale/UTC diffère, et suspendre la publication si deux dates calendaires restent en conflit; qualité des données au moins `MEDIUM`; au moins cinq matchs historiques comptés par équipe et source identifiée; pour tout match terminé, score confirmé, source et date de vérification enregistrées dans `win-history.json` ou registre équivalent; contenu ayant au moins deux éléments propres au match au-delà du gabarit; slug unique et stable; pas de page équivalente en double. Ne créer une locale que si son URL répond 200 et que les libellés **et** le contenu spécifique sont fidèles; pas de traduction artificielle. La décision d’indexation est distincte : canonical auto-référent, statut 200, pas de `noindex` et inclusion sitemap seulement après accord explicite. Les détails et exceptions figurent dans `SELECTION_MATCHES.md`.

### Impact technique et risques à estimer

- **Pages retenues selon proposition :** 1 FR seulement. Les 10 FR actuelles ont été diagnostiquées 404; les 20 variantes EN/AR testées en GET public le 3 novembre renvoient elles aussi 404. Les 30 HTML correspondants sont absents de l’export local.
- **Poids indicatif mesuré :** les HTML de match actuels font en moyenne 121 481 octets FR, 120 982 EN et 124 613 AR; 864 HTML pèsent 105 717 943 octets bruts au total. Le lot FR seul est estimé à **121 481 octets (0,121 Mo)** hors ressources partagées et compression; les trois locales, si le générateur actuel n’est pas filtré, seraient d’environ **367 076 octets (0,367 Mo)**. Temps de build et volume réellement transféré non mesurés. Un filtre par locale est requis si le lot unilingue est approuvé.
- **Risque de source SSG :** `src/lib/matches.ts` ne charge que les 14 snapshots les plus récents; les snapshots de West Ham (3–8 octobre) sont hors de cette fenêtre. Une sélection durable et un stockage prévisible des données devront être conçus avant l’implémentation, sans modifier `public/predictions-archive/*.json` dans cette phase.
- **Fichiers candidats, sans changement actuel :** `src/lib/matches.ts`; `src/app/match/[slug]/page.tsx`; `src/app/[locale]/match/[slug]/page.tsx`; `src/app/sitemap.ts`; tests SEO pertinents; rétention éventuelle des sources `public/predictions-archive/2026-10-03.json` à `2026-10-08.json`. `public/win-history.json` est uniquement consulté; aucune mise à jour de donnée n’est autorisée. `scripts/prune-archives.mjs` demeure gelé.
- **Canonicals/sitemap :** la route match FR a un canonical auto-référent; aucune entrée match n’est actuellement dans le sitemap. Proposition : un canonical FR, aucune URL/hreflang EN/AR. Si et seulement si l’indexation de l’unique page est approuvée et la génération répond 200, envisager une entrée sitemap FR; aucun changement exécuté.
- **Archives :** six snapshots quotidiens répétés pour West Ham restent une seule page; ne pas transformer le nombre de fichiers en nombre de pages. La source retenue doit survivre à la purge et à la fenêtre glissante.

### Vérifications 403 arabe

**À faire localement sans accès serveur :** vérifier existence, lisibilité, taille/hash/casse et chemin de `out/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25.html`; comparer avec ses témoins FR/EN et une page AR 200; inspecter les règles versionnées (`public/.htaccess`, `public/_headers`, `robots.txt`, `next.config.ts`, workflow, route SSG); reproduire le build dans un environnement jetable approuvé, car les scripts peuvent écrire dans `public/` et `out/`. Les permissions locales ne prouvent pas les permissions distantes.

**Exige l’accès à l’hébergement ou à ses journaux :** confirmer transfert et présence dans le vrai `DocumentRoot`; propriétaire/groupe/mode/ACL du fichier et des répertoires parents; règles réellement actives `.htaccess`/parent/vhost/`AllowOverride` ou serveur équivalent; journaux d’accès/erreur, WAF/ModSecurity et CDN au moment du 403; comparer URL brute, chemin disque, cache, règles bot/région et plusieurs agents/réseaux. Retester les URL après diagnostic, uniquement avec autorisation séparée. La cause demeure inconnue; aucun accès ni changement d’hébergement n’a été effectué.

### État de la mission

Aucun build, test, lint, TypeScript, commit, push ou changement de production n’a été effectué. Les lectures de code/données et les GET publics EN/AR sont en lecture seule. Seuls les quatre fichiers documentaires expressément autorisés par la demande sont modifiés ou créés; attendre la validation de la sélection avant toute Phase 2B.

## Addendum du 3 novembre 2026 — vérifications préalables et décisions à soumettre

### 1. Date, heure et fuseau

Le compte rendu officiel de West Ham date le match du **vendredi 9 octobre 2026 à 20:00 BST**. Le 9 octobre, `Europe/London` est à UTC+1 : 20:00 BST correspond à 19:00 UTC. Le snapshot (`2026-10-03.json` à `2026-10-08.json`) donne `date: 2026-10-09`, `time: 19:00`, sans fuseau. Le code `src/lib/dakar-date.ts` interprète une heure sans fuseau comme une heure calendrier `Africa/Dakar` (UTC+0), de sorte que 19:00 est également l’heure locale de Dakar correspondant au même instant. La date locale officielle et la date du snapshot concordent.

**Limite qui demeure :** le fuseau réellement utilisé à la production du snapshot n’est pas encodé et aucune documentation de ce producteur n’a été trouvée dans le dépôt. L’application suppose Dakar pour interpréter l’heure; l’égalité numérique avec 19:00 UTC ne prouve pas que la donnée source était en UTC. L’origine du fuseau doit rester explicitement « inconnue » jusqu’à preuve du producteur.

### 2. Concordance du registre ESPN

L’entrée `history[246]` de `public/win-history.json` porte la date `2026-10-09`, `West Ham United vs Queens Park Rangers`, `Championship`, `market: btts`, `prediction: Oui`, `status: WON`, `finalScore: 1-1`, `source: ESPN public` et `verifiedAt: 2026-10-23T05:42:15.167Z`. Elle correspond aux équipes, au match et au score de la page ESPN [gameId 401880233](https://www.espn.com/soccer/match/_/gameId/401880233/queens-park-rangers-west-ham-united); le [compte rendu officiel de West Ham](https://www.whufc.com/en/news/match-report-or-qpr-draw-a-tale-of-two-penalties) confirme indépendamment le résultat et la date. Le fichier actuel ne conserve pas `sourceUrl`; le nom de source seul n’offre pas de lien stable consultable.

### 3. Conservation durable sans toucher aux autres archives

**Proposition à valider :** conserver une copie canonique du seul enregistrement retenu dans un fichier de données suivi, hors de `public/predictions-archive/` et donc hors de la purge glissante, par exemple `src/data/retained-match-pages/west-ham-united-vs-queens-park-rangers-2026-10-09.json`. Le fichier doit contenir tous les champs pré-match nécessaires au rendu statique, l’identifiant/slug stable et une référence à l’entrée de vérification du résultat. Le chargeur de build lirait explicitement ce fichier en plus des 14 snapshots habituels et fusionnerait/dédupliquerait par slug. La routine `scripts/prune-archives.mjs` et les archives existantes resteraient inchangées; aucun autre match ne serait épinglé par effet de bord. Le futur registre de vérification décrit ci-dessous resterait séparé des données complètes de la page.

### 4. Modification minimale envisagée du générateur — FR uniquement pour cette page

La route FR `src/app/match/[slug]/page.tsx` génère les slugs renvoyés par `getAllMatchSlugs()`. La route localisée `src/app/[locale]/match/[slug]/page.tsx` génère actuellement EN et AR pour chacun de ces slugs. Après validation et ajout explicite de la source durable au chargeur, la modification minimale serait de maintenir les pages existantes inchangées, d’inclure le slug retenu dans la génération FR, puis de filtrer **ce seul slug** des paramètres EN/AR au moyen d’une liste « FR uniquement » (ou d’une petite liste de locales permises par slug). Ainsi, le candidat ajouté produit une seule page `/match/<slug>`; les autres matchs déjà générés par les règles actuelles ne sont pas supprimés. Un test de build devra vérifier exactement une variante pour ce candidat et zéro variante EN/AR. Aucun générateur n’a été modifié ici.

### 5. Options d’indexation — décision laissée au chef de projet

**Option A — indexable.** Servir la page en 200, la laisser indexable, garder un canonical cohérent et envisager une entrée unique au sitemap seulement après validation. Avantage : possibilité de découverte organique. Risque : contenu d’archive éventuellement trop répétitif/faible; la seule mesure connue pour cette URL est 1 impression, 0 clic et une position moyenne 89 sur l’agrégat GSC du 4 au 31 octobre 2026, ce qui ne démontre pas une demande suffisante.

**Option B — `noindex, follow`.** Servir la page en 200 pour l’accès direct et l’historique, mais demander son exclusion des résultats et la laisser hors sitemap; ne pas bloquer son exploration dans `robots.txt`. Avantage : conserver une page utile sans l’ajouter à l’index. Limite : pas de visibilité organique attendue; le résultat dépend de l’accès des robots à la page.

Ce sont deux options distinctes, sans choix recommandé ou appliqué dans cette mission. Aucun canonical, sitemap, `robots.txt` ou directive robots n’a été modifié.

### 6. Spécification du futur registre de vérification des matchs

Le registre doit avoir **un enregistrement par événement**, être versionné et validé par schéma, et distinguer le fuseau local de l’événement de celui du snapshot. Champs obligatoires : `id` (identifiant unique stable, idéalement le slug canonique équipes+date), `source` (nom du fournisseur/organisme), `sourceUrl` (URL directe de l’événement/résultat), `result` (score structuré avec buts domicile/extérieur et forme d’affichage), `verifiedAt` (date/heure ISO 8601 en UTC), `matchDate` (date locale de l’événement `YYYY-MM-DD`), `timeZone` (identifiant IANA du fuseau de la date/heure source) et `status` (enum contrôlé : `pending`, `verified`, `disputed`, `rejected`). Recommandés pour contrôle d’identité : `homeTeam`, `awayTeam`, `competition`, `snapshotTimeZone` (IANA ou `null`/`unknown`, jamais inféré silencieusement) et `notes`/`conflictReason` si nécessaire.

Exemple de la forme cible pour ce candidat, à titre de spécification seulement — **aucun fichier de registre n’est créé ni modifié** :

```json
{
  "id": "west-ham-united-vs-queens-park-rangers-2026-10-09",
  "source": "ESPN",
  "sourceUrl": "https://www.espn.com/soccer/match/_/gameId/401880233/queens-park-rangers-west-ham-united",
  "homeTeam": "West Ham United",
  "awayTeam": "Queens Park Rangers",
  "competition": "Championship",
  "result": { "homeGoals": 1, "awayGoals": 1, "display": "1-1" },
  "verifiedAt": "2026-10-23T05:42:15.167Z",
  "matchDate": "2026-10-09",
  "timeZone": "Europe/London",
  "snapshotTimeZone": null,
  "status": "verified"
}
```

Pour cet exemple, `Europe/London` identifie la source officielle (BST à la date du match); `snapshotTimeZone: null` garde visible l’incertitude réelle. Le statut `verified` ne doit être posé que lorsque l’URL source confirme les deux équipes, la date et le résultat; une divergence entraîne `disputed`, une vérification incomplète reste `pending`.

### État et autorisation

Ces éléments sont des propositions documentaires. Le candidat reste soumis à validation; la décision indexable/noindex, l’emplacement durable et le filtre de locales sont à approuver avant toute Phase 2B. Aucun fichier applicatif, snapshot, registre, archive, route, sitemap, canonical, `robots.txt`, branche distante, `main` ou production n’a été modifié; aucun commit ou push n’a été effectué.


## Addendum du 3 novembre 2026 — Phase 2C, proposition de code en attente

Le [document de diff Phase 2C](./PHASE2C_PROPOSITION_DIFF_WEST_HAM_QPR.md) propose une route statique littérale FR pour West Ham United–QPR, une copie dédiée des six snapshots identiques hors de `public/predictions-archive/`, un registre de vérification source-traçable et une exclusion du slug des paramètres SSG dynamiques. La copie d’origine, la valeur `1-1`, le statut `WON`, la source ESPN et l’horodatage vérifié sont préservés; aucune archive glissante n’est supprimée ou modifiée.

Le schéma proposé sépare l’heure du coup d’envoi (`kickoff.timeZone: Europe/London`), le fuseau du snapshot (`snapshot.timeZone: null`, inconnu) et le fuseau d’affichage (`display.timeZone: Africa/Dakar`). L’heure officielle documentée est 20:00 BST, soit 19:00 UTC/Dakar; cela ne prouve pas le fuseau d’origine du champ `time: 19:00` du snapshot.

Les deux options robots sont exclusives : **indexable** ou **`noindex, follow`**. Aucune n’est retenue par défaut. La proposition ne change aucun sitemap, canonical existant, page protégée, `robots.txt`, `main` ou production. Elle ajoute seulement, à titre de code futur, un canonical auto-référent pour la nouvelle URL afin d’éviter l’héritage du canonical de la racine; ce n’est pas une modification réalisée.

Le test envisagé vérifie l’unicité des paramètres SSG, l’unique chemin FR, l’absence EN/AR pour le slug, la conservation de tous les autres slugs actuels, l’intégrité du registre et des empreintes des cinq pages SEO protégées. Aucun test ni build n’a été lancé : ce diff reste en revue, et le conflit d’export statique entre route littérale et `[slug]` doit être vérifié dans un environnement isolé après autorisation. La sélection, le choix robots et le schéma attendent validation.

## Vérification complémentaire de Phase 2C

Un mini-projet isolé Next.js 16.1.3 en `output: 'export'` a compilé et distingué la route littérale West Ham de `/match/[slug]`; c’est un test de forme de routage, non du projet ni du patch complet. Le test existant `tests/seo-preservation.test.ts` a passé (8/8). Les empreintes des cinq sources protégées restent identiques. `git apply --check` sur le diff documentaire a réussi sans application. Les nouveaux tests et le build applicatif demeurent en attente de validation.


## Mise à jour du 3 novembre 2026 — Implémentation Phase 2C (locale seulement)

Après autorisation explicite, la proposition West Ham–QPR a été appliquée sur `redesign/professional-global-2026-11-03`. Le lot reste limité à une page littérale FR; le slug est retiré des générateurs dynamiques FR, EN et AR; un snapshot canonique est conservé dans `src/data/retained-match-pages/`, hors de la purge glissante; le registre de vérification garde la source et l’URL ESPN, le résultat structuré et les fuseaux distincts. Le canonical auto-référent et `noindex, follow` sont propres à cette nouvelle page. Le sitemap, `robots.txt`, les archives roulantes, les cinq pages SEO protégées, Firebase, affiliations et les autres routes ne sont pas modifiés.

Les contrôles finaux ont réussi : `npm test` (30 fichiers/211 tests), `./node_modules/.bin/tsc --noEmit`, `npm run lint` et `npm run build` (Next.js 16.1.3, génération statique 933/933). Les tests incluent le maintien actif des empreintes des cinq sources protégées. Dans l’export frais, la seule page correspondant au slug est le HTML FR; son H1 et son résultat donnent 1–1, la source ESPN et son lien sont présents, le canonical est exactement l’URL FR et les robots sont `noindex, follow`. Aucun export EN/AR ni entrée au sitemap. Les 93 JSON publics comparés sont restés identiques; les dossiers `out/` et `.next/` présents avant le build ont été restaurés après les vérifications.

Un défaut du diff proposé a été corrigé avant validation finale : sa hunk annonçait 61 lignes alors qu’elle en contenait 71, ce qui tronquait le JSX; le test et TypeScript l’ont détecté. La page a été complétée, puis le lookup du registre a été ajusté pour satisfaire TypeScript. Les tests/build finaux ont été relancés et réussis.

**État :** changements non commités et non poussés; HEAD de base inchangé à `149733160d0c9e7796dc36d3f86f80a2284eecf8`; aucune action sur `main` ou la production. La revue du diff reste à faire et toute poussée GitHub attend une autorisation explicite. Aucun statut HTTP public ne peut être affirmé sans déploiement, qui n’a pas été effectué.
