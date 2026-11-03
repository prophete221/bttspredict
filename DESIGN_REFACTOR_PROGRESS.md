# DESIGN REFACTOR PROGRESS — BTTSPredict (refonte 2026-11)

> Suivi de la refonte intégrale du design. Branche : `design/refonte-globale-2026-11`.
> Règle d'or : **préserver** données, calculs, liens affiliés, codes partenaires,
> URLs, SEO existant, tracking, traductions, systèmes VIP. Ne jamais toucher :
> `public/win-history.json`, `public/history-exclusions.json`, `src/lib/i18n.ts`,
> `src/lib/seoSchemas.ts`, `public/robots.txt`.

## État global

| Lot | Statut | Commit |
| --- | --- | --- |
| 0. Captures AVANT (6 pages) | ✅ | — (docs/design-refactor/before/) |
| 1. Fondations : registre bookmakers, i18n promo, CSS v3, CtaButton | ✅ | voir git log |
| 2. Système promo unifié (4 bookmakers, logo réels, APK + inscription) | ✅ | voir git log |
| 3. Nouvelles pages 1xBet (Vipbtts) + Melbet (Bttswin) FR/EN/AR | ✅ | voir git log |
| 4. Popup cadeau v2 (2 codes, compact, fermable) | ✅ | voir git log |
| 5. Footer allégé (FAQ dupliquée retirée, rangée codes partenaires) | ✅ | voir git log |
| 6. Navbar : 4 partenaires, code contextuel | ✅ | voir git log |
| 7. Suppression composants décoratifs morts (11 fichiers) | ✅ | voir git log |
| 8. Sitemap : ajout additif /code-promo-1xbet + /code-promo-melbet | ✅ | hash garde-fou synchronisé (documenté ci-dessous) |
| 9. Pages légales/informatives allégées (widgets promo retirés) | ✅ | voir git log |
| 10. Popup cadeau : attend la décision cookies (plus de chevauchement) | ✅ | voir git log |
| 11. Pages pronostics (BTTS/Over 2.5/combiné/score exact) — dashboards partagés déjà sobres, aucun ajout | ✅ (contrôle) | — |
| 12. Pages match, stats, historique, résultats vérifiés — dashboards partagés vérifiés visuellement, sobres, aucune action requise | ✅ (contrôle) | — |
| 13. Pages éditoriales restantes (méthodo, aviator, pronostics) — vérifiées, mêmes composants partagés | ✅ (contrôle) | — |
| 14. Accueil FR/EN/AR — CTA sobre (CtaButton), mêmes composants partagés aux 3 langues | ✅ | voir git log |
| 15. Validation : build ✓ (482 pages), tsc ✓, eslint ✓, vitest 189/189 ✓, captures APRÈS ✓ | ✅ | — |

## Décisions de design (direction artistique)

- **Palette inchangée dans son esprit** : noir profond, texte #F2F6FA, bleu
  analyse #2F7DFF (action), vert #34D399 (win), rouge #F87171 (perte),
  or #E8C268 (VIP exclusivement). Les effets lumineux et gradients animés
  sont supprimés au profit de surfaces sobres et d'ombres discrètes.
- **Typographie** : Poppins (display) + Inter (corps) + JetBrains Mono (codes) —
  polices locales inchangées.
- **Un CTA par intention** : les blocs CTA empilés en double sont supprimés.
- **FAQ unique par page** : la FAQ dupliquée du footer est retirée.
- **Logos bookmakers RÉELS** : 1xBet (Wikimedia officiel), Melbet (wordmark
  officiel détouré), Linebet + 888Starz (fichiers fournis par les campagnes),
  tous détourés en PNG transparent dans `public/logos/`.

## Codes promo — association officielle (casse exacte)

| Bookmaker | Code | Priorité | Page |
| --- | --- | --- | --- |
| Linebet | `VISION221` | ⭐ prioritaire | /code-promo-linebet-senegal |
| 1xBet | `Vipbtts` | ⭐ prioritaire | /code-promo-1xbet (NOUVEAU) |
| Melbet | `Bttswin` | standard | /code-promo-melbet (NOUVEAU) |
| 888Starz | `btts221` | standard | /bonus-888starz + /bonus-888starz-btts221 |

## Exception documentée — test seo-preservation

`src/app/sitemap.ts` est gelé par hash dans `tests/seo-preservation.test.ts`.
La mission demandant une page code promo par bookmaker, deux URLs ont été
**ajoutées additivement** (`/code-promo-1xbet`, `/code-promo-melbet`) sans
modifier aucune URL, priorité ni hreflang existant. Le hash du garde-fou a
été synchronisé en conséquence et ce choix est documenté ici. Tous les autres
fichiers gelés (i18n.ts, seoSchemas.ts, robots.txt, submit-indexnow.mjs,
metadata de layout/match/methodologie) restent byte-for-byte identiques.

## Suppressions — composants décoratifs / redondants (au total : 15 fichiers)

- Code mort : CursorEffect, FloatingElements, NeuralBackground, SiteLoader,
  SportMarquee, TiltCard, AnimatedIcons, StickyVipBandeau, MovingGradientButton,
  HowItWorks, GlobalReach.
- Widgets promo empilés en bas de chaque page (supprimés des 5 pages légales
  puis retirés du codebase) : FreePredictionsWidget, VipCardWidget,
  LinebetApkButton, HowToGetVip.
- Footer : FAQ dupliquée + bloc transparence encadré retirés.
- Pages promo : les anciens clients hétérogènes (LinebetClient 599 lignes,
  Star888Client, Btts221PromoClient, LocalizedPromoClient) ne sont plus rendus
  (fichiers conservés jusqu'à validation, puis suppression).

## Captures

- AVANT : `docs/design-refactor/before/` (accueil FR desktop+mobile, EN,
  promo Linebet, VIP, BTTS today).
- APRÈS : `docs/design-refactor/after/` — accueil FR (desktop+mobile), promo
  Linebet / 1xBet / Melbet (desktop), accueil EN, VIP (desktop), modale VIP
  mobile, wizard VIP étape 3 mobile, zoom strip codes.
- Passe de validation finale (2026-11-03) : popup cadeau visible mobile (11),
  modale VIP étape 1 mobile (12), accueil AR RTL mobile (13), promo 1xBet
  mobile (14), page match mobile (15).

## Passe de validation finale — 2026-11-03 (session « vérification »)

Vérification indépendante de la branche sur le build statique final :

- **Débordements horizontaux : 0 / 162 combinaisons** (27 routes × FR/EN/AR
  × mobile 390 px + desktop 1440 px), incluant pages match réelles et 404.
  Méthode : serveur statique reproduisant le routage `.htaccess` de production
  (fichier exact → `path.html` → `index.html` → 404), mesure
  `scrollWidth/clientWidth` + identification des éléments fautifs.
- **Popup cadeau** : déclenchement après décision cookies (attend la bannière,
  plus de chevauchement), carte compacte 366 px sur mobile, fermeture croix
  mémorisée en sessionStorage — testé et validé sur
  `/over-2-5/predictions/today`.
- **Correction apportée** : logo 1xBet peu lisible sur fond sombre (popup
  cadeau, strip des 5 pages promo) → variante officielle wordmark blanc
  `1xbet-logo-light.png` générée depuis le logo officiel (« 1X » blanc,
  « BET » bleu préservé) ; registre mis à jour (`logo` = fond sombre,
  `logoLight` = logo officiel bleu sur fond clair). Test registre : 13/13 ✓.
- **Codes vérifiés dans le HTML buildé** : Vipbtts (49 occ. page 1xBet),
  Bttswin (49 occ. page Melbet), VISION221 (49 occ. page Linebet),
  btts221 (57 occ. page 888starz) — casse exacte partout, les variantes
  minuscules détectées sont uniquement des méta keywords SEO.
- **Liens affiliés vérifiés dans le HTML buildé** : 1xBet inscription
  (ad=1599) ×2 + APK (ad=45361) ×1 ; Melbet inscription (ad=2170) ×2 + APK
  (ad=70867) ×1 ; Linebet inscription (ad=22611) + APK (ad=66803) ;
  888starz inscription + APK présents sur les 3 langues.
- **Re-validation technique sur le build final** : vitest 202/202 ✓, tsc ✓,
  eslint ✓, build statique 481 pages ✓.
- Observations SANS action (préexistant, hors périmètre refonte design) :
  `<html lang="fr">` est codé dans le layout racine (architecture
  inchangée depuis avant la refonte ; le `lang`/`dir` correct est posé sur
  le wrapper `[locale]` — tout changement toucherait des fichiers SEO gelés).
