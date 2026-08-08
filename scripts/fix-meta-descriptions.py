#!/usr/bin/env python3
"""
Audit et correction des meta descriptions de toutes les pages indexables.
Règle: 25-160 caractères (cible 120-155).
"""
import re, os
from pathlib import Path

ROOT = Path('/home/z/my-project/bttspredict/src/app')

# Nouvelles descriptions optimisées (120-155 caractères cible)
FIXES = {
    'layout.tsx': {
        'old': "Pronostics BTTS aujourd'hui et Over 2.5 par nos analystes experts. taux réel sur /historique, modèle IA nouvelle génération calibré sur des millions de données historiques. Code promo VISION221.",
        'new': "Pronostics BTTS et Over 2.5 par moteur IA. Suivi public vérifié, code promo VISION221. 18+.",
    },
    'btts/predictions/today/page.tsx': {
        'old': "Pronostics BTTS (Both Teams To Score) du jour générés par le moteur IA nouvelle génération de BTTSPredict. Sélection des matchs à fort potentiel BTTS, ligues à fort taux, forme récente. Aucun gain garanti. 18+.",
        'new': "Pronostics BTTS du jour par moteur IA. Sélection de matchs à fort potentiel Both Teams To Score, ligues à fort taux. 18+.",
    },
    'btts/predictions/tomorrow/page.tsx': {
        'old': "Aperçu des matchs BTTS de demain. BTTSPredict publie quotidiennement une sélection de pronostics BTTS (Both Teams To Score) générés par un moteur IA. Aucun gain garanti. 18+.",
        'new': "Aperçu des pronostics BTTS de demain. Sélection quotidienne de matchs Both Teams To Score par moteur IA. 18+.",
    },
    'btts/statistics/page.tsx': {
        'old': "Statistiques BTTS par ligue : taux historique de Both Teams To Score sur les principales ligues couvertes par BTTSPredict. Premier League, Bundesliga, Eredivisie, Championship, etc. 18+.",
        'new': "Statistiques BTTS par ligue : taux historique de Both Teams To Score. Premier League, Bundesliga, Eredivisie et plus. 18+.",
    },
    'historique/page.tsx': {
        'old': "Historique vérifié du nouveau modèle de suivi BTTSPredict. Chaque pronostic est enregistré, horodaté et évalué après le résultat officiel du match. Aucun résultat futur n'est garanti. 18+.",
        'new': "Historique vérifié BTTSPredict : chaque pronostic est enregistré, horodaté et évalué après le résultat officiel. 18+.",
    },
    'methodologie/page.tsx': {
        'old': "Méthodologie du moteur IA de BTTSPredict : approche prédictive, sources de données publiques, marchés couverts, calibration continue. Aucun résultat futur garanti. 18+.",
        'new': "Méthodologie du moteur IA BTTSPredict : approche prédictive, sources de données, marchés couverts, calibration continue. 18+.",
    },
    'over-2-5/predictions/today/page.tsx': {
        'old': "Pronostics Over 2.5 du jour générés par le moteur IA nouvelle génération de BTTSPredict. Sélection de matchs à fort potentiel de buts (3+). Ligues offensives, forme récente. Aucun gain garanti. 18+.",
        'new': "Pronostics Over 2.5 du jour par moteur IA. Matchs à fort potentiel de buts (3+), ligues offensives, forme récente. 18+.",
    },
    'over-2-5/statistics/page.tsx': {
        'old': "Statistiques Over 2.5 par ligue : taux historique de matchs à 3+ buts sur les principales ligues couvertes par BTTSPredict. Bundesliga, Eredivisie, Premier League, etc. 18+.",
        'new': "Statistiques Over 2.5 par ligue : taux historique de matchs à 3+ buts. Bundesliga, Eredivisie, Premier League et plus. 18+.",
    },
    'pronostics/page.tsx': {
        'old': "Pronostics BTTS et Over 2.5 du jour basés sur un modèle IA nouvelle génération. Sélections filtrées par ligues à fort taux de BTTS et forme récente des équipes. 18+.",
        'new': "Pronostics BTTS et Over 2.5 du jour par moteur IA. Sélections filtrées par ligues à fort taux de BTTS et forme récente. 18+.",
    },
}

# Fixes pour les pages avec const DESCRIPTION (trop longues)
CONST_FIXES = {
    'betting-tips/page.tsx': {
        'old': "Betting tips football par BTTSPredict. BTTS, Over 2.5, analyses de valeur statistique FIFA, gestion bankroll. Code promo VISION221 sur Linebet et 888starz. Aucun résultat n'est garanti. 18+.",
        'new': "Betting tips football : BTTS, Over 2.5, analyses de valeur et gestion bankroll. Code promo VISION221. 18+.",
    },
    'blog/faille-fifa-linebet/page.tsx': {
        'old': "Analyses de valeur FIFA (expérimental) sur Linebet et 888starz : comment détecter les cotes erronées FIFA et exploiter les value bets. Méthode, exemples et code promo VISION221.",
        'new': "Analyses de valeur FIFA sur Linebet et 888starz : détection des cotes erronées et value bets. Méthode et exemples. 18+.",
    },
    'bonus-888starz/page.tsx': {
        'old': "Bonus exclusif 888starz avec code promo. Inscription facile, dépôt local, analyse complète des offres et conditions. BTTSPredict recommande 888starz pour les parieurs africains.",
        'new': "Bonus 888starz avec code promo. Inscription, dépôt local et conditions d'offre analysées. 18+.",
    },
    'faille-fifa/page.tsx': {
        'old': "Analyses de valeur FIFA (expérimental) Linebet : détection des cotes erronées et analyses de valeur statistique. Méthode validée par nos analystes. Code VISION221.",
        'new': "Analyses de valeur FIFA Linebet : détection des cotes erronées et value bets. Méthode et code VISION221. 18+.",
    },
    'football-predictions-today/page.tsx': {
        'old': "Pronostics football aujourd'hui par nos analystes. BTTS, Over 2.5, scores exacts, analyses de valeur FIFA. Modèle IA nouvelle génération calibré sur des millions de données. Code VISION221.",
        'new': "Pronostics football du jour : BTTS, Over 2.5 et scores exacts par moteur IA. Sélection quotidienne de matchs. 18+.",
    },
    'linebet-promo-code/page.tsx': {
        'old': "Code promo Linebet VISION221 : bonus sous conditions (mise x5, dépôt min, voir site). Inscription, dépôt Wave/Orange Money et APK Android. Aucun gain garanti. 18+.",
        'new': "Code promo Linebet VISION221 : conditions de bonus, inscription, dépôt Wave/Orange Money et APK. 18+.",
    },
    'match-predictions/page.tsx': {
        'old': "Pronostics par match : BTTS, Over 2.5, score exact. Analyse détaillée de chaque match avec indices de performance, probabilités Poisson et statistiques. taux réel sur /historique.",
        'new': "Pronostics par match : BTTS, Over 2.5, score exact. Analyse détaillée avec probabilités et statistiques. 18+.",
    },
    'team-predictions/page.tsx': {
        'old': "Pronostics par équipe football : analyse indices de performance, forme récente, statistiques offensives/défensives. BTTS et Over 2.5 par équipe, taux réel sur /historique.",
        'new': "Pronostics par équipe : analyse de forme récente et statistiques offensives/défensives. BTTS et Over 2.5. 18+.",
    },
}

# Pages sans description qui utilisent layout default — OK car layout a une description
# Pages légales avec DESCRIPTION const — vérifier longueurs
LEGAL_CHECKS = {
    'cgu/page.tsx': "CGU BTTSPredict : conditions d'utilisation, service, affiliation, avertissement et responsabilités.",
    'mentions-legales/page.tsx': "Mentions légales BTTSPredict : éditeur, hébergement, propriété intellectuelle, responsabilité et droit applicable.",
    'politique-confidentialite/page.tsx': "Politique de confidentialité de BTTSPredict — collecte de données, utilisation, services tiers, droits des utilisateurs, politique de cookies et contact.",
    'jouer-responsable/page.tsx': "Jouer responsable avec BTTSPredict : risques, addiction, conseils et ressources d'aide. 18+ uniquement.",
}

def apply_fixes():
    fixed = 0
    skipped = 0

    # Fix inline descriptions
    for rel_path, fix in {**FIXES}.items():
        fpath = ROOT / rel_path
        if not fpath.exists():
            print(f'  SKIP (missing): {rel_path}')
            skipped += 1
            continue
        content = fpath.read_text(encoding='utf-8')
        if fix['old'] in content:
            new_content = content.replace(fix['old'], fix['new'])
            fpath.write_text(new_content, encoding='utf-8')
            old_len = len(fix['old'])
            new_len = len(fix['new'])
            print(f'  FIXED: {rel_path} ({old_len} → {new_len} chars)')
            fixed += 1
        else:
            # Try partial match
            print(f'  SKIP (old not found): {rel_path}')
            skipped += 1

    # Fix const DESCRIPTION
    for rel_path, fix in CONST_FIXES.items():
        fpath = ROOT / rel_path
        if not fpath.exists():
            print(f'  SKIP (missing): {rel_path}')
            skipped += 1
            continue
        content = fpath.read_text(encoding='utf-8')
        if fix['old'] in content:
            new_content = content.replace(fix['old'], fix['new'])
            fpath.write_text(new_content, encoding='utf-8')
            old_len = len(fix['old'])
            new_len = len(fix['new'])
            print(f'  FIXED: {rel_path} ({old_len} → {new_len} chars)')
            fixed += 1
        else:
            print(f'  SKIP (old not found): {rel_path}')
            skipped += 1

    # Check legal pages
    print('\n=== Legal pages check ===')
    for rel_path, desc in LEGAL_CHECKS.items():
        fpath = ROOT / rel_path
        if not fpath.exists():
            continue
        dlen = len(desc)
        status = 'OK' if 25 <= dlen <= 160 else 'NEEDS FIX'
        print(f'  {rel_path}: {dlen} chars — {status}')

    # Also fix layout.tsx OpenGraph/Twitter descriptions
    layout_path = ROOT / 'layout.tsx'
    if layout_path.exists():
        content = layout_path.read_text(encoding='utf-8')
        # Fix OG description
        old_og = 'description: "Pronostics BTTS fiables chaque jour. Résultats vérifiés et transparents. Code promo VISION221."'
        new_og = 'description: "Pronostics BTTS et Over 2.5 par moteur IA. Suivi vérifié, code promo VISION221. 18+."'
        if old_og in content:
            content = content.replace(old_og, new_og)
            print(f'  FIXED: layout.tsx OG description ({len(old_og)} → {len(new_og)} chars)')
            fixed += 1
        # Fix Twitter description
        old_tw = 'description: "Pronostics btts aujourd\'hui validés par nos analystes. taux réel vérifiable sur /historique. Code promo VISION221."'
        new_tw = 'description: "Pronostics BTTS et Over 2.5 par moteur IA. Suivi vérifié, code promo VISION221. 18+."'
        if old_tw in content:
            content = content.replace(old_tw, new_tw)
            print(f'  FIXED: layout.tsx Twitter description')
            fixed += 1
        layout_path.write_text(content, encoding='utf-8')

    print(f'\n=== Summary ===')
    print(f'Fixed: {fixed}')
    print(f'Skipped: {skipped}')
    return fixed

if __name__ == '__main__':
    apply_fixes()
