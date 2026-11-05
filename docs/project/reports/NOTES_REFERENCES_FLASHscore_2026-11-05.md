# Repères visuels Flashscore France — 5 novembre 2026

Ces notes servent à adapter l’ergonomie de BTTSPredict à partir de principes de hiérarchie, sans cloner Flashscore, son logo, ses textes, ses données, ses cotes ni ses offres. Les observations viennent de pages publiques réellement ouvertes; les surfaces dynamiques ou bloquées sont signalées comme telles.

## Navigation mobile et accueil sportif

La page mobile consultée présente un en-tête/lien d’accueil, une rangée horizontale de sports, des filtres temporels et de vue (tous, en direct, terminés, cotes), puis un flux de matchs groupés par compétition avec des accès aux classements. La version mobile annonce des différences techniques avec le site complet. Source ouverte : [m.flashscore.fr](https://m.flashscore.fr/).

Le menu plein écran, ses paramètres/connexion, ses ligues épinglées et sa navigation basse ne sont pas confirmés sur la surface mobile actuelle. La capture du propriétaire montre ce pattern, mais la page mobile inspectée ne permet pas de valider que Flashscore le sert aujourd’hui. Pour BTTSPredict, reprendre l’idée d’une hiérarchie courte (sport → filtres → compétitions → événements), et non présumer d’un menu identique.

## Fiche match, cotes et bookmakers

Une page d’équipe et une fiche « cotes » ont été ouvertes, mais le consentement et le rendu dynamique ont masqué le contenu nécessaire. Les rangées de bookmakers, marchés, CTA et cartes d’offre ne sont donc pas vérifiés comme comportements actuels de Flashscore. Sources : [France — équipe](https://www.flashscore.fr/equipe/france/QkGeVG1n/) et [Italie–France — cotes](https://www.flashscore.fr/match/football/italie-hlKvieGH/france-QkGeVG1n/cotes/).

Pour BTTSPredict, conserver une hiérarchie lisible : information du match, marché principal, marchés secondaires séparés, liens bookmaker intégrés aux cartes et attribution claire. Les promotions doivent rester visuellement séparées des données sportives.

## Bannières, bonus et popups

La page d’accueil ouverte montre un emplacement publicitaire générique marqué « AD », séparé de la navigation et des résultats. La rubrique Bonus est accessible, mais indiquait que son contenu n’était pas disponible dans la région; aucun bonus bookmaker ni popup dynamique n’a été vérifié. Sources : [accueil Flashscore France](https://www.flashscore.fr/) et [rubrique bonus](https://www.flashscore.fr/paris-sportifs/promos-bonus/).

Adaptation autorisée pour BTTSPredict : bloc partenaire identifié comme publicité/affiliation, séparé du contenu éditorial; popup discret, non bloquant, fermable et consacré uniquement à 1xBet avec le lien affilié déjà approuvé. La seule affirmation autorisée est « bonus propriétaire 300% worldwide »; aucune mention de tours gratuits, dépôt, seuil, date ou condition non confirmée.

## Actualités

Le flux Actualités présente une carte principale illustrée, des cartes secondaires plus compactes, puis des fils d’actualité par sport; l’interface desktop observée utilise une hiérarchie éditoriale distincte et une colonne « plus lus ». La page d’article expose un titre, signature/temps, image avec légende/crédit, fil d’Ariane et liens vers statistiques/match. Sources : [Actualités](https://www.flashscore.fr/actualites/) et [article consulté](https://www.flashscore.fr/actualites/erling-haaland-offre-la-victoire-a-manchester-city-a-leipzig/WYaun1le/).

Pour BTTSPredict, employer des cartes éditoriales originales reliées explicitement à la rencontre, avec titre, vignette autorisée et attribution seulement quand vérifiée. L’affichage mobile et les actualités directement intégrées à une fiche match n’ont pas été confirmés. [Une fiche match associée](https://www.flashscore.fr/match/football/chine-fgvmOPrL/france-ShmZavVI/) n’a fourni qu’un rendu partiel.

## Compositions et évaluations

La page Compos a été ouverte mais son contenu dynamique ne s’est pas rendu de manière inspectable. Un article Flashscore explique que les évaluations individuelles apparaissent dans l’onglet Compos après le match et reposent sur des statistiques et facteurs propres à Flashscore; il ne confirme pas une moyenne collective au-dessus des notes individuelles. Sources : [page Compos consultée](https://www.flashscore.fr/match/football/eindhoven-YJaj0Opm/venlo-UNA6IKFC/resume/compositions/) et [article sur les notes](https://www.flashscore.fr/actualites/football-ligue-1-flashscore-lance-les-notes-des-joueurs-de-football/Ymb2YnNq/).

Pour BTTSPredict, toute vue terrain doit utiliser des données et visuels autorisés, indiquer sa vraie source/méthode et offrir une alternative de liste accessible. Ne pas présenter une note BTTSPredict comme une note Flashscore ou une donnée officielle.

## Limites de la référence

Les observations réellement confirmées sont l’organisation de la page mobile, la séparation générique de l’espace publicitaire, la hiérarchie du flux éditorial et les éléments descriptifs de l’article sur les notes. Les détails des marchés de cotes et bonus, le popup, le menu plein écran actuel et le rendu des compositions n’ont pas été vérifiés visuellement. Les captures fournies par le propriétaire sont des repères de conception, pas une preuve du comportement actuel du site.

## Couleurs CSS et typographie mesurées sur Flashscore.fr

La page officielle [Flashscore.fr](https://www.flashscore.fr/) a répondu HTTP 200 lors d’une inspection Chromium; sa sortie HTML extraite par le lecteur public affiche une page dynamique en chargement. Sur le rendu desktop, les styles calculés indiquent : fond du `body` `rgb(238, 238, 238)` (`#EEEEEE`), texte principal `rgb(0, 30, 40)` (`#001E28`), fond de l’en-tête `#001E28`, fond de l’élément de navigation actif `rgb(0, 20, 30)` (`#00141E`) et fond d’un bouton de navigation `rgb(15, 45, 55)` (`#0F2D37`). Le `body` utilise `LivesportFinderLatin, "Adjusted Arial Fallback", Arial, sans-serif`; `LivesportFinderLatin` est effectivement chargé en graisses 400, 700 et 800. Les fichiers de police observés avec une réponse HTTP 200 sont [LivesportFinderLatin-Regular_Static.woff2](https://static.flashscore.com/res/font/LivesportFinderLatin-Regular_Static.woff2), [LivesportFinderLatin-Bold_Static.woff2](https://static.flashscore.com/res/font/LivesportFinderLatin-Bold_Static.woff2) et [LivesportFinderLatin-Extrabold.woff2](https://static.flashscore.com/res/font/LivesportFinderLatin-Extrabold.woff2). `Adjusted Arial Fallback` était en erreur et `FS_Numbers` ainsi que `Flashscore_FlashDisplay` étaient déclarées mais non chargées sur la vue testée; elles ne sont donc pas retenues comme la police du texte courant. Mesures faites uniquement comme références techniques; ne pas copier le logo, les textes, offres ou données de Flashscore.

### Surfaces desktop/mobile et licence typographique

Une seconde mesure Chromium de `https://www.flashscore.fr/` à 1440×900 et 390×844 a confirmé le même fond `#EEEEEE` et la même pile de police sur les deux formats. Les éléments publics visibles incluaient un fond blanc `#FFFFFF` pour la zone des filtres et le flux de compétitions, un en-tête de compétition bleu très pâle `#EEF7FF`, un fond d’en-tête `#001E28`, un onglet actif d’en-tête `#00141E` et un bouton d’en-tête `#0F2D37`. Les trois fichiers WOFF2 ci-dessus étaient chargés dans les deux formats. L’onglet actif rouge de BTTSPredict reste une préférence distincte explicitement maintenue par le propriétaire.

La page de [Black[Foundry] consacrée à Livesport](https://black-foundry.com/case-studies/livesport/) décrit Finder comme une police créée pour les interfaces de Livesport et indique qu’un accord de licence a permis son déploiement sur les médias numériques de Livesport. La [page des conditions d’utilisation de Livesport](https://www.livesport.eu/terms-of-use/en) contient des restrictions de réutilisation des contenus de l’application sans consentement explicite; elle ne constitue pas à elle seule une licence ou une analyse juridique de la police web. La recherche ciblée n’a pas trouvé de licence publique indépendante autorisant BTTSPredict à redistribuer ou à charger cette fonte. Ne pas intégrer ni hotlinker les WOFF2 avant confirmation d’une licence adaptée; une alternative ouverte doit être présentée comme approximation, pas comme la police exacte.
