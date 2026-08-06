#!/usr/bin/env node
/**
 * Générateur automatique de sitemap.xml pour BTTSPredict
 * Scanne src/app/ pour trouver toutes les routes Next.js
 * et génère un sitemap XML valide avec hreflang + image.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.join(__dirname, '..')
const APP_DIR = path.join(ROOT, 'src', 'app')
const OUT_FILE = path.join(ROOT, 'public', 'sitemap.xml')
const SITE_URL = 'https://bttspredict.com'
const TODAY = new Date().toISOString().slice(0, 10)

// Priorités par type de page
const PRIORITY_MAP = {
  '': 1.0,           // Accueil
  'pronostics': 0.98,
  'football-predictions-today': 0.95,
  'code-promo-linebet-senegal': 0.95,
  'vip': 0.95,
  'historique': 0.9,
  'over-2-5-predictions': 0.9,
  'methodologie': 0.85,
  'equipe': 0.8,
  'bookmakers': 0.85,
  'betting-tips': 0.85,
  'correct-score-predictions': 0.85,
  'bonus-888starz': 0.85,
  'prediction-aviator': 0.85,
  'faille-fifa': 0.85,
  'btts-c-est-quoi': 0.85,
  'blog': 0.8,
  'presse': 0.7,
  'statistiques': 0.8,
}

const CHANGEFREQ_MAP = {
  '': 'daily',
  'pronostics': 'daily',
  'football-predictions-today': 'daily',
  'over-2-5-predictions': 'daily',
  'betting-tips': 'daily',
  'historique': 'daily',
  'statistiques': 'daily',
}

function findRoutes(dir, base = '') {
  const routes = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const route = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      // Skip non-page directories
      if (entry.name.startsWith('_') || entry.name === 'api' || entry.name === 'components') continue
      if (fs.existsSync(path.join(fullPath, 'page.tsx')) || fs.existsSync(path.join(fullPath, 'page.ts'))) {
        routes.push(route)
      }
      // Recurse into subdirectories (e.g., blog/*)
      const subRoutes = findRoutes(fullPath, route)
      routes.push(...subRoutes)
    }
  }
  return routes
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;')
}

function generateSitemap() {
  const routes = findRoutes(APP_DIR)
  // Always include homepage first
  const allRoutes = ['', ...routes]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

`

  for (const route of allRoutes) {
    const url = `${SITE_URL}/${route}`
    const slug = route || ''
    const priority = PRIORITY_MAP[slug] || '0.7'
    const changefreq = CHANGEFREQ_MAP[slug] || 'monthly'
    const imageTitle = slug
      ? `BTTSPredict — ${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')}`
      : 'BTTSPredict — Pronostics BTTS et Over 2.5'

    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="fr-SN" href="${url}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url}"/>
    <image:image>
      <image:loc>${SITE_URL}/og-image.png</image:loc>
      <image:title>${escapeXml(imageTitle)}</image:title>
    </image:image>
  </url>

`
  }

  xml += `</urlset>
`

  fs.writeFileSync(OUT_FILE, xml, 'utf-8')
  console.log(`[Sitemap] Généré: ${allRoutes.length} URLs → ${OUT_FILE}`)
  console.log(`[Sitemap] Date: ${TODAY}`)
  return allRoutes.length
}

const count = generateSitemap()
console.log(`[Sitemap] Terminé ! ${count} URLs dans le sitemap.`)
