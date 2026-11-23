# 03 — Problèmes visuels, navigation, responsive et expérience utilisateur

> **Audit GLM du dépôt prophete221/bttspredict — 15 novembre 2026**
> Branche main, commit `5fb08ef` — audit statique du code, effectué exclusivement en lecture seule.
> Fiche thématique : état du design actif, CSS global, polices, code mort, transparence perçue. Limites : aucun test navigateur/responsive effectué (voir 08).

---

## 1. Qualité générale du code actif (source : section 6.1)

Le frontend est une application Next.js 16.1.3 en mode App Router avec export statique complet (output: export), React 19, Tailwind v4 et composants shadcn/ui. Le routage racine (français) est doublé d'un segment [locale] (en, ar) qui ré-exporte proprement les pages racine avec des métadonnées traduites, en excluant fr de generateStaticParams pour éviter les doublons d'URL. La qualité d'exécution du code actif est bonne : gestion d'erreur par ErrorBoundary systématique, aria-current et aria-live présents, prefers-reduced-motion respecté, liens externes tous en rel=sponsored nofollow noopener noreferrer, aucun target=_blank sans rel, aucun eval, et un suivi honnête des statuts WON/LOST/vérification en cours dans le Match Center et le tableau de bord.

---

## 2. CSS : 654 Ko globaux chargés sur chaque page (source : section 6.3)

Le layout racine importe cinq feuilles de style globales totalisant environ 654 Ko (globals.css 434 Ko, football-intelligence.css 90 Ko, bttspredict-design-system.css 48 Ko, matchday-ui.css 48 Ko, bttspredict-rebuild.css 35 Ko), plus vip.css (87 Ko) sur la seule page VIP. L'analyse des classes montre qu'environ 56 % des 752 classes de premier niveau de globals.css ne sont référencées par aucun source : cinq générations de design cohabitent (préfixes fi-, hp-, bp-, vipx-, btp-), avec 497 classes définies en doublon entre fichiers. Comme Next.js ne purge jamais les imports globaux manuels, chaque visiteur télécharge ce volume à chaque navigation. Par ailleurs, les polices Poppins (4 fichiers woff2 committés) ne sont chargées par aucun next/font/local alors que plus de dix composants écrivent fontFamily: 'Poppins' : la police de marque est silencieusement remplacée par une police système.

---

## 3. Anomalies visuelles ciblées (source : section 6.4)

Bug d'animation : useAnimations.ts (ligne 104) inclut hasAnimated dans les dépendances de l'effet, ce qui relance le compteur après achèvement (retour à zéro puis recompte) ; affecte les compteurs de VipSports et de ResultatsClient.

Performance de build : getMatchBySlug dans src/lib/matches.ts relit l'intégralité des archives à chaque appel, et les pages de match l'appellent plusieurs fois ; le fichier importe aussi un script du pipeline (scripts/public-predictions.mjs), un couplage inverse code/scripts fragile.

Route redondante : src/app/predictions.json/route.ts re-sert public/predictions.json au build alors que le fichier est déjà copié et sanitisé — deux écrivains du même chemin de sortie, avec un cache s-maxage inopérant en hébergement statique.

Divergence de rendu FR/en/ar : les pages de prédictions racine sont ensemencées au build (HTML contenant les données) tandis que leurs équivalents [locale] ne le sont pas — le contenu prédictif manque du HTML exporté en anglais et en arabe, ce qui affaiblit le SEO de ces versions.

Script inline de rechargement : le purgeur de service worker du layout force location.reload() à chaque changement de VERSION ; un déploiement partiel peut provoquer des boucles de rechargement.

---

## 4. Code mort : impact sur la lisibilité du design (source : section 6.2)

L'analyse du graphe d'imports établit qu'environ 33 fichiers de src/components/bttsbet et de src/app/vip ne sont plus importés par aucune page : AgeVerification, StickyCTABar, LiveTicker, StickyVipBandeau, SiteLoader, CursorEffect, FloatingElements, NeuralBackground, MobileTabBar, ScrollProgressBar, PromoVip, VipSports, VipCardGlass, VipCardWidget, VipUnlockModal, VipLevelModal, FreePredictionsWidget, StatsDashboard, TrustPillars, HowItWorks, About, GlobalReach, HowToGetVip, LockedContent, SportMarquee, TiltCard, AnimatedIcons, VectorWordmark, PremiumButton, PartnerSignupBand, AffiliateSignupCta, HomeEditorial, ainsi que les deux flux VIP parallèles VipApplication.tsx (412 lignes) et VipClient.tsx (695 lignes). Ils ne gonflent pas le bundle (non importés) mais faussent toute lecture du produit et exposent au risque de réactivation accidentelle de contenus obsolètes : HowToGetVip contient encore l'affirmation « taux de réussite 69-81 % selon le sport », et VipSports fabrique des cotes quotidiennes pseudo-aléatoires entre 12 et 30 (fonction getDailyCote) présentées avec compteurs animés et badge Live. Le contexte d'authentification src/contexts/AuthContext.jsx est dans le même cas, en pire : jamais importé, il utilise la syntaxe Vite import.meta.env.VITE_FIREBASE_* qui ne peut pas fonctionner sous Next.js, sans directive use client ; il explique la présence fantôme de firebase, next-auth et react-router-dom dans les dépendances.

Deux bibliothèques présentées comme centrales sont en réalité déconnectées : seoSchemas.ts (437 lignes, constructeurs JSON-LD centralisés) n'est importé nulle part — chaque page redéfinit ses schémas localement — et un test de gel par empreinte empêche même son nettoyage. De même, next-intl figure dans package.json mais aucun import n'en est fait : l'internationalisation est un système maison (src/lib/i18n.ts et dictionnaires dupliqués par composant), avec des traductions fr/en/ar portées dans chaque composant, ce qui crée un risque de divergence entre langues.

---

## 5. Transparence perçue par l'utilisateur (source : section 8.2)

Éléments qui affectent directement l'expérience et la confiance (texte intégral de la section 8.2) :

Politique de confidentialité incomplète (constat le plus sérieux) : elle ne mentionne ni Google Analytics, ni le traitement VIP — identifiant bookmaker, montant de dépôt, pseudonyme Telegram ou numéro WhatsApp, et capture d'écran de dépôt envoyés au worker personnel bttspredict-vip-production-api.luxxdii.workers.dev — ni la rétention de 7 jours qui n'est annoncée que dans la modale d'inscription. Le flux est pourtant soigné (consentements explicites versionnés, preuves plafonnées, purge automatique), mais il n'est documenté nulle part côté utilisateur.

Vérification d'âge inactive : le composant AgeVerification (porte 24 heures, refus = sortie) n'est monté nulle part. Un site d'affiliation de paris opère donc en ligne sans contrôle d'âge effectif, alors que le composant existe.

Versions légales anglaise et arabe squelettiques : LocalizedLegalPage sert quatre sections d'un paragraphe chacune, sans durées, canaux ni bases légales — une incohérence majeure avec les versions françaises sur les trois langues d'un même site.

Accès VIP conditionné à un dépôt financier : l'accès premium exige un dépôt d'au moins 3 USD chez un bookmaker affilié avec preuve de dépôt — schéma d'incitation au dépôt lié à l'affiliation, présenté honnêtement dans la modale mais qui constitue une contrepartie financière à assumer juridiquement (et commercialement).

Affirmations commerciales invérifiables : traductions affichant « N°1 Mondiale » et « 300 % worldwide confirmé » (src/lib/i18n.ts), FAQ partenaires posant le bonus de 300 % comme un fait dans le JSON-LD FAQPage ; toggle advertising du consentement décoratif (aucun script public ne le lit) ; badge Live heuristique dans le composant mort LiveTicker.

Historique VIP biaisé : la page VIP affiche sous le titre Historique VIP uniquement les entrées WON de l'historique général, sans pertes ni taux — présentation biaisée par omission sur la page monétisée.

Précision importante sur les cotes fabriquées : la fonction getDailyCote de VipSports.tsx (cotes pseudo-aléatoires 12-30, badge Live, « 8 matchs » en dur) se trouve dans un composant mort, jamais monté — le site actuel ne l'affiche donc pas. Le risque est celui d'une réactivation accidentelle d'un composant présent dans le barrel d'exports ; sa suppression ou sa correction est recommandée avant toute réutilisation.

---

## 6. Ce qui n'a PAS été évalué côté design

- Aucun rendu navigateur n'a été observé : l'audit est statique, aucune capture d'écran, aucun test visuel.
- Aucun test responsive (mobile/tablette/desktop) n'a été effectué.
- Aucune mesure d'accessibilité automatisée (le code actif présente toutefois aria-current, aria-live et prefers-reduced-motion, constatés à la lecture).
- Toute décision de refonte design doit commencer par une capture d'état (captures d'écran + Lighthouse) des pages stratégiques.
