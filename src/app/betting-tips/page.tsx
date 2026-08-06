import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import { buildOrganizationJsonLd, buildBreadcrumbJsonLd, buildArticleJsonLd, SITE_URL } from '@/lib/seoSchemas'

const TITLE = 'Betting Tips Football'
const DESCRIPTION = 'Betting tips football par BTTSPredict. BTTS, Over 2.5, value bets FIFA. Méthodologie Poisson, gestion de bankroll, stratégie. 84,5% vérifié.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['betting tips', 'conseils paris sportifs', 'football betting tips', 'paris football conseils', 'betting strategy'],
  alternates: { canonical: `${SITE_URL}/betting-tips` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/betting-tips`, siteName: 'BTTSPredict', type: 'article' },
}

const FAQ = [
  { q: "Quels sont les meilleurs betting tips football ?", a: "Les meilleurs betting tips football sont basés sur l'analyse de données : Expected Goals (xG), forme récente, blessures, historique des confrontations. BTTSPredict fournit des pronostics BTTS et Over 2.5 avec un taux de réussite vérifié de 84,5%." },
  { q: "Comment gérer sa bankroll pour les paris sportifs ?", a: "La règle d'or est de ne jamais miser plus de 1-5% de votre bankroll sur un seul pari. Consultez notre guide complet sur la <a href='/blog/gestion-bankroll-paris-sportifs'>gestion de bankroll</a> pour une stratégie détaillée." },
  { q: "Quels marchés de paris sont les plus rentables ?", a: "Les marchés BTTS et Over 2.5 sont parmi les plus prévisibles car ils dépendent du nombre de buts, pas du résultat. Notre modèle Poisson performe particulièrement bien sur ces marchés." },
  { q: "Faut-il suivre tous les pronostics ?", a: "Non. Utilisez les pronostics comme outil d'aide à la décision. Croisez avec votre propre analyse. Ne pariez que les sommes que vous pouvez vous permettre de perdre." },
  { q: "Le code promo VISION221 fonctionne-t-il pour les paris ?", a: "Le code VISION221 offre un bonus de 90 000 XOF sur Linebet et 888starz. Il s'agit d'un bonus bookmaker, pas d'une garantie de gain. Jouez de manière responsable (18+)." },
]

export default function BettingTipsPage() {
  const articleJsonLd = buildArticleJsonLd({ title: TITLE, description: DESCRIPTION, path: '/betting-tips', datePublished: '2026-08-06', dateModified: '2026-08-06' })

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([{ name: 'Accueil', path: '/' }, { name: 'Betting Tips', path: '/betting-tips' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />

      <Navbar />
      <main className="flex-1 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm" style={{ color: '#A8B3C2' }}>
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: '#F0F2F5' }} aria-current="page">Betting Tips</li>
          </ol>
        </nav>

        <header className="mb-12 text-center">
          <span className="eyebrow">💡 Conseils Paris</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>
            Betting <span style={{ color: '#00C49A' }}>Tips</span>
          </h1>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: '#A8B3C2' }}>
            Conseils et stratégies de paris sportifs football. BTTS, Over 2.5, value bets FIFA, gestion de bankroll. Méthodologie documentée, 84,5% vérifié.
          </p>
        </header>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: '#161B22', border: '1px solid rgba(240, 242, 245, 0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>Stratégies de paris football</h2>
          <div className="text-sm leading-relaxed space-y-3" style={{ color: '#A8B3C2' }}>
            <p><strong style={{ color: '#F0F2F5' }}>1. BTTS (Both Teams To Score) :</strong> Pari sur le fait que les deux équipes marquent. Notre modèle Poisson identifie les matchs où les deux équipes ont un xG élevé. Seuil de recommandation : 0.48.</p>
            <p><strong style={{ color: '#F0F2F5' }}>2. Over 2.5 Goals :</strong> Pari sur 3+ buts dans le match. Idéal pour les championnats offensifs (Bundesliga, Eredivisie). Seuil : 0.49.</p>
            <p><strong style={{ color: '#F0F2F5' }}>3. Value Bets FIFA :</strong> Détection des cotes sous-évaluées sur les matchs FIFA virtuels. Risque élevé, cotes élevées (10-15).</p>
            <p><strong style={{ color: '#F0F2F5' }}>4. Gestion de bankroll :</strong> Ne jamais miser plus de 1-5% de votre capital sur un pari. Consultez notre <a href="/blog/gestion-bankroll-paris-sportifs" style={{ color: '#00C49A' }}>guide complet</a>.</p>
            <p>Pour voir nos pronostics du jour, consultez notre <a href="/" style={{ color: '#00C49A' }}>page d'accueil</a> ou nos <a href="/blog" style={{ color: '#00C49A' }}>analyses détaillées</a>.</p>
          </div>
        </section>

        <section className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.15)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#F0F2F5' }}>Résumé</h2>
          <p className="text-sm" style={{ color: '#A8B3C2' }}>
            BTTSPredict fournit des betting tips football basés sur un modèle de Poisson calibré sur 50 000 matchs. Taux de réussite vérifié 84,5%. Aucun résultat garanti. Consultez notre <a href="/methodologie" style={{ color: '#00C49A' }}>méthodologie</a> et notre <a href="/historique" style={{ color: '#00C49A' }}>historique vérifié</a>. 18+ — Jeu responsable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F0F2F5', fontFamily: 'Poppins, sans-serif' }}>FAQ Betting Tips</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <details key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#161B22', border: '1px solid rgba(240, 242, 245, 0.08)' }}>
                <summary className="p-4 cursor-pointer text-sm font-semibold" style={{ color: '#F0F2F5' }}>{item.q}</summary>
                <p className="px-4 pb-4 text-xs leading-relaxed" style={{ color: '#A8B3C2' }} dangerouslySetInnerHTML={{ __html: item.a }} />
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
