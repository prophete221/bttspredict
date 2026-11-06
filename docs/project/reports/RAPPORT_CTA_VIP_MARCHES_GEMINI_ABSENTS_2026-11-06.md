# CTA VIP pour les marchés sans décision Gemini — 6 novembre 2026

## Résumé

Correction UI prête sur `main` : lorsqu’aucune décision Gemini valide n’existe pour un marché, la carte montre un lien localisé « Débloquer VIP » à la place du tiret. Ce lien ouvre uniquement la page VIP; il ne crée, ne révèle ni ne prétend qu’un pronostic VIP existe pour ce marché. Le teaser inférieur reste limité à ses deux marchés actuels.

## Faits vérifiés

La réponse de production [`predictions.json`](https://bttspredict.com/predictions.json), comparée à l’archive datée du dépôt, montre deux cas illustratifs au 6 novembre : Hamburg SV–Borussia Mönchengladbach possède un pick Gemini BTTS, mais aucun pick Over 2.5; Toulouse–Strasbourg possède un pick Gemini Over 2.5, mais aucun pick BTTS. Les décisions présentes et leurs provenances restent inchangées.

Le filtre [`gemini-predictions.ts`](../../../src/lib/gemini-predictions.ts) accepte les picks Gemini explicitement identifiés; le tiret indiquait donc une absence de décision, pas un pick dissimulé. Aucun appel à Gemini, recalcul de prédiction ou changement de données n’a été effectué.

## Correctif

- Nouveau composant [`MissingMarketVipLink.tsx`](../../../src/components/bttsbet/MissingMarketVipLink.tsx) : libellés français, anglais et arabes; liens respectifs `/vip`, `/en/vip` et `/ar/vip`.
- Fallback ajouté dans [`FreePredictions.tsx`](../../../src/components/bttsbet/FreePredictions.tsx) et dans les barres de marché de [`BttsTodayDashboard.tsx`](../../../src/components/bttsbet/BttsTodayDashboard.tsx), uniquement lorsque le pick correspondant est absent.
- Le teaser garde exactement deux marchés verrouillés; le nouveau lien ne crée ni badge supplémentaire ni modale. Aucun URL, canonical, sitemap, archive ou fichier public de prédictions n’a été modifié.

## Vérifications

- Tests ciblés VIP/Gemini : 19 réussis.
- Vitest complet, un worker pour éviter la saturation d’inodes du sandbox : 53 fichiers; 409 tests réussis, 16 ignorés.
- ESLint : 0 erreur; 5 avertissements existants, tous hors des fichiers modifiés.
- TypeScript `tsc --noEmit` : réussi.
- Tests Python : 25 réussis.
- Le build Webpack a compilé le projet, terminé le contrôle TypeScript du build et généré les 154 pages statiques. L’écriture finale de `.next/trace-build` a échoué avec `ENOSPC` car le sandbox était à 100 % d’utilisation des inodes (4 494 libres avant le build). Les trois routes de la page Over 2.5 ont été générées; les tests de composant vérifient exactement les libellés et destinations pour chaque langue. Les sorties locales ignorées ont été nettoyées; aucune donnée suivie n’a été touchée.
- Le premier passage Vitest a rencontré une ancienne assertion qui exigeait le tiret et un manque d’inodes temporaire. L’assertion de garde a été mise à jour pour exiger le lien; la suite complète repasse avec le résultat ci-dessus.

## Faits, hypothèses et recommandation

**Faits :** le nouveau CTA est une navigation interne vers la page VIP; les décisions Gemini valides existantes passent toujours par les branches d’affichage habituelles. La différence de build local est liée à la capacité d’inodes du sandbox, après compilation et génération des pages, et non à une erreur de code constatée.

**Hypothèse :** le run GitHub sur un runner frais dispose de suffisamment d’inodes pour terminer le build; cette hypothèse doit être confirmée par le run, pas par une nouvelle tentative locale.

**Recommandation :** pousser les commits locaux en un seul événement avec `[code-only]`. Le workflow ignorera la mise à jour des prédictions, Gemini, le pruning et l’actualisation des archives; le build frais et son allowlist FTP seront les barrières avant publication.

## État avant push

- Branche : `main`; tête distante vérifiée : `6433739226be3daf602c4c455c158de2c6444f5b`.
- Commit local UI : `ba1bc0c6989b4da03f4d0f4b57e7322544cdc5d0` (`fix(ui): link missing Gemini markets to VIP [code-only]`).
- Rapport précédent local : `92363f6b8a7c97a5836d4346c346c8f861f85968`.
- Aucun workflow actif au contrôle; run précédent ciblé #1065 terminé avec succès.
- Le propriétaire a autorisé un unique push/run code-only. L’état du run et la production seront ajoutés après cette vérification; en cas d’échec, aucun second run ne sera déclenché sans nouvelle autorisation.
