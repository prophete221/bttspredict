#!/usr/bin/env python3
"""
Clean up weak/false claims from 7 SEO landing pages.
Replaces: 200+ variables, xG, 6 pronostics/jour, 20+ premium, modèle Poisson,
          seuil 0.48, seuil 0.49, "modèle de Poisson calibré sur des millions",
          "équipe d'analystes valide chaque pronostic", "200+ variables par match".
"""
import re
from pathlib import Path

ROOT = Path('/home/z/my-project/bttspredict/src/app')
FILES = [
    'match-predictions/page.tsx',
    'over-2-5-predictions/page.tsx',
    'correct-score-predictions/page.tsx',
    'football-predictions-today/page.tsx',
    'betting-tips/page.tsx',
    'league-predictions/page.tsx',
    'team-predictions/page.tsx',
]

REPLACEMENTS = [
    # 200+ variables → form récente
    (r'200\+\s*variables?\s*(?:par\s*(?:match|équipe))?', 'la forme récente des équipes'),
    (r'200\+\s*variables?', 'forme récente'),
    # xG → indices de performance
    (r'Expected\s*Goals\s*\(xG\)', 'indices de performance'),
    (r'xG\s*\(Expected\s*Goals\)', 'indices de performance'),
    (r'\bxG\b', 'indices de performance'),
    (r'xGA\s*\(Expected\s*Goals\s*Against\)', 'indices défensifs'),
    (r'\bxGA\b', 'indices défensifs'),
    # 6 pronostics/jour → sélection
    (r'6\s*pronostics?\s*gratuits?\s*(?:publiés\s*)?chaque\s*jour', 'une sélection quotidienne de pronostics gratuits'),
    (r'6\s*pronostics?\s*gratuits?\s*par\s*jour', 'une sélection quotidienne de pronostics gratuits'),
    (r'6\s*pronostics?\s*gratuits?\s*sont\s*publiés\s*chaque\s*jour', 'une sélection quotidienne de pronostics gratuits est publiée'),
    (r'6\s*pronostics?\s*football\s*gratuits?\s*chaque\s*jour', 'une sélection quotidienne de pronostics football gratuits'),
    (r'BTTSPredict\s*pub[a-z]+\s*6\s*pronostics?', 'BTTSPredict publie une sélection de pronostics'),
    (r'BTTSPredict\s*pubifie\s*6\s*pronostics', 'BTTSPredict publie une sélection de pronostics'),
    # 20+ pronostics premium → sélection premium
    (r'20\+\s*pronostics?\s*premium\s*par\s*jour\s*sur\s*6\s*sports', 'des sélections premium sur plusieurs sports'),
    (r'20\+\s*pronostics?\s*premium\s*par\s*jour', 'des sélections premium supplémentaires'),
    # modèle Poisson calibré sur des millions
    (r'modèle\s*de\s*Poisson\s*calibré\s*sur\s*des\s*millions\s*de\s*données\s*historiques', 'moteur IA nouvelle génération calibré en continu'),
    (r'modèle\s*de\s*Poisson', 'moteur IA'),
    (r'modèle\s*Poisson', 'moteur IA'),
    (r'Modèle\s*Poisson', 'Moteur IA'),
    # seuils 0.48, 0.49
    (r'seuil\s*de\s*recommandation\s*:\s*0\.48', 'seuil de confiance élevé'),
    (r'seuil\s*0\.48', 'seuil de confiance élevé'),
    (r'seuil\s*0\.49', 'seuil de confiance élevé'),
    (r'\(seuil\s*0\.48\)', '(seuil de confiance élevé)'),
    (r'\(seuil\s*0\.49\)', '(seuil de confiance élevé)'),
    # "équipe d'analystes valide chaque pronostic"
    (r"[Nn]otre\s+équipe\s+d['']analystes\s+experts\s+valide\s+chaque\s+pronostic", 'le moteur IA génère automatiquement chaque pronostic (aucune validation humaine)'),
    (r"[Nn]otre\s+équipe\s+d['']analystes\s+experts", 'notre moteur IA nouvelle génération'),
    # "analystes experts" genérique
    (r"[Nn]os\s+analystes\s+analysent\s+des\s+centaines\s+de\s+variables", 'notre moteur IA analyse la forme récente des équipes'),
    # "puis validés manuellement"
    (r',\s*puis\s*validés\s*manuellement', ' (génération automatique, aucune validation humaine)'),
    # "buts attendus (xG)" déjà remplacé
    (r'les\s*but\s*attendus\s*\(indices\s*de\s*performance\)', 'les indices de performance'),
    (r'les\s*but\s*attendus\s*\([^\)]+\)\s*et\s*', 'les indices de performance et '),
    (r'les\s*but\s*attendus', 'les indices de performance'),
    # "matrice de Poisson complète"
    (r'matrice\s*de\s*Poisson\s*complète', 'matrice de probabilités complète'),
    # "lambdas (but attendus)" → "indices de performance"
    (r'les\s*lambdas\s*\(but\s*attendu\)\s*des\s*deux\s*équipes\s*à\s*partir\s*de\s*[^\.:]+:\s*', 'les indices de performance des deux équipes à partir de la forme récente. '),
    # "Manchester City, Bayern Munich, Ajax"
    (r'Manchester\s*City,\s*Bayern\s*Munich,\s*Ajax', 'des équipes offensives régulières'),
    # "taux réel vérifiable vérifiée"
    (r'taux\s*réel\s*vérifiable\s*vérifiée', 'taux réel vérifiable'),
    # typo "pubiait/pubifie"
    (r'BTTSPredict\s+pubiait', 'BTTSPredict publie'),
]

for rel in FILES:
    p = ROOT / rel
    if not p.exists():
        print(f'  SKIP (missing): {rel}')
        continue
    original = p.read_text(encoding='utf-8')
    new = original
    for pattern, repl in REPLACEMENTS:
        new = re.sub(pattern, repl, new, flags=re.IGNORECASE if pattern.startswith(r'200') else 0)
    if new != original:
        p.write_text(new, encoding='utf-8')
        print(f'  CLEANED: {rel}')
    else:
        print(f'  no change: {rel}')

print('Done.')
