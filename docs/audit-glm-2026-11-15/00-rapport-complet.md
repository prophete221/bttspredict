# 00 — Rapport complet de l'audit technique

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Rapport intégral : les 12 sections d'origine, sans résumé ni perte. Les fiches 01 à 08 réorganisent ce contenu par thème.

---

**Résumé d'identification** — Dépôt : `prophete221/bttspredict` (branche `main`, commit `5fb08ef`, état du 15 novembre 2026). Site : bttspredict.com (Next.js 16, export statique, worker Cloudflare). Périmètre : 1 669 fichiers — 95,2 Mo — audit fichier par fichier. Mode : lecture seule — aucun dépôt ni fichier modifié. Audit indépendant du code, sans se fier au README.

**Table des documents** : 00 rapport complet · 01 architecture et fichiers · 02 erreurs et bugs · 03 design et expérience · 04 pages et fonctionnalités · 05 sécurité et risques · 06 SEO et performance · 07 plan de correction proposé · 08 tests et vérifications.

---

# 1. Synthèse exécutive

Le présent rapport documente l'audit complet du dépôt GitHub prophete221/bttspredict (branche main, commit 5fb08ef, état du 15 novembre 2026), réalisé exclusivement en lecture seule à partir du code source, sans se fier au README ni aux documents de projet. Le dépôt correspond au site bttspredict.com : une plateforme de pronostics football (marchés BTTS et Over 2,5 buts) monétisée par l'affiliation de bookmakers (1xBet, Melbet, Linebet, 888Starz), disponible en français, anglais et arabe, avec un espace VIP conditionné à un dépôt chez un partenaire.

Le verdict technique global est nuancé mais plutôt favorable pour un projet de cette nature. Le socle est solide : application Next.js 16 en export statique, pipeline GitHub Actions entièrement automatisé (données ESPN, analyse Gemini, vérification des résultats, déploiement FTP différentiel), worker Cloudflare doté d'une authentification sérieuse (sessions administrateur hachées, jetons OIDC GitHub vérifiés par signature RSA, limitation de débit en base), une ceinture de 500 tests automatisés et une culture d'ingénierie documentée dans le code. Aucun secret n'est committé : toutes les clés (GEMINI_API_KEY, identifiants FTP, mot de passe administrateur) transitent par des variables d'environnement.

En revanche, trois familles de problèmes significatifs ont été identifiées. Premièrement, la transparence envers l'utilisateur est insuffisante sur le point le plus sensible du produit : le taux de réussite public de 79,4 % affiché sur le site est calculé après reclassement de 546 entrées en « invérifiables » via le fichier history-exclusions.json, et des journées entières affichent 100 % alors que leurs pertes réelles demeurent dans les archives publiques. Deuxièmement, la conformité RGPD est lacunaire : la politique de confidentialité ne mentionne ni Google Analytics, ni le flux VIP qui transmet identifiant bookmaker, montant de dépôt, contact Telegram/WhatsApp et capture d'écran de dépôt vers un worker Cloudflare personnel ; la porte de vérification d'âge (AgeVerification) n'est jamais montée alors que le site est en ligne. Troisièmement, la dette technique est lourde : environ 33 composants morts, un contexte d'authentification Firebase cassé et inutilisé, 654 Ko de CSS global chargé sur chaque page dont une large part de classes mortes, un dossier skills/ de 60 Mo de fichiers d'outils IA committés par erreur, et des dépendances fantômes (next-intl installé mais jamais importé, firebase, next-auth, react-router-dom).

Le tableau des risques (section 10) hiérarchise 24 constats ; les recommandations priorisées (section 11) proposent un plan d'action en trois vagues : transparence des taux et conformité d'abord, hygiène du dépôt ensuite, optimisation enfin.

---

# 2. Périmètre, sources et méthodologie

## 2.1 Périmètre

L'audit couvre l'intégralité du dépôt prophete221/bttspredict au 15 novembre 2026 : 2 131 entrées d'arborescence, dont 1 669 fichiers répartis dans 462 dossiers, pour une taille totale de fichiers de 95,2 Mo (101 Mo extraits). Dix autres dépôts du compte ont été recensés (bttspredictonline, btts2027, prophetebeta, heybro, etc.) mais ne font pas l'objet de ce rapport. Le périmètre fonctionnel couvre le frontend Next.js, les scripts de génération de prédictions (Node et Python), le pipeline CI/CD GitHub Actions, le déploiement FTP, le worker Cloudflare de l'espace VIP, les données publiques JSON et les tests automatisés.

## 2.2 Méthodologie

La méthode est une lecture directe du code, volontairement indépendante de la documentation : le README (36 Ko), les rapports de projet (GLM_TASK_00x, docs/project/reports) et les commentaires n'ont été utilisés qu'a posteriori, comme éléments de comparaison. Les constats ont été établis en quatre passes : (1) inventaire statistique complet des fichiers par extension et par volume ; (2) lecture intégrale des fichiers critiques de sécurité (worker vip-api, panneau d'administration, contexte d'authentification, scripts FTP, workflows) ; (3) lecture systématique, dossier par dossier, des bibliothèques (src/lib), des pages et composants (src/app, src/components/bttsbet), des scripts et des tests ; (4) vérification croisée des affirmations sensibles sur les données publiques elles-mêmes (win-history.json, history-exclusions.json, archives de prédictions). Chaque problème cité dans ce rapport est adossé à un fichier et, dans la mesure du possible, à une ligne.

## 2.3 Limites

L'audit est statique : aucune exécution du site en production n'a été effectuée, aucun appel réseau vers les API tierces n'a été rejoué, et le comportement réel des dépendances à l'exécution n'est couvert qu'indirectement. Les éléments invisibles au code (configuration Cloudflare réelle, secrets GitHub, contenu de la base D1, serveur FTP LWS) n'ont pas été observés. Les conclusions portent sur le code committé, qui est la seule source observable.

---

# 3. Cartographie du dépôt

Le dépôt mélange quatre natures de contenu : le code source de l'application, les scripts de production de données, les données publiques générées, et un volume exceptionnel de fichiers étrangers au produit. Le tableau suivant présente la répartition des fichiers de code et de données ; viennent s'y ajouter 653 fichiers Markdown (6,65 Mo) de documentation et rapports internes, 93 JPG et 36 PNG (15,5 Mo de médias d'équipes), 48 CSV et une vidéo MP4 de 2,3 Mo.

Tableau 1 — Volume de code par langage

| Langage | Fichiers | Lignes | Rôle principal |
| --- | --- | --- | --- |
| HTML (généré/templats) | 69 | 53 107 | Dont 5 gabarits de design de 2 à 19,9 Mo dans skills/ (hors produit) |
| TypeScript JSX (.tsx) | 207 | 29 695 | Pages Next.js et composants React |
| Python (.py) | 69 | 27 615 | Enrichissement Gemini, outils FTP, gabarits PDF dans skills/ (hors produit) |
| CSS | 28 | 24 197 | globals.css 434 Ko, football-intelligence.css 90 Ko, vip.css 87 Ko |
| TypeScript (.ts) | 141 | 17 073 | Bibliothèques src/lib, configuration, tests |
| JavaScript ESM (.mjs) | 38 | 7 843 | Scripts du pipeline (modèle, vérification, FTP, SEO) |
| JavaScript (.js) | 15 | 5 175 | Worker VIP (index.js 702 lignes), panneau admin, service worker |
| Shell (.sh) | 6 | 961 | Utilitaires de déploiement |
| SQL (.sql) | 7 | 294 | Migrations D1 du worker VIP (7 migrations) |

Le premier constat d'hygiène est immédiat : le dossier skills/ contient 57 dossiers d'outils d'agents IA (ASR, LLM, TTS, docx, pdf, design, etc.) totalisant environ 60 Mo, dont des gabarits HTML de plusieurs mégaoctets et des scripts Python de génération de PDF. Ce dossier n'est référencé par aucune partie du produit ; il a vraisemblablement été commité par erreur lors d'une session de travail avec un agent IA. Onze fichiers .pyc compilés (scripts/__pycache__ et skills/quiz-mastery) sont également committés, ce que le .gitignore ne couvre pas.

Les données publiques du produit sont regroupées dans public/ : predictions.json (261 Ko), win-history.json, history-exclusions.json (546 entrées), 63 archives quotidiennes de prédictions (2026-08-18 à 2026-11-15), team-context.json, transfers.json et vip-combos.json (remplacé à la construction par un stub « indisponible »). Cette séparation claire entre code et données générées est une bonne pratique, doublée d'une double sanitisation à la construction.

---

# 4. Architecture et chaîne de traitement

L'architecture est celle d'un site statique alimenté par un pipeline périodique, avec une seule composante serveur : le worker Cloudflare de l'espace VIP. La chaîne complète, reconstituée à partir du workflow deploy.yml et des scripts, est la suivante :

Acquisition : quick-update-predictions.mjs interroge l'API publique ESPN (site.api.espn.com, 34 ligues, fenêtre J0 à J+6, extension à J+15), récupère calendriers, 8 derniers matchs par équipe, classements et cotes DraftKings exposées par ESPN.

Modélisation statistique : probabilités empiriques BTTS et Over 2,5 calculées sur les 5 derniers matchs réels de chaque équipe, avec seuils d'abstention (moins de 4 matchs réels = pas de pronostic).

Analyse IA : enrich_predictions.py envoie ces statistiques à Gemini (gemini-3.5-flash-lite, clé en secret GitHub) qui produit la décision finale (pick, abstention, probabilité bornée entre 0,48 et 0,78) ; le traitement échoue fermé — tout match sans réponse Gemini est purgé de tout pick.

Flux VIP parallèle : les candidats VIP sont générés en privé (.private/, droits 0600), poussés vers le worker par un appel authentifié par jeton OIDC GitHub Actions, puis approuvés manuellement par le propriétaire avant publication programmée aux heures de Dakar.

Vérification : verify-results.mjs consolide les scores finis via ESPN et TheSportsDB, verdict.mjs statue BTTS/Over, update-win-history.mjs reconstruit l'historique public avec application des exclusions (voir section 8).

Construction et publication : build Next.js en export statique (output: export), sanitisation avant et après build, correction de l'attribut lang, déploiement FTP différentiel chez LWS par allowlist de commandes put explicites (aucun miroir, aucune suppression massive), puis soumission IndexNow à Bing.

Le workflow déclenche ce cycle sur chaque push de main, toutes les trois heures (cron), et trois fois par jour pour la fenêtre VIP (23h30, 06h30, 15h30 UTC). Les déploiements sont sérialisés par groupes de concurrence distincts (public et VIP), avec un mécanisme de déblocage de file encrassée réservé au propriétaire par marqueurs de commit. Les vérifications de pull request lancent la totalité des tests Vitest et Python avant toute fusion.

---

# 5. Sécurité de l'infrastructure et des API

## 5.1 Points forts constatés

Le worker VIP (workers/vip-api, 4 modules, 1 999 lignes) est la partie la mieux sécurisée du projet et dépasse ce qu'on observe habituellement sur ce type de site. L'endpoint interne de synchronisation /internal/vip-candidates/sync n'accepte que des jetons OIDC émis par GitHub Actions pour ce dépôt précis : vérification cryptographique de la signature JWT RS256 contre les clés publiques GitHub (JWKS avec rafraîchissement), contrôle de l'émetteur, de l'audience, du sujet, de l'identifiant du dépôt, du propriétaire, de la branche (refs/heads/main) et du workflow émetteur, plus une fenêtre de validité temporelle stricte. Un attaquant ne peut pas forger un tel jeton.

L'authentification administrateur est correctement conçue : mot de passe d'au moins 16 caractères fourni par variable d'environnement, jetons de session de 32 octets aléatoires stockés uniquement en haché SHA-256 en base, durée de vie d'une heure, révocation à la déconnexion, limitation à 5 échecs de connexion par fenêtre de 15 minutes par IP (hachée), et réponses d'erreur minimales. Les soumissions de demandes VIP sont plafonnées (5 par 15 minutes par IP, 20 demandes actives, 5 Mo de preuves cumulés) par des requêtes SQL atomiques ; les images de preuve sont validées par signature de fichier PNG/JPEG et plafonnées en dimensions. La politique CORS n'autorise que l'origine bttspredict.com. Le panneau d'administration public (public/vip-admin/admin.js) construit son DOM exclusivement avec textContent et replaceChildren — aucune injection HTML n'est possible — et conserve le jeton en sessionStorage avec validation de format.

La gestion des secrets est saine : le scan complet du dépôt ne révèle aucune clé API, aucun mot de passe ni aucun jeton en dur ; toutes les intégrations (Gemini, Odds-API, FTP, Telegram, administrateur) lisent des variables d'environnement ou des secrets GitHub. Le .gitignore exclut correctement .env* et *.pem, et aucun fichier d'environnement n'est committé. La clé IndexNow présente dans le code est un jeton public par conception du protocole. Le déploiement FTP est remarquablement verrouillé : diff par empreintes, allowlist explicite de commandes put, zéro suppression globale (le script prepare-stale-match-deletions.mjs produit délibérément zéro suppression), sauvegarde et restauration automatique de robots.txt et sitemap.xml, quota et temporisation anti-flood, et les 36 suppressions AR historiques ont été exécutées uniquement après vérification HTTP et FTP de chaque fichier, sous allowlist de préfixe.

## 5.2 Faiblesses et résidus de risque

Cinq faiblesses concrètes ont été identifiées, classées par importance. La première est le contournement systématique de la vérification TLS sur le canal FTP : set ssl:verify no dans les scripts lftp et ssl_ctx.check_hostname=False dans ftp-inventory.py, pour un serveur dont le certificat n'est manifestement pas aligné. Les identifiants FTP (secrets GitHub) transitent donc sur une connexion chiffrée mais non authentifiée, ce qui rend théoriquement possible une attaque de l'intercepteur sur le canal de déploiement — c'est-à-dire sur le contenu public du site. La deuxième est l'incohérence de nommage qui maintient le test test_ftp_inventory.py hors de la CI : les workflows Python discoverent avec le motif *_test.py alors que ce fichier s'appelle test_*.py ; ses trois tests ne s'exécutent donc jamais.

La troisième faiblesse est le matching flou de verify-results.mjs (lignes 53 à 79) : la normalisation retire notamment les mots united et city, si bien que Manchester United et Manchester City se réduisent toutes deux à manchester, et le rattrapage par recouvrement de jetons peut attribuer un score au mauvais club homonyme. Un script correctif one-shot (recalculate-non-verdicts.mjs) documente qu'un incident de verdicts inversés a déjà eu lieu avant le 28 septembre 2026 ; aucun test ne couvre cette fonction. La quatrième est l'absence d'en-têtes Content-Security-Policy et Strict-Transport-Security dans public/_headers, ainsi que trois scripts inline dans le layout racine (dont un purgeur de service worker avec location.reload), qui rendent une CSP stricte impossible sans refactorisation. La cinquième est résiduelle : le Caddyfile committé expose un reverse proxy piloté par paramètre de requête (XTransformPort) — artefact d'environnement de développement qui ne doit jamais être déployé face à Internet — et le worker est exposé sur son domaine workers.dev par défaut (workers_dev: true), ce qui est acceptable mais superflu : la liaison au domaine principal réduirait la surface.

Enfin, la résistance à l'injection de contenu dans les JSON-LD est incomplète : les 43 usages de dangerouslySetInnerHTML injectent des données sérialisées sans échappement de la séquence </script> ; le contenu provient du pipeline interne (noms d'équipes et de ligues), donc le risque réel est faible, mais un échappement systématique de < éliminerait la classe entière de risque.

---

# 6. Audit du frontend Next.js

## 6.1 Structure et qualité générale

Le frontend est une application Next.js 16.1.3 en mode App Router avec export statique complet (output: export), React 19, Tailwind v4 et composants shadcn/ui. Le routage racine (français) est doublé d'un segment [locale] (en, ar) qui ré-exporte proprement les pages racine avec des métadonnées traduites, en excluant fr de generateStaticParams pour éviter les doublons d'URL. La qualité d'exécution du code actif est bonne : gestion d'erreur par ErrorBoundary systématique, aria-current et aria-live présents, prefers-reduced-motion respecté, liens externes tous en rel=sponsored nofollow noopener noreferrer, aucun target=_blank sans rel, aucun eval, et un suivi honnête des statuts WON/LOST/vérification en cours dans le Match Center et le tableau de bord.

## 6.2 Code mort : environ un tiers du dossier de composants

L'analyse du graphe d'imports établit qu'environ 33 fichiers de src/components/bttsbet et de src/app/vip ne sont plus importés par aucune page : AgeVerification, StickyCTABar, LiveTicker, StickyVipBandeau, SiteLoader, CursorEffect, FloatingElements, NeuralBackground, MobileTabBar, ScrollProgressBar, PromoVip, VipSports, VipCardGlass, VipCardWidget, VipUnlockModal, VipLevelModal, FreePredictionsWidget, StatsDashboard, TrustPillars, HowItWorks, About, GlobalReach, HowToGetVip, LockedContent, SportMarquee, TiltCard, AnimatedIcons, VectorWordmark, PremiumButton, PartnerSignupBand, AffiliateSignupCta, HomeEditorial, ainsi que les deux flux VIP parallèles VipApplication.tsx (412 lignes) et VipClient.tsx (695 lignes). Ils ne gonflent pas le bundle (non importés) mais faussent toute lecture du produit et exposent au risque de réactivation accidentelle de contenus obsolètes : HowToGetVip contient encore l'affirmation « taux de réussite 69-81 % selon le sport », et VipSports fabrique des cotes quotidiennes pseudo-aléatoires entre 12 et 30 (fonction getDailyCote) présentées avec compteurs animés et badge Live. Le contexte d'authentification src/contexts/AuthContext.jsx est dans le même cas, en pire : jamais importé, il utilise la syntaxe Vite import.meta.env.VITE_FIREBASE_* qui ne peut pas fonctionner sous Next.js, sans directive use client ; il explique la présence fantôme de firebase, next-auth et react-router-dom dans les dépendances.

Deux bibliothèques présentées comme centrales sont en réalité déconnectées : seoSchemas.ts (437 lignes, constructeurs JSON-LD centralisés) n'est importé nulle part — chaque page redéfinit ses schémas localement — et un test de gel par empreinte empêche même son nettoyage. De même, next-intl figure dans package.json mais aucun import n'en est fait : l'internationalisation est un système maison (src/lib/i18n.ts et dictionnaires dupliqués par composant), avec des traductions fr/en/ar portées dans chaque composant, ce qui crée un risque de divergence entre langues.

## 6.3 CSS : 654 Ko globaux chargés sur chaque page

Le layout racine importe cinq feuilles de style globales totalisant environ 654 Ko (globals.css 434 Ko, football-intelligence.css 90 Ko, bttspredict-design-system.css 48 Ko, matchday-ui.css 48 Ko, bttspredict-rebuild.css 35 Ko), plus vip.css (87 Ko) sur la seule page VIP. L'analyse des classes montre qu'environ 56 % des 752 classes de premier niveau de globals.css ne sont référencées par aucun source : cinq générations de design cohabitent (préfixes fi-, hp-, bp-, vipx-, btp-), avec 497 classes définies en doublon entre fichiers. Comme Next.js ne purge jamais les imports globaux manuels, chaque visiteur télécharge ce volume à chaque navigation. Par ailleurs, les polices Poppins (4 fichiers woff2 committés) ne sont chargées par aucun next/font/local alors que plus de dix composants écrivent fontFamily: 'Poppins' : la police de marque est silencieusement remplacée par une police système.

## 6.4 Anomalies fonctionnelles ciblées

Bug d'animation : useAnimations.ts (ligne 104) inclut hasAnimated dans les dépendances de l'effet, ce qui relance le compteur après achèvement (retour à zéro puis recompte) ; affecte les compteurs de VipSports et de ResultatsClient.

Performance de build : getMatchBySlug dans src/lib/matches.ts relit l'intégralité des archives à chaque appel, et les pages de match l'appellent plusieurs fois ; le fichier importe aussi un script du pipeline (scripts/public-predictions.mjs), un couplage inverse code/scripts fragile.

Route redondante : src/app/predictions.json/route.ts re-sert public/predictions.json au build alors que le fichier est déjà copié et sanitisé — deux écrivains du même chemin de sortie, avec un cache s-maxage inopérant en hébergement statique.

Divergence de rendu FR/en/ar : les pages de prédictions racine sont ensemencées au build (HTML contenant les données) tandis que leurs équivalents [locale] ne le sont pas — le contenu prédictif manque du HTML exporté en anglais et en arabe, ce qui affaiblit le SEO de ces versions.

Script inline de rechargement : le purgeur de service worker du layout force location.reload() à chaque changement de VERSION ; un déploiement partiel peut provoquer des boucles de rechargement.

---

# 7. Pipeline de données et moteur de prédictions

## 7.1 Modèle statistique et garde-fous anti-invention

Le moteur réel (quick-update-predictions.mjs, 942 lignes, versions v91/v92) repose exclusivement sur des données ESPN réelles : probabilité BTTS d'un match = moyenne des taux BTTS observés sur les 5 derniers matchs de chaque équipe ; même méthode pour Over 2,5 ; abstention si moins de 4 matchs réels. Un historique de régression est documenté dans le code : les anciennes fonctions fabriquaient des statistiques à partir de hachages pseudo-aléatoires, elles ont été supprimées et un test dédié (no-invented-data.test.ts) interdit par inspection de source les motifs de fabrication connus. Ces garde-fous sont réels et méritent d'être soulignés — ils sont rares sur ce segment de produit.

Deux réserves limitent néanmoins la signification des chiffres publiés. D'une part, les replis quantifiés sont codés en dur lorsque les taux réels manquent : BTTS 0,62 ou 0,45 selon les buts moyens, Over 0,58/0,50/0,42 selon les totaux — des valeurs plausibles mais arbitraires, qui alimentent le flux normal. D'autre part, le score de fiabilité affiché à l'utilisateur pondère quatre composantes dont le face-à-face (H2H) vaut une constante de 50, soit un dixième du score purement arbitraire ; et les champs s'appellent toujours xgHome/xgAway alors que le code précise qu'il s'agit de buts moyens observés, pas de buts attendus (xG) : l'étiquette affichée dans l'interface est trompeuse pour un visiteur non averti.

## 7.2 Couche Gemini : sérieuse et à l'échec fermé

enrich_predictions.py (668 lignes) est discipliné : prompt imposant l'abstention sous 4 matchs d'échantillon, bornes de probabilité 0,48-0,78 avec rejet au-delà de 0,40/0,90, interdiction explicite d'inventer statistiques, blessures ou face-à-face, réponse JSON stricte, traitement par paquets de 4, budget de 300 secondes, tentatives bornées respectant Retry-After. Avant chaque appel, tout pick préexistant du match est effacé sur disque (mark_no_gemini_pick) : si Gemini échoue, aucun choix local n'est publié et le workflow continue — le site ne peut pas montrer de pronostic non issu du modèle. La validation aval (filter-gemini-current-picks.mjs, validate-predictions.mjs --require-gemini) refuse toute ligne sans décision Gemini vérifiée. Le flux VIP suit la même logique via enrich_vip_candidates.py avec éligibilité stricte (qualité HIGH, 8 matchs minimum, coup d'envoi futur).

Une réserve d'ordre éthique majeure concerne la construction même des candidats VIP : le prompt d'enrichissement impose de ne jamais copier le pick gratuit et, si le même marché est considéré, de choisir exclusivement l'issue opposée. Les sélections VIP sont donc structurellement contraires aux pronostics publics sur le même marché, quelle que soit la force de la preuve : c'est une différenciation commerciale, pas une analyse indépendante. Un utilisateur qui suivrait à la fois le flux gratuit et le flux VIP prendrait des paris symétriquement opposés. Ce choix mérite d'être assumé explicitement dans la documentation produit, ou corrigé.

## 7.3 Vérification des résultats et construction du taux de réussite

La vérification s'appuie sur les scores finis ESPN (48 ligues) et TheSportsDB, uniquement aux statuts STATUS_FINAL/FULL_TIME, avec grâce de 48 heures pour les matchs non conclus. La logique de verdict (verdict.mjs) est pure, testée et correcte. La faiblesse du fuzzyMatch a été décrite en section 5.2. La construction de l'historique public (update-win-history.mjs, schéma v4) est par ailleurs rigoureuse : déduplication, politique pending documentée, suppression des anciens champs trompeurs (roi, yield, cotes moyennes — l'ancienne cote fictive de 1,90 a été retirée du schéma).

Le point sensible est ailleurs : le script applique public/history-exclusions.json (546 entrées) en reclassant chaque entrée exclue, perdante ou gagnante, en invérifiable, c'est-à-dire hors du dénominateur du taux public. Les données vérifiées montrent l'effet : win-history.json affiche 79,4 % (429 gagnés sur 540 retenus) avec des journées à 100 % (22/22 le 31 octobre, 8/8 le 3 novembre, 11/11 le 5 novembre, 24/24 le 7 novembre), précisément les journées dont les pertes ont été exclues ; l'archive du 5 novembre conserve la trace publique d'une perte réelle (Bayer Leverkusen - Marseille, BTTS Oui, 0-1, LOST, GOLD) absente de l'historique affiché. Le fixture de test confirmed-removed-history-losses.json documente 164 pertes retirées, et le workflow verrouille ces exclusions par compteurs en dur — toutefois, ni le fichier d'exclusions ni le fixture ne portent de justification par entrée (le champ reason est explicitement interdit par les tests). Le mécanisme est automatisable à volonté : ajouter une clé au fichier fait disparaître une perte du taux affiché. Même si des victoires ont également été exclues (argument d'équité vérifié) et que les archives demeurent auditable, le taux de 79,4 % présenté à l'utilisateur est un chiffre curaté, non un taux brut.

---

# 8. Conformité, RGPD et transparence envers l'utilisateur

## 8.1 Ce qui est conforme

La chaîne de consentement est réelle et bien construite : CookieConsent propose un choix granulaire (essentiel, analytics, advertising) qui refuse par défaut, AnalyticsLoader ne charge Google Analytics que si le consentement analytics est positif, pose le flag ga-disable sinon, écoute les changements de préférence et anonymise les IP ; affiliateTracking ne pousse aucun événement avant consentement, ne déduplique les vues qu'à des fins anti-spam et ne traite aucune donnée personnelle. Les mentions d'affiliation sont présentes sur chaque page partenaire, les liens portent les attributs rel attendus, les disclaimers 18+ et les messages de jeu responsable (Joueurs Info Service, begambleaware, numéros sénégalais) sont systématiques. Les pages légales françaises (mentions légales 332 lignes, politique de confidentialité 417 lignes, CGU 465 lignes, jeu responsable 360 lignes) sont substantielles : droits RGPD, durées de conservation des cookies, canaux de contact.

## 8.2 Lacunes de conformité identifiées

Politique de confidentialité incomplète (constat le plus sérieux) : elle ne mentionne ni Google Analytics, ni le traitement VIP — identifiant bookmaker, montant de dépôt, pseudonyme Telegram ou numéro WhatsApp, et capture d'écran de dépôt envoyés au worker personnel bttspredict-vip-production-api.luxxdii.workers.dev — ni la rétention de 7 jours qui n'est annoncée que dans la modale d'inscription. Le flux est pourtant soigné (consentements explicites versionnés, preuves plafonnées, purge automatique), mais il n'est documenté nulle part côté utilisateur.

Vérification d'âge inactive : le composant AgeVerification (porte 24 heures, refus = sortie) n'est monté nulle part. Un site d'affiliation de paris opère donc en ligne sans contrôle d'âge effectif, alors que le composant existe.

Versions légales anglaise et arabe squelettiques : LocalizedLegalPage sert quatre sections d'un paragraphe chacune, sans durées, canaux ni bases légales — une incohérence majeure avec les versions françaises sur les trois langues d'un même site.

Accès VIP conditionné à un dépôt financier : l'accès premium exige un dépôt d'au moins 3 USD chez un bookmaker affilié avec preuve de dépôt — schéma d'incitation au dépôt lié à l'affiliation, présenté honnêtement dans la modale mais qui constitue une contrepartie financière à assumer juridiquement (et commercialement).

Affirmations commerciales invérifiables : traductions affichant « N°1 Mondiale » et « 300 % worldwide confirmé » (src/lib/i18n.ts), FAQ partenaires posant le bonus de 300 % comme un fait dans le JSON-LD FAQPage ; toggle advertising du consentement décoratif (aucun script public ne le lit) ; badge Live heuristique dans le composant mort LiveTicker.

Historique VIP biaisé : la page VIP affiche sous le titre Historique VIP uniquement les entrées WON de l'historique général, sans pertes ni taux — présentation biaisée par omission sur la page monétisée.

Précision importante sur les cotes fabriquées : la fonction getDailyCote de VipSports.tsx (cotes pseudo-aléatoires 12-30, badge Live, « 8 matchs » en dur) se trouve dans un composant mort, jamais monté — le site actuel ne l'affiche donc pas. Le risque est celui d'une réactivation accidentelle d'un composant présent dans le barrel d'exports ; sa suppression ou sa correction est recommandée avant toute réutilisation.

---

# 9. Hygiène du dépôt et dette technique

Trois catégories de dette ont été recensées. La première est le poids du dépôt : 208 Mo côté GitHub pour un produit dont le code utile fait moins de 20 Mo — le dossier skills/ (60 Mo d'outils d'agents IA), les gabarits de design de plusieurs mégaoctets, 653 fichiers Markdown de rapports internes et les .pyc committés en sont responsables. Ce volume multiplie le temps de clonage et la consommation de quota Actions à chaque checkout. La deuxième est le stock de code mort détaillé en section 6.2, auquel s'ajoutent sept scripts morts ou archivables côté pipeline : fix-double-brand.py et fix-og-titles.py (chemins absolus non portables /home/z/my-project/...), recalculate-non-verdicts.mjs (migration one-shot documentée), seo-report.mjs et update-vip-combos.mjs (jamais branchés), analyze_with_gemini.py (alias jamais invoqué), et la fonction checkedFallbackCandidate (fallback empirique désactivé) dans vip-candidate-source.mjs, dont la réactivation réintroduirait des probabilités empiriques comme picks VIP. La troisième est la duplication structurelle : le contenu promo est rédigé en trois endroits (clients FR, LocalizedPromoClient, promo-faq.ts), deux coquilles promo coexistent, et chaque composant porte ses propres dictionnaires trilingues.

Les dépendances méritent un tri : sur 60 paquets, au moins sept ne servent à rien dans le code actif (firebase, next-auth, react-router-dom, @mdxeditor/editor, @tanstack/react-query, zustand, z-ai-web-dev-sdk), d'autres sont doublonnés (motion-dom/motion-utils avec framer-motion, react-helmet-async inutile avec le Metadata de Next). Aucune vulnérabilité connue majeure n'a été recherchée en profondeur (audit statique hors périmètre), mais le verrouillage npm (package-lock.json de 594 Ko) et la fraîcheur des versions principales (Next 16, React 19, Tailwind 4) plaident pour un audit npm install suivi d'un npm prune régulier.

Enfin, un mot sur les tests, qui sont un point fort à préserver : 85 fichiers Vitest, environ 500 tests et 2 325 assertions (4,7 par test en moyenne), couvrant l'intégrité des pronostics, les garde-fous anti-invention, la frontière public/privé, la sécurité de déploiement, le worker VIP et de nombreuses régressions UI. Deux trous notables : le matching flou de verify-results.mjs n'est pas testé (cf. incident Manchester), et le test Python test_ftp_inventory.py ne tourne jamais en CI (motif de découverte inadapté). Les tests Python sérieux (enrich_predictions_test.py, 23 tests ; enrich_vip_candidates_test.py, 16 tests) sont, eux, bien branchés.

---

# 10. Synthèse des risques priorisés

Le tableau ci-dessous consolide les 24 constats principaux, classés par criticité. La criticité combine l'impact utilisateur (transparence, conformité), l'impact sécurité et l'impact maintenance. Les références de fichiers sont relatives à la racine du dépôt.

Tableau 2 — Registre des risques (criticité décroissante)

| N | Criticité | Constat | Localisation |
| --- | --- | --- | --- |
| 1 | CRITIQUE | Taux de réussite public (79,4 %) construit après reclassement de 546 exclusions sans justification par entrée ; journées affichées à 100 % dont les pertes restent dans les archives | scripts/update-win-history.mjs:343-347 ; public/history-exclusions.json ; deploy.yml:249-275 |
| 2 | CRITIQUE | Politique de confidentialité muette sur GA4 et sur le flux VIP (identifiant bookmaker, dépôt, Telegram/WhatsApp, capture de dépôt vers le worker) ; rétention 7 jours absente de la page légale | src/app/politique-confidentialite/page.tsx ; src/app/vip/VipJourneyModal.tsx:26,63 |
| 3 | CRITIQUE | Vérification d'âge jamais montée sur un site d'affiliation de paris en ligne | src/components/bttsbet/AgeVerification.tsx (0 import) |
| 4 | ÉLEVÉ | FTPS sans vérification de certificat sur tout le canal de déploiement (MITM possible sur le contenu public) | scripts/ftp-safe-preflight.lftp:1 ; scripts/ftp-inventory.py:87-92 ; deploy.yml |
| 5 | ÉLEVÉ | Sélections VIP contraintes à l'issue opposée du pick gratuit, quelle que soit la preuve — différenciation commerciale présentée comme analyse | scripts/enrich_vip_candidates.py:220 ; scripts/vip-candidate-source.mjs:222 |
| 6 | ÉLEVÉ | Pages légales en/ar réduites à 4 paragraphes, incompatibles avec le niveau FR sur un site trilingue | src/components/bttsbet/LocalizedLegalPage.tsx |
| 7 | ÉLEVÉ | Matching flou des scores retire united/city et accepte le recouvrement de jetons — risque de WON/LOST attribués au mauvais club ; incident historique documenté, aucun test | scripts/verify-results.mjs:53-79 |
| 8 | ÉLEVÉ | 654 Ko de CSS global par page dont environ 56 % de classes mortes (5 générations de design empilées) | src/app/globals.css et layout.tsx:4-8 |
| 9 | MOYEN | Affirmations commerciales invérifiables affichées (« N°1 Mondiale », « 300 % worldwide confirmé », bonus 300 % posé en fait dans FAQ JSON-LD) | src/lib/i18n.ts:46,129 ; src/lib/promo-faq.ts |
| 10 | MOYEN | Étiquette xG affichée pour des buts moyens observés ; fiabilité pondérée avec constante H2H arbitraire (10 % du score) | scripts/quick-update-predictions.mjs:689-691,720-729 |
| 11 | MOYEN | Cotes VIP fabriquées (12-30 pseudo-aléatoires, badge Live) dans un composant mort réactivable ; « taux 69-81 % » dans un autre composant mort | src/components/bttsbet/VipSports.tsx:52-70 ; HowToGetVip.tsx:69 |
| 12 | MOYEN | Historique VIP n'affichant que des gagnants (biais de survie) sur la page monétisée | src/app/vip/VipWinHistory.tsx:78,117 |
| 13 | MOYEN | AuthContext Firebase mort et cassé (syntaxe Vite sous Next), entraînant 7 dépendances fantômes | src/contexts/AuthContext.jsx:19-24 ; package.json |
| 14 | MOYEN | test_ftp_inventory.py jamais exécuté en CI (motif *_test.py vs test_*.py) | .github/workflows/deploy.yml:69,392 |
| 15 | MOYEN | Environ 33 composants morts (dont 2 flux VIP parallèles) et seoSchemas.ts (437 lignes) déconnecté mais gelé par test | src/components/bttsbet/ ; src/lib/seoSchemas.ts |
| 16 | MOYEN | Dossier skills/ (60 Mo d'outils IA) et .pyc committés ; dépôt de 208 Mo | skills/ ; scripts/__pycache__ |
| 17 | MOYEN | next-intl installé mais jamais importé ; i18n maison trilingue dupliquée par composant | package.json ; src/lib/i18n.ts |
| 18 | MOYEN | JSON-LD injecté sans échappement de </script> (43 usages) — risque faible, données internes | src/components/bttsbet/FreePredictions.tsx:605 ; match/[slug]/page.tsx:879 |
| 19 | MOYEN | Absence de CSP et HSTS ; 3 scripts inline dans le layout racine dont un purgeur avec reload forcé | public/_headers ; src/app/layout.tsx:142-167 |
| 20 | MOYEN | Divergence SSG FR/en/ar : contenu prédictif absent du HTML exporté en anglais et arabe | src/app/[locale]/btts/predictions/today/page.tsx |
| 21 | FAIBLE | Bug de double animation useCountUp (dépendance hasAnimated) | src/hooks/useAnimations.ts:104 |
| 22 | FAIBLE | getMatchBySlug relit toutes les archives à chaque appel ; import script/page croisé | src/lib/matches.ts:17,321-333 |
| 23 | FAIBLE | Route predictions.json redondante (double écriture de out/predictions.json) | src/app/predictions.json/route.ts |
| 24 | FAIBLE | IndexNow soumet une dizaine d'URLs supprimées du site ; verify-seo.mjs non branché en CI | scripts/submit-indexnow.mjs ; scripts/verify-seo.mjs |

---

# 11. Recommandations priorisées

## 11.1 Vague 1 — Transparence et conformité (immédiat, sans refonte)

Rendre le taux public défendable : publier à côté du taux curaté le taux brut calculé sur les archives (pertes incluses), et joindre à history-exclusions.json une justification par entrée (date, match, motif). Si certaines exclusions tiennent à des erreurs de source avérées, elles doivent être vérifiables publiquement. Conserver l'archive comme preuve — c'est déjà le cas et c'est précieux.

Compléter la politique de confidentialité : sections Google Analytics (consenti, IP anonymisée), flux VIP (nature des données, finalité, worker destinataire, rétention 7 jours, droits d'accès et de suppression via le canal de contact), clés localStorage utilisées. Porter les versions anglaise et arabe au niveau de la version française.

Monter AgeVerification dans le layout racine (le composant est prêt) et supprimer ou corriger les composants morts à risque (VipSports et sa cote fabriquée, HowToGetVip et son taux inventé) pour éliminer le risque de réactivation.

Assumer ou corriger la règle VIP opposée au gratuit : soit documenter explicitement dans la page VIP que les sélections premium sont construites en contraste avec le flux public, soit supprimer la contrainte du prompt et laisser l'analyse décider.

## 11.2 Vague 2 — Sécurité et fiabilité (court terme)

Réparer la chaîne TLS du FTP : installer le certificat correct côté LWS ou épingler son empreinte, puis activer ssl:verify et check_hostname ; à défaut, documenter le risque accepté et passer par SFTP/SSH si disponible.

Corriger fuzzyMatch : ne pas retirer united/city de la normalisation, exiger un recouvrement de deux jetons ou une distance de Levenshtein bornée, et ajouter un test matriciel (Manchester United/Manchester City, RCD Mallorca/Real Mallorca, etc.).

Renommer test_ftp_inventory.py en ftp_inventory_test.py (ou ajuster le motif de découverte) pour le brancher en CI ; ajouter un test du matching de scores.

Ajouter CSP et HSTS dans _headers et déplacer les trois scripts inline du layout vers des fichiers ou au minimum documenter l'exception ; échapper < dans tous les JSON.stringify injectés en JSON-LD.

Retirer le Caddyfile du dépôt ou le placer hors périmètre de déploiement ; lier le worker au domaine principal plutôt qu'au domaine workers.dev.

## 11.3 Vague 3 — Hygiène et performance (planifié)

Purger le dépôt : retirer skills/ et les .pyc de l'historique (git rm + filtre d'historique ou répertoire dédié), archiver les scripts one-shot, viser un dépôt sous 40 Mo.

Élaguer le frontend : supprimer les 33 composants morts, AuthContext.jsx et les dépendances fantômes, décider du sort de seoSchemas.ts (brancher ou supprimer avec son test de gel), retirer next-intl ou adopter réellement next-intl.

Réduire le CSS : reconstruire globals.css autour des classes réellement utilisées (l'audit fournit la liste des classes mortes), fusionner les 5 feuilles globales, charger les polices Poppins via next/font/local ou retirer les références.

Harmoniser FR/en/ar (ensemencement au build sur les deux segments) et unifier la définition des tiers et clés entre src/lib/predictions.ts et les scripts (une source unique importée par le pipeline, comme le promet le commentaire du code).

Corriger useCountUp (dépendance hasAnimated), la relecture FS de getMatchBySlug (cache en mémoire de build) et supprimer la route predictions.json redondante.

---

# 12. Conclusion

Ce dépôt est celui d'un projet réel, activement maintenu et, sur le plan de l'ingénierie, nettement au-dessus de la moyenne de sa catégorie : authentification worker sérieuse, pipeline à l'échec fermé, tests abondants, déploiement verrouillé, culture explicite de la donnée non inventée. Les fondations techniques n'appellent aucune refonte.

Le déséquilibre se situe ailleurs : entre la rigueur du code et la promesse faite à l'utilisateur. Le produit affiche un taux de réussite construit après curation des pertes, une fiabilité pondérée par des constantes, des étiquettes xG approximatives et des affirmations commerciales invérifiables, pendant que la conformité RGPD et la vérification d'âge — pourtant techniquement prêtes — restent incomplètes. Pour un site dont le modèle économique repose sur la confiance d'un public de parieurs, cette asymétrie est le principal risque du projet, bien plus que toute faiblesse technique recensée. Les recommandations de la vague 1 (section 11) traitent l'essentiel de ce déséquilibre en quelques jours de travail, sans toucher à l'architecture.

---
