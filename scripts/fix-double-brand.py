#!/usr/bin/env python3
"""Fix titres double-marque : "%s | BTTSPredict" (template) + marque dans le
title source => "X | BTTSPredict | BTTSPredict" en rendu.
Retire la marque des titles sources des pages (le template la rajoute).
layout.tsx est exclu : son title.default n'est PAS wrappé par le template."""
import os, re, sys

ROOT = '/home/z/my-project/bttspredict/src/app'
changes = []

for dirpath, dirs, files in os.walk(ROOT):
    for f in files:
        if not f.endswith('.tsx'):
            continue
        fp = os.path.join(dirpath, f)
        # layout.tsx : title.default contient la marque légitimement (non wrappé)
        if f == 'layout.tsx':
            continue
        src = open(fp, encoding='utf-8').read()
        new = src
        # Marque en fin de title (|" "| variantes ASCII et franÃ§aises)
        new = re.sub(r"(\|\s*BTTSPredict)(?=['\`])", '', new)
        # Marque en prÃ©fixe "BTTSPredict â " (home et pages Ã©quivalentes)
        new = re.sub(r"'BTTSPredict â ", "'", new)
        new = re.sub(r'"BTTSPredict â ', '"', new)
        if new != src:
            changes.append(fp)
            open(fp, 'w', encoding='utf-8').write(new)

for c in changes:
    print('FIXED', os.path.relpath(c, ROOT))
print(f'Total: {len(changes)} fichiers')
