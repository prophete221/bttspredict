import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = 'Match Predictions — Pronostics par Match'
const DESCRIPTION = 'Pronostics par match : BTTS, Over 2.5, score exact. Analyse détaillée de chaque match avec xG, probabilités Poisson et statistiques. taux réel sur /historique.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['match predictions', 'pronostics par match', 'match analysis', 'football match prediction', 'btts match', 'over 2.5 match'],
  alternates: { canonical: `${SITE_URL}/match-predictions` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/match-predictions`, siteName: 'BTTSPredict', type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }] },
}

const FAQ = [
  { q: "Comment sont analysés les matchs ?", a: "Chaque match est analysé avec 200+ variables : xG des deux équipes, forme récente, blessures, historique des confrontations, conditions météo. Le modèle IA nouvelle génération calcule ensuite les probabilités BTTS et Over 2.5." },
  { q: "Combien de matchs analysés par jour ?", a: "BTTSPredict publie 6 pronostics gratuits par jour. Les membres VIP ont accès à 20+ pronostics premium par jour sur 6 sports." },
  { q: "Puis-je voir l'analyse détaillée d'un match ?", a: "Sur notre page d'accueil, chaque carte de match affiche les probabilités BTTS, Over 2.5, les buts attendus (xG) et l'indice de confiance." },
  { q: "Les pronostics par match sont-ils garantis ?", a: "Non. Aucun pronostic n'est garanti. Les paris sportifs comportent des risques. 18+ — Jeu responsable." },
]

export default function MatchPredictionsPage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/match-predictions', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'Match Predictions', path: '/match-predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />
      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#A5ABC5' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F7F8FF' }} aria-current="page">Match Predictions</li>
          </ol>
        </nav>

        <header className="mb-10 text-center">
          <span className="eyebrow">⚽ Par match</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>
            Match <span style={{ color: '#5146F5' }}>Predictions</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#A5ABC5' }}>
            Pronostics par match : BTTS, Over 2.5, score exact. Analyse détaillée de chaque match avec probabilités Poisson et statistiques.
          </p>
          <div className="mt-6">
            <a href="/#free-predictions" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors" style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}>
              Voir les matchs du jour →
            </a>
          </div>
        </header>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>Analyse détaillée par match</h2>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: '#A5ABC5' }}>
            <p>Chaque match est analysé avec 200+ variables. Notre modèle IA nouvelle génération calcule les probabilités pour chaque marché : BTTS (seuil 0.48), Over 2.5 (seuil 0.49), et score exact (matrice de Poisson complète).</p>
            <p>Chaque carte de match sur notre page d'accueil affiche : les deux équipes, la ligue, la date/heure, les buts attendus (xG), les probabilités BTTS et Over 2.5, et un indice de confiance.</p>
            <p>Pour voir nos analyses de matchs, consultez notre <a href="/" style={{ color: '#5146F5' }}>page d'accueil</a> ou notre <a href="/historique" style={{ color: '#5146F5' }}>historique vérifié</a>.</p>
          </div>
        </section>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(81, 70, 245, 0.05)', border: '1px solid rgba(81, 70, 245, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F7F8FF' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#A5ABC5' }}>
            BTTSPredict analyse chaque match sur 200+ variables avec un taux de réussite réel (voir /historique). <a href="/methodologie" style={{ color: '#5146F5' }}>Méthodologie</a> documentée, <a href="/historique" style={{ color: '#5146F5' }}>historique</a> vérifiable. 18+ — Jeu responsable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>FAQ Match Predictions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <details key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
                <summary className="p-4 cursor-pointer text-sm font-semibold" style={{ color: '#F7F8FF' }}>{item.q}</summary>
                <p className="px-4 pb-4 text-xs leading-relaxed" style={{ color: '#A5ABC5' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      
        {/* Pronostics gratuits + VIP + APK sur toutes les pages */}
        <FreePredictionsWidget />
        <VipCardWidget />
        <div className="text-center pb-6">
          <LinebetApkButton />
        </div>
      </main>
      <Footer />
    </div>
  )
}
