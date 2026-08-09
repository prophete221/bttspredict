/**
 * Constantes SEO globales — alignées sur les limites SERP Bing (plus strictes que Google).
 *
 * Bing coupe les titles > 60 chars et les descriptions > 155 chars.
 * On utilise 60/150 comme limites "build-time" (0 marge) et 70/160 comme
 * limites "hard fail" dans le script post-build (scripts/verify-seo.mjs).
 *
 * Pour ajouter une nouvelle page :
 *   1. Importer { checkSeo } depuis '@/lib/seo'
 *   2. Appeler checkSeo('ma-page', title, description) au module load
 *   3. Si le build casse, raccourcir le title ou la description
 */

export const SEO = {
  /** Limite "soft" — doit être respectée à l'écriture */
  MAX_TITLE: 60,
  MAX_DESC: 150,
  /** Limite "hard" — utilisée par le script post-build (scripts/verify-seo.mjs) */
  HARD_MAX_TITLE: 70,
  HARD_MAX_DESC: 160,
  BRAND: 'BTTSPredict',
} as const

/**
 * Vérification build-time d'une page.
 * À appeler au module load (pas dans un composant React).
 *
 * @example
 * import { checkSeo } from '@/lib/seo'
 * checkSeo('homepage', 'Mon titre court', 'Ma description courte')
 *
 * @throws Error si title > 60 ou description > 150
 */
export function checkSeo(page: string, title: string, desc: string): void {
  if (title.length > SEO.MAX_TITLE) {
    throw new Error(
      `[SEO] ${page} title ${title.length} > ${SEO.MAX_TITLE}: "${title}"`,
    )
  }
  if (desc.length > SEO.MAX_DESC) {
    throw new Error(
      `[SEO] ${page} desc ${desc.length} > ${SEO.MAX_DESC}: "${desc}"`,
    )
  }
}
