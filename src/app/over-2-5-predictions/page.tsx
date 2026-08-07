import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = 'Over 2.5 Predictions'
const DESCRIPTION = 'Pronostics Over 2.5 buts par nos analystes. Modèle Poisson, taux réel sur /historique. Stats par championnat.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['over 2.5 predictions', 'over 2.5 goals', 'pronostics over 2.5', 'over 2.5 tips', 'over 2.5 buts', 'paris over 2.5'],
  alternates: { canonical: `${SITE_URL}/over-2-5-predictions` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/over-2-5-predictions`, siteName: 'BTTSPredict', type: 'article' },
}

const FAQ = [
  { q: "Qu'est-ce qu'un pari Over 2.5 ?", a: "Un pari Over 2.5 signifie que vous pariez que le match totalisera 3 buts ou plus. Par exemple, un score de 2-1, 3-0, 2-2 ou 1-2 fait gagner le pari Over 2.5." },
  { q: "Quel est le taux de réussite des pronostics Over 2.5 de BTTSPredict ?", a: "Notre taux de réussite sur les pronostics Over 2.5 est calculé en temps réel depuis /historique. Ce chiffre est calculé sur pronostics archivés (voir /historique) (voir /historique pour les chiffres réels) et est publiquement vérifiable dans notre historique." },
  { q: "Quels championnats sont les meilleurs pour les paris Over 2.5 ?", a: "La Bundesliga (91,7% de réussite), l'Eredivisie (90%) et la Premier League (86,7%) sont les championnats où nos pronostics Over 2.5 performent le mieux. Ces ligues ont une moyenne de buts élevée." },
  { q: "Comment fonctionne le modèle IA nouvelle génération pour Over 2.5 ?", a: "Notre modèle calcule la probabilité que le total de buts dépasse 2.5 en utilisant les lambdas (but attendus) de chaque équipe. Seuil de recommandation : 0.49. Correction de calibration : +1%." },
  { q: "Le pronostic Over 2.5 garantit-il un gain ?", a: "Non. Aucun pronostic ne garantit un gain. Les paris sportifs comportent des risques. Notre taux réel (voir /historique) reflète nos performances passées vérifiables, pas une garantie future." },
]

const STATS = [
  { label: 'Taux de réussite Over 2.5', value: 'Voir /historique' },
  { label: 'Matchs analysés', value: '50 000+' },
  { label: 'Championnats couverts', value: '50+' },
  { label: 'Pronostics par jour', value: '6+' },
]

export default function Over25PredictionsPage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/over-2-5-predictions', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'Over 2.5 Predictions', path: '/over-2-5-predictions' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />

      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#A5ABC5' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F7F8FF' }} aria-current="page">Over 2.5 Predictions</li>
          </ol>
        </nav>

        <header className="mb-12 text-center">
          <span className="eyebrow">⚽ Pronostics Over 2.5</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>
            Over 2.5 <span style={{ color: '#5146F5' }}>Predictions</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#A5ABC5' }}>
            Pronostics Over 2.5 buts basés sur le modèle de Poisson calibré sur des millions de données historiques. taux réel vérifiable vérifiée. Outil d'aide à la décision, pas de promesse de gain.
          </p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
              <div className="text-2xl font-bold" style={{ color: '#5146F5' }}>{stat.value}</div>
              <div className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: '#A5ABC5' }}>{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Analyse détaillée */}
        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>Comment nous analysons les matchs Over 2.5</h2>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: '#A5ABC5' }}>
            <p>Notre modèle de Poisson calcule la probabilité que le total de buts d'un match dépasse 2.5. Pour chaque match, nous analysons les lambdas (but attendus) des deux équipes à partir de 200+ variables : Expected Goals (xG), forme récente, blessures, historique des confrontations, conditions météo.</p>
            <p>Le seuil de recommandation est fixé à 0.49 — si la probabilité Over 2.5 calculée dépasse 49%, nous publions le pronostic. Une correction de calibration de +1% est appliquée car le modèle IA nouvelle génération sous-estime légèrement les matchs à haut score.</p>
            <p>Pour voir nos pronostics Over 2.5 du jour, consultez notre <a href="/" style={{ color: '#5146F5' }}>page d'accueil</a> ou notre <a href="/historique" style={{ color: '#5146F5' }}>historique vérifié</a>.</p>
          </div>
        </section>

        {/* Tableau statistiques par ligue */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>Statistiques Over 2.5 par championnat</h2>
          <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(247, 248, 255, 0.08)' }}>
                  <th className="text-left py-3 px-3 font-semibold" style={{ color: '#A5ABC5' }}>Championnat</th>
                  <th className="text-right py-3 px-3 font-semibold" style={{ color: '#A5ABC5' }}>Pronostics</th>
                  <th className="text-right py-3 px-3 font-semibold" style={{ color: '#A5ABC5' }}>Réussite</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(247, 248, 255, 0.04)' }}><td className="py-2 px-3" style={{ color: '#F7F8FF' }}>Bundesliga</td><td className="text-right py-2 px-3" style={{ color: '#A5ABC5' }}>12</td><td className="text-right py-2 px-3" style={{ color: '#5146F5', fontWeight: 700 }}>91,7%</td></tr>
                <tr style={{ borderBottom: '1px solid rgba(247, 248, 255, 0.04)' }}><td className="py-2 px-3" style={{ color: '#F7F8FF' }}>Eredivisie</td><td className="text-right py-2 px-3" style={{ color: '#A5ABC5' }}>10</td><td className="text-right py-2 px-3" style={{ color: '#5146F5', fontWeight: 700 }}>90,0%</td></tr>
                <tr style={{ borderBottom: '1px solid rgba(247, 248, 255, 0.04)' }}><td className="py-2 px-3" style={{ color: '#F7F8FF' }}>Premier League</td><td className="text-right py-2 px-3" style={{ color: '#A5ABC5' }}>15</td><td className="text-right py-2 px-3" style={{ color: '#5146F5', fontWeight: 700 }}>86,7%</td></tr>
                <tr style={{ borderBottom: '1px solid rgba(247, 248, 255, 0.04)' }}><td className="py-2 px-3" style={{ color: '#F7F8FF' }}>Ligue 1</td><td className="text-right py-2 px-3" style={{ color: '#A5ABC5' }}>10</td><td className="text-right py-2 px-3" style={{ color: '#5146F5', fontWeight: 700 }}>80,0%</td></tr>
                <tr><td className="py-2 px-3" style={{ color: '#F7F8FF' }}>Serie A</td><td className="text-right py-2 px-3" style={{ color: '#A5ABC5' }}>11</td><td className="text-right py-2 px-3" style={{ color: '#5146F5', fontWeight: 700 }}>81,8%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>FAQ Over 2.5 Predictions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <details key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
                <summary className="p-4 cursor-pointer text-sm font-semibold" style={{ color: '#F7F8FF' }}>{item.q}</summary>
                <p className="px-4 pb-4 text-xs leading-relaxed" style={{ color: '#A5ABC5' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Résumé */}
        <section className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(81, 70, 245, 0.05)', border: '1px solid rgba(81, 70, 245, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F7F8FF' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#A5ABC5' }}>
            Les pronostics Over 2.5 de BTTSPredict utilisent un modèle de Poisson calibré sur des millions de données historiques avec un taux de réussite réel (voir /historique). Notre méthodologie est <a href="/methodologie" style={{ color: '#5146F5' }}>documentée publiquement</a> et notre historique est <a href="/historique" style={{ color: '#5146F5' }}>vérifiable</a>. Aucun résultat n'est garanti.
          </p>
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
