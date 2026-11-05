# BTTSPredict — plateforme de pronostics football

> **Production :** [https://bttspredict.com](https://bttspredict.com) · **Langues :** français, anglais, arabe · **Public :** amateurs de football, avec une expérience mobile prioritaire, notamment en Afrique de l’Ouest.

BTTSPredict est une plateforme d’information et de pronostics football, avec des liens d’affiliation vers des bookmakers partenaires. Ce n’est pas un bookmaker : le site ne prend pas de mises et ne garantit aucun résultat. Ce README documente les fonctions visibles, les routes, les données, les limites opérationnelles, les règles du propriétaire et le brief de design afin de donner une référence factuelle du produit actuel.

## Le projet en bref

Le produit publie des pronostics gratuits sur trois marchés : **BTTS** (« les deux équipes marquent »), **Over 2,5 buts** et **scores exacts**. Il comprend aussi un Match Center, un générateur de combinés, un espace VIP verrouillé, des pages de promotion partenaires, des résultats vérifiés, un historique, des statistiques, une méthodologie et des pages légales.

Les données quotidiennes sont publiées dans des fichiers publics, notamment `predictions.json`; les résultats et l’historique sont conservés dans des archives et `win-history.json`. Les sources football identifiées dans le projet sont ESPN et TheSportsDB. Le moteur statistique produit des estimations à partir de données de matchs; certains champs ou cotes peuvent être estimés lorsque la donnée source n’existe pas. L’interface doit différencier les valeurs réelles des estimations et ne jamais fabriquer de statistiques ou de cotes. Les résultats passés, gagnants comme perdants, doivent rester transparents.

L’appellation « AI Combo Builder » désigne un outil interactif de combinés. Son mécanisme actuel est déterministe, pas un chatbot ni une IA conversationnelle. Dans le code de référence, l’utilisateur choisit une cote cible (1,80 / 2,50 / 3,00 / 5,00 / 8,00) et un nombre de matchs de 2 à 5; l’outil assemble des sélections disponibles sur des rencontres à venir et affiche des estimations combinées. Toute mise ou tout retour affiché doit être clairement présenté comme une simulation, jamais comme un gain attendu ou garanti.

## Fonctionnalités et parcours utilisateur actuels

- **Accueil et Match Center (`/`) :** les composants client chargent les flux publics `/predictions.json` et `/win-history.json`. Le tableau permet de filtrer par période (aujourd’hui, demain, semaine), marché et compétition, distingue les rencontres à venir et terminées, puis mène à l’analyse de match lorsqu’elle existe. Les heures sont présentées dans le contexte GMT/Dakar; le compte à rebours local se rafraîchit périodiquement.
- **Tableaux de pronostics :** `/btts/predictions/today` (avec l’alias `/pronostics`) regroupe les marchés par rencontre et propose des filtres; `/over-2-5/predictions/today` affiche les sélections Over 2,5; `/btts-and-over-2-5-predictions-today` rassemble BTTS et Over 2,5. Les interfaces lisent les probabilités publiées, elles ne les recalculent pas dans le navigateur. Les champs disponibles varient selon les données du match.
- **Score exact et pages de match :** `/ai-correct-score-predictions` affiche les estimations disponibles dans les données publiques; le mot « AI » dans l’URL n’assure pas qu’un modèle soit appelé en temps réel ni que le score soit exact. `/match/{slug}` présente une analyse construite à partir des données de la rencontre et des archives disponibles; une page n’est générée que lorsqu’un match correspondant existe.
- **Demain :** `/btts/predictions/tomorrow` est actuellement une page d’information qui renvoie vers le tableau du jour après publication; elle ne constitue pas un flux autonome de prédictions pour demain.
- **Combinés :** le Combo Builder tourne localement dans le navigateur. Il choisit 2 à 5 matchs à venir, évite de reprendre deux fois le même match, assemble des sélections selon des objectifs de cote prédéfinis et permet de copier le résumé. Les cotes et totaux combinés peuvent être estimés; il ne consulte pas les cotes en direct et ne crée ni ticket bookmaker ni pari.
- **Résultats, historique et statistiques :** `/resultats-verifies`, `/historique` et `/statistiques` lisent l’historique public. Les pages BTTS et Over 2,5 ont aussi leurs routes de statistiques. Une rencontre peut rester en attente si aucun score final n’est rapproché; les tendances dépendent du volume retenu et ne prédisent pas les résultats futurs.
- **Navigation :** la barre supérieure relie Match Center, tableaux de pronostics, scores exacts, résultats, statistiques, historique, méthodologie et VIP. La navigation basse mobile privilégie l’accueil, les pronostics et le VIP. Les liens vers les pages légales, guides partenaires et pages d’information sont regroupés dans les menus et pieds de page.

## État du site et du travail de design

Le sitemap public consulté le **4 novembre 2026** contenait **61 URL** : 19 familles disponibles en français, anglais et arabe (57 URL), plus 4 familles uniquement en français. Le générateur source `src/app/sitemap.ts` suit cette même structure. Le français utilise les chemins sans préfixe, l’anglais `/en` et l’arabe `/ar`; le nombre observé en production est un instantané daté, à vérifier après toute publication.

À la révision de ce README, le 5 novembre 2026, la dernière publication publique confirmée demeure le run **#1041**, commit `466cc84`. Le run **#1048** (`42033003173`) a été annulé avant le transfert. Le run **#1049** (`42037614558`) a obtenu 0/37 décisions Gemini après 24 erreurs fournisseur 503, conservé le fallback local, puis a passé le build et atteint la préparation FTP avant d’être annulé avant le transfert. Le run **#1050** (`42042448424`) a appliqué 0/37 décisions Gemini après 39 erreurs 503; le fallback local a couvert les 37 matchs. Il a été annulé pendant la mise à jour du contexte d’équipes, avant validation finale, build, commit des données et toute étape FTP. Aucun de ces runs ne prouve que sa version est en ligne. Un commit, un build réussi ou des artefacts locaux ne prouvent pas une publication : vérifier une conclusion FTP réussie et les pages publiques avant d’annoncer une version plus récente. Des essais visuels locaux ne constituent pas une refonte approuvée ou publiée. Les douze anciennes maquettes alternatives ont été rejetées. Le travail visuel sur le Match Center et le tableau quotidien est en pause pendant que Meta formule une direction unique pour l’ensemble du site.

**Aucune direction artistique globale n’est actuellement sélectionnée ou publiée.** Le propriétaire veut d’abord lire la proposition de Meta, puis faire réaliser un aperçu local par l’équipe BTTSPredict. Il décidera ensuite s’il approuve l’aperçu ou demande des modifications. Rien ne sera publié ni déployé avant son approbation explicite des captures finales en FR/EN/AR, sur mobile et desktop.

## Technologie et développement

- Next.js 16.1.3 avec App Router et export statique (`output: "export"`), React 19, TypeScript 5 et Tailwind CSS 4.
- `next-intl` pour les locales; l’arabe doit être mis en page en vrai RTL, et non simplement traduit sur une grille LTR.
- Framer Motion est disponible pour les animations; respecter `prefers-reduced-motion` et l’accessibilité clavier.
- Vitest pour les tests, ESLint pour le lint et TypeScript pour le typecheck.
- GitHub Actions pour les contrôles et la production. Les identifiants de déploiement sont stockés dans les secrets GitHub et ne doivent jamais être copiés dans la documentation.

Commandes présentes dans le dépôt :

```bash
npm ci --legacy-peer-deps
npm run dev            # http://localhost:3000
npm test               # Vitest
npm run lint            # ESLint
npx tsc --noEmit        # vérification TypeScript
npm run build           # build Next.js / export statique
npm run start           # sert le dossier exporté, si disponible
```

## Analyse des pronostics avec Gemini

Le workflow utilise `google-genai==2.34.0` et `gemini-flash-lite-latest` comme unique modèle Gemini. Les demandes sont traitées séquentiellement par lots de trois matchs, avec deux retries applicatifs supplémentaires au maximum. Seuls les HTTP 429 et les erreurs 500, 502, 503 et 504 sont repris; les 4xx permanents et les réponses JSON inutilisables passent directement au fallback. Le délai suit un backoff exponentiel borné à 20 secondes, avec jitter; pour 429, le script tient compte de `Retry-After` s’il est fourni. Aucune pause n’est faite après le dernier essai. La version SDK épinglée, 2.34.0, effectue une seule tentative quand `retry_options` est absent; les retries du script constituent donc l’unique couche de reprise. Le budget d’analyse reste de 420 secondes et l’étape GitHub Actions de 10 minutes. Aucun autre fournisseur n’est ajouté.

Gemini reste la source principale. Le script exploite les statistiques déjà disponibles (sans calcul de Poisson), demande une décision BTTS/Over 2,5/combinaison ou une abstention, puis valide la réponse selon le schéma et les garde-fous du code. Une réponse exploitable, y compris une abstention explicite, est conservée. Le calcul empirique local ne sert que pour un match lorsque Gemini échoue ou ne fournit pas de résultat exploitable; ce n’est pas un second fournisseur d’IA.

Repère historique, et non promesse de durée ou de performance : au run GitHub Actions **#937** (`41133809785`), Gemini a traité **40/40** décisions en **2 min 04 s**; deux matchs ont utilisé le fallback empirique local. Un 503 transitoire sur un lot a été récupéré par le retry du même modèle. Les prochaines exécutions doivent être contrôlées dans leurs propres journaux.

## Données, résultats et cycle de publication

Le site est exporté en pages statiques. Les interfaces lisent des fichiers JSON publics au lieu de recalculer les pronostics à chaque visite : `public/predictions.json` pour les matchs et sélections libres, `public/win-history.json` pour les résultats et statistiques, et `public/predictions-archive/` pour les instantanés de pronostics. La route `/predictions.json` et les scripts de nettoyage limitent l’export aux données autorisées; les champs VIP et les combos VIP ne doivent pas être exposés dans les JSON publics, archives, HTML ou JavaScript.

Le workflow complet `.github/workflows/deploy.yml` commence par limiter les archives aux 90 fichiers récents, puis `scripts/quick-update-predictions.mjs` interroge les calendriers et statistiques ESPN pour aujourd’hui et une fenêtre de dates à venir. Les plafonds configurés sont jusqu’à 24 matchs gratuits du jour et 8 par jour futur, avec au plus cinq jours futurs; le nombre réel dépend des calendriers, des statistiques disponibles, des règles de qualité et de la disponibilité de la source. La validation vérifie notamment la date Dakar, l’horodatage, le schéma et les bornes. Une journée sans données admissibles peut rester vide plutôt que d’inventer des rencontres.

Après l’enrichissement Gemini, `scripts/finalize-predictions.mjs` archive et protège les sélections déjà publiées selon les règles d’immutabilité du projet. `scripts/verify-results.mjs` cherche les scores finaux ESPN, avec TheSportsDB en secours, et conserve un état en attente si le score ou le match n’est pas rapproché; le rapprochement des noms est heuristique et des vérifications peuvent manquer en cas d’indisponibilité ou de timeout. `scripts/update-win-history.mjs` agrège l’historique, déduplique les entrées et applique une période de grâce de 48 heures. Les cas non vérifiables restent dans les archives mais ne sont pas comptés comme gagnés ou perdus dans les totaux publics. L’élagage et la vérification sont bornés aux 90 archives conservées.

La collecte de transferts et la mise à jour du contexte d’équipes sont des étapes auxiliaires « best effort »; elles ne garantissent ni fraîcheur ni exhaustivité. Avant publication, le workflow relance les tests, le lint et le typecheck, valide les données, construit l’export statique, corrige les attributs `lang` des pages EN/AR et commet les données générées.

## Déclencheurs et déploiement

Le workflow principal s’exécute sur les push vers `main` (hors push limité aux fichiers `public/**`), selon un calendrier toutes les trois heures, et sur lancement manuel en mode `full` ou `code`. Les pull requests exécutent des contrôles — tests, lint, typecheck et build — sans déployer. Les exécutions d’une même référence sont sérialisées; un run en cours n’est pas annulé par un nouveau run. Le mode `code` saute la collecte et l’enrichissement des données, mais construit et déploie le code selon l’allowlist prévue.

La publication utilise un plan différentiel, une pré-vérification FTP, un manifeste et une allowlist de fichiers validés. Elle attend cinq minutes avant l’envoi pour limiter la fréquence des accès, n’effectue pas de miroir ni de suppression générale, et limite les suppressions de pages anciennes aux chemins Match EN/AR autorisés. `robots.txt` et `sitemap.xml` sont sauvegardés avant transfert et peuvent être restaurés si celui-ci échoue; `.htaccess` est traité séparément après l’envoi principal. Les preuves de déploiement sont conservées comme artefact, puis IndexNow est tenté sans bloquer le site. Seule une étape FTP réussie suivie d’un contrôle public confirme que le nouveau site est en ligne.

## Langues, navigation et SEO technique

Le français est la locale par défaut et conserve les chemins sans préfixe; l’anglais utilise `/en`, l’arabe `/ar`. `src/lib/i18n.ts` fixe le sens arabe en RTL et `LanguageSwitcher` s’appuie sur le chemin courant. Les pages localisées sont définies sous `src/app/[locale]`; le script `scripts/fix-html-lang.mjs` ajuste les attributs de langue du HTML exporté. La présence d’une route localisée ne garantit pas que chaque libellé de chaque composant soit traduit : vérifier les écrans FR/EN/AR, en particulier les formulaires et composants réutilisés.

Le sitemap source comporte 23 familles : 19 avec variantes FR/EN/AR et quatre en français seulement; les entrées localisées reçoivent des alternates hreflang dans le générateur. Les métadonnées et canonicals sont toutefois définis page par page et ne sont pas tous configurés de façon uniforme. Le fichier source `public/robots.txt` autorise le crawl général, exclut `/api/` et `/admin`, et déclare le sitemap. La route de détail Match, les alias `/pronostics` et `/linebet-promo-code`, les JSON et les archives sont des routes ou données auxiliaires, pas nécessairement des URL du sitemap.

## Inventaire complet des routes canoniques du sitemap

Le tableau ci-dessous liste les **23 familles** du sitemap source. Pour les 19 familles marquées « FR/EN/AR », le chemin indiqué est celui du français; le chemin anglais est `/en` + ce chemin et le chemin arabe `/ar` + ce chemin. Exemple : `/vip`, `/en/vip`, `/ar/vip`. L’accueil est l’exception : `/`, `/en`, `/ar`. Les quatre dernières lignes sont en français seulement. Cette notation correspond à 61 URL dans la source vérifiée; le sitemap effectivement en production doit être contrôlé après déploiement.

| Famille et chemin français | Langues dans le sitemap | Fonction de la page |
|---|---|---|
| `/` | FR `/`, EN `/en`, AR `/ar` | Accueil et Match Center : entrée vers les matchs analysés, les pronostics du moment et le générateur de combinés. |
| `/btts/predictions/today` | FR/EN/AR | Pronostics BTTS du jour : cartes de match, informations de rencontre, probabilités disponibles et filtres de consultation. |
| `/over-2-5/predictions/today` | FR/EN/AR | Pronostics du jour sur plus de 2,5 buts, avec les mêmes conventions de rencontre, données et cartes. |
| `/btts-and-over-2-5-predictions-today` | FR/EN/AR | Vue combinée des marchés BTTS et Over 2,5 pour les rencontres du jour. |
| `/ai-correct-score-predictions` | FR/EN/AR | Estimations statistiques de scores exacts, jamais présentées comme des certitudes. |
| `/resultats-verifies` | FR/EN/AR | Résultats des pronostics vérifiés après les matchs. |
| `/historique` | FR/EN/AR | Archives et performances passées; garder les résultats gagnants et perdants visibles. |
| `/vip` | FR/EN/AR | Présentation du service VIP, aperçu de marchés verrouillés et parcours d’accès; ne pas révéler les vraies sélections ni leurs cotes. |
| `/code-promo-1xbet` | FR/EN/AR | Page promotionnelle dédiée à 1xBet et à son code partenaire. |
| `/code-promo-linebet-senegal` | FR/EN/AR | Page promotionnelle dédiée à Linebet. L’offre confirmée par le propriétaire est mondiale malgré le libellé historique « Sénégal » de l’URL. |
| `/code-promo-melbet` | FR/EN/AR | Page promotionnelle dédiée à MelBet et à son code partenaire. |
| `/bonus-888starz` | FR/EN/AR | Page promotionnelle générale 888Starz. |
| `/bonus-888starz-btts221` | FR/EN/AR | Page dédiée au code partenaire 888Starz `btts221`. |
| `/statistiques` | FR/EN/AR | Vue générale des statistiques du service; n’afficher que des mesures étayées et expliquer leur période. |
| `/methodologie` | FR/EN/AR | Explication du modèle, des données, des estimations et de leurs limites. |
| `/cgu` | FR/EN/AR | Conditions générales d’utilisation. |
| `/politique-confidentialite` | FR/EN/AR | Politique de confidentialité. |
| `/mentions-legales` | FR/EN/AR | Mentions légales. |
| `/jouer-responsable` | FR/EN/AR | Jeu responsable, mentions 18+ et ressources d’aide. |
| `/btts-c-est-quoi` | FR seulement | Guide pédagogique expliquant le marché BTTS. |
| `/btts/predictions/tomorrow` | FR seulement | Page d’information qui renvoie vers le tableau du jour après publication; pas de flux indépendant de pronostics de demain. |
| `/btts/statistics` | FR seulement | Statistiques consacrées au marché BTTS. |
| `/over-2-5/statistics` | FR seulement | Statistiques consacrées au marché Over 2,5. |

Autres familles présentes dans le code mais **hors des 61 URL du sitemap** : les pages dynamiques de détail de rencontre `/match/{slug}` et leurs variantes localisées `/{locale}/match/{slug}`; les routes auxiliaires `/pronostics` et `/linebet-promo-code`, dont le comportement actuel doit être vérifié avant tout changement SEO; les données `/predictions.json`, `/win-history.json`, les archives JSON, `/sitemap.xml`, `/robots.txt` et la page 404. Les pages de match réutilisent la même grammaire de données et de cartes que le reste du produit.

## Règles produit confirmées par le propriétaire

Ces choix sont la référence pour toute proposition de contenu ou de design et prévalent sur les formulations anciennes visibles sur certaines pages publiques ou dans le code.

- **Pronostics gratuits :** BTTS, Over 2,5 et scores exacts. Pas d’inscription forcée pour les consulter. Les cartes peuvent montrer discrètement les logos ou liens partenaires dans cet ordre : **1xBet → Linebet → MelBet → 888Starz**. Aucun code promo dans les cartes gratuites, les popups, la navigation générale ou la page VIP générale; les codes sont réservés aux pages promotionnelles dédiées.
- **Teaser VIP dans chaque carte gratuite :** afficher exactement deux marchés VIP génériques et verrouillés. Le bouton « Débloquer » ouvre le formulaire VIP existant; l’approbation manuelle du propriétaire reste obligatoire. Ne pas y montrer de vrais marchés, sélections, cotes, probabilités ou métadonnées VIP : les autres marchés VIP et les pronostics VIP futurs restent privés et ne doivent pas apparaître dans les exports publics.
- **Aperçu VIP :** marchés éventuellement floutés ou verrouillés; ne pas révéler les vrais choix VIP ni les cotes avant le déblocage.
- **Accès VIP :** service à vie après création d’un nouveau compte 1xBet ou Linebet via le parcours et le code du propriétaire, avec approbation manuelle. Un dépôt est requis pour le VIP, mais aucun montant n’est spécifié dans ce brief. BTTSPredict ne demande ni pièce d’identité, ni contrôle d’identité, ni identifiant de joueur. Le coupon quotidien est délivré par e-mail ou WhatsApp; cela ne doit pas devenir une demande d’identifiant ou une vérification d’identité. Certaines versions encore visibles du parcours VIP contiennent un seuil de dépôt chiffré et une vérification WhatsApp avec identifiant : ce texte ancien n’est pas approuvé et ne doit pas être repris. Ne mentionner aucun dépôt dans un popup ou une page promotionnelle; n’inventer aucun montant. La page VIP générale peut renvoyer vers la page promo dédiée pour obtenir le code, sans l’afficher.
- **Promotions :** le propriétaire confirme un bonus de **300 % dans le monde entier** pour les quatre partenaires. Ne pas ajouter de plafond, tours gratuits, durée, condition ou autre terme non confirmé. La page Linebet actuellement visible mentionne « 100 free spins »; c’est du contenu observé, **pas une condition vérifiée**, et il ne faut pas le reprendre. Ne présente pas les offres comme garanties au-delà du 300 % confirmé; invite à vérifier les conditions officielles du partenaire.

- **Codes et liens approuvés** (casse exacte; pour les pages dédiées correspondantes seulement) :

| Partenaire | Code | Lien partenaire |
|---|---|---|
| 1xBet | `vipbtts` | `https://reffpa.com/L?tag=d_6292935m_1599c_&site=6292935&ad=1599` |
| Linebet | `VISION221` | `https://lb-aff.com/L?tag=d_5589568m_22611c_&site=5589568&ad=22611` |
| MelBet | `Bttswin` | `https://refpa3665.com/L?tag=d_6293054m_2170c_&site=6293054&ad=2170` |
| 888Starz | `btts221` | `https://888ghta.com/8hwF6V` |

- **Transparence :** ne jamais inventer une probabilité, statistique, cote, sélection, résultat, avantage ou promesse de gain. Éviter « sûr », « garanti » et « immanquable ». Les performances passées ne garantissent pas les résultats futurs.
- **Jeu responsable :** mention visible 18+, avertissement que les paris comportent un risque, ton non pressant et ressources de prévention accessibles dans toutes les langues.

### Comportement actuel des liens partenaires et du parcours VIP

Les pages de promotion ouvrent les sites partenaires via des liens externes affiliés, marqués dans le code comme liens sponsorisés et non suivis par les moteurs de recherche. Le suivi interne mesure des actions de l’entonnoir (par exemple l’affichage ou le clic d’un CTA) selon les règles de consentement analytics; il ne confirme pas qu’un compte a été créé, qu’un dépôt a eu lieu ou qu’un partenaire a validé une conversion. Ces vérifications relèvent de l’opérateur. BTTSPredict ne prend pas de pari, ne détient pas de fonds et ne traite pas les transactions du bookmaker.

La page VIP est une présentation publique avec aperçu verrouillé et un formulaire/parcours de demande. Un clic, un formulaire ou une déclaration ne débloque rien automatiquement : l’approbation du propriétaire reste manuelle. Une étape peut ouvrir WhatsApp avec un texte prérempli, mais le site ne l’envoie pas à la place de l’utilisateur. Le code actuel contient encore certaines étapes historiques qui ne constituent ni une vérification opérateur ni une condition approuvée; elles ne doivent pas être reformulées comme des exigences officielles. La sélection des lignes VIP s’appuie sur des marqueurs VIP explicites; les tests de frontière publique vérifient le retrait des champs VIP et combos des exports. Cette séparation des données ne doit pas être présentée comme un système complet de comptes ou d’autorisations côté serveur.

### SEO à protéger

Ne pas changer les URL, canonicals, titres SEO, descriptions ni textes qui contribuent au classement sans justification précise par des données Search Console actuelles. Cinq routes sont particulièrement protégées : `/`, `/en`, `/en/btts-and-over-2-5-predictions-today`, `/en/over-2-5/predictions/today` et `/en/ai-correct-score-predictions`. Les instantanés Search Console disponibles se contredisent sur certains totaux; les deux montrent zéro clic français Linebet/888Starz, tandis que les données 1xBet/MelBet sont trop limitées pour conclure à un échec. Ne choisis pas arbitrairement un total et ne promets aucun gain de position ou de CTR.

## Référence visuelle actuelle

La CSS publiée utilise une base sombre et sportive : fond noir `#000000`, surfaces `#0A0A0C` et cartes `#141C25`, bordures `#223041`, texte principal `#F2F6FA`, texte secondaire `#9DABBB`, bleu d’action `#2F7DFF`, accent BTTS cyan `#45C7F7`, accent Over 2,5 bleu `#5BA9FF`, accent VIP or chaud `#E8C268` et vert de validation `#34D399`. C’est un point de départ pour reconnaître la marque, pas une consigne de recopier exactement l’interface existante : le propriétaire souhaite que Meta propose sa propre touche, palette et présentation tout en gardant BTTSPredict reconnaissable.

## Prompt Meta

**Envoyer le bloc ci-dessous à Meta. Il est autonome et ne requiert aucune pièce jointe. Meta doit d’abord lire le README entier, puis expliquer sa vision artistique par écrit; il ne doit pas dessiner les maquettes.**

```text
RÔLE ET PREMIÈRE ÉTAPE
Tu es directeur artistique senior spécialisé en produits sportifs numériques et en interfaces premium. Avant de répondre, lis intégralement le README de ce dépôt, du début à la fin, afin de comprendre BTTSPredict, chaque famille de pages, ses données, ses règles et son statut. Ne te limite pas au titre ou à cette section. Le brief est autonome : si tu ne peux pas parcourir les autres fichiers du dépôt, n’en réclame pas et travaille uniquement à partir des informations du README.

MISSION — EXPLIQUER TA DIRECTION, PAS FAIRE LES MAQUETTES
Après avoir compris le projet, propose UNE seule direction artistique globale pour toute la plateforme BTTSPredict. Décris ta vision avec précision : concept et personnalité, palette de couleurs, nuances et contrastes, textures et traitements de matière, typographies, espaces, hiérarchie, principes de mise en page, composants, navigation, présentation de chaque famille de pages et langage d’animation/mouvement. Explique comment un même système peut être cohérent sur tout le site tout en donnant à chaque page une hiérarchie adaptée à son usage.

Ne produis AUCUNE maquette visuelle, image, prototype, code, HTML/CSS, patch ou modification du dépôt. Ne proposes pas six variantes : donne un thème global cohérent, une seule proposition expliquée. L’équipe BTTSPredict construira ensuite elle-même un aperçu/une maquette locale à partir de tes recommandations. Le propriétaire examinera cette version locale et décidera s’il l’approuve ou demande des changements. Rien ne sera publié ni déployé avant l’approbation explicite du propriétaire des captures finales localisées.

LE PRODUIT ET SON PUBLIC
BTTSPredict (https://bttspredict.com) est une plateforme d’information et de pronostics de football avec affiliation partenaire; ce n’est pas un bookmaker, ne prend pas de paris et ne garantit aucun gain. Le public est surtout mobile, francophone ou anglophone, principalement en Afrique de l’Ouest. Il existe aussi une version arabe, qui doit être une véritable expérience RTL. Les locales sont FR, EN et AR.

Le produit couvre gratuitement BTTS (les deux équipes marquent), Over 2,5 buts et scores exacts. Les données viennent du système football de BTTSPredict, qui utilise notamment ESPN et TheSportsDB, des fichiers de pronostics quotidiens et un historique des résultats. Les probabilités sont des estimations statistiques. Certaines cotes sont issues d’une source disponible et d’autres peuvent être des estimations : ne les confonds pas et n’invente aucune valeur. Les résultats gagnants et perdants restent visibles dans l’historique.

Le Match Center affiche les rencontres disponibles, des filtres de période, les horaires/états de match et des cartes qui peuvent lier vers le détail d’une rencontre. Le Combo Builder porte le nom « AI », mais son mécanisme actuel est déterministe : l’utilisateur choisit une cote cible et un nombre de matchs de 2 à 5, puis l’outil assemble des choix disponibles sur des matchs futurs et présente des estimations combinées. Ce n’est pas un chatbot. Toute mise ou tout retour affiché est une simulation, jamais une promesse.

LES FAMILLES DE PAGES À PRENDRE EN COMPTE
Le sitemap public contient 61 URL : 19 familles localisées en français, anglais et arabe (chemin sans préfixe en FR, /en en EN, /ar en AR), puis quatre familles en français seulement. Comprends et adresse chacune de ces pages ou familles :
• Accueil (/, /en, /ar) et Match Center avec Combo Builder.
• Pronostics BTTS du jour (/btts/predictions/today), Over 2,5 du jour (/over-2-5/predictions/today), et vue combinée BTTS + Over 2,5 (/btts-and-over-2-5-predictions-today).
• Scores exacts (/ai-correct-score-predictions).
• Résultats vérifiés (/resultats-verifies) et historique/archive (/historique).
• Espace VIP avec aperçu verrouillé (/vip).
• Les pages partenaires séparées : 1xBet (/code-promo-1xbet), Linebet (/code-promo-linebet-senegal), MelBet (/code-promo-melbet), 888Starz générale (/bonus-888starz) et 888Starz dédiée au code btts221 (/bonus-888starz-btts221).
• Statistiques générales (/statistiques) et méthodologie (/methodologie).
• Conditions (/cgu), confidentialité (/politique-confidentialite), mentions légales (/mentions-legales) et jeu responsable (/jouer-responsable).
• Pages françaises seulement : guide BTTS (/btts-c-est-quoi), pronostics BTTS de demain (/btts/predictions/tomorrow), statistiques BTTS (/btts/statistics) et statistiques Over 2,5 (/over-2-5/statistics).
• Détail dynamique d’un match (/match/{slug}), aussi localisé lorsqu’il existe.

RÈGLES PRODUIT DU PROPRIÉTAIRE — À RESPECTER
1. Les contenus gratuits sont BTTS, Over 2,5 et scores exacts, sans inscription obligatoire. Les cartes gratuites peuvent montrer discrètement les logos/liens 1xBet, Linebet, MelBet, 888Starz dans cet ordre; jamais de code promotionnel sur les cartes.
2. Le VIP est un accès à vie après création d’un nouveau compte partenaire 1xBet ou Linebet avec le code du propriétaire, puis approbation manuelle. Un dépôt est requis uniquement pour VIP, sans montant précisé dans ce brief. BTTSPredict ne demande ni pièce d’identité, ni vérification d’identité, ni identifiant joueur. Le coupon quotidien est envoyé par e-mail ou WhatsApp; ne le transforme pas en vérification d’identité ou demande d’identifiant. Certaines anciennes versions du parcours VIP affichent encore un seuil de dépôt chiffré et une validation WhatsApp avec identifiant; ces formulations ne sont pas approuvées et ne doivent pas être reproduites. N’évoque aucun dépôt dans une popup ou une page promotionnelle. Sur la page VIP générale, renvoie vers la page promo dédiée pour le code sans y afficher le code. Les vrais marchés VIP et leurs cotes doivent rester floutés/verrouillés dans l’aperçu.
3. Le propriétaire confirme un bonus de 300 % dans le monde entier pour chacun des quatre partenaires. N’invente aucun plafond, spin gratuit, durée, seuil ou terme supplémentaire. La page Linebet actuellement visible mentionne « 100 free spins »; cette mention n’est pas vérifiée, ne la présente pas comme un avantage confirmé.
4. Codes et liens approuvés, casse exacte, à utiliser uniquement sur les pages promo dédiées :
   • 1xBet — vipbtts — https://reffpa.com/L?tag=d_6292935m_1599c_&site=6292935&ad=1599
   • Linebet — VISION221 — https://lb-aff.com/L?tag=d_5589568m_22611c_&site=5589568&ad=22611
   • MelBet — Bttswin — https://refpa3665.com/L?tag=d_6293054m_2170c_&site=6293054&ad=2170
   • 888Starz — btts221 — https://888ghta.com/8hwF6V
5. N’invente aucun match, prédiction, probabilité, cote, résultat, statistique, bonus ou garantie de gain. Ne qualifie jamais un pari de « sûr » ou « garanti ». Les performances passées ne garantissent pas les résultats futurs.
6. Rends la mention 18+, les risques de paris et le jeu responsable visibles et compréhensibles, sans pousser à déposer ou parier.

COULEURS EXISTANTES ET LIBERTÉ CRÉATIVE
L’interface actuelle fournit une référence sombre : fond noir (#000000), panneaux #0A0A0C et #141C25, bordures #223041, texte #F2F6FA et secondaire #9DABBB, bleu #2F7DFF, cyan BTTS #45C7F7, bleu Over #5BA9FF, or VIP #E8C268, vert #34D399. Le propriétaire t’autorise à proposer tes propres couleurs, nuances, textures et finitions; ne te contente pas de recopier ces valeurs. Garde toutefois une identité BTTSPredict reconnaissable et explique comment ta proposition s’appuie sur l’existant ou le fait évoluer.

Le résultat recherché est une plateforme premium, moderne, fluide, très claire et simple à comprendre — un dashboard sportif, pas un blog, un magazine ou une page éditoriale. Décris des principes réellement responsive mobile et desktop, une hiérarchie simple, des composants réutilisables et des transitions utiles plutôt que décoratives. Pour AR, précise comment le système devient RTL (alignements, ordre, sens des flèches, nombres, tableaux et navigation), pas seulement traduit. Les animations doivent rester subtiles, rapides, accessibles et respecter la réduction des mouvements.

GARDE-FOUS SEO ET DONNÉES
Ne propose aucun changement d’URL, de canonical, de titre/meta description ou de contenu qui soutient le référencement sans données Search Console actuelles. Les cinq pages particulièrement protégées sont /, /en, /en/btts-and-over-2-5-predictions-today, /en/over-2-5/predictions/today et /en/ai-correct-score-predictions. Les instantanés Search Console disponibles divergent sur certains totaux; ne choisis pas arbitrairement un nombre, ne prétends pas qu’une campagne a échoué et ne promets aucune amélioration de classement ou de CTR.

TA RÉPONSE ATTENDUE
Lis d’abord tout le README. Puis rends uniquement une explication écrite, claire et structurée, de ta direction globale : concept, personnalité, palette que tu proposes avec contrastes, textures/matières, typographies, grille et mise en page, composants, navigation, motion design, accessibilité et déclinaison par chacune des familles de pages listées. Fais ressortir ce qui doit être commun et ce qui doit changer selon l’objectif d’une page. N’ajoute ni maquette, ni image, ni code, ni fichier. L’équipe BTTSPredict transformera ensuite ta description en aperçus locaux; le propriétaire les approuvera ou demandera des corrections avant toute publication.
```

## Documentation

Ce README est le brief à partager à Meta : le prompt et le contexte complet restent dans ce fichier, sans document externe à joindre. L’inventaire des routes correspond au sitemap public consulté le 4 novembre 2026.
