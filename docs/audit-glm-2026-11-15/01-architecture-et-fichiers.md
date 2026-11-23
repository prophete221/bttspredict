# 01 — Architecture, composants, pages et dépendances

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Fiche thématique : cartographie du dépôt, chaîne de traitement, frontend Next.js, hygiène et dépendances.

---

## 1. Cartographie du dépôt

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

## 2. Architecture et chaîne de traitement

L'architecture est celle d'un site statique alimenté par un pipeline périodique, avec une seule composante serveur : le worker Cloudflare de l'espace VIP. La chaîne complète, reconstituée à partir du workflow deploy.yml et des scripts, est la suivante :

Acquisition : quick-update-predictions.mjs interroge l'API publique ESPN (site.api.espn.com, 34 ligues, fenêtre J0 à J+6, extension à J+15), récupère calendriers, 8 derniers matchs par équipe, classements et cotes DraftKings exposées par ESPN.

Modélisation statistique : probabilités empiriques BTTS et Over 2,5 calculées sur les 5 derniers matchs réels de chaque équipe, avec seuils d'abstention (moins de 4 matchs réels = pas de pronostic).

Analyse IA : enrich_predictions.py envoie ces statistiques à Gemini (gemini-3.5-flash-lite, clé en secret GitHub) qui produit la décision finale (pick, abstention, probabilité bornée entre 0,48 et 0,78) ; le traitement échoue fermé — tout match sans réponse Gemini est purgé de tout pick.

Flux VIP parallèle : les candidats VIP sont générés en privé (.private/, droits 0600), poussés vers le worker par un appel authentifié par jeton OIDC GitHub Actions, puis approuvés manuellement par le propriétaire avant publication programmée aux heures de Dakar.

Vérification : verify-results.mjs consolide les scores finis via ESPN et TheSportsDB, verdict.mjs statue BTTS/Over, update-win-history.mjs reconstruit l'historique public avec application des exclusions (voir section 8).

Construction et publication : build Next.js en export statique (output: export), sanitisation avant et après build, correction de l'attribut lang, déploiement FTP différentiel chez LWS par allowlist de commandes put explicites (aucun miroir, aucune suppression massive), puis soumission IndexNow à Bing.

Le workflow déclenche ce cycle sur chaque push de main, toutes les trois heures (cron), et trois fois par jour pour la fenêtre VIP (23h30, 06h30, 15h30 UTC). Les déploiements sont sérialisés par groupes de concurrence distincts (public et VIP), avec un mécanisme de déblocage de file encrassée réservé au propriétaire par marqueurs de commit. Les vérifications de pull request lancent la totalité des tests Vitest et Python avant toute fusion.

---

## 3. Audit du frontend Next.js

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

## 4. Hygiène du dépôt, dette technique et dépendances

Trois catégories de dette ont été recensées. La première est le poids du dépôt : 208 Mo côté GitHub pour un produit dont le code utile fait moins de 20 Mo — le dossier skills/ (60 Mo d'outils d'agents IA), les gabarits de design de plusieurs mégaoctets, 653 fichiers Markdown de rapports internes et les .pyc committés en sont responsables. Ce volume multiplie le temps de clonage et la consommation de quota Actions à chaque checkout. La deuxième est le stock de code mort détaillé en section 6.2, auquel s'ajoutent sept scripts morts ou archivables côté pipeline : fix-double-brand.py et fix-og-titles.py (chemins absolus non portables /home/z/my-project/...), recalculate-non-verdicts.mjs (migration one-shot documentée), seo-report.mjs et update-vip-combos.mjs (jamais branchés), analyze_with_gemini.py (alias jamais invoqué), et la fonction checkedFallbackCandidate (fallback empirique désactivé) dans vip-candidate-source.mjs, dont la réactivation réintroduirait des probabilités empiriques comme picks VIP. La troisième est la duplication structurelle : le contenu promo est rédigé en trois endroits (clients FR, LocalizedPromoClient, promo-faq.ts), deux coquilles promo coexistent, et chaque composant porte ses propres dictionnaires trilingues.

Les dépendances méritent un tri : sur 60 paquets, au moins sept ne servent à rien dans le code actif (firebase, next-auth, react-router-dom, @mdxeditor/editor, @tanstack/react-query, zustand, z-ai-web-dev-sdk), d'autres sont doublonnés (motion-dom/motion-utils avec framer-motion, react-helmet-async inutile avec le Metadata de Next). Aucune vulnérabilité connue majeure n'a été recherchée en profondeur (audit statique hors périmètre), mais le verrouillage npm (package-lock.json de 594 Ko) et la fraîcheur des versions principales (Next 16, React 19, Tailwind 4) plaident pour un audit npm install suivi d'un npm prune régulier.

Enfin, un mot sur les tests, qui sont un point fort à préserver : 85 fichiers Vitest, environ 500 tests et 2 325 assertions (4,7 par test en moyenne), couvrant l'intégrité des pronostics, les garde-fous anti-invention, la frontière public/privé, la sécurité de déploiement, le worker VIP et de nombreuses régressions UI. Deux trous notables : le matching flou de verify-results.mjs n'est pas testé (cf. incident Manchester), et le test Python test_ftp_inventory.py ne tourne jamais en CI (motif de découverte inadapté). Les tests Python sérieux (enrich_predictions_test.py, 23 tests ; enrich_vip_candidates_test.py, 16 tests) sont, eux, bien branchés.
