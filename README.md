# BTTSPredict — plateforme de pronostics football

> **Production :** [https://bttspredict.com](https://bttspredict.com) · **Langues :** français, anglais, arabe · **Public :** amateurs de football, avec une expérience mobile prioritaire, notamment en Afrique de l’Ouest.

BTTSPredict est une plateforme d’information et de pronostics football, avec des liens d’affiliation vers des bookmakers partenaires. Ce n’est pas un bookmaker : le site ne prend pas de mises et ne garantit aucun résultat. Ce README décrit le produit, ses pages et les règles du propriétaire afin qu’un directeur artistique puisse proposer une direction globale sans devoir parcourir les fichiers du dépôt.

## Le projet en bref

Le produit publie des pronostics gratuits sur trois marchés : **BTTS** (« les deux équipes marquent »), **Over 2,5 buts** et **scores exacts**. Il comprend aussi un Match Center, un générateur de combinés, un espace VIP verrouillé, des pages de promotion partenaires, des résultats vérifiés, un historique, des statistiques, une méthodologie et des pages légales.

Les données quotidiennes sont publiées dans des fichiers publics, notamment `predictions.json`; les résultats et l’historique sont conservés dans des archives et `win-history.json`. Les sources football identifiées dans le projet sont ESPN et TheSportsDB. Le moteur statistique produit des estimations à partir de données de matchs; certains champs ou cotes peuvent être estimés lorsque la donnée source n’existe pas. L’interface doit différencier les valeurs réelles des estimations et ne jamais fabriquer de statistiques ou de cotes. Les résultats passés, gagnants comme perdants, doivent rester transparents.

L’appellation « AI Combo Builder » désigne un outil interactif de combinés. Son mécanisme actuel est déterministe, pas un chatbot ni une IA conversationnelle. Dans le code de référence, l’utilisateur choisit une cote cible (1,80 / 2,50 / 3,00 / 5,00 / 8,00) et un nombre de matchs de 2 à 5; l’outil assemble des sélections disponibles sur des rencontres à venir et affiche des estimations combinées. Toute mise ou tout retour affiché doit être clairement présenté comme une simulation, jamais comme un gain attendu ou garanti.

## État du site et du travail de design

Le sitemap public consulté le **4 novembre 2026** contient **61 URL** : 19 familles disponibles en français, anglais et arabe (57 URL), plus 4 familles uniquement en français. Le français utilise les chemins sans préfixe, l’anglais `/en` et l’arabe `/ar`.

La dernière publication de l’application confirmée dans le suivi du propriétaire est le run **#1041**, commit `466cc84`. Le `main` du dépôt a ensuite reçu `582eeff` (`chore: auto-update data`), un commit de données de pronostics. Des corrections produit et essais visuels sont conservés dans un worktree local séparé; ils ne constituent pas une refonte approuvée ou publiée. Les douze anciennes maquettes alternatives ont été rejetées. Le travail visuel sur le Match Center et le tableau quotidien est en pause pendant que Meta formule une direction unique pour l’ensemble du site.

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

## Inventaire complet des routes canoniques du sitemap

Le tableau ci-dessous liste les **23 familles** du sitemap public. Pour les 19 familles marquées « FR/EN/AR », le chemin indiqué est celui du français; le chemin anglais est `/en` + ce chemin et le chemin arabe `/ar` + ce chemin. Exemple : `/vip`, `/en/vip`, `/ar/vip`. L’accueil est l’exception : `/`, `/en`, `/ar`. Les quatre dernières lignes sont en français seulement. Cette notation couvre les 61 URL du sitemap sans répéter chaque variante trois fois.

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
| `/btts/predictions/tomorrow` | FR seulement | Pronostics BTTS à venir pour le lendemain. |
| `/btts/statistics` | FR seulement | Statistiques consacrées au marché BTTS. |
| `/over-2-5/statistics` | FR seulement | Statistiques consacrées au marché Over 2,5. |

Autres familles présentes dans le code mais **hors des 61 URL du sitemap** : les pages dynamiques de détail de rencontre `/match/{slug}` et leurs variantes localisées `/{locale}/match/{slug}`; les routes auxiliaires `/pronostics` et `/linebet-promo-code`, dont le comportement actuel doit être vérifié avant tout changement SEO; les données `/predictions.json`, `/win-history.json`, les archives JSON, `/sitemap.xml`, `/robots.txt` et la page 404. Les pages de match réutilisent la même grammaire de données et de cartes que le reste du produit.

## Règles produit confirmées par le propriétaire

Ces choix sont la référence pour toute proposition de contenu ou de design et prévalent sur les formulations anciennes visibles sur certaines pages publiques ou dans le code.

- **Pronostics gratuits :** BTTS, Over 2,5 et scores exacts. Pas d’inscription forcée pour les consulter. Les cartes peuvent montrer discrètement les logos ou liens partenaires dans cet ordre : **1xBet → Linebet → MelBet → 888Starz**. Aucun code promo dans les cartes gratuites, les popups, la navigation générale ou la page VIP générale; les codes sont réservés aux pages promotionnelles dédiées.
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
