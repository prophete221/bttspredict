import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = 'Correct Score Predictions'
const DESCRIPTION = 'Pronostics score exact football par nos analystes. Méthodologie Poisson, analyse détaillée et statistiques. 50+ championnats couverts.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['correct score predictions', 'pronostics score exact', 'score exact football', 'correct score tips', 'paris score exact'],
  alternates: { canonical: `${SITE_URL}/correct-score-predictions` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/correct-score-predictions`, siteName: 'BTTSPredict', type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }] },
}

const FAQ = [
  { q: "Qu'est-ce qu'un pronostic score exact ?", a: "Un pronostic score exact consiste à prédire le score final précis d'un match (ex: 2-1, 1-1, 3-0). C'est un marché difficile mais très rémunérateur en raison des cotes élevées." },
  { q: "Comment BTTSPredict prédit-il les scores exacts ?", a: "Notre modèle de Poisson calcule la probabilité de chaque score possible (0-0, 1-0, 0-1, 1-1, 2-1, etc.) à partir des lambdas de buts attendus des deux équipes. Le score avec la plus haute probabilité est recommandé." },
  { q: "Les pronostics score exact sont-ils fiables ?", a: "Les pronostics score exact sont par nature plus difficiles que le BTTS ou Over 2.5. Aucun modèle ne peut garantir un score exact. Nous recommandons de les utiliser comme outil d'analyse complémentaire, pas comme pari principal." },
  { q: "Quelles cotes pour les paris score exact ?", a: "Les cotes pour les scores exacts sont généralement élevées (5.00 à 15.00+) car la probabilité de réussite est faible. Cela permet des gains importants avec une mise modérée, mais le risque de perte est élevé." },
  { q: "Le pronostic score exact garantit-il un gain ?", a: "Non. Aucun pronostic ne garantit un gain. Les paris sportifs comportent des risques. Jouez de manière responsable (18+)." },
]

export default function CorrectScorePredictionsPage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/correct-score-predictions', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'Correct Score', path: '/correct-score-predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />
      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#A5ABC5' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F7F8FF' }} aria-current="page">Correct Score Predictions</li>
          </ol>
        </nav>

        <header className="mb-12 text-center">
          <span className="eyebrow">🎯 Score Exact</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>
            Correct Score <span style={{ color: '#5146F5' }}>Predictions</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#A5ABC5' }}>
            Pronostics score exact basés sur le modèle de calibrage avancé. Analyse de chaque score possible, probabilités détaillées et statistiques par championnat.
          </p>
        </header>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>Méthodologie score exact</h2>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: '#A5ABC5' }}>
            <p>Le modèle de Poisson permet de calculer la probabilité de chaque score possible. Pour un match entre l'équipe A (lambda domicile = 1.5) et l'équipe B (lambda extérieur = 1.2), le modèle génère une matrice de probabilités pour tous les scores de 0-0 à 5-5.</p>
            <p>Le score le plus probable est généralement autour de 1-1 ou 1-0, mais la distribution complète permet d'identifier les analyses de valeur statistique sur des scores moins probables mais à cotes élevées.</p>
            <p>Pour voir nos pronostics du jour, consultez notre <a href="/" style={{ color: '#5146F5' }}>page d'accueil</a>. Pour comprendre notre modèle en détail, visitez notre page <a href="/methodologie" style={{ color: '#5146F5' }}>méthodologie</a>.</p>
          </div>
        </section>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(81, 70, 245, 0.05)', border: '1px solid rgba(81, 70, 245, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F7F8FF' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#A5ABC5' }}>
            Les pronostics score exact sont des marchés à haut risque et haute récompense. Notre modèle IA nouvelle génération fournit les probabilités pour chaque score, mais aucun résultat n'est garanti. Utilisez ces pronostics comme outil d'aide à la décision. 18+ — Jeu responsable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>FAQ Score Exact</h2>
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
