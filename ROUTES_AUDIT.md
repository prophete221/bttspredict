# Audit des Routes — BTTSPredict

> **Date d'audit :** 2026-08-08
> **Modèle en production :** V3-Reliability
> **Layout :** `src/app/layout.tsx` contient `<BottomNavigation />` et `<CookieConsent />` montés globalement (visibles sur toutes les routes).

---

## Routes publiques existantes (39 routes)

| Route | Statut | BottomNav visible ? | Onqlet actif | H1 unique | Canonical | Notes |
|-------|--------|---------------------|--------------|-----------|-----------|-------|
| `/` | ✅ Réelle | ✅ Oui (via layout) | Accueil | Oui | `/` | Page d'accueil |
| `/pronostics` | ✅ Réelle (réécrite) | ✅ Oui | Pronos | Oui | `/pronostics` | **Plus de redirection vers `/#free-predictions`** |
| `/pronostics/aujourd-hui` | ✅ Réelle (nouvelle) | ✅ Oui | Pronos | Oui | `/pronostics/aujourd-hui` | Variante du jour |
| `/historique` | ✅ Réelle (réécrite) | ✅ Oui | Historique | Oui | `/historique` | Nouveau suivi uniquement |
| `/methodologie` | ✅ Réelle | ✅ Oui | Historique | Oui | `/methodologie` | À mettre à jour Phase 9 |
| `/vip` | ✅ Réelle (réécrite) | ✅ Oui | VIP | Oui | `/vip` | **Plus de redirection vers `/#vip`** |
| `/jouer-responsable` | ✅ Réelle | ✅ Oui | — | Oui | `/jouer-responsable` | Légal |
| `/mentions-legales` | ✅ Réelle | ✅ Oui | — | Oui | `/mentions-legales` | Légal |
| `/politique-confidentialite` | ✅ Réelle | ✅ Oui | — | Oui | `/politique-confidentialite` | Légal |
| `/cgu` | ✅ Réelle | ✅ Oui | — | Oui | `/cgu` | Légal |
| `/resultats-verifies` | ✅ Réelle (legacy) | ✅ Oui | Historique | Oui | `/resultats-verifies` | Conservationnée mais non mise en avant — ancien système |
| `/statistiques` | ⚠️ Placeholder | ✅ Oui | Historique | Oui | `/statistiques` | À supprimer ou rediriger vers `/historique` |
| `/blog` | ✅ Réelle | ✅ Oui | — | Oui | `/blog` | Index |
| `/blog/comment-analyser-match-btts` | ✅ Réelle | ✅ Oui | — | Oui | `/blog/comment-analyser-match-btts` | Article |
| `/blog/faille-fifa-linebet` | ✅ Réelle | ✅ Oui | — | Oui | `/blog/faille-fifa-linebet` | Article |
| `/blog/meilleurs-championnats-btts` | ✅ Réelle | ✅ Oui | — | Oui | `/blog/meilleurs-championnats-btts` | Article |
| `/blog/guide-linebet-inscription` | ✅ Réelle | ✅ Oui | — | Oui | `/blog/guide-linebet-inscription` | Article |
| `/blog/gestion-bankroll-paris-sportifs` | ✅ Réelle | ✅ Oui | — | Oui | `/blog/gestion-bankroll-paris-sportifs` | Article |
| `/blog/strategie-mise-over-2-5` | ✅ Réelle | ✅ Oui | — | Oui | `/blog/strategie-mise-over-2-5` | Article |
| `/betting-tips` | ✅ Réelle | ✅ Oui | Pronos | Oui | `/betting-tips` | SEO landing |
| `/over-2-5-predictions` | ✅ Réelle | ✅ Oui | Pronos | Oui | `/over-2-5-predictions` | SEO landing |
| `/correct-score-predictions` | ✅ Réelle | ✅ Oui | Pronos | Oui | `/correct-score-predictions` | SEO landing |
| `/football-predictions-today` | ✅ Réelle | ✅ Oui | Pronos | Oui | `/football-predictions-today` | SEO landing |
| `/league-predictions` | ✅ Réelle | ✅ Oui | Pronos | Oui | `/league-predictions` | SEO landing |
| `/team-predictions` | ✅ Réelle | ✅ Oui | Pronos | Oui | `/team-predictions` | SEO landing |
| `/match-predictions` | ✅ Réelle | ✅ Oui | Pronos | Oui | `/match-predictions` | SEO landing |
| `/linebet-promo-code` | ✅ Réelle | ✅ Oui | — | Oui | `/linebet-promo-code` | Affiliation |
| `/code-promo-linebet-senegal` | ✅ Réelle | ✅ Oui | — | Oui | `/code-promo-linebet-senegal` | Affiliation |
| `/bonus-888starz` | ✅ Réelle | ✅ Oui | — | Oui | `/bonus-888starz` | Affiliation |
| `/bookmakers` | ✅ Réelle | ✅ Oui | — | Oui | `/bookmakers` | Comparateur |
| `/btts-c-est-quoi` | ✅ Réelle | ✅ Oui | — | Oui | `/btts-c-est-quoi` | Informationnel |
| `/equipe` | ✅ Réelle | ✅ Oui | — | Oui | `/equipe` | E-E-A-T |
| `/presse` | ✅ Réelle | ✅ Oui | — | Oui | `/presse` | E-E-A-T |
| `/faille-fifa` | ✅ Réelle | ✅ Oui | — | Oui | `/analyses-fifa` ⚠️ | **Canonical cassé — à corriger vers `/faille-fifa`** |
| `/prediction-aviator` | ✅ Réelle | ✅ Oui | — | Oui | `/aviator-stats` ⚠️ | **Canonical cassé — à corriger vers `/prediction-aviator`** |

## Routes supprimées

| Ancienne route | Action | Nouvelle destination |
|----------------|--------|----------------------|
| `/#vip` (ancre) | Remplacée par page autonome | `/vip` |
| `/#free-predictions` (ancre) | Remplacée par page autonome | `/pronostics` |
| `src/app/vip/redirect-client.tsx` | Supprimé | — |
| `src/app/pronostics/redirect-client.tsx` | Supprimé | — |

## Routes à corriger (canonicals cassés)

| Route | Canonical actuel | Canonical correct |
|-------|------------------|-------------------|
| `/faille-fifa` | `/analyses-fifa` (404) | `/faille-fifa` |
| `/prediction-aviator` | `/aviator-stats` (404) | `/prediction-aviator` |

> **Action Phase 11 :** Corriger ces 2 canonicals.

## Routes à déprécier

| Route | Raison | Action recommandée |
|-------|--------|---------------------|
| `/statistiques` | Page placeholder redondante avec `/historique` | Rediriger 301 vers `/historique` ou supprimer |
| `/resultats-verifies` | Affiche l'ancien système | Conserver mais ne pas mettre en avant (uniquement lien depuis footer) |

## Navigation basse (BottomNavigation)

### Composant

- **Fichier :** `src/components/bttsbet/BottomNavigation.tsx`
- **Montage :** `src/app/layout.tsx` (autour de `{children}`) — visible sur toutes les routes
- **Comportement :** Sticky `bottom-0`, `z-50`, `aria-current="page"` sur l'onglet actif, focus visible, safe-area iOS
- **Visibilité :** Mobile + desktop (4 onglets visibles sur toutes les tailles)

### Onglets

| # | Label | Icône | Route cible | `matchPath` (route active) |
|---|-------|-------|-------------|----------------------------|
| 1 | Accueil | Maison | `/` | `pathname === '/'` |
| 2 | Pronos | Graphique | `/pronostics` | `pathname.startsWith('/pronostics')` ou une des 7 routes SEO pronostics |
| 3 | VIP | Couronne | `/vip` | `pathname.startsWith('/vip')` |
| 4 | Historique | Ligne | `/historique` | `pathname.startsWith('/historique')` ou `/methodologie` ou `/resultats-verifies` ou `/statistiques` |

## Cookies (CookieConsent)

- **Fichier :** `src/components/bttsbet/CookieConsent.tsx`
- **Montage :** `src/app/layout.tsx` (après `<BottomNavigation />`) — visible sur toutes les routes
- **Position :** `fixed`, `bottom: calc(64px + env(safe-area-inset-bottom, 0px))`, `z-[60]` (au-dessus de BottomNavigation)
- **Comportement :** 3 boutons (Personnaliser / Refuser / Accepter), stockage `localStorage['bttsbet_cookie_consent']`
- **Non-chevauchement :** S'ouvre au-dessus de la BottomNavigation sans la masquer

## Sitemap

- **Fichier :** `public/sitemap.xml` (généré par `scripts/generate-sitemap.mjs`)
- **À mettre à jour :** Ajouter `/pronostics`, `/pronostics/aujourd-hui`, `/vip` (page autonome), `/historique` (page réelle)
- **IndexNow :** `scripts/submit-indexnow.mjs` — ajouter `/pronostics`, `/vip`, `/historique` à la liste des URLs notifiées

## Conformité

- ✅ Aucune route ne redirige vers une ancre `/#...`
- ✅ `/vip` et `/pronostics` sont des pages autonomes rechargeables et partageables
- ✅ BottomNavigation visible sur toutes les routes (mobile + desktop)
- ✅ Onglet actif correctement identifié via `usePathname()`
- ✅ `aria-current="page"` sur l'onglet actif
- ✅ `padding-bottom` global sur le layout pour éviter le contenu masqué
- ✅ CookieConsent ne chevauche pas la BottomNavigation
- ⚠️ 2 canonicals cassés à corriger (`/faille-fifa`, `/prediction-aviator`)
- ⚠️ Sitemap à mettre à jour avec les nouvelles routes
