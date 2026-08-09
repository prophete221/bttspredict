import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = "Prédictions Foot Aujourd'hui — BTTS & Over 2.5"
const DESCRIPTION = 'Pronostics football du jour : BTTS, Over 2.5 et scores exacts par moteur IA. Sélection quotidienne. 18+.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['football predictions today', 'pronostics football aujourd\'hui', 'football tips today', 'predictions football', 'pronostics du jour'],
  alternates: { canonical: `${SITE_URL}/football-predictions-today` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/football-predictions-today`, siteName: 'BTTSPredict', type: 'article', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }] },
}

const FAQ = [
  { q: "Comment voir les pronostics football d'aujourd'hui ?", a: "Consultez notre page d'accueil ou /pronostics pour voir les pronostics BTTS et Over 2.5 du jour. une sélection quotidienne de pronostics gratuits." },
  { q: "Quels championnats sont couverts aujourd'hui ?", a: "Nous couvrons 50+ championnats : Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, Championship, Allsvenskan, Eliteserien, ligues africaines et sud-américaines." },
  { q: "Les pronostics du jour sont-ils gratuits ?", a: "Oui, une sélection quotidienne de pronostics gratuits est publiée sans inscription. Pour des sélections premium supplémentaires, l'accès VIP est disponible avec un dépôt de 3 000 XOF + code VISION221." },
  { q: "À quelle heure sont publiés les pronostics ?", a: "Les pronostics du jour sont mis à jour automatiquement 4 fois par jour via notre pipeline CI/CD : 4h, 6h, 14h et 22h UTC." },
  { q: "Quel est le taux de réussite des pronostics du jour ?", a: "Notre taux de réussite est calculé en temps réel depuis /historique (voir /historique pour les chiffres réels). Vérifiable publiquement dans notre historique." },
]

export default function FootballPredictionsTodayPage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/football-predictions-today', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'Football Today', path: '/football-predictions-today' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />
      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#A5ABC5' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F7F8FF' }} aria-current="page">Football Predictions Today</li>
          </ol>
        </nav>

        <header className="mb-12 text-center">
          <span className="eyebrow">⚽ Pronostics du jour</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>
            Football Predictions <span style={{ color: '#5146F5' }}>Today</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#A5ABC5' }}>
            Pronostics football aujourd'hui : BTTS, Over 2.5 et scores exacts. une sélection quotidienne de pronostics gratuits, taux réel vérifiable. Moteur IA calibré sur des millions de données historiques.
          </p>
          <div className="mt-6">
            <a href="/#free-predictions" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors" style={{ backgroundColor: '#5146F5', color: '#F7F8FF' }}>
              Voir les pronostics d'aujourd'hui →
            </a>
          </div>
        </header>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#0D1630', border: '1px solid rgba(247, 248, 255, 0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>Analyse des pronostics du jour</h2>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: '#A5ABC5' }}>
            <p>Chaque jour, BTTSPredict publie gratuitement 6 pronostics football couvrant les marchés BTTS (Both Teams To Score) et Over 2.5 Goals. Notre équipe d'<a href="/equipe" style={{ color: '#5146F5' }}>analystes experts</a> valide chaque pronostic avant publication.</p>
            <p>Les pronostics sont générés par notre moteur IA nouvelle génération calibré en continu (génération automatique, aucune validation humaine). Chaque pronostic inclut la probabilité calculée, l'indice de confiance, les buts attendus (indices de performance) et la ligue du match.</p>
            <p>Nous couvrons 50+ championnats à travers le monde : Europe (Premier League, La Liga, Serie A, Bundesliga, Ligue 1), Afrique (LONASE Sénégal, CAF Champions League), Amérique latine (Brésil, Argentine) et Asie.</p>
          </div>
        </section>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(81, 70, 245, 0.05)', border: '1px solid rgba(81, 70, 245, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F7F8FF' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#A5ABC5' }}>
            BTTSPredict pubifie une sélection quotidienne de pronostics football gratuits avec un taux de réussite réel (voir /historique). Notre <a href="/methodologie" style={{ color: '#5146F5' }}>méthodologie</a> est documentée et notre <a href="/historique" style={{ color: '#5146F5' }}>historique</a> est publiquement vérifiable. Aucun résultat n'est garanti. 18+ — Jeu responsable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F7F8FF', fontFamily: 'Poppins, sans-serif' }}>FAQ Football Predictions Today</h2>
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
