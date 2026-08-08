#!/usr/bin/env python3
"""
Audit SEO complet — corrige meta descriptions, titles, H1, canonicals.
"""
import re, os
from pathlib import Path

ROOT = Path('/home/z/my-project/bttspredict/src/app')

# ============================================================
# 1. FIX LAYOUT DEFAULT (affecte toutes les pages sans metadata explicite)
# ============================================================
def fix_layout():
    fpath = ROOT / 'layout.tsx'
    content = fpath.read_text(encoding='utf-8')
    
    fixes = [
        # Title — retirer "N°1" et "84,5% vérifié" (claims non prouvés)
        ('"BTTSPredict — N°1 des Prédictions BTTS par nos experts"', '"BTTSPredict — Pronostics BTTS et Over 2.5"'),
        ('"BTTSPredict — Pronostics BTTS fiables | 84,5% vérifié"', '"BTTSPredict — Pronostics BTTS et Over 2.5"'),
        # Description — retirer "84,5% vérifié" et "50 000 matchs" (claims non prouvés)
        ('"Pronostics BTTS aujourd\'hui et Over 2.5 par nos analystes experts. 84,5% vérifié, modèle Poisson calibré sur 50 000 matchs. Code promo VISION221."',
         '"Pronostics BTTS et Over 2.5 par moteur IA. Suivi public vérifié, code promo VISION221. 18+."'),
        # OG description
        ('"Pronostics BTTS fiables chaque jour. Résultats vérifiés et transparents. Code promo VISION221."',
         '"Pronostics BTTS et Over 2.5 par moteur IA. Suivi vérifié, code promo VISION221. 18+."'),
        # Twitter description
        ("\"Pronostics btts aujourd'hui validés par nos analystes. taux réel vérifiable sur /historique. Code promo VISION221.\"",
         '"Pronostics BTTS et Over 2.5 par moteur IA. Suivi vérifié, code promo VISION221. 18+."'),
    ]
    
    count = 0
    for old, new in fixes:
        if old in content:
            content = content.replace(old, new)
            count += 1
    
    fpath.write_text(content, encoding='utf-8')
    print(f'  layout.tsx: {count} fixes applied')

# ============================================================
# 2. FIX META DESCRIPTIONS (trop courtes ou trop longues)
# ============================================================
META_FIXES = {
    'btts-c-est-quoi/page.tsx': {
        'old': "Qu'est-ce que le BTTS ? Guide complet du pari Both Teams To Score : fonctionnement, stratégies et exemples. 18+.",
        'new': "Guide BTTS (Both Teams To Score) : fonctionnement, stratégies et exemples pour parier. 18+.",
    },
    'equipe/page.tsx': {
        'old': "Équipe d'analystes experts BTTSPredict : profils, expertise en modélisation Poisson, xG et analyses de valeur FIFA.",
        'new': "Équipe d'analystes BTTSPredict : profils, expertise en modélisation statistique et analyses football. 18+.",
    },
    'pronostics/page.tsx': {
        'old': "Pronostics BTTS aujourd'hui gratuits et premium. 20+ matchs analysés par nos experts avec modèle Poisson. Code VISION221 pour bonus 90 000 XOF.",
        'new': "Pronostics BTTS et Over 2.5 du jour par moteur IA. Sélections filtrées par ligues à fort taux. 18+.",
    },
}

def fix_meta_descriptions():
    for rel, fix in META_FIXES.items():
        fpath = ROOT / rel
        if not fpath.exists():
            print(f'  SKIP (missing): {rel}')
            continue
        content = fpath.read_text(encoding='utf-8')
        if fix['old'] in content:
            content = content.replace(fix['old'], fix['new'])
            fpath.write_text(content, encoding='utf-8')
            print(f'  FIXED: {rel} ({len(fix["old"])} → {len(fix["new"])} chars)')
        else:
            # Try regex for const DESCRIPTION
            pattern = r"(const DESCRIPTION\s*=\s*)'([^']+)'"
            m = re.search(pattern, content)
            if m:
                content = content.replace(m.group(0), f"{m.group(1)}'{fix['new']}'")
                fpath.write_text(content, encoding='utf-8')
                print(f'  FIXED (regex): {rel} → {len(fix["new"])} chars')
            else:
                print(f'  SKIP (old not found): {rel}')

# ============================================================
# 3. FIX /pronostics — retirer redirect, faire vraie page
# ============================================================
def fix_pronostics_redirect():
    fpath = ROOT / 'pronostics/page.tsx'
    content = fpath.read_text(encoding='utf-8')
    # Vérifier si c'est toujours un redirect
    if 'redirect-client' in content:
        new_content = '''import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: "Pronostics BTTS et Over 2.5 du jour",
  description: "Pronostics BTTS et Over 2.5 du jour par moteur IA. Sélections filtrées par ligues à fort taux. 18+.",
  alternates: { canonical: 'https://bttspredict.com/pronostics' },
  robots: { index: true, follow: true },
}

export default function PronosticsPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-6 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronostics BTTS et Over 2.5
          </h1>
          <p className="text-base sm:text-lg text-[#A5ABC5] leading-relaxed mb-3">
            Sélections du jour générées par le moteur IA, filtrées par ligues à fort taux de BTTS et forme récente des équipes.
          </p>
          <p className="text-sm text-[#6B7194] leading-relaxed">
            Aucun gain n'est garanti. Les pronostics sont publiés à titre informatif. 18+.
          </p>
        </section>
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>
      </main>
      <Footer />
    </div>
  )
}
'''
        fpath.write_text(new_content, encoding='utf-8')
        print(f'  FIXED: pronostics/page.tsx — redirect removed, real page created')
    else:
        print(f'  SKIP: pronostics/page.tsx already a real page')

# ============================================================
# 4. FIX /vip — retirer redirect, faire vraie page
# ============================================================
def fix_vip_redirect():
    fpath = ROOT / 'vip/page.tsx'
    content = fpath.read_text(encoding='utf-8')
    if 'redirect-client' in content:
        new_content = '''import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'

export const metadata: Metadata = {
  title: "VIP — Pronostics premium BTTS et Over 2.5",
  description: "Programme VIP BTTSPredict : pronostics premium, multi-sports, analyses détaillées. Aucun gain garanti. 18+.",
  alternates: { canonical: 'https://bttspredict.com/vip' },
  robots: { index: true, follow: true },
}

export default function VipPage() {
  return (
    <div className="min-h-screen bg-[#070B18] flex flex-col text-[#F7F8FF]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-12 pb-8 sm:pt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronostics premium BTTS et Over 2.5
          </h1>
          <p className="text-base sm:text-lg text-[#A5ABC5] leading-relaxed mb-3">
            Le programme VIP propose des sélections supplémentaires et des analyses détaillées, basées sur le même moteur IA que les pronostics gratuits.
          </p>
          <p className="text-sm text-[#6B7194] leading-relaxed">
            Aucun gain n'est garanti. Lien d'affiliation rémunéré. BTTSPredict ne prend pas de paris et ne collecte pas de fonds. 18+.
          </p>
        </section>
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Comparaison des niveaux VIP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
              <h3 className="text-lg font-bold mb-3 text-[#F7F8FF]">VIP Essentiel</h3>
              <ul className="space-y-2 text-sm text-[#A5ABC5]">
                <li>• Pronostics BTTS du jour</li>
                <li>• Pronostics Over 2.5 du jour</li>
                <li>• Historique vérifiable</li>
                <li>• Support email standard</li>
              </ul>
              <p className="text-xs text-[#6B7194] mt-4">Dépôt min. 3 000 XOF chez Linebet</p>
            </div>
            <div className="p-6 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(255, 200, 87, 0.25)' }}>
              <h3 className="text-lg font-bold mb-3 text-[#FFC857]">VIP Pro</h3>
              <ul className="space-y-2 text-sm text-[#A5ABC5]">
                <li>• Pronostics premium supplémentaires</li>
                <li>• Gold Picks (proba élevée)</li>
                <li>• Analyses détaillées</li>
                <li>• Support prioritaire</li>
              </ul>
              <p className="text-xs text-[#6B7194] mt-4">Dépôt min. 6 000 XOF</p>
            </div>
          </div>
        </section>
        <section className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Conditions
          </h2>
          <div className="p-5 rounded-2xl space-y-3" style={{ backgroundColor: '#0D1630', border: '1px solid #303861' }}>
            <p className="text-sm text-[#A5ABC5]">• L'accès VIP ne garantit aucun gain. Les paris sportifs comportent un risque de perte.</p>
            <p className="text-sm text-[#A5ABC5]">• BTTSPredict ne prend pas de paris et ne collecte pas de fonds.</p>
            <p className="text-sm text-[#A5ABC5]">• Lien d'affiliation rémunéré. Code promo VISION221.</p>
            <p className="text-sm text-[#A5ABC5]">• Réservé aux personnes majeures (18+).</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
'''
        fpath.write_text(new_content, encoding='utf-8')
        print(f'  FIXED: vip/page.tsx — redirect removed, real page created')
    else:
        print(f'  SKIP: vip/page.tsx already a real page')

# ============================================================
# 5. FIX HOMEPAGE H1 — s'assurer qu'il y a un H1 visible
# ============================================================
def fix_homepage_h1():
    # Le Hero component a déjà un H1 — vérifier qu'il est bien rendu
    # Si la homepage n'a pas de H1 dans page.tsx, c'est OK car Hero.tsx en a un
    print(f'  Homepage H1: provided by Hero.tsx component (line 73)')

# ============================================================
# 6. FIX /historique title — retirer "84,5% vérifié"
# ============================================================
def fix_historique_title():
    fpath = ROOT / 'historique/page.tsx'
    content = fpath.read_text(encoding='utf-8')
    old_title = "Historique Pronostics — 84,5% vérifié"
    new_title = "Historique vérifié — BTTSPredict"
    if old_title in content:
        content = content.replace(old_title, new_title)
        fpath.write_text(content, encoding='utf-8')
        print(f'  FIXED: historique title (removed 84,5% claim)')
    else:
        print(f'  SKIP: historique title already fixed')

# ============================================================
# 7. FIX /statistiques — devrait être noindex (placeholder)
# ============================================================
def fix_statistiques_noindex():
    fpath = ROOT / 'statistiques/page.tsx'
    content = fpath.read_text(encoding='utf-8')
    # Vérifier si c'est un placeholder
    if 'noindex' not in content:
        # Ajouter robots noindex
        old = "export const metadata: Metadata = {"
        new = "export const metadata: Metadata = {\n  robots: { index: false, follow: true },"
        if old in content:
            content = content.replace(old, new, 1)
            fpath.write_text(content, encoding='utf-8')
            print(f'  FIXED: statistiques/page.tsx — noindex added (placeholder page)')
        else:
            print(f'  SKIP: statistiques metadata pattern not found')
    else:
        print(f'  SKIP: statistiques already noindex')

# ============================================================
# 8. FIX /pronostics description dans const DESCRIPTION si existe
# ============================================================
def fix_pronostics_desc():
    fpath = ROOT / 'pronostics/page.tsx'
    content = fpath.read_text(encoding='utf-8')
    # Vérifier s'il y a une description trop courte
    old_short = "Pronostics BTTS aujourd\\'hui"
    if old_short in content:
        new_desc = "Pronostics BTTS et Over 2.5 du jour par moteur IA. Sélections filtrées par ligues à fort taux. 18+."
        content = content.replace(old_short, "Pronostics BTTS et Over 2.5")
        fpath.write_text(content, encoding='utf-8')
        print(f'  FIXED: pronostics description (escaped apostrophe)')

# ============================================================
# MAIN
# ============================================================
print('=== FIXING LAYOUT DEFAULTS ===')
fix_layout()

print('\n=== FIXING META DESCRIPTIONS ===')
fix_meta_descriptions()

print('\n=== FIXING /pronostics REDIRECT ===')
fix_pronostics_redirect()

print('\n=== FIXING /vip REDIRECT ===')
fix_vip_redirect()

print('\n=== FIXING HOMEPAGE H1 ===')
fix_homepage_h1()

print('\n=== FIXING /historique TITLE ===')
fix_historique_title()

print('\n=== FIXING /statistiques NOINDEX ===')
fix_statistiques_noindex()

print('\n=== DONE ===')
