# MANDAT DE REPRISE — GLM PREND LA DIRECTION DE BTTSPREDICT
## Passation produit, technique, artistique et opérationnelle
**Date : 15 novembre 2026**  
**Dépôt :** `prophete221/bttspredict`  
**Production :** https://bttspredict.com  
**Document de référence :** mandat de reprise globale — priorité absolue à la refonte générale avant tout chantier VIP.

---

# 0. MESSAGE DIRECT À GLM : TU REPRENDS LA DIRECTION

GLM,

Tu ne reçois pas ici une petite demande de retouches CSS ni une mission de maquettage isolée. Tu es mandaté pour reprendre BTTSPredict comme son **fondateur produit et directeur technique de fait** : tu dois penser comme la personne qui porte la vision du produit, qui en connaît les utilisateurs, qui protège son activité et qui assume la cohérence de chaque écran.

Le propriétaire du dépôt reste le propriétaire du projet. Mais, pour cette mission, tu dois agir avec l'exigence, la responsabilité et la vision d'un fondateur : ne pas attendre qu'on te dicte chaque bouton, chaque carte ou chaque page. Tu analyses, tu proposes une architecture cohérente, tu prends les décisions de conception nécessaires, tu réalises la refonte complète, tu testes, tu vérifies la production et tu rends compte avec des preuves.

**Le résultat attendu n'est pas “un peu plus joli”. Le résultat attendu est un BTTSPredict qui donne immédiatement l'impression d'une vraie plateforme internationale d'analyse football, simple, fiable, premium, moderne et cohérente sur mobile comme sur ordinateur.**

Le propriétaire a déjà été déçu par plusieurs cycles de travail qui annonçaient une refonte, mais où il retrouvait encore les anciennes couleurs, les anciennes cartes, les mêmes compositions et les mêmes pages surchargées. Ne répète pas ce cycle. Ne confonds jamais un commit, une PR verte ou un build réussi avec une refonte visuelle réellement achevée.

Tu dois prendre connaissance de tout ce document avant de toucher au code.

# 1. OBJECTIF PRODUIT — CE QUE BTTSPREDICT DOIT DEVENIR

BTTSPredict est une plateforme de pronostics et d'analyses football centrée sur les marchés BTTS (les deux équipes marquent) et Over 2.5, avec des analyses, des scores exacts, des sélections et des espaces gratuits/premium.

La plateforme doit devenir :
- immédiatement compréhensible par un visiteur qui arrive pour la première fois ;
- visuellement premium, sobre et crédible, sans ressembler à un blog, un template générique ou un tableau de bord bricolé ;
- rapide à parcourir : le visiteur doit savoir où cliquer sans réfléchir ;
- centrée sur les matchs, les analyses et les données, pas sur des paragraphes marketing interminables ;
- cohérente sur toutes les pages, pas seulement sur la page d'accueil ;
- réellement mobile-first, puis parfaitement adaptée aux grands écrans ;
- disponible en français, anglais et arabe, avec une vraie gestion RTL pour l'arabe ;
- accessible, lisible, performante et techniquement maintenable.

## 1.1 Direction artistique obligatoire

La référence d'ambiance demandée est l'interface de ChatGPT : fond très sombre/noir, surfaces sobres, hiérarchie typographique nette, composants précis, espaces respirants, navigation évidente et accent couleur utilisé avec retenue. Il ne s'agit pas de copier le produit ChatGPT ni son identité ; il s'agit de reprendre les qualités d'interface : simplicité, calme visuel, cohérence, lisibilité et absence de bruit.

Direction proposée à appliquer et à formaliser dans un vrai design system :
- fond global noir très profond / graphite, avec des nuances sombres maîtrisées ;
- surfaces et cartes légèrement différenciées du fond, sans empilement de panneaux inutiles ;
- texte principal blanc cassé et texte secondaire gris lisible ;
- bleu froid / bleu électrique maîtrisé comme accent principal de marque et d'interaction ;
- états positifs, négatifs et avertissements avec des couleurs fonctionnelles et limitées ;
- **suppression complète des anciens accents vert lime** et des fonds verts hérités lorsqu'ils ne représentent pas un état métier explicite ;
- pas de dégradés criards, pas de glow décoratif partout, pas de néons, pas de couleurs concurrentes ;
- bordures fines, rayons cohérents, ombres très discrètes ;
- typographie moderne, tailles, poids, interlignages et espacements systématiques ;
- icônes cohérentes, même famille, même épaisseur ;
- animations courtes et utiles seulement, jamais au détriment de la vitesse ou de l'accessibilité.

Le noir doit être la base de l'expérience, pas un simple thème ajouté à quelques composants. Les anciennes règles CSS et les variantes visuelles contradictoires doivent être identifiées et éliminées progressivement, après vérification de leurs dépendances.

## 1.2 Une interface qui ne perd jamais le visiteur

La navigation doit être courte, prévisible et stable. Le visiteur doit pouvoir répondre en quelques secondes à ces questions :
1. Où voir les pronostics du jour ?
2. Où consulter les analyses BTTS et Over 2.5 ?
3. Où trouver les scores exacts / autres marchés disponibles ?
4. Où comprendre la méthode et les statistiques ?
5. Où trouver les offres et informations commerciales ?
6. Comment accéder à l'espace VIP, sans que celui-ci envahisse la navigation ?

Sur mobile, viser une navigation compacte et évidente. La direction précédemment demandée est une barre basse avec seulement les destinations principales **ACCUEIL / PRONOSTICS / VIP**, complétée si nécessaire par un menu secondaire propre. Ne pas ajouter cinq ou six onglets dans la barre basse. Sur desktop, utiliser une navigation horizontale compacte et lisible ; ne pas réintroduire une sidebar encombrante si elle n'apporte pas une vraie valeur.

Ne pas multiplier les CTA, les bandeaux, les popups, les blocs de texte, les badges ou les sections répétitives. Une action principale par zone suffit.

# 2. HISTORIQUE ET RAISONS DE LA REPRISE

Le dépôt a connu plusieurs tentatives de refonte et plusieurs branches de travail. Le problème signalé de manière répétée par le propriétaire est que les changements annoncés ne se traduisaient pas, à ses yeux, par une transformation complète et évidente du site en production.

Historique connu à prendre en compte :
- des travaux de refonte ont été menés dans les PR #136, #137 et #138 ;
- la PR #138, intitulée autour de la reconstruction de l'interface, a été fusionnée dans `main` le 15 novembre 2026 ; son commit de tête connu est `5fb08efea2b137319d22f712e53719cf732adca1` ;
- ces travaux annonçaient notamment une refonte du Hero, des cartes, de la navigation desktop, de sections de la page d'accueil, de surfaces Over 2.5 / scores exacts, de couleurs et d'éléments responsive ;
- malgré ces travaux, le propriétaire a encore exprimé son insatisfaction : il ne veut plus retrouver les anciens fonds, les anciennes couleurs, les anciennes cartes, les anciennes compositions ni les pages de pronostics encombrées ;
- une branche et une PR d'audit GLM ont été préparées : PR #139, branche `docs/glm-audit-2026-11-15`, dossier `docs/audit-glm-2026-11-15/`. Cette PR est documentaire et n'est pas à confondre avec des corrections déjà réalisées ;
- l'audit GLM est utile mais essentiellement statique : il ne constitue pas une validation visuelle complète en navigateur ni une preuve que toutes les pages en production sont réellement refondues.

**Conséquence : tu dois repartir d'un constat vérifié, pas d'une affirmation selon laquelle la refonte précédente serait terminée.** Examine le `main` actuel, les PR et commits récents, puis le rendu réel en production. Si une page garde l'ancien design, elle doit être refondue réellement, même si un composant partagé a déjà reçu une mise à jour.

Ne fais pas de refonte cosmétique en ajoutant encore une couche CSS au-dessus de l'ancien système. Définis une direction globale et migre les pages vers celle-ci, en supprimant les styles hérités devenus inutiles quand leur suppression est sûre.

# 3. PÉRIMÈTRE DE LA REFONTE GÉNÉRALE

La mission couvre l'expérience publique entière, pas uniquement le Hero de la page d'accueil.

## 3.1 Inventaire obligatoire des pages

Avant les modifications, établis un inventaire exhaustif depuis le routeur et le dépôt. Vérifie au minimum :
- accueil dans les trois langues ;
- pages de pronostics du jour et listes de matchs ;
- pages BTTS ;
- pages Over 2.5 ;
- pages de scores exacts ;
- pages de détail d'un match / analyse, si présentes ;
- tableaux de bord et pages statistiques accessibles publiquement ;
- pages de méthode, FAQ et explications ;
- pages promotionnelles / bookmakers ;
- pages de téléchargement APK ou application, si présentes ;
- pages de politique, conditions, jeu responsable et contact ;
- pages d'erreur, états vides, chargement et absence de matchs ;
- toutes les variantes localisées FR / EN / AR.

Pour chaque route, consigne : objectif utilisateur, état actuel, composants partagés, problème visuel, contenu inutile, actions attendues, comportement mobile, comportement desktop, langue/RTL, tests requis. N'oublie aucune page simplement parce qu'elle n'est pas dans le menu principal.

## 3.2 Accueil

Créer une vraie page d'accueil de plateforme :
- Hero compact, fort et immédiatement compréhensible ;
- promesse claire, sans slogan artificiellement gonflé ;
- mise en avant des marchés principaux et de l'accès aux pronostics ;
- cartes de matchs et d'analyses réellement nouvelles ;
- sections organisées selon l'importance pour le visiteur ;
- statistiques uniquement si elles sont exactes, contextualisées et vérifiables ;
- éléments de confiance et méthode présentés avec sobriété ;
- CTA principal évident ;
- footer utile, pas un mur de liens.

Le Hero ne doit pas prendre tout l'écran sur mobile ni repousser les pronostics loin sous la ligne de flottaison. Il doit être digne d'une plateforme mature, pas d'une landing page publicitaire.

## 3.3 Cartes de matchs et de pronostics — refonte complète

Les cartes actuelles doivent être évaluées sans complaisance. Si elles ressemblent encore à des anciennes cartes, il faut les remplacer par un vrai nouveau système de composants.

Créer des cartes modernes, compactes, très lisibles et structurées autour des informations réellement utiles :
- équipes et identités visuelles disponibles ;
- compétition et heure/date locale clairement identifiées ;
- marché analysé (BTTS, Over 2.5, score exact, etc.) ;
- sélection / résultat prédit, avec libellé sans ambiguïté ;
- probabilité ou niveau de confiance seulement si la donnée existe et si sa signification est définie ;
- cote uniquement si elle provient d'une source réelle et si elle est à jour ;
- accès au détail de l'analyse avec une action claire ;
- état du match et statut du pronostic, sans ambiguïté.

Ne jamais inventer une probabilité, une cote, un badge de fiabilité ou une statistique pour rendre une carte plus impressionnante. Ne pas afficher une carte comme validée si le calcul ou les données ne le justifient pas.

Prévoir des variantes cohérentes : carte compacte de liste, carte mise en avant, carte de détail, état live/terminé si pris en charge. Elles doivent partager le même langage visuel, pas être des composants qui semblent provenir de trois sites différents.

Les cartes ne doivent pas être énormes, trop arrondies, saturées de badges, surchargées de texte ou noyées dans des fonds verts. Priorité à la lecture instantanée.

## 3.4 Pages de pronostics

Réduire radicalement le bruit visuel :
- titre et contexte utiles ;
- filtres simples, compréhensibles et réellement fonctionnels ;
- liste de matchs claire ;
- séparation logique par date ou marché si cela aide ;
- informations essentielles visibles sans ouvrir chaque carte ;
- détail accessible en un geste ;
- états vides utiles ;
- pas de longs textes génériques répétés avant les matchs ;
- pas de blocs SEO qui dégradent l'expérience au-dessus du contenu principal.

Le contenu SEO existant doit être préservé dans son intention et sa valeur, mais son emplacement et sa présentation peuvent être réorganisés prudemment. Ne supprime pas un contenu indexé ou une section performante sans mesure, justification et plan de remplacement.

## 3.5 Pages de détail

Une page de détail doit répondre rapidement à :
- quel match est analysé ?
- quel marché est concerné ?
- quelle est la sélection ?
- quelles données soutiennent l'analyse ?
- quelles sont les limites / incertitudes ?
- où trouver les autres marchés ou matchs associés ?

Éviter les pavés, répétitions, tableaux illisibles et fausses précisions. Mettre les données avant le discours.

## 3.6 Pages promotionnelles

Les pages promo doivent inspirer confiance et être cohérentes avec le reste du produit :
- présentation simple, honnête et professionnelle ;
- offre, code et conditions clairement séparés ;
- CTA unique et fonctionnel ;
- aucun faux compteur, faux avis, fausse urgence, promesse inventée ou badge non justifié ;
- pas de design qui ressemble à un bot, à un template d'affiliation ou à une page de spam ;
- version mobile soignée ;
- traductions cohérentes.

Les informations contractuelles, codes, URLs, paramètres de tracking et identifiants affiliés sont protégés. Ne change aucune donnée commerciale sans validation explicite du propriétaire.

# 4. IDENTITÉ, MARQUE ET LANGUES

Respecter la marque et ses éléments existants :
- BTTSPredict est le nom de la plateforme ;
- la ligne de marque demandée est « Plateforme N°1 Mondiale » et « BTTS & Over 2.5 Master » ; vérifier le contexte exact avant de l'afficher partout et ne pas transformer une affirmation marketing en preuve statistique ;
- Vision221 est un code promotionnel Linebet, pas le nom de la plateforme ;
- ne pas mélanger les identités de marque, les codes promo et les noms des partenaires.

Les langues FR / EN / AR doivent être traitées comme des versions de produit à part entière :
- aucun texte oublié ou langue mélangée ;
- pas de chaînes brutes de traduction ;
- arabe en RTL réel, y compris navigation, alignement, icônes directionnelles, cartes, menus, formulaires et responsive ;
- les chiffres, dates et heures doivent rester lisibles ;
- ne pas casser les URLs localisées existantes.

# 5. PROTECTIONS ABSOLUES — CE QUI NE DOIT PAS ÊTRE CASSÉ

La refonte visuelle ne donne pas le droit de modifier le métier ou de casser les systèmes existants.

## 5.1 SEO et URLs — zone hautement protégée

Le site possède déjà des pages qui se positionnent sur Google. Le propriétaire a explicitement demandé de ne pas casser leurs titres, URLs et éléments SEO fonctionnels.

Protéger impérativement :
- toutes les routes publiques existantes ;
- les slugs et redirections ;
- titres SEO, meta descriptions, canonicals ;
- hreflang, sitemap, robots, données structurées ;
- liens internes et maillage ;
- contenu et signaux des pages qui génèrent déjà des impressions/clics.

URL particulièrement importante à préserver exactement :
`/en/btts-and-over-2-5-predictions-today`

Le propriétaire a signalé que cette page se positionnait très bien sur des requêtes anglaises liées à « sure btts and over 2.5 today ». Ne pas renommer, supprimer, rediriger, réécrire le title ou dégrader son contenu sans audit et autorisation explicite.

Le propriétaire a partagé des données Search Console historiques : environ 367 clics, 3,75 k impressions, CTR 9,8 %, position moyenne 57,3 sur une période de trois mois. Ces chiffres sont un contexte historique, pas des statistiques actuelles à afficher. Vérifier les données récentes si l'accès est disponible.

Toute modification SEO doit être documentée route par route et accompagnée de tests de non-régression. La priorité de cette mission est la refonte de l'expérience, pas une réécriture SEO.

## 5.2 Moteur de pronostics, données et historique

Ne pas changer sans autorisation :
- algorithmes de prédiction ;
- modèles, prompts, règles et paramètres de génération ;
- données des matchs, résultats, historiques et archives ;
- formats JSON et contrats entre scripts, API et interface ;
- pipeline de génération, enrichissement et validation ;
- seuils et règles métier ;
- sources de données et mécanismes de fallback.

L'interface peut être reconstruite autour de ces données, mais elle doit consommer les contrats existants correctement. Toute anomalie métier doit être isolée, reproduite, documentée et proposée séparément avant correction si elle touche aux résultats historiques ou à la logique de prédiction.

## 5.3 VIP — explicitement hors périmètre de réalisation immédiat

Le propriétaire a demandé de remettre le chantier VIP à plus tard. Pendant la refonte générale :
- ne pas refaire le parcours VIP ;
- ne pas modifier les prix, règles d'accès, validations, paiements, dépôts, preuves ou approbations ;
- ne pas modifier le worker VIP, D1, API, Telegram, stockage ou secrets ;
- ne pas changer les textes contractuels VIP ou les conditions ;
- ne pas modifier les algorithmes ni les sélections VIP ;
- ne pas toucher aux mécanismes d'accès, de renouvellement ou d'expiration.

Le VIP doit seulement être conservé, protégé et intégré visuellement au design system dans la mesure où cela ne modifie pas sa logique. Toute anomalie VIP découverte doit être consignée dans une liste séparée « chantier VIP après refonte », sans la corriger maintenant, sauf faille critique qui met immédiatement des données ou des personnes en danger : dans ce cas, arrêter et demander une décision au propriétaire.

Contexte VIP à ne pas perdre pour le futur chantier : le parcours actuel demande notamment un identifiant Telegram, un identifiant de compte bookmaker et une capture de preuve de dépôt ; l'interface évoque un dépôt minimum de 3 $ et une suppression des preuves sous 7 jours. Ces éléments sont sensibles et doivent être vérifiés dans le code avant toute future modification. Ils ne doivent pas être repris comme texte marketing ni changés pendant la mission présente.

## 5.4 Affiliations, promotions et tracking

Protéger tous les codes, domaines, identifiants, paramètres et destinations affiliés existants. Contexte connu :
- Linebet : code `VISION221`, domaine `lb-aff.com`, identifiant publicitaire historique `ad=22611` (un ancien lien APK a utilisé `ad=66803`) ;
- 1xBet : code `Vipbtts`, domaine `reffpa.com`, `ad=1599` ;
- Melbet : code `Bttswin`, domaine `refpa3665.com`, `ad=2170` ;
- 888Starz : code `btts221`, domaine `888ghta.com`.

Cette liste est un repère historique : relire les valeurs exactes dans le code avant de toucher aux liens. Ne jamais reconstruire une URL à partir de mémoire si la vraie URL existe déjà dans le dépôt.

Règles :
- ne pas remplacer ou supprimer les codes ;
- ne pas perdre les paramètres d'affiliation ;
- ne pas casser les CTA, redirections ou liens APK ;
- ne pas inventer de bonus, minimum de dépôt, tours gratuits, conditions de mise ou restrictions pays ;
- ne pas présenter Linebet comme réservé au Sénégal si le code et l'offre sont déclarés mondiaux ;
- toute modification de tracking doit être testée et comparée à la version précédente.

Les offres autorisées historiquement incluent les formulations « 300 % worldwide », cashback et bonus hebdomadaires, mais chaque affirmation doit être vérifiée dans les sources et les conditions actuelles. Ne pas dupliquer mécaniquement les mêmes bonus sur tous les partenaires.

## 5.5 Infrastructure et déploiement

Protéger :
- GitHub Actions et workflows ;
- configuration FTP et déploiement ;
- variables d'environnement et secrets ;
- API, Cloudflare Workers, D1 et stockage ;
- fichiers de configuration, build, dépendances et scripts ;
- tâches de génération et cron ;
- routes API utilisées par le site.

Ne jamais afficher, copier dans le code, publier ou demander des secrets. Ne pas changer les mécanismes de déploiement pour simplifier la refonte. Le déploiement doit suivre le pipeline existant, après validation et accord explicite.

# 6. CONSTATS DE L'AUDIT GLM À REPRENDRE AVEC RIGUEUR

La PR #139 contient un audit documentaire GLM dans `docs/audit-glm-2026-11-15/`. Lis les neuf documents avant d'intervenir :
- `00-rapport-complet.md`
- `01-architecture-et-fichiers.md`
- `02-erreurs-et-bugs.md`
- `03-design-et-experience.md`
- `04-pages-et-fonctionnalites.md`
- `05-securite-et-risques.md`
- `06-seo-et-performance.md`
- `07-plan-de-correction-propose.md`
- `08-tests-et-verifications.md`

PR #139 : https://github.com/prophete221/bttspredict/pull/139

L'audit a relevé ou suggéré plusieurs sujets à vérifier :
1. Historique des résultats et exclusions : le fichier `public/win-history.json` présentait 429 résultats gagnants sur 540 résultats retenus, soit 79,4 %. Ce ratio peut être trompeur si les exclusions ne sont pas exposées et expliquées. Ne pas présenter ce chiffre comme taux réel sans définir précisément le dénominateur et les règles d'exclusion.
2. `public/history-exclusions.json` contenait 546 entrées au moment de la vérification. Attention : l'affirmation de l'audit selon laquelle aucune entrée n'a de raison était trop générale ; 342 entrées comportaient un champ `reason` et 204 n'en avaient pas. Les tests interdisaient ce champ pour certains groupes de dates, pas pour toutes les entrées. Revalider les données actuelles.
3. Vérification d'âge : `src/components/bttsbet/AgeVerification.tsx` existe et utilise localStorage sur une durée de 24 h, mais il n'était pas importé dans le layout racine lors de la vérification. L'audit indique qu'il n'existe pas de contrôle global ; vérifier tous les points de montage avant de conclure.
4. Politique de confidentialité : la page `src/app/politique-confidentialite/page.tsx` ne semblait pas décrire certains traitements liés à GA4 et aux demandes VIP / preuves / worker / conservation. Le sujet est important, mais toute correction juridique doit être proposée et validée par le propriétaire, pas improvisée dans cette refonte.
5. Normalisation des noms d'équipes : `scripts/verify-results.mjs` retire notamment des termes génériques comme `fc`, `cf`, `united`, `city`, `club`, `real`. Le rapprochement flou qui en découle mérite des tests anti-collision. Ne pas modifier la logique de validation pendant la refonte UI sans autorisation.
6. Enrichissement VIP : `scripts/enrich_vip_candidates.py` contenait une instruction demandant de ne jamais copier le pick gratuit et, si le même marché est envisagé, de choisir le résultat opposé puis de l'évaluer indépendamment. C'est un sujet du futur chantier VIP, pas une correction à faire maintenant.
7. Le parcours VIP recueille des données sensibles et mentionne une suppression des preuves sous 7 jours ; à traiter plus tard dans un audit dédié.
8. Le workflow `.github/workflows/deploy.yml` utilise un pattern de découverte de tests Python qui peut ne pas inclure `tests/test_ftp_inventory.py` (préfixe `test_...` contre pattern `*_test.py`). À documenter et à proposer dans le backlog technique ; ne pas modifier le pipeline sans validation.
9. `scripts/ftp-safe-preflight.lftp` doit être réexaminé concernant la vérification du certificat TLS. Vérifier le comportement exact et les implications avant tout changement.

L'audit comporte aussi une incohérence : un document indique que plusieurs URLs de production ont été vérifiées, tandis que le document de tests précise qu'aucune exécution de production n'a été réalisée. Ne pas considérer ces vérifications comme preuve d'une recette complète.

**Règle : un constat d'audit n'est pas automatiquement un fait confirmé, et une recommandation n'est pas une autorisation de modifier le système.** Reproduis, vérifie dans le code et classe chaque élément : confirmé, infirmé, à reproduire, hors périmètre.

# 7. MÉTHODE DE TRAVAIL IMPOSÉE

## Phase A — Reprise et état des lieux

1. Lire ce mandat en entier.
2. Lire la PR #139 et ses neuf documents.
3. Vérifier l'état réel de `main`, les PR récentes, les derniers commits et les workflows.
4. Inventorier les routes, composants, styles globaux, traductions, API et dépendances.
5. Vérifier le site de production sur mobile et desktop, si un navigateur de test est disponible.
6. Comparer le rendu réel aux composants et aux styles source.
7. Identifier les anciennes couches visuelles, les duplications, les composants inutilisés et les incohérences.
8. Produire une matrice page par page et une liste des systèmes protégés.

Ne commence pas par changer des couleurs à l'aveugle.

## Phase B — Concevoir une nouvelle identité cohérente

Avant de migrer les pages, définir :
- palette et tokens de couleurs ;
- typographie et échelle de tailles ;
- grille, largeur de contenu et espacements ;
- bordures, rayons et élévations ;
- boutons, champs, onglets, menus, badges et états ;
- cartes de match et cartes de pronostic ;
- navigation mobile et desktop ;
- règles de responsive ;
- règles RTL ;
- états de chargement, erreur, vide et désactivé.

Fournir une proposition visuelle concrète et des captures / previews quand l'environnement le permet. Ne pas demander au propriétaire de choisir chaque détail : prends des décisions professionnelles cohérentes, puis présente le résultat.

## Phase C — Reconstruire les pages

Migrer réellement toutes les routes publiques vers le nouveau système. Ne pas garder des pages anciennes sous une nouvelle barre de navigation. Ne pas empiler de surcharges CSS. Supprimer les anciens styles uniquement après avoir recherché leurs usages et assuré la non-régression.

Travailler par ensembles cohérents, mais la définition de « terminé » porte sur tout le périmètre, pas sur une seule page.

## Phase D — Tests techniques et visuels

Exécuter selon les outils disponibles :
- tests unitaires et d'intégration ;
- lint et typecheck ;
- build production ;
- tests de routes et liens internes ;
- tests de traductions FR/EN/AR ;
- tests RTL ;
- vérifications SEO automatisées ;
- tests des CTA affiliés et paramètres ;
- tests des états sans données / données longues / noms d'équipes longs ;
- vérifications responsive mobile, tablette et desktop ;
- contrôle des contrastes, focus clavier et zones tactiles ;
- tests des composants sur plusieurs pages ;
- tests de non-régression des systèmes protégés.

La validation visuelle doit inclure des captures avant/après à dimensions identiques, au minimum :
- accueil mobile et desktop ;
- page de pronostics mobile et desktop ;
- page BTTS ;
- page Over 2.5 ;
- page scores exacts ;
- page promo ;
- pages FR, EN et AR.

Si tu n'as pas de navigateur ou ne peux pas vérifier une page, dis-le clairement. Ne prétends jamais avoir validé visuellement ce que tu n'as pas vu.

## Phase E — Livraison et déploiement

- Travailler sur une branche dédiée, jamais directement sur `main`.
- Faire des commits lisibles et atomiques.
- Ouvrir une PR décrivant précisément les pages refondues, les fichiers touchés, les protections vérifiées et les tests.
- Ne jamais fusionner ou déployer sans l'accord explicite du propriétaire.
- Après autorisation, suivre le workflow de déploiement existant.
- Vérifier le résultat en production après déploiement, vider/renouveler le cache si nécessaire selon les mécanismes existants, et contrôler plusieurs routes.
- Fournir des preuves : SHA, PR, checks, workflow de déploiement, captures réelles et liste de routes vérifiées.

# 8. CRITÈRES D'ACCEPTATION — PAS DE « TERMINÉ » SANS PREUVE

La mission ne sera pas considérée comme terminée si :
- seule la page d'accueil a changé ;
- les anciennes cartes sont encore visibles sur les pages de pronostics ;
- les anciens fonds verts / accents lime subsistent sans justification métier ;
- les pages publiques ont des styles différents ou contradictoires ;
- la navigation reste confuse ;
- les pages sont encore surchargées de textes inutiles ;
- le design desktop est bon mais le mobile est négligé, ou l'inverse ;
- l'arabe n'est pas réellement RTL ;
- les pages promo ont encore une apparence artificielle ou peu crédible ;
- les titres, URLs ou canonicals SEO protégés ont été modifiés ;
- les CTA affiliés ne fonctionnent plus ou leurs paramètres ont été perdus ;
- les données, algorithmes, archives ou workflows ont été altérés sans accord ;
- aucune capture de validation n'est fournie ;
- le site en production n'a pas été contrôlé après déploiement.

Le visiteur doit percevoir une transformation évidente et cohérente dès sa première visite. Les cartes doivent être nouvelles, la palette réellement unifiée, la navigation plus simple, et chaque page doit appartenir au même produit.

# 9. ORGANISATION DU BACKLOG

Priorité 0 — protection et diagnostic :
- confirmer l'état de production et du dépôt ;
- cartographier les routes et systèmes ;
- verrouiller les protections SEO, métier, affiliées et infrastructure ;
- établir les captures de référence.

Priorité 1 — fondation design :
- design system noir/graphite/bleu ;
- typographie, espacements, composants ;
- navigation mobile/desktop ;
- composants de cartes entièrement repensés.

Priorité 2 — refonte produit :
- accueil ;
- toutes les pages de pronostics ;
- pages BTTS / Over 2.5 / scores exacts ;
- détails de match ;
- pages statistiques, méthode et FAQ ;
- pages promo publiques ;
- footer, états vides et erreurs ;
- versions FR / EN / AR.

Priorité 3 — recette :
- responsive complet ;
- RTL ;
- tests visuels et fonctionnels ;
- SEO non-régression ;
- liens affiliés ;
- build et tests.

Priorité 4 — livraison :
- PR complète ;
- revue des risques ;
- accord du propriétaire ;
- déploiement ;
- vérification production et preuves.

**Après la validation de la refonte générale seulement, le propriétaire ouvrira le chantier VIP dans une mission séparée.** Ne commence pas ce chantier de toi-même.

# 10. CE QUE TU DOIS FAIRE MAINTENANT

1. Confirme que tu as lu et compris ce mandat et la PR #139.
2. Fais un état des lieux réel de `main` et de la production.
3. Établis la liste exhaustive des pages et des composants à refondre.
4. Présente une direction artistique complète et une architecture de navigation, avec des maquettes/captures concrètes si possible.
5. Signale les risques et les systèmes protégés.
6. Propose un plan d'exécution ordonné et mesurable.
7. Puis réalise la refonte complète sur une branche dédiée, avec tests et preuves, en respectant les autorisations de fusion et de déploiement.

Ne te contente pas de rédiger un plan puis de t'arrêter. Cette mission exige une exécution complète. Si un blocage technique t'empêche d'avancer, indique exactement le blocage, ce que tu as vérifié et l'action précise nécessaire. Ne remplace pas le travail par des promesses.

---

# ANNEXE — RAPPEL DES RÈGLES NON NÉGOCIABLES

- Tu es le responsable produit/technique mandaté pour mener la refonte, avec une mentalité de fondateur.
- L'identité visuelle doit être entièrement repensée : noir profond, surfaces sobres, bleu maîtrisé, qualité d'interface inspirée de la clarté de ChatGPT, sans copie de marque.
- Toutes les pages doivent être traitées, pas seulement le Hero.
- Les cartes doivent être de véritables nouveaux composants, lisibles et compactes.
- Le site doit être immédiatement compréhensible et ne jamais perdre le visiteur.
- Mobile-first, desktop soigné, FR/EN/AR avec RTL réel.
- Aucun ancien vert lime ou ancien style ne doit survivre par oubli.
- Aucun texte inutile, aucune promesse non prouvée, aucun faux indicateur.
- SEO, URLs, titres, canonicals et page anglaise prioritaire protégés.
- Algorithmes, données, historiques, génération et archives protégés.
- VIP laissé en place et hors chantier jusqu'à la fin de la refonte générale.
- Codes, liens, identifiants affiliés, paramètres et tracking protégés.
- Workers, D1, API, secrets, workflows, FTP et déploiement protégés.
- Aucun merge ni déploiement sans autorisation explicite du propriétaire.
- Aucune affirmation de réussite sans preuve réelle en navigateur et en production.

**Le standard final : BTTSPredict doit ressembler à un produit numérique premium conçu par une équipe produit sérieuse, et non à un assemblage de composants anciens rafraîchis par quelques couleurs.**
