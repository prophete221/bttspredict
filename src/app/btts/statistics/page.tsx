import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Statistiques BTTS par ligue — Both Teams To Score',
  description: "Liste des ligues couvertes par BTTSPredict pour le marché BTTS. Taux et moyennes historiques à intégrer via source vérifiable. Aucune garantie future. 18+.",
  alternates: { canonical: 'https://bttspredict.com/btts/statistics' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'BTTS Statistics — BTTSPredict',
    description: 'Liste des ligues couvertes pour le marché BTTS. Données historiques à intégrer via source vérifiable.',
    url: 'https://bttspredict.com/btts/statistics',
    type: 'article',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is BTTS in football betting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BTTS stands for Both Teams To Score. It is a football betting market where both teams must score at least one goal each during the match. The final score does not matter — only whether both teams scored.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which leagues have the highest BTTS rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BTTSPredict covers a curated set of leagues selected for their historically offensive profile. The exact BTTS rate per league is Données en préparation — to be integrated via a verifiable source at build time. No specific rate is published without a verifiable source.",
      },
    },
  ],
}

// ─── Tâche 004 : statistiques non sourcées ───────────────────────────────────
// Les valeurs `bttsRate`, `avgGoals` et `note` étaient précédemment codées en
// dur et présentées comme "Taux historique BTTS approximatif par ligue
// (données publiques, ordre indicatif)". Aucun appel API n'est réellement
// effectué dans ce fichier — les chiffres étaient donc non sourcés au sens
// de la règle anti-hallucination (section 1 du Prompt Maître).
//
// Décision Tâche 004 : remplacer chaque valeur non sourcée par
// "Données en préparation — donnée historique non disponible". Les noms de ligues
// sont conservés (ce sont des labels, pas des données statistiques).
//
// Future tâche recommandée : intégrer un vrai appel API ESPN au build time
// pour calculer bttsRate et avgGoals depuis les matchs archivés dans
// public/predictions-archive/. À traiter séparément, ne pas créer de
// dépendance dans cette tâche.
const LEAGUE_STATS = [
  { league: 'Eredivisie (Pays-Bas)' },
  { league: 'Bundesliga (Allemagne)' },
  { league: '2. Bundesliga' },
  { league: 'Championship (Angleterre D2)' },
  { league: 'Premier League (Angleterre)' },
  { league: 'Jupiler Pro League (Belgique)' },
  { league: 'MLS (États-Unis)' },
  { league: 'Liga Portugal' },
  { league: 'Swiss Super League' },
  { league: 'Austrian Bundesliga' },
  { league: 'Scottish Premiership' },
]

export default function BTTSStatisticsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col text-[#F8FAFC]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-xs text-[#94A3B8] mb-4">
            <Link href="/" className="hover:text-[#10B981]">Accueil</Link>
            <span className="mx-1">/</span>
            <span className="text-[#94A3B8]">BTTS Statistics</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(99, 214, 255, 0.12)', color: '#3B82F6', border: '1px solid rgba(99, 214, 255, 0.25)' }}>
            BTTS · Statistics
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            BTTS Statistics par ligue
          </h1>
          <p className="text-base text-[#94A3B8] leading-relaxed mb-6">
            Liste des ligues couvertes par BTTSPredict pour le marché BTTS (Both Teams To Score). Les taux historiques et moyennes de buts par ligue ne sont pas affichés tant qu&apos;aucune source vérifiable n&apos;est intégrée au build.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Ligues couvertes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #334155' }}>
                    <th className="text-left py-3 px-4 font-bold text-[#94A3B8]">Ligue</th>
                    <th className="text-center py-3 px-4 font-bold text-[#94A3B8]">Taux BTTS</th>
                    <th className="text-center py-3 px-4 font-bold text-[#94A3B8]">Buts/match</th>
                  </tr>
                </thead>
                <tbody>
                  {LEAGUE_STATS.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #2d2f31' }}>
                      <td className="py-3 px-4 text-[#f0f4f9] font-medium">{row.league}</td>
                      <td className="text-center py-3 px-4 text-[#9ca3af] font-mono text-xs">Données en préparation</td>
                      <td className="text-center py-3 px-4 text-[#9ca3af] font-mono text-xs">Données en préparation</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#94A3B8] mt-4 leading-relaxed">
              Données historiques non disponibles — à intégrer via source vérifiable (ex. API ESPN au build time). Aucune garantie future.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Comment lire ces statistiques
            </h2>
            <div className="space-y-3 text-sm text-[#94A3B8] leading-relaxed">
              <p>
                <strong className="text-[#F8FAFC]">Taux BTTS</strong> : pourcentage de matchs où les deux équipes ont marqué au moins un but. Les valeurs exactes par ligue seront affichées une fois une source vérifiable intégrée au build.
              </p>
              <p>
                <strong className="text-[#F8FAFC]">Buts par match</strong> : moyenne de buts totaux par match. Plus ce chiffre est élevé, plus le marché Over 2,5 est probable. Les valeurs exactes seront affichées une fois une source vérifiable intégrée au build.
              </p>
              <p>
                Ces statistiques ne garantissent aucun résultat futur. Elles servent uniquement à comprendre la logique de sélection des ligues par le moteur. Pour voir les pronostics actuels, consultez la page <Link href="/btts/predictions/today" className="text-[#10B981] underline">BTTS Predictions Today</Link>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Voir aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
                style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <div className="text-sm font-bold text-[#F8FAFC]">BTTS Today →</div>
                <div className="text-xs text-[#94A3B8] mt-1">Pronostics du jour</div>
              </Link>
              <Link href="/historique" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
                style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <div className="text-sm font-bold text-[#F8FAFC]">Résultats vérifiés →</div>
                <div className="text-xs text-[#94A3B8] mt-1">Historique complet</div>
              </Link>
              <Link href="/resultats-verifies" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
                style={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}>
                <div className="text-sm font-bold text-[#F8FAFC]">Vérifications →</div>
                <div className="text-xs text-[#94A3B8] mt-1">Suivi public</div>
              </Link>
            </div>
          </section>
        </article>
              <section className="max-w-5xl mx-auto px-4 py-8">
          <FreePredictions />
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
