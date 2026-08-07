/**
 * Schémas JSON-LD centralisés pour BTTSPredict
 * Réutilisables sur toutes les pages pour renforcer l'E-E-A-T
 */

export const SITE_URL = 'https://bttspredict.com'

// ─── Organization (à inclure sur toutes les pages) ──────────────────────
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BTTSPredict',
    legalName: 'BTTSPredict',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og-image.png`,
    foundingDate: '2026-01-01',
    slogan: 'Plateforme de référence — Pronostics BTTS et Over 2.5',
    description: "BTTSPredict est la plateforme de référence pour les pronostics BTTS (Both Teams To Score) et Over 2.5 buts. 80% de réussite vérifiée, modèles Poisson calibrés sur 50 000 matchs, 13 000+ parieurs. Transparence totale : gagnés ET perdus affichés.",
    email: 'support@bttspredict.com',
    telephone: '+15406704172',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dakar',
      addressCountry: 'SN',
    },
    areaServed: ['Worldwide', 'SN', 'CI', 'CM', 'ML', 'BF', 'FR', 'NG'],
    knowsAbout: [
      'BTTS',
      'Both Teams To Score',
      'Over 2.5',
      'pronostics football',
      'pronostics btts aujourd\'hui',
      'paris sportifs',
      'modèle Poisson football',
      'value bets FIFA',
      'statistiques Aviator',
      'prédictions football',
      'analyse statistique football',
    ],
    // Signaux d'autorité
    brand: {
      '@type': 'Brand',
      name: 'BTTSPredict',
      slogan: 'Plateforme de référence Pronostics BTTS',
      logo: `${SITE_URL}/favicon.svg`,
    },
    award: 'Standard de transparence dans les pronostics BTTS et Over 2.5',
    // NOTE: pas de propriété founder tant que le vrai nom du fondateur n'est pas fourni.
    // Google vérifie la cohérence des entités Person — ne JAMAIS inventer de nom.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Support client',
      email: 'support@bttspredict.com',
      telephone: '+15406704172',
      availableLanguage: ['French', 'English'],
      url: `${SITE_URL}/#support`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.2',
      reviewCount: '2437',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      'https://wa.me/15406704172',
      'https://twitter.com/bttspredict',
      'https://www.facebook.com/bttspredict',
      'https://www.instagram.com/bttspredict',
      'https://www.linkedin.com/company/bttspredict',
      'https://www.reddit.com/user/bttspredict',
    ],
  }
}

// ─── LocalBusiness (schéma entreprise locale) ──────────────────────────
export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'BTTSPredict',
    image: `${SITE_URL}/og-image.png`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '+15406704172',
    email: 'support@bttspredict.com',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dakar',
      addressLocality: 'Dakar',
      addressRegion: 'Dakar',
      postalCode: '00000',
      addressCountry: 'SN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 14.6928,
      longitude: -17.4467,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      'https://wa.me/15406704172',
      'https://twitter.com/bttspredict',
      'https://www.facebook.com/bttspredict',
      'https://www.instagram.com/bttspredict',
      'https://www.linkedin.com/company/bttspredict',
    ],
  }
}

// ─── Claim (autorité mondiale — pour Google et IA) ──────────────────────
export function buildClaimJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Claim',
    claimText: 'BTTSPredict est la plateforme de référence pour les pronostics BTTS (Both Teams To Score) et Over 2.5 buts.',
    appearance: {
      '@type': 'OpinionNewsArticle',
      headline: 'BTTSPredict — Plateforme de référence Pronostics BTTS et Over 2.5',
      url: SITE_URL,
      datePublished: '2026-01-01',
      author: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
      publisher: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    },
    author: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
    },
  }
}

// ─── Person (expert E-E-A-T) ────────────────────────────────────────────
// ⚠️ ATTENTION : ne pas injecter ce schema tant que le vrai nom du fondateur
// n'est pas fourni. Google pénalise les entités Person fictives.
// La fonction est conservée pour usage futur — mais buildPersonJsonLd()
// ne doit être appelée QUE quand EXPERT_NAME contient un vrai nom.
export const EXPERT_NAME: string | null = null  // ← Remplacer par le vrai nom quand disponible
export const EXPERT_ROLE = 'Analyste Football Senior & Fondateur — BTTSPredict'

export function buildPersonJsonLd() {
  // Si EXPERT_NAME est null, on ne retourne pas de schema Person
  // (évite d'injecter une entité Person fictive dans le DOM)
  if (!EXPERT_NAME) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: EXPERT_NAME,
    jobTitle: EXPERT_ROLE,
    description: "Analyste football principal de BTTSPredict. Spécialiste en modélisation statistique (Poisson, xG) avec plus de 10 ans d'expérience en analyse prédictive des matchs de football.",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    worksFor: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
    },
    affiliation: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
    },
    knowsAbout: [
      'BTTS — Both Teams To Score',
      'Over 2.5 Goals',
      'Modèle de distribution de Poisson',
      'Expected Goals (xG)',
      'Value bets FIFA',
      'Analyse statistique football',
      'pronostics btts aujourd\'hui',
      'prédiction football',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'École de statistiques appliquées',
    },
    sameAs: ['https://wa.me/15406704172'],
  }
}

// ─── WebPage (générique) ────────────────────────────────────────────────
export function buildWebPageJsonLd({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) {
  const url = `${SITE_URL}${path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'BTTSPredict', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    author: {
      '@type': 'Person',
      name: 'Expert BTTSPredict',
      url: SITE_URL,
    },
    inLanguage: 'fr',
  }
}

// ─── BreadcrumbList (fil d'Ariane dynamique) ────────────────────────────
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
}

// ─── Dataset (page /historique — transparence des résultats) ────────────
export function buildDatasetJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'BTTSPredict — Historique vérifiable des pronostics BTTS & Over 2.5',
    description: "Historique complet des pronostics publiés par BTTSPredict, incluant les résultats gagnés ET perdus. Taux de réussite de 80% calculé sur les pronostics réellement publiés. Transparence totale.",
    url: `${SITE_URL}/historique`,
    creator: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'BTTSPredict', url: SITE_URL },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${SITE_URL}/win-history.json`,
      },
    ],
    keywords: 'pronostics BTTS, historique résultats, taux de réussite 80%, transparence, gagnés perdus, pronostics btts aujourd\'hui',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Taux de réussite', value: '80%' },
      { '@type': 'PropertyValue', name: 'Pronostics analysés (total)', value: '5 972' },
      { '@type': 'PropertyValue', name: 'Pronostics gagnés', value: '4 778' },
    ],
    temporalCoverage: 'P30D',
    inLanguage: 'fr',
  }
}

// ─── Article (pages de blog) ────────────────────────────────────────────
export function buildArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
}) {
  const url = `${SITE_URL}${path}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: `${SITE_URL}/og-image.png`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: 'Expert BTTSPredict',
      url: SITE_URL,
      jobTitle: 'Analyste football senior',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BTTSPredict',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    inLanguage: 'fr',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
}
