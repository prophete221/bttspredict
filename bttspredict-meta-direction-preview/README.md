# BTTSPredict — Football Intelligence

Maquette locale autonome, réalisée comme aperçu visuel uniquement. Elle utilise HTML, CSS et JavaScript statiques ; elle ne modifie ni le site de production, ni ses routes, données, réglages SEO ou déploiement.

## Lancer l’aperçu

Depuis ce dossier, démarrer un serveur local :

```bash
python3 -m http.server 3102 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:3102/`. La navigation utilise des fragments locaux (`#/...`), et le sélecteur permet de passer du français à l’anglais ou à l’arabe. Les polices Manrope, Inter et Noto Sans Arabic sont chargées depuis Google Fonts quand une connexion Internet est disponible ; des polices de repli sont définies.

## Pages représentées

La maquette couvre l’accueil / Match Center, BTTS, Over 2.5, scores exacts, la vue combinée, le détail d’une rencontre, les statistiques, les résultats vérifiés et l’historique, le parcours VIP, les pages promotionnelles des quatre partenaires, la méthodologie, le guide BTTS, ainsi que les pages légales et de jeu responsable. Les routes secondaires connues (`/btts/predictions/tomorrow`, `/btts/statistics`, `/over-2-5/statistics`, `/pronostics` et `/linebet-promo-code`) sont représentées par des alias de prévisualisation. La vue Match Center et ses pages de pronostics réutilisent une grammaire commune de cartes.

L’interface est responsive : navigation latérale repliable sur desktop, filtres horizontaux et navigation inférieure fixe sur mobile. La version arabe utilise une disposition RTL avec sidebar et tiroir mobile à droite, tout en isolant les nombres, codes et marques en LTR. Les animations sont réduites lorsque `prefers-reduced-motion` est activé.

## Sources et limites des données

`data-snapshot.json` est un extrait local de `public/win-history.json`, généré le 2 novembre 2026 à 22:06 UTC. Il couvre le 8 août au 2 novembre 2026 : 447 résultats réglés, dont 359 gagnants et 88 perdants, soit 80,3 %. Le fichier source compte également 76 rencontres en attente et 176 non vérifiables. Le volume est explicitement signalé comme insuffisant pour évaluer la performance statistique ; les résultats passés ne garantissent rien pour l’avenir.

Les cinq lignes détaillées de l’extrait sont des résultats historiques issus du registre local, attribués à ESPN public. La fiche Atalanta–Parma réutilise l’enregistrement vérifié du 2 novembre 2026 ; elle ne constitue pas une rencontre à venir. Le snapshot de pronostics issu de `public/predictions.json` date également du 2 novembre et est expiré au 4 novembre : les rencontres futures sont donc masquées, et les cartes de démonstration sont étiquetées comme modèles sans rencontre active. Aucune cote, probabilité, sélection ou statistique courante n’est inventée.

## Parcours VIP et pages partenaires

Les codes et liens sont repris depuis `src/lib/constants.ts` et consignés dans `affiliate-links.json`. Chaque code apparaît uniquement sur sa page partenaire dédiée, avec les attributs de lien d’affiliation `sponsored nofollow noopener noreferrer` :

- 1xBet : `vipbtts`
- Linebet : `VISION221`
- MelBet : `Bttswin`
- 888Starz : `btts221`

Le bonus de 300 % à portée mondiale est une confirmation du propriétaire. La maquette n’ajoute aucun plafond, tour gratuit, durée, seuil ou autre condition ; elle invite à vérifier les conditions officielles. Aucune demande de dépôt n’apparaît sur les pages promo.

Le parcours VIP est distinct : nouveau compte 1xBet ou Linebet avec le code de la page dédiée, dépôt requis uniquement pour l’accès VIP sans montant indiqué, approbation manuelle et coupon transmis par e-mail ou WhatsApp. La maquette ne demande ni pièce d’identité ni identifiant joueur et ne promet pas d’accès immédiat, de résultat ou de gain. Les sélections et cotes VIP réelles ne sont pas révélées.

## Captures et contrôles

Les captures finales, leur manifeste et les aperçus par langue sont dans [`captures/final/`](captures/final/) :

- [`overview-fr.png`](captures/final/overview-fr.png)
- [`overview-en.png`](captures/final/overview-en.png)
- [`overview-ar.png`](captures/final/overview-ar.png)

Les vues desktop et mobile complètes sont nommées par langue et page. Le script [`capture_screenshots.py`](capture_screenshots.py) recrée les captures et vérifie la langue, la direction, les débordements, le menu mobile, le Combo Builder replié, les codes et les URL partenaires. Exécuter le script avec le serveur local actif sur le port 3102.
