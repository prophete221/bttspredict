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
    description: "Plateforme de pronostics football BTTS & Over 2,5 validés par notre équipe d'analystes. Modèles Poisson calibrés sur 50 000 matchs. Transparence totale.",
    areaServed: ['SN', 'CI', 'CM', 'ML', 'BF', 'FR'],
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
    ],
    founder: {
      '@type': 'Person',
      name: 'Expert BTTSPredict',
      jobTitle: 'Analyste football senior',
      description: 'Analyste football avec 10+ ans d\'expérience en modélisation statistique des matchs (xG, Poisson, value bets).',
      url: SITE_URL,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Support client',
      availableLanguage: ['French', 'English'],
      url: `${SITE_URL}/#support`,
    },
    sameAs: ['https://wa.me/15406704172'],
  }
}

// ─── Person (expert E-E-A-T) ────────────────────────────────────────────
// NOTE: Remplacer "Expert BTTSPredict" par le vrai nom du fondateur
// lorsque disponible. Google vérifie la cohérence des entités Person.
export const EXPERT_NAME = 'Expert BTTSPredict'
export const EXPERT_ROLE = 'Analyste Football Senior & Fondateur — BTTSPredict'

export function buildPersonJsonLd() {
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
    description: "Historique complet des pronostics publiés par BTTSPredict, incluant les résultats gagnés ET perdus. Taux de réussite de 84,5% calculé sur les pronostics réellement publiés. Transparence totale.",
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
    keywords: 'pronostics BTTS, historique résultats, taux de réussite 84.5%, transparence, gagnés perdus, pronostics btts aujourd\'hui',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Taux de réussite', value: '84.5%' },
      { '@type': 'PropertyValue', name: 'Pronostics publiés (30 jours)', value: '71' },
      { '@type': 'PropertyValue', name: 'Pronostics gagnés', value: '60' },
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
