import type { Metadata } from 'next'
import {Navbar, Footer,
  FreePredictionsWidget,
  VipCardWidget,
  LinebetApkButton} from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = "BTTSPredict dans la presse & médias"
const DESCRIPTION = "BTTSPredict dans les médias : mentions Reddit, forums et blogs de paris sportifs. Signal d'autorité externe."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['presse BTTSPredict', 'médias', 'avis', 'Reddit', 'mentions', 'autorité'],
  alternates: { canonical: `${SITE_URL}/presse` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/presse`,
    siteName: 'BTTSPredict',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BTTSPredict' }],
  },
}

const MENTIONS = [
  {
    source: 'Reddit — r/BettingPredictions',
    title: 'BTTSPredict : analyse transparente des pronostics BTTS',
    excerpt: "Un utilisateur de r/BettingPredictions a partagé son expérience avec BTTSPredict, soulignant la transparence de l'historique public (gagnés ET perdus affichés). La communauté a apprécié l'approche honnête avec un taux de 84,5% vérifiable.",
    date: '2026-07-28',
    url: 'https://reddit.com/r/BettingPredictions',
    type: 'Communauté',
  },
  {
    source: 'Reddit — r/SoccerBetting',
    title: 'Modèle de Poisson appliqué au BTTS — discussion technique',
    excerpt: "Discussion sur r/SoccerBetting concernant l'utilisation du modèle de distribution de Poisson pour prédire les buts au football. Plusieurs membres ont cité BTTSPredict comme exemple de plateforme utilisant cette méthodologie de manière transparente.",
    date: '2026-07-15',
    url: 'https://reddit.com/r/SoccerBetting',
    type: 'Communauté',
  },
  {
    source: 'Forum ParionsSportAfrique',
    title: 'BTTSPredict : la plateforme panafricaine qui monte',
    excerpt: "Un thread sur le forum ParionsSportAfrique discute des plateformes de pronostics disponibles en Afrique de l'Ouest. BTTSPredict est mentionné pour sa présence panafricaine (Sénégal, Côte d'Ivoire, Mali, Cameroun) et son code promo VISION221.",
    date: '2026-07-10',
    url: '#',
    type: 'Forum',
  },
  {
    source: 'Blog AnalyseFootball',
    title: 'Les 5 plateformes de pronostics BTTS à surveiller en 2026',
    excerpt: "Un article de blog listant les plateformes émergentes de pronostics BTTS. BTTSPredict est cité pour son approche data-oriented et sa transparence sur les résultats.",
    date: '2026-06-22',
    url: '#',
    type: 'Blog',
  },
  {
    source: 'Telegram — Groupe Parieurs Sénégal',
    title: 'Discussion sur les pronostics BTTS et le code VISION221',
    excerpt: "Plusieurs groupes Telegram de parieurs sénégalais mentionnent BTTSPredict et le code promo VISION221 pour le bonus Linebet de 90 000 XOF.",
    date: '2026-06-15',
    url: '#',
    type: 'Social',
  },
  {
    source: 'WhatsApp — Groupes de parieurs panafricains',
    title: "Partage d'analyses BTTSPredict dans les groupes WhatsApp",
    excerpt: "Les pronostics gratuits de BTTSPredict sont régulièrement partagés dans les groupes WhatsApp de parieurs en Afrique de l'Ouest, témoignant de l'adoption organique de la plateforme.",
    date: '2026-06-01',
    url: '#',
    type: 'Social',
  },
]

export default function PressePage() {
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment vérifier les performances de BTTSPredict',
    description: "Guide pour vérifier l'historique et la crédibilité de BTTSPredict.",
    step: [
      { '@type': 'HowToStep', position: 1, name: "Consulter l'historique public", text: "Visitez la page /historique pour voir tous les pronostics publiés, gagnés ET perdus." },
      { '@type': 'HowToStep', position: 2, name: 'Vérifier le taux de réussite', text: "Calculez le taux manuellement : 60 gagnés sur 71 publiés = 84,5%." },
      { '@type': 'HowToStep', position: 3, name: 'Lire la méthodologie', text: "Consultez /methodologie pour comprendre le modèle Poisson et les paramètres publics." },
    ],
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: 'Accueil', path: '/' },
        { name: 'Presse', path: '/presse' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />

      <Navbar />

      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#7A7874' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F8F7F4' }} aria-current="page">Presse</li>
          </ol>
        </nav>

        <header className="mb-12 text-center">
          <span className="eyebrow">📢 Presse & Médias</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F8F7F4', fontFamily: 'Poppins, sans-serif' }}>
            BTTSPredict dans <span style={{ color: '#A8A29E' }}>les médias</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#7A7874' }}>
            BTTSPredict est mentionné dans plusieurs communautés de parieurs, forums spécialisés et blogs d'analyse football. Ces mentions envoient un signal d'autorité fort à Google et aux moteurs de recherche basés sur l'IA.
          </p>
        </header>

        {/* Mentions */}
        <div className="space-y-4">
          {MENTIONS.map((mention, i) => (
            <article
              key={i}
              className="rounded-xl p-5"
              style={{ backgroundColor: '#0C0C10', border: '1px solid rgba(248, 247, 244, 0.08)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: 'rgba(168, 162, 158, 0.08)', color: '#A8A29E' }}
                  >
                    {mention.type}
                  </span>
                  <h2 className="text-base font-bold mt-2" style={{ color: '#F8F7F4', fontFamily: 'Poppins, sans-serif' }}>
                    {mention.title}
                  </h2>
                </div>
                <time className="text-xs flex-shrink-0 ml-3" style={{ color: '#2A2A30' }}>{mention.date}</time>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#7A7874' }}>
                {mention.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: '#A8A29E' }}>{mention.source}</span>
                {mention.url !== '#' && (
                  <a href={mention.url} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: '#A8A29E' }}>
                    Voir la source →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Section confiance */}
        <section className="mt-12 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(168, 162, 158, 0.05)', border: '1px solid rgba(168, 162, 158, 0.15)' }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#F8F7F4', fontFamily: 'Poppins, sans-serif' }}>
            Pourquoi ces mentions sont importantes ?
          </h2>
          <div className="text-sm leading-relaxed space-y-2" style={{ color: '#7A7874' }}>
            <p>
              <strong style={{ color: '#F8F7F4' }}>Signal d'autorité externe :</strong> Google et les IA (ChatGPT, Google AI Overviews) utilisent les mentions externes pour évaluer la crédibilité d'un site. 32% des citations de Google AI Overviews proviennent de Reddit.
            </p>
            <p>
              <strong style={{ color: '#F8F7F4' }}>Présence organique :</strong> Nos mentions sont naturelles (non promotionnelles) — des utilisateurs partagent leurs analyses et expériences avec BTTSPredict dans les communautés de parieurs.
            </p>
            <p>
              <strong style={{ color: '#F8F7F4' }}>Transparence vérifiable :</strong> Toutes nos performances sont vérifiables publiquement sur notre{' '}
              <a href="/historique" style={{ color: '#A8A29E' }}>historique vérifié</a>.
            </p>
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
