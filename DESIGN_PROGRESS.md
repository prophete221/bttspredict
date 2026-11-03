# Design progress — design/refonte-2026-11

## Status

Refonte visuelle en cours sur cette branche uniquement. `main` et le FTP de production ne sont pas touchés.

## Fait

- Coquille : navbar, langues FR/EN/AR, menu, pied de page, barre mobile (`shell.css`).
- Système visuel global (`refonte.css`) appliqué à toutes les pages via le layout : fond unique, cartes plates, titres sans dégradé, animations décoratives coupées, halos et bandeaux défilants masqués.
- Accueil : barre de progression retirée, hero sans halo ni logos de clubs défilants, CTA simple. Le code VISION221 n’est plus l’identité du hero (réservé à Linebet).
- Popup cadeau : compacte, sans emoji animé ni étincelles. Codes inchangés : VISION221 (Linebet) et VIPBTTS (1xBet).
- Bloc partenaire accueil : même lien Linebet et même lien 1xBet, bouton sans bordure animée.

## Conservé

Données, pronostics, routes, SEO, JSON-LD, Firebase, consentement, tracking, codes Bttswin (Melbet) et btts221 (888Starz).

## Suite

Les pages intérieures héritent du système. Les prochains commits ne changent que la présentation si un écran reste trop chargé.
