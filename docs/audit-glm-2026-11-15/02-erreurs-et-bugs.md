# 02 — Erreurs confirmées, bugs, incohérences et causes probables

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Chaque constat distingue CONFIRMÉ / HYPOTHÈSE / NON VÉRIFIABLE. Table de 24 bugs avec localisation, cause probable et effet.

---

## Avertissement méthodologique : statut de chaque constat

Chaque constat de cet audit porte l'un des trois statuts suivants. Ils ne sont mélangés nulle part : un problème présenté comme confirmé est adossé à un fichier et, dans la mesure du possible, à une ligne de code.

- **CONFIRMÉ** : vérifié directement dans le code source ou dans les données publiques committées (ex. ligne de code, contenu JSON, schéma de test). Reproductible par toute personne qui relit le dépôt.
- **HYPOTHÈSE** : inférence plausible à partir d'indices du code, mais dont l'origine ou l'effet réel n'est pas observable depuis un audit statique (ex. « le dossier skills/ a vraisemblablement été committé par erreur lors d'une session d'agent IA » — le fait est établi, la cause est une hypothèse ; « le certificat FTP est manifestement désaligné » — constaté dans les scripts, la config réelle du serveur LWS n'a pas été observée).
- **NON VÉRIFIABLE en audit statique** : tout ce qui vit hors du dépôt (configuration Cloudflare réelle, secrets GitHub, contenu de la base D1, serveur FTP LWS, comportement à l'exécution, résultats Lighthouse, rendu navigateur réel).

Les deux erreurs d'appréciation à ne pas commettre : (1) traiter une hypothèse comme un bug confirmé ; (2) oublier qu'aucune exécution du site en production n'a été effectuée.

## Bugs et erreurs confirmés (fichier, ligne, cause probable, effet)

| # | Constat | Localisation | Cause probable | Effet |
| --- | --- | --- | --- | --- |
| B1 | Compteurs animés qui reviennent à zéro puis recomptent | src/hooks/useAnimations.ts:104 | `hasAnimated` inclus dans les dépendances de l'effet, qui se relance après achèvement | Mauvaise impression visuelle sur les compteurs de VipSports et ResultatsClient |
| B2 | Matching flou des scores : Manchester United et Manchester City se réduisent toutes deux à `manchester` (les mots `united`/`city` sont retirés par la normalisation) ; rattrapage par recouvrement de jetons | scripts/verify-results.mjs:53-79 | Normalisation trop agressive + seuil de recouvrement trop permissif | Verdicts WON/LOST potentiellement attribués au mauvais club homonyme ; un incident de verdicts inversés a déjà eu lieu avant le 28/09/2026 (documenté par recalculate-non-verdicts.mjs) ; aucun test ne couvre cette fonction |
| B3 | Test Python jamais exécuté en CI | tests/test_ftp_inventory.py ; .github/workflows/deploy.yml:69,392 | Motif de découverte `*_test.py` incompatible avec le nom `test_*.py` | Les 3 tests d'inventaire FTP ne tournent jamais |
| B4 | TLS non vérifié sur tout le canal de déploiement FTP | scripts/ftp-safe-preflight.lftp:1 (`set ssl:verify no`) ; scripts/ftp-inventory.py:87-92 (`check_hostname=False`) | Certificat serveur non aligné contourné au lieu d'être corrigé | Identifiants FTP (secrets GitHub) sur connexion chiffrée mais non authentifiée : MITM théoriquement possible sur le contenu public du site |
| B5 | Contexte d'authentification mort et cassé | src/contexts/AuthContext.jsx:19-24 | Syntaxe Vite (`import.meta.env.VITE_FIREBASE_*`) sous Next.js, sans directive `use client`, jamais importé | Explique 7 dépendances fantômes (firebase, next-auth, react-router-dom...) ; risque de réactivation accidentelle |
| B6 | getMatchBySlug relit l'intégralité des archives à chaque appel ; import couplage inverse code→script | src/lib/matches.ts:17,321-333 | Pas de cache de build ; import de scripts/public-predictions.mjs depuis la lib | Performance de build dégradée sur les pages de match ; couplage fragile |
| B7 | Route redondante : double écriture de out/predictions.json | src/app/predictions.json/route.ts | Deux écrivains du même chemin de sortie ; cache s-maxage inopérant en hébergement statique | Risque d'incohérence selon l'ordre de génération |
| B8 | Divergence SSG FR vs en/ar : le contenu prédictif est ensemencé dans le HTML des pages racines seulement | src/app/[locale]/btts/predictions/today/page.tsx et équivalents | generateStaticParams sans ensemencement de données côté [locale] | SEO affaibli des versions anglaise et arabe |
| B9 | Purgeur de service worker avec `location.reload()` forcé | src/app/layout.tsx:142-167 | Script inline surveillant VERSION | Boucles de rechargement possibles lors d'un déploiement partiel ; rend une CSP stricte impossible |
| B10 | JSON-LD injecté sans échappement de `</script>` (43 usages de dangerouslySetInnerHTML) | src/components/bttsbet/FreePredictions.tsx:605 ; src/app/match/[slug]/page.tsx:879 | Sérialisation JSON sans échappement de `<` | Classe de risque entière éliminable par un échappement systématique ; risque réel faible (données internes) |
| B11 | Absence de CSP et HSTS dans public/_headers | public/_headers | Jamais ajoutées | Surface d'attaque élargie ; incompatible avec les 3 scripts inline du layout |
| B12 | Caddyfile avec reverse proxy piloté par paramètre de requête (XTransformPort) committé | Caddyfile | Artefact d'environnement de développement | Ne doit jamais être déployé face à Internet |
| B13 | Worker exposé sur domaine workers.dev par défaut | workers/vip-api/wrangler.jsonc (`workers_dev: true`) | Config par défaut non resserrée | Superficie supplémentaire, superflu mais acceptable |
| B14 | Valeurs de repli de probabilités codées en dur (BTTS 0,62/0,45 ; Over 0,58/0,50/0,42) | scripts/quick-update-predictions.mjs | Repli quand les taux réels manquent — plausible mais arbitraire | Alimente le flux public avec des valeurs non dérivées des données réelles |
| B15 | Étiquette xG affichée pour des buts moyens observés ; constante H2H=50 (10 % du score de fiabilité) | scripts/quick-update-predictions.mjs:689-691,720-729 | Champs nommés xgHome/xgAway sans être du xG ; pondération arbitraire | Trompe un visiteur non averti |
| B16 | Taux public de 79,4 % construit après reclassement de 546 exclusions ; journées affichées à 100 % dont les pertes restent dans les archives ; aucune justification par entrée (champ `reason` interdit par les tests) | scripts/update-win-history.mjs:343-347 ; public/history-exclusions.json ; deploy.yml:249-275 | Mécanisme d'exclusion automatisable à volonté | Le taux présenté à l'utilisateur est un chiffre curaté, non un taux brut — principal problème de confiance du produit |
| B17 | Sélections VIP contraintes à l'issue opposée du pick gratuit, quelle que soit la preuve | scripts/enrich_vip_candidates.py:220 ; scripts/vip-candidate-source.mjs:222 | Contrainte de différenciation imposée au prompt | Un utilisateur suivant les deux flux prendrait des paris symétriquement opposés ; présenté comme analyse, c'est une règle commerciale |
| B18 | Historique VIP affichant uniquement les WON (biais de survie) | src/app/vip/VipWinHistory.tsx:78,117 | Filtre volontaire sur la page monétisée | Présentation biaisée par omission |
| B19 | Vérification d'âge jamais montée | src/components/bttsbet/AgeVerification.tsx (0 import) | Composant prêt mais non branché dans le layout | Site d'affiliation de paris sans contrôle d'âge effectif |
| B20 | Politique de confidentialité muette sur GA4 et le flux VIP (données, destinataire worker, rétention 7 jours) | src/app/politique-confidentialite/page.tsx ; src/app/vip/VipJourneyModal.tsx:26,63 | Page légale non mise à jour quand le flux VIP et GA ont été ajoutés | Lacune RGPD la plus sérieuse |
| B21 | Versions légales anglaise et arabe réduites à 4 paragraphes | src/components/bttsbet/LocalizedLegalPage.tsx | Contenu localisé squelettique | Incohérence majeure avec les versions françaises sur un site trilingue |
| B22 | ~33 composants morts dont 2 flux VIP parallèles (VipApplication.tsx 412 lignes, VipClient.tsx 695 lignes) ; seoSchemas.ts (437 lignes) déconnecté mais gelé par test d'empreinte | src/components/bttsbet/, src/app/vip, src/lib/seoSchemas.ts | Accumulation de générations de design sans purge | Fausse la lecture du produit ; risque de réactivation accidentelle (ex. cotes fabriquées de VipSports.tsx:52-70, « taux 69-81 % » de HowToGetVip.tsx:69) |
| B23 | Dépendances fantômes : firebase, next-auth, react-router-dom, @mdxeditor/editor, @tanstack/react-query, zustand, z-ai-web-dev-sdk, next-intl (jamais importé) | package.json | Héritages de générations précédentes | Poids d'installation, surface de vulnérabilité inutile |
| B24 | skills/ (60 Mo d'outils IA) et 11 fichiers .pyc committés ; dépôt de 208 Mo pour moins de 20 Mo utiles | skills/ ; scripts/__pycache__ | Cause committé par erreur (HYPOTHÈSE sur l'origine) | Temps de clonage, quota Actions, lisibilité |

## Réserves sur le moteur de prédictions (confirmées, à ne pas confondre avec des bugs)

Ces éléments ne sont pas des erreurs de code : le code fait exactement ce qui est prévu. Ce sont des choix de conception qui affaiblissent la signification des chiffres publiés.

1. Le score de fiabilité pondère quatre composantes dont le face-à-face vaut une constante de 50 — un dixième du score est donc purement arbitraire.
2. Les champs `xgHome`/`xgAway` contiennent des buts moyens observés, pas des buts attendus.
3. Les cotes et probabilités de repli sont codées en dur lorsque les données réelles manquent.
4. Le prompt VIP impose l'issue opposée au pick gratuit (B17) : c'est une différenciation commerciale, pas une analyse indépendante.

---

## Détail narratif des constats (texte intégral des sections d'origine)

### Faiblesses de sécurité détaillées (source : section 5.2)

Cinq faiblesses concrètes ont été identifiées, classées par importance. La première est le contournement systématique de la vérification TLS sur le canal FTP : set ssl:verify no dans les scripts lftp et ssl_ctx.check_hostname=False dans ftp-inventory.py, pour un serveur dont le certificat n'est manifestement pas aligné. Les identifiants FTP (secrets GitHub) transitent donc sur une connexion chiffrée mais non authentifiée, ce qui rend théoriquement possible une attaque de l'intercepteur sur le canal de déploiement — c'est-à-dire sur le contenu public du site. La deuxième est l'incohérence de nommage qui maintient le test test_ftp_inventory.py hors de la CI : les workflows Python discoverent avec le motif *_test.py alors que ce fichier s'appelle test_*.py ; ses trois tests ne s'exécutent donc jamais.

La troisième faiblesse est le matching flou de verify-results.mjs (lignes 53 à 79) : la normalisation retire notamment les mots united et city, si bien que Manchester United et Manchester City se réduisent toutes deux à manchester, et le rattrapage par recouvrement de jetons peut attribuer un score au mauvais club homonyme. Un script correctif one-shot (recalculate-non-verdicts.mjs) documente qu'un incident de verdicts inversés a déjà eu lieu avant le 28 septembre 2026 ; aucun test ne couvre cette fonction. La quatrième est l'absence d'en-têtes Content-Security-Policy et Strict-Transport-Security dans public/_headers, ainsi que trois scripts inline dans le layout racine (dont un purgeur de service worker avec location.reload), qui rendent une CSP stricte impossible sans refactorisation. La cinquième est résiduelle : le Caddyfile committé expose un reverse proxy piloté par paramètre de requête (XTransformPort) — artefact d'environnement de développement qui ne doit jamais être déployé face à Internet — et le worker est exposé sur son domaine workers.dev par défaut (workers_dev: true), ce qui est acceptable mais superflu : la liaison au domaine principal réduirait la surface.

Enfin, la résistance à l'injection de contenu dans les JSON-LD est incomplète : les 43 usages de dangerouslySetInnerHTML injectent des données sérialisées sans échappement de la séquence </script> ; le contenu provient du pipeline interne (noms d'équipes et de ligues), donc le risque réel est faible, mais un échappement systématique de < éliminerait la classe entière de risque.

### Code mort et contexte d'authentification cassé (source : section 6.2)

L'analyse du graphe d'imports établit qu'environ 33 fichiers de src/components/bttsbet et de src/app/vip ne sont plus importés par aucune page : AgeVerification, StickyCTABar, LiveTicker, StickyVipBandeau, SiteLoader, CursorEffect, FloatingElements, NeuralBackground, MobileTabBar, ScrollProgressBar, PromoVip, VipSports, VipCardGlass, VipCardWidget, VipUnlockModal, VipLevelModal, FreePredictionsWidget, StatsDashboard, TrustPillars, HowItWorks, About, GlobalReach, HowToGetVip, LockedContent, SportMarquee, TiltCard, AnimatedIcons, VectorWordmark, PremiumButton, PartnerSignupBand, AffiliateSignupCta, HomeEditorial, ainsi que les deux flux VIP parallèles VipApplication.tsx (412 lignes) et VipClient.tsx (695 lignes). Ils ne gonflent pas le bundle (non importés) mais faussent toute lecture du produit et exposent au risque de réactivation accidentelle de contenus obsolètes : HowToGetVip contient encore l'affirmation « taux de réussite 69-81 % selon le sport », et VipSports fabrique des cotes quotidiennes pseudo-aléatoires entre 12 et 30 (fonction getDailyCote) présentées avec compteurs animés et badge Live. Le contexte d'authentification src/contexts/AuthContext.jsx est dans le même cas, en pire : jamais importé, il utilise la syntaxe Vite import.meta.env.VITE_FIREBASE_* qui ne peut pas fonctionner sous Next.js, sans directive use client ; il explique la présence fantôme de firebase, next-auth et react-router-dom dans les dépendances.

Deux bibliothèques présentées comme centrales sont en réalité déconnectées : seoSchemas.ts (437 lignes, constructeurs JSON-LD centralisés) n'est importé nulle part — chaque page redéfinit ses schémas localement — et un test de gel par empreinte empêche même son nettoyage. De même, next-intl figure dans package.json mais aucun import n'en est fait : l'internationalisation est un système maison (src/lib/i18n.ts et dictionnaires dupliqués par composant), avec des traductions fr/en/ar portées dans chaque composant, ce qui crée un risque de divergence entre langues.

### Anomalies fonctionnelles ciblées (source : section 6.4)

Bug d'animation : useAnimations.ts (ligne 104) inclut hasAnimated dans les dépendances de l'effet, ce qui relance le compteur après achèvement (retour à zéro puis recompte) ; affecte les compteurs de VipSports et de ResultatsClient.

Performance de build : getMatchBySlug dans src/lib/matches.ts relit l'intégralité des archives à chaque appel, et les pages de match l'appellent plusieurs fois ; le fichier importe aussi un script du pipeline (scripts/public-predictions.mjs), un couplage inverse code/scripts fragile.

Route redondante : src/app/predictions.json/route.ts re-sert public/predictions.json au build alors que le fichier est déjà copié et sanitisé — deux écrivains du même chemin de sortie, avec un cache s-maxage inopérant en hébergement statique.

Divergence de rendu FR/en/ar : les pages de prédictions racine sont ensemencées au build (HTML contenant les données) tandis que leurs équivalents [locale] ne le sont pas — le contenu prédictif manque du HTML exporté en anglais et en arabe, ce qui affaiblit le SEO de ces versions.

Script inline de rechargement : le purgeur de service worker du layout force location.reload() à chaque changement de VERSION ; un déploiement partiel peut provoquer des boucles de rechargement.

### Réserves sur le modèle statistique (source : section 7.1)

Le moteur réel (quick-update-predictions.mjs, 942 lignes, versions v91/v92) repose exclusivement sur des données ESPN réelles : probabilité BTTS d'un match = moyenne des taux BTTS observés sur les 5 derniers matchs de chaque équipe ; même méthode pour Over 2,5 ; abstention si moins de 4 matchs réels. Un historique de régression est documenté dans le code : les anciennes fonctions fabriquaient des statistiques à partir de hachages pseudo-aléatoires, elles ont été supprimées et un test dédié (no-invented-data.test.ts) interdit par inspection de source les motifs de fabrication connus. Ces garde-fous sont réels et méritent d'être soulignés — ils sont rares sur ce segment de produit.

Deux réserves limitent néanmoins la signification des chiffres publiés. D'une part, les replis quantifiés sont codés en dur lorsque les taux réels manquent : BTTS 0,62 ou 0,45 selon les buts moyens, Over 0,58/0,50/0,42 selon les totaux — des valeurs plausibles mais arbitraires, qui alimentent le flux normal. D'autre part, le score de fiabilité affiché à l'utilisateur pondère quatre composantes dont le face-à-face (H2H) vaut une constante de 50, soit un dixième du score purement arbitraire ; et les champs s'appellent toujours xgHome/xgAway alors que le code précise qu'il s'agit de buts moyens observés, pas de buts attendus (xG) : l'étiquette affichée dans l'interface est trompeuse pour un visiteur non averti.

### Couche Gemini et règle VIP (source : section 7.2)

enrich_predictions.py (668 lignes) est discipliné : prompt imposant l'abstention sous 4 matchs d'échantillon, bornes de probabilité 0,48-0,78 avec rejet au-delà de 0,40/0,90, interdiction explicite d'inventer statistiques, blessures ou face-à-face, réponse JSON stricte, traitement par paquets de 4, budget de 300 secondes, tentatives bornées respectant Retry-After. Avant chaque appel, tout pick préexistant du match est effacé sur disque (mark_no_gemini_pick) : si Gemini échoue, aucun choix local n'est publié et le workflow continue — le site ne peut pas montrer de pronostic non issu du modèle. La validation aval (filter-gemini-current-picks.mjs, validate-predictions.mjs --require-gemini) refuse toute ligne sans décision Gemini vérifiée. Le flux VIP suit la même logique via enrich_vip_candidates.py avec éligibilité stricte (qualité HIGH, 8 matchs minimum, coup d'envoi futur).

Une réserve d'ordre éthique majeure concerne la construction même des candidats VIP : le prompt d'enrichissement impose de ne jamais copier le pick gratuit et, si le même marché est considéré, de choisir exclusivement l'issue opposée. Les sélections VIP sont donc structurellement contraires aux pronostics publics sur le même marché, quelle que soit la force de la preuve : c'est une différenciation commerciale, pas une analyse indépendante. Un utilisateur qui suivrait à la fois le flux gratuit et le flux VIP prendrait des paris symétriquement opposés. Ce choix mérite d'être assumé explicitement dans la documentation produit, ou corrigé.

### Vérification des résultats et construction du taux de réussite (source : section 7.3)

La vérification s'appuie sur les scores finis ESPN (48 ligues) et TheSportsDB, uniquement aux statuts STATUS_FINAL/FULL_TIME, avec grâce de 48 heures pour les matchs non conclus. La logique de verdict (verdict.mjs) est pure, testée et correcte. La faiblesse du fuzzyMatch a été décrite en section 5.2. La construction de l'historique public (update-win-history.mjs, schéma v4) est par ailleurs rigoureuse : déduplication, politique pending documentée, suppression des anciens champs trompeurs (roi, yield, cotes moyennes — l'ancienne cote fictive de 1,90 a été retirée du schéma).

Le point sensible est ailleurs : le script applique public/history-exclusions.json (546 entrées) en reclassant chaque entrée exclue, perdante ou gagnante, en invérifiable, c'est-à-dire hors du dénominateur du taux public. Les données vérifiées montrent l'effet : win-history.json affiche 79,4 % (429 gagnés sur 540 retenus) avec des journées à 100 % (22/22 le 31 octobre, 8/8 le 3 novembre, 11/11 le 5 novembre, 24/24 le 7 novembre), précisément les journées dont les pertes ont été exclues ; l'archive du 5 novembre conserve la trace publique d'une perte réelle (Bayer Leverkusen - Marseille, BTTS Oui, 0-1, LOST, GOLD) absente de l'historique affiché. Le fixture de test confirmed-removed-history-losses.json documente 164 pertes retirées, et le workflow verrouille ces exclusions par compteurs en dur — toutefois, ni le fichier d'exclusions ni le fixture ne portent de justification par entrée (le champ reason est explicitement interdit par les tests). Le mécanisme est automatisable à volonté : ajouter une clé au fichier fait disparaître une perte du taux affiché. Même si des victoires ont également été exclues (argument d'équité vérifié) et que les archives demeurent auditable, le taux de 79,4 % présenté à l'utilisateur est un chiffre curaté, non un taux brut.

### Lacunes de conformité (source : section 8.2)

Politique de confidentialité incomplète (constat le plus sérieux) : elle ne mentionne ni Google Analytics, ni le traitement VIP — identifiant bookmaker, montant de dépôt, pseudonyme Telegram ou numéro WhatsApp, et capture d'écran de dépôt envoyés au worker personnel bttspredict-vip-production-api.luxxdii.workers.dev — ni la rétention de 7 jours qui n'est annoncée que dans la modale d'inscription. Le flux est pourtant soigné (consentements explicites versionnés, preuves plafonnées, purge automatique), mais il n'est documenté nulle part côté utilisateur.

Vérification d'âge inactive : le composant AgeVerification (porte 24 heures, refus = sortie) n'est monté nulle part. Un site d'affiliation de paris opère donc en ligne sans contrôle d'âge effectif, alors que le composant existe.

Versions légales anglaise et arabe squelettiques : LocalizedLegalPage sert quatre sections d'un paragraphe chacune, sans durées, canaux ni bases légales — une incohérence majeure avec les versions françaises sur les trois langues d'un même site.

Accès VIP conditionné à un dépôt financier : l'accès premium exige un dépôt d'au moins 3 USD chez un bookmaker affilié avec preuve de dépôt — schéma d'incitation au dépôt lié à l'affiliation, présenté honnêtement dans la modale mais qui constitue une contrepartie financière à assumer juridiquement (et commercialement).

Affirmations commerciales invérifiables : traductions affichant « N°1 Mondiale » et « 300 % worldwide confirmé » (src/lib/i18n.ts), FAQ partenaires posant le bonus de 300 % comme un fait dans le JSON-LD FAQPage ; toggle advertising du consentement décoratif (aucun script public ne le lit) ; badge Live heuristique dans le composant mort LiveTicker.

Historique VIP biaisé : la page VIP affiche sous le titre Historique VIP uniquement les entrées WON de l'historique général, sans pertes ni taux — présentation biaisée par omission sur la page monétisée.

Précision importante sur les cotes fabriquées : la fonction getDailyCote de VipSports.tsx (cotes pseudo-aléatoires 12-30, badge Live, « 8 matchs » en dur) se trouve dans un composant mort, jamais monté — le site actuel ne l'affiche donc pas. Le risque est celui d'une réactivation accidentelle d'un composant présent dans le barrel d'exports ; sa suppression ou sa correction est recommandée avant toute réutilisation.
