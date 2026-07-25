#!/usr/bin/env python3
"""
BttsBet VIP Modal + Premium Design Upgrade Script
TASK 1: Replace 4 ID-collection modals with shared VipUnlockModal (no form)
TASK 2: Add premium design elements (fonts, CSS, 3D lock, terminal, confetti)
"""

import re
import os

BASE = '/home/z/my-project/src'

def replace_modal_in_promovip():
    """Replace VipModal function in PromoVip.tsx and use VipUnlockModal"""
    filepath = f'{BASE}/components/bttsbet/PromoVip.tsx'
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Remove the old VipModal function (lines 10-277)
    # Find the VipModal function and remove it entirely
    old_modal_pattern = r'''function VipModal\(\{ isOpen, onClose \}: \{ isOpen: boolean; onClose: \(\) => void \}\) \{.*?^\}'''
    content = re.sub(old_modal_pattern, '', content, flags=re.DOTALL | re.MULTILINE)
    
    # 2. Add VipUnlockModal import
    old_import = "import { CrownIcon, FloatingParticles } from './AnimatedIcons'"
    new_import = "import { CrownIcon, FloatingParticles } from './AnimatedIcons'\nimport VipUnlockModal from './VipUnlockModal'"
    content = content.replace(old_import, new_import)
    
    # 3. Remove modal-related imports that are no longer needed
    # Remove modalBackdrop, modalContent from motion presets import if VipModal was the only user
    # Actually keep them since other components might use them - just leave the imports
    
    # 4. Replace VipModal call with VipUnlockModal
    content = content.replace(
        '<VipModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />',
        '<VipUnlockModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />'
    )
    
    # 5. Clean up empty lines left by removal
    # Remove multiple consecutive blank lines (keep max 2)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath}')

def replace_modal_in_vipsports():
    """Replace VipModal function in VipSports.tsx and use VipUnlockModal"""
    filepath = f'{BASE}/components/bttsbet/VipSports.tsx'
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Remove the old VipModal function (lines 18-283)
    old_modal_pattern = r'''function VipModal\(\{ isOpen, onClose, sport \}: \{ isOpen: boolean; onClose: \(\) => void; sport\?: string \}\) \{.*?^\}'''
    content = re.sub(old_modal_pattern, '', content, flags=re.DOTALL | re.MULTILINE)
    
    # 2. Add VipUnlockModal import
    old_import = "import { StatsIcon, FloatingParticles } from './AnimatedIcons'"
    new_import = "import { StatsIcon, FloatingParticles } from './AnimatedIcons'\nimport VipUnlockModal from './VipUnlockModal'"
    content = content.replace(old_import, new_import)
    
    # 3. Replace VipModal call with VipUnlockModal
    content = content.replace(
        '<VipModal isOpen={modalOpen} onClose={() => setModalOpen(false)} sport={activeSport} />',
        '<VipUnlockModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Débloque les pronos VIP ${activeSport || ''}`} />'
    )
    
    # 4. Clean up empty lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath}')

def replace_modal_in_aviatorvip():
    """Replace VipModal function in AviatorVip.tsx and use VipUnlockModal"""
    filepath = f'{BASE}/components/bttsbet/AviatorVip.tsx'
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Remove the old VipModal function (lines 71-228)
    # The VipModal section starts with "// ─── VipModal" comment
    old_modal_pattern = r'''// ─── VipModal \(same pattern as other VIP sections\) ───\nfunction VipModal\(\{ isOpen, onClose \}: \{ isOpen: boolean; onClose: \(\) => void \}\) \{.*?^\}'''
    content = re.sub(old_modal_pattern, '', content, flags=re.DOTALL | re.MULTILINE)
    
    # 2. Add VipUnlockModal import
    old_import = "import { RocketIcon, FloatingParticles } from './AnimatedIcons'"
    new_import = "import { RocketIcon, FloatingParticles } from './AnimatedIcons'\nimport VipUnlockModal from './VipUnlockModal'"
    content = content.replace(old_import, new_import)
    
    # 3. Replace VipModal call with VipUnlockModal
    content = content.replace(
        '<VipModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} />',
        '<VipUnlockModal isOpen={showVipModal} onClose={() => setShowVipModal(false)} title="Débloque VIP Aviator" subtitle="Signaux Aviator + multiplicateurs exclusifs" />'
    )
    
    # 4. Clean up
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath}')

def replace_modal_in_fifalinebet():
    """Replace FifaModal function in FifaLinebet.tsx and use VipUnlockModal"""
    filepath = f'{BASE}/components/bttsbet/FifaLinebet.tsx'
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Remove the FifaModal function (lines 13-180)
    old_modal_pattern = r'''/\* ─────────────────────────── FIFA MODAL ─────────────────────────── \*/\nfunction FifaModal\(\{ isOpen, onClose \}: \{ isOpen: boolean; onClose: \(\) => void \}\) \{.*?^\}'''
    content = re.sub(old_modal_pattern, '', content, flags=re.DOTALL | re.MULTILINE)
    
    # 2. Add VipUnlockModal import
    old_import = "import { GameController, FloatingParticles } from './AnimatedIcons'"
    new_import = "import { GameController, FloatingParticles } from './AnimatedIcons'\nimport VipUnlockModal from './VipUnlockModal'"
    content = content.replace(old_import, new_import)
    
    # 3. Replace FifaModal call with VipUnlockModal
    content = content.replace(
        '<FifaModal isOpen={showFifaModal} onClose={() => setShowFifaModal(false)} />',
        '<VipUnlockModal isOpen={showFifaModal} onClose={() => setShowFifaModal(false)} title="Débloque les Value Bets FIFA" subtitle="Cotes FIFA exclusives + failles détectées par IA" />'
    )
    
    # 4. Clean up
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath}')

def update_layout_fonts():
    """Update layout.tsx: Replace Inter/Manrope with Sora + JetBrains Mono"""
    filepath = f'{BASE}/app/layout.tsx'
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace font imports
    content = content.replace(
        'import { Inter, Manrope } from "next/font/google";',
        'import { Sora, JetBrains_Mono } from "next/font/google";'
    )
    
    # Replace Inter definition
    content = content.replace(
        '''const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});''',
        '''const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});'''
    )
    
    # Replace Manrope definition
    content = content.replace(
        '''const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});''',
        '''const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  display: 'swap',
});'''
    )
    
    # Replace body className
    content = content.replace(
        '${inter.variable} ${manrope.variable} antialiased',
        '${sora.variable} ${jetbrains.variable} antialiased'
    )
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath} - Fonts: Sora + JetBrains Mono')

def add_premium_css():
    """Add premium design CSS to globals.css"""
    filepath = f'{BASE}/app/globals.css'
    with open(filepath, 'r') as f:
        content = f.read()
    
    premium_css = '''
/* ═══════════════════════════════════════════════════════════════
   BttsBet — PREMIUM DESIGN v15 — 2026 Upgrade
   Sora + JetBrains Mono, Gradient Mesh, 3D Lock, Terminal, Confetti
   ═══════════════════════════════════════════════════════════════ */

/* ── Font System ── Sora for UI, JetBrains Mono for cotes/code ── */
body {
  font-family: 'Sora', var(--font-sora), system-ui, -apple-system, sans-serif;
}
h1, h2, h3, h4, h5, h6 {
  font-family: 'Sora', var(--font-sora), system-ui, sans-serif;
}
/* Cotes, codes, terminal — JetBrains Mono */
.tabular-nums, .promo-code-shimmer, .promo-code-monolith,
.vip-cote-display, .terminal-text, .code-mono {
  font-family: 'JetBrains Mono', var(--font-jetbrains), 'Courier New', monospace;
}

/* ── Animated Gradient Mesh Background ── */
.gradient-mesh-bg {
  position: relative;
  background: #0A0E1A;
  background-image: 
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(250,204,21,0.04) 0%, transparent 50%),
    radial-gradient(ellipse 60% 60% at 80% 20%, rgba(34,211,238,0.03) 0%, transparent 50%),
    radial-gradient(ellipse 50% 80% at 50% 80%, rgba(74,222,128,0.02) 0%, transparent 50%);
}
.gradient-mesh-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* ── Floating Orbs — Slow-moving yellow/cyan blurred orbs ── */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: orb-drift 20s ease-in-out infinite;
  will-change: transform;
}
.floating-orb-gold {
  background: rgba(250, 204, 21, 0.08);
  animation-duration: 25s;
}
.floating-orb-cyan {
  background: rgba(34, 211, 238, 0.06);
  animation-duration: 30s;
  animation-direction: reverse;
}
@keyframes orb-drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -20px) scale(1.05); }
  50% { transform: translate(-15px, 25px) scale(0.95); }
  75% { transform: translate(20px, 15px) scale(1.02); }
}

/* ── Glass Card Premium — backdrop-blur 20px, animated gold border ── */
.glass-card-premium {
  background: rgba(18, 19, 42, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(250, 204, 21, 0.08);
  transition: border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.glass-card-premium:hover {
  border-color: rgba(250, 204, 21, 0.25);
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.15),
              0 8px 32px rgba(250, 204, 21, 0.06),
              inset 0 1px 0 rgba(250, 204, 21, 0.05);
  transform: translateY(-4px);
}

/* ── Animated Gold Border Gradient ── rotates on hover ── */
@property --gold-border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.gold-border-animate {
  border: 1px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image: 
    linear-gradient(rgba(18,19,42,0.9), rgba(18,19,42,0.9)),
    conic-gradient(from var(--gold-border-angle), #FACC15, #FDE047, transparent 40%, transparent 60%, #FACC15);
  animation: gold-border-spin 4s linear infinite;
  transition: box-shadow 0.3s ease;
}
.gold-border-animate:hover {
  animation-duration: 2s;
  box-shadow: 0 0 20px rgba(250,204,21,0.15);
}
@keyframes gold-border-spin {
  to { --gold-border-angle: 360deg; }
}

/* ── VIP 3D Gold Lock ── Rotating lock with brushed gold effect ── */
.vip-lock-3d {
  position: relative;
  width: 32px;
  height: 32px;
  animation: lock-rotate-slow 8s ease-in-out infinite;
}
.vip-lock-3d svg {
  filter: drop-shadow(0 2px 4px rgba(250,204,21,0.3));
}
@keyframes lock-rotate-slow {
  0%, 100% { transform: rotateY(0deg) rotateZ(0deg); }
  50% { transform: rotateY(20deg) rotateZ(5deg); }
}

/* ── VIP Crown 3D ── Floating crown with 3D perspective ── */
.vip-crown-3d {
  animation: crown-float-3d 4s ease-in-out infinite;
  perspective: 200px;
  transform-style: preserve-3d;
}
@keyframes crown-float-3d {
  0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
  30% { transform: translateY(-4px) rotateX(5deg) rotateY(-10deg); }
  60% { transform: translateY(-2px) rotateX(-3deg) rotateY(8deg); }
}

/* ── VIP Verified Badge ── Pulsating green dot ── */
.vip-verified-badge {
  animation: verified-pulse 3s ease-in-out infinite;
}
.vip-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ADE80;
  animation: dot-pulse 1.5s ease-in-out infinite;
}
@keyframes verified-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.2); }
  50% { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
}
@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

/* ── Promo Code Monolith 3D ── Brushed metal gold effect ── */
.promo-code-monolith {
  background: linear-gradient(135deg, 
    rgba(250,204,21,0.12) 0%, 
    rgba(18,19,42,0.9) 30%, 
    rgba(250,204,21,0.08) 50%, 
    rgba(18,19,42,0.95) 70%, 
    rgba(250,204,21,0.15) 100%);
  border: 1px solid rgba(250,204,21,0.15);
  box-shadow: 
    inset 0 1px 0 rgba(250,204,21,0.1),
    inset 0 -1px 0 rgba(250,204,21,0.05),
    0 4px 16px rgba(250,204,21,0.06),
    0 0 0 1px rgba(250,204,21,0.08);
  position: relative;
  overflow: hidden;
}
.promo-code-monolith::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 40%, rgba(250,204,21,0.06) 50%, transparent 60%);
  animation: metal-reflect 6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes metal-reflect {
  0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(0deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

/* ── Copy Button Confetti ── Particle burst on copy ── */
.confetti-burst {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}
.confetti-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: confetti-pop 0.6s ease-out forwards;
  opacity: 0;
}
@keyframes confetti-pop {
  0% { transform: scale(0) translate(0, 0); opacity: 1; }
  50% { transform: scale(1.2) translate(var(--tx), var(--ty)); opacity: 0.8; }
  100% { transform: scale(0.5) translate(var(--tx2), var(--ty2)); opacity: 0; }
}

/* ── Terminal Typing Effect ── IA en direct terminal ── */
.terminal-text {
  font-family: 'JetBrains Mono', var(--font-jetbrains), monospace;
  color: #4ADE80;
  white-space: nowrap;
  overflow: hidden;
}
.terminal-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #4ADE80;
  margin-left: 2px;
  animation: cursor-blink 1s step-end infinite;
  vertical-align: text-bottom;
}
@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* ── VIP Cote Counter ── Animated number that increments ── */
.vip-cote-display {
  font-family: 'JetBrains Mono', var(--font-jetbrains), monospace;
  font-weight: 700;
  color: #FACC15;
  font-size: 1.5rem;
  text-shadow: 0 0 10px rgba(250,204,21,0.3);
  animation: cote-glow 2s ease-in-out infinite;
}
@keyframes cote-glow {
  0%, 100% { text-shadow: 0 0 10px rgba(250,204,21,0.3); }
  50% { text-shadow: 0 0 20px rgba(250,204,21,0.5), 0 0 40px rgba(250,204,21,0.15); }
}

/* ── VIP Premium Blur ── Better blur with gradient overlay ── */
.vip-blur-premium {
  position: relative;
}
.vip-blur-premium .vip-blur-content {
  filter: blur(4px);
  select-none: true;
  user-select: none;
}
.vip-blur-premium .vip-blur-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(10,11,26,0.3) 0%, rgba(10,11,26,0.5) 100%);
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Micro-interaction: Scale on click ── */
.micro-click {
  transition: transform 0.1s cubic-bezier(0.22, 1, 0.36, 1);
}
.micro-click:active {
  transform: scale(0.98);
}

/* ── Cascade reveal ── staggered entrance ── */
.cascade-reveal > * {
  opacity: 0;
  transform: translateY(12px);
  animation: cascade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.cascade-reveal > *:nth-child(1) { animation-delay: 0.05s; }
.cascade-reveal > *:nth-child(2) { animation-delay: 0.1s; }
.cascade-reveal > *:nth-child(3) { animation-delay: 0.15s; }
.cascade-reveal > *:nth-child(4) { animation-delay: 0.2s; }
.cascade-reveal > *:nth-child(5) { animation-delay: 0.25s; }
.cascade-reveal > *:nth-child(6) { animation-delay: 0.3s; }
.cascade-reveal > *:nth-child(7) { animation-delay: 0.35s; }
.cascade-reveal > *:nth-child(8) { animation-delay: 0.4s; }
.cascade-reveal > *:nth-child(9) { animation-delay: 0.45s; }
.cascade-reveal > *:nth-child(10) { animation-delay: 0.5s; }
@keyframes cascade-in {
  to { opacity: 1; transform: translateY(0); }
}

/* ── Hover lift 4px ── Premium card lift on hover ── */
.hover-lift-4 {
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.hover-lift-4:hover {
  transform: translateY(4px);
  box-shadow: 0 12px 32px rgba(250,204,21,0.08), 0 6px 12px rgba(0,0,0,0.3);
}
'''
    
    # Append premium CSS at the end of globals.css
    content += premium_css
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath} - Premium CSS added')

def update_hero_terminal():
    """Add terminal typing effect to Hero IA en direct ticker"""
    filepath = f'{BASE}/components/bttsbet/Hero.tsx'
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace the IA ticker with a terminal-style animation
    # Current: simple text ticker
    # New: terminal-style "GLM 5.1 analysing 15 432 matchs..." with cursor
    
    old_ticker = '''<span className="text-[10px] sm:text-xs text-gray-400"
            >
              {currentUrgency}
            </span>'''
    
    new_ticker = '''<span className="terminal-text text-[10px] sm:text-xs"
            >
              {currentUrgency}
              <span className="terminal-cursor" />
            </span>'''
    
    content = content.replace(old_ticker, new_ticker)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath} - Terminal cursor added')

def add_gradient_mesh_to_body():
    """Update body CSS to use gradient mesh background"""
    filepath = f'{BASE}/app/globals.css'
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace body background from flat #0A0B1A to gradient mesh
    old_body_bg = '''body {
  background-color: #0A0B1A;'''
    
    new_body_bg = '''body {
  background-color: #0A0E1A;
  background-image: 
    radial-gradient(ellipse 80% 50% at 20% 40%, rgba(250,204,21,0.03) 0%, transparent 50%),
    radial-gradient(ellipse 60% 60% at 80% 20%, rgba(34,211,238,0.02) 0%, transparent 50%),
    radial-gradient(ellipse 50% 80% at 50% 80%, rgba(74,222,128,0.01) 0%, transparent 50%);'''
    
    content = content.replace(old_body_bg, new_body_bg)
    
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'✅ Updated {filepath} - Gradient mesh body bg')

# ─── Execute all tasks ───
if __name__ == '__main__':
    print('🚀 Starting BttsBet VIP Modal + Premium Design Upgrade...')
    print()
    
    # TASK 1: Remove ID collection modals
    print('📋 TASK 1: Removing ID collection modals...')
    replace_modal_in_promovip()
    replace_modal_in_vipsports()
    replace_modal_in_aviatorvip()
    replace_modal_in_fifalinebet()
    print()
    
    # TASK 2: Premium design
    print('📋 TASK 2: Adding premium design...')
    update_layout_fonts()
    add_premium_css()
    add_gradient_mesh_to_body()
    update_hero_terminal()
    print()
    
    print('✅ All changes applied! Run `npm run build` to test.')
