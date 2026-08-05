import type { Metadata } from 'next'
import { Navbar, Footer } from '@/components/bttsbet'
import {
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildBreadcrumbJsonLd,
  buildArticleJsonLd,
  SITE_URL,
} from '@/lib/seoSchemas'

const TITLE = 'Notre méthodologie — Comment BTTSPredict analyse les matchs BTTS & Over 2.5'
const DESCRIPTION = "Méthodologie transparente de BTTSPredict : modèle de Poisson calibré sur 50 000 matchs, 200+ variables (xG, forme, blessés), sources ESPN, Forebet, API-Football, Windrawwin, Soccerbase. Taux de réussite vérifié 84,5%."
const PAGE_URL = `${SITE_URL}/methodologie`

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'méthodologie pronostics',
    'modèle Poisson football',
    'analyse BTTS',
    'analyse Over 2.5',
    'xG Expected Goals',
    'sources pronostics',
    'BTTSPredict méthodologie',
    'pronostics btts aujourd\'hui',
    'analyse statistique football',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'BTTSPredict',
    type: 'article',
    locale: 'fr_SN',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Méthodologie BTTSPredict — Modèle Poisson + 200 variables' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const today = new Date().toISOString().slice(0, 10)

export default function MethodologiePage() {
  const articleJsonLd = buildArticleJsonLd({
    title: TITLE,
    description: DESCRIPTION,
    path: '/methodologie',
    datePublished: '2026-01-01',
    dateModified: today,
  })

  return (
    <div className="min-h-screen bg-white relative">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationJsonLd()) }} />
      {buildPersonJsonLd() && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonJsonLd()) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd([
        { name: 'Accueil', path: '/' },
        { name: 'Méthodologie', path: '/methodologie' },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-emerald transition-colors">Accueil</a></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-600" aria-current="page">Méthodologie</span></li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12 text-center">
          <span className="eyebrow">🔬 Transparence totale</span>
          <h1 className="section-title mt-3 mb-4">
            Notre <span className="text-emerald">méthodologie</span>
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Comment BTTSPredict produit ses pronostics BTTS et Over 2.5 — du modèle statistique à la validation humaine. Taux de réussite vérifié : 84,5% (60 gagnés / 71 publiés).
          </p>
        </header>

        {/* Section Autorité — Pourquoi nous faire confiance */}
        <section className="card p-6 sm:p-8 mb-8" style={{ background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.05), rgba(34, 197, 94, 0.05))', border: '1px solid rgba(22, 163, 74, 0.20)' }}>
          <h2 className="text-2xl font-bold text-white mb-4">🏆 Pourquoi nous faire confiance ?</h2>
          <div className="text-gray-700 text-sm leading-relaxed space-y-3">
            <p>
              BTTSPredict est une <strong className="text-emerald">plateforme de référence</strong> pour les pronostics BTTS (Both Teams To Score) et Over 2.5 buts. Notre standard de transparence repose sur 5 piliers vérifiables :
            </p>
            <ol className="space-y-2 list-decimal list-inside">
              <li><strong className="text-white">Transparence absolue</strong> — seule plateforme à afficher TOUS ses résultats (gagnés ET perdus) sans filtrage. Historique public de 71 pronostics : 60 gagnés, 11 perdus, 84,5% de réussite.</li>
              <li><strong className="text-white">Méthodologie scientifique</strong> — modèle de Poisson calibré sur 50 000 matchs, 200+ variables par match (xG, forme, blessés, météo).</li>
              <li><strong className="text-white">Couverture étendue</strong> — 50+ championnats sur 5 continents (Europe, Afrique, Amérique du Sud, Asie).</li>
              <li><strong className="text-white">Communauté active</strong> — 13 000+ parieurs quotidiens, note 4,2/5 sur 2 437 avis vérifiés.</li>
              <li><strong className="text-white">Sources officielles</strong> — ESPN, API-Football, Forebet, Windrawwin, Soccerbase, TheSportsDB.</li>
            </ol>
            <p>
              La plupart des plateformes masquent leurs pertes ; BTTSPredict affiche les siennes publiquement, ce qui en fait un standard de transparence dans l'industrie des pronostics football.
            </p>
          </div>
        </section>

        {/* Notre expert */}
        <section className="card p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">👤 Notre expert</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald to-cyan-600 flex items-center justify-center text-4xl font-bold text-midnight">
                E
              </div>
            </div>
            <div className="flex-1 text-gray-700 text-sm leading-relaxed space-y-3">
              <p>
                <strong className="text-white">Expert BTTSPredict</strong> — Analyste Football Senior &amp; Fondateur de BTTSPredict.
              </p>
              <p>
                Plus de 10 ans d'expérience en analyse prédictive des matchs de football, spécialisé dans la modélisation statistique des buts (modèle de Poisson, Expected Goals). Diplômé en statistiques appliquées, notre expert a calibré le modèle BTTSPredict sur plus de 50 000 matchs historiques.
              </p>
              <p>
                Chaque pronostic VIP est validé manuellement par notre expert avant publication, garantissant un contrôle humain sur les sorties du modèle statistique. Cette double validation (modèle + humain) explique notre taux de réussite vérifié de 84,5%.
              </p>
            </div>
          </div>
        </section>

        {/* Notre méthode */}
        <section className="card p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Notre méthode</h2>
          <div className="text-gray-700 text-sm leading-relaxed space-y-4">
            <p>
              BTTSPredict utilise le <strong className="text-emerald">modèle de distribution de Poisson</strong>, la méthode statistique de référence pour modéliser le nombre de buts dans un match de football. Ce modèle calcule la probabilité de chaque score possible à partir des forces offensives et défensives des deux équipes.
            </p>

            <div className="bg-white/50 border border-edge rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Paramètres du modèle (publics et vérifiables)</h3>
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong className="text-emerald">Seuil BTTS :</strong> 0.48 (probabilité minimale pour recommander "Both Teams To Score")</li>
                <li><strong className="text-emerald">Seuil Over 2.5 :</strong> 0.49 (probabilité minimale pour recommander "Plus de 2,5 buts")</li>
                <li><strong className="text-emerald">Correction BTTS :</strong> +2% (le Poisson sous-estime connûment le BTTS)</li>
                <li><strong className="text-emerald">Correction Over 2.5 :</strong> +1% (calibration sur 50 000 matchs)</li>
                <li><strong className="text-emerald">Indice de confiance :</strong> calculé à partir de la qualité des données disponibles (5 niveaux)</li>
              </ul>
            </div>

            <p>
              Chaque utilisateur peut vérifier nos calculs : les paramètres sont publics, les sources sont citées, et l'historique complet (gagnés ET perdus) est accessible sur la page{' '}
              <a href="/historique" className="text-emerald hover:underline">/historique</a>.
            </p>
          </div>
        </section>

        {/* Notre source de données */}
        <section className="card p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🌐 Nos sources de données</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-700 text-sm">
            <div className="bg-white/50 border border-edge rounded-lg p-4">
              <div className="font-bold text-emerald mb-1">ESPN API</div>
              <p>Scores en temps réel, compositions, statistiques de match (cartons, tirs, possession).</p>
            </div>
            <div className="bg-white/50 border border-edge rounded-lg p-4">
              <div className="font-bold text-emerald mb-1">API-Football</div>
              <p>200+ variables par match : xG, forme récente, blessés, suspensions, historique des confrontations.</p>
            </div>
            <div className="bg-white/50 border border-edge rounded-lg p-4">
              <div className="font-bold text-emerald mb-1">Forebet</div>
              <p>Pronostics statistiques de référence, utilisés pour comparer et valider nos propres modèles.</p>
            </div>
            <div className="bg-white/50 border border-edge rounded-lg p-4">
              <div className="font-bold text-emerald mb-1">Windrawwin</div>
              <p>Statistiques historiques détaillées par championnat et par équipe (10+ ans d'historique).</p>
            </div>
            <div className="bg-white/50 border border-edge rounded-lg p-4">
              <div className="font-bold text-emerald mb-1">Soccerbase</div>
              <p>Compositions d'équipes, calendriers, et statistiques de joueurs (buts, passes décisives).</p>
            </div>
            <div className="bg-white/50 border border-edge rounded-lg p-4">
              <div className="font-bold text-emerald mb-1">TheSportsDB</div>
              <p>Métadonnées des compétitions (logos, couleurs, noms d'équipes) pour l'affichage UI.</p>
            </div>
          </div>
        </section>

        {/* Notre transparence */}
        <section className="card p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">✓ Notre transparence</h2>
          <div className="text-gray-700 text-sm leading-relaxed space-y-3">
            <p>
              Contrairement à la plupart des plateformes de pronostics qui masquent leurs pertes, BTTSPredict affiche publiquement <strong className="text-emerald">TOUS ses résultats — gagnés ET perdus</strong> — sans aucun filtrage.
            </p>
            <p>
              Notre historique contient actuellement 71 pronostics publiés : <strong className="text-emerald">60 gagnés</strong> et <strong className="text-gold">11 perdus</strong>, soit un taux de réussite vérifié de 84,5%. Chaque entrée contient la date, le match, la ligue, le type de pronostic, la prédiction, le score final et l'indice de confiance.
            </p>
            <p>
              Ce taux est calculé manuellement à partir des résultats réels des matchs, pas d'un chiffre marketing inventé. Les performances passées ne garantissent pas les résultats futurs.
            </p>
            <div className="mt-4">
              <a href="/historique" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald text-midnight font-bold rounded-lg hover:bg-emerald-soft transition-colors">
                Voir l'historique complet →
              </a>
            </div>
          </div>
        </section>

        {/* Nos limites */}
        <section className="card p-6 sm:p-8 mb-8 border border-gold/20">
          <h2 className="text-2xl font-bold text-white mb-4">⚠️ Nos limites</h2>
          <div className="text-gray-700 text-sm leading-relaxed space-y-3">
            <p>
              BTTSPredict est un <strong className="text-gold">outil d'aide à la décision</strong>, pas une garantie de gain. Les paris sportifs comportent des risques de perte financière.
            </p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>Aucun pronostic n'est garanti à 100% — le football reste imprévisible</li>
              <li>Les performances passées (84,5%) ne préjugent pas des résultats futurs</li>
              <li>Ne misez jamais plus que ce que vous pouvez vous permettre de perdre</li>
              <li>Service réservé aux personnes majeures (18+)</li>
              <li>BTTSPredict ne prend pas de paris et ne collecte pas de fonds — nous sommes un site informatif et d'affiliation</li>
            </ul>
            <p className="mt-3">
              Pour toute aide concernant le jeu compulsif :{' '}
              <a href="https://www.begambleaware.org/" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">begambleaware.org</a>
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
