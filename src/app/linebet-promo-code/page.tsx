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
  title: 'Code Promo Linebet VISION221 Sénégal',
  description: 'Code promo Linebet VISION221 valable dans le monde entier : bonus de dépôt de 300 %, cashback et bonus hebdomadaires. 18+.',
  robots: { index: true, follow: true },
  alternates: {
    // (2026-09-28) Canonical vers la page principale — conformément à
    // l'intention documentée en tête de fichier. La 301 serveur (.htaccess)
    // reste le mécanisme principal ; ce canonical consolide les signaux
    // SEO sur /code-promo-linebet-senegal si le fichier statique est servi.
    canonical: `${SITE_URL}${TARGET}`,
  },
  openGraph: {
    title: 'Code Promo Linebet Sénégal | BTTSPredict',
    description: 'Code promo Linebet VISION221 valable dans le monde entier : bonus de dépôt de 300 %, cashback et bonus hebdomadaires. 18+.',
    url: `${SITE_URL}${TARGET}`,
    type: 'website',
  },
}

export default function LinebetPromoCodePage() {
  return (
    <div
      className="page-design page-design--promo"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080D14',
        color: '#EDF2F7',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%', padding: '2rem', border: '1px solid rgba(161,178,198,.18)', borderRadius: '12px', backgroundColor: '#101823' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#EDF2F7' }}>
          Code promo Linebet VISION221
        </h1>
        <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', color: '#9DABBB', lineHeight: 1.6 }}>
          Vous allez être redirigé vers le guide Linebet. Vous y trouverez le code <strong style={{ color: '#8DB8FF' }}>VISION221</strong>, les liens d’accès et les conditions à vérifier auprès de l’opérateur.
        </p>
        <a
          href={TARGET}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2866BD',
            color: '#FFFFFF',
            fontWeight: 700,
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          Ouvrir le guide Linebet
        </a>
        <p style={{ fontSize: '0.75rem', marginTop: '1.5rem', color: '#9DABBB' }}>
          18+ · Lien partenaire · Aucun gain garanti
        </p>
      </div>
      {/* Redirection JavaScript — fallback si .htaccess 301 non atteint */}
      <script dangerouslySetInnerHTML={{ __html: `window.location.href='${TARGET}';` }} />
    </div>
  )
}
