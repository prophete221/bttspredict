import type { Metadata } from 'next'

/**
 * Page /linebet-promo-code — page indexable avec H1
 *
 * Anciennement page de redirection noindex, cette page est désormais
 * indexable pour résoudre les erreurs Bing Webmaster Tools :
 *   1. noindex retiré → robots: { index: true, follow: true }
 *   2. Bug d'encodage meta robots corrigé (le champ `other` de Next.js
 *      générait des balises <meta name="http-equiv"> invalides au lieu de
 *      <meta http-equiv="refresh"> — le champ `other` est supprimé)
 *   3. H1 ajouté : "Linebet Promo Code Sénégal"
 *
 * Le canonical pointe vers /code-promo-linebet-senegal pour éviter le
 * duplicate content (Bing consolidera les signaux sur la page canonique).
 *
 * La redirection .htaccess 301 reste active côté serveur pour les
 * utilisateurs qui accèdent directement à cette URL.
 */

const TARGET = '/code-promo-linebet-senegal'
const SITE_URL = 'https://bttspredict.com'

export const metadata: Metadata = {
  title: 'Code Promo Linebet Sénégal | BTTSPredict',
  description: 'Code promo Linebet Sénégal. Conditions et montants à vérifier auprès de l\'opérateur. Lien d\'affiliation rémunéré. 18+.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/linebet-promo-code`,
  },
  openGraph: {
    title: 'Code Promo Linebet Sénégal | BTTSPredict',
    description: 'Code promo Linebet Sénégal. 18+.',
    url: `${SITE_URL}/linebet-promo-code`,
    type: 'website',
  },
}

export default function LinebetPromoCodePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B1220',
        color: '#F4F7FB',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#F4F7FB' }}>
          Linebet Promo Code Sénégal
        </h1>
        <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: '#C2CCD8', lineHeight: 1.6 }}>
          Le code promo <strong style={{ color: '#7FA2C6' }}>VISION221</strong> est disponible sur la page principale.
          Redirection en cours vers la page Code Promo Linebet Sénégal...
        </p>
        <a
          href={TARGET}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#7FA2C6',
            color: '#0B1220',
            fontWeight: 700,
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          Continuer vers /code-promo-linebet-senegal
        </a>
        <p style={{ fontSize: '0.75rem', marginTop: '1.5rem', color: '#C2CCD8' }}>
          18+ · Lien d&apos;affiliation rémunéré · Aucun gain garanti
        </p>
      </div>
      {/* Redirection JavaScript — fallback si .htaccess 301 non atteint */}
      <script dangerouslySetInnerHTML={{ __html: `window.location.href='${TARGET}';` }} />
    </div>
  )
}
