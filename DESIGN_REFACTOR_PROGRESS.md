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
| 12. Pages match, stats, historique, résultats vérifiés | 🔜 | — |
| 13. Pages éditoriales restantes (méthodo, aviator, pronostics) | 🔜 | — |
| 14. Accueil FR/EN/AR — passe finale cohérence | 🔜 | — |
| 15. Validation : build + tsc + eslint + tests + captures APRÈS | 🔜 | — |

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
- APRÈS : `docs/design-refactor/after/` (à générer en fin de refonte).
