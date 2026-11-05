# Rapport de mission — pages promo 888Starz et logos CTA

**Date :** 2026-11-05  
**Branche :** `redesign/football-intelligence-2026-11-04`  
**Statut :** travail local en cours; aucun commit, push, merge ou déploiement.

## Référence visuelle et faits

La capture fournie par le propriétaire est `/home/ubuntu/upload/1000492378.jpg`. Elle montre le titre qui répète `btts221`, un texte d’introduction hésitant, une seconde répétition du code, un bouton APK puis une barre fixe qui recouvre la navigation mobile.

Les valeurs affiliées maintenues dans `src/lib/constants.ts` comprennent le lien d’inscription 888Starz `https://888ghta.com/8hwF6V` et le lien APK 888Starz `https://888ghta.com/5o6glw`. Le code 888Starz demeure `btts221`; les autres codes partenaires restent inchangés.

## Vérification réseau ponctuelle des destinations APK

Les URL d’origine des APK n’ont pas été modifiées. Une requête HEAD avec suivi des redirections a observé :

- 1xBet : URL d’origine `https://reffpa.com/L?tag=d_6292935m_45361c_&site=6292935&ad=45361`; cible finale HTTP 200 sur un endpoint nommé `1xbet.apk`.
- Linebet : URL d’origine `https://lb-aff.com/L?tag=d_5589568m_66803c_apk1&site=5589568&ad=66803`; cible finale HTTP 403 sur un endpoint nommé `linebet.apk`.
- MelBet : URL d’origine `https://refpa3665.com/L?tag=d_6293054m_70867c_&site=6293054&ad=70867`; cible finale HTTP 200 sur un endpoint nommé `melbet.apk`.
- 888Starz : URL d’origine `https://888ghta.com/5o6glw`; cible finale HTTP 200 sur un endpoint nommé `888starz.apk`.

Le propriétaire confirme que les quatre liens APK fonctionnent et demande expressément de conserver chaque destination et bouton à l’identique. Les boutons sont donc gardés; seul l’habillage logo est en cours d’ajout. L’icône Google Play est une marque visuelle demandée pour les boutons APK, sans prétendre que leur destination est une fiche Google Play.

Un suivi HEAD du lien d’inscription `https://888ghta.com/8hwF6V` a rencontré une chaîne de redirections externe et une résolution DNS incomplète; l’URL d’origine reste intacte, telle que fournie et configurée par le propriétaire.

## Changements déjà réalisés

- Création d’une carte 888Starz simplifiée en FR/EN/AR avec l’offre `300% worldwide`, le code visible une seule fois, bouton copier accessible, CTA principal avec logo 888Starz et bouton APK existant avec icône Play Store; aucun sticky CTA recouvrant la navigation.
- Pages 888Starz génériques et `btts221` alignées sur cette carte; descriptions et FAQ structurées nettoyées, sans toucher aux URLs/canonicals/hreflang.
- Titres visibles des guides partenaires ajustés au positionnement cashback/bonus hebdomadaires demandé par le propriétaire, sans montants ou conditions ajoutés.
- CTA de `PromoLandingShell` : logo bookmaker sur le lien d’inscription, icône Play Store sur APK, destinations conservées.
- Popup global : retrait du code visible hors guide promo et logo 1xBet sur son CTA.
- Bandeau partenaire, CTA mobile et composant APK Linebet en cours d’harmonisation; audit de couverture en cours.

## Points à compléter

- Finir l’ajout des logos aux CTA publics restants et la restriction des codes aux guides promo dédiés.
- Vérifier par TypeScript, lint, tests et build statique, puis contrôler l’aperçu local sur FR/EN/AR en mobile/desktop, notamment le sens RTL et l’absence de chevauchement.
- Mettre à jour ce rapport avec les résultats des tests, le statut du serveur d’aperçu et les limites exactes de vérification.
