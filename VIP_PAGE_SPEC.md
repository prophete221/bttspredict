# Spécification Page VIP — BTTSPredict

> **Date de création :** 2026-08-08
> **Route :** `/vip`
> **Fichier :** `src/app/vip/page.tsx`

---

## 1. Description

La page `/vip` est une page autonome (plus de redirection vers `/#vip`) qui présente l'offre VIP BTTSPredict de manière transparente, sans fausses promesses de gain. Elle regroupe toutes les sections VIP précédemment éparpillées sur la page d'accueil.

## 2. Sections déplacées de l'accueil vers `/vip`

| Composant | Ancien emplacement | Nouvel emplacement |
|-----------|---------------------|---------------------|
| `PromoVip` (Coupon VIP du jour) | `src/app/page.tsx` (ligne ~535) | `src/app/vip/page.tsx` section 9 |
| `VipCardGrid` (2 cartes Essentiel + Pro) | `src/app/page.tsx` (ligne ~536) | `src/app/vip/page.tsx` section 3 |
| `HowToGetVip` (Comment activer le VIP) | `src/app/page.tsx` (ligne ~537) | `src/app/vip/page.tsx` section 8 |
| `VipSports` (multi-sports) | Non rendu sur l'accueil | `src/app/vip/page.tsx` section 5 |
| `AviatorVip` (stats Aviator) | Non rendu sur l'accueil | `src/app/vip/page.tsx` section 10 |
| `VipLevelModal` (4 niveaux) | Non rendu sur l'accueil | Disponible via `HowToGetVip` |

## 3. Lien depuis l'accueil

La page d'accueil contient désormais un seul bloc VIP court avec :

- **Titre :** « Pronostics premium BTTS et Over 2.5 »
- **Phrase de valeur :** Description factuelle (pas de gain garanti)
- **Résumé des avantages réels :** Sélections supplémentaires + analyses détaillées + même modèle Poisson
- **Avertissement :** « Aucun gain n'est garanti. Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. 18+. »
- **Un seul bouton :** « Découvrir le VIP » → `/vip`
- **Lien secondaire :** « Voir l'historique vérifié » → `/historique`

## 4. Structure des 14 sections de `/vip`

1. **Introduction** — présentation du programme VIP
2. **Proposition de valeur** — 3 cartes (sélections supplémentaires, analyses détaillées, même modèle Poisson)
3. **Comparaison des niveaux** — `VipCardGrid` (Essentiel + Pro)
4. **Avantages réels de chaque niveau** — tableau comparatif détaillé
5. **Sports couverts** — `VipSports` (avec disclaimer volume insuffisant)
6. **Nombre réel de pronostics** — « Entre 2 et 5 par jour » (factuel)
7. **Durée réelle d'accès** — 30 jours après validation
8. **Méthode de validation** — `HowToGetVip` (3 étapes)
9. **Coupon VIP du jour** — `PromoVip` (sélections floutées)
10. **Statistiques Aviator** — `AviatorVip` (informatif, non prédictif)
11. **Lien vers l'historique** — CTA vers `/historique`
12. **Conditions et limites** — 6 points (pas de garantie, pas de remboursement, 18+, etc.)
13. **Code promo + CTA affiliation** — `CopyableCode` + Linebet + 888starz + APK
14. **FAQ VIP** — 6 questions (garantie, bookmaker, nombre, remboursement, support, âge)

+ Section bonus : Jeu responsable (18+, ressources d'aide)

## 5. CTA et règles d'affiliation

### Notice obligatoire avant chaque lien bookmaker

```
Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds.
```

### CTA présents sur `/vip`

| CTA | Destination | `rel` | `data-cta` |
|-----|-------------|-------|------------|
| S'inscrire sur Linebet | `AFFILIATE.linebet` | `sponsored nofollow` | `vip-linebet-inscription` |
| S'inscrire sur 888starz | `AFFILIATE.star888` | `sponsored nofollow` | `vip-888starz-inscription` |
| Télécharger APK Linebet | `AFFILIATE.linebetDownload` | `sponsored nofollow` | `vip-linebet-apk` |
| Voir l'historique vérifié | `/historique` | — | — |
| En savoir plus sur le jeu responsable | `/jouer-responsable` | — | — |

### CTA absents de `/vip`

- ❌ Aucun CTA vers `/#vip` (ancre)
- ❌ Aucun CTA bookmaker sans notice d'affiliation
- ❌ Aucune promesse de gain chiffré (« 90% de réussite », « +500% de gains », etc.)

## 6. Séparation des entités

La page `/vip` sépare clairement :

| Entité | Section | Description |
|--------|---------|-------------|
| BTTSPredict | Sections 1-2 | Plateforme d'analyse statistique |
| Modèle statistique | Section 9 (lien méthodologie implicite) | Poisson V3-Reliability |
| Contenu VIP | Sections 3-10 | Sélections premium |
| Bookmaker partenaire | Section 13 | Linebet + 888starz (affiliation rémunérée) |
| Support WhatsApp | Section 8 (via `HowToGetVip`) | Support VIP prioritaire |
| Affiliation | Section 13 + notices | Liens rémunérés clairement identifiés |

## 7. Formulations interdites

| Formulation | Raison |
|-------------|--------|
| « Investissement » | Le VIP n'est pas un investissement |
| « Salaire » | Le VIP n'est pas une source de revenu |
| « Source de revenu » | Idem |
| « Garantie de gain » | Aucun gain n'est garanti |
| « Gain assuré » | Aucun gain n'est assuré |
| « Rentable » | Rentabilité non prouvée |
| « Sans risque » | Les paris comportent un risque |

## 8. Formulations autorisées

| Formulation | Usage |
|-------------|-------|
| « Sélections supplémentaires » | Factuel |
| « Analyses détaillées » | Factuel |
| « Même modèle Poisson V3-Reliability » | Transparence |
| « Aucun gain n'est garanti » | Disclaimer obligatoire |
| « À titre informatif » | Pour Aviator et stats non prédictives |

## 9. Conformité

- ✅ Page accessible directement (pas de redirection)
- ✅ Page rechargeable (URL stable)
- ✅ Page partageable
- ✅ Page indexable (`robots: { index: true, follow: true }`)
- ✅ Notice d'affiliation avant chaque lien bookmaker
- ✅ `rel="sponsored nofollow"` sur tous les liens d'affiliation
- ✅ Disclaimer 18+ présent
- ✅ Lien vers `/jouer-responsable` présent
- ✅ Aucune promesse de gain chiffré
- ✅ Aucune mention « N°1 », « meilleur », « garanti »

## 10. Tests d'acceptation

| Test | Méthode |
|------|---------|
| Page accessible sans redirection | `curl -sI /vip` retourne 200 (pas 302) |
| Toutes les sections présentes | Vérifier présence des 14 sections dans le HTML |
| Notice d'affiliation présente | `grep "Lien d'affiliation rémunéré" /vip` |
| CTA « Découvrir le VIP » sur l'accueil | `grep "Découvrir le VIP" /` |
| Aucune carte VIP sur l'accueil | `grep VipCardGrid src/app/page.tsx` retourne 0 |
| Lien depuis BottomNavigation | `aria-current="page"` sur onglet VIP |
| Canonical correct | `<link rel="canonical" href="https://bttspredict.com/vip">` |
