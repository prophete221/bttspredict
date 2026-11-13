# Direction artistique BTTSPredict — système visuel unifié

Date : 2026-11-13  
Périmètre : plateforme publique, pages partenaires, espace VIP.  
Objectif : produit d'analyse football premium, lisible sur mobile, cohérent en FR/EN/AR — jamais une apparence de blog ou de bookmaker.

## 1. Fondations visuelles

| Rôle | Token | Valeur |
|---|---|---|
| Fond principal | `--color-bg-main` | `#070B12` |
| Fond secondaire | `--color-bg-secondary` | `#0C121C` |
| Surface élevée | `--color-bg-tertiary` | `#121A26` |
| Carte | `--color-card` | `#0F1622` |
| Texte principal | `--color-text-primary` | `#F2F6FA` |
| Texte secondaire | `--color-text-secondary` | `#9DABBB` |
| Action / analyse | `--color-action-primary` | `#3B82F6` |
| VIP | `--color-vip` / or mat | `#E8C97A` |
| Succès | résultat gagné | vert réservé aux statuts |
| Échec | résultat perdu | rouge réservé aux statuts |

Le bleu sert aux interactions et à l'analyse. L'or mat identifie uniquement les surfaces et accès VIP. Les couleurs propres aux partenaires restent confinées aux logos, repères et CTA de leurs pages promotionnelles.

## 2. Typographie et densité

- Inter pour le latin, Noto Sans Arabic pour l'arabe, JetBrains Mono pour les codes, identifiants et chiffres techniques.
- Échelle de référence : 12 / 14 / 16 / 18 / 24 / 30 / 36 px.
- Titres courts, descriptions compactes, chiffres alignés en tabulaire quand ils sont comparés.
- Une action primaire dominante par écran; actions secondaires en contour ou surface discrète.

## 3. Surfaces et composants

- Fonds bleu nuit, cartes avec une différence de luminosité visible, bordures fines et ombres contrôlées.
- Rayon courant : 12–20 px; grands panneaux : 20–24 px.
- Effets de profondeur limités aux cartes de pronostics et aux aperçus premium. Pas de tilt obligatoire sur les formulaires.
- Les pages partenaires utilisent une structure commune : identité du partenaire, code copiable, CTA, divulgation affiliée, points clés, étapes, FAQ et liens croisés.
- Sur mobile, le CTA partenaire reste accessible dans une barre compacte placée au-dessus de la navigation basse.

## 4. Navigation et responsive

- Navigation mobile basse : ACCUEIL / PRONOSTICS / VIP uniquement.
- Navigation bureau : rail latéral et barre supérieure; conserver le contexte de page et le sélecteur de langue.
- Mobile d'abord, largeur de lecture contrôlée sur les pages longues; grilles deux colonnes seulement quand elles restent lisibles.
- Respect des zones de sécurité iOS/Android et de `prefers-reduced-motion`.

## 5. Internationalisation et accessibilité

- FR, EN et AR doivent partager la même hiérarchie et les mêmes composants.
- Arabe : `dir="rtl"`, alignement logique (`text-start`, marges `inline`), codes et URLs isolés en LTR via `bdi`/code.
- Focus clavier visible, labels explicites, statuts annoncés, cibles tactiles d'au moins 44 px.
- Les animations ne doivent jamais être nécessaires pour comprendre ou utiliser un écran.

## 6. Garde-fous produit

- Ne jamais inventer une cote, un résultat, un taux de réussite, un bonus, un minimum de dépôt ou une condition d'éligibilité.
- Divulguer les liens affiliés à proximité des CTA.
- Préserver les titres SEO, URLs, canonicals et données de pronostics déjà en production.
- Ne jamais présenter une demande manuelle, une capture d'écran ou un clic « payé » comme une vérification automatique de paiement.
- VIP Discovery (7 jours gratuits) et VIP Pro payant nécessitent une authentification et un contrôle serveur de l'entitlement; l'activation/expiration ne peut pas être simulée par le seul frontend.

## 7. Détails d'implémentation — 13 novembre 2026

- Les règles finales du système navy sont placées après les anciennes couches CSS afin qu'aucun ancien thème clair, teal ou rouge ne reprenne la priorité.
- Accueil, cartes Match Center, dashboard BTTS, analyses de match et pages partenaires partagent les surfaces navy; le bleu analytique marque les états actifs et l'or champagne reste réservé au VIP.
- Le tiroir de navigation mobile enferme le focus au clavier, se ferme avec Échap et restitue le focus au bouton déclencheur.
- Les liens partenaires actifs portent `aria-current="page"`; le contexte de la barre supérieure reprend le nom du partenaire concerné.
- Le footer utilise les couleurs globales et des alignements logiques compatibles RTL.
- Le rendu visuel final doit encore être contrôlé sur le preview Vercel en mobile/desktop et en arabe; les tests automatisés doivent passer avant fusion.
