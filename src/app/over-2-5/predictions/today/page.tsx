import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Navbar = dynamic(() => import('@/components/bttsbet/Navbar'), { loading: () => null })
const Footer = dynamic(() => import('@/components/bttsbet/Footer'), { loading: () => null })
const FreePredictions = dynamic(() => import('@/components/bttsbet/FreePredictions'), { loading: () => null })

// ─── Metadata SEO (Tâche 002 — Over 2.5 spécialisé) ─────────────────────────
// H1 et titre distincts de la page BTTS — pas de duplicate content.
// Over 2.5 = au moins 3 buts dans le match (peu importe qui marque).
// BTTS = les deux équipes marquent (peu importe le total).
const TITLE = "Pronostics Over 2,5 du jour : analyses de buts"
const DESCRIPTION = "Découvrez les analyses Over 2,5 du jour, avec matchs horodatés, méthode expliquée et résultats vérifiés après le match. Aucun pari n'est garanti. 18+."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://bttspredict.com/over-2-5/predictions/today' },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://bttspredict.com/over-2-5/predictions/today',
    type: 'website',
  },
}

// ─── FAQ JSON-LD — spécifique à Over 2.5 ────────────────────────────────────
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Qu'est-ce que le pari Over 2,5 buts ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Le pari Over 2,5 buts est gagné si le total des buts marqués dans le match atteint au moins 3, peu importe quelle équipe marque. Les scores 2-1, 3-0, 1-2, 4-1 valident Over 2,5 ; les scores 0-0, 1-0, 0-1, 1-1, 2-0, 0-2 le font perdre.",
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la différence entre Over 2,5 et BTTS ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Over 2,5 porte sur le nombre total de buts du match (au moins 3). BTTS (Both Teams To Score) porte sur le fait que chaque équipe marque au moins un but, indépendamment du total. Un match 3-0 gagne Over 2,5 mais perd BTTS. Un match 1-1 gagne BTTS mais perd Over 2,5.",
      },
    },
    {
      '@type': 'Question',
      name: "Les pronostics Over 2,5 sont-ils garantis ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non. Aucun résultat futur n'est garanti. Les pronostics Over 2,5 sont des analyses statistiques basées sur les données disponibles, pas des certitudes. Les paris sportifs comportent un risque de perte. 18+.",
      },
    },
  ],
}

export default function Over25PredictionsTodayPage() {
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col text-[#F2F7F5]">
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="text-xs text-[#7F969E] mb-4 max-w-5xl mx-auto px-4 pt-8">
          <Link href="/" className="hover:text-[#C7F464]">Accueil</Link>
          <span className="mx-1">/</span>
          <Link href="/over-2-5/predictions/today" className="hover:text-[#C7F464]">Over 2,5</Link>
          <span className="mx-1">/</span>
          <span className="text-[#B5C4C9]">Aujourd&apos;hui</span>
        </nav>

        {/* Header — H1 spécifique Over 2.5 */}
        <section className="max-w-5xl mx-auto px-4 pt-4 pb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(255, 209, 102, 0.12)', color: '#FFD166', border: '1px solid rgba(255, 209, 102, 0.25)' }}>
            Over 2,5 · Plus de 2,5 buts
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronostics Over 2,5 du jour
          </h1>
          <p className="text-base sm:text-lg text-[#B5C4C9] leading-relaxed mb-2 max-w-3xl mx-auto">
            Analyses Over 2,5 du {today} : sélection de matchs où le total de buts attendus dépasse 3. Mis à jour 4x/jour, résultats vérifiés après le match.
          </p>
          <p className="text-sm text-[#7F969E] leading-relaxed max-w-3xl mx-auto">
            Aucun gain n&apos;est garanti. Paris sportifs = risque de perte. 18+.
          </p>
        </section>

        {/* Section informative — spécifique à Over 2.5 (distincte de BTTS) */}
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Qu&apos;est-ce que le pari Over 2,5 ?
            </h2>
            <p className="text-sm text-[#B5C4C9] leading-relaxed mb-3">
              Le pari <strong>Over 2,5 buts</strong> est gagné si <strong>au moins 3 buts</strong> sont marqués dans le match, indépendamment de qui marque. Les scores 2-1, 3-0, 1-2, 4-1, 5-0 valident Over 2,5. À l&apos;inverse, les scores 0-0, 1-0, 0-1, 1-1, 2-0, 0-2 le font perdre.
            </p>
            <p className="text-sm text-[#B5C4C9] leading-relaxed mb-3">
              <strong>Différence avec BTTS :</strong> le pari BTTS exige que <em>les deux équipes marquent</em>, peu importe le total. Le pari Over 2,5 exige <em>un total de buts élevé</em>, peu importe la répartition. Un match 3-0 gagne Over 2,5 mais perd BTTS. Un match 1-1 gagne BTTS mais perd Over 2,5.
            </p>
            <p className="text-sm text-[#7F969E] leading-relaxed">
              Pour comprendre la méthode de calcul des buts attendus (xG), consultez notre{' '}
              <Link href="/methodologie" className="text-[#C7F464] underline">méthodologie</Link>.
            </p>
          </div>
        </section>

        {/* Prédictions — reuse du composant FreePredictions (mêmes matchs, prédiction Over 2.5 disponible) */}
        <section className="max-w-5xl mx-auto px-4 pb-12">
          <FreePredictions />
        </section>

        {/* Liens internes */}
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Aller plus loin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">Pronostics BTTS du jour →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">Les deux équipes marquent</div>
            </Link>
            <Link href="/resultats-verifies" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F464]"
              style={{ backgroundColor: '#102333', border: '1px solid #1C3546' }}>
              <div className="text-sm font-bold text-[#F2F7F5]">Résultats vérifiés →</div>
              <div className="text-xs text-[#B5C4C9] mt-1">Historique post-match</div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  )
}
