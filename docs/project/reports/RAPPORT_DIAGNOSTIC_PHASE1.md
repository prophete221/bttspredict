# Rapport de diagnostic — Phase 1

**Date du diagnostic :** 3 novembre 2026
**Branche :** `redesign/professional-global-2026-11-03`
**Commit exact de référence et de travail du diagnostic :** `325526d93c63fc52143741a5b739cf68f7ba0809`
**Commit du code audité dans le rapport central :** `71cf295e9d07794ea04b88710d474561cf128b35`
**Périmètre :** diagnostic en lecture seule. Aucune correction, modification de code, contenu, métadonnées, route, règle serveur ou purge n’a été effectuée. Aucun push, merge, accès en écriture à `main` ou déploiement n’a eu lieu.

Les constats du diagnostic précédent sont consignés ici avec les preuves disponibles. Les requêtes HTTP faites sur le site public étaient des GET en lecture seule, sans soumission ni modification d’état. Les données GSC citées proviennent de l’export fourni et restent un agrégat de la période du 4 au 31 octobre 2026.

## Synthèse

- Les **10 URL match en 404** sont retrouvées dans des snapshots JSON locaux, mais aucune ne figure dans les 14 snapshots que `src/lib/matches.ts` charge pour générer les pages statiques. Aucun HTML n’est exporté pour ces slugs ; `public/.htaccess` renvoie alors 404. La rétention de 90 fichiers de `scripts/prune-archives.mjs` n’est pas la cause directe observée.
- L’URL `/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25` répond 403 publiquement alors que les trois variantes HTML existent dans le build local, et que les variantes FR/EN publiques répondent 200. La cause est un refus d’accès spécifique à l’URL côté serveur ; le motif sous-jacent (permission, fichier déployé ou règle d’hébergement) n’est pas accessible depuis le dépôt.
- Les HTML exportés `out/404.html` et `out/_not-found.html` ont chacun des directives robots contradictoires (`noindex` et `index, follow`). La directive `index, follow` vient des métadonnées globales dans `src/app/layout.tsx`; `src/app/not-found.tsx` ne définit pas de robots. Le `noindex` est visible dans la sortie générée, mais n’est pas explicité dans ce composant.
- La page `/predictions-archive/` répond 200 et porte `noindex, follow`; elle n’est ni bloquée par `robots.txt`, ni dans le sitemap. Cette directive HTML ne s’applique pas aux fichiers JSON autonomes.
- `/en/over-2-5/statistics` n’est pas une route déclarée ou exportée. Son 404 est attendu pour cette branche ; aucune route n’a été créée.
- Les 64 routes éditoriales ont toutes, dans le HTML initial, `<html lang="fr">` et aucun `dir` racine. Le script client ne modifie que les attributs racine `lang`/`dir` pour `/en` et `/ar`. Trois routes statistiques n’ont aucun H1.
- Le sitemap compte 61 URL. Il omet trois URL éditoriales (`/linebet-promo-code`, `/prediction-aviator`, `/pronostics`) et déclare des alternates linguistiques pour 19 familles. L’HTML `hreflang` est incomplet ou asymétrique sur plusieurs familles.

## 1. Dix URL match en 404

### Faits vérifiés

Les dix URL ci-dessous ont toutes renvoyé 404 lors des contrôles HTTP publics en GET. Les slugs existent dans les snapshots JSON listés, mais ne sont absents que de la fenêtre de génération active (14 derniers fichiers) et du flux courant `public/predictions.json`. Les chemins de fichiers HTML correspondants n’existent donc ni sous `out/match/`, ni sous `out/en/match/`, ni sous `out/ar/match/`.

| URL GSC testée | Snapshots locaux contenant le match | HTML exporté FR/EN/AR |
|---|---|---|
| `/match/new-england-revolution-vs-seattle-sounders-fc-2026-10-10` | `2026-10-04.json` à `2026-10-09.json` | Aucun |
| `/match/wolverhampton-wanderers-vs-portsmouth-2026-10-20` | `2026-10-18.json`, `2026-10-19.json` | Aucun |
| `/match/borussia-dortmund-vs-werder-bremen-2026-10-09` | `2026-10-03.json` à `2026-10-08.json` | Aucun |
| `/match/southampton-vs-bolton-wanderers-2026-10-17` | `2026-10-15.json`, `2026-10-16.json` | Aucun |
| `/match/fc-heidenheim-vs-kaiserslautern-2026-10-09` | `2026-10-03.json` à `2026-10-08.json` | Aucun |
| `/match/nashville-sc-vs-toronto-fc-2026-09-27` | `2026-09-20.json` à `2026-09-26.json` | Aucun |
| `/match/st-pauli-vs-vfl-wolfsburg-2026-09-12` | `2026-09-11.json` | Aucun |
| `/match/waasland-beveren-vs-lommel-sk-2026-10-09` | `2026-10-03.json` à `2026-10-08.json` | Aucun |
| `/match/west-ham-united-vs-queens-park-rangers-2026-10-09` | `2026-10-03.json` à `2026-10-08.json` | Aucun |
| `/match/tsv-eintracht-braunschweig-vs-holstein-kiel-2026-10-09` | `2026-10-03.json` à `2026-10-08.json` | Aucun |

**Preuves dans le code :** `src/lib/matches.ts:182–193` construit les matchs depuis les données en utilisant `generateMatchSlug`; `src/lib/matches.ts:245–255` ne charge que les 14 dernières archives triées, puis `public/predictions.json`. `src/app/match/[slug]/page.tsx` utilise `dynamicParams = false` et la génération statique. `public/.htaccess:41–55` renvoie le document 404 pour une URL match sans fichier exporté.

**Cause confirmée :** les archives sources subsistent localement, mais les matchs ont quitté la fenêtre des 14 snapshots utilisée pour le build statique ; aucune page HTML n’est générée. Le composant 404 indique aussi que les anciennes pages match ne sont plus servies (`src/app/not-found.tsx`). La politique de rétention de 90 archives n’est pas la cause directe démontrée : les snapshots des matchs sont présents dans le dépôt.

**Risques :** les URL GSC ne montrent plus leur page match ; l’audit GSC comptait 376 impressions et 7 clics sur l’ensemble des 112 URL match échantillonnées. Une redirection non pertinente ferait perdre le contexte de la page.

**Recommandation en attente de décision :** examiner chaque destination et décider s’il faut conserver une page historique utile ou rediriger vers une cible réellement équivalente. Ne créer aucune redirection et ne modifier aucune règle de purge sans validation.

**Observation de cohérence :** le dossier local contient 91 snapshots datés du `2026-08-05` au `2026-11-03`, tandis que `scripts/prune-archives.mjs` définit `KEEP = 90`. L’origine de ce fichier supplémentaire (par exemple archive du jour ajoutée après la dernière purge) n’est pas établie ; le script n’a pas été exécuté.

## 2. URL match en 403

URL : `/ar/match/san-diego-fc-vs-seattle-sounders-fc-2026-10-25`.

**Faits vérifiés :** le match est présent dans `public/predictions-archive/2026-10-22.json`, `2026-10-23.json` et `2026-10-24.json`, lesquels sont dans la fenêtre des 14 snapshots. Les trois fichiers locaux existent : `out/match/{slug}.html`, `out/en/match/{slug}.html`, `out/ar/match/{slug}.html`. Les contrôles publics ont renvoyé 200 pour les variantes FR et EN de ce match, 403 pour la variante AR, et 200 pour une autre page AR match. Le corps du 403 est une page générique « Forbidden » comprenant `robots: none,noindex,nofollow`.

**Cause confirmée :** refus HTTP 403 ciblé côté serveur public sur la variante AR ; ce n’est pas l’absence de génération statique locale ni une règle générale bloquant toutes les pages `/ar/match/`.

**Cause sous-jacente incertaine :** aucune preuve accessible ne permet de déterminer si le fichier exact est absent ou mal permissionné sur le serveur, ou si une règle d’hébergement/WAF refuse ce chemin. Les journaux et l’arborescence de production ne sont pas accessibles ici. Le 403 ne doit pas être traité comme un 404.

**Risque :** page et métadonnées arabes inaccessibles sur cette seule URL observée.

**Recommandation en attente de décision :** vérifier le fichier effectivement déployé et les permissions/règles d’accès de l’hébergement pour cette URL. Ne modifier aucune règle du dépôt dans le cadre du diagnostic.

## 3. Pages d’erreur et directives robots

**Faits vérifiés :** `out/404.html` et `out/_not-found.html` contiennent chacune deux balises : `<meta name="robots" content="noindex">` et `<meta name="robots" content="index, follow">`. `src/app/layout.tsx:71–81` fournit les métadonnées globales `index: true, follow: true`. `src/app/not-found.tsx` n’a pas de métadonnée robots propre. Le `noindex` existe dans le HTML généré, mais aucune déclaration correspondante n’apparaît dans `src/app/not-found.tsx`. Le fichier source `public/404.html` porte `noindex, follow`, mais `out/404.html` n’est pas identique à ce fichier public ; la sortie est une page Next exportée.

**Cause :** l’héritage des robots `index, follow` du layout racine est confirmé. La sortie Next ajoute aussi un `noindex` sur le rendu d’erreur ; son origine n’est pas déclarée dans les sources applicatives consultées et reste attribuée au rendu/framework de la page not-found, plutôt qu’à `public/404.html`.

**Risque :** les directives contradictoires ne permettent pas de garantir une politique d’indexation claire de la page 404.

**Recommandation en attente de décision :** définir ultérieurement une politique explicite et unique pour les pages d’erreur, en testant le HTML exporté et sans toucher aux métadonnées éditoriales.

## 4. Archive des prédictions

**Faits vérifiés :** `/predictions-archive/` répond 200 sur le site public et contient `<meta name="robots" content="noindex, follow">`. La même balise se trouve dans `public/predictions-archive/index.html` et `out/predictions-archive/index.html`. `public/robots.txt` autorise les crawlers à la racine et ne bloque que `/api/` et `/admin`. L’index d’archive n’est pas dans le sitemap. Les fichiers JSON testés pour `2026-10-09` et `2026-09-11` répondent 200 en `application/json`, sans `X-Robots-Tag` observé. La balise de l’index HTML ne s’applique pas automatiquement aux JSON autonomes.

`public/predictions-archive/index.html` contient une liste statique de liens (`2026-08-11`, `2026-08-10`, `2026-08-09`, `2026-08-08`, `2026-06-07`) plutôt qu’un manifeste des snapshots présents. La page d’index répond 200 ; le JSON public `2026-11-03.json`, présent localement, a répondu 404. Cette différence entre dépôt et réponse publique est un fait ponctuel ; sa cause n’est pas établie.

**Risque :** déduire à tort que les fichiers JSON sont noindex parce que l’index l’est ; inventaire d’archives affiché obsolète.

**Recommandation en attente de décision :** si l’intention est aussi d’empêcher l’indexation des JSON, examiner une politique d’en-tête adaptée aux fichiers JSON ; déterminer si la liste d’archives doit être actualisée. Aucun changement effectué.

## 5. Statut de `/en/over-2-5/statistics`

**Faits vérifiés :** seul `src/app/over-2-5/statistics/page.tsx` existe. Il n’y a pas de page équivalente dans `src/app/[locale]/`. Le sitemap inclut la route FR `/over-2-5/statistics` et ne déclare pas ce chemin comme localisé ; les liens internes trouvés pointent vers la route FR. Aucun export EN correspondant n’existe. Le GET public `/en/over-2-5/statistics` renvoie 404.

**Conclusion :** pour l’état de cette branche, `/en/over-2-5/statistics` est une route non prise en charge et son 404 est attendu, pas une route EN cassée. Aucune route ne doit être créée sans décision de contenu/demande.

## 6. Matrice SEO des 64 routes éditoriales

### Valeurs communes

Pour chaque ligne des trois tableaux, dans le HTML statique initial : `<html lang="fr">` et attribut `dir` absent sur la racine. Après exécution du script inline de `src/app/layout.tsx:138–145`, les racines `/en/...` deviennent `lang="en" dir="ltr"`, les racines `/ar/...` `lang="ar" dir="rtl"`, et les routes FR restent `lang="fr"` sans `dir`. Le conteneur localisé de `src/app/[locale]/layout.tsx:21–24` déclare déjà `lang` et `dir` adéquats à l’intérieur du document.

Dans les tableaux, **canonique = auto-identique** signifie `https://bttspredict.com` + chemin de la route, sans slash final ; la canonical de `/` est exactement `https://bttspredict.com`. Les H1 sont les textes statiques relevés ; des H1 animés ont leur texte dupliqué dans le `textContent` sans que cela constitue plusieurs éléments H1. Les cinq URL en **gras** sont protégées. `—` signifie aucun hreflang HTML.

### FR — 26 routes

| URL | H1 observé | Title | Description | Canonical | Hreflang | Sitemap |
|---|---|---|---|---|---|---|
| **`/`** | Plateforme N°1 MondialePlateforme N°1 MondialeBTTS & Over 2.5 MasterBTTS & Over 2.5 Master | `BTTSPredict — Pronostics BTTS du jour et Over 2,5` | Pronostics BTTS du jour sur des matchs internationaux, avec sélections horodatées, historique public et méthode documentée. 18+. | `https://bttspredict.com` | HL1 | Oui |
| `/ai-correct-score-predictions` | Prédictions de score exact par IAPrédictions de score exact par IA | `Pronostics score exact par IA — Poisson \| BTTSPredict` | Scores exacts modélisés par Poisson sur les buts récents des équipes (ESPN). Probabilités informatives, aucune garantie de gain. 18+. | Auto-identique | HL2 | Oui |
| `/bonus-888starz` | Code promo 888Starz btts221 | `Code promo 888Starz btts221 : 300% + 100 spins \| BTTSPredict` | Code promo 888Starz btts221 : 300% de bonus et 100 free spins, sans condition de mise, dès 1 € de dépôt. Guide 2026 d'inscription, 18+. | Auto-identique | HL4 | Oui |
| `/bonus-888starz-btts221` | Ton code 888Starz exclusif | `Code 888Starz btts221 : bonus 300% + 100 spins \| BTTSPredict` | Le code btts221 débloque 300% de bonus + 100 free spins sur 888Starz, sans condition de mise, dès 1 € de dépôt. Guide 2026, 18+. | Auto-identique | HL5 | Oui |
| `/btts-and-over-2-5-predictions-today` | BTTS and Over 2.5 Predictions TodayBTTS and Over 2.5 Predictions Today | `BTTS + Over 2.5 Predictions Today \| BTTSPredict` | Today's best BTTS + Over 2.5 combined predictions. AI-powered football tips where both teams score AND total goals exceed 2.5. Free, updated 4x daily. 18+. | Auto-identique | — | Oui |
| `/btts-c-est-quoi` | BTTS : qu'est-ce que cela signifie ? | `BTTS : définition et fonctionnement \| BTTSPredict` | Comprenez le pari BTTS, la différence entre BTTS Oui et Non, les exemples et les limites d’un pronostic football. 18+. | Auto-identique | — | Oui |
| `/btts/predictions/today` | Pronostics BTTS du jour | `Pronostics BTTS du jour — Sélections gratuites \| BTTSPredict` | Pronostics BTTS du jour sur des matchs internationaux : sélections statistiques, données horodatées et méthode documentée. 18+. | Auto-identique | HL6 | Oui |
| `/btts/predictions/tomorrow` | BTTS Predictions TomorrowBTTS Predictions Tomorrow | `BTTS Predictions Tomorrow — Pronostics demain \| BTTSPredict` | Aperçu des pronostics BTTS de demain. Sélection quotidienne par moteur IA. 18+. | Auto-identique | — | Oui |
| `/btts/statistics` | Statistiques BTTS par ligueStatistiques BTTS par ligue | `Statistiques BTTS par ligue \| BTTSPredict` | Liste des ligues couvertes par BTTSPredict pour le marché BTTS. Taux et moyennes historiques à intégrer via source vérifiable. Aucune garantie future. 18+. | Auto-identique | — | Oui |
| `/cgu` | CONDITIONS GÉNÉRALES | `CGU — Conditions Générales \| BTTSPredict` | CGU BTTSPredict : conditions d'utilisation, service, affiliation, avertissement et responsabilités. | Auto-identique | — | Oui |
| `/code-promo-1xbet` | Code promo 1xBet Vipbtts | `Code promo 1xbet Vipbtts : 300% + 100 free spins \| BTTSPredict` | Code promo 1xbet Vipbtts : 300% de bonus + 100 free spins, sans condition de mise. Guide 2026, 18+. | Auto-identique | HL7 | Oui |
| `/code-promo-linebet-senegal` | Code promo Linebet VISION221 — Linebet promo code | `Code promo Linebet VISION221 \| promo code \| BTTSPredict` | Code promo Linebet VISION221 — Linebet promo code & bonus code. Offre partenaire annoncée. Vérifie les conditions. 18+. | Auto-identique | HL10 | Oui |
| `/code-promo-melbet` | Code promo Melbet Bttswin | `Code promo Melbet Bttswin : 300% + 100 free spins \| BTTSPredict` | Code promo Melbet Bttswin : 300% de bonus + 100 free spins, sans condition de mise. Guide 2026, 18+. | Auto-identique | HL8 | Oui |
| `/historique` | Historique vérifié — BTTSPredict | `Historique vérifié — Nouveau suivi public \| BTTSPredict` | Historique vérifié BTTSPredict : chaque pronostic enregistré, horodaté et évalué après le résultat officiel. 18+. | Auto-identique | — | Oui |
| `/jouer-responsable` | JOUER RESPONSABLE | `Jouer Responsable  \| BTTSPredict` | Jouer responsable avec BTTSPredict : risques, addiction, conseils et ressources d'aide. 18+ uniquement. | Auto-identique | — | Oui |
| `/linebet-promo-code` | Linebet Promo Code Sénégal | `Code Promo Linebet Sénégal \| BTTSPredict` | Code promo Linebet Sénégal. Conditions et montants à vérifier auprès de l'opérateur. Lien d'affiliation rémunéré. 18+. | `https://bttspredict.com/code-promo-linebet-senegal` | — | **Non** |
| `/mentions-legales` | MENTIONS LÉGALES | `Mentions Légales  \| BTTSPredict` | Mentions légales BTTSPredict : éditeur, hébergement, propriété intellectuelle, responsabilité et droit applicable. | Auto-identique | — | Oui |
| `/methodologie` | Notre méthodologie d’analyseNotre méthodologie d’analyse | `Méthodologie \| BTTSPredict` | Découvrez les données, filtres et limites utilisés pour analyser BTTS et Over 2,5. Méthode transparente, résultats vérifiables et aucune garantie. | Auto-identique | — | Oui |
| `/over-2-5/predictions/today` | Pronostics Over 2.5 du jourPronostics Over 2.5 du jour | `Pronostics Over 2,5 du jour \| BTTSPredict` | Pronostics Over 2,5 du jour sur des matchs internationaux : sélection statistique, date Africa/Dakar et méthode documentée. 18+. | Auto-identique | HL9 | Oui |
| `/over-2-5/statistics` | Over 2.5 Statistics by LeagueOver 2.5 Statistics by League | `Over 2.5 Statistics by League — Goal Analysis \| BTTSPredict` | List of leagues covered by BTTSPredict for Over 2.5 market. Historical averages and rates to be integrated via verifiable source. 18+. | Auto-identique | — | Oui |
| `/politique-confidentialite` | POLITIQUE DE CONFIDENTIALITÉ | `Politique de Confidentialité  \| BTTSPredict` | Politique de confidentialité de BTTSPredict — collecte de données, utilisation, services tiers, droits des utilisateurs, politique de cookies et contact. | Auto-identique | — | Oui |
| `/prediction-aviator` | Aviator 2026 : statistiques historiques et fonctionnementAviator 2026 : statistiques historiques et fonctionnement | `Aviator 2026 : statistiques historiques \| BTTSPredict` | Statistiques historiques Aviator et principe provably fair. Aucun multiplicateur futur ne peut être prédit. Informations 18+. | Auto-identique | — | **Non** |
| `/pronostics` | Pronostics BTTS du jour | `Pronostics BTTS du jour — Sélections gratuites \| BTTSPredict` | Pronostics BTTS du jour sur des matchs internationaux : sélections statistiques, données horodatées et méthode documentée. 18+. | `https://bttspredict.com/btts/predictions/today` | — | **Non** |
| `/resultats-verifies` | Résultats vérifiés des pronosticsRésultats vérifiés des pronostics | `Résultats vérifiés des pronostics \| BTTSPredict` | Consultez l'historique des pronostics publiés avant les matchs et leurs résultats vérifiés après coup. Données datées et méthode transparente. | Auto-identique | — | Oui |
| `/statistiques` | — | `Statistiques \| BTTSPredict` | Statistiques vérifiées du suivi public : taux avec dénominateurs explicites, évolution des résultats, répartition par marché et par compétition. Aucune donnée inventée, aucune projection. | Auto-identique | — | Oui |
| `/vip` | Débloque ton accès VIP en 4 étapes clairesDébloque ton accès VIP en 4 étapes claires | `Centre VIP — Intelligence match privée \| BTTSPredict` | Fiches VIP BTTS, Over 2.5 et score exact publiées avant le coup d’envoi, avec méthode documentée et accès vérifié. | Auto-identique | — | Oui |

### EN — 19 routes

| URL | H1 observé | Title | Description | Canonical | Hreflang | Sitemap |
|---|---|---|---|---|---|---|
| **`/en`** | The World’s No.1The World’s No.1BTTS & Over 2.5 Master PlatformBTTS & Over 2.5 Master Platform | `BTTS Predictions Today & Over 2.5 \| BTTSPredict` | BTTS, Over 2.5 and correct-score analysis, published before kick-off and tracked to the verified result. | Auto-identique | HL1 | Oui |
| **`/en/ai-correct-score-predictions`** | AI Correct Score PredictionsAI Correct Score Predictions | `AI Correct Score Predictions — Exact Scores \| BTTSPredict` | Exact-score probabilities calculated with a Poisson model. Statistical estimates, not guarantees. 18+. | Auto-identique | HL3 | Oui |
| `/en/bonus-888starz` | 888Starz promo code btts221 | `888Starz Promo Code btts221: 300% + 100 Spins \| BTTSPredict` | 888Starz promo code btts221: 300% bonus + 100 free spins, no wagering requirements, from a €1 deposit. 2026 sign-up guide, 18+. | Auto-identique | HL4 | Oui |
| `/en/bonus-888starz-btts221` | Your exclusive 888Starz code | `888Starz btts221 Promo Code: 300% + 100 Spins \| BTTSPredict` | 888Starz promo code btts221: 300% bonus + 100 free spins, no wagering requirements, from a €1 deposit. 2026 guide, 18+. | Auto-identique | HL5 | Oui |
| **`/en/btts-and-over-2-5-predictions-today`** | BTTS and Over 2.5 Predictions TodayBTTS and Over 2.5 Predictions Today | `BTTS and Over 2.5 Predictions Today \| BTTSPredict` | Combined BTTS and Over 2.5 predictions for international matches. | Auto-identique | — | Oui |
| `/en/btts/predictions/today` | BTTS Predictions Today | `BTTS Predictions Today — Free AI Tips \| BTTSPredict` | Free BTTS predictions for international football matches, with statistical data, public history and responsible betting information. 18+. | Auto-identique | HL6 | Oui |
| `/en/cgu` | Terms of use | `Terms of use \| BTTSPredict` | Terms governing use of BTTSPredict. | Auto-identique | — | Oui |
| `/en/code-promo-1xbet` | 1xBet promo code Vipbtts | `1xbet Promo Code Vipbtts: 300% + 100 Free Spins \| BTTSPredict` | 1xbet promo code Vipbtts: 300% bonus + 100 free spins, no wagering requirements. 2026 sign-up guide, 18+. | Auto-identique | HL7 | Oui |
| `/en/code-promo-linebet-senegal` | Linebet promo code VISION221 | `Linebet Promo Code VISION221: 300% + 100 Spins \| BTTSPredict` | Linebet promo code VISION221: 300% bonus + 100 free spins, no wagering requirements, from a €1 deposit. 2026 sign-up guide, 18+. | Auto-identique | — | Oui |
| `/en/code-promo-melbet` | Melbet promo code Bttswin | `Melbet Promo Code Bttswin: 300% + 100 Free Spins \| BTTSPredict` | Melbet promo code Bttswin: 300% bonus + 100 free spins, no wagering requirements. 2026 sign-up guide, 18+. | Auto-identique | HL8 | Oui |
| `/en/historique` | Verified history — BTTSPredict | `Verified history — New public tracking \| BTTSPredict` | BTTSPredict verified history: every prediction recorded, time-stamped and assessed after the official result. 18+. | Auto-identique | — | Oui |
| `/en/jouer-responsable` | Play responsibly | `Play responsibly \| BTTSPredict` | Responsible betting information and support guidance. | Auto-identique | — | Oui |
| `/en/mentions-legales` | Legal notices | `Legal notices \| BTTSPredict` | Legal information about BTTSPredict. | Auto-identique | — | Oui |
| `/en/methodologie` | How our predictions workHow our predictions work | `Methodology \| BTTSPredict` | Transparent BTTS and Over 2.5 methodology, data sources and limitations. | Auto-identique | — | Oui |
| **`/en/over-2-5/predictions/today`** | Over 2.5 Predictions TodayOver 2.5 Predictions Today | `Over 2.5 Predictions Today — Goal Analysis \| BTTSPredict` | Over 2.5 goals predictions for international football matches, with statistical analysis and daily updates. No future result is guaranteed. 18+. | Auto-identique | HL9 | Oui |
| `/en/politique-confidentialite` | Privacy policy | `Privacy policy \| BTTSPredict` | Privacy policy for BTTSPredict. | Auto-identique | — | Oui |
| `/en/resultats-verifies` | Verified prediction resultsVerified prediction results | `Verified prediction results \| BTTSPredict` | Publicly verified prediction results with dated data and transparent methodology. | Auto-identique | — | Oui |
| `/en/statistiques` | — | `Statistics \| BTTSPredict` | Verified prediction statistics from BTTSPredict. | Auto-identique | — | Oui |
| `/en/vip` | Unlock your VIP access in 4 clear stepsUnlock your VIP access in 4 clear steps | `VIP BTTS Analysis Desk \| BTTSPredict` | Private BTTS, Over 2.5 and exact-score analysis for international matches. | Auto-identique | — | Oui |

### AR — 19 routes

| URL | H1 observé | Title | Description | Canonical | Hreflang | Sitemap |
|---|---|---|---|---|---|---|
| `/ar` | المنصة الأولى عالمياًالمنصة الأولى عالمياًBTTS و Over 2.5 MasterBTTS و Over 2.5 Master | `توقعات BTTS اليوم وأكثر من 2.5 \| BTTSPredict` | تحليلات BTTS وOver 2.5 والنتيجة الدقيقة، تُنشر قبل المباراة وتُتابع حتى النتيجة الموثّقة. | Auto-identique | HL1 | Oui |
| `/ar/ai-correct-score-predictions` | توقعات النتيجة الدقيقة بالذكاء الاصطناعيتوقعات النتيجة الدقيقة بالذكاء الاصطناعي | `توقعات النتيجة الدقيقة بالذكاء الاصطناعي  \| BTTSPredict` | احتمالات النتائج الدقيقة المحسوبة بنموذج بواسون. تقديرات إحصائية وليست ضمانات. 18+. | Auto-identique | HL3 | Oui |
| `/ar/bonus-888starz` | رمز 888Starz btts221 | `رمز 888Starz الترويجي btts221: 300% + 100 لفة مجانية \| BTTSPredict` | رمز 888Starz الترويجي btts221: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة، بدءاً من إيداع 1 يورو. دليل 2026، 18+. | Auto-identique | HL4 | Oui |
| `/ar/bonus-888starz-btts221` | رمزك الحصري في 888Starz | `رمز 888Starz الترويجي btts221: 300% + 100 لفة مجانية \| BTTSPredict` | رمز 888Starz الترويجي btts221: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة، بدءاً من إيداع 1 يورو. دليل 2026، 18+. | Auto-identique | HL5 | Oui |
| `/ar/btts-and-over-2-5-predictions-today` | توقعات BTTS وأكثر من 2.5 اليومتوقعات BTTS وأكثر من 2.5 اليوم | `توقعات BTTS وأكثر من 2.5 اليوم \| BTTSPredict` | توقعات مجمعة للمباريات الدولية. | Auto-identique | — | Oui |
| `/ar/btts/predictions/today` | توقعات BTTS اليوم | `توقعات BTTS اليوم مجاناً  \| BTTSPredict` | توقعات BTTS للمباريات الدولية مع بيانات إحصائية وسجل عام. لا توجد ضمانات للنتائج المستقبلية. 18+. | Auto-identique | HL6 | Oui |
| `/ar/cgu` | الشروط العامة للاستخدام | `الشروط العامة \| BTTSPredict` | شروط استخدام BTTSPredict. | Auto-identique | — | Oui |
| `/ar/code-promo-1xbet` | رمز 1xBet Vipbtts | `رمز 1xbet الترويجي Vipbtts: 300% + 100 لفة مجانية \| BTTSPredict` | رمز 1xbet الترويجي Vipbtts: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة. دليل 2026، 18+. | Auto-identique | HL7 | Oui |
| `/ar/code-promo-linebet-senegal` | رمز Linebet VISION221 | `رمز Linebet الترويجي VISION221: 300% + 100 لفة مجانية \| BTTSPredict` | رمز Linebet الترويجي VISION221: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة، بدءاً من إيداع 1 يورو. دليل 2026، 18+. | Auto-identique | — | Oui |
| `/ar/code-promo-melbet` | رمز Melbet Bttswin | `رمز Melbet الترويجي Bttswin: 300% + 100 لفة مجانية \| BTTSPredict` | رمز Melbet الترويجي Bttswin: مكافأة 300% + 100 لفة مجانية، بدون شروط مراهنة. دليل 2026، 18+. | Auto-identique | HL8 | Oui |
| `/ar/historique` | السجل الموثق — BTTSPredict | `السجل الموثق — فترة تتبع عامة جديدة \| BTTSPredict` | السجل الموثق من BTTSPredict: كل توقع مسجّل ومؤرّخ ومقيّم بعد النتيجة الرسمية. 18+. | Auto-identique | — | Oui |
| `/ar/jouer-responsable` | العب بمسؤولية | `العب بمسؤولية \| BTTSPredict` | معلومات عن اللعب المسؤول وطلب المساعدة. | Auto-identique | — | Oui |
| `/ar/mentions-legales` | الإشعارات القانونية | `الإشعارات القانونية \| BTTSPredict` | معلومات قانونية عن BTTSPredict. | Auto-identique | — | Oui |
| `/ar/methodologie` | كيف نعدّ توقعاتناكيف نعدّ توقعاتنا | `منهجية BTTSPredict \| BTTSPredict` | منهجية شفافة لتوقعات BTTS وOver 2.5 ومصادر البيانات والحدود. | Auto-identique | — | Oui |
| `/ar/over-2-5/predictions/today` | توقعات Over 2.5 اليومتوقعات Over 2.5 اليوم | `توقعات Over 2.5 اليوم \| BTTSPredict` | توقعات أكثر من 2.5 هدف للمباريات الدولية، مع تحليل إحصائي وتحديثات يومية. لا توجد ضمانات للنتائج. 18+. | Auto-identique | HL9 | Oui |
| `/ar/politique-confidentialite` | سياسة الخصوصية | `سياسة الخصوصية \| BTTSPredict` | سياسة الخصوصية في BTTSPredict. | Auto-identique | — | Oui |
| `/ar/resultats-verifies` | نتائج التوقعات الموثقةنتائج التوقعات الموثقة | `نتائج التوقعات الموثقة \| BTTSPredict` | نتائج توقعات موثقة وبيانات مؤرخة ومنهجية شفافة. | Auto-identique | — | Oui |
| `/ar/statistiques` | — | `إحصائيات التوقعات \| BTTSPredict` | إحصائيات توقعات موثقة من BTTSPredict. | Auto-identique | — | Oui |
| `/ar/vip` | افتح وصولك إلى VIP في 4 خطوات واضحةافتح وصولك إلى VIP في 4 خطوات واضحة | `مكتب تحليل VIP لتوقعات BTTS \| BTTSPredict` | تحليل خاص لتوقعات BTTS وأكثر من 2.5 والنتيجة الدقيقة للمباريات الدولية. | Auto-identique | — | Oui |

### Hreflang — valeurs exactes des groupes

- **HL1 — Accueil** (`/`, `/en`, `/ar`) : `fr=https://bttspredict.com`; `en=https://bttspredict.com/en`; `ar=https://bttspredict.com/ar`; `x-default=https://bttspredict.com`.
- **HL2 — Score exact FR** (`/ai-correct-score-predictions`) : `fr=https://bttspredict.com/ai-correct-score-predictions`; `en=https://bttspredict.com/en/ai-correct-score-predictions`; `ar=https://bttspredict.com/ar/ai-correct-score-predictions`; `x-default=https://bttspredict.com/en/ai-correct-score-predictions`.
- **HL3 — Score exact EN/AR** (`/en/ai-correct-score-predictions`, `/ar/ai-correct-score-predictions`) : `fr-SN=https://bttspredict.com/ai-correct-score-predictions`; `en=https://bttspredict.com/en/ai-correct-score-predictions`; `ar=https://bttspredict.com/ar/ai-correct-score-predictions`; `x-default=https://bttspredict.com/ai-correct-score-predictions`.
- **HL4 — Bonus 888Starz** (`/bonus-888starz`, `/en/bonus-888starz`, `/ar/bonus-888starz`) : `fr=https://bttspredict.com/bonus-888starz`; `en=https://bttspredict.com/en/bonus-888starz`; `ar=https://bttspredict.com/ar/bonus-888starz`; `x-default=https://bttspredict.com/bonus-888starz`.
- **HL5 — Campagne 888Starz** (`/bonus-888starz-btts221`, `/en/bonus-888starz-btts221`, `/ar/bonus-888starz-btts221`) : `fr=https://bttspredict.com/bonus-888starz-btts221`; `en=https://bttspredict.com/en/bonus-888starz-btts221`; `ar=https://bttspredict.com/ar/bonus-888starz-btts221`; `x-default=https://bttspredict.com/bonus-888starz-btts221`.
- **HL6 — BTTS du jour** (`/btts/predictions/today`, `/en/btts/predictions/today`, `/ar/btts/predictions/today`) : `fr=https://bttspredict.com/btts/predictions/today`; `en=https://bttspredict.com/en/btts/predictions/today`; `ar=https://bttspredict.com/ar/btts/predictions/today`; `x-default=https://bttspredict.com/btts/predictions/today`.
- **HL7 — 1xBet** (`/code-promo-1xbet`, `/en/code-promo-1xbet`, `/ar/code-promo-1xbet`) : `fr=https://bttspredict.com/code-promo-1xbet`; `en=https://bttspredict.com/en/code-promo-1xbet`; `ar=https://bttspredict.com/ar/code-promo-1xbet`; `x-default=https://bttspredict.com/code-promo-1xbet`.
- **HL8 — Melbet** (`/code-promo-melbet`, `/en/code-promo-melbet`, `/ar/code-promo-melbet`) : `fr=https://bttspredict.com/code-promo-melbet`; `en=https://bttspredict.com/en/code-promo-melbet`; `ar=https://bttspredict.com/ar/code-promo-melbet`; `x-default=https://bttspredict.com/code-promo-melbet`.
- **HL9 — Over 2.5 du jour** (`/over-2-5/predictions/today`, `/en/over-2-5/predictions/today`, `/ar/over-2-5/predictions/today`) : `fr=https://bttspredict.com/over-2-5/predictions/today`; `en=https://bttspredict.com/en/over-2-5/predictions/today`; `ar=https://bttspredict.com/ar/over-2-5/predictions/today`; `x-default=https://bttspredict.com/over-2-5/predictions/today`.
- **HL10 — Linebet, page FR seulement** (`/code-promo-linebet-senegal`) : `fr=https://bttspredict.com/code-promo-linebet-senegal`; `en=https://bttspredict.com/en/code-promo-linebet-senegal`; `ar=https://bttspredict.com/ar/code-promo-linebet-senegal`; `x-default=https://bttspredict.com/code-promo-linebet-senegal`. Les pages EN/AR ne déclarent pas d’hreflang.
- Toutes les autres routes du tableau ont `hreflang` absent.

Les 19 équivalences de langue existent comme routes localisées et comme variantes du sitemap : `/`, `/ai-correct-score-predictions`, `/bonus-888starz`, `/bonus-888starz-btts221`, `/btts-and-over-2-5-predictions-today`, `/btts/predictions/today`, `/cgu`, `/code-promo-1xbet`, `/code-promo-linebet-senegal`, `/code-promo-melbet`, `/historique`, `/jouer-responsable`, `/mentions-legales`, `/methodologie`, `/over-2-5/predictions/today`, `/politique-confidentialite`, `/resultats-verifies`, `/statistiques`, `/vip`. L’existence de l’équivalence déclarée par le sitemap ne signifie pas que les balises hreflang HTML sont présentes ou réciproques.

### Pages SEO protégées

Les cinq URL suivantes sont explicitement protégées. Les valeurs précises sont celles des lignes correspondantes dans les tableaux, et ne doivent pas être modifiées sans validation préalable :

1. `/en/btts-and-over-2-5-predictions-today` — title `BTTS and Over 2.5 Predictions Today | BTTSPredict`, description `Combined BTTS and Over 2.5 predictions for international matches.`, canonical auto-identique, aucun hreflang.
2. `/en` — title `BTTS Predictions Today & Over 2.5 | BTTSPredict`, description `BTTS, Over 2.5 and correct-score analysis, published before kick-off and tracked to the verified result.`, canonical auto-identique, HL1.
3. `/en/over-2-5/predictions/today` — title `Over 2.5 Predictions Today — Goal Analysis | BTTSPredict`, description `Over 2.5 goals predictions for international football matches, with statistical analysis and daily updates. No future result is guaranteed. 18+.`, canonical auto-identique, HL9.
4. `/` — title `BTTSPredict — Pronostics BTTS du jour et Over 2,5`, description `Pronostics BTTS du jour sur des matchs internationaux, avec sélections horodatées, historique public et méthode documentée. 18+.`, canonical `https://bttspredict.com`, HL1.
5. `/en/ai-correct-score-predictions` — title `AI Correct Score Predictions — Exact Scores | BTTSPredict`, description `Exact-score probabilities calculated with a Poisson model. Statistical estimates, not guarantees. 18+.`, canonical auto-identique, HL3.

## 7. Gabarit des 864 pages de match

Le build local contient 288 slugs uniques exportés en FR, EN et AR, soit **864 fichiers HTML** : 288 sous chacun de `out/match/`, `out/en/match/` et `out/ar/match/`. Les pages match ne sont pas incluses dans le sitemap et n’ont pas de hreflang.

- **URL :** `https://bttspredict.com/match/{slug}`, `https://bttspredict.com/en/match/{slug}`, `https://bttspredict.com/ar/match/{slug}`. Les trois variantes d’un slug partagent les données du match.
- **Langues :** HTML initial racine `lang="fr"`, `dir` absent pour les trois variantes ; script client règle la racine EN `lang=en/dir=ltr`, AR `lang=ar/dir=rtl`. Un conteneur interne localisé existe aussi.
- **H1 observé :** `{domicile} vs {extérieur} · BTTS & Over 2.5` pour les trois variantes ; par exemple pour San Diego, `San Diego FC vs Seattle Sounders FC · BTTS & Over 2.5`.
- **Title FR :** `{domicile} vs {extérieur} BTTS MM/DD | BTTSPredict`, où `MM/DD` est la date courte. **Description FR :** `Pronostic BTTS et Over 2.5 : {domicile} vs {extérieur} ({ligue}, {date}). Analyse et résultat vérifié. 18+.`
- **Title EN :** `{domicile} vs {extérieur} BTTS | BTTSPredict`. **Description EN :** `BTTS and Over 2.5 analysis for {domicile} vs {extérieur}.`
- **Title AR :** `{domicile} ضد {extérieur} | BTTSPredict`. **Description AR :** `تحليل مباراة {domicile} ضد {extérieur} وتوقعات BTTS وOver 2.5.`
- **Canonical :** chaque variante canonise vers sa propre URL absolue.
- **Hreflang :** absent sur les pages match observées.
- **Sitemap :** les 864 URL ne sont pas incluses.

## 8. Risques, recommandations et validations futures

Aucune recommandation ci-dessous n’a été exécutée. Toutes les corrections restent en attente d’une décision du chef de projet.

| Sujet | Risque | Recommandation à soumettre | Validation nécessaire avant correction |
|---|---|---|---|
| 10 pages match 404 | Perte d’accès aux anciens HTML et risque de redirection non pertinente. | Choisir pour chaque slug entre page historique conservée ou destination réellement équivalente ; laisser la purge inchangée jusqu’à décision. | Reproduire les résultats du build après décision ; vérifier statut et contenu de chaque URL. |
| Page AR 403 | Match accessible en FR/EN mais inaccessible en AR. | Examiner le fichier réellement déployé, permissions et règles d’accès d’hébergement. | Confirmer le correctif avec statut HTTP 200 sur la variante AR, sans altérer FR/EN. |
| Métadonnées 404 | `noindex` et `index, follow` contradictoires. | Définir une directive robots unique pour les HTML d’erreur. | Contrôler `out/404.html` et `out/_not-found.html` après build, ainsi que leur code de statut. |
| JSON d’archive | Le noindex de l’index HTML ne s’étend pas aux fichiers JSON. | Décider si les JSON doivent être indexables ; si non, évaluer une règle HTTP adaptée. | Vérifier les en-têtes de plusieurs JSON et l’accès crawler, sans bloquer la page d’index si elle doit rester crawlable. |
| `hreflang` / `lang` / `dir` | Signal initial de langue incohérent et alternates manquants/asymétriques. | Définir les paires réellement équivalentes et harmoniser HTML et sitemap dans une tâche SEO approuvée. | Vérifier le HTML avant JavaScript, le DOM après script, la réciprocité des alternates, les canonicals et le RTL. |
| Route EN statistiques | Risque de créer une route sans contenu ni demande établis. | Maintenir le statut non pris en charge jusqu’à décision éditoriale. | Ne créer que si la demande, le contenu et la traduction sont validés. |
| Sitemap et pages protégées | Changement accidentel de canonicals, alternates ou pages classées. | Ne rien ajouter/supprimer et ne toucher à aucune métadonnée protégée sans validation. | Comparer URL, title, description, H1, canonical, hreflang, sitemap et contenu protégé avant/après. |

## 9. Contrôles réellement effectués

- Lecture des règles et sources : `src/lib/matches.ts`, `src/app/match/[slug]/page.tsx`, `src/app/[locale]/match/[slug]/page.tsx`, `scripts/prune-archives.mjs`, `public/.htaccess`, `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/app/not-found.tsx`, `public/404.html`, `public/predictions-archive/index.html`, `public/robots.txt`, `src/app/sitemap.ts`.
- Inspection de l’export statique local : les 11 slugs, les HTML match, les 64 routes éditoriales, les métadonnées d’erreur, le sitemap de 61 URL et les archives.
- Requêtes HTTP GET publiques : les dix 404, le 403 arabe, les variantes FR/EN/AR de comparaison, une autre page match AR, la page d’index d’archive, des JSON d’archive et `/en/over-2-5/statistics`.
- **Aucun** `npm run build`, `npm test`, `npx tsc --noEmit` ou `npm run lint` n’a été relancé pendant ce diagnostic ; aucun fichier applicatif n’a été modifié. La vérification finale de fichiers et du commit local documentaire relève de la mission de centralisation, pas de la Phase 1.

## 10. Sources et décisions en attente

Source audit détaillée : `docs/project/BTTSPREDICT_AUDIT_COMPLET.md`, sections 3–10 et annexe B. Sources et lignes pertinentes : `src/lib/matches.ts:182–255`; `src/app/match/[slug]/page.tsx`; `src/app/[locale]/match/[slug]/page.tsx`; `scripts/prune-archives.mjs` (`KEEP = 90`); `public/.htaccess:32–55`; `src/app/layout.tsx:71–81, 130–145`; `src/app/[locale]/layout.tsx:21–24`; `src/app/not-found.tsx`; `public/404.html`; `public/predictions-archive/index.html`; `public/robots.txt`; `src/app/sitemap.ts`.

**En attente de décision du chef de projet :** politique des pages match historiques ; accès à faire diagnostiquer pour le 403 hébergé ; directive robots des pages d’erreur ; indexation éventuelle des JSON ; corrections des attributs initiaux et des hreflang ; tout changement éventuel au sitemap ou aux trois URL qui en sont absentes.

**Statut final de Phase 1 : diagnostic livré, corrections non commencées. Aucune action suivante ne doit modifier le code avant analyse et instruction explicite du chef de projet.**
