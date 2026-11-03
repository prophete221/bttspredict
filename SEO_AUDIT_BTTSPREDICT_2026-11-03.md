# Audit BTTSPredict avant refonte — 3 novembre 2026

Périmètre : branche `redesign/professional-global-2026-11-03` (commit `71cf295e`), build complet, 931 pages HTML, et l'export Google Search Console fourni le 3 novembre. **Aucune modification visuelle n'a été faite.** Ce rapport sert à décider ce qui peut être refait, et dans quel ordre.

## Les quatre choses à retenir

1. **Le trafic est massivement anglophone et mobile.** Sur 28 jours, 913 clics sur 1 080 viennent des pages `/en/…` (81 %), et 974 clics sur 1 080 viennent du mobile (90 %). Une refonte qui dégrade le rendu à 375 px coûte cher.
2. **Le 31 octobre est le meilleur jour de la période** : 110 clics, 807 impressions, 13,63 % de CTR, position moyenne 11,1 — contre 35,9 clics et 320,6 impressions par jour en moyenne sur les 27 autres jours.
3. **Cinq pages portent le site.** Elles doivent être refaites en dernier, avec un contrôle balise par balise.
4. **Le problème des pages sans trafic n'est presque jamais le design.** C'est la position, l'intention de recherche ou l'absence de demande — parfois l'URL qui disparaît (pages match en 404).

## Ce que les données du 31 octobre permettent — et ne permettent pas

L'export téléchargé le 2 novembre porte le filtre « Les 28 derniers jours » : il couvre **du 4 au 31 octobre 2026**. Pour la seule journée du 31 octobre, l'export ne contient qu'une vue **site entier** :

| 31/10/2026 | Valeur |
|---|---:|
| Clics | 110 |
| Impressions | 807 |
| CTR | 13,63 % |
| Position moyenne | 11,1 |

**Il n'existe pas, dans ce fichier, de ventilation par page, par requête, par pays ou par appareil pour le 31 octobre seul.** Tous les chiffres par page et par requête cités ici sont donc des cumuls du 4 au 31 octobre. Je ne les présente pas comme des chiffres du 31.

La tendance est nette : la position moyenne passe de 46,1 (4 octobre) à 11,1 (31 octobre), les impressions de 86 à 807 par jour. Les 7 derniers jours totalisent 472 clics, contre 374 les 7 jours précédents (+26 %).

## Les cinq pages à protéger

| Page | Clics 28 j | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| `/en/btts-and-over-2-5-predictions-today` | 333 | 1 947 | 17,10 % | 10,08 |
| `/en` | 281 | 3 070 | 9,15 % | 26,22 |
| `/en/over-2-5/predictions/today` | 279 | 2 621 | 10,64 % | 19,89 |
| `/` | 96 | 798 | 12,03 % | 7,54 |
| `/en/ai-correct-score-predictions` | 10 | 36 | 27,78 % | 22,25 |

Ce sont 75 % des clics mesurés à elles seules. Règle proposée : **URL, canonical, redirections, title, description et contenu classé restent intacts**. Seul l'habillage change.

Deux nuances importantes : `/en` a 3 070 impressions mais une position de 26,22 — c'est la page où il y a le plus à gagner, pas celle qu'il faut figer. Et `/` a la meilleure position du site (7,54) avec seulement 798 impressions : elle est sous-exposée, pas en difficulté.

## Pourquoi les autres pages ne font pas de trafic

| Page | Impr. | Pos. | Vrai problème |
|---|---:|---:|---|
| `/code-promo-linebet-senegal` | 205 | 16,46 | CTR 0 % **avec** de vraies impressions : position page 2 et intention mal servie. La requête `code promo linebet` fait 138 impressions et 0 clic. |
| `/bonus-888starz` | 23 | 10,17 | Bas de page 1, 0 clic : titre et description ne donnent pas la raison de cliquer. Le contenu (632 mots) n'est pas en cause. |
| `/btts-c-est-quoi` | 22 | 15,00 | Page correcte (618 mots) mais bloquée en page 2 : problème de position. |
| `/historique` | 14 | 10,79 | Position limite et snippet sans chiffre : personne ne clique. |
| `/methodologie` | 11 | 23,91 | Position trop faible ; 2 014 mots déjà en place. |
| `/statistiques` | 3 | 5,33 | **Absence de demande** : 3 impressions malgré la position 5. S'y ajoutent un H1 manquant et une description de 187 caractères. |
| `/en/statistiques` | 1 | 98,00 | Quasi absente de l'index (186 mots, pas de H1). |
| `/vip`, `/en/vip` | 6 et 4 | 3,50 et 2,50 | Position excellente, volume nul : requêtes de marque. Rien à faire en SEO. |
| Pages AR (18) | 47 au total | — | Marché inexistant : 2 clics en 28 jours pour toute la langue arabe. |

**Pages match** : 112 URL, 376 impressions, **7 clics**. Positions souvent entre 1 et 10, mais volume quasi nul et clics rares — et surtout, ces pages **disparaissent** : deux URL de l'export renvoient aujourd'hui 404. C'est de la valeur indexed qui s'évapore, pas un problème de design.

## Cinq risques techniques mesurés

1. **`lang="fr"` sur les 930 pages**, y compris `/en` et `/ar`. La langue n'est corrigée que par un script côté client.
2. **`hreflang` présent sur 26 pages seulement** — absent sur `/en/btts-and-over-2-5-predictions-today`, la première page du site, et sur sa jumelle française.
3. **Pages match en 404** après quelques jours, alors qu'elles sont indexées.
4. **Trois pages sans H1** : `/statistiques`, `/en/statistiques`, `/ar/statistiques`.
5. **CTR faible sur les requêtes tête** : `btts predictions` 5,26 % à la position 25,52 ; `btts predictions today` 4,44 % à 30,32. C'est le principal gisement de clics — mais il se règle par le contenu et la position, pas par le design.

À noter aussi : 53 titres dépassent 60 caractères (dont 9 pages hors match), et deux paires de titres sont dupliquées (`/pronostics` / `/btts/predictions/today`, déjà canonicalisées, et les deux pages 888starz en arabe).

## Recommandations, dans cet ordre

1. **Ne rien changer aux cinq pages protégées** avant la fin de la refonte des pages secondaires.
2. **Corriger d'abord les trois risques SEO sans impact visuel** : `lang` côté serveur, `hreflang` sur les pages à trafic, H1 des pages statistiques. Ce sont des gains mesurables et réversibles.
3. **Décider du sort des pages match** : les conserver en 200 ou les rediriger vers l'archive, plutôt que de les laisser en 404.
4. **Refondre dans cet ordre** : pages légales et statistiques → pages match → pages promo → pages du jour FR → pages EN protégées → accueil FR.
5. **Traiter le CTR des requêtes tête comme un chantier éditorial séparé**, après la refonte.

## Fichiers concernés par la suite

- Design system : `src/app/globals.css` (8 114 lignes, 12 occurrences de `.page-design`), `tailwind.config.ts`, 65 composants dans `src/components/bttsbet/`.
- Métadonnées/i18n : `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/lib/i18n.ts` (gelé), `src/app/sitemap.ts` (gelé).
- À ne jamais casser : `public/.htaccess` (301 legacy), `src/lib/constants.ts` et `affiliateTracking.ts` (affiliation/GA4), `src/contexts/AuthContext.jsx` (Firebase/auth), `public/predictions.json` et `win-history.json` (données).

## Contrôles de référence

Build vert, 931 pages HTML générées, 203 tests réussis sur 29 fichiers, `tsc` et `eslint` sans erreur. Les 8 tests de gel SEO (`tests/seo-preservation.test.ts`) passent : ils hachètent `i18n.ts`, `seoSchemas.ts`, `sitemap.ts`, `robots.txt`, `submit-indexnow.mjs` et les blocs `metadata` de trois pages. Aucune modification visuelle ne pourra les contourner.

Rien n'a été publié, rien n'a été fusionné dans `main`.
