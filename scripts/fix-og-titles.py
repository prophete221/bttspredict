#!/usr/bin/env python3
"""Nettoyage final des titles après suppression de la double marque.
La marque est extraite du template du layout racine (zéro hypothèse
d'orthographe dans ce script)."""
import os, re

ROOT = '/home/z/my-project/bttspredict/src/app'
LAYOUT = os.path.join(ROOT, 'layout.tsx')

# ── Marque canonique dérivée du layout ──
layout_src = open(LAYOUT, encoding='utf-8').read()
m = re.search(r"template:\s*'([^']*)'", layout_src) or re.search(r'template:\s*"([^"]*)"', layout_src)
assert m, 'template introuvable dans layout.tsx'
TEMPLATE = m.group(1)                      # ex: '%s | BTTSPredict'
BRAND = TEMPLATE.split('%s', 1)[1].strip().strip('|').strip()  # ex: 'BTTSPredict'
print(f'Marque dérivée du layout: {BRAND!r}')
assert BRAND.startswith('BTTS'), f'marque inattendue: {BRAND!r}'

# ── Fichiers dont le bloc openGraph/twitter a été touché (source de vérité : git diff) ──
import subprocess
OG_FILES = [
    f for f in subprocess.run(
        ['git', 'diff', '--name-only', 'src/'],
        capture_output=True, text=True, cwd='/home/z/my-project/bttspredict',
    ).stdout.split('\n')
    if f.endswith('page.tsx')
]
print(f'OG candidates: {OG_FILES}')

def process(path, restore_og):
    src = open(path, encoding='utf-8').read()
    changed = False

    # 1. trim des espaces traînantes dans title:'X '
    new = re.sub(r"title: '([^']*?)\s+'", r"title: '\1'", src)
    new = re.sub(r'title: "([^"]*?)\s+"', r'title: "\1"', new)
    if new != src:
        changed = True
        src = new

    # 2. OG/twitter : ré-ajouter la marque sur la ligne title: qui suit
    if restore_og:
        lines = src.split('\n')
        for i, line in enumerate(lines):
            if re.search(r'(openGraph|twitter):\s*\{', line):
                for j in range(i, min(i + 4, len(lines))):
                    mm = re.match(r"(\s*title: ')([^']*)(',\s*)$", lines[j])
                    if mm and BRAND not in mm.group(2):
                        lines[j] = f"{mm.group(1)}{mm.group(2).rstrip()} | {BRAND}{mm.group(3)}"
                        changed = True
                        break
                    if re.match(r"\s*title: '[^']*", lines[j]) and BRAND in lines[j]:
                        break
        src = '\n'.join(lines)

    if changed:
        open(path, 'w', encoding='utf-8').write(src)
        return True
    return False

fixed = 0
for dp, _, fs in os.walk(ROOT):
    for f in fs:
        if f.endswith('.tsx') and f != 'layout.tsx':
            p = os.path.join(dp, f)
            if process(p, any(p.endswith(x) for x in OG_FILES)):
                fixed += 1
print(f'Fichiers nettoyés: {fixed}')
