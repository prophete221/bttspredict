import type { Metadata } from 'next'
import { Navbar, Footer, FreePredictions } from '@/components/bttsbet'
import Link from 'next/link'

const PAGE_URL = 'https://bttspredict.com/btts/statistics'
const DESCRIPTION = "Découvrez les ligues suivies par BTTSPredict pour le marché BTTS. Aucun taux par ligue n’est publié sans résultats historiques et méthode de calcul vérifiables."

export const metadata: Metadata = {
  title: 'Statistiques BTTS par ligue : compétitions suivies',
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Statistiques BTTS par ligue : compétitions suivies',
    description: DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
  },
}

const LEAGUES = [
  'Eredivisie (Pays-Bas)',
  'Bundesliga (Allemagne)',
  '2. Bundesliga',
  'Championship (Angleterre D2)',
  'Premier League (Angleterre)',
  'Jupiler Pro League (Belgique)',
  'MLS (États-Unis)',
  'Liga Portugal',
  'Swiss Super League',
  'Austrian Bundesliga',
  'Scottish Premiership',
]

const FAQ_ITEMS = [
  {
    question: 'Pourquoi aucun taux BTTS par ligue n’est-il affiché ?',
    answer: 'BTTSPredict ne publie pas de pourcentages par ligue tant que les résultats historiques et la méthode de calcul ne sont pas vérifiables. Cette page présente le périmètre des compétitions suivies, pas un classement de performance.',
  },
  {
    question: 'Que signifie BTTS ?',
    answer: 'BTTS signifie que les deux équipes marquent au moins un but pendant le match. C’est un marché de pari sportif, et non une garantie de résultat.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export default function BTTSStatisticsPage() {
  return (
    <div className="page-design page-design--statistics min-h-screen bg-[#080D14] flex flex-col text-[#EDF2F7]">
      <Navbar />
      <main id="main-content" className="flex-1">
        <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <nav aria-label="Fil d’Ariane" className="text-xs text-[#9DABBB] mb-4">
            <Link href="/" className="hover:text-[#2F7DFF]">Accueil</Link>
            <span className="mx-1">/</span>
            <span aria-current="page" className="text-[#9DABBB]">Statistiques BTTS</span>
          </nav>

          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: 'rgba(169, 196, 223, 0.12)', color: '#2F7DFF', border: '1px solid rgba(169, 196, 223, 0.25)' }}
          >
            BTTS · Compétitions suivies
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Statistiques BTTS par ligue</h1>
          <p className="text-base text-[#9DABBB] leading-relaxed mb-8">
            Cette page présente les ligues suivies par BTTSPredict pour le marché BTTS (Both Teams To Score). Elle décrit le périmètre couvert ; elle ne constitue pas un classement des ligues et ne publie pas de taux non vérifiés.
          </p>

          <section className="mb-10" aria-labelledby="leagues-heading">
            <h2 id="leagues-heading" className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Ligues suivies
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed mb-5">
              Les noms ci-dessous indiquent les compétitions présentes dans le périmètre BTTS de la plateforme. Leur présence ne signifie pas qu’un taux de réussite actuel ou historique est disponible pour chacune.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEAGUES.map((league) => (
                <li key={league} className="p-4 rounded-xl text-sm font-medium text-[#F2F6FA]" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
                  {league}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-10 p-5 rounded-xl" style={{ backgroundColor: 'rgba(47, 125, 255, 0.06)', border: '1px solid rgba(47, 125, 255, 0.2)' }}>
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Taux par ligue : non publiés
            </h2>
            <p className="text-sm text-[#9DABBB] leading-relaxed">
              BTTSPredict n’affiche pas de pourcentage BTTS ni de moyenne de buts par ligue tant qu’un jeu de résultats historiques et une méthode de calcul vérifiables ne sont pas disponibles. Cela évite de présenter une estimation ou une valeur provisoire comme une statistique mesurée. Les données pourront être ajoutées lorsqu’elles pourront être contrôlées.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Que mesure le marché BTTS ?
            </h2>
            <div className="space-y-3 text-sm text-[#9DABBB] leading-relaxed">
              <p>
                BTTS (« Both Teams To Score ») désigne un marché où chaque équipe doit marquer au moins un but pendant le match. Le résultat final et le nombre total de buts au-delà de cette condition ne déterminent pas ce marché.
              </p>
              <p>
                Une fréquence observée dans le passé ne permet pas de garantir l’issue d’un match futur. Les pronostics restent incertains et ne doivent pas être considérés comme un conseil financier.
              </p>
            </div>
          </section>

          <section className="mb-8" aria-labelledby="questions-heading">
            <h2 id="questions-heading" className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Questions fréquentes
            </h2>
            <div className="space-y-5 text-sm text-[#9DABBB] leading-relaxed">
              {FAQ_ITEMS.map(({ question, answer }) => (
                <div key={question}>
                  <h3 className="font-bold text-[#F2F6FA] mb-1">{question}</h3>
                  <p>{answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Voir aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/btts/predictions/today" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
                <div className="text-sm font-bold text-[#F2F6FA]">Pronostics BTTS du jour →</div>
                <div className="text-xs text-[#9DABBB] mt-1">Pronostics du jour</div>
              </Link>
              <Link href="/historique" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
                <div className="text-sm font-bold text-[#F2F6FA]">Résultats vérifiés →</div>
                <div className="text-xs text-[#9DABBB] mt-1">Historique complet</div>
              </Link>
              <Link href="/resultats-verifies" className="block p-4 rounded-xl transition-all hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7DFF]" style={{ backgroundColor: '#141C25', border: '1px solid #223041' }}>
                <div className="text-sm font-bold text-[#F2F6FA]">Vérifications →</div>
                <div className="text-xs text-[#9DABBB] mt-1">Suivi public</div>
              </Link>
            </div>
          </section>

          <p className="text-xs text-[#9DABBB] text-center mt-8 leading-relaxed">
            18+ · BTTSPredict fournit des informations et ne prend pas de paris. Les paris sportifs comportent un risque de perte ; aucun gain ni résultat futur n’est garanti. Jouez de manière responsable.
          </p>
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
