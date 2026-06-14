# Task: Create 4 Legal Pages for BttsBet

## Summary
Created 4 comprehensive legal pages for the BttsBet site, each as a server component with proper Metadata, JSON-LD schema, breadcrumb navigation, and rich French content.

## Pages Created

### 1. `/mentions-legales/page.tsx` - Mentions Légales
- Title: "Mentions Légales | BttsBet"
- Sections: Éditeur du site, Hébergement, Propriété intellectuelle, Limitation de responsabilité, Droit applicable (Cameroun/CEMAC), Contact (WhatsApp)
- ~600 words of content

### 2. `/politique-confidentialite/page.tsx` - Politique de Confidentialité
- Title: "Politique de Confidentialité | BttsBet"
- Sections: Introduction, Données collectées (navigation, cookies, contact), Utilisation des données, Services tiers (Google Analytics, Linebet affiliate), Droits des utilisateurs (RGPD-style), Politique de cookies, Sécurité des données, Modifications, Contact
- ~800 words of content

### 3. `/jouer-responsable/page.tsx` - Jouer Responsable
- Title: "Jouer Responsable | BttsBet"
- Sections: Risques des jeux d'argent, Signes d'addiction (10 warning signs), Conseils pour un jeu responsable (8 tips in card grid), Auto-exclusion, Ressources d'aide (France, Cameroun, Sénégal), Engagement de BttsBet
- Features: Age warning banner (18+), Help resource cards with phone numbers and websites
- ~900 words of content

### 4. `/cgu/page.tsx` - Conditions Générales d'Utilisation
- Title: "Conditions Générales d'Utilisation | BttsBet"
- Sections: Acceptation des conditions, Description du service, Affiliation avec Linebet, Avertissement sur les pronostics, Responsabilités de l'utilisateur, Propriété intellectuelle, Limitation de responsabilité, Modification des conditions, Droit applicable (Cameroun/CEMAC), Contact
- ~850 words of content

## Common Features Across All Pages
- **Server components** (no 'use client')
- **Next.js Metadata export** with title, description, canonical URL, OpenGraph, and Twitter cards
- **JSON-LD WebPage schema** and **BreadcrumbList schema**
- **Breadcrumb navigation** (Accueil > Page Name)
- **Navbar and Footer** imported from `@/components/bttsbet`
- **Dark theme** styling (bg-dark-900, text-white, emerald accents, gold highlights)
- **Skip-to-content** accessibility link
- **Responsive design** with Tailwind CSS
- **Contact information** (WhatsApp +1 540 670 4172, website URL)

## Footer Update
Updated `src/components/bttsbet/Footer.tsx` to make legal links clickable (`<a>` tags instead of `<span>`), pointing to the actual page routes.

## Verification
- All 4 pages return HTTP 200
- Lint passes with no errors on new/modified files
- Dev server compiles and renders all pages successfully
- Correct metadata titles appear in rendered HTML
- JSON-LD structured data is present
