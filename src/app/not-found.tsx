import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A0B1A' }}
    >
      <div className="max-w-md text-center">
        <span
          className="inline-block text-6xl font-black mb-3"
          style={{ color: '#FACC15', fontFamily: 'var(--font-mono), monospace' }}
        >
          404
        </span>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: '#111827', fontFamily: 'Poppins, sans-serif' }}
        >
          Match ou page introuvable
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: '#6B7280' }}>
          La page que vous cherchez n&apos;existe pas, a expiré, ou le match n&apos;est plus dans
          notre sélection du jour. Nos pronostics sont régénérés quotidiennement — les anciennes
          pages match ne sont plus servies.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
            style={{ backgroundColor: '#121212', color: '#111827' }}
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/pronostics"
            className="inline-block px-6 py-3 rounded-[10px] font-bold text-sm transition-all"
            style={{ backgroundColor: 'transparent', color: '#111827', border: '1px solid #E6E8EB' }}
          >
            Pronostics du jour
          </Link>
        </div>
      </div>
    </div>
  )
}
