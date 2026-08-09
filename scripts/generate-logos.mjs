// ═══════════════════════════════════════════════════════════════════════════════
// BTTSPredict — Génération des logos depuis l'image source
// ═══════════════════════════════════════════════════════════════════════════════
// Source: upload/embleme-club-football-ballon-soccer-logo-bouclier_1284383-3407.jpg
// Sortie: logo.png, icon-{192,512,1024}.png, apple-touch-icon.png, og-image.png
// ═══════════════════════════════════════════════════════════════════════════════

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const SRC = '/home/z/my-project/upload/embleme-club-football-ballon-soccer-logo-bouclier_1284383-3407.jpg'
const PUBLIC_DIR = '/home/z/my-project/bttspredict/public'

if (!fs.existsSync(SRC)) {
  console.error('Image source introuvable:', SRC)
  process.exit(1)
}

console.log('Source:', SRC)
console.log('Public dir:', PUBLIC_DIR)

// ─── Étape 1 : Charger l'image source ───
const srcImage = sharp(SRC)
const metadata = await srcImage.metadata()
console.log('Source metadata:', JSON.stringify(metadata, null, 2))

// ─── Étape 2 : Générer les variantes ───
const variants = [
  // Favicon et icônes PWA
  { name: 'logo.png', size: 512, fit: 'contain', background: { r: 7, g: 11, b: 24, alpha: 1 } }, // ECLIPSE #070B18
  { name: 'icon-192.png', size: 192, fit: 'contain', background: { r: 7, g: 11, b: 24, alpha: 1 } },
  { name: 'icon-512.png', size: 512, fit: 'contain', background: { r: 7, g: 11, b: 24, alpha: 1 } },
  { name: 'icon-1024.png', size: 1024, fit: 'contain', background: { r: 7, g: 11, b: 24, alpha: 1 } },
  { name: 'apple-touch-icon.png', size: 180, fit: 'contain', background: { r: 7, g: 11, b: 24, alpha: 1 } },
  // OG image (1200x630) — logo centré avec padding
  { name: 'og-image.png', size: null, width: 1200, height: 630, fit: 'contain', background: { r: 7, g: 11, b: 24, alpha: 1 } },
]

for (const v of variants) {
  const outPath = path.join(PUBLIC_DIR, v.name)
  let pipeline = sharp(SRC)

  if (v.size) {
    // Square: resize to size×size, contain
    pipeline = pipeline
      .resize(v.size, v.size, {
        fit: v.fit,
        background: v.background,
        withoutEnlargement: false,
      })
      .png()
  } else {
    // Custom dimensions (e.g., 1200×630 for OG)
    pipeline = pipeline
      .resize(v.width, v.height, {
        fit: v.fit,
        background: v.background,
        withoutEnlargement: false,
      })
      .png()
  }

  await pipeline.toFile(outPath)
  const stats = fs.statSync(outPath)
  console.log(`✓ ${v.name} (${v.size ? `${v.size}×${v.size}` : `${v.width}×${v.height}`}, ${Math.round(stats.size / 1024)} KB)`)
}

// ─── Étape 3 : Générer le favicon.svg (vectoriel — shield + ballon stylisé) ───
// On crée un SVG simple et propre : bouclier indigo avec ballon de football centré
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="shield-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5146F5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>
  <!-- Bouclier -->
  <path d="M32 4 L58 12 V32 C58 48 46 58 32 62 C18 58 6 48 6 32 V12 Z" fill="url(#shield-grad)" stroke="#5146F5" stroke-width="1.5"/>
  <!-- Ballon de football centré -->
  <g transform="translate(32 33)">
    <circle r="14" fill="#F7F8FF" stroke="#070B18" stroke-width="1.5"/>
    <!-- Hexagone central -->
    <polygon points="0,-7 6,-3.5 6,3.5 0,7 -6,3.5 -6,-3.5" fill="#070B18"/>
    <!-- Pentagones autour (simplifié) -->
    <polygon points="0,-14 -4,-11 -2,-7 2,-7 4,-11" fill="#070B18"/>
    <polygon points="14,0 11,-4 7,-2 7,2 11,4" fill="#070B18"/>
    <polygon points="0,14 4,11 2,7 -2,7 -4,11" fill="#070B18"/>
    <polygon points="-14,0 -11,-4 -7,-2 -7,2 -11,4" fill="#070B18"/>
    <!-- Lignes de raccordement -->
    <line x1="0" y1="-7" x2="0" y2="-14" stroke="#070B18" stroke-width="1.5"/>
    <line x1="6" y1="-3.5" x2="11" y2="-4" stroke="#070B18" stroke-width="1.5"/>
    <line x1="6" y1="3.5" x2="11" y2="4" stroke="#070B18" stroke-width="1.5"/>
    <line x1="0" y1="7" x2="0" y2="14" stroke="#070B18" stroke-width="1.5"/>
    <line x1="-6" y1="3.5" x2="-11" y2="4" stroke="#070B18" stroke-width="1.5"/>
    <line x1="-6" y1="-3.5" x2="-11" y2="-4" stroke="#070B18" stroke-width="1.5"/>
  </g>
</svg>`

fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), faviconSvg, 'utf8')
console.log('✓ favicon.svg (vectoriel, bouclier + ballon)')

console.log('\n✅ Tous les logos générés avec succès')
