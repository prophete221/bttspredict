import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = 'League Predictions par Championnat'
const DESCRIPTION = 'Pronostics par championnat : Premier League, La Liga, Serie A, Bundesliga, Ligue 1. Stats par ligue, taux de réussite, conseils. 50+ championnats couverts.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['league predictions', 'pronostics par championnat', 'championnat predictions', 'premier league predictions', 'la liga predictions'],
  alternates: { canonical: `${SITE_URL}/league-predictions` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/league-predictions`, siteName: 'BTTSPredict', type: 'article' },
}

const LEAGUES = [
  { name: 'Premier League', country: 'Angleterre', winRate: '86,7%', avgGoals: '2.85' },
  { name: 'Bundesliga', country: 'Allemagne', winRate: '91,7%', avgGoals: '3.12' },
  { name: 'Eredivisie', country: 'Pays-Bas', winRate: '90,0%', avgGoals: '3.05' },
  { name: 'Serie A', country: 'Italie', winRate: '81,8%', avgGoals: '2.65' },
  { name: 'La Liga', country: 'Espagne', winRate: '76,9%', avgGoals: '2.55' },
  { name: 'Ligue 1', country: 'France', winRate: '80,0%', avgGoals: '2.70' },
  { name: 'Primeira Liga', country: 'Portugal', winRate: '78,0%', avgGoals: '2.60' },
  { name: 'Championship', country: 'Angleterre D2', winRate: '75,0%', avgGoals: '2.45' },
  { name: 'LONASE', country: 'Sénégal', winRate: '82,0%', avgGoals: '2.30' },
  { name: 'CAF Champions League', country: 'Afrique', winRate: '79,0%', avgGoals: '2.40' },
]

const FAQ = [
  { q: "Quels championnats couvrez-vous ?", a: "BTTSPredict couvre 50+ championnats : Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, Championship, ligues africaines (LONASE, CAF), sud-américaines et asiatiques." },
  { q: "Quel championnat a le meilleur taux de réussite ?", a: "La Bundesliga (Allemagne) affiche le meilleur taux à 91,7%, suivie de l'Eredivisie (Pays-Bas) à 90% et de la Premier League à 86,7%. Ces ligues ont une moyenne de buts élevée." },
  { q: "Comment sont calculés les taux par championnat ?", a: "Chaque taux est calculé sur les pronostics réellement publiés dans notre historique public. Par exemple, 11 gagnés sur 12 pour la Bundesliga = 91,7%." },
  { q: "Voir les pronostics d'un championnat spécifique ?", a: "Consultez notre page d'accueil pour les pronostics du jour, ou notre historique vérifié pour filtrer par ligue." },
  { q: "Les performances passées garantissent-elles les résultats futurs ?", a: "Non. Aucun résultat n'est garanti. Les paris sportifs comportent des risques. 18+ — Jeu responsable." },
]

export default function LeaguePredictionsPage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/league-predictions', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'League Predictions', path: '/league-predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />
      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#A8B3C2' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F0F2F5' }} aria-current="page">League Predictions</li>
          </ol>
        </nav>

        <header className="mb-10 text-center">
          <span className="eyebrow">🏆 Par championnat</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>
            League <span style={{ color: '#00C49A' }}>Predictions</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#A8B3C2' }}>
            Pronostics par championnat avec statistiques détaillées. 50+ ligues couvertes, taux de réussite vérifiable par compétition.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>Statistiques par championnat</h2>
          <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: '#161B22', border: '1px solid rgba(240, 242, 245, 0.08)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(240, 242, 245, 0.08)' }}>
                  <th className="text-left py-3 px-3 font-semibold" style={{ color: '#A8B3C2' }}>Championnat</th>
                  <th className="text-left py-3 px-3 font-semibold" style={{ color: '#A8B3C2' }}>Pays</th>
                  <th className="text-right py-3 px-3 font-semibold" style={{ color: '#A8B3C2' }}>Réussite</th>
                  <th className="text-right py-3 px-3 font-semibold" style={{ color: '#A8B3C2' }}>Buts/match</th>
                </tr>
              </thead>
              <tbody>
                {LEAGUES.map((league, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(240, 242, 245, 0.04)' }}>
                    <td className="py-2 px-3" style={{ color: '#F0F2F5' }}>{league.name}</td>
                    <td className="py-2 px-3" style={{ color: '#A8B3C2' }}>{league.country}</td>
                    <td className="text-right py-2 px-3" style={{ color: '#FFD700', fontWeight: 700 }}>{league.winRate}</td>
                    <td className="text-right py-2 px-3" style={{ color: '#A8B3C2' }}>{league.avgGoals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] mt-2" style={{ color: '#6E7681' }}>Source : données internes BTTSPredict. Performances passées ≠ garantie future.</p>
        </section>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(0, 196, 154, 0.05)', border: '1px solid rgba(0, 196, 154, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F0F2F5' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#A8B3C2' }}>
            BTTSPredict couvre 50+ championnats avec un taux de réussite moyen de 84,5%. La Bundesliga (91,7%) et l'Eredivisie (90%) sont nos meilleures ligues.
            Consultez nos <a href="/" style={{ color: '#00C49A' }}>pronostics du jour</a> ou notre <a href="/historique" style={{ color: '#00C49A' }}>historique vérifié</a>. Aucun résultat garanti. 18+.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>FAQ League Predictions</h2>
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
