import type { Metadata } from 'next'

/**
 * Page /linebet-promo-code — redirige vers /code-promo-linebet-senegal
 *
 * En mode `output: 'export'` (statique), `redirect()` de next/navigation
 * ne fonctionne pas côté serveur. On utilise donc :
 *   1. .htaccess RewriteRule [R=301,L] pour la vraie redirection 301 Apache
 *   2. meta http-equiv="refresh" + canonical comme fallback client-side
 *
 * Le sitemap.ts n'inclut PAS cette URL (doublon éliminé).
 */

const TARGET = '/code-promo-linebet-senegal'
const SITE_URL = 'https://bttspredict.com'

export const metadata: Metadata = {
  // Page de redirection — noindex pour éviter tout duplicate content
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${SITE_URL}${TARGET}`,
  },
  // meta refresh pour les navigateurs (fallback si .htaccess non atteint)
  other: {
    'http-equiv': 'refresh',
    content: `0;url=${TARGET}`,
  },
}

export default function LinebetPromoCodeRedirect() {
  // Page HTML minimale — le navigateur suit le meta refresh automatiquement.
  // L'utilisateur ne verra ce contenu qu'une fraction de seconde.
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0B1A',
        color: '#6B7280',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '400px' }}>
        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
          Redirection vers la page Code Promo Linebet...
        </p>
        <a
          href={TARGET}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#121212',
            color: '#111827',
            fontWeight: 700,
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          Continuer vers /code-promo-linebet-senegal
        </a>
      </div>
    </div>
  )
}
