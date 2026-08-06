import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = 'Team Predictions — Pronostics par Équipe'
const DESCRIPTION = 'Pronostics par équipe football : analyse xG, forme récente, statistiques offensives/défensives. BTTS et Over 2.5 par équipe, 84,5% vérifié.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['team predictions', 'pronostics par équipe', 'équipe predictions', 'football team stats', 'xG par équipe'],
  alternates: { canonical: `${SITE_URL}/team-predictions` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/team-predictions`, siteName: 'BTTSPredict', type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }] },
}

const FAQ = [
  { q: "Comment analysez-vous une équipe ?", a: "Nous analysons 200+ variables par équipe : Expected Goals (xG), forme récente (5 derniers matchs), buts marqués/encaissés, blessures, suspensions, historique des confrontations directes." },
  { q: "Quelles équipes sont les plus prévisibles ?", a: "Les équipes avec un xG stable et une forme régulière sont plus prévisibles. Les équipes offensives (Manchester City, Bayern Munich, Ajax) sont idéales pour les paris Over 2.5 et BTTS." },
  { q: "Puis-je filtrer les pronostics par équipe ?", a: "Sur notre page d'accueil, vous pouvez voir tous les pronostics du jour. Notre historique vérifié permet de filtrer par ligue, ce qui inclut toutes les équipes de cette ligue." },
  { q: "Les stats par équipe garantissent-elles un gain ?", a: "Non. Les statistiques sont des outils d'aide à la décision. Aucun résultat n'est garanti. 18+ — Jeu responsable." },
]

export default function TeamPredictionsPage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/team-predictions', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'Team Predictions', path: '/team-predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />
      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#A8B3C2' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F0F2F5' }} aria-current="page">Team Predictions</li>
          </ol>
        </nav>

        <header className="mb-10 text-center">
          <span className="eyebrow">👥 Par équipe</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>
            Team <span style={{ color: '#00C49A' }}>Predictions</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#A8B3C2' }}>
            Analyse par équipe : Expected Goals, forme récente, statistiques offensives et défensives. Pronostics BTTS et Over 2.5 basés sur les performances d'équipe.
          </p>
        </header>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#161B22', border: '1px solid rgba(240, 242, 245, 0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>Comment nous analysons les équipes</h2>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: '#A8B3C2' }}>
            <p>Chaque équipe est analysée sur 200+ variables : xG (Expected Goals), xGA (Expected Goals Against), forme sur les 5 derniers matchs, buts marqués/encaissés à domicile et à l'extérieur, blessures, suspensions.</p>
            <p>Le modèle Poisson utilise ces données pour calculer le lambda (but attendu) de chaque équipe, qui détermine ensuite les probabilités BTTS et Over 2.5.</p>
            <p>Pour voir nos pronostics du jour par équipe, consultez notre <a href="/" style={{ color: '#00C49A' }}>page d'accueil</a>.</p>
          </div>
        </section>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(0, 196, 154, 0.05)', border: '1px solid rgba(0, 196, 154, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F0F2F5' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#A8B3C2' }}>
            BTTSPredict analyse chaque équipe sur 200+ variables avec un taux de réussite vérifié de 84,5%. Consultez notre <a href="/methodologie" style={{ color: '#00C49A' }}>méthodologie</a> et notre <a href="/historique" style={{ color: '#00C49A' }}>historique</a>. 18+ — Jeu responsable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>FAQ Team Predictions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <details key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#161B22', border: '1px solid rgba(240, 242, 245, 0.08)' }}>
                <summary className="p-4 cursor-pointer text-sm font-semibold" style={{ color: '#F0F2F5' }}>{item.q}</summary>
                <p className="px-4 pb-4 text-xs leading-relaxed" style={{ color: '#A8B3C2' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
