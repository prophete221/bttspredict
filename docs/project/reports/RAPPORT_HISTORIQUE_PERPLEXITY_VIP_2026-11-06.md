# Rapport — historique, recommandations Perplexity et parcours VIP — 6 novembre 2026

## Résumé

Le commit local `a32498e84ff4214ce364f18fdc7b668af3c45001`, préparé sur `main` depuis la base `753427397b6f023f905152a1c24baa33450ab175`, regroupe les corrections de l’historique public, la consolidation des liens partenaires et le clip VIP avec logos. Le push unique autorisé n’a pas encore eu lieu au moment de ce rapport.

Le clip est intégré aux pages [VIP en français](https://bttspredict.com/vip), [anglais](https://bttspredict.com/en/vip) et [arabe](https://bttspredict.com/ar/vip). L’historique public est filtré à BTTS; les archives sources et le flux VIP sont conservés.

## Ce qui change

**Historique et données.** Les pages [Historique](https://bttspredict.com/en/historique) et [Résultats vérifiés](https://bttspredict.com/en/resultats-verifies) rendent leurs statistiques et tableaux dès le HTML initial, sans attendre JavaScript; le tableau des résultats ne garde que BTTS. La page Historique ne réaffiche plus le bloc de pronostics à venir déjà présent sur les deux pages de pronostics. Le flux des résultats VIP, qui utilise aussi les gains Over 2.5, n’a pas été filtré.

L’exclusion repose exactement sur `date=2026-11-05` et `status=LOST` : 12 pertes retirées, 11 gains du jour conservés. Les compteurs globaux passent de 494 à 482 résultats vérifiés, de 388 à 388 gains et de 106 à 94 pertes; les 12 lignes deviennent non vérifiables (176 → 188). Les 47 résultats en attente et les 717 matchs archivés restent inchangés. Les 91 fichiers d’archives ont des empreintes identiques; aucun motif de panne n’a été ajouté au site. La cause Gemini du 5 novembre est celle signalée par le propriétaire; la sélection des lignes n’utilise que la date et le statut vérifiables.

Les cartes de statistiques agrégées BTTS et Over 2.5 restent visibles; seul le tableau des résultats est filtré à BTTS. Les deux pages de pronostics restent en place : le propriétaire a fourni une capture Search Console sur 24 h indiquant 59 clics pour `/en/btts-and-over-2-5-predictions-today` et 24 pour `/en/over-2-5/predictions/today`. Ces chiffres sont repris de sa capture, pas d’une lecture directe de Search Console. Aucun titre SEO, URL, canonical, redirection, fichier sitemap ou règle robots n’a été modifié.

**Affiliation.** Les liens externes répétés par carte ont été retirés des listes de matchs et regroupés en rails partenaires, ou remplacés dans le petit widget par un lien interne vers le guide partenaire. Les boutons APK communs et 888Starz affichent désormais le logo du bookmaker à côté de Google Play; la modale VIP affiche aussi les logos des boutons 1xBet, Linebet et 888Starz. Les destinations et codes partenaires existants ne changent pas.

**Vidéo VIP.** La vidéo H.264 de 27,58 secondes (1280×720, sans audio) montre les logos 1xBet, Linebet, Melbet et 888Starz à l’étape « Choisis un bookmaker », à partir des logos déjà utilisés par le site. Le lecteur intégré est manuel, sans lecture automatique, avec poster et mention « version française, sans audio ». Fichier livré : [`public/videos/vip-parcours.mp4`](/workspace/bttspredict-mission-d4F7pJ/repo/public/videos/vip-parcours.mp4).

## Vérifications

- Vitest : **53 fichiers réussis, 401 tests réussis, 16 ignorés**. L’unique échec initial était un test qui exigeait encore les anciens liens par carte; son attente a été mise à jour.
- Tests Python : **25 réussis**; la commande locale signale que `google-genai` n’est pas installé, sans publier de pronostics Gemini.
- ESLint : **0 erreur**, 5 avertissements préexistants dans `BottomNavigation.tsx`, `MobileTabBar.tsx` et `StickyVipBandeau.tsx` (fichiers non modifiés). `tsc --noEmit` réussit.
- `node scripts/update-win-history.mjs --dry-run` et `--validate public/win-history.json` réussissent. Une comparaison avec la base confirme exactement 12 lignes supprimées — toutes `LOST` du 5 novembre —, aucune autre ligne ajoutée ou retirée, et les 11 gains conservés.
- `npm run build -- --webpack` réussit : export statique des 154 pages et post-traitement sans fichier à nettoyer. Le `npm run build` standard a échoué localement avant compilation parce que Turbopack refuse le lien `node_modules` externe au sandbox; le workflow de déploiement utilise lui-même `npm run build -- --webpack`, qui est le build validé.
- Contrôle du HTML exporté : les pages FR/EN/AR contiennent les statistiques et 100 lignes BTTS sans placeholder de chargement ni bloc répété de pronostics; les trois pages VIP contiennent le lecteur et ses assets; sitemap et robots sont présents.
- Le lecteur et les fichiers MP4/logo ont été servis localement avec HTTP 200. Aucune capture visuelle n’a pu être écrite : Chromium a manqué d’inodes temporaires dans le sandbox (`FILE_ERROR_NO_SPACE`). Cette limite de capture n’affecte pas le build ni la disponibilité des assets; un aperçu mobile/desktop par screenshot reste non vérifié ici.

## Déploiement et décision de préservation

Le workflow standard sur push contient une étape de pruning « keep 90 »; il supprimerait une archive puisque 91 fichiers sont présents. Pour respecter la consigne de conserver toutes les archives et le jeu de données déjà contrôlé, le commit de code porte le marqueur `[code-only]`. Le run déclenché par le push unique exécutera tests, lint, typecheck, build et transfert FTP des fichiers préparés, y compris l’historique et les exclusions, mais sautera la régénération des prédictions/Gemini et le pruning automatique. Il n’y aura pas de second workflow lancé.

À la rédaction, le commit `a32498e84ff4214ce364f18fdc7b668af3c45001` est local sur `main`; la production n’est donc pas encore vérifiée. L’identifiant et le résultat du workflow, ainsi que le contrôle HTTP de production, seront rapportés dans le compte rendu de livraison.
