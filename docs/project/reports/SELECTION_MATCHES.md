# Dossier de sélection des pages de matchs

**Projet :** BTTSPredict
**Date :** 3 novembre 2026
**Référence de travail :** branche `redesign/professional-global-2026-11-03`, commit local `149733160d0c9e7796dc36d3f86f80a2284eecf8`; amont observé `325526d93c63fc52143741a5b739cf68f7ba0809`.
**Statut :** proposition à examiner. La stratégie B est validée comme principe, mais aucune implémentation ni modification des données n’est autorisée.

## Proposition en bref

Je propose de retenir **1 URL FR**, celle de West Ham United–Queens Park Rangers, et de ne pas retenir les neuf autres URL pour le premier lot. Je ne retiens **aucune variante EN ou AR**. Les 20 variantes linguistiques testées par GET répondent actuellement 404; leur contenu localisé n’est pas suffisamment établi pour les publier.

Cette sélection stricte ne signifie pas que les neuf autres scores sont inconnus : les snapshots locaux contiennent un score final, un statut et un horodatage pour les dix rencontres, et les pages de résultats sportives liées ci-dessous permettent de les recouper. En revanche, **une seule rencontre sur dix a un résultat doté d’une source explicite dans le registre interne `public/win-history.json`**. C’est ce registre que le rendu de la page interroge pour afficher le score qualifié de « vérifié ». Le champ `verifiedAt` d’un snapshot, à lui seul, ne révèle pas la source de vérification.

L’unique URL proposée a un signal SEO faible — **1 impression, 0 clic** dans l’export GSC agrégé du **4 au 31 octobre 2026**, position moyenne 89 — et n’est pas retenue pour une demande organique démontrée. Elle est retenue parce qu’elle réunit un identifiant stable, des données de qualité élevée, huit matchs récents comptés par équipe et un score avec source traçable. Les chiffres GSC ne sont pas des métriques du seul 31 octobre.

> **Aucune modification applicative, donnée, route, métadonnée, sitemap, règle d’hébergement, production ou push n’a été effectuée.** Les seuls changements demandés sont documentaires. Le GET des variantes EN/AR est une vérification de lecture seule.

## Les dix URL FR examinées

Dans les snapshots ci-dessous, « historique 8+8 », par exemple, désigne le nombre de matchs antérieurs utilisés par le modèle pour les deux équipes; ce n’est pas le nombre de snapshots et ce n’est pas une liste des résultats de ces matchs. Les fichiers quotidiens répètent souvent la même prédiction et ne constituent donc pas autant d’observations indépendantes.

Pour les dix lignes, les snapshots possèdent les champs `finalScore`, `status` et `verifiedAt`. Ils ne donnent pas une source de résultat dans l’enregistrement du snapshot. Sauf pour West Ham–QPR, aucun match correspondant n’a de ligne dans `public/win-history.json`. « Résultat externe recoupé » ci-dessous indique une source sportive consultée; cela ne crée pas un enregistrement interne que l’application pourrait afficher comme vérifié.

### 1. New England Revolution–Seattle Sounders FC — ne pas retenir à ce stade

- **URL FR / slug :** [`/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10`](https://bttspredict.com/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10) — `new-england-revolution-vs-seattle-sounders-fc-2026-10-10`. Le rapport Phase 1 a constaté un 404 et l’export local ne contient pas le HTML correspondant.
- **Snapshot et date :** 6 apparitions, `2026-10-04.json` à `2026-10-09.json`; match daté du 10 octobre 2026. Équipes et domicile/extérieur cohérents.
- **Historique et complétude :** `HIGH`, 8 matchs par équipe; probabilités BTTS 71 %, Over 2.5 73,38 %, xG estimés 2,23 et 1,58. Données de prédiction substantielles, mais pas de listes `last5Home`/`last5Away` ni de résumé éditorial EN/AR dans ces enregistrements.
- **Résultat :** snapshot `0-3`, statut `LOST`, horodatage présent; **aucune ligne** source-traceable correspondante dans `win-history.json`. Le compte rendu officiel des [Seattle Sounders](https://www.soundersfc.com/news/recap-sounders-secure-massive-victory-on-the-road-over-new-england-revolution) confirme le 3-0.
- **SEO connu :** 0 clic, 19 impressions, position moyenne 12,32 sur l’agrégat GSC du 4–31 octobre 2026; signal d’exposition le plus élevé de la liste, sans clic.
- **Décision :** **ne pas retenir maintenant**. C’est une URL intéressante à réexaminer si une source est enregistrée dans le registre utilisé par l’application; sans cela, le rendu ne dispose pas d’un résultat interne vérifiable à afficher.

### 2. Wolverhampton Wanderers–Portsmouth — ne pas retenir à ce stade

- **URL FR / slug :** [`/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20`](https://bttspredict.com/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20) — `wolverhampton-wanderers-vs-portsmouth-2026-10-20`. Rapport Phase 1 : 404; HTML absent de l’export local.
- **Snapshot et date :** 2 apparitions, `2026-10-18.json` et `2026-10-19.json`; match du 20 octobre 2026.
- **Historique et complétude :** `HIGH`, 8 matchs par équipe; BTTS 47 %, Over 2.5 44,11 %, xG estimés 1,52 et 0,92. Aucun historique détaillé des cinq derniers matchs ni résumé éditorial traduit dans les champs conservés pour cette page.
- **Résultat :** snapshot `1-1`, statut `LOST`, horodatage présent; aucune ligne dans `win-history.json`. Le compte rendu officiel de [Wolves](https://www.wolves.co.uk/news/mens-first-team/20261020-report-wolves-1-1-portsmouth/) confirme le score.
- **SEO connu :** 0 clic, 5 impressions, position moyenne 5,80 sur la période agrégée.
- **Décision :** **ne pas retenir maintenant**. Les données pré-match sont de bonne qualité, mais le score n’est pas enregistré avec source dans le registre interne consommé par le rendu. Les deux snapshots ne représentent pas deux historiques distincts.

### 3. Borussia Dortmund–Werder Bremen — ne pas retenir

- **URL FR / slug :** [`/match/borussia-dortmund-vs-werder-bremen-2026-10-09`](https://bttspredict.com/match/borussia-dortmund-vs-werder-bremen-2026-10-09) — `borussia-dortmund-vs-werder-bremen-2026-10-09`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot et date :** 6 apparitions, `2026-10-03.json` à `2026-10-08.json`; match du 9 octobre 2026.
- **Historique et complétude :** `MEDIUM`, seulement 4 matchs par équipe; BTTS 36,57 %, Over 2.5 60,96 %, xG estimés 2,65 et 0,50. En dessous du seuil reproductible proposé de cinq matchs par équipe.
- **Résultat :** snapshot `2-2`, statut `LOST`, horodatage présent; aucune ligne dans `win-history.json`. La page de match [ESPN](https://www.espn.com/soccer/match/_/gameId/401884781/werder-bremen-borussia-dortmund) recoupe l’événement et le score final.
- **SEO connu :** 0 clic, 3 impressions, position moyenne 4,67 sur l’agrégat.
- **Décision :** **ne pas retenir**. Échantillon historique insuffisant au seuil proposé et résultat sans provenance interne; la répétition sur six fichiers ne corrige pas ces lacunes.

### 4. Southampton–Bolton Wanderers — ne pas retenir à ce stade

- **URL FR / slug :** [`/match/southampton-vs-bolton-wanderers-2026-10-17`](https://bttspredict.com/match/southampton-vs-bolton-wanderers-2026-10-17) — `southampton-vs-bolton-wanderers-2026-10-17`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot et date :** 2 apparitions, `2026-10-15.json` et `2026-10-16.json`; match du 17 octobre 2026.
- **Historique et complétude :** `HIGH`, 8 matchs par équipe; BTTS 73,82 %, Over 2.5 82,64 %, xG estimés 3,00 et 1,50. Pas de listes de forme détaillées ni de texte éditorial localisé dans les données de ces snapshots.
- **Résultat :** snapshot `0-0`, statut `LOST`, horodatage présent; aucune ligne dans `win-history.json`. Le match est recoupé par [ESPN](https://www.espn.com/soccer/match/_/gameId/401880213/bolton-wanderers-southampton) et les [temps forts de Sky Sports](https://www.skysports.com/football/video/13600316/southampton-0-0-bolton-championship-highlights).
- **SEO connu :** 0 clic, 2 impressions, position moyenne 11,00.
- **Décision :** **ne pas retenir maintenant**. L’échantillon pré-match est suffisant, mais le résultat ne figure pas dans le registre interne avec sa source; la valeur SEO observée est très faible.

### 5. 1. FC Heidenheim–Kaiserslautern — ne pas retenir à ce stade

- **URL FR / slug :** [`/match/fc-heidenheim-vs-kaiserslautern-2026-10-09`](https://bttspredict.com/match/fc-heidenheim-vs-kaiserslautern-2026-10-09) — `fc-heidenheim-vs-kaiserslautern-2026-10-09`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot et date :** 6 apparitions, `2026-10-03.json` à `2026-10-08.json`; match du 9 octobre 2026. Le snapshot nomme l’équipe « 1. FC Heidenheim 1846 », ce qui correspond au club de l’URL.
- **Historique et complétude :** `MEDIUM`, 6 matchs par équipe; BTTS 67,49 %, Over 2.5 73,38 %, xG estimés 2,48 et 1,33.
- **Résultat :** snapshot `0-0`, statut `LOST`, horodatage présent; aucune ligne `win-history.json`. La page [ESPN](https://www.espn.com/soccer/match/_/gameId/401885100/kaiserslautern-1-fc-heidenheim-1846) est le point de recoupement externe.
- **SEO connu :** 0 clic, 1 impression, position moyenne 6,00.
- **Décision :** **ne pas retenir maintenant**. Identité, date et échantillon sont cohérents, mais il manque la provenance interne du résultat requis pour le rendu historique.

### 6. Nashville SC–Toronto FC — ne pas retenir avant résolution de date et de provenance

- **URL FR / slug :** [`/match/nashville-sc-vs-toronto-fc-2026-09-27`](https://bttspredict.com/match/nashville-sc-vs-toronto-fc-2026-09-27) — `nashville-sc-vs-toronto-fc-2026-09-27`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot et date :** 7 apparitions, `2026-09-20.json` à `2026-09-26.json`; le snapshot porte la date `2026-09-27` et l’heure `00:30`. La page [ESPN](https://www.espn.com/soccer/match/_/gameId/761838/toronto-fc-nashville-sc) présente la rencontre sous la date locale du 26 septembre. L’heure suggère un basculement de fuseau, mais le snapshot ne documente pas explicitement son fuseau : la date de l’URL et celle présentée à l’échelle locale doivent être réconciliées avant publication.
- **Historique et complétude :** `HIGH`, 8 matchs par équipe; BTTS 55,41 %, Over 2.5 74,30 %, xG estimés 3,00 et 0,88.
- **Résultat :** snapshot `2-0`, statut `LOST`, horodatage présent; aucune ligne dans `win-history.json`. Le résultat apparaît aussi dans le dossier de match ESPN lié ci-dessus.
- **SEO connu :** 0 clic, 1 impression, position moyenne 9,00.
- **Décision :** **ne pas retenir avant clarification**. L’identité est cohérente, mais le fuseau/date n’est pas établi dans la donnée source et le résultat n’est pas enregistré dans le registre interne.

### 7. St. Pauli–VfL Wolfsburg — ne pas retenir

- **URL FR / slug :** [`/match/st-pauli-vs-vfl-wolfsburg-2026-09-12`](https://bttspredict.com/match/st-pauli-vs-vfl-wolfsburg-2026-09-12) — `st-pauli-vs-vfl-wolfsburg-2026-09-12`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot et date :** un seul fichier, `2026-09-11.json`; match du 12 septembre 2026.
- **Historique et complétude :** `MEDIUM`, 4 matchs par équipe; BTTS 61,13 %, Over 2.5 66,03 %, xG estimés 1,15 et 2,25. Sous le minimum de cinq matchs proposé.
- **Résultat :** snapshot `1-0`, statut `LOST`, horodatage présent; aucune ligne dans `win-history.json`. La page [ESPN](https://www.espn.com/soccer/match/_/gameId/401885119/vfl-wolfsburg-st-pauli) confirme le match et le score.
- **SEO connu :** 0 clic, 1 impression, position moyenne 10,00.
- **Décision :** **ne pas retenir**. Échantillon trop court, un seul snapshot de prédiction et aucune provenance interne du résultat.

### 8. Waasland-Beveren–Lommel SK — ne pas retenir à ce stade

- **URL FR / slug :** [`/match/waasland-beveren-vs-lommel-sk-2026-10-09`](https://bttspredict.com/match/waasland-beveren-vs-lommel-sk-2026-10-09) — `waasland-beveren-vs-lommel-sk-2026-10-09`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot et date :** 6 apparitions, `2026-10-03.json` à `2026-10-08.json`; match du 9 octobre 2026.
- **Historique et complétude :** `MEDIUM`, 7 matchs par équipe; BTTS 34,76 %, Over 2.5 49,40 %, xG estimés 2,15 et 0,50. Le nom de compétition du snapshot (« Jupiler Pro League ») et celui de la page ESPN (« Belgian Pro League ») diffèrent; confirmer le libellé éditorial voulu.
- **Résultat :** snapshot `1-3`, statut `LOST`, horodatage présent; aucune ligne `win-history.json`. La page [ESPN](https://www.espn.com/soccer/match/_/gameId/401878976/lommel-sk-waasland-beveren) recoupe la rencontre et le résultat.
- **SEO connu :** 0 clic, 1 impression, position moyenne 12,00.
- **Décision :** **ne pas retenir maintenant**. Échantillon acceptable, mais résultat non inscrit avec source dans le registre de l’application et compétition à harmoniser.

### 9. West Ham United–Queens Park Rangers — retenir, sous réserve de validation

- **URL FR / slug :** [`/match/west-ham-united-vs-queens-park-rangers-2026-10-09`](https://bttspredict.com/match/west-ham-united-vs-queens-park-rangers-2026-10-09) — `west-ham-united-vs-queens-park-rangers-2026-10-09`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot, heure et date :** 6 apparitions, `2026-10-03.json` à `2026-10-08.json`; toutes portent `date: 2026-10-09` et `time: 19:00`, sans champ de fuseau. Le [compte rendu officiel de West Ham](https://www.whufc.com/en/news/match-report-or-qpr-draw-a-tale-of-two-penalties) situe le match au London Stadium le vendredi 9 octobre 2026 à 20:00 BST. Ce jour-là, BST = UTC+1 : **20:00 BST = 19:00 UTC**; Dakar étant UTC+0, cela correspond aussi à **19:00 à Dakar**. `src/lib/dakar-date.ts` interprète les heures sans fuseau comme des heures calendrier `Africa/Dakar`; c’est la convention de lecture de l’application, pas une preuve du fuseau du système qui a produit le snapshot. La date locale officielle (9 octobre) concorde avec la date du snapshot et du slug. Conclusion : l’écart horaire d’une heure est réconcilié, mais le fuseau d’origine du snapshot reste **inconnu**; l’égalité numérique ne permet pas de distinguer UTC de Dakar.
- **Historique et complétude :** `HIGH`, 8 matchs par équipe; BTTS 64,02 %, Over 2.5 68,38 %, xG estimés 2,27 et 1,25. Identité, date, compétition et échantillon concordent.
- **Résultat vérifiable :** l’entrée `history[246]` de `public/win-history.json` correspond exactement à `2026-10-09`, `West Ham United vs Queens Park Rangers`, compétition `Championship`, marché `btts`, prédiction `Oui`, statut `WON`, score `1-1`, probabilité `0.6402`, source `ESPN public` et vérification `2026-10-23T05:42:15.167Z`. La page [ESPN du match (gameId 401880233)](https://www.espn.com/soccer/match/_/gameId/401880233/queens-park-rangers-west-ham-united) est indexée comme West Ham 1–1 QPR du 9 octobre 2026; le compte rendu officiel de West Ham confirme indépendamment les équipes, le score, la date et l’heure. Le registre actuel ne stocke toutefois qu’un libellé `source`, pas l’URL ESPN : le lien exact doit être conservé dans le futur registre de vérification.
- **SEO connu :** 0 clic, 1 impression, position moyenne 89,00 sur la période agrégée; signal de demande organique très faible.
- **Décision :** **retenir provisoirement une URL FR seulement**, sous réserve de validation du chef de projet. La date est confirmée et l’écart horaire est expliqué par BST (UTC+1) versus UTC/Africa-Dakar (UTC+0), mais l’origine du fuseau du snapshot n’est pas établie; ne pas présenter 19:00 comme un horaire source vérifié. C’est la seule des dix qui satisfait la provenance de résultat actuellement utilisée par le rendu et l’échantillon `HIGH`. Sa valeur SEO n’est pas démontrée; la justification est la conservation d’un historique traçable, pas une promesse de trafic.

### 10. TSV Eintracht Braunschweig–Holstein Kiel — ne pas retenir à ce stade

- **URL FR / slug :** [`/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09`](https://bttspredict.com/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09) — `tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09`. Rapport Phase 1 : 404; HTML absent.
- **Snapshot et date :** 6 apparitions, `2026-10-03.json` à `2026-10-08.json`; match du 9 octobre 2026.
- **Historique et complétude :** `MEDIUM`, 6 matchs par équipe; BTTS 67,93 %, Over 2.5 67,61 %, xG estimés 1,82 et 1,67.
- **Résultat :** snapshot `1-0`, statut `LOST`, horodatage présent; aucune ligne `win-history.json`. La page [ESPN](https://www.espn.com/soccer/match/_/gameId/401885094/holstein-kiel-tsv-eintracht-braunschweig) recoupe le match et le score.
- **SEO connu :** 0 clic, 1 impression, position moyenne 123,00.
- **Décision :** **ne pas retenir maintenant**. L’échantillon est supérieur au seuil proposé, mais le résultat n’a pas de source enregistrée dans le registre interne et le signal SEO mesuré est infime; la répétition des snapshots ne crée pas de contenu supplémentaire.

## Variantes EN et AR

Les URL exactes ci-dessous ont été testées par GET public sans écriture, le 3 novembre 2026. **Les 20 ont répondu `404`** (`text/html; charset=UTF-8`); l’export local ne contient pas non plus ces 20 fichiers HTML. Le rapport Phase 1 avait déjà constaté le 404 des dix variantes FR. Le statut public 404 des variantes EN/AR est donc vérifié ici, pas déduit du seul code source.

| Slug | Variante EN — statut | Variante AR — statut |
|---|---|---|
| `new-england-revolution-vs-seattle-sounders-fc-2026-10-10` | [`/en/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10`](https://bttspredict.com/en/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10) — 404 | [`/ar/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10`](https://bttspredict.com/ar/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10) — 404 |
| `wolverhampton-wanderers-vs-portsmouth-2026-10-20` | [`/en/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20`](https://bttspredict.com/en/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20) — 404 | [`/ar/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20`](https://bttspredict.com/ar/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20) — 404 |
| `borussia-dortmund-vs-werder-bremen-2026-10-09` | [`/en/match/borussia-dortmund-vs-werder-bremen-2026-10-09`](https://bttspredict.com/en/match/borussia-dortmund-vs-werder-bremen-2026-10-09) — 404 | [`/ar/match/borussia-dortmund-vs-werder-bremen-2026-10-09`](https://bttspredict.com/ar/match/borussia-dortmund-vs-werder-bremen-2026-10-09) — 404 |
| `southampton-vs-bolton-wanderers-2026-10-17` | [`/en/match/southampton-vs-bolton-wanderers-2026-10-17`](https://bttspredict.com/en/match/southampton-vs-bolton-wanderers-2026-10-17) — 404 | [`/ar/match/southampton-vs-bolton-wanderers-2026-10-17`](https://bttspredict.com/ar/match/southampton-vs-bolton-wanderers-2026-10-17) — 404 |
| `fc-heidenheim-vs-kaiserslautern-2026-10-09` | [`/en/match/fc-heidenheim-vs-kaiserslautern-2026-10-09`](https://bttspredict.com/en/match/fc-heidenheim-vs-kaiserslautern-2026-10-09) — 404 | [`/ar/match/fc-heidenheim-vs-kaiserslautern-2026-10-09`](https://bttspredict.com/ar/match/fc-heidenheim-vs-kaiserslautern-2026-10-09) — 404 |
| `nashville-sc-vs-toronto-fc-2026-09-27` | [`/en/match/nashville-sc-vs-toronto-fc-2026-09-27`](https://bttspredict.com/en/match/nashville-sc-vs-toronto-fc-2026-09-27) — 404 | [`/ar/match/nashville-sc-vs-toronto-fc-2026-09-27`](https://bttspredict.com/ar/match/nashville-sc-vs-toronto-fc-2026-09-27) — 404 |
| `st-pauli-vs-vfl-wolfsburg-2026-09-12` | [`/en/match/st-pauli-vs-vfl-wolfsburg-2026-09-12`](https://bttspredict.com/en/match/st-pauli-vs-vfl-wolfsburg-2026-09-12) — 404 | [`/ar/match/st-pauli-vs-vfl-wolfsburg-2026-09-12`](https://bttspredict.com/ar/match/st-pauli-vs-vfl-wolfsburg-2026-09-12) — 404 |
| `waasland-beveren-vs-lommel-sk-2026-10-09` | [`/en/match/waasland-beveren-vs-lommel-sk-2026-10-09`](https://bttspredict.com/en/match/waasland-beveren-vs-lommel-sk-2026-10-09) — 404 | [`/ar/match/waasland-beveren-vs-lommel-sk-2026-10-09`](https://bttspredict.com/ar/match/waasland-beveren-vs-lommel-sk-2026-10-09) — 404 |
| `west-ham-united-vs-queens-park-rangers-2026-10-09` | [`/en/match/west-ham-united-vs-queens-park-rangers-2026-10-09`](https://bttspredict.com/en/match/west-ham-united-vs-queens-park-rangers-2026-10-09) — 404 | [`/ar/match/west-ham-united-vs-queens-park-rangers-2026-10-09`](https://bttspredict.com/ar/match/west-ham-united-vs-queens-park-rangers-2026-10-09) — 404 |
| `tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09` | [`/en/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09`](https://bttspredict.com/en/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09) — 404 | [`/ar/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09`](https://bttspredict.com/ar/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09) — 404 |

Le composant comporte des libellés FR/EN/AR, mais cela ne suffit pas à prouver une version localisée fidèle de chacune de ces pages. Pour les dix enregistrements examinés, les champs `ai_key_fact_en`, `ai_analysis_en`, les champs `last5Home`/`last5Away` et les données `formHome`/`formAway` ne sont pas fournis; le champ `analysis` des snapshots est en français et n’est pas celui que le chargeur transmet au bloc d’analyse éditoriale. Le texte anglais du composant comporte aussi au moins le libellé résiduel `À retenir`. L’interface arabe traduit les libellés, mais aucun texte éditorial spécifique arabe n’est fourni pour ces dix matchs. **Conclusion :** ne pas déclarer de variantes EN/AR équivalentes et ne pas émettre de hreflang pour elles. Les générer plus tard nécessiterait d’abord une vraie décision de contenu et une vérification linguistique, pas une traduction automatique destinée à atteindre trois URL.

## Règle reproductible pour les futurs matchs

Appliquer ces conditions cumulatives aux pages historiques candidates. L’éligibilité à la génération, l’indexation et la localisation sont trois décisions distinctes.

1. **Identité et date fiables :** disposer du nom exact domicile/extérieur, de la compétition et de la date de coup d’envoi confirmés par une source; vérifier ces éléments entre snapshot et source du match. Documenter le fuseau lorsqu’une heure est affichée ou lorsque la date locale et la date UTC diffèrent. Si les sources donnent deux dates calendaires, ne pas publier avant d’avoir choisi et documenté une convention stable. Si la date concorde mais que le fuseau de l’heure du snapshot manque, la date peut être évaluée; ne pas afficher l’heure jusqu’à clarification.
2. **Historique suffisant :** exiger `dataQuality` au moins `MEDIUM`, `matchCountHome >= 5` et `matchCountAway >= 5`, avec une source de données connue. Le nombre de fichiers snapshot qui répètent le match ne remplace pas ces seuils.
3. **Résultat d’un match terminé :** exiger le score final confirmé par une source de résultat explicite et nommée (compétition, club ou fournisseur reconnu), avec date de vérification. L’enregistrer dans le registre de résultats lu par la page (`public/win-history.json` aujourd’hui, ou une structure équivalente approuvée). Ne jamais qualifier de « vérifié » un `finalScore` accompagné seulement de `verifiedAt` sans source consultable.
4. **Contenu propre à la rencontre :** exiger, en plus des équipes/date/compétition, au moins deux valeurs ou modules propres à ce match (par exemple prédiction et probabilité, échantillon historique et xG, score sourcé). Vérifier qu’aucune page identique n’est déjà retenue et ne pas présenter un texte boilerplate comme une analyse unique. Si une page est censée être éditoriale, mais ne possède aucun texte de fond distinct, la remettre en revue plutôt que l’indexer automatiquement.
5. **URL stable :** le slug doit correspondre à `generateMatchSlug(home, away, date)`; éviter de créer une deuxième URL si les noms d’équipes ont des variantes. Enregistrer une source durable hors d’une fenêtre mobile de snapshots et définir une stratégie de conservation avant qu’une purge puisse supprimer les données requises.
6. **Pas de duplication linguistique :** ne créer une variante que si elle est réellement disponible en 200, porte un canonical propre, traduit les libellés et tout texte éditorial spécifique, et correspond au même événement. La réciprocité hreflang ne vient qu’après vérification de toutes les variantes. L’absence de version fidèle signifie aucune URL de cette langue, pas une traduction automatique par défaut.
7. **SEO séparé :** les signaux GSC/liens peuvent départager des candidats, mais ne remplacent pas la qualité et la source. Ajouter au sitemap uniquement les pages autorisées à l’index, canoniques, en 200, sans redirection ni `noindex`. Une page conservée pour l’historique n’est pas automatiquement indexable.

Selon cette règle, West Ham–QPR est le seul candidat répondant actuellement aux exigences locales de qualité, d’identité/date et de résultat source-traceable. Dortmund–Werder et St. Pauli–Wolfsburg échouent aussi au seuil historique; Nashville–Toronto demande une clarification de fuseau; les six autres n’ont pas d’entrée source-traceable dans le registre du rendu.

## Impact technique à prévoir après validation

### Volume et génération

- **Sélection proposée : 1 page FR, 0 EN, 0 AR, soit exactement 1 URL HTML retenue.** Aucun ajout n’a été fait à `out/`.
- L’export local actuel contient 288 pages de match par langue, soit 864 HTML totalisant **105 717 943 octets (105,72 Mo décimaux) de HTML brut**. Ce total exclut la compression et les ressources/autres fichiers de l’export. Les dix URL candidates ne sont dans aucun des trois répertoires d’export.
- Taille moyenne mesurée sur les HTML actuels : **121 481 octets FR**, **120 982 octets EN** et **124 613 octets AR** par page. L’estimation d’une page FR est donc **121 481 octets (0,121 Mo) bruts**, hors ressources partagées; la taille réellement transférée n’a pas été mesurée. Temps de build non mesuré.
- **Risque de génération involontaire :** `src/app/[locale]/match/[slug]/page.tsx` appelle `generateStaticParams()` pour EN et AR à partir de chaque slug. Si le slug West Ham est ajouté aux données sans filtre de locale, le code courant produirait **3 pages**, pas une : FR + EN + AR, environ **367 076 octets (0,367 Mo)** de HTML brut au total. Pour respecter la sélection approuvable (1 URL), une liste par locale serait nécessaire dans une phase ultérieure; aucune modification de ce type n’est faite ici.
- `src/lib/matches.ts` ne charge que les 14 snapshots les plus récents puis `public/predictions.json`. Les fichiers source de West Ham (`2026-10-03.json` à `2026-10-08.json`) sont hors de cette fenêtre. Un manifeste de sélection et une source durable seraient nécessaires pour que le build reproduise cette page après approbation; les snapshots répétés doivent produire une seule URL.

### Fichiers et signaux à examiner en Phase 2B, sans changement dans cette phase

- `src/lib/matches.ts` : fenêtre d’archives, source durable de la sélection et déduplication par slug.
- `src/app/match/[slug]/page.tsx` : génération FR, rendu du score depuis l’historique vérifié et canonical auto-référent.
- `src/app/[locale]/match/[slug]/page.tsx` : génération EN/AR actuellement liée aux slugs; toute version localisée doit être explicitement autorisée par locale.
- `public/predictions-archive/2026-10-03.json` à `2026-10-08.json` et `public/win-history.json` : sources existantes à préserver; elles n’ont pas été modifiées.
- `src/app/sitemap.ts` : sitemap statique qui ne contient actuellement aucune page match. Une entrée FR ne pourra être envisagée qu’après validation d’indexabilité et réponse 200. Aucun hreflang pour EN/AR, et aucun ajout au sitemap n’a été exécuté.
- `tests/seo-preservation.test.ts` : empreinte de conservation du sitemap; prévoir un test sémantique autorisé si un changement de sitemap est approuvé.
- `next.config.ts`, `public/.htaccess` et le workflow de déploiement : l’export est statique; une route non pré-générée renvoie actuellement 404. Aucune règle serveur ou étape de déploiement n’a été modifiée.
- `scripts/prune-archives.mjs` conserve une fenêtre finie d’archives. Ne pas la modifier sans décision distincte; la page sélectionnée ne doit pas perdre sa donnée de source au prochain roulement.

### Canonicals, sitemap et archives

Le canonical FR actuel est auto-référent. Les routes localisées, si elles existaient, auraient leur propre canonical mais le gabarit des pages match ne déclare pas de hreflang croisé. La décision proposée est un seul canonical FR pour la page retenue; ne pas inventer de cible EN/AR. Le sitemap n’inclut aucune page match aujourd’hui. Si l’URL est finalement indexable, une seule entrée FR pourrait être ajoutée après validation; sinon elle reste hors sitemap. La génération de plusieurs snapshots quotidiens du même match est inutile et doit se dédupliquer à une page.

## Contrôle du 403 arabe : vérifications à effectuer

**Fait disponible :** le GET public de `/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25` a renvoyé 403 dans le diagnostic Phase 1, tandis que les fichiers statiques FR/EN/AR correspondants existaient localement. La cause côté hébergement n’est pas connue. Rien dans le dossier ne démontre que la production sert la même configuration que le dépôt. Voir [diagnostic Phase 1, §2](./RAPPORT_DIAGNOSTIC_PHASE1.md#L50) et [plan, P0.2](./PLAN_CORRECTIONS_PHASE2.md#L58).

### Vérifiable localement, sans accès au serveur

- Confirmer la présence et la lisibilité de `out/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25.html`, puis comparer taille, hash, chemin/casse et métadonnées avec les variantes FR/EN du même match et une autre page AR fonctionnelle.
- Examiner la version suivie de `public/.htaccess`, `public/_headers`, `public/robots.txt`, `Caddyfile`, `next.config.ts` et `.github/workflows/deploy.yml`; vérifier si le dépôt contient une règle explicite bloquant `/ar/match/` et identifier les chemins théoriques produits par l’export.
- Vérifier localement les permissions de fichiers, l’existence de la route localisée et les paramètres SSG. Les permissions locales ne prouvent rien sur les ACL distantes.
- Dans un clone ou environnement jetable autorisé, reproduire la génération et comparer l’artefact, en tenant compte du fait que les scripts `prebuild`/`postbuild` peuvent écrire dans `public/` et `out/`. Aucun nouveau build n’a été exécuté pour ce dossier.

### Nécessite l’accès à l’hébergement ou à ses journaux

- Vérifier que le fichier exact a été transféré au bon `DocumentRoot`; comparer chemin, casse, taille et date au fichier local et vérifier le journal du transfert FTP.
- Contrôler propriétaire/groupe, mode et ACL du fichier ainsi que de chaque répertoire parent; comparer à la variante FR/EN du même match et à une page AR qui répond 200.
- Lire le `.htaccess` réellement déployé et les règles parentes, le virtual host, les modules Apache et `AllowOverride` (ou les règles effectives du serveur réellement utilisé). Le `.htaccess` du dépôt ne prouve pas qu’il est appliqué en production.
- Examiner les journaux d’accès/erreur et les événements WAF/ModSecurity/CDN à l’heure exacte du 403; rechercher un refus de permission, règle bot, filtrage régional, cache, réécriture ou blocage de chemin. Comparer l’URI brute, son décodage, le chemin disque et le résultat pour plusieurs agents/réseaux.
- Après diagnostic seulement, et avec autorisation distincte, retester par GET l’URL AR, ses témoins FR/EN et une autre page AR. Viser un 200 correct si la page doit être publique; ne pas maquiller le 403 en 404 ou redirection par défaut. Aucun accès serveur ni changement production n’a eu lieu.

## Sources

- [Rapport de diagnostic Phase 1](./RAPPORT_DIAGNOSTIC_PHASE1.md), notamment §1 pour les dix URL et leurs snapshots, §2 pour le 403, et l’annexe GSC dans [l’audit central](../BTTSPREDICT_AUDIT_COMPLET.md#L1386).
- [Plan de corrections Phase 2](./PLAN_CORRECTIONS_PHASE2.md), notamment P0.1 (sélection et génération), P0.2 (403), les fichiers candidats et les décisions en attente.
- Code inspecté en lecture seule : `src/lib/matches.ts`, `src/app/match/[slug]/page.tsx`, `src/app/[locale]/match/[slug]/page.tsx`, `src/app/sitemap.ts`, `tests/seo-preservation.test.ts`, `scripts/prune-archives.mjs`.
- Données inspectées en lecture seule : snapshots cités dans chaque fiche et `public/win-history.json`.
- Scores recoupés dans les pages de résultats sportives liées pour chaque fiche; le compte rendu West Ham et la source Wolves sont officiels. Pour les neuf matchs sans ligne du registre interne, ce recoupement externe ne remplace pas une provenance conservée par l’application.

## Addendum du 3 novembre 2026 — préparation Phase 2C (proposition seulement)

La sélection d’une seule page française `/match/west-ham-united-vs-queens-park-rangers-2026-10-09` reste à valider; aucune implémentation n’est autorisée à ce stade. La [proposition de diff Phase 2C](./PHASE2C_PROPOSITION_DIFF_WEST_HAM_QPR.md) décrit la copie conservée hors des archives roulantes, la route FR dédiée, les garde-fous de génération, le schéma de vérification et les tests prévus.

**Vérifié localement :** les six entrées West Ham–QPR des snapshots datés du 3 au 8 octobre 2026 ont les mêmes champs et valeurs; leurs archives sources seront conservées inchangées. Elles portent `time: 19:00`, mais aucun fuseau. `public/win-history.json` garde le score 1–1, `WON`, `source: ESPN public` et `verifiedAt: 2026-10-23T05:42:15.167Z`, sans URL directe. Le générateur actuel lit les 14 archives les plus récentes; il faut donc une rétention dédiée. Le fuseau original du snapshot demeure inconnu.

**Proposition, non appliquée :** copier une représentation canonique du snapshot dans `src/data/retained-match-pages/`, conserver la provenance des six archives, ajouter un registre versionné avec `kickoff.timeZone`, `snapshot.timeZone` (nul/inconnu) et `display.timeZone`, et générer ce slug par une route littérale FR. Les générateurs dynamiques l’excluraient afin d’éviter doublon FR et variantes EN/AR; les autres slugs resteraient générés comme avant. Les deux directives robots — indexable et `noindex, follow` — sont présentées comme choix exclusifs, sans défaut. Aucun changement n’a été fait au sitemap ou à un canonical existant; le canonical propre de la nouvelle route figure uniquement dans le diff documentaire proposé.

Les cinq pages protégées demeurent `/en/btts-and-over-2-5-predictions-today`, `/en`, `/en/over-2-5/predictions/today`, `/` et `/en/ai-correct-score-predictions`. Le diff propose des empreintes source en test, en plus des protections déjà présentes. Aucun build, test, lint, TypeScript, changement de code/donnée, commit, push ou action production n’a été exécuté. La collision possible entre route statique littérale et `[slug]` à l’export reste une vérification ultérieure en environnement isolé.

**À décider :** approuver ou corriger l’URL FR; choisir A ou B; valider la rétention et le schéma; autoriser séparément les tests/build après décision. Le rapport Phase 1 et toutes les sections précédentes restent inchangés.

## Addendum complémentaire — contrôles de la proposition Phase 2C

Un mini-projet Next.js 16.1.3 en export statique a compilé hors du dépôt et listé séparément la route statique `/match/west-ham-united-vs-queens-park-rangers-2026-10-09` et le gabarit `/match/[slug]` avec un autre slug. Cela confirme le schéma de routes, pas le build complet de l’application. Le test déjà présent `npm test -- tests/seo-preservation.test.ts` a réussi : 8/8. Les cinq empreintes des sources des pages protégées sont inchangées. Le diff documentaire a passé `git apply --check` sans être appliqué. Aucun test de la proposition ni build du projet n’a été exécuté; aucun code applicatif n’a été modifié.
